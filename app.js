(() => {
  "use strict";

  const data = window.PROMREGION_DATA;
  const root = document.documentElement;
  const byId = (id) => document.getElementById(id);
  const all = (selector, context = document) => [...context.querySelectorAll(selector)];
  const collator = new Intl.Collator("ru", { sensitivity: "base" });
  const numberFormat = new Intl.NumberFormat("ru-RU");
  const compactNumberFormat = new Intl.NumberFormat("ru-RU", {
    notation: "compact",
    maximumFractionDigits: 1
  });
  const dateFormat = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  if (!data) {
    document.body.innerHTML = '<main class="view"><h1>Не удалось загрузить данные</h1><p>Обновите страницу. Если ошибка повторится, проверьте файл data.js.</p></main>';
    return;
  }

  const state = {
    view: "overview",
    mapCity: "",
    mapIndustry: "",
    enterprisePage: 1,
    sourcePage: 1,
    selectedEnterprise: null,
    modalType: null,
    lastFocus: null
  };

  const PAGE_SIZE = 18;
  const SOURCE_PAGE_SIZE = 22;
  const citiesById = new Map(data.cities.map((item) => [item.id, item]));
  const industriesById = new Map(data.industries.map((item) => [item.id, item]));
  const sourcesById = new Map(data.data_sources.map((item) => [item.id, item]));
  const enterprisesById = new Map(data.enterprises.map((item) => [item.id, item]));

  const groupBy = (items, key) => {
    const result = new Map();
    items.forEach((item) => {
      const value = typeof key === "function" ? key(item) : item[key];
      if (!result.has(value)) result.set(value, []);
      result.get(value).push(item);
    });
    return result;
  };

  const metricsByEnterprise = groupBy(data.enterprise_metrics, "enterprise_id");
  const productsByEnterprise = groupBy(data.enterprise_products, "enterprise_id");
  const sourceLinksByEnterprise = groupBy(data.enterprise_sources, "enterprise_id");
  const projectsByEnterprise = groupBy(data.investment_projects, "enterprise_id");
  const territoryMetricsByCity = groupBy(data.territory_metrics, "city_id");
  const enterprisesByCity = groupBy(data.enterprises, "city_id");
  const enterprisesByIndustry = groupBy(data.enterprises, "industry_id");
  let enterpriseMap = null;
  let mapMarkersLayer = null;
  const mapMarkersByEnterprise = new Map();

  const sourceUsage = new Map(data.data_sources.map((item) => [item.id, new Set()]));
  data.enterprise_sources.forEach((item) => sourceUsage.get(item.source_id)?.add(item.enterprise_id));
  data.enterprise_metrics.forEach((item) => sourceUsage.get(item.source_id)?.add(item.enterprise_id));
  data.enterprise_products.forEach((item) => sourceUsage.get(item.source_id)?.add(item.enterprise_id));

  const normalize = (value) => String(value ?? "")
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .trim();

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const safeUrl = (value) => {
    if (!value) return null;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  };

  const formatDate = (value) => {
    if (!value) return "Не указана";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : dateFormat.format(date);
  };

  const formatNumber = (value, suffix = "") => {
    if (value === null || value === undefined || value === "") return "Нет данных";
    return `${numberFormat.format(value)}${suffix}`;
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "Нет данных";
    const absolute = Math.abs(value);
    if (absolute >= 1_000_000_000) {
      return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(value / 1_000_000_000)} млрд ₽`;
    }
    if (absolute >= 1_000_000) {
      return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(value / 1_000_000)} млн ₽`;
    }
    return `${numberFormat.format(value)} ₽`;
  };

  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") return "Не указано";
    return String(value);
  };

  const latestMetric = (enterpriseId) => {
    const items = metricsByEnterprise.get(enterpriseId) ?? [];
    return [...items].sort((a, b) => b.year - a.year)[0] ?? null;
  };

  const cityName = (cityId) => citiesById.get(cityId)?.name ?? "Территория не указана";
  const industryName = (industryId) => industriesById.get(industryId)?.name ?? "Отрасль не указана";
  const enterpriseLabel = (enterprise) => enterprise.short_name || enterprise.name;
  const statusKind = (status) => {
    const value = normalize(status);
    if (value.includes("действ")) return "active";
    if (value.includes("проект")) return "project";
    return "neutral";
  };

  const pluralize = (value, one, few, many) => {
    const number = Math.abs(Number(value));
    const last = number % 10;
    const lastTwo = number % 100;
    if (last === 1 && lastTwo !== 11) return one;
    if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
    return many;
  };

  const ENTERPRISE_METRIC_CATALOG = [
    { key: "employees", title: "Сотрудники", format: (value) => formatNumber(value, " чел.") },
    { key: "revenue", title: "Выручка", format: formatMoney },
    { key: "net_profit", title: "Чистая прибыль", format: formatMoney },
    { key: "average_salary", title: "Средняя зарплата", format: formatMoney },
    { key: "assets", title: "Активы", format: formatMoney },
    { key: "investments", title: "Инвестиции", format: formatMoney },
    { key: "taxes_paid", title: "Налоги", format: formatMoney },
    { key: "production_volume", title: "Объём производства", format: (value) => formatNumber(value) }
  ];

  function populateSelect(select, items, valueKey, labelKey) {
    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[valueKey];
      option.textContent = item[labelKey];
      fragment.append(option);
    });
    select.append(fragment);
  }

  function initMetadata() {
    byId("factEnterprises").textContent = data.enterprises.length;
    byId("factCities").textContent = data.cities.length;
    byId("factIndustries").textContent = data.industries.length;
    byId("factSources").textContent = data.data_sources.length;
    byId("factProjects").textContent = data.investment_projects.length;

    const accessDates = data.data_sources.map((item) => item.access_date).filter(Boolean).sort();
    const latestAccess = accessDates.at(-1);
    byId("databaseSummary").textContent = `${data.enterprises.length} предприятий · ${data.cities.length} территории`;
    byId("databaseDate").textContent = latestAccess
      ? `Источники проверены до ${formatDate(latestAccess)}`
      : "Дата проверки источников не указана";
    byId("sourceNote").textContent = latestAccess
      ? `База собрана из ${data.data_sources.length} открытых источников. Последняя указанная дата доступа — ${formatDate(latestAccess)}. Отсутствующие значения не подменяются демонстрационными цифрами.`
      : "Все сведения взяты из открытого SQL-дампа. Отсутствующие значения не подменяются демонстрационными цифрами.";
  }

  function initFilters() {
    const cities = [...data.cities].sort((a, b) => collator.compare(a.name, b.name));
    const industries = [...data.industries].sort((a, b) => collator.compare(a.name, b.name));

    ["mapCityFilter", "enterpriseCity"].forEach((id) => populateSelect(byId(id), cities, "id", "name"));
    ["mapIndustryFilter", "enterpriseIndustry"].forEach((id) => populateSelect(byId(id), industries, "id", "name"));

    const statuses = [...new Set(data.enterprises.map((item) => item.status).filter(Boolean))]
      .sort(collator.compare);
    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      byId("enterpriseStatus").append(option);
    });

    const sourceTypes = [...new Set(data.data_sources.map((item) => item.source_type).filter(Boolean))]
      .sort(collator.compare);
    sourceTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      byId("sourceType").append(option);
    });
  }

  function enterprisePoint(enterprise) {
    const city = citiesById.get(enterprise.city_id);
    const exact = enterprise.latitude !== null && enterprise.latitude !== undefined
      && enterprise.longitude !== null && enterprise.longitude !== undefined;
    let latitude = enterprise.latitude ?? city?.latitude;
    let longitude = enterprise.longitude ?? city?.longitude;
    if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) return null;
    if (!exact) {
      latitude += Math.sin(enterprise.id * 7.13) * 0.035;
      longitude += Math.cos(enterprise.id * 5.71) * 0.055;
    }
    return { enterprise, latitude, longitude, approximate: !exact };
  }

  const allPoints = data.enterprises.map(enterprisePoint).filter(Boolean);

  function getMapEnterprises() {
    return allPoints.filter(({ enterprise }) => {
      const cityMatch = !state.mapCity || enterprise.city_id === Number(state.mapCity);
      const industryMatch = !state.mapIndustry || enterprise.industry_id === Number(state.mapIndustry);
      return cityMatch && industryMatch;
    });
  }

  function mapPopupMarkup(point) {
    const { enterprise, approximate } = point;
    return `
      <div class="map-popup">
        <strong>${escapeHtml(enterpriseLabel(enterprise))}</strong>
        <span>${escapeHtml(cityName(enterprise.city_id))} · ${escapeHtml(industryName(enterprise.industry_id))}</span>
        <small>${approximate ? "Положение указано приблизительно" : "Координаты предприятия"}</small>
        <button class="map-popup-action" type="button" data-map-open-enterprise="${enterprise.id}">Открыть карточку</button>
      </div>
    `;
  }

  function initEnterpriseMap() {
    const container = byId("enterpriseMap");
    if (!window.L) {
      container.classList.add("map-unavailable");
      container.insertAdjacentHTML("beforeend", '<p class="map-load-error">Карта не загрузилась. Реестр и фильтры продолжают работать.</p>');
      byId("mapStatus").textContent = "Картографический слой недоступен";
      return;
    }

    enterpriseMap = window.L.map(container, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true
    }).setView([51.77, 56.47], 7);
    window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 4,
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(enterpriseMap);
    mapMarkersLayer = window.L.layerGroup().addTo(enterpriseMap);
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => enterpriseMap.invalidateSize({ animate: false })).observe(container);
    }
  }

  function markerStyle(enterprise, selected = false) {
    const major = enterprise.is_major_enterprise || enterprise.is_city_forming;
    return {
      radius: selected ? (major ? 10 : 8) : (major ? 8 : 6),
      color: selected ? "#151a1d" : "#ffffff",
      weight: selected ? 3 : 2,
      fillColor: major ? "#bd390e" : "#24469d",
      fillOpacity: 0.96
    };
  }

  function updateSelectedMapMarker() {
    mapMarkersByEnterprise.forEach((marker, enterpriseId) => {
      const enterprise = enterprisesById.get(enterpriseId);
      marker.setStyle(markerStyle(enterprise, state.selectedEnterprise === enterpriseId));
      if (state.selectedEnterprise === enterpriseId) marker.bringToFront();
    });
  }

  function renderMap(options = {}) {
    const points = getMapEnterprises();
    byId("mapEmpty").hidden = points.length > 0;

    if (mapMarkersLayer) {
      mapMarkersLayer.clearLayers();
      mapMarkersByEnterprise.clear();
      points.forEach((point) => {
        const marker = window.L.circleMarker(
          [point.latitude, point.longitude],
          markerStyle(point.enterprise, state.selectedEnterprise === point.enterprise.id)
        );
        marker.bindTooltip(`${enterpriseLabel(point.enterprise)} · ${cityName(point.enterprise.city_id)}`, {
          direction: "top",
          offset: [0, -8]
        });
        marker.bindPopup(mapPopupMarkup(point), { minWidth: 220, maxWidth: 280 });
        marker.addTo(mapMarkersLayer);
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.setAttribute("role", "button");
          markerElement.setAttribute("tabindex", "0");
          markerElement.setAttribute("aria-label", `Показать ${enterpriseLabel(point.enterprise)}, ${cityName(point.enterprise.city_id)}`);
          markerElement.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              marker.openPopup();
            }
          });
        }
        mapMarkersByEnterprise.set(point.enterprise.id, marker);
      });

      if (points.length && options.preserveView !== true) {
        const bounds = window.L.latLngBounds(points.map((point) => [point.latitude, point.longitude]));
        enterpriseMap.fitBounds(bounds, { padding: [28, 28], maxZoom: 10, animate: false });
      }
    }

    const parts = [];
    if (state.mapCity) parts.push(cityName(Number(state.mapCity)));
    if (state.mapIndustry) parts.push(industryName(Number(state.mapIndustry)));
    byId("mapStatus").textContent = parts.length
      ? `${points.length} объектов · ${parts.join(" · ")}`
      : `${points.length} объектов с координатами`;
  }

  function lineChartMarkup(points, options) {
    const values = points
      .filter((point) => point.value !== null && point.value !== undefined && Number.isFinite(Number(point.value)))
      .map((point) => ({ ...point, value: Number(point.value) }))
      .sort((a, b) => a.year - b.year);
    if (!values.length) {
      return '<div class="chart-empty"><strong>Нет годового ряда</strong><span>В базе нет значений для этого показателя.</span></div>';
    }

    const width = 700;
    const height = 238;
    const padding = { top: 20, right: 18, bottom: 42, left: 64 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const rawMin = Math.min(...values.map((point) => point.value));
    const rawMax = Math.max(...values.map((point) => point.value));
    let minimum = Math.min(0, rawMin);
    let maximum = Math.max(0, rawMax);
    if (minimum === maximum) maximum = minimum + 1;
    const range = maximum - minimum;
    const x = (index) => values.length === 1
      ? padding.left + plotWidth / 2
      : padding.left + (index / (values.length - 1)) * plotWidth;
    const y = (value) => padding.top + ((maximum - value) / range) * plotHeight;
    const baseline = y(Math.max(minimum, Math.min(0, maximum)));
    const coordinates = values.map((point, index) => ({ ...point, x: x(index), y: y(point.value) }));
    const linePath = coordinates.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
    const areaPath = `${linePath} L${coordinates.at(-1).x.toFixed(1)},${baseline.toFixed(1)} L${coordinates[0].x.toFixed(1)},${baseline.toFixed(1)} Z`;
    const formatValue = options.formatValue ?? ((value) => numberFormat.format(value));
    const formatAxis = options.formatAxis ?? ((value) => compactNumberFormat.format(value));
    const aria = `${options.title}: ${values.map((point) => `${point.year} — ${formatValue(point.value)}`).join(", ")}`;
    const tickCount = 4;
    const yTicks = Array.from({ length: tickCount + 1 }, (_, index) => maximum - (range * index / tickCount));

    return `
      <div class="line-chart">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(aria)}" preserveAspectRatio="xMidYMid meet">
          <g class="chart-grid-lines" aria-hidden="true">
            ${yTicks.map((tick) => `<line x1="${padding.left}" y1="${y(tick).toFixed(1)}" x2="${width - padding.right}" y2="${y(tick).toFixed(1)}"></line>`).join("")}
          </g>
          <g class="chart-axis-labels" aria-hidden="true">
            ${yTicks.map((tick) => `<text x="${padding.left - 10}" y="${(y(tick) + 4).toFixed(1)}" text-anchor="end">${escapeHtml(formatAxis(tick))}</text>`).join("")}
            ${coordinates.map((point) => `<text x="${point.x.toFixed(1)}" y="${height - 14}" text-anchor="middle">${point.year}</text>`).join("")}
          </g>
          <path class="chart-area" d="${areaPath}"></path>
          <path class="chart-line" d="${linePath}"></path>
          <g class="chart-points">
            ${coordinates.map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="5"><title>${point.year}: ${escapeHtml(formatValue(point.value))}</title></circle>`).join("")}
          </g>
        </svg>
        <ol class="chart-value-row" aria-hidden="true">
          ${values.map((point) => `<li><span>${point.year}</span><strong>${escapeHtml(formatValue(point.value))}</strong></li>`).join("")}
        </ol>
      </div>
    `;
  }

  function aggregateEnterpriseMetric(metricKey) {
    const totals = new Map();
    data.enterprise_metrics.forEach((metric) => {
      const value = metric[metricKey];
      if (value === null || value === undefined) return;
      const year = Number(metric.year);
      const current = totals.get(year) ?? { year, value: 0, coverage: 0 };
      current.value += Number(value);
      current.coverage += 1;
      totals.set(year, current);
    });
    return [...totals.values()].sort((a, b) => a.year - b.year);
  }

  function renderOverviewAnalytics() {
    const revenue = aggregateEnterpriseMetric("revenue");
    const employees = aggregateEnterpriseMetric("employees");
    byId("overviewRevenueChart").innerHTML = lineChartMarkup(revenue, {
      title: "Суммарная выручка по доступным отчётам",
      formatValue: formatMoney
    });
    byId("overviewEmployeesChart").innerHTML = lineChartMarkup(employees, {
      title: "Суммарная численность сотрудников по доступным отчётам",
      formatValue: (value) => formatNumber(value, " чел.")
    });
    const revenueLatest = revenue.at(-1);
    const employeesLatest = employees.at(-1);
    byId("overviewRevenueMeta").textContent = revenueLatest
      ? `${revenueLatest.year}: отчёты ${revenueLatest.coverage} предприятий`
      : "Годовых данных нет";
    byId("overviewEmployeesMeta").textContent = employeesLatest
      ? `${employeesLatest.year}: данные ${employeesLatest.coverage} предприятий`
      : "Годовых данных нет";

    const industries = data.industries
      .map((industry) => ({ industry, count: enterprisesByIndustry.get(industry.id)?.length ?? 0 }))
      .sort((a, b) => b.count - a.count);
    const maximum = Math.max(...industries.map((item) => item.count), 1);
    byId("overviewIndustryChart").innerHTML = industries.map(({ industry, count }) => `
      <button class="bar-ledger-row" type="button" data-dashboard-industry="${industry.id}" aria-label="Показать предприятия отрасли ${escapeHtml(industry.name)}">
        <span>${escapeHtml(industry.name)}</span>
        <i aria-hidden="true"><b style="width:${(count / maximum) * 100}%"></b></i>
        <strong>${count}</strong>
      </button>
    `).join("");
  }

  function renderOverviewTerritories() {
    const container = byId("overviewTerritories");
    const sorted = [...data.cities].sort((a, b) => {
      const countDifference = (enterprisesByCity.get(b.id)?.length ?? 0) - (enterprisesByCity.get(a.id)?.length ?? 0);
      return countDifference || collator.compare(a.name, b.name);
    });

    container.replaceChildren();
    const fragment = document.createDocumentFragment();
    sorted.forEach((city) => {
      const count = enterprisesByCity.get(city.id)?.length ?? 0;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `index-row${state.mapCity === String(city.id) ? " is-active" : ""}`;
      button.innerHTML = `
        <span class="index-code">Т-${String(city.id).padStart(2, "0")}</span>
        <span class="index-name">${escapeHtml(city.name)}</span>
        <span class="index-count">${count}</span>
      `;
      button.addEventListener("click", () => {
        state.mapCity = state.mapCity === String(city.id) ? "" : String(city.id);
        byId("mapCityFilter").value = state.mapCity;
        renderMap();
        renderOverviewTerritories();
      });
      fragment.append(button);
    });
    container.append(fragment);
  }

  function showView(name, options = {}) {
    const validName = ["overview", "enterprises", "territories", "industries", "sources"].includes(name)
      ? name
      : "overview";
    state.view = validName;

    all("[data-view-panel]").forEach((panel) => {
      const active = panel.dataset.viewPanel === validName;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    all("[data-view]").forEach((button) => {
      const active = button.dataset.view === validName;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    if (options.updateHash !== false) {
      history.replaceState(null, "", `#${validName}`);
    }
    if (options.scroll !== false) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    if (options.focus !== false) {
      byId(`view-${validName}`)?.focus({ preventScroll: true });
    }
    if (validName === "overview" && enterpriseMap) {
      window.setTimeout(() => enterpriseMap.invalidateSize({ animate: false }), 0);
    }
  }

  function searchEnterpriseMatches(query, limit = Infinity) {
    const needle = normalize(query);
    if (!needle) return [...data.enterprises].slice(0, limit);
    return data.enterprises.filter((enterprise) => {
      const city = cityName(enterprise.city_id);
      const industry = industryName(enterprise.industry_id);
      const products = productsByEnterprise.get(enterprise.id)?.map((item) => item.product_name).join(" ") ?? "";
      const haystack = normalize([
        enterprise.name,
        enterprise.short_name,
        enterprise.inn,
        enterprise.ogrn,
        enterprise.activity_description,
        enterprise.products,
        products,
        city,
        industry
      ].join(" "));
      return haystack.includes(needle);
    }).slice(0, limit);
  }

  function renderSuggestions() {
    const query = byId("mainSearch").value;
    const container = byId("searchSuggestions");
    if (normalize(query).length < 2) {
      container.hidden = true;
      container.replaceChildren();
      return;
    }

    const matches = searchEnterpriseMatches(query, 6);
    container.replaceChildren();
    if (!matches.length) {
      container.hidden = true;
      return;
    }

    matches.forEach((enterprise) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-suggestion";
      button.setAttribute("role", "option");
      button.innerHTML = `
        <strong>${escapeHtml(enterpriseLabel(enterprise))}</strong>
        <span>${escapeHtml(cityName(enterprise.city_id))}</span>
      `;
      button.addEventListener("click", () => {
        container.hidden = true;
        byId("mainSearch").value = enterpriseLabel(enterprise);
        openPassport(enterprise.id, byId("mainSearch"));
      });
      container.append(button);
    });
    container.hidden = false;
  }

  function getFilteredEnterprises() {
    const query = byId("enterpriseSearch").value;
    const city = byId("enterpriseCity").value;
    const industry = byId("enterpriseIndustry").value;
    const status = byId("enterpriseStatus").value;
    const sort = byId("enterpriseSort").value;

    const filtered = searchEnterpriseMatches(query).filter((enterprise) => {
      if (city && enterprise.city_id !== Number(city)) return false;
      if (industry && enterprise.industry_id !== Number(industry)) return false;
      if (status && enterprise.status !== status) return false;
      return true;
    });

    filtered.sort((a, b) => {
      if (sort === "city") return collator.compare(cityName(a.city_id), cityName(b.city_id)) || collator.compare(a.name, b.name);
      if (sort === "industry") return collator.compare(industryName(a.industry_id), industryName(b.industry_id)) || collator.compare(a.name, b.name);
      if (sort === "revenue") {
        const revenueA = latestMetric(a.id)?.revenue ?? -Infinity;
        const revenueB = latestMetric(b.id)?.revenue ?? -Infinity;
        return revenueB - revenueA || collator.compare(a.name, b.name);
      }
      return collator.compare(a.name, b.name);
    });

    return filtered;
  }

  function renderPagination(container, currentPage, totalPages, onChange) {
    container.replaceChildren();
    if (totalPages <= 1) return;

    const pages = [];
    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2) pages.push(page);
    }

    const addButton = (label, page, current = false, disabled = false) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.disabled = disabled;
      if (current) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => onChange(page));
      container.append(button);
    };

    addButton("Назад", Math.max(1, currentPage - 1), false, currentPage === 1);
    let previous = 0;
    pages.forEach((page) => {
      if (page - previous > 1) {
        const separator = document.createElement("span");
        separator.textContent = "…";
        separator.setAttribute("aria-hidden", "true");
        container.append(separator);
      }
      addButton(String(page), page, page === currentPage);
      previous = page;
    });
    addButton("Далее", Math.min(totalPages, currentPage + 1), false, currentPage === totalPages);
  }

  function renderEnterprises() {
    const filtered = getFilteredEnterprises();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    state.enterprisePage = Math.min(state.enterprisePage, totalPages);
    const start = (state.enterprisePage - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);
    const body = byId("enterpriseRows");
    body.replaceChildren();

    pageItems.forEach((enterprise) => {
      const metric = latestMetric(enterprise.id);
      const row = document.createElement("tr");
      if (state.selectedEnterprise === enterprise.id) row.classList.add("is-selected");
      row.innerHTML = `
        <td>
          <button class="enterprise-name-button" type="button" data-open-enterprise="${enterprise.id}">
            ${escapeHtml(enterpriseLabel(enterprise))}
            <span class="table-note">${enterprise.inn ? `ИНН ${escapeHtml(enterprise.inn)}` : "ИНН не указан"}</span>
          </button>
        </td>
        <td>${escapeHtml(cityName(enterprise.city_id))}</td>
        <td>${escapeHtml(industryName(enterprise.industry_id))}</td>
        <td><span class="status-label" data-status="${statusKind(enterprise.status)}">${escapeHtml(displayValue(enterprise.status))}</span></td>
        <td class="numeric">${metric?.revenue !== null && metric?.revenue !== undefined ? escapeHtml(formatMoney(metric.revenue)) : "—"}${metric ? `<span class="table-note">${metric.year}</span>` : ""}</td>
        <td>
          <button class="row-action" type="button" data-open-enterprise="${enterprise.id}" aria-label="Открыть паспорт ${escapeHtml(enterpriseLabel(enterprise))}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>
          </button>
        </td>
      `;
      body.append(row);
    });

    all("[data-open-enterprise]", body).forEach((button) => {
      button.addEventListener("click", () => openPassport(Number(button.dataset.openEnterprise), button));
    });

    const from = filtered.length ? start + 1 : 0;
    const to = Math.min(start + PAGE_SIZE, filtered.length);
    byId("enterpriseResultCount").textContent = filtered.length
      ? `Найдено: ${filtered.length}. Показаны записи ${from}–${to}.`
      : "По выбранным условиям ничего не найдено.";
    byId("enterpriseEmpty").hidden = filtered.length > 0;
    byId("enterpriseRows").closest("table").hidden = filtered.length === 0;

    renderPagination(byId("enterprisePagination"), state.enterprisePage, totalPages, (page) => {
      state.enterprisePage = page;
      renderEnterprises();
      byId("enterpriseResultCount").scrollIntoView({ block: "start" });
    });
  }

  function getEnterpriseSourceIds(enterpriseId) {
    return new Set([
      ...(sourceLinksByEnterprise.get(enterpriseId) ?? []).map((item) => item.source_id),
      ...(metricsByEnterprise.get(enterpriseId) ?? []).map((item) => item.source_id),
      ...(productsByEnterprise.get(enterpriseId) ?? []).map((item) => item.source_id)
    ].filter(Boolean));
  }

  function fieldMarkup(label, value, html = false) {
    return `<div class="passport-field"><dt>${escapeHtml(label)}</dt><dd>${html ? value : escapeHtml(displayValue(value))}</dd></div>`;
  }

  function metricChartsMarkup(metrics, catalog) {
    const charts = catalog.map((metric) => {
      const points = metrics
        .filter((item) => item[metric.key] !== null && item[metric.key] !== undefined)
        .map((item) => ({ year: item.year, value: item[metric.key] }));
      if (!points.length) return "";
      const periodLabel = points.length === 1
        ? "1 год в базе"
        : `${points.length} ${points.length < 5 ? "года" : "лет"} в базе`;
      return `
        <article class="metric-chart-panel">
          <header><div><h4>${escapeHtml(metric.title)}</h4><p>${periodLabel}</p></div></header>
          ${lineChartMarkup(points, {
            title: metric.title,
            formatValue: metric.format,
            formatAxis: metric.axisFormat
          })}
        </article>
      `;
    }).filter(Boolean);
    return charts.length
      ? `<div class="metric-chart-grid">${charts.join("")}</div>`
      : '<div class="chart-empty"><strong>Нет годовых показателей</strong><span>Для этой записи в базе пока нет числового ряда.</span></div>';
  }

  function enterpriseMetricTableMarkup(metrics) {
    const activeMetrics = ENTERPRISE_METRIC_CATALOG.filter((metric) => metrics.some((item) => item[metric.key] !== null && item[metric.key] !== undefined));
    if (!metrics.length || !activeMetrics.length) return "";
    return `
      <details class="metric-table-details">
        <summary>Все значения по годам</summary>
        <div class="data-table-wrap">
          <table class="passport-metrics">
            <thead><tr><th>Год</th>${activeMetrics.map((metric) => `<th>${escapeHtml(metric.title)}</th>`).join("")}</tr></thead>
            <tbody>
              ${[...metrics].sort((a, b) => b.year - a.year).map((item) => `
                <tr>
                  <td>${item.year}</td>
                  ${activeMetrics.map((metric) => `<td>${item[metric.key] === null || item[metric.key] === undefined ? "—" : escapeHtml(metric.format(item[metric.key]))}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </details>
    `;
  }

  function focusReturnSelector(element) {
    if (!(element instanceof HTMLElement)) return null;
    if (element.id) return `#${element.id}`;

    const mapEnterpriseId = element.dataset.mapOpenEnterprise;
    if (mapEnterpriseId) return `.map-popup-action[data-map-open-enterprise="${mapEnterpriseId}"]`;
    const cityId = element.dataset.cityId;
    if (cityId) return `.territory-row[data-city-id="${cityId}"]`;
    const enterpriseId = element.dataset.openEnterprise;
    if (!enterpriseId) return null;
    if (element.classList.contains("enterprise-name-button")) {
      return `.enterprise-name-button[data-open-enterprise="${enterpriseId}"]`;
    }
    if (element.classList.contains("row-action")) {
      return `.row-action[data-open-enterprise="${enterpriseId}"]`;
    }
    return null;
  }

  function setPassportBackgroundInert(isInert) {
    const passport = byId("passport");
    const scrim = byId("passportScrim");
    [...document.body.children]
      .filter((element) => element !== passport && element !== scrim)
      .forEach((element) => {
        element.inert = isInert;
      });
  }

  function trapPassportFocus(event) {
    const passport = byId("passport");
    if (event.key !== "Tab" || passport.hidden) return;

    const focusable = all(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      passport
    ).filter((element) => !element.hidden && element.offsetParent !== null);

    if (!focusable.length) {
      event.preventDefault();
      passport.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const focusIsInside = passport.contains(document.activeElement);

    if (event.shiftKey && (!focusIsInside || document.activeElement === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (!focusIsInside || document.activeElement === last)) {
      event.preventDefault();
      first.focus();
    }
  }

  function showPassportWindow({ code, html, trigger, type, enterpriseId = null }) {
    state.selectedEnterprise = enterpriseId;
    state.modalType = type;
    state.lastFocus = focusReturnSelector(trigger) || focusReturnSelector(document.activeElement);
    byId("passportCode").textContent = code;
    byId("passportBody").innerHTML = html;

    const passport = byId("passport");
    passport.hidden = false;
    passport.scrollTop = 0;
    passport.setAttribute("aria-hidden", "false");
    byId("passportScrim").hidden = false;
    document.body.classList.add("passport-open");
    setPassportBackgroundInert(true);
    requestAnimationFrame(() => {
      passport.classList.add("is-open");
      byId("passportClose").focus();
    });
    updateSelectedMapMarker();
    renderEnterprises();
  }

  function openPassport(enterpriseId, trigger) {
    const enterprise = enterprisesById.get(Number(enterpriseId));
    if (!enterprise) return;
    const city = citiesById.get(enterprise.city_id);
    const industry = industriesById.get(enterprise.industry_id);
    const metrics = [...(metricsByEnterprise.get(enterprise.id) ?? [])].sort((a, b) => a.year - b.year);
    const products = productsByEnterprise.get(enterprise.id) ?? [];
    const projects = projectsByEnterprise.get(enterprise.id) ?? [];
    const sourceIds = getEnterpriseSourceIds(enterprise.id);
    const sources = [...sourceIds].map((id) => sourcesById.get(id)).filter(Boolean);

    const website = safeUrl(enterprise.website);
    const websiteMarkup = website
      ? `<a href="${escapeHtml(website)}" target="_blank" rel="noreferrer">${escapeHtml(enterprise.website)}</a>`
      : escapeHtml(displayValue(enterprise.website));
    const phoneMarkup = enterprise.phone
      ? `<a href="tel:${escapeHtml(enterprise.phone.replace(/[^+\d]/g, ""))}">${escapeHtml(enterprise.phone)}</a>`
      : "Не указано";
    const emailMarkup = enterprise.email
      ? `<a href="mailto:${escapeHtml(enterprise.email)}">${escapeHtml(enterprise.email)}</a>`
      : "Не указано";

    const html = `
      <h2 id="passportTitle">${escapeHtml(enterpriseLabel(enterprise))}</h2>
      <p class="passport-subtitle">${escapeHtml(industry?.name ?? "Отрасль не указана")} · ${escapeHtml(city?.name ?? "Территория не указана")}</p>

      <dl class="passport-fields">
        ${fieldMarkup("Статус", enterprise.status)}
        ${fieldMarkup("Территория", city?.name)}
        ${fieldMarkup("Отрасль", industry?.name)}
        ${fieldMarkup("Год основания", enterprise.foundation_year)}
        ${fieldMarkup("ИНН", enterprise.inn)}
        ${fieldMarkup("ОГРН", enterprise.ogrn)}
        ${fieldMarkup("ОКВЭД", enterprise.okved)}
        ${fieldMarkup("Роль в экономике", enterprise.economic_role)}
        ${fieldMarkup("Адрес", enterprise.address)}
        ${fieldMarkup("Сайт", websiteMarkup, true)}
        ${fieldMarkup("Телефон", phoneMarkup, true)}
        ${fieldMarkup("Email", emailMarkup, true)}
      </dl>

      <section class="passport-section">
        <h3>О предприятии</h3>
        <p class="passport-description">${escapeHtml(displayValue(enterprise.activity_description))}</p>
      </section>

      <section class="passport-section">
        <h3>Продукция</h3>
        ${products.length ? `
          <ul class="passport-list">
            ${products.map((item) => `<li><strong>${escapeHtml(item.product_name)}</strong><span>${escapeHtml(item.product_category || item.description || "Категория не указана")}</span></li>`).join("")}
          </ul>
        ` : `<p class="passport-description">${escapeHtml(displayValue(enterprise.products))}</p>`}
      </section>

      <section class="passport-section passport-section-analytics">
        <div class="passport-section-heading">
          <h3>Показатели по годам</h3>
          <p>Только опубликованные значения; пропуски не достраиваются.</p>
        </div>
        ${metricChartsMarkup(metrics, ENTERPRISE_METRIC_CATALOG)}
        ${enterpriseMetricTableMarkup(metrics)}
      </section>

      ${projects.length ? `
        <section class="passport-section">
          <h3>Инвестиционные проекты</h3>
          <ul class="passport-list">
            ${projects.map((item) => `<li><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.status?.trim() || "Статус не указан")} · ${escapeHtml(formatMoney(item.investment_amount))}</span></li>`).join("")}
          </ul>
        </section>
      ` : ""}

      <section class="passport-section">
        <h3>Источники</h3>
        ${sources.length ? `
          <ul class="passport-list">
            ${sources.map((source) => {
              const url = safeUrl(source.url);
              const title = url
                ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}</a>`
                : escapeHtml(source.name);
              return `<li><strong>${title}</strong><span>${escapeHtml(source.source_type || "Тип не указан")} · доступ ${escapeHtml(formatDate(source.access_date))}</span></li>`;
            }).join("")}
          </ul>
        ` : '<p class="passport-description">Связанные источники не указаны.</p>'}
      </section>
    `;
    showPassportWindow({
      code: `Паспорт П-${String(enterprise.id).padStart(4, "0")}`,
      html,
      trigger,
      type: "enterprise",
      enterpriseId: enterprise.id
    });
  }

  function openTerritoryPassport(cityId, trigger) {
    const city = citiesById.get(Number(cityId));
    if (!city) return;
    const enterprises = enterprisesByCity.get(city.id) ?? [];
    const metrics = [...(territoryMetricsByCity.get(city.id) ?? [])].sort((a, b) => a.year - b.year);
    const latestPopulation = metrics.filter((item) => item.population !== null && item.population !== undefined).at(-1);
    const latestUnemployment = metrics.filter((item) => item.unemployment_rate !== null && item.unemployment_rate !== undefined).at(-1);
    const sourceIds = [...new Set(metrics.map((item) => item.source_id).filter(Boolean))];
    const sources = sourceIds.map((id) => sourcesById.get(id)).filter(Boolean);
    const territoryCatalog = [
      { key: "population", title: "Численность населения", format: (value) => formatNumber(value, " чел.") },
      {
        key: "unemployment_rate",
        title: "Уровень безработицы",
        format: (value) => `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value)}%`,
        axisFormat: (value) => `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(value)}%`
      }
    ];
    const html = `
      <h2 id="passportTitle">${escapeHtml(city.name)}</h2>
      <p class="passport-subtitle">${escapeHtml(city.territory_type || "Территория")} · Оренбургская область</p>
      <dl class="passport-fields">
        ${fieldMarkup("Тип территории", city.territory_type)}
        ${fieldMarkup("Район", city.district)}
        ${fieldMarkup("ОКТМО", city.oktmo)}
        ${fieldMarkup("Административный центр", city.administrative_center)}
        ${fieldMarkup("Предприятия в реестре", enterprises.length)}
        ${fieldMarkup("Последняя численность", latestPopulation ? `${numberFormat.format(latestPopulation.population)} · ${latestPopulation.year}` : null)}
        ${fieldMarkup("Последняя безработица", latestUnemployment ? `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(latestUnemployment.unemployment_rate)}% · ${latestUnemployment.year}` : null)}
        ${fieldMarkup("Координаты", city.latitude !== null && city.longitude !== null ? `${city.latitude}, ${city.longitude}` : null)}
      </dl>
      <section class="passport-section passport-section-analytics">
        <div class="passport-section-heading">
          <h3>Показатели территории по годам</h3>
          <p>Безработица отображается только там, где значение есть в исходной базе.</p>
        </div>
        <div class="metric-chart-grid">
          ${territoryCatalog.map((metric) => {
            const points = metrics
              .filter((item) => item[metric.key] !== null && item[metric.key] !== undefined)
              .map((item) => ({ year: item.year, value: item[metric.key] }));
            return `
              <article class="metric-chart-panel">
                <header><div><h4>${escapeHtml(metric.title)}</h4><p>${points.length ? `${points.length} значений в базе` : "Нет опубликованных значений"}</p></div></header>
                ${lineChartMarkup(points, { title: metric.title, formatValue: metric.format, formatAxis: metric.axisFormat })}
              </article>
            `;
          }).join("")}
        </div>
      </section>
      <section class="passport-section territory-actions">
        <button class="secondary-action" type="button" data-show-city-enterprises="${city.id}">Открыть предприятия территории</button>
      </section>
      <section class="passport-section">
        <h3>Источники показателей</h3>
        ${sources.length ? `
          <ul class="passport-list">
            ${sources.map((source) => {
              const url = safeUrl(source.url);
              const title = url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}</a>` : escapeHtml(source.name);
              return `<li><strong>${title}</strong><span>${escapeHtml(source.source_type || "Тип не указан")} · доступ ${escapeHtml(formatDate(source.access_date))}</span></li>`;
            }).join("")}
          </ul>
        ` : '<p class="passport-description">Источники годовых показателей не указаны.</p>'}
      </section>
    `;
    showPassportWindow({
      code: `Паспорт Т-${String(city.id).padStart(2, "0")}`,
      html,
      trigger,
      type: "territory"
    });
  }

  function closePassport(options = {}) {
    const passport = byId("passport");
    passport.classList.remove("is-open");
    passport.setAttribute("aria-hidden", "true");
    byId("passportScrim").hidden = true;
    document.body.classList.remove("passport-open");
    setPassportBackgroundInert(false);
    state.selectedEnterprise = null;
    state.modalType = null;
    updateSelectedMapMarker();
    renderEnterprises();
    window.setTimeout(() => {
      if (!passport.classList.contains("is-open")) passport.hidden = true;
    }, 260);
    if (options.restoreFocus !== false) {
      const returnTarget = state.lastFocus ? document.querySelector(state.lastFocus) : null;
      returnTarget?.focus();
    }
    state.lastFocus = null;
  }

  function renderTerritories() {
    const query = normalize(byId("territorySearch").value);
    const container = byId("territoryRows");
    const items = [...data.cities]
      .filter((city) => !query || normalize(city.name).includes(query))
      .sort((a, b) => {
        const countDiff = (enterprisesByCity.get(b.id)?.length ?? 0) - (enterprisesByCity.get(a.id)?.length ?? 0);
        return countDiff || collator.compare(a.name, b.name);
      });

    container.replaceChildren();
    items.forEach((city) => {
      const enterprises = enterprisesByCity.get(city.id) ?? [];
      const metrics = [...(territoryMetricsByCity.get(city.id) ?? [])].sort((a, b) => b.year - a.year);
      const latest = metrics[0];
      const industryCounts = new Map();
      enterprises.forEach((enterprise) => industryCounts.set(enterprise.industry_id, (industryCounts.get(enterprise.industry_id) ?? 0) + 1));
      const leadingIndustryId = [...industryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "territory-row";
      button.dataset.cityId = city.id;
      button.innerHTML = `
        <span class="territory-id">Т-${String(city.id).padStart(2, "0")}</span>
        <strong>${escapeHtml(city.name)}</strong>
        <span><b class="territory-value">${enterprises.length}</b> ${pluralize(enterprises.length, "предприятие", "предприятия", "предприятий")}</span>
        <span>${leadingIndustryId ? escapeHtml(industryName(leadingIndustryId)) : latest?.population ? `Население: ${numberFormat.format(latest.population)}` : "Отрасли не указаны"}</span>
        <span class="territory-open">Смотреть показатели</span>
      `;
      button.addEventListener("click", () => openTerritoryPassport(city.id, button));
      container.append(button);
    });
    byId("territoryEmpty").hidden = items.length > 0;
  }

  function renderIndustries() {
    const container = byId("industryRows");
    const counts = data.industries.map((industry) => ({
      industry,
      enterprises: enterprisesByIndustry.get(industry.id) ?? []
    })).sort((a, b) => b.enterprises.length - a.enterprises.length);
    const max = Math.max(...counts.map((item) => item.enterprises.length), 1);

    container.replaceChildren();
    counts.forEach(({ industry, enterprises }) => {
      const cities = groupBy(enterprises, "city_id");
      const topCityId = [...cities.entries()].sort((a, b) => b[1].length - a[1].length)[0]?.[0];
      const row = document.createElement("button");
      row.type = "button";
      row.className = "industry-row";
      row.innerHTML = `
        <div class="industry-title">
          <strong>${escapeHtml(industry.name)}</strong>
          <span>${enterprises.length}</span>
        </div>
        <p class="industry-description">${escapeHtml(displayValue(industry.description))}</p>
        <div class="industry-measure">
          <span>${topCityId ? `Больше всего: ${escapeHtml(cityName(topCityId))}` : "Территории не указаны"}</span>
          <span>${Math.round((enterprises.length / data.enterprises.length) * 100)}%</span>
          <div class="measure-track" aria-hidden="true"><div class="measure-fill" style="width:${(enterprises.length / max) * 100}%"></div></div>
        </div>
      `;
      row.setAttribute("aria-label", `Показать предприятия отрасли: ${industry.name}`);
      row.addEventListener("click", () => {
        byId("enterpriseIndustry").value = String(industry.id);
        byId("enterpriseSearch").value = "";
        state.enterprisePage = 1;
        renderEnterprises();
        showView("enterprises");
      });
      container.append(row);
    });
  }

  function getFilteredSources() {
    const query = normalize(byId("sourceSearch").value);
    const type = byId("sourceType").value;
    return data.data_sources.filter((source) => {
      if (type && source.source_type !== type) return false;
      if (!query) return true;
      return normalize([source.name, source.description, source.url].join(" ")).includes(query);
    }).sort((a, b) => collator.compare(a.name, b.name));
  }

  function renderSources() {
    const filtered = getFilteredSources();
    const totalPages = Math.max(1, Math.ceil(filtered.length / SOURCE_PAGE_SIZE));
    state.sourcePage = Math.min(state.sourcePage, totalPages);
    const start = (state.sourcePage - 1) * SOURCE_PAGE_SIZE;
    const pageItems = filtered.slice(start, start + SOURCE_PAGE_SIZE);
    const container = byId("sourceRows");
    container.replaceChildren();

    pageItems.forEach((source) => {
      const usage = sourceUsage.get(source.id)?.size ?? 0;
      const url = safeUrl(source.url);
      const row = document.createElement("article");
      row.className = "source-row";
      row.innerHTML = `
        <div>
          <h3>${escapeHtml(source.name)}</h3>
          <p>${escapeHtml(source.description || "Описание не указано")}</p>
        </div>
        <div>
          <span>${escapeHtml(source.source_type || "Тип не указан")}</span>
          <span>Связано с предприятиями: ${usage}</span>
        </div>
        <time datetime="${escapeHtml(source.access_date || "")}">${escapeHtml(formatDate(source.access_date))}</time>
        ${url ? `
          <a class="source-link" href="${escapeHtml(url)}" target="_blank" rel="noreferrer" aria-label="Открыть источник: ${escapeHtml(source.name)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M19 13v7H4V5h7"/></svg>
          </a>
        ` : '<span></span>'}
      `;
      container.append(row);
    });

    const from = filtered.length ? start + 1 : 0;
    const to = Math.min(start + SOURCE_PAGE_SIZE, filtered.length);
    byId("sourceResultCount").textContent = filtered.length
      ? `Найдено: ${filtered.length}. Показаны источники ${from}–${to}.`
      : "По выбранным условиям источники не найдены.";
    byId("sourceEmpty").hidden = filtered.length > 0;
    renderPagination(byId("sourcePagination"), state.sourcePage, totalPages, (page) => {
      state.sourcePage = page;
      renderSources();
      byId("sourceResultCount").scrollIntoView({ block: "start" });
    });
  }

  function csvCell(value) {
    const text = String(value ?? "").replaceAll('"', '""');
    return `"${text}"`;
  }

  function exportEnterprises() {
    const rows = getFilteredEnterprises();
    const headers = ["Название", "Краткое название", "ИНН", "ОГРН", "Территория", "Отрасль", "Статус", "Сайт"];
    const lines = [
      headers.map(csvCell).join(";"),
      ...rows.map((enterprise) => [
        enterprise.name,
        enterprise.short_name,
        enterprise.inn,
        enterprise.ogrn,
        cityName(enterprise.city_id),
        industryName(enterprise.industry_id),
        enterprise.status,
        enterprise.website
      ].map(csvCell).join(";"))
    ];
    const blob = new Blob(["\ufeff", lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "promregion56-enterprises.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(`CSV подготовлен: ${rows.length} записей`);
  }

  let toastTimer = 0;
  function showToast(message) {
    const toast = byId("toast");
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 3400);
  }

  function resetEnterpriseFilters() {
    byId("enterpriseSearch").value = "";
    byId("enterpriseCity").value = "";
    byId("enterpriseIndustry").value = "";
    byId("enterpriseStatus").value = "";
    byId("enterpriseSort").value = "name";
    state.enterprisePage = 1;
    renderEnterprises();
  }

  function bindEvents() {
    all("[data-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
    all("[data-go-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.goView)));

    byId("mapCityFilter").addEventListener("change", (event) => {
      state.mapCity = event.target.value;
      renderMap();
      renderOverviewTerritories();
    });
    byId("mapIndustryFilter").addEventListener("change", (event) => {
      state.mapIndustry = event.target.value;
      renderMap();
    });

    byId("mainSearch").addEventListener("input", renderSuggestions);
    byId("mainSearch").addEventListener("keydown", (event) => {
      if (event.key === "Escape") byId("searchSuggestions").hidden = true;
    });
    byId("mainSearchForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const query = byId("mainSearch").value.trim();
      if (!query) {
        byId("mainSearch").focus();
        return;
      }
      const match = searchEnterpriseMatches(query, 1)[0];
      if (match) {
        byId("searchSuggestions").hidden = true;
        openPassport(match.id, byId("mainSearch"));
        return;
      }
      byId("enterpriseSearch").value = query;
      state.enterprisePage = 1;
      renderEnterprises();
      showView("enterprises");
    });

    ["enterpriseSearch", "enterpriseCity", "enterpriseIndustry", "enterpriseStatus", "enterpriseSort"].forEach((id) => {
      const element = byId(id);
      element.addEventListener(id === "enterpriseSearch" ? "input" : "change", () => {
        state.enterprisePage = 1;
        renderEnterprises();
      });
    });
    byId("enterpriseReset").addEventListener("click", resetEnterpriseFilters);
    byId("exportEnterprises").addEventListener("click", exportEnterprises);

    byId("territorySearch").addEventListener("input", renderTerritories);
    all("[data-dashboard-industry]").forEach((button) => {
      button.addEventListener("click", () => {
        byId("enterpriseIndustry").value = button.dataset.dashboardIndustry;
        byId("enterpriseSearch").value = "";
        state.enterprisePage = 1;
        renderEnterprises();
        showView("enterprises");
      });
    });

    ["sourceSearch", "sourceType"].forEach((id) => {
      const element = byId(id);
      element.addEventListener(id === "sourceSearch" ? "input" : "change", () => {
        state.sourcePage = 1;
        renderSources();
      });
    });
    byId("sourceReset").addEventListener("click", () => {
      byId("sourceSearch").value = "";
      byId("sourceType").value = "";
      state.sourcePage = 1;
      renderSources();
    });

    byId("passportClose").addEventListener("click", closePassport);
    byId("passportScrim").addEventListener("click", closePassport);
    byId("passportBody").addEventListener("click", (event) => {
      const cityButton = event.target.closest("[data-show-city-enterprises]");
      if (!cityButton) return;
      const cityId = cityButton.dataset.showCityEnterprises;
      closePassport({ restoreFocus: false });
      byId("enterpriseCity").value = cityId;
      byId("enterpriseSearch").value = "";
      state.enterprisePage = 1;
      renderEnterprises();
      showView("enterprises");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !byId("passport").hidden) closePassport();
      trapPassportFocus(event);
    });
    document.addEventListener("click", (event) => {
      const mapAction = event.target.closest("[data-map-open-enterprise]");
      if (mapAction) openPassport(Number(mapAction.dataset.mapOpenEnterprise), mapAction);
      if (!event.target.closest(".main-search")) byId("searchSuggestions").hidden = true;
    });
    window.addEventListener("hashchange", () => showView(location.hash.slice(1), { updateHash: false }));
  }

  function init() {
    root.classList.add("is-ready");
    initMetadata();
    initFilters();
    initEnterpriseMap();
    renderMap();
    renderOverviewTerritories();
    renderOverviewAnalytics();
    renderEnterprises();
    renderTerritories();
    renderIndustries();
    renderSources();
    bindEvents();
    showView(location.hash.slice(1) || "overview", { updateHash: false, scroll: false, focus: false });
  }

  init();
})();
