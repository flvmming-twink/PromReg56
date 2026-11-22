import process from 'node:process';

const endpoint = process.env.CDP_HTTP ?? 'http://127.0.0.1:9222';
const site = process.env.PROMREGION_URL ?? 'http://127.0.0.1:4173/#overview';
const navigationUrl = new URL(site);
navigationUrl.searchParams.set('smoke', String(Date.now()));
const assert = (condition, label) => {
  if (!condition) throw new Error(`FAILED: ${label}`);
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const targets = await fetch(`${endpoint}/json/list`).then((response) => response.json());
const target = targets.find((item) => item.type === 'page');
assert(target?.webSocketDebuggerUrl, 'Chrome page target');

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let sequence = 0;
const pending = new Map();
const runtimeErrors = [];
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message));
    else waiter.resolve(message.result);
    return;
  }
  if (message.method === 'Runtime.exceptionThrown') {
    runtimeErrors.push(message.params.exceptionDetails?.text ?? 'Runtime exception');
  }
  if (message.method === 'Log.entryAdded' && message.params.entry?.level === 'error') {
    runtimeErrors.push(message.params.entry.text);
  }
});

const command = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const evaluate = async (expression) => {
  const response = await command('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.text ?? 'Browser evaluation failed');
  }
  return response.result.value;
};

const waitFor = async (expression, timeoutMs = 10000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for: ${expression}`);
};

try {
  await command('Page.enable');
  await command('Runtime.enable');
  await command('Log.enable');
  await command('Page.navigate', { url: navigationUrl.href });
  await waitFor(`document.readyState === 'complete' && document.documentElement.classList.contains('is-ready')`);
  await waitFor(`document.querySelector('#factEnterprises')?.textContent.trim() === '59'`);

  const overview = await evaluate(`(() => ({
    release: window.PROMREGION_DATA.client_metadata.release_code,
    enterprises: document.querySelector('#factEnterprises').textContent.trim(),
    cities: document.querySelector('#factCities').textContent.trim(),
    industries: document.querySelector('#factIndustries').textContent.trim(),
    markers: document.querySelectorAll('#enterpriseMap .leaflet-overlay-pane path.leaflet-interactive').length,
    leaflet: typeof window.L,
    mapStatus: document.querySelector('#mapStatus').textContent.trim(),
    mapHtml: document.querySelector('#enterpriseMap').innerHTML.slice(0, 300),
    cityOptions: [...document.querySelector('#mapCityFilter').options].slice(1).map((item) => item.textContent.trim())
  }))()`);
  assert(overview.release === 'v7-2years-2026-11-22', 'release label');
  assert(overview.enterprises === '59', 'enterprise fact');
  assert(overview.cities === '3', 'city fact');
  assert(overview.industries === '8', 'industry fact');
  assert(overview.markers === 59, `map markers (${JSON.stringify({ overview, runtimeErrors })})`);
  assert(JSON.stringify(overview.cityOptions.sort()) === JSON.stringify(['Новотроицк', 'Оренбург', 'Орск'].sort()), 'city filters');

  await evaluate(`(() => {
    const select = document.querySelector('#mapCityFilter');
    select.value = '3';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await waitFor(`document.querySelector('#mapStatus').textContent.includes('24 объектов')`);
  const orenburgMarkers = await evaluate(`document.querySelectorAll('#enterpriseMap .leaflet-overlay-pane path.leaflet-interactive').length`);
  assert(orenburgMarkers === 24, 'Orenburg map filter');
  await evaluate(`(() => {
    const select = document.querySelector('#mapCityFilter');
    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);

  await evaluate(`document.querySelector('[data-view="enterprises"]').click()`);
  await waitFor(`!document.querySelector('#view-enterprises').hidden`);
  await evaluate(`(() => {
    const input = document.querySelector('#enterpriseSearch');
    input.value = 'Уральская Сталь';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await waitFor(`document.querySelector('[data-open-enterprise="1"]')`);
  await evaluate(`document.querySelector('[data-open-enterprise="1"]').click()`);
  await waitFor(`!document.querySelector('#passport').hidden && document.querySelector('#passportTitle').textContent.includes('Уральская Сталь')`);
  const roundedPoint = await evaluate(`(() => {
    const marker = [...document.querySelectorAll('#passport .chart-point-interactive')]
      .find((item) => item.dataset.tooltip.includes('округлено до 0,1 млн'));
    if (!marker) return null;
    marker.focus();
    marker.dispatchEvent(new FocusEvent('focusin', { bubbles: true, composed: true }));
    const tooltip = marker.closest('.line-chart').querySelector('.chart-hover-tooltip');
    const sourceHeading = [...document.querySelectorAll('#passportBody h3')].find((item) => item.textContent.trim() === 'Источники');
    return {
      label: marker.getAttribute('aria-label'),
      tooltip: tooltip.textContent,
      tooltipHidden: tooltip.hidden,
      activeMatches: document.activeElement === marker,
      activeElement: document.activeElement?.outerHTML?.slice(0, 160) ?? '',
      exactSourceLinks: document.querySelectorAll('#passportBody a.metric-verification[href]').length,
      mainSources: sourceHeading?.closest('section')?.querySelectorAll('li').length ?? 0
    };
  })()`);
  assert(roundedPoint, 'rounded point exists');
  assert(roundedPoint.label.includes('≈') && roundedPoint.label.includes('руб.') && roundedPoint.label.includes('требует сверки'), 'rounded point label');
  assert(!roundedPoint.tooltipHidden && roundedPoint.tooltip === roundedPoint.label, `keyboard tooltip (${JSON.stringify(roundedPoint)})`);
  assert(roundedPoint.exactSourceLinks > 0, 'exact observation source links');
  assert(roundedPoint.mainSources > 0 && roundedPoint.mainSources <= 2, 'maximum two main sources');

  await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  await waitFor(`document.querySelector('#passport').hidden`);

  const acceptance = await evaluate(`(() => {
    const data = window.PROMREGION_DATA;
    const rows = data.metric_values.filter((item) => item.enterprise_id != null);
    const codes = (id) => [...new Set(rows.filter((item) => item.enterprise_id === id).map((item) => item.metric_code))];
    return {
      novochrom: codes(10),
      uralSteel: codes(1),
      propant: codes(9),
      nzbp: codes(37),
      nsplav: codes(2),
      excluded: data.enterprises.filter((item) => [34, 88, 1002].includes(item.id)).length,
      negative: rows.filter((item) => Number(item.value_numeric) < 0).length
    };
  })()`);
  for (const code of ['cost_of_sales', 'gross_profit', 'operating_profit', 'fixed_assets', 'receivables']) assert(acceptance.novochrom.includes(code), `Novochrom ${code}`);
  for (const code of ['cost_of_sales', 'profit_before_tax', 'deferred_income_tax']) assert(acceptance.uralSteel.includes(code), `Ural Steel ${code}`);
  for (const code of ['fixed_assets', 'deferred_tax_assets', 'cash_equivalents', 'cost_of_sales']) assert(acceptance.propant.includes(code), `Propant ${code}`);
  for (const code of ['loan_long', 'equity', 'creditor_debt', 'other_expenses', 'cost_of_sales']) assert(acceptance.nzbp.includes(code), `NZBP ${code}`);
  for (const code of ['inventory', 'management_expenses', 'other_income']) assert(!acceptance.nsplav.includes(code), `NSplav excludes ${code}`);
  assert(acceptance.excluded === 0, 'excluded enterprises');
  assert(acceptance.negative > 0, 'negative values preserved');

  const sections = await evaluate(`(() => {
    const inspect = (name, selector) => {
      document.querySelector('[data-view="' + name + '"]').click();
      return {
        hidden: document.querySelector('#view-' + name).hidden,
        count: document.querySelectorAll(selector).length
      };
    };
    const territories = inspect('territories', '#territoryRows .territory-row');
    const industries = inspect('industries', '#industryRows .industry-row');
    const sources = inspect('sources', '#sourceRows .source-row');
    return {
      territories,
      industries,
      sources,
      sourceResult: document.querySelector('#sourceResultCount').textContent.trim()
    };
  })()`);
  assert(!sections.territories.hidden && sections.territories.count === 3, 'territories section');
  assert(!sections.industries.hidden && sections.industries.count === 8, 'industries section');
  assert(!sections.sources.hidden && sections.sources.count > 0 && sections.sourceResult.includes('162'), 'sources section');

  await command('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    screenWidth: 390,
    screenHeight: 844,
    deviceScaleFactor: 1,
    mobile: false
  });
  navigationUrl.hash = '#overview';
  navigationUrl.searchParams.set('mobile', String(Date.now()));
  await command('Page.navigate', { url: navigationUrl.href });
  await waitFor(`document.readyState === 'complete' && document.documentElement.classList.contains('is-ready')`);
  const mobile = await evaluate(`({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    visualWidth: window.visualViewport?.width ?? null,
    screenWidth: window.screen.width,
    offenders: [...document.querySelectorAll('body *')].map((element) => ({
      tag: element.tagName,
      id: element.id,
      className: typeof element.className === 'string' ? element.className : element.getAttribute('class'),
      left: Math.round(element.getBoundingClientRect().left),
      right: Math.round(element.getBoundingClientRect().right),
      width: Math.round(element.getBoundingClientRect().width)
    })).filter((item) => item.right > window.innerWidth + 1 || item.left < -1).slice(0, 20)
  })`);
  assert(mobile.innerWidth === 390, `mobile viewport (${JSON.stringify(mobile)})`);
  assert(mobile.scrollWidth <= mobile.innerWidth, `mobile horizontal overflow (${JSON.stringify(mobile)})`);
  assert(runtimeErrors.length === 0, `browser errors: ${runtimeErrors.join(' | ')}`);

  console.log(JSON.stringify({ overview, roundedPoint, acceptance, sections, mobile, runtimeErrors }, null, 2));
} finally {
  socket.close();
}
