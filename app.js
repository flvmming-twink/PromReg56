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
    const latitude = enterprise.latitude ?? city?.latitude;
    const longitude = enterprise.longitude ?? city?.longitude;
    if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) return null;
    return { enterprise, latitude, longitude };
  }

  const allPoints = data.enterprises.map(enterprisePoint).filter(Boolean);
  const mapBounds = {
    minLat: Math.min(...allPoints.map((item) => item.latitude)),
    maxLat: Math.max(...allPoints.map((item) => item.latitude)),
    minLon: Math.min(...allPoints.map((item) => item.longitude)),
    maxLon: Math.max(...allPoints.map((item) => item.longitude))
  };

  function pointPosition(point) {
    const x = ((point.longitude - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon || 1)) * 88 + 6;
    const y = ((mapBounds.maxLat - point.latitude) / (mapBounds.maxLat - mapBounds.minLat || 1)) * 84 + 8;
    const fallback = point.enterprise.latitude === null || point.enterprise.longitude === null;
    const jitterX = fallback ? Math.sin(point.enterprise.id * 7.13) * 1.8 : 0;
    const jitterY = fallback ? Math.cos(point.enterprise.id * 5.71) * 1.8 : 0;
    return {
      left: Math.max(2, Math.min(98, x + jitterX)),
      top: Math.max(2, Math.min(98, y + jitterY))
    };
  }

  function getMapEnterprises() {
    return allPoints.filter(({ enterprise }) => {
      const cityMatch = !state.mapCity || enterprise.city_id === Number(state.mapCity);
      const industryMatch = !state.mapIndustry || enterprise.industry_id === Number(state.mapIndustry);
      return cityMatch && industryMatch;
    });
  }

  function renderMap() {
    const container = byId("mapPoints");
    const points = getMapEnterprises();
    container.replaceChildren();
    byId("mapEmpty").hidden = points.length > 0;

    const fragment = document.createDocumentFragment();
    points
      .sort((a, b) => Number(a.enterprise.is_major_enterprise || a.enterprise.is_city_forming) - Number(b.enterprise.is_major_enterprise || b.enterprise.is_city_forming))
      .forEach((point) => {
        const button = document.createElement("button");
        const position = pointPosition(point);
        const major = point.enterprise.is_major_enterprise || point.enterprise.is_city_forming;
        button.type = "button";
        button.className = `map-point${major ? " is-major" : ""}${state.selectedEnterprise === point.enterprise.id ? " is-selected" : ""}`;
        button.style.left = `${position.left}%`;
        button.style.top = `${position.top}%`;
        button.dataset.label = `${enterpriseLabel(point.enterprise)} · ${cityName(point.enterprise.city_id)}`;
        button.dataset.enterpriseId = point.enterprise.id;
        button.setAttribute("aria-label", `Открыть ${enterpriseLabel(point.enterprise)}, ${cityName(point.enterprise.city_id)}`);
        button.addEventListener("click", () => openPassport(point.enterprise.id, button));
        fragment.append(button);
      });
    container.append(fragment);

    const parts = [];
    if (state.mapCity) parts.push(cityName(Number(state.mapCity)));
    if (state.mapIndustry) parts.push(industryName(Number(state.mapIndustry)));
    byId("mapStatus").textContent = parts.length
      ? `${points.length} объектов · ${parts.join(" · ")}`
      : `${points.length} объектов с координатами`;
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

  function focusReturnSelector(element) {
    if (!(element instanceof HTMLElement)) return null;
    if (element.id) return `#${element.id}`;

    const enterpriseId = element.dataset.enterpriseId || element.dataset.openEnterprise;
    if (!enterpriseId) return null;
    if (element.classList.contains("map-point")) {
      return `.map-point[data-enterprise-id="${enterpriseId}"]`;
    }
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

  function openPassport(enterpriseId, trigger) {
    const enterprise = enterprisesById.get(Number(enterpriseId));
    if (!enterprise) return;
    const city = citiesById.get(enterprise.city_id);
    const industry = industriesById.get(enterprise.industry_id);
    const metrics = [...(metricsByEnterprise.get(enterprise.id) ?? [])].sort((a, b) => b.year - a.year);
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

    const body = byId("passportBody");
    body.innerHTML = `
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

      <section class="passport-section">
        <h3>Показатели</h3>
        ${metrics.length ? `
          <div class="data-table-wrap">
            <table class="passport-metrics">
              <thead><tr><th>Год</th><th>Сотрудники</th><th>Выручка</th><th>Инвестиции</th></tr></thead>
              <tbody>
                ${metrics.map((item) => `
                  <tr>
                    <td>${item.year}</td>
                    <td>${item.employees === null ? "—" : numberFormat.format(item.employees)}</td>
                    <td>${item.revenue === null ? "—" : escapeHtml(formatMoney(item.revenue))}</td>
                    <td>${item.investments === null ? "—" : escapeHtml(formatMoney(item.investments))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : '<p class="passport-description">Показатели по годам в базе не указаны.</p>'}
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

    state.selectedEnterprise = enterprise.id;
    state.lastFocus = focusReturnSelector(trigger) || focusReturnSelector(document.activeElement);
    byId("passportCode").textContent = `Паспорт П-${String(enterprise.id).padStart(4, "0")}`;
    const passport = byId("passport");
    passport.hidden = false;
    passport.setAttribute("aria-hidden", "false");
    byId("passportScrim").hidden = false;
    document.body.classList.add("passport-open");
    setPassportBackgroundInert(true);
    requestAnimationFrame(() => {
      passport.classList.add("is-open");
      byId("passportClose").focus();
    });
    renderMap();
    renderEnterprises();
  }

  function closePassport() {
    const passport = byId("passport");
    passport.classList.remove("is-open");
    passport.setAttribute("aria-hidden", "true");
    byId("passportScrim").hidden = true;
    document.body.classList.remove("passport-open");
    setPassportBackgroundInert(false);
    state.selectedEnterprise = null;
    renderMap();
    renderEnterprises();
    window.setTimeout(() => {
      if (!passport.classList.contains("is-open")) passport.hidden = true;
    }, 430);
    const returnTarget = state.lastFocus ? document.querySelector(state.lastFocus) : null;
    returnTarget?.focus();
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
      button.innerHTML = `
        <span class="territory-id">Т-${String(city.id).padStart(2, "0")}</span>
        <strong>${escapeHtml(city.name)}</strong>
        <span><b class="territory-value">${enterprises.length}</b> предприятий</span>
        <span>${leadingIndustryId ? escapeHtml(industryName(leadingIndustryId)) : latest?.population ? `Население: ${numberFormat.format(latest.population)}` : "Отрасли не указаны"}</span>
        <span class="territory-open">Открыть реестр</span>
      `;
      button.addEventListener("click", () => {
        byId("enterpriseCity").value = String(city.id);
        byId("enterpriseSearch").value = "";
        state.enterprisePage = 1;
        renderEnterprises();
        showView("enterprises");
      });
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
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !byId("passport").hidden) closePassport();
      trapPassportFocus(event);
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".main-search")) byId("searchSuggestions").hidden = true;
    });
    window.addEventListener("hashchange", () => showView(location.hash.slice(1), { updateHash: false }));
  }

  function init() {
    root.classList.add("is-ready");
    initMetadata();
    initFilters();
    renderMap();
    renderOverviewTerritories();
    renderEnterprises();
    renderTerritories();
    renderIndustries();
    renderSources();
    bindEvents();
    showView(location.hash.slice(1) || "overview", { updateHash: false, scroll: false, focus: false });
  }

  init();
})();
