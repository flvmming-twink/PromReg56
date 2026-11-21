import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sqlPath = join(root, "database", "industrial_city_db.sql");
const outputPath = join(root, "data.js");
const sql = readFileSync(sqlPath, "utf8");
const schemaVersion = Math.max(
  1,
  ...[...sql.matchAll(/PromRegion56 v(\d+)/gi)].map((match) => Number(match[1]))
);

const numericColumns = new Set([
  "id",
  "city_id",
  "industry_id",
  "enterprise_id",
  "parent_enterprise_id",
  "source_id",
  "metric_value_id",
  "year",
  "period_year",
  "priority",
  "employees",
  "revenue",
  "investments",
  "average_salary",
  "net_profit",
  "assets",
  "taxes_paid",
  "production_volume",
  "value_numeric",
  "numeric_value",
  "latitude",
  "longitude",
  "foundation_year",
  "start_year",
  "end_year",
  "investment_amount",
  "jobs_created",
  "population",
  "unemployment_rate",
  "industrial_output",
  "employed_population",
  "enterprises_count",
  "industrial_enterprises_count",
  "verified_fact_rows",
  "official_municipal_rows",
  "source_count_new",
  "priority_order",
  "identity_source_id",
  "duplicate_candidate_id",
  "verified_values",
  "verified_revenue_years",
  "newest_verified_year"
]);

const booleanColumns = new Set([
  "is_main",
  "is_city_forming",
  "is_major_enterprise",
  "imported_legacy_verified"
]);

const insertedTableColumns = {
  _incoming_city_metrics: [
    "city_id",
    "year",
    "population",
    "average_salary",
    "unemployment_rate",
    "investments",
    "industrial_output",
    "source_id"
  ],
  dataset_releases: [
    "release_code",
    "release_date",
    "description",
    "verified_fact_rows",
    "official_municipal_rows",
    "source_count_new",
    "imported_legacy_verified"
  ]
};

function decodeCopyValue(value) {
  if (value === "\\N") return null;

  return value.replace(/\\([0-7]{1,3}|.)/g, (_, escaped) => {
    if (/^[0-7]{1,3}$/.test(escaped)) {
      return String.fromCharCode(Number.parseInt(escaped, 8));
    }

    return ({
      b: "\b",
      f: "\f",
      n: "\n",
      r: "\r",
      t: "\t",
      v: "\v",
      "\\": "\\"
    })[escaped] ?? escaped;
  });
}

function coerce(column, value) {
  if (value === null || value === undefined) return null;
  if (booleanColumns.has(column)) {
    return value === true || value === "t" || String(value).toLowerCase() === "true";
  }
  if (numericColumns.has(column) && value !== "") return Number(value);
  return value;
}

function splitSqlList(value) {
  const parts = [];
  let start = 0;
  let depth = 0;
  let quoted = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "'") {
      if (quoted && value[index + 1] === "'") {
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (quoted) continue;
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      parts.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }

  parts.push(value.slice(start).trim());
  return parts;
}

function parseSqlLiteral(token) {
  const value = token.trim();
  if (/^null$/i.test(value) || /^default$/i.test(value)) return null;
  if (/^true$/i.test(value)) return true;
  if (/^false$/i.test(value)) return false;
  if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) return Number(value);

  const quoted = value.match(/^(?:E)?'([\s\S]*)'$/i);
  if (quoted) return quoted[1].replace(/''/g, "'");

  return value;
}

function readTuple(text, startIndex) {
  let depth = 0;
  let quoted = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];
    if (char === "'") {
      if (quoted && text[index + 1] === "'") {
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (quoted) continue;
    if (char === "(") depth += 1;
    if (char === ")") {
      depth -= 1;
      if (depth === 0) {
        return { content: text.slice(startIndex + 1, index), endIndex: index + 1 };
      }
    }
  }

  throw new Error(`Unclosed VALUES tuple near character ${startIndex}`);
}

function parseValueInserts(text) {
  const inserts = [];
  const pattern = /INSERT\s+INTO\s+(?:public\.)?([a-z_][a-z0-9_]*)\s*(?:\(([^)]*)\))?\s*VALUES\b/gim;

  for (const match of text.matchAll(pattern)) {
    const table = match[1];
    const columns = match[2]
      ? match[2].split(",").map((column) => column.trim())
      : insertedTableColumns[table];
    if (!columns) continue;

    const rows = [];
    let cursor = match.index + match[0].length;
    while (cursor < text.length) {
      while (/\s/.test(text[cursor])) cursor += 1;
      if (text[cursor] !== "(") break;
      const tuple = readTuple(text, cursor);
      const values = splitSqlList(tuple.content).map(parseSqlLiteral);
      if (values.length !== columns.length) {
        throw new Error(`${table}: expected ${columns.length} values, got ${values.length}`);
      }
      rows.push(Object.fromEntries(columns.map((column, index) => [column, coerce(column, values[index])])));
      cursor = tuple.endIndex;
      while (/\s/.test(text[cursor])) cursor += 1;
      if (text[cursor] !== ",") break;
      cursor += 1;
    }
    inserts.push({ table, rows });
  }

  return inserts;
}

function parseTupleBlock(text, columns) {
  const rows = [];
  let cursor = 0;
  while (cursor < text.length) {
    const start = text.indexOf("(", cursor);
    if (start < 0) break;
    const tuple = readTuple(text, start);
    const values = splitSqlList(tuple.content).map(parseSqlLiteral);
    if (values.length !== columns.length) {
      throw new Error(`Tuple block: expected ${columns.length} values, got ${values.length}`);
    }
    rows.push(Object.fromEntries(columns.map((column, index) => [column, coerce(column, values[index])] )));
    cursor = tuple.endIndex;
  }
  return rows;
}

const data = {};
const copyBlock = /^COPY public\.([a-z_][a-z0-9_]*) \(([^)]+)\) FROM stdin;\r?\n([\s\S]*?)\r?\n\\\.$/gm;

for (const match of sql.matchAll(copyBlock)) {
  const [, table, columnList, rows] = match;
  const columns = columnList.split(", ");

  data[table] = rows.split(/\r?\n/).filter(Boolean).map((line) => {
    const values = line.split("\t").map(decodeCopyValue);
    return Object.fromEntries(columns.map((column, index) => [column, coerce(column, values[index])]));
  });
}

const insertedRows = new Map();
for (const insert of parseValueInserts(sql)) {
  if (!insertedRows.has(insert.table)) insertedRows.set(insert.table, []);
  insertedRows.get(insert.table).push(...insert.rows);
}

const baseTables = [
  "cities",
  "data_sources",
  "enterprise_metrics",
  "enterprise_products",
  "enterprise_sources",
  "enterprises",
  "industries",
  "investment_projects",
  "territory_metrics"
];

for (const table of baseTables) {
  if (!data[table] && insertedRows.has(table)) data[table] = insertedRows.get(table);
  if (!data[table] && new RegExp(`CREATE\\s+TABLE\\s+(?:public\\.)?${table}\\b`, "i").test(sql)) data[table] = [];
  if (!data[table]) throw new Error(`Table not found in SQL dump: ${table}`);
}

const cityMetadataPattern = /WITH\s+incoming\(id,region,district,latitude,longitude,territory_type,oktmo,administrative_center\)\s+AS\s*\(\s*VALUES\s*([\s\S]*?)\s*\)\s*UPDATE\s+public\.cities/gi;
for (const match of sql.matchAll(cityMetadataPattern)) {
  const incoming = parseTupleBlock(match[1], [
    "id",
    "region",
    "district",
    "latitude",
    "longitude",
    "territory_type",
    "oktmo",
    "administrative_center"
  ]);
  upsertBy(data.cities, incoming, (row) => row.id);
}

let nextTerritoryMetricId = Math.max(0, ...data.territory_metrics.map((row) => row.id)) + 1;
for (const incoming of insertedRows.get("_incoming_city_metrics") ?? []) {
  const existing = data.territory_metrics.find((row) => (
    row.city_id === incoming.city_id && row.year === incoming.year
  ));
  if (existing) {
    Object.assign(existing, incoming);
  } else {
    data.territory_metrics.push({ id: nextTerritoryMetricId, ...incoming });
    nextTerritoryMetricId += 1;
  }
}

function upsertBy(rows, incoming, key) {
  const index = new Map(rows.map((row, position) => [key(row), position]));
  incoming.forEach((row) => {
    const rowKey = key(row);
    if (index.has(rowKey)) {
      rows[index.get(rowKey)] = { ...rows[index.get(rowKey)], ...row };
    } else {
      index.set(rowKey, rows.length);
      rows.push(row);
    }
  });
  return rows;
}

function insertMissingBy(rows, incoming, key) {
  const keys = new Set(rows.map(key));
  incoming.forEach((row) => {
    const rowKey = key(row);
    if (keys.has(rowKey)) return;
    keys.add(rowKey);
    rows.push(row);
  });
  return rows;
}

upsertBy(data.data_sources, insertedRows.get("data_sources") ?? [], (row) => row.id);

for (const match of sql.matchAll(/UPDATE\s+public\.data_sources\s+SET\s+publication_date='([^']+)'\s+WHERE\s+id=(\d+);/gi)) {
  const source = data.data_sources.find((row) => row.id === Number(match[2]));
  if (source) source.publication_date = match[1];
}

for (const match of sql.matchAll(/UPDATE\s+public\.enterprises\s+SET\s+inn=COALESCE\(inn,([^)]+)\),\s*ogrn=COALESCE\(ogrn,([^)]+)\)\s+WHERE\s+id=(\d+);/gi)) {
  const enterprise = data.enterprises.find((row) => row.id === Number(match[3]));
  if (!enterprise) continue;
  if (enterprise.inn === null || enterprise.inn === undefined) enterprise.inn = parseSqlLiteral(match[1]);
  if (enterprise.ogrn === null || enterprise.ogrn === undefined) enterprise.ogrn = parseSqlLiteral(match[2]);
}

for (const match of sql.matchAll(/UPDATE\s+public\.enterprises\s+SET\s+inn='([^']+)'\s+WHERE\s+id=(\d+)\s+AND\s+inn\s+IS\s+NULL;/gi)) {
  const enterprise = data.enterprises.find((row) => row.id === Number(match[2]));
  if (enterprise && (enterprise.inn === null || enterprise.inn === undefined)) enterprise.inn = match[1];
}

for (const match of sql.matchAll(/UPDATE\s+public\.enterprises\s+SET\s+entity_type='([^']+)'\s+WHERE\s+id\s+IN\s*\(([^)]+)\)\s+AND\s+\(entity_type\s+IS\s+NULL\s+OR\s+entity_type='([^']+)'\);/gi)) {
  const ids = match[2].split(",").map((value) => Number(value.trim()));
  data.enterprises
    .filter((enterprise) => ids.includes(enterprise.id))
    .forEach((enterprise) => {
      if (enterprise.entity_type === null || enterprise.entity_type === undefined || enterprise.entity_type === match[3]) {
        enterprise.entity_type = match[1];
      }
    });
}

for (const match of sql.matchAll(/UPDATE\s+public\.enterprises\s+SET\s+status='([^']+)'\s+WHERE\s+id=(\d+)\s+AND\s+status='([^']+)';/gi)) {
  const enterprise = data.enterprises.find((row) => row.id === Number(match[2]));
  if (enterprise?.status === match[3]) enterprise.status = match[1];
}

if (sql.includes("Удаление дублирующей записи ООО «МЕТАЛЕКС» (id=43)")) {
  const duplicate = data.enterprises.find((row) => row.id === 43);
  const keeper = data.enterprises.find((row) => row.id === 5);
  const isConfirmedDuplicate = duplicate
    && keeper
    && (duplicate.inn === null || duplicate.inn === keeper.inn)
    && keeper.inn === "5607011852"
    && duplicate.city_id === keeper.city_id
    && duplicate.industry_id === keeper.industry_id
    && String(duplicate.name).toLocaleUpperCase("ru-RU").includes("МЕТАЛЕКС")
    && String(keeper.name).toLocaleUpperCase("ru-RU").includes("МЕТАЛЕКС");
  if (isConfirmedDuplicate) {
    data.enterprises = data.enterprises.filter((row) => row.id !== duplicate.id);
    data.enterprise_metrics = data.enterprise_metrics.filter((row) => row.enterprise_id !== duplicate.id);
    data.enterprise_products = data.enterprise_products.filter((row) => row.enterprise_id !== duplicate.id);
    data.enterprise_sources = data.enterprise_sources.filter((row) => row.enterprise_id !== duplicate.id);
  }
}

data.enterprise_research_status = schemaVersion >= 3
  ? data.enterprises.map((enterprise) => ({
      enterprise_id: enterprise.id,
      priority_order: enterprise.city_id === 1 ? 1 : 2,
      identification_status: "unreviewed",
      evidence_level: "legacy_only",
      identity_source_id: null,
      duplicate_candidate_id: null,
      review_note: enterprise.city_id === 1
        ? "Новотроицк: первоочередная ручная сверка юридического лица и отчетности"
        : "Остальная Оренбургская область: следующий этап; данные из v2 сохранены",
      reviewed_at: null,
      last_checked_at: null
    }))
  : [];

for (const match of sql.matchAll(/UPDATE\s+public\.enterprise_research_status\s+SET\s+([\s\S]*?)\s+WHERE\s+enterprise_id=(\d+);/gi)) {
  const status = data.enterprise_research_status.find((row) => row.enterprise_id === Number(match[2]));
  if (!status) continue;
  splitSqlList(match[1]).forEach((assignment) => {
    const parts = assignment.match(/^([a-z_]+)\s*=\s*([\s\S]+)$/i);
    if (!parts) return;
    status[parts[1]] = coerce(parts[1], parseSqlLiteral(parts[2]));
  });
}

data.v4_entity_identity = upsertBy([], insertedRows.get("v4_entity_identity") ?? [], (row) => row.enterprise_id);
data.v4_quality_issues = upsertBy(
  [],
  (insertedRows.get("v4_quality_issues") ?? []).map((row, index) => ({
    id: row.id ?? index + 1,
    review_status: row.review_status ?? "open",
    ...row
  })),
  (row) => `${row.enterprise_id}|${row.problem_code}`
);
data.v4_period_observations = upsertBy(
  [],
  (insertedRows.get("v4_period_observations") ?? []).map((row, index) => ({ id: row.id ?? index + 1, ...row })),
  (row) => `${row.city_id}|${row.period_from}|${row.period_to}|${row.metric_code}|${row.coverage_note}`
);
data.city_annual_indicators = upsertBy(
  [],
  insertedRows.get("city_annual_indicators") ?? [],
  (row) => `${row.city_id}|${row.year}|${row.metric_code}`
);
data.enterprise_metric_quality = upsertBy(
  [],
  insertedRows.get("enterprise_metric_quality") ?? [],
  (row) => `${row.enterprise_id}|${row.year}|${row.indicator}`
);

function normalizeCityIndicatorValue(row) {
  if (row.numeric_value === null || row.numeric_value === undefined) return null;
  const multipliers = {
    "млн руб.": 1_000_000,
    "млрд руб.": 1_000_000_000,
    "тыс. руб.": 1_000,
    "тыс. чел.": 1_000,
    "тыс. кв. м": 1_000
  };
  return Number(row.numeric_value) * (multipliers[row.unit] ?? 1);
}

const cityIndicatorTerritoryFields = {
  population: "population",
  average_salary: "average_salary",
  registered_unemployment: "unemployment_rate",
  investments: "investments",
  industrial_shipments: "industrial_output"
};
for (const indicator of data.city_annual_indicators) {
  const field = cityIndicatorTerritoryFields[indicator.metric_code];
  const value = normalizeCityIndicatorValue(indicator);
  if (!field || value === null) continue;
  const territoryMetric = data.territory_metrics.find((row) => (
    row.city_id === indicator.city_id && row.year === indicator.year
  ));
  if (territoryMetric) territoryMetric[field] = value;
}

const defaultMetricCatalog = [
  { code: "employees", scope: "enterprise", category: "Занятость", title: "Численность сотрудников", unit: "чел.", priority: 1 },
  { code: "cost_of_sales", scope: "enterprise", category: "Финансы", title: "Себестоимость продаж", unit: "руб.", priority: 2 },
  { code: "operating_profit", scope: "enterprise", category: "Финансы", title: "Прибыль от продаж", unit: "руб.", priority: 2 },
  { code: "profit_before_tax", scope: "enterprise", category: "Финансы", title: "Прибыль до налогообложения", unit: "руб.", priority: 2 },
  { code: "revenue", scope: "enterprise", category: "Финансы", title: "Выручка", unit: "руб.", priority: 1 },
  { code: "net_profit", scope: "enterprise", category: "Финансы", title: "Чистая прибыль", unit: "руб.", priority: 1 },
  { code: "assets", scope: "enterprise", category: "Финансы", title: "Активы", unit: "руб.", priority: 2 },
  { code: "investments", scope: "enterprise", category: "Инвестиции", title: "Инвестиции", unit: "руб.", priority: 2 },
  { code: "average_salary", scope: "enterprise", category: "Занятость", title: "Средняя заработная плата", unit: "руб./мес.", priority: 2 },
  { code: "taxes_paid", scope: "enterprise", category: "Финансы", title: "Уплаченные налоги", unit: "руб.", priority: 3 },
  { code: "production_volume", scope: "enterprise", category: "Производство", title: "Объём производства", unit: "руб.", priority: 3 },
  { code: "population", scope: "territory", category: "Демография", title: "Численность населения", unit: "чел.", priority: 1 },
  { code: "average_salary_territory", scope: "territory", category: "Доходы", title: "Среднемесячная заработная плата", unit: "руб./мес.", priority: 1 },
  { code: "unemployment_rate", scope: "territory", category: "Рынок труда", title: "Уровень безработицы", unit: "%", priority: 1 },
  { code: "investments_territory", scope: "territory", category: "Инвестиции", title: "Инвестиции в основной капитал", unit: "руб.", priority: 2 },
  { code: "industrial_output", scope: "territory", category: "Промышленность", title: "Промышленная отгрузка", unit: "руб.", priority: 2 },
  { code: "employed_population", scope: "territory", category: "Рынок труда", title: "Занятое население", unit: "чел.", priority: 3 },
  { code: "enterprises_count", scope: "territory", category: "Экономика", title: "Количество предприятий", unit: "ед.", priority: 3 },
  { code: "industrial_enterprises_count", scope: "territory", category: "Промышленность", title: "Промышленные предприятия", unit: "ед.", priority: 3 }
];
data.metric_catalog = insertMissingBy(
  [...defaultMetricCatalog],
  insertedRows.get("metric_catalog") ?? [],
  (row) => row.code
);
data.data_quality_issues = upsertBy([], insertedRows.get("data_quality_issues") ?? [], (row) => row.issue_key);
data.dataset_releases = upsertBy([], insertedRows.get("dataset_releases") ?? [], (row) => row.release_code);
data.enterprise_product_output = insertedRows.get("enterprise_product_output") ?? [];

if (!data.dataset_releases.length && data.cities.length === 3 && data.enterprise_metric_quality.length) {
  const releaseDate = data.data_sources.map((row) => row.access_date).filter(Boolean).sort().at(-1) ?? "2026-11-21";
  data.dataset_releases.push({
    release_code: `three-cities-${releaseDate}`,
    release_date: releaseDate,
    description: "Отфильтрованный набор Новотроицка, Орска и Оренбурга за 2021–2025 годы.",
    verified_fact_rows: 0,
    official_municipal_rows: data.city_annual_indicators.length,
    source_count_new: data.data_sources.length,
    imported_legacy_verified: false
  });
}

const inferredReleaseDefinitions = [
  {
    version: 3,
    firstSourceId: 1101,
    lastSourceId: 2199,
    description: "Полный пакет v3: расширение проверенных показателей Новотроицка, стартовый набор Орска и муниципальная статистика Новотроицка."
  },
  {
    version: 4,
    firstSourceId: 2201,
    lastSourceId: 2999,
    description: "Полный пакет v4: финансовые ряды предприятий Орска и Оренбурга, идентификация карточек, предупреждения качества и показатели с точным периодом наблюдения."
  },
  {
    version: 5,
    firstSourceId: 362,
    lastSourceId: 369,
    description: "Карточки Новотроицка, Орска и Оренбурга за 2021–2025 годы: 140 детальных муниципальных показателей, методы расчёта и отметки сопоставимости."
  }
];

for (const definition of inferredReleaseDefinitions.filter((item) => item.version <= schemaVersion)) {
  if (data.dataset_releases.some((row) => String(row.release_code).startsWith(`v${definition.version}-`))) continue;
  const releaseSources = data.data_sources.filter((row) => (
    row.id >= definition.firstSourceId && row.id <= definition.lastSourceId
  ));
  const releaseDate = releaseSources.map((row) => row.access_date).filter(Boolean).sort().at(-1);
  if (!releaseDate) continue;
  data.dataset_releases.push({
    release_code: `v${definition.version}-${releaseDate}`,
    release_date: releaseDate,
    description: definition.description,
    verified_fact_rows: 0,
    official_municipal_rows: 0,
    source_count_new: releaseSources.length,
    imported_legacy_verified: true
  });
}

let nextMetricValueId = 1;
let metricOrder = 0;
const metricValues = [];

function metricValueKey(row) {
  const entity = row.enterprise_id !== null && row.enterprise_id !== undefined
    ? `e:${row.enterprise_id}`
    : `c:${row.city_id}`;
  return `${entity}|${row.metric_code}|${row.period_year}|${row.reporting_scope}`;
}

function addMetricValue(row, replace = false) {
  const normalized = {
    id: row.id ?? nextMetricValueId,
    metric_code: row.metric_code,
    enterprise_id: row.enterprise_id ?? null,
    city_id: row.city_id ?? null,
    period_year: Number(row.period_year),
    value_numeric: Number(row.value_numeric),
    source_id: row.source_id ?? null,
    value_kind: row.value_kind ?? "legacy_unclassified",
    verification_status: row.verification_status ?? "pending",
    reporting_scope: row.reporting_scope ?? "unknown",
    precision_kind: row.precision_kind ?? "unknown",
    measurement_date: row.measurement_date ?? null,
    source_detail: row.source_detail ?? null,
    note: row.note ?? null,
    _order: metricOrder
  };
  nextMetricValueId = Math.max(nextMetricValueId, Number(normalized.id) + 1);
  metricOrder += 1;

  const existingIndex = metricValues.findIndex((item) => metricValueKey(item) === metricValueKey(normalized));
  if (existingIndex >= 0) {
    const existing = metricValues[existingIndex];
    const mayReplace = replace === "if-unverified"
      ? existing.verification_status !== "verified"
      : replace;
    if (mayReplace) metricValues[existingIndex] = { ...existing, ...normalized };
    return;
  }
  metricValues.push(normalized);
}

const enterpriseLegacyMetrics = [
  ["employees", "employees"],
  ["revenue", "revenue"],
  ["investments", "investments"],
  ["average_salary", "average_salary"],
  ["net_profit", "net_profit"],
  ["assets", "assets"],
  ["taxes_paid", "taxes_paid"],
  ["production_volume", "production_volume"]
];
const enterpriseMetricQualityByKey = new Map(
  data.enterprise_metric_quality.map((row) => [
    `${row.enterprise_id}|${row.year}|${row.indicator}`,
    row
  ])
);

for (const row of data.enterprise_metrics) {
  enterpriseLegacyMetrics.forEach(([metricCode, column]) => {
    if (row[column] === null || row[column] === undefined) return;
    const quality = enterpriseMetricQualityByKey.get(`${row.enterprise_id}|${row.year}|${metricCode}`);
    addMetricValue({
      metric_code: metricCode,
      enterprise_id: row.enterprise_id,
      period_year: row.year,
      value_numeric: row[column],
      source_id: row.source_id,
      value_kind: quality?.quality_status ?? "source_linked_legacy",
      verification_status: "pending",
      reporting_scope: "legal_entity",
      precision_kind: "unknown",
      source_detail: `Импорт из enterprise_metrics.id=${row.id}; качество: ${quality?.quality_status ?? "source_linked_legacy"}`,
      note: quality?.note || "Наследованное значение со ссылкой на источник; независимая аудиторская проверка не проводилась"
    });
  });
}

const territoryLegacyMetrics = [
  ["population", "population"],
  ["average_salary_territory", "average_salary"],
  ["unemployment_rate", "unemployment_rate"],
  ["investments_territory", "investments"],
  ["industrial_output", "industrial_output"],
  ["employed_population", "employed_population"],
  ["enterprises_count", "enterprises_count"],
  ["industrial_enterprises_count", "industrial_enterprises_count"]
];

for (const row of data.territory_metrics) {
  territoryLegacyMetrics.forEach(([metricCode, column]) => {
    if (row[column] === null || row[column] === undefined || row.city_id === null) return;
    addMetricValue({
      metric_code: metricCode,
      city_id: row.city_id,
      period_year: row.year,
      value_numeric: row[column],
      source_id: row.source_id,
      value_kind: "legacy_unclassified",
      verification_status: "pending",
      reporting_scope: "municipality",
      precision_kind: "unknown",
      source_detail: `Импорт из territory_metrics.id=${row.id}`,
      note: "Проверить границы муниципалитета, методику и дату учета"
    });
  });
}

// В v2 исторические строки Медногорска относятся к городскому ядру, а не ко всему округу.
metricValues.forEach((row) => {
  if (row.city_id === 6 && row.metric_code === "population" && row.period_year >= 2021 && row.period_year <= 2025) {
    row.metric_code = "population_city_core";
    row.note = "Население города Медногорска; не муниципального округа";
  }
});

// Последующие SQL-релизы не заменяют уже проверенную точку: это повторяет
// условие WHERE metric_values.verification_status <> 'verified' из пакета v3.
const validEnterpriseIds = new Set(data.enterprises.map((row) => row.id));
for (const row of insertedRows.get("metric_values") ?? []) {
  if (row.enterprise_id !== null && row.enterprise_id !== undefined && !validEnterpriseIds.has(row.enterprise_id)) continue;
  addMetricValue(row, "if-unverified");
}

// PROMREGION56_V6_EECOLOG: verifiable facts from e-ecolog.ru and FNS headcount.
const bfoFacts = (insertedRows.get("eecolog_financial_facts") ?? []).filter((r) => (
  Number(r.report_year) >= 2021 && Number(r.report_year) <= 2025
  && validEnterpriseIds.has(Number(r.enterprise_id))
  && String(data.enterprises.find((e) => e.id === Number(r.enterprise_id))?.inn) === String(r.inn)
));
const staffRows = (insertedRows.get("enterprise_staff_annual") ?? []).filter((r) => (
  Number(r.report_year) >= 2021 && Number(r.report_year) <= 2025
  && validEnterpriseIds.has(Number(r.enterprise_id))
  && String(data.enterprises.find((e) => e.id === Number(r.enterprise_id))?.inn) === String(r.inn)
));
const metricYearCounts = new Map();
for (const row of [...metricValues, ...bfoFacts.map((r) => ({
  enterprise_id: Number(r.enterprise_id), metric_code: r.indicator, period_year: Number(r.report_year)
}))]) {
  if (row.enterprise_id === null || row.enterprise_id === undefined) continue;
  const key = `${row.enterprise_id}|${row.metric_code}`;
  if (!metricYearCounts.has(key)) metricYearCounts.set(key, new Set());
  metricYearCounts.get(key).add(Number(row.period_year));
}
for (const r of bfoFacts) {
  const eid = Number(r.enterprise_id);
  const key = `${eid}|${r.indicator}`;
  if ((metricYearCounts.get(key)?.size ?? 0) < 3) continue;
  addMetricValue({
    enterprise_id: eid,
    metric_code: r.indicator,
    period_year: Number(r.report_year),
    value_numeric: Number(r.amount_rub),
    source_id: null,
    value_kind: "eecolog_bfo_reported",
    verification_status: "verified",
    reporting_scope: "legal_entity",
    precision_kind: "exact",
    source_detail: `e-ecolog.ru, отчет ${r.source_year}, ИНН ${r.inn}, ${r.source_url}`,
    note: r.note || "Денежные показатели приведены в рублях (в источнике в тысячах рублей)."
  }, "if-unverified");
}
const staffYearsByEnterprise = new Map();
for (const r of staffRows) {
  const eid = Number(r.enterprise_id);
  if (!staffYearsByEnterprise.has(eid)) staffYearsByEnterprise.set(eid, new Set());
  staffYearsByEnterprise.get(eid).add(Number(r.report_year));
}
for (const r of staffRows) {
  const eid = Number(r.enterprise_id);
  const qualifyingYears = new Set([
    ...(metricYearCounts.get(`${eid}|employees`) ?? []),
    ...(staffYearsByEnterprise.get(eid) ?? [])
  ]);
  if (qualifyingYears.size < 3) continue;
  addMetricValue({
    enterprise_id: eid,
    metric_code: "employees",
    period_year: Number(r.report_year),
    value_numeric: Number(r.headcount),
    source_id: null,
    value_kind: "fns_average_headcount",
    verification_status: "verified",
    reporting_scope: "legal_entity",
    precision_kind: "exact",
    source_detail: r.source_url,
    note: "Среднесписочная численность работников за год; не численность на текущую дату."
  }, "if-unverified");
}
// All workforce snapshots are usable as a latest-available card even if <3 years are known.
const latestStaffByEnterprise = new Map();
for (const row of staffRows) {
  const eid = Number(row.enterprise_id);
  const previous = latestStaffByEnterprise.get(eid);
  if (!previous || Number(row.report_year) > previous.year) {
    latestStaffByEnterprise.set(eid, {
      enterprise_id: eid,
      year: Number(row.report_year),
      headcount: Number(row.headcount),
      source_url: row.source_url,
      kind: "fns_average_headcount"
    });
  }
}
data.enterprise_staff_latest = [...latestStaffByEnterprise.values()].sort((a, b) => a.enterprise_id - b.enterprise_id);
const bfoReferenceByEnterprise = new Map();
for (const f of bfoFacts) {
  const eid = Number(f.enterprise_id);
  const previous = bfoReferenceByEnterprise.get(eid);
  if (!previous || Number(f.source_year) > previous.source_year) {
    bfoReferenceByEnterprise.set(eid, {
      enterprise_id: eid,
      source_year: Number(f.source_year),
      url: f.source_url,
      name: `Бухгалтерская отчётность, ${f.source_year} г. (e-ecolog)`,
      source_type: "Бухгалтерская отчётность / e-ecolog",
      access_date: "2026-11-22"
    });
  }
}
data.eecolog_reference_links = [...bfoReferenceByEnterprise.values()];
data.eecolog_verification_stats = {
  verified_facts: bfoFacts.length,
  verified_staff_rows: staffRows.length,
  workforce_enterprises: latestStaffByEnterprise.size,
  verified_enterprises: new Set(bfoFacts.map((r) => Number(r.enterprise_id))).size
};
if (!data.dataset_releases.some((r) => String(r.release_code).startsWith("v6-eecolog-"))) {
  data.dataset_releases.push({
    release_code: "v6-eecolog-2026-11-22",
    release_date: "2026-11-22",
    description: "Сверка бухгалтерской отчетности e-ecolog.ru и среднесписочной численности по ФНС; отчётные годы 2021–2025.",
    verified_fact_rows: bfoFacts.length,
    official_municipal_rows: data.city_annual_indicators.length,
    source_count_new: 2,
    imported_legacy_verified: false
  });
}

data.metric_values = metricValues
  .map(({ _order, ...row }) => row)
  .sort((a, b) => a.id - b.id);
data.metric_value_sources = data.metric_values
  .filter((row) => row.source_id !== null)
  .map((row) => ({
    metric_value_id: row.id,
    source_id: row.source_id,
    source_role: "primary",
    section_or_page: row.source_detail
  }));

const verificationRank = { verified: 0, pending: 1, rejected: 2 };
const scopeRank = { legal_entity: 0, production_site: 1 };
const precisionRank = { exact: 0, rounded: 1 };

function bestMetricValues(rows) {
  const best = new Map();
  rows.filter((row) => row.verification_status !== "rejected").forEach((row) => {
    const key = `${row.enterprise_id ?? row.city_id}|${row.metric_code}|${row.period_year}`;
    const current = best.get(key);
    const score = [
      verificationRank[row.verification_status] ?? 9,
      scopeRank[row.reporting_scope] ?? 9,
      precisionRank[row.precision_kind] ?? 9,
      -row.id
    ];
    const isBetter = !current || score.some((value, index) => value < current.score[index]
      && score.slice(0, index).every((part, partIndex) => part === current.score[partIndex]));
    if (isBetter) best.set(key, { row, score });
  });
  return [...best.values()].map((item) => item.row);
}

function pivotMetrics(rows, entityKey) {
  const catalogByCode = new Map(data.metric_catalog.map((item) => [item.code, item]));
  const result = new Map();
  bestMetricValues(rows).forEach((row) => {
    const key = `${row[entityKey]}|${row.period_year}`;
    if (!result.has(key)) {
      result.set(key, {
        [entityKey]: row[entityKey],
        year: row.period_year,
        source_id: null,
        source_ids: [],
        metric_meta: {}
      });
    }
    const target = result.get(key);
    target[row.metric_code] = row.value_numeric;
    if (row.source_id !== null && !target.source_ids.includes(row.source_id)) target.source_ids.push(row.source_id);
    const catalog = catalogByCode.get(row.metric_code);
    target.metric_meta[row.metric_code] = {
      source_id: row.source_id,
      verification_status: row.verification_status,
      reporting_scope: row.reporting_scope,
      precision_kind: row.precision_kind,
      value_kind: row.value_kind,
      measurement_date: row.measurement_date,
      source_detail: row.source_detail,
      note: row.note,
      title: catalog?.title ?? row.metric_code,
      unit: catalog?.unit ?? ""
    };
  });
  return [...result.values()].sort((a, b) => a[entityKey] - b[entityKey] || a.year - b.year);
}

data.enterprise_metric_view = pivotMetrics(
  data.metric_values.filter((row) => row.enterprise_id !== null),
  "enterprise_id"
);
data.territory_metric_view = pivotMetrics(
  data.metric_values.filter((row) => row.city_id !== null),
  "city_id"
);

const cityById = new Map(data.cities.map((city) => [city.id, city]));
const researchStatusByEnterprise = new Map(
  data.enterprise_research_status.map((status) => [status.enterprise_id, status])
);
data.enterprise_research_queue = data.enterprises.map((enterprise) => {
  const status = researchStatusByEnterprise.get(enterprise.id) ?? {};
  const verified = data.metric_values.filter((row) => (
    row.enterprise_id === enterprise.id && row.verification_status === "verified"
  ));
  const revenueYears = new Set(
    verified.filter((row) => row.metric_code === "revenue").map((row) => row.period_year)
  );
  return {
    enterprise_id: enterprise.id,
    enterprise_name: enterprise.name,
    city_name: cityById.get(enterprise.city_id)?.name ?? null,
    region: cityById.get(enterprise.city_id)?.region ?? null,
    priority_order: status.priority_order ?? null,
    identification_status: status.identification_status ?? null,
    duplicate_candidate_id: status.duplicate_candidate_id ?? null,
    verified_values: verified.length,
    verified_revenue_years: revenueYears.size,
    newest_verified_year: verified.length ? Math.max(...verified.map((row) => row.period_year)) : null
  };
}).sort((a, b) => (
  (a.priority_order ?? 99) - (b.priority_order ?? 99)
  || String(a.city_name).localeCompare(String(b.city_name), "ru")
  || String(a.enterprise_name).localeCompare(String(b.enterprise_name), "ru")
));

const identityByEnterprise = new Map(
  data.v4_entity_identity.map((identity) => [identity.enterprise_id, identity])
);
data.v4_city_enterprise_coverage = data.enterprises
  .filter((enterprise) => enterprise.city_id === 2 || enterprise.city_id === 3)
  .map((enterprise) => {
    const city = cityById.get(enterprise.city_id);
    const identity = identityByEnterprise.get(enterprise.id) ?? {};
    const verified = data.metric_values.filter((row) => (
      row.enterprise_id === enterprise.id
      && row.reporting_scope === "legal_entity"
      && row.verification_status === "verified"
    ));
    const revenueYears = new Set(
      verified.filter((row) => row.metric_code === "revenue").map((row) => row.period_year)
    );
    return {
      city: city?.name ?? null,
      enterprise_id: enterprise.id,
      enterprise: enterprise.name,
      researched_inn: identity.researched_inn ?? null,
      entity_kind: identity.entity_kind ?? null,
      identity_status: identity.identity_status ?? null,
      location_note: identity.location_note ?? null,
      available_verified_values: verified.length,
      years_of_revenue: revenueYears.size,
      latest_year: verified.length ? Math.max(...verified.map((row) => row.period_year)) : null
    };
  })
  .sort((a, b) => (
    String(a.city ?? "").localeCompare(String(b.city ?? ""), "ru")
    || String(a.enterprise ?? "").localeCompare(String(b.enterprise ?? ""), "ru")
  ));

const enterpriseById = new Map(data.enterprises.map((enterprise) => [enterprise.id, enterprise]));
const catalogByCode = new Map(data.metric_catalog.map((metric) => [metric.code, metric]));
const sourceById = new Map(data.data_sources.map((source) => [source.id, source]));
data.v4_city_financial_evidence = data.metric_values
  .filter((row) => {
    const enterprise = enterpriseById.get(row.enterprise_id);
    return enterprise
      && (enterprise.city_id === 2 || enterprise.city_id === 3)
      && row.reporting_scope === "legal_entity"
      && row.verification_status === "verified";
  })
  .map((row) => {
    const enterprise = enterpriseById.get(row.enterprise_id);
    const metric = catalogByCode.get(row.metric_code);
    const source = sourceById.get(row.source_id);
    return {
      city: cityById.get(enterprise.city_id)?.name ?? null,
      enterprise_id: enterprise.id,
      enterprise: enterprise.name,
      inn: enterprise.inn,
      period_year: row.period_year,
      metric_code: row.metric_code,
      title: metric?.title ?? row.metric_code,
      value_numeric: row.value_numeric,
      unit: metric?.unit ?? "",
      precision_kind: row.precision_kind,
      verification_status: row.verification_status,
      source_name: source?.name ?? null,
      source_url: source?.url ?? null,
      source_type: source?.source_type ?? null,
      source_detail: row.source_detail
    };
  });

const verifiedMetricValues = data.metric_values.filter((row) => row.verification_status === "verified");
const v3Release = data.dataset_releases.find((row) => String(row.release_code).startsWith("v3-"));
if (v3Release) {
  v3Release.verified_fact_rows = verifiedMetricValues.filter((row) => (
    row.source_id === null || (row.source_id < 2201 && (row.source_id < 362 || row.source_id > 369))
  )).length;
  v3Release.official_municipal_rows = verifiedMetricValues.filter((row) => (
    row.city_id !== null && row.source_id === 1127
  )).length;
}

const v4Release = data.dataset_releases.find((row) => String(row.release_code).startsWith("v4-"));
if (v4Release) {
  v4Release.verified_fact_rows = verifiedMetricValues.filter((row) => (
    row.source_id === null || row.source_id < 362 || row.source_id > 369
  )).length;
  v4Release.official_municipal_rows = data.v4_period_observations.length;
}

const activeRelease = [...data.dataset_releases]
  .sort((a, b) => (
    String(a.release_date).localeCompare(String(b.release_date))
    || String(a.release_code).localeCompare(String(b.release_code))
  ))
  .at(-1);
if (activeRelease && schemaVersion >= 3) {
  activeRelease.verified_fact_rows = verifiedMetricValues.length;
  activeRelease.official_municipal_rows = schemaVersion >= 5
    ? data.city_annual_indicators.length
    : schemaVersion >= 4
      ? data.v4_period_observations.length
      : verifiedMetricValues.filter((row) => row.city_id !== null && row.source_id === 1127).length;
}

const release = [...data.dataset_releases]
  .sort((a, b) => (
    String(a.release_date).localeCompare(String(b.release_date))
    || String(a.release_code).localeCompare(String(b.release_code))
  ))
  .at(-1) ?? null;
data.client_metadata = {
  schema_version: schemaVersion,
  release_code: release?.release_code ?? null,
  release_date: release?.release_date ?? null,
  verified_metric_points: data.metric_values.filter((row) => row.verification_status === "verified").length,
  pending_metric_points: data.metric_values.filter((row) => row.verification_status === "pending").length,
  detailed_city_indicators: data.city_annual_indicators.length,
  reported_city_indicators: data.city_annual_indicators.filter((row) => row.verification_status === "reported").length,
  estimated_city_indicators: data.city_annual_indicators.filter((row) => row.verification_status === "municipal_estimate").length,
  generated_at: release?.release_date ? `${release.release_date}T00:00:00.000Z` : null
};

const requiredTables = [
  "metric_catalog",
  "metric_values",
  "metric_value_sources",
  "enterprise_metric_quality",
  "data_quality_issues",
  "dataset_releases",
  ...(schemaVersion >= 3 ? ["enterprise_research_status", "enterprise_research_queue"] : []),
  ...(schemaVersion >= 4 ? [
    "v4_entity_identity",
    "v4_quality_issues",
    "v4_period_observations",
    "v4_city_enterprise_coverage",
    "v4_city_financial_evidence"
  ] : []),
  ...(schemaVersion >= 5 ? ["city_annual_indicators"] : [])
];
for (const table of requiredTables) {
  if (!data[table]) throw new Error(`v${schemaVersion} table not built: ${table}`);
}

writeFileSync(outputPath, `window.PROMREGION_DATA=${JSON.stringify(data)};\n`, "utf8");

for (const table of [...baseTables, ...requiredTables]) {
  console.log(`${table}: ${data[table].length}`);
}
console.log(`enterprise_metric_view: ${data.enterprise_metric_view.length}`);
console.log(`territory_metric_view: ${data.territory_metric_view.length}`);
console.log(`release: ${data.client_metadata.release_code ?? "not specified"}`);
