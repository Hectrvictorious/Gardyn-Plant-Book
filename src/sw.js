/* Swan's Island Plant Book: service worker.
   The page is cached so it opens with no signal. Every published build changes BUILD, so a phone notices
   a new version the next time the app is opened (or comes back to the screen), caches it fresh, takes over,
   and tells open pages. A page reloads only if its own build is different, at most twice in two minutes.
   Nothing ever needs reinstalling. (Same design as the Swan's Island Boat app.) */
const BUILD = '@@BUILD@@';
const VERSION = 'plantbook-' + BUILD;
const SHELL = ['./', './index.html', './manifest.json', './icon-v3-192.png', './apple-touch-icon-v3.png', './favicon-v3-32.png'];
let isUpdate = false;
const acked = new Set();

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const had = await caches.has(VERSION);
    isUpdate = !!self.registration.active && !had;
    const c = await caches.open(VERSION);
    const complete = had && (await Promise.all(SHELL.map(u => c.match(u)))).every(Boolean);
    if (!complete) {
      await Promise.all(SHELL.map(u => fetch(new Request(u + '?v=' + BUILD, { cache: 'reload' })).then(res => {
        if (!res.ok) throw new Error(u + ' ' + res.status);
        return c.put(u, res);
      })));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION && k.startsWith('plantbook-')).map(k => caches.delete(k)));
    await self.clients.claim();
  })().then(() => { if (isUpdate) setTimeout(nudge, 50); }));
});

async function nudge() {
  isUpdate = false;
  const wins = await self.clients.matchAll({ type: 'window' });
  wins.forEach(c => { try { c.postMessage({ type: 'pb-updated', version: VERSION }); } catch (err) {} });
  setTimeout(() => { wins.forEach(c => { if (!acked.has(c.id) && 'navigate' in c) c.navigate(c.url).catch(() => {}); }); }, 2500);
}

self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'pb-ack' && e.source) acked.add(e.source.id);
  if (d.type === 'pb-hello' && e.source) { try { e.source.postMessage({ type: 'pb-version', version: VERSION }); } catch (err) {} }
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  const isShell = same && (req.mode === 'navigate' || SHELL.some(p => p !== './' && url.pathname.endsWith(p.slice(1))));
  if (isShell) {
    const key = req.mode === 'navigate' ? './' : req;
    e.respondWith(caches.match(key, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => { if (res.ok && req.mode !== 'navigate') { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; })).catch(() => caches.match('./')));
  } else if (/fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })));
  }
});
