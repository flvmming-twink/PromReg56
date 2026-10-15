// GitHub Pages cannot run Flask. A read-only shim for /api/session and /api/reports.
// Analytics uses the application's existing clearly-marked demo fallback.
const __originalFetch = window.fetch.bind(window);
window.fetch = function(resource, options) {
  const url = String(resource);
  if (url === '/api/session') return Promise.resolve(new Response(JSON.stringify({is_admin:false, login:null}), {status:200,headers:{'Content-Type':'application/json'}}));
  if (url === '/api/reports') return Promise.resolve(new Response('[]',{status:200,headers:{'Content-Type':'application/json'}}));
  if (url.startsWith('/api/')) return Promise.reject(new Error('Серверный API недоступен в статической версии GitHub Pages'));
  return __originalFetch(resource, options);
};
