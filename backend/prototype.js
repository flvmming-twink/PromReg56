/* ============ ДАННЫЕ ============ */
const CITIES=[
  {id:1,name:'Новотроицк',lat:51.203,lng:58.3267,major:true,type:'Город',pop:82000},
  {id:2,name:'Орск',lat:51.2049,lng:58.5668,major:true,type:'Город',pop:189000},
  {id:3,name:'Оренбург',lat:51.7682,lng:55.0969,major:true,type:'Город',pop:550000},
  {id:4,name:'Гай',lat:51.4666,lng:58.4552,type:'Город',pop:33000},
  {id:5,name:'Бузулук',lat:52.7885,lng:52.2539,major:true,type:'Город',pop:88000},
  {id:6,name:'Медногорск',lat:51.40494,lng:57.58031,type:'Город',pop:23000},
  {id:7,name:'Переволоцкий',type:'Район',pop:27000},
  {id:8,name:'Ясный',lat:51.0406,lng:59.8736,type:'Город',pop:16000},
  {id:9,name:'Сорочинск',lat:52.4266,lng:53.1586,type:'Город',pop:27000},
  {id:10,name:'Соль-Илецк',lat:51.1636,lng:54.9948,type:'Город',pop:45000},
  {id:11,name:'Светлый',type:'Район',pop:11000},
  {id:12,name:'Кувандык',lat:51.4786,lng:57.3536,type:'Город',pop:22000},
  {id:13,name:'Тюльган',lat:52.3408,lng:56.1694,type:'Район',pop:18000},
  {id:14,name:'Бугуруслан',lat:53.6568,lng:52.4383,type:'Город',pop:48000}
];
const INDUSTRIES=[
  {id:1,name:'Металлургия и металлообработка',color:'#2563eb'},
  {id:2,name:'Химическая промышленность',color:'#7c3aed'},
  {id:3,name:'Машиностроение',color:'#0891b2'},
  {id:4,name:'Производство стройматериалов',color:'#d97706'},
  {id:5,name:'Пищевая промышленность',color:'#16a34a'},
  {id:6,name:'Энергетика',color:'#dc2626'},
  {id:7,name:'Добывающая промышленность',color:'#ea580c'},
  {id:8,name:'Прочие отрасли',color:'#6b7280'}
];

const ENTERPRISES=[
  {id:1,name:'АО «Уральская Сталь»',inn:'5607019523',city_id:1,industry_id:1,status:'Действующее',site:'www.uralsteel.com',emp:7812,rev:142.7,color:'red',logo:'US'},
  {id:2,name:'ООО «НСплав»',inn:'5607141530',city_id:1,industry_id:2,status:'Действующее',emp:1240,rev:18.6,color:'blue',logo:'НС'},
  {id:3,name:'ООО «Механический завод»',city_id:1,industry_id:3,status:'Действующее',site:'www.mz-novotroitsk.ru',emp:850,rev:6.3,color:'amber',logo:'МЗ'},
  {id:4,name:'ПАО «Орскнефтеоргсинтез»',inn:'5615002700',city_id:2,industry_id:2,status:'Действующее',site:'www.ons.ru',emp:5420,rev:128.1,color:'red',logo:'ОН'},
  {id:5,name:'ООО «Оренбургский пропант»',inn:'5607142044',city_id:1,industry_id:7,status:'Действующее',site:'www.proppant.ru',emp:620,rev:11.4,color:'purple',logo:'ОП'},
  {id:6,name:'АО «Оренбургские минералы»',inn:'5618000027',city_id:8,industry_id:7,status:'Действующее',site:'www.orenmin.ru',emp:3250,rev:37.8,color:'amber',logo:'ОМ'},
  {id:7,name:'АО «Гайский ГОК»',inn:'5604000700',city_id:4,industry_id:7,status:'Действующее',site:'www.gok-gai.ru',emp:4980,rev:59.1,color:'red',logo:'ГГ'},
  {id:8,name:'ООО «МКМ-ОРЕНБУРЖЬЕ»',city_id:3,industry_id:1,status:'Действующее',emp:1120,rev:9.7,color:'blue',logo:'МК'},
  {id:9,name:'АО «НЗХС»',city_id:1,industry_id:2,status:'Действующее',site:'www.nzhs.ru',emp:890,rev:14.2,color:'amber',logo:'НЗ'},
  {id:10,name:'ООО «Южно-Уральская ГПК»',city_id:1,industry_id:4,status:'Инвестиционный проект',site:'www.ugpk.ru',emp:430,rev:5.6,color:'red',logo:'ЮУ'},
  {id:11,name:'АО «ОРМЕТ»',inn:'5616006746',city_id:2,industry_id:7,status:'Действующее',site:'www.or-met.ru',emp:1850,rev:8.5,color:'blue',logo:'ОР'},
  {id:14,name:'ООО «Сорочинский МЭЗ»',city_id:9,industry_id:5,status:'Действующее',emp:720,rev:12.3,color:'green',logo:'СМ'},
  {id:55,name:'ООО «ММСК»',inn:'5606001611',city_id:6,industry_id:1,status:'Действующее',emp:1990,rev:44.0,color:'red',logo:'ММ'},
  {id:56,name:'АО «МЭЗ «Уралэлектро»',inn:'5606000223',city_id:6,industry_id:3,status:'Действующее',site:'www.uralelectro.ru',emp:700,rev:1.7,color:'blue',logo:'УЭ'},
  {id:62,name:'АО «Композит Групп»',inn:'5653000012',city_id:5,industry_id:3,status:'Действующее',emp:890,rev:7.4,color:'amber',logo:'КГ'},
  {id:68,name:'АО «Оренбургнефть»',inn:'5612002469',city_id:5,industry_id:7,status:'Действующее',emp:4230,rev:98.2,color:'red',logo:'ОН'},
  {id:70,name:'АО «РИФАР»',inn:'5604009196',city_id:4,industry_id:1,status:'Действующее',site:'www.rifar.ru',emp:980,rev:6.7,color:'blue',logo:'РФ'},
  {id:76,name:'ООО «Газпромнефть-Оренбург»',inn:'5610218014',city_id:3,industry_id:7,status:'Действующее',emp:2870,rev:84.7,color:'red',logo:'ГО'},
  {id:97,name:'ООО «АСТОН-Поволжье»',inn:'5603048717',city_id:5,industry_id:5,status:'Действующее',site:'www.buzuluk.aston.ru',emp:490,rev:1.5,color:'green',logo:'АП'},
  {id:153,name:'СПК «Птицефабрика Гайская»',inn:'5626008809',city_id:4,industry_id:5,status:'Действующее',emp:1450,rev:3.5,color:'amber',logo:'ПГ'},
  {id:165,name:'ООО «РН-БГПП»',inn:'5603045522',city_id:5,industry_id:2,status:'Действующее',emp:760,rev:22.6,color:'blue',logo:'РБ'},
  {id:171,name:'ООО «Бузулукское молоко»',inn:'5603017010',city_id:5,industry_id:5,status:'Действующее',emp:467,rev:2.4,color:'green',logo:'БМ'},
  {id:172,name:'ООО «ТМК НГС-Бузулук»',inn:'5603011770',city_id:5,industry_id:3,status:'Действующее',emp:477,rev:1.6,color:'blue',logo:'ТМ'},
  {id:101,name:'АО «Криолит»',city_id:12,industry_id:1,status:'Производство остановлено',emp:0,rev:0,color:'amber',logo:'КР'},
  {id:63,name:'ООО «ТЭМЗ»',inn:'5650005291',city_id:13,industry_id:3,status:'Действующее',site:'www.temz.ru',emp:127,rev:0.41,color:'purple',logo:'ТЭ'},
  {id:138,name:'ООО «НПК «Фильтр»',inn:'6319185935',city_id:14,industry_id:3,status:'Действующее',site:'www.npk-filtr.ru',emp:280,rev:0.9,color:'amber',logo:'НФ'},
  {id:108,name:'ООО «Руссоль» — ЦДПС «Илецксоль»',city_id:10,industry_id:7,status:'Действующее',site:'www.russalt.ru',emp:530,rev:18.4,color:'blue',logo:'РС'}
];

const SOURCES=[
  {id:1,name:'Программа развития МО город Новотроицк',url:'www.novotroitsk.orb.ru',type:'Нормативный документ',pub:'15.03.2024',acc:'22.05.2024',desc:'Стратегический документ развития города',status:'warn',statusText:'Используется'},
  {id:2,name:'АО «Уральская Сталь» — официальный сайт',url:'www.uralsteel.com',type:'Официальный сайт',pub:'20.05.2024',acc:'22.05.2024',desc:'Информация о деятельности предприятия',status:'ok',statusText:'Актуален'},
  {id:3,name:'АО «Новотроицкий цементный завод» — сайт',url:'www.nzhs.ru',type:'Официальный сайт',pub:'18.05.2024',acc:'22.05.2024',desc:'Сведения о производстве и проектах',status:'ok',statusText:'Актуален'},
  {id:4,name:'ООО «Оренбургский пропант» — сайт',url:'www.proppant.ru',type:'Официальный сайт',pub:'16.05.2024',acc:'21.05.2024',desc:'Информация о продукции и инвестпроектах',status:'ok',statusText:'Используется'},
  {id:5,name:'АО «НЗХС» — официальный сайт',url:'www.nzhs.ru',type:'Официальный сайт',pub:'19.05.2024',acc:'22.05.2024',desc:'Сведения о деятельности предприятия',status:'ok',statusText:'Актуален'},
  {id:6,name:'Росстат — статистические данные',url:'www.gks.ru',type:'Отчётность',pub:'10.05.2024',acc:'21.05.2024',desc:'Официальная статистическая информация',status:'ok',statusText:'Используется'},
  {id:7,name:'Правительство Оренбургской области',url:'www.orenburg-gov.ru',type:'Официальный сайт',pub:'17.05.2024',acc:'22.05.2024',desc:'Нормативные документы и показатели',status:'ok',statusText:'Актуален'},
  {id:8,name:'Администрация города Орска',url:'www.orsk-adm.ru',type:'Официальный сайт',pub:'12.05.2024',acc:'21.05.2024',desc:'Социально-экономическая информация',status:'info',statusText:'Проверен'},
  {id:9,name:'Инвестиционный портал Оренбургской области',url:'www.orenburg-invest.ru',type:'Официальный сайт',pub:'14.05.2024',acc:'22.05.2024',desc:'Инвестпроекты и меры поддержки',status:'ok',statusText:'Используется'},
  {id:10,name:'ЕМИСС — государственная статистическая система',url:'www.fedstat.ru',type:'Отчётность',pub:'11.05.2024',acc:'21.05.2024',desc:'Показатели социально-экономического развития',status:'ok',statusText:'Актуален'}
];

let USERS=[
  {id:1,name:'Михаил Фукс',email:'m.fuks@example.ru',role:'admin',last:'сегодня, 12:47',actions:1247,status:'active'},
  {id:2,name:'Анна Иванова',email:'a.ivanova@example.ru',role:'Администратор',last:'вчера, 18:20',actions:542,status:'active'},
  {id:3,name:'Пётр Сидоров',email:'p.sidorov@example.ru',role:'Редактор',last:'2 дня назад',actions:183,status:'active'},
  {id:4,name:'Гостевой доступ',email:'без авторизации',role:'Просмотр',last:'—',actions:0,status:'public'}
];

let REPORTS=[];

let AUDIT=[
  {name:'Михаил Фукс',role:'SU',action:'Добавил предприятие «ООО "Восточная сталь"»',time:'сегодня, 12:47'},
  {name:'Михаил Фукс',role:'SU',action:'Обновил показатели Новотроицка за 2024',time:'сегодня, 11:22'},
  {name:'Анна Иванова',role:'AD',action:'Сформировала отчет «Показатели Q1 2024»',time:'вчера, 17:15'},
  {name:'Михаил Фукс',role:'SU',action:'Экспортировал реестр предприятий в Excel',time:'вчера, 10:05'},
  {name:'Пётр Сидоров',role:'ED',action:'Изменил статус АО «Криолит»',time:'12.05.2024, 15:32'}
];

/* ============ АВТОРИЗАЦИЯ ============ */
const AUTH = {
  currentUser: null
};
let notificationsEnabled=true;

async function loadAuth(){
  const response=await fetch('/api/session');
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const state=await response.json();
  AUTH.currentUser=state.is_admin?{login:state.login,name:state.login,role:'admin'}:null;
}
function isAdmin(){return Boolean(AUTH.currentUser && AUTH.currentUser.role === 'admin');}

function applyAuthUI(){
  const admin = isAdmin();
  document.body.classList.toggle('is-admin', admin);
  if(admin){
    $('#userAvatar').innerHTML = 'МФ<span class="crown">👑</span>';
    $('#userName').textContent = 'Михаил Фукс';
    $('#userRole').textContent = 'Суперпользователь';
    $('#userRole').style.color = 'var(--purple)';
    $('#userRole').style.fontWeight = '600';
    $('#menuRoleInfo').textContent = '👑 Полный доступ ко всем функциям';
    $('#reportForm').style.display = 'block';
    $('#menuLoginBtn').style.display = 'none';
    $('#menuAdminPanelBtn').style.display = 'flex';
    $('#menuLogoutBtn').style.display = 'flex';
    $('#adminBanner').style.display = 'flex';
    $('#entAddBtn').style.display = 'flex';
    const srcAdd=$('#srcAddBtn'); if(srcAdd)srcAdd.style.display='flex';
    $('#logoutLabel').textContent = 'Выйти';
  }else{
    $('#userAvatar').innerHTML = 'Г';
    $('#userName').textContent = 'Гость';
    $('#userRole').textContent = 'Гостевой доступ';
    $('#userRole').style.color = 'var(--muted)';
    $('#userRole').style.fontWeight = '400';
    $('#menuRoleInfo').textContent = 'Режим просмотра без авторизации';
    $('#reportForm').style.display = 'none';
    $('#menuLoginBtn').style.display = 'flex';
    $('#menuAdminPanelBtn').style.display = 'none';
    $('#menuLogoutBtn').style.display = 'none';
    $('#adminBanner').style.display = 'none';
    $('#entAddBtn').style.display = 'none';
    const srcAdd=$('#srcAddBtn'); if(srcAdd)srcAdd.style.display='none';
    $('#logoutLabel').textContent = 'На главную';
  }
  renderEnterprises();
  renderSources();
  renderReports();
  renderUsers();
  renderAudit();
}

async function login(){
  const u=$('#loginUsername').value.trim();
  const p=$('#loginPassword').value;
  const err=$('#loginError');
  try{
    const response=await fetch('/api/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({login:u,password:p})
    });
    if(!response.ok){
      err.textContent=response.status===401?'Неверный логин или пароль':'Не удалось выполнить вход';
      err.classList.add('show');
      $('#loginPassword').value='';
      $('#loginPassword').focus();
      return;
    }
    const state=await response.json();
    AUTH.currentUser={login:state.login,name:state.login,role:'admin'};
    applyAuthUI();closeLogin();
    err.classList.remove('show');
    toast('Вход администратора выполнен','purple');
  }catch(error){
    console.error('Не удалось выполнить вход администратора',error);
    err.textContent='Не удалось подключиться к серверу';
    err.classList.add('show');
  }
}
async function logout(){
  if(!AUTH.currentUser)return;
  try{
    const response=await fetch('/api/logout',{method:'POST'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    AUTH.currentUser=null;
    applyAuthUI();
    switchPage('glavnaya');
    toast('Вы вышли из системы');
  }catch(error){
    console.error('Не удалось завершить сеанс администратора',error);
    toast('Не удалось выйти из системы','error');
  }
}
function openLogin(){$('#loginOverlay').classList.add('show');setTimeout(()=>$('#loginUsername').focus(),100);}
function closeLogin(){$('#loginOverlay').classList.remove('show');$('#loginError').classList.remove('show');$('#loginUsername').value='';$('#loginPassword').value='';}

function addAudit(name,role,action){
  AUDIT.unshift({name,role,action,time:'только что'});
  if(AUDIT.length>10)AUDIT.pop();
  renderAudit();
}

/* ============ УТИЛИТЫ ============ */
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const cityById=id=>CITIES.find(c=>c.id===id);
const indById=id=>INDUSTRIES.find(i=>i.id===id);
const fmtNum=n=>n==null?'—':n.toLocaleString('ru-RU');

/* ============ НАВИГАЦИЯ ============ */
function switchPage(page){
  if(page === 'admin' && !isAdmin()){toast('Требуется вход администратора','error');openLogin();return;}
  $$('.nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  $$('.page-pane').forEach(p=>p.classList.remove('active'));
  const t=document.getElementById('page-'+page);
  if(t)t.classList.add('active');
  if(page==='karta' && window._map) setTimeout(()=>window._map.invalidateSize(),100);
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('.nav-item[data-page]').forEach(b=>b.addEventListener('click',()=>switchPage(b.dataset.page)));

/* ============ ПРЕДПРИЯТИЯ ============ */
const entState={search:'',city:'',industry:'',status:'',page:1,perPage:10};
function initEnterprises(){
  const cities=[...new Set(ENTERPRISES.map(e=>e.city_id))].map(cityById).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name));
  cities.forEach(c=>$('#entCityFilter').insertAdjacentHTML('beforeend',`<option value="${c.id}">${c.name}</option>`));
  INDUSTRIES.filter(i=>ENTERPRISES.some(e=>e.industry_id===i.id)).forEach(i=>$('#entIndFilter').insertAdjacentHTML('beforeend',`<option value="${i.id}">${i.name}</option>`));
  let t;
  $('#entSearch').addEventListener('input',e=>{clearTimeout(t);const v=e.target.value;t=setTimeout(()=>{entState.search=v;entState.page=1;renderEnterprises();},180);});
  $('#entCityFilter').addEventListener('change',e=>{entState.city=e.target.value;entState.page=1;renderEnterprises();});
  $('#entIndFilter').addEventListener('change',e=>{entState.industry=e.target.value;entState.page=1;renderEnterprises();});
  $('#entStatusFilter').addEventListener('change',e=>{entState.status=e.target.value;entState.page=1;renderEnterprises();});
  $('#entPerPage').addEventListener('change',e=>{entState.perPage=+e.target.value;entState.page=1;renderEnterprises();});
  $('#entReset').addEventListener('click',()=>{
    Object.assign(entState,{search:'',city:'',industry:'',status:'',page:1});
    $('#entSearch').value='';$('#entCityFilter').value='';$('#entIndFilter').value='';$('#entStatusFilter').value='';
    renderEnterprises();toast('Фильтры сброшены');
  });
  $('#entAddBtn').addEventListener('click',openEnterpriseModal);
}
function getFilteredEnterprises(){
  let list=ENTERPRISES.slice();
  if(entState.search){const q=entState.search.toLowerCase();list=list.filter(e=>(e.name||'').toLowerCase().includes(q)||(e.inn||'').toLowerCase().includes(q));}
  if(entState.city)list=list.filter(e=>e.city_id===+entState.city);
  if(entState.industry)list=list.filter(e=>e.industry_id===+entState.industry);
  if(entState.status)list=list.filter(e=>e.status===entState.status);
  return list;
}
function renderEnterprises(){
  const list=getFilteredEnterprises();
  const pages=Math.max(1,Math.ceil(list.length/entState.perPage));
  if(entState.page>pages)entState.page=pages;
  const start=(entState.page-1)*entState.perPage;
  const slice=list.slice(start,start+entState.perPage);
  $('#entFound').textContent=list.length;
  $('#entStatTotal').textContent=ENTERPRISES.length;
  $('#entStatActive').textContent=ENTERPRISES.filter(e=>e.status==='Действующее').length;
  $('#entStatInv').textContent=ENTERPRISES.filter(e=>e.status==='Инвестиционный проект').length;
  const admin = isAdmin();
  $('#entTbody').innerHTML=slice.length?slice.map((e,i)=>{
    const c=cityById(e.city_id),ind=indById(e.industry_id);
    const cls=e.status==='Действующее'?'ok':e.status.includes('Инвест')?'info':'err';
    return `<tr data-eid="${e.id}">
      <td class="cell-num">${start+i+1}</td>
      <td><div class="cell-name"><div class="cell-logo ${e.color||'blue'}">${e.logo||'?'}</div>${e.name}</div></td>
      <td class="cell-muted">${ind?ind.name:'—'}</td>
      <td class="cell-muted">${c?c.name:'—'}</td>
      <td><span class="status ${cls}">${e.status}</span></td>
      <td class="cell-muted">${e.emp?fmtNum(e.emp):'—'}</td>
      <td class="cell-muted">${e.rev?e.rev.toFixed(1).replace('.',',')+' млрд ₽':'—'}</td>
      <td>${e.site?`<a class="link" href="https://${e.site}" target="_blank" onclick="event.stopPropagation()">${e.site}</a>`:'—'}</td>
      ${admin?`<td class="admin-only-cell"><div class="row-actions"><button class="row-btn" title="Редактировать" onclick="event.stopPropagation();editEnterprise(${e.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg></button><button class="row-btn danger" title="Удалить" onclick="event.stopPropagation();deleteEnterprise(${e.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button></div></td>`:''}
      <td><button class="row-btn" onclick="event.stopPropagation()"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg></button></td>
    </tr>`;
  }).join(''):`<tr class="empty-row"><td colspan="${admin?10:9}">Предприятия не найдены</td></tr>`;
  renderPager($('#entPager'),entState,list.length,renderEnterprises);
}
function deleteEnterprise(id){
  if(!isAdmin())return;
  const e=ENTERPRISES.find(x=>x.id===id);
  if(!e)return;
  if(confirm(`Удалить предприятие «${e.name}»?`)){
    const idx=ENTERPRISES.indexOf(e);
    if(idx>-1)ENTERPRISES.splice(idx,1);
    renderEnterprises();renderMapMarkers();renderMapTable();
    toast('Предприятие удалено','error');
    addAudit('Михаил Фукс','SU',`Удалил предприятие «${e.name}»`);
  }
}
$('#entTbody').addEventListener('click',e=>{
  const row=e.target.closest('tr[data-eid]');
  if(!row)return;
  const id=+row.dataset.eid;
  switchPage('karta');
  setTimeout(()=>focusOnEnterprise(id),200);
});

/* ============ МОДАЛКА ПРЕДПРИЯТИЯ ============ */
let editingEntId=null;
function openEnterpriseModal(id){
  if(!isAdmin())return;
  editingEntId=id||null;
  $('#entModalTitle').textContent=id?'Редактировать предприятие':'Добавить предприятие';
  const indSel=$('#fEntInd'),citySel=$('#fEntCity');
  indSel.innerHTML='<option value="">— выберите —</option>';
  INDUSTRIES.forEach(i=>indSel.insertAdjacentHTML('beforeend',`<option value="${i.id}">${i.name}</option>`));
  citySel.innerHTML='<option value="">— выберите —</option>';
  CITIES.forEach(c=>citySel.insertAdjacentHTML('beforeend',`<option value="${c.id}">${c.name}</option>`));
  if(id){
    const e=ENTERPRISES.find(x=>x.id===id);if(!e)return;
    $('#fEntName').value=e.name; $('#fEntInn').value=e.inn||'';
    $('#fEntInd').value=e.industry_id; $('#fEntCity').value=e.city_id;
    $('#fEntStatus').value=e.status; $('#fEntEmp').value=e.emp||'';
    $('#fEntRev').value=e.rev||''; $('#fEntSite').value=e.site||'';
  }else{
    ['fEntName','fEntInn','fEntEmp','fEntRev','fEntSite'].forEach(i=>$('#'+i).value='');
    $('#fEntStatus').value='Действующее';
  }
  $('#entFormError').classList.remove('show');
  $('#entModalOverlay').classList.add('show');
}
function closeEntModal(){$('#entModalOverlay').classList.remove('show');}
function editEnterprise(id){openEnterpriseModal(id);}
$('#entModalClose').addEventListener('click',closeEntModal);
$('#entModalOverlay').addEventListener('click',e=>{if(e.target.id==='entModalOverlay')closeEntModal();});
$('#entSaveBtn').addEventListener('click',()=>{
  const name=$('#fEntName').value.trim();
  const ind=$('#fEntInd').value;
  const city=$('#fEntCity').value;
  if(!name||!ind||!city){$('#entFormError').classList.add('show');return;}
  const data={
    name, inn:$('#fEntInn').value.trim(), industry_id:+ind, city_id:+city,
    status:$('#fEntStatus').value, emp:+$('#fEntEmp').value||null,
    rev:+$('#fEntRev').value||null, site:$('#fEntSite').value.trim()||null,
    color:['red','blue','amber','purple','green'][Math.floor(Math.random()*5)],
    logo:name.slice(0,2).toUpperCase()
  };
  if(editingEntId){
    const e=ENTERPRISES.find(x=>x.id===editingEntId);
    Object.assign(e,data);
    toast('Предприятие обновлено','success');
    addAudit('Михаил Фукс','SU',`Обновил предприятие «${name}»`);
  }else{
    const newId=Math.max(...ENTERPRISES.map(e=>e.id),0)+1;
    ENTERPRISES.push({id:newId,...data});
    toast('Предприятие добавлено','success');
    addAudit('Михаил Фукс','SU',`Добавил предприятие «${name}»`);
  }
  closeEntModal();
  renderEnterprises();renderMapMarkers();renderMapTable();
});

/* ============ ИСТОЧНИКИ ============ */
const srcState={search:'',type:'',page:1,perPage:10};
function initSources(){
  let t;
  $('#srcSearch').addEventListener('input',e=>{clearTimeout(t);const v=e.target.value;t=setTimeout(()=>{srcState.search=v;srcState.page=1;renderSources();},180);});
  $('#srcTypeFilter').addEventListener('change',e=>{srcState.type=e.target.value;srcState.page=1;renderSources();});
  $('#srcPerPage').addEventListener('change',e=>{srcState.perPage=+e.target.value;srcState.page=1;renderSources();});
  $('#srcReset').addEventListener('click',()=>{
    Object.assign(srcState,{search:'',type:'',page:1});
    $('#srcSearch').value='';$('#srcTypeFilter').value='';
    renderSources();toast('Фильтры сброшены');
  });
}
function getFilteredSources(){
  let list=SOURCES.slice();
  if(srcState.search){const q=srcState.search.toLowerCase();list=list.filter(s=>(s.name||'').toLowerCase().includes(q)||(s.url||'').toLowerCase().includes(q));}
  if(srcState.type)list=list.filter(s=>s.type===srcState.type);
  return list;
}
function renderSources(){
  const list=getFilteredSources();
  const pages=Math.max(1,Math.ceil(list.length/srcState.perPage));
  if(srcState.page>pages)srcState.page=pages;
  const start=(srcState.page-1)*srcState.perPage;
  const slice=list.slice(start,start+srcState.perPage);
  $('#srcFound').textContent=list.length;
  $('#srcStatTotal').textContent=SOURCES.length;
  $('#srcStatSites').textContent=SOURCES.filter(s=>s.type==='Официальный сайт').length;
  $('#srcStatStat').textContent=SOURCES.filter(s=>s.type==='Отчётность').length;
  $('#srcStatDocs').textContent=SOURCES.filter(s=>s.type==='Нормативный документ').length;
  const admin=isAdmin();
  $('#srcTbody').innerHTML=slice.length?slice.map(s=>`
    <tr data-sid="${s.id}" style="cursor:pointer;">
      <td><div class="cell-name">${s.name}</div></td>
      <td class="cell-muted">${s.type}</td>
      <td><a class="link" href="https://${s.url}" target="_blank" onclick="event.stopPropagation()">${s.url} ↗</a></td>
      <td class="cell-muted">${s.pub}</td>
      <td class="cell-muted">${s.acc}</td>
      <td class="cell-muted" style="max-width:260px;">${s.desc}</td>
      <td><span class="status ${s.status}">${s.statusText}</span></td>
      ${admin?`<td class="admin-only-cell"><div class="row-actions"><button class="row-btn" onclick="event.stopPropagation();toast('Редактирование источника','purple')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg></button><button class="row-btn danger" onclick="event.stopPropagation();deleteSource(${s.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button></div></td>`:''}
    </tr>
  `).join(''):`<tr class="empty-row"><td colspan="${admin?8:7}">Источники не найдены</td></tr>`;
  renderPager($('#srcPager'),srcState,list.length,renderSources);
}
function deleteSource(id){
  if(!isAdmin())return;
  const s=SOURCES.find(x=>x.id===id);if(!s)return;
  if(confirm(`Удалить источник «${s.name}»?`)){
    const idx=SOURCES.indexOf(s);if(idx>-1)SOURCES.splice(idx,1);
    renderSources();toast('Источник удалён','error');
    addAudit('Михаил Фукс','SU',`Удалил источник «${s.name}»`);
  }
}
$('#srcTbody').addEventListener('click',e=>{
  const row=e.target.closest('tr[data-sid]');if(!row)return;
  const s=SOURCES.find(x=>x.id===+row.dataset.sid);if(!s)return;
  $('#modalTitle').textContent=s.name;
  $('#modalDetails').innerHTML=`
    <div class="detail-row"><span class="lbl">Тип источника</span><span class="val">${s.type}</span></div>
    <div class="detail-row"><span class="lbl">Ссылка</span><span class="val"><a href="https://${s.url}" target="_blank" style="color:var(--blue);">${s.url}</a></span></div>
    <div class="detail-row"><span class="lbl">Публикация</span><span class="val">${s.pub}</span></div>
    <div class="detail-row"><span class="lbl">Обращение</span><span class="val">${s.acc}</span></div>
    <div class="detail-row"><span class="lbl">Статус</span><span class="val"><span class="status ${s.status}">${s.statusText}</span></span></div>`;
  $('#modalDesc').textContent=s.desc;
  $('#overlay').classList.add('show');
});
$('#modalClose').addEventListener('click',()=>$('#overlay').classList.remove('show'));
$('#overlay').addEventListener('click',e=>{if(e.target.id==='overlay')$('#overlay').classList.remove('show');});

/* ============ ПАГИНАЦИЯ ============ */
function renderPager(container,state,total,onChange){
  const pages=Math.max(1,Math.ceil(total/state.perPage));
  if(state.page>pages)state.page=pages;
  let h=`<button class="pg" data-nav="prev" ${state.page===1?'disabled':''}>‹</button>`;
  let nums;
  if(pages<=7)nums=[...Array(pages)].map((_,i)=>i+1);
  else if(state.page<=4)nums=[1,2,3,4,5,'...',pages];
  else if(state.page>=pages-3)nums=[1,'...',pages-4,pages-3,pages-2,pages-1,pages];
  else nums=[1,'...',state.page-1,state.page,state.page+1,'...',pages];
  nums.forEach(n=>{
    if(n==='...')h+=`<span class="pg dots">…</span>`;
    else h+=`<button class="pg ${n===state.page?'active':''}" data-page="${n}">${n}</button>`;
  });
  h+=`<button class="pg" data-nav="next" ${state.page===pages?'disabled':''}>›</button>`;
  container.innerHTML=h;
  container.querySelectorAll('.pg').forEach(btn=>{
    btn.addEventListener('click',()=>{
      if(btn.classList.contains('dots'))return;
      let p=state.page;
      if(btn.dataset.nav==='prev')p--;
      else if(btn.dataset.nav==='next')p++;
      else if(btn.dataset.page)p=+btn.dataset.page;
      if(p!==state.page){state.page=p;onChange();}
    });
  });
}

/* ============ ГРАФИКИ SVG ============ */
function lineChart(series,opts){
  opts=opts||{};
  const w=520,h=200,pad={l:50,r:14,t:14,b:26};
  const allVals=series.flatMap(s=>s.data.map(d=>d.y));
  const minY=Math.min(...allVals),maxY=Math.max(...allVals);
  const span=maxY-minY||1;
  const y0=minY-span*.08,y1=maxY+span*.08;
  const xs=series[0].data.map(d=>d.x);
  const stepX=xs.length>1?(w-pad.l-pad.r)/(xs.length-1):0;
  const scaleY=v=>pad.t+(1-(v-y0)/(y1-y0))*(h-pad.t-pad.b);
  const scaleX=i=>pad.l+i*stepX;
  let grid='',yLabels='';
  for(let i=0;i<=4;i++){
    const y=pad.t+(i/4)*(h-pad.t-pad.b);
    grid+=`<line x1="${pad.l}" y1="${y}" x2="${w-pad.r}" y2="${y}" stroke="#e5e7eb" stroke-dasharray="3 3"/>`;
    yLabels+=`<text x="${pad.l-6}" y="${y+3}" text-anchor="end" font-size="10" fill="#9ca3af">${Math.round(y1-(i/4)*(y1-y0))}</text>`;
  }
  const xLabels=xs.map((x,i)=>`<text x="${scaleX(i)}" y="${h-6}" text-anchor="middle" font-size="11" fill="#9ca3af">${x}</text>`).join('');
  let lines='';
  series.forEach(s=>{
    lines+=`<polyline points="${s.data.map((d,i)=>`${scaleX(i)},${scaleY(d.y)}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2.2"/>`;
    s.data.forEach((d,i)=>{lines+=`<circle cx="${scaleX(i)}" cy="${scaleY(d.y)}" r="3.5" fill="#fff" stroke="${s.color}" stroke-width="2"/>`;});
  });
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}">${grid}${yLabels}${xLabels}${lines}</svg>`;
}
function escapeChartText(value){
  return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function barChart(items,options={}){
  if(!items.length)return '<div class="analytics-empty">Нет данных для выбранных фильтров</div>';
  const w=520,pad={l:options.labelWidth||158,r:options.valueWidth||50,t:10,b:14};
  const barH=options.barHeight||17,gap=options.gap||5;
  const h=pad.t+items.length*(barH+gap)-gap+pad.b;
  const maxV=Math.max(...items.map(i=>Number(i.v)||0),1);
  const maxBarWidth=w-pad.l-pad.r;
  let bars='';
  items.forEach((it,i)=>{
    const y=pad.t+i*(barH+gap);
    const wBar=Math.max(0,(Number(it.v)||0)/maxV*maxBarWidth);
    const label=String(it.n);
    const shortLabel=label.length>(options.labelLimit||22)?`${label.slice(0,(options.labelLimit||22)-1)}…`:label;
    const value=options.formatValue?options.formatValue(it.v):String(it.v);
    bars+=`<g><title>${escapeChartText(label)}: ${escapeChartText(value)}</title>`;
    bars+=`<rect x="${pad.l}" y="${y}" width="${wBar}" height="${barH}" rx="4" fill="${it.c||'#2563eb'}"/>`;
    bars+=`<text x="${pad.l-8}" y="${y+barH/2+3.5}" text-anchor="end" font-size="10" fill="#4b5563">${escapeChartText(shortLabel)}</text>`;
    bars+=`<text x="${pad.l+wBar+6}" y="${y+barH/2+3.5}" font-size="10" font-weight="600" fill="#111827">${escapeChartText(value)}</text></g>`;
  });
  return `<svg class="chart-svg analytics-bar-chart" role="img" viewBox="0 0 ${w} ${h}">${bars}</svg>`;
}
function pieChart(data,options={}){
  const total=data.reduce((s,d)=>s+d.v,0);
  if(!data.length||total<=0)return '<div class="analytics-empty">Нет данных для выбранных фильтров</div>';
  const cx=130,cy=110,r=80,innerR=50;
  let angle=-Math.PI/2,paths='';
  data.forEach(d=>{
    const a=(d.v/total)*Math.PI*2;
    const x1=cx+r*Math.cos(angle),y1=cy+r*Math.sin(angle);
    const x2=cx+r*Math.cos(angle+a),y2=cy+r*Math.sin(angle+a);
    const x3=cx+innerR*Math.cos(angle+a),y3=cy+innerR*Math.sin(angle+a);
    const x4=cx+innerR*Math.cos(angle),y4=cy+innerR*Math.sin(angle);
    const large=a>Math.PI?1:0;
    paths+=`<path d="M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z" fill="${d.c}"/>`;
    angle+=a;
  });
  let legend='';
  data.forEach(d=>{legend+=`<div class="pie-legend-row"><span class="pie-legend-dot" style="background:${d.c};"></span><span class="pie-legend-name">${escapeChartText(d.n)}</span><b>${(d.v/total*100).toLocaleString('ru-RU',{minimumFractionDigits:1,maximumFractionDigits:1})}%</b></div>`;});
  const centerValue=options.centerValue??'87,6';
  const unitLabel=options.unitLabel??'млрд ₽';
  return `<div class="pie-chart-layout"><svg viewBox="0 0 260 220" role="img" class="pie-chart-svg">${paths}<text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="22" font-weight="700" fill="#111827">${escapeChartText(centerValue)}</text><text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="11" fill="#6b7280">${escapeChartText(unitLabel)}</text></svg><div class="pie-chart-legend">${legend}</div></div>`;
}

/* ============ КАРТА ============ */
let map,markersLayer,markerById={},miniMap;
const mapFilters={city:'',industry:'',status:'',search:''};
const YANDEX_LAYERS={
  map:'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=21.06.20&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
  sat:'https://core-renderer-tiles.maps.yandex.net/tiles?l=sat&v=21.06.20&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
  hybrid:'https://core-renderer-tiles.maps.yandex.net/tiles?l=skl&v=21.06.20&x={x}&y={y}&z={z}&scale=1&lang=ru_RU'
};
function getMarkerColor(e){
  if(e.status==='Инвестиционный проект')return '#16a34a';
  if(e.color==='red')return '#dc2626';
  return '#2563eb';
}
function getMarkerIcon(e){
  const color=getMarkerColor(e);
  const size=e.color==='red'?34:26;
  const html=`<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 3px 12px ${color}66;display:flex;align-items:center;justify-content:center;color:#fff;font-size:${size<30?10:12}px;font-weight:700;cursor:pointer;">${e.logo||''}</div>`;
  return L.divIcon({html,className:'custom-marker',iconSize:[size,size],iconAnchor:[size/2,size/2],popupAnchor:[0,-size/2]});
}
function buildPopup(e){
  const c=cityById(e.city_id),ind=indById(e.industry_id);
  const admin=isAdmin();
  return `
    <div class="popup-title">${e.name}</div>
    <div class="popup-row"><span>Город</span><b>${c?c.name:'—'}</b></div>
    <div class="popup-row"><span>Отрасль</span><b>${ind?ind.name:'—'}</b></div>
    <div class="popup-row"><span>Статус</span><b>${e.status}</b></div>
    ${e.emp?`<div class="popup-row"><span>Сотрудников</span><b>${fmtNum(e.emp)}</b></div>`:''}
    ${e.rev?`<div class="popup-row"><span>Выручка</span><b>${e.rev.toFixed(1).replace('.',',')} млрд ₽</b></div>`:''}
    ${e.site?`<a class="popup-link" href="https://${e.site}" target="_blank">Открыть сайт →</a>`:''}
    ${admin?`<div style="display:flex;gap:6px;margin-top:10px;border-top:1px solid var(--border);padding-top:10px;"><button onclick="editEnterprise(${e.id})" style="flex:1;padding:6px;border:1px solid var(--border);background:#fff;border-radius:6px;font-family:inherit;font-size:12px;cursor:pointer;">✎ Изменить</button><button onclick="deleteEnterprise(${e.id});map.closePopup();" style="flex:1;padding:6px;border:1px solid var(--border);background:#fff;border-radius:6px;font-family:inherit;font-size:12px;color:var(--red);cursor:pointer;">🗑 Удалить</button></div>`:''}`;
}
function initMap(){
  map=L.map('ymap',{zoomControl:true,scrollWheelZoom:true,attributionControl:false}).setView([51.7,56.5],7);
  L.tileLayer(YANDEX_LAYERS.map,{maxZoom:18,minZoom:4}).addTo(map);
  markersLayer=L.layerGroup().addTo(map);
  window._map=map;
  window._tileLayer=map._layers[Object.keys(map._layers)[0]];
  $$('.map-layer-toggle button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      $$('.map-layer-toggle button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      if(window._tileLayer)map.removeLayer(window._tileLayer);
      window._tileLayer=L.tileLayer(YANDEX_LAYERS[btn.dataset.layer],{maxZoom:18,minZoom:4}).addTo(map);
      window._tileLayer.bringToBack();
    });
  });
  renderMapMarkers();
  if(document.getElementById('pokMiniMap')){
    miniMap=L.map('pokMiniMap',{zoomControl:false,attributionControl:false,scrollWheelZoom:false,dragging:false}).setView([51.7,56.5],6);
    L.tileLayer(YANDEX_LAYERS.map,{maxZoom:18,minZoom:4}).addTo(miniMap);
    CITIES.filter(c=>c.major).forEach(c=>{
      L.circleMarker([c.lat,c.lng],{radius:8,color:'#fff',weight:2.5,fillColor:'#2563eb',fillOpacity:1}).bindTooltip(c.name).addTo(miniMap);
    });
  }
}
function initMapFilters(){
  const cities=[...new Set(ENTERPRISES.map(e=>e.city_id))].map(cityById).filter(Boolean).sort((a,b)=>a.name.localeCompare(b.name));
  cities.forEach(c=>$('#mapCityFilter').insertAdjacentHTML('beforeend',`<option value="${c.id}">${c.name}</option>`));
  INDUSTRIES.filter(i=>ENTERPRISES.some(e=>e.industry_id===i.id)).forEach(i=>$('#mapIndFilter').insertAdjacentHTML('beforeend',`<option value="${i.id}">${i.name}</option>`));
  $('#mapApply').addEventListener('click',()=>{
    mapFilters.city=$('#mapCityFilter').value;
    mapFilters.industry=$('#mapIndFilter').value;
    mapFilters.status=$('#mapStatusFilter').value;
    mapFilters.search=$('#mapSearch').value.toLowerCase();
    renderMapMarkers();renderMapTable();
    toast('Фильтры применены: '+getFilteredMapEnterprises().length+' объектов');
  });
  $('#mapReset').addEventListener('click',()=>{
    $('#mapCityFilter').value='';$('#mapIndFilter').value='';$('#mapStatusFilter').value='';$('#mapSearch').value='';
    mapFilters.city='';mapFilters.industry='';mapFilters.status='';mapFilters.search='';
    renderMapMarkers();renderMapTable();
    map.setView([51.7,56.5],7);
    toast('Фильтры карты сброшены');
  });
  let t;
  $('#mapSearch').addEventListener('input',e=>{
    clearTimeout(t);
    const v=e.target.value.toLowerCase();
    t=setTimeout(()=>{mapFilters.search=v;renderMapMarkers();renderMapTable();},250);
  });
}
function getFilteredMapEnterprises(){
  let list=ENTERPRISES.slice();
  if(mapFilters.city)list=list.filter(e=>e.city_id===+mapFilters.city);
  if(mapFilters.industry)list=list.filter(e=>e.industry_id===+mapFilters.industry);
  if(mapFilters.status)list=list.filter(e=>e.status===mapFilters.status);
  if(mapFilters.search)list=list.filter(e=>e.name.toLowerCase().includes(mapFilters.search));
  return list;
}
function renderMapMarkers(){
  if(!markersLayer)return;
  markersLayer.clearLayers();
  markerById={};
  const list=getFilteredMapEnterprises();
  list.forEach(e=>{
    const c=cityById(e.city_id);
    if(!c||!c.lat)return;
    const marker=L.marker([c.lat,c.lng],{icon:getMarkerIcon(e)}).bindPopup(buildPopup(e));
    marker.addTo(markersLayer);
    markerById[e.id]=marker;
  });
  $('#mapCount').textContent=list.length;
  $('#mapTotal').textContent=ENTERPRISES.length;
  $('#statCities').textContent=new Set(list.map(e=>e.city_id)).size;
  $('#statEnts').textContent=list.length;
  $('#statInv').textContent=list.filter(e=>e.status==='Инвестиционный проект').length;
}
function focusOnEnterprise(id){
  const e=ENTERPRISES.find(x=>x.id===id);
  if(!e)return;
  const c=cityById(e.city_id);
  if(!c||!c.lat)return;
  $('#mapCityFilter').value='';$('#mapIndFilter').value='';$('#mapStatusFilter').value='';$('#mapSearch').value='';
  mapFilters.city='';mapFilters.industry='';mapFilters.status='';mapFilters.search='';
  renderMapMarkers();renderMapTable();
  map.setView([c.lat,c.lng],11,{animate:true});
  const marker=markerById[id];
  if(marker){setTimeout(()=>marker.openPopup(),500);}
  $$('#mapTbody tr').forEach(tr=>tr.classList.toggle('highlight',+tr.dataset.eid===id));
  toast('Показано: '+e.name);
}
function renderMapTable(){
  const list=getFilteredMapEnterprises();
  $('#mapTbody').innerHTML=list.length?list.map(e=>{
    const c=cityById(e.city_id),ind=indById(e.industry_id);
    const type=e.status==='Инвестиционный проект'?'Инвестпроект':'Предприятие';
    const cls=e.status==='Действующее'?'ok':e.status.includes('Инвест')?'info':'err';
    return `<tr data-eid="${e.id}" style="cursor:pointer;">
      <td><div class="cell-name"><div class="cell-logo ${e.color||'blue'}">${e.logo||'?'}</div>${e.name}</div></td>
      <td class="cell-muted">${c?c.name:'—'}</td>
      <td class="cell-muted">${type}</td>
      <td class="cell-muted">${ind?ind.name:'—'}</td>
      <td><span class="status ${cls}">${e.status}</span></td>
      <td><span class="link">Перейти на карте ↗</span></td>
    </tr>`;
  }).join(''):`<tr class="empty-row"><td colspan="6">Нет объектов по заданным фильтрам</td></tr>`;
}
$('#mapTbody').addEventListener('click',e=>{
  const row=e.target.closest('tr[data-eid]');if(!row)return;
  focusOnEnterprise(+row.dataset.eid);
});

/* ============ ОТРАСЛИ ============ */
function renderIndustries(){
  const grid=$('#industriesGrid');
  const counts={};
  INDUSTRIES.forEach(i=>counts[i.id]=ENTERPRISES.filter(e=>e.industry_id===i.id).length);
  const maxCount=Math.max(...Object.values(counts),1);
  grid.innerHTML=INDUSTRIES.map(i=>{
    const n=counts[i.id];
    const empSum=ENTERPRISES.filter(e=>e.industry_id===i.id).reduce((s,e)=>s+(e.emp||0),0);
    const revSum=ENTERPRISES.filter(e=>e.industry_id===i.id).reduce((s,e)=>s+(e.rev||0),0);
    const pct=Math.round((n/maxCount)*100);
    return `<div class="entity-card" data-ind="${i.id}">
      <div class="entity-head">
        <div class="entity-icon" style="background:${i.color}22;color:${i.color};"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg></div>
        <div><div class="entity-title">${i.name}</div><div class="entity-sub">${n} ${plural(n,'предприятие','предприятия','предприятий')}</div></div>
      </div>
      <div class="bar"><div style="width:${pct}%;background:${i.color};"></div></div>
      <div class="entity-stats">
        <div class="entity-stat"><div class="label">Занято</div><div class="value">${fmtNum(empSum)}<small> чел.</small></div></div>
        <div class="entity-stat"><div class="label">Выручка</div><div class="value">${revSum.toFixed(1)}<small> млрд ₽</small></div></div>
      </div>
    </div>`;
  }).join('');
  grid.querySelectorAll('.entity-card').forEach(card=>{
    card.addEventListener('click',()=>{
      grid.querySelectorAll('.entity-card').forEach(c=>c.classList.remove('active'));
      card.classList.add('active');
      showIndustryDetails(+card.dataset.ind);
    });
  });
}
function plural(n,o,f,m){const a=n%10,b=n%100;if(a===1&&b!==11)return o;if(a>=2&&a<=4&&(b<10||b>=20))return f;return m;}
function showIndustryDetails(indId){
  const ind=indById(indId);
  const list=ENTERPRISES.filter(e=>e.industry_id===indId);
  $('#industryDetailsCard').style.display='block';
  $('#industryDetailsTitle').textContent='Предприятия отрасли: '+ind.name;
  $('#industryDetailsCount').textContent=list.length+' предприятий';
  $('#industryDetailsTbody').innerHTML=list.length?list.map(e=>{
    const c=cityById(e.city_id);
    const cls=e.status==='Действующее'?'ok':e.status.includes('Инвест')?'info':'err';
    return `<tr>
      <td><div class="cell-name"><div class="cell-logo ${e.color||'blue'}">${e.logo||'?'}</div>${e.name}</div></td>
      <td class="cell-muted">${c?c.name:'—'}</td>
      <td class="cell-muted">${e.emp?fmtNum(e.emp):'—'}</td>
      <td class="cell-muted">${e.rev?e.rev.toFixed(1)+' млрд ₽':'—'}</td>
      <td><span class="status ${cls}">${e.status}</span></td>
    </tr>`;
  }).join(''):`<tr class="empty-row"><td colspan="5">Нет предприятий</td></tr>`;
  $('#industryDetailsCard').scrollIntoView({behavior:'smooth',block:'start'});
}

/* ============ МУНИЦИПАЛИТЕТЫ ============ */
let muniFilter={search:'',type:'',sort:'name'};
function renderMunis(){
  const grid=$('#muniGrid');
  let list=CITIES.filter(c=>!c.major || true);
  if(muniFilter.search){
    const q=muniFilter.search.toLowerCase();
    list=list.filter(c=>c.name.toLowerCase().includes(q));
  }
  if(muniFilter.type)list=list.filter(c=>c.type===muniFilter.type);
  list=list.map(c=>{
    const ents=ENTERPRISES.filter(e=>e.city_id===c.id);
    const emp=ents.reduce((s,e)=>s+(e.emp||0),0);
    const rev=ents.reduce((s,e)=>s+(e.rev||0),0);
    const inv=ents.filter(e=>e.status==='Инвестиционный проект').length;
    return {city:c,ents:ents.length,emp,rev,inv};
  });
  if(muniFilter.sort==='name')list.sort((a,b)=>a.city.name.localeCompare(b.city.name));
  else if(muniFilter.sort==='pop')list.sort((a,b)=>(b.city.pop||0)-(a.city.pop||0));
  else if(muniFilter.sort==='ent')list.sort((a,b)=>b.ents-a.ents);
  grid.innerHTML=list.length?list.map(({city:c,ents,emp,rev,inv})=>{
    const major=c.major?'#2563eb':(c.type==='Район'?'#16a34a':'#7c3aed');
    return `<div class="entity-card" onclick="focusCity(${c.id})">
      <div class="entity-head">
        <div class="entity-icon" style="background:${major}22;color:${major};">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V8l5-3v16"/><path d="M10 21V5l6 3v13"/></svg>
        </div>
        <div><div class="entity-title">${c.name}</div><div class="entity-sub">${c.type||'Территория'}${c.pop?' · '+fmtNum(c.pop)+' чел.':''}</div></div>
      </div>
      <div class="entity-stats">
        <div class="entity-stat"><div class="label">Предприятий</div><div class="value">${ents}</div></div>
        <div class="entity-stat"><div class="label">Занято</div><div class="value">${emp?fmtNum(emp):'0'}<small> чел.</small></div></div>
        <div class="entity-stat"><div class="label">Инвест</div><div class="value">${inv}</div></div>
      </div>
      <div class="entity-stats" style="border-top:none;padding-top:6px;">
        <div class="entity-stat"><div class="label">Суммарная выручка</div><div class="value">${rev.toFixed(1)}<small> млрд ₽</small></div></div>
      </div>
    </div>`;
  }).join(''):`<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--muted);">Города не найдены</div>`;
}
function focusCity(id){
  switchPage('karta');
  setTimeout(()=>{
    const c=cityById(id);
    if(c&&c.lat){map.setView([c.lat,c.lng],10,{animate:true});toast('Показан город: '+c.name);}
  },200);
}
function initMunis(){
  $('#muniSearch').addEventListener('input',e=>{muniFilter.search=e.target.value;renderMunis();});
  $('#muniTypeFilter').addEventListener('change',e=>{muniFilter.type=e.target.value;renderMunis();});
  $('#muniSort').addEventListener('change',e=>{muniFilter.sort=e.target.value;renderMunis();});
}

/* ============ ОТЧЕТЫ ============ */
function renderReports(){
  const admin=isAdmin();
  $('#reportsCount').textContent=REPORTS.length+' '+(REPORTS.length===1?'отчёт':REPORTS.length<5?'отчёта':'отчётов');
  if(document.getElementById('adminRepCount'))$('#adminRepCount').textContent=REPORTS.length;
  $('#reportsTbody').innerHTML=REPORTS.length?REPORTS.map((r,i)=>`
    <tr>
      <td class="cell-num">${i+1}</td>
      <td><div class="cell-name">${escapeHTML(r.name)}</div></td>
      <td class="cell-muted">${escapeHTML(r.type)}</td>
      <td class="cell-muted">${escapeHTML(r.period)}</td>
      <td class="cell-muted">Excel (.xlsx)</td>
      <td class="cell-muted">${escapeHTML(r.author)}</td>
      <td class="cell-muted">${formatReportDate(r.created_at)}</td>
      <td class="cell-muted">${formatFileSize(r.size)}</td>
      <td><a class="link" href="/api/reports/${r.id}/download">Скачать .xlsx</a></td>
      ${admin?`<td class="admin-only-cell"><button class="row-btn danger" title="Удалить отчёт" onclick="deleteReport(${r.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button></td>`:'<td></td>'}
    </tr>
  `).join(''):'<tr class="empty-row"><td colspan="10">Отчётов пока нет</td></tr>';
}
function escapeHTML(value){
  return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function formatReportDate(value){
  const date=new Date(value);
  return Number.isNaN(date.getTime())?'—':date.toLocaleString('ru-RU');
}
function formatFileSize(bytes){
  const size=Number(bytes)||0;
  return size<1024?`${size} Б`:`${(size/1024).toFixed(1).replace('.',',')} КБ`;
}
async function loadReports(){
  try{
    const response=await fetch('/api/reports');
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    REPORTS=await response.json();
    renderReports();
  }catch(error){
    console.error('Не удалось загрузить отчёты',error);
    $('#reportsTbody').innerHTML='<tr class="empty-row"><td colspan="10">Не удалось загрузить отчёты. Проверьте подключение к PostgreSQL.</td></tr>';
    toast('Не удалось загрузить отчёты','error');
  }
}
function deleteReport(id){
  if(!isAdmin())return;
  const r=REPORTS.find(x=>x.id===id);if(!r)return;
  if(confirm(`Удалить отчёт «${r.name}»?`)){
    fetch(`/api/reports/${id}`,{method:'DELETE'}).then(async response=>{
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      await loadReports();
      toast('Отчёт удалён','success');
    }).catch(error=>{
      console.error('Не удалось удалить отчёт',error);
      toast('Не удалось удалить отчёт','error');
    });
  }
}
function initReports(){
  $('#repCreateBtn').addEventListener('click',async()=>{
    if(!isAdmin())return;
    const type=$('#repType').value;
    const period=$('#repPeriod').value;
    const note=$('#repNote').value.trim();
    try{
      const response=await fetch('/api/reports',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({type,period,note})
      });
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||`HTTP ${response.status}`);
      await loadReports();
      $('#repNote').value='';
      toast('Отчёт Excel сформирован','success');
    }catch(error){
      console.error('Не удалось сформировать отчёт',error);
      toast(error.message||'Не удалось сформировать отчёт','error');
    }
  });
  loadReports();
}

/* ============ ПОЛЬЗОВАТЕЛИ / АУДИТ ============ */
function renderUsers(){
  const tbody=$('#usersTbody');
  if(!tbody)return;
  tbody.innerHTML=USERS.map(u=>{
    const roleClass=u.role==='admin'?'purple':u.role==='Администратор'?'info':u.role==='Редактор'?'warn':'warn';
    const roleLabel=u.role==='admin'?'👑 Суперпользователь':u.role;
    const statusClass=u.status==='active'?'ok':u.status==='public'?'info':'err';
    const statusLabel=u.status==='active'?'Активен':u.status==='public'?'Публичный':'Заблокирован';
    const initials=u.name.split(' ').map(s=>s[0]).slice(0,2).join('');
    const colorCls=u.role==='admin'?'purple':'blue';
    return `<tr>
      <td><div class="cell-name"><div class="cell-logo ${colorCls}">${initials}</div><div><b>${u.name}</b><div class="cell-muted" style="font-size:11px;">${u.email}</div></div></div></td>
      <td><span class="status ${roleClass}">${roleLabel}</span></td>
      <td class="cell-muted">${u.last}</td>
      <td class="cell-muted">${u.actions}</td>
      <td><span class="status ${statusClass}">${statusLabel}</span></td>
      <td><div class="row-actions"><button class="row-btn" title="Редактировать" onclick="editUser(${u.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg></button>${u.role!=='admin'?`<button class="row-btn danger" onclick="deleteUser(${u.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>`:''}</div></td>
    </tr>`;
  }).join('');
  $('#adminUsersCount').textContent=USERS.length;
}
function renderAudit(){
  const box=$('#auditList');
  if(!box)return;
  box.innerHTML=AUDIT.slice(0,6).map(a=>{
    const init=a.name.split(' ').map(s=>s[0]).slice(0,2).join('');
    return `<div class="audit-item">
      <div class="cell-logo purple">${init}</div>
      <div class="audit-content">
        <div class="audit-name">${a.name} <span style="color:var(--purple);font-size:11px;">${a.role}</span></div>
        <div class="audit-action">${a.action}</div>
        <div class="audit-time">${a.time}</div>
      </div>
    </div>`;
  }).join('');
  $('#adminRecCount').textContent=ENTERPRISES.length+SOURCES.length+REPORTS.length;
  $('#adminSrcCount').textContent=SOURCES.length;
}
function deleteUser(id){
  if(!isAdmin())return;
  const u=USERS.find(x=>x.id===id);if(!u)return;
  if(u.role==='admin'){toast('Нельзя удалить суперпользователя','error');return;}
  if(confirm(`Удалить пользователя «${u.name}»?`)){
    const idx=USERS.indexOf(u);if(idx>-1)USERS.splice(idx,1);
    renderUsers();toast('Пользователь удалён','error');
    addAudit('Михаил Фукс','SU',`Удалил пользователя «${u.name}»`);
  }
}
function editUser(id){
  const u=USERS.find(x=>x.id===id);
  if(!u)return;
  openUserModal(id);
}

/* ============ МОДАЛКА ПОЛЬЗОВАТЕЛЯ ============ */
let editingUserId=null;
function openUserModal(id){
  if(!isAdmin())return;
  editingUserId=id||null;
  $('#userModalTitle').textContent=id?'Редактировать пользователя':'Добавить пользователя';
  if(id){
    const u=USERS.find(x=>x.id===id);if(!u)return;
    $('#fUserName').value=u.name;
    $('#fUserEmail').value=u.email;
    $('#fUserRole').value=u.role==='admin'?'Администратор':u.role;
    $('#fUserStatus').value=u.status==='active'?'Активен':'Заблокирован';
  }else{
    $('#fUserName').value='';$('#fUserEmail').value='';
    $('#fUserRole').value='Просмотр';$('#fUserStatus').value='Активен';
  }
  $('#userFormError').classList.remove('show');
  $('#userModalOverlay').classList.add('show');
}
function closeUserModal(){$('#userModalOverlay').classList.remove('show');}
$('#userModalClose').addEventListener('click',closeUserModal);
$('#userModalOverlay').addEventListener('click',e=>{if(e.target.id==='userModalOverlay')closeUserModal();});
$('#userSaveBtn').addEventListener('click',()=>{
  const name=$('#fUserName').value.trim();
  const email=$('#fUserEmail').value.trim();
  if(!name||!email){$('#userFormError').classList.add('show');return;}
  const role=$('#fUserRole').value;
  const status=$('#fUserStatus').value==='Активен'?'active':'blocked';
  if(editingUserId){
    const u=USERS.find(x=>x.id===editingUserId);
    Object.assign(u,{name,email,role,status});
    toast('Пользователь обновлён','success');
  }else{
    const newId=Math.max(...USERS.map(u=>u.id),0)+1;
    USERS.push({id:newId,name,email,role,last:'—',actions:0,status});
    toast('Пользователь добавлен','success');
  }
  closeUserModal();renderUsers();
  addAudit('Михаил Фукс','SU',`${editingUserId?'Обновил':'Добавил'} пользователя «${name}»`);
});

/* ============ ТОСТЫ ============ */
function toast(msg,type){
  type=type||'info';
  if(!notificationsEnabled&&type!=='error')return;
  const box=$('#toasts'),el=document.createElement('div');
  el.className='toast '+type;
  el.textContent=msg;
  box.appendChild(el);
  setTimeout(()=>el.remove(),2800);
}
function updateNotificationsButton(){
  const button=$('#notificationsToggle');
  const label=notificationsEnabled?'включены':'выключены';
  button.setAttribute('aria-pressed',String(notificationsEnabled));
  button.setAttribute('aria-label',`Всплывающие уведомления ${label}`);
  button.title=`Всплывающие уведомления ${label}`;
  button.classList.toggle('notifications-disabled',!notificationsEnabled);
}
function initNotifications(){
  try{
    const stored=localStorage.getItem('prom_registry_notifications');
    if(stored!==null)notificationsEnabled=stored==='true';
  }catch(error){
    console.error('Не удалось загрузить настройку уведомлений',error);
  }
  updateNotificationsButton();
  $('#notificationsToggle').addEventListener('click',()=>{
    notificationsEnabled=!notificationsEnabled;
    try{
      localStorage.setItem('prom_registry_notifications',String(notificationsEnabled));
    }catch(error){
      console.error('Не удалось сохранить настройку уведомлений',error);
    }
    updateNotificationsButton();
  });
}

/* ============ ГРАФИКИ ============ */
const analyticsState={territory:'Новотроицк',period:'2021-2025',metric:'revenue'};
const analyticsMetricLabels={
  revenue:{label:'выручке',title:'Выручка',unit:'млрд ₽'},
  employees:{label:'занятости',title:'Занятость',unit:'чел.'},
  investments:{label:'инвестициям',title:'Инвестиции',unit:'млрд ₽'}
};
function formatAnalyticsNumber(value,digits=0){
  return Number(value||0).toLocaleString('ru-RU',{minimumFractionDigits:digits,maximumFractionDigits:digits});
}
const analyticsMetricLegendColors={revenue:'#2563eb',employees:'#16a34a',investments:'#7c3aed'};
let analyticsRequestId=0;
let analyticsDisplayedData=null;
function getDemoAnalytics(){
  const selected=ENTERPRISES.filter(company=>!analyticsState.territory||
    cityById(company.city_id)?.name===analyticsState.territory);
  const metricValue=company=>{
    if(analyticsState.metric==='employees')return Number(company.emp)||0;
    if(analyticsState.metric==='revenue')return Number(company.rev)||0;
    return null;
  };
  const makeCompany=company=>({
    id:company.id,
    name:company.name,
    status:company.status||'',
    city_id:company.city_id,
    city:cityById(company.city_id)?.name||'—',
    industry_id:company.industry_id,
    industry:indById(company.industry_id)?.name||'—',
    employees:Number(company.emp)||0,
    revenue:Number(company.rev)||0,
    investments:null,
    value:metricValue(company)||0
  });
  const selectedCompanies=selected.map(makeCompany);
  const aggregate=(companies,keyFor)=>{
    const groups=new Map();
    companies.forEach(company=>{
      const key=keyFor(company);
      if(!key)return;
      const value=metricValue(company);
      if(value===null)return;
      const group=groups.get(key.id)||{name:key.name,value:0,companies:0};
      group.value+=value;
      group.companies+=1;
      groups.set(key.id,group);
    });
    return [...groups.values()].sort((a,b)=>b.value-a.value);
  };
  const selectedMetricValues=selected.map(metricValue).filter(value=>value!==null);
  const metricTotal=selectedMetricValues.length
    ?selectedMetricValues.reduce((sum,value)=>sum+value,0):null;
  const [firstYear,lastYear]=analyticsState.period.split('-').map(Number);
  const demoFactors=[0.68,0.76,0.85,0.93,1];
  const series=metricTotal===null?[]:
    Array.from({length:lastYear-firstYear+1},(_,index)=>{
      const year=firstYear+index;
      const factor=demoFactors[Math.max(0,Math.min(demoFactors.length-1,year-2021))];
      return {year,value:metricTotal*factor};
    });
  const currentYear=Math.max(firstYear,Math.min(lastYear,2024));
  selectedCompanies.sort((a,b)=>b.value-a.value);
  return {
    current_year:currentYear,
    value_unit:analyticsState.metric==='employees'?'чел.':'млрд ₽',
    demo:true,
    kpis:{
      companies:selectedCompanies.length,
      employees:selectedCompanies.reduce((sum,company)=>sum+company.employees,0),
      metric_total:metricTotal,
      investment_projects:selectedCompanies.filter(company=>
        company.status==='Инвестиционный проект'||company.status==='В стадии проекта'
      ).length
    },
    series,
    top_enterprises:selectedCompanies.slice(0,10),
    industries:aggregate(selected,company=>indById(company.industry_id)),
    territories:aggregate(ENTERPRISES,company=>cityById(company.city_id)),
    companies:selectedCompanies,
    cities:CITIES.filter(city=>ENTERPRISES.some(company=>company.city_id===city.id)),
    industry_options:INDUSTRIES
  };
}
function renderAnalytics(data){
  analyticsDisplayedData=data;
  const metric=analyticsMetricLabels[analyticsState.metric];
  const kpis=data.kpis;
  const companies=data.companies||[];
  const metricIsCurrency=analyticsState.metric!=='employees';
  const formatValue=value=>metricIsCurrency?formatAnalyticsNumber(value,1):fmtNum(value);
  const formatOptional=(value,formatter)=>value===null||value===undefined?'—':formatter(value);
  $('#analyticsCompanyCount').textContent=fmtNum(kpis.companies);
  $('#analyticsCompanyCountLabel').textContent=fmtNum(kpis.companies);
  $('#analyticsEmployeeCount').textContent=formatOptional(kpis.employees,fmtNum);
  $('#analyticsMetricTotal').textContent=formatOptional(kpis.metric_total,formatValue);
  $('#analyticsMetricLabel').textContent=`${metric.title} за ${data.current_year}, ${metric.unit}`;
  $('#analyticsPeriodLabel').textContent=`Период ${analyticsState.period.replace('-', '–')}`;
  $('#analyticsProjectCount').textContent=fmtNum(kpis.investment_projects);
  $('#analyticsRankingTitle').textContent=`Топ предприятий по ${metric.label}`;
  $('#analyticsRankingSubtitle').textContent=`${metric.unit} · ${data.current_year}`;
  $('#analyticsIndustrySubtitle').textContent=`Доля ${metric.title.toLowerCase()} за ${data.current_year}`;
  $('#analyticsTrendSubtitle').textContent=data.demo
    ?`Демо-ряд для примера · не данные PostgreSQL · ${metric.unit}`
    :`${metric.title}, ${analyticsState.period.replace('-', '–')} · ${metric.unit}`;
  $('#analyticsTerritorySubtitle').textContent=analyticsState.territory
    ?`${metric.title} по территориям за ${data.current_year} · выбранный город выделен`
    :`${metric.title} по территориям за ${data.current_year}`;
  $('#analyticsMetricLegend').style.background=analyticsMetricLegendColors[analyticsState.metric];
  $('#analyticsMetricLegendLabel').textContent=`${metric.title}, ${metric.unit}`;

  const ranking=(data.top_enterprises||[]).filter(company=>Number(company.value)>0).map(company=>({
    n:company.name,v:Number(company.value)||0,
    c:INDUSTRIES.find(industry=>industry.name===company.industry)?.color||'#2563eb'
  }));
  $('#topChart').innerHTML=barChart(ranking,{
    labelWidth:210,labelLimit:28,barHeight:17,gap:5,formatValue
  });

  const industryGroups=(data.industries||[]).filter(group=>Number(group.value)>0);
  $('#analyticsPie').innerHTML=pieChart(industryGroups.map(group=>({
    n:group.name,v:Number(group.value)||0,
    c:INDUSTRIES.find(industry=>industry.name===group.name)?.color||'#6b7280'
  })),{
    centerValue:formatValue(kpis.metric_total),unitLabel:metric.unit
  });

  const series=(data.series||[]).filter(point=>point.value!==null&&Number.isFinite(Number(point.value)));
  $('#analyticsTrend').innerHTML=series.length>=2
    ?lineChart([{color:analyticsMetricLegendColors[analyticsState.metric],data:series.map(point=>({
      x:String(point.year),y:Number(point.value)
    }))}])
    :'<div class="analytics-empty">Недостаточно годовых данных для графика за выбранный период</div>';

  const territoryGroups=(data.territories||[]).filter(group=>Number(group.value)>0);
  $('#analyticsTerritories').innerHTML=barChart(territoryGroups.map(group=>({
    n:group.name,v:Number(group.value)||0,
    c:group.name===analyticsState.territory?'#2563eb':'#93c5fd'
  })),{
    labelWidth:115,labelLimit:16,barHeight:16,gap:5,valueWidth:65,formatValue
  });

  $('#analyticsTbody').innerHTML=companies.length?companies.map(company=>`
    <tr>
      <td>${escapeChartText(company.name)}</td>
      <td>${escapeChartText(company.city||'—')}</td>
      <td>${escapeChartText(company.industry||'—')}</td>
      <td>${formatOptional(company.employees,fmtNum)}</td>
      <td>${formatOptional(company.revenue,value=>formatAnalyticsNumber(value,1))}</td>
      <td>${formatOptional(company.investments,value=>formatAnalyticsNumber(value,1))}</td>
    </tr>
  `).join(''):'<tr class="empty-row"><td colspan="6">Нет данных за выбранный период</td></tr>';
}
function showAnalyticsNotice(message){
  const notice=$('#analyticsNotice');
  notice.replaceChildren(document.createTextNode(message+' '));
  const retry=document.createElement('button');
  retry.className='analytics-retry';
  retry.type='button';
  retry.textContent='Повторить запрос';
  retry.addEventListener('click',loadAnalytics);
  notice.append(retry);
  notice.hidden=false;
}
function isAnalyticsPayload(data){
  const isNumber=value=>typeof value==='number'&&Number.isFinite(value);
  const isOptionalNumber=value=>value===null||isNumber(value);
  return data&&Number.isInteger(data.current_year)&&data.kpis&&
    ['companies','investment_projects'].every(key=>isNumber(data.kpis[key]))&&
    ['employees','metric_total'].every(key=>isOptionalNumber(data.kpis[key]))&&
    ['series','top_enterprises','industries','territories','companies','cities','industry_options']
      .every(key=>Array.isArray(data[key]))&&
    data.series.every(point=>Number.isInteger(point.year)&&isNumber(point.value))&&
    data.top_enterprises.every(company=>
      typeof company.name==='string'&&isNumber(company.value))&&
    data.industries.every(group=>typeof group.name==='string'&&isNumber(group.value))&&
    data.territories.every(group=>typeof group.name==='string'&&isNumber(group.value))&&
    data.companies.every(company=>
      typeof company.name==='string'&&typeof company.city==='string'&&
      typeof company.industry==='string'&&['employees','revenue','investments']
        .every(key=>isOptionalNumber(company[key])))&&
    data.cities.every(city=>typeof city.name==='string');
}
function setAnalyticsLoading(isLoading){
  ['#analyticsCity','#analyticsPeriod','#analyticsMetric','#analyticsApply','#analyticsReset','#analyticsExport']
    .forEach(selector=>{ $(selector).disabled=isLoading; });
  $('#page-analitika').setAttribute('aria-busy',String(isLoading));
}
function exportAnalyticsCsv(){
  const companies=analyticsDisplayedData?.companies||[];
  if(!companies.length){
    toast('Нет данных для экспорта','error');
    return;
  }
  const protectCell=value=>{
    const text=String(value??'');
    const safeText=/^[=+\-@\t\r]/.test(text)?`'${text}`:text;
    return `"${safeText.replace(/"/g,'""')}"`;
  };
  const rows=[
    ['Предприятие','Город','Отрасль','Работники','Выручка, млрд ₽','Инвестиции, млрд ₽']
  ];
  if(analyticsDisplayedData.demo){
    rows.push(['Источник данных','Демо-пример интерфейса; не данные PostgreSQL','','','','']);
  }
  rows.push(...companies.map(company=>[
      company.name,company.city,company.industry,company.employees,
      company.revenue,company.investments
    ]));
  const csv='\uFEFF'+rows.map(row=>row.map(protectCell).join(';')).join('\r\n');
  const url=window.URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');
  link.href=url;
  link.download=`analytics-${analyticsState.period}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
async function loadAnalytics(){
  const requestId=++analyticsRequestId;
  setAnalyticsLoading(true);
  const notice=$('#analyticsNotice');
  notice.replaceChildren(document.createTextNode('Загружаем аналитику за выбранный период…'));
  notice.classList.add('loading');
  notice.hidden=false;
  const params=new URLSearchParams({
    territory:analyticsState.territory,
    period:analyticsState.period,
    metric:analyticsState.metric
  });
  try{
    const response=await fetch(`/api/analytics?${params}`);
    if(!response.ok){
      let message=`HTTP ${response.status}`;
      try{
        const errorData=await response.json();
        message=errorData.error||message;
      }catch(error){
        console.error('Не удалось прочитать ошибку аналитического API',error);
      }
      if(response.status>=500)throw new Error(message);
      showAnalyticsNotice(`Запрос аналитики отклонён: ${message}`);
      return;
    }
    let data;
    try{
      data=await response.json();
    }catch(error){
      console.error('Ответ аналитического API не является корректным JSON',error);
      showAnalyticsNotice('Сервер вернул некорректный ответ. Данные на панели не изменены.');
      return;
    }
    if(!isAnalyticsPayload(data)){
      console.error('Ответ аналитического API не соответствует ожидаемой структуре',data);
      showAnalyticsNotice('Сервер вернул данные неверного формата. Данные на панели не изменены.');
      return;
    }
    if(requestId!==analyticsRequestId)return;
    const citySelect=$('#analyticsCity');
    const selectedTerritory=analyticsState.territory;
    citySelect.replaceChildren(new Option('Оренбургская область',''));
    (data.cities||[]).forEach(city=>citySelect.add(new Option(city.name,city.name)));
    if(selectedTerritory&&(data.cities||[]).some(city=>city.name===selectedTerritory)){
      citySelect.value=selectedTerritory;
    }else if(!selectedTerritory){
      citySelect.value='';
    }
    renderAnalytics(data);
    notice.hidden=true;
  }catch(error){
    if(requestId!==analyticsRequestId)return;
    console.error('Не удалось загрузить данные аналитики',error);
    renderAnalytics(getDemoAnalytics());
    showAnalyticsNotice(`DEMO — PostgreSQL недоступен. Показан локальный пример, а не данные базы. ${error.message}`);
  }finally{
    notice.classList.remove('loading');
    if(requestId===analyticsRequestId)setAnalyticsLoading(false);
  }
}
function initAnalytics(){
  const citySelect=$('#analyticsCity');
  CITIES.filter(city=>ENTERPRISES.some(company=>company.city_id===city.id))
    .sort((a,b)=>a.name.localeCompare(b.name,'ru'))
    .forEach(city=>citySelect.add(new Option(city.name,city.name)));
  const initialCity=CITIES.find(city=>city.name==='Новотроицк'&&
    ENTERPRISES.some(company=>company.city_id===city.id));
  if(initialCity){
    citySelect.value=initialCity.name;
    analyticsState.territory=initialCity.name;
  }
  $('#analyticsApply').addEventListener('click',()=>{
    analyticsState.territory=citySelect.value;
    analyticsState.period=$('#analyticsPeriod').value;
    analyticsState.metric=$('#analyticsMetric').value;
    loadAnalytics();
  });
  $('#analyticsReset').addEventListener('click',()=>{
    citySelect.value=initialCity?initialCity.name:'';
    $('#analyticsPeriod').value='2021-2025';
    $('#analyticsMetric').value='revenue';
    Object.assign(analyticsState,{
      territory:citySelect.value,period:'2021-2025',metric:'revenue'
    });
    loadAnalytics();
  });
  $('#analyticsExport').addEventListener('click',exportAnalyticsCsv);
  loadAnalytics();
}
function initCharts(){
  $('#homeChart').innerHTML=lineChart([
    {color:'#2563eb',data:[{x:'2021',y:38},{x:'2022',y:45},{x:'2023',y:52},{x:'2024',y:63},{x:'2025',y:71}]},
    {color:'#16a34a',data:[{x:'2021',y:5},{x:'2022',y:6},{x:'2023',y:7},{x:'2024',y:8},{x:'2025',y:10}]},
    {color:'#a855f7',data:[{x:'2021',y:42},{x:'2022',y:48},{x:'2023',y:55},{x:'2024',y:62},{x:'2025',y:68}]}
  ]);
  $('#pieChart').innerHTML=pieChart([
    {n:'Металлургия',v:48.2,c:'#2563eb'},{n:'Машиностроение',v:16.5,c:'#60a5fa'},
    {n:'Электроэнергетика',v:9.1,c:'#93c5fd'},{n:'Строительство',v:7.3,c:'#bfdbfe'},
    {n:'Торговля',v:6.8,c:'#dbeafe'},{n:'Прочие',v:12.1,c:'#e5e7eb'}
  ]);
  $('#pokChart1').innerHTML=lineChart([
    {color:'#2563eb',data:[{x:'2021',y:42},{x:'2022',y:48},{x:'2023',y:55},{x:'2024',y:62},{x:'2025',y:68}]},
    {color:'#16a34a',data:[{x:'2021',y:5},{x:'2022',y:6},{x:'2023',y:7},{x:'2024',y:8},{x:'2025',y:10}]},
    {color:'#a855f7',data:[{x:'2021',y:71},{x:'2022',y:76},{x:'2023',y:82},{x:'2024',y:88},{x:'2025',y:93}]}
  ]);
  $('#pokPie').innerHTML=pieChart([
    {n:'Металлургия',v:48.2,c:'#2563eb'},{n:'Машиностроение',v:16.5,c:'#60a5fa'},
    {n:'Электроэнергетика',v:9.1,c:'#93c5fd'},{n:'Строительство',v:7.3,c:'#bfdbfe'},
    {n:'Торговля',v:6.8,c:'#dbeafe'},{n:'Прочие',v:12.1,c:'#e5e7eb'}
  ]);
  initAnalytics();
}
$$('#pokTabs .tab').forEach(t=>t.addEventListener('click',()=>{
  $$('#pokTabs .tab').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
}));

/* ============ ГЛОБАЛЬНЫЙ ПОИСК ============ */
$('#globalSearch').addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    const q=e.target.value.trim();
    if(q){switchPage('predpriyatiya');$('#entSearch').value=q;entState.search=q;entState.page=1;renderEnterprises();}
  }
});

/* ============ МЕНЮ ПОЛЬЗОВАТЕЛЯ ============ */
$('#userBlock').addEventListener('click',e=>{
  if(e.target.closest('.user-menu'))return;
  e.stopPropagation();
  $('#userMenu').classList.toggle('show');
});
document.addEventListener('click',()=>$('#userMenu').classList.remove('show'));
$('#userMenu').addEventListener('click',e=>e.stopPropagation());
$('#menuLoginBtn').addEventListener('click',()=>{openLogin();$('#userMenu').classList.remove('show');});
$('#menuAdminPanelBtn').addEventListener('click',()=>{switchPage('admin');$('#userMenu').classList.remove('show');});
$('#menuLogoutBtn').addEventListener('click',()=>{logout();$('#userMenu').classList.remove('show');});
$('#menuExportBtn').addEventListener('click',()=>{toast('Экспорт данных (демо)','success');$('#userMenu').classList.remove('show');});
$('#logoutBtn').addEventListener('click',()=>{if(isAdmin())logout();else switchPage('glavnaya');});
$('#settingsBtn').addEventListener('click',()=>{if(isAdmin())switchPage('admin');else toast('Настройки доступны только администратору','error');});
initNotifications();

/* ============ МОДАЛКА ВХОДА ============ */
$('#loginClose').addEventListener('click',closeLogin);
$('#loginCancel').addEventListener('click',closeLogin);
$('#loginOverlay').addEventListener('click',e=>{if(e.target.id==='loginOverlay')closeLogin();});
$('#loginSubmit').addEventListener('click',login);
$('#loginUsername').addEventListener('keydown',e=>{if(e.key==='Enter')$('#loginPassword').focus();});
$('#loginPassword').addEventListener('keydown',e=>{if(e.key==='Enter')login();});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if($('#loginOverlay').classList.contains('show'))closeLogin();
    if($('#entModalOverlay').classList.contains('show'))closeEntModal();
    if($('#userModalOverlay').classList.contains('show'))closeUserModal();
  }
});

/* ============ СТАРТ ============ */
initEnterprises();
initSources();
initReports();
initMunis();
initCharts();
initMap();
initMapFilters();
renderMapMarkers();
renderMapTable();
renderIndustries();
renderMunis();
renderEnterprises();
renderSources();
renderReports();
renderUsers();
renderAudit();
loadAuth().then(applyAuthUI).catch(error=>{
  console.error('Не удалось проверить сеанс администратора',error);
  toast('Не удалось проверить авторизацию','error');
  applyAuthUI();
});
