#!/usr/bin/env node
/**
 * PromRegion56 v7 static publisher. Run AFTER `node scripts/build-data.mjs`.
 * Reads dataset `data_v7.json`, writes `data.js`. Does not require npm packages.
 * The canonical source of enterprise time-series is the v7 curated dataset.
 * Usage: node scripts/apply_v7_dataset.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = join(repo, 'data.js');
const v7File = join(repo, 'data_v7.json');
const original = readFileSync(dataFile, 'utf8').trim();
const prefix = 'window.PROMREGION_DATA=';
if (!original.startsWith(prefix)) throw new Error('Unknown data.js wrapper. Expected window.PROMREGION_DATA=');
const old = JSON.parse(original.slice(prefix.length).replace(/;\s*$/, ''));
const newer = JSON.parse(readFileSync(v7File, 'utf8'));
const allowed = new Set(['Новотроицк', 'Орск', 'Оренбург']);
if (newer.min_distinct_years !== 2) throw new Error('Unexpected metric policy');
const oldCompany = new Map((old.enterprises ?? []).map(e => [Number(e.id), e]));
const cityById = new Map(old.cities.map(c => [Number(c.id), c.name]));
const ids = new Set(newer.enterprises.map(e => Number(e.id)));
if (ids.has(88)) throw new Error('Zero-only company 88 must be excluded');
for (const e of newer.enterprises) {
  if (!allowed.has(cityById.get(Number(e.city_id)))) throw new Error(`Invalid city in company ${e.id}`);
  if (!/^\d{10}$|^\d{12}$/.test(String(e.inn ?? ''))) throw new Error(`Missing/invalid INN: ${e.id}`);
}
old.enterprises = newer.enterprises.map(e => {
  const keep = { ...oldCompany.get(Number(e.id)) };
  for (const [k, v] of Object.entries(e)) if (v !== null && v !== undefined) keep[k] = v;
  return keep;
});
const industryById = new Map((old.industries ?? []).map(i => [Number(i.id), i]));
if (!industryById.has(6)) {
  industryById.set(6, {
    id: 6,
    name: 'Коммунальная инфраструктура',
    description: 'Водоснабжение, водоотведение и коммунальные услуги'
  });
}
const usedIndustryIds = new Set(old.enterprises.map(e => Number(e.industry_id)));
old.industries = [...industryById.values()]
  .filter(i => usedIndustryIds.has(Number(i.id)))
  .sort((a,b) => Number(a.id) - Number(b.id));
const units = new Map(newer.metric_definitions.map(m => [m.code, m]));
const originalCatalog = (old.metric_catalog ?? []).filter(m => m.scope !== 'enterprise');
old.metric_catalog = [
  ...originalCatalog,
  ...newer.metric_definitions.map(m => ({code:m.code, title:m.title, category:m.category, unit:m.unit, scope:'enterprise', priority:2}))
];

// One or two links per enterprise; preserve up to three municipal source records.
const municipal = (old.data_sources ?? []).filter(s => Number(s.id) >= 1 && Number(s.id) <= 3);
const uniqueUrls = new Map();
const sourceRoles = new Map();
const companySources = [];
let nextId = 100000;
const sourceIdForUrl = (url, role) => {
  if (!url) return null;
  let sid = uniqueUrls.get(url);
  if (!sid) {
    sid = nextId++;
    uniqueUrls.set(url, sid);
    sourceRoles.set(url, role);
  } else if (role === 'company') {
    sourceRoles.set(url, role);
  }
  return sid;
};
for (const c of newer.company_sources) {
  if (!ids.has(Number(c.enterprise_id))) continue;
  const sid = sourceIdForUrl(c.url, 'company');
  companySources.push({
    id: 400000 + companySources.length,
    enterprise_id: Number(c.enterprise_id),
    source_id: sid,
    is_main: c.source_no === 1,
    note: c.source_role
  });
}
const countSources = new Map();
for (const c of companySources) countSources.set(c.enterprise_id,(countSources.get(c.enterprise_id) ?? 0)+1);
if ([...countSources.values()].some(n=>n>2)) throw new Error('Source count >2');
for (const observation of newer.observations) sourceIdForUrl(observation.source_url, 'metric');
old.data_sources = [
  ...municipal,
  ...[...uniqueUrls].map(([url,id])=> ({
    id,
    name:sourceRoles.get(url)==='company' ? 'Основной источник предприятия' : 'Источник годового показателя',
    url,
    source_type:'Открытый реестр / организация',
    access_date:'2026-11-22',
    description:'Статус проверки указан у каждого годового значения'
  }))
];
old.enterprise_sources = companySources;
const sourceByCompany = new Map();
for (const c of companySources) if (!sourceByCompany.has(c.enterprise_id)) sourceByCompany.set(c.enterprise_id,c.source_id);

const rows = new Map();
const counts = new Map();
for (const m of newer.observations) {
  if (!ids.has(Number(m.enterprise_id))) throw new Error(`Unregistered enterprise ${m.enterprise_id}`);
  if (m.year < 2021 || m.year > 2025 || Number(m.value_numeric) === 0) throw new Error('Invalid zero/year metric');
  const metricId = `${m.enterprise_id}|${m.metric_code}`;
  if (!counts.has(metricId)) counts.set(metricId,new Set());
  counts.get(metricId).add(m.year);
  const key = `${m.enterprise_id}|${m.year}`;
  const exactSourceId = sourceIdForUrl(m.source_url, 'metric');
  if (!rows.has(key)) rows.set(key, {enterprise_id:Number(m.enterprise_id),year:m.year,source_id:exactSourceId,source_ids:[],metric_meta:{}});
  const row = rows.get(key);
  row[m.metric_code] = Number(m.value_numeric);
  const d = units.get(m.metric_code);
  const sourceId = exactSourceId ?? sourceByCompany.get(Number(m.enterprise_id)) ?? null;
  if (sourceId !== null && !row.source_ids.includes(sourceId)) row.source_ids.push(sourceId);
  row.metric_meta[m.metric_code] = {
    source_id:sourceId,verification_status:m.verification_status,reporting_scope:'legal_entity',
    precision_kind:m.precision_kind,value_kind:m.value_kind,
    source_detail:m.source_url,note:m.note,title:d?.title ?? m.metric_code,unit:d?.unit ?? ''
  };
}
if ([...counts.values()].some(s => s.size < 2)) throw new Error('Metric series with <2 distinct years');
old.enterprise_metric_view = [...rows.values()].sort((a,b)=>a.enterprise_id-b.enterprise_id || a.year-b.year);
old.enterprise_metrics = old.enterprise_metric_view.map((r,i)=>({id:i+1,...r}));
const cityMetrics = (old.metric_values ?? []).filter(m=>m.city_id != null);
old.metric_values = [
  ...cityMetrics,
  ...newer.observations.map((m,i)=>({
    id:100000+i,enterprise_id:Number(m.enterprise_id),city_id:null,metric_code:m.metric_code,
    period_year:m.year,value_numeric:Number(m.value_numeric),source_id:sourceIdForUrl(m.source_url, 'metric'),
    value_kind:m.value_kind,verification_status:m.verification_status,precision_kind:m.precision_kind,
    reporting_scope:'legal_entity',source_detail:m.source_url,note:m.note
  }))
];
old.metric_value_sources = old.metric_values.filter(m=>m.source_id != null).map(m=>({metric_value_id:m.id,source_id:m.source_id,source_role:'primary',section_or_page:m.source_detail ?? ''}));
old.enterprise_staff_latest = newer.staff_latest.map(s=>({enterprise_id:Number(s.enterprise_id),year:s.year,headcount:s.headcount,source_url:s.source_url,kind:'fns_average_headcount'}));
old.v7_staff_latest = old.enterprise_staff_latest;
old.eecolog_reference_links = newer.company_sources.filter(s=>s.source_no===1).map(s=>({
  enterprise_id:s.enterprise_id,
  url:s.url,
  name:'Бухгалтерская отчётность / финансовый реестр',
  source_type:'Основной открытый источник предприятия',
  access_date:'2026-11-22'
}));
old.enterprise_products = (old.enterprise_products ?? []).filter(p=>ids.has(Number(p.enterprise_id)));
old.investment_projects = (old.investment_projects ?? []).filter(p=>p.enterprise_id == null || ids.has(Number(p.enterprise_id)));
for (const key of ['enterprise_metric_quality','v4_quality_issues','v4_entity_identity','enterprise_research_queue','enterprise_research_status','v4_city_enterprise_coverage','v4_city_financial_evidence']) {
  if (Array.isArray(old[key])) old[key] = old[key].filter(e=>e.enterprise_id == null || ids.has(Number(e.enterprise_id)));
}
old.dataset_releases = (old.dataset_releases ?? []).filter(x=>!String(x.release_code).startsWith('v7-'));
old.dataset_releases.push({
  release_code:'v7-2years-2026-11-22',release_date:'2026-11-22',
  description:'Порог два ненулевых года 2021-2025, финансовые статьи по отчёту ошибок, исключение пустых карточек',
  verified_fact_rows:newer.observations.filter(r=>r.verification_status==='verified').length,
  official_municipal_rows:(old.city_annual_indicators ?? []).length,
  source_count_new:companySources.length,imported_legacy_verified:false
});
old.client_metadata = {
  ...old.client_metadata,schema_version:7,release_code:'v7-2years-2026-11-22',release_date:'2026-11-22',
  verified_metric_points:newer.observations.filter(r=>r.verification_status==='verified').length,
  pending_metric_points:newer.observations.filter(r=>r.verification_status!=='verified').length,
  generated_at:'2026-11-22T00:00:00.000Z'
};
old.v7_dataset_quality = {
  policy:'min_2_distinct_nonzero_calendar_years',companies:ids.size,observations:newer.observations.length,
  metric_series:counts.size,year_start:2021,year_end:2025,city_count:allowed.size,
  rounded_points:newer.observations.filter(r=>r.precision_kind.startsWith('rounded')).length,
  note:'registry_linked_pending and legacy_pending require source verification'
};
if (ids.size !== newer.enterprises.length || old.enterprises.length !== newer.enterprises.length) throw new Error(`Enterprise export mismatch: ${ids.size}`);
writeFileSync(dataFile,`window.PROMREGION_DATA=${JSON.stringify(old)};\n`,'utf8');
console.log(JSON.stringify(old.v7_dataset_quality,null,2));
