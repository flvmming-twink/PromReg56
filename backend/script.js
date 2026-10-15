const state={page:1,perPage:5,sort:"",isAdmin:false,filters:{industry:"",city:"",status:"",search:""}};
let enterpriseMap;
let dashboardMap;
let enterpriseClusterer;
let dashboardClusterer;
let enterpriseMapLoading=false;
let dashboardMapLoading=false;
let companies=[];
let sources=[];
let sourcePage=1;
let sourcePageSize=10;
let sourceSort={key:"name",direction:"asc"};
let indicators=[];
let employmentMetrics=[];
let territoryMetrics=[];
let showAllMapObjects=false;

const navTitles={
 dashboard:"Промышленный моногород Новотроицк и Оренбургская область",
 enterprises:"Единый реестр предприятий и организаций",
 indicators:"Ключевые социально-экономические показатели",
 analytics:"Сравнительный анализ и автоматические выводы",
 map:"Территориальное распределение объектов",
 sources:"Источники и качество данных",
 about:"Архитектура и назначение информационной системы"
};

async function loadCompanies(){
 try{
  const response=await fetch(`/api/companies${state.sort?`?sort=${state.sort}`:""}`);
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  companies=await response.json();
 }catch(error){
  console.error("Не удалось загрузить предприятия из PostgreSQL",error);
  toast("Не удалось подключиться к PostgreSQL");
 }
}
function escapeHTML(value){
 return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

function uniqueIndustries(){
 return [...new Set(companies.map(c=>c.industry))];
}
function fillIndustries(){
 ["industryFilter","dashIndustry"].forEach(id=>{
   const el=document.getElementById(id); if(!el)return;
   uniqueIndustries().forEach(x=>{const o=document.createElement("option");o.value=x;o.textContent=x;el.appendChild(o)})
 });
}
function fillTerritories(){
 ["territoryFilter","dashTerritory","mapCity"].forEach(id=>{
  const element=document.getElementById(id);if(!element)return;
  const first=element.options[0];element.replaceChildren(first);
  [...new Set(companies.map(company=>company.city).filter(Boolean))].sort().forEach(city=>{
   const option=document.createElement("option");option.value=city;option.textContent=city;element.appendChild(option);
  });
 });
}
function filtered(){
 const result=companies.filter(c=>
  (!state.filters.industry||c.industry===state.filters.industry)&&
  (!state.filters.city||c.city===state.filters.city)&&
  (!state.filters.status||c.status===state.filters.status)&&
  (!state.filters.search||c.name.toLowerCase().includes(state.filters.search.toLowerCase()))
 );
 return [...result].sort((a,b)=>state.sort==="revenue_desc"?b.revenue-a.revenue:state.sort==="revenue_asc"?a.revenue-b.revenue:0);
}
function statusClass(s){return s==="На реконструкции"?"repair":s==="В стадии проекта"?"project":""}
function row(c){
 return `<tr><td>${escapeHTML(c.name)}</td><td>${escapeHTML(c.industry)}</td><td>${escapeHTML(c.city)}</td><td><span class="status ${statusClass(c.status)}">${escapeHTML(c.status)}</span></td><td>${Number(c.workers||0).toLocaleString("ru-RU")}</td><td>${Number(c.revenue||0).toLocaleString("ru-RU")}</td><td><button class="more company-details" data-name="${escapeHTML(c.name)}" aria-label="Подробнее о предприятии">⋮</button></td></tr>`;
}
function renderTables(){
 const data=filtered(), start=(state.page-1)*state.perPage, pageData=data.slice(start,start+state.perPage);
 document.getElementById("dashboardTable").innerHTML=pageData.slice(0,5).map(row).join("");
 document.getElementById("enterpriseTable").innerHTML=pageData.map(row).join("");
 document.getElementById("shownCount").textContent=`Показано ${data.length?start+1:0}–${Math.min(start+state.perPage,data.length)} из ${data.length}`;
 document.getElementById("enterpriseCount").textContent=`Найдено предприятий: ${data.length}`;
 renderPagination("dashboardPagination",data.length);
 renderPagination("enterprisePagination",data.length);
}
function renderPagination(id,total){
 const el=document.getElementById(id), pages=Math.max(1,Math.ceil(total/state.perPage));
 el.innerHTML="";
 for(let i=1;i<=Math.min(pages,6);i++){
  const b=document.createElement("button");b.className="page-btn "+(i===state.page?"active":"");b.textContent=i;
  b.onclick=()=>{state.page=i;renderTables()};el.appendChild(b);
 }
}
function setFilters(industry,city,status,search){
 state.filters={industry,city,status,search};state.page=1;renderTables();
}
function syncFilterUI(){
 document.getElementById("industryFilter").value=state.filters.industry;
 document.getElementById("dashIndustry").value=state.filters.industry;
 document.getElementById("territoryFilter").value=state.filters.city;
 document.getElementById("dashTerritory").value=state.filters.city;
 document.getElementById("statusFilter").value=state.filters.status;
 document.getElementById("dashStatus").value=state.filters.status;
 document.getElementById("enterpriseSearch").value=state.filters.search;
 document.getElementById("dashSearch").value=state.filters.search;
 document.getElementById("revenueSort").value=state.sort;
}
function bindFilters(){
 const map=[
  ["industryFilter","industry"],["dashIndustry","industry"],
  ["territoryFilter","city"],["dashTerritory","city"],
  ["statusFilter","status"],["dashStatus","status"]
 ];
 map.forEach(([id,key])=>document.getElementById(id).addEventListener("change",e=>{
   state.filters[key]=e.target.value;state.page=1;syncFilterUI();renderTables();
 }));
 ["enterpriseSearch","dashSearch"].forEach(id=>document.getElementById(id).addEventListener("input",e=>{
   state.filters.search=e.target.value;state.page=1;syncFilterUI();renderTables();
 }));
 document.getElementById("revenueSort").addEventListener("change",async e=>{
   state.sort=e.target.value;state.page=1;await loadCompanies();syncFilterUI();renderTables();updateDashboardSummary();renderMap();renderDashboardMap();
  });
 ["enterpriseReset","resetFilters"].forEach(id=>document.getElementById(id).addEventListener("click",async()=>{
  state.sort="";setFilters("","","","");await loadCompanies();syncFilterUI();renderTables();updateDashboardSummary();renderMap();renderDashboardMap();
 }));
}
function navigate(section){
 document.querySelectorAll(".section").forEach(s=>s.classList.toggle("active",s.id===section));
 document.querySelectorAll(".nav-item[data-section]").forEach(n=>n.classList.toggle("active",n.dataset.section===section));
 document.getElementById("sectionSubtitle").textContent=navTitles[section]||"";
 document.getElementById("sidebar").classList.remove("open");
 window.scrollTo({top:0,behavior:"smooth"});
 if(section==="map")requestAnimationFrame(()=>{enterpriseMap?.container.fitToViewport();renderMap();});
 if(section==="dashboard")requestAnimationFrame(()=>dashboardMap?.container.fitToViewport());
}
function toast(text){
 const t=document.createElement("div");t.className="toast";t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),3000);
}
function showCompany(name){
 const c=companies.find(x=>x.name===name);if(!c)return;
 document.getElementById("modalContent").innerHTML=`<h2>${escapeHTML(c.name)}</h2><p style="color:#667085;font-size:10px">${escapeHTML(c.industry)}</p>
 <div class="detail-grid">
 <div class="detail"><small>Город</small><b>${escapeHTML(c.city)}</b></div>
 <div class="detail"><small>Статус</small><b>${escapeHTML(c.status)}</b></div>
 <div class="detail"><small>Работники</small><b>${Number(c.workers||0).toLocaleString("ru-RU")}</b></div>
 <div class="detail"><small>Выручка, млн ₽</small><b>${Number(c.revenue||0).toLocaleString("ru-RU")}</b></div>
 </div>${c.website?`<p><a href="${escapeHTML(c.website)}" target="_blank" rel="noopener noreferrer">Официальный сайт ↗</a></p>`:""}`;
 document.getElementById("modal").classList.add("open");
}
function createYandexMap(elementId,onReady){
 const element=document.getElementById(elementId);
 if(!element)return null;
 if(typeof ymaps==="undefined"){
  element.innerHTML='<div class="map-api-message">Для отображения Яндекс.Карт задайте переменную YANDEX_MAPS_API_KEY и перезапустите приложение.</div>';
  return null;
 }
 ymaps.ready(()=>{
  if(!element.isConnected)return;
  const map=new ymaps.Map(element,{center:[51.55,57.4],zoom:7,controls:elementId==="enterpriseMap"?["zoomControl","fullscreenControl","typeSelector"]:["zoomControl"]});
  const clusterer=new ymaps.Clusterer({preset:"islands#invertedGreenClusterIcons",groupByCoordinates:false,clusterDisableClickZoom:false,clusterOpenBalloonOnClick:true});
  map.geoObjects.add(clusterer);
  onReady(map,clusterer);
 });
 return true;
}
function addMapMarkers(map,clusterer,data){
 if(!map||!clusterer)return;
 clusterer.removeAll();
 const points=[];
 data.forEach(company=>{
  if(company.latitude==null||company.longitude==null)return;
  const latitude=Number(company.latitude),longitude=Number(company.longitude);
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude))return;
  points.push([latitude,longitude]);
  const website=/^https?:\/\//i.test(company.website||"")?`<br><a href="${escapeHTML(company.website)}" target="_blank" rel="noopener noreferrer">Сайт предприятия ↗</a>`:"";
  const marker=new ymaps.Placemark([latitude,longitude],{
   balloonContentHeader:`<strong>${escapeHTML(company.name)}</strong>`,
   balloonContentBody:`${escapeHTML(company.city)} · ${escapeHTML(company.industry)}<br>${Number(company.workers||0).toLocaleString("ru-RU")} работников${website}`
  },{preset:company.status==="В стадии проекта"?"islands#orangeCircleDotIcon":"islands#greenCircleDotIcon",hideIconOnBalloonOpen:false});
  clusterer.add(marker);
 });
 if(points.length>1)map.setBounds(clusterer.getBounds(),{checkZoomRange:true,zoomMargin:30});
 else if(points.length===1)map.setCenter(points[0],10);
}
function mapFilteredCompanies(){
 const city=document.getElementById("mapCity").value;
 const industry=document.getElementById("mapIndustry").value;
 const status=document.getElementById("mapStatus").value;
 const search=document.getElementById("mapSearch").value.toLowerCase();
 return companies.filter(company=>(!city||company.city===city)&&(!industry||company.industry===industry)&&(!status||company.status===status)&&(!search||`${company.name} ${company.city}`.toLowerCase().includes(search)));
}
function renderMap(){
 if(!enterpriseMap&&!enterpriseMapLoading){
  enterpriseMapLoading=true;
  const started=createYandexMap("enterpriseMap",(map,clusterer)=>{enterpriseMap=map;enterpriseClusterer=clusterer;enterpriseMapLoading=false;addMapMarkers(map,clusterer,mapFilteredCompanies());});
  if(!started)enterpriseMapLoading=false;
 }
 else addMapMarkers(enterpriseMap,enterpriseClusterer,mapFilteredCompanies());
 renderMapObjects();
}
function renderMapObjects(){
 const data=mapFilteredCompanies(),shown=showAllMapObjects?data:data.slice(0,5);
 document.getElementById("mapObjectsCount").textContent=`Показано ${shown.length} из ${data.length}`;
 document.getElementById("mapShowAll").textContent=showAllMapObjects?"Показать первые 5":"Смотреть все →";
 document.getElementById("mapShowAll").disabled=data.length<=5;
 document.getElementById("mapObjectsTable").innerHTML=shown.map(company=>`<tr><td><b>${escapeHTML(company.name)}</b></td><td>${escapeHTML(company.city)}</td><td>${company.status==="В стадии проекта"?"Инвестиционный проект":"Предприятие"}</td><td>${escapeHTML(company.industry)}</td><td><span class="status ${statusClass(company.status)}">${escapeHTML(company.status)}</span></td><td><button class="text-action company-details" data-name="${escapeHTML(company.name)}">Открыть ↗</button></td></tr>`).join("");
}
function fillMapIndustries(){
 const element=document.getElementById("mapIndustry");
 if(!element)return;
 const first=element.options[0];element.replaceChildren(first);
 uniqueIndustries().forEach(industry=>{const option=document.createElement("option");option.value=industry;option.textContent=industry;element.appendChild(option)});
}
function applyMapFilters(){showAllMapObjects=false;renderMap();}
function renderDashboardMap(){
 if(!dashboardMap&&!dashboardMapLoading){
  dashboardMapLoading=true;
  const started=createYandexMap("dashboardMap",(map,clusterer)=>{dashboardMap=map;dashboardClusterer=clusterer;dashboardMapLoading=false;addMapMarkers(map,clusterer,companies);});
  if(!started)dashboardMapLoading=false;
 }
 else addMapMarkers(dashboardMap,dashboardClusterer,companies);
}
function updateMapStats(){
 document.getElementById("mapCityCount").textContent=new Set(companies.map(company=>company.city)).size;
 document.getElementById("mapEnterpriseCount").textContent=companies.length;
 document.getElementById("mapProjectCount").textContent=companies.filter(company=>company.status==="В стадии проекта").length;
 document.getElementById("mapSourceCount").textContent=sources.length;
}
function updateDashboardSummary(){
 document.getElementById("totalCompanies").textContent=companies.length.toLocaleString("ru-RU");
 document.getElementById("enterpriseBadge").textContent=companies.length.toLocaleString("ru-RU");
 document.getElementById("totalIndustries").textContent=new Set(companies.map(company=>company.industry)).size.toLocaleString("ru-RU");
 document.getElementById("totalWorkers").textContent=companies.reduce((sum,company)=>sum+Number(company.workers||0),0).toLocaleString("ru-RU");
 document.getElementById("totalProjects").textContent=companies.filter(company=>company.status==="В стадии проекта").length.toLocaleString("ru-RU");
 document.getElementById("industryTotal").textContent=companies.length.toLocaleString("ru-RU");
 const counts=new Map();companies.forEach(company=>counts.set(company.industry,(counts.get(company.industry)||0)+1));
 const entries=[...counts].sort((a,b)=>b[1]-a[1]),colors=["#176b64","#3f91a0","#6a9c55","#d58d27","#c75b4b","#65788b"];
 let end=0;
 const slices=entries.map(([,count],index)=>{const start=end;end+=companies.length?count*100/companies.length:0;return `${colors[index%colors.length]} ${start}% ${end}%`;});
 if(slices.length)document.querySelector(".donut").style.background=`conic-gradient(${slices.join(",")})`;
 document.getElementById("industryLegend").innerHTML=entries.map(([industry,count],index)=>`<div><i style="background:${colors[index%colors.length]}"></i>${escapeHTML(industry)}<b>${companies.length?Math.round(count*100/companies.length):0}%</b></div>`).join("");
}
function formatDate(value){
 if(!value)return "—";
 const date=String(value).slice(0,10);
 return /^\d{4}-\d{2}-\d{2}$/.test(date)?date.split("-").reverse().join("."):escapeHTML(value);
}
async function loadSources(){
 try{
  const response=await fetch("/api/sources");if(!response.ok)throw new Error(`HTTP ${response.status}`);
  sources=await response.json();renderSources();updateMapStats();
 }catch(error){console.error("Не удалось загрузить источники из PostgreSQL",error);toast("Не удалось загрузить источники данных");}
}
async function loadEmploymentMetrics(){
 try{
  const response=await fetch("/api/metrics/employment");if(!response.ok)throw new Error(`HTTP ${response.status}`);
  employmentMetrics=await response.json();drawChart(employmentMetrics);
 }catch(error){console.error("Не удалось загрузить динамику занятости из PostgreSQL",error);drawChart([]);}
}
async function loadIndicators(){
 try{
  const response=await fetch("/api/indicators");if(!response.ok)throw new Error(`HTTP ${response.status}`);
  indicators=await response.json();
  const table=document.getElementById("customIndicatorsTable");table.replaceChildren();
  indicators.forEach(indicator=>{
   const rowElement=table.insertRow();rowElement.className="custom-indicator";
   [indicator.name,...indicator.annual_values,"Добавлен вручную"].forEach(value=>{rowElement.insertCell().textContent=value;});
  });
 }catch(error){console.error("Не удалось загрузить показатели из PostgreSQL",error);}
}
async function loadTerritoryMetrics(){
 try{
  const response=await fetch("/api/metrics/territories");if(!response.ok)throw new Error(`HTTP ${response.status}`);
  territoryMetrics=await response.json();renderTerritoryMetrics();
 }catch(error){console.error("Не удалось загрузить территориальные показатели из PostgreSQL",error);}
}
function renderTerritoryMetrics(){
 const yearFilter=document.getElementById("indicatorYear"),selectedYear=yearFilter.value;
 const years=[...new Set(territoryMetrics.map(row=>String(row.year)))].sort((a,b)=>Number(b)-Number(a));
 yearFilter.innerHTML='<option value="">Все годы</option>'+years.map(year=>`<option value="${year}">${year}</option>`).join("");
 yearFilter.value=selectedYear&&years.includes(selectedYear)?selectedYear:"";
 const formatNumber=value=>value==null?"—":Number(value).toLocaleString("ru-RU");
 const selected=territoryMetrics.filter(row=>!yearFilter.value||String(row.year)===yearFilter.value);
 const latest=key=>selected.find(row=>row[key]!=null);
 const cards=[["indicatorSalary","indicatorSalaryPeriod","average_salary",value=>`${formatNumber(value)} ₽`],["indicatorUnemployment","indicatorUnemploymentPeriod","unemployment_rate",value=>`${formatNumber(value)}%`],["indicatorOutput","indicatorOutputPeriod","industrial_output",value=>`${formatNumber(value)} ₽`],["indicatorInvestments","indicatorInvestmentsPeriod","investments",value=>`${formatNumber(value)} ₽`],["indicatorEmployed","indicatorEmployedPeriod","employed_population",formatNumber],["indicatorPopulation","indicatorPopulationPeriod","population",formatNumber]];
 cards.forEach(([valueId,periodId,key,formatter])=>{
  const row=latest(key);document.getElementById(valueId).textContent=row?formatter(row[key]):"—";
  document.getElementById(periodId).textContent=row?`${row.city||"Территория не указана"}, ${row.year}`:"Нет опубликованных данных";
 });
 document.getElementById("territoryMetricsTable").innerHTML=selected.map(row=>`<tr><td>${escapeHTML(row.city||"—")}</td><td>${row.year}</td><td>${formatNumber(row.population)}</td><td>${formatNumber(row.average_salary)}</td><td>${formatNumber(row.unemployment_rate)}</td><td>${formatNumber(row.investments)}</td><td>${formatNumber(row.industrial_output)}</td><td>${formatNumber(row.employed_population)}</td></tr>`).join("");
}
function renderSources(){
 const typeFilter=document.getElementById("sourceTypeFilter"),selectedType=typeFilter.value;
 const types=[...new Set(sources.map(source=>source.source_type).filter(Boolean))].sort();
 typeFilter.innerHTML='<option value="">Все типы</option>'+types.map(type=>`<option value="${escapeHTML(type)}">${escapeHTML(type)}</option>`).join("");
 typeFilter.value=selectedType;
 const territoryFilter=document.getElementById("sourceTerritoryFilter"),selectedTerritory=territoryFilter.value;
 const territories=[...new Set(sources.flatMap(source=>source.territories||[]))].sort((a,b)=>a.localeCompare(b,"ru"));
 territoryFilter.innerHTML='<option value="">Все территории</option>'+territories.map(territory=>`<option value="${escapeHTML(territory)}">${escapeHTML(territory)}</option>`).join("");
 territoryFilter.value=selectedTerritory;
 const search=document.getElementById("sourceSearch").value.trim().toLowerCase();
 const data=sources.filter(source=>(!typeFilter.value||source.source_type===typeFilter.value)&&(!territoryFilter.value||(source.territories||[]).includes(territoryFilter.value))&&(!search||`${source.name} ${source.url} ${source.description||""}`.toLowerCase().includes(search)));
 data.sort((a,b)=>String(a[sourceSort.key]||"").localeCompare(String(b[sourceSort.key]||""),"ru",{numeric:true})*(sourceSort.direction==="asc"?1:-1));
 const pages=Math.max(1,Math.ceil(data.length/sourcePageSize));sourcePage=Math.min(sourcePage,pages);
 const pageData=data.slice((sourcePage-1)*sourcePageSize,sourcePage*sourcePageSize);
 document.getElementById("sourceTable").innerHTML=pageData.map(source=>{
  let link="—",action="";
  try{const parsed=new URL(source.url);if(["http:","https:"].includes(parsed.protocol)){link=`<a href="${escapeHTML(parsed.href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(parsed.hostname)} ↗</a>`;action=`<a class="source-action" href="${escapeHTML(parsed.href)}" target="_blank" rel="noopener noreferrer" aria-label="Открыть источник: ${escapeHTML(source.name)}" title="Открыть источник">↗</a>`;}}catch{}
  const type=source.source_type||"";
  const icon=/статист/i.test(type)?"▥":/норматив|государствен|муниципаль/i.test(type)?"▧":/официальн/i.test(type)?"◎":"◇";
  const status=/норматив|государствен|муниципаль/i.test(type)?"Используется":/официальн/i.test(type)?"Актуален":"Проверен";
  const statusClass=/официальн/i.test(type)?"source-online":"source-checked";
  return `<tr><td><span class="source-row-icon">${icon}</span></td><td><b>${escapeHTML(source.name)}</b>${source.territories?.length?`<small class="source-territories">${source.territories.map(escapeHTML).join(", ")}</small>`:""}</td><td>${escapeHTML(type||"—")}</td><td class="link">${link}</td><td>${formatDate(source.publication_date)}</td><td>${formatDate(source.access_date)}</td><td>${escapeHTML(source.description||"—")}</td><td><span class="status ${statusClass}">● ${status}</span></td><td>${action}</td></tr>`;
 }).join("");
 document.getElementById("sourceTotalCount").textContent=sources.length;
 document.getElementById("sourceFoundCount").textContent=data.length;
 document.getElementById("sourceOfficialCount").textContent=sources.filter(source=>(source.source_type||"").toLowerCase().includes("официальн")).length;
 document.getElementById("sourceStatisticsCount").textContent=sources.filter(source=>(source.source_type||"").toLowerCase().includes("статист")).length;
 document.getElementById("sourceRegulatoryCount").textContent=sources.filter(source=>/норматив|государствен|муниципаль/i.test(source.source_type||"")).length;
 renderSourcePagination(pages);
}
function renderSourcePagination(pages){
 const container=document.getElementById("sourcePagination"),button=(label,page,disabled=false,active=false)=>`<button type="button" class="source-page-btn${active?" active":""}" data-source-page="${page}" ${disabled?"disabled":""} aria-label="${label}">${label}</button>`;
 let markup=button("‹",sourcePage-1,sourcePage===1);
 for(let page=1;page<=pages;page++){
  if(page===1||page===pages||Math.abs(page-sourcePage)<=1)markup+=button(String(page),page,false,page===sourcePage);
  else if(Math.abs(page-sourcePage)===2)markup+='<span class="source-page-ellipsis">…</span>';
 }
 markup+=button("›",sourcePage+1,sourcePage===pages);
 container.innerHTML=markup;
}
async function addSource(){
 const name=prompt("Название источника");if(!name?.trim())return;
 const url=prompt("Полный URL источника (http:// или https://)");if(!url?.trim())return;
 const source_type=prompt("Тип источника","Официальный сайт предприятия");if(!source_type?.trim())return;
 const description=prompt("Описание источника","")||"";
 const response=await fetch("/api/sources",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,url,source_type,description})});
 const result=await response.json();
 if(!response.ok){toast(result.error||"Не удалось добавить источник");return;}
 await loadSources();toast("Источник добавлен в PostgreSQL");
}
async function loadSession(){
 const response=await fetch("/api/session"), data=await response.json();state.isAdmin=data.is_admin;updateAuthButton();
}
function updateAuthButton(){
 const button=document.getElementById("authButton");
 button.textContent=state.isAdmin?"● Выйти из режима администратора":"● Войти как администратор";
 button.classList.toggle("admin-active",state.isAdmin);
 document.querySelectorAll("#addIndicator,#addSource").forEach(button=>button.disabled=!state.isAdmin);
}
async function handleAuth(){
 if(state.isAdmin){await fetch("/api/logout",{method:"POST"});state.isAdmin=false;updateAuthButton();toast("Вы вышли из режима администратора");return;}
 document.getElementById("loginModal").classList.add("open");
}
function drawChart(points=employmentMetrics){
 const canvas=document.getElementById("jobsChart"),ctx=canvas.getContext("2d"),dpr=window.devicePixelRatio||1;
 const w=canvas.clientWidth,h=230;canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
 const vals=points.map(point=>Number(point.employees)),labels=points.map(point=>String(point.year));
 if(!vals.length){ctx.fillStyle="#788397";ctx.font="12px Segoe UI";ctx.fillText("Нет опубликованных данных о занятости",12,30);return;}
 const min=Math.floor(Math.min(...vals)/1000)*1000,max=Math.ceil(Math.max(...vals)/1000)*1000||1000,range=Math.max(max-min,1000);
 const pad={l:38,r:12,t:12,b:35}, iw=w-pad.l-pad.r,ih=h-pad.t-pad.b;
 ctx.strokeStyle="#edf0f4";ctx.lineWidth=1;ctx.fillStyle="#98a2b3";ctx.font="9px Segoe UI";
 for(let tick=0;tick<=4;tick++){
  const value=min+range*tick/4,y=pad.t+(4-tick)*ih/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText(Math.round(value).toLocaleString("ru-RU"),3,y+3);
 }
 ctx.strokeStyle="#2b72d6";ctx.lineWidth=2;ctx.beginPath();
 vals.forEach((v,i)=>{const x=vals.length===1?pad.l+iw/2:pad.l+i*iw/(vals.length-1),y=pad.t+(max-v)/range*ih;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
 ctx.stroke();
 vals.forEach((v,i)=>{const x=vals.length===1?pad.l+iw/2:pad.l+i*iw/(vals.length-1),y=pad.t+(max-v)/range*ih;ctx.fillStyle="#fff";ctx.strokeStyle="#2b72d6";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();ctx.stroke();if(i%2===0||vals.length<3){ctx.fillStyle="#98a2b3";ctx.fillText(labels[i],x-20,h-10)}});
}
function exportCSV(){
 const data=filtered(), header=["Предприятие","Отрасль","Город","Статус","Работники","Выручка, млн ₽"];
 const csv=[header,...data.map(c=>[c.name,c.industry,c.city,c.status,c.workers,c.revenue])].map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(";")).join("\n");
 const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="predpriyatiya_novotroitsk.csv";a.click();URL.revokeObjectURL(url);toast("CSV-файл подготовлен");
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-section]");if(nav)navigate(nav.dataset.section);
 const detail=e.target.closest(".company-details");if(detail)showCompany(detail.dataset.name);
});
document.getElementById("modalClose").onclick=()=>document.getElementById("modal").classList.remove("open");
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")e.currentTarget.classList.remove("open")};
document.getElementById("mobileMenu").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("collapseBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("collapsed");
document.getElementById("exportCsv").onclick=exportCSV;
document.getElementById("addIndicator").onclick=async()=>{
 const name=prompt("Название показателя");if(!name?.trim())return;
 const annual_values=["2023","2024","2025","2026"].map(year=>prompt(`Значение за ${year}`,"")||"—");
 const response=await fetch("/api/indicators",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,annual_values})});
 const result=await response.json();if(!response.ok){toast(result.error||"Не удалось добавить показатель");return;}
 await loadIndicators();toast("Показатель сохранён в PostgreSQL");
};
document.getElementById("addSource").onclick=addSource;
document.getElementById("authButton").onclick=handleAuth;
document.getElementById("loginClose").onclick=()=>document.getElementById("loginModal").classList.remove("open");
document.getElementById("loginForm").onsubmit=async e=>{
 e.preventDefault();const response=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({login:document.getElementById("loginName").value,password:document.getElementById("loginPassword").value})});
 if(!response.ok){document.getElementById("loginError").textContent="Неверный логин или пароль";return;}
 state.isAdmin=true;updateAuthButton();document.getElementById("loginModal").classList.remove("open");toast("Режим суперпользователя включён");
};
document.getElementById("applyMapFilters").onclick=applyMapFilters;
document.getElementById("mapReset").onclick=()=>{["mapCity","mapIndustry","mapStatus","mapSearch"].forEach(id=>document.getElementById(id).value="");showAllMapObjects=false;renderMap()};
document.getElementById("mapShowAll").onclick=()=>{showAllMapObjects=!showAllMapObjects;renderMapObjects()};
document.getElementById("sourceTypeFilter").onchange=()=>{sourcePage=1;renderSources()};
document.getElementById("sourceTerritoryFilter").onchange=()=>{sourcePage=1;renderSources()};
document.getElementById("sourceSearch").oninput=()=>{sourcePage=1;renderSources()};
document.getElementById("sourceReset").onclick=()=>{document.getElementById("sourceTypeFilter").value="";document.getElementById("sourceTerritoryFilter").value="";document.getElementById("sourceSearch").value="";sourcePage=1;renderSources()};
document.getElementById("sourcePageSize").onchange=e=>{sourcePageSize=Number(e.target.value);sourcePage=1;renderSources()};
document.getElementById("sourcePagination").onclick=e=>{const button=e.target.closest("[data-source-page]");if(!button||button.disabled)return;sourcePage=Number(button.dataset.sourcePage);renderSources()};
document.querySelectorAll("[data-source-sort]").forEach(button=>button.onclick=()=>{const key=button.dataset.sourceSort;sourceSort={key,direction:sourceSort.key===key&&sourceSort.direction==="asc"?"desc":"asc"};sourcePage=1;renderSources()});
document.getElementById("indicatorYear").onchange=renderTerritoryMetrics;
window.addEventListener("resize",()=>drawChart(employmentMetrics));
loadCompanies().then(async()=>{
 fillIndustries();fillMapIndustries();fillTerritories();bindFilters();renderTables();updateDashboardSummary();updateMapStats();renderMap();renderDashboardMap();await Promise.all([loadSession(),loadSources(),loadEmploymentMetrics(),loadIndicators(),loadTerritoryMetrics()]);
});