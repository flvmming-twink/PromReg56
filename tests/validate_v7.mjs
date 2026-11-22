/** Run from the project root after data_v7.json was copied: node tests/validate_v7.mjs */
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync('data_v7.json','utf8'));
const expected={companies:59,values:761,series:187,sources:107,staff:15};
const assert=(condition,label)=>{if(!condition)throw new Error(`FAILED: ${label}`);};
const ids=new Set(data.enterprises.map(x=>Number(x.id)));
assert(ids.size===expected.companies,'enterprise count/IDs');
assert(data.observations.length===expected.values,'observation count');
assert(data.company_sources.length===expected.sources,'source count');
assert(data.staff_latest.length===expected.staff,'workforce count');
assert(data.min_distinct_years===2,'policy');
assert(data.enterprises.every(e=>[1,2,3].includes(Number(e.city_id))),'only 3 cities');
assert(!ids.has(88)&&!ids.has(1002),'outside/zero-only companies absent');
assert(data.enterprises.every(e=>/^\d{10}$|^\d{12}$/.test(String(e.inn))),'INN format');
const series=new Map();
for(const p of data.observations){
  assert(ids.has(Number(p.enterprise_id)),'orphan metric');
  assert(p.year>=2021&&p.year<=2025,'metric year');
  assert(Number.isFinite(Number(p.value_numeric))&&Number(p.value_numeric)!==0,'nonzero numeric');
  assert(p.source_url?.startsWith('http'),'metric source URL');
  const key=`${p.enterprise_id}/${p.metric_code}`;
  if(!series.has(key))series.set(key,new Set());
  series.get(key).add(p.year);
}
assert(series.size===expected.series,'metric series count');
assert([...series.values()].every(x=>x.size>=2),'at least two distinct years');
const urlCount=new Map();
for(const src of data.company_sources){
  assert(ids.has(src.enterprise_id),'orphan source');
  urlCount.set(src.enterprise_id,(urlCount.get(src.enterprise_id)??0)+1);
}
assert([...urlCount.values()].every(n=>n<=2),'max 2 company sources');
console.log('OK — 59 enterprises, 761 observations, 187 series, 107 source references, 15 workforce entries');
