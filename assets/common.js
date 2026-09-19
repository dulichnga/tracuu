/* ============================================================
   common.js — Lõi dùng chung cho Danh sách & Web GIS
   - Danh mục loại địa điểm (nhãn + màu)
   - Bộ đọc thành tiếng (TTS) tiếng Việt, có chia câu để đọc văn bản dài
   - Truy cập dữ liệu (window.RUSSIA_DB do build.py sinh trong bundle.js)
   - Tiện ích: sao đánh giá, khoảng cách Haversine, lộ trình gần nhất...
   Dùng lại cho mọi vùng — thêm dữ liệu KHÔNG phải sửa file này.
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------- Danh mục loại địa điểm ---------- */
  const CATEGORIES = {
    museum:        { vi: "Bảo tàng",            color: "#7C5CFC", emoji: "🏛️" },
    palace:        { vi: "Cung điện",           color: "#E67E22", emoji: "👑" },
    church:        { vi: "Nhà thờ / Tôn giáo",  color: "#2E86DE", emoji: "⛪" },
    fortress:      { vi: "Pháo đài / Thành luỹ",color: "#7F8C8D", emoji: "🏰" },
    monument:      { vi: "Tượng đài / Di tích", color: "#E74C3C", emoji: "🗽" },
    park_garden:   { vi: "Công viên / Vườn",    color: "#27AE60", emoji: "🌳" },
    bridge:        { vi: "Cầu",                 color: "#16A085", emoji: "🌉" },
    square_street: { vi: "Quảng trường / Phố",  color: "#F39C12", emoji: "🏙️" },
    theatre:       { vi: "Nhà hát",             color: "#D6409F", emoji: "🎭" },
    other:         { vi: "Khác",                color: "#95A5A6", emoji: "📍" },
  };
  function catInfo(slug) { return CATEGORIES[slug] || CATEGORIES.other; }
  function primaryCat(place) {
    const c = (place.categories && place.categories[0]) || "other";
    return c;
  }
  function catColor(place) { return catInfo(primaryCat(place)).color; }

  /* ---------- Đa ngôn ngữ (VI / EN / RU) ---------- */
  const LANGS = {
    vi: { label: "Tiếng Việt", locale: "vi-VN", flag: "🇻🇳" },
    en: { label: "English",    locale: "en-US", flag: "🇬🇧" },
    ru: { label: "Русский",    locale: "ru-RU", flag: "🇷🇺" },
  };
  let LANG = "vi";
  function getLang() { return LANG; }
  function setLang(l) { if (LANGS[l]) LANG = l; return LANG; }
  // Trường bản địa hoá: t(place,'presentation_short') -> presentation_short_<lang>, fallback VI/EN/RU
  function t(o, base) {
    if (!o) return "";
    return o[base + "_" + LANG] || o[base + "_vi"] || o[base + "_en"] || o[base + "_ru"] || "";
  }
  function tArr(o, base) {
    if (!o) return [];
    return o[base + "_" + LANG] || o[base + "_vi"] || o[base + "_en"] || o[base + "_ru"] || [];
  }
  // Nhãn giao diện đa ngôn ngữ
  const UI = {
    listen:     { vi: "🔊 Nghe",         en: "🔊 Listen",        ru: "🔊 Слушать" },
    listenLong: { vi: "🎧 Nghe chi tiết", en: "🎧 Listen (full)", ru: "🎧 Подробно" },
    detail:     { vi: "📖 Chi tiết",     en: "📖 Details",       ru: "📖 Подробнее" },
    addTour:    { vi: "➕ Thêm vào tour", en: "➕ Add to tour",   ru: "➕ В маршрут" },
    inTour:     { vi: "✓ Trong tour",    en: "✓ In tour",        ru: "✓ В маршруте" },
    map:        { vi: "🗺️ Bản đồ",       en: "🗺️ Map",           ru: "🗺️ Карта" },
    share:      { vi: "🔗 Chia sẻ",      en: "🔗 Share",         ru: "🔗 Поделиться" },
    highlights: { vi: "Điểm nhấn",       en: "Highlights",       ru: "Особенности" },
    detailPres: { vi: "Thuyết trình chi tiết", en: "Full presentation", ru: "Подробное описание" },
    visitInfo:  { vi: "Thông tin tham quan",   en: "Visitor info",      ru: "Информация для посещения" },
    reviews:    { vi: "Tóm tắt bình luận",     en: "Review summary",    ru: "Отзывы" },
    hours:      { vi: "Giờ mở cửa", en: "Opening hours", ru: "Часы работы" },
    ticket:     { vi: "Vé",         en: "Ticket",        ru: "Билет" },
    duration:   { vi: "Thời lượng", en: "Duration",      ru: "Длительность" },
    bestTime:   { vi: "Thời điểm đẹp", en: "Best time",  ru: "Лучшее время" },
    tips:       { vi: "Mẹo",        en: "Tip",           ru: "Совет" },
    address:    { vi: "Địa chỉ",    en: "Address",       ru: "Адрес" },
    noRating:   { vi: "chưa có đánh giá", en: "no rating yet", ru: "нет оценки" },
  };
  function uiText(key) { const e = UI[key]; return e ? (e[LANG] || e.vi) : key; }

  /* ---------- Truy cập dữ liệu ---------- */
  function getDB() {
    if (global.RUSSIA_DB && Array.isArray(global.RUSSIA_DB.places)) return global.RUSSIA_DB;
    return { meta: { total_places: 0, regions: [], categories: {} }, places: [] };
  }
  function getPlaces() { return getDB().places.slice(); }
  function getMeta() { return getDB().meta || {}; }

  /* ---------- Tiện ích ---------- */
  function escapeHtml(s) {
    if (s == null) return "";
    return String(s).replace(/[&<>"']/g, function (m) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
    });
  }
  function starHTML(value) {
    if (value == null) return '<span class="stars muted">' + uiText("noRating") + '</span>';
    const v = Number(value);
    const full = Math.floor(v);
    const half = v - full >= 0.25 && v - full < 0.75;
    const fullN = half ? full : Math.round(v);
    let s = "";
    for (let i = 0; i < 5; i++) {
      if (i < fullN) s += "★";
      else if (i === fullN && half) s += "⯪";
      else s += "☆";
    }
    return '<span class="stars" title="' + v + '/5">' + s + "</span>";
  }
  function fmtCount(n) {
    if (n == null) return "";
    n = Number(n);
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".0", "") + "k";
    return String(n);
  }
  function toRad(d) { return (d * Math.PI) / 180; }
  function haversineKm(a, b) {
    const R = 6371;
    const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
    const s = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }
  // Lộ trình láng giềng gần nhất (nearest-neighbour) từ điểm bắt đầu
  function nearestRoute(places, startIdx) {
    if (!places.length) return [];
    const pts = places.map(function (p) {
      return { p: p, lat: p.coordinates.lat, lon: p.coordinates.lon };
    });
    const used = new Array(pts.length).fill(false);
    let cur = startIdx || 0;
    used[cur] = true;
    const order = [cur];
    for (let k = 1; k < pts.length; k++) {
      let best = -1, bestD = Infinity;
      for (let j = 0; j < pts.length; j++) {
        if (used[j]) continue;
        const d = haversineKm(pts[cur], pts[j]);
        if (d < bestD) { bestD = d; best = j; }
      }
      if (best === -1) break;
      used[best] = true; order.push(best); cur = best;
    }
    return order.map(function (i) { return places[i]; });
  }
  function routeDistanceKm(orderedPlaces) {
    let d = 0;
    for (let i = 1; i < orderedPlaces.length; i++) {
      d += haversineKm(
        { lat: orderedPlaces[i - 1].coordinates.lat, lon: orderedPlaces[i - 1].coordinates.lon },
        { lat: orderedPlaces[i].coordinates.lat, lon: orderedPlaces[i].coordinates.lon }
      );
    }
    return d;
  }

  /* ---------- Bộ đọc thành tiếng (TTS) tiếng Việt ---------- */
  const TTS = {
    synth: global.speechSynthesis || null,
    voice: null,
    rate: 1,
    _queue: [],
    _i: 0,
    _onState: null,       // callback(state) -> 'start'|'end'
    activeId: null,       // id đang đọc (để làm nổi nút)
    supported: !!global.speechSynthesis,

    pickVoice: function (lang) {
      if (!this.synth) return null;
      lang = lang || "vi";
      const loc = ((LANGS[lang] || LANGS.vi).locale).toLowerCase();   // "vi-vn"
      const vs = this.synth.getVoices() || [];
      const re1 = new RegExp(loc.replace("-", "[-_]?"), "i");
      const re2 = new RegExp("^" + lang, "i");
      const v = vs.find(function (x) { return re1.test(x.lang); }) ||
                vs.find(function (x) { return re2.test(x.lang); }) || null;
      if (lang === "vi") this.voice = v || this.voice;                 // giữ tương thích
      return v;
    },
    hasVietnameseVoice: function () {
      if (!this.synth) return false;
      const vs = this.synth.getVoices() || [];
      return vs.some(function (v) { return /^vi/i.test(v.lang); });
    },
    _chunk: function (text) {
      const sentences = String(text).match(/[^.!?…]+[.!?…]*\s*/g) || [String(text)];
      const out = []; let cur = "";
      sentences.forEach(function (s) {
        if ((cur + s).length > 200) { if (cur.trim()) out.push(cur.trim()); cur = s; }
        else cur += s;
      });
      if (cur.trim()) out.push(cur.trim());
      return out;
    },
    speak: function (text, opts) {
      opts = opts || {};
      if (!this.synth) { alert("Trình duyệt của bạn không hỗ trợ đọc thành tiếng."); return; }
      this.stop();
      if (!text) return;
      const lang = opts.lang || LANG;
      this._locale = (LANGS[lang] || LANGS.vi).locale;
      this._voice = this.pickVoice(lang);
      this.activeId = opts.id || null;
      this._queue = this._chunk(text);
      this._i = 0;
      this._onState = opts.onState || null;
      if (this._onState) this._onState("start");
      this._speakNext();
    },
    _speakNext: function () {
      const self = this;
      if (this._i >= this._queue.length) {
        this.activeId = null;
        if (this._onState) this._onState("end");
        return;
      }
      const u = new SpeechSynthesisUtterance(this._queue[this._i]);
      u.lang = this._locale || "vi-VN";
      if (this._voice) u.voice = this._voice;
      u.rate = this.rate;
      u.onend = function () { self._i++; self._speakNext(); };
      u.onerror = function () { self._i++; self._speakNext(); };
      this.synth.speak(u);
    },
    stop: function () {
      if (!this.synth) return;
      const wasActive = this.activeId;
      this._queue = []; this._i = 0;
      this.synth.cancel();
      this.activeId = null;
      if (wasActive && this._onState) this._onState("end");
    },
    setRate: function (r) {
      this.rate = r;
      // đổi tốc độ giữa chừng: đọc lại từ câu hiện tại
    },
    isSpeaking: function () { return this.synth && (this.synth.speaking || this._queue.length > this._i); },
  };
  if (global.speechSynthesis) {
    try { global.speechSynthesis.onvoiceschanged = function () { TTS.pickVoice(); }; } catch (e) {}
    TTS.pickVoice();
    // dừng đọc khi rời trang
    global.addEventListener("beforeunload", function () { try { TTS.stop(); } catch (e) {} });
  }

  /* ---------- Ghim địa điểm (lưu trong máy) ---------- */
  var PIN_KEY = "cndlPins";
  function _pinsRaw(){ try{ var a=JSON.parse(localStorage.getItem(PIN_KEY)||"[]"); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function _pinsSave(a){ try{ localStorage.setItem(PIN_KEY, JSON.stringify(a)); }catch(e){} try{ if(global.dispatchEvent) global.dispatchEvent(new CustomEvent("cndl-pins")); }catch(e){} }
  function pinList(){ return _pinsRaw(); }
  function pinHas(id){ var a=_pinsRaw(); for(var i=0;i<a.length;i++){ if(a[i].id===id) return true; } return false; }
  function pinCount(){ return _pinsRaw().length; }
  function pinToggleObj(o){ if(!o||!o.id) return false; var a=_pinsRaw(); for(var i=0;i<a.length;i++){ if(a[i].id===o.id){ a.splice(i,1); _pinsSave(a); return false; } } a.push({id:o.id, n:o.n||o.id, s:o.s||""}); _pinsSave(a); return true; }
  function pinToggle(p){ if(!p) return false; if(typeof p==="string") return pinToggleObj({id:p}); return pinToggleObj({id:p.id, n:(t(p,"name")||p.name_vi||p.id), s:(p.region_name_vi||"")}); }
  function pinBtnHTML(p){ if(!p||!p.id) return ""; var on=pinHas(p.id); var nm=(t(p,"name")||p.name_vi||p.id); var sub=(p.region_name_vi||"");
    return '<button type="button" class="btn sm pin-btn'+(on?' on':'')+'" data-pin="'+escapeHtml(p.id)+'" data-pinname="'+escapeHtml(nm)+'" data-pinsub="'+escapeHtml(sub)+'" title="'+(on?'Bỏ ghim':'Ghim để xem nhanh khi mở app')+'">'+(on?'📌 Đã ghim':'📌 Ghim')+'</button>'; }
  function docUrlOf(p){ return (p && !p.custom && p.has_doc && p.doc_url) ? p.doc_url : ""; }

  /* ---------- Lưu offline theo vùng (địa điểm + bài thuyết minh) ---------- */
  function _ctrl(){ return (global.navigator && navigator.serviceWorker && navigator.serviceWorker.controller) ? navigator.serviceWorker.controller : null; }
  var _rid=0;
  function saveOffline(urls, onProgress){ return new Promise(function(resolve){ var ctrl=_ctrl(); if(!ctrl){ resolve({ok:false,reason:"no-sw"}); return; } urls=urls||[]; if(!urls.length){ resolve({ok:true,done:0,total:0,fail:0}); return; } var rid="o"+(++_rid); function h(e){ var d=e.data||{}; if(d.rid!==rid) return; if(d.type==="off-progress"){ if(onProgress) onProgress(d.done,d.total,d.fail); } else if(d.type==="off-done"){ navigator.serviceWorker.removeEventListener("message",h); resolve({ok:true,done:d.done,total:d.total,fail:d.fail}); } } navigator.serviceWorker.addEventListener("message",h); ctrl.postMessage({type:"CACHE_LIST",urls:urls,rid:rid}); setTimeout(function(){ navigator.serviceWorker.removeEventListener("message",h); resolve({ok:true,timeout:true}); }, 300000); }); }
  function ensureData(onProgress){ return new Promise(function(resolve){ var ctrl=_ctrl(); if(!ctrl||!(global.caches)){ resolve({ok:false,reason:"no-sw"}); return; } var bu; try{ bu=new URL("data/bundle.js", location.href).href; }catch(e){ bu="data/bundle.js"; } caches.match(bu).then(function(hit){ if(hit){ resolve({ok:true,already:true}); return; } var rid="p"+(++_rid); function h(e){ var d=e.data||{}; if(d.type==="prime-progress"){ if(onProgress) onProgress(d.done,d.total); } else if(d.type==="prime-done"){ navigator.serviceWorker.removeEventListener("message",h); resolve({ok:true}); } } navigator.serviceWorker.addEventListener("message",h); ctrl.postMessage({type:"PRIME"}); setTimeout(function(){ navigator.serviceWorker.removeEventListener("message",h); resolve({ok:true,timeout:true}); }, 300000); }).catch(function(){ resolve({ok:false}); }); }); }
  function saveRegionOffline(docUrls, cb){ return ensureData(function(d,t2){ if(cb) cb("data",d,t2); }).then(function(){ return saveOffline(docUrls||[], function(d,t2,f){ if(cb) cb("docs",d,t2,f); }); }); }
  function offlineInfo(){ return new Promise(function(resolve){ var ctrl=_ctrl(); if(!ctrl){ resolve({count:0}); return; } var rid="q"+(++_rid); function h(e){ var d=e.data||{}; if(d.rid!==rid) return; if(d.type==="off-info"){ navigator.serviceWorker.removeEventListener("message",h); resolve({count:d.count}); } } navigator.serviceWorker.addEventListener("message",h); ctrl.postMessage({type:"OFFLINE_QUERY",rid:rid}); setTimeout(function(){ navigator.serviceWorker.removeEventListener("message",h); resolve({count:0}); }, 4000); }); }
  function clearOffline(){ return new Promise(function(resolve){ var ctrl=_ctrl(); if(!ctrl){ resolve(false); return; } var rid="c"+(++_rid); function h(e){ var d=e.data||{}; if(d.rid!==rid) return; if(d.type==="off-cleared"){ navigator.serviceWorker.removeEventListener("message",h); resolve(true); } } navigator.serviceWorker.addEventListener("message",h); ctrl.postMessage({type:"CLEAR_OFFLINE",rid:rid}); setTimeout(function(){ navigator.serviceWorker.removeEventListener("message",h); resolve(true); }, 5000); }); }

  /* ---------- Xuất API ---------- */
  // Link bản đồ chính xác theo TOẠ ĐỘ — ghim đúng 1 điểm, KHÔNG ra nhiều kết quả bắt người dùng chọn
  function mapUrl(p, kind) {
    var c = (p && p.coordinates) || {};
    if (c.lat == null || c.lon == null) return "#";
    if (kind === "yandex") return "https://yandex.com/maps/?pt=" + c.lon + "," + c.lat + "&z=16&l=map";
    return "https://www.google.com/maps?q=" + c.lat + "," + c.lon;   // dạng ?q=lat,lon: ghim thẳng toạ độ
  }

  global.RT = {
    CATEGORIES: CATEGORIES,
    mapUrl: mapUrl,
    catInfo: catInfo,
    primaryCat: primaryCat,
    catColor: catColor,
    LANGS: LANGS,
    getLang: getLang,
    setLang: setLang,
    t: t,
    tArr: tArr,
    uiText: uiText,
    getDB: getDB,
    getPlaces: getPlaces,
    getMeta: getMeta,
    escapeHtml: escapeHtml,
    starHTML: starHTML,
    fmtCount: fmtCount,
    haversineKm: haversineKm,
    nearestRoute: nearestRoute,
    routeDistanceKm: routeDistanceKm,
    pinList: pinList,
    pinHas: pinHas,
    pinCount: pinCount,
    pinToggle: pinToggle,
    pinToggleObj: pinToggleObj,
    pinBtnHTML: pinBtnHTML,
    docUrlOf: docUrlOf,
    saveOffline: saveOffline,
    ensureData: ensureData,
    saveRegionOffline: saveRegionOffline,
    offlineInfo: offlineInfo,
    clearOffline: clearOffline,
    TTS: TTS,
    CONTACT: { email: "lopmaybay@gmail.com", fb: "https://fb.com/lopmaybay" },
  };
  /* ---------- Tự gắn nút ghim (mọi trang có [data-pin]) ---------- */
  if (global.document) {
    document.addEventListener("click", function(e){
      var b=(e.target&&e.target.closest)?e.target.closest("[data-pin]"):null; if(!b) return;
      var id=b.getAttribute("data-pin");
      var on=pinToggleObj({id:id, n:b.getAttribute("data-pinname")||id, s:b.getAttribute("data-pinsub")||""});
      var sel='[data-pin="'+((global.CSS&&CSS.escape)?CSS.escape(id):id)+'"]';
      var all=document.querySelectorAll(sel);
      for(var i=0;i<all.length;i++){ all[i].classList.toggle("on", on); if(all[i].classList.contains("pin-btn")) all[i].innerHTML = on?'📌 Đã ghim':'📌 Ghim'; }
    });
  }

})(window);
