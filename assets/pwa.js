/* pwa.js — Đăng ký Service Worker + nút Cài đặt + báo ngoại tuyến + nạp dữ liệu offline.
   Dùng chung cho cả 2 web (tra cứu công khai & cẩm nang nội bộ). Tự suy ra gốc site
   từ vị trí file này (assets/pwa.js) nên chạy đúng dù đặt ở thư mục con nào. */
(function () {
  if (!('serviceWorker' in navigator)) return;

  var me = document.currentScript;
  if (!me) {
    var ss = document.scripts;
    for (var i = 0; i < ss.length; i++) { if (/pwa\.js(\?|$)/.test(ss[i].src)) { me = ss[i]; break; } }
  }
  if (!me || !me.src) return;

  var root = new URL('../', me.src);              // gốc site (…/assets/pwa.js -> …/)
  var swUrl = new URL('sw.js', root).href;
  var bundleUrl = new URL('data/bundle.js', root).href;

  // ---------------- Giao diện nhỏ (góc dưới-trái) ----------------
  var css =
    '#pwaWrap{position:fixed;left:12px;bottom:12px;z-index:99998;display:flex;flex-direction:column;gap:8px;'
    + 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;max-width:250px}'
    + '.pwa-btn{background:#16293f;color:#fff;border:none;border-radius:999px;padding:10px 15px;font-size:13.5px;'
    + 'font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(10,20,35,.32);display:none;align-items:center;gap:7px}'
    + '.pwa-btn:hover{filter:brightness(1.12)}'
    + '.pwa-toast{background:#16293f;color:#fff;border-radius:12px;padding:9px 13px;font-size:12.5px;'
    + 'box-shadow:0 6px 20px rgba(10,20,35,.32);display:none;line-height:1.45}'
    + '.pwa-off{background:#8a5a12}'
    + '@media(max-width:820px){#pwaWrap{bottom:auto;top:10px;left:10px;max-width:60vw}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var wrap = document.createElement('div'); wrap.id = 'pwaWrap';
  wrap.innerHTML =
      '<button class="pwa-btn" id="pwaInstall" type="button">📲 Cài ứng dụng</button>'
    + '<div class="pwa-toast pwa-off" id="pwaOff">📴 Đang ngoại tuyến — dùng dữ liệu đã lưu trong máy.</div>'
    + '<div class="pwa-toast" id="pwaToast"></div>'
    + '<button class="pwa-btn" id="pwaUpd" type="button" style="background:#2e7d46">🔄 Có bản mới — Tải lại</button>';
  function mount(){ if (document.body && !document.getElementById('pwaWrap')) document.body.appendChild(wrap); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  function $(id){ return document.getElementById(id); }
  function toast(msg, keep){
    var t = $('pwaToast'); if (!t) return;
    t.textContent = msg; t.style.display = 'block';
    if (!keep){ clearTimeout(t._t); t._t = setTimeout(function(){ t.style.display = 'none'; }, 4500); }
  }

  // ---------------- Báo trạng thái mạng ----------------
  function updNet(){ var o = $('pwaOff'); if (o) o.style.display = navigator.onLine ? 'none' : 'block'; }
  window.addEventListener('online', updNet);
  window.addEventListener('offline', updNet);
  setTimeout(updNet, 400);

  // ---------------- Nút "Cài ứng dụng" (Add to Home Screen) ----------------
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e;
    var b = $('pwaInstall'); if (b) b.style.display = 'inline-flex';
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.id === 'pwaInstall' && deferred) {
      deferred.prompt();
      (deferred.userChoice || Promise.resolve()).then(function(){ deferred = null; var b=$('pwaInstall'); if(b) b.style.display='none'; });
    }
  });
  window.addEventListener('appinstalled', function () {
    var b = $('pwaInstall'); if (b) b.style.display = 'none';
    toast('✓ Đã cài. Mở từ màn hình chính để dùng cả khi mất mạng.');
  });

  // ---------------- Đăng ký Service Worker ----------------
  var updating = false;
  navigator.serviceWorker.register(swUrl, { scope: root.pathname }).then(function (reg) {

    function watch(w){ if(!w) return; w.addEventListener('statechange', function(){
      if (w.state === 'installed' && navigator.serviceWorker.controller){ var u=$('pwaUpd'); if(u) u.style.display='inline-flex'; }
    }); }
    watch(reg.waiting);
    reg.addEventListener('updatefound', function(){ watch(reg.installing); });

    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'pwaUpd') { updating = true; if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' }); }
    });

    // Sau khi SW sẵn sàng: nếu chưa lưu dữ liệu -> nạp 1 lần để dùng offline
    navigator.serviceWorker.ready.then(function () {
      if (!('caches' in window)) return;
      caches.match(bundleUrl).then(function (hit) {
        if (hit) return;                                   // đã lưu rồi
        var ctrl = navigator.serviceWorker.controller; if (!ctrl) return;
        toast('⬇️ Đang lưu dữ liệu để dùng offline…', true);
        ctrl.postMessage({ type: 'PRIME' });
      }).catch(function(){});
    });
  }).catch(function(){});

  // ---------------- Nghe tiến trình từ Service Worker ----------------
  navigator.serviceWorker.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === 'prime-progress') toast('⬇️ Đang lưu dữ liệu offline… ' + Math.round(d.done / d.total * 100) + '%', true);
    if (d.type === 'prime-done')     toast('✓ Đã sẵn sàng dùng ngoại tuyến (offline).');
  });

  // Chỉ tải lại khi người dùng bấm "Có bản mới" (tránh reload lúc cài lần đầu)
  navigator.serviceWorker.addEventListener('controllerchange', function () { if (updating) location.reload(); });
})();
