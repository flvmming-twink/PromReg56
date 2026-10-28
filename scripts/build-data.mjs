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
  "source_id",
  "year",
  "employees",
  "revenue",
  "investments",
  "average_salary",
  "net_profit",
  "assets",
  "taxes_paid",
  "production_volume",
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
  "industrial_enterprises_count"
]);

const booleanColumns = new Set(["is_main", "is_city_forming", "is_major_enterprise"]);

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
  if (value === null) return null;
  if (booleanColumns.has(column)) return value === "t";
  if (numericColumns.has(column) && value !== "") return Number(value);
  return value;
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

const expectedTables = [
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

for (const table of expectedTables) {
  if (!data[table]) throw new Error(`Table not found in SQL dump: ${table}`);
}

writeFileSync(outputPath, `window.PROMREGION_DATA=${JSON.stringify(data)};\n`, "utf8");

for (const table of expectedTables) {
  console.log(`${table}: ${data[table].length}`);
}
