/* sw.js — Service Worker cho "Cẩm nang Du lịch Nga".
   Cho phép web CHẠY KHI MẤT MẠNG (offline): lưu sẵn giao diện + dữ liệu địa điểm,
   và lưu lại các ô bản đồ đã xem. Đường dẫn tương đối = gốc site (nơi đặt sw.js). */
const APP   = 'cndl-tracuu';
const VER   = 'v1';                       // tăng số này khi đổi giao diện (html/css/js)
const SHELL_CACHE = APP + '-shell-' + VER;
const DATA_CACHE  = APP + '-data';        // bundle.js, index.json… (giữ qua các phiên bản)
const TILE_CACHE  = APP + '-tiles';       // ô bản đồ tải lúc dùng
const TILE_MAX    = 1600;                 // trần số ô để không phình bộ nhớ vô hạn

// Giao diện + thư viện (file nhỏ) — lưu sẵn khi cài đặt.
const SHELL = [
  './', 'index.html', 'gis.html', 'list.html',
  'am-thuc/index.html',
  'manifest.webmanifest', 'offline.html',
  'assets/app.css', 'assets/common.js', 'assets/pwa.js', 'assets/favicon.svg',
  'assets/vendor/leaflet.css', 'assets/vendor/leaflet.js', 'assets/vendor/leaflet.markercluster.js',
  'assets/vendor/MarkerCluster.css', 'assets/vendor/MarkerCluster.Default.css',
  'assets/vendor/images/marker-icon.png', 'assets/vendor/images/marker-icon-2x.png',
  'assets/vendor/images/marker-shadow.png', 'assets/vendor/images/layers.png', 'assets/vendor/images/layers-2x.png',
  'assets/icon-192.png', 'assets/icon-512.png'
];
// Dữ liệu lớn — nạp trước để dùng offline (khi bấm "lưu dữ liệu").
const DATA = ['data/bundle.js', 'data/index.json', 'data/vn-archipelago.js', 'data/rings.js'];
// Thư viện ngoài (xuất PDF) — lưu để xuất được cả khi offline.
const EXTRA = ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil((async function () {
    const c = await caches.open(SHELL_CACHE);
    await Promise.allSettled(SHELL.map(function (u) { return c.add(new Request(u, { cache: 'reload' })); }));
  })());
});

self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    const keep = [SHELL_CACHE, DATA_CACHE, TILE_CACHE];
    const names = await caches.keys();
    await Promise.all(names.filter(function (n) { return n.indexOf(APP + '-') === 0 && keep.indexOf(n) < 0; })
                           .map(function (n) { return caches.delete(n); }));
    await self.clients.claim();
  })());
});

// Nạp dữ liệu lớn + thư viện ngoài để dùng offline (gọi từ trang qua message PRIME).
async function prime(client) {
  const dc = await caches.open(DATA_CACHE);
  let done = 0;
  for (const u of DATA) {
    try {
      const res = await fetch(new Request(u, { cache: 'reload' }));
      if (res && (res.ok || res.type === 'opaque')) await dc.put(u, res.clone());
    } catch (err) {}
    done++;
    if (client) client.postMessage({ type: 'prime-progress', done: done, total: DATA.length });
  }
  for (const u of EXTRA) { try { const r = await fetch(u, { mode: 'cors' }); if (r && r.ok) await dc.put(u, r.clone()); } catch (err) {} }
  if (client) client.postMessage({ type: 'prime-done' });
}

self.addEventListener('message', function (e) {
  const d = e.data || {};
  if (d.type === 'PRIME') e.waitUntil(prime(e.source));
  if (d.type === 'SKIP_WAITING') self.skipWaiting();
});

function isTile(href) {
  return /tile\.openstreetmap\.org/.test(href) || /server\.arcgisonline\.com/.test(href)
      || /basemaps\.cartocdn\.com/.test(href) || /\.tile\./.test(href);
}
async function trimTiles() {
  const c = await caches.open(TILE_CACHE);
  const keys = await c.keys();
  if (keys.length > TILE_MAX) { const n = keys.length - TILE_MAX; for (let i = 0; i < n; i++) await c.delete(keys[i]); }
}

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url; try { url = new URL(req.url); } catch (err) { return; }

  // 1) Ô bản đồ: cache-first, lưu lại lúc dùng (xem tới đâu lưu tới đó)
  if (isTile(url.href)) {
    e.respondWith((async function () {
      const c = await caches.open(TILE_CACHE);
      const hit = await c.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res && (res.ok || res.type === 'opaque')) { c.put(req, res.clone()); trimTiles(); }
        return res;
      } catch (err) { return hit || Response.error(); }
    })());
    return;
  }

  // 2) Khác nguồn (cross-origin)
  if (url.origin !== self.location.origin) {
    if (url.href.indexOf('jspdf') >= 0) {           // thư viện PDF: cache-first
      e.respondWith((async function () {
        const c = await caches.open(DATA_CACHE);
        const hit = await c.match(req, { ignoreVary: true });
        if (hit) return hit;
        try { const res = await fetch(req); if (res && res.ok) c.put(req, res.clone()); return res; }
        catch (err) { return hit || Response.error(); }
      })());
    }
    return;   // Nominatim (tìm kiếm), Facebook, Google… để mạng lo (không chặn)
  }

  // 3) Điều hướng trang (HTML): mạng trước, hỏng thì lấy bản đã lưu, cuối cùng là offline.html
  if (req.mode === 'navigate') {
    e.respondWith((async function () {
      try {
        const res = await fetch(req);
        const c = await caches.open(SHELL_CACHE); c.put(req, res.clone());
        return res;
      } catch (err) {
        const c = await caches.open(SHELL_CACHE);
        return (await c.match(req)) || (await c.match('index.html')) || (await c.match('./')) || (await c.match('offline.html')) || Response.error();
      }
    })());
    return;
  }

  // 4) Dữ liệu (data/…): dùng bản đã lưu ngay + cập nhật ngầm (stale-while-revalidate)
  if (url.pathname.indexOf('/data/') >= 0) {
    e.respondWith((async function () {
      const c = await caches.open(DATA_CACHE);
      const hit = await c.match(req);
      const net = fetch(req).then(function (res) { if (res && res.ok) c.put(req, res.clone()); return res; }).catch(function () { return null; });
      return hit || (await net) || Response.error();
    })());
    return;
  }

  // 5) Tài nguyên tĩnh còn lại (css/js/ảnh…): cache-first, cập nhật ngầm
  e.respondWith((async function () {
    const c = await caches.open(SHELL_CACHE);
    const hit = await c.match(req);
    if (hit) { fetch(req).then(function (res) { if (res && res.ok) c.put(req, res.clone()); }).catch(function () {}); return hit; }
    try { const res = await fetch(req); if (res && res.ok) c.put(req, res.clone()); return res; }
    catch (err) { return Response.error(); }
  })());
});
