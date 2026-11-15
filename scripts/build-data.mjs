import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sqlPath = join(root, "database", "industrial_city_db.sql");
const outputPath = join(root, "data.js");
const sql = readFileSync(sqlPath, "utf8");

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
  "source_count_new"
]);

const booleanColumns = new Set([
  "is_main",
  "is_city_forming",
  "is_major_enterprise",
  "imported_legacy_verified"
]);

const insertedTableColumns = {
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
  const pattern = /INSERT\s+INTO\s+(?:public\.)?([a-z_]+)\s*(?:\(([^)]*)\))?\s*VALUES\b/gim;

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

const data = {};
const copyBlock = /^COPY public\.([a-z_]+) \(([^)]+)\) FROM stdin;\r?\n([\s\S]*?)\r?\n\\\.$/gm;

for (const match of sql.matchAll(copyBlock)) {
  const [, table, columnList, rows] = match;
  const columns = columnList.split(", ");

  data[table] = rows.split(/\r?\n/).filter(Boolean).map((line) => {
    const values = line.split("\t").map(decodeCopyValue);
    return Object.fromEntries(columns.map((column, index) => [column, coerce(column, values[index])]));
  });
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
  if (!data[table]) throw new Error(`Table not found in SQL dump: ${table}`);
}

const insertedRows = new Map();
for (const insert of parseValueInserts(sql)) {
  if (!insertedRows.has(insert.table)) insertedRows.set(insert.table, []);
  insertedRows.get(insert.table).push(...insert.rows);
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

upsertBy(data.data_sources, insertedRows.get("data_sources") ?? [], (row) => row.id);

for (const match of sql.matchAll(/UPDATE\s+public\.data_sources\s+SET\s+publication_date='([^']+)'\s+WHERE\s+id=(\d+);/gi)) {
  const source = data.data_sources.find((row) => row.id === Number(match[2]));
  if (source) source.publication_date = match[1];
}

data.metric_catalog = upsertBy([], insertedRows.get("metric_catalog") ?? [], (row) => row.code);
data.data_quality_issues = upsertBy([], insertedRows.get("data_quality_issues") ?? [], (row) => row.issue_key);
data.dataset_releases = upsertBy([], insertedRows.get("dataset_releases") ?? [], (row) => row.release_code);
data.enterprise_product_output = insertedRows.get("enterprise_product_output") ?? [];

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
    if (replace) metricValues[existingIndex] = { ...metricValues[existingIndex], ...normalized };
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
  ["taxes_paid", "taxes_paid"]
];

for (const row of data.enterprise_metrics) {
  enterpriseLegacyMetrics.forEach(([metricCode, column]) => {
    if (row[column] === null || row[column] === undefined) return;
    addMetricValue({
      metric_code: metricCode,
      enterprise_id: row.enterprise_id,
      period_year: row.year,
      value_numeric: row[column],
      source_id: row.source_id,
      value_kind: "legacy_unclassified",
      verification_status: "pending",
      reporting_scope: "unknown",
      precision_kind: "unknown",
      source_detail: `Импорт из enterprise_metrics.id=${row.id}`,
      note: "Методика, год источника, субъект учета и точность требуют сверки"
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

for (const row of insertedRows.get("metric_values") ?? []) addMetricValue(row, true);

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

const release = [...data.dataset_releases]
  .sort((a, b) => String(a.release_date).localeCompare(String(b.release_date)))
  .at(-1) ?? null;
data.client_metadata = {
  schema_version: 2,
  release_code: release?.release_code ?? null,
  release_date: release?.release_date ?? null,
  verified_metric_points: data.metric_values.filter((row) => row.verification_status === "verified").length,
  pending_metric_points: data.metric_values.filter((row) => row.verification_status === "pending").length,
  generated_at: release?.release_date ? `${release.release_date}T00:00:00.000Z` : null
};

const requiredV2Tables = ["metric_catalog", "metric_values", "metric_value_sources", "data_quality_issues", "dataset_releases"];
for (const table of requiredV2Tables) {
  if (!data[table]) throw new Error(`v2 table not built: ${table}`);
}

writeFileSync(outputPath, `window.PROMREGION_DATA=${JSON.stringify(data)};\n`, "utf8");

for (const table of [...baseTables, ...requiredV2Tables]) {
  console.log(`${table}: ${data[table].length}`);
}
console.log(`enterprise_metric_view: ${data.enterprise_metric_view.length}`);
console.log(`territory_metric_view: ${data.territory_metric_view.length}`);
console.log(`release: ${data.client_metadata.release_code ?? "not specified"}`);
