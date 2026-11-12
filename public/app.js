/* STS Grilă v2 – lecții tip Duolingo, exersare, simulare, greșeli, statistici, cont cu sincronizare. */
(function () {
  "use strict";
  var CATS = window.CATEGORIES, QS = window.QUESTIONS, LES = window.LESSONS || [], TERMS = window.TERMS || {};
  var CATBY = {}, BYID = {};
  CATS.forEach(function (c) { CATBY[c.id] = c; });
  QS.forEach(function (q) { BYID[q.id] = q; });
  var LVL = { 1: "Începător", 2: "Mediu", 3: "Avansat" };
  var LET = ["A", "B", "C", "D"];
  var LS_P = "sts_p2", LS_A = "sts_auth2", LS_S = "sts_set2";
  var DAILY_GOAL = 50;
  var app = document.getElementById("app"), hdr = document.getElementById("hdr"), nav = document.getElementById("nav"), sheet = document.getElementById("sheet");
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}

  /* ---------------- utilitare ---------------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pct(c, a) { return a ? Math.round(100 * c / a) : 0; }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function toTop() { window.scrollTo(0, 0); requestAnimationFrame(function () { window.scrollTo(0, 0); }); setTimeout(function () { window.scrollTo(0, 0); }, 60); }
  function fmtTime(s) { s = Math.max(0, Math.round(s)); return ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2); }
  function fmtDate(t) { var d = new Date(t); return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }


  /* ---------------- iconițe SVG (identice pe iPhone/Android) ---------------- */
  function ic(d, extra) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (extra || "") + ">" + d + "</svg>"; }
  var ICON = {
    learn: ic('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/><path d="M22 9v6"/>'),
    practice: ic('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'),
    cards: ic('<rect x="3" y="6" width="14" height="15" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v13"/>'),
    mist: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/>'),
    stats: ic('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    acct: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
    flame: ic('<path d="M12 2c1 4 5 5.5 5 10.5A5 5 0 0 1 7 12.5c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3 0-6 1-9z" fill="#fb923c" stroke="#f97316"/>'),
    bolt: ic('<path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="#facc15" stroke="#eab308"/>'),
    sndOn: ic('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>'),
    sndOff: ic('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>'),
    cloudOk: ic('<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z"/><path d="M9 13l2 2 4-4"/>'),
    cloudOff: ic('<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z"/><path d="M12 10v3M12 15.5v.5"/>'),
    cloudSync: ic('<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z"/><path d="M10 14h4"/>'),
    x: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
    heart: ic('<path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 5.5-8 11-8 11z" fill="#ef4444" stroke="#dc2626"/>'),
    lock: ic('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    book: ic('<path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a2 2 0 0 0-2 2 2 2 0 0 0-2-2H4z"/><path d="M12 5v16"/>'),
    print: ic('<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'),
    compass: ic('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
    bin: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10v4M10 10h2v4h-2zM15 10v4"/>')
  };

  /* ---------------- stare ---------------- */
  var merge = window.mergeProgress;
  var SET = Object.assign({ mute: false, free: false, cur: "ex", cats: CATS.map(function (c) { return c.id; }), n: 20, en: 50, et: 1, diff: 1 }, lsGet(LS_S) || {});
  if (!SET.k2) { SET.k2 = 1; if (SET.cats.indexOf("pp") < 0) SET.cats.push("pp"); if (SET.cats.indexOf("voip") < 0) SET.cats.push("voip"); try { localStorage.setItem(LS_S, JSON.stringify(SET)); } catch (e) {} }
  if (!SET.k4) { SET.k4 = 1; if (SET.cats.indexOf("iq") < 0) SET.cats.push("iq"); try { localStorage.setItem(LS_S, JSON.stringify(SET)); } catch (e) {} }
  if (!SET.k3) { SET.k3 = 1; if (SET.cats.indexOf("ex") < 0) SET.cats.push("ex"); try { localStorage.setItem(LS_S, JSON.stringify(SET)); } catch (e) {} }
  if (!SET.k5) { SET.k5 = 1; if (SET.cats.indexOf("trk") < 0) SET.cats.push("trk"); try { localStorage.setItem(LS_S, JSON.stringify(SET)); } catch (e) {} }
  var AUTH = lsGet(LS_A); try { if (AUTH && AUTH.user && !localStorage.getItem("sts_lastu")) localStorage.setItem("sts_lastu", AUTH.user); } catch (e) {}
  var P = lsGet(LS_P);
  if (!P || P.v !== 2) P = migrateV1();
  function migrateV1() {
    var p = merge.empty(), old = lsGet("stsgrila_v1"), now = Date.now();
    if (old) {
      var okId = function (id) { if (!BYID[id]) return false; var m = /^net-(\d+)$/.exec(id); return !m || +m[1] <= 189; };
      Object.keys(old.seen || {}).forEach(function (id) { if (okId(id)) p.q[id] = [1, 0, now, 1]; });
      Object.keys(old.wrong || {}).forEach(function (id) { if (okId(id)) { p.q[id] = [0, old.wrong[id] || 1, now, 0]; p.mist[id] = [now, 1]; } });
      (old.exams || []).forEach(function (e) { if (e && e.d) p.exams.push({ t: e.d, c: e.c, n: e.t }); });
    }
    return p;
  }
  function ensure() { if (P.place === undefined) P.place = null; P.plan = P.plan || { exam: "", et: 0, done: {}, tests: {} }; P.plan.done = P.plan.done || {}; P.plan.tests = P.plan.tests || {}; P.bm = P.bm || {}; P.fc = P.fc || {}; }
  ensure();
  function saveSet() { lsSet(LS_S, SET); }
  function saveP(noSync) { ensure(); P.t = Date.now(); lsSet(LS_P, P); if (!noSync) scheduleSync(); }

  function xpTotal() { var s = 0; for (var k in P.days) s += P.days[k] || 0; return s; }
  function xpToday() { return P.days[dayKey()] || 0; }
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); } catch (e) {}
  var DEV = (function () { try { var d = localStorage.getItem("sts_dev"); if (!d) { d = Math.random().toString(36).slice(2, 10); localStorage.setItem("sts_dev", d); } return d; } catch (e) { return "x"; } })();
  function addXP(n) { if (!n) return; var k = dayKey(); P.dd = P.dd || {}; var dk = DEV + "|" + k; if (P.dd[dk] == null) { var any = false; for (var z in P.dd) if (z.split("|")[1] === k) any = true; if (!any && P.days[k]) P.dd["0|" + k] = P.days[k]; P.dd[dk] = 0; } P.dd[dk] += n; P.days[k] = (P.days[k] || 0) + n; }
  function dayStreak() {
    var d = new Date(), n = 0;
    if (!(P.days[dayKey(d)] > 0)) d.setDate(d.getDate() - 1);
    while (P.days[dayKey(d)] > 0) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function record(q, ok) {
    if (q.gen) { P.sub[ok ? 0 : 1]++; return; }
    var r = P.q[q.id] || [0, 0, 0, 0];
    r = [r[0] + (ok ? 1 : 0), r[1] + (ok ? 0 : 1), Date.now(), ok ? 1 : 0];
    P.q[q.id] = r;
    if (!ok) P.mist[q.id] = [Date.now(), 1];
    if (typeof mUpd === "function") mUpd(q.id, ok);
  }
  function clearMistake(id) { if (!(P.mist[id] && P.mist[id][1])) return; P.cli = P.cli || {}; var k = "mc:" + id, v = P.cli[k] || 0, t = Math.floor(v / 10), n = t >= P.mist[id][0] ? v % 10 : 0; n++; if (n >= 2) { P.mist[id] = [Date.now(), 0]; P.cli[k] = Date.now() * 10; } else P.cli[k] = Date.now() * 10 + n; }
  function activeMistakes() { return Object.keys(P.mist).filter(function (id) { return P.mist[id] && P.mist[id][1] && BYID[id]; }); }
  function isMarked(id) { return !!(P.bm && P.bm[id] && P.bm[id][1]); }
  function toggleMark(id) { P.bm = P.bm || {}; var on = !isMarked(id); P.bm[id] = [Date.now(), on ? 1 : 0]; saveP(); return on; }
  function markedIds() { return Object.keys(P.bm || {}).filter(function (id) { return isMarked(id) && BYID[id]; }); }
  function markBtn(id) { return '<button class="mark' + (isMarked(id) ? " on" : "") + '" data-mark="' + id + '" aria-label="Marchează întrebarea" title="Marchează pentru recapitulare">' + (isMarked(id) ? "★" : "☆") + "</button>"; }
  function wireMarks(root) { Array.prototype.forEach.call((root || app).querySelectorAll("[data-mark]"), function (b) { b.onclick = function (ev) { ev.stopPropagation(); var on = toggleMark(b.getAttribute("data-mark")); b.classList.toggle("on", on); b.textContent = on ? "★" : "☆"; toast(on ? "⭐ Întrebare marcată" : "Marcaj eliminat"); }; }); }
  function catStats(c) { var a = 0, k = 0, seen = 0; QS.forEach(function (q) { if (q.c !== c) return; var r = P.q[q.id]; if (r) { seen++; a += r[0] + r[1]; k += r[0]; } }); return { a: a, c: k, seen: seen }; }

  /* ---------------- glosar: acronime explicate la atingere ---------------- */
  var ACR = {}, GL = [];
  (function () {
    Object.keys(TERMS).forEach(function (c) {
      TERMS[c].forEach(function (e) {
        var full = e.length === 3 ? e[1] : "", def = e.length === 3 ? e[2] : e[1];
        GL.push({ t: e[0], f: full, d: def, c: c });
        var paren = /\(([^)]+)\)\s*$/.exec(e[0]);
        if (paren && /^[A-Z][A-Za-z0-9\-]*[A-Z0-9]$/.test(paren[1]) && (paren[1].match(/[A-Z]/g) || []).length >= 2) { var pk = paren[1]; (ACR[pk] = ACR[pk] || []).push({ k: pk, t: e[0], f: e[0].replace(/\s*\(.*\)$/, ""), d: def, c: c }); }
        if (e.length !== 3 && !/^[A-Z0-9][A-Z0-9\-]+(\s*\/\s*[A-Z0-9][A-Z0-9\-]+)*$/.test(e[0])) return;
        e[0].replace(/\s*\(.*\)$/, "").split(/\s*\/\s*/).forEach(function (k) {
          k = k.trim();
          if (!/^[A-Za-z0-9.+\-]{2,}$/.test(k) || (k.match(/[A-Z]/g) || []).length < 2) return;
          (ACR[k] = ACR[k] || []).push({ k: k, t: e[0], f: full, d: def, c: c });
        });
      });
    });
    GL.sort(function (a, b) { return a.t.localeCompare(b.t, "ro"); });
  })();
  var ACR_RE = (function () {
    var keys = Object.keys(ACR).sort(function (a, b) { return b.length - a.length; }).map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    return keys.length ? new RegExp("(^|[^A-Za-z0-9ăâîșțĂÂÎȘȚ\\-/])(" + keys.join("|") + ")(?![A-Za-z0-9ăâîșțĂÂÎȘȚ])", "g") : null;
  })();
  function acrFor(k, c) { var a = ACR[k]; if (!a) return null; for (var i = 0; i < a.length; i++) if (a[i].c === c) return a[i]; for (i = 0; i < a.length; i++) if (a[i].c === "gen") return a[i]; return a[0]; }
  function glossify(root, c, seen, inline) {
    if (!root || !ACR_RE) return;
    seen = seen || {};
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      for (var p = n.parentNode; p && p !== root; p = p.parentNode) { var tn = p.nodeName; if (tn === "svg" || tn === "SVG" || tn === "PRE" || tn === "BUTTON" || tn === "ABBR" || tn === "TEXT" || tn === "text" || tn === "INPUT" || tn === "TEXTAREA" || (p.classList && p.classList.contains("nogl"))) return NodeFilter.FILTER_REJECT; }
      return NodeFilter.FILTER_ACCEPT; } });
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var txt = n.nodeValue, out = null, last = 0, m;
      ACR_RE.lastIndex = 0;
      while ((m = ACR_RE.exec(txt))) {
        var k = m[2], st = m.index + m[1].length;
        if (seen[k]) continue;
        var e = acrFor(k, c); if (!e) continue;
        seen[k] = 1;
        out = out || document.createDocumentFragment();
        out.appendChild(document.createTextNode(txt.slice(last, st)));
        var ab = document.createElement("abbr"); ab.className = "ac"; ab.textContent = k; ab.setAttribute("data-k", k); ab.setAttribute("data-c", e.c); ab.tabIndex = 0;
        out.appendChild(ab);
        last = st + k.length;
        if (inline && !/^\s*\(/.test(txt.slice(last))) { var sp = document.createElement("span"); sp.className = "gx"; sp.textContent = " (" + e.d + ")"; out.appendChild(sp); }
      }
      if (out) { out.appendChild(document.createTextNode(txt.slice(last))); n.parentNode.replaceChild(out, n); }
    });
  }
  var popT = 0, pop = document.createElement("div"); pop.className = "pop-gl hidden"; document.body.appendChild(pop);
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest ? ev.target.closest("abbr.ac") : null;
    if (!a) { if (!pop.contains(ev.target)) pop.classList.add("hidden"); return; }
    ev.preventDefault(); ev.stopPropagation();
    var e = acrFor(a.getAttribute("data-k"), a.getAttribute("data-c"));
    if (!e) return;
    pop.innerHTML = "<b>" + esc(e.k) + "</b>" + (e.f ? ' <i>' + esc(e.f) + "</i>" : "") + "<div>" + esc(e.d) + '</div><button class="back" id="popGl">' + ICON.book + ' Glosar complet ›</button>';
    pop.classList.remove("hidden"); popT = Date.now();
    var r = a.getBoundingClientRect(), w = Math.min(320, window.innerWidth - 20);
    pop.style.width = w + "px";
    pop.style.left = Math.max(10, Math.min(window.innerWidth - w - 10, r.left + r.width / 2 - w / 2)) + "px";
    var top = r.bottom + 8; pop.style.top = top + "px";
    requestAnimationFrame(function () { if (top + pop.offsetHeight > window.innerHeight - 10) pop.style.top = Math.max(10, r.top - pop.offsetHeight - 8) + "px"; });
    $("popGl").onclick = function () { pop.classList.add("hidden"); if (R && R.active) { if (!confirm("Ieși din exercițiu ca să deschizi glosarul?")) return; } go("gloss", e.k); };
  }, true);
  window.addEventListener("scroll", function () { if (Date.now() - popT > 400) pop.classList.add("hidden"); }, { passive: true });

  /* ---------------- sunete (WebAudio) ---------------- */
  var AC = null;
  function tone(seq) {
    if (SET.mute) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === "suspended") AC.resume();
      var t0 = AC.currentTime + 0.01;
      seq.forEach(function (s) {
        var o = AC.createOscillator(), g = AC.createGain();
        o.type = s[3] || "sine"; o.frequency.value = s[0];
        g.gain.setValueAtTime(0.0001, t0 + s[1]); g.gain.exponentialRampToValueAtTime(0.18, t0 + s[1] + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + s[1] + s[2]);
        o.connect(g); g.connect(AC.destination); o.start(t0 + s[1]); o.stop(t0 + s[1] + s[2] + 0.05);
      });
    } catch (e) {}
  }
  var SND = {
    ok: function () { tone([[660, 0, 0.12], [990, 0.09, 0.2]]); },
    bad: function () { tone([[220, 0, 0.18, "triangle"], [180, 0.12, 0.25, "triangle"]]); },
    done: function () { tone([[523, 0, 0.15], [659, 0.12, 0.15], [784, 0.24, 0.15], [1047, 0.36, 0.35]]); },
    tap: function () { tone([[880, 0, 0.05]]); }
  };

  /* ---------------- sincronizare cont ---------------- */
  var syncTimer = null, syncState = AUTH ? "pending" : "", lastSync = 0;
  function api(method, url, body, tok) {
    var ctl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    var h = { "content-type": "application/json" };
    if (tok || (AUTH && AUTH.token)) h.authorization = "Bearer " + (tok || AUTH.token);
    return fetch(url, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined, signal: ctl ? ctl.signal : undefined, cache: "no-store" })
      .then(function (r) { clearTimeout(to); return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || ("Eroare " + r.status)); e.status = r.status; throw e; } return j; }); });
  }
  function scheduleSync() { if (!AUTH) return; syncState = "pending"; paintSync(); clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 2500); }
  function syncNow() {
    if (!AUTH) return Promise.resolve(false);
    clearTimeout(syncTimer);
    return api("PUT", "/api/progress", { progress: P }).then(function (r) {
      P = merge(P, r.progress); P.t = r.progress.t; lsSet(LS_P, P); syncState = "ok"; lastSync = Date.now(); if (AUTH) delete AUTH.warned; paintSync(); if (P.lb && P.lb.on) lbPush(); return true;
    }).catch(function (e) {
      if (e.status === 401) { syncState = "auth"; if (!AUTH.warned) { AUTH.warned = 1; toast("Serverul nu a recunoscut sesiunea. Progresul e păstrat aici; reîncerc automat. Dacă persistă, intră din nou în cont (tabul Cont)."); } }
      else syncState = "off";
      paintSync(); return false;
    });
  }
  function paintSync() { var el = $("syncChip"); if (!el) return; el.innerHTML = !AUTH ? ICON.acct : syncState === "ok" ? ICON.cloudOk : syncState === "off" ? ICON.cloudOff : ICON.cloudSync; el.classList.toggle("warn", AUTH && syncState === "off"); el.title = !AUTH ? "Neautentificat" : syncState === "ok" ? "Sincronizat" : syncState === "off" ? "Offline – se va sincroniza" : "Se sincronizează"; }
  window.addEventListener("online", function () { if (AUTH) syncNow(); });
  /* la închiderea/ascunderea aplicației: trimite imediat ce nu s-a sincronizat (keepalive) */
  function flushSync() {
    if (!AUTH || syncState === "ok") return;
    clearTimeout(syncTimer);
    try {
      var body = JSON.stringify({ progress: P });
      if (body.length < 60000) fetch("/api/progress", { method: "PUT", keepalive: true, headers: { "content-type": "application/json", authorization: "Bearer " + AUTH.token }, body: body }).then(function (r) { if (r.ok) { syncState = "ok"; lastSync = Date.now(); } }).catch(function () {});
      else syncNow();
    } catch (e) {}
  }
  var lastPull = Date.now();
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flushSync(); else if (AUTH && (syncState !== "ok" || Date.now() - lastPull > 60000)) { lastPull = Date.now(); syncNow(); } });
  window.addEventListener("pagehide", flushSync);
  /* reîncearcă periodic dacă o sincronizare a eșuat (ex. offline) */
  setInterval(function () { if (AUTH && (syncState === "off" || (syncState === "auth" && Date.now() - lastTry > 300000)) && navigator.onLine !== false) { lastTry = Date.now(); syncNow(); } }, 20000);
  var lastTry = 0;

  function toast(msg) { var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.classList.add("in"); }, 10); setTimeout(function () { t.classList.remove("in"); setTimeout(function () { t.remove(); }, 400); }, 2600); }

  /* ---------------- lecții: grupare întrebări ---------------- */
  var LPOOL = {}, LBY = {}, CHLES = {};
  (function () {
    var matches = {};
    LES.forEach(function (l) { LBY[l.id] = l; matches[l.id] = QS.filter(function (q) { if (l.c === "ant" && !l.byE && /\((Colonati|Graham) /.test(q.e)) return false; return q.c === l.c && l.re.test(l.byE || l.c === "tan" || l.c === "mun" || l.c === "rad" || l.c === "nor" || l.c === "voip" ? q.e : q.q + " " + q.a[0]); }); });
    var own = {};
    QS.forEach(function (q) {
      var best = null;
      LES.forEach(function (l) { if (l.c === q.c && matches[l.id].indexOf(q) >= 0 && (!best || matches[l.id].length < matches[best.id].length)) best = l; });
      if (best) (own[best.id] = own[best.id] || []).push(q);
    });
    LES.forEach(function (l) {
      var p = (own[l.id] || []).slice();
      if (p.length < 12) matches[l.id].forEach(function (q) { if (p.length < 12 && p.indexOf(q) < 0) p.push(q); });
      if (p.length < 10) QS.forEach(function (q) { if (p.length < 10 && q.c === l.c && p.indexOf(q) < 0) p.push(q); });
      LPOOL[l.id] = p;
    });
    CATS.forEach(function (c) {
      var arr = LES.filter(function (l) { return l.c === c.id; }).sort(function (a, b) { return a.lvl - b.lvl; });
      var rv = { id: c.id + "-R", c: c.id, lvl: 3, t: "Recapitulare finală", ic: "🏆", cards: [], review: true };
      LBY[rv.id] = rv; LPOOL[rv.id] = QS.filter(function (q) { return q.c === c.id; });
      arr.push(rv); CHLES[c.id] = arr;
    });
  })();
  function isDone(id) { return P.lessons[id] && P.lessons[id].n > 0; }
  function isUnlocked(l) { if (SET.free || Date.now() < new Date(2026, 9, 20).getTime()) return true; var arr = CHLES[l.c], i = arr.indexOf(l); return i <= 0 || isDone(arr[i - 1].id); }
  function chapterProgress(c) { var arr = CHLES[c], d = arr.filter(function (l) { return isDone(l.id); }).length; return { d: d, n: arr.length }; }
  function nextLesson() {
    var order = [SET.cur].concat(CATS.map(function (c) { return c.id; }));
    for (var i = 0; i < order.length; i++) { var arr = CHLES[order[i]]; for (var j = 0; j < arr.length; j++) if (!isDone(arr[j].id) && isUnlocked(arr[j])) return arr[j]; }
    return CHLES[SET.cur][CHLES[SET.cur].length - 1];
  }
  /* ---------------- Plan 11 zile (4–5 ore/zi) ---------------- */
  var DEFAULT_EXAM = "2026-10-19";
  function R_(c, a, b) { var o = []; for (var i = a; i <= b; i++) o.push(c + "-" + i); return o; }
  /* Ordinea = ponderea la examen: ~40% CCNA (rețele, subnetare, Cisco IOS), ~20% telecom (telefonie, radio, VoIP), restul fibră + cablare + proba practică. Fizica (electricitate, măsurători) e opțională, la final.
     Din ziua 4: în fiecare zi câte o simulare completă (teorie 18 întrebări + probă practică). Ultimele 2 zile: doar simulări + greșeli. */
  var XSUB = [["trainer", "Antrenor subnetting (exerciții nelimitate)"], ["gen", "Grilă subnetting generată – 10 întrebări"]];
  var PLAN = [
    { t: "Exact ca la examen: toate temele raportate de candidat (canal telefonic, RJ11/RJ45, PPPoE, topologii, LAN/WAN, viteze, fibră, OTDR, UTP, cabluri, OSI, IP, VLAN, Wi-Fi) + bazele", les: R_("ex", 1, 18).concat(["ex-R"], R_("baz", 1, 4)), test: { cats: ["ex"], n: 30 }, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ["go", "Joc: ordinea firelor RJ45 (T568B)", "rj"], ["cards", "Fișe rapide: Exact ca la examen", "ex"], ["prac", "Încă 20 de întrebări „Examen real”", ["ex"], 20]] },
    { t: "CCNA I: ce e o rețea, OSI/TCP-IP, Ethernet și MAC, IPv4, ARP/DHCP/DNS, binar și subnetare de bază, cabluri RJ45 + practic: mufare, tester, primii pași în Cisco IOS", les: R_("net", 1, 7).concat(R_("sub", 1, 2), R_("cab", 1, 4), ["pp-1", "pp-2", "pp-4", "pp-16", "pp-17"]), test: { cats: ["net", "sub", "cab", "ex"], n: 30 }, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ["go", "🧒 Practic pas cu pas: exercițiile 1–5 (nivel 1–2)", "ghid"], ["go", "Terminal Cisco: configurare de bază + router", "cli"], ["go", "Antrenor binar/hexa", "bin"]].concat(XSUB) },
    { t: "CCNA II: TCP/UDP și porturi, NAT, Cisco IOS, rutare, VLAN, port TRUNK (802.1Q, nativ, DTP, router-on-a-stick), STP, IPv6, wireless, subnetare avansată + practic: VLAN, Windows, Packet Tracer + Tanenbaum cap. 1–2", les: R_("net", 8, 14).concat(["net-R"], R_("trk", 1, 9), R_("sub", 3, 4), ["sub-R", "pp-5", "pp-6", "pp-9"], R_("pp", 10, 15), R_("tan", 1, 4)), test: { cats: ["net", "trk", "sub", "pp", "tan"], n: 30 }, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ["go", "🧒 Practic pas cu pas: exercițiile 6–9 + SSH nivel 3", "ghid"], ["go", "🧰 Situații reale la lucru", "scen"], ["go", "Terminal Cisco: VLAN, management, SSH", "cli"], ["prac", "Trunk și VLAN – 20 întrebări", ["trk"], 20], ["go", "Jocuri: perechi trunk + ordinea comenzilor", "games"]].concat(XSUB) },
    { t: "CCNA III din bibliografie: Tanenbaum cap. 3–8 + Munteanu (Ethernet, IPv4, TCP/UDP, comutare, routere Cisco) + PRIMA simulare completă", sim: 1, les: R_("tan", 5, 13).concat(["tan-R"], R_("mun", 1, 4), R_("mun", 6, 7)), test: { cats: ["tan", "mun", "net"], n: 30 }, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"]].concat(XSUB.slice(0, 1)) },
    { t: "Telecom: linii și cabluri telefonice, PCM/E1, ADSL, ISDN, SS7, GSM/UMTS, X.25/ATM (Rădulescu) + VoIP + telefonie digitală, radio, satelit", sim: 2, les: R_("tel", 1, 3).concat(["tel-R"], R_("rad", 1, 10), ["rad-R"], R_("voip", 1, 5), ["voip-R"], R_("extra", 1, 3), ["extra-R"]), test: { cats: ["tel", "rad", "voip", "extra"], n: 30 }, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ["cards", "Fișe rapide: Telefonie", "tel"]] },
    { t: "Fibră optică (monomod/multimod, atenuare, sudură, conectori, OTDR, FTTx) + cablare structurată + practic: fibra + Munteanu cap. 8, 12–14 + PC I", sim: 3, les: R_("fo", 1, 6).concat(["fo-R"], R_("cab", 5, 8), ["cab-R", "pp-7", "mun-5"], R_("mun", 8, 9), ["mun-R"], R_("pc", 1, 4), ["iq-1", "iq-2"]), test: { cats: ["fo", "cab", "pp", "mun", "pc"], n: 30 }, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ["cards", "Fișe rapide: Fibră optică", "fo"], ["go", "Animații: fibră monomod vs multimod și altele", "anims"]] },
    { t: "Antene și radio I (undă, benzi, antene, dB/dBm, polarizare, coaxial, VSWR, Fresnel, buget, TETRA, proceduri) + Norton cap. 1–6 + PC II", sim: 4, les: R_("ant", 1, 14).concat(R_("nor", 1, 4), R_("pc", 5, 8), ["pc-R", "iq-3", "iq-4", "iq-R"]), test: { cats: ["ant", "nor", "pc", "iq"], n: 30 }, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ["cards", "Fișe rapide: Antene și radio", "ant"]] },
    { t: "Antene și radio II (Colonati, Graham) + Norton cap. 7–19 + munca la STS (112, rack, TETRA, terminale, migrare)", sim: 5, les: R_("ant", 15, 25).concat(["ant-R"], R_("nor", 5, 9), ["nor-R"], R_("sts", 1, 9), ["sts-R"]), test: { cats: ["ant", "nor", "sts"], n: 30 }, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ] },
    { t: "Windows + proba practică (multimetru, RAM/disc) + capcanele de examen + recapitulare baze. Opțional: fizica (electricitate, măsurători)", sim: 6, les: R_("win", 1, 6).concat(["win-R", "pp-3", "pp-8", "pp-R"], R_("baz", 5, 6), ["baz-R"], R_("cap", 1, 4), ["cap-R"]), opt: R_("el", 1, 12).concat(["el-R"], R_("mas", 1, 3), ["mas-R"]), test: { cats: ["win", "pp", "cap", "baz"], n: 30 }, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ["go", "Joc: selectorul multimetrului", "mm"], ["prac", "Exersare Electricitate + Măsurători – 20 (opțional)", ["el", "mas"], 20]] },
    { t: "Doar simulări: teorie (Subiectul 1, 2, 3) + practică (Varianta 1, 2, 3) + Greșelile mele", sim: 7, simOnly: 1, les: [], exam: 50, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ["prac", "Capcane la examen – 20 întrebări", ["cap"], 20], ["prac", "„Examen real” – 20 întrebări", ["ex"], 20]] },
    { t: "Ultima zi: simulări + greșelile + fițuica „Foaie” și lista „ce fac pas cu pas” la proba practică. Seara: odihnă!", sim: 8, simOnly: 1, les: [], exam: 50, x: [["go", "Jocuri: Joc zilnic + swipe Adevărat/Fals", "games"], ["go", "Foaia de recapitulare", "sheet"], ["go", "🧒 Proba completă Cisco (nivel 4) + fișa de comenzi", "ghid"], ["go", "Proba practică: lista „ce fac pas cu pas”", "ppsheet"]] }
  ];
  function pk(d) { return "b" + d; }
  function parseDay(s) { var a = String(s).split("-"); return new Date(+a[0], +a[1] - 1, +a[2]); }
  function planExam() { return (P.plan && /^\d{4}-\d{2}-\d{2}$/.test(P.plan.exam)) ? P.plan.exam : DEFAULT_EXAM; }
  function fmtDay(d) { return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear(); }
  function planInfo() {
    var ex = parseDay(planExam()), today = parseDay(dayKey());
    var left = Math.round((ex - today) / 864e5), start = new Date(ex); start.setDate(ex.getDate() - PLAN.length);
    return { ex: ex, left: left, start: start, idx: Math.round((today - start) / 864e5) + 1 };
  }
  function dayDate(d) { var x = new Date(planInfo().start); x.setDate(x.getDate() + d - 1); return x; }
  function simsOn(d, k) { var key = dayKey(dayDate(d)); return P.exams.filter(function (e) { return e.k === k && dayKey(new Date(e.t)) === key; }); }
  function dayStatus(d) {
    var p = PLAN[d - 1], ld = p.les.filter(isDone).length, tp = P.plan.tests[pk(d)] || 0, tok = p.exam ? tp > 0 : tp >= 70;
    return { ld: ld, lt: p.les.length, tp: tp, tok: tok, done: !!P.plan.done[pk(d)] || (ld === p.les.length && tok) };
  }
  function dayMin(p) { return p.les.length * 9 + (p.exam ? 60 : 20) + (p.sim ? (p.simOnly ? 150 : 75) : 0) + 20; }
  function fmtH(m) { var h = Math.round(m / 30) / 2; return String(h).replace(".", ",") + " h"; }
  function checkPlan() { for (var d = 1; d <= PLAN.length; d++) if (!P.plan.done[pk(d)] && dayStatus(d).done) { P.plan.done[pk(d)] = Date.now(); toast("📅 Ziua " + d + " din plan – completă! 🎉"); } }
  function startPlanTest(d) {
    var p = PLAN[d - 1];
    if (p.exam) return runQuiz({ mode: "exam", items: shuffle(QS.filter(function (q) { return !q.s; })).slice(0, p.exam), minutes: p.exam, title: "Simulare mare – ziua " + d, planDay: pk(d) });
    runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return p.test.cats.indexOf(q.c) >= 0; }), p.test.n), hearts: 0, requeue: false, xpEach: 5, title: "Testul zilei " + d, planDay: pk(d) });
  }
  function planExtra(x) {
    SND.tap();
    if (x[0] === "trainer") return go("trainer");
    if (x[0] === "gen") { var it = []; for (var i = 0; i < 10; i++) it.push(SUB.question(SET.diff || 2)); return runQuiz({ mode: "practice", items: it, hearts: 0, requeue: false, xpEach: 5, title: "Subnetting" }); }
    if (x[0] === "prac") return runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return x[2].indexOf(q.c) >= 0; }), x[3]), hearts: 0, requeue: false, xpEach: 5, title: "Exersare suplimentară" });
    if (x[0] === "cards") return startCards([x[2]]);
    if (x[0] === "go") return go(x[2]);
  }
  function planDayHtml(d, open) {
    var p = PLAN[d - 1], st = dayStatus(d), pi = planInfo();
    var cls = st.done ? "pdone" : d === pi.idx ? "ptoday" : d < pi.idx ? "plate" : "";
    var h = '<div class="pday ' + cls + '"><div class="pdh"><span class="pdn">' + (st.done ? "✓" : d) + '</span><div><b>Ziua ' + d + " · " + fmtDay(dayDate(d)) + (d === pi.idx ? ' <i class="tag">AZI</i>' : "") + ' <i class="tag">~' + fmtH(dayMin(p)) + "</i></b><small>" + esc(p.t) + "</small></div></div>";
    if (open) {
      h += '<div class="ptasks">';
      if (p.les.length) h += '<div class="pxh">Lecții noi (' + st.ld + "/" + st.lt + ")</div>";
      p.les.forEach(function (id) { var l = LBY[id]; if (!l) return; h += '<button class="ptask' + (isDone(id) ? " ok" : "") + '" data-pl="' + id + '"><span>' + (isDone(id) ? "✅" : "⭕") + "</span>" + l.ic + " " + esc(CATBY[l.c].short) + " – " + esc(l.t) + "</button>"; });
      if (p.exam) h += '<button class="ptask' + (st.tok ? " ok" : "") + '" data-pt="' + d + '"><span>' + (st.tok ? "✅" : "📝") + "</span>Simulare mare: " + p.exam + " întrebări din tot, " + p.exam + " min" + (st.tp ? " · cel mai bun: " + st.tp + "%" : "") + "</button>";
      else h += '<button class="ptask' + (st.tok ? " ok" : "") + '" data-pt="' + d + '"><span>' + (st.tok ? "✅" : "🎯") + "</span>Testul zilei: " + p.test.n + " întrebări, minim 70%" + (st.tp ? " · cel mai bun: " + st.tp + "%" : "") + "</button>";
      if (p.sim) {
        var ts = simsOn(d, "sim"), ps = simsOn(d, "prac"), sv = ["Subiectul 1", "Subiectul 2", "Subiectul 3"][(p.sim - 1) % 3], pv = (p.sim - 1) % 3 + 1;
        h += '<div class="pxh">Simulare completă de examen' + (p.simOnly ? " (fă-le pe toate, de 2 ori dacă ai timp)" : "") + "</div>" +
          '<button class="ptask' + (ts.length ? " ok" : "") + '" data-go="sim"><span>' + (ts.length ? "✅" : "📝") + "</span>Teorie: 18 întrebări, nota 1–10 · azi: " + (p.simOnly ? "toate 3 subiectele" : sv) + (ts.length ? " · nota azi: " + fmtG(Math.max.apply(null, ts.map(function (e) { return e.g || 0; }))) : "") + "</button>" +
          '<button class="ptask' + (ps.length ? " ok" : "") + '" data-go="prac"><span>' + (ps.length ? "✅" : "🔌") + "</span>Practică: simulare pas cu pas · azi: " + (p.simOnly ? "toate 3 variantele" : "Varianta " + pv) + (ps.length ? " · nota azi: " + fmtG(Math.max.apply(null, ps.map(function (e) { return e.g || 0; }))) : "") + "</button>";
      }
      h += '<div class="pxh">Repetare (spaced review)</div><button class="ptask" data-go="mist"><span>❗</span>Greșelile mele – repetă ce ai greșit (' + Object.keys(P.mist).filter(function (k) { return P.mist[k] && P.mist[k][1]; }).length + ")</button>";
      if (p.opt) { h += '<div class="pxh">Opțional – fizică (doar dacă îți rămâne timp)</div>'; p.opt.forEach(function (id) { var l = LBY[id]; if (!l) return; h += '<button class="ptask px' + (isDone(id) ? " ok" : "") + '" data-pl="' + id + '"><span>' + (isDone(id) ? "✅" : "◽") + "</span>" + l.ic + " " + esc(CATBY[l.c].short) + " – " + esc(l.t) + "</button>"; }); }
      if (p.x && p.x.length) { h += '<div class="pxh">Jocuri și exersare în plus</div>'; p.x.forEach(function (x, i) { h += '<button class="ptask px" data-px="' + d + "-" + i + '"><span>➕</span>' + esc(x[1]) + "</button>"; }); }
      h += '<button class="ghost sm mk" data-md="' + d + '">' + (P.plan.done[pk(d)] ? "↺ Marchează ca nefăcută" : "✓ Marchează ziua ca făcută") + "</button></div>";
    }
    return h + "</div>";
  }
  function wirePlan(root) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-pl]"), function (b) { b.onclick = function () { SND.tap(); startLesson(LBY[b.getAttribute("data-pl")]); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-pt]"), function (b) { b.onclick = function () { SND.tap(); startPlanTest(+b.getAttribute("data-pt")); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-go]"), function (b) { b.onclick = function () { go(b.getAttribute("data-go")); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-px]"), function (b) { b.onclick = function () { var k = b.getAttribute("data-px").split("-"); planExtra(PLAN[+k[0] - 1].x[+k[1]]); }; });
    Array.prototype.forEach.call(root.querySelectorAll("[data-md]"), function (b) { b.onclick = function () { var d = +b.getAttribute("data-md"); if (P.plan.done[pk(d)]) P.plan.done[pk(d)] = 0; else P.plan.done[pk(d)] = Date.now(); saveP(); go(view === "plan" ? "plan" : "learn"); }; });
  }
  function placeCard() {
    if (P.place && P.place.t) return "";
    return '<section class="card placec"><b>🧭 Test de nivel</b><p class="muted">20 de întrebări din toate capitolele (~5 minute). Îți arată ce știi deja și de unde să începi.</p><button class="big sec" id="plBtn">Fă testul de nivel</button></section>';
  }
  function planCard() {
    var pi = planInfo();
    var cd = pi.left > 1 ? "⏳ <b>" + pi.left + " zile</b> până la examen" : pi.left === 1 ? "⏳ Examenul este <b>mâine</b>!" : pi.left === 0 ? "🎖️ Examenul este <b>azi</b>. Mult succes!" : "Examenul a trecut.";
    return '<section class="card plan"><div class="cd">' + cd + " (" + fmtDay(pi.ex) + ')</div><button class="big sec" id="planAll">🗓️ Planul pe zile – Săptămâna ›</button></section>';
  }
  function vPlan() { return vWeek();
    view = "plan"; navbar(true);
    var h = '<section class="card"><button class="back" id="backBtn">‹ Învață</button><h2>📅 Plan de pregătire – ' + PLAN.length + ' zile, 4–5 ore pe zi</h2><label class="tform"><span>Data examenului</span><input type="date" id="exDate" value="' + planExam() + '"></label><p class="muted">Ordinea urmează ponderea la examen: întâi „Exact ca la examen”, apoi CCNA (~40%), telecom (~20%), fibră, cablare și proba practică; fizica e opțională, la final. Fiecare zi: lecții noi, jocuri și simulatoare, repetarea greșelilor. Din ziua 4 faci zilnic o simulare completă (teorie 18 întrebări + probă practică). Ultimele 2 zile: doar simulări și greșeli. Ziua e completă când termini lecțiile și treci testul zilei (≥ 70%). Maxim 6 ore pe zi – somnul contează.</p></section>';
    for (var d = 1; d <= PLAN.length; d++) h += '<div class="card">' + planDayHtml(d, true) + "</div>";
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("learn"); };
    $("exDate").onchange = function () { if (!/^\d{4}-\d{2}-\d{2}$/.test(this.value)) return; P.plan.exam = this.value; P.plan.et = Date.now(); saveP(); toast("Data examenului salvată: " + fmtDay(parseDay(this.value))); go("plan"); };
    wirePlan(app);
  }

  function pickQuestions(pool, n) {
    var unseen = [], wrong = [], rest = [];
    shuffle(pool).forEach(function (q) { var r = P.q[q.id]; if (!r) unseen.push(q); else if (P.mist[q.id] && P.mist[q.id][1]) wrong.push(q); else rest.push(q); });
    rest.sort(function (a, b) { var x = P.q[a.id], y = P.q[b.id]; return (x[0] - x[1]) - (y[0] - y[1]) || x[2] - y[2]; });
    var nw = Math.min(wrong.length, Math.ceil(n / 3));
    var out = wrong.slice(0, nw).concat(unseen).concat(rest).concat(wrong.slice(nw));
    return shuffle(out.slice(0, n));
  }

  /* ---------------- generator de subnetting ---------------- */
  var SUB = (function () {
    function ip2s(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join("."); }
    function maskOf(p) { return p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0; }
    function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function randomIp(diff) {
      var base = [[10, rint(0, 255)], [172, rint(16, 31)], [192, 168]][diff === 1 ? 2 : rint(0, 2)];
      return ((base[0] << 24) | (base[1] << 16) | (rint(0, 255) << 8) | rint(1, 254)) >>> 0;
    }
    function make(diff) {
      diff = diff || 2;
      var p = diff === 1 ? rint(24, 30) : diff === 2 ? rint(16, 30) : rint(8, 30);
      var ip = randomIp(diff), m = maskOf(p), net = (ip & m) >>> 0, bc = (net | (~m >>> 0)) >>> 0;
      var size = Math.pow(2, 32 - p);
      return { ip: ip, p: p, m: m, net: net, bc: bc, first: net + 1, last: bc - 1, hosts: size - 2, size: size, s: { ip: ip2s(ip), m: ip2s(m), net: ip2s(net), bc: ip2s(bc), first: ip2s(net + 1), last: ip2s(bc - 1) } };
    }
    function explain(x) {
      var oct = Math.min(3, Math.floor(x.p / 8)), mo = (x.m >>> (24 - 8 * oct)) & 255, step = 256 - mo;
      var names = ["primul", "al doilea", "al treilea", "al patrulea"];
      var ipo = (x.ip >>> (24 - 8 * oct)) & 255, start = Math.floor(ipo / step) * step;
      var s = "/" + x.p + " → masca " + x.s.m + ". ";
      if (x.p % 8 === 0) s += "Prefixul este multiplu de 8, deci rețeaua se termină exact la granița unui octet. ";
      else s += "Octetul „interesant” este " + names[oct] + " (mască " + mo + "), pasul = 256 − " + mo + " = " + step + ". Valoarea " + ipo + " se află în blocul " + start + "–" + (start + step - 1) + ". ";
      s += "Rețea " + x.s.net + ", primul host " + x.s.first + ", ultimul host " + x.s.last + ", broadcast " + x.s.bc + ". Host-uri: 2^" + (32 - x.p) + " − 2 = " + x.hosts.toLocaleString("ro-RO") + ".";
      return s;
    }
    function uniq4(correct, cands) { var o = [correct]; cands.forEach(function (c) { if (o.length < 4 && o.indexOf(c) < 0) o.push(c); }); var k = 1; while (o.length < 4) { var f = correct + " (" + k++ + ")"; o.push(f); } return o; }
    var n = 0;
    function question(diff) {
      var x = make(diff), t = rint(0, 6), q, a, step = x.size;
      var ipn = function (v) { return ip2s(v >>> 0); };
      if (t === 0) { q = "Care este adresa de rețea pentru " + x.s.ip + "/" + x.p + "?"; a = uniq4(x.s.net, [x.s.bc, ipn(x.net + step), ipn(x.net - step), x.s.first]); }
      else if (t === 1) { q = "Care este adresa de broadcast a subrețelei în care se află " + x.s.ip + "/" + x.p + "?"; a = uniq4(x.s.bc, [x.s.last, x.s.net, ipn(x.bc + step), ipn(x.bc - step)]); }
      else if (t === 2) { q = "Care este primul host utilizabil al subrețelei lui " + x.s.ip + "/" + x.p + "?"; a = uniq4(x.s.first, [x.s.net, ipn(x.net + 2), ipn(x.first + step), x.s.last]); }
      else if (t === 3) { q = "Care este ultimul host utilizabil al subrețelei lui " + x.s.ip + "/" + x.p + "?"; a = uniq4(x.s.last, [x.s.bc, ipn(x.last - step), ipn(x.bc - 2), x.s.first]); }
      else if (t === 4) { var h = 32 - x.p; q = "Câte adrese de host utilizabile are o subrețea /" + x.p + "?"; a = uniq4((Math.pow(2, h) - 2).toLocaleString("ro-RO"), [Math.pow(2, h).toLocaleString("ro-RO"), (Math.pow(2, h + 1) - 2).toLocaleString("ro-RO"), (Math.pow(2, h - 1) - 2 > 0 ? Math.pow(2, h - 1) - 2 : Math.pow(2, h) - 1).toLocaleString("ro-RO"), (Math.pow(2, h) - 1).toLocaleString("ro-RO")]); }
      else if (t === 5) { q = "Ce mască de subrețea corespunde prefixului /" + x.p + "?"; a = uniq4(x.s.m, [ip2s(maskOf(x.p - 1)), ip2s(maskOf(Math.min(32, x.p + 1))), ip2s(~x.m >>> 0), ip2s(maskOf(x.p - 2)), ip2s(maskOf(Math.min(32, x.p + 2)))]); }
      else { q = "Ce prefix CIDR corespunde măștii " + x.s.m + "?"; a = uniq4("/" + x.p, ["/" + (x.p - 1), "/" + (x.p + 1), "/" + (32 - x.p), "/" + (x.p - 2), "/" + (x.p + 2)]); }
      return { id: "gen-" + (++n), c: "sub", gen: true, q: q, a: a, e: explain(x) };
    }
    return { make: make, question: question, explain: explain, ip2s: ip2s };
  })();

  /* ---------------- antet și navigare ---------------- */
  var view = "learn", R = null, timerInt = null;
  function header() {
    if (R && R.active) return;
    hdr.className = "topbar";
    hdr.innerHTML = '<div class="brand"><span class="star">★</span> STS Grilă</div>' +
      '<span class="chip" title="Zile la rând">' + ICON.flame + dayStreak() + "</span>" +
      '<span class="chip" title="XP total">' + ICON.bolt + xpTotal() + "</span>" +
      '<button class="chip btn" id="muteBtn" aria-label="Sunet">' + (SET.mute ? ICON.sndOff : ICON.sndOn) + "</button>" +
      '<button class="chip btn" id="syncChip" aria-label="Cont"></button>';
    paintSync();
    $("muteBtn").onclick = function () { SET.mute = !SET.mute; saveSet(); header(); if (!SET.mute) SND.tap(); };
    $("syncChip").onclick = function () { go("acct"); };
  }
  function navbar(show) {
    nav.classList.toggle("hidden", !show);
    if (!show) return;
    var tabs = [["home", "🏠", "Acasă"], ["week", "🗓️", "Plan"], ["practice", "📝", "Grile"], ["cisco", "🖥️", "Cisco"], ["game", "🎮", "Joc"], ["me", "👤", "Eu"]];
    var mc = activeMistakes().length;
    nav.innerHTML = tabs.map(function (t) { return '<button data-v="' + t[0] + '" class="' + (view === t[0] || (view === "plan" && t[0] === "week") || (t[0] === "me" && /^(stats|acct|board|credits|marks)$/.test(view)) || (t[0] === "practice" && /^(mist|rev|sim|learn|cards|games|path|exam|apt)$/.test(view)) || (t[0] === "cisco" && /^(ghid|scen|cli|prac|rj|mm|ppsheet|cmdcards|talk)$/.test(view)) ? "on" : "") + '"><span>' + t[1] + (t[0] === "practice" && mc ? '<i class="dot">' + (mc > 99 ? "99+" : mc) + "</i>" : "") + "</span>" + t[2] + "</button>"; }).join("");
    Array.prototype.forEach.call(nav.querySelectorAll("button"), function (b) { b.onclick = function () { go(b.getAttribute("data-v")); }; });
  }
  window.addEventListener("popstate", function (e) { var st = e.state; if (!st || !st.v) return; if (R && R.mode === "exam" && !confirm("Ieși din simulare? Răspunsurile de până acum se pierd.")) { try { history.pushState(e.state, ""); } catch (er) {} return; } go.pop = 1; go(st.v, st.a == null ? undefined : st.a); });
  function hubList(G) { var h = ""; G.forEach(function (g) { h += '<div class="iosgh">' + g[0] + '</div><div class="iosgl">' + g[1].map(function (r) { return '<button class="iosrow" data-hv="' + r[0] + '"><span class="iosic">' + r[1] + "</span><span>" + esc(r[2]) + (r[3] ? '<small class="iosd">' + esc(r[3]) + "</small>" : "") + '</span><b>›</b></button>'; }).join("") + "</div>"; }); return h; }
  function hubWire() { Array.prototype.forEach.call(app.querySelectorAll("[data-hv]"), function (b) { b.onclick = function () { var v = b.getAttribute("data-hv"), i = v.indexOf(":"); if (i > 0) go(v.slice(0, i), v.slice(i + 1)); else go(v); }; }); }
  function gxNextRec() { var i, t; for (i = 0; i < GX.length; i++) { t = gxDoneTier(GX[i].id); if (t < 1) return [GX[i], 1]; } for (i = 0; i < GX.length; i++) { t = gxDoneTier(GX[i].id); if (t < 4) return [GX[i], t + 1]; } return null; }
  function vCisco() {
    view = "cisco"; navbar(true); P.cli = P.cli || {};
    var nr = gxNextRec(), dn = GX.filter(function (x) { return gxDoneTier(x.id) >= 1; }).length;
    var h = '<section class="card ioshero"><div class="iosk">Proba practică Cisco</div>' + (nr ? '<h2>' + nr[0].ic + " " + esc(nr[0].t) + '</h2><p class="small muted">Nivelul ' + nr[1] + " · " + dn + " / " + GX.length + ' exerciții pas cu pas începute</p><button class="big gogreen" id="cGo">▶️ Continuă: nivelul ' + nr[1] + "</button>" : '<h2>🎉 Toate exercițiile sunt gata!</h2><button class="big gogreen" id="cGo">🎖️ Simulează proba practică</button>') + "</section>";
    h += hubList([["🎖️ Ca la examen", [["prac", "🎖️", "Simulează proba practică", "echipamente, RJ45, PuTTY, SSH"]]], ["🖥️ Terminal Cisco", [["ghid", "🧭", "Pas cu pas", dn + " / " + GX.length], ["scen", "🚨", "Situații reale (depanare)"], ["cli", "⌨️", "Terminal liber (switch / router)"], ["cmdcards", "🗂️", "Cartonașe cu comenzi"], ["ppsheet", "📄", "Foaie de recapitulare: comenzi"]]], ["🔧 Pe masă", [["rj", "🔧", "Mufare RJ45 (T568B)"], ["mm", "📟", "Multimetru"]]], ["🎖️ Interviu", [["talk", "📞", "Pregătire pentru discuție"]]]]);
    app.innerHTML = h; hubWire();
    $("cGo").onclick = function () { if (nr) { GXS = null; go("ghid", nr[0].id + ":" + nr[1]); } else go("prac"); };
  }
  function vMe() {
    view = "me"; navbar(true);
    var h = '<section class="card ioshero"><div class="iosk">Eu</div><h2>' + (AUTH && AUTH.user ? "👤 " + esc(AUTH.user) : "👤 Vizitator") + '</h2><p class="small muted">' + (AUTH && AUTH.user ? "Progresul se salvează în cont." : "Creează un cont ca să-ți salvezi progresul.") + "</p></section>" + readyCard();
    h += hubList([["📊 Progres", [["stats", "📊", "Statistici"], ["marks", "⭐", "Întrebări marcate"], ["board", "🏆", "Clasament"]]], ["⚙️ Cont și setări", [["acct", "👤", "Contul meu și setări"], ["credits", "📷", "Credite foto"]]]]);
    app.innerHTML = h; hubWire();
  }
  function readyCard() {
    var ex = (P.exams || []).filter(function (e) { return e.k === "sim" && e.g != null; }).slice(-3), g = ex.length ? ex.reduce(function (a, e) { return a + (+e.g || 0); }, 0) / ex.length : 0;
    var cs = GX.filter(function (x) { return gxDoneTier(x.id) >= 3; }).length;
    var iq = Object.keys(P.q || {}).filter(function (k) { return /^iq-/.test(k); }), iok = iq.reduce(function (a, k) { return a + P.q[k][0]; }, 0), itot = iq.reduce(function (a, k) { return a + P.q[k][0] + P.q[k][1]; }, 0);
    Object.keys(P.cli || {}).forEach(function (k) { if (/^ap:n:/.test(k)) itot += P.cli[k]; else if (/^ap:k:/.test(k)) iok += P.cli[k]; });
    var row = function (t, v, max, txt) { var pc = Math.max(0, Math.min(100, Math.round(100 * v / max))); return '<div class="rdy"><span>' + t + "</span><div class='iosbar'><i style='width:" + pc + "%'></i></div><small>" + txt + "</small></div>"; };
    return '<section class="card"><div class="iosk">Gata de examen?</div>' + row("📝 Grilă", g, 10, ex.length ? "nota medie " + g.toFixed(1).replace(".", ",") + " (minimum 7)" : "fă o simulare") + row("🖥️ Cisco", cs, GX.length, cs + " / " + GX.length + " la nivelul 3–4") + row("🧠 Inteligență", iok, itot || 1, itot ? Math.round(100 * iok / itot) + "% corecte" : "fă un test") + "</section>";
  }
  /* ================= 🎯 Antrenorul: un singur „Continuă” (plan pe 2 zile, după progresul real) ================= */
  var CO_TOP = {
    net: { n: "Rețele / CCNA", c: ["net", "sub", "trk", "baz", "tan", "mun", "nor"], re: /\b(IP|IPv[46]|VLAN|switch|router|OSI|TCP|UDP|MAC|subre|mask|masc|DHCP|DNS|gateway|trunk|ping|Ethernet|LAN|WAN|topolog|port|SSH|Telnet|Cisco|PPPoE|Wi-?Fi|802\.11)/i, w: 0.35 },
    fo: { n: "Fibră optică", c: ["fo"], re: /fibr|OTDR|UPC|APC|\bSC\b|\bLC\b|sudur|monomod|multimod|1310|1550|850 nm|atenuare/i, w: 0.2 },
    pc: { n: "PC / Windows", c: ["pc", "win"], re: /Windows|ipconfig|BIOS|UEFI|RAM|CPU|procesor|placa de baz|hard|SSD|USB|partiț|NTFS|cmd|sistem de operare/i, w: 0.15 },
    mas: { n: "Măsurători", c: ["mas", "el"], re: /\bdB|dBm|multimetr|măsur|ohm|Ω|tensiune|curent|rezisten|volt|amper|putere/i, w: 0.1 },
    tel: { n: "Telecom", c: ["tel", "rad", "ant", "voip", "sts"], re: /telefon|RJ11|canal|ADSL|xDSL|ISDN|centrală|PSTN|voce|E1|antena|radio|TETRA|GSM/i, w: 0.1 },
    cab: { n: "Cabluri", c: ["cab"], re: /UTP|STP|FTP|Cat ?\d|RJ45|T568|cablu|coaxial|crossover|patch/i, w: 0.1 }
  };
  var CO_AP = ["cnt", "syn", "top", "net", "rot3", "mat", "ser", "syl", "praga", "bou", "arr", "pon", "mem", "att", "fold"];
  var CO_GX = ["ssh", "vln", "con", "baz", "rtr", "sav", "lap", "trk", "lad", "all"];
  var coTopicCache = null;
  function coTopicOf(q) {
    if (q.s) return null;
    if (q.c === "ex" || q.c === "cap" || q.c === "pp") { var ks = ["fo", "cab", "pc", "mas", "tel", "net"]; for (var i = 0; i < ks.length; i++) if (CO_TOP[ks[i]].re.test(q.q + " " + q.a[0])) return ks[i]; return null; }
    for (var k in CO_TOP) if (CO_TOP[k].c.indexOf(q.c) >= 0) return k;
    return null;
  }
  function coTopics() {
    if (!coTopicCache) { coTopicCache = {}; QS.forEach(function (q) { var t = coTopicOf(q); if (t) (coTopicCache[t] = coTopicCache[t] || []).push(q); }); }
    var r = {}; Object.keys(CO_TOP).forEach(function (t) { var L = coTopicCache[t] || [], seen = 0, ok = 0, bad = 0, mi = 0; L.forEach(function (q) { var v = P.q[q.id]; if (v) { seen++; ok += v[0]; bad += v[1]; } if (P.mist[q.id] && P.mist[q.id][1]) mi++; }); var acc = (ok + 1) / (ok + bad + 2); r[t] = { t: t, n: CO_TOP[t].n, seen: seen, pool: L.length, acc: acc, raw: ok + bad ? ok / (ok + bad) : 0, mist: mi, m: acc * Math.min(1, seen / 30) }; });
    return r;
  }
  function coApStat() { return CO_AP.map(function (t) { var n = apG("ap:n:" + t), k = apG("ap:k:" + t); return { t: t, n: n, k: k, m: ((k + 1) / (n + 2)) * Math.min(1, n / 6) }; }); }
  function coGxTier(id) { try { return gxDoneTier(id); } catch (e) { return 0; } }
  function coReady() {
    var T = coTopics(), th = 0; Object.keys(CO_TOP).forEach(function (t) { th += CO_TOP[t].w * T[t].m; });
    var sims = (P.exams || []).filter(function (e) { return e.k === "sim" && e.d >= 300 && e.g != null; }).slice(-3);
    if (sims.length) { var g = sims.reduce(function (a, e) { return a + e.g; }, 0) / sims.length; th = 0.6 * th + 0.4 * (g - 1) / 9; }
    var A = coApStat(), ps = A.reduce(function (a, x) { return a + x.m; }, 0) / A.length;
    var pr = CO_GX.reduce(function (a, id) { return a + Math.min(1, coGxTier(id) / 3); }, 0) / CO_GX.length;
    return { all: Math.round(100 * (0.45 * th + 0.2 * ps + 0.35 * pr)), th: Math.round(100 * th), ps: Math.round(100 * ps), pr: Math.round(100 * pr), T: T, A: A };
  }
  function coWeakTopics() { var T = coTopics(); return Object.keys(T).sort(function (a, b) { return T[a].m - T[b].m; }); }
  function coNextGx() { for (var i = 0; i < CO_GX.length; i++) { var t = coGxTier(CO_GX[i]); if (t < 3) return CO_GX[i] + ":" + Math.max(1, t + 1); } return "all:4"; }
  function coGxTitle(s) { var p = s.split(":"), X = GX.filter(function (x) { return x.id === p[0]; })[0]; return (X ? X.t.replace(/^\d+\.\s*/, "") : p[0]) + " · nivelul " + p[1]; }
  /* planul: duminică 18 (8 sesiuni) și luni 19 oct (3 sesiuni scurte, dimineața) */
  var CO_PLAN = [
    [[["q", 0, 8], ["srs", 6], ["ap", 6]], [["gx"], ["q", 1, 8]], [["srs", 8], ["ap", 6], ["rj"]], [["gx"], ["q", 0, 8]], [["q", 2, 8], ["apm", 6], ["srs", 6]], [["gx"], ["ap", 6]], [["gx"], ["srs", 8]], [["sim"], ["apx", 12, 360]], [["jg", "ex"]]],
    [[["srs", 10], ["ap", 6]], [["gx"]], [["q", -1, 10]], [["jg", "m5"]]]
  ];
  function coDay() { var n = new Date(), d = new Date(n.getFullYear(), n.getMonth(), n.getDate()), e = new Date(2026, 9, 19); return d < e ? 0 : d.getTime() === e.getTime() ? 1 : 2; }
  function coKey(d, s, b) { return "co:" + d + ":" + s + (b == null ? "" : ":" + b); }
  function coDoneS(d, s) { return !!P.cli[coKey(d, s)]; }
  function coCur() { var d = coDay(); if (d > 1) return null; var S = CO_PLAN[d]; for (var s = 0; s < S.length; s++) if (!coDoneS(d, s)) { var b = 0; while (b < S[s].length && P.cli[coKey(d, s, b)]) b++; return { d: d, s: s, b: Math.min(b, S[s].length - 1), n: S.length }; } return { d: d, s: S.length, n: S.length, done: true }; }
  function coBlockLabel(bl) {
    var W = coWeakTopics();
    if (bl[0] === "q") { var t = bl[1] < 0 ? null : W[bl[1]]; return "📚 " + bl[2] + " întrebări · " + (t ? CO_TOP[t].n : "ca la examen"); }
    if (bl[0] === "srs") return "🔁 " + bl[1] + " greșeli de repetat";
    if (bl[0] === "ap") return "🧠 " + bl[1] + " teste psihologice";
    if (bl[0] === "apm") return "🧠 " + bl[1] + " teste psihologice greșite";
    if (bl[0] === "gx") return "🖥️ Cisco: " + coGxTitle(coNextGx());
    if (bl[0] === "rj") return "🔌 Mufarea RJ45 (T568B)";
    if (bl[0] === "sim") return "📝 Simulare: 18 întrebări · 20 min";
    if (bl[0] === "apx") return "🧠 Teste psihologice pe timp · " + bl[1] + " itemi";
    if (bl[0] === "jg") return bl[1] === "ex" ? "🎮 Joc: examen practic pe timp" : "🎮 Joc: SSH pe switch cu VLAN, pe timp";
    return "";
  }
  function coSnap() { var ok = 0, bad = 0; Object.keys(P.q).forEach(function (id) { ok += P.q[id][0]; bad += P.q[id][1]; }); var an = 0, ak = 0; Object.keys(P.cli).forEach(function (k) { if (/^ap:n:/.test(k)) an += P.cli[k]; else if (/^ap:k:/.test(k)) ak += P.cli[k]; }); return { ok: ok, bad: bad, an: an, ak: ak, t: Date.now() }; }
  var CO = null;
  function coPickTheory(topic, n) {
    var L = topic ? (coTopicCache && coTopicCache[topic]) || [] : QS.filter(function (q) { return q.c === "ex" && !q.s; });
    if (!L.length) L = QS.filter(function (q) { return q.c === "ex" && !q.s; });
    var mi = L.filter(function (q) { return P.mist[q.id] && P.mist[q.id][1]; }).sort(function (a, b) { return P.mist[a.id][0] - P.mist[b.id][0]; });
    var exUnseen = shuffle(L.filter(function (q) { return !P.q[q.id] && (q.c === "ex" || q.c === "cap" || q.c === "pp"); })), unseen = shuffle(L.filter(function (q) { return !P.q[q.id]; })), weak = L.filter(function (q) { return P.q[q.id] && P.q[q.id][1] > 0; });
    var out = [], add = function (q) { if (out.length < n && out.indexOf(q) < 0) out.push(q); };
    mi.slice(0, Math.ceil(n * 0.4)).forEach(add); exUnseen.forEach(add); unseen.forEach(add); weak.forEach(add); shuffle(L).forEach(add);
    return shuffle(out);
  }
  function coSrs(n) { var ids = weakIds(); return ids.slice(0, n).map(function (id) { return BYID[id]; }).filter(Boolean); }
  function coApTypes() { var A = coApStat().slice().sort(function (a, b) { return a.m - b.m || a.n - b.n; }); var pri = A.filter(function (x) { return x.t === "cnt" || x.t === "syn"; }).filter(function (x) { return x.m < 0.6; }); var L = pri.concat(A.filter(function (x) { return pri.indexOf(x) < 0; })); return [L[0].t, L[1].t, L[2].t]; }
  function coRun(bl, title) {
    CO.snap = coSnap(); CO.bl = bl; saveP(true);
    if (bl[0] === "q") { var W = coWeakTopics(), t = bl[1] < 0 ? null : W[bl[1]]; coTopics(); var it = coPickTheory(t, bl[2]); return runQuiz({ mode: "practice", items: it, hearts: 0, requeue: false, xpEach: 5, title: title }); }
    if (bl[0] === "srs") { var s = coSrs(bl[1]); if (!s.length) s = coPickTheory(coWeakTopics()[0], bl[1]); return runQuiz({ mode: "practice", items: s, hearts: 0, requeue: true, xpEach: 5, title: title }); }
    if (bl[0] === "ap") return apStart({ mode: "ex", types: coApTypes(), n: bl[1], title: title });
    if (bl[0] === "apm") { if (apMists().length) return apStart({ mode: "mist", n: Math.min(bl[1], apMists().length), title: title }); return apStart({ mode: "ex", types: coApTypes(), n: bl[1], title: title }); }
    if (bl[0] === "gx") { GXS = null; return go("ghid", coNextGx()); }
    if (bl[0] === "rj") return go("rj", "B");
    if (bl[0] === "sim") return runQuiz({ mode: "exam", items: simPick(0), minutes: 20, title: "Simulare examen", sim: "Simulare completă" });
    if (bl[0] === "apx") return apStart({ mode: "exam", n: bl[1], time: bl[2], title: "Simulare – teste psihologice" });
    if (bl[0] === "jg") return go("game", bl[1]);
  }
  function coStart(full) {
    var c = coCur();
    if (full || !c || c.done) { CO = { d: -1, s: 0, b: 0, full: 1, blocks: [["sim"], ["apx", 12, 360]], res: [] }; }
    else CO = { d: c.d, s: c.s, b: c.b, blocks: CO_PLAN[c.d][c.s], res: CO && CO.d === c.d && CO.s === c.s ? CO.res : [] };
    CO.on = true; coRun(CO.blocks[CO.b], (CO.full ? "Simulare completă" : "Sesiunea " + (CO.s + 1)) + " · " + coBlockLabel(CO.blocks[CO.b]).replace(/^\S+\s/, ""));
  }
  /* pus de fiecare ecran de final (lecție, simulare, Cisco, psihologice, RJ45) */
  var CO_KIND = { q: "quiz", srs: "quiz", sim: "sim", gx: "gx", rj: "rj", ap: "ap", apm: "ap", apx: "ap", jg: "jg" };
  function coMark() { if (!CO || CO.marked === CO.b) return; var s0 = CO.snap || coSnap(), s1 = coSnap(), bl = CO.bl || CO.blocks[CO.b], r = { l: coBlockLabel(bl) };
    if (bl[0] === "q" || bl[0] === "srs" || bl[0] === "sim") { r.ok = s1.ok - s0.ok; r.n = r.ok + (s1.bad - s0.bad); }
    else if (bl[0] === "ap" || bl[0] === "apm" || bl[0] === "apx") { r.ok = s1.ak - s0.ak; r.n = s1.an - s0.an; } else r.done = 1;
    CO.res[CO.b] = r; if (!CO.full) P.cli[coKey(CO.d, CO.s, CO.b)] = Date.now(); CO.marked = CO.b; CO.b++; CO.ended = false;
    var last = CO.b >= CO.blocks.length; if (last && !CO.full) P.cli[coKey(CO.d, CO.s)] = Date.now(); saveP(); return last; }
  function coHook(kind) {
    if (!CO || !CO.on || CO_KIND[(CO.bl || CO.blocks[CO.b])[0]] !== kind) return; CO.ended = true;
    var b = document.createElement("button"); b.className = "big gogreen coNext"; b.id = "coNext"; b.innerHTML = "▶️ Continuă";
    b.onclick = function () { SND.tap(); coAfter(); };
    var w = document.createElement("div"); w.className = "cohook"; w.innerHTML = '<p class="small muted">' + (CO.full ? "Simulare completă" : "Sesiunea " + (CO.s + 1)) + " · pasul " + (CO.b + 1) + " din " + CO.blocks.length + "</p>"; w.appendChild(b);
    app.insertBefore(w, app.firstChild); toTop();
    ["doneBtn", "apDone"].forEach(function (id) { var d = $(id); if (d) { d.className = "ghost"; d.textContent = "Ieși din sesiune"; } });
  }
  function coAfter() { var last = coMark(); go("coach", last ? "end" : "mid"); }
  function coResLine(r) { return '<div class="corow"><span>' + esc(r.l) + "</span><b>" + (r.n != null ? (r.n ? r.ok + " / " + r.n : "–") : "✓") + "</b></div>"; }
  function vCoach(arg) {
    view = "home"; navbar(false);
    if (!CO) return go("home");
    var h = '<section class="card ioshero cohero">';
    if (arg === "mid") {
      var r = CO.res[CO.b - 1] || {};
      h += '<div class="iosk">' + (CO.full ? "Simulare completă" : "Sesiunea " + (CO.s + 1)) + " · pasul " + CO.b + " din " + CO.blocks.length + " gata</div><h2>" + (r.n ? (r.ok / r.n >= 0.7 ? "👍 " : "💪 ") + r.ok + " din " + r.n + " corecte" : "✅ Gata") + '</h2><p class="small muted">Urmează: ' + esc(coBlockLabel(CO.blocks[CO.b])) + '</p><button class="big gogreen" id="coGo">▶️ Continuă</button><button class="ghost" id="coHome">Mai târziu</button>';
    } else {
      var ok = 0, n = 0; CO.res.forEach(function (x) { if (x && x.n) { ok += x.ok; n += x.n; } });
      var c = coCur(), R0 = coReady();
      h += '<div class="iosk">' + (CO.full ? "Simulare completă" : "Sesiunea " + (CO.s + 1) + " din " + CO_PLAN[CO.d].length) + ' · gata</div><h2>🎉 Bravo!' + (n ? " " + Math.round(100 * ok / n) + "% corecte" : "") + "</h2>" + CO.res.map(function (x) { return x ? coResLine(x) : ""; }).join("") +
        '<p class="small" style="margin-top:10px">Gata pentru examen: <b>' + R0.all + "%</b></p>" +
        (c && !c.done ? '<div class="cobreak"><b>☕ Pauză 5 minute</b><p class="small muted">Ridică-te, bea apă, privește pe geam. Încearcă să lași telefonul jos.</p><div id="coBT" class="cobt">5:00</div></div><button class="big gogreen" id="coGo">▶️ Continuă (sesiunea ' + (c.s + 1) + ")</button>" : '<p>Ai terminat planul de azi. Odihnește-te – somnul fixează ce ai învățat.</p>') +
        '<button class="ghost" id="coHome">Acasă</button>';
      CO.on = false; CO = c && !c.done ? null : CO;
      var end = Date.now() + 300000; if (coBT) clearInterval(coBT); coBT = setInterval(function () { var el = $("coBT"); if (!el) { clearInterval(coBT); coBT = null; return; } var left = Math.max(0, end - Date.now()); el.textContent = left ? Math.floor(left / 60000) + ":" + ("0" + Math.floor(left % 60000 / 1000)).slice(-2) : "Gata pauza!"; if (!left) { clearInterval(coBT); coBT = null; try { SND.ok(); } catch (e) {} } }, 500);
    }
    h += "</section>";
    app.innerHTML = h;
    if ($("coGo")) $("coGo").onclick = function () { SND.tap(); if (arg === "mid") { CO.on = true; coRun(CO.blocks[CO.b], (CO.full ? "Simulare completă" : "Sesiunea " + (CO.s + 1)) + " · " + coBlockLabel(CO.blocks[CO.b]).replace(/^\S+\s/, "")); } else coStart(); };
    $("coHome").onclick = function () { if (CO) CO.on = false; go("home"); };
  }
  var coBT = null;
  function coRing(p) { var r = 52, C = 2 * Math.PI * r, off = C * (1 - p / 100); return '<svg class="coring" viewBox="0 0 120 120" width="132" height="132" role="img" aria-label="Gata pentru examen ' + p + '%"><circle cx="60" cy="60" r="' + r + '" fill="none" stroke="#e5e5ea" stroke-width="12"/><circle cx="60" cy="60" r="' + r + '" fill="none" stroke="' + (p >= 70 ? "#34c759" : p >= 45 ? "#ff9500" : "#ff3b30") + '" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 60 60)"/><text x="60" y="58" text-anchor="middle" font-size="28" font-weight="700" fill="#1c1c1e">' + p + '%</text><text x="60" y="80" text-anchor="middle" font-size="12" fill="#6c6c70">gata</text></svg>'; }
  function vHome() {
    view = "home"; navbar(true); P.cli = P.cli || {}; if (CO && CO.on && CO.ended) coMark(); if (CO) CO.on = false;
    var now = new Date(), ed = new Date(2026, 9, 19), dl = Math.round((ed - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
    var c = coCur(), R0 = coReady(), W = coWeakTopics(), mc = activeMistakes().length + apMists().length;
    var weak = []; if (coGxTier("ssh") < 3) weak.push("SSH pe switch cu VLAN"); weak.push(CO_TOP[W[0]].n); var A = R0.A.slice().sort(function (a, b) { return a.m - b.m; }); weak.push({ cnt: "numărarea cuburilor", syn: "sinonime", top: "vedere de sus", net: "desfășurata cubului", rot3: "rotație 3D", mat: "matrice", ser: "șiruri", syl: "silogisme", praga: "Praga", bou: "atenție", arr: "săgeți", pon: "PON", mem: "memorie", att: "avioane", fold: "plierea hârtiei" }[A[0].t] || A[0].t);
    var h = '<p class="iosdays">' + (dl > 1 ? "🎖️ Examen luni, 19 oct · mai sunt <b>" + dl + " zile</b>" : dl === 1 ? "🎖️ Examenul e <b>mâine</b>" : dl === 0 ? "🎖️ <b>Azi e examenul.</b> Succes!" : "🎖️ Examenul a trecut") + "</p>";
    h += '<section class="card ioshero cohome"><div class="cotop">' + coRing(R0.all) + '<div class="cotxt"><div class="iosk">Gata pentru examen</div>' + [["Teorie", R0.th], ["Cisco practic", R0.pr], ["Psihologic", R0.ps]].map(function (x) { return '<div class="cobar"><span>' + x[0] + '</span><b>' + x[1] + '%</b><i><u class="' + (x[1] >= 70 ? "hi" : x[1] >= 40 ? "mid" : "lo") + '" style="width:' + x[1] + '%"></u></i></div>'; }).join("") + "</div></div>";
    if (c && !c.done) {
      var S = CO_PLAN[c.d][c.s];
      h += '<p class="cosess">' + (c.d === 0 ? (dl >= 2 ? "Duminică" : "Azi") : "Azi") + ": sesiunea <b>" + (c.s + 1) + " din " + c.n + "</b> · ~15 min</p>" + '<ul class="colist">' + S.map(function (bl, i) { return "<li" + (i < c.b ? ' class="ok"' : "") + ">" + (i < c.b ? "✅ " : "") + esc(coBlockLabel(bl)) + "</li>"; }).join("") + "</ul>" +
        '<button class="big gogreen cogo" id="hGo">▶️ Continuă</button>';
    } else if (c && c.done) h += '<p class="cosess">🎉 Ai terminat planul de azi.</p><button class="big gogreen cogo" id="hGo">🎯 Simulare examen completă</button>';
    else h += '<p class="cosess">Mult succes! Poți repeta oricând.</p><button class="big gogreen cogo" id="hGo">🔁 Repetă greșelile</button>';
    h += '<p class="coweak">De lucrat: ' + weak.map(esc).join(" · ") + "</p></section>";
    h += '<div class="iosgl cosec"><button class="iosrow" id="hSim"><span class="ic">🎯</span><span class="tx"><b>Simulare examen completă</b><small>18 întrebări + teste psihologice, pe timp</small></span><span class="chev">›</span></button>' +
      '<button class="iosrow" id="hGame"><span class="ic">🎮</span><span class="tx"><b>Joc practic 3D</b><small>poarta → teorie → proba practică, pe timp</small></span><span class="chev">›</span></button>' +
      '<button class="iosrow" id="hMist"><span class="ic">❌</span><span class="tx"><b>Greșelile mele</b><small>' + mc + " de repetat</small></span><span class=\"chev\">›</span></button>" +
      '<button class="iosrow" id="hAll"><span class="ic">📚</span><span class="tx"><b>Toate secțiunile</b><small>lecții, Cisco, grile, jocuri, plan…</small></span><span class="chev">›</span></button></div>';
    app.innerHTML = h;
    $("hGo").onclick = function () { SND.tap(); if (c && !c.done) coStart(); else if (c && c.done) coStart(true); else go("rev"); };
    $("hSim").onclick = function () { SND.tap(); coStart(true); };
    $("hMist").onclick = function () { go("mist"); };
    $("hGame").onclick = function () { SND.tap(); go("game"); };
    $("hAll").onclick = function () { go("all"); };
  }
  function vAll() {
    view = "home"; navbar(true); P.cli = P.cli || {};
    var now = new Date(), ti = -1, d = null, nx = null, nxt = [], ss = null, si = 0;
    try { ti = wkDayIdx(now); d = ti >= 0 && ti < WKP.length ? wkDay(ti) : null; } catch (e) {}
    if (d) { var SS = wkSessions(d.tasks); SS.forEach(function (S1, k) { S1.t.forEach(function (t) { if (t.p < 1) { if (!nx) { nx = t; ss = SS.length; si = k + 1; } else if (nxt.length < 2) nxt.push(t); } }); }); }
    var ed = new Date(2026, 9, 19), dl = Math.round((ed - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
    var h = '<p class="iosdays">' + (dl > 1 ? "🎖️ Examen luni, 19 oct · mai sunt <b>" + dl + " zile</b>" : dl === 1 ? "🎖️ Examenul e <b>mâine</b> (luni, 19 oct)" : dl === 0 ? "🎖️ <b>Azi e examenul.</b> Succes!" : "🎖️ Examenul a trecut") + "</p>";
    var st = dayStreak(), xt = xpToday();
    h += '<section class="card ioshero"><div class="iosk">Ce fac acum' + (nx ? " · Sesiunea " + si + " din " + ss : "") + "</div>";
    if (d && nx) h += "<h2>" + esc(wkLabel(nx)) + '</h2><p class="small muted">~' + wkFmt(nx[2]) + ", apoi pauză 5 min</p>" + '<button class="big gogreen" id="hGo">▶️ ' + (d.pct > 0 ? "Continuă" : "Începe") + " (" + wkFmt(nx[2]) + ')</button>' + (nxt.length ? '<p class="small muted" style="margin:8px 0 0">Apoi: ' + nxt.map(function (t) { return esc(wkLabel(t)); }).join(" · ") + "</p>" : "") + '<div class="iosbar"><i style="width:' + d.pct + '%"></i></div><p class="small muted" style="margin:2px 0 0">Azi: ' + d.pct + "% din plan" + (st ? " · 🔥 " + st + (st === 1 ? " zi" : " zile") + " la rând" : "") + (xt ? " · ⚡ " + xt + " XP azi" : "") + '</p><button class="ghost" id="hWk">🗓️ Vezi planul de azi ›</button>';
    else if (d) h += '<h2>🎉 Planul de azi e gata!</h2><p class="small muted">Bravo. Dacă mai ai chef, repetă greșelile sau fă o simulare.</p><button class="big gogreen" id="hGo">📝 Simulare: 18 întrebări</button>';
    else h += '<h2>Începe cu o lecție</h2><button class="big gogreen" id="hGo">▶️ Continuă</button>';
    h += "</section>" + readyCard();
    var nw = weakIds().length, gd = GX.filter(function (x) { return gxDoneTier(x.id) >= 1; }).length;
    var G = [["🖥️ Proba practică Cisco", [["game", "🎮", "Joc practic 3D", "examen complet + misiuni"], ["prac", "🎖️", "Simulează proba practică", "ca la examen"], ["ghid", "🧭", "Pas cu pas", gd + " / " + GX.length], ["scen", "🚨", "Situații reale"], ["cli", "⌨️", "Terminal liber"]]],
      ["📝 Grile", [["sim", "📝", "Simulare: 18 întrebări"], ["apt", "🧠", "Teste psihologice", "avioane, cuburi, atenție…"]].concat(nw ? [["rev", "❗", "Greșelile mele", "" + nw]] : []).concat([["learn", "📖", "Lecții pe capitole"], ["cards", "🗂️", "Cartonașe"]])],
      ["📄 Recapitulare", [["sheet", "📄", "Foaie de recapitulare"], ["gloss", "🔤", "Dicționar de termeni"]]],
      ["➕ Mai mult", [["games", "🎲", "Jocuri"], ["talk", "📞", "Interviu: pregătire"]]]];
    app.innerHTML = h + hubList(G); hubWire();
    $("hGo").onclick = function () { if (d && nx) wkRun(ti + "|" + nx.idx); else if (d) go("sim"); else go("learn"); };
    if ($("hWk")) $("hWk").onclick = function () { go("week"); };
    var bk = document.createElement("div"); bk.innerHTML = '<button class="back" id="allBack">‹ Acasă</button>'; app.insertBefore(bk.firstChild, app.firstChild); $("allBack").onclick = function () { go("home"); };
    if (!gd) { var sh = document.createElement("div"); sh.innerHTML = START_HERE(); app.insertBefore(sh.firstChild, app.children[2] || null); var sb = app.querySelector("[data-start]"); if (sb) sb.onclick = function () { GXS = null; go("ghid", "con:1"); }; }
  }

  /* ---------------- 🎮 Joc practic 3D (public/game.js, încărcat la cerere) ---------------- */
  var STQ = null, APPV = (function () { var e = document.querySelector('script[src*="app.js"]'), m = e && /v=([a-z0-9]+)/.exec(e.getAttribute("src")); return m ? m[1] : "1"; })();
  function loadCss(href) { if (document.querySelector('link[data-href="' + href + '"]')) return; var l = document.createElement("link"); l.rel = "stylesheet"; l.href = href + "?v=" + APPV; l.setAttribute("data-href", href); document.head.appendChild(l); }
  function loadScripts(list, cb) { var i = 0; (function nx() { if (i >= list.length) return cb(true); var src = list[i++]; if (document.querySelector('script[data-src="' + src + '"]')) return nx(); var s = document.createElement("script"); s.src = src + "?v=" + APPV; s.setAttribute("data-src", src); s.onload = nx; s.onerror = function () { cb(false); }; document.head.appendChild(s); })(); }
  function jgDiff() { try { return localStorage.getItem("jg_diff") === "greu" ? "greu" : "normal"; } catch (e) { return "normal"; } }
  var JGB = {
    P: function () { P.cli = P.cli || {}; return P; }, saveP: function () { saveP(); }, tone: tone, SND: SND, mute: function () { return !!SET.mute; }, setMute: function (m) { SET.mute = !!m; saveSet(); },
    gxSession: gxSession, cliRun: cliRun, cliPrompt: cliPrompt, cliNew: cliNew, cliComplete: cliComplete, cliTip: cliTip, cliSshWhy: cliSshWhy, cfgEq: cfgEq, termBox: termBox, winBox: winBox, winRun: winRun, ipOk: ipOk, maskOk: maskOk, ipIn: ipIn,
    lowGfx: function () { return !!SET.lowgfx; }, noSlow: function () { return /[?&]jgtest=1/.test(location.search); }, loadScripts: loadScripts,
    coActive: function () { return !!(CO && CO.on && (CO.bl || CO.blocks[CO.b])[0] === "jg"); }, coDone: function () { go("game", "__done"); },
    go: function (v, a) { go(v, a); }, user: function () { return AUTH && AUTH.user || ""; },
    storyTheory: function () { STQ = { ph: "sim" }; runQuiz({ mode: "exam", paper: true, items: simPick(0), minutes: 20, title: "Examen – proba teoretică", sim: "Examen (joc)" }); },
    storyRes: function () { var r = STQ || {}; return { grade: r.g == null ? 1 : r.g, psy: r.psy == null ? null : r.psy }; }
  };
  function vGame(arg) {
    view = "game"; navbar(false); document.body.classList.add("inex");
    if (arg === "__done") { document.body.classList.remove("inex"); app.innerHTML = '<section class="card ioshero"><div class="iosk">🎮 Joc practic</div><h2>Misiune încheiată</h2><p class="small muted">Rezultatul s-a salvat în progres.</p><button class="big gogreen" id="jgBack">🎮 Înapoi în joc</button></section>'; $("jgBack").onclick = function () { go("game"); }; coHook("jg"); return; }
    app.innerHTML = '<section class="card ioshero"><div class="iosk">🎮 Joc practic 3D</div><h2>Se încarcă sala de examen…</h2><p class="small muted">Prima dată durează câteva secunde (grafica 3D, ~0,8 MB).</p></section>';
    loadCss("game.css"); loadScripts(["game.js"], function (ok) { if (view !== "game") return; if (!ok || !window.JG) { app.innerHTML = '<section class="card"><h2>Jocul nu s-a putut încărca</h2><p class="muted">Verifică internetul și încearcă din nou.</p><button class="big" id="jgR">Reîncearcă</button></section>'; $("jgR").onclick = function () { go("game", arg); }; return; } window.JG.mount(app, JGB, arg); });
  }
  function jgLeave() { if (window.JG && window.JG.active && window.JG.active()) window.JG.unmount(); document.body.classList.remove("inex"); }
  window.__go = function (v, a) { return go(v, a); }; window.__coDbg = { R: function () { return R; }, finL: function () { finishLesson(); }, finE: function () { finishExam(false); }, CO: function () { return CO; }, ready: function () { return coReady(); }, gxEnd: function () { var X = GX.filter(function (x) { return x.id === GXS.id; })[0]; if (GXS.tier < 4) { GXS.i = X.steps.length; gxStepView(X); } else { gxFinish(X, GXS); coHook("gx"); } } }; window.__cli = { n: function (d) { return cliNew(d); }, r: function (st, l) { return cliRun(st, l); } };
  /* link direct la joc: /joc sau /#joc (netlify.toml redirecționează /joc spre /?joc=1#joc) */
  function goUrl(v) { var q = location.search.replace(/^\?/, "").split("&").filter(function (x) { return x && !/^joc(=|$)/.test(x); }).join("&"), pth = /^\/joc\/?$/.test(location.pathname) ? "/" : location.pathname; return pth + (q ? "?" + q : "") + (v === "game" ? "#joc" : ""); }
  function go(v, arg) {
    clearInterval(SRT); if (v !== "game") jgLeave();
    stopTimer(); apStop(); R = null; view = v; document.body.classList.remove("inquiz"); hideSheet();
    document.body.classList.toggle("inex", (v === "ghid" && !!arg) || v === "cli" || (v === "scen" && !!arg));
    try { if (!go.pop) { var stt = { v: v, a: arg == null ? null : arg }; var u = goUrl(v); if (go.n) history.pushState(stt, "", u); else history.replaceState(stt, "", u); go.n = 1; } } catch (e) {} go.pop = 0;
    header(); navbar(true);
    ({ home: vHome, cisco: vCisco, me: vMe, learn: vLearn, path: vPath, practice: vPractice, exam: vExamSetup, mist: vMist, marks: vMarks, plan: vPlan, cards: vCards, gloss: vGloss, sheet: vSheet, stats: vStats, acct: vAcct, trainer: vTrainer, bin: vBin, sim: vSim, prac: vPrac, mem: vMem, games: vGames, board: vBoard, rev: vRev, week: vWeek, talk: vTalk, cli: vCli, ghid: vGhid, scen: vScen, cmdcards: vCmdCards, rj: vRj, mm: vMm, ppsheet: vPpSheet, credits: vCredits, anims: vAnims, apt: vApt, coach: vCoach, all: vAll, game: vGame }[v] || vLearn)(arg);
    toTop();
  }

  /* ---------------- ecran: Învață ---------------- */
  function vLearn() {
    view = "learn"; navbar(true);
    var nl = nextLesson(), xt = xpToday(), st = dayStreak();
    var h = '<section class="card"><p class="small muted" style="margin:0 0 6px">Ce faci acum îți spune ecranul 🏠 Acasă (din Plan). Aici alegi liber orice lecție – toate sunt deschise până la examen.</p><button class="big sec" id="startBtn">📖 Lecția următoare: ' + esc(CATBY[nl.c].short) + " · " + esc(nl.t) + '</button><button class="ghost" id="quickBtn">' + ICON.bolt + ' Lecție rapidă (mix + greșeli)</button></section>';
    h += '<h2 class="sec">Capitole – traseul de învățare</h2><div class="chapters">';
    CATS.forEach(function (c) {
      var pr = chapterProgress(c.id);
      h += '<button class="chap' + (SET.cur === c.id ? " cur" : "") + '" data-c="' + c.id + '"><span class="cic">' + c.ic + '</span><span class="ct"><b>' + esc(c.short) + "</b><small>" + pr.d + " / " + pr.n + " lecții · " + QS.filter(function (q) { return q.c === c.id; }).length + ' întrebări</small><span class="bar sm"><i style="width:' + pct(pr.d, pr.n) + '%"></i></span></span><span class="go">›</span></button>';
    });
    h += "</div>";
    app.innerHTML = h;
    $("startBtn").onclick = function () { SND.tap(); startLesson(nextLesson()); };
    if ($("planAll")) $("planAll").onclick = function () { go("week"); };
    if ($("plBtn")) $("plBtn").onclick = function () { SND.tap(); startPlacement(); };
    if (app.querySelector(".plan")) wirePlan(app.querySelector(".plan"));
    $("quickBtn").onclick = function () { SND.tap(); startQuick(); };
    Array.prototype.forEach.call(app.querySelectorAll(".chap"), function (b) { b.onclick = function () { SET.cur = b.getAttribute("data-c"); saveSet(); go("path", SET.cur); }; });
  }
  function vPath(c) {
    c = c || SET.cur; view = "learn"; navbar(true);
    var arr = CHLES[c], cat = CATBY[c], lvl = 0, idx = 0;
    var h = '<div class="pathhead card"><button class="back" id="backBtn">‹ Capitole</button><h1>' + cat.ic + " " + esc(cat.short) + "</h1><p>" + esc(cat.name) + "</p></div>";
    arr.forEach(function (l) {
      if (l.lvl !== lvl) {
        if (lvl) h += "</div>";
        lvl = l.lvl;
        var ls = arr.filter(function (x) { return x.lvl === lvl; }), dn = ls.filter(function (x) { return isDone(x.id); }).length;
        var locked = !isUnlocked(ls[0]);
        h += '<div class="lvl' + (locked ? " locked" : "") + '"><div class="lvlh"><b>Nivel ' + lvl + " · " + LVL[lvl] + "</b><small>" + (locked ? "🔒 se deblochează după nivelul anterior" : dn + " / " + ls.length + " terminate") + "</small></div>";
      }
      var done = isDone(l.id), un = isUnlocked(l), rec = P.lessons[l.id];
      var stars = done ? "★★★".slice(0, rec.s) + '<span class="off">' + "★★★".slice(rec.s) + "</span>" : "";
      h += '<button class="node ' + (done ? "done" : un ? "open" : "lock") + '" style="margin-left:' + [8, 30, 52, 30][idx++ % 4] + '%" data-l="' + l.id + '"' + (un ? "" : " disabled") + '><span class="ball">' + (un ? l.ic : ICON.lock) + '</span><span class="nl">' + esc(l.t) + '<small class="stars">' + stars + "</small></span></button>";
    });
    h += "</div>";
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("learn"); };
    Array.prototype.forEach.call(app.querySelectorAll(".node"), function (b) { b.onclick = function () { if (b.disabled) return; SND.tap(); startLesson(LBY[b.getAttribute("data-l")]); }; });
  }

  /* ---------------- lecție: teorie ---------------- */
  function startLesson(l) {
    if (!l.cards || !l.cards.length) return beginQuiz(l);
    var i = 0;
    R = { active: true, kind: "theory" }; document.body.classList.add("inquiz"); navbar(false);
    function paint() {
      hdr.className = "topbar lesson";
      hdr.innerHTML = '<button class="x" id="xBtn" aria-label="Închide">' + ICON.x + '</button><div class="pbar"><i style="width:' + pct(i + 1, l.cards.length) + '%"></i></div><span class="chip">' + ICON.book + (i + 1) + "/" + l.cards.length + "</span>";
      $("xBtn").onclick = function () { go("path", l.c); };
      var seenH = {}, hk = ""; if (typeof HACK_FIND === "function" && !l.noHk) { for (var zh = 0; zh < i; zh++) HACK_FIND(l.cards[zh].replace(/<[^>]+>/g, " "), seenH); hk = HACK_HTML(HACK_FIND(l.cards[i].replace(/<[^>]+>/g, " "), seenH)); }
      app.innerHTML = '<div class="theory card pop"><div class="tlabel">' + l.ic + " " + esc(CATBY[l.c].short) + " · Nivel " + l.lvl + " – " + LVL[l.lvl] + "</div>" + l.cards[i] + hk + "</div>" +
        '<div class="tnav">' + (i > 0 ? '<button class="ghost" id="prevC">‹ Înapoi</button>' : '<button class="ghost" id="skipC">Sari la exerciții</button>') +
        '<button class="big" id="nextC">' + (i < l.cards.length - 1 ? "Mai departe ›" : "Am înțeles – la exerciții ✓") + "</button></div>";
      var seenL = {}; for (var z = 0; z <= i; z++) { var tmp = document.createElement("div"); tmp.innerHTML = l.cards[z]; if (z < i) glossify(tmp, l.c, seenL, true); }
      glossify(app.querySelector(".theory"), l.c, seenL, true);
      wireAnims(app); wireGo(app);
      if ($("prevC")) $("prevC").onclick = function () { i--; paint(); toTop(); };
      if ($("skipC")) $("skipC").onclick = function () { beginQuiz(l); };
      $("nextC").onclick = function () { SND.tap(); if (i < l.cards.length - 1) { i++; paint(); toTop(); } else beginQuiz(l); };
    }
    paint(); toTop();
  }
  function beginQuiz(l) {
    var n = l.review ? 15 : 10, items;
    if (l.gen === "subnet") { items = pickQuestions(LPOOL[l.id], 5); for (var k = 0; k < 5; k++) items.push(SUB.question(l.lvl)); items = shuffle(items); }
    else items = pickQuestions(LPOOL[l.id], n);
    runQuiz({ mode: "lesson", lesson: l, items: items, hearts: 5, requeue: true, xpEach: 10, title: l.t });
  }
  function startQuick() {
    var mis = shuffle(activeMistakes()).slice(0, 4).map(function (id) { return BYID[id]; });
    var rest = pickQuestions(QS.filter(function (q) { return mis.indexOf(q) < 0; }), 12 - mis.length);
    runQuiz({ mode: "quick", items: shuffle(mis.concat(rest)), hearts: 5, requeue: true, xpEach: 10, title: "Lecție rapidă" });
  }

  /* ---------------- motorul de întrebări ---------------- */
  function letOpts(q) { return q.a && q.a.length === 4 && q.a.every(function (x) { return /^[A-D]$/.test(x); }); }
  function prepItem(q) { var ord = letOpts(q) ? [0, 1, 2, 3].sort(function (x, y) { return q.a[x] < q.a[y] ? -1 : 1; }) : shuffle([0, 1, 2, 3]); return { q: q, ord: ord, tries: 0, ok: false, pick: null }; }
  function runQuiz(o) {
    stopTimer(); hideSheet();
    R = Object.assign({ active: true, kind: "quiz", i: 0, xp: 0, combo: 0, bestCombo: 0, firstOk: 0, start: Date.now(), maxHearts: o.hearts || 0 }, o);
    R.items = o.items.map(prepItem); R.queue = R.items.map(function (_, i) { return i; }); R.target = R.items.length; R.solved = 0;
    document.body.classList.add("inquiz"); navbar(false);
    if (R.mode === "exam") { R.deadline = R.minutes ? Date.now() + R.minutes * 60000 : 0; if (R.deadline) timerInt = setInterval(tick, 1000); }
    paintQ();
  }
  function stopTimer() { if (timerInt) { clearInterval(timerInt); timerInt = null; } }
  function tick() { if (!R || R.mode !== "exam") return stopTimer(); var left = (R.deadline - Date.now()) / 1000, el = $("timer"); if (el) { el.textContent = "⏱ " + fmtTime(left); el.classList.toggle("warn", left < 60); } if (left <= 0) { stopTimer(); finishExam(true); } }
  function quizHeader() {
    hdr.className = "topbar lesson";
    var right = R.mode === "exam" ? '<span class="chip" id="timer">' + (R.deadline ? "⏱ " + fmtTime((R.deadline - Date.now()) / 1000) : (R.i + 1) + "/" + R.items.length) + "</span>"
      : R.maxHearts ? '<span class="chip hearts" id="hearts">' + ICON.heart + R.hearts + "</span>" : '<span class="chip">' + ICON.bolt + R.xp + "</span>";
    var prog = R.mode === "exam" ? pct(R.items.filter(function (it) { return it.pick != null; }).length, R.items.length) : pct(R.solved, R.target);
    hdr.innerHTML = '<button class="x" id="xBtn" aria-label="Închide">' + ICON.x + '</button><div class="pbar"><i style="width:' + prog + '%"></i></div>' + (R.combo >= 2 && R.mode !== "exam" ? '<span class="chip combo">' + ICON.flame + R.combo + "</span>" : "") + right;
    $("xBtn").onclick = function () {
      if (R.mode === "exam") { if (confirm("Închei simularea acum? Întrebările fără răspuns vor fi considerate greșite.")) finishExam(false); return; }
      if (R.solved === 0 || confirm("Ieși din lecție? Progresul lecției se pierde (XP-ul câștigat rămâne).")) { saveP(); go(R.lesson ? "path" : (R.mode === "mist" ? "mist" : R.mode === "practice" ? "practice" : "learn"), R.lesson ? R.lesson.c : undefined); }
    };
  }
  function curItem() { return R.mode === "exam" ? R.items[R.i] : R.items[R.queue[0]]; }
  /* foaia de examen pe hârtie (proba teoretică din joc): toate cele 18 întrebări, încercuiești litera */
  function paintPaper() {
    hideSheet(); quizHeader(); var V = (window.JG && window.JG.ticketNo && window.JG.ticketNo()) || null;
    var h = '<div class="pdesk"><div class="paper" id="paper"><div class="phd"><div class="phl">ROMÂNIA<br>SERVICIUL DE TELECOMUNICAȚII SPECIALE</div><div class="phr">Biletul nr. <u>' + (V && V.n ? esc(String(V.n)) : "&nbsp;&nbsp;") + '</u></div></div><h2 class="pti">TEST GRILĂ – proba teoretică</h2><p class="pin">Încercuiți o singură literă la fiecare întrebare. 18 întrebări · 20 de minute · nota minimă 7. Puteți schimba răspunsul atingând altă literă.</p><ol class="pql">';
    R.items.forEach(function (it, j) { var q = it.q; h += '<li class="pq" data-j="' + j + '"><div class="pqt"><b>' + (j + 1) + '.</b> ' + esc(q.q) + "</div>" + qSvg(q) + '<div class="popts">'; it.ord.forEach(function (k, m) { h += '<button class="opt popt' + (it.pick === k ? " sel" : "") + '" data-k="' + k + '"><span class="L">' + "abcdef".charAt(m) + ')</span><span>' + esc(q.a[k]) + "</span></button>"; }); h += "</div></li>"; });
    h += '</ol><div class="psig">Semnătura candidatului: <span>' + esc((AUTH && AUTH.user) || "") + '</span></div></div><button class="big gogreen" id="endQ">📄 Predau lucrarea</button></div>';
    app.innerHTML = h;
    Array.prototype.forEach.call(app.querySelectorAll(".pq"), function (li) { var j = +li.getAttribute("data-j"); Array.prototype.forEach.call(li.querySelectorAll(".opt"), function (b) { b.onclick = function () { R.items[j].pick = +b.getAttribute("data-k"); SND.tap(); Array.prototype.forEach.call(li.querySelectorAll(".opt"), function (x) { x.classList.toggle("sel", x === b); }); quizHeader(); }; }); });
    $("endQ").onclick = function () { var un = R.items.filter(function (x) { return x.pick == null; }).length; if (!un || confirm("Mai ai " + un + " întrebări fără răspuns. Predai lucrarea?")) finishExam(false); };
    app.style.paddingBottom = ""; toTop();
  }
  function paintQ() {
    if (R.paper && R.mode === "exam") return paintPaper();
    hideSheet(); quizHeader();
    var it = curItem(), q = it.q, cat = CATBY[q.c];
    var meta = R.mode === "exam" ? "Întrebarea " + (R.i + 1) + " din " + R.items.length + " · " + esc(cat.short) : esc(cat.short) + (q.gen ? " · exercițiu generat" : "") + (it.tries ? ' · <span class="again">↻ din nou</span>' : "") + (isBonus(q) ? ' · <span class="again" style="color:#7c3aed">⭐ Bonus (nu e obligatoriu)</span>' : "");
    var h = '<div class="qcard pop" id="qcard"><div class="qmeta">' + meta + (q.gen ? "" : markBtn(q.id)) + '</div><h2 class="qtext" id="qtext" data-qid="' + esc(q.id || "") + '">' + esc(q.q) + '</h2>' + qSvg(q) + '<div class="opts">';
    it.ord.forEach(function (k, j) { h += '<button class="opt' + (R.mode === "exam" && it.pick === k ? " sel" : "") + '" data-k="' + k + '">' + (letOpts(q) ? "" : '<span class="L">' + LET[j] + "</span>") + "<span>" + esc(q.a[k]) + "</span></button>"; });
    h += "</div></div>";
    if (R.mode === "exam") {
      h += '<div class="tnav"><button class="ghost" id="prevQ"' + (R.i ? "" : " disabled") + '>‹ Înapoi</button>' + (R.i < R.items.length - 1 ? '<button class="big" id="nextQ">Următoarea ›</button>' : '<button class="big" id="endQ">Termină simularea ✓</button>') + "</div>";
      h += '<div class="qgrid">' + R.items.map(function (x, j) { return '<button class="' + (x.pick != null ? "ans" : "") + (j === R.i ? " cur" : "") + '" data-j="' + j + '">' + (j + 1) + "</button>"; }).join("") + "</div>";
    }
    app.innerHTML = h;
    Array.prototype.forEach.call(app.querySelectorAll(".opt"), function (b) { b.onclick = function () { answer(+b.getAttribute("data-k"), b); }; });
    if (R.mode === "exam") {
      $("prevQ").onclick = function () { if (R.i > 0) { R.i--; paintQ(); } };
      if ($("nextQ")) $("nextQ").onclick = function () { R.i++; paintQ(); };
      if ($("endQ")) $("endQ").onclick = function () { var un = R.items.filter(function (x) { return x.pick == null; }).length; if (!un || confirm("Mai ai " + un + " întrebări fără răspuns. Termini?")) finishExam(false); };
      Array.prototype.forEach.call(app.querySelectorAll(".qgrid button"), function (b) { b.onclick = function () { R.i = +b.getAttribute("data-j"); paintQ(); }; });
    }
    wireMarks();
    glossify($("qtext"), q.c, {}, false);
    app.style.paddingBottom = "";
    toTop();
  }
  function answer(k, btn) {
    var it = curItem(), q = it.q;
    if (R.mode === "exam") { it.pick = k; SND.tap(); Array.prototype.forEach.call(app.querySelectorAll(".opt"), function (b) { b.classList.toggle("sel", b === btn); }); quizHeader(); var g = app.querySelector('.qgrid button[data-j="' + R.i + '"]'); if (g) g.classList.add("ans"); return; }
    if (R.locked) return; R.locked = true;
    var ok = k === 0;
    Array.prototype.forEach.call(app.querySelectorAll(".opt"), function (b) { var kk = +b.getAttribute("data-k"); b.disabled = true; if (kk === 0) b.classList.add("right"); else if (b === btn) b.classList.add("wrong"); });
    record(q, ok);
    if (ok) {
      if (!it.tries) R.firstOk++;
      it.ok = true; R.solved++; R.combo++; R.bestCombo = Math.max(R.bestCombo, R.combo); P.best = Math.max(P.best || 0, R.combo);
      var gain = R.xpEach + (R.combo >= 5 ? 2 : 0); R.xp += gain; addXP(gain);
      if (R.mode === "mist") clearMistake(q.id);
      SND.ok();
    } else {
      R.combo = 0; if (R.maxHearts) R.hearts--;
      SND.bad(); var qc = $("qcard"); if (qc) qc.classList.add("shake");
    }
    it.tries++;
    saveP();
    quizHeader();
    var hh = $("hearts"); if (!ok && hh) hh.classList.add("lose");
    showFeedback(ok, q);
  }
  function showFeedback(ok, q) {
    var praise = ["Corect!", "Excelent!", "Bravo!", "Perfect!", "Așa da!"];
    var h = '<div class="fb ' + (ok ? "good" : "bad") + '"><div class="fbh">' + (ok ? "✅ " + praise[Math.floor(Math.random() * praise.length)] + (R.combo >= 3 ? ' <span class="cbadge">🔥 ' + R.combo + " la rând</span>" : "") : "❌ Greșit") + "</div>" +
      (ok ? "" : '<div class="fbc">Răspuns corect: <b>' + esc(q.a[0]) + "</b></div>") +
      '<div class="fbe">💡 ' + esc(q.e) + "</div>" + (!ok && !q.gen && mMiss(q.id) >= 2 ? (function () { var l = lessonFor(q); return '<div class="fbe minil">📘 Ai greșit-o de ' + mMiss(q.id) + " ori." + (l ? " Recitește lecția „" + esc(l.t) + "”." : "") + " Revine în „Exersează greșelile”, în alt format.</div>"; })() : "") + (typeof HACK_FIND === "function" ? '<div class="fbh2">' + HACK_HTML(HACK_FIND(q.q + " " + q.a[0] + " " + q.e, null, q).filter(function (x) { return !ok || x.k === "mem"; })) + "</div>" : "") + (!ok && R.requeue ? '<div class="fbn">↻ Întrebarea va reveni mai târziu în lecție.</div>' : "") +
      '<button class="big" id="contBtn">Continuă</button></div>';
    sheet.innerHTML = h; glossify(sheet.querySelector(".fbe"), q.c, {}, false); sheet.classList.add("show");
    requestAnimationFrame(function () { app.style.paddingBottom = (sheet.offsetHeight + 16) + "px"; });
    $("contBtn").onclick = advance;
    try { $("contBtn").focus({ preventScroll: true }); } catch (e) {}
  }
  function hideSheet() { sheet.classList.remove("show"); sheet.innerHTML = ""; }
  function advance() {
    R.locked = false;
    var idx = R.queue.shift(), it = R.items[idx];
    if (!it.ok && R.requeue) { var pos = Math.min(R.queue.length, 3); R.queue.splice(pos, 0, idx); if (!letOpts(it.q)) { var old = it.ord.join(), nt = 0; do { it.ord = shuffle([0, 1, 2, 3]); } while (it.ord.join() === old && ++nt < 9); } it.pick = null; }
    if (R.maxHearts && R.hearts <= 0) return outOfHearts();
    if (!R.queue.length) return finishLesson();
    paintQ();
  }
  function outOfHearts() {
    var l = R.lesson, o = R; saveP(); R = null; stopTimer(); hideSheet();
    header(); navbar(false); document.body.classList.add("inquiz");
    app.innerHTML = '<div class="result card pop"><div class="big-emoji">💔</div><h1>Ai rămas fără vieți</h1><p>Ai rezolvat corect ' + o.solved + " din " + o.target + ". XP câștigat: <b>+" + o.xp + "</b>.</p><p>Recitește teoria și încearcă din nou – întrebările greșite sunt salvate în „Greșelile mele”.</p>" +
      '<button class="big" id="retry">↻ Reîncearcă</button><button class="ghost" id="back">Înapoi</button></div>';
    $("retry").onclick = function () { if (l) startLesson(l); else startQuick(); };
    $("back").onclick = function () { go(l ? "path" : "learn", l ? l.c : undefined); };
    toTop();
  }
  function finishLesson() {
    var o = R, l = o.lesson, acc = pct(o.firstOk, o.target);
    var stars = acc >= 90 ? 3 : acc >= 70 ? 2 : 1, bonus = 0;
    if (o.mode === "lesson" || o.mode === "quick") { bonus = 20 + (acc === 100 ? 10 : 0); addXP(bonus); }
    if (o.planDay) P.plan.tests[o.planDay] = Math.max(P.plan.tests[o.planDay] || 0, acc);
    if (l) { var rec = P.lessons[l.id] || { s: 0, b: 0, n: 0, t: 0 }; P.lessons[l.id] = { s: Math.max(rec.s, stars), b: Math.max(rec.b, acc), n: rec.n + 1, t: Date.now() }; }
    checkPlan(); saveP(); SND.done();
    R = null; stopTimer(); hideSheet(); header(); navbar(false); document.body.classList.add("inquiz");
    var secs = Math.round((Date.now() - o.start) / 1000);
    var nxt = l ? CHLES[l.c][CHLES[l.c].indexOf(l) + 1] : null;
    var title = o.planDay ? "Testul zilei " + String(o.planDay).replace("b", "") + (acc >= 70 ? " – promovat! ✓" : " – sub 70%, mai încearcă") : o.mode === "mist" ? "Recapitulare terminată!" : o.mode === "practice" ? "Exersare terminată!" : "Lecție terminată!";
    app.innerHTML = '<div class="result card pop"><div class="confetti">' + "🎉✨⭐🎊✨🎉".split("").map(function (c, i) { return '<i style="--i:' + i + '">' + c + "</i>"; }).join("") + '</div><div class="big-emoji">🏅</div><h1>' + title + "</h1>" +
      (l || o.mode === "quick" ? '<div class="stars3">' + "★★★".slice(0, stars) + '<span class="off">' + "★★★".slice(stars) + "</span></div>" : "") +
      '<div class="rgrid"><div><b>+' + (o.xp + bonus) + '</b><span>XP</span></div><div><b>' + acc + '%</b><span>precizie</span></div><div><b>' + o.bestCombo + '</b><span>combo maxim</span></div><div><b>' + fmtTime(secs) + "</b><span>timp</span></div></div>" +
      '<p class="streakline">🔥 ' + dayStreak() + " " + (dayStreak() === 1 ? "zi" : "zile") + " la rând · azi " + xpToday() + " / " + DAILY_GOAL + " XP</p>" +
      (nxt && o.mode === "lesson" ? '<button class="big" id="nextL">Lecția următoare ›</button>' : "") +
      '<button class="' + (nxt && o.mode === "lesson" ? "ghost" : "big") + '" id="doneBtn">Continuă</button></div>';
    if ($("nextL")) $("nextL").onclick = function () { startLesson(nxt); };
    $("doneBtn").onclick = function () { go(o.planDay ? "learn" : l ? "path" : o.mode === "mist" ? "mist" : o.mode === "practice" ? "practice" : "learn", l ? l.c : undefined); };
    toTop(); coHook("quiz");
  }

  /* ---------------- Exersează ---------------- */
  function vPractice() {
    view = "practice"; navbar(true);
    var sel = SET.cats.filter(function (c) { return CATBY[c]; });
    var h = '<section class="card ioshero"><div class="iosk">Grile · proba teoretică</div><button class="big gogreen" id="goSimTop">▶️ Simulare: 18 întrebări (nota 1–10)</button><button class="big sec" id="goApt">🧠 Teste psihologice (aptitudini)</button></section><section class="card pin"><h2>🎯 Exact ca la examen</h2><p class="muted">Temele pe care le-a primit un candidat care a trecut proba: 18 întrebări, 4 variante, un singur răspuns corect. Nota minimă: 7 la teorie și 7 la practică.</p><button class="big sec" id="goExL">Lecțiile „Exact ca la examen”</button><button class="ghost" id="goExQ">18 întrebări ca la examen („Examen real”)</button>' + EXTRA_PIN() + '</section>';
    h += '<section class="card"><h2>🎯 Exersare pe capitole</h2><p class="muted">Feedback imediat după fiecare răspuns, cu explicație.</p><div class="catsel">';
    CATS.forEach(function (c) { var s = catStats(c.id); h += '<label class="cb"><input type="checkbox" value="' + c.id + '"' + (sel.indexOf(c.id) >= 0 ? " checked" : "") + "><span>" + c.ic + " " + esc(c.short) + "<small>" + s.seen + "/" + QS.filter(function (q) { return q.c === c.id; }).length + " văzute · " + pct(s.c, s.a) + "% corecte</small></span></label>"; });
    h += '</div><div class="row"><button class="ghost sm" id="allC">Toate</button><button class="ghost sm" id="noneC">Niciunul</button></div><div class="seg" id="nSeg">' + [10, 20, 30, 50].map(function (n) { return '<button data-n="' + n + '" class="' + (SET.n === n ? "on" : "") + '">' + n + "</button>"; }).join("") + '</div><button class="big sec" id="goP">Începe exersarea</button></section>';
    var mk = markedIds().length;
    h += '<section class="card"><h2>⭐ Marcate <span class="badge gold">' + mk + '</span></h2><p class="muted">Întrebările pe care le-ai marcat cu ☆ în timpul testelor, pentru recapitulare.</p>' + (mk ? '<button class="big sec" id="goM">Repetă marcatele (' + Math.min(30, mk) + ')</button><button class="ghost" id="listM">Vezi lista</button>' : '<p class="muted small">Apasă ☆ lângă o întrebare ca s-o salvezi aici.</p>') + "</section>";
    h += '<section class="card"><h2>📝 Simulare examen</h2><p class="muted">Întrebări aleatorii din toate capitolele, cu cronometru. Rezultatul și explicațiile apar la final.</p><button class="big sec" id="goE">Configurează simularea</button></section>';
    h += '<section class="card"><h2>⚠️ Capcane la examen</h2><p class="muted">Confuziile clasice (drept vs crossover, dB vs dBm, adresa de rețea vs broadcast…) explicate, cu „de ce greșesc oamenii”.</p><button class="big sec" id="goCap">Lecțiile „Capcane”</button><button class="ghost" id="goCapQ">Exersează capcanele (20 întrebări)</button><button class="ghost" id="goPl">' + ICON.compass + ' ' + (P.place && P.place.t ? "Refă testul de nivel" : "Test de nivel (20 întrebări)") + '</button></section>' +
      '<section class="card"><h2>📘 Tanenbaum – „Rețele de calculatoare”</h2><p class="muted">Întrebări originale pe temele manualului (ed. a 4-a), cu trimitere la capitol în explicație (ex. „Tanenbaum cap. 4.3”).</p><div class="seg wrap" id="tanCh">' + [["", "Toate"], ["1", "Cap. 1"], ["2", "Cap. 2"], ["3", "Cap. 3"], ["4", "Cap. 4"], ["5", "Cap. 5"], ["6", "Cap. 6"], ["7", "Cap. 7"], ["8", "Cap. 8"]].map(function (x) { return '<button data-tc="' + x[0] + '">' + x[1] + "</button>"; }).join("") + '</div><button class="ghost" id="goTan">Lecțiile Tanenbaum</button></section>' +
      '<section class="card"><h2>📗 Munteanu & Greavu-Șerban – „Rețele locale de calculatoare”</h2><p class="muted">Întrebări originale pe temele manualului, cu trimitere la capitol (ex. „Munteanu cap. 11”). Unde manualul e depășit, explicația spune „⚠ Azi” și dă varianta actuală.</p><div class="seg wrap" id="munCh">' + [["", "Toate"], ["mun-1", "Cap. 1–2"], ["mun-2", "Cap. 3"], ["mun-3", "Cap. 4"], ["mun-4", "Cap. 5–7"], ["mun-5", "Cap. 8"], ["mun-6", "Cap. 9–10"], ["mun-7", "Cap. 11"], ["mun-8", "Cap. 12"], ["mun-9", "Cap. 13–14"]].map(function (x) { return '<button data-mc="' + x[0] + '">' + x[1] + "</button>"; }).join("") + '</div><button class="ghost" id="goMun">Lecțiile Munteanu</button></section>' +
      '<section class="card"><h2>📙 Rădulescu – „Rețele de telecomunicații”</h2><p class="muted">Întrebări originale pe temele manualului: PCM și E1, QAM/ADSL, PSTN, centrale, ISDN, SS7, GSM, X.25, Frame Relay, ATM, PDH/SDH, rețele de acces.</p><div class="seg wrap" id="radCh">' + [["", "Toate"], ["rad-1", "PCM"], ["rad-2", "QAM/ADSL"], ["rad-3", "PSTN"], ["rad-4", "Centrale"], ["rad-5", "ISDN"], ["rad-6", "SS7/IN"], ["rad-7", "GSM"], ["rad-8", "X.25/FR/ATM"], ["rad-9", "PDH/SDH"], ["rad-10", "Acces/VoIP"]].map(function (x) { return '<button data-rc="' + x[0] + '">' + x[1] + "</button>"; }).join("") + '</div><button class="ghost" id="goRad">Lecțiile Rădulescu</button></section>' +
      '<section class="card"><h2>📒 Norton & Kearns – „Rețele de calculatoare”</h2><p class="muted">Întrebări originale pe capitolele manualului. Unde cartea are cifre tipărite greșit, explicația îți dă valoarea corectă (⚠).</p><div class="seg wrap" id="norCh">' + [["", "Toate"], ["nor-1", "OSI"], ["nor-2", "Cabluri/cadre"], ["nor-3", "IP"], ["nor-4", "Ethernet"], ["nor-5", "TR/FDDI/ATM"], ["nor-6", "WAN"], ["nor-7", "Modemuri"], ["nor-8", "RAID/UPS/backup"], ["nor-9", "Directoare/depanare"]].map(function (x) { return '<button data-nc="' + x[0] + '">' + x[1] + "</button>"; }).join("") + '</div><button class="ghost" id="goNor">Lecțiile Norton</button></section>' +
      '<section class="card"><h2>🎧 VoIP Cisco – „Voice over IP Fundamentals”</h2><p class="muted">Întrebări originale: PSTN și semnalizare, PCM/G.711 și codecuri, pachete și bandă, jitter/întârziere/QoS, SIP/H.323/MGCP, PBX și telefoane IP.</p><div class="seg wrap" id="voipCh">' + [["", "Toate"], ["voip-1", "PSTN"], ["voip-2", "Codecuri/RTP"], ["voip-3", "Calitate/QoS"], ["voip-4", "SIP/H.323"], ["voip-5", "PBX/telefoane IP"]].map(function (x) { return '<button data-vc="' + x[0] + '">' + x[1] + "</button>"; }).join("") + '</div><button class="ghost" id="goVoip">Lecțiile VoIP</button></section>' +
      '<section class="card"><h2>📻 Antene și radio – Colonati & Graham</h2><p class="muted">Întrebări originale din „Radiocomunicații digitale” (Colonati) și „Mobile Radio Network Design” (Graham et al.): modulații, moduri digitale, propagare, fading, buget de legătură, Erlang, interferențe, drive-test.</p><div class="seg wrap" id="radioCh">' + [["", "Toate"], ["ant-15", "Modulație"], ["ant-16", "CW/RTTY/ARQ"], ["ant-17", "Packet/PSK31/HF"], ["ant-18", "ISM/Wi-Fi"], ["ant-19", "Link/dBm"], ["ant-20", "PMR/TETRA"], ["ant-21", "Propagare"], ["ant-22", "Fading/buget"], ["ant-23", "Erlang"], ["ant-24", "Backhaul/C/I"], ["ant-25", "IMD/drive-test"]].map(function (x) { return '<button data-ac="' + x[0] + '">' + x[1] + "</button>"; }).join("") + '</div></section>';
    h += '<section class="card"><h2>🛠️ Proba practică</h2><p class="muted">Scenarii ca în sala de examen: mufare RJ45 și tester, multimetru, configurare Cisco, IP în Windows, fibră, PC. Exersează interactiv.</p><button class="big sec" id="goGhid">🧒 Practic pas cu pas – de la zero (Cisco)</button><button class="ghost" id="goCli">' + ICA.term + ' Terminal Cisco simulat</button><div class="row2"><button class="ghost" id="goRj">' + ICA.plug + ' Ordinea firelor RJ45</button><button class="ghost" id="goMm">' + ICA.meter + ' Multimetru: selector și borne</button></div><div class="row2"><button class="ghost" id="goPpL">Lecțiile probei practice</button><button class="ghost" id="goPpQ">20 de întrebări-scenariu</button></div><div class="row2"><button class="ghost" id="goPpS">' + ICA.list + ' Fișa „pas cu pas” (printabilă)</button><button class="ghost" id="goAn">' + ICA.film + ' Animații pas cu pas</button></div></section>';
    h += '<section class="card"><h2>🧮 Antrenor de subnetting</h2><p class="muted">Exerciții generate la infinit: adresa de rețea, broadcast, host-uri, mască, CIDR – cu rezolvare pas cu pas.</p><button class="big sec" id="goT">Deschide antrenorul</button><button class="ghost" id="goTq">Grilă subnetting generată (10 întrebări)</button><button class="ghost" id="goB">' + ICON.bin + ' Antrenor binar / hexazecimal</button></section>';
    h += '<section class="card"><h2>⚙️ Setări</h2><label class="cb"><input type="checkbox" id="freeMode"' + (SET.free ? " checked" : "") + '><span>Mod liber: deblochează toate lecțiile<small>Util dacă vrei să sari direct la nivelurile avansate.</small></span></label></section>';
    app.innerHTML = h;
    function readSel() { return Array.prototype.map.call(app.querySelectorAll(".catsel input:checked"), function (x) { return x.value; }); }
    $("allC").onclick = function () { Array.prototype.forEach.call(app.querySelectorAll(".catsel input"), function (x) { x.checked = true; }); };
    $("noneC").onclick = function () { Array.prototype.forEach.call(app.querySelectorAll(".catsel input"), function (x) { x.checked = false; }); };
    Array.prototype.forEach.call(app.querySelectorAll("#nSeg button"), function (b) { b.onclick = function () { SET.n = +b.getAttribute("data-n"); saveSet(); Array.prototype.forEach.call(app.querySelectorAll("#nSeg button"), function (x) { x.classList.toggle("on", x === b); }); }; });
    $("goP").onclick = function () {
      var s = readSel(); if (!s.length) return toast("Alege cel puțin un capitol.");
      SET.cats = s; saveSet();
      runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return s.indexOf(q.c) >= 0; }), SET.n), hearts: 0, requeue: false, xpEach: 5, title: "Exersare" });
    };
    $("goE").onclick = function () { go("exam"); };
    if ($("goM")) $("goM").onclick = function () { runQuiz({ mode: "practice", items: shuffle(markedIds()).slice(0, 30).map(function (id) { return BYID[id]; }), hearts: 0, requeue: false, xpEach: 5, title: "Marcate" }); };
    if ($("listM")) $("listM").onclick = function () { go("marks"); };
    $("goT").onclick = function () { go("trainer"); };
    $("goB").onclick = function () { go("bin"); };
    $("goExL").onclick = function () { go("path", "ex"); };
    if ($("goSimTop")) $("goSimTop").onclick = function () { go("sim"); };
    if ($("goApt")) $("goApt").onclick = function () { go("apt"); };
    $("goExQ").onclick = function () { runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return q.c === "ex"; }), 18), hearts: 0, requeue: false, xpEach: 5, title: "Examen real" }); };
    wirePin();
    $("goCli").onclick = function () { go("cli"); };
    $("goGhid").onclick = function () { go("ghid"); };
    $("goRj").onclick = function () { go("rj"); };
    $("goMm").onclick = function () { go("mm"); };
    $("goPpL").onclick = function () { go("path", "pp"); };
    $("goPpS").onclick = function () { go("ppsheet"); };
    $("goAn").onclick = function () { go("anims"); };
    $("goPpQ").onclick = function () { runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return q.c === "pp"; }), 20), hearts: 0, requeue: false, xpEach: 5, title: "Proba practică" }); };
    $("goCap").onclick = function () { go("path", "cap"); };
    $("goTan").onclick = function () { go("path", "tan"); };
    $("goMun").onclick = function () { go("path", "mun"); };
    $("goRad").onclick = function () { go("path", "rad"); };
    $("goNor").onclick = function () { go("path", "nor"); };
    $("goVoip").onclick = function () { go("path", "voip"); };
    Array.prototype.forEach.call(document.querySelectorAll("#radioCh [data-ac]"), function (b) { b.onclick = function () {
      var id = b.getAttribute("data-ac"), le = id && LBY[id];
      var pool = QS.filter(function (q) { return q.c === "ant" && (le ? le.re.test(q.e) : /\((Colonati|Graham) /.test(q.e)); });
      runQuiz({ mode: "practice", items: pickQuestions(pool, Math.min(20, pool.length)), hearts: 0, requeue: false, xpEach: 5, title: "Radio" + (le ? " – " + b.textContent : " – Colonati & Graham") }); }; });
    Array.prototype.forEach.call(document.querySelectorAll("#voipCh [data-vc]"), function (b) { b.onclick = function () {
      var id = b.getAttribute("data-vc"), le = id && LBY[id];
      var pool = QS.filter(function (q) { return q.c === "voip" && (!le || le.re.test(q.e)); });
      runQuiz({ mode: "practice", items: pickQuestions(pool, Math.min(20, pool.length)), hearts: 0, requeue: false, xpEach: 5, title: "VoIP Cisco" + (le ? " – " + b.textContent : "") }); }; });
    Array.prototype.forEach.call(document.querySelectorAll("#norCh [data-nc]"), function (b) { b.onclick = function () {
      var id = b.getAttribute("data-nc"), le = id && LBY[id];
      var pool = QS.filter(function (q) { return q.c === "nor" && (!le || le.re.test(q.e)); });
      runQuiz({ mode: "practice", items: pickQuestions(pool, Math.min(20, pool.length)), hearts: 0, requeue: false, xpEach: 5, title: "Norton" + (le ? " – " + b.textContent : "") }); }; });
    Array.prototype.forEach.call(document.querySelectorAll("#radCh [data-rc]"), function (b) { b.onclick = function () {
      var id = b.getAttribute("data-rc"), le = id && LBY[id];
      var pool = QS.filter(function (q) { return q.c === "rad" && (!le || le.re.test(q.e)); });
      runQuiz({ mode: "practice", items: pickQuestions(pool, Math.min(20, pool.length)), hearts: 0, requeue: false, xpEach: 5, title: "Rădulescu" + (le ? " – " + b.textContent : "") }); }; });
    Array.prototype.forEach.call(document.querySelectorAll("#munCh [data-mc]"), function (b) { b.onclick = function () {
      var id = b.getAttribute("data-mc"), le = id && LBY[id];
      var pool = QS.filter(function (q) { return q.c === "mun" && (!le || le.re.test(q.e)); });
      runQuiz({ mode: "practice", items: pickQuestions(pool, 20), hearts: 0, requeue: false, xpEach: 5, title: "Munteanu" + (le ? " " + b.textContent : "") }); }; });
    Array.prototype.forEach.call(document.querySelectorAll("#tanCh [data-tc]"), function (b) { b.onclick = function () {
      var ch = b.getAttribute("data-tc"), re = new RegExp("Tanenbaum cap\\. " + (ch || "\\d"));
      var pool = QS.filter(function (q) { return q.c === "tan" && re.test(q.e); });
      runQuiz({ mode: "practice", items: pickQuestions(pool, 20), hearts: 0, requeue: false, xpEach: 5, title: "Tanenbaum" + (ch ? " cap. " + ch : "") }); }; });
    $("goCapQ").onclick = function () { runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return q.c === "cap"; }), 20), hearts: 0, requeue: false, xpEach: 5, title: "Capcane la examen" }); };
    $("goPl").onclick = function () { startPlacement(); };
    $("goTq").onclick = function () { var it = []; for (var i = 0; i < 10; i++) it.push(SUB.question(SET.diff || 2)); runQuiz({ mode: "practice", items: it, hearts: 0, requeue: false, xpEach: 5, title: "Subnetting" }); };
    $("freeMode").onchange = function () { SET.free = this.checked; saveSet(); toast(SET.free ? "Toate lecțiile sunt deblocate." : "Deblocare progresivă activată."); };
  }
  function vExamSetup() {
    view = "practice"; navbar(true);
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>📝 Simulare examen</h2><p class="muted">Întrebările se extrag aleatoriu doar din capitolele de pe tematica oficială (fără manualele suplimentare, antene, teste IQ și fără întrebările ⭐ Bonus).</p><h3>Număr de întrebări</h3><div class="seg" id="enSeg">' +
      [20, 30, 50, 100].map(function (n) { return '<button data-n="' + n + '" class="' + (SET.en === n ? "on" : "") + '">' + n + "</button>"; }).join("") +
      '</div><h3>Timp</h3><div class="seg" id="etSeg"><button data-t="1" class="' + (SET.et ? "on" : "") + '">1 min / întrebare</button><button data-t="0" class="' + (!SET.et ? "on" : "") + '">Fără limită</button></div><button class="big" id="goEx">Începe simularea</button></section>';
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("practice"); };
    Array.prototype.forEach.call(app.querySelectorAll("#enSeg button"), function (b) { b.onclick = function () { SET.en = +b.getAttribute("data-n"); saveSet(); vExamSetup(); }; });
    Array.prototype.forEach.call(app.querySelectorAll("#etSeg button"), function (b) { b.onclick = function () { SET.et = +b.getAttribute("data-t"); saveSet(); vExamSetup(); }; });
    $("goEx").onclick = function () { var SYL = ["ex", "baz", "pp", "fo", "cab", "pc", "win", "net", "trk", "sub", "tel", "mas", "el", "cap"]; runQuiz({ mode: "exam", items: shuffle(QS.filter(function (q) { return SYL.indexOf(q.c) >= 0 && q.a && q.a.length === 4 && !isBonus(q); })).slice(0, SET.en), minutes: SET.et ? SET.en : 0, title: "Simulare" }); };
  }
  function finishExam(timeout) {
    stopTimer();
    var o = R, corr = 0, byCat = {};
    o.items.forEach(function (it) { var ok = it.pick === 0; if (ok) corr++; record(it.q, ok); var b = byCat[it.q.c] || (byCat[it.q.c] = [0, 0]); b[1]++; if (ok) b[0]++; });
    var gain = corr * 3; addXP(gain);
    var secs = Math.round((Date.now() - o.start) / 1000);
    if (o.place) P.place = { t: Date.now(), r: byCat }; else { var ex0 = { t: Date.now(), c: corr, n: o.items.length, d: secs }; if (o.sim) { ex0.k = "sim"; ex0.s = o.sim; ex0.g = grade(corr, o.items.length); } P.exams.push(ex0); if (P.exams.length > 100) P.exams = P.exams.slice(-100); }
    var p = pct(corr, o.items.length);
    if (o.planDay) P.plan.tests[o.planDay] = Math.max(P.plan.tests[o.planDay] || 0, p, 1);
    checkPlan(); saveP(); SND.done();
    R = null; hideSheet(); header(); navbar(false); document.body.classList.add("inquiz");
    if (o.place) return placementResult(o, byCat, corr);
    if (o.sim) return simResult(o, corr, secs, timeout);
    var h = '<div class="result card pop"><div class="big-emoji">' + (p >= 70 ? "🎖️" : "📚") + "</div><h1>" + (timeout ? "Timpul a expirat!" : "Simulare încheiată") + '</h1><div class="score ' + (p >= 70 ? "ok" : "bad") + '">' + corr + " / " + o.items.length + " · " + p + "%</div>" +
      '<div class="rgrid"><div><b>+' + gain + '</b><span>XP</span></div><div><b>' + fmtTime(secs) + "</b><span>timp</span></div></div><h3>Pe capitole</h3>";
    Object.keys(byCat).forEach(function (c) { var b = byCat[c]; h += '<div class="crow"><span>' + CATBY[c].ic + " " + esc(CATBY[c].short) + "</span><b>" + b[0] + "/" + b[1] + '</b><span class="bar sm"><i style="width:' + pct(b[0], b[1]) + '%"></i></span></div>'; });
    h += '<button class="big" id="doneBtn">Gata</button></div><h2 class="sec">Răspunsuri greșite / nerăspunse</h2>';
    var wrong = o.items.filter(function (it) { return it.pick !== 0; });
    if (!wrong.length) h += '<div class="card">Perfect – niciun răspuns greșit! 🎉</div>';
    wrong.forEach(function (it, j) { h += '<div class="card rev"><div class="qmeta">' + CATBY[it.q.c].ic + " " + esc(CATBY[it.q.c].short) + markBtn(it.q.id) + '</div><div class="qq">' + (j + 1) + ". " + esc(it.q.q) + "</div>" + (it.pick != null ? '<div class="a bad">❌ ' + esc(it.q.a[it.pick]) + "</div>" : '<div class="a bad">— fără răspuns</div>') + '<div class="a ok">✅ ' + esc(it.q.a[0]) + '</div><div class="e">💡 ' + esc(it.q.e) + "</div></div>"; });
    app.innerHTML = h; wireMarks();
    $("doneBtn").onclick = function () { go(o.planDay ? "learn" : "practice"); };
    toTop();
  }


  /* ---------------- Test de nivel (plasare) ---------------- */
  var PLACE_CH = ["net", "sub", "el", "mas", "ant", "fo", "cab", "pc", "win", "sts"];
  function startPlacement() {
    var items = [];
    PLACE_CH.forEach(function (c) {
      var arr = CHLES[c].filter(function (l) { return !l.review; });
      [arr.filter(function (l) { return l.lvl === 1; }), arr.filter(function (l) { return l.lvl >= 2; })].forEach(function (ls) {
        var pool = []; ls.forEach(function (l) { (LPOOL[l.id] || []).forEach(function (q) { if (!isBonus(q) && pool.indexOf(q) < 0 && items.indexOf(q) < 0) pool.push(q); }); });
        if (pool.length) items.push(pool[Math.floor(Math.random() * pool.length)]);
      });
    });
    runQuiz({ mode: "exam", items: items, minutes: 0, title: "Test de nivel", place: true });
  }
  function placementResult(o, byCat, corr) {
    var lvl = function (b) { return !b ? 0 : b[0] === b[1] ? 2 : b[0] > 0 ? 1 : 0; };
    var lab = ["Începe de la zero", "Ai câteva baze – parcurge lecțiile atent", "Stăpânești bazele – poți merge mai repede"];
    var cls = ["bad", "mid", "ok"];
    var start = null;
    PLACE_CH.forEach(function (c) { if (!start && lvl(byCat[c]) < 2) start = c; });
    var bp = chapterProgress("baz");
    if (start && ["net", "sub", "el", "mas", "cab", "fo"].indexOf(start) >= 0 && bp.d < bp.n) start = "baz";
    var h = '<div class="result card pop"><div class="big-emoji">🧭</div><h1>Rezultatul testului de nivel</h1><div class="score">' + corr + " / " + o.items.length + "</div>" +
      '<p class="muted">Câte 2 întrebări pe capitol (una ușoară, una mai grea). Nu e notă – doar îți arată de unde să începi.</p>';
    PLACE_CH.forEach(function (c) { var b = byCat[c] || [0, 0], v = lvl(b); h += '<div class="crow plc ' + cls[v] + '"><span>' + CATBY[c].ic + " " + esc(CATBY[c].short) + "<small>" + lab[v] + "</small></span><b>" + b[0] + "/" + b[1] + "</b></div>"; });
    h += start ? '<div class="exam"><b>Recomandare:</b> începe cu <b>' + esc(CATBY[start].short) + "</b>" + (start === "baz" ? " – 6 lecții scurte cu exact noțiunile care se încurcă cel mai des (switch și MAC, IPv4, ce cablu alegi, culorile fibrei, legea lui Ohm, serie/paralel și aparatele de măsură)." : ["net", "sub", "el", "mas", "ant"].indexOf(start) >= 0 ? " (e și unul dintre punctele tale slabe, pe care planul de 14 zile le pune primele)." : ".") + "</div>" : '<div class="exam">Foarte bine! Urmează planul de 14 zile și pune accent pe simulări și pe „Capcane la examen”.</div>';
    h += (start ? '<button class="big" id="plStart">Începe cu ' + esc(CATBY[start].short) + " ›</button>" : "") + '<button class="' + (start ? "ghost" : "big") + '" id="plPlan">Vezi planul de 11 zile</button></div>';
    app.innerHTML = h;
    if ($("plStart")) $("plStart").onclick = function () { go("path", start); };
    $("plPlan").onclick = function () { go("plan"); };
    toTop();
  }

  /* ---------------- Antrenor subnetting ---------------- */
  function vTrainer() {
    view = "practice"; navbar(true);
    var x = SUB.make(SET.diff || 2);
    var F = [["m", "Masca de subrețea", x.s.m], ["net", "Adresa de rețea", x.s.net], ["first", "Primul host", x.s.first], ["last", "Ultimul host", x.s.last], ["bc", "Broadcast", x.s.bc], ["hosts", "Nr. host-uri utilizabile", String(x.hosts)]];
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>🧮 Antrenor de subnetting</h2><div class="seg" id="dSeg">' + [[1, "Ușor (/24–/30)"], [2, "Mediu (/16–/30)"], [3, "Greu (/8–/30)"]].map(function (d) { return '<button data-d="' + d[0] + '" class="' + ((SET.diff || 2) === d[0] ? "on" : "") + '">' + d[1] + "</button>"; }).join("") + "</div>" +
      '<div class="probl">Adresa: <b id="probIp">' + x.s.ip + "/" + x.p + '</b></div><div class="tform">' +
      F.map(function (f) { return '<label><span>' + f[1] + '</span><input id="f_' + f[0] + '" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + (f[0] === "hosts" ? "ex. 62" : "ex. 192.168.1.0") + '"><em id="r_' + f[0] + '"></em></label>'; }).join("") +
      '</div><button class="big" id="chk">Verifică</button><button class="ghost" id="newP">Altă problemă ↻</button><div id="expl"></div><p class="muted small">Scor antrenor: ' + P.sub[0] + " corecte · " + P.sub[1] + " greșite</p></section>";
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("practice"); };
    Array.prototype.forEach.call(app.querySelectorAll("#dSeg button"), function (b) { b.onclick = function () { SET.diff = +b.getAttribute("data-d"); saveSet(); vTrainer(); }; });
    $("newP").onclick = function () { vTrainer(); toTop(); };
    $("chk").onclick = function () {
      var all = true, gotAny = false;
      F.forEach(function (f) {
        var v = $("f_" + f[0]).value.trim().replace(/\s/g, "").replace(/^\//, ""), ok = v === f[2];
        if (f[0] === "hosts") ok = v.replace(/[.,]/g, "") === f[2];
        if (v) gotAny = true; if (!ok) all = false;
        var r = $("r_" + f[0]); r.className = ok ? "ok" : "bad"; r.textContent = ok ? "✓ corect" : "✗ corect: " + f[2];
        $("f_" + f[0]).classList.toggle("okf", ok); $("f_" + f[0]).classList.toggle("badf", !ok);
      });
      if (!gotAny) return toast("Completează cel puțin un câmp.");
      if (this.disabled) return; this.disabled = true;
      P.sub[all ? 0 : 1]++; if (all) { addXP(15); SND.ok(); } else SND.bad(); saveP();
      $("expl").innerHTML = '<div class="fact"><b>' + (all ? "✅ Totul corect! +15 XP" : "Rezolvare pas cu pas") + "</b><br>" + esc(SUB.explain(x)) + "</div>";
    };
  }

  /* ================= PROBA PRACTICĂ: player animații, simulator CLI, exerciții interactive ================= */
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ICA = {
    play: ic('<path d="M7 4l13 8-13 8z" fill="currentColor"/>'),
    pause: ic('<path d="M7 4v16M17 4v16" stroke-width="3.2"/>'),
    next: ic('<path d="M5 4l10 8-10 8z" fill="currentColor"/><path d="M19 4v16" stroke-width="2.6"/>'),
    prev: ic('<path d="M19 4L9 12l10 8z" fill="currentColor"/><path d="M5 4v16" stroke-width="2.6"/>'),
    again: ic('<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>'),
    term: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>'),
    plug: ic('<path d="M7 3h10v7a5 5 0 0 1-10 0z"/><path d="M10 3v3M14 3v3M12 15v6"/>'),
    meter: ic('<rect x="5" y="2" width="14" height="20" rx="3"/><rect x="8" y="5" width="8" height="4" rx="1"/><circle cx="12" cy="15" r="3"/>'),
    film: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>'),
    list: ic('<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>'),
    photo: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>')
  };
  function wireAnims(root) {
    Array.prototype.forEach.call((root || app).querySelectorAll(".anim[data-anim]"), function (el) {
      if (el.getAttribute("data-w")) return; el.setAttribute("data-w", "1");
      var A = window.ANIMS && ANIMS[el.getAttribute("data-anim")]; if (!A) return;
      var i = 0, playing = false, tmr = null, t0 = 0, left = 0, svg = null;
      el.innerHTML = '<div class="ahd"><b>' + ICA.film + " " + esc(A.t) + '</b><span class="astep"></span></div><div class="astage"></div><div class="acap" aria-live="polite"></div><div class="actl"><button class="abtn" data-a="prev" aria-label="Pasul anterior">' + ICA.prev + '</button><button class="abtn main" data-a="play" aria-label="Pornește / pauză">' + ICA.play + '</button><button class="abtn" data-a="next" aria-label="Pasul următor">' + ICA.next + '</button><button class="abtn" data-a="again" aria-label="De la început">' + ICA.again + "</button></div>";
      var stage = el.querySelector(".astage"), cap = el.querySelector(".acap"), stp = el.querySelector(".astep"), pb = el.querySelector('[data-a="play"]');
      function alive() { return document.body.contains(el); }
      function paintBtn() { pb.innerHTML = playing ? ICA.pause : (el.getAttribute("data-done") ? ICA.again : ICA.play); }
      function render(still) {
        var s = A.steps[i];
        stage.innerHTML = '<svg viewBox="' + A.vb + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12" role="img" aria-label="' + esc(A.t) + '">' + s.s + "</svg>";
        svg = stage.firstChild; cap.textContent = s.c; stp.textContent = (i + 1) + "/" + A.steps.length;
        if (still && svg.pauseAnimations) { svg.pauseAnimations(); try { svg.setCurrentTime(s.d / 1000); } catch (e) {} }
      }
      function schedule(ms) { clearTimeout(tmr); t0 = Date.now(); left = ms; tmr = setTimeout(function () { if (!alive()) return stop(); if (i < A.steps.length - 1) { i++; render(false); schedule(A.steps[i].d + 900); } else { el.setAttribute("data-done", "1"); stop(); } }, ms); }
      function play() { if (playing) return; playing = true; if (svg && svg.unpauseAnimations && left > 0 && el.getAttribute("data-p")) { svg.unpauseAnimations(); el.removeAttribute("data-p"); schedule(left); } else { if (el.getAttribute("data-done")) { i = 0; el.removeAttribute("data-done"); } render(false); schedule(A.steps[i].d + 900); } paintBtn(); }
      function stop() { playing = false; clearTimeout(tmr); paintBtn(); }
      function pause() { if (!playing) return; left = Math.max(0, left - (Date.now() - t0)); if (svg && svg.pauseAnimations) svg.pauseAnimations(); el.setAttribute("data-p", "1"); stop(); }
      pb.onclick = function () { if (playing) pause(); else play(); };
      el.querySelector('[data-a="next"]').onclick = function () { stop(); el.removeAttribute("data-p"); el.removeAttribute("data-done"); left = 0; if (i < A.steps.length - 1) i++; render(RM); paintBtn(); };
      el.querySelector('[data-a="prev"]').onclick = function () { stop(); el.removeAttribute("data-p"); el.removeAttribute("data-done"); left = 0; if (i > 0) i--; render(RM); paintBtn(); };
      el.querySelector('[data-a="again"]').onclick = function () { stop(); el.removeAttribute("data-p"); el.removeAttribute("data-done"); left = 0; i = 0; if (RM) render(true); else play(); paintBtn(); };
      render(true); paintBtn();
      if (!RM && window.IntersectionObserver) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); if (alive() && !playing && i === 0 && !el.getAttribute("data-p")) play(); } }, { threshold: 0.6 }); io.observe(el); }
    });
  }
  function wireGo(root) { Array.prototype.forEach.call((root || app).querySelectorAll("[data-go]"), function (b) { b.onclick = function () { go(b.getAttribute("data-go")); }; }); }
  /* ---------- simulator Cisco IOS ---------- */
  var CLI_TASKS = [
    { id: "base", dev: "switch", t: "Configurare de bază switch", d: "Nume SW1, parolă privilegiată criptată (enable secret), parolă pe consolă cu login, criptarea parolelor, banner MOTD, salvare.", g: [
      ["hostname SW1", function (s) { return s.host === "SW1"; }, "configure terminal → hostname SW1"],
      ["enable secret setată", function (s) { return !!s.secret; }, "enable secret <parolă>"],
      ["consolă: parolă + login", function (s) { return s.line.con.pw && s.line.con.login; }, "line console 0 → password cisco → login"],
      ["service password-encryption", function (s) { return s.enc; }, "service password-encryption"],
      ["banner motd", function (s) { return !!s.banner; }, "banner motd #Acces autorizat#"],
      ["configurația salvată", function (s) { return s.saved && s.saved.host === "SW1" && cfgEq(s); }, "end → copy running-config startup-config"]] },
    { id: "rtr", dev: "router", t: "Router: interfața G0/0 și IP", d: "Nume R1, G0/0 cu 192.168.1.1/24 activă (up/up), verificare cu show ip interface brief, salvare.", g: [
      ["hostname R1", function (s) { return s.host === "R1"; }, "configure terminal → hostname R1"],
      ["G0/0 = 192.168.1.1 255.255.255.0", function (s) { var f = s.ifs["GigabitEthernet0/0"]; return f.ip === "192.168.1.1" && f.mask === "255.255.255.0"; }, "interface g0/0 → ip address 192.168.1.1 255.255.255.0"],
      ["G0/0 pornită (no shutdown)", function (s) { return !s.ifs["GigabitEthernet0/0"].shut; }, "(în interfață) no shutdown"],
      ["verificat cu show ip interface brief", function (s) { return s.did.sipib; }, "end → show ip interface brief"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "vlan", dev: "switch", t: "VLAN-uri pe switch", d: "VLAN 10 ADMIN, VLAN 20 TEHNIC; Fa0/1 acces în VLAN 10, Fa0/2 acces în VLAN 20; verificare cu show vlan brief; salvare.", g: [
      ["VLAN 10 cu numele ADMIN", function (s) { return s.vlans[10] === "ADMIN"; }, "vlan 10 → name ADMIN"],
      ["VLAN 20 cu numele TEHNIC", function (s) { return s.vlans[20] === "TEHNIC"; }, "vlan 20 → name TEHNIC"],
      ["Fa0/1: mode access, VLAN 10", function (s) { var f = s.ifs["FastEthernet0/1"]; return f.mode === "access" && f.vlan === 10; }, "interface fa0/1 → switchport mode access → switchport access vlan 10"],
      ["Fa0/2: mode access, VLAN 20", function (s) { var f = s.ifs["FastEthernet0/2"]; return f.mode === "access" && f.vlan === 20; }, "interface fa0/2 → switchport mode access → switchport access vlan 20"],
      ["verificat cu show vlan brief", function (s) { return s.did.svb; }, "end → show vlan brief"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "mgmt", dev: "switch", t: "Switch: IP de management și acces la distanță", d: "Interface VLAN 1 cu 192.168.1.2/24 activă, default gateway 192.168.1.1, enable secret, vty 0 15 cu parolă și login, salvare.", g: [
      ["Vlan1 = 192.168.1.2 255.255.255.0", function (s) { var f = s.ifs.Vlan1; return f.ip === "192.168.1.2" && f.mask === "255.255.255.0"; }, "interface vlan 1 → ip address 192.168.1.2 255.255.255.0"],
      ["Vlan1 pornită", function (s) { return !s.ifs.Vlan1.shut; }, "(în interface vlan 1) no shutdown"],
      ["ip default-gateway 192.168.1.1", function (s) { return s.gw === "192.168.1.1"; }, "(config) ip default-gateway 192.168.1.1"],
      ["enable secret setată", function (s) { return !!s.secret; }, "enable secret <parolă>"],
      ["vty 0 15: parolă + login", function (s) { return s.line.vty.pw && s.line.vty.login; }, "line vty 0 15 → password cisco → login"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "end → copy running-config startup-config"]] },
    { id: "ssh", dev: "switch", t: "SSH pe switch cu VLAN", d: "Ca la examen: SW1, VLAN 99 MGMT, Fa0/1 acces în VLAN 99, interface vlan 99 = 192.168.99.2/24 activă, gateway 192.168.99.1, domeniu sts.ro, chei RSA de minim 1024 biți, utilizator admin cu secret, SSH versiunea 2, vty 0 15 doar SSH cu login local, verificare show ip ssh, salvare.", g: [
      ["hostname SW1", function (s) { return s.host === "SW1"; }, "configure terminal → hostname SW1"],
      ["VLAN 99 cu numele MGMT", function (s) { return s.vlans[99] === "MGMT"; }, "vlan 99 → name MGMT"],
      ["Fa0/1: mode access, VLAN 99", function (s) { var f = s.ifs["FastEthernet0/1"]; return f.mode === "access" && f.vlan === 99; }, "interface fa0/1 → switchport mode access → switchport access vlan 99"],
      ["Vlan99 = 192.168.99.2 255.255.255.0, pornită", function (s) { var f = s.ifs.Vlan99; return f && f.ip === "192.168.99.2" && f.mask === "255.255.255.0" && !f.shut; }, "interface vlan 99 → ip address 192.168.99.2 255.255.255.0 → no shutdown"],
      ["ip default-gateway 192.168.99.1", function (s) { return s.gw === "192.168.99.1"; }, "(config) ip default-gateway 192.168.99.1"],
      ["ip domain-name sts.ro", function (s) { return s.dom === "sts.ro"; }, "(config) ip domain-name sts.ro"],
      ["chei RSA ≥ 1024 biți", function (s) { return s.rsa >= 1024; }, "(config) crypto key generate rsa → la întrebare: 1024 (sau direct: crypto key generate rsa modulus 1024). Cere hostname și domain-name înainte!"],
      ["username admin secret …", function (s) { return s.users.admin && s.users.admin.t === "secret"; }, "(config) username admin secret Parola123"],
      ["ip ssh version 2", function (s) { return s.sshv === 2; }, "(config) ip ssh version 2"],
      ["vty 0 15: login local + transport input ssh", function (s) { return s.line.vty.local && s.line.vty.tin === "ssh"; }, "line vty 0 15 → login local → transport input ssh"],
      ["verificat cu show ip ssh", function (s) { return s.did.sssh; }, "end → show ip ssh (trebuie să scrie SSH Enabled - version 2.0)"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "end → copy running-config startup-config"]] },
    { id: "rtr2", dev: "router", t: "Router: două rețele + ping", d: "R1, enable secret, G0/0 = 192.168.1.1/24 (spre PC1), G0/1 = 192.168.2.1/24 (spre PC2), ambele pornite, ping reușit către PC2 (192.168.2.10), salvare.", g: [
      ["hostname R1", function (s) { return s.host === "R1"; }, "configure terminal → hostname R1"],
      ["enable secret setată", function (s) { return !!s.secret; }, "enable secret <parolă>"],
      ["G0/0 = 192.168.1.1/24, pornită", function (s) { var f = s.ifs["GigabitEthernet0/0"]; return f.ip === "192.168.1.1" && f.mask === "255.255.255.0" && !f.shut; }, "interface g0/0 → ip address 192.168.1.1 255.255.255.0 → no shutdown"],
      ["G0/1 = 192.168.2.1/24, pornită", function (s) { var f = s.ifs["GigabitEthernet0/1"]; return f.ip === "192.168.2.1" && f.mask === "255.255.255.0" && !f.shut; }, "interface g0/1 → ip address 192.168.2.1 255.255.255.0 → no shutdown"],
      ["ping 192.168.2.10 reușit", function (s) { return s.did.ping && s.did.ping["192.168.2.10"]; }, "end → ping 192.168.2.10"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "trunk", dev: "switch", t: "VLAN-uri + trunk spre router", d: "VLAN 10 ADMIN și VLAN 20 TEHNIC; Fa0/1 acces VLAN 10, Fa0/2 acces VLAN 20; Gi0/1 (spre router) trunk; verificare show interfaces trunk; salvare.", g: [
      ["VLAN 10 ADMIN și VLAN 20 TEHNIC", function (s) { return s.vlans[10] === "ADMIN" && s.vlans[20] === "TEHNIC"; }, "vlan 10 → name ADMIN → vlan 20 → name TEHNIC"],
      ["Fa0/1 acces VLAN 10", function (s) { var f = s.ifs["FastEthernet0/1"]; return f.mode === "access" && f.vlan === 10; }, "interface fa0/1 → switchport mode access → switchport access vlan 10"],
      ["Fa0/2 acces VLAN 20", function (s) { var f = s.ifs["FastEthernet0/2"]; return f.mode === "access" && f.vlan === 20; }, "interface fa0/2 → switchport mode access → switchport access vlan 20"],
      ["Gi0/1 în mod trunk", function (s) { return s.ifs["GigabitEthernet0/1"].mode === "trunk"; }, "interface g0/1 → switchport mode trunk"],
      ["verificat cu show interfaces trunk", function (s) { return s.did.strunk; }, "end → show interfaces trunk"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "trunk2", dev: "switch", t: "Trunk între două switch-uri (SW1)", d: "SW1: VLAN 10 ADMIN, 20 TEHNIC, 99 MGMT; Gi0/1 spre SW2 este trunk, VLAN-uri permise 10,20,99, VLAN nativ 99; verificare cu show interfaces trunk; salvare. (Catalyst 2960: nu există „encapsulation”.)", g: [
      ["hostname SW1", function (s) { return s.host === "SW1"; }, "configure terminal → hostname SW1"],
      ["VLAN 10 ADMIN, 20 TEHNIC, 99 MGMT", function (s) { return s.vlans[10] === "ADMIN" && s.vlans[20] === "TEHNIC" && s.vlans[99] === "MGMT"; }, "vlan 10 → name ADMIN, vlan 20 → name TEHNIC, vlan 99 → name MGMT"],
      ["Gi0/1 în mod trunk", function (s) { return s.ifs["GigabitEthernet0/1"].mode === "trunk"; }, "interface g0/1 → switchport mode trunk"],
      ["allowed vlan 10,20,99", function (s) { return s.ifs["GigabitEthernet0/1"].allow === "10,20,99"; }, "switchport trunk allowed vlan 10,20,99"],
      ["VLAN nativ 99", function (s) { return s.ifs["GigabitEthernet0/1"].nat === 99; }, "switchport trunk native vlan 99"],
      ["verificat cu show interfaces trunk", function (s) { return s.did.strunk; }, "end → show interfaces trunk"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "trunk3", dev: "switch", enc3: true, t: "Trunk pe Catalyst 3560 (cu encapsulation dot1q)", d: "Switch de tip 3560 (suportă ISL și 802.1Q): VLAN 10 ADMIN și 20 TEHNIC; Gi0/1: mai întâi encapsulation dot1q, apoi mode trunk; allowed vlan 10,20; verificare cu show interfaces trunk; salvare. Încearcă întâi mode trunk fără encapsulation ca să vezi eroarea!", g: [
      ["VLAN 10 ADMIN și 20 TEHNIC", function (s) { return s.vlans[10] === "ADMIN" && s.vlans[20] === "TEHNIC"; }, "vlan 10 → name ADMIN, vlan 20 → name TEHNIC"],
      ["Gi0/1: encapsulation dot1q", function (s) { return s.ifs["GigabitEthernet0/1"].encap === "dot1q"; }, "interface g0/1 → switchport trunk encapsulation dot1q"],
      ["Gi0/1 în mod trunk", function (s) { return s.ifs["GigabitEthernet0/1"].mode === "trunk"; }, "switchport mode trunk (după encapsulation!)"],
      ["allowed vlan 10,20", function (s) { return s.ifs["GigabitEthernet0/1"].allow === "10,20"; }, "switchport trunk allowed vlan 10,20"],
      ["verificat cu show interfaces trunk", function (s) { return s.did.strunk; }, "end → show interfaces trunk"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "trunkfix", dev: "switch", t: "Depanare: VLAN 30 nu trece pe trunk", init: function (s) { s.host = "SW1"; s.vlans[10] = "ADMIN"; s.vlans[20] = "TEHNIC"; s.vlans[30] = "SERVERE"; s.ifs["GigabitEthernet0/1"].mode = "trunk"; s.ifs["GigabitEthernet0/1"].allow = "10,20"; s.ifs["FastEthernet0/3"].mode = "access"; s.ifs["FastEthernet0/3"].vlan = 30; s.saved = cfgSnap(s); }, d: "Gi0/1 este trunk cu VLAN-uri permise 10,20, dar serverele din VLAN 30 (Fa0/3) nu comunică peste trunk. Adaugă VLAN 30 FĂRĂ să scoți 10 și 20 (cuvântul „add”!), verifică cu show interfaces trunk și salvează.", g: [
      ["Gi0/1 permite 10,20,30 (cu add)", function (s) { return s.ifs["GigabitEthernet0/1"].allow === "10,20,30"; }, "interface g0/1 → switchport trunk allowed vlan add 30"],
      ["Gi0/1 rămâne trunk", function (s) { return s.ifs["GigabitEthernet0/1"].mode === "trunk"; }, "nu schimba modul portului"],
      ["verificat cu show interfaces trunk", function (s) { return s.did.strunk; }, "end → show interfaces trunk"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s) && s.ifs["GigabitEthernet0/1"].allow === "10,20,30"; }, "copy running-config startup-config"]] },
    { id: "dtp", dev: "switch", t: "DTP: desirable, trunk fix și nonegotiate", d: "Gi0/1: switchport mode dynamic desirable (cere trunk). Gi0/2: mode trunk + switchport nonegotiate (fix, fără DTP). Fa0/1: access (VLAN 10 creat), verificare cu show interfaces gi0/2 switchport, salvare.", g: [
      ["Gi0/1 = dynamic desirable", function (s) { var f = s.ifs["GigabitEthernet0/1"]; return f.mode === "dynamic" && f.dyn === "desirable"; }, "interface g0/1 → switchport mode dynamic desirable"],
      ["Gi0/2 = trunk fix", function (s) { return s.ifs["GigabitEthernet0/2"].mode === "trunk"; }, "interface g0/2 → switchport mode trunk"],
      ["Gi0/2: nonegotiate", function (s) { return !!s.ifs["GigabitEthernet0/2"].nonego; }, "(în g0/2, după mode trunk) switchport nonegotiate"],
      ["Fa0/1 access în VLAN 10", function (s) { var f = s.ifs["FastEthernet0/1"]; return f.mode === "access" && f.vlan === 10; }, "interface fa0/1 → switchport mode access → switchport access vlan 10"],
      ["verificat cu show interfaces gi0/2 switchport", function (s) { return s.did.ssw; }, "end → show interfaces gi0/2 switchport"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "roas", dev: "router", t: "Router-on-a-stick (sub-interfețe)", d: "Pe R1: G0/0 pornită (fără IP), sub-interfața G0/0.10 cu encapsulation dot1Q 10 și 192.168.10.1/24, G0/0.20 cu dot1Q 20 și 192.168.20.1/24; verificare show ip interface brief; salvare.", g: [
      ["G0/0 pornită (no shutdown)", function (s) { return !s.ifs["GigabitEthernet0/0"].shut; }, "interface g0/0 → no shutdown (IP NU se pune pe interfața fizică)"],
      ["G0/0.10: dot1Q 10 + 192.168.10.1/24", function (s) { var f = s.ifs["GigabitEthernet0/0.10"]; return f && f.enc === 10 && f.ip === "192.168.10.1" && f.mask === "255.255.255.0"; }, "interface g0/0.10 → encapsulation dot1Q 10 → ip address 192.168.10.1 255.255.255.0"],
      ["G0/0.20: dot1Q 20 + 192.168.20.1/24", function (s) { var f = s.ifs["GigabitEthernet0/0.20"]; return f && f.enc === 20 && f.ip === "192.168.20.1" && f.mask === "255.255.255.0"; }, "interface g0/0.20 → encapsulation dot1Q 20 → ip address 192.168.20.1 255.255.255.0"],
      ["verificat cu show ip interface brief", function (s) { return s.did.sipib; }, "end → show ip interface brief"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "free", dev: "switch", t: "Mod liber (switch)", d: "Exersează orice comandă. Tastează ? pentru ajutor.", g: [] },
    { id: "freer", dev: "router", t: "Mod liber (router)", d: "Exersează orice comandă pe un router. Tastează ? pentru ajutor.", g: [] }
  ];
  var CFGK = ["host", "secret", "epw", "enc", "banner", "lookup", "gw", "line", "ifs", "vlans", "dom", "rsa", "users", "sshv"];
  function cliNew(dev, enc3, init) {
    var s = { dev: dev, host: dev === "router" ? "Router" : "Switch", mode: "user", ctx: null, secret: "", epw: "", enc: false, banner: "", lookup: true, gw: "", dom: "", rsa: 0, users: {}, sshv: 0, line: { con: { pw: "", login: false, local: false, tin: "" }, vty: { pw: "", login: false, local: false, tin: "" } }, ifs: {}, vlans: { 1: "default" }, did: {}, saved: null, hist: [], pend: null }; if (enc3) s.enc3 = 1;
    if (dev === "router") { ["GigabitEthernet0/0", "GigabitEthernet0/1", "Serial0/0/0"].forEach(function (n) { s.ifs[n] = { ip: "", mask: "", shut: true, desc: "" }; }); }
    else { for (var k = 1; k <= 24; k++) s.ifs["FastEthernet0/" + k] = { mode: "", vlan: 1, shut: false, desc: "" }; s.ifs["GigabitEthernet0/1"] = { mode: "", vlan: 1, shut: false, desc: "" }; s.ifs["GigabitEthernet0/2"] = { mode: "", vlan: 1, shut: false, desc: "" }; s.ifs.Vlan1 = { ip: "", mask: "", shut: true, desc: "" }; }
    if (init) { init(s); }
    return s;
  }
  function cfgSnap(s) { var o = {}; CFGK.forEach(function (k) { o[k] = s[k]; }); return JSON.parse(JSON.stringify(o)); }
  function cfgEq(s) { return JSON.stringify(cfgSnap(s)) === JSON.stringify(s.saved); }
  function enc7(p) { var h = "0822"; for (var i = 0; i < p.length; i++) h += ("0" + ((p.charCodeAt(i) ^ (0x5a + i)) & 255).toString(16).toUpperCase()).slice(-2); return h; }
  function ifName(a, b) {
    var str = (a + (b || "")).replace(/\s+/g, "").toLowerCase(), m, mm = /^([a-z-]+)([\d\/.]+)$/.exec(str);
    if (mm) { var px = mm[1], nn = mm[2]; if ("fastethernet".indexOf(px) === 0 && /^\d\/\d+$/.test(nn)) return "FastEthernet" + nn; if (px.length >= 1 && "gigabitethernet".indexOf(px) === 0 && /^\d\/\d+(\.\d{1,4})?$/.test(nn)) return "GigabitEthernet" + nn; if ("vlan".indexOf(px) === 0 && px.length >= 1 && /^\d+$/.test(nn) && px !== "v") return "Vlan" + nn; }
    if ((m = /^(f|fa|fas|fast|fastethernet|fastether)(\d\/\d+)$/.exec(str))) return "FastEthernet" + m[2];
    if ((m = /^(g|gi|gig|giga|gigabit|gigabitethernet)(\d\/\d+(\.\d{1,4})?)$/.exec(str))) return "GigabitEthernet" + m[2];
    if ((m = /^(s|se|ser|serial)(\d\/\d\/\d)$/.exec(str))) return "Serial" + m[2];
    if ((m = /^(vl|vla|vlan)(\d+)$/.exec(str))) return "Vlan" + m[2];
    return null;
  }
  function cliPrompt(s) { if (s.mode === "if" && s.ctx && /\./.test(s.ctx[0])) return s.host + "(config-subif)#"; var m = { user: ">", priv: "#", config: "(config)#", "if": "(config-if)#", "if-range": "(config-if-range)#", line: "(config-line)#", vlan: "(config-vlan)#" }; return s.host + m[s.mode]; }
  function ipOk(ip) { return /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(ip) && ip.split(".").every(function (o) { return +o <= 255; }); }
  function maskOk(m) { if (!ipOk(m)) return false; var b = m.split(".").map(function (o) { return ("0000000" + (+o).toString(2)).slice(-8); }).join(""); return /^1+0*$/.test(b); }
  var CMDS = {
    user: [["enable", "Activează modul privilegiat"], ["exit", "Închide sesiunea"], ["logout", "Închide sesiunea"], ["ping", "Trimite ecou ICMP"], ["show", "Afișează informații"], ["ssh", "Conectare SSH"], ["terminal", "Setări terminal"], ["traceroute", "Urmărește ruta"]],
    priv: [["clock", "Ceasul"], ["configure", "Intră în modul de configurare"], ["connect", "Deschide o conexiune terminal"], ["copy", "Copiază configurația"], ["enable", "Deja ești în modul privilegiat (#)"], ["disable", "Înapoi în modul utilizator"], ["erase", "Șterge un fișier"], ["exit", "Închide sesiunea"], ["ping", "Trimite ecou ICMP"], ["reload", "Repornește echipamentul"], ["show", "Afișează informații"], ["ssh", "Conectare SSH"], ["terminal", "Setări terminal"], ["traceroute", "Urmărește ruta"], ["write", "Salvează configurația"]],
    config: [["banner", "Mesaj afișat la conectare"], ["crypto", "Chei criptografice (RSA pentru SSH)"], ["do", "Rulează o comandă EXEC"], ["enable", "Parolă pentru modul privilegiat"], ["end", "Ieși în modul privilegiat"], ["exit", "Ieși un nivel"], ["hostname", "Numele echipamentului"], ["interface", "Selectează o interfață"], ["ip", "Setări IP globale"], ["line", "Configurează o linie (consolă/vty)"], ["no", "Anulează o comandă"], ["service", "Servicii (ex. password-encryption)"], ["username", "Utilizator local (pentru login local / SSH)"], ["vlan", "Creează/editează un VLAN"]],
    "if": [["description", "Descrierea interfeței"], ["do", "Rulează o comandă EXEC"], ["encapsulation", "Încapsulare (dot1Q pe sub-interfață)"], ["end", "Ieși în modul privilegiat"], ["exit", "Ieși un nivel"], ["ip", "Adresa IP a interfeței"], ["no", "Anulează o comandă"], ["shutdown", "Oprește interfața"], ["switchport", "Setări port de switch"]],
    line: [["do", "Rulează o comandă EXEC"], ["end", "Ieși în modul privilegiat"], ["exec-timeout", "Timp de deconectare"], ["exit", "Ieși un nivel"], ["logging", "Mesaje pe linie"], ["login", "Cere parola la conectare"], ["no", "Anulează o comandă"], ["password", "Parola liniei"], ["transport", "Protocoale permise: ssh / telnet"]],
    vlan: [["do", "Rulează o comandă EXEC"], ["end", "Ieși în modul privilegiat"], ["exit", "Ieși un nivel"], ["name", "Numele VLAN-ului"], ["no", "Anulează o comandă"]]
  };
  CMDS["if-range"] = CMDS["if"];
  function vParse(str) { var r = []; String(str).split(",").forEach(function (p) { if (!p || p === "none") return; var m = /^(\d+)(?:-(\d+))?$/.exec(p); if (!m) { r.push(NaN); return; } var x = +m[1], y = m[2] ? +m[2] : x; if (y < x || y - x > 5000) { r.push(NaN); return; } for (var k = x; k <= y; k++) r.push(k); }); var u = []; r.forEach(function (n) { if (u.indexOf(n) < 0 || isNaN(n)) u.push(n); }); return u.some(isNaN) ? [] : u.sort(function (p, q) { return p - q; }); }
  function vFmt(arr) { var o = [], i = 0; arr = arr.slice().sort(function (a, b) { return a - b; }); while (i < arr.length) { var j = i; while (j + 1 < arr.length && arr[j + 1] === arr[j] + 1) j++; o.push(j > i ? arr[i] + "-" + arr[j] : String(arr[i])); i = j + 1; } return o.join(","); }
  function kw(tok, list) { tok = (tok || "").toLowerCase(); if (!tok) return null; if (list.indexOf(tok) >= 0) return tok; var m = list.filter(function (x) { return x.indexOf(tok) === 0; }); return m.length === 1 ? m[0] : m.length > 1 ? "?amb" : null; }
  function pad(x, n) { x = String(x); while (x.length < n) x += " "; return x.slice(0, n); }
  function cliRun0(s, line) {
    var out = [], raw = line;
    function o(x) { out.push(x); }
    function posOf(n) { var p = 0, c = 0, re = /\S+/g, m; while ((m = re.exec(raw))) { if (c === n) return m.index; c++; p = m.index + m[0].length; } return p + 1; }
    function inv(n) { if (n >= tkn()) { o("% Incomplete command."); return; } o(new Array(cliPrompt(s).length + posOf(n) + 1).join(" ") + "^"); o("% Invalid input detected at '^' marker."); }
    function tkn() { return raw.trim().split(/\s+/).filter(Boolean).length; }
    if (s.pend) { var pd = s.pend; s.pend = null; return pd(line.trim()); }
    var tk = line.trim().split(/\s+/).filter(Boolean);
    if (!tk.length) return [];
    if (/\?$/.test(line.trim())) return cliHelp(s, line.trim());
    var mode = s.mode, c = kw(tk[0], CMDS[mode].map(function (x) { return x[0]; }));
    if (c === "?amb") { o('% Ambiguous command:  "' + tk[0] + '"'); return out; }
    if (!c && mode !== "config" && mode !== "user" && mode !== "priv") { var gc = kw(tk[0], CMDS.config.map(function (x) { return x[0]; })); if (gc && gc !== "?amb") { s.mode = "config"; s.ctx = null; return cliRun(s, line); } }
    if (!c) {
      if (mode === "user" || mode === "priv") { if (s.lookup) { o('Translating "' + tk[0] + '"...domain server (255.255.255.255)'); o("% Unknown command or computer name, or unable to find computer address"); o("(Pe un echipament real ai aștepta ~30 s. Sfat: no ip domain-lookup în config.)"); } else o("% Unknown command or computer name, or unable to find computer address"); }
      else inv(0);
      return out;
    }
    var a = tk.slice(1), a1 = (a[0] || "").toLowerCase();
    function need(n) { if (a.length < n) { o("% Incomplete command."); return false; } return true; }
    function toPriv() { s.mode = "priv"; s.ctx = null; o("%SYS-5-CONFIG_I: Configured from console by console"); }
    if (c === "do") { if (!a.length) { o("% Incomplete command."); return out; } var sv = s.mode, svc = s.ctx; s.mode = "priv"; var r = cliRun(s, a.join(" ")); if (s.mode === "priv") { s.mode = sv; s.ctx = svc; } return r; }
    if (c === "end") { toPriv(); return out; }
    if (c === "exit" || c === "logout") { if (mode === "user" || mode === "priv") { s.mode = "user"; o(""); o(s.host + " con0 is now available"); o("Press RETURN to get started."); } else if (mode === "config") toPriv(); else { s.mode = "config"; s.ctx = null; } return out; }
    if (c === "show") return cliShow(s, a, out, posOf);
    if (c === "ping" || c === "traceroute") {
      if (!need(1)) return out; if (!ipOk(a[0])) { o("% Unrecognized host or address, or protocol not running."); return out; }
      var ok = cliReach(s, a[0]); if (ok && c === "ping") { s.did.ping = s.did.ping || {}; s.did.ping[a[0]] = 1; } o("Type escape sequence to abort.");
      if (c === "traceroute") { o("Tracing the route to " + a[0]); o(ok ? "  1 " + a[0] + " 1 msec 0 msec 1 msec" : "  1  *    *    *"); return out; }
      o("Sending 5, 100-byte ICMP Echos to " + a[0] + ", timeout is 2 seconds:"); o(ok ? ".!!!!" : "....."); o(ok ? "Success rate is 80 percent (4/5), round-trip min/avg/max = 0/1/4 ms" : "Success rate is 0 percent (0/5)"); if (ok) o("(primul „.” = timpul pentru ARP – normal)"); return out;
    }
    if (mode === "user") { if (c === "enable") { var pwd = s.secret || s.epw; if (pwd) { s.pend = function (p) { if (p === pwd) { s.mode = "priv"; return []; } return ["% Access denied"]; }; return ["Password: (tastează parola și Enter)"]; } s.mode = "priv"; } return out; }
    if (mode === "priv") {
      if (c === "enable") return out;
      if (c === "disable") { s.mode = "user"; return out; }
      if (c === "connect") { o("% Incomplete command."); o("(connect nu e pentru examen. Pentru configurare: configure terminal = conf t.)"); return out; }
      if (c === "configure") { if (a.length && kw(a1, ["terminal"]) !== "terminal") { inv(1); return out; } if (!a.length) { s.pend = function (p) { var q = (p || "").trim().toLowerCase(); if (q && "terminal".indexOf(q) !== 0) return ["?Must be \"terminal\", \"memory\" or \"network\""]; s.mode = "config"; return ["Enter configuration commands, one per line.  End with CNTL/Z."]; }; return ["Configuring from terminal, memory, or network [terminal]? "]; } s.mode = "config"; o("Enter configuration commands, one per line.  End with CNTL/Z."); return out; }
      if (c === "copy") { if (!need(2)) return out; var x1 = kw(a1, ["running-config", "startup-config"]), x2 = kw((a[1] || "").toLowerCase(), ["running-config", "startup-config"]); if (x1 === "startup-config" && x2 === "running-config") { if (!s.saved) return ["%Error opening nvram:/startup-config (No such file or directory)"]; CFGK.forEach(function (k) { s[k] = JSON.parse(JSON.stringify(s.saved[k])); }); return ["Destination filename [running-config]?", "[OK]"]; } if (x1 === "running-config" && x2 === "startup-config") { s.pend = function () { s.saved = cfgSnap(s); return ["Building configuration...", "[OK]"]; }; return ["(apasă Enter ca să confirmi numele)", "Destination filename [startup-config]?"]; } inv(x1 ? 2 : 1); return out; }
      if (c === "write") { if (a.length && kw(a1, ["memory"]) !== "memory") { inv(1); return out; } s.saved = cfgSnap(s); o("Building configuration..."); o("[OK]"); return out; }
      if (c === "erase") { if (kw(a1, ["startup-config"]) !== "startup-config") { if (a1) inv(1); else o("% Incomplete command."); return out; } s.pend = function () { s.saved = null; return ["[OK]", "Erase of nvram: complete"]; }; return ["(apasă Enter ca să confirmi)", "Erasing the nvram filesystem will remove all configuration files! Continue? [confirm]"]; }
      if (c === "reload") { var dirty = !cfgEq(s); s.pend = function () { var sv = s.saved, h = s.hist, n = cliNew(s.dev, s.enc3); if (sv) { CFGK.forEach(function (k) { n[k] = JSON.parse(JSON.stringify(sv[k])); }); n.saved = sv; } Object.keys(n).forEach(function (k) { s[k] = n[k]; }); s.hist = h; return ["", "System Bootstrap, Version 15.0 ...", "Press RETURN to get started!", sv ? "(s-a încărcat configurația salvată)" : "(nu exista configurație salvată – totul s-a pierdut!)"]; }; return [dirty ? "System configuration has been modified. (Modificările NESALVATE se pierd!)" : "", "(apasă Enter ca să confirmi)", "Proceed with reload? [confirm]"]; }
      inv(0); return out;
    }
    if (c === "no") return cliNo(s, a, out, inv);
    if (mode === "config") {
      if (c === "hostname") { if (!need(1)) return out; if (!/^[A-Za-z][\w-]{0,62}$/.test(a[0])) { o("% Hostname contains one or more illegal characters."); return out; } s.host = a[0]; return out; }
      if (c === "enable") { if (!need(2)) return out; var w = kw(a1, ["secret", "password"]); if (!w || w === "?amb") { inv(1); return out; } var pw = a[a.length - 1]; if (w === "secret") s.secret = pw; else s.epw = pw; return out; }
      if (c === "service") { if (kw(a1, ["password-encryption"]) !== "password-encryption") { inv(1); return out; } s.enc = true; return out; }
      if (c === "banner") { if (kw(a1, ["motd"]) !== "motd") { inv(1); return out; } var rest = raw.trim().replace(/^\S+\s+\S+\s*/, ""), d0 = rest.charAt(0), end = rest.indexOf(d0, 1); if (!d0 || end < 0) { o("% Pune un delimitator la ambele capete, ex: banner motd #Text#"); return out; } s.banner = rest.slice(1, end); return out; }
      if (c === "ip") { if (a1 === "domain" && kw((a[1] || "").toLowerCase(), ["name", "lookup"]) === "name") { if (!a[2]) { o("% Incomplete command."); return out; } s.dom = a[2]; return out; } var w2 = kw(a1, ["domain-lookup", "domain-name", "default-gateway", "route", "ssh"]); if (w2 === "?amb") { o('% Ambiguous command:  "' + raw.trim() + '"'); return out; } if (w2 === "domain-name") { if (!need(2)) return out; s.dom = a[1]; return out; } if (w2 === "ssh") { var sv2 = kw((a[1] || "").toLowerCase(), ["version", "time-out", "authentication-retries"]); if (sv2 === "version") { if (a[2] !== "1" && a[2] !== "2") { if (a[2]) inv(3); else o("% Incomplete command."); return out; } if (s.rsa < 768) o("Please create RSA keys to enable SSH (and of atleast 768 bits for SSH v2)."); s.sshv = +a[2]; return out; } if (sv2 && sv2 !== "?amb") return out; if (a[1]) inv(2); else o("% Incomplete command."); return out; } if (w2 === "domain-lookup") { s.lookup = true; return out; } if (w2 === "default-gateway") { if (!need(2)) return out; if (!ipOk(a[1])) { inv(2); return out; } if (a.length > 2) { inv(3); o("(ip default-gateway primește doar IP-ul routerului, fără mască. Ex: ip default-gateway 192.168.10.1)"); return out; } s.gw = a[1]; return out; } if (w2 === "route") { need(4); return out; } inv(1); return out; }
      if (c === "interface") {
        if (!need(1)) return out;
        if (kw(a1, ["range"]) === "range" && a1.length > 1) { var rs = a.slice(1).join("").toLowerCase(), rm = /^([a-z]+)(\d\/)(\d+)-(\d+)$/.exec(rs); var base = rm && s.dev === "switch" ? ifName(rm[1], rm[2] + rm[3]) : null; if (!base) { inv(1); return out; } var pre = base.replace(/\d+$/, ""), names = []; for (var q = +rm[3]; q <= +rm[4]; q++) if (s.ifs[pre + q]) names.push(pre + q); if (!names.length) { inv(1); return out; } s.mode = "if-range"; s.ctx = names; return out; }
        var nm = ifName(a[0], a[1]);
        if (nm && /^Vlan\d+$/.test(nm) && s.dev === "switch" && !s.ifs[nm]) { s.ifs[nm] = { ip: "", mask: "", shut: true, desc: "" }; o("%LINK-5-CHANGED: Interface " + nm + ", changed state to administratively down"); }
        if (nm && /\./.test(nm)) { var par = nm.split(".")[0]; if (s.dev !== "router" || !s.ifs[par] || +nm.split(".")[1] < 1) { inv(1); return out; } if (!s.ifs[nm]) s.ifs[nm] = { ip: "", mask: "", shut: false, desc: "", enc: 0 }; }
        if (!nm || !s.ifs[nm]) { inv(1); return out; } s.mode = "if"; s.ctx = [nm]; return out;
      }
      if (c === "line") { if (!need(1)) return out; var lw = kw(a1, ["console", "vty"]); if (lw === "console") { if (a[1] !== "0") { if (a[1]) inv(2); else o("% Incomplete command."); return out; } s.mode = "line"; s.ctx = "con"; return out; } if (lw === "vty") { if (a.length < 3 || !/^\d+$/.test(a[1]) || !/^\d+$/.test(a[2])) { o("% Incomplete command."); return out; } s.mode = "line"; s.ctx = "vty"; return out; } inv(1); return out; }
      if (c === "crypto") {
        if (kw(a1, ["key"]) !== "key" || kw((a[1] || "").toLowerCase(), ["generate", "zeroize"]) !== "generate" || kw((a[2] || "").toLowerCase(), ["rsa"]) !== "rsa") { if (a.length < 3) o("% Incomplete command."); else inv(a.length >= 3 && kw((a[2] || "").toLowerCase(), ["rsa"]) !== "rsa" ? 3 : 2); return out; }
        if (/^(Switch|Router)$/.test(s.host)) { o("% Please define a hostname other than " + s.host + "."); return out; }
        if (!s.dom) { o("% Please define a domain-name first."); return out; }
        var gen = function (bits) { bits = +bits; if (!(bits >= 360 && bits <= 4096)) return ["% Modulul trebuie să fie între 360 și 4096 (la examen: 1024 sau 2048)."]; var r = []; if (s.rsa) r.push("% You already have RSA keys defined named " + s.host + "." + s.dom + " – le-am înlocuit."); s.rsa = bits; r.push("% Generating " + bits + " bit RSA keys, keys will be non-exportable...", "[OK] (elapsed time was " + (bits >= 2048 ? 3 : 1) + " seconds)", "%SSH-5-ENABLED: SSH 1.99 has been enabled"); if (bits < 768) r.push("(Atenție: sub 768 de biți SSH versiunea 2 NU pornește. Folosește 1024.)"); return r; };
        var mi = a.map(function (x) { return x.toLowerCase(); }).indexOf("modulus");
        if (mi >= 0) { if (!a[mi + 1]) { o("% Incomplete command."); return out; } return gen(a[mi + 1]); }
        s.pend = function (v) { return gen(v || 512); };
        return ["The name for the keys will be: " + s.host + "." + s.dom, "Choose the size of the key modulus in the range of 360 to 4096 for your", "  General Purpose Keys. Choosing a key modulus greater than 512 may take", "  a few minutes.", "", "How many bits in the modulus [512]: (tastează 1024 și Enter)"];
      }
      if (c === "username") {
        if (!need(1)) return out; var un = a[0], rest2 = a.slice(1), pi = rest2.map(function (x) { return x.toLowerCase(); });
        var pv = pi.indexOf("privilege"); if (pv >= 0) rest2.splice(pv, 2);
        var kind = kw((rest2[0] || "").toLowerCase(), ["secret", "password"]);
        if (!kind || kind === "?amb" || !rest2[1]) { o("% Incomplete command."); return out; }
        s.users[un] = { t: kind, p: rest2[rest2.length - 1], pr: pv >= 0 ? +a[pv + 2] || 1 : 1 }; return out;
      }
      if (c === "vlan") { if (s.dev !== "switch") { inv(0); return out; } if (!need(1)) return out; var id = +a[0]; if (!(id >= 1 && id <= 4094)) { o("% Bad VLAN list"); return out; } if (id >= 1002 && id <= 1005) { o("% Default VLAN " + id + " may not have its name changed."); o("(VLAN-urile 1002–1005 sunt rezervate – alege alt număr, ex. 10.)"); return out; } if (!s.vlans[id]) s.vlans[id] = "VLAN" + ("000" + id).slice(-4); s.mode = "vlan"; s.ctx = id; return out; }
      inv(0); return out;
    }
    if (mode === "if" || mode === "if-range") {
      var IFS = s.ctx.map(function (n) { return s.ifs[n]; });
      if (c === "shutdown" && a.length) { inv(1); return out; }
      if (c === "shutdown") { s.ctx.forEach(function (n) { if (!s.ifs[n].shut) { s.ifs[n].shut = true; o("%LINK-5-CHANGED: Interface " + n + ", changed state to administratively down"); } }); return out; }
      if (c === "description") { IFS.forEach(function (f) { f.desc = a.join(" "); }); return out; }
      if (c === "encapsulation") { if (s.dev !== "router" || !/\./.test(s.ctx[0])) { inv(0); o("(encapsulation dot1Q se pune pe o sub-interfață de router, ex. interface g0/0.10)"); return out; } if (kw(a1, ["dot1q", "isl"]) !== "dot1q") { if (a1) inv(1); else o("% Incomplete command."); return out; } var ev = +a[1]; if (!(ev >= 1 && ev <= 4094)) { o(a[1] ? "% Bad VLAN id" : "% Incomplete command."); return out; } IFS[0].enc = ev; return out; }
      if (c === "ip") {
        if (kw(a1, ["address"]) !== "address") { inv(1); return out; }
        if ((s.dev === "switch" && !/^Vlan/.test(s.ctx[0])) || mode === "if-range") { inv(0); o("(Porturile de switch de nivel 2 nu primesc IP – adresa se pune pe interface vlan 1.)"); return out; }
        if ((a[1] && /\//.test(a[1])) || (a[2] && /^\//.test(a[2]))) { inv(/\//.test(a[1]) ? 1 : 2); o("(IOS clasic cere masca zecimală: 255.255.255.0, nu /24.)"); return out; }
        if (/\./.test(s.ctx[0]) && !IFS[0].enc) { o("% Configuring IP routing on a LAN subinterface is only allowed if that"); o("subinterface is already configured as part of an IEEE 802.10, IEEE 802.1Q,"); o("or ISL vLAN."); o("(Pune întâi encapsulation dot1Q <vlan>, apoi IP-ul.)"); return out; }
        if (a.length < 3) { o("% Incomplete command."); return out; }
        if (!ipOk(a[1])) { inv(1); return out; }
        if (!maskOk(a[2])) { o("Bad mask 0x" + a[2].split(".").map(function (x) { return ("0" + (+x || 0).toString(16).toUpperCase()).slice(-2); }).join("") + " for address " + a[1]); return out; }
        var oc = a[1].split(".").map(Number), mk = a[2].split(".").map(Number), all0 = true, all1 = true;
        for (var z = 0; z < 4; z++) { if ((oc[z] & ~mk[z] & 255) !== 0) all0 = false; if (((oc[z] | mk[z]) & 255) !== 255) all1 = false; }
        if (all0 || all1) { o("Bad mask /" + a[2] + " for address " + a[1] + " (aceasta e adresa de rețea sau de broadcast)"); return out; }
        IFS[0].ip = a[1]; IFS[0].mask = a[2]; return out;
      }
      if (c === "switchport") {
        if (s.dev !== "switch" || /^Vlan/.test(s.ctx[0])) { inv(0); return out; }
        var sw = kw(a1, ["mode", "access", "trunk", "nonegotiate"]);
        if (sw === "nonegotiate") { if (a[1]) inv(2); else IFS.forEach(function (f) { if (f.mode === "dynamic" || !f.mode) { o("Command rejected: Conflict between 'nonegotiate' and 'dynamic' mode (setează întâi mode access sau mode trunk)."); } else f.nonego = true; }); return out; }
        if (sw === "mode") { var md = kw((a[1] || "").toLowerCase(), ["access", "trunk", "dynamic"]); if (!md || md === "?amb") { if (a[1]) inv(2); else o("% Incomplete command."); return out; } if (md === "trunk" && s.enc3 && IFS.some(function (f) { return !f.encap; })) { o("Command rejected: An interface whose trunk encapsulation is \"Auto\" can not be configured to \"trunk\" mode."); return out; } var dy = null; if (md === "dynamic") { dy = kw((a[2] || "").toLowerCase(), ["auto", "desirable"]); if (!dy || dy === "?amb") { if (a[2]) inv(3); else o("% Incomplete command."); return out; } } IFS.forEach(function (f) { f.mode = md; if (dy) { f.dyn = dy; delete f.nonego; } else { delete f.dyn; } }); return out; }
        if (sw === "access") { if (kw((a[1] || "").toLowerCase(), ["vlan"]) !== "vlan" || !a[2]) { o("% Incomplete command."); return out; } var v = +a[2]; if (!(v >= 1 && v <= 4094)) { o("% Bad VLAN list"); return out; } if (!s.vlans[v]) { s.vlans[v] = "VLAN" + ("000" + v).slice(-4); o("% Access VLAN does not exist. Creating vlan " + v); } IFS.forEach(function (f) { f.vlan = v; }); return out; }
        if (sw === "trunk") { var tw = kw((a[1] || "").toLowerCase(), ["allowed", "native", "encapsulation"]); if (tw === "allowed") { var av = kw((a[2] || "").toLowerCase(), ["vlan"]); if (av !== "vlan") { if (a[2]) inv(3); else o("% Incomplete command."); return out; } if (!a[3]) { o("% Incomplete command."); return out; } var op = kw(a[3].toLowerCase(), ["add", "remove", "all", "none", "except"]), rest = a.slice(op && op !== "?amb" ? 4 : 3).join(""), chg = function (f, fn) { f.allow = vFmt(fn(vParse(f.allow || "1-4094"))); }; if (op === "all") { IFS.forEach(function (f) { delete f.allow; }); return out; } if (op === "none") { IFS.forEach(function (f) { f.allow = "none"; }); return out; } if (op && op !== "?amb" && !rest) { o("% Incomplete command."); return out; } var nums = vParse(rest); if (!nums.length || nums.some(function (n) { return n < 1 || n > 4094; })) { o("% Bad VLAN list - character #1 is a non-numeric character or the list is out of range 1-4094"); return out; } IFS.forEach(function (f) { if (op === "add") chg(f, function (c) { return c.concat(nums); }); else if (op === "remove") chg(f, function (c) { return c.filter(function (n) { return nums.indexOf(n) < 0; }); }); else if (op === "except") f.allow = vFmt(vParse("1-4094").filter(function (n) { return nums.indexOf(n) < 0; })); else f.allow = vFmt(nums); if (f.allow === "") f.allow = "none"; if (f.allow === "1-4094") delete f.allow; }); return out; } if (tw === "native") { var nv = kw((a[2] || "").toLowerCase(), ["vlan"]); if (nv !== "vlan") { if (a[2]) inv(3); else o("% Incomplete command."); return out; } if (!a[3]) { o("% Incomplete command."); return out; } if (!/^\d+$/.test(a[3]) || +a[3] < 1 || +a[3] > 4094) { o("% Invalid input detected: VLAN 1-4094."); return out; } IFS.forEach(function (f) { f.nat = +a[3]; if (f.nat === 1) delete f.nat; }); return out; } if (tw === "encapsulation") { if (!s.enc3) { o("(Pe Catalyst 2960 nu există această comandă – singura încapsulare e dot1Q. Pe 3560 ar fi: switchport trunk encapsulation dot1q.)"); inv(2); return out; } var ec = kw((a[2] || "").toLowerCase(), ["dot1q", "isl", "negotiate"]); if (!ec || ec === "?amb") { if (a[2]) inv(3); else o("% Incomplete command."); return out; } IFS.forEach(function (f) { if (ec === "negotiate") delete f.encap; else f.encap = ec; }); return out; } if (a[1]) inv(2); else o("% Incomplete command."); return out; }
        inv(1); return out;
      }
      inv(0); return out;
    }
    if (mode === "line") {
      var L0 = s.line[s.ctx];
      if (c === "password") { if (!need(1)) return out; L0.pw = a[a.length - 1]; return out; }
      if (c === "login") { if (a.length && kw(a1, ["local"]) !== "local") { inv(1); return out; } if (!L0.pw && !a.length) o("% Login disabled on line, until 'password' is set"); L0.login = true; L0.local = !!a.length; return out; }
      if (c === "transport") { if (kw(a1, ["input", "output", "preferred"]) !== "input") { if (a1) inv(1); else o("% Incomplete command."); return out; } var tp = a.slice(1).map(function (x) { return kw(x.toLowerCase(), ["ssh", "telnet", "all", "none"]); }); if (!tp.length || tp.some(function (x) { return !x || x === "?amb"; })) { if (a[1]) inv(2); else o("% Incomplete command."); return out; } L0.tin = tp.sort().join(" "); return out; }
      return out;
    }
    if (mode === "vlan") { if (c === "name") { if (!need(1)) return out; if (a.length > 1) { inv(2); o("(Numele VLAN-ului e un singur cuvânt, fără spații: ex. name MGMT sau name VLAN_10.)"); return out; } (s.vlist || [s.ctx]).forEach(function (id) { s.vlans[id] = a[0]; }); return out; } inv(0); return out; }
    return out;
  }
  /* Normalizare intrare (iPhone: ghilimele/liniuțe „smart”, spații speciale, prompt copiat) + comenzi acceptate în plus */
  document.addEventListener("input", function (e) { var t = e.target; if (t && t.getAttribute && t.getAttribute("inputmode") === "decimal" && /,/.test(t.value)) { var pos = t.selectionStart; t.value = t.value.replace(/,/g, "."); try { t.setSelectionRange(pos, pos); } catch (er) {} } }, true);
  function cliNorm(v) { return String(v == null ? "" : v).replace(/[\u00a0\u2007\u202f\u2009\u200b\t]/g, " ").replace(/[\u2010-\u2015\u2212]/g, "-").replace(/[\u201c\u201d\u201e\u00ab\u00bb]/g, '"').replace(/[\u2018\u2019\u201a]/g, "'").replace(/\u2026/g, "..."); }
  function cliRun(s, line) {
    line = cliNorm(line);
    if (s.pend) return cliRun0(s, line);
    var pre = [], m = /^\s*[A-Za-z][\w.-]{0,40}(\((config[a-z-]*)\))?\s?[>#]\s*(?=\S)/.exec(line);
    if (m && !/^\s*banner/i.test(line)) { line = line.slice(m[0].length); pre.push("(Nu tasta promptul „" + m[0].trim() + "” – el apare singur în stânga. Am rulat doar: " + line.trim() + ")"); }
    if (!/^\s*banner/i.test(line)) line = line.replace(/[.;,]+\s*$/, "");
    var flt = null, mi = /\s*\|\s*(i|in|inc|incl|inclu|includ|include)\s+(.+)$/i.exec(line);
    if (mi && /^\s*(sh|sho|show|do)\b/i.test(line)) { flt = mi[2].trim(); line = line.slice(0, mi.index); }
    var x = cliExtra(s, line), res = x || cliRun0(s, line);
    if (flt) res = res.filter(function (l) { return l.indexOf(flt) >= 0; });
    if (/^\s*(do\s+)?ping\b/i.test(line)) TOPO.act = Date.now(); if (TOPO.S) setTimeout(topoRef, 0);
    if (s.dev === "switch" && /^\s*(do\s+)?sh\w*\s+ip\s+int/i.test(line)) Object.keys(s.ifs).forEach(function (n) { if (/^Vlan/.test(n) && s.ifs[n].ip && !s.ifs[n].shut && !cliUp(s, n)) res.push("(💡 " + n + " e down: VLAN " + n.slice(4) + " trebuie să existe (vlan " + n.slice(4) + ") și să aibă cel puțin un port activ în el – ex. pe Fa0/1: switchport access vlan " + n.slice(4) + ". La fel pe un switch real.)"); });
    return pre.concat(res);
  }
  function cliExtra(s, line) {
    var t = line.trim(), low = t.toLowerCase().replace(/\s+/g, " "), tk = low.split(" "), md = s.mode, ex = md === "user" || md === "priv", out = [];
    if (!t || /\?$/.test(t)) return null;
    function acc(w) { return ["(Comandă acceptată: " + w + " – nu e cerută la proba practică, simulatorul n-o modelează în detaliu.)"]; }
    function is(tok, word, n) { return tok && word.indexOf(tok) === 0 && tok.length >= (n || 1); }
    if (ex) {
      if (is(tk[0], "terminal", 3)) return md === "user" && !/^(len|mon|width)/.test(tk[1] || "") ? null : (tk[1] ? [] : ["% Incomplete command."]);
      if (is(tk[0], "ssh", 3) && tk[0].length <= 3) return cliSsh(s, t);
      if (md === "priv" && is(tk[0], "clock", 3) && is(tk[1], "set", 2)) return [];
      if ((is(tk[0], "dir", 3) && tk[0].length <= 3) || (is(tk[0], "show", 2) && is(tk[1], "flash", 2))) return ["Directory of flash:/", "", "    1  -rwx    " + (s.dev === "router" ? "86977304  <no date>  c1900-universalk9-mz.SPA.155-3.M.bin" : "4670455  <no date>  2960-lanbasek9-mz.150-2.SE4.bin"), "    2  -rwx        1919  <no date>  private-config.text", "    3  -rwx        " + (s.saved ? "1285" : "   0") + "  <no date>  config.text" + (s.saved ? "" : "  (nimic salvat încă)"), "    4  -rwx         736  <no date>  vlan.dat", "", "64016384 bytes total (59199488 bytes free)"];
      if (is(tk[0], "show", 2) && is(tk[1], "users", 2)) return ["    Line       User       Host(s)              Idle       Location", "*  0 con 0                idle                 00:00:00"];
      if (s.dev === "switch" && is(tk[0], "show", 2) && is(tk[1], "interfaces", 3) && tk[2] && /^sta/.test(tk[2]) && "status".indexOf(tk[2]) === 0) {
        var pd = function (x, n) { x = String(x); while (x.length < n) x += " "; return x; }, L = ["Port      Name               Status       Vlan       Duplex  Speed Type"];
        Object.keys(s.ifs).filter(function (n) { return !/^Vlan/.test(n); }).forEach(function (n) { var f = s.ifs[n], up = !f.shut && cliUp(s, n), g = /^Gig/.test(n); L.push(pd(n.replace("FastEthernet", "Fa").replace("GigabitEthernet", "Gi"), 10) + pd((f.desc || "").slice(0, 18), 19) + pd(f.shut ? "disabled" : up ? "connected" : "notconnect", 13) + pd(f.mode === "trunk" ? "trunk" : (f.vlan || 1), 11) + pd(up ? "a-full" : "auto", 8) + pd(up ? (g ? "a-1000" : "a-100") : "auto", 7) + (g ? "10/100/1000BaseTX" : "10/100BaseTX")); });
        return L;
      }
      if (is(tk[0], "show", 2) && is(tk[1], "interfaces", 3) && tk[2] && !/^(tr|sta|sw)/.test(tk[2])) {
        var inm = ifName(tk[2], /^\d/.test(tk[3] || "") ? tk[3] : ""), rest = tk.slice(/^\d/.test(tk[3] || "") ? 4 : 3);
        if (!inm || !s.ifs[inm]) return null; if (rest.length) return null;
        var f = s.ifs[inm], up = !f.shut && cliUp(s, inm);
        return [inm + " is " + (f.shut ? "administratively down" : up ? "up" : "down") + ", line protocol is " + (up ? "up" : "down") + (f.shut || !up ? "" : " (connected)"), "  Hardware is " + (/^Vlan/.test(inm) ? "EtherSVI" : /^Gig/.test(inm) ? "Gigabit Ethernet" : "Fast Ethernet") + ", address is 0060.2f84.4a" + ("0" + (Object.keys(s.ifs).indexOf(inm) % 100)).slice(-2), f.desc ? "  Description: " + f.desc : "  (fără descriere)", f.ip ? "  Internet address is " + f.ip + "/" + f.mask.split(".").reduce(function (a, o) { return a + ((+o).toString(2).match(/1/g) || []).length; }, 0) : "", "  MTU 1500 bytes, BW " + (/^Gig/.test(inm) ? "1000000" : "100000") + " Kbit/sec", "  " + (up ? "Full-duplex, " + (/^Gig/.test(inm) ? "1000Mb/s" : "100Mb/s") : "Auto-duplex, Auto-speed")].filter(Boolean);
      }
      return null;
    }
    if (md === "config") {
      if (tk[0] === "no" && is(tk[1], "ip", 2) && tk[2] === "domain" && is(tk[3], "lookup", 3)) return cliRun0(s, "no ip domain-lookup");
      if (is(tk[0], "ip", 2) && tk[1] === "domain" && is(tk[2], "lookup", 3)) return cliRun0(s, "ip domain-lookup");
      if (is(tk[0], "spanning-tree", 3) || (is(tk[0], "cdp", 2) && tk.length > 1) || (is(tk[0], "lldp", 2) && tk.length > 1) || (is(tk[0], "clock", 3) && is(tk[1], "timezone", 3)) || (is(tk[0], "logging", 4) && tk.length > 1)) return acc(t);
      if (is(tk[0], "ip", 2) && is(tk[1], "routing", 3)) return s.dev === "router" ? [] : ["(Pe un Catalyst 2960 rutarea nu e cerută; switch-ul rămâne de nivel 2. Comandă ignorată.)"];
      if (s.dev === "switch" && is(tk[0], "vlan", 2) && tk[0].length <= 4 && tk[1] && /^[\d,\-\s]+$/.test(tk.slice(1).join("")) && /[,\-]/.test(tk.slice(1).join(""))) {
        var ids = vParse(tk.slice(1).join("")); if (!ids.length || ids.some(function (n) { return n < 1 || n > 4094; })) return ["% Bad VLAN list"];
        ids.forEach(function (id) { if (!s.vlans[id]) s.vlans[id] = "VLAN" + ("000" + id).slice(-4); }); s.mode = "vlan"; s.ctx = ids[0]; s.vlist = ids; return [];
      }
      if (s.dev === "switch" && is(tk[0], "vlan", 2) && tk[0].length <= 4) s.vlist = null;
      if (is(tk[0], "interface", 2) && is(tk[1], "range", 1) && tk[1].length > 1 && /,/.test(t)) {
        var groups = tk.slice(2).join("").split(","), names = [];
        for (var gi = 0; gi < groups.length; gi++) { var g = groups[gi], rm = /^([a-z]+)(\d\/)(\d+)(?:-(\d+))?$/.exec(g); if (!rm) return null; var base = ifName(rm[1], rm[2] + rm[3]); if (!base) return null; var pre = base.replace(/\d+$/, ""); for (var q = +rm[3]; q <= +(rm[4] || rm[3]); q++) { if (!s.ifs[pre + q]) return null; if (names.indexOf(pre + q) < 0) names.push(pre + q); } }
        if (!names.length) return null; s.mode = "if-range"; s.ctx = names; return [];
      }
      return null;
    }
    if (md === "if" || md === "if-range") {
      if (/^(spe|dup|spanning|span|storm|cdp|lldp|mdix)/.test(tk[0]) && tk.length > 1) return acc(t);
      if (is(tk[0], "switchport", 2) && is(tk[1], "port-security", 2) && s.dev === "switch") return acc(t);
      if (is(tk[0], "switchport", 2) && is(tk[1], "voice", 2) && s.dev === "switch") return acc(t);
    }
    return null;
  }
  function cliSsh(s, t) {
    var a = t.split(/\s+/).slice(1), li = a.indexOf("-l"), user = li >= 0 ? a[li + 1] : null, host = a.filter(function (x, i) { return x !== "-l" && a[i - 1] !== "-l" && !/^-/.test(x); })[0];
    if (!host || !user) return ["% Comanda corectă: ssh -l <utilizator> <IP>  (ex. ssh -l admin 192.168.10.2)"];
    if (!ipOk(host)) return ["% Unknown command or computer name, or unable to find computer address"];
    var mine = Object.keys(s.ifs).some(function (n) { return s.ifs[n].ip === host && !s.ifs[n].shut; });
    if (!mine) return cliReach(s, host) ? ["% Connection refused by remote host", "(În simulator poți testa SSH doar spre propriul IP; de pe laptop folosește ssh -l admin <IP>.)"] : ["% Destination unreachable; gateway or host down"];
    var why = cliSshWhy(s); if (why) return ["% Connection refused by remote host", "(" + why + ")"];
    var u = s.users[user]; s.pend = function (p) { if (u && p === u.p) { s.did.sshok = 1; return ["(Autentificat prin SSH ca " + user + (u.pr >= 15 ? " – privilegiu 15, intri direct în #" : "") + ". Închizi cu exit.)"]; } return ["% Authentication failed."]; };
    return ["Password: (tastează parola utilizatorului și Enter)"];
  }
  function cliSshWhy(s) {
    if (s.rsa < 768) return "SSH nu e pornit: lipsesc cheile RSA de minim 768 biți (crypto key generate rsa → 1024)";
    var v = s.line.vty; if (v.tin && !/ssh|all/.test(v.tin)) return "pe line vty nu e permis SSH (transport input ssh)";
    if (!v.login) return "pe line vty lipsește login local";
    if (v.local && !Object.keys(s.users).length) return "login local cere un utilizator: username admin privilege 15 secret …";
    return "";
  }
  function cliNo(s, a, out, inv) {
    var m = s.mode, a1 = (a[0] || "").toLowerCase();
    function o(x) { out.push(x); }
    if (!a.length) { o("% Incomplete command."); return out; }
    if (m === "if" || m === "if-range") {
      if (kw(a1, ["shutdown"]) === "shutdown") { s.ctx.forEach(function (n) { var f = s.ifs[n]; if (f.shut) { f.shut = false; var up = cliUp(s, n); o("%LINK-5-CHANGED: Interface " + n + ", changed state to " + (up ? "up" : "down")); if (up) o("%LINEPROTO-5-UPDOWN: Line protocol on Interface " + n + ", changed state to up"); } }); return out; }
      if (kw(a1, ["ip"]) === "ip" && (!a[1] || kw(a[1].toLowerCase(), ["address"]) === "address")) { s.ctx.forEach(function (n) { var f = s.ifs[n]; if ("ip" in f) { f.ip = ""; f.mask = ""; } }); return out; }
      if (kw(a1, ["switchport"]) === "switchport") { s.ctx.forEach(function (n) { var f = s.ifs[n]; if ("vlan" in f) f.vlan = 1; }); return out; }
      if (kw(a1, ["description"]) === "description") { s.ctx.forEach(function (n) { s.ifs[n].desc = ""; }); return out; }
    }
    if (m === "line") { if (kw(a1, ["login"]) === "login") { s.line[s.ctx].login = false; s.line[s.ctx].local = false; return out; } if (kw(a1, ["transport"]) === "transport") { s.line[s.ctx].tin = ""; return out; } if (kw(a1, ["password"]) === "password") { s.line[s.ctx].pw = ""; return out; } }
    if (m === "config") {
      var w = kw(a1, ["ip", "hostname", "enable", "service", "banner", "vlan", "username", "crypto"]);
      if (w === "username") { delete s.users[a[1]]; return out; }
      if (w === "crypto") { s.rsa = 0; o("% All RSA keys will be removed."); o("%SSH-5-DISABLED: SSH 2.0 has been disabled"); return out; }
      if (w === "ip") { var w2 = kw((a[1] || "").toLowerCase(), ["domain-lookup", "domain-name", "default-gateway", "ssh"]); if (w2 === "domain-name") { s.dom = ""; return out; } if (w2 === "ssh") { s.sshv = 0; return out; } if (w2 === "domain-lookup") { s.lookup = false; return out; } if (w2 === "default-gateway") { s.gw = ""; return out; } }
      if (w === "hostname") { s.host = s.dev === "router" ? "Router" : "Switch"; return out; }
      if (w === "enable") { var e2 = kw((a[1] || "").toLowerCase(), ["secret", "password"]); if (e2 === "secret") s.secret = ""; else if (e2 === "password") s.epw = ""; return out; }
      if (w === "service") { s.enc = false; return out; }
      if (w === "banner") { s.banner = ""; return out; }
      if (w === "vlan") { var v = +a[1]; if (v === 1 || (v >= 1002 && v <= 1005)) { o("%Default VLAN " + v + " may not be deleted."); return out; } if (v > 1 && s.vlans[v]) delete s.vlans[v]; return out; }
    }
    if (m !== "config" && kw(a1, ["ip", "hostname", "enable", "service", "banner", "vlan", "username", "crypto"])) { s.mode = "config"; s.ctx = null; return cliNo(s, a, out, inv); }
    inv(1); return out;
  }
  function cliUp(s, n) { if (/^Serial/.test(n)) return false; if (s.unpl && s.unpl[n]) return false; if (s.dev === "router") { if (/\./.test(n)) { var pf = s.ifs[n.split(".")[0]]; return !!pf && !pf.shut; } return n === "GigabitEthernet0/0" || n === "GigabitEthernet0/1"; } if (/^Vlan/.test(n)) { var vn = +n.slice(4); if (!s.vlans || !s.vlans[vn]) return false; return ["FastEthernet0/1", "FastEthernet0/2", "GigabitEthernet0/1", s.cport].some(function (pn) { var f = s.ifs[pn]; if (!f || f.shut || (s.unpl && s.unpl[pn])) return false; if (f.mode === "trunk") { var al = f.allow || "1-4094"; if (al === "none") return false; try { return vParse(al).indexOf(vn) >= 0; } catch (e) { return true; } } return (f.vlan || 1) === vn; }); } return n === "FastEthernet0/1" || n === "FastEthernet0/2" || n === "GigabitEthernet0/1" || (!!s.cport && n === s.cport); }
  function cliReach(s, ip) {
    var t = ip.split(".").map(Number);
    return Object.keys(s.ifs).some(function (n) { var f = s.ifs[n]; if (!f.ip || f.shut || !cliUp(s, n)) return false; var x = f.ip.split(".").map(Number), m = f.mask.split(".").map(Number); for (var k = 0; k < 4; k++) if ((x[k] & m[k]) !== (t[k] & m[k])) return false; return ip !== f.ip && /\.(1|2|10|11|20|254)$/.test(ip); }) || Object.keys(s.ifs).some(function (n) { return s.ifs[n].ip === ip && !s.ifs[n].shut; });
  }
  function cliShow(s, a, out, posOf) {
    function o(x) { out.push(x); }
    function inv(n) { o(new Array(cliPrompt(s).length + posOf(n) + 1).join(" ") + "^"); o("% Invalid input detected at '^' marker."); }
    if (!a.length) { o("% Incomplete command."); return out; }
    var w = kw(a[0].toLowerCase(), ["running-config", "startup-config", "ip", "vlan", "version", "interfaces", "history", "clock", "mac-address-table"]);
    if (!w || w === "?amb") { inv(1); return out; }
    if (s.mode === "user" && (w === "running-config" || w === "startup-config")) { inv(1); o("(show running-config cere modul privilegiat – tastează enable)"); return out; }
    if (w === "running-config") { s.did.srun = true; return out.concat(cliCfg(s, cfgSnap(s), "Current")); }
    if (w === "startup-config") { s.did.sstart = true; if (!s.saved) { o("startup-config is not present"); return out; } return out.concat(cliCfg(s, s.saved, "Using")); }
    if (w === "ip") {
      if (!a[1]) { o("% Incomplete command."); return out; }
      var w2 = kw((a[1] || "").toLowerCase(), ["interface", "route", "ssh"]);
      if (w2 === "ssh") { s.did.sssh = true; var en = s.rsa >= 768 || (s.rsa && s.sshv !== 2); if (!s.rsa) { o("SSH Disabled - version 1.99"); o("%Please create RSA keys to enable SSH (and of atleast 768 bits for SSH v2)."); } else { o("SSH Enabled - version " + (s.sshv === 2 ? (s.rsa >= 768 ? "2.0" : "1.99") : s.sshv === 1 ? "1.5" : "1.99")); if (s.sshv === 2 && s.rsa < 768) o("%Please create RSA keys of atleast 768 bits for SSH v2."); } o("Authentication methods:publickey,keyboard-interactive,password"); o("Authentication timeout: 120 secs; Authentication retries: 3"); if (en) o("Modulus Size : " + s.rsa + " bits"); return out; }
      if (w2 === "interface" && kw((a[2] || "brief").toLowerCase(), ["brief"]) === "brief") { s.did.sipib = true; o("Interface              IP-Address      OK? Method Status                Protocol"); Object.keys(s.ifs).forEach(function (n) { var f = s.ifs[n], up = !f.shut && cliUp(s, n), st = f.shut ? "administratively down" : up ? "up" : "down"; o(pad(n, 23) + pad(f.ip || "unassigned", 16) + (f.ip ? "YES manual " : "YES unset  ") + pad(st, 22) + (up ? "up" : "down")); }); return out; }
      if (w2 === "route") { s.did.sroute = true;
        if (s.dev === "switch") { o("Default gateway is " + (s.gw || "not set")); o(""); o("Host               Gateway           Last Use    Total Uses  Interface"); o("ICMP redirect cache is empty"); return out; }
        o("Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP"); o("       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area"); o("       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2"); o("       E1 - OSPF external type 1, E2 - OSPF external type 2"); o("       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2"); o("       ia - IS-IS inter area, * - candidate default, U - per-user static route"); o("       o - ODR, P - periodic downloaded static route, H - NHRP, l - LISP"); o("       + - replicated route, % - next hop override"); o(""); o("Gateway of last resort is not set"); o("");
        var i2n = function (x) { return x.split(".").reduce(function (A, B) { return A * 256 + (+B); }, 0); }, n2i = function (v) { return [v >>> 24 & 255, v >>> 16 & 255, v >>> 8 & 255, v & 255].join("."); }, nets = {};
        Object.keys(s.ifs).forEach(function (n) { var f = s.ifs[n]; if (!(f.ip && f.mask && !f.shut && cliUp(s, n))) return; var mk = i2n(f.mask), pl = 0; for (var q = 0; q < 32; q++) if (mk & (1 << (31 - q))) pl++; var net = n2i((i2n(f.ip) & mk) >>> 0); var cls = n2i((i2n(f.ip) & (i2n(f.ip) < 2147483648 ? 4278190080 : i2n(f.ip) < 3221225472 ? 4294901760 : 4294967040)) >>> 0) + "/" + (i2n(f.ip) < 2147483648 ? 8 : i2n(f.ip) < 3221225472 ? 16 : 24); (nets[cls] = nets[cls] || []).push(["C        " + net + "/" + pl + " is directly connected, " + n, "L        " + f.ip + "/32 is directly connected, " + n, pl]); });
        Object.keys(nets).sort(function (x, y) { return i2n(x.split("/")[0]) - i2n(y.split("/")[0]); }).forEach(function (k) { var r = nets[k], ms = {}; r.forEach(function (x) { ms[x[2]] = 1; }); ms[32] = 1; o("      " + k + " is variably subnetted, " + r.length * 2 + " subnets, " + Object.keys(ms).length + " masks"); r.forEach(function (x) { o(x[0]); o(x[1]); }); });
        return out; }
      o("% Incomplete command."); return out;
    }
    if (w === "vlan") {
      if (s.dev !== "switch") { inv(1); return out; } s.did.svb = true;
      o("VLAN Name                             Status    Ports"); o("---- -------------------------------- --------- -------------------------------");
      Object.keys(s.vlans).map(Number).sort(function (x, y) { return x - y; }).forEach(function (v) { var ports = Object.keys(s.ifs).filter(function (n) { var f = s.ifs[n]; return "vlan" in f && f.vlan === v && f.mode !== "trunk"; }).map(function (n) { return n.replace("FastEthernet", "Fa").replace("GigabitEthernet", "Gi"); }); var first = true; do { var chunk = ports.splice(0, 4).join(", "); o(first ? pad(v, 5) + pad(s.vlans[v], 33) + "active    " + chunk : pad("", 48) + chunk); first = false; } while (ports.length); });
      ["1002 fddi-default", "1003 token-ring-default", "1004 fddinet-default", "1005 trnet-default"].forEach(function (x) { var p = x.split(" "); o(pad(p[0], 5) + pad(p[1], 33) + "active"); });
      return out;
    }
    if (w === "version") { o("Cisco IOS Software, " + (s.dev === "router" ? "C1900 Software (C1900-UNIVERSALK9-M), Version 15.1(4)M4" : "C2960 Software (C2960-LANBASEK9-M), Version 15.0(2)SE4") + ", RELEASE SOFTWARE (fc1)"); o("Technical Support: http://www.cisco.com/techsupport"); o("Copyright (c) 1986-2012 by Cisco Systems, Inc."); o(""); o("ROM: Bootstrap program is " + (s.dev === "router" ? "System Bootstrap, Version 15.0(1r)M15" : "C2960 boot loader")); o(""); o(s.host + " uptime is 12 minutes"); o("System returned to ROM by power-on"); o('System image file is "flash:' + (s.dev === "router" ? "c1900-universalk9-mz.SPA.151-4.M4.bin" : "c2960-lanbasek9-mz.150-2.SE4.bin") + '"'); o(""); if (s.dev === "router") { o("Cisco CISCO1941/K9 (revision 1.0) with 491520K/32768K bytes of memory."); o("2 Gigabit Ethernet interfaces"); o("255K bytes of non-volatile configuration memory."); } else { o("cisco WS-C2960-24TT-L (PowerPC405) processor (revision B0) with 65536K bytes of memory."); o("24 FastEthernet interfaces"); o("2 Gigabit Ethernet interfaces"); o("64K bytes of flash-simulated non-volatile configuration memory."); o("Model number                    : WS-C2960-24TT-L"); } o(""); o("Configuration register is 0x2102"); return out; }
    if (w === "history") { s.hist.slice(-10).forEach(function (h) { o("  " + h); }); return out; }
    if (w === "clock") { var dn = new Date(), MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], DN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], z = function (x, n) { return ("000" + x).slice(-(n || 2)); }; o("*" + z(dn.getUTCHours()) + ":" + z(dn.getUTCMinutes()) + ":" + z(dn.getUTCSeconds()) + "." + z(dn.getUTCMilliseconds(), 3) + " UTC " + DN[dn.getUTCDay()] + " " + MN[dn.getUTCMonth()] + " " + dn.getUTCDate() + " " + dn.getUTCFullYear()); return out; }
    if (w === "interfaces" && a[1] && kw((a[1] || "").toLowerCase(), ["trunk", "status"]) !== "trunk") {
      var inm = ifName(a[1], /^\d/.test(a[2] || "") ? a[2] : ""), swi = a.slice(inm && /^\d/.test(a[2] || "") ? 3 : 2).join(" ");
      if (inm && s.ifs[inm] && kw((swi || "").toLowerCase(), ["switchport"]) === "switchport") {
        if (s.dev !== "switch" || !("mode" in s.ifs[inm])) { o("% Interface " + inm + " nu este port de switch (layer 3)."); return out; }
        var f = s.ifs[inm], adm = f.mode === "dynamic" ? "dynamic " + (f.dyn || "auto") : f.mode || "dynamic auto", tr = f.mode === "trunk", oper = tr ? "trunk" : "static access";
        s.did.ssw = true;
        o("Name: " + inm.replace("GigabitEthernet", "Gi").replace("FastEthernet", "Fa")); o("Switchport: Enabled"); o("Administrative Mode: " + adm); o("Operational Mode: " + (f.shut ? "down" : oper));
        o("Administrative Trunking Encapsulation: " + (s.enc3 && !f.encap ? "negotiate" : "dot1q")); o("Negotiation of Trunking: " + (f.mode === "access" || f.nonego ? "Off" : "On"));
        o("Access Mode VLAN: " + (f.vlan || 1) + " (" + (s.vlans[f.vlan || 1] || "default") + ")"); o("Trunking Native Mode VLAN: " + (f.nat || 1) + " (" + (s.vlans[f.nat || 1] || "inactive") + ")"); o("Trunking VLANs Enabled: " + (f.allow ? f.allow.toUpperCase() : "ALL"));
        return out;
      }
    }
    if (w === "interfaces" && kw((a[1] || "").toLowerCase(), ["trunk", "status"]) === "trunk") { if (s.dev !== "switch") { inv(2); return out; } s.did.strunk = true; var tr = Object.keys(s.ifs).filter(function (n) { return s.ifs[n].mode === "trunk"; }); if (!tr.length) { o("(nicio interfață în mod trunk – verifică switchport mode trunk)"); return out; } o("Port        Mode         Encapsulation  Status        Native vlan"); tr.forEach(function (n) { o(pad(n.replace("GigabitEthernet", "Gi").replace("FastEthernet", "Fa"), 12) + pad("on", 13) + pad("802.1q", 15) + pad(s.ifs[n].shut ? "not-trunking" : "trunking", 14) + (s.ifs[n].nat || 1)); }); o(""); o("Port        Vlans allowed on trunk"); tr.forEach(function (n) { o(pad(n.replace("GigabitEthernet", "Gi").replace("FastEthernet", "Fa"), 12) + (s.ifs[n].allow || "1-4094")); }); o(""); o("Port        Vlans allowed and active in management domain"); tr.forEach(function (n) { o(pad(n.replace("GigabitEthernet", "Gi").replace("FastEthernet", "Fa"), 12) + (function () { var al = s.ifs[n].allow ? vParse(s.ifs[n].allow) : null, r = Object.keys(s.vlans).map(Number).filter(function (v) { return !al || al.indexOf(v) >= 0; }); return r.length ? vFmt(r) : "none"; })()); }); return out; }
    if (w === "interfaces") { var inm = a[1] ? ifName(a[1], a[2] && /^[\d\/.]+$/.test(a[2]) ? a[2] : "") : null, fI = inm && s.ifs[inm];
      if (a[1] && !fI) { inv(2); return out; }
      (fI ? [inm] : Object.keys(s.ifs)).forEach(function (n) { var f = s.ifs[n], vl = /^Vlan/.test(n), up = !f.shut && (vl ? cliUp(s, n) : cliUp(s, n)), g = /^Gig/.test(n), mac = "0060.2f84.4a" + ("0" + (Object.keys(s.ifs).indexOf(n) + 1).toString(16)).slice(-2);
        o(n + " is " + (f.shut ? "administratively down" : up ? "up" : "down") + ", line protocol is " + (up ? "up" : "down") + (vl || s.dev === "router" ? "" : up ? " (connected)" : f.shut ? " (disabled)" : " (notconnect)"));
        o("  Hardware is " + (vl ? "EtherSVI" : g ? (s.dev === "router" ? "CN Gigabit Ethernet" : "Gigabit Ethernet") : "Fast Ethernet") + ", address is " + mac + " (bia " + mac + ")");
        if (f.ip) o("  Internet address is " + f.ip + "/" + (f.mask || "255.255.255.0").split(".").reduce(function (c, x) { return c + ((+x).toString(2).match(/1/g) || []).length; }, 0));
        o("  MTU 1500 bytes, BW " + (vl ? "1000000" : g ? "1000000" : "100000") + " Kbit/sec, DLY " + (g || vl ? "10" : "100") + " usec,"); o("     reliability 255/255, txload 1/255, rxload 1/255"); o("  Encapsulation ARPA, loopback not set");
        if (!vl) o("  " + (up ? "Full-duplex, " + (g ? "1000Mb/s" : "100Mb/s") : "Auto-duplex, Auto-speed") + ", media type is " + (g ? "10/100/1000BaseTX" : "10/100BaseTX"));
        o("  5 minute input rate 0 bits/sec, 0 packets/sec"); o("  5 minute output rate 0 bits/sec, 0 packets/sec"); });
      return out; }
    o("          Mac Address Table"); o("-------------------------------------------"); o(""); o("Vlan    Mac Address       Type        Ports"); o("----    -----------       --------    -----"); var mt = [["FastEthernet0/1", "0060.2f84.4ab6"], ["FastEthernet0/2", "0001.6432.a10b"], ["GigabitEthernet0/1", "0002.4a7c.9e01"]].filter(function (m) { var f = s.ifs[m[0]]; return f && !f.shut && cliUp(s, m[0]); }); mt.forEach(function (m) { var f = s.ifs[m[0]], v = f.mode === "trunk" ? (f.nat || 1) : (f.vlan || 1); o(("    " + v).slice(-4) + "    " + m[1] + "    DYNAMIC     " + m[0].replace("FastEthernet", "Fa").replace("GigabitEthernet", "Gi")); }); o("Total Mac Addresses for this criterion: " + mt.length); return out;
  }
  function cliCfg(s, c, kind) {
    var L = ["Building configuration...", "", kind + " configuration : " + (900 + JSON.stringify(c).length % 600) + " bytes", "!", "version 15.0", "no service timestamps log datetime msec", c.enc ? "service password-encryption" : "no service password-encryption", "!", "hostname " + c.host, "!"];
    if (c.secret) L.push("enable secret 5 $1$mERr$" + enc7(c.secret + "salt").slice(4, 26));
    if (c.epw) L.push("enable password " + (c.enc ? "7 " + enc7(c.epw) : c.epw));
    L.push("!"); Object.keys(c.users || {}).forEach(function (u) { var x = c.users[u]; L.push("username " + u + (x.pr > 1 ? " privilege " + x.pr : "") + (x.t === "secret" ? " secret 5 $1$" + enc7(x.p + u).slice(4, 24) : " password " + (c.enc ? "7 " + enc7(x.p) : x.p))); }); if (c.users && Object.keys(c.users).length) L.push("!");
    if (!c.lookup) L.push("no ip domain-lookup"); if (c.dom) L.push("ip domain-name " + c.dom); if (c.sshv) L.push("ip ssh version " + c.sshv); if (!c.lookup || c.dom || c.sshv) L.push("!");
    if (s.dev === "switch") Object.keys(c.vlans).map(Number).filter(function (v) { return v > 1; }).forEach(function (v) { L.push("vlan " + v); L.push(" name " + c.vlans[v]); L.push("!"); });
    Object.keys(c.ifs).forEach(function (n) { var f = c.ifs[n]; L.push("interface " + n); if (f.desc) L.push(" description " + f.desc); if (f.enc) L.push(" encapsulation dot1Q " + f.enc); if (f.vlan && f.vlan !== 1) L.push(" switchport access vlan " + f.vlan); if (f.encap) L.push(" switchport trunk encapsulation " + f.encap); if (f.nat) L.push(" switchport trunk native vlan " + f.nat); if (f.allow) L.push(" switchport trunk allowed vlan " + f.allow); if (f.mode === "dynamic") { if (f.dyn === "desirable") L.push(" switchport mode dynamic desirable"); } else if (f.mode) L.push(" switchport mode " + f.mode); if (f.nonego) L.push(" switchport nonegotiate"); if ("ip" in f) L.push(f.ip ? " ip address " + f.ip + " " + f.mask : " no ip address"); if (f.shut) L.push(" shutdown"); L.push("!"); });
    if (c.gw) { L.push("ip default-gateway " + c.gw); L.push("!"); }
    if (c.banner) { L.push("banner motd ^C" + c.banner + "^C"); L.push("!"); }
    function ln(name, l) { L.push(name); if (l.pw) L.push(" password " + (c.enc ? "7 " + enc7(l.pw) : l.pw)); if (l.login) L.push(l.local ? " login local" : " login"); if (l.tin) L.push(" transport input " + l.tin); }
    ln("line con 0", c.line.con); L.push("!"); ln("line vty 0 4", c.line.vty); if (s.dev === "switch") ln("line vty 5 15", c.line.vty); L.push("!"); L.push("end");
    return L;
  }
  /* Ajutor (?) și completare (Tab) pe baza unui arbore de fraze, ca în IOS: ? arată cuvântul următor posibil */
  function cliPh(s, mode, c) {
    var R = s.dev === "router", IFN = R ? ["GigabitEthernet", "Serial"] : ["FastEthernet", "GigabitEthernet", "Vlan", "range"];
    var ex = { show: ["running-config", "startup-config", "ip interface brief", "ip ssh", "ip route", "interfaces trunk", "interfaces <interfață>", "interfaces <interfață> switchport", "vlan brief", "version", "history", "flash:", "users", "clock", "mac address-table"], copy: ["running-config startup-config", "startup-config running-config"], configure: ["terminal"], write: ["memory"], ping: ["<A.B.C.D>"], traceroute: ["<A.B.C.D>"], erase: ["startup-config"], reload: [], enable: [], disable: [] };
    var T = {
      user: { show: ex.show, ping: ex.ping, traceroute: ex.ping, enable: [] },
      priv: ex,
      config: { hostname: ["<nume>"], interface: [], ip: ["default-gateway <A.B.C.D>", "domain-name <domeniu>", "domain-lookup", "ssh version 2", "ssh version 1", "ssh time-out <secunde>", "route <rețea> <mască> <next-hop>"], line: R ? ["console 0", "vty 0 4"] : ["console 0", "vty 0 4", "vty 0 15"], enable: ["secret <parolă>", "password <parolă>"], service: ["password-encryption"], banner: ["motd #text#"], crypto: ["key generate rsa", "key generate rsa modulus <360-4096>", "key generate rsa general-keys modulus <360-4096>", "key zeroize rsa"], username: ["<nume> privilege 15 secret <parolă>", "<nume> secret <parolă>", "<nume> password <parolă>"], vlan: R ? null : ["<1-4094>"], no: ["ip domain-lookup", "ip domain-name", "hostname", "enable secret", "username <nume>", "vlan <1-4094>", "service password-encryption", "banner motd"], "do": [] },
      "if": { ip: ["address <A.B.C.D> <MASCĂ>"], switchport: R ? null : ["mode access", "mode trunk", "mode dynamic auto", "mode dynamic desirable", "access vlan <1-4094>", "trunk allowed vlan <listă>", "trunk allowed vlan add <listă>", "trunk native vlan <1-4094>", "nonegotiate"], shutdown: [], description: ["<text>"], encapsulation: R ? ["dot1Q <1-4094>"] : null, no: ["shutdown", "ip address", "switchport", "description"] },
      line: { password: ["<parolă>"], login: ["local"], transport: ["input ssh", "input telnet", "input telnet ssh", "input all", "input none"], "exec-timeout": ["<minute> <secunde>"], logging: ["synchronous"], no: ["login", "password", "transport"] },
      vlan: { name: ["<nume>"], no: ["name"] }
    };
    T["if-range"] = T["if"];
    if (c === "interface") return { ifn: IFN };
    var x = (T[mode] || {})[c]; return x === undefined ? null : x;
  }
  function cliPhMatch(tok, w) { if (w.charAt(0) === "<") return !!tok; return w.toLowerCase().indexOf(tok.toLowerCase()) === 0; }
  function cliNext(s, mode, c, rest, partial) {
    /* rest = cuvinte complete după comandă; partial = cuvântul început (sau "") – întoarce lista de cuvinte posibile + dacă <cr> e valid */
    var ph = cliPh(s, mode, c), res = [], cr = false;
    if (ph && ph.ifn) { if (!rest.length) return { w: ph.ifn.filter(function (n) { return cliPhMatch(partial, n); }).map(function (n) { return n === "range" ? n : n + (n === "Vlan" ? "<1-4094>" : n === "Serial" ? "0/0/0" : "0/<nr>"); }), cr: false, ifn: true }; return { w: [], cr: true }; }
    if (!ph) return { w: [], cr: true };
    if (!ph.length) return { w: [], cr: !rest.length && !partial };
    ph.forEach(function (p) {
      var ws = p.split(" "); if (ws.length < rest.length) return;
      for (var i = 0; i < rest.length; i++) if (!cliPhMatch(rest[i], ws[i])) return;
      if (ws.length === rest.length) { if (!partial) cr = true; return; }
      var nx = ws[rest.length]; if (!partial || cliPhMatch(partial, nx)) { if (res.indexOf(nx) < 0) res.push(nx); }
    });
    return { w: res, cr: cr };
  }
  function cliHelp(s, line) {
    var base = line.replace(/\?$/, ""), tk = base.trim().split(/\s+/).filter(Boolean), list = CMDS[s.mode], sp = /\s$/.test(base) || !tk.length;
    if (!tk.length || (!sp && tk.length === 1)) { var pre = (tk[0] || "").toLowerCase(), r = list.filter(function (x) { return x[0].indexOf(pre) === 0; }).map(function (x) { return "  " + pad(x[0], 16) + x[1]; }); return r.length ? r : ["% Unrecognized command"]; }
    var c = kw(tk[0], list.map(function (x) { return x[0]; })), mode = s.mode;
    if (!c && mode !== "user" && mode !== "priv") { c = kw(tk[0], CMDS.config.map(function (x) { return x[0]; })); mode = "config"; }
    if (!c || c === "?amb") return ["% Unrecognized command"];
    var rest = tk.slice(1), partial = sp ? "" : rest.pop();
    if (c === "do") { if (!rest.length && partial === "" ) return CMDS.priv.map(function (x) { return "  " + pad(x[0], 16) + x[1]; }); var c2 = kw(rest[0] || partial, CMDS.priv.map(function (x) { return x[0]; })); if (!rest.length) return CMDS.priv.filter(function (x) { return x[0].indexOf(partial.toLowerCase()) === 0; }).map(function (x) { return "  " + x[0]; }); if (!c2 || c2 === "?amb") return ["% Unrecognized command"]; c = c2; mode = "priv"; rest = rest.slice(1); }
    var D = { "running-config": "configurația curentă (în RAM, se pierde la oprire)", "startup-config": "configurația salvată (NVRAM, rămâne după reload)", ip: "comenzi IP", interface: "o interfață", interfaces: "interfețele", brief: "tabel scurt", ssh: "SSH (acces securizat de la distanță)", vlan: "VLAN-uri", version: "versiunea IOS", history: "ultimele comenzi", terminal: "configurare de la terminal", memory: "salvează în NVRAM", mode: "modul portului", access: "port de acces (un singur VLAN, pentru PC)", trunk: "port trunk (mai multe VLAN-uri, între switch-uri)", nonegotiate: "oprește DTP", dynamic: "negociere DTP", allowed: "VLAN-urile permise", native: "VLAN-ul fără etichetă", address: "adresa IP și masca", "default-gateway": "poarta implicită (IP-ul routerului)", "domain-name": "numele de domeniu (necesar pentru cheile RSA)", "domain-lookup": "căutare DNS a comenzilor greșite", route: "rută statică", input: "protocoale permise la intrare", local: "verifică utilizatorii creați cu username", secret: "parolă criptată (recomandat)", password: "parolă în clar", privilege: "nivel de privilegiu (15 = maxim)", console: "portul de consolă", vty: "liniile virtuale (SSH/Telnet)", key: "chei criptografice", generate: "generează", rsa: "chei RSA", modulus: "mărimea cheii (1024 sau 2048)", "general-keys": "chei de uz general", "password-encryption": "ascunde parolele în clar", motd: "mesajul zilei", version_: "" };
    var nx = cliNext(s, mode, c, rest, partial), o = nx.w.map(function (w) { return "  " + (D[w] ? pad(w, 18) + D[w] : w); });
    if (nx.cr) o.push("  <cr>");
    return o.length ? o : ["% Unrecognized command"];
  }
  function cliComplete(s, val) {
    val = cliNorm(val); var sp = /\s$/.test(val), tk = val.trim().split(/\s+/).filter(Boolean); if (!tk.length || sp) return val;
    var list = CMDS[s.mode].map(function (x) { return x[0]; });
    function fin(w) { tk[tk.length - 1] = w; return tk.join(" ") + (/(Ethernet|Serial|Vlan)$/.test(w) ? "" : " "); }
    if (tk.length === 1) { var m1 = list.filter(function (x) { return x.indexOf(tk[0].toLowerCase()) === 0; }); if (m1.length === 1) return fin(m1[0]); if (s.mode !== "user" && s.mode !== "priv" && !m1.length) { var m2 = CMDS.config.map(function (x) { return x[0]; }).filter(function (x) { return x.indexOf(tk[0].toLowerCase()) === 0; }); if (m2.length === 1) return fin(m2[0]); } return val; }
    var mode = s.mode, c = kw(tk[0], list); if (!c && mode !== "user" && mode !== "priv") { c = kw(tk[0], CMDS.config.map(function (x) { return x[0]; })); mode = "config"; }
    if (!c || c === "?amb") return val;
    var rest = tk.slice(1, -1), partial = tk[tk.length - 1];
    if (c === "do") { if (!rest.length) { var m3 = CMDS.priv.map(function (x) { return x[0]; }).filter(function (x) { return x.indexOf(partial.toLowerCase()) === 0; }); return m3.length === 1 ? fin(m3[0]) : val; } c = kw(rest[0], CMDS.priv.map(function (x) { return x[0]; })); if (!c || c === "?amb") return val; mode = "priv"; rest = rest.slice(1); }
    var nx = cliNext(s, mode, c, rest, partial);
    if (nx.ifn) { var mi = (cliPh(s, mode, "interface").ifn).filter(function (n) { return n.toLowerCase().indexOf(partial.toLowerCase()) === 0; }); return mi.length === 1 ? fin(mi[0]) : val; }
    var real = nx.w.filter(function (w) { return w.charAt(0) !== "<"; });
    return real.length === 1 && nx.w.length === 1 ? fin(real[0]) : val;
  }
  /* Decodare cuvânt cu cuvânt a comenzilor (pentru începători) */
  var DEC = { enable: "activează (drepturile de șef)", en: "prescurtare de la enable", configure: "configurează / setează", conf: "prescurtare de la configure", terminal: "de aici, de la tastatură", t: "prescurtare de la terminal", hostname: "numele aparatului", interface: "port (priză de rețea)", "int": "prescurtare de la interface", vlan: "rețea virtuală separată (VLAN)", name: "nume", exit: "ieși (un nivel)", end: "gata, înapoi la #", ip: "adresa de internet (IP)", address: "adresă", "no": "NU / anulează", shutdown: "oprit", shut: "prescurtare de la shutdown", switchport: "setarea portului de switch", mode: "modul de lucru", access: "acces (un singur VLAN, pentru un PC)", trunk: "magistrală (duce mai multe VLAN-uri)", allowed: "permise", native: "nativ (fără etichetă)", add: "adaugă", "default-gateway": "poarta implicită = IP-ul routerului", "domain-name": "nume de domeniu (ca sts.ro)", "domain-lookup": "căutarea numelor (DNS)", username: "nume de utilizator", privilege: "nivel de drepturi", secret: "parolă criptată", password: "parolă", crypto: "criptografie (lacăte)", key: "cheie", generate: "generează", rsa: "tipul de cheie RSA", modulus: "mărimea cheii", ssh: "SSH = acces securizat de la distanță", version: "versiunea", line: "linie de acces", console: "consola (cablul albastru)", vty: "linii virtuale (acces de la distanță)", transport: "transport / ce protocol are voie", input: "la intrare", login: "cere autentificare", local: "din lista locală de utilizatori", service: "serviciu", "password-encryption": "criptarea parolelor", banner: "afiș", motd: "mesajul zilei", show: "arată", "running-config": "setările de acum (în RAM)", "startup-config": "setările salvate (rămân la repornire)", copy: "copiază", write: "scrie / salvează", brief: "pe scurt", interfaces: "porturile", ping: "testează dacă răspunde", reload: "repornește", disable: "renunță la drepturile de șef", encapsulation: "împachetare (ce etichetă pun pe cadre)", dot1q: "standardul 802.1Q (eticheta VLAN)", nonegotiate: "nu mai negocia", dynamic: "dinamic (negociază singur)", desirable: "dorește trunk", ipconfig: "arată setările IP din Windows", "/all": "tot, inclusiv adresa MAC", "-l": "login = cu utilizatorul…", range: "un grup de porturi" };
  function decode(c) {
    if (!c) return "";
    var w = c.split(/\s+/), o = [];
    w.forEach(function (x) { var lx = x.toLowerCase(), d = DEC[lx]; if (!d) { if (/^(fa|f|fastethernet)\d/.test(lx)) d = "portul FastEthernet (100 Mb/s) nr. " + lx.replace(/^\D+/, ""); else if (/^(gi|g|gigabitethernet)\d/.test(lx)) d = "portul Gigabit (1000 Mb/s) nr. " + lx.replace(/^\D+/, ""); else if (/^\d+\.\d+\.\d+\.\d+$/.test(lx)) d = /^255\./.test(lx) ? "masca (ce parte e „strada”)" : "adresa IP"; else if (/^\d+$/.test(lx)) d = "numărul " + lx; } if (d) o.push("<b>" + esc(x) + "</b> = " + esc(d)); });
    return o.length ? '<div class="dec small">🔤 Cuvânt cu cuvânt: ' + o.join(" · ") + "</div>" : "";
  }
  /* ===== Ajutor pas cu pas pentru sarcinile din terminal ===== */
  var TW = {
    enable: "Promptul cu > e holul: doar te uiți. enable e cheia: cu # poți umbla la tot.",
    "configure terminal": "Deschizi caietul de setări. Promptul primește (config).",
    end: "Liftul direct la # (modul privilegiat). Acolo merg show și copy.",
    exit: "Ieși o treaptă mai sus, ca din cameră pe hol.",
    "copy running-config startup-config": "Copiezi configurația de pe tablă (RAM, se șterge la oprire) în caiet (NVRAM, rămâne).",
    "#save": "Switch-ul întreabă numele fișierului [startup-config]. E deja bine: apasă doar Enter.",
    "#rsa": "Switch-ul întreabă cât de mare e cheia. Scrie 1024 (minim 768 pentru SSH versiunea 2).",
    hostname: "Pui numele pe echipament, ca o etichetă. Se vede imediat în prompt.",
    "enable secret": "Lacăt criptat pe modul #: data viitoare enable cere parola.",
    "line console 0": "Intri pe „ușa din spate” (cablul albastru de consolă).",
    "line vty 0 15": "Intri pe cele 16 linii de acces de la distanță (SSH/Telnet).",
    password: "Parola liniei pe care ești.",
    login: "Activezi cererea parolei, altfel parola stă degeaba.",
    "login local": "Paznicul verifică numele și parola din lista făcută cu username.",
    "service password-encryption": "Ascunde parolele scrise în clar din show run.",
    banner: "Afișul de pe ușă: textul stă între două # (același semn la capete).",
    interface: "Alegi o singură „priză” (port) ca s-o setezi. Promptul devine (config-if).",
    "ip address": "Adresa IP + masca: adresa de pe cutia poștală a echipamentului.",
    "no shutdown": "Ridici întrerupătorul: portul pornește (pe router și pe interface vlan porturile pornesc oprite).",
    vlan: "Creezi un VLAN, ca un etaj separat în bloc. Promptul devine (config-vlan).",
    name: "Numele VLAN-ului, un singur cuvânt (doar o etichetă pentru oameni).",
    "switchport mode access": "Port de acces = ușa unui apartament: un singur VLAN (pentru un PC).",
    "switchport access vlan": "Spui ușii la ce etaj (VLAN) duce.",
    "switchport mode trunk": "Trunk = scara blocului: duce toate VLAN-urile, fiecare cadru cu eticheta 802.1Q.",
    "switchport trunk allowed vlan": "Lista VLAN-urilor care au voie pe trunk (fără spații după virgulă).",
    "switchport trunk allowed vlan add": "add = ADAUGI la listă. Fără add ai înlocui lista și ai tăia VLAN 10 și 20!",
    "switchport trunk native vlan": "VLAN-ul nativ merge fără etichetă. Trebuie la fel la ambele capete.",
    "switchport trunk encapsulation dot1q": "Pe 3560 alegi întâi tipul de etichetă (802.1Q). Pe 2960 comanda nu există.",
    "switchport mode dynamic desirable": "DTP desirable = portul „cere” singur trunk de la vecin.",
    "switchport nonegotiate": "Oprește DTP: portul rămâne trunk fix, fără negociere.",
    "ip default-gateway": "Ușa de ieșire din rețea: IP-ul routerului.",
    "ip domain-name": "Numele de domeniu: fără el switch-ul nu face cheile RSA.",
    "crypto key generate rsa": "Faci lacătul și cheia pentru SSH (cere hostname + domain-name înainte).",
    username: "Creezi un cont: nume + parolă (secret = criptată).",
    "ip ssh version 2": "Folosești doar SSH versiunea 2, cea sigură.",
    "transport input ssh": "Pe liniile vty intră doar SSH (criptat), nu Telnet.",
    "encapsulation dot1Q": "Sub-interfața ascultă cadrele cu eticheta VLAN-ului respectiv.",
    show: "show = te uiți, nu schimbi nimic. Verifici că a mers.",
    ping: "Strigi „ești acolo?”. ! = răspuns, . = nimic (primul . e normal, ARP).",
    "": "Ecranul scrie „Press RETURN to get started!”. RETURN = tasta Enter. Apasă Enter (căsuța goală) ca să „trezești” echipamentul."
  };
  function twFor(c, i, list) {
    if (c === "" && i === 0) return TW[""];
    if (c === "" && i > 0) { var p = list[i - 1]; return /^crypto/.test(p) ? TW["#rsa"] : TW["#save"]; }
    if (/^1024$/.test(c)) return TW["#rsa"];
    var keys = Object.keys(TW).filter(function (k) { return k && k.charAt(0) !== "#" && (c === k || c.indexOf(k + " ") === 0); }).sort(function (a, b) { return b.length - a.length; });
    return keys.length ? TW[keys[0]] : "";
  }
  var SW_IN = ["", "enable", "configure terminal"];
  var TSTEPS = {
    base: SW_IN.concat(["hostname SW1", "enable secret class", "line console 0", "password cisco", "login", "exit", "service password-encryption", "banner motd #Acces autorizat#", "end", "copy running-config startup-config", ""]),
    rtr: SW_IN.concat(["hostname R1", "interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown", "end", "show ip interface brief", "copy running-config startup-config", ""]),
    vlan: SW_IN.concat(["vlan 10", "name ADMIN", "vlan 20", "name TEHNIC", "exit", "interface fa0/1", "switchport mode access", "switchport access vlan 10", "interface fa0/2", "switchport mode access", "switchport access vlan 20", "end", "show vlan brief", "copy running-config startup-config", ""]),
    mgmt: SW_IN.concat(["interface vlan 1", "ip address 192.168.1.2 255.255.255.0", "no shutdown", "exit", "ip default-gateway 192.168.1.1", "enable secret class", "line vty 0 15", "password cisco", "login", "end", "copy running-config startup-config", ""]),
    ssh: SW_IN.concat(["hostname SW1", "vlan 99", "name MGMT", "exit", "interface fa0/1", "switchport mode access", "switchport access vlan 99", "exit", "interface vlan 99", "ip address 192.168.99.2 255.255.255.0", "no shutdown", "exit", "ip default-gateway 192.168.99.1", "ip domain-name sts.ro", "crypto key generate rsa", "1024", "username admin secret Parola123", "ip ssh version 2", "line vty 0 15", "transport input ssh", "login local", "end", "show ip ssh", "copy running-config startup-config", ""]),
    rtr2: SW_IN.concat(["hostname R1", "enable secret class", "interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown", "interface g0/1", "ip address 192.168.2.1 255.255.255.0", "no shutdown", "end", "ping 192.168.2.10", "copy running-config startup-config", ""]),
    trunk: SW_IN.concat(["vlan 10", "name ADMIN", "vlan 20", "name TEHNIC", "exit", "interface fa0/1", "switchport mode access", "switchport access vlan 10", "interface fa0/2", "switchport mode access", "switchport access vlan 20", "interface g0/1", "switchport mode trunk", "end", "show interfaces trunk", "copy running-config startup-config", ""]),
    trunk2: SW_IN.concat(["hostname SW1", "vlan 10", "name ADMIN", "vlan 20", "name TEHNIC", "vlan 99", "name MGMT", "exit", "interface g0/1", "switchport mode trunk", "switchport trunk allowed vlan 10,20,99", "switchport trunk native vlan 99", "end", "show interfaces trunk", "copy running-config startup-config", ""]),
    trunk3: SW_IN.concat(["vlan 10", "name ADMIN", "vlan 20", "name TEHNIC", "exit", "interface g0/1", "switchport trunk encapsulation dot1q", "switchport mode trunk", "switchport trunk allowed vlan 10,20", "end", "show interfaces trunk", "copy running-config startup-config", ""]),
    trunkfix: SW_IN.concat(["interface g0/1", "switchport trunk allowed vlan add 30", "end", "show interfaces trunk", "copy running-config startup-config", ""]),
    dtp: SW_IN.concat(["vlan 10", "exit", "interface g0/1", "switchport mode dynamic desirable", "interface g0/2", "switchport mode trunk", "switchport nonegotiate", "interface fa0/1", "switchport mode access", "switchport access vlan 10", "end", "show interfaces gi0/2 switchport", "copy running-config startup-config", ""]),
    roas: SW_IN.concat(["interface g0/0", "no shutdown", "interface g0/0.10", "encapsulation dot1Q 10", "ip address 192.168.10.1 255.255.255.0", "interface g0/0.20", "encapsulation dot1Q 20", "ip address 192.168.20.1 255.255.255.0", "end", "show ip interface brief", "copy running-config startup-config", ""])
  };
  var TBONUS = { trunk3: 1, dtp: 1, roas: 1, trunkfix: 1 };
  function tsKey(s) { var p = s.pend; s.pend = null; var o = JSON.parse(JSON.stringify(s)); s.pend = p; delete o.hist; o.__p = !!p; return JSON.stringify(o); }
  /* referința: rulează pașii pe o stare nouă și reține prompt înainte/după + ieșire */
  function tsRef(T) {
    var L = TSTEPS[T.id]; if (!L) return null; var s = cliNew(T.dev, T.enc3, T.init), r = [];
    L.forEach(function (c, i) { var before = s.pend ? "(întrebare)" : cliPrompt(s), mode = s.mode, out = i === 0 ? [] : cliRun(s, c); r.push({ c: c, pb: i === 0 ? "(ecran gol)" : before, mb: mode, pa: s.pend ? "(întrebare de la echipament)" : cliPrompt(s), out: out.filter(function (l) { return l && !/^\(/.test(l); }).slice(0, 2), why: twFor(c, i, L) }); });
    return r;
  }
  function tsPath(cur, need) {
    var lvl = { user: 0, priv: 1, config: 2 }, a = lvl[cur] !== undefined ? lvl[cur] : 3, b = lvl[need] !== undefined ? lvl[need] : 3;
    if (need === cur) return "";
    if (b === 0) return "disable (sau exit)"; if (b === 1) return a === 0 ? "enable" : "end";
    if (b === 2) return a === 0 ? "enable, apoi configure terminal" : a === 1 ? "configure terminal" : "exit";
    return a <= 1 ? (a === 0 ? "enable, configure terminal, apoi comanda care intră în sub-mod (interface / line / vlan)" : "configure terminal, apoi comanda care intră în sub-mod") : "comanda care intră în sub-modul cerut (vezi pasul anterior)";
  }
  function tsGuideOn() { var v = P.cli && P.cli["opt:guide"]; return v ? v % 10 === 1 : true; }
  function tsGuideSet(on) { P.cli = P.cli || {}; P.cli["opt:guide"] = Date.now() * 10 + (on ? 1 : 2); saveP(); }
  /* ---------- ecran: terminal Cisco simulat ---------- */
  var CLIS = null;
  function vCli(tid) {
    view = "practice"; navbar(true);
    var T = CLI_TASKS.filter(function (x) { return x.id === tid; })[0] || CLI_TASKS[0];
    if (!CLIS || CLIS.tid !== T.id) CLIS = { tid: T.id, s: cliNew(T.dev, T.enc3, T.init), lines: [], hi: -1, done: false, hint: 0, si: 0, ref: tsRef(T) };
    var C = CLIS, s = C.s;
    P.cli = P.cli || {};
    var GON = tsGuideOn() && !!C.ref;
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.term + ' Terminal Cisco IOS (simulat)</h2><p class="muted small">Exersezi exact ce tastezi la proba practică, prin cablul de consolă. Comenzile se pot prescurta (conf t, int g0/0, sh ip int br). Tab completează, ? arată opțiunile.</p>' +
      '<div class="ctask"><b>Sarcina:</b> ' + esc(T.d) + (T.g.length ? '<ul class="goals" id="goals"></ul>' : "") + "</div>" +
      '<div id="cliG"></div>' +
      '<div class="term" id="term" role="log" aria-live="polite"></div>' +
      '<div class="tkeys"><button class="ghost sm" type="button" id="kTab">Tab</button><button class="ghost sm" type="button" id="kQ">?</button><button class="ghost sm" type="button" id="kUp">↑</button><button class="ghost sm" type="button" id="kHint">💡 Indiciu</button><button class="ghost sm" type="button" id="kReset">↺ Reset</button></div>' +
      '<form id="cliF" class="tin" autocomplete="off"><label for="cliI" id="cliP"></label><input id="cliI" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" aria-label="Comandă"></form>' +
      '<div id="cliMsg"></div><h3 class="small">Alege altă sarcină</h3>' +
      '<div class="seg wrap" id="cliT">' + CLI_TASKS.map(function (x) { return '<button data-t="' + x.id + '" class="' + (x.id === T.id ? "on" : "") + '">' + (P.cli[x.id] ? "✓ " : "") + (TBONUS[x.id] ? "⭐ " : "") + esc(x.t) + (TBONUS[x.id] ? " (Bonus)" : "") + "</button>"; }).join("") + "</div>" + (TBONUS[T.id] ? '<p class="small muted">⭐ Bonus: peste ce se cere la examen (CCNA 2). Opțional.</p>' : "") +
      '<div class="gxlad sm"><div><code>&gt;</code><span>holul – <b>enable</b> ↓</span></div><div><code>#</code><span>privilegiat – <b>conf t</b> ↓</span></div><div><code>(config)#</code><span>caietul – <b>interface / line / vlan</b> ↓</span></div><div><code>(config-if)#</code><span>o priză · <b>exit</b> ↑ o treaptă · <b>end</b> → #</span></div></div>' +
      (C.ref ? '<label class="cb"><input type="checkbox" id="gOn"' + (GON ? " checked" : "") + '><span>🧒 Ajutor pas cu pas<small>Îți arăt fiecare comandă, de ce, și promptul corect.</small></span></label>' : "") +
      '<details class="ghostd"><summary>Fițuică: modurile IOS</summary><p class="small">Switch&gt; utilizator → <b>enable</b> → Switch# privilegiat → <b>configure terminal</b> → Switch(config)# global → <b>interface …</b> / <b>line …</b> / <b>vlan …</b> → sub-moduri. <b>exit</b> urcă un nivel, <b>end</b> (Ctrl+Z) te duce direct în #. Comenzile show/copy/ping din config: pune <b>do</b> în față.</p></details></section>';
    app.innerHTML = h;
    C.topo = C.topo || (s.dev === "switch" ? { sw: s, r: null } : { sw: null, r: s }); topoMount(C.topo, "cliF");
    var term = $("term"), inp = $("cliI");
    function add(t, cls) { C.lines.push([t, cls || ""]); if (C.lines.length > 400) C.lines.splice(0, C.lines.length - 400); }
    function paint() {
      term.innerHTML = C.lines.map(function (l) { return '<div class="tline ' + l[1] + (/\S {2,}\S|^-{3,}|^\s+\S.*\s{2,}/.test(l[0]) || /^\s*\^$/.test(l[0]) ? " tpre" : "") + '">' + (esc(l[0]) || "&nbsp;") + "</div>"; }).join("");
      $("cliP").textContent = s.pend ? "" : cliPrompt(s);
      term.scrollTop = term.scrollHeight;
      if (T.g.length) {
        var allOk = true;
        $("goals").innerHTML = T.g.map(function (g) { var ok = false; try { ok = !!g[1](s); } catch (e) {} if (!ok) allOk = false; return '<li class="' + (ok ? "ok" : "") + '">' + (ok ? "✓ " : "○ ") + esc(g[0]) + "</li>"; }).join("");
        if (allOk && !C.done) { C.done = true; var first = !P.cli[T.id]; P.cli[T.id] = Date.now(); if (first) { addXP(20); SND.ok(); } saveP(); $("cliMsg").innerHTML = '<div class="fact tok"><b>✅ Sarcină îndeplinită' + (first ? " · +20 XP" : "") + '</b><br>Exact asta verifică examinatorul: show running-config / show ip interface brief și că ai salvat (după reload configurația rămâne).</div>'; }
      }
    }
    if (!C.lines.length) { add(s.dev === "router" ? "Cisco 1941 – consolă 9600 8N1 (simulat)" : "Cisco Catalyst 2960 – consolă 9600 8N1 (simulat)", "thint"); add("Press RETURN to get started!"); add("💡 Primul pas: apasă Enter (RETURN = Enter), cu căsuța goală.", "thint"); add(""); }
    function gPaint() {
      var G = $("cliG"); if (!G) return; if (!GON) { G.innerHTML = ""; return; }
      var R = C.ref, i = C.si, st = R[i];
      if (!st) { G.innerHTML = '<div class="fact tok"><b>✅ Toți pașii sunt făcuți.</b> Bifează mai jos ce verifică examinatorul. Poți apăsa ↺ Reset și să încerci cu ajutorul oprit.</div>'; return; }
      G.innerHTML = '<div class="gxstep"><div class="small muted">Pasul ' + (i + 1) + " din " + R.length + '</div><div class="gxbar"><i style="width:' + Math.round(100 * i / R.length) + '%"></i></div>' +
        '<div class="small">⌨️ Tastează (atinge ca să-l pun în căsuță):</div><button type="button" class="gchip" id="gChip">' + esc(st.c === "" ? "⏎ Enter (căsuța goală)" : st.c) + '</button>' +
        decode(st.c) + '<p class="small">🧒 ' + esc(st.why) + '</p><div class="gxpr small">Trebuie să fii la: <code>' + esc(st.pb) + '</code> → după: <code>' + esc(st.pa) + "</code></div>" + (st.out.length ? '<div class="small muted">Ce o să vezi: <code>' + esc(st.out.join(" · ").slice(0, 120)) + "</code></div>" : "") + '<div id="gFb"></div></div>';
      $("gChip").onclick = function () { inp.value = st.c; inp.focus(); };
    }
    function gStep(v, sn, expK, mb) {
      if (!GON) return; var R = C.ref, st = R[C.si]; if (!st) return;
      var vv = v.trim(), ok = C.si === 0 ? !vv : (tsKey(s) === expK);
      if (/\?$/.test(vv)) return;
      if (ok) { C.si++; }
      else {
        while (C.si > 0 && R[C.si]) { var sn2 = gxSnap(s), k0 = tsKey(s); try { cliRun(s, R[C.si].c); } catch (e) {} var k1 = tsKey(s); gxRest(s, sn2); if (k0 === k1 && !/^(show|ping|copy)/.test(R[C.si].c)) C.si++; else break; }
        if (C.si === 0 && vv) C.si = 1;
      }
      gPaint();
      var fbx = $("gFb"); if (!fbx || ok) { if (ok) add("✓ Pasul " + C.si + " făcut.", "thint"); return; }
      var cur = R[C.si]; if (!cur) return;
      var path = s.mode !== cur.mb ? tsPath(s.mode, cur.mb) : "";
      fbx.innerHTML = '<div class="fact tbad small"><b>✗ Nu e comanda din pasul acesta.</b> ' + (path ? "Ești în <code>" + esc(cliPrompt(s)) + "</code>, dar pasul se face în <code>" + esc(cur.pb) + "</code>. Ca să ajungi acolo tastează: <b>" + esc(path) + "</b>." : "Tastează exact: <code>" + esc(cur.c || "Enter") + "</code> (atinge butonul galben).") + "</div>";
    }
    paint(); gPaint();
    if ($("gOn")) $("gOn").onchange = function () { GON = this.checked; tsGuideSet(GON); gPaint(); };
    function exec(v) {
      v = cliNorm(v);
      var gsn = null, gexp = null, gmb = s.mode; if (GON && C.ref && C.ref[C.si] && C.si > 0 && !/\?$/.test(v.trim())) { gsn = gxSnap(s); try { cliRun(s, C.ref[C.si].c); } catch (e) {} gexp = tsKey(s); gxRest(s, gsn); }
      var pr = s.pend ? "" : cliPrompt(s);
      add(pr + (s.pend && /parola|Password/i.test(C.lines[C.lines.length - 1][0]) ? "" : v));
      if (v.trim() && !s.pend) { s.hist.push(v.trim()); C.hi = -1; }
      var out = []; try { out = cliRun(s, v); } catch (e) { out = ["% Eroare internă a simulatorului"]; }
      out.forEach(function (l) { add(l, /^%(?!SYS|LINK|LINEPROTO|SSH| Generating| You already)|^\s*\^$/.test(l) ? "terr" : /^\(|^%LINK|^%LINEPROTO|^%SYS/.test(l) ? "thint" : ""); });
      if (out.some(function (l) { return /Invalid input|Incomplete|Ambiguous|Unknown command/.test(l); })) { var tip = cliTip(s, v); if (tip) add("💡 " + tip, "thint"); }
      if (GON && C.ref) gStep(v, gsn, gexp, gmb);
      paint();
    }
    $("cliF").onsubmit = function (e) { e.preventDefault(); var v = inp.value; inp.value = ""; exec(v); inp.focus(); };
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Tab") { e.preventDefault(); inp.value = cliComplete(s, inp.value); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (s.hist.length) { C.hi = C.hi < 0 ? s.hist.length - 1 : Math.max(0, C.hi - 1); inp.value = s.hist[C.hi]; } }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (C.hi >= 0) { C.hi++; if (C.hi >= s.hist.length) { C.hi = -1; inp.value = ""; } else inp.value = s.hist[C.hi]; } }
      else if (e.key === "?") { e.preventDefault(); exec(inp.value + "?"); inp.value = inp.value; }
    });
    $("kTab").onclick = function () { inp.value = cliComplete(s, inp.value); inp.focus(); };
    $("kQ").onclick = function () { exec(inp.value + "?"); inp.focus(); };
    $("kUp").onclick = function () { if (s.hist.length) { C.hi = C.hi < 0 ? s.hist.length - 1 : Math.max(0, C.hi - 1); inp.value = s.hist[C.hi]; } inp.focus(); };
    $("kHint").onclick = function () {
      var g = T.g.filter(function (x) { try { return !x[1](s); } catch (e) { return true; } })[0];
      add("💡 " + (g ? g[2] + "   (ești în: " + cliPrompt(s) + ")" : T.g.length ? "Toate obiectivele sunt bifate." : "Mod liber: încearcă enable, configure terminal, ? pentru listă."), "thint"); paint(); inp.focus();
    };
    $("kReset").onclick = function () { if (!confirm("Începi de la zero? Pierzi comenzile date în acest terminal.")) return; CLIS = null; vCli(T.id); };
    Array.prototype.forEach.call(app.querySelectorAll("#cliT button"), function (b) { b.onclick = function () { CLIS = null; vCli(b.getAttribute("data-t")); }; });
    $("backBtn").onclick = function () { go("practice"); };
  }
  function cliTip(s, v) {
    v = cliNorm(v).replace(/^\s*[A-Za-z][\w.-]{0,40}(\((config[a-z-]*)\))?\s?[>#]\s*(?=\S)/, "");
    var w = (v.trim().split(/\s+/)[0] || "").toLowerCase(), m = s.mode;
    var cfgOnly = ["hostname", "interface", "int", "line", "vlan", "banner", "service", "ip"], exOnly = ["show", "sh", "copy", "write", "wr", "reload", "ping"];
    if ((m === "user" || m === "priv") && cfgOnly.some(function (x) { return w === x || (x.length > 3 && x.indexOf(w) === 0 && w.length > 2); })) return m === "user" ? "Comanda e de configurare: mai întâi enable, apoi configure terminal." : "Comanda e de configurare: intră cu configure terminal (conf t).";
    if (m === "user" && /^(conf|configure|copy|wr|reload)/.test(w)) return "Ești în modul utilizator (>). Tastează enable ca să ajungi la #.";
    if (m !== "user" && m !== "priv" && exOnly.some(function (x) { return w === x; })) return "În modurile de configurare pune do în față: do " + v.trim() + " – sau ieși cu end.";
    if (m === "config" && /^(shut|shutdown|switchport|password|login|name)/.test(w)) return "Comanda aceasta merge într-un sub-mod (interface / line / vlan). Ești în (config)#.";
    if (/^(ipconfig|tracert|cls|nslookup|netsh)$/.test(w)) return "Aceasta e comandă de Windows (cmd), nu de Cisco IOS.";
    var lw = cliNorm(v).trim().toLowerCase().replace(/\s+/g, " ");
    if ((m === "user" || m === "priv") && /^(end|exit)$/.test(w)) return m === "priv" ? "Ești deja în modul privilegiat (#). end/exit se folosesc în modurile de configurare." : "";
    if (/^(int|interface|interf)\b/.test(w) || /^int/.test(w)) {
      if (s.dev === "switch" && /(g|gi|gig\w*)\s*0\/0\b/.test(lw)) return "Pe switch-ul 2960 nu există Gi0/0: porturile sunt Fa0/1 … Fa0/24 și Gi0/1, Gi0/2. Vezi lista cu show ip interface brief.";
      if (s.dev === "router" && /(g|gi|gig\w*)\s*0\/0\/\d/.test(lw)) return "Routerul din simulator e un Cisco 1941: porturile sunt Gi0/0 și Gi0/1. (Pe un ISR 4321 ar fi Gi0/0/0 – la examen verifici numele cu show ip interface brief.)";
      if (s.dev === "router" && /\bf(a|ast\w*)?\s*0\//.test(lw)) return "Routerul acesta are porturi Gigabit: Gi0/0 și Gi0/1 (nu Fa). Vezi show ip interface brief.";
      if (/\d\s*\/\s+\d/.test(lw) || /\d\s+\/\d/.test(lw)) return "Scrie numărul portului lipit: fa0/1 (fără spațiu în jurul „/”).";
      return "Exemple corecte: interface fa0/1 · interface gi0/1 · interface vlan 10 · interface range fa0/1 - 10.";
    }
    if (/^ip address/.test(lw.replace(/^ip add\w*/, "ip address")) && /\//.test(lw)) return "Masca se scrie cu cifre: ip address 192.168.10.2 255.255.255.0 (nu /24).";
    if (w === "hostname" && /["'„”]/.test(v)) return "Fără ghilimele: hostname S1";
    if (s.dev === "router" && /^(vl|vla|vlan|sw|swi|switchport)/.test(w) && w !== "switch") return "Comanda e de switch. Pe router VLAN-urile se fac cu sub-interfețe (interface g0/0.10 + encapsulation dot1Q 10).";
    if (m === "line" && /^(ip|hostname|username|crypto)/.test(w)) return "";
    if (m === "vlan" && /^name/.test(w)) return "Numele VLAN-ului: un singur cuvânt, ex. name MGMT.";
    return "";
  }

  /* ================= PRACTIC PAS CU PAS DE LA ZERO (exerciții ghidate pe simulatorul Cisco) ================= */
  /* Progres: P.cli["gx:<id>:<nivel>"] = timp (merge = max, sincronizat în cont). */
  function gxM(m) { return function (s) { return s.mode === m; }; }
  var GXB = {
    en: { c: "enable", sh: "en", goal: "Intră în modul privilegiat", why: "Switch> e holul blocului: doar te uiți. enable e cheia de la apartament: cu # poți umbla la tot.", ok: gxM("priv") },
    conf: { c: "configure terminal", sh: "conf t", goal: "Intră în configurarea globală", why: "conf t = deschizi caietul de setări al echipamentului. Promptul primește (config).", ok: gxM("config") },
    host: function (n) { return { c: "hostname " + n, goal: "Dă echipamentului numele " + n, why: "Ca o etichetă cu numele pe ușă. Se schimbă imediat și în prompt.", ok: function (s) { return s.host === n; }, fin: 1 }; },
    exit: function (m, why) { return { c: "exit", goal: "Ieși un nivel mai sus", why: why || "exit = urci o treaptă pe scară, ca atunci când ieși dintr-o cameră înapoi pe hol.", ok: gxM(m || "config") }; },
    end: { c: "end", goal: "Întoarce-te direct în modul privilegiat (#)", why: "end = liftul direct la parter (#), oricât de sus ai fi. Acolo merg comenzile show și copy.", ok: gxM("priv") },
    dom: { c: "ip domain-name sts.ro", goal: "Setează numele de domeniu sts.ro", why: "Cheia SSH primește numele „S1.sts.ro”, ca o adresă completă. Fără domeniu, switch-ul refuză să facă cheia.", ok: function (s) { return s.dom === "sts.ro"; }, fin: 1 },
    user: { c: "username admin privilege 15 secret cisco123", goal: "Creează utilizatorul admin cu parola cisco123", why: "Ca un cont pe telefon: nume + parolă. privilege 15 = șef, intră direct cu #. secret = parola se păstrează criptată.", ok: function (s) { var u = s.users.admin; return !!u && u.p === "cisco123"; }, fin: 1, b: "secret" },
    vlan: function (n, nm) { return [{ c: "vlan " + n, goal: "Creează VLAN-ul " + n, why: "Un VLAN e ca un etaj separat în același bloc: cine e la etajul " + n + " vorbește doar cu vecinii de etaj.", ok: function (s) { return s.mode === "vlan" && s.ctx === n; } }, { c: "name " + nm, goal: "Dă-i VLAN-ului numele " + nm, why: "Numele e doar o etichetă pentru oameni (un singur cuvânt). Se vede în show vlan brief.", ok: function (s) { return s.vlans[n] === nm; }, fin: 1 }]; },
    acc: function (p, n) { var N = ifName(p); return [{ c: "interface " + p, goal: "Intră pe portul " + N, why: "Alegi o singură priză din switch ca s-o setezi. Promptul devine (config-if).", ok: function (s) { return s.mode === "if" && s.ctx[0] === N; } }, { c: "switchport mode access", goal: "Fă portul " + N.replace("FastEthernet", "Fa").replace("GigabitEthernet", "Gi") + " de acces", why: "Port access = ușa unui apartament: duce într-un singur VLAN.", ok: function (s) { return s.ifs[N].mode === "access"; }, fin: 1 }, { c: "switchport access vlan " + n, goal: "Pune portul " + N.replace("FastEthernet", "Fa").replace("GigabitEthernet", "Gi") + " în VLAN " + n, why: "Îi spui ușii la ce etaj duce: etajul (VLAN) " + n + ".", ok: function (s) { return s.ifs[N].vlan === n; }, fin: 1 }]; },
    svi: function (n, ip) { var N = "Vlan" + n; return [{ c: "interface vlan " + n, goal: "Intră pe interfața virtuală a VLAN-ului " + n, why: "Switch-ul nu are IP pe porturi. Primește IP pe o „priză virtuală” a VLAN-ului, ca o cutie poștală a clădirii.", ok: function (s) { return s.mode === "if" && s.ctx[0] === N; } }, { c: "ip address " + ip + " 255.255.255.0", goal: "Pune adresa " + ip + " cu masca 255.255.255.0", why: "Adresa IP e adresa de pe cutia poștală: așa te găsește laptopul. Masca 255.255.255.0 = aceeași stradă (/24).", ok: function (s) { return s.ifs[N] && s.ifs[N].ip === ip && s.ifs[N].mask === "255.255.255.0"; }, fin: 1, b: "address" }, { c: "no shutdown", sh: "no shut", goal: "Pornește interfața", why: "Interfețele VLAN pornesc oprite (shutdown). no shutdown = ridici întrerupătorul.", ok: function (s) { return s.ifs[N] && !s.ifs[N].shut; }, fin: 1 }]; },
    gw: { c: "ip default-gateway 192.168.10.1", goal: "Setează poarta implicită (routerul) 192.168.10.1", why: "Gateway = ușa de ieșire din cartier. Pe acolo pleacă switch-ul spre alte rețele (spre router).", ok: function (s) { return s.gw === "192.168.10.1"; }, fin: 1, b: "default-gateway" },
    rsa: [{ c: "crypto key generate rsa", goal: "Generează cheile RSA pentru SSH", why: "Cheile RSA sunt lacătul și cheia pentru SSH: fără ele nu există conexiune criptată. Merge doar după hostname + domain-name.", ok: function (s) { return !!s.pend || s.rsa >= 768; }, b: "rsa" }, { c: "1024", pend: 1, goal: "Alege mărimea cheii: 1024 de biți", why: "Switch-ul întreabă cât de mare să fie cheia. Minim 768 pentru SSH versiunea 2, la examen pui 1024.", ok: function (s) { return s.rsa >= 768; }, fin: 1 }],
    sshv: { c: "ip ssh version 2", goal: "Folosește SSH versiunea 2", why: "Versiunea 2 e cea sigură. Versiunea 1 are găuri de securitate.", ok: function (s) { return s.sshv === 2; }, fin: 1, b: "version" },
    vty: [{ c: "line vty 0 15", goal: "Intră pe liniile de acces de la distanță (vty 0–15)", why: "VTY = cele 16 „telefoane” prin care te poți suna de la distanță (SSH/Telnet). Le setezi pe toate odată.", ok: function (s) { return s.mode === "line" && s.ctx === "vty"; } }, { c: "transport input ssh", goal: "Permite doar SSH pe aceste linii", why: "Lași să intre doar cine vine cu SSH (criptat). Telnet (necriptat) rămâne pe dinafară.", ok: function (s) { return /ssh/.test(s.line.vty.tin) && !/telnet|all/.test(s.line.vty.tin); }, fin: 1, b: "ssh" }, { c: "login local", goal: "Cere utilizator și parolă din lista locală", why: "login local = paznicul verifică numele și parola în lista făcută cu username (admin / cisco123).", ok: function (s) { return s.line.vty.login && s.line.vty.local; }, fin: 1, b: "local" }],
    save: [{ c: "copy running-config startup-config", sh: "copy run start  (sau wr)", goal: "Salvează configurația", why: "running-config e o tablă scrisă cu cretă (RAM): la oprire se șterge. startup-config e caietul (NVRAM): rămâne. Copiezi de pe tablă în caiet.", ok: function (s) { return !!s.pend || (s.saved && cfgEq(s)); }, b: "startup-config" }, { c: "", pend: 1, goal: "Confirmă numele fișierului: apasă doar Enter", why: "Switch-ul întreabă „Destination filename [startup-config]?”. Ce e în paranteze e deja bine: doar Enter (lasă căsuța goală).", ok: function (s) { return s.saved && cfgEq(s); }, fin: 1 }]
  };
  function gxCat() { var r = []; Array.prototype.forEach.call(arguments, function (x) { r = r.concat(x); }); return r; }
  var GX_SW_SSH = ["en", "conf t", "hostname S1", "ip domain-name sts.ro", "username admin privilege 15 secret cisco123", "vlan 10", "name MGMT", "exit", "int fa0/1", "switchport mode access", "switchport access vlan 10", "exit", "int gi0/1", "switchport mode access", "switchport access vlan 10", "exit", "int vlan 10", "ip address 192.168.10.2 255.255.255.0", "no shut", "exit", "ip default-gateway 192.168.10.1", "crypto key generate rsa modulus 1024", "ip ssh version 2", "line vty 0 15", "transport input ssh", "login local", "end", "copy run start", ""];
  var GX = [
    { id: "con", ic: "🔌", t: "1. Te conectezi la switch: cablul albastru + PuTTY", d: "Înainte de orice comandă: cablul de consolă, portul COM din Device Manager și setările PuTTY (9600).", steps: [
      { k: "ch", q: "Cu ce cablu te legi de la laptop la switch ca să-l configurezi prima dată?", o: ["Cablul de consolă rollover, în portul CONSOLE", "Un cablu UTP drept, în portul Fa0/1 din față", "Un cablu de fibră, în portul Gi0/1 de uplink", "Cablul de alimentare, în spatele switch-ului"], why: "Un switch nou nu are IP, deci nu-l poți accesa prin rețea. Cablul de consolă e ca o „sârmă directă” până la creierul lui. La laptop intră în USB (adaptor USB–serial) sau în portul serial." },
      { k: "ch", q: "Unde vezi pe laptop ce port COM a primit cablul de consolă?", o: ["Device Manager → Ports", "Control Panel → Sound", "Task Manager → Performance", "Settings → Bluetooth & devices"], why: "Device Manager (Win+X → Device Manager) → Ports (COM & LPT) → ex. „USB Serial Port (COM3)”. Numărul COM poate fi altul pe laptopul de la examen (COM3, COM4…): îl citești de acolo." },
      { k: "ch", q: "În PuTTY, ce alegi la Connection type?", o: ["Serial", "SSH", "Telnet", "Raw"], why: "Consola e o legătură serială. SSH și Telnet sunt prin rețea și le folosești DUPĂ ce switch-ul are IP." },
      { k: "ch", q: "Ce scrii la „Serial line”, dacă Device Manager arată USB Serial Port (COM3)?", o: ["COM3", "COM1", "192.168.10.2", "9600"], why: "Scrii exact portul văzut în Device Manager. Dacă scrii alt COM, PuTTY dă eroare „Unable to open connection”." },
      { k: "ch", q: "Ce viteză (Speed) pui pentru consola Cisco?", o: ["9600", "115200", "1000", "100"], why: "Consola Cisco: 9600 biți/s, 8 biți de date, fără paritate, 1 bit de stop, fără flow control (9600 8N1). Ține minte: „9600 ca anul nouă-șase-zero-zero”." },
      { k: "ch", q: "Ai apăsat Open și fereastra e neagră, goală. Ce faci?", o: ["Apeși Enter o dată sau de două ori", "Închizi și repornești laptopul", "Scoți cablul de alimentare al switch-ului", "Tastezi parola de Windows"], why: "Switch-ul așteaptă un Enter („Press RETURN to get started”). După Enter apare promptul Switch> și poți începe." },
      { k: "ch", q: "Apare: „Would you like to enter the initial configuration dialog? [yes/no]:”. Ce răspunzi?", o: ["no (și Enter)", "yes (și Enter)", "Închizi PuTTY", "Scrii enable"], why: "Dialogul inițial e un asistent lung. La examen răspunzi no și configurezi tu cu comenzi. Dacă apare „terminate autoinstall? [yes]” apeși Enter." }
    ] },
    { id: "lad", ic: "🪜", t: "2. Scara promptului: >  #  (config)#  (config-if)#", d: "Înveți să urci și să cobori între moduri. Asta e 80% din „de ce îmi dă eroare”.", steps: [
      GXB.en, GXB.conf,
      { c: "interface fa0/1", sh: "int fa0/1", goal: "Intră pe portul FastEthernet 0/1", why: "Din caietul general (config) deschizi pagina unei singure prize: (config-if).", ok: function (s) { return s.mode === "if"; } },
      GXB.exit("config", "exit = închizi pagina prizei și te întorci la caietul general (config)."),
      { c: "line vty 0 15", goal: "Intră pe liniile de acces la distanță", why: "Alt „sertar” al caietului: liniile (config-line).", ok: function (s) { return s.mode === "line"; } },
      GXB.end,
      { c: "show running-config", sh: "sh run", goal: "Uită-te la toată configurația curentă", why: "show = te uiți fără să schimbi nimic. Merge din # (din config doar cu do în față).", ok: function (s) { return s.did.srun; } },
      { c: "disable", goal: "Coboară înapoi în modul utilizator (>)", why: "disable = încui apartamentul și ieși pe hol (>).", ok: gxM("user") },
      { c: "?", help: 1, goal: "Cere ajutor: vezi ce comenzi există aici", why: "? e prietenul tău: arată ce poți scrie în locul în care ești. Merge și după un cuvânt: show ?", ok: function () { return true; } }
    ] },
    { id: "baz", ic: "🧱", t: "3. Configurarea de bază a switch-ului", d: "Nume, parole, mesaj de avertizare și salvare. Fiecare pas îți arată ce să tastezi.", steps: gxCat(GXB.en, GXB.conf, GXB.host("S1"),
      { c: "no ip domain-lookup", goal: "Oprește căutarea DNS la comenzi greșite", why: "Fără asta, o greșeală de tastare în > sau # te blochează ~30 s („Translating…”), switch-ul crede că e numele unui calculator.", ok: function (s) { return !s.lookup; }, fin: 1, b: "domain-lookup" },
      { c: "enable secret class", goal: "Pune parola class pentru enable", why: "Lacăt pe ușa apartamentului: data viitoare enable îți cere parola. secret = criptată.", ok: function (s) { return s.secret === "class"; }, fin: 1, b: "secret" },
      { c: "line console 0", sh: "line con 0", goal: "Intră pe linia de consolă", why: "Consola e „ușa din spate” prin cablul albastru. O încui și pe ea.", ok: function (s) { return s.mode === "line" && s.ctx === "con"; } },
      { c: "password cisco", goal: "Parola consolei: cisco", why: "Parola pe care o cere switch-ul când cineva se conectează cu cablul de consolă.", ok: function (s) { return s.line.con.pw === "cisco"; }, fin: 1 },
      { c: "login", goal: "Activează cererea parolei pe consolă", why: "Fără login, parola există dar nu e cerută, ca un lacăt atârnat lângă ușă.", ok: function (s) { return s.line.con.login; }, fin: 1 },
      GXB.exit("config"),
      { c: "service password-encryption", goal: "Ascunde parolele scrise în clar", why: "În show run, parolele în clar (cisco) devin un cod (7 …). Ca să nu le citească cine trece pe lângă ecran.", ok: function (s) { return s.enc; }, fin: 1, b: "password-encryption" },
      { c: "banner motd #Acces interzis#", goal: "Pune mesajul de avertizare „Acces interzis”", why: "Afișul de pe ușă. Textul stă între două semne # (același semn la început și la sfârșit).", ok: function (s) { return !!s.banner; }, fin: 1, b: "motd" },
      GXB.end, GXB.save) },
    { id: "vln", ic: "🏢", t: "4. VLAN 10 + IP de management pe switch", d: "Creezi VLAN 10, pui portul laptopului în el și dai switch-ului IP pe interface vlan 10.", steps: gxCat(GXB.en, GXB.conf, GXB.vlan(10, "MGMT"), GXB.exit("config"), GXB.acc("fa0/1", 10), GXB.exit("config"), GXB.svi(10, "192.168.10.2"), GXB.exit("config"), GXB.gw, GXB.end,
      { c: "show vlan brief", sh: "sh vlan br", goal: "Verifică: VLAN 10 există și Fa0/1 e în el", why: "Lista etajelor și cine locuiește la fiecare. Caută rândul 10 MGMT … Fa0/1.", ok: function (s) { return s.did.svb; } },
      { c: "show ip interface brief", sh: "sh ip int br", goal: "Verifică: Vlan10 are IP-ul și e up/up", why: "Tabelul cu toate porturile, IP-urile și starea. Vlan10: 192.168.10.2 … up up.", ok: function (s) { return s.did.sipib; } }, GXB.save) },
    { id: "ssh", ic: "🔐", t: "5. SSH pe switch cu VLAN (punctul de la examen)", d: "Secvența completă: nume, domeniu, utilizator, VLAN + IP, chei RSA, SSH v2, line vty, salvare.", steps: gxCat(GXB.en, GXB.conf, GXB.host("S1"), GXB.dom, GXB.user, GXB.vlan(10, "MGMT"), GXB.exit("config"), GXB.acc("fa0/1", 10), GXB.exit("config"), GXB.svi(10, "192.168.10.2"), GXB.exit("config"), GXB.gw, GXB.rsa, GXB.sshv, GXB.vty, GXB.end,
      { c: "show ip ssh", goal: "Verifică: SSH Enabled - version 2.0", why: "Te uiți dacă „lacătul” SSH e pus. Trebuie să scrie SSH Enabled - version 2.0.", ok: function (s) { return s.did.sssh; } }, GXB.save) },
    { id: "rtr", ic: "🧭", t: "6. Legi switch-ul de router (Gi0/0 + no shutdown)", d: "Cablul drept de la switch la router, portul switch-ului în VLAN 10, IP pe routerul Gi0/0 și pornirea portului.", init: { sw: ["en", "conf t", "hostname S1", "vlan 10", "name MGMT", "exit", "int vlan 10", "ip address 192.168.10.2 255.255.255.0", "no shut", "end"] }, steps: gxCat(
      { k: "ch", q: "Ce cablu folosești între switch și router?", o: ["UTP drept", "UTP crossover", "Rollover de consolă", "Cablu coaxial de antenă"], why: "Switch și router sunt echipamente DIFERITE → cablu drept. Crossover e pentru echipamente la fel (switch–switch, PC–PC). Echipamentele noi au și auto-MDIX, dar la examen răspunsul e „drept”." },
      { k: "ch", q: "În ce port al routerului intră cablul de date (nu cel de consolă)?", o: ["GigabitEthernet0/0", "CONSOLE", "AUX (auxiliar)", "USB de consolă"], why: "Datele merg pe portul Gigabit Ethernet. CON (albastru deschis) e doar pentru configurare cu cablul albastru, AUX e pentru modem." },
      { d: "sw", c: "enable", sh: "en", goal: "Pe SWITCH: intră în modul privilegiat", why: "Întâi pregătești portul switch-ului spre router.", ok: gxM("priv") }, { d: "sw", c: "configure terminal", sh: "conf t", goal: "Pe SWITCH: configurare globală", why: "Deschizi caietul de setări al switch-ului.", ok: gxM("config") },
      GXB.acc("gi0/1", 10).map(function (x) { x.d = "sw"; return x; }), { d: "sw", c: "end", goal: "Pe SWITCH: înapoi în #", why: "Gata cu switch-ul. Acum treci pe router (alt cablu de consolă / altă fereastră PuTTY).", ok: gxM("priv") },
      { d: "r", c: "enable", sh: "en", goal: "Pe ROUTER: intră în modul privilegiat", why: "Aceeași scară și pe router: Router> → Router#.", ok: gxM("priv") }, { d: "r", c: "configure terminal", sh: "conf t", goal: "Pe ROUTER: configurare globală", why: "Caietul de setări al routerului.", ok: gxM("config") },
      { d: "r", c: "hostname R1", goal: "Numele routerului: R1", why: "Eticheta cu numele, ca la switch.", ok: function (s) { return s.host === "R1"; }, fin: 1 },
      { d: "r", c: "interface g0/0", sh: "int g0/0", goal: "Intră pe portul GigabitEthernet0/0", why: "Portul în care ai băgat cablul de la switch.", ok: function (s) { return s.mode === "if" && s.ctx[0] === "GigabitEthernet0/0"; } },
      { d: "r", c: "ip address 192.168.10.1 255.255.255.0", goal: "IP-ul routerului: 192.168.10.1/24 (gateway-ul rețelei)", why: "Pe router IP-ul se pune direct pe port (e echipament de nivel 3). E „ușa de ieșire” pentru switch și laptop.", ok: function (s) { var f = s.ifs["GigabitEthernet0/0"]; return f.ip === "192.168.10.1" && f.mask === "255.255.255.0"; }, fin: 1, b: "address" },
      { d: "r", c: "no shutdown", sh: "no shut", goal: "Pornește portul routerului", why: "Pe router porturile pornesc OPRITE. Fără no shutdown nu merge nimic – greșeala nr. 1 la examen!", ok: function (s) { return !s.ifs["GigabitEthernet0/0"].shut; }, fin: 1 },
      { d: "r", c: "end", goal: "Înapoi în #", why: "Liftul direct la parter.", ok: gxM("priv") },
      { d: "r", c: "show ip interface brief", sh: "sh ip int br", goal: "Verifică: Gi0/0 are 192.168.10.1 și e up/up", why: "Dacă scrie administratively down → ai uitat no shutdown.", ok: function (s) { return s.did.sipib; } },
      { d: "r", c: "ping 192.168.10.2", goal: "Testează legătura: ping spre switch", why: "Ping = strigi „ești acolo?”. ! = răspuns, . = nimic. Primul . e normal (ARP).", ok: function (s) { return s.did.ping && s.did.ping["192.168.10.2"]; } },
      GXB.save.map(function (x) { x = Object.assign({}, x); x.d = "r"; return x; })) },
    { id: "trk", ic: "🛣️", t: "7. Port trunk între switch-uri", d: "Pe Gi0/1 faci trunk care duce VLAN 10 și 20 spre alt switch.", init: { sw: ["en", "conf t", "hostname S1", "vlan 10", "name MGMT", "end"] }, steps: gxCat(GXB.en, GXB.conf, GXB.vlan(20, "DATE"), GXB.exit("config"),
      { c: "interface gi0/1", sh: "int gi0/1", goal: "Intră pe portul GigabitEthernet0/1 (spre celălalt switch)", why: "Portul care leagă cele două switch-uri.", ok: function (s) { return s.mode === "if" && s.ctx[0] === "GigabitEthernet0/1"; } },
      { c: "switchport mode trunk", goal: "Fă portul trunk", why: "Trunk = scara blocului: urcă locatari de la toate etajele (VLAN-urile). Fiecare cadru primește o etichetă 802.1Q cu numărul VLAN-ului.", ok: function (s) { return s.ifs["GigabitEthernet0/1"].mode === "trunk"; }, fin: 1, b: "trunk" },
      { c: "switchport trunk allowed vlan 10,20", goal: "Lasă pe trunk doar VLAN 10 și 20", why: "Lista de pe ușa scării: intră doar etajele 10 și 20. Fără spații după virgulă.", ok: function (s) { return s.ifs["GigabitEthernet0/1"].allow === "10,20"; }, fin: 1, b: "allowed" },
      GXB.end,
      { c: "show interfaces trunk", sh: "sh int trunk", goal: "Verifică trunk-ul", why: "Vezi portul Gi0/1, mode on, 802.1q, trunking și VLAN-urile permise 10,20.", ok: function (s) { return s.did.strunk; } }, GXB.save) },
    { id: "lap", ic: "💻", t: "8. Laptopul: IP static, ipconfig, ping, SSH", d: "Switch-ul e deja configurat (SSH + VLAN 10). Pui IP pe laptop și testezi din cmd.", init: { sw: GX_SW_SSH }, steps: [
      { k: "ch", q: "Laptopul se leagă cu cablu de date la switch. Ce cablu și în ce port?", o: ["UTP drept, în Fa0/1 din VLAN 10", "Crossover, în portul CONSOLE", "Rollover, în portul Fa0/1 din VLAN 10", "UTP drept, în portul AUX al switch-ului"], why: "PC și switch sunt diferite → cablu drept. Portul trebuie să fie în același VLAN cu IP-ul switch-ului (VLAN 10), altfel ping-ul nu trece." },
      { k: "ip", goal: "Pune IP static pe laptop: 192.168.10.10, masca 255.255.255.0, gateway 192.168.10.1", why: "Windows: Win+R → ncpa.cpl → click dreapta pe Ethernet → Properties → Internet Protocol Version 4 (TCP/IPv4) → Properties → „Use the following IP address”. Laptopul trebuie să fie pe aceeași „stradă” (192.168.10.x) ca switch-ul, dar cu alt număr de casă." },
      { k: "win", c: "ipconfig", goal: "Verifică IP-ul laptopului", why: "ipconfig = buletinul laptopului: IPv4 Address, Subnet Mask, Default Gateway. Se scrie în cmd (Win+R → cmd).", ok: function (L) { return L.did.ip || L.did.ipall; } },
      { k: "win", c: "ipconfig /all", goal: "Vezi și adresa MAC (Physical Address)", why: "MAC = numărul de serie al plăcii de rețea, adresa fizică (nivel 2). IP-ul e adresa logică (nivel 3). Întrebare clasică la examen!", ok: function (L) { return L.did.ipall; } },
      { k: "win", c: "ping 192.168.10.2", goal: "Testează switch-ul: ping 192.168.10.2", why: "Reply from = te aude. Request timed out = nu. Dacă nu merge: verifică IP-ul laptopului, portul (VLAN 10) și no shutdown pe interface vlan 10.", ok: function (L) { return L.did.ping && L.did.ping["192.168.10.2"]; } },
      { k: "win", c: "ssh -l admin 192.168.10.2", goal: "Intră pe switch prin SSH ca admin", why: "Asta e testul final al punctului SSH: din laptop, prin rețea, criptat. Parola e cisco123 (cea din username). Merge și din PuTTY: Connection type SSH, Host 192.168.10.2.", ok: function (L) { return L.did.ssh; } }
    ] },
    { id: "sav", ic: "💾", t: "9. Salvează și verifică după repornire", d: "Vezi cu ochii tăi de ce trebuie copy run start: repornești switch-ul și configurația rămâne.", init: { sw: ["en", "conf t", "hostname S1", "vlan 10", "name MGMT", "end"] }, steps: gxCat(GXB.en,
      { c: "show running-config", sh: "sh run", goal: "Uită-te la configurația curentă (tabla)", why: "Aici e ce ai configurat acum, în RAM. Caută hostname S1 și vlan 10.", ok: function (s) { return s.did.srun; } }, GXB.save,
      { c: "show startup-config", sh: "sh start", goal: "Verifică: configurația e în caiet (NVRAM)", why: "Dacă scrie „startup-config is not present” → n-ai salvat.", ok: function (s) { return s.did.sstart; } },
      { c: "reload", goal: "Repornește switch-ul", why: "Ca un restart de calculator. Tot ce n-ai salvat se pierde.", ok: function (s) { return !!s.pend; } },
      { c: "", pend: 1, goal: "Confirmă repornirea: apasă Enter", why: "[confirm] înseamnă: Enter = da.", ok: function (s) { return s.host === "S1" && s.mode === "user"; } },
      GXB.en,
      { c: "show vlan brief", sh: "sh vlan br", goal: "Verifică: VLAN 10 MGMT a rămas după repornire", why: "Pentru că ai salvat, totul e la locul lui. Exact asta verifică examinatorul.", ok: function (s) { return s.did.svb; } }) },
    { id: "all", ic: "🎖️", t: "10. Proba completă: switch + router + laptop", d: "Totul, cap-coadă, ca la examen: SSH pe switch cu VLAN 10, routerul pe Gi0/0, laptopul cu IP static, ping și SSH, salvare.", steps: gxCat(GXB.en, GXB.conf, GXB.host("S1"), { c: "no ip domain-lookup", goal: "Oprește căutarea DNS la greșeli", why: "Ca să nu aștepți 30 s la fiecare greșeală de tastare.", ok: function (s) { return !s.lookup; }, fin: 1 }, GXB.dom, GXB.user, GXB.vlan(10, "MGMT"), GXB.exit("config"), GXB.acc("fa0/1", 10), GXB.exit("config"), GXB.acc("gi0/1", 10), GXB.exit("config"), GXB.svi(10, "192.168.10.2"), GXB.exit("config"), GXB.gw, GXB.rsa, GXB.sshv, GXB.vty, GXB.end, GXB.save,
      [{ d: "r", c: "enable", sh: "en", goal: "Pe ROUTER: modul privilegiat", why: "Treci pe router.", ok: gxM("priv") }, { d: "r", c: "configure terminal", sh: "conf t", goal: "Pe ROUTER: configurare globală", why: "Caietul routerului.", ok: gxM("config") }, { d: "r", c: "hostname R1", goal: "Numele routerului: R1", why: "Eticheta.", ok: function (s) { return s.host === "R1"; }, fin: 1 }, { d: "r", c: "interface g0/0", sh: "int g0/0", goal: "Portul Gi0/0", why: "Portul spre switch.", ok: function (s) { return s.mode === "if" && s.ctx[0] === "GigabitEthernet0/0"; } }, { d: "r", c: "ip address 192.168.10.1 255.255.255.0", goal: "IP 192.168.10.1/24", why: "Gateway-ul rețelei.", ok: function (s) { var f = s.ifs["GigabitEthernet0/0"]; return f.ip === "192.168.10.1" && f.mask === "255.255.255.0"; }, fin: 1, b: "address" }, { d: "r", c: "no shutdown", sh: "no shut", goal: "Pornește portul", why: "Pe router porturile pornesc oprite!", ok: function (s) { return !s.ifs["GigabitEthernet0/0"].shut; }, fin: 1 }, { d: "r", c: "end", goal: "Înapoi în #", why: "", ok: gxM("priv") }],
      GXB.save.map(function (x) { x = Object.assign({}, x); x.d = "r"; return x; }),
      { k: "ip", goal: "Laptop: IP 192.168.10.10, masca 255.255.255.0, gateway 192.168.10.1", why: "ncpa.cpl → Ethernet → Properties → IPv4 → Use the following IP address." },
      { k: "win", c: "ping 192.168.10.1", goal: "Laptop: ping spre router", why: "Dacă merge, drumul laptop → switch → router e bun.", ok: function (L) { return L.did.ping && L.did.ping["192.168.10.1"]; } },
      { k: "win", c: "ssh -l admin 192.168.10.2", goal: "Laptop: SSH pe switch", why: "Testul final al punctului SSH.", ok: function (L) { return L.did.ssh; } }) }
  ];
  var GX_TIERS = [["1", "Copiezi", "Vezi comanda întreagă și o tastezi."], ["2", "Completezi", "Lipsește un cuvânt: îl scrii tu."], ["3", "Scopul", "Vezi doar ce trebuie făcut; ai buton de indiciu."], ["4", "Examen", "Fără ajutor: primești sarcina și predai la final."]];
  function gxSnap(s) { var p = s.pend; s.pend = null; var j = JSON.stringify(s); s.pend = p; return { j: j, p: p }; }
  function gxRest(s, sn) { Object.keys(s).forEach(function (k) { delete s[k]; }); var o = JSON.parse(sn.j); Object.keys(o).forEach(function (k) { s[k] = o[k]; }); s.pend = sn.p; }
  function gxSession(X) {
    var S = { sw: cliNew("switch"), r: cliNew("router"), pc: winNew({ ip: "169.254.12.7", mask: "255.255.0.0", gw: "", dns: "", dhcp: true, inet: false, live: [] }) };
    var I = X.init || {}; ["sw", "r"].forEach(function (d) { (I[d] || []).forEach(function (c) { cliRun(S[d], c); }); if (S[d].mode === "priv") S[d].mode = "user"; S[d].hist = []; S[d].did = {}; });
    var L = S.pc, sw = S.sw, r = S.r;
    L.reach = function (ip) {
      if (!L.ip || !ipOk(ip)) return false; if (ip === L.ip || ip === "127.0.0.1") return true; if (!ipIn(ip, L.ip, L.mask)) return false;
      var p1 = sw.ifs[S.pcPort || "FastEthernet0/1"]; if (!p1 || p1.shut) return false; var lv = p1 && p1.vlan || 1, svi = sw.ifs["Vlan" + lv];
      if (svi && svi.ip === ip && !svi.shut && ipIn(ip, svi.ip, svi.mask)) return true;
      var g0 = r.ifs["GigabitEthernet0/0"], up = sw.ifs["GigabitEthernet0/1"];
      return !!(g0 && g0.ip === ip && !g0.shut && up && (up.mode === "trunk" || up.vlan === lv));
    };
    L.ssh = function (user, host) {
      if (!L.reach(host)) return ["ssh: connect to host " + host + " port 22: Connection timed out", "(Laptopul nu ajunge la " + host + ": verifică IP-ul laptopului, VLAN-ul portului Fa0/1 și no shutdown.)"];
      var svi = Object.keys(sw.ifs).filter(function (n) { return sw.ifs[n].ip === host; })[0]; if (!svi) return ["ssh: connect to host " + host + " port 22: Connection refused"];
      var why = cliSshWhy(sw); if (why) return ["ssh: connect to host " + host + " port 22: Connection refused", "(" + why + ")"];
      if (!user || !sw.users[user]) return [user + "@" + host + "'s password:", "Permission denied, please try again.", "(Utilizatorul " + (user || "?") + " nu există pe switch. Folosește ssh -l admin " + host + ")"];
      L.did.ssh = 1; return [user + "@" + host + "'s password: ********   (în realitate tastezi parola: " + sw.users[user].p + ")", "", sw.banner ? sw.banner : "", sw.host + (sw.users[user].pr >= 15 ? "#" : ">") + "   ← ești pe switch prin SSH! (exit ca să ieși)"].filter(function (x, i) { return x !== "" || i === 1; });
    };
    return S;
  }
  function gxKey(id, t) { return "gx:" + id + ":" + t; }
  function gxBlank(st) {
    var c = st.c || "", w = c.split(" "); if (w.length === 1) return c.length > 3 ? c.slice(0, 2) + "_____" : "_____";
    var b = st.b; if (!b) { var cand = w.slice(1).filter(function (x) { return /^[a-z][a-z-]{2,}$/.test(x); }); b = cand.length ? cand[cand.length - 1] : w[w.length - 1]; if (/^(mode|vlan)$/.test(b) && cand.length > 1) b = cand[0]; }
    var i = w.lastIndexOf(b); if (i < 0) i = w.length - 1; w[i] = "_____"; return w.join(" ");
  }
  function gxHid(st) {
    var c = st.c || "", w = c.split(" "); if (w.length === 1) return c;
    var b = st.b; if (!b) { var cand = w.slice(1).filter(function (x) { return /^[a-z][a-z-]{2,}$/.test(x); }); b = cand.length ? cand[cand.length - 1] : w[w.length - 1]; if (/^(mode|vlan)$/.test(b) && cand.length > 1) b = cand[0]; }
    return w.lastIndexOf(b) < 0 ? w[w.length - 1] : b;
  }
  function gxHide(txt, st) {
    var h = gxHid(st); if (!h || h.length < 2 || !txt) return txt;
    var m = h.length > 3 ? h.slice(0, 2) + "_____" : "_____", t = String(txt);
    if (st.c && st.c !== h) t = t.split(st.c).join(gxBlank(st));
    return t.replace(new RegExp("(^|[^A-Za-z0-9])" + h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![A-Za-z0-9])", "gi"), function (a, p1) { return p1 + m; });
  }
  var GXS = null;
  function START_HERE() { return '<section class="card starthere"><h2>🧒 Nu ai mai scris comenzi Cisco?</h2><p class="small">N-ai mai scris niciodată comenzi Cisco? Aici îți arăt fiecare comandă, de ce o scrii și cum trebuie să arate promptul.</p><button class="big sec" data-start="1">▶️ Primul exercițiu (8 min)</button></section>'; }
  document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("[data-start]"); if (b) { e.preventDefault(); go("ghid"); } });
  function vGhid(arg) {
    view = "practice"; navbar(true); P.cli = P.cli || {};
    if (arg === "fisa") return gxSheet();
    var pa = String(arg || "").split(":"), X = GX.filter(function (x) { return x.id === pa[0]; })[0], tier = +pa[1] || 1;
    if (!X) return gxList();
    if (!GXS || GXS.id !== X.id || GXS.tier !== tier) GXS = { id: X.id, tier: tier, i: 0, S: gxSession(X), lines: {}, err: 0, hint: 0, hl: 0, wrong: 0, t0: Date.now(), done: false };
    if (tier === 4 && X.steps.filter(function (s) { return s.fin || s.k === "win" || s.k === "ip"; }).length >= 3) return gxExam(X);
    gxStepView(X);
  }
  var GXP = [["Zilele 1–2", "Exercițiile 1–5, nivelurile 1 și 2", ["con", "lad", "baz", "vln", "ssh"], [1, 2]], ["Zilele 3–4", "Exercițiile 6–9 (niveluri 1–2) + SSH la nivelul 3 + primele situații reale", ["rtr", "trk", "lap", "sav", "ssh"], [1, 2, 3]], ["Zilele 5–6", "Toate la nivelul 4 (examen) + carduri de comenzi zilnic", ["baz", "vln", "ssh", "rtr", "trk", "lap"], [4]], ["Ziua 7", "Proba completă de 2–3 ori + fișa de comenzi", ["all"], [3, 4]]];
  function GX_PLAN() { return '<section class="card"><button class="big sec" data-gp="week">🗓️ Planul pe zile (până la examen) – Săptămâna ›</button></section>'; }
  /* Variante de formulare pentru întrebările din „Pas cu pas” (rotite: nu se repetă aceeași la încercări consecutive). P.cli["qv:<pas>"] = timp*10 + varianta */
  var GX_ALT = {
    "Cu ce cablu te legi de la laptop la switch ca să-l configurezi prima dată?": [
      ["Switch-ul e nou, fără IP. Prin ce te conectezi la el ca să-l configurezi?", ["Prin cablul rollover, în portul CONSOLE", "Prin Wi-Fi, căutând rețeaua switch-ului", "Prin SSH, la adresa implicită 192.168.10.2", "Prin cablul UTP drept, în portul Gi0/1"], "Fără IP nu merge nimic prin rețea (SSH, Telnet, web). Rămâne consola: cablul rollover în portul CONSOLE."],
      ["Ce port de pe switch folosești pentru prima configurare?", ["CONSOLE, cu cablul rollover", "Fa0/24, cu cablu de fibră", "Gi0/1, cu cablu crossover", "Portul de alimentare, cu cablul de curent"], "Portul CONSOLE e făcut pentru configurarea directă, chiar dacă switch-ul nu are încă nicio adresă IP."]],
    "Unde vezi pe laptop ce port COM a primit cablul de consolă?": [
      ["Ai băgat cablul de consolă USB în laptop. Unde afli numărul COM?", ["În Device Manager, la Ports", "În Task Manager, la Processes", "În Control Panel, la Sound", "În PuTTY, la Session → Saved Sessions"], "Win+X → Device Manager → Ports (COM & LPT) → ex. „USB Serial Port (COM3)”."],
      ["„USB Serial Port (COM4)” apare în…", ["Device Manager → Ports", "Settings → Bluetooth & devices", "Task Manager → Startup", "File Explorer → This PC"], "Lista de porturi seriale e în Device Manager, la Ports (COM & LPT)."]],
    "În PuTTY, ce alegi la Connection type?": [
      ["Te conectezi prin cablul de consolă. Ce tip de conexiune bifezi în PuTTY?", ["Serial", "SSH", "Telnet", "Rlogin"], "Consola e o legătură serială. SSH și Telnet merg doar prin rețea, după ce switch-ul are IP."],
      ["Pentru consolă, în PuTTY folosești tipul…", ["Serial", "Raw", "SSH", "Telnet"], "Serial – pentru că cablul de consolă e o legătură serială directă, nu prin rețea."]],
    "Ce scrii la „Serial line”, dacă Device Manager arată USB Serial Port (COM3)?": [
      ["Device Manager arată „USB Serial Port (COM5)”. Ce scrii în PuTTY la Serial line?", ["COM5", "COM1", "9600", "192.168.10.2"], "Scrii exact portul COM văzut în Device Manager – aici COM5."],
      ["La „Serial line” în PuTTY pui…", ["Portul COM, ex. COM3", "Viteza consolei, ex. 9600", "Adresa IP a switch-ului", "Numele switch-ului, ex. SW1"], "Serial line = portul COM. Viteza (9600) se pune separat, la Speed."]],
    "Ce viteză (Speed) pui pentru consola Cisco?": [
      ["Câți biți pe secundă (Speed) are consola Cisco, implicit?", ["9600", "1200", "115200", "100000"], "Implicit consola Cisco merge pe 9600 (8 biți, fără paritate, 1 bit de stop)."],
      ["În PuTTY, câmpul Speed pentru consola Cisco este…", ["9600", "100", "1000", "56000"], "9600 – valoarea implicită a consolei Cisco. Cu altă viteză vezi caractere ciudate sau nimic."]],
    "Ai apăsat Open și fereastra e neagră, goală. Ce faci?": [
      ["PuTTY s-a deschis, dar nu apare nimic pe ecran. Primul lucru pe care îl încerci?", ["Apeși Enter o dată sau de două ori", "Reinstalezi PuTTY de pe site-ul oficial", "Scoți switch-ul din priză și aștepți", "Schimbi cablul de fibră cu altul"], "Switch-ul afișează promptul abia după ce primește un Enter."],
      ["Fereastra de consolă e goală după Open. Ce e normal să faci?", ["Apeși Enter ca să apară promptul", "Scrii parola de Windows și Enter", "Închizi PuTTY și îl deschizi iar", "Apeși Ctrl+Alt+Del"], "De obicei e doar „adormit”: un Enter și apare promptul (Switch>)."]],
    "Apare: „Would you like to enter the initial configuration dialog? [yes/no]:”. Ce răspunzi?": [
      ["Switch-ul nou te întreabă dacă vrei „initial configuration dialog”. Ce scrii?", ["no", "yes", "enable", "exit"], "Răspunzi no și configurezi tu, pas cu pas. Dialogul automat e lung și te încurcă."],
      ["La mesajul „…initial configuration dialog? [yes/no]:” răspunsul potrivit la examen este…", ["no, apoi Enter", "yes, apoi Enter", "Nimic, închizi fereastra", "show run"], "no – ca să ajungi la promptul Switch> și să scrii comenzile tu."]],
    "Ce cablu folosești între switch și router?": [
      ["Legi un port de date al switch-ului de routerul Cisco. Ce cablu folosești?", ["UTP drept", "Rollover de consolă", "UTP crossover", "Cablu telefonic RJ11"], "Switch–router sunt echipamente diferite → cablu drept. Crossover e pentru același tip (switch–switch, PC–PC)."],
      ["Între două echipamente DIFERITE (switch ↔ router) pui cablu…", ["drept", "crossover", "rollover", "coaxial"], "Regula: diferite → drept; la fel → crossover; consolă → rollover."]],
    "În ce port al routerului intră cablul de date (nu cel de consolă)?": [
      ["Pe router, în ce port bagi cablul UTP care vine de la switch?", ["GigabitEthernet0/0", "CONSOLE (cel albastru)", "AUX (pentru modem)", "USB"], "Datele intră într-o interfață Ethernet, ex. Gi0/0. CONSOLE și AUX sunt pentru administrare."],
      ["Care port al routerului NU e pentru administrare, ci pentru date?", ["Gi0/0", "CONSOLE", "AUX", "USB console"], "Gi0/0 e interfață de rețea; CONSOLE/AUX/USB console servesc la configurare."]],
    "Laptopul se leagă cu cablu de date la switch. Ce cablu și în ce port?": [
      ["Laptopul trebuie să fie în rețeaua VLAN 10. Cum îl legi?", ["Cu UTP drept, în Fa0/1 pus în VLAN 10", "Cu rollover, în portul CONSOLE", "Cu crossover, în portul AUX", "Cu fibră single-mode, în portul Gi0/1"], "PC–switch = echipamente diferite → cablu drept, în portul de acces din VLAN 10."],
      ["Pentru ping/SSH de pe laptop la switch, cablul de date merge…", ["UTP drept, în Fa0/1 din VLAN 10", "Rollover, în portul CONSOLE", "UTP drept, în portul CONSOLE", "Crossover, în portul AUX al routerului"], "Pentru ping și SSH îți trebuie legătură de rețea: cablu drept într-un port din VLAN 10."]]
  };
  function gxVariant(st, key) {
    var alts = GX_ALT[st.q]; if (!alts) return st;
    var all = [[st.q, st.o, st.why]].concat(alts), v = P.cli && P.cli[key], last = v ? v % 10 : -1;
    var pick = Math.floor(Math.random() * all.length); if (all.length > 1 && pick === last) pick = (pick + 1 + Math.floor(Math.random() * (all.length - 1))) % all.length;
    return { k: "ch", q: all[pick][0], o: all[pick][1], why: all[pick][2] || st.why, vi: pick };
  }
  /* ---------- Topologie live (SVG): 2960-24TT-L + 1941 + laptop; LED-uri după starea simulatorului ---------- */
  var TOPO = { S: null, up: {}, act: 0, open: true, sel: "" };
  function topoLed(dev, n) { /* întoarce: off | amber | green | blink */
    if (!dev || !dev.ifs[n]) return "off"; var f = dev.ifs[n], cab = cliUp(dev, n) || (!!f.shut && topoCab(dev, n));
    if (!topoCab(dev, n)) { delete TOPO.up[dev.dev + n]; return "off"; }
    if (f.shut) { delete TOPO.up[dev.dev + n]; return "off"; }
    if (!cliUp(dev, n)) return "off";
    var k = dev.dev + n; if (!TOPO.up[k]) { TOPO.up[k] = Date.now(); if (dev.dev === "switch") setTimeout(topoRef, 3100); }
    if (dev.dev === "switch" && Date.now() - TOPO.up[k] < 3000) return "amber";
    return Date.now() - TOPO.act < 1600 ? "blink" : "green";
  }
  function topoCab(dev, n) { if (dev.unpl && dev.unpl[n]) return false; return topoCab0(dev, n); }
  function topoCab0(dev, n) { if (dev.dev === "router") return n === "GigabitEthernet0/0" || n === "GigabitEthernet0/1"; return n === "FastEthernet0/1" || n === "FastEthernet0/2" || n === "GigabitEthernet0/1" || (!!dev.cport && n === dev.cport); }
  function topoMled(dev, n) { var st = topoLed(dev, n); if (dev.dev !== "switch" || !TOPO.mode || TOPO.mode === "STAT" || st === "off" || dev.ifs[n].shut) return st; if (TOPO.mode === "DUPLX") return "green"; return /^Gig/.test(n) ? "blink" : "green"; }
  var TOPO_C = { off: "#334155", amber: "#f59e0b", green: "#22c55e", blink: "#22c55e" };
  function topoSvg(sw, r) {
    var h = '<svg viewBox="0 0 400 ' + (sw && r ? 345 : 225) + '" class="topo" role="img" aria-label="Topologia: laptop, switch Catalyst 2960, router 1941">';
    h += '<defs><linearGradient id="tpM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b5563"/><stop offset="1" stop-color="#1f2937"/></linearGradient></defs>';
    var y0 = 8;
    // laptop
    h += '<g><rect x="6" y="' + (y0 + 4) + '" width="62" height="40" rx="3" fill="#0f172a" stroke="#64748b"/><rect x="10" y="' + (y0 + 8) + '" width="54" height="30" fill="#1e3a8a"/><rect x="0" y="' + (y0 + 44) + '" width="74" height="6" rx="2" fill="#94a3b8"/><text x="37" y="' + (y0 + 26) + '" font-size="8" fill="#fff" text-anchor="middle">PuTTY</text><text x="37" y="' + (y0 + 62) + '" font-size="8" text-anchor="middle" fill="currentColor">Laptop · COM · 9600 8N1</text></g>';
    var sy = y0 + 86;
    if (sw) {
      // front 2960-24TT-L
      h += '<text x="6" y="' + (sy - 5) + '" font-size="9" font-weight="700" fill="currentColor">Catalyst 2960-24TT-L · față</text><rect x="4" y="' + sy + '" width="392" height="54" rx="3" fill="url(#tpM)" stroke="#111"/>';
      h += '<text x="10" y="' + (sy + 12) + '" font-size="6.5" fill="#cbd5e1">CISCO</text>';
      [["SYST", "green"], ["RPS", "off"], ["STAT", (TOPO.mode || "STAT") === "STAT" ? "green" : "off"], ["DUPLX", TOPO.mode === "DUPLX" ? "green" : "off"], ["SPEED", TOPO.mode === "SPEED" ? "green" : "off"]].forEach(function (L, i) { var ly = sy + 18 + i * 7; h += '<circle cx="12" cy="' + ly + '" r="2" fill="' + TOPO_C[L[1]] + '"/><text x="16" y="' + (ly + 2) + '" font-size="5" fill="#cbd5e1">' + L[0] + "</text>"; });
      h += '<g class="tmode" id="tMode"><rect x="26" y="' + (sy + 30) + '" width="24" height="24" fill="transparent"/><rect x="33" y="' + (sy + 40) + '" width="11" height="7" rx="1.5" fill="#d1d5db" stroke="#6b7280"/><text x="31" y="' + (sy + 52) + '" font-size="4.5" fill="#cbd5e1">MODE</text></g>';
      for (var p = 1; p <= 24; p++) { var col = Math.floor((p - 1) / 2), row = (p - 1) % 2, x = 52 + col * 24 + Math.floor(col / 4) * 3, y = sy + 8 + row * 22, n = "FastEthernet0/" + p, st = topoMled(sw, n), f = sw.ifs[n];
        h += '<g class="tport" data-tp="sw|' + n + '"><rect x="' + x + '" y="' + (y + 4) + '" width="18" height="14" rx="1" fill="#0b0f14" stroke="' + (TOPO.sel === "sw|" + n ? "#facc15" : "#6b7280") + '"/><rect x="' + (x + 5) + '" y="' + (y + 14) + '" width="8" height="4" fill="#374151"/><rect x="' + (x + 1) + '" y="' + y + '" width="6" height="3" class="' + (st === "blink" ? "tblink" : "") + '" fill="' + TOPO_C[st] + '"/><text x="' + (x + 9) + '" y="' + (y + 12) + '" font-size="5.5" fill="#e5e7eb" text-anchor="middle">' + p + "</text>" + (topoCab(sw, n) ? '<rect x="' + (x + 3) + '" y="' + (y + 6) + '" width="12" height="11" rx="1.5" fill="#9ca3af" stroke="#4b5563"/><rect x="' + (x + 6) + '" y="' + (y + 8) + '" width="6" height="2" fill="#d4af37"/>' : "") + (topoCab(sw, n) ? '<text x="' + (x + 9) + '" y="' + (row ? y + 25 : y - 1.5) + '" font-size="5" fill="#fde68a" text-anchor="middle">' + (f.mode === "trunk" ? "T" : "V" + (f.vlan || 1)) + "</text>" : "") + "</g>"; }
      [1, 2].forEach(function (g) { var x = 352 + (g - 1) * 22, y = sy + 19, n = "GigabitEthernet0/" + g, st = topoMled(sw, n), f = sw.ifs[n]; h += '<g class="tport" data-tp="sw|' + n + '"><rect x="' + x + '" y="' + (y + 4) + '" width="18" height="14" rx="1" fill="#0b0f14" stroke="' + (TOPO.sel === "sw|" + n ? "#facc15" : "#6b7280") + '"/><rect x="' + (x + 1) + '" y="' + y + '" width="6" height="3" class="' + (st === "blink" ? "tblink" : "") + '" fill="' + TOPO_C[st] + '"/><text x="' + (x + 9) + '" y="' + (y + 12) + '" font-size="5" fill="#e5e7eb" text-anchor="middle">' + g + '</text>' + (topoCab(sw, n) ? '<rect x="' + (x + 3) + '" y="' + (y + 6) + '" width="12" height="11" rx="1.5" fill="#9ca3af" stroke="#4b5563"/><rect x="' + (x + 6) + '" y="' + (y + 8) + '" width="6" height="2" fill="#d4af37"/>' : "") + (topoCab(sw, n) ? '<text x="' + (x + 9) + '" y="' + (y + 25) + '" font-size="5" fill="#fde68a" text-anchor="middle">' + (f.mode === "trunk" ? "T" : "V" + (f.vlan || 1)) + "</text>" : "") + "</g>"; });
      h += '<text x="352" y="' + (sy + 14) + '" font-size="5" fill="#cbd5e1">10/100/1000</text>';
      // rear strip with console
      var ry = sy + 60; h += '<text x="6" y="' + (ry + 8) + '" font-size="7" fill="currentColor">spate:</text><rect x="34" y="' + ry + '" width="362" height="16" rx="2" fill="#374151"/><rect x="60" y="' + (ry + 3) + '" width="14" height="10" fill="#7dd3fc" stroke="#0369a1"/><text x="78" y="' + (ry + 11) + '" font-size="6" fill="#e5e7eb">CONSOLE</text><text x="300" y="' + (ry + 11) + '" font-size="6" fill="#e5e7eb">RPS · ~AC</text>';
      // console cable laptop → rear CONSOLE (albastru)
      h += '<path d="M60 ' + (y0 + 50) + " C 50 " + (sy - 10) + ", 20 " + (ry + 30) + ", 67 " + (ry + 13) + '" fill="none" stroke="#2563eb" stroke-width="2.5"/><text x="80" y="' + (y0 + 58) + '" font-size="7" fill="#2563eb">rollover (consolă)</text>';
      // PC pe Fa0/x
      var cp = sw.cport || "FastEthernet0/1", pn = +cp.split("/")[1], pcol = Math.floor((pn - 1) / 2), px = 52 + pcol * 24 + Math.floor(pcol / 4) * 3 + 9, prow = (pn - 1) % 2;
      h += '<rect x="150" y="' + (y0 + 10) + '" width="44" height="30" rx="2" fill="#e5e7eb" stroke="#64748b"/><text x="172" y="' + (y0 + 29) + '" font-size="7" text-anchor="middle" fill="#111">PC/laptop</text><text x="172" y="' + (y0 + 50) + '" font-size="6.5" text-anchor="middle" fill="currentColor">→ ' + cp.replace("FastEthernet", "Fa") + '</text>';
      if (topoCab(sw, cp)) h += '<path d="M172 ' + (y0 + 40) + " L " + px + " " + (sy + 8 + prow * 22 + 11) + '" stroke="#9ca3af" stroke-width="2.5" fill="none"/>';
      if (topoCab(sw, "FastEthernet0/2") && cp !== "FastEthernet0/2") h += '<rect x="220" y="' + (y0 + 14) + '" width="36" height="24" rx="2" fill="#e5e7eb" stroke="#64748b"/><text x="238" y="' + (y0 + 29) + '" font-size="7" text-anchor="middle" fill="#111">PC2</text><path d="M238 ' + (y0 + 38) + " L 61 " + (sy + 41) + '" stroke="#9ca3af" stroke-width="2" fill="none" opacity=".7"/>';
      // SVI
      var svis = Object.keys(sw.ifs).filter(function (n) { return /^Vlan/.test(n) && (sw.ifs[n].ip || n !== "Vlan1"); });
      h += '<text x="262" y="' + (y0 + 62) + '" font-size="8" fill="currentColor">' + (svis.length ? svis.map(function (n) { var f = sw.ifs[n], up = !f.shut && cliUp(sw, n); return (up ? "🟢 " : "⚪ ") + "int " + n.replace("Vlan", "vlan ") + ": " + (f.ip || "fără IP"); }).slice(0, 3).join("</text><text x='262' y='" + (y0 + 72) + "' font-size='8' fill='currentColor'>") : "SVI: niciuna") + "</text>";
    }
    if (r) {
      var ty = sw ? sy + 96 : y0 + 80;
      if (sw && topoCab(sw, "GigabitEthernet0/1") && topoCab(r, "GigabitEthernet0/0")) h += '<path d="M' + 361 + " " + (sy + 41) + " C 380 " + (ty - 20) + ", 160 " + (ty - 30) + ", 151 " + (ty + 18) + '" stroke="#9ca3af" stroke-width="2.5" fill="none"/><text x="230" y="' + (ty - 6) + '" font-size="8" fill="currentColor">cablu drept (gri) Gi0/1 → GE 0/0</text>';
      else h += '<path d="M60 ' + (y0 + 50) + " C 40 " + (ty) + ", 30 " + (ty + 30) + ", 121 " + (ty + 18) + '" fill="none" stroke="#2563eb" stroke-width="2.5"/><text x="80" y="' + (y0 + 58) + '" font-size="7" fill="#2563eb">rollover (consolă)</text>';
      h += '<text x="6" y="' + (ty + 4) + '" font-size="9" font-weight="700" fill="currentColor">Cisco 1941 · spate</text><rect x="4" y="' + (ty + 8) + '" width="392" height="40" rx="3" fill="url(#tpM)" stroke="#111"/>';
      h += [["SYS", "#22c55e", ""], ["ACT", Date.now() - TOPO.act < 1600 ? "#22c55e" : "#334155", Date.now() - TOPO.act < 1600 ? "tblink" : ""], ["POE", "#334155", ""]].map(function (L, i) { return '<circle cx="14" cy="' + (ty + 17 + i * 9) + '" r="2.4" class="' + L[2] + '" fill="' + L[1] + '"/><text x="19" y="' + (ty + 19 + i * 9) + '" font-size="5.5" fill="#cbd5e1">' + L[0] + "</text>"; }).join("") + '<text x="38" y="' + (ty + 28) + '" font-size="5" fill="#94a3b8">(față)</text>';
      [["GigabitEthernet0/0", "GE 0/0", 140], ["GigabitEthernet0/1", "GE 0/1", 176]].forEach(function (g) { var st = topoLed(r, g[0]), f = r.ifs[g[0]], x = g[2], lk = st !== "off"; h += '<g class="tport" data-tp="r|' + g[0] + '"><rect x="' + x + '" y="' + (ty + 20) + '" width="22" height="16" rx="1" fill="#0b0f14" stroke="' + (TOPO.sel === "r|" + g[0] ? "#facc15" : "#6b7280") + '"/>' + (topoCab(r, g[0]) && g[0] === "GigabitEthernet0/0" && (!sw || topoCab(sw, "GigabitEthernet0/1")) ? '<rect x="' + (x + 4) + '" y="' + (ty + 22) + '" width="14" height="12" rx="1.5" fill="#9ca3af" stroke="#4b5563"/><rect x="' + (x + 8) + '" y="' + (ty + 24) + '" width="6" height="2" fill="#d4af37"/>' : "") + '<rect x="' + (x + 2) + '" y="' + (ty + 15) + '" width="5" height="3" class="' + (lk ? "tblink3" : "") + '" fill="' + (lk ? "#22c55e" : "#334155") + '"/><rect x="' + (x + 15) + '" y="' + (ty + 15) + '" width="5" height="3" class="' + (st === "blink" ? "tblink" : "") + '" fill="' + TOPO_C[st] + '"/><text x="' + (x + 11) + '" y="' + (ty + 44) + '" font-size="5.5" fill="#e5e7eb" text-anchor="middle">' + g[1] + '</text>' + (f && f.ip ? '<text x="' + (x + 11) + '" y="' + (ty + 13) + '" font-size="5" fill="#fde68a" text-anchor="middle">' + f.ip + "</text>" : "") + "</g>"; });
      h += '<rect x="86" y="' + (ty + 22) + '" width="14" height="10" fill="#7dd3fc" stroke="#0369a1"/><text x="93" y="' + (ty + 42) + '" font-size="5" fill="#e5e7eb" text-anchor="middle">CON</text><rect x="108" y="' + (ty + 22) + '" width="14" height="10" fill="#111" stroke="#6b7280"/><text x="115" y="' + (ty + 42) + '" font-size="5" fill="#e5e7eb" text-anchor="middle">AUX</text>';
      h += '<text x="220" y="' + (ty + 26) + '" font-size="5.5" fill="#cbd5e1">L = link (verde) · S = viteză:</text><text x="220" y="' + (ty + 34) + '" font-size="5.5" fill="#cbd5e1">1 clipire 10 · 2 = 100 · 3 = 1000 Mb/s</text>';
    }
    return h + "</svg>";
  }
  function topoCfg(dev, n) {
    var f = dev.ifs[n]; if (!f) return "";
    var L = ["interface " + n]; if (f.desc) L.push(" description " + f.desc);
    if (dev.dev === "switch") { if (f.mode === "trunk") { L.push(" switchport mode trunk"); if (f.allow) L.push(" switchport trunk allowed vlan " + f.allow); } else { if (f.mode === "access") L.push(" switchport mode access"); if ((f.vlan || 1) !== 1) L.push(" switchport access vlan " + f.vlan); } }
    if (f.ip) L.push(" ip address " + f.ip + " " + f.mask); if (f.shut) L.push(" shutdown");
    var st = topoLed(dev, n), why = { off: f.shut && topoCab(dev, n) ? "LED stins: port oprit (shutdown)" : topoCab(dev, n) ? "LED stins: fără link" : "LED stins: niciun cablu în port", amber: f.shut ? "LED portocaliu: port oprit (shutdown)" : "LED portocaliu: STP verifică portul (pe switch real ~30 s, aici 3 s)", green: "LED verde: link activ", blink: "LED verde clipind: trafic" }[st];
    var can = topoCab0(dev, n), pl = !(dev.unpl && dev.unpl[n]);
    return '<pre class="tcfg">' + esc(L.join("\n")) + "</pre><div class='small'>" + why + "</div>" + (can ? '<button class="ghost" id="tPlug">' + (pl ? "🔌 Scoate cablul din " : "🔌 Pune cablul înapoi în ") + esc(n.replace("FastEthernet", "Fa").replace("GigabitEthernet", "Gi")) + "</button>" : "");
  }
  function topoRef() {
    var box = $("topoBox"); if (!box || !TOPO.S) return;
    var sw = TOPO.S.sw, r = TOPO.S.r;
    box.innerHTML = '<details class="topod"' + (TOPO.open ? " open" : "") + '><summary>🗺️ Desenul: switch, router, cabluri (LED-uri live)</summary><p class="small">' + topoNow(sw, r) + '</p>' + topoSvg(sw, r) + '<div id="topoCfg" class="small">' + (TOPO.sel ? topoCfg(TOPO.sel.split("|")[0] === "sw" ? sw : r, TOPO.sel.split("|")[1]) : '<span class="muted">Verde = link · portocaliu = STP (~30 s real, 3 s aici) sau port oprit · stins = fără cablu.</span>') + "</div></details>";
    var d = box.querySelector("details"); d.addEventListener("toggle", function () { TOPO.open = d.open; });
    Array.prototype.forEach.call(box.querySelectorAll(".tport"), function (g) { g.addEventListener("click", function () { TOPO.sel = g.getAttribute("data-tp"); topoRef(); }); });
    var mb = box.querySelector("#tMode"); if (mb) mb.addEventListener("click", function () { var M = ["STAT", "DUPLX", "SPEED"]; TOPO.mode = M[(M.indexOf(TOPO.mode || "STAT") + 1) % 3]; topoRef(); clearTimeout(TOPO.mt); if (TOPO.mode !== "STAT") TOPO.mt = setTimeout(function () { TOPO.mode = "STAT"; topoRef(); }, 30000); });
    var pb = box.querySelector("#tPlug"); if (pb) pb.onclick = function () { var pp = TOPO.sel.split("|"), dev = pp[0] === "sw" ? sw : r, n = pp[1]; dev.unpl = dev.unpl || {}; var was = !dev.unpl[n], f = dev.ifs[n], prev = {}; Object.keys(dev.ifs).forEach(function (k) { if (/^Vlan/.test(k)) prev[k] = cliUp(dev, k); });
      if (was) dev.unpl[n] = 1; else delete dev.unpl[n]; delete TOPO.up[dev.dev + n];
      var L = [], L2 = []; if (!f.shut) { L.push("%LINK-3-UPDOWN: Interface " + n + ", changed state to " + (was ? "down" : "up")); L2.push("%LINEPROTO-5-UPDOWN: Line protocol on Interface " + n + ", changed state to " + (was ? "down" : "up")); }
      Object.keys(prev).forEach(function (k) { var nu = cliUp(dev, k); if (nu !== prev[k] && !dev.ifs[k].shut) L2.push("%LINEPROTO-5-UPDOWN: Line protocol on Interface " + k + ", changed state to " + (nu ? "up" : "down")); });
      topoLog(L); setTimeout(function () { topoLog(L2); }, 1000); topoRef(); };
  }
  function topoNow(sw, r) { var a = [], cn = 0; if (sw) { var up = ["FastEthernet0/1", "GigabitEthernet0/1", sw.cport].filter(function (n, i, A) { return n && A.indexOf(n) === i && topoCab(sw, n); }); a.push("Laptopul e legat cu cablul albastru (consolă) în CONSOLE."); up.forEach(function (n) { var st = topoLed(sw, n); a.push(n.replace("FastEthernet", "Fa").replace("GigabitEthernet", "Gi") + ": " + { off: "⚪ fără link", amber: "🟠 așteaptă (STP) sau oprit", green: "🟢 merge", blink: "🟢 trafic" }[st]); }); }
    if (r) { var g = r.ifs["GigabitEthernet0/0"]; a.push("Router GE 0/0: " + (g && g.shut ? "🟠/⚪ oprit (pe router porturile pornesc OPRITE – no shutdown)" : "🟢 pornit")); }
    return a.join(" · ") + "<br>🟢 merge · 🟠 așteaptă ~30 s (STP) sau oprit · ⚪ fără cablu · albastru = consolă (rollover) · gri = cablu drept"; }
  function topoLog(L) { if (!L.length || !TOPO.tb) return; L.forEach(function (l) { TOPO.tb.add(l, "thint"); }); TOPO.tb.paint(); }
  function topoMount(S, beforeId) {
    if (TOPO.S !== S) { TOPO.up = {}; TOPO.sel = ""; } TOPO.S = S;
    var t = $(beforeId); if (!t) return; if (TOPO.open0 == null) { TOPO.open0 = 1; TOPO.open = innerWidth > 700; } var b = $("topoBox"); if (!b) { b = document.createElement("div"); b.id = "topoBox"; } var after = t.nextSibling; while (after && after.classList && after.classList.contains("gxwhy")) after = after.nextSibling; t.parentNode.insertBefore(b, after);
    var w = document.querySelector("details.gxwhy"); if (w && beforeId === "gxTerm") t.parentNode.insertBefore(w, t.nextSibling);
    topoRef();
  }
  function gxDoneTier(id) { var n = 0; for (var t = 1; t <= 4; t++) if (P.cli[gxKey(id, t)]) n = t; return n; }
  function gxList() {
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>🧒 Practic pas cu pas – de la zero</h2>' +
      '<p>Nu trebuie să știi nimic dinainte. Fiecare pas îți spune <b>ce tastezi</b>, <b>de ce</b> (cu o comparație simplă) și <b>cum trebuie să arate promptul</b>. Dacă greșești, echipamentul rămâne cum era și îți explic ce s-a întâmplat.</p>' +
      '<div class="gxlad" aria-label="Scara promptului"><div><code>Switch&gt;</code><span>holul – doar te uiți</span></div><div><code>Switch#</code><span>apartamentul – <b>enable</b></span></div><div><code>Switch(config)#</code><span>caietul de setări – <b>conf t</b></span></div><div><code>Switch(config-if)#</code><span>pagina unei prize – <b>interface …</b></span></div></div>' +
      '<p class="small muted">Urci cu enable → conf t → interface. Cobori cu <b>exit</b> (o treaptă) sau <b>end</b> (direct la #). Pe iPhone: ? și Tab au butoane sub terminal.</p>' +
      '<p class="small"><b>Nivelurile:</b> ' + GX_TIERS.map(function (t) { return t[0] + " = " + t[1]; }).join(" · ") + '. Fă nivelul 1 la toate, apoi urcă. Nivelul 4 e ca la examen.</p><button class="big" id="gxSheet">📄 Fișa de comenzi (de tipărit)</button><div class="row2"><button class="ghost" id="gxScen">🧰 Situații reale la lucru</button><button class="ghost" id="gxCards">🃏 Repetă azi (' + cfDueN() + ')</button></div></section>' + GX_PLAN();
    GX.forEach(function (X) {
      var dn = gxDoneTier(X.id), n = X.steps.length;
      h += '<section class="card gxe"><h3>' + X.ic + " " + esc(X.t) + '</h3><p class="small muted">' + esc(X.d) + " · " + n + ' pași</p><div class="gxt">' + GX_TIERS.map(function (t) { var ok = !!P.cli[gxKey(X.id, t[0])]; return '<button class="' + (ok ? "ok" : "") + '" data-g="' + X.id + ":" + t[0] + '" title="' + esc(t[2]) + '"><b>' + (ok ? "✓ " : "") + t[0] + "</b><small>" + esc(t[1]) + "</small></button>"; }).join("") + "</div></section>";
    });
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("practice"); };
    $("gxSheet").onclick = function () { go("ghid", "fisa"); };
    $("gxScen").onclick = function () { go("scen"); }; $("gxCards").onclick = function () { go("cmdcards"); };
    Array.prototype.forEach.call(app.querySelectorAll("[data-gp]"), function (b) { b.onclick = function () { var a = b.getAttribute("data-gp"); GXS = null; if (a === "week") go("week"); else if (a === "fisa") go("ghid", "fisa"); else if (a === "scen") go("scen"); else if (a === "cards") go("cmdcards"); else go("ghid", a); }; });
    Array.prototype.forEach.call(app.querySelectorAll("[data-g]"), function (b) { b.onclick = function () { GXS = null; go("ghid", b.getAttribute("data-g")); }; });
  }
  function gxDevName(d) { return d === "r" ? "ROUTER (R1)" : d === "pc" ? "LAPTOP (cmd)" : "SWITCH (S1)"; }
  function gxPrompt(G, d) { var s = G.S[d]; return d === "pc" ? "C:\\Users\\student>" : s.pend ? "" : cliPrompt(s); }
  function gxAfter(G, st) { var d = st.d || "sw", s = G.S[d], sn = gxSnap(s); try { cliRun(s, st.c); } catch (e) {} var p = s.pend ? "(întrebare: răspunde și Enter)" : cliPrompt(s); gxRest(s, sn); return p; }
  function gxFinish(X, G) {
    if (G.done) return; G.done = true; var k = gxKey(X.id, G.tier), first = !P.cli[k]; P.cli[k] = Date.now(); if (first) addXP(10 + 5 * G.tier); saveP(); SND.ok();
  }
  function gxStepView(X) {
    var G = GXS, st = X.steps[G.i], T = G.tier, n = X.steps.length;
    var h = '<section class="card gxrun"><button class="back" id="backBtn">‹ Pas cu pas</button><h2 class="gxh">' + X.ic + " " + esc(X.t) + '</h2><div class="seg" id="gxTier">' + GX_TIERS.map(function (t) { return '<button data-t="' + t[0] + '" class="' + (+t[0] === T ? "on" : "") + '">' + t[0] + " " + esc(t[1]) + "</button>"; }).join("") + "</div>" +
      '<div class="gxbar"><i style="width:' + Math.round(100 * G.i / n) + '%"></i></div><div class="small muted">Pasul ' + Math.min(G.i + 1, n) + " din " + n + (G.wrong ? " · " + G.wrong + (G.wrong === 1 ? " încercare greșită" : " încercări greșite") : "") + "</div>";
    if (!st) {
      gxFinish(X, G);
      var nx = GX[GX.indexOf(X) + 1];
      h += '<div class="fact tok gxdone"><b>✅ Gata! Exercițiul e terminat la nivelul ' + T + " (" + esc(GX_TIERS[T - 1][1]) + ").</b><br>" + (G.wrong ? "Ai avut " + G.wrong + (G.wrong === 1 ? " încercare greșită" : " încercări greșite") + " – e normal, așa se învață." : "Fără nicio greșeală. Bravo!") + " Progresul e salvat în cont.</div>" +
        (T < 4 ? '<button class="big" id="gxUp">Încearcă nivelul ' + (T + 1) + " (" + esc(GX_TIERS[T][1]) + ")</button>" : "") + (nx ? '<button class="ghost" id="gxNext">Exercițiul următor: ' + esc(nx.t) + "</button>" : "") + '<button class="ghost" id="gxAgain">Refă de la început</button></section>';
      app.innerHTML = h; coHook("gx");
      $("backBtn").onclick = function () { go("ghid"); };
      if ($("gxUp")) $("gxUp").onclick = function () { GXS = null; go("ghid", X.id + ":" + (T + 1)); };
      if ($("gxNext")) $("gxNext").onclick = function () { GXS = null; go("ghid", nx.id + ":" + T); };
      $("gxAgain").onclick = function () { GXS = null; go("ghid", X.id + ":" + T); };
      return;
    }
    var past = X.steps.slice(Math.max(0, G.i - 3), G.i).filter(function (x) { return (!x.k || x.k === "cli" || x.k === "win") && x.c && !x.pend; });
    G.qd = G.qd || {};
    if (G.i > 0 && G.i % 3 === 0 && past.length >= 2 && !G.qd[G.i]) {
      if (T === 1) { h += '<div class="fact tip small"><b>🔁 Recapitulare (ultimii pași):</b><br>' + past.map(function (x) { return "<code>" + esc(x.c) + "</code> → " + esc(x.goal); }).join("<br>") + "</div>"; }
      else if (T <= 3) {
        var qx = past[Math.floor(Math.random() * past.length)], others = shuffle(X.steps.filter(function (x) { return x.goal && x.goal !== qx.goal && x.c && x.c !== qx.c; })).slice(0, 2), opts = shuffle([qx.goal].concat(others.map(function (x) { return x.goal; })));
        h += '<div class="gxstep"><div class="gxdev">🔁 Mini-test de recapitulare</div><div class="gxq">Ce face comanda <code>' + esc(qx.c) + '</code>?</div><div class="gxopts" id="gxQ">' + opts.map(function (o) { return '<button class="opt" data-ok="' + (o === qx.goal ? 1 : 0) + '">' + esc(o) + "</button>"; }).join("") + '</div><div id="gxQf"></div></div></section>';
        app.innerHTML = h;
        Array.prototype.forEach.call(app.querySelectorAll("#gxQ .opt"), function (b) { b.onclick = function () { if (b.getAttribute("data-ok") === "1") { b.classList.add("right"); $("gxQf").innerHTML = '<div class="fact tok small">✓ Exact. ' + esc(qx.why) + "</div>"; setTimeout(function () { G.qd[G.i] = 1; gxStepView(X); }, 1800); } else { b.classList.add("wrong"); b.disabled = true; G.wrong++; $("gxQf").innerHTML = '<div class="fact tbad small">Nu. Gândește-te la cuvinte: ' + decode(qx.c) + "</div>"; } }; });
        return;
      }
    }
    var k = st.k || "cli", d = k === "win" || k === "ip" ? "pc" : st.d || "sw", prev = X.steps[G.i - 1], prevD = prev ? (prev.k === "win" || prev.k === "ip" ? "pc" : prev.k === "ch" ? null : prev.d || "sw") : null;
    h += '<div class="gxstep"><div class="gxdev d-' + d + '">' + (k === "ch" ? "❓ Întrebare" : (k === "ip" ? "💻 " : d === "pc" ? "💻 " : d === "r" ? "🧭 " : "🔀 ") + gxDevName(d)) + "</div>" + (k !== "ch" && prevD && prevD !== d ? '<div class="fact tip small">➡️ Acum treci pe <b>' + gxDevName(d) + "</b>.</div>" : "");
    if (k === "ch") {
      var vkey = "qv:" + X.id + ":" + G.i;
      if (!(G.ord && G.ord.i === G.i)) { var vs = gxVariant(st, vkey), ordr = shuffle(vs.o.map(function (x, j) { return j; })); G.ord = { i: G.i, o: ordr, st: vs }; P.cli = P.cli || {}; P.cli[vkey] = Date.now() * 10 + (vs.vi || 0); saveP(); }
      st = G.ord.st;
      h += '<div class="gxq">' + esc(st.q) + '</div><div class="gxopts" id="gxO">' + G.ord.o.map(function (j) { return '<button class="opt" data-j="' + j + '">' + esc(st.o[j]) + "</button>"; }).join("") + "</div>";
    } else {
      h += '<div class="gxgoal">🎯 ' + esc(st.goal) + "</div>";
      if (k === "ip") { h += '<div class="gxip"><div class="small muted">Internet Protocol Version 4 (TCP/IPv4) Properties · ◉ Use the following IP address:</div><label>IP address <input id="ipA" inputmode="decimal" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="ex. 192.168.10.10"></label><label>Subnet mask <input id="ipM" inputmode="decimal" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="ex. 255.255.255.0"></label><label>Default gateway <input id="ipG" inputmode="decimal" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="ex. 192.168.10.1"></label><button class="big" id="ipOk">OK</button></div>'; }
      else {
        var cmd = st.c === "" ? "(Enter – lasă căsuța goală)" : st.c;
        if (T === 1) h += '<div class="gxcmd"><span class="small">⌨️ Tastează exact:</span><code>' + esc(cmd) + "</code>" + (st.sh ? '<span class="small muted">Prescurtat merge și: ' + esc(st.sh) + "</span>" : "") + "</div>";
        else if (T === 2) h += '<div class="gxcmd"><span class="small">⌨️ Completează cuvântul lipsă și tastează toată comanda:</span><code>' + esc(st.c === "" ? cmd : gxBlank(st)) + "</code></div>";
        else h += '<div class="gxcmd" id="gxHintBox">' + (G.hl >= 1 ? '<span class="small">💡 Indiciu:</span><code>' + esc(G.hl >= 2 || st.c === "" ? cmd : gxBlank(st)) + "</code>" : '<span class="small muted">Gândește-te ce comandă face asta. Dacă nu știi, apasă 💡.</span>') + "</div>";
        if (k === "cli") h += '<div class="gxpr small">Promptul acum: <code>' + esc(gxPrompt(G, d) || "(întrebare de la echipament)") + "</code> → după: <code>" + esc(gxAfter(G, st)) + "</code></div>";
      }
      var gxRev = T === 1 || G.hl >= 2 || !(k === "cli" || k === "win") || st.c === "";
      h += '<details class="gxwhy"' + (T === 1 ? " open" : "") + '><summary>🧒 De ce? (și ce înseamnă cuvintele)</summary>' + (k === "cli" || k === "win" ? decode(gxRev ? st.c : T === 2 || G.hl === 1 ? gxBlank(st) : "") : "") + '<p>' + esc(gxRev ? st.why : gxHide(st.why, st)) + "</p></details>";
    }
    h += '</div><div id="gxFb"></div>' + (k === "ch" || k === "ip" ? "" : '<div id="gxTerm"></div>') + '<div class="row2">' + (T === 3 && k !== "ch" && k !== "ip" ? '<button class="ghost sm" id="gxHint">💡 Indiciu</button>' : "") + '<button class="ghost sm" id="gxSheetB">📄 Fișa</button><button class="ghost sm" id="gxRestart">↺ De la început</button></div></section>';
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("ghid"); };
    $("gxSheetB").onclick = function () { go("ghid", "fisa"); };
    $("gxRestart").onclick = function () { if (!confirm("Începi exercițiul de la zero? Pierzi pașii făcuți.")) return; GXS = null; go("ghid", X.id + ":" + T); };
    Array.prototype.forEach.call(app.querySelectorAll("#gxTier button"), function (b) { b.onclick = function () { GXS = null; go("ghid", X.id + ":" + b.getAttribute("data-t")); }; });
    function adv() { G.i++; G.hl = 0; G.ord = null; while (X.steps[G.i] && X.steps[G.i].pend) { var ps = X.steps[G.i], pd = G.S[ps.d || "sw"]; var already = false; try { already = !pd.pend && ps.ok(pd); } catch (e) {} if (!already) break; G.i++; } setTimeout(function () { if (GXS === G && view === "practice") gxStepView(X); var t = app.querySelector(".gxstep"); if (t && t.scrollIntoView) { try { window.scrollTo(0, Math.max(0, t.getBoundingClientRect().top + window.pageYOffset - 70)); } catch (e) {} } var i2 = app.querySelector("#gxTerm input"); if (i2) i2.focus({ preventScroll: true }); }, 650); }
    function fb(ok, html) { $("gxFb").innerHTML = '<div class="fact ' + (ok ? "tok" : "tbad") + '">' + html + "</div>"; }
    if (k === "ch") {
      Array.prototype.forEach.call(app.querySelectorAll("#gxO .opt"), function (b) { b.onclick = function () {
        var j = +b.getAttribute("data-j");
        if (j === 0) { b.classList.add("right"); fb(true, "<b>✓ Corect.</b> " + esc(st.why)); Array.prototype.forEach.call(app.querySelectorAll("#gxO .opt"), function (x) { x.disabled = true; }); setTimeout(function () { G.i++; G.ord = null; gxStepView(X); }, T === 4 ? 400 : 2600); }
        else { G.wrong++; b.classList.add("wrong"); b.disabled = true; fb(false, "<b>✗ Nu.</b> " + (T <= 2 ? esc(st.why) : "Mai încearcă.")); }
      }; });
      return;
    }
    if (k === "ip") {
      $("ipOk").onclick = function () {
        var a = cliNorm($("ipA").value).trim(), m = cliNorm($("ipM").value).trim(), g = cliNorm($("ipG").value).trim(), L = G.S.pc, er = [];
        if (!ipOk(a)) er.push("IP address nu e o adresă validă (4 numere 0–255 cu punct)."); else if (!/^192\.168\.10\.\d+$/.test(a)) er.push("Laptopul trebuie să fie în rețeaua switch-ului: 192.168.10.x."); else if (/\.(0|255)$/.test(a)) er.push(".0 e adresa rețelei și .255 e broadcast – nu le poți da unui calculator."); else if (/\.(1|2)$/.test(a)) er.push(".1 e routerul și .2 e switch-ul – adresa ar fi în conflict. Pune ex. 192.168.10.10.");
        if (m !== "255.255.255.0") er.push("Masca este 255.255.255.0 (/24).");
        if (g !== "192.168.10.1") er.push("Gateway-ul este IP-ul routerului: 192.168.10.1.");
        if (er.length) { G.wrong++; fb(false, "<b>✗ Mai verifică:</b><br>" + er.map(esc).join("<br>")); return; }
        L.ip = a; L.mask = m; L.gw = g; L.dhcp = false; fb(true, "<b>✓ Salvat.</b> Laptopul are acum IP static " + esc(a) + "."); adv();
      };
      return;
    }
    if ($("gxHint")) $("gxHint").onclick = function () { G.hl = Math.min(2, G.hl + 1); G.hint++; gxStepView(X); };
    var lines = G.lines[d] || (G.lines[d] = d === "pc" ? [["Microsoft Windows [Version 10.0.19045.4529]", ""], ["(c) Microsoft Corporation. All rights reserved.", ""], ["", ""]] : [[d === "r" ? "Cisco 1941 – consolă 9600 8N1 (simulat)" : "Cisco Catalyst 2960 – consolă 9600 8N1 (simulat)", "thint"], ["Press RETURN to get started!", ""], ["", ""]]);
    topoMount(G.S, "gxTerm");
    var s = G.S[d], TB = termBox($("gxTerm"), { lines: lines, hist: d === "pc" ? s.hist : s.hist, cls: d === "pc" ? "wcmd gxterm" : "gxterm",
      prompt: function () { return gxPrompt(G, d); },
      echo: function (v) { return gxPrompt(G, d) + (d !== "pc" && s.pend && /parola|Password/i.test(lines.length ? lines[lines.length - 1][0] : "") ? "" : v); },
      complete: d === "pc" ? null : function (v) { return cliComplete(s, v); },
      cls2: d === "pc" ? function (l) { return /^\(/.test(l) ? "thint" : /not recognized|could not|timed out|failed|refused|denied|incorrect/.test(l) ? "terr" : ""; } : function (l) { return /^%(?!SYS|LINK|LINEPROTO|SSH| Generating| You already)|^\s*\^$/.test(l) ? "terr" : /^\(|^%LINK|^%LINEPROTO|^%SYS|^%SSH/.test(l) ? "thint" : ""; },
      run: function (v) {
        var vv = cliNorm(v).trim();
        if (d !== "pc" && /\?$/.test(vv)) { var hr = cliRun(s, v); G.pass = st.help ? 1 : 0; return hr; }
        if (!vv && !st.pend) { G.pass = 0; return d === "pc" ? [] : []; }
        var sn = d === "pc" ? null : gxSnap(s), out = [];
        try { out = d === "pc" ? winRun(s, v) : cliRun(s, v); } catch (e) { out = ["(eroare internă a simulatorului)"]; }
        var ok = false; try { ok = gxSame(vv, st.c, !!st.pend) && !!st.ok(s, out, v); } catch (e) {}
        G.pass = ok ? 1 : 0;
        var isErr = out.some(function (l) { return /^%|Invalid|Incomplete|Ambiguous|Unknown|Unrecognized|not recognized/.test(l); });
        if (!ok && d !== "pc" && /Ambiguous/.test(out.join(" ")) && /^en\b/i.test(vv)) out = out.concat(["(În modul config, „en” poate fi enable SAU end – de aceea IOS spune Ambiguous. Scrie ena / enable, ori end.)"]);
        if (!ok && sn && !isErr && vv && st.c && gxSame(vv, st.c, false)) { G.lastBad = { v: vv, out: out }; return out.concat(["(Comanda e corectă pentru IOS și a rămas aplicată. Exercițiul cere exact: " + st.c + " – scrie-o și pe aceasta.)"]); }
        if (!ok) { G.wrong++; G.lastBad = { v: vv, out: out }; if (sn) { var pb = s.pend ? "?" : cliPrompt(s); gxRest(s, sn); var pa2 = s.pend ? "?" : cliPrompt(s); if (pb !== pa2 || !out.some(function (l) { return /Invalid|Incomplete|Ambiguous|Unknown|Unrecognized/.test(l); })) out = out.concat(["(↩ anulat de exercițiu – ai rămas în " + (s.pend ? "întrebarea echipamentului" : pa2) + ")"]); } }
        return out;
      },
      onChange: function () {
        if (G.pass === 1 && G.i < X.steps.length && X.steps[G.i] === st) { G.pass = 0; fb(true, "<b>✓ Corect!</b> " + (T <= 3 ? "Uite ce a răspuns echipamentul mai sus." : "") + (T >= 2 && st.why ? '<br><span class="small">🧒 <code>' + esc(st.c) + "</code>: " + esc(st.why) + "</span>" : "")); adv(); return; }
        if (G.lastBad) { var lb = G.lastBad; G.lastBad = null; var err = lb.out.some(function (l) { return /Invalid input|Incomplete|Ambiguous|Unknown command|Unrecognized|not recognized/.test(l); });
          var tip = d !== "pc" ? cliTip(s, lb.v) : "", diff = gxDiff(lb.v, st.c);
          fb(false, "<b>✗ " + (err ? "Echipamentul nu a înțeles comanda." : "Comanda a mers, dar nu e cea cerută la acest pas.") + "</b>" + (tip ? "<br>💡 " + esc(tip) : "") + (diff && T <= 3 ? "<br>" + diff : "") + (T <= 2 || G.hl >= 2 ? '<br>Trebuia: <code>' + esc(st.c === "" ? "(doar Enter)" : st.c) + "</code>" : "") + '<br><span class="small muted">Am dat înapoi: echipamentul a rămas exact cum era înainte de comanda greșită. Încearcă din nou.</span>');
        }
      } });
    var inp = $("gxTerm").querySelector("input"); if (inp) { inp.setAttribute("autocomplete", "off"); inp.setAttribute("enterkeyhint", "go"); }
  }
  function gxSame(v, want, pend) {
    if (pend || want == null || want === "") return true;
    var a = v.toLowerCase().split(/\s+/).filter(Boolean), b = want.toLowerCase().split(/\s+/); if (a[0] === "do" && a.length > 1) a = a.slice(1);
    if (!a.length) return false; if (b[0].indexOf(a[0]) === 0) return true;
    if (b[0] === "copy" && /^wr/.test(a[0])) return true; if (b[0] === "line" && a[0] === "line") return true;
    return false;
  }
  function gxDiff(v, want) {
    if (want == null || want === "") return "";
    var a = v.toLowerCase().split(/\s+/).filter(Boolean), b = want.toLowerCase().split(/\s+/);
    if (!a.length) return "Căsuța era goală: tastează comanda și apoi Enter.";
    for (var i = 0; i < b.length; i++) { if (!a[i]) return "Lipsește continuarea: după „" + esc(a.join(" ")) + "” mai urmează <code>" + esc(b.slice(i).join(" ")) + "</code>."; if (b[i].indexOf(a[i]) !== 0 && !(i === 0 && kw(a[i], [b[i]]) === b[i])) return "Cuvântul nr. " + (i + 1) + " e greșit: ai scris „" + esc(a[i]) + "”, trebuia „" + esc(b[i]) + "”."; }
    if (a.length > b.length) return "Ai scris în plus: „" + esc(a.slice(b.length).join(" ")) + "”.";
    return "";
  }
  function gxExam(X) {
    var G = GXS, devs = []; X.steps.forEach(function (s) { var d = s.k === "win" || s.k === "ip" ? "pc" : s.k === "ch" ? null : s.d || "sw"; if (d && devs.indexOf(d) < 0) devs.push(d); });
    G.dev = G.dev || devs[0];
    var goals = X.steps.filter(function (s) { return (s.fin && s.c !== "") || s.k === "win" || s.k === "ip"; });
    var h = '<section class="card gxrun"><button class="back" id="backBtn">‹ Pas cu pas</button><h2 class="gxh">' + X.ic + " " + esc(X.t) + ' – nivel 4 (Examen)</h2><div class="ctask"><b>Subiect:</b> ' + esc(X.d) + '<ul class="small">' + goals.map(function (g) { return "<li>" + esc(g.goal) + "</li>"; }).join("") + '</ul><span class="small muted">Fără indicii. Lucrezi singur, apoi apeși „Predau”. Comenzile se pot prescurta. Pentru laptop folosești cmd (ex. netsh interface ip set address "Ethernet" static IP MASCĂ GATEWAY sau formularul).</span></div>' +
      '<div class="seg" id="gxDev">' + devs.map(function (d) { return '<button data-d="' + d + '" class="' + (d === G.dev ? "on" : "") + '">' + gxDevName(d) + "</button>"; }).join("") + '</div><div id="gxTerm"></div>' + (G.dev === "pc" && X.steps.some(function (s) { return s.k === "ip"; }) ? '<details class="ghostd"><summary>Setări IPv4 (ncpa.cpl)</summary><div class="gxip"><label>IP address <input id="ipA" inputmode="decimal" autocapitalize="off" autocorrect="off" value="' + esc(G.S.pc.dhcp ? "" : G.S.pc.ip) + '"></label><label>Subnet mask <input id="ipM" inputmode="decimal" autocapitalize="off" autocorrect="off" value="' + esc(G.S.pc.dhcp ? "" : G.S.pc.mask) + '"></label><label>Default gateway <input id="ipG" inputmode="decimal" autocapitalize="off" autocorrect="off" value="' + esc(G.S.pc.dhcp ? "" : G.S.pc.gw) + '"></label><button class="ghost" id="ipOk">OK</button></div></details>' : "") +
      '<div id="gxFb"></div><button class="big" id="gxSubmit">Predau</button></section>';
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("ghid"); };
    Array.prototype.forEach.call(app.querySelectorAll("#gxDev button"), function (b) { b.onclick = function () { G.dev = b.getAttribute("data-d"); gxExam(X); }; });
    if ($("ipOk")) $("ipOk").onclick = function () { var a = cliNorm($("ipA").value).trim(), m = cliNorm($("ipM").value).trim(), g = cliNorm($("ipG").value).trim(); if (!ipOk(a) || !maskOk(m) || (g && !ipOk(g))) { toast("Adresă invalidă."); return; } var L = G.S.pc; L.ip = a; L.mask = m; L.gw = g; L.dhcp = false; L.did.ipset = 1; toast("IPv4 salvat."); };
    var d = G.dev, s = G.S[d], lines = G.lines[d] || (G.lines[d] = d === "pc" ? [["Microsoft Windows [Version 10.0.19045.4529]", ""], ["", ""]] : [[d === "r" ? "Cisco 1941 – consolă 9600 8N1 (simulat)" : "Cisco Catalyst 2960 – consolă 9600 8N1 (simulat)", "thint"], ["", ""]]);
    topoMount(G.S, "gxTerm");
    if (d === "pc") winBox($("gxTerm"), s, function () { return "Fără indicii la nivelul Examen."; }); else termBox($("gxTerm"), { lines: lines, hist: s.hist, prompt: function () { return gxPrompt(G, d); }, echo: function (v) { return gxPrompt(G, d) + (s.pend && /parola|Password/i.test(lines.length ? lines[lines.length - 1][0] : "") ? "" : v); }, run: function (v) { return cliRun(s, v); }, complete: function (v) { return cliComplete(s, v); }, cls2: function (l) { return /^%(?!SYS|LINK|LINEPROTO|SSH| Generating| You already)|^\s*\^$/.test(l) ? "terr" : /^\(|^%LINK|^%LINEPROTO|^%SYS|^%SSH/.test(l) ? "thint" : ""; } });
    $("gxSubmit").onclick = function () {
      var res = goals.map(function (g) { var ok = false; try { if (g.k === "ip") { var L = G.S.pc; ok = !L.dhcp && /^192\.168\.10\.\d+$/.test(L.ip) && !/\.(0|1|2|255)$/.test(L.ip) && L.mask === "255.255.255.0" && L.gw === "192.168.10.1"; } else if (g.k === "win") ok = !!g.ok(G.S.pc); else { var sd = G.S[g.d || "sw"]; ok = !!g.ok(sd) && (!/^copy|^$/.test(g.c) || true); } } catch (e) {} return [g, ok]; });
      var sw = G.S.sw, saved = !X.steps.some(function (x) { return x.c === "copy running-config startup-config" && (x.d || "sw") === "sw"; }) || (sw.saved && cfgEq(sw));
      var rs = !X.steps.some(function (x) { return x.c === "copy running-config startup-config" && x.d === "r"; }) || (G.S.r.saved && cfgEq(G.S.r));
      var nOk = res.filter(function (r) { return r[1]; }).length, tot = res.length, pass = nOk === tot && saved && rs;
      if (pass) gxFinish(X, G);
      $("gxFb").innerHTML = '<div class="fact ' + (pass ? "tok" : "tbad") + '"><b>' + (pass ? "✅ Admis! Toate cerințele sunt îndeplinite și salvate." : "Încă nu: " + nOk + " din " + tot + " cerințe" + (saved && rs ? "" : " · configurația NU e salvată (copy run start)")) + "</b>" + '<ul class="small">' + res.map(function (r) { return "<li>" + (r[1] ? "✓ " : "✗ ") + esc(r[0].goal) + (r[1] ? "" : ' → <code>' + esc(r[0].k === "ip" ? "IP 192.168.10.10 / 255.255.255.0 / GW 192.168.10.1" : r[0].c) + "</code>") + "</li>"; }).join("") + "</ul></div>";
      $("gxFb").scrollIntoView && $("gxFb").scrollIntoView({ block: "nearest" });
      if (pass) coHook("gx");
    };
  }
  function gxSheet() {
    var seq = [["Switch>", "enable", "intri în modul privilegiat"], ["Switch#", "configure terminal", "configurare globală (conf t)"], ["Switch(config)#", "hostname S1", "numele (obligatoriu pentru RSA)"], ["S1(config)#", "no ip domain-lookup", "fără așteptare la greșeli"], ["S1(config)#", "ip domain-name sts.ro", "domeniul (obligatoriu pentru RSA)"], ["S1(config)#", "username admin privilege 15 secret cisco123", "utilizatorul pentru SSH"], ["S1(config)#", "vlan 10", "creezi VLAN 10"], ["S1(config-vlan)#", "name MGMT", "numele VLAN-ului"], ["S1(config-vlan)#", "exit", ""], ["S1(config)#", "interface fa0/1", "portul laptopului"], ["S1(config-if)#", "switchport mode access", ""], ["S1(config-if)#", "switchport access vlan 10", ""], ["S1(config-if)#", "exit", ""], ["S1(config)#", "interface vlan 10", "interfața de management"], ["S1(config-if)#", "ip address 192.168.10.2 255.255.255.0", "IP-ul switch-ului"], ["S1(config-if)#", "no shutdown", "o pornești!"], ["S1(config-if)#", "exit", ""], ["S1(config)#", "ip default-gateway 192.168.10.1", "IP-ul routerului"], ["S1(config)#", "crypto key generate rsa", "→ How many bits: 1024 + Enter"], ["S1(config)#", "ip ssh version 2", ""], ["S1(config)#", "line vty 0 15", "liniile de acces de la distanță"], ["S1(config-line)#", "transport input ssh", "doar SSH"], ["S1(config-line)#", "login local", "user + parolă din username"], ["S1(config-line)#", "end", ""], ["S1#", "show ip ssh", "SSH Enabled - version 2.0"], ["S1#", "copy running-config startup-config", "→ Enter (sau wr)"]];
    var rtr = [["Router>", "enable", ""], ["Router#", "configure terminal", ""], ["Router(config)#", "hostname R1", ""], ["R1(config)#", "interface g0/0", "portul spre switch"], ["R1(config-if)#", "ip address 192.168.10.1 255.255.255.0", ""], ["R1(config-if)#", "no shutdown", "pe router porturile pornesc OPRITE"], ["R1(config-if)#", "end", ""], ["R1#", "show ip interface brief", "Gi0/0 up/up"], ["R1#", "copy running-config startup-config", "→ Enter"]];
    var trk = [["S1(config)#", "interface gi0/1", ""], ["S1(config-if)#", "switchport mode trunk", ""], ["S1(config-if)#", "switchport trunk allowed vlan 10,20", "opțional"], ["S1#", "show interfaces trunk", "verificare"]];
    var pc = [["Win+R", "ncpa.cpl", "Ethernet → Properties → IPv4 → IP 192.168.10.10 / 255.255.255.0 / GW 192.168.10.1"], ["Win+R", "devmgmt.msc", "Ports (COM & LPT) → COM3 (exemplu)"], ["C:\\>", "ipconfig  /  ipconfig /all", "IP, mască, gateway / + MAC"], ["C:\\>", "ping 192.168.10.2", "Reply from = merge"], ["C:\\>", "ssh -l admin 192.168.10.2", "parola cisco123"]];
    function tb(rows) { return '<table class="gxsheet"><tbody>' + rows.map(function (r) { return "<tr><td><code class=\"p\">" + esc(r[0]) + "</code></td><td><code>" + esc(r[1]) + "</code>" + (r[2] ? '<div class="small muted">' + esc(r[2]) + "</div>" : "") + "</td></tr>"; }).join("") + "</tbody></table>"; }
    var h = '<section class="card noprint"><button class="back" id="backBtn">‹ Pas cu pas</button><h2>📄 Fișa de comenzi – proba practică Cisco</h2><p class="small muted">Promptul (stânga) îți arată UNDE trebuie să fii. Tu tastezi doar comanda (dreapta).</p><button class="big" id="shPrint">🖨️ Tipărește / salvează PDF</button></section>' +
      '<section class="card"><h3>🪜 Scara promptului</h3><div class="gxlad"><div><code>Switch&gt;</code><span>holul (doar te uiți) — <b>enable</b> ↓</span></div><div><code>Switch#</code><span>apartamentul (show, copy, ping) — <b>conf t</b> ↓</span></div><div><code>Switch(config)#</code><span>caietul (hostname, vlan, username…) — <b>interface / line / vlan</b> ↓</span></div><div><code>Switch(config-if)#</code><span>pagina unei prize · <code>(config-line)#</code> liniile · <code>(config-vlan)#</code> VLAN</span></div></div><p class="small"><b>exit</b> = o treaptă în sus · <b>end</b> = direct la # · <b>do show …</b> = show din config · <b>?</b> = ce pot scrie aici · <b>Tab</b> = completează cuvântul.</p></section>' +
      '<section class="card"><h3>🔐 Switch: SSH + VLAN 10 (tot punctul)</h3><p class="small">🧠 Ordinea SSH: „<b>N</b>u <b>D</b>au <b>U</b>nui <b>C</b>oleg <b>V</b>echea <b>V</b>aliză” = <b>N</b>ume (hostname) · <b>D</b>omeniu · <b>U</b>sername · <b>C</b>heie (crypto rsa 1024) · <b>V</b>ersiune 2 · <b>V</b>ty (transport input ssh + login local).</p>' + tb(seq) + '</section>' +
      '<section class="card"><h3>🧭 Router: portul spre switch</h3>' + tb(rtr) + '<p class="small">Cablu switch ↔ router: <b>UTP drept</b> (echipamente diferite). Switch ↔ switch: crossover (echipamente la fel). Consolă: <b>rollover albastru</b>.</p></section>' +
      '<section class="card"><h3>🛣️ Trunk între switch-uri</h3>' + tb(trk) + '</section>' +
      '<section class="card"><h3>💻 Laptop + PuTTY</h3><p class="small">PuTTY: Connection type <b>Serial</b> · Serial line <b>COM3</b> (cel din Device Manager) · Speed <b>9600</b> (8N1, fără flow control) → Open → Enter. La „initial configuration dialog” răspunzi <b>no</b>.</p>' + tb(pc) + '</section>' +
      '<section class="card"><h3>🚨 Ce înseamnă erorile</h3><table class="gxsheet"><tbody><tr><td><code>% Invalid input detected at \'^\' marker.</code></td><td class="small">Greșeală de scriere exact unde arată ^ – sau ești în alt mod (uită-te la prompt).</td></tr><tr><td><code>% Incomplete command.</code></td><td class="small">Lipsește ceva la final (ex. un număr). Pune ? după spațiu.</td></tr><tr><td><code>% Ambiguous command</code></td><td class="small">Ai prescurtat prea mult (ex. „co” = configure / copy). Mai scrie o literă.</td></tr><tr><td><code>Translating "…"…</code></td><td class="small">Ai scris un cuvânt necunoscut în &gt; sau #. Așteaptă sau pune no ip domain-lookup.</td></tr><tr><td><code>administratively down</code></td><td class="small">Portul e oprit: no shutdown.</td></tr><tr><td><code>% Please define a domain-name first.</code></td><td class="small">Înainte de crypto: hostname + ip domain-name.</td></tr></tbody></table></section>';
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("ghid"); };
    $("shPrint").onclick = function () { window.print(); };
  }

  /* ================= SITUAȚII REALE LA LUCRU + CARDURI DE COMENZI ================= */
  var SC_BASE = ["en", "conf t", "hostname S1", "ip domain-name sts.ro", "username admin privilege 15 secret cisco123", "vlan 10", "name MGMT", "vlan 20", "name BIROU", "exit", "int vlan 10", "ip address 192.168.10.2 255.255.255.0", "no shut", "exit", "ip default-gateway 192.168.10.1", "crypto key generate rsa modulus 1024", "ip ssh version 2", "line vty 0 15", "transport input ssh", "login local", "end", "copy run start", ""];
  function scAcc(p, v) { return ["conf t", "int " + p, "switchport mode access", "switchport access vlan " + v, "end"]; }
  var SCN = [
    { id: "nou", ic: "🚓", t: "Switch nou la o secție de poliție", story: "Ai primit un Catalyst 2960 nou-nouț pentru secția de poliție nr. 1. Trebuie pregătit ca să-l poți administra de la birou, prin SSH, în VLAN 10.", sym: "Switch-ul e gol (configurație din fabrică).", task: "Nume SECTIA1 · VLAN 10 POLITIE · Fa0/1 acces în VLAN 10 · interface vlan 10 = 10.10.10.2/24 pornită · gateway 10.10.10.1 · domeniu sts.ro · utilizator admin (secret) · chei RSA 1024 · SSH v2 · vty 0 15 doar SSH + login local · salvat.", hints: ["Începe cu enable și conf t. Ordinea pentru SSH: Nume, Domeniu, User, Cheie, Versiune, Vty.", "VLAN: vlan 10 → name POLITIE. Port: interface fa0/1 → switchport mode access → switchport access vlan 10.", "IP: interface vlan 10 → ip address 10.10.10.2 255.255.255.0 → no shutdown. Apoi ip default-gateway 10.10.10.1.", "La final: end → copy running-config startup-config → Enter."], why: "Asta e configurarea standard a unui switch administrabil: are nume, are o adresă proprie într-un VLAN de management și se poate intra pe el doar criptat (SSH), cu utilizator și parolă. Fără salvare, după o pană de curent totul dispare.",
      g: [["nume SECTIA1", function (S) { return S.sw.host === "SECTIA1"; }], ["VLAN 10 POLITIE", function (S) { return S.sw.vlans[10] === "POLITIE"; }], ["Fa0/1 acces în VLAN 10", function (S) { var f = S.sw.ifs["FastEthernet0/1"]; return f.mode === "access" && f.vlan === 10; }], ["Vlan10 = 10.10.10.2/24 pornită", function (S) { var f = S.sw.ifs.Vlan10; return f && f.ip === "10.10.10.2" && f.mask === "255.255.255.0" && !f.shut; }], ["gateway 10.10.10.1", function (S) { return S.sw.gw === "10.10.10.1"; }], ["SSH gata (domeniu, user, RSA ≥ 1024, v2, vty ssh + login local)", function (S) { var s = S.sw; return !!s.dom && Object.keys(s.users).length && s.rsa >= 1024 && s.sshv === 2 && !cliSshWhy(s) && /ssh/.test(s.line.vty.tin) && !/telnet|all/.test(s.line.vty.tin); }], ["configurația salvată", function (S) { return S.sw.saved && cfgEq(S.sw); }]] },
    { id: "shut", ic: "🔌", t: "Un PC nu are rețea (portul e oprit)", pcPort: "FastEthernet0/5", pc: { ip: "192.168.10.20", mask: "255.255.255.0", gw: "192.168.10.1" }, init: { sw: SC_BASE.concat(scAcc("fa0/5", 10), ["conf t", "int fa0/5", "shutdown", "end", "copy run start", ""]) }, story: "Un coleg sună: „PC-ul de la ghișeu nu mai are rețea de azi-dimineață.” PC-ul e legat în portul Fa0/5 al switch-ului S1. Ai laptopul (cmd) și consola switch-ului.", sym: "Pe PC: ping la switch (192.168.10.2) nu merge.", task: "Află de ce, repară și verifică: ping de pe PC spre 192.168.10.2 trebuie să meargă, iar reparația să fie salvată.", hints: ["Întâi verifici PC-ul: ipconfig (are IP bun?) și ping 192.168.10.2.", "Pe switch: enable → show ip interface brief. Caută rândul FastEthernet0/5.", "„administratively down” = cineva a oprit portul cu shutdown. Repari: conf t → interface fa0/5 → no shutdown.", "Verifici din nou ping de pe PC, apoi pe switch: end → copy running-config startup-config."], why: "„administratively down” înseamnă că portul a fost oprit din comandă (shutdown), nu că e stricat cablul. „down/down” ar fi însemnat cablu scos sau stricat. no shutdown îl pornește. Ordinea bună la depanare: de jos în sus (cablu, port, VLAN, IP).",
      g: [["ai verificat cu show ip interface brief", function (S) { return S.sw.did.sipib; }], ["Fa0/5 pornit (no shutdown)", function (S) { return !S.sw.ifs["FastEthernet0/5"].shut; }], ["ping de pe PC spre 192.168.10.2 merge", function (S) { return S.pc.did.ping && S.pc.did.ping["192.168.10.2"]; }], ["reparația salvată", function (S) { return S.sw.saved && cfgEq(S.sw); }]] },
    { id: "vlan", ic: "🏷️", t: "Port în VLAN-ul greșit", pcPort: "FastEthernet0/5", pc: { ip: "192.168.10.20", mask: "255.255.255.0", gw: "192.168.10.1" }, init: { sw: SC_BASE.concat(scAcc("fa0/5", 20), ["copy run start", ""]) }, story: "După o mutare de birouri, PC-ul din portul Fa0/5 nu mai vede serverele și switch-ul. Cablul e bun, ledul portului e verde.", sym: "Pe PC: ping 192.168.10.2 nu merge, deși IP-ul PC-ului e corect (192.168.10.20/24).", task: "Află în ce VLAN e portul, mută-l în VLAN 10 (MGMT), verifică cu ping și salvează.", hints: ["Pe switch: enable → show vlan brief. În ce rând apare Fa0/5?", "Fa0/5 e în VLAN 20 (BIROU), iar adresele 192.168.10.x sunt în VLAN 10. Sunt ca două etaje fără scară între ele.", "Repari: conf t → interface fa0/5 → switchport access vlan 10 → end.", "Verifici: show vlan brief, ping de pe PC, apoi copy running-config startup-config."], why: "Portul era „pornit” și cablul bun, dar PC-ul stătea la alt etaj (VLAN 20). Un VLAN e o rețea separată: fără router între ele, PC-ul nu vede nimic din VLAN 10. show vlan brief e prima comandă când „ledul e verde dar nu merge”.",
      g: [["ai verificat cu show vlan brief", function (S) { return S.sw.did.svb; }], ["Fa0/5 în VLAN 10", function (S) { return S.sw.ifs["FastEthernet0/5"].vlan === 10; }], ["ping de pe PC spre 192.168.10.2 merge", function (S) { return S.pc.did.ping && S.pc.did.ping["192.168.10.2"]; }], ["salvat", function (S) { return S.sw.saved && cfgEq(S.sw); }]] },
    { id: "vty", ic: "🔐", t: "Laptopul nu intră prin SSH (liniile vty)", pc: { ip: "192.168.10.10", mask: "255.255.255.0", gw: "192.168.10.1" }, init: { sw: SC_BASE.concat(scAcc("fa0/1", 10), ["conf t", "line vty 0 15", "transport input telnet", "no login", "login", "end", "copy run start", ""]) }, story: "Un coleg a „umblat” la switch. Acum, de pe laptop, ssh -l admin 192.168.10.2 nu mai merge, deși ping-ul merge.", sym: "Pe laptop: ssh → Connection refused. Ping 192.168.10.2 merge.", task: "Găsește ce lipsește pe liniile vty, repară, testează SSH de pe laptop și salvează.", hints: ["Ping merge → rețeaua e bună. Problema e la acces. Pe switch: enable → show running-config și caută „line vty”.", "Vezi „transport input telnet” (doar Telnet are voie) și „login” fără „local”.", "Repari: conf t → line vty 0 15 → transport input ssh → login local → end.", "Testezi de pe laptop: ssh -l admin 192.168.10.2, apoi pe switch copy running-config startup-config."], why: "SSH are trei „chei”: chei RSA (lacătul), utilizator (username) și liniile vty care acceptă SSH (transport input ssh) și verifică utilizatorul (login local). Dacă lipsește una, ușa rămâne închisă. Ping-ul merge pentru că rețeaua n-are nicio problemă.",
      g: [["ai citit configurația (show running-config)", function (S) { return S.sw.did.srun; }], ["vty: transport input ssh", function (S) { return /ssh/.test(S.sw.line.vty.tin); }], ["vty: login local", function (S) { return S.sw.line.vty.login && S.sw.line.vty.local; }], ["SSH de pe laptop merge", function (S) { return S.pc.did.ssh; }], ["salvat", function (S) { return S.sw.saved && cfgEq(S.sw); }]] },
    { id: "rsa", ic: "🗝️", t: "SSH refuzat: lipsesc cheile RSA", pc: { ip: "192.168.10.10", mask: "255.255.255.0", gw: "192.168.10.1" }, init: { sw: SC_BASE.concat(scAcc("fa0/1", 10), ["conf t", "crypto key zeroize rsa", "end", "copy run start", ""]) }, story: "Switch-ul a fost resetat parțial de un coleg. Utilizatorul admin există, liniile vty sunt bune, dar SSH nu merge.", sym: "Pe laptop: ssh -l admin 192.168.10.2 → Connection refused.", task: "Verifică starea SSH, repară, testează de pe laptop, salvează.", hints: ["Pe switch: enable → show ip ssh.", "„SSH Disabled” + „Please create RSA keys” = nu există chei.", "Repari: conf t → crypto key generate rsa → 1024 (hostname și domeniul există deja).", "show ip ssh trebuie să arate SSH Enabled - version 2.0. Testezi de pe laptop, apoi copy running-config startup-config."], why: "Cheile RSA sunt lacătul conexiunii criptate. Fără ele SSH e oprit, oricât de bune ar fi utilizatorul și liniile vty. Cheile se fac doar după hostname + ip domain-name.",
      g: [["ai verificat cu show ip ssh", function (S) { return S.sw.did.sssh; }], ["chei RSA ≥ 768 biți", function (S) { return S.sw.rsa >= 768; }], ["SSH de pe laptop merge", function (S) { return S.pc.did.ssh; }], ["salvat", function (S) { return S.sw.saved && cfgEq(S.sw); }]] },
    { id: "trk", ic: "🛣️", t: "Trunk spre router: VLAN 20 lipsește", init: { sw: SC_BASE.concat(["conf t", "int gi0/1", "switchport mode trunk", "switchport trunk allowed vlan 10", "end", "copy run start", ""]) }, story: "Routerul face router-on-a-stick pentru VLAN 10 și VLAN 20 pe cablul legat în Gi0/1. Calculatoarele din VLAN 10 merg, cele din VLAN 20 (BIROU) nu ajung la gateway.", sym: "VLAN 10: OK. VLAN 20: nu ajunge la 192.168.20.1.", task: "Verifică trunk-ul, lasă să treacă și VLAN 20 FĂRĂ să tai VLAN 10, verifică și salvează.", hints: ["Pe switch: enable → show interfaces trunk. Uită-te la „Vlans allowed on trunk”.", "Scrie doar 10. VLAN 20 nu are voie pe trunk.", "Repari: conf t → interface gi0/1 → switchport trunk allowed vlan add 20 (cu ADD, altfel ștergi VLAN 10!).", "end → show interfaces trunk (10,20) → copy running-config startup-config."], why: "Trunk-ul e scara blocului, dar are o listă de etaje care au voie pe ea. VLAN 20 lipsea din listă. „add” adaugă la listă; fără „add” lista ar fi înlocuită și ai fi tăiat VLAN 10 – greșeală clasică în producție.",
      g: [["ai verificat cu show interfaces trunk", function (S) { return S.sw.did.strunk; }], ["VLAN 10 și 20 permise pe Gi0/1", function (S) { var a = S.sw.ifs["GigabitEthernet0/1"].allow; var l = a ? vParse(a) : [10, 20]; return l.indexOf(10) >= 0 && l.indexOf(20) >= 0; }], ["Gi0/1 rămâne trunk", function (S) { return S.sw.ifs["GigabitEthernet0/1"].mode === "trunk"; }], ["salvat", function (S) { return S.sw.saved && cfgEq(S.sw); }]] }
  ];
  var SCS = null;
  function scSession(X) {
    var S = gxSession({ init: X.init }); S.pcPort = X.pcPort || "FastEthernet0/1"; S.sw.cport = S.pcPort;
    if (X.pc) { S.pc.ip = X.pc.ip; S.pc.mask = X.pc.mask; S.pc.gw = X.pc.gw; S.pc.dhcp = false; }
    S.sw.did = {}; S.pc.did = {}; return S;
  }
  function vScen(id) {
    view = "practice"; navbar(true); P.cli = P.cli || {};
    var X = SCN.filter(function (x) { return x.id === id; })[0];
    if (!X) {
      var h = '<section class="card"><button class="back" id="backBtn">‹ Pas cu pas</button><h2>🧰 Situații reale la lucru</h2><p>Ca la serviciu la STS: primești o poveste și simptomele. <b>Tu afli cauza</b> cu comenzi show, repari și verifici. Indiciile vin doar dacă le ceri. La final îți explic de ce.</p><p class="small muted">Regula de aur la depanare: 1) verifici (show / ping), 2) repari, 3) verifici din nou, 4) salvezi.</p></section>';
      SCN.forEach(function (x) { var ok = !!P.cli["sc:" + x.id]; h += '<section class="card gxe"><h3>' + x.ic + " " + esc(x.t) + (ok ? " ✅" : "") + '</h3><p class="small muted">' + esc(x.sym) + '</p><button class="ghost" data-sc="' + x.id + '">' + (ok ? "Refă" : "Începe") + "</button></section>"; });
      app.innerHTML = h; $("backBtn").onclick = function () { go("ghid"); };
      Array.prototype.forEach.call(app.querySelectorAll("[data-sc]"), function (b) { b.onclick = function () { SCS = null; go("scen", b.getAttribute("data-sc")); }; });
      return;
    }
    if (!SCS || SCS.id !== X.id) SCS = { id: X.id, S: scSession(X), lines: {}, hint: 0, dev: X.pc ? "pc" : "sw", done: false };
    var G = SCS, devs = X.pc ? ["pc", "sw"] : ["sw"], d = G.dev, s = G.S[d];
    var h2 = '<section class="card gxrun"><button class="back" id="backBtn">‹ Situații reale</button><h2 class="gxh">' + X.ic + " " + esc(X.t) + '</h2><div class="ctask"><p>📖 ' + esc(X.story) + '</p><p>⚠️ <b>Simptom:</b> ' + esc(X.sym) + '</p><p>🎯 <b>Sarcina:</b> ' + esc(X.task) + "</p></div>" +
      '<div class="seg" id="scDev">' + devs.map(function (x) { return '<button data-d="' + x + '" class="' + (x === d ? "on" : "") + '">' + (x === "pc" ? "💻 Laptop / PC (cmd)" : "🔀 Switch S1 (consolă)") + "</button>"; }).join("") + '</div><div id="scTerm"></div>' +
      '<div id="scH">' + X.hints.slice(0, G.hint).map(function (t, i) { return '<div class="fact tip small">💡 ' + (i + 1) + ". " + esc(t) + "</div>"; }).join("") + "</div>" +
      '<div class="row2">' + (G.hint < X.hints.length ? '<button class="ghost sm" id="scHint">💡 Indiciu (' + (G.hint + 1) + "/" + X.hints.length + ")</button>" : "") + '<button class="ghost sm" id="scRe">↺ De la început</button></div><div id="scFb"></div><button class="big" id="scChk">Verifică ce am făcut</button></section>';
    app.innerHTML = h2;
    $("backBtn").onclick = function () { go("scen"); };
    $("scRe").onclick = function () { SCS = null; vScen(X.id); };
    if ($("scHint")) $("scHint").onclick = function () { G.hint++; vScen(X.id); };
    Array.prototype.forEach.call(app.querySelectorAll("#scDev button"), function (b) { b.onclick = function () { G.dev = b.getAttribute("data-d"); vScen(X.id); }; });
    var L = G.lines[d] || (G.lines[d] = d === "pc" ? [["Microsoft Windows [Version 10.0.19045.4529]", ""], ["", ""]] : [["Cisco Catalyst 2960 – consolă 9600 8N1 (simulat)", "thint"], ["Press RETURN to get started!", ""], ["", ""]]);
    topoMount(G.S, "scTerm");
    if (d === "pc") termBox($("scTerm"), { cls: "wcmd", lines: L, hist: s.hist, prompt: function () { return "C:\\Users\\student>"; }, run: function (v) { return winRun(s, v); }, cls2: function (l) { return /^\(/.test(l) ? "thint" : /not recognized|could not|timed out|failed|refused|denied|incorrect/.test(l) ? "terr" : ""; } });
    else termBox($("scTerm"), { lines: L, hist: s.hist, prompt: function () { return s.pend ? "" : cliPrompt(s); }, echo: function (v) { return (s.pend ? "" : cliPrompt(s)) + v; }, run: function (v) { return cliRun(s, v); }, complete: function (v) { return cliComplete(s, v); }, tip: function (v, out) { return out.some(function (l) { return /Invalid input|Incomplete|Ambiguous|Unknown command/.test(l); }) ? cliTip(s, v) : ""; }, cls2: function (l) { return /^%(?!SYS|LINK|LINEPROTO|SSH| Generating| You already)|^\s*\^$/.test(l) ? "terr" : /^\(|^%LINK|^%LINEPROTO|^%SYS|^%SSH/.test(l) ? "thint" : ""; } });
    $("scChk").onclick = function () {
      var r = X.g.map(function (g) { var ok = false; try { ok = !!g[1](G.S); } catch (e) {} return [g[0], ok]; }), all = r.every(function (x) { return x[1]; });
      if (all && !G.done) { G.done = true; var first = !P.cli["sc:" + X.id]; P.cli["sc:" + X.id] = Date.now(); if (first) addXP(25); saveP(); SND.ok(); }
      $("scFb").innerHTML = '<div class="fact ' + (all ? "tok" : "tbad") + '"><b>' + (all ? "✅ Rezolvat ca un profesionist!" : "Încă nu e gata:") + '</b><ul class="small">' + r.map(function (x) { return "<li>" + (x[1] ? "✓ " : "○ ") + esc(x[0]) + "</li>"; }).join("") + "</ul>" + (all ? "<p><b>De ce:</b> " + esc(X.why) + "</p>" : '<span class="small muted">Cere un indiciu dacă te-ai blocat.</span>') + "</div>";
    };
  }
  /* Carduri de comenzi (repetare spațiată, sincronizate): P.cli["cf:<i>:<dir>"] = timp*10 + cutie */
  var CFD = (function () { var seen = {}, r = []; GX.forEach(function (x) { x.steps.forEach(function (st) { if (st.c && !st.pend && (!st.k || st.k === "cli" || st.k === "win") && st.goal && !seen[st.c]) { seen[st.c] = 1; r.push([st.c, st.goal.replace(/^Pe (SWITCH|ROUTER): /, "").replace(/^Laptop: /, ""), st.why]); } }); }); return r; })();
  var CF_INT = [0, 1, 2, 3, 4, 6], CF_FINAL = new Date(2026, 9, 18).getTime();
  function cfKey(i, dir) { return "cf:" + i + ":" + dir; }
  function cfBox(i, dir) { var v = P.cli[cfKey(i, dir)]; return v ? v % 10 : 0; }
  function cfDue(i, dir) { var v = P.cli[cfKey(i, dir)]; if (!v) return true; if (Date.now() >= CF_FINAL && new Date(Math.floor(v / 10)).toDateString() !== new Date().toDateString()) return true; return Date.now() >= Math.floor(v / 10) + CF_INT[v % 10] * 864e5 - 36e5; }
  function cfDueN() { var n = 0; P.cli = P.cli || {}; CFD.forEach(function (c, i) { if (cfDue(i, 0)) n++; if (cfDue(i, 1)) n++; }); return n; }
  function vCmdCards() {
    view = "practice"; navbar(true); P.cli = P.cli || {};
    var pool = []; CFD.forEach(function (c, i) { [0, 1].forEach(function (dir) { if (cfDue(i, dir)) pool.push([i, dir]); }); });
    pool.sort(function (a, b) { return cfBox(a[0], a[1]) - cfBox(b[0], b[1]) || Math.random() - .5; });
    var learned = 0; CFD.forEach(function (c, i) { if (cfBox(i, 0) >= 3 && cfBox(i, 1) >= 3) learned++; });
    var S = { q: pool.slice(0, 20), i: 0, ok: 0 };
    function card() {
      var it = S.q[S.i];
      var head = '<section class="card"><button class="back" id="backBtn">‹ Pas cu pas</button><h2>🃏 Carduri de comenzi</h2><p class="small muted">Comanda → ce face, și ce faci → comanda. Ce greșești revine azi, ce știi revine mai rar (1, 2, 3, 4, 6 zile). Pe 17–18 octombrie se repetă tot, o dată pe zi. Învățate bine: ' + learned + " / " + CFD.length + ".</p>";
      if (!it) { app.innerHTML = head + '<div class="fact tok"><b>Gata pe azi' + (S.q.length ? ": " + S.ok + " / " + S.q.length + " corecte" : "") + ".</b> Revino mâine – cardurile apar exact când e momentul să le repeți.</div></section>"; $("backBtn").onclick = function () { go("ghid"); }; return; }
      var c = CFD[it[0]], h = head + '<div class="small muted">Cardul ' + (S.i + 1) + " / " + S.q.length + " · cutia " + cfBox(it[0], it[1]) + "</div>";
      if (it[1] === 0) {
        var opts = shuffle([c[1]].concat(shuffle(CFD.filter(function (x) { return x[1] !== c[1] && x[0] !== c[0]; })).slice(0, 2).map(function (x) { return x[1]; })));
        h += '<div class="gxq">Ce face comanda <code>' + esc(c[0]) + "</code>?</div>" + decode(c[0]).replace("🔤 Cuvânt cu cuvânt:", "🔤 Cuvintele:") + '<div class="gxopts" id="cfO">' + opts.map(function (o) { return '<button class="opt" data-ok="' + (o === c[1] ? 1 : 0) + '">' + esc(o) + "</button>"; }).join("") + "</div>";
      } else {
        h += '<div class="gxq">Ce comandă scrii ca să: <b>' + esc(c[1]) + '</b>?</div><form id="cfF" class="tin" autocomplete="off"><label>&gt;</label><input id="cfI" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Comanda"></form><button class="big" id="cfGo">Verifică</button>';
      }
      h += '<div id="cfFb"></div></section>';
      app.innerHTML = h; $("backBtn").onclick = function () { go("ghid"); };
      function res(ok) {
        var b = cfBox(it[0], it[1]); P.cli[cfKey(it[0], it[1])] = Date.now() * 10 + (ok ? Math.min(5, b + 1) : 0); if (ok) { S.ok++; addXP(1); } saveP();
        $("cfFb").innerHTML = '<div class="fact ' + (ok ? "tok" : "tbad") + '"><b>' + (ok ? "✓ Corect." : "✗ Nu încă.") + "</b> <code>" + esc(c[0]) + "</code> → " + esc(c[1]) + '<br><span class="small">' + esc(c[2]) + '</span></div><button class="big" id="cfN">Următorul</button>';
        $("cfN").onclick = function () { S.i++; card(); };
      }
      if (it[1] === 0) Array.prototype.forEach.call(app.querySelectorAll("#cfO .opt"), function (b) { b.onclick = function () { var ok = b.getAttribute("data-ok") === "1"; b.classList.add(ok ? "right" : "wrong"); Array.prototype.forEach.call(app.querySelectorAll("#cfO .opt"), function (x) { x.disabled = true; if (x.getAttribute("data-ok") === "1") x.classList.add("right"); }); res(ok); }; });
      else { var chk = function (e) { if (e) e.preventDefault(); if ($("cfN")) return; var v = cliNorm($("cfI").value).trim().toLowerCase().replace(/\s+/g, " "), want = c[0].toLowerCase(); var a = v.split(" "), w = want.split(" "), ok = a.length === w.length && a.every(function (x, j) { return x && (w[j].indexOf(x) === 0 && (x.length >= 2 || w[j].length === 1)) || (/^\d|\./.test(w[j]) && x === w[j]); }) && a.every(function (x, j) { return !/^[\d.\/]+$/.test(w[j]) || x === w[j]; }); if (!ok && /^(conf|configure)/.test(v) && want === "configure terminal") ok = /^conf\w* t\w*$/.test(v); res(ok); }; $("cfF").onsubmit = chk; $("cfGo").onclick = chk; }
    }
    card();
  }

  /* ---------- ecran: ordinea firelor RJ45 ---------- */
  var RJW = { "alb-portocaliu": ["#f97316", 1], "portocaliu": ["#f97316", 0], "alb-verde": ["#16a34a", 1], "albastru": ["#2563eb", 0], "alb-albastru": ["#2563eb", 1], "verde": ["#16a34a", 0], "alb-maro": ["#92400e", 1], "maro": ["#92400e", 0] };
  var T568 = { B: ["alb-portocaliu", "portocaliu", "alb-verde", "albastru", "alb-albastru", "verde", "alb-maro", "maro"], A: ["alb-verde", "verde", "alb-portocaliu", "albastru", "alb-albastru", "portocaliu", "alb-maro", "maro"] };
  function wireSw(n) { var c = RJW[n]; return '<span class="wsw" style="background:' + (c[1] ? "repeating-linear-gradient(90deg,#fff 0 5px," + c[0] + " 5px 10px)" : c[0]) + '"></span>'; }
  function vRj(std) {
    view = "practice"; navbar(true); std = std === "A" ? "A" : "B";
    var want = T568[std], got = [], pool = shuffle(want.slice()), checked = false;
    function paint() {
      var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.plug + ' Ordinea firelor în mufa RJ45</h2><p class="muted small">Ții mufa cu <b>clema în jos</b>, contactele aurii spre tine: pinul 1 e în <b>stânga</b>. Atinge firele în ordinea 1 → 8. Atinge un fir pus ca să-l scoți.</p>' +
        '<div class="seg" id="rjStd"><button data-s="B" class="' + (std === "B" ? "on" : "") + '">T568B (cel folosit la examen)</button><button data-s="A" class="' + (std === "A" ? "on" : "") + '">T568A</button></div>' +
        '<div class="rjplug" id="rjPlug">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var n = got[i], cls = checked && n ? (n === want[i] ? " ok" : " bad") : ""; return '<button class="rjpin' + cls + '" data-i="' + i + '"' + (n ? "" : " disabled") + ' aria-label="Pin ' + (i + 1) + (n ? ": " + n : " gol") + '"><i>' + (i + 1) + "</i>" + (n ? wireSw(n) + "<small>" + n.replace("alb-", "alb-<br>") + "</small>" : "<small>—</small>") + "</button>"; }).join("") + "</div>" +
        '<div class="rjpool" id="rjPool">' + pool.map(function (n, k) { return got.indexOf(n) >= 0 ? "" : '<button class="rjw" data-k="' + k + '">' + wireSw(n) + n + "</button>"; }).join("") + "</div>" +
        '<button class="big" id="rjChk"' + (got.length < 8 ? " disabled" : "") + '>Verifică (ca testerul: LED-urile 1–8)</button><button class="ghost" id="rjNew">Din nou ↻</button><div id="rjOut"></div>' +
        '<div class="fact small"><b>Memorare T568B:</b> <i>portocaliu – verde – albastru – maro</i>, albul mereu înainte; dar <b>albastrul</b> (pin 4) și <b>alb-albastru</b> (5) stau la mijloc, iar <b>verdele</b> sare peste ele (pin 3 și 6). Cablu drept: B la ambele capete. Crossover: A la un capăt, B la celălalt.</div></section>';
      app.innerHTML = h;
      $("backBtn").onclick = function () { go("practice"); };
      $("rjNew").onclick = function () { vRj(std); };
      Array.prototype.forEach.call(app.querySelectorAll("#rjStd button"), function (b) { b.onclick = function () { vRj(b.getAttribute("data-s")); }; });
      Array.prototype.forEach.call(app.querySelectorAll(".rjw"), function (b) { b.onclick = function () { if (got.length < 8) { got.push(pool[+b.getAttribute("data-k")]); checked = false; paint(); } }; });
      Array.prototype.forEach.call(app.querySelectorAll(".rjpin"), function (b) { b.onclick = function () { var i = +b.getAttribute("data-i"); if (got[i]) { got.splice(i, 1); checked = false; paint(); } }; });
      $("rjChk").onclick = function () {
        checked = true; var bad = []; got.forEach(function (n, i) { if (n !== want[i]) bad.push(i + 1); });
        paint();
        if (!bad.length) { P.cli = P.cli || {}; if (std === "B") P.cli["g:rj"] = P.cli["g:rj"] || Date.now(); addXP(5); saveP(); SND.ok(); setTimeout(function () { coHook("rj"); }, 0); $("rjOut").innerHTML = '<div class="fact tok"><b>✅ Corect – toate cele 8 LED-uri se aprind în ordine, 1↔1 … 8↔8. +5 XP</b><br>La probă: împingi firele până la capătul mufei (vezi cuprul în față), mantaua intră sub clema de presare, apoi sertizezi ferm.</div>'; }
        else { SND.bad(); $("rjOut").innerHTML = '<div class="eli trapw"><b>❌ Pinii ' + bad.join(", ") + ' sunt greșiți.</b> Pe tester ai vedea LED-urile acestor pini aprinzându-se în altă ordine (fire inversate) – examinatorul te pică.<br>Corect ' + "T568" + std + ": " + want.map(function (n, i) { return (i + 1) + "=" + n; }).join(", ") + "</div>"; }
      };
    }
    paint();
  }

  /* ---------- ecran: multimetru (selector + borne) ---------- */
  var MMP = [["off", "OFF", -90], ["vdc", "V⎓", -45], ["vac", "V~", 0], ["ohm", "Ω", 45], ["cont", "•)))", 90], ["ma", "mA⎓", 135], ["a10", "10A⎓", 180]];
  var MMJ = [["a10", "10A", 40], ["ma", "mA", 95], ["com", "COM", 150], ["v", "VΩ", 205]];
  var MMS = [
    ["Măsoară tensiunea unei baterii AA (1,5 V).", "vdc", "v", "V⎓ (DC), roșu în VΩ, negru în COM; vârful roșu pe + și negrul pe –. Afișaj ≈ 1,5–1,6 V (dacă vezi „-1.5”, ai inversat vârfurile, nu se strică nimic)."],
    ["Verifică tensiunea dintr-o priză de 230 V.", "vac", "v", "V~ (AC), roșu în VΩ. Ții vârfurile doar de mânerele izolate, cu o mână dacă se poate. Afișaj ≈ 220–240 V. NICIODATĂ pe Ω, continuitate sau curent – arzi siguranța sau aparatul."],
    ["Verifică dacă un fir dintr-un cablu e întreg (continuitate).", "cont", "v", "Continuitate (•))), roșu în VΩ. Circuitul trebuie să fie FĂRĂ tensiune. Bip = fir întreg; „OL”/fără bip = întrerupt."],
    ["Măsoară un rezistor scos din circuit (codul spune 1 kΩ).", "ohm", "v", "Ω, roșu în VΩ, rezistorul fără tensiune și scos din circuit (altfel măsori și restul). Nu ține cu degetele ambele capete – corpul tău e o rezistență în paralel."],
    ["Măsoară curentul consumat de un LED cu rezistor (câțiva mA).", "ma", "ma", "mA⎓, roșu în mA. Aparatul se pune ÎN SERIE: deschizi circuitul și închizi bucla prin multimetru. După măsurare, roșul înapoi în VΩ!"],
    ["Măsoară curentul unui motoraș de câțiva amperi.", "a10", "a10", "10A⎓, roșu în 10A (borna mA are siguranță mică și s-ar arde). În serie, scurt timp (de obicei max 10–30 s la 10 A)."],
    ["Verifică o siguranță fuzibilă scoasă din soclu.", "cont", "v", "Continuitate (sau Ω): bip / ~0 Ω = siguranță bună; OL = arsă. Întotdeauna scoasă din circuit, fără tensiune."],
    ["Verifică ieșirea unui alimentator de router (12 V DC).", "vdc", "v", "V⎓, roșu în VΩ; centrul mufei de obicei +, exteriorul –. Un afișaj mult sub 12 V în gol = alimentator defect."],
    ["Ai terminat măsurătorile. Cum lași aparatul?", "off", "v", "OFF, cu roșul în VΩ. Lăsat pe A cu roșul în 10A, următorul care măsoară o priză face scurtcircuit prin aparat."],
    ["Verifici dacă o perechea 1–2 a unui patch-cord e conectată capăt la capăt.", "cont", "v", "Continuitate, roșu în VΩ: un vârf pe pinul 1 de la un capăt, celălalt pe pinul 1 la capătul opus → bip. Testerul de cablu face același lucru pentru toți pinii deodată."]
  ];
  function mmSvg(pos, jack) {
    var cx = 160, cy = 175, h = '<svg class="mmsvg" viewBox="0 0 320 344" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" role="img" aria-label="Multimetru: selector și borne">';
    h += '<rect x="20" y="6" width="280" height="334" rx="26" fill="#f2b705" stroke="#8a6500" stroke-width="2"/><rect x="34" y="18" width="252" height="310" rx="18" fill="#2b2f36"/>';
    h += '<rect x="66" y="30" width="188" height="56" rx="6" fill="#b9c7a6" stroke="#111" stroke-width="2"/><text x="244" y="70" text-anchor="end" font-size="30" font-family="ui-monospace,Menlo,monospace" fill="#1f2a1a" id="mmLcd">' + ({ off: "", vdc: "0.00", vac: "0.0", ohm: "OL", cont: "OL", ma: "0.00", a10: "0.00" }[pos] || "") + '</text><text x="76" y="44" font-size="9" fill="#1f2a1a">' + ({ vdc: "DC V", vac: "AC V", ohm: "kΩ", cont: "•)))", ma: "DC mA", a10: "DC A" }[pos] || "") + "</text>";
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="52" fill="#15181d" stroke="#555" stroke-width="3"/>';
    MMP.forEach(function (p) { var a = p[2] * Math.PI / 180, x = cx + 74 * Math.sin(a), y = cy - 74 * Math.cos(a), on = p[0] === pos; h += '<g class="mmpos" data-p="' + p[0] + '" role="button" tabindex="0" aria-label="Selector ' + p[1] + '"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="19" fill="' + (on ? "#f2b705" : "#3a3f47") + '" stroke="' + (on ? "#fff" : "#666") + '"/><text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="middle" font-size="' + (p[1].length > 3 ? 9 : 12) + '" font-weight="700" fill="' + (on ? "#111" : "#eee") + '">' + p[1] + "</text></g>"; });
    var ang = (MMP.filter(function (p) { return p[0] === pos; })[0] || MMP[0])[2];
    h += '<g transform="rotate(' + ang + " " + cx + " " + cy + ')"><rect x="' + (cx - 9) + '" y="' + (cy - 46) + '" width="18" height="92" rx="9" fill="#444"/><path d="M' + cx + " " + (cy - 46) + "l-6 14h12z" + '" fill="#fff"/></g>';
    MMJ.forEach(function (j) { var x = j[2] + 18, on = j[0] === jack, isCom = j[0] === "com"; h += '<g class="mmjack" data-j="' + j[0] + '" role="button" tabindex="0" aria-label="Borna ' + j[1] + '"><circle cx="' + x + '" cy="290" r="15" fill="' + (isCom ? "#111" : on ? "#dc2626" : "#5b1111") + '" stroke="' + (on || isCom ? "#fff" : "#888") + '" stroke-width="2.5"/><circle cx="' + x + '" cy="290" r="6" fill="#000"/><text x="' + x + '" y="268" text-anchor="middle" font-size="10" font-weight="700" fill="#eee">' + j[1] + "</text></g>"; });
    h += '<text x="160" y="320" text-anchor="middle" font-size="9" fill="#bbb">negru mereu în COM · atinge borna pentru firul roșu</text></svg>';
    return h;
  }
  var MMST = { i: 0, ok: 0 };
  function vMm() {
    view = "practice"; navbar(true);
    var sc = MMS[MMST.i % MMS.length], pos = "off", jack = "v", done = false;
    function paint() {
      app.innerHTML = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.meter + ' Multimetrul: selector și borne</h2><p class="muted small">Scenariul ' + (MMST.i % MMS.length + 1) + "/" + MMS.length + " · corecte în sesiune: " + MMST.ok + '</p><div class="probl">' + esc(sc[0]) + '</div><div class="mmwrap">' + mmSvg(pos, jack) + '</div><p class="small muted">Selector: <b>' + MMP.filter(function (p) { return p[0] === pos; })[0][1] + "</b> · fir roșu în: <b>" + MMJ.filter(function (j) { return j[0] === jack; })[0][1] + '</b></p><button class="big" id="mmChk">Verifică</button><button class="ghost" id="mmNext">Scenariul următor ›</button><div id="mmOut"></div></section>';
      $("backBtn").onclick = function () { go("practice"); };
      Array.prototype.forEach.call(app.querySelectorAll(".mmpos"), function (g) { var f = function () { pos = g.getAttribute("data-p"); paint(); }; g.onclick = f; g.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }; });
      Array.prototype.forEach.call(app.querySelectorAll(".mmjack"), function (g) { var f = function () { var j = g.getAttribute("data-j"); if (j === "com") return toast("COM e borna firului negru – rămâne acolo."); jack = j; paint(); }; g.onclick = f; g.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }; });
      $("mmNext").onclick = function () { MMST.i++; vMm(); };
      $("mmChk").onclick = function () {
        var ok = pos === sc[1] && jack === sc[2], danger = (jack === "a10" || jack === "ma") && (sc[1] === "vac" || sc[1] === "vdc");
        if (ok) { if (!done) { done = true; MMST.ok++; P.cli = P.cli || {}; P.cli["mm" + (MMST.i % MMS.length)] = 1; if (MMS.every(function (_, j) { return P.cli["mm" + j]; })) P.cli["g:mm"] = P.cli["g:mm"] || Date.now(); addXP(5); saveP(); } SND.ok(); }
        else SND.bad();
        $("mmOut").innerHTML = '<div class="' + (ok ? "fact tok" : "eli trapw") + '"><b>' + (ok ? "✅ Corect" + (done ? " · +5 XP" : "") : danger ? "⚠ Periculos: cu roșul în borna de curent pe o sursă de tensiune faci scurtcircuit prin aparat (arde siguranța – sau mai rău, la 230 V)." : "❌ Nu e corect.") + "</b><br>" + esc(sc[3]) + "</div>";
      };
    }
    paint();
  }
  /* ---------- fișa printabilă „ce fac pas cu pas” ---------- */
  var PPS = [
    ["🔌 Cablu UTP drept (T568B) – țintă 8–10 min", ["Verific: cablu UTP, 2 mufe RJ45 (+1 rezervă), clește, dezizolator, tester", "Dezizolez mantaua ~3 cm, fără să crestez firele", "Desfac perechile, le îndrept, ordine T568B: AP-P-AV-A-AA-V-AM-M", "Tai drept la ~1,2–1,4 cm, toate egale", "Clema mufei în jos, pin 1 stânga; împing firele până în capăt (văd cuprul în față)", "Mantaua intră sub clema de presare din mufă", "Sertizez ferm, o singură dată, până la capăt", "Al doilea capăt identic (drept = B–B; crossover = A–B)", "Testez: LED-uri 1↔1 … 8↔8 în ordine; arăt examinatorului"]],
    ["📟 Multimetru – țintă 3–5 min", ["Negru în COM, roșu în VΩ (doar pentru curent: mA/10A)", "Baterie / alimentator: V⎓ (DC); priză: V~ (AC), numai de mânere", "Rezistență și continuitate: FĂRĂ tensiune, piesa scoasă din circuit", "Curent: aparatul în SERIE, borna potrivită (mA sau 10A)", "Citesc valoarea cu unitatea (V, mV, Ω, kΩ, A); OL = peste domeniu / întrerupt", "La final: OFF și roșul înapoi în VΩ"]],
    ["🖧 Switch Cisco – bază – țintă 10 min", ["Consolă: cablu albastru rollover, PuTTY, 9600 8N1, Enter", "enable → configure terminal", "hostname SW1 · no ip domain-lookup", "enable secret <parolă>", "line console 0 → password … → login → exit", "line vty 0 15 → password … → login → exit", "service password-encryption · banner motd #…#", "interface vlan 1 → ip address … → no shutdown; ip default-gateway …", "end → show running-config (verific) → copy running-config startup-config"]],
    ["🌐 Router – interfață – țintă 5 min", ["enable → conf t → hostname R1", "interface g0/0 → ip address 192.168.1.1 255.255.255.0", "no shutdown (portul routerului e oprit implicit!)", "end → show ip interface brief: up / up", "ping către PC-ul din rețea (primul „.” e ARP – normal)", "copy running-config startup-config"]],
    ["🏷️ VLAN – țintă 5 min", ["conf t → vlan 10 → name ADMIN → exit", "interface fa0/1 → switchport mode access → switchport access vlan 10", "(mai multe porturi: interface range fa0/1 - 10)", "end → show vlan brief: porturile apar la VLAN-ul corect", "PC-uri din VLAN diferite NU își dau ping fără router – e normal", "copy running-config startup-config"]],
    ["💻 Windows – IP și teste – țintă 5 min", ["Win+R → ncpa.cpl → adaptor → Proprietăți → IPv4", "IP, mască, gateway, DNS exact ca în cerință → OK", "cmd → ipconfig /all (verific IP, mască, gateway, MAC)", "169.254.x.x = APIPA: nu a primit DHCP → verific cablul / setările", "ping gateway, apoi ping IP din altă rețea, apoi ping nume (DNS)", "tracert → văd fiecare router de pe drum", "ipconfig /release + /renew (DHCP), ipconfig /flushdns"]],
    ["💡 Fibră optică – țintă 3–5 min", ["NU privesc niciodată în conector / fibră activă", "Recunosc: SC pătrat push-pull, LC mic cu clemă, ST baionetă rotundă", "Culoare: albastru = UPC, verde = APC (unghi 8°) – nu le amestec", "Curăț: capac jos → one-click cleaner sau șervețel fără scame + alcool izopropilic, apoi uscat", "Inspectez cu microscopul, pun capacul la loc imediat", "Galben = monomod (SM); portocaliu / aqua = multimod (MM)"]],
    ["🖥️ PC – componente – țintă 10 min", ["Opresc, scot cablul de alimentare, apăs Power 5 s", "Brățară antistatică (ESD) legată la carcasă", "RAM: deschid clemele, aliniez crestătura, apăs până se închid singure", "SSD/HDD SATA: cablu date + alimentare; M.2: în slot la 30°, apoi șurubul", "Verific cablurile 24 pini și 4/8 pini CPU", "Pornesc → BIOS/UEFI vede RAM-ul și discul", "Las totul strâns, șuruburile puse, carcasa închisă"]]
  ];
  function vPpSheet() {
    view = "practice"; navbar(true);
    var h = '<section class="card noprint"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.list + ' Proba practică – ce fac pas cu pas</h2><p class="muted small">Fișă de recapitulare: bifează pe ecran sau tipărește (A4, două coloane). Timpii sunt orientativi.</p><button class="big" id="ppPrint">🖨️ Tipărește / salvează PDF</button></section><div class="ppgrid">';
    PPS.forEach(function (b, i) { h += '<section class="card pps"><h3>' + esc(b[0]) + '</h3><ol class="ppl">' + b[1].map(function (s, j) { return '<li><label><input type="checkbox" class="bx" data-k="' + i + "-" + j + '"> <span>' + esc(s) + "</span></label></li>"; }).join("") + "</ol></section>"; });
    h += '</div><section class="card pps"><h3>⚠ Reguli de aur</h3><ul class="ppl"><li>Spune cu voce tare ce faci – examinatorul notează și metoda.</li><li>Verifică ÎNAINTE să anunți „gata”: tester, show run, ping.</li><li>Salvează configurația (copy run start) – fără salvare, după reload totul dispare.</li><li>Siguranța întâi: fără tensiune la Ω/continuitate, nu privi în fibră, ESD la PC.</li></ul></section>';
    app.innerHTML = h;
    var st = {}; try { st = JSON.parse(localStorage.getItem("sts_ppchk") || "{}") || {}; } catch (e) {}
    Array.prototype.forEach.call(app.querySelectorAll(".bx"), function (x) { x.checked = !!st[x.getAttribute("data-k")]; x.onchange = function () { if (x.checked) st[x.getAttribute("data-k")] = 1; else delete st[x.getAttribute("data-k")]; try { localStorage.setItem("sts_ppchk", JSON.stringify(st)); } catch (e) {} }; });
    $("backBtn").onclick = function () { go("practice"); };
    $("ppPrint").onclick = function () { window.print(); };
  }

  /* ---------- credite foto ---------- */
  function vCredits() {
    view = "acct"; navbar(true);
    var PH0 = window.PHOTOS || {}, ks = Object.keys(PH0);
    var h = '<section class="card"><button class="back" id="backBtn">‹ Cont</button><h2>' + ICA.photo + ' Credite foto</h2><p class="muted small">Toate fotografiile sunt de pe Wikimedia Commons, cu licență liberă (Creative Commons sau domeniu public). Au fost redimensionate și convertite în WebP; în rest sunt neschimbate. Desenele și animațiile sunt realizate pentru acest site.</p><ul class="cred">';
    ks.forEach(function (k) { var p = PH0[k]; h += '<li><img src="' + p.f + '" alt="" width="72" height="54" loading="lazy" decoding="async"><div><b>' + esc(p.c) + "</b><br><span class=\"small\">Autor: " + esc(p.a) + " · Licență: " + (p.lu ? '<a href="' + esc(p.lu) + '" target="_blank" rel="noopener">' + esc(p.l) + "</a>" : esc(p.l)) + ' · Sursa: <a href="' + esc(p.s) + '" target="_blank" rel="noopener">' + esc(p.t) + "</a></span></div></li>"; });
    h += "</ul><p class=\"muted small\">" + ks.length + " fotografii.</p></section>";
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("acct"); };
  }

  /* ---------- galeria de animații ---------- */
  function vAnims() {
    view = "practice"; navbar(true);
    var A = window.ANIMS || {};
    app.innerHTML = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.film + ' Animații pas cu pas</h2><p class="muted small">▶ pornește, ⏸ pauză, ⏮ ⏭ pas cu pas. ' + (RM ? "Ai cerut mișcare redusă în sistem: fiecare pas apare ca imagine statică – folosește ⏭." : "Pornesc singure când ajung pe ecran.") + "</p></section>" + Object.keys(A).map(function (k) { return '<section class="card">' + AN(k) + "</section>"; }).join("");
    $("backBtn").onclick = function () { go("practice"); };
    wireAnims(app);
  }

  /* ---------------- Simulare examen real: 18 întrebări, nota 1–10, minim 7 ---------------- */
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function sshuf(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var SIM_N = 18;
  /* Bonus = dincolo de CCNA 1 / tematica oficială (OSPF, RIP, STP, ACL, EtherChannel, port security, AAA, IPsec detalii…). Nu intră în simulări și în testul de nivel. */
  var BONUS = {}; "net-40,net-70,net-74,net-75,net-91,net-92,net-99,net-101,net-123,net-147,net-155,net-156,net-163,net-166,net-167,net-168,net-169,net-170,net-171,net-172,net-173,net-174,net-180,net-181,net-182,net-184,net-197,net-202,net-251,net-206,net-207,net-208,net-209,net-210,net-211".split(",").forEach(function (i) { BONUS[i] = 1; });
  function isBonus(q) { return !!(q && q.id && BONUS[q.id]); }
  function simPools() {
    var ok4 = function (q) { return q.a && q.a.length === 4 && !q.s && !isBonus(q); };
    var exq = QS.filter(function (q) { return q.c === "ex" && ok4(q); });
    function g(name) { return exq.filter(function (q) { return q.e.indexOf("Examen real · " + name + " ·") >= 0; }); }
    function cs(list) { return QS.filter(function (q) { return list.indexOf(q.c) >= 0 && ok4(q); }); }
    return {
      ccna: g("CCNA"), tel: g("Telecom"), fib: g("Fibră"), gen: g("General"),
      ccnaB: cs(["net", "trk", "sub", "cab", "baz", "cap"]), telB: cs(["tel", "rad", "voip", "mas"]), fibB: cs(["fo"]), restB: cs(["pc", "win", "sts", "el"])
    };
  }
  /* Subiectul 1 = varianta raportată de candidat (doar „Examen real”): 7 CCNA · 4 Telecom · 4 Fibră · 3 General.
     Subiectele 2 și 3 = variante plauzibile din restul tematicii/bibliografiei, aceeași pondere: 7 CCNA · 4 telecom · 4 fibră · 3 PC/Windows/STS/electricitate.
     Aleator = amestec: jumătate „Examen real”, jumătate restul tematicii. */
  var SIM_MIX = { 1: [["ccna", 7], ["tel", 4], ["fib", 4], ["gen", 3]], 2: [["ccnaB", 7], ["telB", 4], ["fibB", 4], ["restB", 3]] };
  SIM_MIX[3] = SIM_MIX[2];
  function simPick(v) {
    var P0 = simPools(), out = [];
    if (v >= 1 && v <= 3) {
      SIM_MIX[v].forEach(function (m) { var pool = P0[m[0]], n = m[1], sh = sshuf(pool, rng(9001 + m[0].length * 31 + pool.length)), k = v === 3 ? 1 : 0; out = out.concat(sh.slice(k * n, (k + 1) * n)); });
      return sshuf(out, rng(4242 + v));
    }
    [["ccna", 4], ["ccnaB", 3], ["tel", 2], ["telB", 2], ["fib", 2], ["fibB", 2], ["gen", 2], ["restB", 1]].forEach(function (m) { out = out.concat(shuffle(P0[m[0]]).slice(0, m[1])); });
    return shuffle(out);
  }
  function grade(c, n) { return Math.round((1 + 9 * c / n) * 100) / 100; }
  function fmtG(g) { return g.toFixed(2).replace(".", ","); }
  function vSim() {
    view = "practice"; navbar(true);
    var hist = P.exams.filter(function (e) { return e.k === "sim"; }).slice(-8).reverse();
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>📝 Simulare examen – proba teoretică</h2>' +
      '<p class="muted">Exact formatul raportat: <b>18 întrebări</b>, fiecare cu <b>4 variante (A–D)</b> și <b>un singur răspuns corect</b>. Pondere: ~40% CCNA, ~20% telecom, ~40% fibră și restul tematicii. Fiecare răspuns corect valorează 0,5 puncte, plus 1 punct din oficiu, deci nota e între 1 și 10. <b>Promovezi cu minimum 7</b>, adică 12 răspunsuri corecte din 18.</p>' +
      '<h3>Timp</h3><div class="seg" id="stSeg">' + [[30, "30 min"], [20, "20 min"], [0, "Fără limită"]].map(function (x) { return '<button data-t="' + x[0] + '" class="' + ((SET.st == null ? 30 : SET.st) === x[0] ? "on" : "") + '">' + x[1] + "</button>"; }).join("") + "</div>" +
      '<div class="row2"><button class="big" data-v="1">Subiectul 1</button><button class="big" data-v="2">Subiectul 2</button></div><div class="row2"><button class="big" data-v="3">Subiectul 3</button><button class="big" data-v="0">Aleator</button></div>' +
      '<p class="muted small">La examen tragi la sorți unul din 3 plicuri. <b>Subiectul 1</b> e cel mai apropiat de varianta raportată de candidat (doar întrebări „Examen real”). <b>Subiectele 2 și 3</b> sunt variante plauzibile din restul tematicii și bibliografiei, cu aceeași pondere. Toate trei sunt fixe și nu au întrebări comune. „Aleator” amestecă de fiecare dată.</p></section>';
    h += '<section class="card"><h2>Rezultatele tale</h2>' + (hist.length ? hist.map(function (e) { return '<div class="crow"><span>' + fmtDate(e.t) + " · " + esc(e.s || "") + "</span><b class=\"" + (e.g >= 7 ? "okc" : "badc") + "\">" + fmtG(e.g) + "</b><span>" + e.c + "/" + e.n + (e.g >= 7 ? " · admis" : " · respins") + "</span></div>"; }).join("") : '<p class="muted">Nicio simulare încă.</p>') + "</section>";
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("practice"); };
    Array.prototype.forEach.call(app.querySelectorAll("#stSeg button"), function (b) { b.onclick = function () { SET.st = +b.getAttribute("data-t"); saveSet(); vSim(); }; });
    Array.prototype.forEach.call(app.querySelectorAll("[data-v]"), function (b) { b.onclick = function () { var v = +b.getAttribute("data-v"); var mins = SET.st == null ? 30 : SET.st; runQuiz({ mode: "exam", items: simPick(v), minutes: mins, title: "Simulare examen", sim: v ? "Subiectul " + v : "Subiect aleator" }); }; });
  }
  function simResult(o, corr, secs, timeout) {
    var n = o.items.length, g = grade(corr, n), pass = g >= 7;
    var h = '<div class="result card pop sheetres"><div class="rhead"><b>FOAIE DE REZULTAT – PROBA TEORETICĂ</b><small>Simulare · ' + esc(o.sim) + " · " + fmtDate(Date.now()) + " · timp " + fmtTime(secs) + (timeout ? " · timpul a expirat" : "") + "</small></div>" +
      '<table class="rtab"><thead><tr><th>Nr.</th><th>Răspuns</th><th>Corect</th><th>Punctaj</th></tr></thead><tbody>' +
      o.items.map(function (it, j) { var ch = it.pick == null ? "—" : LET[it.ord.indexOf(it.pick)], co = LET[it.ord.indexOf(0)], ok = it.pick === 0; return '<tr class="' + (ok ? "ok" : "bad") + '"><td>' + (j + 1) + "</td><td>" + ch + "</td><td>" + co + "</td><td>" + (ok ? "0,5" : "0") + "</td></tr>"; }).join("") +
      '</tbody><tfoot><tr><td colspan="3">Răspunsuri corecte: ' + corr + " / " + n + " · din oficiu: 1</td><td>" + fmtG(g) + "</td></tr></tfoot></table>" +
      '<div class="gradebox ' + (pass ? "ok" : "bad") + '"><span>Nota</span><b>' + fmtG(g) + '</b><em>' + (pass ? "ADMIS (minim 7)" : "RESPINS – sub 7 (îți mai trebuiau " + Math.max(0, 12 - corr) + " răspunsuri corecte)") + "</em></div>" +
      '<button class="big" id="doneBtn">Gata</button><button class="ghost" id="againSim">Altă simulare</button></div><h2 class="sec">Răspunsuri greșite / nerăspunse</h2>';
    var wrong = o.items.filter(function (it) { return it.pick !== 0; });
    if (!wrong.length) h += '<div class="card">Perfect – niciun răspuns greșit! 🎉</div>';
    wrong.forEach(function (it) { var j = o.items.indexOf(it); h += '<div class="card rev"><div class="qmeta">' + (j + 1) + ". " + CATBY[it.q.c].ic + " " + esc(CATBY[it.q.c].short) + markBtn(it.q.id) + '</div><div class="qq">' + esc(it.q.q) + "</div>" + qSvg(it.q) + (it.pick != null ? '<div class="a bad">❌ ' + LET[it.ord.indexOf(it.pick)] + ") " + esc(it.q.a[it.pick]) + "</div>" : '<div class="a bad">— fără răspuns</div>') + '<div class="a ok">✅ ' + LET[it.ord.indexOf(0)] + ") " + esc(it.q.a[0]) + '</div><div class="e">💡 ' + esc(it.q.e) + "</div></div>"; });
    app.innerHTML = h; wireMarks();
    $("doneBtn").onclick = function () { go("sim"); };
    $("againSim").onclick = function () { go("sim"); };
    if (STQ && STQ.ph === "sim") { STQ.g = g; STQ.ph = "psy"; var sb = document.createElement("div"); sb.className = "cohook"; sb.innerHTML = '<p class="small muted">🎮 Examenul din joc · urmează testele psihologice (12 itemi, 6 min)</p><button class="big gogreen" id="stqGo">▶️ Continuă: teste psihologice</button>'; app.insertBefore(sb, app.firstChild); $("stqGo").onclick = function () { apStart({ mode: "exam", n: 12, time: 360, title: "Examen – teste psihologice" }); }; toTop(); return g; }
    simReplay(o, wrong);
    toTop(); coHook("sim");
    return g;
  }
  /* „Reia greșelile” după fiecare simulare: doar întrebările greșite, pe timp (Greu: 40 s/întrebare, strict) */
  var SRT = 0;
  function simReplay(o, wrong) {
    clearInterval(SRT); if (!wrong.length) return; var gr = jgDiff() === "greu", secs = wrong.length * (gr ? 40 : 75), auto = !(CO && CO.on);
    var w = document.createElement("div"); w.className = "card srep"; w.innerHTML = '<b>🔁 Reia greșelile pe timp</b><p class="small">' + wrong.length + " întrebări · " + fmtTime(secs) + (gr ? " · Greu: timp strict" : "") + '</p><div class="seg" id="srD"><button data-d="normal" class="' + (gr ? "" : "on") + '">Normal</button><button data-d="greu" class="' + (gr ? "on" : "") + '">Greu</button></div><button class="big gogreen" id="srGo">🔁 Reia greșelile' + (auto ? " (pornește în 15 s)" : "") + '</button>' + (auto ? '<button class="ghost" id="srNo">Nu acum – citesc explicațiile</button>' : "");
    var rb = app.querySelector(".sheetres"); if (rb && rb.nextSibling) app.insertBefore(w, rb.nextSibling); else app.appendChild(w);
    var start = function () { clearInterval(SRT); var g2 = jgDiff() === "greu"; runQuiz({ mode: "exam", items: wrong.map(function (it) { return it.q; }), minutes: wrong.length * (g2 ? 40 : 75) / 60, title: "Reia greșelile", sim: "Reluare greșeli · " + (g2 ? "Greu" : "Normal") }); };
    $("srGo").onclick = start;
    Array.prototype.forEach.call(w.querySelectorAll("#srD button"), function (b) { b.onclick = function () { try { localStorage.setItem("jg_diff", b.getAttribute("data-d")); } catch (e) {} Array.prototype.forEach.call(w.querySelectorAll("#srD button"), function (x) { x.className = x === b ? "on" : ""; }); }; });
    if (auto) { var t = 15; SRT = setInterval(function () { var e = $("srGo"); if (!e || !document.body.contains(e)) { clearInterval(SRT); return; } t--; if (t <= 0) start(); else e.textContent = "🔁 Reia greșelile (pornește în " + t + " s)"; }, 1000);
      $("srNo").onclick = function () { clearInterval(SRT); $("srGo").textContent = "🔁 Reia greșelile"; $("srNo").remove(); };
      ["doneBtn", "againSim"].forEach(function (id) { var d = $(id); if (d) d.addEventListener("click", function () { clearInterval(SRT); }); }); }
  }
  function qSvg(q) { return q.s ? '<div class="qsvg">' + q.s + "</div>" : ""; }
  /* ---------- Simulare probă practică ---------- */
  function ipIn(ip, net, mask) { if (!ipOk(ip) || !ipOk(net) || !ipOk(mask)) return false; var a = ip.split(".").map(Number), b = net.split(".").map(Number), m = mask.split(".").map(Number); for (var k = 0; k < 4; k++) if ((a[k] & m[k]) !== (b[k] & m[k])) return false; return true; }
  function winNew(o) {
    o = o || {};
    return { host: "LAPTOP-STS01", ip: o.ip || "192.168.0.57", mask: o.mask || "255.255.255.0", gw: o.gw === undefined ? "192.168.0.1" : o.gw, dns: o.dns === undefined ? "8.8.8.8" : o.dns, dhcp: o.dhcp !== false, mac: o.mac || "3C-52-82-1A-7F-04", flushed: false, did: {}, hist: [], inet: o.inet !== false, live: o.live || ["192.168.0.1"], reach: o.reach || null, ssh: o.ssh || null,
      cache: ["www.google.com", "login.live.com", "www.cisco.com", "settings-win.data.microsoft.com"] };
  }
  var DNSDB = { "www.google.com": "142.250.180.196", "google.com": "142.250.180.206", "www.cisco.com": "23.205.210.111", "cisco.com": "72.163.4.185", "login.live.com": "20.190.159.68", "www.example.com": "93.184.215.14", "example.com": "93.184.215.14", "settings-win.data.microsoft.com": "51.104.15.252" };
  function winReach(L, ip) {
    if (L.reach) return L.reach(ip);
    if (!ipOk(ip) || !L.ip) return false;
    if (ip === L.ip || ip === "127.0.0.1") return true;
    if (ipIn(ip, L.ip, L.mask)) return L.live.indexOf(ip) >= 0;
    return L.inet && !!L.gw && ipIn(L.gw, L.ip, L.mask) && L.live.indexOf(L.gw) >= 0 && (L.live.indexOf(ip) >= 0 || /^(142|23|72|20|93|51|8)\./.test(ip));
  }
  function winRun(L, line) {
    if (/^\s*ping\b/i.test(line)) { TOPO.act = Date.now(); setTimeout(topoRef, 0); setTimeout(topoRef, 1700); }
    var raw = line.trim(), low = raw.toLowerCase().replace(/\s+/g, " "), out = [], o = function (x) { out.push(x); };
    if (!raw) return out;
    low = low.replace(/^ipconfig\//, "ipconfig /");
    var tk = low.split(" "), c = tk[0].replace(/\.exe$/, "");
    function dns() { return L.dns && L.inet && winReach(L, L.dns); }
    if (c === "ipconfig") {
      var sw = tk[1] || "";
      if (sw === "/all" || sw === "-all" || sw === "") {
        if (sw) L.did.ipall = 1; else L.did.ip = 1;
        o("Windows IP Configuration"); o("");
        if (sw) { o("   Host Name . . . . . . . . . . . . : " + L.host); o("   Primary Dns Suffix  . . . . . . . : "); o("   Node Type . . . . . . . . . . . . : Hybrid"); o("   IP Routing Enabled. . . . . . . . : No"); o(""); }
        o("Ethernet adapter Ethernet:"); o("");
        o("   Connection-specific DNS Suffix  . : ");
        if (sw) { o("   Description . . . . . . . . . . . : Intel(R) Ethernet Connection (7) I219-V"); o("   Physical Address. . . . . . . . . : " + L.mac); o("   DHCP Enabled. . . . . . . . . . . : " + (L.dhcp ? "Yes" : "No")); o("   Autoconfiguration Enabled . . . . : Yes"); }
        o("   Link-local IPv6 Address . . . . . : fe80::1c4a:9e2f:3b71:52d8%12" + (sw ? "(Preferred)" : ""));
        o("   IPv4 Address. . . . . . . . . . . : " + L.ip + (sw ? "(Preferred)" : ""));
        o("   Subnet Mask . . . . . . . . . . . : " + L.mask);
        o("   Default Gateway . . . . . . . . . : " + (L.gw || ""));
        if (sw) { if (L.dhcp) o("   DHCP Server . . . . . . . . . . . : " + (L.gw || "192.168.0.1")); o("   DNS Servers . . . . . . . . . . . : " + (L.dns || "")); o("   NetBIOS over Tcpip. . . . . . . . : Enabled"); }
        return out;
      }
      if (sw === "/displaydns") { L.did.disp = 1; o("Windows IP Configuration"); o(""); if (L.flushed || !L.cache.length) { o("Could not display the DNS Resolver Cache."); return out; } L.cache.forEach(function (n) { o("    " + n); o("    ----------------------------------------"); o("    Record Name . . . . . : " + n); o("    Record Type . . . . . : 1"); o("    Time To Live  . . . . : " + (60 + n.length * 7)); o("    Data Length . . . . . : 4"); o("    Section . . . . . . . : Answer"); o("    A (Host) Record . . . : " + (DNSDB[n] || "10.0.0.1")); o(""); }); return out; }
      if (sw === "/flushdns") { L.did.flush = 1; L.flushed = true; L.cache = []; o("Windows IP Configuration"); o(""); o("Successfully flushed the DNS Resolver Cache."); return out; }
      if (sw === "/renew" && L.dhcpGet && L.dhcp) { var dg = L.dhcpGet(); o("Windows IP Configuration"); o(""); if (!dg) { o("An error occurred while renewing interface Ethernet : unable to contact your DHCP"); o("server. Request has timed out."); return out; } L.ip = dg.ip; L.mask = dg.mask; L.gw = dg.gw; L.dns = dg.dns || ""; o("Ethernet adapter Ethernet:"); o(""); o("   Connection-specific DNS Suffix  . : "); o("   IPv4 Address. . . . . . . . . . . : " + L.ip); o("   Subnet Mask . . . . . . . . . . . : " + L.mask); o("   Default Gateway . . . . . . . . . : " + L.gw); return out; }
      if (sw === "/release" || sw === "/renew") { o("Windows IP Configuration"); o(""); if (!L.dhcp) { o("The operation failed as no adapter is in the state permissible for"); o("this operation."); o("(Adresa e statică – /release și /renew merg doar cu DHCP.)"); } else o(sw === "/renew" ? "(Adresa a fost reînnoită de la serverul DHCP.)" : "(Adresa a fost eliberată.)"); return out; }
      if (sw === "/?" ) { o("USAGE: ipconfig [/allcompartments] [/? | /all | /renew [adapter] | /release [adapter] |"); o("       /flushdns | /displaydns | /registerdns | /showclassid | /setclassid ]"); return out; }
      o("Error: unrecognized or incomplete command line."); o(""); o("USAGE: ipconfig [/? | /all | /renew | /release | /flushdns | /displaydns]"); return out;
    }
    if (c === "netstat") {
      var f = tk.slice(1).join(""); L.did.netstat = 1;
      if (/b/.test(f)) { o("The requested operation requires elevation."); o("(netstat -b cere cmd pornit ca Administrator.)"); return out; }
      if (/r/.test(f)) { o("IPv4 Route Table"); o("==========================================================================="); o("Network Destination        Netmask          Gateway       Interface  Metric"); if (L.gw) o("          0.0.0.0          0.0.0.0      " + pad(L.gw, 14) + pad(L.ip, 14) + "  25"); o("        127.0.0.0        255.0.0.0         On-link         127.0.0.1    331"); return out; }
      var n = /n/.test(f), a = /a/.test(f), oo = /o/.test(f);
      o(""); o("Active Connections"); o(""); o("  Proto  Local Address          Foreign Address        State" + (oo ? "           PID" : ""));
      var rows = [];
      if (a) rows.push(["TCP", "0.0.0.0:135", "0.0.0.0:0", "LISTENING", 1104], ["TCP", "0.0.0.0:445", "0.0.0.0:0", "LISTENING", 4], ["UDP", "0.0.0.0:5353", "*:*", "", 2284]);
      if (L.inet) rows.push(["TCP", L.ip + ":50112", n ? "142.250.180.196:443" : "fra16s49-in-f4:https", "ESTABLISHED", 9120], ["TCP", L.ip + ":50140", n ? "20.190.159.68:443" : "login.live.com:https", "TIME_WAIT", 0]);
      rows.push(["TCP", "127.0.0.1:49670", n ? "127.0.0.1:49671" : L.host + ":49671", "ESTABLISHED", 3388]);
      rows.forEach(function (r) { o("  " + pad(r[0], 7) + pad(r[1], 23) + pad(r[2], 23) + pad(r[3], 16) + (oo ? r[4] : "")); });
      if (!n) o("(Sfat: netstat -an afișează numeric și toate porturile ascultate – e mai rapid.)");
      return out;
    }
    if (c === "nslookup") {
      var nm = tk[1];
      if (!nm) { L.did.ns = L.did.ns || 0; o("Default Server:  " + (L.dns === "8.8.8.8" ? "dns.google" : "UnKnown")); o("Address:  " + (L.dns || "")); o(""); o("> (în simulator scrie direct: nslookup www.google.com)"); return out; }
      if (!L.dns || !dns()) { o("DNS request timed out."); o("    timeout was 2 seconds."); o("Default Server:  UnKnown"); o("Address:  " + (L.dns || "")); o(""); o("*** Request to UnKnown timed-out"); o("(Verifică serverul DNS și gateway-ul din setările IPv4.)"); return out; }
      L.did.ns = 1;
      o("Server:  " + (L.dns === "8.8.8.8" ? "dns.google" : "UnKnown")); o("Address:  " + L.dns); o("");
      if (DNSDB[nm]) { o("Non-authoritative answer:"); o("Name:    " + nm); o("Address:  " + DNSDB[nm]); if (!L.flushed || L.cache.indexOf(nm) < 0) L.cache.push(nm); L.flushed = false; }
      else o("*** dns.google can't find " + nm + ": Non-existent domain");
      return out;
    }
    if (c === "ping" || c === "tracert") {
      var tg = tk.filter(function (x, i) { return i > 0 && !/^[-\/]/.test(x) && !/^\d+$/.test(x) || (i > 0 && ipOk(x)); })[0];
      if (!tg) { o("Usage: " + c + " [-t] [-n count] target_name"); return out; }
      var ip = tg;
      if (!ipOk(tg)) { if (!DNSDB[tg] || !dns()) { o("Ping request could not find host " + tg + ". Please check the name and try again."); return out; } ip = DNSDB[tg]; }
      var ok = winReach(L, ip), nn = tk.indexOf("-n") > 0 ? Math.min(+tk[tk.indexOf("-n") + 1] || 4, 6) : 4;
      L.did[c] = L.did[c] || {}; if (ok) L.did[c][ip] = 1;
      if (c === "tracert") { o(""); o("Tracing route to " + tg + (tg !== ip ? " [" + ip + "]" : "")); o("over a maximum of 30 hops:"); o(""); if (!ok) { o("  1     *        *        *     Request timed out."); o("  2     *        *        *     Request timed out."); o("(întrerupt – nicio rută)"); return out; } var hops = ipIn(ip, L.ip, L.mask) ? [ip] : [L.gw, ip]; hops.forEach(function (h, i) { o("  " + (i + 1) + "    <1 ms    <1 ms    <1 ms  " + h); }); o(""); o("Trace complete."); return out; }
      o(""); o("Pinging " + tg + (tg !== ip ? " [" + ip + "]" : "") + " with 32 bytes of data:");
      var noGw = !ipIn(ip, L.ip, L.mask) && (!L.gw || !ipIn(L.gw, L.ip, L.mask));
      for (var i = 0; i < nn; i++) o(ok ? "Reply from " + ip + ": bytes=32 time" + (ipIn(ip, L.ip, L.mask) ? "<1ms" : "=" + (12 + i) + "ms") + " TTL=" + (ipIn(ip, L.ip, L.mask) ? 255 : 117) : noGw ? "PING: transmit failed. General failure." : "Request timed out.");
      o(""); o("Ping statistics for " + ip + ":"); o("    Packets: Sent = " + nn + ", Received = " + (ok ? nn : 0) + ", Lost = " + (ok ? 0 : nn) + " (" + (ok ? 0 : 100) + "% loss),");
      if (tk.indexOf("-t") > 0) o("(-t pingează la infinit; pe un PC real oprești cu Ctrl+C)");
      return out;
    }
    if (c === "ssh") {
      var li = tk.indexOf("-l"), user = li > 0 ? raw.split(/\s+/)[li + 1] : null, host = raw.split(/\s+/).slice(1).filter(function (x, i, arr) { return x !== "-l" && arr[i - 1] !== "-l"; })[0] || "";
      if (host.indexOf("@") > 0) { user = host.split("@")[0]; host = host.split("@")[1]; }
      if (!host) { o("usage: ssh [-l login_name] destination"); return out; }
      if (L.ssh) return L.ssh(user, host);
      o("ssh: connect to host " + host + " port 22: Connection timed out"); return out;
    }
    if (c === "netsh") {
      var nm2 = /set address\s+(?:name\s*=\s*)?("[^"]+"|\S+)\s+(?:source\s*=\s*)?static\s+(?:addr(?:ess)?\s*=\s*)?(\S+)\s+(?:mask\s*=\s*)?(\S+)(?:\s+(?:gateway\s*=\s*)?(\S+))?/i.exec(raw);
      if (/set address/i.test(raw) && /dhcp/i.test(raw)) { L.dhcp = true; o("Ok."); return out; }
      if (!nm2) { o("Folosire: netsh interface ip set address \"Ethernet\" static 192.168.10.10 255.255.255.0 192.168.10.1"); o("(Sau din interfață: ncpa.cpl → Ethernet → Properties → IPv4.)"); return out; }
      if (!ipOk(nm2[2]) || !maskOk(nm2[3]) || (nm2[4] && !ipOk(nm2[4]))) { o("The parameter is incorrect."); return out; }
      L.ip = nm2[2]; L.mask = nm2[3]; L.gw = nm2[4] || ""; L.dhcp = false; L.did.netsh = 1; o("Ok."); return out;
    }
    if (c === "arp") { o(""); o("Interface: " + L.ip + " --- 0xc"); o("  Internet Address      Physical Address      Type"); L.live.forEach(function (x, i) { if (ipIn(x, L.ip, L.mask)) o("  " + pad(x, 22) + pad("00-1e-7a-5c-0" + i + "-b1", 22) + "dynamic"); }); return out; }
    if (c === "getmac") { o(""); o("Physical Address    Transport Name"); o("=================== =========================================================="); o(L.mac + "   \\Device\\Tcpip_{9A1C2F3E-5B6D-4E7F-8A9B-0C1D2E3F4A5B}"); return out; }
    if (c === "hostname") { o(L.host); return out; }
    if (c === "whoami") { o(L.host.toLowerCase() + "\\student"); return out; }
    if (c === "cls") return ["\f"];
    if (c === "ncpa.cpl" || c === "control") { o("(Se deschide „Network Connections”. În simulare: pasul cu setarea IP-ului static.)"); return out; }
    if (c === "devmgmt.msc") { o("(Se deschide Device Manager. În simulare: pasul cu portul COM.)"); return out; }
    if (c === "help" || c === "/?") { o("Comenzi simulate: ipconfig [/all | /displaydns | /flushdns | /release | /renew], netstat [-a -n -o -r], nslookup <nume>, ping <IP/nume> [-n N] [-t], tracert <IP>, arp -a, getmac, hostname, ssh -l <user> <IP>, cls"); return out; }
    if (/^(enable|conf|configure|show|interface|hostname)$/.test(c)) { o("'" + raw.split(/\s+/)[0] + "' is not recognized as an internal or external command,"); o("operable program or batch file."); o("(Asta e comandă Cisco IOS – se dă în PuTTY, pe switch/router, nu în cmd.)"); return out; }
    o("'" + raw.split(/\s+/)[0] + "' is not recognized as an internal or external command,"); o("operable program or batch file.");
    return out;
  }
  /* terminal widgets (embedded) */
  function termBox(el, opt) {
    /* opt: { prompt(), run(line)->lines, complete(val), tip(line,out), lines, cls } */
    var lines = opt.lines, hi = -1, hist = opt.hist || [];
    el.innerHTML = '<div class="term ' + (opt.cls || "") + '" role="log" aria-live="polite"></div><div class="tkeys">' + (opt.complete ? '<button class="ghost sm" type="button" data-k="tab">⇥ Tab</button><button class="ghost sm" type="button" data-k="q">?</button>' : "") + '<button class="ghost sm" type="button" data-k="up">↑</button>' + (opt.hint ? '<button class="ghost sm" type="button" data-k="hint">💡 Indiciu</button>' : "") + '</div><form class="tin" autocomplete="off"><label></label><input autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" aria-label="Comandă"></form>';
    var term = el.querySelector(".term"), inp = el.querySelector("input"), lab = el.querySelector("label");
    function paint() { term.innerHTML = lines.map(function (l) { return '<div class="tline ' + l[1] + '">' + (esc(l[0]) || "&nbsp;") + "</div>"; }).join(""); lab.textContent = opt.prompt(); term.scrollTop = term.scrollHeight; }
    function add(t, c) { lines.push([t, c || ""]); if (lines.length > 300) lines.splice(0, lines.length - 300); }
    function exec(v) {
      v = cliNorm(v);
      var echo = opt.echo ? opt.echo(v) : opt.prompt() + v; add(echo);
      if (v.trim()) { hist.push(v.trim()); hi = -1; }
      var out = []; try { out = opt.run(v); } catch (e) { out = ["(eroare internă a simulatorului)"]; }
      if (out[0] === "\f") { lines.length = 0; out = []; }
      out.forEach(function (l) { add(l, opt.cls2 ? opt.cls2(l) : ""); });
      var tip = opt.tip && opt.tip(v, out); if (tip) add("💡 " + tip, "thint");
      paint(); if (opt.onChange) opt.onChange();
    }
    el.querySelector("form").onsubmit = function (e) { e.preventDefault(); var v = inp.value; inp.value = ""; exec(v); inp.focus(); };
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && opt.complete) { e.preventDefault(); inp.value = opt.complete(inp.value); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (hist.length) { hi = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); inp.value = hist[hi]; } }
      else if (e.key === "?" && opt.complete) { e.preventDefault(); exec(inp.value + "?"); }
    });
    Array.prototype.forEach.call(el.querySelectorAll("[data-k]"), function (b) { b.onclick = function () { var k = b.getAttribute("data-k"); if (k === "tab") inp.value = opt.complete(inp.value); else if (k === "q") exec(inp.value + "?"); else if (k === "up") { if (hist.length) { hi = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); inp.value = hist[hi]; } } else if (k === "hint") { add("💡 " + opt.hint(), "thint"); paint(); } inp.focus(); }; });
    paint();
    var api = { paint: paint, add: add, exec: exec }; TOPO.tb = api; return api;
  }
  function cliBox(el, s, T, onChange) {
    var lines = [[s.dev === "router" ? "Cisco ISR – consolă 9600 8N1 (simulat)" : "Cisco Catalyst 2960 – consolă 9600 8N1 (simulat)", "thint"], ["Press RETURN to get started!", ""], ["", ""]];
    return termBox(el, { lines: lines, hist: s.hist,
      prompt: function () { return s.pend ? "" : cliPrompt(s); },
      echo: function (v) { return (s.pend ? "" : cliPrompt(s)) + (s.pend && /parola|Password/i.test(lines.length ? lines[lines.length - 1][0] : "") ? "" : v); },
      run: function (v) { return cliRun(s, v); },
      complete: function (v) { return cliComplete(s, v); },
      cls2: function (l) { return /^%(?!SYS|LINK|LINEPROTO|SSH| Generating| You already)|^\s*\^$/.test(l) ? "terr" : /^\(|^%LINK|^%LINEPROTO|^%SYS|^%SSH/.test(l) ? "thint" : ""; },
      tip: function (v, out) { return out.some(function (l) { return /Invalid input|Incomplete|Ambiguous|Unknown command/.test(l); }) ? cliTip(s, v) : ""; },
      hint: function () { var g = T.g.filter(function (x) { try { return !x[1](s); } catch (e) { return true; } })[0]; return g ? g[2] + "   (ești în: " + cliPrompt(s) + ")" : "Toate obiectivele sunt bifate."; },
      onChange: onChange });
  }
  function winBox(el, L, hintFn, onChange) {
    return termBox(el, { cls: "wcmd", lines: [["Microsoft Windows [Version 10.0.19045.4529]", ""], ["(c) Microsoft Corporation. All rights reserved.", ""], ["", ""]], hist: L.hist,
      prompt: function () { return "C:\\Users\\student>"; }, run: function (v) { return winRun(L, v); },
      cls2: function (l) { return /^\(/.test(l) ? "thint" : /not recognized|could not find|timed out|failed|General failure|Error/.test(l) ? "terr" : ""; },
      hint: hintFn, onChange: onChange });
  }
  /* SVG-uri pentru pași */
  function rtrRearSvg(sel) {
    var P = [["ge00", "GE 0/0", 40, "#e5e7eb"], ["ge01", "GE 0/1", 92, "#e5e7eb"], ["con", "CON", 162, "#7dd3fc"], ["aux", "AUX", 214, "#1f2937"], ["usb", "USB", 270, "#e5e7eb"], ["ser", "SERIAL 0/0/0", 340, "#e5e7eb"]];
    var h = '<svg viewBox="0 0 440 170" class="prsvg" role="img" aria-label="Spatele unui router Cisco ISR (schemă)" font-family="system-ui,Arial"><rect x="4" y="18" width="432" height="120" rx="8" fill="#374151" stroke="#111"/><text x="14" y="34" font-size="10" fill="#cbd5e1">Cisco ISR – panoul din spate (schemă simplificată)</text><rect x="318" y="44" width="110" height="80" rx="4" fill="#4b5563" stroke="#9ca3af" stroke-dasharray="3 2"/><text x="373" y="120" font-size="8" fill="#cbd5e1" text-anchor="middle">slot EHWIC</text><circle cx="420" cy="30" r="5" fill="#22c55e"/><text x="404" y="33" font-size="8" fill="#cbd5e1" text-anchor="end">PWR</text>';
    P.forEach(function (p) {
      var on = sel && sel.indexOf(p[0]) >= 0, x = p[2], w = p[0] === "usb" ? 30 : p[0] === "ser" ? 70 : 40, hgt = p[0] === "usb" ? 14 : 32, y = p[0] === "usb" ? 70 : 62;
      h += '<g class="prport" data-p="' + p[0] + '" role="button" tabindex="0" aria-label="Port ' + p[1] + '"><rect x="' + (x - 6) + '" y="46" width="' + (w + 12) + '" height="76" rx="5" fill="' + (on ? "#facc15" : "transparent") + '" opacity=".55"/><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hgt + '" rx="3" fill="' + p[3] + '" stroke="#111"/>' + (p[0] === "ser" ? '<rect x="' + (x + 8) + '" y="' + (y + 8) + '" width="54" height="16" rx="3" fill="#111"/>' : p[0] === "usb" ? "" : '<rect x="' + (x + 10) + '" y="' + (y + 8) + '" width="20" height="16" fill="#111"/>') + '<text x="' + (x + w / 2) + '" y="112" font-size="10" font-weight="700" fill="#f9fafb" text-anchor="middle">' + p[1] + "</text></g>";
    });
    return h + '<text x="220" y="160" font-size="10" fill="currentColor" text-anchor="middle">Atinge portul. CON = albastru deschis (consolă), AUX = negru (modem), GE = porturi de date Gigabit.</text></svg>';
  }
  function otdrSvg() {
    var h = '<svg viewBox="0 0 440 230" class="prsvg" role="img" aria-label="Urmă OTDR cu evenimentele A, B, C și D" font-family="system-ui,Arial"><rect x="0" y="0" width="440" height="230" rx="8" fill="#0b1220"/>';
    for (var i = 0; i <= 10; i++) h += '<line x1="' + (40 + i * 38) + '" y1="20" x2="' + (40 + i * 38) + '" y2="190" stroke="#1e293b"/><text x="' + (40 + i * 38) + '" y="204" font-size="9" fill="#94a3b8" text-anchor="middle">' + i + "</text>";
    for (var j = 0; j <= 4; j++) h += '<line x1="40" y1="' + (20 + j * 42) + '" x2="420" y2="' + (20 + j * 42) + '" stroke="#1e293b"/>';
    h += '<text x="230" y="222" font-size="10" fill="#94a3b8" text-anchor="middle">distanță (km)</text><text x="14" y="110" font-size="10" fill="#94a3b8" transform="rotate(-90 14 110)" text-anchor="middle">dB</text>';
    h += '<path d="M40 190 L44 30 L50 52 L56 60 L161 77 L163 88 L287 108 L289 92 L292 112 L296 116 L382 130 L384 40 L390 168 L398 182 L406 176 L414 186 L420 180" fill="none" stroke="#facc15" stroke-width="2"/>';
    [["A", 46, 26], ["B", 162, 72], ["C", 289, 86], ["D", 384, 34]].forEach(function (e) { h += '<circle cx="' + e[1] + '" cy="' + e[2] + '" r="9" fill="#2563eb"/><text x="' + e[1] + '" y="' + (e[2] + 4) + '" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">' + e[0] + "</text>"; });
    return h + "</svg>";
  }
  function testerSvg(remote, title) {
    var h = '<svg viewBox="0 0 440 150" class="prsvg" role="img" aria-label="' + esc(title) + '" font-family="system-ui,Arial"><rect x="6" y="10" width="200" height="130" rx="10" fill="#1f2937"/><rect x="234" y="10" width="200" height="130" rx="10" fill="#1f2937"/><text x="106" y="30" font-size="11" fill="#e5e7eb" text-anchor="middle">MAIN (unitatea principală)</text><text x="334" y="30" font-size="11" fill="#e5e7eb" text-anchor="middle">REMOTE (capătul celălalt)</text>';
    for (var i = 0; i < 8; i++) { var x = 28 + i * 22, r = remote[i]; h += '<circle cx="' + x + '" cy="70" r="8" fill="#22c55e"/><text x="' + x + '" y="98" font-size="11" fill="#e5e7eb" text-anchor="middle">' + (i + 1) + '</text><circle cx="' + (x + 228) + '" cy="70" r="8" fill="' + (r ? "#22c55e" : "#374151") + '" stroke="#6b7280"/><text x="' + (x + 228) + '" y="98" font-size="11" fill="#e5e7eb" text-anchor="middle">' + (r || "–") + "</text>"; }
    return h + '<text x="220" y="128" font-size="10" fill="#e5e7eb" text-anchor="middle">Rândul de jos = ce LED se aprinde la REMOTE când MAIN aprinde 1, 2, … 8</text></svg>';
  }
  function photoNoCap(k) { var p = PHOTOS[k]; if (!p) return ""; return '<figure class="ph"><img src="' + p.f + '" width="' + p.w + '" height="' + p.h + '" loading="lazy" decoding="async" alt="Echipament de identificat"><figcaption><small>Foto: ' + p.a + " · " + p.l + " · Wikimedia Commons</small></figcaption></figure>"; }
  /* întrebări cu 4 variante în pași */
  function mcqHtml(qs, pre) { return qs.map(function (q, i) { var ord = q._o || (q._o = shuffle([0, 1, 2, 3])); return '<div class="prq" data-q="' + i + '">' + (q.ph ? (q.nocap ? photoNoCap(q.ph) : PH(q.ph)) : "") + (q.svg || "") + '<p class="prqt"><b>' + (pre || "") + (i + 1) + ".</b> " + q.q + '</p><div class="opts">' + ord.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(q.o[k]) + "</button>"; }).join("") + '</div><div class="prfb"></div></div>'; }).join(""); }
  function mcqWire(root, qs, res, onAll) {
    Array.prototype.forEach.call(root.querySelectorAll(".prq"), function (box) {
      var i = +box.getAttribute("data-q"), q = qs[i];
      Array.prototype.forEach.call(box.querySelectorAll(".opt"), function (b) { b.onclick = function () {
        if (res[i] !== undefined) return; var k = +b.getAttribute("data-k"); res[i] = k === 0;
        Array.prototype.forEach.call(box.querySelectorAll(".opt"), function (x) { x.disabled = true; var kk = +x.getAttribute("data-k"); if (kk === 0) x.classList.add("good"); else if (x === b) x.classList.add("bad"); });
        box.querySelector(".prfb").innerHTML = '<div class="' + (k === 0 ? "fact tok" : "eli trapw") + ' small">' + (k === 0 ? "✅ " : "❌ Corect: <b>" + esc(q.o[0]) + "</b>. ") + (q.e || "") + "</div>";
        if (k === 0) SND.ok(); else SND.bad();
        if (onAll && res.filter(function (x) { return x !== undefined; }).length === qs.length) onAll();
      }; });
    });
  }
  var PR_ID_OPTS = ["Router", "Switch", "Switch compact (de birou)", "Patch panel"];
  var PR_DIFF = { q: "Examinatorul întreabă: care e diferența dintre switch și router?", o: ["Switch-ul leagă stații din aceeași rețea după adresa MAC (nivel 2); routerul leagă rețele diferite după adresa IP (nivel 3)","Switch-ul lucrează cu adrese IP la nivelul 3, iar routerul lucrează cu adrese MAC la nivelul 2","Routerul are de obicei mai multe porturi Ethernet decât switch-ul, dar altfel sunt identice","Nu există nicio diferență între ele, sunt două denumiri pentru același aparat de rețea"], e: "Truc vizual: switch-ul are un șir lung de porturi identice numerotate (8/24/48); routerul are puține porturi diferite (GE 0/0, GE 0/1, CON, AUX, USB, sloturi de module)." };
  function prVariants() {
    var X = 20 + Math.floor(Math.random() * 40);
    return [
      { id: 1, t: "Varianta 1 – ca la examen", d: "Exact pașii relatați de candidat: identificare echipamente, mufare RJ45, switch → router, comenzi pe laptop, IP static, Device Manager, PuTTY, SSH pe switch cu VLAN.", min: 45, steps: [
        { k: "id", t: "Identifică echipamentele de pe masă", pts: 20, fix: 1, items: [["sw2960", 1, "Switch în rack: zeci de porturi RJ45 identice, cu patch-cord-uri."], ["rtr2800", 0, "Router ISR: carcasă plată, puține porturi, sloturi de module; pe față doar LED-uri."], ["sgback", 2, "Switch mic, de birou, cu 8 porturi numerotate – „switch-ul alb de deasupra”."], ["router", 0, "Router Cisco seria 1900: porturi GE 0/0, GE 0/1, CON, AUX, USB și sloturi EHWIC."], ["swports", 1, "Rânduri de porturi RJ45 numerotate – switch de 48 de porturi."]], diff: PR_DIFF },
        { k: "rj", t: "Mufează un cablu RJ45 (T568B) și testează-l", pts: 20, est: 1, q: { q: "Ai mufat ambele capete T568B. Pe tester, LED-urile MAIN 1…8 și REMOTE 1…8 se aprind în ordine. Ce cablu ai făcut și unde îl folosești?", o: ["Cablu drept (straight-through) – de exemplu PC ↔ switch sau switch ↔ router","Cablu crossover – folosit numai între switch și router","Cablu rollover – cablul de consolă pentru portul Console","Cablu defect – LED-urile trebuiau să se aprindă în ordine inversă"], e: "B–B (sau A–A) = drept. A la un capăt și B la celălalt = crossover (1↔3, 2↔6)." } },
        { k: "port", t: "Conectează switch-ul la router", pts: 10, est: 1, clicks: [{ q: "Cablul care vine din switch intră în routerul din spate. Atinge portul corect.", ok: ["ge00", "ge01"], e: "Datele merg în portul GigabitEthernet (GE 0/0 sau GE 0/1, în stânga). CON e doar pentru configurare cu cablul albastru de consolă." }], qs: [{ q: "În ce port intră celălalt capăt, pe switch?", o: ["În oricare port de date (Fa0/x sau Gi0/x), nu în Console","Numai în portul Console, ca la orice echipament Cisco","Numai în ultimul port al switch-ului, altfel nu merge","În portul de alimentare PoE de pe panoul din spate"], e: "Orice port de date de pe switch merge (de obicei Gi0/1 – uplink). Portul Console e doar pentru cablul de configurare." }, { q: "Ai legat cablul, dar LED-ul portului de la router nu se aprinde. Cel mai probabil:", o: ["Interfața routerului e oprită implicit – trebuie no shutdown","Cablul trebuia să fie rollover, nu cablu drept sau crossover","Switch-ul trebuie repornit de fiecare dată după mufare","Routerul nu are voie să fie legat direct la un switch"], e: "Pe router toate interfețele pornesc în „administratively down”. După interface g0/0 → no shutdown LED-ul devine verde." }] },
        { k: "cmd", t: "Comenzi pe laptop (cmd)", pts: 15, est: 1, L: { ip: "192.168.0.57", gw: "192.168.0.1", dns: "8.8.8.8" }, goals: [["ipconfig /all (vezi MAC-ul)", function (L) { return L.did.ipall; }, "ipconfig /all"], ["netstat (conexiunile active)", function (L) { return L.did.netstat; }, "netstat -an"], ["ipconfig /displaydns", function (L) { return L.did.disp; }, "ipconfig /displaydns"], ["ipconfig /flushdns", function (L) { return L.did.flush; }, "ipconfig /flushdns"], ["nslookup cu răspuns", function (L) { return L.did.ns === 1; }, "nslookup www.google.com"]], q: function (L) { return { q: "Din ipconfig /all: care e adresa fizică (MAC) a plăcii Ethernet?", o: [L.mac, "192.168.0.57", "FE80::1C4A:9E2F", "00-00-00-00-00-00"], e: "Linia „Physical Address” = MAC-ul (48 de biți, 12 cifre hexa). IP-ul e logic, MAC-ul e „ars” în placa de rețea." }; } },
        { k: "ip", t: "Setează IP static din foaie", pts: 10, est: 1, tg: { ip: "192.168.0." + X, mask: "255.255.255.0", gw: "192.168.0.1", dns: "8.8.8.8" } },
        { k: "dev", t: "Device Manager: găsește portul COM al cablului de consolă", pts: 5, est: 1 },
        { k: "putty", t: "PuTTY: conexiune serială pe consolă", pts: 10, est: 1 },
        { k: "cli", t: "Terminal Cisco: SSH pe switch cu VLAN (1 punct din 10)", pts: 10, fix: 1, task: "ssh", tip: "La examen SSH-ul valorează doar 1 punct din 10: poți lua 7+ și fără el, dacă restul pașilor sunt corecți. Totuși încearcă-l – fiecare obiectiv bifat aduce puncte." }] },
      { id: 2, t: "Varianta 2 – router, IP pe interfețe, ping între PC-uri", d: "Variantă plauzibilă: cablu crossover PC–router, IP pe două interfețe de router, IP static pe PC și test cu ping/tracert.", min: 40, steps: [
        { k: "id", t: "Identifică echipamentele", pts: 15, items: [["router", 0, "Router Cisco 1900: puține porturi diferite și sloturi de module."], ["sg300", 1, "Switch de 28 de porturi, format rack 1U."], ["sgfront", 2, "Switch compact de birou, 8 porturi, fără ventilator."]], diff: PR_DIFF },
        { k: "rj", t: "Mufează cablul pentru PC1 → router (direct)", pts: 20, q: { q: "PC1 se leagă DIRECT în routerul R1 (fără switch). Ce cablu face standardul clasic cerut la examen?", o: ["Crossover: T568A la un capăt, T568B la celălalt", "Drept: T568B la ambele capete", "Rollover albastru", "Cablu coaxial"], e: "Echipamente de același tip (PC–router, switch–switch, PC–PC) = crossover. Diferite (PC–switch, switch–router) = drept. Azi Auto-MDIX corectează automat, dar la examen se cere regula." } },
        { k: "port", t: "Leagă cablurile la router", pts: 15, clicks: [{ q: "PC1 e în rețeaua 192.168.1.0/24, care va fi pe G0/0. Atinge portul pentru PC1.", ok: ["ge00"], e: "G0/0 = GE 0/0." }, { q: "Acum cablul albastru de consolă, pentru configurare. Atinge portul.", ok: ["con"], e: "CON (albastru deschis). AUX e pentru modem, nu pentru consolă." }], qs: [{ q: "PC2 (192.168.2.10) intră în:", o: ["GE 0/1, care va avea 192.168.2.1/24", "Tot în GE 0/0, lângă PC1", "Portul AUX", "Portul USB"], e: "Două rețele diferite = două interfețe diferite de router." }] },
        { k: "ip", t: "IP static pe PC1", pts: 15, tg: { ip: "192.168.1.10", mask: "255.255.255.0", gw: "192.168.1.1", dns: "" } },
        { k: "cli", t: "Terminal Cisco: configurează R1", pts: 15, task: "rtr2" },
        { k: "cmd", t: "Testează de pe PC1", pts: 15, L: { ip: "192.168.1.10", gw: "192.168.1.1", dns: "", inet: false, dhcp: false, live: ["192.168.1.1", "192.168.2.1", "192.168.2.10"] }, useIp: true, goals: [["ipconfig (verifici IP-ul)", function (L) { return L.did.ip || L.did.ipall; }, "ipconfig"], ["ping gateway 192.168.1.1 reușit", function (L) { return L.did.ping && L.did.ping["192.168.1.1"]; }, "ping 192.168.1.1"], ["ping PC2 192.168.2.10 reușit", function (L) { return L.did.ping && L.did.ping["192.168.2.10"]; }, "ping 192.168.2.10"], ["tracert 192.168.2.10", function (L) { return L.did.tracert && L.did.tracert["192.168.2.10"]; }, "tracert 192.168.2.10 (vezi 2 salturi: gateway, apoi PC2)"]] },
        { k: "mcq", t: "Depanare rapidă", pts: 5, qs: [{ q: "PC1 dă ping în 192.168.1.1, dar nu în PC2. Ce verifici ÎNTÂI?", o: ["Gateway-ul lui PC2 (trebuie 192.168.2.1) și că G0/1 e up/up","Masca de pe PC1, care trebuie schimbată în 255.0.0.0","Cablul de consolă dintre PC1 și router","Repornirea lui PC1 de trei ori la rând"], e: "Răspunsul ping trebuie să se întoarcă: PC2 fără gateway corect nu știe să răspundă în altă rețea." }, { q: "La ping primești „PING: transmit failed. General failure.”. Ce înseamnă de obicei?", o: ["Placa nu are un IP valid sau un gateway în aceeași rețea, ori cablul e scos","Destinația a răspuns prea repede pentru a fi măsurată","Routerul a blocat ICMP cu o regulă ACL către destinație","Totul e în regulă, dar destinația nu e pornită"], e: "„General failure” = PC-ul nici n-a putut trimite pachetul (problemă locală)." }] }] },
      { id: 3, t: "Varianta 3 – VLAN + trunk + router-on-a-stick, fibră/OTDR, test de cablu", d: "Variantă plauzibilă: identifici conectori de fibră și citești un OTDR, interpretezi testerul de cablu, apoi configurezi VLAN-uri cu trunk pe switch și sub-interfețe pe router.", min: 45, steps: [
        { k: "mcq", t: "Identifică conectorii de fibră", pts: 20, qs: [{ ph: "sc", nocap: true, q: "Ce conector e în fotografie (pătrat, push-pull, ~2,5 mm)?", o: ["SC", "LC", "ST", "RJ45"], e: "SC = pătrat, se împinge și se trage. LC = mic (1,25 mm), cu clemă. ST = rotund, baionetă." }, { ph: "lc", nocap: true, q: "Și acesta (mic, cu clemă, de obicei duplex în switch-uri/SFP)?", o: ["LC", "SC", "ST", "FC"], e: "LC = „Little/Lucent Connector”, jumătate cât SC – standard în modulele SFP." }, { ph: "st", nocap: true, q: "Conector rotund cu baionetă (răsucești un sfert de tură):", o: ["ST", "LC", "SC", "MTP"], e: "ST = „straight tip”, baionetă, mai vechi, des întâlnit pe multimod." }, { q: "Un conector VERDE față de unul ALBASTRU înseamnă:", o: ["Verde = APC cu șlefuire la 8°, albastru = UPC – nu se cuplează între ele","Verde = multimod, albastru = monomod – se pot cupla fără probleme","Verde = mai scump, albastru = mai ieftin – altfel sunt identice","Verde = cupru, albastru = fibră – tipuri diferite de cablu"], e: "APC (unghi 8°) are reflexie foarte mică; dacă îl cuplezi cu UPC (drept) rămâne aer între fețe → pierderi mari și poți zgâria fețele." }] },
        { k: "mcq", t: "Citește urma OTDR", pts: 20, svg: true, qs: [{ svg: otdrSvg(), q: "Evenimentul B (o mică treaptă în jos, FĂRĂ vârf) este de obicei:", o: ["O sudură prin fuziune, cu pierdere mică și fără reflexie","Un conector, care dă mereu un vârf de reflexie","Capătul fibrei, unde semnalul dispare în zgomot","Zona moartă a aparatului, de la începutul traseului"], e: "Sudura = treaptă mică fără reflexie (~0,05–0,1 dB). Conectorul = vârf (reflexie) + treaptă." }, { q: "Vârful mare D urmat de zgomot (la ~9 km):", o: ["Capătul fibrei sau o rupere: reflexie Fresnel, apoi nu mai e semnal","O sudură foarte bună, fără reflexie și fără pierderi","Un splitter optic, care împarte puterea în două","Un amplificator optic montat pe traseul fibrei"], e: "După capătul fibrei OTDR-ul vede doar zgomot. Distanța până la vârf = lungimea fibrei sau locul ruperii." }, { q: "Ce arată panta liniei dintre evenimente?", o: ["Atenuarea fibrei, în dB/km, de ex. ~0,35 dB/km la 1310 nm","Viteza Internetului pe legătura testată","Numărul de clienți conectați la fibră","Puterea laserului de la abonat, în dBm"], e: "Cu cât linia coboară mai abrupt, cu atât fibra atenuează mai mult pe kilometru." }] },
        { k: "mcq", t: "Interpretează testerul de cablu", pts: 20, qs: [{ svg: testerSvg([3, 6, 1, 4, 5, 2, 7, 8], "Tester: remote 3 6 1 4 5 2 7 8"), q: "Ce cablu ai pe tester?", o: ["Crossover: T568A la un capăt, T568B la celălalt (pinii 1↔3 și 2↔6 inversați)","Drept, corect: același capăt T568B la ambele mufe","Rollover, cablul de consolă cu pinii în oglindă","Cablu cu pinul 7 întrerupt, deci cu un fir defect"], e: "Perechile portocalie și verde sunt inversate între capete: semnul crossover-ului." }, { svg: testerSvg([1, 2, 3, 4, 5, 6, 0, 8], "Tester: remote pinul 7 nu se aprinde"), q: "LED-ul 7 de la REMOTE nu se aprinde deloc. Ce faci?", o: ["Firul 7 nu face contact (circuit deschis) – tai mufa și o refaci","E normal, pinul 7 nu se folosește la Fast Ethernet","Schimbi bateria testerului și reiei proba","Lipești firul cu bandă izolatoare peste contact"], e: "La examen orice LED lipsă = cablu respins. Cauze: fir prea scurt, neîmpins până la capăt, sertizare slabă." }] },
        { k: "cli", t: "Terminal Cisco: VLAN-uri + trunk pe switch", pts: 15, task: "trunk" },
        { k: "cli", t: "Terminal Cisco: router-on-a-stick pe R1", pts: 15, task: "roas" },
        { k: "cmd", t: "Testează rutarea între VLAN-uri", pts: 10, L: { ip: "192.168.10.10", gw: "192.168.10.1", dns: "", inet: false, dhcp: false }, roas: true, goals: [["ping gateway VLAN 10 (192.168.10.1) reușit", function (L) { return L.did.ping && L.did.ping["192.168.10.1"]; }, "ping 192.168.10.1"], ["ping PC din VLAN 20 (192.168.20.10) reușit", function (L) { return L.did.ping && L.did.ping["192.168.20.10"]; }, "ping 192.168.20.10"]] }] }
    ];
  }
  function prDevHtml(com, open, picked) {
    var cats = [["Audio inputs and outputs"], ["Batteries"], ["Bluetooth"], ["Computer"], ["Disk drives"], ["Display adapters"], ["Keyboards"], ["Mice and other pointing devices"], ["Network adapters", ["Intel(R) Ethernet Connection (7) I219-V", "Intel(R) Wi-Fi 6 AX201 160MHz"]], ["Ports (COM & LPT)", ["Communications Port (COM1)", "Prolific USB-to-Serial Comm Port (COM" + com + ")"]], ["Universal Serial Bus controllers", ["USB Root Hub (USB 3.0)"]]];
    return '<div class="dmwin"><div class="dmbar">Device Manager</div><ul class="dmtree"><li class="dmroot">💻 ' + "LAPTOP-STS01" + "</li>" + cats.map(function (c, i) { var isOpen = open[i]; return '<li><button class="dmcat" data-c="' + i + '" aria-expanded="' + (isOpen ? "true" : "false") + '">' + (c[1] ? (isOpen ? "▾ " : "▸ ") : "▸ ") + esc(c[0]) + "</button>" + (isOpen && c[1] ? '<ul>' + c[1].map(function (d) { return '<li><button class="dmdev' + (picked === d ? " on" : "") + '" data-d="' + esc(d) + '">' + esc(d) + "</button></li>"; }).join("") + "</ul>" : "") + "</li>"; }).join("") + "</ul></div>";
  }
  var PRS = null;
  function vPrac(vid) {
    view = "practice"; navbar(true);
    if (!vid) {
      var hist = P.exams.filter(function (e) { return e.k === "prac"; }).slice(-8).reverse(), V = prVariants();
      var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.plug + ' Simulare probă practică</h2><p class="muted small">La fel ca în sală: lucrezi pas cu pas, fiecare pas primește puncte, la final primești nota (1–10). Minim <b>7</b> ca să treci. Pașii nu se pot relua după ce îi predai – exact ca la examen. La sală tragi la sorți un plic: Varianta 1 urmează relatarea candidatului, 2 și 3 sunt variante plauzibile din tematică.</p><div class="fact small"><b>💡 Punctaj:</b> cele mai multe puncte vin din identificarea echipamentelor, mufarea și testarea cablului, legarea switch → router, comenzile pe laptop și IP-ul static, consola prin COM + PuTTY. Ponderi la Varianta 1: <b>identificarea echipamentelor = 2 puncte</b>, <b>SSH pe switch = 1 punct</b> (confirmate de candidat); restul de 7 puncte, <i>estimat</i>: mufare + test RJ45 2 p, switch → router 1 p, comenzi laptop 1,5 p, IP static 1 p, Device Manager/COM 0,5 p, PuTTY 1 p. Poți trece cu 7+ și fără SSH, dar încearcă-l.</div>' +
        V.map(function (v) { return '<div class="prv"><h3>' + esc(v.t) + '</h3><p class="small">' + esc(v.d) + '</p><p class="muted small">' + v.steps.length + " pași · țintă ~" + v.min + ' min</p><button class="big" data-v="' + v.id + '">Începe ' + esc(v.t.split(" – ")[0]) + "</button></div>"; }).join("") + "</section>";
      h += '<section class="card"><h2>Rezultatele tale</h2>' + (hist.length ? hist.map(function (e) { return '<div class="crow"><span>' + fmtDate(e.t) + " · Varianta " + e.v + '</span><b class="' + (e.g >= 7 ? "okc" : "badc") + '">' + fmtG(e.g) + "</b><span>" + e.c + "/100" + (e.g >= 7 ? " · admis" : " · respins") + "</span></div>"; }).join("") : '<p class="muted">Nicio simulare practică încă.</p>') + "</section>";
      app.innerHTML = h;
      $("backBtn").onclick = function () { go("practice"); };
      Array.prototype.forEach.call(app.querySelectorAll("[data-v]"), function (b) { b.onclick = function () { PRS = null; vPrac(+b.getAttribute("data-v")); }; });
      return;
    }
    if (!PRS || PRS.v !== vid) { var VV = prVariants().filter(function (x) { return x.id === vid; })[0]; PRS = { v: vid, V: VV, i: 0, sc: [], t0: Date.now(), L: winNew(), com: 3 + Math.floor(Math.random() * 5), cli: {} }; }
    var S = PRS, st = S.V.steps[S.i];
    if (!st) return prResult();
    var el = Math.round((Date.now() - S.t0) / 60000);
    var h2 = '<section class="card prcard"><div class="prhd"><button class="back" id="prQuit">‹ Renunț</button><span class="muted small">' + esc(S.V.t.split(" – ")[0]) + " · pasul " + (S.i + 1) + "/" + S.V.steps.length + " · " + el + " min din ~" + S.V.min + '</span></div><div class="bar"><i style="width:' + Math.round(100 * S.i / S.V.steps.length) + '%"></i></div><h2>' + (S.i + 1) + ". " + esc(st.t) + ' <span class="pill">' + (st.pts / 10).toString().replace(".", ",") + " p din 10" + (st.est ? " (estimat)" : st.fix ? " (confirmat)" : "") + '</span></h2><div id="prBody"></div><div id="prFb"></div><button class="big" id="prNext">Predau pasul ›</button></section>';
    app.innerHTML = h2;
    $("prQuit").onclick = function () { if (confirm("Ieși din simulare? Pașii făcuți se pierd.")) { PRS = null; vPrac(); } };
    var body = $("prBody"), nextB = $("prNext"), scoreFn = function () { return 0; }, fb = "";
    function done(frac, msg) { S.sc.push({ t: st.t, p: Math.round(st.pts * Math.max(0, Math.min(1, frac)) * 10) / 10, m: st.pts, est: st.est, fix: st.fix }); S.i++; if (msg) { $("prFb").innerHTML = msg; } vPrac(vid); window.scrollTo(0, 0); }
    if (st.k === "id") {
      var qs = st.items.map(function (it) { return { ph: it[0], nocap: true, q: "Ce echipament e acesta?", o: [PR_ID_OPTS[it[1]]].concat(PR_ID_OPTS.filter(function (x, j) { return j !== it[1]; })), e: it[2] }; }).concat([st.diff]);
      var res = []; body.innerHTML = '<p class="small">Pe masă: switch-uri jos, routere, un switch mic deasupra. Le poți lua în mână și întoarce. Pentru fiecare: ce e?</p>' + mcqHtml(qs);
      mcqWire(body, qs, res); scoreFn = function () { return res.filter(Boolean).length / qs.length; };
    } else if (st.k === "mcq") {
      var qs2 = st.qs, res2 = []; body.innerHTML = mcqHtml(qs2); mcqWire(body, qs2, res2); scoreFn = function () { return res2.filter(Boolean).length / qs2.length; };
    } else if (st.k === "rj") {
      var want = T568.B, got = [], pool = shuffle(want.slice()), ordOk = null, res3 = [];
      var paintRj = function () {
        body.innerHTML = '<p class="small">Ai pe masă: cablu UTP Cat5e, clește de sertizat cu lamă, 2 mufe RJ45, tester. Dezizolezi ~2,5 cm, desfaci perechile, le îndrepți, le aranjezi T568B și tai drept la ~1,3 cm. <b>Clema în jos, pinul 1 în stânga.</b> Atinge firele în ordinea 1 → 8 (atinge un pin ca să scoți firul).</p>' + PH("rj45") +
          '<div class="rjplug">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var n = got[i], cls = ordOk !== null && n ? (n === want[i] ? " ok" : " bad") : ""; return '<button class="rjpin' + cls + '" data-i="' + i + '"' + (n && ordOk === null ? "" : " disabled") + '><i>' + (i + 1) + "</i>" + (n ? wireSw(n) + "<small>" + n.replace("alb-", "alb-<br>") + "</small>" : "<small>—</small>") + "</button>"; }).join("") + '</div><div class="rjpool">' + (ordOk === null ? pool.map(function (n, k) { return got.indexOf(n) >= 0 ? "" : '<button class="rjw" data-k="' + k + '">' + wireSw(n) + n + "</button>"; }).join("") : "") + "</div>" +
          (ordOk === null ? '<button class="ghost" id="rjSert"' + (got.length < 8 ? " disabled" : "") + ">Sertizez și testez</button>" : '<div class="' + (ordOk ? "fact tok" : "eli trapw") + ' small">' + (ordOk ? "✅ Testerul: 1-2-3-4-5-6-7-8 în ordine la ambele capete." : "❌ Testerul arată fire inversate – la examen ai fi refăcut mufa (timp pierdut). Corect: " + want.map(function (n, i) { return (i + 1) + "=" + n; }).join(", ")) + "</div>" + mcqHtml([st.q]));
        Array.prototype.forEach.call(body.querySelectorAll(".rjw"), function (b) { b.onclick = function () { got.push(pool[+b.getAttribute("data-k")]); paintRj(); }; });
        Array.prototype.forEach.call(body.querySelectorAll(".rjpin"), function (b) { b.onclick = function () { got.splice(+b.getAttribute("data-i"), 1); paintRj(); }; });
        if ($("rjSert")) $("rjSert").onclick = function () { ordOk = got.every(function (n, i) { return n === want[i]; }); if (ordOk) SND.ok(); else SND.bad(); paintRj(); };
        if (ordOk !== null) mcqWire(body, [st.q], res3);
      };
      paintRj(); scoreFn = function () { return (ordOk ? 0.6 : 0) + (res3[0] ? 0.4 : 0); };
    } else if (st.k === "port") {
      var ci = 0, cres = [], res4 = [];
      var paintP = function () {
        var cur = st.clicks[ci];
        body.innerHTML = (cur ? '<p class="prqt"><b>' + esc(cur.q) + "</b></p>" : "") + rtrRearSvg(cres.map(function (x) { return x.p; })) + '<div id="prPf">' + cres.map(function (r, i) { return '<div class="' + (r.ok ? "fact tok" : "eli trapw") + ' small">' + (r.ok ? "✅ " : "❌ ") + esc(st.clicks[i].e) + "</div>"; }).join("") + "</div>" + (cur ? "" : mcqHtml(st.qs));
        Array.prototype.forEach.call(body.querySelectorAll(".prport"), function (g) { g.onclick = function () { if (!st.clicks[ci]) return; var p = g.getAttribute("data-p"), ok = st.clicks[ci].ok.indexOf(p) >= 0; cres.push({ p: p, ok: ok }); if (ok) SND.ok(); else SND.bad(); ci++; paintP(); }; });
        if (!cur) mcqWire(body, st.qs, res4);
      };
      paintP(); scoreFn = function () { var n = st.clicks.length + st.qs.length; return (cres.filter(function (x) { return x.ok; }).length + res4.filter(Boolean).length) / n; };
    } else if (st.k === "cmd") {
      var L = winNew(st.L); if (st.useIp) { L.ip = S.L.ip || L.ip; L.mask = S.L.mask || L.mask; L.gw = S.L.gw; L.dhcp = false; }
      if (st.roas) { var rs = S.cli.roas, ts = S.cli.trunk; L.reach = function (ip) { var r = !!rs && !rs.ifs["GigabitEthernet0/0"].shut, sw = !!ts && ts.ifs["GigabitEthernet0/1"].mode === "trunk" && ts.ifs["FastEthernet0/1"].vlan === 10; if (ip === "192.168.10.1") return r && sw && !!rs.ifs["GigabitEthernet0/0.10"] && rs.ifs["GigabitEthernet0/0.10"].enc === 10 && rs.ifs["GigabitEthernet0/0.10"].ip === "192.168.10.1"; if (ip === "192.168.20.10") return r && sw && !!rs.ifs["GigabitEthernet0/0.20"] && rs.ifs["GigabitEthernet0/0.20"].enc === 20 && rs.ifs["GigabitEthernet0/0.20"].ip === "192.168.20.1" && ts.ifs["FastEthernet0/2"].vlan === 20 && L.reach("192.168.10.1"); return ip === L.ip; }; }
      if (st.useIp && S.cli.rtr2) { var r2 = S.cli.rtr2; L.reach = function (ip) { var g0 = r2.ifs["GigabitEthernet0/0"], g1 = r2.ifs["GigabitEthernet0/1"]; if (ip === L.ip) return true; var gwOk = L.gw === g0.ip && !g0.shut && ipIn(L.ip, g0.ip || "0.0.0.0", g0.mask || "255.255.255.255") && L.ip !== g0.ip; if (ip === "192.168.1.1") return !g0.shut && g0.ip === ip && ipIn(L.ip, ip, g0.mask || "255.255.255.0"); if (ip === "192.168.2.1") return gwOk && !g1.shut && g1.ip === ip; if (ip === "192.168.2.10") return gwOk && !g1.shut && g1.ip === "192.168.2.1" && g1.mask === "255.255.255.0"; return false; }; }
      var qq = st.q ? st.q(L) : null, res5 = [];
      body.innerHTML = '<p class="small">Laptopul e deschis. Win+R → <b>cmd</b> → Enter. Fă, pe rând:</p><ul class="goals" id="prG"></ul><div id="prTerm"></div>' + (qq ? mcqHtml([qq]) : "");
      var paintG = function () { $("prG").innerHTML = st.goals.map(function (g) { var ok = !!g[1](L); return '<li class="' + (ok ? "ok" : "") + '">' + (ok ? "✓ " : "○ ") + esc(g[0]) + "</li>"; }).join(""); };
      winBox($("prTerm"), L, function () { var g = st.goals.filter(function (x) { return !x[1](L); })[0]; return g ? "Tastează: " + g[2] : "Toate comenzile sunt făcute."; }, paintG); paintG();
      if (qq) mcqWire(body, [qq], res5);
      scoreFn = function () { var n = st.goals.length + (qq ? 1 : 0); return (st.goals.filter(function (g) { return !!g[1](L); }).length + (res5[0] ? 1 : 0)) / n; };
    } else if (st.k === "ip") {
      var tg = st.tg;
      body.innerHTML = '<div class="fact small"><b>Foaia de examen:</b> IP ' + tg.ip + " · mască " + tg.mask + " · gateway " + tg.gw + (tg.dns ? " · DNS " + tg.dns : " · DNS: nu se cere") + "</div>" + mcqHtml([PR_IPQ]) +
        '<div class="wdlg"><div class="wdbar">Internet Protocol Version 4 (TCP/IPv4) Properties</div><div class="wdbody"><label class="wr"><input type="radio" name="ipm" value="a" checked> Obtain an IP address automatically</label><label class="wr"><input type="radio" name="ipm" value="m"> Use the following IP address:</label>' +
        [["IP address:", "fIp"], ["Subnet mask:", "fMask"], ["Default gateway:", "fGw"]].map(function (f) { return '<label class="wf"><span>' + f[0] + '</span><input id="' + f[1] + '" inputmode="decimal" autocomplete="off" disabled></label>'; }).join("") +
        '<label class="wr"><input type="radio" name="dnm" value="a" checked> Obtain DNS server address automatically</label><label class="wr"><input type="radio" name="dnm" value="m"> Use the following DNS server addresses:</label><label class="wf"><span>Preferred DNS server:</span><input id="fDns" inputmode="decimal" autocomplete="off" disabled></label><label class="wf"><span>Alternate DNS server:</span><input id="fDns2" inputmode="decimal" autocomplete="off" disabled></label><div class="wbtns"><button class="ghost sm" type="button" id="wOk">OK</button><button class="ghost sm" type="button" id="wCancel">Cancel</button></div></div></div><div id="ipOut"></div>';
      var res6 = []; mcqWire(body, [PR_IPQ], res6);
      var syncDis = function () { var m = body.querySelector('input[name="ipm"]:checked').value === "m"; if (m) body.querySelector('input[name="dnm"][value="m"]').checked = true; ["fIp", "fMask", "fGw"].forEach(function (id) { $(id).disabled = !m; }); var dm = body.querySelector('input[name="dnm"]:checked').value === "m"; ["fDns", "fDns2"].forEach(function (id) { $(id).disabled = !dm; }); body.querySelector('input[name="dnm"][value="a"]').disabled = m; };
      Array.prototype.forEach.call(body.querySelectorAll('input[type="radio"]'), function (r) { r.onchange = syncDis; });
      $("fIp").addEventListener("input", function () { if (!$("fMask").value && /^\d+\.\d+\.\d+\.\d+$/.test($("fIp").value)) $("fMask").value = "255.255.255.0"; });
      var applied = null;
      $("wCancel").onclick = function () { $("ipOut").innerHTML = '<div class="eli small">Cancel = nu se salvează nimic.</div>'; };
      $("wOk").onclick = function () {
        var m = body.querySelector('input[name="ipm"]:checked').value === "m", v = { ip: $("fIp").value.trim(), mask: $("fMask").value.trim(), gw: $("fGw").value.trim(), dns: $("fDns").value.trim() };
        var errs = []; if (!m) errs.push("Ai lăsat „Obtain automatically” (DHCP) – trebuia „Use the following IP address”.");
        if (m && !ipOk(v.ip)) errs.push("Adresa IP nu e validă."); if (m && !maskOk(v.mask)) errs.push("Masca nu e validă.");
        if (m && v.gw && !ipIn(v.gw, v.ip, v.mask)) errs.push("Gateway-ul nu e în aceeași rețea cu IP-ul.");
        if (m && errs.length && !ipOk(v.ip)) { $("ipOut").innerHTML = '<div class="eli trapw small">⚠️ Windows: „' + esc(errs[errs.length - 1]) + '” Corectează și apasă OK din nou.</div>'; return; }
        applied = { m: m, v: v };
        if (m) { S.L.ip = v.ip; S.L.mask = v.mask; S.L.gw = v.gw; S.L.dns = v.dns; S.L.dhcp = false; }
        var parts = [m, v.ip === tg.ip, v.mask === tg.mask, v.gw === tg.gw, tg.dns ? v.dns === tg.dns : true], ok = parts.filter(Boolean).length;
        $("ipOut").innerHTML = '<div class="' + (ok === 5 ? "fact tok" : "eli trapw") + ' small">' + (ok === 5 ? "✅ Setat corect. Verificarea examinatorului: ipconfig → IPv4 Address " + esc(tg.ip) + ", Default Gateway " + esc(tg.gw) + "." : "Salvat, dar " + (5 - ok) + " câmp(uri) nu corespund foii (" + ["metodă", "IP", "mască", "gateway", "DNS"].filter(function (x, i) { return !parts[i]; }).join(", ") + "). Poți corecta și apăsa iar OK.") + "</div>";
      };
      scoreFn = function () { if (!applied) return 0; var v = applied.v, parts = [applied.m, v.ip === tg.ip, v.mask === tg.mask, v.gw === tg.gw, tg.dns ? v.dns === tg.dns : true, !!res6[0]]; return parts.filter(Boolean).length / 6; };
    } else if (st.k === "dev") {
      var open = {}, picked = null, res7 = [];
      var paintD = function () {
        body.innerHTML = '<p class="small">Ai legat cablul de consolă USB-serial (sau cel albastru + adaptor). Win+X → <b>Device Manager</b>. Găsește adaptorul și portul COM (fiecare laptop îl numerotează altfel!).</p>' + prDevHtml(S.com, open, picked) + (picked ? '<div class="' + (/Prolific/.test(picked) ? "fact tok" : "eli trapw") + ' small">' + (/Prolific/.test(picked) ? "✅ Acesta e adaptorul USB-serial: COM" + S.com + "." : "❌ Nu acesta. COM1 e portul serial intern al plăcii de bază; adaptorul de consolă apare ca „USB-to-Serial” în Ports (COM & LPT).") + "</div>" + mcqHtml([PR_COMQ(S.com)]) : "");
        Array.prototype.forEach.call(body.querySelectorAll(".dmcat"), function (b) { b.onclick = function () { var c = b.getAttribute("data-c"); open[c] = !open[c]; paintD(); }; });
        Array.prototype.forEach.call(body.querySelectorAll(".dmdev"), function (b) { b.onclick = function () { if (picked) return; picked = b.getAttribute("data-d"); paintD(); }; });
        if (picked) mcqWire(body, [PR_COMQ(S.com)], res7);
      };
      paintD(); scoreFn = function () { return (picked && /Prolific/.test(picked) ? 0.5 : 0) + (res7[0] ? 0.5 : 0); };
    } else if (st.k === "putty") {
      body.innerHTML = '<p class="small">Deschide PuTTY. Categoria <b>Session</b>, apoi <b>Connection → Serial</b>. Adaptorul de consolă e pe <b>COM' + S.com + "</b> (l-ai găsit în Device Manager).</p>" + PH("console") +
        '<div class="wdlg putty"><div class="wdbar">PuTTY Configuration</div><div class="wdbody"><b class="small">Session – Connection type:</b><div class="pradio">' + ["Raw", "Telnet", "Rlogin", "SSH", "Serial"].map(function (x) { return '<label><input type="radio" name="ct" value="' + x + '"' + (x === "SSH" ? " checked" : "") + "> " + x + "</label>"; }).join("") + '</div><label class="wf"><span id="lHost">Host Name (or IP address)</span><input id="pHost" autocomplete="off" autocapitalize="off"></label><label class="wf"><span id="lPort">Port</span><input id="pPort" value="22" inputmode="numeric" autocomplete="off"></label><b class="small">Connection → Serial:</b>' +
        '<label class="wf"><span>Data bits</span><input id="pData" value="8" inputmode="numeric"></label><label class="wf"><span>Stop bits</span><input id="pStop" value="1" inputmode="numeric"></label><label class="wf"><span>Parity</span><select id="pPar"><option>None</option><option>Odd</option><option>Even</option><option>Mark</option><option>Space</option></select></label><label class="wf"><span>Flow control</span><select id="pFlow"><option>XON/XOFF</option><option>None</option><option>RTS/CTS</option><option>DSR/DTR</option></select></label><div class="wbtns"><button class="ghost sm" type="button" id="pOpen">Open</button></div></div></div><div id="pOut"></div>';
        var syncP = function () { var ser = body.querySelector('input[name="ct"]:checked').value === "Serial"; $("lHost").textContent = ser ? "Serial line" : "Host Name (or IP address)"; $("lPort").textContent = ser ? "Speed" : "Port"; if (ser && ($("pPort").value === "22" || $("pPort").value === "23")) { $("pPort").value = "9600"; } if (ser && !$("pHost").value) $("pHost").value = "COM1"; };
        Array.prototype.forEach.call(body.querySelectorAll('input[name="ct"]'), function (r) { r.onchange = syncP; });
        var pv = null;
        $("pOpen").onclick = function () {
          var v = { ct: body.querySelector('input[name="ct"]:checked').value, line: $("pHost").value.trim().toUpperCase().replace(/\s+/g, ""), sp: $("pPort").value.trim(), d: $("pData").value.trim(), s: $("pStop").value.trim(), p: $("pPar").value, f: $("pFlow").value };
          pv = v; var parts = [["tip Serial", v.ct === "Serial"], ["COM" + S.com, v.line === "COM" + S.com], ["9600", v.sp === "9600"], ["8 biți de date", v.d === "8"], ["1 bit de stop", v.s === "1"], ["paritate None", v.p === "None"], ["flow control None", v.f === "None"]];
          var bad = parts.filter(function (x) { return !x[1]; });
          var ok = bad.length === 0, partial = v.ct === "Serial" && v.line === "COM" + S.com && v.sp === "9600";
          $("pOut").innerHTML = ok ? '<div class="term"><div class="tline">&nbsp;</div><div class="tline">Switch&gt;</div></div><div class="fact tok small">✅ Fereastra neagră + Enter → apare <b>Switch&gt;</b>. Ești în consola switch-ului.</div>' : '<div class="term"><div class="tline">' + (partial ? "Switch&gt;  (merge – dar setările diferă de standardul cerut)" : v.ct !== "Serial" ? "PuTTY Fatal Error: Network error: Connection timed out" : v.line !== "COM" + S.com ? "PuTTY Error: Unable to open connection to " + esc(v.line || "?") + ": Unable to open serial port" : "ÿ~#þ@×ÿ  (caractere ciudate = viteză greșită)") + '</div></div><div class="eli trapw small">De corectat: ' + bad.map(function (x) { return x[0]; }).join(", ") + ". Poți modifica și apăsa iar Open.</div>";
          if (ok) SND.ok();
        };
        scoreFn = function () { if (!pv) return 0; var v = pv, parts = [v.ct === "Serial", v.line === "COM" + S.com, v.sp === "9600", v.d === "8", v.s === "1", v.p === "None", v.f === "None"]; return parts.filter(Boolean).length / 7; };
    } else if (st.k === "cli") {
      var T = CLI_TASKS.filter(function (x) { return x.id === st.task; })[0], s = S.cli[st.task] || (S.cli[st.task] = cliNew(T.dev, T.enc3, T.init));
      body.innerHTML = (st.tip ? '<div class="fact small"><b>💡 Bine de știut:</b> ' + esc(st.tip) + "</div>" : "") + '<div class="ctask"><b>Sarcina:</b> ' + esc(T.d) + '<ul class="goals" id="prG"></ul></div><div id="prTerm"></div>';
      var paintC = function () { $("prG").innerHTML = T.g.map(function (g) { var ok = false; try { ok = !!g[1](s); } catch (e) {} return '<li class="' + (ok ? "ok" : "") + '">' + (ok ? "✓ " : "○ ") + esc(g[0]) + "</li>"; }).join(""); };
      cliBox($("prTerm"), s, T, paintC); paintC();
      scoreFn = function () { return T.g.filter(function (g) { try { return !!g[1](s); } catch (e) { return false; } }).length / T.g.length; };
    }
    nextB.onclick = function () {
      var f = scoreFn();
      if (f < 1 && !confirm("Pasul nu e complet (" + Math.round(f * 100) + "%). Predai așa? Nu-l mai poți relua.")) return;
      if (f >= 1) SND.ok();
      done(f);
    };
  }
  var PR_IPQ = { q: "Cel mai rapid drum până la setările IPv4 ale plăcii Ethernet:", o: ["Win+R → ncpa.cpl → clic dreapta pe Ethernet → Properties → IPv4 → Properties","Win+R → cmd → ipconfig /static, apoi introduci adresa","Device Manager → Network adapters → Update driver","Control Panel → Sound → Ethernet → Properties"], e: "ncpa.cpl deschide direct „Network Connections”. Merge și Settings → Network & Internet → Change adapter options." };
  function PR_COMQ(com) { return { q: "Ce scrii în PuTTY la „Serial line”?", o: ["COM" + com, "COM1", "USB" + com, "192.168.1.1"], e: "Numele exact din Device Manager. COM1 e de obicei portul intern (care pe laptop nici nu are mufă)." }; }
  function prResult() {
    var S = PRS, tot = S.sc.reduce(function (a, x) { return a + x.p; }, 0), g = Math.max(1, Math.round(tot) / 10), secs = Math.round((Date.now() - S.t0) / 1000);
    if (!S.saved) { S.saved = 1; P.exams.push({ t: Date.now(), k: "prac", v: S.v, c: Math.round(tot), n: 100, g: g, d: secs }); if (P.exams.length > 100) P.exams = P.exams.slice(-100); P.cli = P.cli || {}; P.cli["prac" + S.v] = Date.now(); addXP(g >= 7 ? 40 : 15); saveP(); if (g >= 7) SND.ok(); else SND.bad(); }
    app.innerHTML = '<section class="card sheetres"><div class="rhead"><b>PROBA PRACTICĂ – FIȘĂ DE EVALUARE</b><span class="muted small">' + esc(S.V.t) + " · " + fmtDate(Date.now()) + " · " + Math.round(secs / 60) + ' min</span></div><table class="rtab"><thead><tr><th>Pas</th><th>Puncte (din 10)</th></tr></thead><tbody>' + S.sc.map(function (x, i) { return "<tr><td>" + (i + 1) + ". " + esc(x.t) + (x.est ? ' <small class="muted">(pondere estimată)</small>' : x.fix ? ' <small class="muted">(pondere confirmată)</small>' : "") + '</td><td class="' + (x.p >= x.m ? "okc" : x.p >= x.m / 2 ? "" : "badc") + '">' + String(Math.round(x.p) / 10).replace(".", ",") + " / " + String(x.m / 10).replace(".", ",") + "</td></tr>"; }).join("") + '<tr><td><b>Total</b></td><td><b>' + String(Math.round(tot) / 10).replace(".", ",") + ' / 10</b></td></tr></tbody></table><div class="gradebox ' + (g >= 7 ? "ok" : "bad") + '"><span>Nota</span><b>' + fmtG(g) + "</b><span>" + (g >= 7 ? "ADMIS (minim 7)" : "RESPINS (minim 7)") + '</span></div><p class="small muted">Nota = suma punctelor (din 10), minim 1. Ponderile marcate „estimat” sunt aproximări. La examen trebuie minim 7 și la teorie, și la practică.</p><button class="big" id="prAgain">Altă variantă</button><button class="ghost" id="prBack">‹ Exersează</button></section>';
    $("prAgain").onclick = function () { PRS = null; vPrac(); };
    $("prBack").onclick = function () { PRS = null; go("practice"); };
  }
  /* ---------- Trucuri de memorie, capcane și jocuri cu acronime ---------- */
  var ACR = [["OSI", "Open Systems Interconnection", "Modelul cu 7 niveluri", "Systems", ["Standard", "Signal", "Service"]], ["TCP", "Transmission Control Protocol", "Transport sigur, cu confirmare", "Control", ["Connection", "Channel", "Carrier"]], ["UDP", "User Datagram Protocol", "Transport rapid, fără confirmare", "Datagram", ["Data", "Digital", "Direct"]],
    ["ARP", "Address Resolution Protocol", "Află MAC-ul din IP", "Resolution", ["Routing", "Request", "Relay"]], ["DNS", "Domain Name System", "Din nume → IP", "Domain", ["Dynamic", "Data", "Digital"]], ["DHCP", "Dynamic Host Configuration Protocol", "Dă automat IP-ul (DORA)", "Configuration", ["Control", "Connection", "Communication"]],
    ["NAT", "Network Address Translation", "Traduce adrese private în publice", "Translation", ["Transfer", "Transmission", "Tunnel"]], ["VLAN", "Virtual Local Area Network", "Rețea logică pe porturile switch-ului", "Virtual", ["Variable", "Visual", "Verified"]], ["MAC", "Media Access Control", "Adresa fizică a plăcii (48 biți)", "Access", ["Address", "Allocation", "Area"]],
    ["UTP", "Unshielded Twisted Pair", "Cablu torsadat neecranat", "Unshielded", ["Universal", "Unified", "Ultra"]], ["PoE", "Power over Ethernet", "Alimentare prin cablul de rețea", "Power", ["Port", "Packet", "Protocol"]], ["SSH", "Secure Shell", "Acces de la distanță criptat (port 22)", "Secure", ["Simple", "Serial", "System"]],
    ["PSTN", "Public Switched Telephone Network", "Telefonia fixă clasică", "Switched", ["Secure", "Serial", "Shared"]], ["PPPoE", "Point-to-Point Protocol over Ethernet", "Conectare la ISP cu user și parolă", "Protocol", ["Packet", "Private", "Program"]], ["ADSL", "Asymmetric Digital Subscriber Line", "Internet pe perechea de telefon", "Asymmetric", ["Advanced", "Automatic", "Analog"]],
    ["OTDR", "Optical Time Domain Reflectometer", "Aparat care „vede” de-a lungul fibrei", "Reflectometer", ["Receiver", "Repeater", "Regulator"]], ["APC", "Angled Physical Contact", "Conector verde, 8°", "Angled", ["Advanced", "Active", "Aligned"]], ["UPC", "Ultra Physical Contact", "Conector albastru, drept", "Ultra", ["Universal", "Unified", "Upper"]],
    ["SFP", "Small Form-factor Pluggable", "Modul optic care se introduce în switch", "Pluggable", ["Portable", "Programmable", "Powered"]], ["VoIP", "Voice over IP", "Telefonie prin rețeaua IP", "Voice", ["Video", "Virtual", "Vector"]], ["TETRA", "Terrestrial Trunked Radio", "Radio digital profesional (STS)", "Trunked", ["Transmitted", "Tactical", "Tuned"]],
    ["VSWR", "Voltage Standing Wave Ratio", "Raportul de unde staționare (ROS)", "Standing", ["Signal", "Static", "Stable"]], ["ISDN", "Integrated Services Digital Network", "Telefonie digitală: BRI 2B+D", "Integrated", ["Internal", "International", "Interactive"]], ["PCM", "Pulse Code Modulation", "Voce digitizată: 8 kHz × 8 biți", "Pulse", ["Phase", "Packet", "Power"]],
    ["QoS", "Quality of Service", "Prioritate pentru voce/video", "Quality", ["Queue", "Quick", "Quota"]], ["ACL", "Access Control List", "Listă de permis/interzis pe router", "Control", ["Configuration", "Connection", "Channel"]], ["CIDR", "Classless Inter-Domain Routing", "Notația /24", "Classless", ["Central", "Common", "Compressed"]],
    ["VLSM", "Variable Length Subnet Mask", "Subrețele de mărimi diferite", "Variable", ["Virtual", "Verified", "Visible"]], ["UEFI", "Unified Extensible Firmware Interface", "Urmașul BIOS-ului", "Extensible", ["External", "Extended", "Executable"]], ["RAID", "Redundant Array of Independent Disks", "Mai multe discuri ca unul, cu redundanță", "Redundant", ["Rapid", "Random", "Remote"]],
    ["UPS", "Uninterruptible Power Supply", "Sursă neîntreruptibilă", "Uninterruptible", ["Universal", "Unified", "Unlimited"]], ["WAN", "Wide Area Network", "Rețea pe arii mari (Internetul)", "Wide", ["Wireless", "World", "Web"]], ["LAN", "Local Area Network", "Rețea locală (clădire)", "Local", ["Large", "Linked", "Logical"]]];
  var MEMS = { i: 0, flip: false, tab: "cards", g: null };
  function vMem(tab) {
    view = "practice"; navbar(true); if (tab) MEMS.tab = tab;
    var mems = HACKS.filter(function (x) { return x.k === "mem"; }), traps = HACKS.filter(function (x) { return x.k === "trap"; });
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>🧠 Trucuri de memorie și capcane</h2><div class="seg wrap" id="memT">' + [["cards", "🧠 Fișe trucuri (" + mems.length + ")"], ["traps", "❗ Capcane (" + traps.length + ")"], ["fill", "✍️ Completează acronimul"], ["scr", "🔤 Literele amestecate"]].map(function (t) { return '<button data-t="' + t[0] + '" class="' + (MEMS.tab === t[0] ? "on" : "") + '">' + t[1] + "</button>"; }).join("") + '</div><div id="memB"></div></section>';
    app.innerHTML = h; $("backBtn").onclick = function () { go("practice"); };
    Array.prototype.forEach.call(app.querySelectorAll("#memT button"), function (b) { b.onclick = function () { MEMS.i = 0; MEMS.flip = false; MEMS.g = null; vMem(b.getAttribute("data-t")); }; });
    var B = $("memB");
    if (MEMS.tab === "cards" || MEMS.tab === "traps") {
      var L = MEMS.tab === "cards" ? mems : traps, x = L[MEMS.i % L.length];
      B.innerHTML = '<p class="muted small">Fișa ' + (MEMS.i % L.length + 1) + " din " + L.length + '. Atinge fișa ca s-o întorci.</p><button class="memcard' + (MEMS.flip ? " flip" : "") + '" id="mcard" aria-live="polite">' + (MEMS.flip ? HACK_HTML([x]) : '<span class="mcf">' + (x.k === "mem" ? "🧠" : '<span class="trapi">!</span>') + " " + x.t + '</span><small class="muted">atinge pentru explicație</small>') + '</button><div class="row2"><button class="ghost" id="mPrev">‹ Înapoi</button><button class="big" id="mNext">Următoarea ›</button></div>' + (MEMS.tab === "traps" ? '<button class="ghost" id="mQuiz">🎯 Joc: 20 de întrebări-capcană</button>' : "");
      $("mcard").onclick = function () { MEMS.flip = !MEMS.flip; SND.tap(); vMem(); };
      $("mNext").onclick = function () { MEMS.i++; MEMS.flip = false; vMem(); };
      $("mPrev").onclick = function () { MEMS.i = (MEMS.i + L.length - 1) % L.length; MEMS.flip = false; vMem(); };
      if ($("mQuiz")) $("mQuiz").onclick = function () { var pool = QS.filter(function (q) { return q.c === "cap" || /Capcan|❗|Nu te lăsa păcălit/.test(q.e); }); runQuiz({ mode: "practice", items: pickQuestions(pool, 20), hearts: 0, requeue: true, xpEach: 5, title: "Capcane – nu te lăsa păcălit" }); };
      return;
    }
    if (!MEMS.g) MEMS.g = { order: shuffle(ACR.map(function (_, i) { return i; })), k: 0, ok: 0, done: false, pick: [] };
    var G = MEMS.g, a = ACR[G.order[G.k % ACR.length]];
    if (MEMS.tab === "fill") {
      var words = a[1].split(" "), blank = words.map(function (w) { return w === a[3] ? "____" : w; }).join(" "), opts = G.opts || (G.opts = shuffle([a[3]].concat(a[4])));
      B.innerHTML = '<p class="muted small">Scor: ' + G.ok + " / " + G.k + '</p><div class="acr"><b>' + a[0] + "</b><span>" + esc(blank) + '</span><small class="muted">' + esc(a[2]) + '</small></div><div class="opts">' + opts.map(function (o) { return '<button class="opt" data-o="' + esc(o) + '"' + (G.done ? " disabled" : "") + ">" + esc(o) + "</button>"; }).join("") + '</div><div id="aOut"></div>' + (G.done ? '<button class="big" id="aNext">Următorul ›</button>' : "");
      Array.prototype.forEach.call(B.querySelectorAll(".opt"), function (b) { b.onclick = function () { var good = b.getAttribute("data-o") === a[3]; G.done = true; if (good) { G.ok++; SND.ok(); } else SND.bad(); vMem(); $("aOut").innerHTML = '<div class="' + (good ? "fact tok" : "eli trapw") + ' small">' + (good ? "✅ " : "❌ ") + "<b>" + a[0] + "</b> = " + esc(a[1]) + "</div>"; }; });
      if ($("aNext")) $("aNext").onclick = function () { G.k++; G.done = false; G.opts = null; if (G.k % 10 === 0) { addXP(5); saveP(); } vMem(); };
      return;
    }
    var letters = G.lt || (G.lt = shuffle(a[0].split("").map(function (c, i) { return { c: c, i: i }; })));
    if (letters.map(function (x) { return x.c; }).join("") === a[0] && a[0].length > 2) { G.lt = letters = letters.slice(1).concat(letters.slice(0, 1)); }
    var built = G.pick.map(function (i) { return letters[i].c; }).join(""), fin = built.length === a[0].length, good = built.toUpperCase() === a[0].toUpperCase();
    B.innerHTML = '<p class="muted small">Scor: ' + G.ok + " / " + G.k + '</p><div class="acr"><span>' + esc(a[2]) + '</span><small class="muted">' + esc(a[1].replace(/[A-Za-z]/g, function (c, j) { return j === 0 || a[1][j - 1] === " " || a[1][j - 1] === "-" ? c : "·"; })) + '</small></div><div class="scrb">' + (built || "&nbsp;") + '</div><div class="scrl">' + letters.map(function (x, i) { return '<button class="ghost" data-i="' + i + '"' + (G.pick.indexOf(i) >= 0 || fin ? " disabled" : "") + ">" + esc(x.c) + "</button>"; }).join("") + '</div><div class="row2"><button class="ghost" id="sUndo"' + (fin || !G.pick.length ? " disabled" : "") + '>↶ Șterge</button><button class="big" id="sNext"' + (fin ? "" : " disabled") + '>Următorul ›</button></div><div id="sOut">' + (fin ? '<div class="' + (good ? "fact tok" : "eli trapw") + ' small">' + (good ? "✅ " : "❌ Corect: ") + "<b>" + a[0] + "</b> = " + esc(a[1]) + "</div>" : "") + "</div>";
    Array.prototype.forEach.call(B.querySelectorAll(".scrl button"), function (b) { b.onclick = function () { G.pick.push(+b.getAttribute("data-i")); var nb = G.pick.map(function (i) { return letters[i].c; }).join(""); if (nb.length === a[0].length) { if (nb.toUpperCase() === a[0].toUpperCase()) { G.ok++; SND.ok(); } else SND.bad(); } vMem(); }; });
    $("sUndo").onclick = function () { G.pick.pop(); vMem(); };
    $("sNext").onclick = function () { G.k++; G.pick = []; G.lt = null; if (G.k % 10 === 0) { addXP(5); saveP(); } vMem(); };
  }
  /* ---------- date pentru jocuri (verificate) ---------- */
  var GPAIRS = {
    trk: { t: "Port trunk: comandă ↔ ce face", p: [["switchport mode trunk", "Face portul trunk fix"], ["switchport mode access", "Port pentru PC, fără etichetă"], ["switchport trunk allowed vlan add 30", "Adaugă VLAN 30 la listă"], ["switchport trunk native vlan 99", "VLAN-ul fără etichetă devine 99"], ["show interfaces trunk", "Trunkurile și VLAN-urile permise"], ["switchport nonegotiate", "Oprește DTP pe port"], ["encapsulation dot1Q 10", "Sub-interfață pentru VLAN 10"], ["switchport trunk encapsulation dot1q", "Cerută pe 3560, nu pe 2960"]] },
    trk2: { t: "Trunk și VLAN: noțiune ↔ înțeles", p: [["Access", "Un VLAN, cadre fără etichetă"], ["Trunk", "Mai multe VLAN-uri, cu etichetă"], ["802.1Q", "Eticheta VLAN de 4 octeți"], ["VLAN nativ", "Cadre fără etichetă, implicit 1"], ["auto + auto", "Rămâne access"], ["desirable + auto", "Devine trunk"], ["VID", "12 biți, VLAN 1–4094"], ["ISL", "Încapsulare veche, Cisco"], ["Router-on-a-stick", "Un cablu, sub-interfețe"]] },
    cmd: { t: "Comandă ↔ ce face", p: [["show ip interface brief", "Rezumatul interfețelor: IP și stare"], ["copy running-config startup-config", "Salvează configurația (NVRAM)"], ["no shutdown", "Pornește interfața"], ["configure terminal", "Intră în configurarea globală"], ["show vlan brief", "VLAN-urile și porturile lor"], ["ipconfig /all", "IP, mască, gateway, DNS și MAC (Windows)"], ["ipconfig /flushdns", "Golește memoria DNS a PC-ului"], ["nslookup www.google.com", "Întreabă DNS-ul ce IP are numele"], ["tracert 8.8.8.8", "Arată routerele de pe drum (Windows)"], ["enable", "Din > în modul privilegiat #"], ["show running-config", "Configurația activă (din RAM)"], ["crypto key generate rsa", "Creează cheile pentru SSH"]] },
    cab: { t: "Legătură ↔ cablu/mufă", p: [["PC ↔ switch", "Cablu drept (B–B)"], ["PC ↔ router, direct", "Crossover (A–B)"], ["PC ↔ portul CONSOLE", "Rollover albastru"], ["Clădiri la 10 km", "Fibră monomod (galbenă)"], ["Linie telefonică / ADSL", "RJ11 (6P2C)"], ["Antenă ↔ stație radio", "Coaxial 50 Ω"], ["Switch ↔ switch, același tip", "Crossover"], ["Modul SFP în switch", "Patch-cord fibră LC"]] },
    photo: { t: "Poză ↔ nume", p: [["@sc", "Conector SC"], ["@lc", "Conector LC"], ["@st", "Conector ST"], ["@fc", "Conector FC"], ["@rj11", "Mufă RJ11 (telefon)"], ["@rj45", "Mufă RJ45 (8P8C)"], ["@sfp", "Modul SFP"], ["@console", "Cablu de consolă Cisco"], ["@tester", "Tester de cablu"], ["@punch", "Sculă punch-down"]] },
    acr: { t: "Acronim ↔ înțeles", p: [["DHCP", "Dă automat IP-ul"], ["DNS", "Nume → IP"], ["ARP", "IP → MAC"], ["NAT", "Adrese private → publice"], ["PoE", "Curent prin cablul de rețea"], ["OTDR", "„Radarul” fibrei optice"], ["PSTN", "Telefonia fixă clasică"], ["PPPoE", "Login la ISP cu user/parolă"], ["SSH", "Acces criptat, port 22"], ["VLAN", "Rețea logică pe switch"]] },
    osi: { t: "Nivel OSI ↔ PDU / aparat", p: [["1 Fizic", "Biți · cablu, hub"], ["2 Legătură de date", "Cadre · switch, MAC"], ["3 Rețea", "Pachete · router, IP"], ["4 Transport", "Segmente · TCP/UDP, porturi"], ["5 Sesiune", "Deschide/închide dialogul"], ["6 Prezentare", "Codare, criptare, compresie"], ["7 Aplicație", "Date · HTTP, DNS, FTP"]] }
  };
  var GORDER = {
    trunk2960: { t: "Trunk pe un Catalyst 2960 (ordinea)", s: ["enable", "configure terminal", "vlan 10 + name ADMIN", "interface gi0/1", "switchport mode trunk", "switchport trunk allowed vlan 10,20", "switchport trunk native vlan 99", "end", "show interfaces trunk"], e: "Pe 2960 nu există encapsulation: mode trunk direct. Verifici la final cu show interfaces trunk." },
    trunk3560: { t: "Trunk pe un Catalyst 3560 (ordinea)", s: ["enable", "configure terminal", "interface gi0/1", "switchport trunk encapsulation dot1q", "switchport mode trunk", "switchport trunk allowed vlan 10,20", "end", "show interfaces trunk", "copy running-config startup-config"], e: "Pe 3560 întâi alegi encapsulation dot1q, apoi mode trunk; altfel apare „Command rejected… Auto”." },
    roas: { t: "Router-on-a-stick (ordinea)", s: ["Pe switch: port spre router în mode trunk", "Pe router: interface g0/0 + no shutdown", "interface g0/0.10", "encapsulation dot1Q 10", "ip address 192.168.10.1 255.255.255.0", "interface g0/0.20 + encapsulation dot1Q 20 + IP", "Pe PC-uri: gateway = IP-ul sub-interfeței", "ping între VLAN 10 și VLAN 20"], e: "Mai întâi trunkul pe switch și G0/0 pornită; apoi sub-interfețele cu dot1Q și IP." },
    t568b: { t: "Firele T568B (pinii 1 → 8)", s: ["alb-portocaliu", "portocaliu", "alb-verde", "albastru", "alb-albastru", "verde", "alb-maro", "maro"], e: "Portocala deschide, maro închide, albastrul stă la mijloc (4 albastru, 5 alb-albastru)." },
    crimp: { t: "Pașii de mufare RJ45", s: ["Tai cablul drept și dezizolezi ~2,5 cm", "Desfaci și îndrepți perechile", "Aranjezi firele în ordinea T568B", "Tai firele drept, la ~1,3 cm", "Împingi firele până la capătul mufei (clema în jos)", "Sertizezi ferm cu clestele", "Testezi: LED-urile 1–8 în ordine"], e: "Mantaua trebuie să intre sub clema de presare; cuprul se vede în vârful mufei." },
    ssh: { t: "SSH pe switch (ordinea corectă)", s: ["enable", "configure terminal", "hostname SW1 + ip domain-name sts.ro", "crypto key generate rsa → 1024", "ip ssh version 2", "line vty 0 15 → login local + transport input ssh", "end", "copy running-config startup-config"], e: "Cheile RSA cer înainte hostname (diferit de Switch) și domain-name. Utilizatorul (username admin secret …) poate fi creat oricând înainte de test." },
    vlan: { t: "VLAN pe un port (ordinea recomandată)", s: ["enable", "configure terminal", "vlan 10", "name ADMIN", "interface fa0/1", "switchport mode access", "switchport access vlan 10", "end", "show vlan brief"], e: "Verifici la final cu show vlan brief: Fa0/1 trebuie să apară în dreptul VLAN 10." },
    osi: { t: "Nivelurile OSI, de jos în sus", s: ["Fizic", "Legătură de date", "Rețea", "Transport", "Sesiune", "Prezentare", "Aplicație"], e: "„Fiecare Lup Râde Tare Seara Pe Afară”." },
    dora: { t: "DHCP pas cu pas", s: ["Discover (clientul strigă: e cineva DHCP?)", "Offer (serverul oferă o adresă)", "Request (clientul o cere)", "Acknowledge (serverul confirmă)"], e: "DORA." },
    con: { t: "Conectarea prin consolă", s: ["Legi cablul de consolă la portul CON", "Device Manager → Ports (COM & LPT): afli COMx", "PuTTY: Connection type = Serial", "Serial line = COMx, Speed = 9600", "Open, apoi Enter", "Apare promptul Switch>"], e: "9600, 8-N-1, fără flow control." },
    ip: { t: "IP static în Windows", s: ["Win+R → ncpa.cpl", "Clic dreapta pe Ethernet → Properties", "Internet Protocol Version 4 → Properties", "Bifezi „Use the following IP address”", "Completezi IP, mască, gateway, DNS", "OK, apoi verifici cu ipconfig"], e: "Verificarea examinatorului: ipconfig arată exact valorile din foaie." }
  };
  var GTF = [
    ["Un port access aparține unui singur VLAN.", 1, "Access = un singur VLAN; trunk = mai multe."], ["Eticheta 802.1Q are 2 octeți.", 0, "Are 4 octeți (TPID 2 + restul 2).", "Eticheta 802.1Q are 4 octeți."], ["VLAN-ul nativ circulă pe trunk fără etichetă.", 1, "Nativ = fără etichetă (implicit VLAN 1)."], ["Switchport trunk allowed vlan 30 adaugă VLAN 30 la lista existentă.", 0, "Fără „add” lista este ÎNLOCUITĂ.", "Switchport trunk allowed vlan add 30 adaugă VLAN 30 la lista existentă."], ["Pe un Catalyst 2960 dai întâi switchport trunk encapsulation dot1q.", 0, "La 2960 comanda nu există; are doar 802.1Q.", "Pe un Catalyst 3560 dai întâi switchport trunk encapsulation dot1q."], ["Două porturi dynamic auto formează un trunk.", 0, "auto + auto rămâne access.", "Un port dynamic desirable și unul dynamic auto formează un trunk."], ["Trunkul face cablul mai rapid.", 0, "Nu mărește viteza; doar duce mai multe VLAN-uri pe același cablu.", "Trunkul duce mai multe VLAN-uri pe același cablu."], ["La router-on-a-stick, IP-ul se pune pe sub-interfețe.", 1, "Interfața fizică are doar no shutdown."], ["Porturile trunk apar în show vlan brief la VLAN 1.", 0, "Trunkurile nu apar în show vlan brief; le vezi cu show interfaces trunk.", "Porturile trunk se văd cu show interfaces trunk."], ["VLAN-urile utilizabile au ID de la 1 la 4094.", 1, "12 biți dau 4096 de valori; 0 și 4095 sunt rezervate."],
    ["Voltmetrul se conectează în paralel cu elementul măsurat.", 1, "V și P, A și S."], ["Ampermetrul se conectează în paralel cu sursa.", 0, "În serie! În paralel face scurtcircuit.", "Ampermetrul se conectează în SERIE cu consumatorul."], ["Fibra cu manta galbenă este, de regulă, monomod.", 1, "Galben = sinGur (single-mode)."], ["Conectorul verde este UPC.", 0, "Verde = APC (8°); albastru = UPC.", "Conectorul verde este APC (8°); UPC este albastru."],
    ["Unghiul de șlefuire APC este de 8°.", 1, "8°, nu 6° și nu 45°."], ["Cadrele (frames) sunt PDU-ul nivelului 4.", 0, "Cadre = nivelul 2; segmente = nivelul 4.", "Cadrele sunt PDU-ul nivelului 2; la nivelul 4 sunt segmentele."], ["Switch-ul lucrează cu adrese MAC.", 1, "Nivel 2: cadre și MAC."], ["Hub-ul trimite cadrul doar portului destinație.", 0, "Hub-ul trimite la toți; switch-ul alege portul.", "Hub-ul trimite la TOATE porturile; switch-ul trimite doar portului destinație."],
    ["Un cablu Cat5e poate avea 150 m pe un segment Ethernet.", 0, "Maxim 100 m pe cupru, indiferent de categorie.", "Un segment Ethernet pe cupru are maxim 100 m, inclusiv pe Cat5e."], ["100 Mbps înseamnă aproximativ 12,5 MB/s.", 1, "Împarți la 8: b mic = bit, B mare = byte."], ["Adresa MAC nu poate fi schimbată niciodată.", 0, "Se poate schimba din software (MAC spoofing).", "Adresa MAC poate fi schimbată din software (MAC spoofing)."], ["192.168.1.255/24 poate fi dată unui PC.", 0, "Este adresa de broadcast.", "192.168.1.255/24 este adresa de broadcast – nu se dă unui PC."],
    ["Clasa C începe de la 192 la primul octet.", 1, "C: 192–223."], ["172.32.10.1 este o adresă privată.", 0, "Privat e doar 172.16–172.31.", "172.32.10.1 este publică; privatele sunt 172.16.0.0–172.31.255.255."], ["Crossover-ul inversează pinii 1↔3 și 2↔6.", 1, "„1-3, 2-6”."], ["Cablul rollover se folosește între PC și switch pentru date.", 0, "Rollover = doar consolă.", "Cablul rollover se folosește doar pentru consolă (PC → portul CON)."],
    ["PC-ul legat direct la router cere, clasic, cablu crossover.", 1, "PC și router sunt „rude” (același tip de port)."], ["Switch → router se leagă cu cablu drept.", 1, "Aparate diferite → drept."], ["Consola Cisco folosește implicit 9600 baud.", 1, "9600, 8-N-1."], ["SSH folosește portul 23.", 0, "SSH 22; Telnet 23.", "SSH folosește portul 22 (Telnet folosește 23)."],
    ["Pentru crypto key generate rsa trebuie setate înainte hostname și ip domain-name.", 1, "Altfel IOS refuză: „Please define a domain-name first”."], ["SSH versiunea 2 merge cu chei RSA de 512 biți.", 0, "Cere minim 768; la examen folosește 1024.", "SSH versiunea 2 cere chei RSA de minim 768 de biți (la examen: 1024)."], ["running-config se păstrează după reload fără salvare.", 0, "Fără copy run start se pierde.", "running-config se pierde la reload dacă nu e salvată cu copy running-config startup-config."], ["enable secret are prioritate față de enable password.", 1, "Secret = hash, câștigă."],
    ["Canalul telefonic transmite 300–3400 Hz.", 1, "„3-34”."], ["PCM: 8000 eșantioane/s × 8 biți = 64 kbit/s.", 1, "Un canal DS0."], ["E1 are 2048 kbit/s.", 1, "32 × 64 kbit/s."], ["RJ11 are 8 poziții.", 0, "RJ11 are 6 poziții; RJ45 are 8.", "RJ11 are 6 poziții; RJ45 are 8."],
    ["Linia telefonică 1 stă pe pinii din mijloc ai mufei RJ11.", 1, "„Telefonul vorbește prin mijloc”: 3–4."], ["Mufa RJ11 intrată într-un port RJ45 oferă Ethernet.", 0, "Intră fizic, dar nu e Ethernet.", "Mufa RJ11 intră fizic într-un port RJ45, dar NU oferă Ethernet."], ["OTDR-ul arată distanța până la o rupere a fibrei.", 1, "Vârful de la capăt/rupere dă distanța."], ["O sudură prin fuziune apare pe OTDR ca un vârf mare.", 0, "Treaptă mică, fără vârf.", "O sudură prin fuziune apare pe OTDR ca o treaptă mică, fără vârf."],
    ["TCP confirmă și retransmite datele pierdute.", 1, "TCP = telefon, sigur."], ["DNS transformă adresa MAC în adresă IP.", 0, "DNS: nume → IP. ARP: IP → MAC.", "DNS transformă numele în IP; ARP află MAC-ul din IP."], ["DHCP urmează pașii Discover, Offer, Request, Acknowledge.", 1, "DORA."], ["Pe 2,4 GHz canalele 1, 6 și 11 nu se suprapun.", 1, "1-6-11."],
    ["+3 dB înseamnă aproximativ dublarea puterii.", 1, "3 dublează, 10 înzecește."], ["0 dBm înseamnă 0 W.", 0, "0 dBm = 1 mW.", "0 dBm înseamnă 1 mW."], ["Coaxialul pentru radio are de obicei 75 Ω.", 0, "Radio 50 Ω, TV 75 Ω.", "Coaxialul pentru radio are de obicei 50 Ω (cel de TV are 75 Ω)."], ["IPv6 are 128 de biți.", 1, "IPv4 32, IPv6 128."],
    ["VLAN-ul și subrețeaua sunt exact același lucru.", 0, "VLAN = nivel 2, subrețea = nivel 3.", "VLAN-ul e separare la nivelul 2; subrețeaua e împărțire IP la nivelul 3."], ["Routerul separă domeniile de broadcast.", 1, "Broadcastul nu trece de router."], ["ipconfig /flushdns golește cache-ul DNS.", 1, "Verifici apoi cu ipconfig /displaydns."], ["netstat -b funcționează fără drepturi de administrator.", 0, "Cere cmd ca Administrator.", "netstat -b cere cmd pornit ca Administrator."],
    ["Portul COM al cablului USB-serial se vede în Device Manager → Ports (COM & LPT).", 1, "Acolo apare COMx."], ["Interfețele routerului Cisco sunt pornite implicit.", 0, "Sunt administratively down – trebuie no shutdown.", "Interfețele routerului Cisco sunt oprite implicit – trebuie no shutdown."], ["Pe un switch de nivel 2, IP-ul de management se pune pe interface vlan.", 1, "Porturile L2 nu primesc IP."], ["Între două faze ale rețelei trifazate sunt 400 V.", 1, "230 × √3 ≈ 400."],
    ["La o desfășurare de cub, pătratele lipite ajung pe fețe opuse.", 0, "Lipite = vecine; „sari unul” = opuse.", "Pătratele lipite ajung pe fețe vecine; cele separate de un pătrat, în linie dreaptă, sunt opuse."], ["„Concis” este antonimul lui „succint”.", 0, "Sunt sinonime; antonimul e „prolix”.", "„Concis” este sinonimul lui „succint”; antonimul este „prolix”."], ["Cubul are 12 muchii.", 1, "6 fețe, 8 vârfuri, 12 muchii."], ["Monomodul are miezul de ~9 µm.", 1, "MM: 50/62,5 µm."]
  ];
  var GCLI = [["switchport mode ____  (port spre alt switch)", ["trunk"], "Face portul trunk fix."], ["switchport trunk ____ vlan 10,20", ["allowed"], "Lista VLAN-urilor permise pe trunk."], ["switchport trunk ____ vlan 99", ["native"], "VLAN-ul care circulă fără etichetă."], ["switchport trunk allowed vlan ____ 30", ["add"], "Adaugă la listă, nu o înlocuiește."], ["show interfaces ____", ["trunk"], "Trunkurile, nativul și VLAN-urile permise."], ["switchport trunk encapsulation ____", ["dot1q"], "Doar pe switch-uri care suportă și ISL."], ["switchport ____", ["nonegotiate"], "Oprește DTP pe port."],["switchport mode ____  (port pentru un PC)", ["access"], "Port de acces (pentru un PC)."], ["switchport access ____ 10", ["vlan"], "Pune portul în VLAN 10."], ["crypto key generate ____", ["rsa"], "Chei RSA pentru SSH."], ["transport input ____", ["ssh"], "Pe line vty: permite doar SSH."], ["line ____ 0 15", ["vty"], "Liniile virtuale (acces de la distanță)."], ["copy running-config ____", ["startup-config", "start", "startup"], "Salvezi configurația."],
    ["ip domain-____ sts.ro", ["name"], "Domeniul, necesar pentru cheile RSA."], ["encapsulation ____ 10", ["dot1q", "dot1Q"], "Sub-interfață router-on-a-stick."], ["no ____", ["shutdown", "shut", "sh", "shu"], "Pornește interfața."], ["enable ____ Parola123", ["secret", "password"], "secret = parolă criptată (hash, recomandat); password merge și ea, dar e în clar."], ["login ____", ["local"], "Autentificare cu username din config."], ["ip default-____ 192.168.1.1", ["gateway"], "Gateway pentru switch-ul de nivel 2."],
    ["show ip interface ____", ["brief", "br"], "Rezumatul interfețelor."], ["show ____ brief", ["vlan"], "Lista VLAN-urilor."], ["service password-____", ["encryption"], "Ascunde parolele scrise în clar."], ["ip ssh ____ 2", ["version"], "SSH versiunea 2."], ["username admin ____ Parola123", ["secret", "password"], "secret = criptată (recomandat); password merge, dar e în clar."], ["configure ____", ["terminal", "t", "term", "ter", "termi", "termin", "termina", "terminal"], "Intri în (config)#."],
    ["ipconfig /____  (toate detaliile, inclusiv MAC)", ["all"], "ipconfig /all."], ["ipconfig /____  (golește cache-ul DNS)", ["flushdns"], "ipconfig /flushdns."], ["ipconfig /____  (afișează cache-ul DNS)", ["displaydns"], "ipconfig /displaydns."], ["____ www.google.com  (întreabă DNS-ul)", ["nslookup"], "nslookup."], ["ip address 192.168.1.1 ____", ["255.255.255.0"], "IOS cere masca zecimală, nu /24."], ["interface ____ 99  (interfața de management)", ["vlan"], "interface vlan 99."]];
  var GCABLE = [["PC ↔ switch", "Drept"], ["Switch ↔ router", "Drept"], ["PC ↔ router, direct", "Crossover"], ["Switch ↔ switch (Cat5e, fără Auto-MDIX)", "Crossover"], ["PC ↔ PC, direct", "Crossover"], ["Laptop ↔ portul CONSOLE al switch-ului", "Rollover"], ["Două clădiri la 15 km", "Fibră monomod"], ["Coloana clădirii, 300 m, 10 Gbps", "Fibră multimod OM3/OM4"], ["Telefon fix ↔ priza de perete", "RJ11"], ["Stația radio ↔ antena de pe pilon", "Coaxial 50 Ω"], ["Router ↔ router, porturi Ethernet, direct", "Crossover"], ["Laptop ↔ priza de rețea din birou", "Drept"]];
  var GCABOPT = ["Drept", "Crossover", "Rollover", "Fibră monomod", "Fibră multimod OM3/OM4", "RJ11", "Coaxial 50 Ω"];
  var GPHOTO = [["sc", "Conector SC"], ["lc", "Conector LC"], ["st", "Conector ST"], ["fc", "Conector FC"], ["fcapc", "Patch-cord FC/APC"], ["rj11", "Mufă RJ11"], ["rj45", "Mufă RJ45"], ["sfp", "Modul SFP"], ["console", "Cablu de consolă"], ["rtr2800", "Router Cisco"], ["isr1900", "Router Cisco 1900 (ca 1941)"], ["sw2960", "Switch Cisco în rack"], ["sgfront", "Switch compact de birou"], ["patchpanel", "Patch panel"], ["punch", "Sculă punch-down"], ["crimper2", "Clește de sertizat"], ["tester", "Tester de cablu"], ["multimeter", "Multimetru"], ["ram", "Modul RAM"], ["ssd", "SSD"], ["yagi", "Antenă Yagi"]];
  var GMNEM = [["„Add = adaugă la grămadă”", "switchport trunk allowed vlan add 30 completează lista, fără add o înlocuiești", ["add scoate VLAN-ul din listă", "add creează VLAN-ul pe switch", "add schimbă VLAN-ul nativ"]], ["„Auto așteaptă, Desirable dă cerere”", "DTP: auto acceptă trunk, desirable îl cere", ["auto = access fix, desirable = trunk fix", "auto = ISL, desirable = 802.1Q", "auto = port oprit, desirable = port pornit"]], ["„Trunk = autostradă cu benzi colorate”", "Un cablu poartă mai multe VLAN-uri, fiecare cu etichetă", ["Un cablu poartă un VLAN fără etichetă", "Un cablu poartă mai multe VLAN-uri criptate", "Un cablu rapid cu zece perechi"]],["„V și P, A și S”", "Voltmetrul în paralel, ampermetrul în serie", ["Viteza și puterea, amperi și secunde", "VLAN pe port, adresă pe switch", "Verde = APC, albastru = SM"]], ["„Fiecare Lup Râde Tare Seara Pe Afară”", "Nivelurile OSI de jos în sus", ["Pașii de mufare RJ45", "Culorile T568B", "Pașii DHCP"]], ["„Bunicul Cumpără Pâine, Smântână, Dulceață”", "PDU: biți, cadre, pachete, segmente, date", ["Ordinea firelor T568B", "Clasele de adrese IP", "Porturile TCP"]], ["„Galben = sinGur”", "Fibra galbenă e monomod (single-mode)", ["Conectorul galben e APC", "Cablul galben e crossover", "Firul galben e linia 1"]],
    ["„Verde = înclinat”", "Conectorul verde e APC, șlefuit la 8°", ["Fibra verde e multimod", "Firul verde e pinul 1", "LED-ul verde = cablu greșit"]], ["„1-3, 2-6”", "Pinii inversați la crossover", ["Pinii liniei telefonice", "Pinii folosiți de PoE", "Canalele Wi-Fi"]], ["„Telefonul vorbește prin mijloc”", "Linia 1 pe pinii din mijloc 3–4 ai RJ11", ["Telefonul folosește pinii 1–2", "Vocea are 300–3400 Hz", "ADSL merge doar pe fibră"]], ["„URI” și „PUI”", "U = R · I și P = U · I", ["Ordinea OSI", "Formula decibelilor", "Clasele IP"]],
    ["„DORA”", "DHCP: Discover, Offer, Request, Acknowledge", ["Pașii de configurare SSH", "Nivelurile TCP/IP", "Tipurile de cabluri"]], ["„3 dublează, 10 înzecește”", "+3 dB ≈ ×2 putere, +10 dB = ×10", ["Cat3 și Cat10", "3 VLAN-uri și 10 porturi", "3 faze la 10 grade"]], ["„Sari unul, dai de opus”", "La desfășurarea cubului: pătratele separate de unul sunt fețe opuse", ["La subnetare: sari o adresă", "La T568B: sari un fir", "La OSI: sari un nivel"]], ["„Rudele se încrucișează, străinii merg drept”", "Același tip de aparat → crossover, tipuri diferite → drept", ["VLAN-urile rude au trunk", "Fibrele rude se sudează", "Routerele rude folosesc NAT"]],
    ["„9600, 8-N-1”", "Setările consolei Cisco în PuTTY", ["Adresa IP a switch-ului", "Viteza fibrei", "Numărul de porturi"]], ["„ARP Află MAC-ul, DNS Dă IP-ul”", "ARP: IP → MAC; DNS: nume → IP", ["ARP dă IP-ul, DNS dă MAC-ul", "Amândouă dau MAC-ul", "Sunt protocoale de rutare"]], ["„4 → 32, 6 → 128”", "IPv4 are 32 de biți, IPv6 are 128", ["4 porturi, 32 VLAN-uri", "Cat4 și Cat6", "4 faze, 6 fire"]], ["„10 – 172.16–31 – 192.168”", "Intervalele de adrese IP private", ["Clasele A, B, C", "Porturile SSH", "Lungimile fibrelor"]]];
  /* ---------- Jocuri ---------- */
  function gDone(k) { P.cli = P.cli || {}; var first = !P.cli[k]; P.cli[k] = Date.now(); return first; }
  function gBest(k, v) { P.cli = P.cli || {}; var b = P.cli["best:" + k] || 0; if (v > b) { P.cli["best:" + k] = v; return true; } return false; }
  function gWin(k, xp, msg) { var first = gDone(k); addXP(first ? xp : Math.ceil(xp / 3)); saveP(); SND.ok(); return '<div class="fact tok"><b>🎉 ' + (msg || "Gata!") + " +" + (first ? xp : Math.ceil(xp / 3)) + " XP</b></div>"; }
  var GAMES = [
    ["daily", "📅", "Joc zilnic", "10 întrebări amestecate: întâi ce ai greșit (repetare spațiată)"],
    ["swipe", "👆", "Adevărat sau Fals – swipe", "60 de secunde: dreapta = Adevărat, stânga = Fals; cardul se întoarce cu explicația"],
    ["light", "⚡", "Fulger: 4 variante", "Cât mai multe răspunsuri corecte în 60 s, cu combo"],
    ["fall", "🎯", "Prinde răspunsul corect", "Variantele cad – atinge-o pe cea corectă înainte să ajungă jos"],
    ["pairs", "🃏", "Perechi (memorie)", "Întoarce cărțile și găsește perechile"],
    ["order", "🔢", "Pune în ordine", "T568B, mufare, SSH, VLAN, OSI, consolă, IP static, DHCP"],
    ["cli", "⌨️", "Completează comanda", "Scrie cuvântul care lipsește din comanda Cisco/Windows"],
    ["cable", "🔌", "Ce cablu?", "Alege cablul corect pentru fiecare legătură"],
    ["photo", "📷", "Recunoaște din poză", "Conectori, echipamente Cisco, scule"],
    ["mnem", "🧠", "Ce ascunde trucul?", "Vezi trucul de memorie – ce codifică?"]
  ];
  function gKeys() { var k = ["g:daily", "g:swipe", "g:light", "g:fall", "g:cli", "g:cable", "g:photo", "g:mnem"]; Object.keys(GPAIRS).forEach(function (x) { k.push("g:pairs:" + x); }); Object.keys(GORDER).forEach(function (x) { k.push("g:order:" + x); }); return k; }
  var GS = null;
  function vGames(id, sub) {
    view = "practice"; navbar(true); P.cli = P.cli || {};
    if (!id) {
      var keys = gKeys(), dn = keys.filter(function (k) { return P.cli[k]; }).length;
      var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>🎮 Jocuri de memorie</h2><p class="muted small">' + dn + " / " + keys.length + ' jocuri terminate · fiecare dă XP și contează la progres.</p><div class="ggrid">' + GAMES.map(function (g) {
        var tot = g[0] === "pairs" ? Object.keys(GPAIRS).length : g[0] === "order" ? Object.keys(GORDER).length : 1, got = g[0] === "pairs" ? Object.keys(GPAIRS).filter(function (x) { return P.cli["g:pairs:" + x]; }).length : g[0] === "order" ? Object.keys(GORDER).filter(function (x) { return P.cli["g:order:" + x]; }).length : P.cli["g:" + g[0]] ? 1 : 0, best = P.cli["best:" + g[0]];
        return '<button class="gcard' + (got >= tot ? " ok" : "") + '" data-g="' + g[0] + '"><span class="gic">' + g[1] + "</span><b>" + esc(g[2]) + "</b><small>" + esc(g[3]) + "</small><i>" + (got >= tot ? "✓ " : "") + got + "/" + tot + (best ? " · record " + best : "") + "</i></button>";
      }).join("") + "</div></section>";
      var nw = weakIds().length; if (nw) h = h.replace('<div class="ggrid">', '<button class="big" id="gRev">🧠 Exersează greșelile (' + nw + ') – în formate diferite</button><div class="ggrid">');
      app.innerHTML = h; $("backBtn").onclick = function () { go("practice"); }; if ($("gRev")) $("gRev").onclick = function () { go("rev"); };
      Array.prototype.forEach.call(app.querySelectorAll("[data-g]"), function (b) { b.onclick = function () { GS = null; vGames(b.getAttribute("data-g")); }; });
      return;
    }
    var G = GAMES.filter(function (g) { return g[0] === id; })[0];
    app.innerHTML = '<section class="card gbox"><button class="back" id="backBtn">‹ Jocuri</button><h2>' + G[1] + " " + esc(G[2]) + '</h2><div id="gB"></div></section>';
    $("backBtn").onclick = function () { stopG(); vGames(); };
    var B = $("gB");
    ({ daily: gDaily, swipe: gSwipe, light: gLight, fall: gFall, pairs: gPairs, order: gOrder, cli: gCli, cable: gCable, photo: gPhoto, mnem: gMnem }[id])(B, sub);
  }
  function stopG() { if (GS && GS.tm) clearInterval(GS.tm); if (GS && GS.raf) clearTimeout(GS.raf); GS = null; }
  function pickSet(B, map, cb, label) {
    B.innerHTML = '<p class="muted small">' + label + '</p><div class="gsets">' + Object.keys(map).map(function (k) { return '<button class="ptask' + (P.cli[cb + k] ? " ok" : "") + '" data-s="' + k + '"><span>' + (P.cli[cb + k] ? "✅" : "▶️") + "</span>" + esc(map[k].t) + "</button>"; }).join("") + "</div>";
  }
  /* 1) zilnic */
  function gDaily(B) {
    var k = "d:" + dayKey(), done = P.cli[k];
    var nm = Object.keys(P.mist).filter(function (x) { return P.mist[x] && P.mist[x][1]; }).length;
    B.innerHTML = '<p>Azi: 10 întrebări din tot materialul. Întâi revin cele greșite (ai ' + nm + ' de repetat), apoi cele nevăzute.</p>' + (done ? '<div class="fact tok small">✅ Jocul de azi e făcut. Poți să-l mai joci.</div>' : "") + '<button class="big" id="dGo">Joacă</button>';
    $("dGo").onclick = function () { P.cli[k] = P.cli[k] || 0; gDone("g:daily"); P.cli[k] = Date.now(); addXP(5); saveP(); var pool = QS.filter(function (q) { return !q.s; }), due = pool.filter(function (q) { return P.mist[q.id] && P.mist[q.id][1]; }).sort(function (a, b) { return (P.mist[a.id][0] || 0) - (P.mist[b.id][0] || 0); }).slice(0, 6), ids = {}; due.forEach(function (q) { ids[q.id] = 1; });
      runQuiz({ mode: "practice", items: shuffle(due.concat(pickQuestions(pool.filter(function (q) { return !ids[q.id]; }), 10 - due.length))), hearts: 0, requeue: true, xpEach: 5, title: "Joc zilnic" }); };
  }
  /* 2) swipe Adevărat/Fals */
  function tfKey(x) { var h = 0; for (var i = 0; i < x[0].length; i++) h = (h * 31 + x[0].charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  function tfWeak(x) { var k = tfKey(x); return (P.cli["tfw:" + k] || 0) > (P.cli["tfr:" + k] || 0) ? 1 : 0; }
  function gSwipe(B) {
    var deck = shuffle(GTF).sort(function (a, b) { return tfWeak(b) - tfWeak(a); }), S = GS = { i: 0, score: 0, combo: 0, t: 60, wrong: [], right: 0, back: false, tm: null, on: false };
    function hud() { return '<div class="ghud"><span>⏱ <b id="sT">' + S.t + '</b>s</span><span>Scor <b id="sS">' + S.score + '</b></span><span>Combo <b id="sC">×' + mult() + "</b></span></div>"; }
    function mult() { return S.combo >= 10 ? 3 : S.combo >= 5 ? 2 : 1; }
    function intro() { B.innerHTML = '<p>Glisează cardul: <b>dreapta = ADEVĂRAT</b>, <b>stânga = FALS</b> (sau folosește butoanele). După fiecare răspuns cardul se întoarce: vezi verdictul, varianta corectă și trucul. Timpul stă pe loc cât citești spatele cardului. Combo: ×2 după 5 corecte la rând, ×3 după 10.</p><p class="muted small">Record: ' + (P.cli["best:swipe"] || 0) + '</p><button class="big" id="sGo">Start</button>'; $("sGo").onclick = start; }
    function start() { S.on = true; paint(); S.tm = setInterval(function () { if (!document.body.contains(B)) return stopG(); if (S.back) return; S.t--; var el = $("sT"); if (el) el.textContent = S.t; if (S.t <= 0) end(); }, 1000); }
    function paint() {
      var x = deck[S.i % deck.length];
      B.innerHTML = hud() + '<div class="swwrap"><div class="swcard" id="swc" tabindex="0" aria-live="polite"><div class="swin" id="swin"><div class="swf"><small class="muted">Adevărat sau fals?</small><p>' + esc(x[0]) + '</p><div class="swhint"><span>‹ FALS</span><span>ADEVĂRAT ›</span></div></div><div class="swb" id="swb"></div></div></div></div><div class="row2"><button class="ghost swbtn bad" id="sF">✗ Fals</button><button class="ghost swbtn good" id="sA">✓ Adevărat</button></div>';
      $("sF").onclick = function () { answer(0); }; $("sA").onclick = function () { answer(1); };
      var c = $("swc"), x0 = null, dx = 0;
      c.addEventListener("pointerdown", function (e) { if (S.back) return; x0 = e.clientX; dx = 0; c.setPointerCapture(e.pointerId); c.style.transition = "none"; });
      c.addEventListener("pointermove", function (e) { if (x0 === null) return; dx = e.clientX - x0; c.style.transform = "translateX(" + dx + "px) rotate(" + dx / 18 + "deg)"; c.classList.toggle("tl", dx < -40); c.classList.toggle("tr", dx > 40); });
      c.addEventListener("pointercancel", function () { x0 = null; dx = 0; c.style.transition = ""; c.style.transform = ""; c.classList.remove("tl", "tr"); });
      c.addEventListener("pointerup", function () { if (x0 === null) return; x0 = null; c.style.transition = ""; if (Math.abs(dx) > 90) answer(dx > 0 ? 1 : 0, dx); else { c.style.transform = ""; c.classList.remove("tl", "tr"); } });
      c.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") answer(1); if (e.key === "ArrowLeft") answer(0); });
    }
    function answer(v, dx) {
      if (S.back || !S.on) return; var x = deck[S.i % deck.length], ok = v === x[1], c = $("swc");
      P.cli["tf" + (ok ? "r:" : "w:") + tfKey(x)] = Date.now();
      if (ok) { S.combo++; S.right++; S.score += 10 * mult(); SND.ok(); } else { S.combo = 0; S.wrong.push(x); SND.bad(); if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) {} }
      S.back = true; c.style.transform = ""; c.classList.remove("tl", "tr"); c.classList.add(ok ? "bump" : "shake");
      var hk = typeof HACK_FIND === "function" ? HACK_HTML(HACK_FIND(x[0] + " " + (x[3] || "") + " " + x[2], null)) : "";
      $("swb").innerHTML = '<p class="small" style="margin:0 0 6px"><i>„' + esc(x[0]) + '”</i></p><div class="swv ' + (x[1] ? "t" : "f") + '">' + (x[1] ? "ADEVĂRAT" : "FALS") + '</div><div class="swr ' + (ok ? "good" : "bad") + '">' + (ok ? "✅ Ai răspuns corect" + (mult() > 1 ? " · combo ×" + mult() : "") : "❌ Ai greșit") + "</div>" + (x[1] ? "" : '<p class="small"><b>Varianta corectă:</b> ' + esc(x[3]) + "</p>") + '<p class="small muted">' + esc(x[2]) + "</p>" + (ok ? "" : hk) + '<button class="big" id="sCont">Continuă ›</button>';
      $("swin").classList.add("flip"); $("sS").textContent = S.score; $("sC").textContent = "×" + mult();
      $("sCont").onclick = function () { S.back = false; S.i++; if (S.t <= 0) end(); else paint(); };
    }
    function end() {
      if (!S.on) return; S.on = false; clearInterval(S.tm); S.back = false;
      var rec = gBest("swipe", S.score), win = S.right >= 5 ? gWin("g:swipe", 15, "Rundă terminată!") : (saveP(), "");
      B.innerHTML = '<div class="gend"><b>' + S.score + '</b><span>puncte · ' + S.right + " corecte · " + S.wrong.length + " greșite</span>" + (rec ? '<i class="tag">🏆 Record nou!</i>' : "<small>Record: " + (P.cli["best:swipe"] || 0) + "</small>") + "</div>" + win + (S.right < 5 ? '<p class="small muted">Ca jocul să se bifeze: minim 5 răspunsuri corecte într-o rundă.</p>' : "") + (S.wrong.length ? '<h3>De reținut</h3>' + S.wrong.map(function (x) { return '<div class="card rev"><div class="qq">' + esc(x[0]) + '</div><div class="small"><b>' + (x[1] ? "ADEVĂRAT" : "FALS") + "</b>" + (x[3] ? " – " + esc(x[3]) : "") + '</div><div class="small muted">' + esc(x[2]) + "</div></div>"; }).join("") : "") + '<button class="big" id="sAgain">Încă o rundă</button>';
      $("sAgain").onclick = function () { gSwipe(B); };
    }
    intro();
  }
  /* 3) fulger */
  function lightPool() { return QS.filter(function (q) { return !q.s && q.a.length === 4 && q.q.length < 160; }); }
  function gLight(B) {
    var pool = shuffle(lightPool()), S = GS = { i: 0, score: 0, combo: 0, t: 60, ok: 0, bad: [], tm: null, on: false };
    B.innerHTML = '<p>60 de secunde, întrebări din tot materialul. Răspuns corect = 10 puncte × combo (×2 de la 3 la rând, ×3 de la 6). Greșeala nu oprește timpul – vezi explicațiile la final.</p><p class="muted small">Record: ' + (P.cli["best:light"] || 0) + '</p><button class="big" id="lGo">Start</button>';
    $("lGo").onclick = function () { S.on = true; paint(); S.tm = setInterval(function () { if (!document.body.contains(B)) return stopG(); S.t--; var e = $("lT"); if (e) e.textContent = S.t; if (S.t <= 0) end(); }, 1000); };
    function mult() { return S.combo >= 6 ? 3 : S.combo >= 3 ? 2 : 1; }
    function paint() {
      var q = pool[S.i % pool.length], ord = shuffle([0, 1, 2, 3]);
      B.innerHTML = '<div class="ghud"><span>⏱ <b id="lT">' + S.t + "</b>s</span><span>Scor <b>" + S.score + "</b></span><span>×" + mult() + '</span></div><p class="lq">' + esc(q.q) + '</p><div class="opts">' + ord.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(q.a[k]) + "</button>"; }).join("") + "</div>";
      Array.prototype.forEach.call(B.querySelectorAll(".opt"), function (b) { b.onclick = function () { if (!S.on) return; var ok = b.getAttribute("data-k") === "0"; if (ok) { S.combo++; S.ok++; S.score += 10 * mult(); SND.ok(); } else { S.combo = 0; S.bad.push(q); SND.bad(); } b.classList.add(ok ? "good" : "bad"); setTimeout(function () { S.i++; if (S.on) paint(); }, ok ? 180 : 450); }; });
    }
    function end() { S.on = false; clearInterval(S.tm); var rec = gBest("light", S.score), win = S.ok >= 5 ? gWin("g:light", 15, "Fulger terminat!") : (saveP(), ""); B.innerHTML = '<div class="gend"><b>' + S.score + "</b><span>" + S.ok + " corecte · " + S.bad.length + " greșite</span>" + (rec ? '<i class="tag">🏆 Record nou!</i>' : "") + "</div>" + win + S.bad.map(function (q) { return '<div class="card rev"><div class="qq">' + esc(q.q) + '</div><div class="small">✅ ' + esc(q.a[0]) + '</div><div class="small muted">' + esc(q.e) + "</div></div>"; }).join("") + '<button class="big" id="lAgain">Încă o dată</button>'; $("lAgain").onclick = function () { gLight(B); }; }
  }
  /* 4) prinde răspunsul */
  function gFall(B) {
    var pool = shuffle(lightPool().filter(function (q) { return q.a.every(function (x) { return x.length <= 40; }); })), S = GS = { i: 0, score: 0, lives: 3, ok: 0, bad: [], on: false };
    B.innerHTML = '<p>Cele 4 variante cad pe ecran. Atinge-o pe cea <b>corectă</b> înainte să ajungă jos. Ai 3 vieți. Viteza crește pe parcurs.</p><p class="muted small">Record: ' + (P.cli["best:fall"] || 0) + '</p><button class="big" id="fGo">Start</button>';
    $("fGo").onclick = function () { S.on = true; round(); };
    function round() {
      if (!S.on) return; var q = pool[S.i % pool.length], ord = shuffle([0, 1, 2, 3]), dur = Math.max(4.5, 9 - S.ok * 0.3);
      B.innerHTML = '<div class="ghud"><span>' + "❤️".repeat(S.lives) + "</span><span>Scor <b>" + S.score + '</b></span></div><p class="lq">' + esc(q.q) + '</p><div class="fall" id="fz">' + ord.map(function (k, j) { return '<button class="fitem" data-k="' + k + '" style="left:' + (2 + j * 24.5) + "%;animation-duration:" + (dur + j * 0.35).toFixed(2) + "s;animation-delay:" + (j * 0.25) + 's">' + esc(q.a[k]) + "</button>"; }).join("") + "</div>";
      var settled = false;
      function fin(ok, b) { if (settled || !S.on) return; settled = true; if (ok) { S.ok++; S.score += 10 + S.ok; SND.ok(); } else { S.lives--; S.bad.push(q); SND.bad(); } if (b) b.classList.add(ok ? "good" : "bad"); Array.prototype.forEach.call(B.querySelectorAll(".fitem"), function (x) { x.style.animationPlayState = "paused"; if (x.getAttribute("data-k") === "0") x.classList.add("good"); }); setTimeout(function () { S.i++; if (S.lives <= 0) end(); else round(); }, ok ? 350 : 900); }
      Array.prototype.forEach.call(B.querySelectorAll(".fitem"), function (b) { b.onclick = function () { fin(b.getAttribute("data-k") === "0", b); }; if (b.getAttribute("data-k") === "0") b.addEventListener("animationend", function () { fin(false, null); }); });
    }
    function end() { S.on = false; var rec = gBest("fall", S.score), win = S.ok >= 5 ? gWin("g:fall", 15, "Bravo!") : (saveP(), ""); B.innerHTML = '<div class="gend"><b>' + S.score + "</b><span>" + S.ok + " prinse</span>" + (rec ? '<i class="tag">🏆 Record nou!</i>' : "") + "</div>" + win + S.bad.map(function (q) { return '<div class="card rev"><div class="qq">' + esc(q.q) + '</div><div class="small">✅ ' + esc(q.a[0]) + '</div><div class="small muted">' + esc(q.e) + "</div></div>"; }).join("") + '<button class="big" id="fAgain">Încă o dată</button>'; $("fAgain").onclick = function () { gFall(B); }; }
  }
  /* 5) perechi */
  function gPairs(B, set) {
    if (!set) { pickSet(B, GPAIRS, "g:pairs:", "Alege un set. Întoarce câte 2 cărți: dacă se potrivesc, rămân descoperite."); Array.prototype.forEach.call(B.querySelectorAll("[data-s]"), function (b) { b.onclick = function () { gPairs(B, b.getAttribute("data-s")); }; }); return; }
    var pr = shuffle(GPAIRS[set].p).slice(0, 6), cards = shuffle(pr.reduce(function (a, p, i) { return a.concat([{ i: i, s: p[0] }, { i: i, s: p[1] }]); }, [])), open = [], got = {}, moves = 0, lock = false;
    function face(s) { return s.charAt(0) === "@" ? '<img src="' + PHOTOS[s.slice(1)].f + '" alt="" loading="lazy">' : esc(s); }
    function paint() {
      B.innerHTML = '<p class="muted small">' + esc(GPAIRS[set].t) + " · mutări: " + moves + " · perechi: " + Object.keys(got).length + "/" + pr.length + '</p><div class="mgrid">' + cards.map(function (c, k) { var up = got[c.i] || open.indexOf(k) >= 0; return '<button class="mc' + (up ? " up" : "") + (got[c.i] ? " ok" : "") + '" data-k="' + k + '" aria-label="' + (up ? esc(c.s.replace("@", "poză ")) : "carte întoarsă") + '"><span class="mcb">?</span><span class="mcf2">' + (up ? face(c.s) : "") + "</span></button>"; }).join("") + '</div><div id="pOut"></div><button class="ghost" id="pBack">‹ Alt set</button>';
      if ($("pBack")) $("pBack").onclick = function () { gPairs(B); };
      Array.prototype.forEach.call(B.querySelectorAll(".mc"), function (b) { b.onclick = function () { var k = +b.getAttribute("data-k"); if (lock || got[cards[k].i] || open.indexOf(k) >= 0) return; open.push(k); SND.tap(); if (open.length === 2) { moves++; lock = true; var a = cards[open[0]], c = cards[open[1]]; paint(); setTimeout(function () { if (a.i === c.i) { got[a.i] = 1; SND.ok(); } open = []; lock = false; paint(); if (Object.keys(got).length === pr.length) $("pOut").innerHTML = gWin("g:pairs:" + set, 10, "Toate perechile în " + moves + " mutări!") + pr.map(function (p) { return '<div class="small">• ' + face(p[0]).replace(/<img[^>]*>/, "🖼️ " + esc(p[1])) + " ↔ " + esc(p[1]) + "</div>"; }).join(""); }, a.i === c.i ? 350 : 900); } else paint(); }; });
    }
    paint();
  }
  /* 6) ordine */
  function gOrder(B, set) {
    if (!set) { pickSet(B, GORDER, "g:order:", "Alege o secvență. Atinge pașii în ordinea corectă (atinge un pas pus ca să-l scoți)."); Array.prototype.forEach.call(B.querySelectorAll("[data-s]"), function (b) { b.onclick = function () { gOrder(B, b.getAttribute("data-s")); }; }); return; }
    var O = GORDER[set], pool = shuffle(O.s.map(function (x, i) { return i; })), got = [], checked = false;
    if (pool.every(function (x, i) { return x === i; })) pool.reverse();
    function paint() {
      var bad = checked ? got.filter(function (x, i) { return x !== i; }).length : 0;
      B.innerHTML = '<p class="muted small">' + esc(O.t) + '</p><ol class="olist">' + got.map(function (x, i) { return '<li><button class="ostep' + (checked ? (x === i ? " ok" : " bad") : "") + '" data-r="' + i + '"' + (checked ? " disabled" : "") + ">" + esc(O.s[x]) + "</button></li>"; }).join("") + '</ol><div class="opool">' + pool.filter(function (x) { return got.indexOf(x) < 0; }).map(function (x) { return '<button class="ghost ostep" data-a="' + x + '">' + esc(O.s[x]) + "</button>"; }).join("") + "</div>" + (checked ? (bad ? '<div class="eli trapw small">❌ ' + bad + " pași nu sunt la locul lor. Ordinea corectă:<ol>" + O.s.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>" + esc(O.e) + '</div><button class="big" id="oRe">Încearcă din nou</button>' : gWin("g:order:" + set, 10, "Ordine perfectă!") + '<div class="small muted">' + esc(O.e) + "</div>") : '<button class="big" id="oChk"' + (got.length < O.s.length ? " disabled" : "") + ">Verifică</button>") + '<button class="ghost" id="oBack">‹ Altă secvență</button>';
      Array.prototype.forEach.call(B.querySelectorAll("[data-a]"), function (b) { b.onclick = function () { got.push(+b.getAttribute("data-a")); SND.tap(); paint(); }; });
      Array.prototype.forEach.call(B.querySelectorAll("[data-r]"), function (b) { b.onclick = function () { got.splice(+b.getAttribute("data-r"), 1); paint(); }; });
      if ($("oChk")) $("oChk").onclick = function () { checked = true; if (got.some(function (x, i) { return x !== i; })) SND.bad(); paint(); };
      if ($("oRe")) $("oRe").onclick = function () { gOrder(B, set); };
      $("oBack").onclick = function () { gOrder(B); };
    }
    paint();
  }
  /* 7) completează comanda */
  function gCli(B) {
    var L = shuffle(GCLI).slice(0, 10), S = GS = { i: 0, ok: 0, done: false };
    function paint() {
      var x = L[S.i];
      if (!x) { var win = S.ok >= 7 ? gWin("g:cli", 15, S.ok + "/10 corecte!") : '<div class="eli trapw small">' + S.ok + "/10. Ca jocul să se bifeze: minim 7 corecte.</div>"; B.innerHTML = win + '<button class="big" id="cAgain">Încă o rundă</button>'; $("cAgain").onclick = function () { gCli(B); }; return; }
      B.innerHTML = '<p class="muted small">' + (S.i + 1) + " / 10 · corecte: " + S.ok + '</p><p class="small">💡 ' + esc(x[1].reduce(function (t, a) { return a.length < 2 ? t : t.replace(new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "____"); }, x[2])) + '</p><div class="term"><div class="tline">' + esc(x[0]) + '</div></div><form id="cF" class="tin" autocomplete="off"><label>____ =</label><input id="cI" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Cuvântul lipsă"></form><div id="cOut"></div><button class="big" id="cNext">' + (S.done ? "Următoarea ›" : "Verifică") + "</button>";
      var inp = $("cI"); if (!S.done) inp.focus();
      function check() { if (S.done) { S.done = false; S.i++; return paint(); } var v = cliNorm(inp.value).trim().toLowerCase().replace(/\s+/g, " "), ok = x[1].some(function (a) { return a.toLowerCase() === v; }); S.done = true; if (ok) { S.ok++; SND.ok(); } else SND.bad(); $("cOut").innerHTML = '<div class="' + (ok ? "fact tok" : "eli trapw") + ' small">' + (ok ? "✅ " : "❌ Corect: <b>" + esc(x[1][0]) + "</b>. ") + esc(x[2]) + '<div class="term"><div class="tline">' + esc(x[0].replace("____", x[1][0])) + "</div></div></div>"; $("cNext").textContent = "Următoarea ›"; inp.disabled = true; }
      $("cF").onsubmit = function (e) { e.preventDefault(); check(); }; $("cNext").onclick = check;
    }
    paint();
  }
  /* 8) ce cablu / 9) poze / 10) trucuri – runde cu variante */
  function mcRound(B, key, items, render, xp, minOk) {
    var L = shuffle(items).slice(0, Math.min(10, items.length)), S = GS = { i: 0, ok: 0, ans: false };
    function paint() {
      var x = L[S.i];
      if (!x) { var win = S.ok >= minOk ? gWin(key, xp, S.ok + "/" + L.length + " corecte!") : '<div class="eli trapw small">' + S.ok + "/" + L.length + ". Ca jocul să se bifeze: minim " + minOk + " corecte.</div>"; B.innerHTML = win + '<button class="big" id="mAgain">Încă o rundă</button>'; $("mAgain").onclick = function () { mcRound(B, key, items, render, xp, minOk); }; return; }
      var r = render(x), ord = r.ord || (r.ord = shuffle(r.o.map(function (_, i) { return i; })));
      B.innerHTML = '<p class="muted small">' + (S.i + 1) + " / " + L.length + " · corecte: " + S.ok + "</p>" + r.top + '<div class="opts">' + ord.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(r.o[k]) + "</button>"; }).join("") + '</div><div id="mOut"></div>';
      Array.prototype.forEach.call(B.querySelectorAll(".opt"), function (b) { b.onclick = function () { var ok = b.getAttribute("data-k") === "0"; if (ok) { S.ok++; SND.ok(); } else SND.bad(); Array.prototype.forEach.call(B.querySelectorAll(".opt"), function (o) { o.disabled = true; if (o.getAttribute("data-k") === "0") o.classList.add("good"); else if (o === b) o.classList.add("bad"); }); $("mOut").innerHTML = '<div class="' + (ok ? "fact tok" : "eli trapw") + ' small">' + (ok ? "✅ " : "❌ ") + (r.e || "") + '</div><button class="big" id="mNext">Următoarea ›</button>'; $("mNext").onclick = function () { S.i++; paint(); }; }; });
    }
    paint();
  }
  function gCable(B) { mcRound(B, "g:cable", GCABLE, function (x) { var wrong = shuffle(GCABOPT.filter(function (o) { return o !== x[1]; })).slice(0, 3); return { top: '<div class="acr"><b>' + esc(x[0]) + '</b><small class="muted">Ce cablu/conector folosești?</small></div>', o: [x[1]].concat(wrong), e: "Regula: aparate diferite → drept; același tip → crossover; consolă → rollover; distanțe mari → fibră (monomod la km, multimod OM3/OM4 la sute de metri)." }; }, 15, 8); }
  function gPhoto(B) { mcRound(B, "g:photo", GPHOTO.filter(function (x) { return PHOTOS[x[0]]; }), function (x) { var wrong = shuffle(GPHOTO.filter(function (o) { return o[1] !== x[1]; }).map(function (o) { return o[1]; })).slice(0, 3); var p = PHOTOS[x[0]]; return { top: '<figure class="ph"><img src="' + p.f + '" width="' + p.w + '" height="' + p.h + '" alt="Ce este în poză?"><figcaption><small>Foto: ' + p.a + " · " + p.l + "</small></figcaption></figure>", o: [x[1]].concat(wrong), e: p.c }; }, 15, 8); }
  function gMnem(B) { mcRound(B, "g:mnem", GMNEM, function (x) { return { top: '<div class="acr"><b style="font-size:1.15rem">' + esc(x[0]) + '</b><small class="muted">Ce te ajută să-ți amintești trucul acesta?</small></div>', o: [x[1]].concat(x[2]), e: x[1] + "." }; }, 15, 8); }
  /* ---------- Progres total (0–100%) și clasament ---------- */
  function completion() {
    var it = [];
    LES.forEach(function (l) { it.push(["Lecție: " + l.t, isDone(l.id)]); });
    CLI_TASKS.forEach(function (t) { if (t.g.length) it.push(["Terminal: " + t.t, !!(P.cli && P.cli[t.id])]); });
    SCN.forEach(function (x) { it.push(["Situație reală: " + x.t, !!(P.cli && P.cli["sc:" + x.id])]); });
    GX.forEach(function (x) { [1, 4].forEach(function (t) { it.push(["Pas cu pas: " + x.t + " – nivel " + t + (t === 4 ? " (examen)" : " (copiezi)"), !!(P.cli && P.cli[gxKey(x.id, t)])]); }); });
    gKeys().forEach(function (k) { it.push(["Joc: " + k, !!(P.cli && P.cli[k])]); });
    it.push(["Joc: ordinea firelor RJ45", !!(P.cli && P.cli["g:rj"])], ["Joc: multimetru (toate scenariile)", !!(P.cli && P.cli["g:mm"])]);
    [1, 2, 3].forEach(function (v) { it.push(["Simulare teorie: Subiectul " + v, P.exams.some(function (e) { return e.k === "sim" && e.s === "Subiectul " + v; })]); it.push(["Simulare practică: Varianta " + v, !!(P.cli && P.cli["prac" + v])]); });
    var d = it.filter(function (x) { return x[1]; }).length;
    return { done: d, total: it.length, pct: Math.floor(1000 * d / it.length) / 10, items: it };
  }
  var lbLast = 0;
  function lbPush(force) {
    if (!AUTH || !P.lb || (!force && Date.now() - lbLast < 60000)) return Promise.resolve();
    lbLast = Date.now(); var c = completion();
    return api("POST", "/api/board", { on: !!P.lb.on, name: P.lb.name, pct: c.pct, xp: xpTotal(), done: c.done, total: c.total }).catch(function () {});
  }
  var lbPulled = 0;
  function vBoard(again) {
    view = "stats"; navbar(true);
    if (AUTH && !again && Date.now() - lbPulled > 15000) { lbPulled = Date.now(); syncNow().then(function () { if (app.querySelector("#lbOn") && !app.contains(document.activeElement && document.activeElement.id === "lbName" ? document.activeElement : null)) vBoard(true); }); }
    var c = completion(), lb = P.lb || { on: false, name: "", t: 0 };
    var h = '<section class="card"><button class="back" id="backBtn">‹ Statistici</button><h2>🏆 Clasament</h2><div class="gend"><b>' + String(c.pct).replace(".", ",") + '%</b><span>din tot site-ul (' + c.done + " / " + c.total + ' lecții, jocuri, terminale, simulări)</span></div>';
    if (!AUTH) { h += '<p>Clasamentul e privat: apar doar conturile de pe acest site care aleg să participe, cu numele afișat ales de ele. Autentifică-te în tabul Cont ca să participi.</p><button class="big" id="toAcct">Mergi la Cont</button></section>'; app.innerHTML = h; $("backBtn").onclick = function () { go("stats"); }; $("toAcct").onclick = function () { go("acct"); }; return; }
    h += '<label class="wr2"><input type="checkbox" id="lbOn"' + (lb.on ? " checked" : "") + '> Vreau să apar în clasament (opțional)</label><label class="tform"><span>Nume afișat</span><input id="lbName" maxlength="24" value="' + esc(lb.name || AUTH.user) + '"></label><button class="big" id="lbSave">Salvează</button><div id="lbList"><p class="muted">Se încarcă…</p></div></section>';
    h += '<section class="card"><h2>Ce mai ai de făcut</h2>' + c.items.filter(function (x) { return !x[1]; }).slice(0, 40).map(function (x) { return '<div class="small">○ ' + esc(x[0]) + "</div>"; }).join("") + (c.total - c.done > 40 ? '<div class="small muted">… și încă ' + (c.total - c.done - 40) + "</div>" : "") + (c.done === c.total ? '<p class="okc"><b>Totul e terminat – 100%! 🎖️</b></p>' : "") + "</section>";
    app.innerHTML = h; $("backBtn").onclick = function () { go("stats"); };
    function load() { api("GET", "/api/board").then(function (r) { $("lbList").innerHTML = r.rows.length ? '<ol class="lbl">' + r.rows.map(function (x, i) { return '<li class="' + (x.me ? "me" : "") + '"><span class="lbn">' + (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1) + ".") + "</span><b>" + esc(x.name) + "</b><span>" + String(x.pct).replace(".", ",") + "% · " + x.xp + " XP</span></li>"; }).join("") + "</ol>" : '<p class="muted">Nimeni în clasament încă. Bifează mai sus ca să apari.</p>'; }).catch(function (e) { $("lbList").innerHTML = '<p class="muted">Clasamentul nu se poate încărca acum (' + esc(e.message) + ").</p>"; }); }
    $("lbSave").onclick = function () { P.lb = { on: $("lbOn").checked, name: $("lbName").value.trim().slice(0, 24) || AUTH.user, t: Date.now() }; saveP(); lbPush(true).then(function () { toast(P.lb.on ? "Apari în clasament ✓" : "Nu mai apari în clasament."); load(); }); };
    if (lb.on) lbPush(true).then(load); else load();
  }
  /* fațadă video: iframe-ul youtube-nocookie se încarcă doar la apăsare */
  document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest(".ytf"); if (!b) return; var f = document.createElement("iframe"); f.src = "https://www.youtube-nocookie.com/embed/" + b.getAttribute("data-yt") + "?start=" + b.getAttribute("data-s") + "&end=" + b.getAttribute("data-e") + "&autoplay=1&rel=0&playsinline=1"; f.title = b.getAttribute("aria-label"); f.allow = "autoplay; encrypted-media; picture-in-picture"; f.allowFullscreen = true; f.className = "ytif"; f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin"); b.replaceWith(f); });
  /* ---------- Stăpânire (0–5) pe întrebare + „Exersează greșelile” în formate diferite ---------- */
  /* P.cli["m:"+id] = timp*10 + nivel (merge = max → câștigă cea mai nouă valoare); P.cli["mx:"+id] = câte greșeli; P.cli["mf:"+id] = timp*10 + ultimul format */
  function mLvl(id) { var v = P.cli && P.cli["m:" + id]; return v ? v % 10 : 0; }
  function mSet(id, l) { P.cli = P.cli || {}; P.cli["m:" + id] = Date.now() * 10 + Math.max(0, Math.min(5, l)); }
  function mMiss(id) { return (P.cli && P.cli["mx:" + id]) || 0; }
  function mUpd(id, ok) { if (!id) return; var l = mLvl(id); mSet(id, ok ? l + 1 : Math.max(0, l - 2)); if (!ok) P.cli["mx:" + id] = mMiss(id) + 1; }
  function mDots(id) { var l = mLvl(id), s = ""; for (var i = 0; i < 5; i++) s += i < l ? "●" : "○"; return '<span class="mdots" title="Stăpânire ' + l + '/5">' + s + "</span>"; }
  function weakIds() {
    var m = activeMistakes().sort(function (a, b) { return P.mist[a][0] - P.mist[b][0]; });
    var low = Object.keys(P.q).filter(function (id) { return BYID[id] && !BYID[id].s && !(P.mist[id] && P.mist[id][1]) && P.q[id][1] > 0 && mLvl(id) < 3; });
    return m.concat(low).filter(function (id) { return BYID[id] && (!BYID[id].s || BYID[id].c === "iq"); });
  }
  var FMT = ["Grilă", "Adevărat / Fals", "Perechi", "Scrie răspunsul", "Ordonează cuvintele", "Fișă"];
  function norm(x) { return String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); }
  function lev(a, b) { var m = [], i, j; for (i = 0; i <= a.length; i++) { m[i] = [i]; for (j = 1; j <= b.length; j++) m[i][j] = i ? Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) : j; } return m[a.length][b.length]; }
  function fmtsFor(q) { var f = [0, 1, 2, 5]; if (q.a[0].length <= 22 && !/\d+\.\d+\.\d+/.test(q.a[0])) f.push(3); var w = q.a[0].split(/\s+/); if (w.length >= 3 && w.length <= 9) f.push(4); return f; }
  function pickFmt(q, avoid) {
    var f = fmtsFor(q), last = P.cli["mf:" + q.id] ? P.cli["mf:" + q.id] % 10 : -1;
    var c = f.filter(function (x) { return x !== last && x !== avoid; });
    var k = c[(mMiss(q.id) + mLvl(q.id) + (P.q[q.id] ? P.q[q.id][0] + P.q[q.id][1] : 0)) % c.length];
    P.cli["mf:" + q.id] = Date.now() * 10 + k; return k;
  }
  function lessonFor(q) { for (var i = 0; i < LES.length; i++) { var l = LES[i]; if (l.c === q.c && l.re && !/-R$/.test(l.id) && l.re.test(l.byE ? q.e : q.q)) return l; } return null; }
  var RV = null;
  /* ---------- 🗓️ Săptămâna: plan 7 zile (pomodoro 25+5) + Recapitulare + Interviu ---------- */
  /* Data de start: P.cli["wk:start"] = secunde*1000 + zi_din_an (de la 1 ian 2026); merge = max → cea mai nouă editare câștigă */
  var WK_B = new Date(2026, 0, 1);
  function wkStart() { var v = P.cli && P.cli["wk:start"]; var d = v ? v % 1000 : 287; if (d === 286) d = 287; return new Date(2026, 0, 1 + d); }
  function wkSetStart(dt) { P.cli = P.cli || {}; var doy = Math.round((new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()) - WK_B) / 864e5); if (doy < 0 || doy > 999) return; P.cli["wk:start"] = Math.floor(Date.now() / 1000) * 1000 + doy; saveP(); }
  var WK_DN = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"], WK_MN = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"];
  /* sarcini: [tip, param, minute, text] ; tip: q=întrebări (param: [capitol, nr]), gx=exercițiu pas cu pas "id:nivel", sc=situație reală, cf=carduri comenzi, rv=greșeli, iv=interviu, sim=simulare, gm=jocuri */
  var WKP = [
    { t: "Bazele, rețele, VLAN/trunk + primii pași Cisco", d: [["q", ["ex", 50], 30], ["gx", "con:1", 8], ["gx", "lad:1", 8], ["gx", "baz:1", 10], ["q", ["baz", 40], 25], ["gx", "vln:1", 10], ["gx", "ssh:1", 12], ["q", ["net", 50], 30], ["gx", "con:2", 8], ["gx", "lad:2", 8], ["gx", "baz:2", 10], ["q", ["trk", 60], 35], ["gx", "vln:2", 10], ["gx", "ssh:2", 12], ["q", ["sub", 20], 15], ["cf", 0, 15], ["iq", 0, 20], ["iv", 0, 15]] },
    { t: "Fibră, cablare, telefonie, PC, Windows, măsurători + router/trunk", d: [["q", ["fo", 40], 25], ["gx", "rtr:1", 10], ["gx", "trk:1", 10], ["q", ["cab", 40], 25], ["gx", "lap:1", 8], ["gx", "sav:1", 6], ["q", ["tel", 30], 20], ["q", ["pc", 40], 25], ["gx", "rtr:2", 10], ["gx", "trk:2", 10], ["q", ["win", 30], 20], ["gx", "ssh:3", 14], ["q", ["mas", 30], 20], ["q", ["el", 30], 20], ["sc", "a", 25], ["rv", 0, 30], ["cf", 0, 15], ["iq", 0, 20], ["iv", 0, 15]] },
    { t: "Proba practică la nivel de examen + prima simulare", d: [["q", ["pp", 60], 35], ["gx", "baz:4", 14], ["gx", "vln:4", 14], ["gx", "ssh:4", 16], ["q", ["cap", 40], 25], ["gx", "rtr:4", 14], ["gx", "trk:4", 14], ["gx", "lap:4", 12], ["gx", "lap:2", 8], ["gx", "sav:2", 6], ["q", ["ex", 20], 12], ["gx", "all:3", 25], ["sc", "b", 30], ["sim", 0, 30], ["rv", 0, 30], ["cf", 0, 15], ["iq", 0, 20], ["iv", 0, 15]] },
    { t: "🌿 Zi mai ușoară: repetare înainte de examen", light: 1, d: [["gx", "all:4", 30], ["sim", 0, 30], ["rv", 0, 40], ["cf", 0, 20], ["gm", 0, 20], ["iv", 0, 20]] },
    { t: "🎖️ Ziua examenului: doar o recapitulare scurtă", light: 1, d: [["cf", 0, 10], ["rv", 0, 15], ["iv", 0, 10]] }
  ];
  var WK_SC = { a: [0, 1, 2], b: [3, 4, 5] };
  var IVQ = [
    ["De ce vrei să lucrezi la STS?", "Spune simplu și sincer: îți plac rețelele și tehnica, vrei un loc stabil unde să fii util, să lucrezi la comunicații care ajută oamenii. Fără fraze învățate pe de rost."],
    ["Spune-ne câteva lucruri despre tine.", "1 minut: ce ai studiat/lucrat, ce știi să faci (programare, PC-uri, rețele), o calitate (serios, învăț repede) și de ce ești aici."],
    ["Cum lucrezi în echipă?", "Dă un exemplu real: ai ajutat un coleg, ați împărțit sarcinile, ai cerut ajutor când nu știai. Ideea: comunici, nu ascunzi greșelile."],
    ["Cum te descurci cu disciplina și ordinele?", "Spune că respecți regulile și programul, execuți sarcina corect și la timp, iar dacă ceva e neclar întrebi ierarhic, politicos."],
    ["Ce faci dacă greșești la o configurare?", "Recunoști imediat, anunți șeful, verifici cu show, refaci pașii. Mai bine spui repede decât să ascunzi."],
    ["Explică simplu ce e un switch.", "Leagă calculatoarele din aceeași clădire (aceeași rețea) și trimite datele doar la cel care trebuie, după adresa MAC. Ca un poștaș din bloc."],
    ["Explică simplu ce e un router.", "Leagă rețele diferite între ele (de exemplu biroul cu internetul) și alege drumul după adresa IP. Ca un poștaș între orașe."],
    ["Ce e un VLAN, pe scurt?", "Împarte un switch în mai multe rețele separate, ca niște camere cu pereți. Cei din VLAN 10 nu-i văd direct pe cei din VLAN 20."],
    ["De ce se folosește fibra optică?", "Duce date pe distanțe mari, foarte repede, prin lumină, și nu e deranjată de curent sau trăsnete."],
    ["Ce faci dacă un PC nu are rețea?", "Ordinea: cablul și LED-ul, apoi ipconfig (are IP?), apoi ping la gateway, apoi ping mai departe. Pas cu pas, de jos în sus."],
    ["Ce e SSH și de ce nu Telnet?", "Amândouă te lasă să configurezi aparatul de la distanță, dar SSH criptează tot. Telnet trimite parola în clar."],
    ["Cum reacționezi sub stres sau când e o urgență?", "Rămâi calm, faci întâi ce e cel mai important, anunți, lucrezi după procedură. Dă un exemplu scurt dacă ai."],
    ["Unde te vezi peste 5 ani?", "În aceeași instituție, cu mai multă experiență, poate cu cursuri Cisco făcute, să poți rezolva singur problemele."],
    ["Ai întrebări pentru noi?", "Da, una scurtă: cum arată o zi obișnuită de lucru sau ce cursuri de pregătire există pentru cei noi."]
  ];
  function wkDayIdx(now) { var s = wkStart(), t = new Date(now.getFullYear(), now.getMonth(), now.getDate()); return Math.round((t - s) / 864e5); }
  function wkRange(i) { var s = wkStart(); var a = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i).getTime(); return [a, a + 864e5]; }
  function wkAnsIn(r) { var n = 0; Object.keys(P.q || {}).forEach(function (id) { var x = P.q[id]; if (x && x[2] >= r[0] && x[2] < r[1]) n++; }); return n; }
  function wkCfIn(r) { var n = 0; Object.keys(P.cli || {}).forEach(function (k) { if (k.indexOf("cf:") === 0) { var t = Math.floor(P.cli[k] / 10); if (t >= r[0] && t < r[1]) n++; } }); return n; }
  function wkCfDue() { var n = 0; try { CFD.forEach(function (_, i) { [0, 1].forEach(function (d) { if (cfDue(i, d)) n++; }); }); } catch (e) {} return n; }
  function wkMarkIn(k, r) { var v = P.cli && P.cli[k]; return v && v >= r[0] && v < r[1]; }
  /* progres per sarcină 0..1 */
  function wkTaskDone(tk, i, qShare) {
    var r = wkRange(i);
    if (tk[0] === "gx") { var p = tk[1].split(":"); return P.cli[gxKey(p[0], +p[1])] ? 1 : 0; }
    if (tk[0] === "sc") { var ids = WK_SC[tk[1]]; return ids.filter(function (j) { return SCN[j] && P.cli["sc:" + SCN[j].id]; }).length / ids.length; }
    if (tk[0] === "q") return qShare;
    if (tk[0] === "cf") return Math.min(1, wkCfIn(r) / 20);
    if (tk[0] === "iq" || tk[0] === "iv" || tk[0] === "rv" || tk[0] === "gm" || tk[0] === "sim") return wkMarkIn("wk:" + i + ":" + tk[0] + ":" + tk.idx, r) ? 1 : 0;
    return 0;
  }
  function wkLabel(tk) {
    if (tk[0] === "q") return "📚 " + tk[1][1] + " întrebări · " + (CATBY[tk[1][0]] ? CATBY[tk[1][0]].short : tk[1][0]);
    if (tk[0] === "gx") { var p = tk[1].split(":"), X = GX.filter(function (x) { return x.id === p[0]; })[0]; return "🧒 " + (X ? X.ic + " " + X.t : p[0]) + " · nivelul " + p[1]; }
    if (tk[0] === "sc") return "🧰 Situații reale " + WK_SC[tk[1]].map(function (j) { return j + 1; }).join(", ");
    if (tk[0] === "cf") return "🃏 Cartonașe comenzi (cele scadente)";
    if (tk[0] === "rv") return "🧠 Exersează greșelile";
    if (tk[0] === "gm") return "🎮 Jocuri de memorie";
    if (tk[0] === "sim") return "📝 Simulare examen (18 întrebări)";
    if (tk[0] === "iv") return "🎤 Interviu STS – 2 întrebări";
    if (tk[0] === "iq") return "🧠 Teste IQ: cuburi, șiruri, sinonime/antonime (20)";
    return "";
  }
  function wkDay(i) {
    var D = WKP[i]; if (!D) return null;
    var qT = 0; D.d.forEach(function (tk) { if (tk[0] === "q") qT += tk[1][1]; });
    var qa = wkAnsIn(wkRange(i)), qShare = qT ? Math.min(1, qa / qT) : 0;
    var tasks = [], qoff = 0; D.d.forEach(function (tk, j) {
      if (tk[0] === "q") { var parts = Math.max(1, Math.round(tk[2] / 25)), pn = Math.round(tk[1][1] / parts); for (var k = 0; k < parts; k++) { var nq = k === parts - 1 ? tk[1][1] - pn * (parts - 1) : pn, t = ["q", [tk[1][0], nq], Math.round(tk[2] / parts)]; t.idx = j; t.p = Math.max(0, Math.min(1, (qa - qoff) / nq)); qoff += nq; tasks.push(t); } return; }
      var t2 = tk.slice(); t2.idx = j; t2.p = wkTaskDone(t2, i, qShare); tasks.push(t2); });
    var tot = 0, done = 0; tasks.forEach(function (t) { tot += t[2]; done += t[2] * t.p; });
    return { D: D, tasks: tasks, tot: tot, left: Math.round(tot - done), pct: Math.round(100 * done / tot), qT: qT, qa: Math.min(qa, qT) };
  }
  function wkSessions(tasks) { /* grupează în sesiuni de ~25–30 min */ var S = [], cur = [], m = 0; tasks.forEach(function (t) { if (m && m + t[2] > 30) { S.push({ t: cur, m: m }); cur = []; m = 0; } cur.push(t); m += t[2]; while (m > 30 && cur.length === 1 && t[0] === "q") break; }); if (cur.length) S.push({ t: cur, m: m }); return S; }
  function wkFmt(m) { m = Math.round(m); return m >= 60 ? Math.floor(m / 60) + " h " + (m % 60 ? (m % 60) + " min" : "") : m + " min"; }
  var WKSEL = null, WKT = null;
  function vWeek(sel) {
    view = "week"; navbar(true); P.cli = P.cli || {}; P.q = P.q || {}; P.mist = P.mist || {}; if (WKT) { clearInterval(WKT); WKT = null; }
    var now = new Date(), ti = wkDayIdx(now); if (sel != null) WKSEL = sel; if (WKSEL == null) WKSEL = Math.max(0, Math.min(WKP.length - 1, ti));
    var s = wkStart(), h = '<section class="card"><h2>🗓️ Săptămâna de învățat</h2><p class="small">Planul până la examen (luni 19 oct). Câte 5–6 ore pe zi, în bucăți de 25–30 de minute cu 5 minute pauză. După sesiunea a 5-a: pauză mare de masă (45 min). Duminică e mai ușor, iar luni doar o recapitulare scurtă.</p>' +
      '<label class="small">Prima zi: <input type="date" id="wkD" value="' + dayKey(s) + '" style="font-size:16px;min-height:44px"></label></section>';
    h += '<div class="wkdays" style="grid-template-columns:repeat(' + WKP.length + ',minmax(0,1fr))">';
    var allT = 0, allL = 0;
    for (var i = 0; i < WKP.length; i++) { var x = wkDay(i), dt = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i); allT += x.tot; allL += x.left;
      h += '<button class="wkd' + (i === WKSEL ? " sel" : "") + (i === ti ? " today" : "") + (i < ti && x.pct < 100 ? " late" : "") + '" data-wd="' + i + '"><b>' + WK_DN[dt.getDay()].slice(0, 3) + (i === WKP.length - 1 ? " 🎖️" : "") + '</b><small>' + dt.getDate() + " " + WK_MN[dt.getMonth()] + '</small><i style="--p:' + x.pct + '%"></i><small>' + (x.pct >= 100 ? "✓" : x.pct + "%") + "</small></button>"; }
    h += "</div>";
    h += '<p class="small muted" style="text-align:center">Tot planul: ' + Math.round(100 * (allT - allL) / allT) + "% · mai ai " + wkFmt(allL) + " de lucru</p>";
    var d = wkDay(WKSEL), dt0 = new Date(s.getFullYear(), s.getMonth(), s.getDate() + WKSEL);
    var carry = []; if (WKSEL === ti) for (var k = 0; k < ti && k < WKP.length; k++) wkDay(k).tasks.forEach(function (t) { if ((t[0] === "gx" || t[0] === "sc") && t.p < 1) { t.from = k; carry.push(t); } });
    var ses = wkSessions(d.tasks), pauses = Math.max(0, ses.length - 1) * 5 + (ses.length > 5 ? 40 : 0);
    h += '<section class="card wkcard' + (WKSEL === ti ? " today" : "") + '"><h3>' + WK_DN[dt0.getDay()] + ", " + dt0.getDate() + " " + WK_MN[dt0.getMonth()] + (WKSEL === ti ? " · AZI" : "") + "</h3><p><b>" + esc(d.D.t) + "</b></p>" + (WKSEL === ti && d.left > 0 ? (function () { var m = Math.round(d.left * 1.2), e = new Date(now.getTime() + m * 60000), hh = function (x) { return ("0" + x.getHours()).slice(-2) + ":" + ("0" + x.getMinutes()).slice(-2); }; return '<p class="small">⏱️ Ți-au rămas ~' + (Math.round(m / 6) / 10).toString().replace(".", ",") + " h cu pauze. Dacă începi acum (" + hh(now) + "), termini pe la <b>" + hh(e) + "</b>." + (e.getHours() >= 22 || e.getDate() !== now.getDate() ? " E târziu: fă întâi practica (exercițiile Cisco), iar întrebările „ex” rămase trec automat pe mâine." : "") + "</p>"; })() : "") +
      '<div class="bar"><i style="width:' + d.pct + '%"></i></div><p class="small">Gata: <b>' + d.pct + "%</b> · Mai ai <b>" + wkFmt(d.left) + "</b> de lucru" + (d.qT ? " · întrebări: <b>" + d.qa + " / " + d.qT + "</b> (mai ai " + (d.qT - d.qa) + ")" : "") + "<br>Total zi: " + wkFmt(d.tot) + " lucru + " + wkFmt(pauses) + " pauze = <b>" + wkFmt(d.tot + pauses) + "</b></p>" +
      (function () { if (WKSEL !== ti) return ""; var SS = wkSessions(d.tasks); for (var k = 0; k < SS.length; k++) for (var m = 0; m < SS[k].t.length; m++) if (SS[k].t[m].p < 1) return '<button class="big gogreen" data-wk="' + WKSEL + "|" + SS[k].t[m].idx + '">▶️ Continuă: Sesiunea ' + (k + 1) + "</button>"; return ""; })() + '<button class="ghost" id="wkPause">☕ Pauză 5 min</button><div id="wkPT" class="small"></div></section>';
    if (carry.length) { h += '<section class="card"><h3>↪ Rămase din zilele trecute</h3>' + carry.map(function (t) { return wkTaskBtn(t, t.from); }).join("") + "</section>"; }
    ses.forEach(function (S, j) {
      h += '<section class="card"><h3>Sesiunea ' + (j + 1) + " · ~" + S.m + " min</h3>" + S.t.map(function (t) { return wkTaskBtn(t, WKSEL); }).join("") + "</section>";
      if (j < ses.length - 1) h += '<p class="small muted wkp">' + (j === 4 ? "🍽️ Pauză mare 45 min – mănâncă, ieși afară" : "☕ Pauză 5 min – ridică-te, bea apă, nu te uita pe telefon") + "</p>";
    });
    h += '<section class="card"><h2>🔁 Recapitulare – din ce ai lucrat tu</h2>' + wkRecap() + "</section>";
    h += '<section class="card"><button class="ghost" id="wkTalk">📞 Discuția cu STS ›</button></section>';
    h += '<section class="card"><h2>🎤 Interviu STS – exersează cu voce tare</h2><p class="small muted">Sfaturi generale, nu întrebări oficiale. Răspunde scurt, sincer, cu exemple din viața ta.</p>' + [0, 1].map(function (z) { var q = IVQ[((WKSEL * 2 + z)) % IVQ.length]; return '<details class="wkiv"><summary><b>' + esc(q[0]) + "</b></summary><p>💡 " + esc(q[1]) + "</p></details>"; }).join("") + '<button class="ghost" id="wkIvAll">Vezi toate cele ' + IVQ.length + " întrebări</button><div id=\"wkIvL\"></div></section>";
    app.innerHTML = h;
    Array.prototype.forEach.call(app.querySelectorAll("[data-wd]"), function (b) { b.onclick = function () { SND.tap(); vWeek(+b.getAttribute("data-wd")); }; });
    $("wkD").onchange = function () { var v = $("wkD").value.split("-"); if (v.length === 3) { wkSetStart(new Date(+v[0], +v[1] - 1, +v[2])); WKSEL = null; vWeek(); } };
    $("wkPause").onclick = function () { var end = Date.now() + 300000; if (WKT) clearInterval(WKT); WKT = setInterval(function () { var el = $("wkPT"); if (!el) { clearInterval(WKT); WKT = null; return; } var r = Math.max(0, end - Date.now()); el.innerHTML = r ? "☕ Pauză: <b>" + Math.floor(r / 60000) + ":" + ("0" + Math.floor(r % 60000 / 1000)).slice(-2) + "</b>" : "⏰ <b>Gata pauza – înapoi la treabă!</b>"; if (!r) { clearInterval(WKT); WKT = null; try { SND.ok(); } catch (e) {} } }, 500); };
    $("wkIvAll").onclick = function () { $("wkIvL").innerHTML = IVQ.map(function (q) { return '<details class="wkiv"><summary><b>' + esc(q[0]) + "</b></summary><p>💡 " + esc(q[1]) + "</p></details>"; }).join(""); };
    Array.prototype.forEach.call(app.querySelectorAll("[data-wk]"), function (b) { b.onclick = function () { SND.tap(); wkRun(b.getAttribute("data-wk")); }; });
    if ($("wkTalk")) $("wkTalk").onclick = function () { go("talk"); };
    if ($("wkDrill")) $("wkDrill").onclick = function () { go("rev"); };
  }
  function wkTaskBtn(t, i) { return '<button class="wkt' + (t.p >= 1 ? " ok" : "") + '" data-wk="' + i + "|" + t.idx + '"><span>' + (t.p >= 1 ? "✅ " : t.p > 0 ? "◐ " : "") + esc(wkLabel(t)) + (t.from != null ? " <small>(din " + WK_DN[new Date(wkRange(t.from)[0]).getDay()] + ")</small>" : "") + "</span><small>" + t[2] + " min</small></button>"; }
  function wkRun(a) {
    var p = a.split("|"), i = +p[0], tk = WKP[i].d[+p[1]];
    var mark = function () { if (wkRange(i)[0] <= Date.now()) { P.cli["wk:" + i + ":" + tk[0] + ":" + p[1]] = Date.now(); saveP(); } };
    if (tk[0] === "q") return go("path", tk[1][0]);
    if (tk[0] === "gx") { GXS = null; return go("ghid", tk[1]); }
    if (tk[0] === "sc") return go("scen");
    if (tk[0] === "cf") return go("cmdcards");
    if (tk[0] === "rv") { mark(); return go("rev"); }
    if (tk[0] === "gm") { mark(); return go("games"); }
    if (tk[0] === "sim") { mark(); return go("sim"); }
    if (tk[0] === "iq") { mark(); return runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return q.c === "iq"; }), 20), hearts: 0, requeue: false, xpEach: 5, title: "Teste de inteligență și vocabular" }); }
    if (tk[0] === "iv") { mark(); var el = app.querySelector(".wkiv"); if (el) { el.open = true; el.scrollIntoView({ behavior: "smooth" }); } vWeek(); setTimeout(function () { var e2 = app.querySelector(".wkiv"); if (e2) { e2.open = true; e2.scrollIntoView(); } }, 50); }
  }
  function wkRecap() {
    var ids = Object.keys(P.cli || {}).filter(function (k) { return k.indexOf("mx:") === 0 && BYID[k.slice(3)]; }).map(function (k) { return k.slice(3); });
    Object.keys(P.mist || {}).forEach(function (id) { if (BYID[id] && ids.indexOf(id) < 0) ids.push(id); });
    if (!ids.length) return '<p>Încă nu ai greșeli salvate' + (AUTH && AUTH.user ? "" : " (intră în cont ca să vezi progresul sincronizat)") + ". Fă lecții și aici apar lucrurile importante de repetat.</p>";
    var sc = function (id) { return mMiss(id) * 10 + ((P.mist[id] && P.mist[id][1]) || 0) * 5 + (5 - mLvl(id)); };
    ids.sort(function (a, b) { return sc(b) - sc(a); });
    var byC = {}; ids.forEach(function (id) { var c = BYID[id].c; byC[c] = (byC[c] || 0) + 1; });
    var tops = Object.keys(byC).sort(function (a, b) { return byC[b] - byC[a]; }).slice(0, 5);
    var h = '<p class="small">Ai <b>' + ids.length + "</b> întrebări greșite cel puțin o dată. Temele cu cele mai multe:</p><p>" + tops.map(function (c) { return '<span class="chip">' + (CATBY[c] ? CATBY[c].ic + " " + esc(CATBY[c].short) : c) + " · " + byC[c] + "</span>"; }).join(" ") + "</p>";
    h += '<button class="big" id="wkDrill">🧠 Exersează-le acum (' + weakIds().length + ")</button>";
    h += ids.slice(0, 10).map(function (id) { var q = BYID[id], mem = ""; try { if (q.s && q.c === "iq") mem = ""; else if (q.s) mem = '<div class="small">❗ ' + esc(q.s) + "</div>"; else if (typeof HACK_FIND === "function") mem = HACK_HTML(HACK_FIND(q.q + " " + q.a[0] + " " + q.e, null, q).filter(function (x) { return x.k === "mem"; })); } catch (e) {} return '<details class="card rev"><summary class="qq">' + esc(q.q) + (mMiss(id) ? ' <small class="muted">(greșită de ' + mMiss(id) + "×)</small>" : "") + '</summary><div class="a ok">✅ ' + esc(q.a[0]) + '</div><div class="e">💡 ' + esc(q.e) + "</div>" + mem + "</details>"; }).join("");
    var cmds = []; try { CFD.forEach(function (c, i) { var b = Math.max(cfBox(i, 0), cfBox(i, 1)); if (P.cli[cfKey(i, 0)] || P.cli[cfKey(i, 1)]) cmds.push([c, b]); }); } catch (e) {}
    if (cmds.length) { cmds.sort(function (a, b) { return a[1] - b[1]; }); h += "<h3>⌨️ Comenzile pe care le-ai exersat (cele mai slabe întâi)</h3>" + cmds.slice(0, 12).map(function (x) { return '<div class="small"><code>' + esc(x[0][0]) + "</code> – " + esc(x[0][1]) + " " + "●●●●●".slice(0, x[1]) + '<span class="muted">' + "●●●●●".slice(x[1]) + "</span></div>"; }).join(""); }
    return h;
  }
  /* ---------- 📞 Discuția cu STS (sfaturi generale) ---------- */
  function vTalk() {
    view = "talk"; navbar(true);
    var h = '<section class="card"><button class="back" id="backBtn">‹ Înapoi</button><h2>📞 Discuția cu STS</h2>' +
      '<div class="fact"><b>ℹ️ Sfaturi generale, nu informații oficiale STS.</b></div>' +
      '<p>Decizia a fost luată și o respecți. Discuția poate rămâne bună: arăți calm, politețe și că știi meserie. Asta contează pentru un loc sau un concurs viitor.</p>' +
      '<p class="small">ℹ️ E normal ca ei să nu-ți dea detalii despre concurs (conținut, dată) – multe sunt nesigure sau confidențiale. Nu insista.</p></section>';
    h += '<section class="card"><h3>🛠️ Întrebări despre echipamente (arăți că știi meserie)</h3><p class="small muted">💡 Pune doar 2–3, apoi ascultă atent răspunsul.</p><ol class="small talkq">' +
      '<li>„Ce switch-uri folosiți în teritoriu – Cisco 2960 sau modele mai noi? Configurați de obicei prin consolă sau prin SSH?”</li>' +
      '<li>„La sedii separați rețelele pe VLAN-uri – de exemplu date, voce și camere?”</li>' +
      '<li>„Legăturile dintre sedii sunt pe fibră optică sau pe radioreleu? Dacă e fibră, e single-mode, cu conectori APC sau UPC?”</li>' +
      '<li>„Pe partea radio lucrați cu TETRA sau și VHF/UHF? Măsurați nivelul semnalului în dBm?”</li>' +
      '<li>„Tabletele și cartelele SIM le gestionați centralizat sau se configurează una câte una?”</li>' +
      '<li>„Care sunt problemele cele mai frecvente la sedii?”</li></ol>' +
      '<p class="small">Dacă vine vorba: „M-am pregătit exact pe asta – rețele, Cisco, fibră și măsurători. Pot începe imediat.”</p></section>';
    h += '<section class="card"><h3>✅ Așa da</h3><ul class="small"><li>Vorbește calm și rar. Salută și mulțumește.</li><li>Notează numele persoanei, data și ce ți-a spus.</li><li>Acceptă decizia fără reproșuri.</li></ul>' +
      '<h3>❌ Așa nu</h3><ul class="small"><li>Nu te compara cu alți candidați.</li><li>Nu te certa și nu insista.</li><li>Nu cere detalii despre concurs.</li></ul></section>';
    h += '<section class="card"><h3>👋 Încheierea</h3><p>„Înțeleg decizia. Dacă apare un loc sau un concurs nou, vă rog să vă gândiți la mine. Mă pregătesc în continuare.”</p><p class="small muted">Apoi: „Vă mulțumesc pentru timp. O zi bună!”</p></section>';
    app.innerHTML = h;
    $("backBtn").onclick = function () { go(AUTH ? "acct" : "week"); };
  }
  function vRev() {
    view = "mist"; navbar(true); P.cli = P.cli || {};
    var ids = weakIds();
    if (!ids.length) { app.innerHTML = '<section class="card"><button class="back" id="backBtn">‹ Înapoi</button><h2>🧠 Exersează greșelile</h2><p>Nu ai nimic de repetat acum. 🎉 Fă o lecție sau un joc, iar ce greșești va reveni aici în alt format.</p></section>'; $("backBtn").onclick = function () { go("mist"); }; return; }
    RV = { q: ids.slice(0, 12).map(function (id) { return { q: BYID[id], tries: 0 }; }), i: 0, ok: 0, bad: 0, mini: {}, done: [] };
    app.innerHTML = '<section class="card"><button class="back" id="backBtn">‹ Înapoi</button><h2>🧠 Exersează greșelile</h2><p>' + RV.q.length + ' întrebări pe care le-ai greșit sau nu le stăpânești încă. Fiecare revine <b>în alt format</b> decât data trecută: grilă, adevărat/fals, perechi, scris, ordonare, fișă. O greșeală o trimite din nou la finalul sesiunii. După 2 greșeli primești o mini-lecție.</p><button class="big" id="rvGo">Începe</button></section>';
    $("backBtn").onclick = function () { go("mist"); }; $("rvGo").onclick = rvNext;
  }
  function rvShell(inner, it) { var tot = RV.q.length; app.innerHTML = '<section class="card rvcard"><div class="rvtop"><button class="back" id="rvX">✕ Ieși</button><span class="muted small">' + Math.min(RV.i + 1, tot) + " / " + tot + "</span>" + (it ? mDots(it.q.id) : "") + '</div><div class="pbar"><i style="width:' + Math.round(100 * RV.i / tot) + '%"></i></div>' + inner + "</section>"; $("rvX").onclick = function () { saveP(); go("mist"); }; }
  function rvNext() {
    if (RV.i >= RV.q.length) return rvEnd();
    var it = RV.q[RV.i], q = it.q;
    if (mMiss(q.id) >= 2 && !RV.mini[q.id]) { RV.mini[q.id] = 1; return rvMini(it); }
    var f = q.s ? 0 : pickFmt(q, it.lastF); it.lastF = f;
    var head = '<div class="tag rvfmt">' + FMT[f] + '</div><div class="qmeta">' + CATBY[q.c].ic + " " + esc(CATBY[q.c].short) + "</div>";
    [rvMcq, rvTf, rvPair, rvType, rvOrder, rvFlash][f](it, head);
  }
  function rvMini(it) {
    var q = it.q, l = lessonFor(q), hk = typeof HACK_FIND === "function" ? HACK_HTML(HACK_FIND(q.q + " " + q.a[0] + " " + q.e, null, q)) : "";
    rvShell('<h3>📘 Mini-lecție – ai greșit asta de ' + mMiss(q.id) + ' ori</h3><div class="qq">' + esc(q.q) + '</div>' + qSvg(q) + '<div class="fact tok"><b>✅ Răspuns:</b> ' + esc(q.a[0]) + '</div><div class="fact"><b>De ce:</b> ' + esc(q.e) + "</div>" + hk + (l ? '<button class="ghost" id="rvL">Deschide lecția: ' + esc(l.t) + "</button>" : "") + '<button class="big" id="rvC">Am înțeles – încerc acum</button>', it);
    $("rvC").onclick = rvNext; if (l) $("rvL").onclick = function () { saveP(); startLesson(l); };
  }
  function rvGrade(it, ok, html) {
    var q = it.q; record(q, ok);
    if (ok) { RV.ok++; addXP(5); if (it.lastF !== 1 && it.lastF !== 5) clearMistake(q.id); SND.ok(); } else { RV.bad++; it.tries++; if (it.tries <= 2) RV.q.push({ q: q, tries: it.tries, lastF: it.lastF }); SND.bad(); }
    saveP();
    var hk = !ok && typeof HACK_FIND === "function" ? HACK_HTML(HACK_FIND(q.q + " " + q.a[0] + " " + q.e, null, q)) : "";
    var out = $("rvOut"); out.innerHTML = '<div class="' + (ok ? "fact tok" : "eli trapw") + '">' + (ok ? "✅ Corect! Stăpânire " + mLvl(q.id) + "/5" : "❌ Răspuns corect: <b>" + esc(q.a[0]) + "</b>" + (it.tries <= 2 ? " · revine la final, în alt format" : "")) + '<div class="small muted">' + esc(q.e) + "</div></div>" + hk + (html || "") + '<button class="big" id="rvN">Continuă ›</button>';
    $("rvN").onclick = function () { RV.i++; rvNext(); }; $("rvN").scrollIntoView({ block: "nearest" });
  }
  function rvMcq(it, head) {
    var q = it.q, ord = letOpts(q) ? [0, 1, 2, 3].sort(function (x, y) { return q.a[x] < q.a[y] ? -1 : 1; }) : shuffle(q.a.map(function (_, i) { return i; }));
    rvShell(head + '<h3 class="rvq">' + esc(q.q) + '</h3>' + qSvg(q) + '<div class="opts">' + ord.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(q.a[k]) + "</button>"; }).join("") + '</div><div id="rvOut"></div>', it);
    Array.prototype.forEach.call(app.querySelectorAll(".opt"), function (b) { b.onclick = function () { var ok = b.getAttribute("data-k") === "0"; Array.prototype.forEach.call(app.querySelectorAll(".opt"), function (o) { o.disabled = true; if (o.getAttribute("data-k") === "0") o.classList.add("good"); else if (o === b) o.classList.add("bad"); }); rvGrade(it, ok); }; });
  }
  function rvTf(it, head) {
    var q = it.q, truth = Math.random() < 0.5, cand = truth ? q.a[0] : q.a[1 + Math.floor(Math.random() * (q.a.length - 1))];
    rvShell(head + '<h3 class="rvq">' + esc(q.q) + '</h3><div class="swf tfstat"><small class="muted">Răspunsul de mai jos este corect?</small><p>' + esc(cand) + '</p></div><div class="row2"><button class="ghost swbtn bad" id="rvF">✗ Fals</button><button class="ghost swbtn good" id="rvA">✓ Adevărat</button></div><div id="rvOut"></div>', it);
    function ans(v) { $("rvF").disabled = $("rvA").disabled = true; rvGrade(it, v === truth); }
    $("rvF").onclick = function () { ans(false); }; $("rvA").onclick = function () { ans(true); };
  }
  function rvPair(it, head) {
    var q = it.q, others = shuffle(QS.filter(function (x) { return !x.s && x.id !== q.id && x.c === q.c && x.a[0].length < 60 && x.q.length < 140; })).slice(0, 3), set = shuffle([q].concat(others)), ans = shuffle(set.slice()), sel = null, got = {}, wrongCur = false;
    rvShell(head + '<p class="small muted">Atinge o întrebare, apoi răspunsul ei. Contează perechea întrebării tale (cea cu ★).</p><div class="pairs2"><div>' + set.map(function (x, i) { return '<button class="pq" data-i="' + i + '">' + (x === q ? "★ " : "") + esc(x.q) + "</button>"; }).join("") + "</div><div>" + ans.map(function (x, i) { return '<button class="pa" data-j="' + i + '">' + esc(x.a[0]) + "</button>"; }).join("") + '</div></div><div id="rvOut"></div>', it);
    Array.prototype.forEach.call(app.querySelectorAll(".pq"), function (b) { b.onclick = function () { if (got[b.getAttribute("data-i")]) return; Array.prototype.forEach.call(app.querySelectorAll(".pq"), function (x) { x.classList.remove("sel"); }); b.classList.add("sel"); sel = +b.getAttribute("data-i"); }; });
    Array.prototype.forEach.call(app.querySelectorAll(".pa"), function (b) { b.onclick = function () {
      if (sel === null || b.disabled) return; var j = +b.getAttribute("data-j"), ok = ans[j] === set[sel], qb = app.querySelector('.pq[data-i="' + sel + '"]');
      if (ok) { got[sel] = 1; qb.classList.add("good"); qb.classList.remove("sel"); b.classList.add("good"); b.disabled = true; SND.tap(); } else { b.classList.add("bad"); setTimeout(function () { b.classList.remove("bad"); }, 500); if (set[sel] === q) wrongCur = true; }
      sel = null; if (Object.keys(got).length === set.length) rvGrade(it, !wrongCur);
    }; });
  }
  function rvType(it, head) {
    var q = it.q, a = q.a[0];
    rvShell(head + '<h3 class="rvq">' + esc(q.q) + '</h3><p class="small muted">Scrie răspunsul (fără grija diacriticelor). Indiciu: începe cu „' + esc(a.charAt(0)) + "”, " + a.length + ' caractere.</p><form id="rvForm" class="tin" autocomplete="off"><input id="rvIn" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="Răspunsul tău"></form><button class="big" id="rvChk">Verifică</button><div id="rvOut"></div>', it);
    var done = false; function chk() { if (done) return; done = true; var raw = cliNorm($("rvIn").value), v = norm(raw).replace(/\s+/g, ""), t = norm(a).replace(/\s+/g, ""), sgn = function (x) { return /\d/.test(x) ? (/(^|\s)-\s*\d/.test(x) ? "-" : "") : ""; }, ok = (v === t || (t.length > 6 && lev(v, t) <= (t.length > 12 ? 2 : 1))) && sgn(raw) === sgn(cliNorm(a)); $("rvIn").disabled = true; $("rvChk").remove(); rvGrade(it, ok); }
    $("rvForm").onsubmit = function (e) { e.preventDefault(); chk(); }; $("rvChk").onclick = chk; $("rvIn").focus();
  }
  function rvOrder(it, head) {
    var q = it.q, w = q.a[0].split(/\s+/), pool = shuffle(w.map(function (x, i) { return i; })), got = [];
    if (pool.every(function (x, i) { return x === i; })) pool.reverse();
    function paint() {
      rvShell(head + '<h3 class="rvq">' + esc(q.q) + '</h3><p class="small muted">Atinge cuvintele în ordine ca să formezi răspunsul corect.</p><div class="wline">' + got.map(function (i, k) { return '<button class="wchip on" data-r="' + k + '">' + esc(w[i]) + "</button>"; }).join("") + '</div><div class="wpool">' + pool.filter(function (i) { return got.indexOf(i) < 0; }).map(function (i) { return '<button class="wchip" data-a="' + i + '">' + esc(w[i]) + "</button>"; }).join("") + '</div><div id="rvOut"></div>', it);
      Array.prototype.forEach.call(app.querySelectorAll("[data-a]"), function (b) { b.onclick = function () { got.push(+b.getAttribute("data-a")); SND.tap(); if (got.length === w.length) { paint(); Array.prototype.forEach.call(app.querySelectorAll(".wchip"), function (x) { x.disabled = true; }); rvGrade(it, got.map(function (i) { return w[i]; }).join(" ") === w.join(" ")); } else paint(); }; });
      Array.prototype.forEach.call(app.querySelectorAll("[data-r]"), function (b) { b.onclick = function () { got.splice(+b.getAttribute("data-r"), 1); paint(); }; });
    }
    paint();
  }
  function rvFlash(it, head) {
    var q = it.q;
    rvShell(head + '<div class="fcard2" id="rvFc"><div class="fcin"><div class="fcf"><small class="muted">Gândește-te la răspuns, apoi întoarce fișa</small><p>' + esc(q.q) + '</p></div><div class="fcb"><b>' + esc(q.a[0]) + '</b><p class="small muted">' + esc(q.e) + '</p></div></div></div><button class="big" id="rvFlip">Întoarce fișa</button><div class="row2 hidden" id="rvSelf"><button class="ghost swbtn bad" id="rvNo">Nu știam</button><button class="ghost swbtn good" id="rvYes">Știam</button></div><div id="rvOut"></div>', it);
    $("rvFlip").onclick = function () { $("rvFc").classList.add("flip"); this.remove(); $("rvSelf").classList.remove("hidden"); };
    $("rvYes").onclick = function () { $("rvSelf").remove(); rvGrade(it, true); }; $("rvNo").onclick = function () { $("rvSelf").remove(); rvGrade(it, false); };
  }
  function rvEnd() {
    saveP(); P.cli["g:rev"] = Date.now(); saveP();
    var seen = {}, list = RV.q.filter(function (x) { if (seen[x.q.id]) return false; seen[x.q.id] = 1; return true; });
    app.innerHTML = '<section class="card"><h2>🧠 Sesiune terminată</h2><div class="gend"><b>' + RV.ok + "/" + (RV.ok + RV.bad) + '</b><span>răspunsuri corecte</span></div>' + list.map(function (x) { return '<div class="crow2"><div><small>' + esc(x.q.q.slice(0, 90)) + "</small></div>" + mDots(x.q.id) + "</div>"; }).join("") + '<p class="muted small">Rămase de repetat: ' + activeMistakes().length + '</p><button class="big" id="rvAg">Încă o sesiune</button><button class="ghost" id="rvBk">Înapoi la greșeli</button></section>';
    $("rvAg").onclick = vRev; $("rvBk").onclick = function () { go("mist"); };
  }
  function EXTRA_PIN() { var nw = weakIds().length; return (nw ? '<button class="big sec" id="goRv">🧠 Exersează greșelile (' + nw + ')</button>' : "") + '<button class="ghost" id="goSim">📝 Simulare examen: 18 întrebări, nota 1–10 (Subiectul 1/2/3)</button><button class="ghost" id="goPrac">🔌 Simulare probă practică: pas cu pas, nota 1–10 (3 variante)</button><button class="ghost" id="goGames">🎮 Jocuri de memorie: swipe Adevărat/Fals, fulger, perechi, ordine, poze, comenzi</button><button class="ghost" id="goMem">🧠 Trucuri de memorie, capcane și jocuri cu acronime</button><button class="ghost" id="goIq">🧠 Teste de inteligență și vocabular: 20 de întrebări (cuburi, șiruri, sinonime)</button>'; }
  function wirePin() { if ($("goRv")) $("goRv").onclick = function () { go("rev"); }; $("goSim").onclick = function () { go("sim"); }; $("goPrac").onclick = function () { go("prac"); }; $("goGames").onclick = function () { go("games"); }; $("goMem").onclick = function () { go("mem"); }; $("goIq").onclick = function () { runQuiz({ mode: "practice", items: pickQuestions(QS.filter(function (q) { return q.c === "iq"; }), 20), hearts: 0, requeue: false, xpEach: 5, title: "Teste de inteligență și vocabular" }); }; }
  /* ---------------- Antrenor binar / hexazecimal ---------------- */
  var BINS = [0, 0];
  function vBin() {
    view = "practice"; navbar(true);
    var n = Math.floor(Math.random() * 256), from = ["dec", "bin", "hex"][Math.floor(Math.random() * 3)];
    var V = { dec: String(n), bin: ("0000000" + n.toString(2)).slice(-8), hex: n.toString(16).toUpperCase() };
    var N = { dec: "Zecimal", bin: "Binar (8 biți)", hex: "Hexazecimal" };
    var F = ["dec", "bin", "hex"].filter(function (k) { return k !== from; });
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICON.bin + ' Antrenor binar / hexazecimal</h2><p class="muted">Un octet (0–255): convertește în celelalte două baze. Valorile pozițiilor: 128 64 32 16 8 4 2 1.</p>' +
      '<div class="probl">' + N[from] + ': <b id="binProb">' + V[from] + '</b></div><div class="tform">' +
      F.map(function (k) { return '<label><span>' + N[k] + '</span><input id="b_' + k + '" inputmode="' + (k === "hex" ? "text" : "numeric") + '" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="' + (k === "bin" ? "ex. 11000000" : k === "hex" ? "ex. C0" : "ex. 192") + '"><em id="br_' + k + '"></em></label>'; }).join("") +
      '</div><button class="big" id="bChk">Verifică</button><button class="ghost" id="bNew">Alt număr ↻</button><div id="bExpl"></div><p class="muted small">Scor în această sesiune: ' + BINS[0] + " corecte · " + BINS[1] + " greșite</p></section>";
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("practice"); };
    $("bNew").onclick = function () { vBin(); toTop(); };
    $("bChk").onclick = function () {
      var all = true, any = false;
      F.forEach(function (k) {
        var v = $("b_" + k).value.trim().replace(/\s/g, "").toUpperCase().replace(/^0X/, ""), ok;
        if (v) any = true;
        ok = k === "bin" ? (/^[01]{1,8}$/.test(v) && parseInt(v, 2) === n) : k === "hex" ? (/^[0-9A-F]{1,2}$/.test(v) && parseInt(v, 16) === n) : v === V.dec;
        if (!ok) all = false;
        var r = $("br_" + k); r.className = ok ? "ok" : "bad"; r.textContent = ok ? "✓ corect" : "✗ corect: " + V[k];
        $("b_" + k).classList.toggle("okf", ok); $("b_" + k).classList.toggle("badf", !ok);
      });
      if (!any) return toast("Completează cel puțin un câmp.");
      if (this.disabled) return; this.disabled = true;
      BINS[all ? 0 : 1]++; if (all) { addXP(5); saveP(); SND.ok(); } else SND.bad();
      var pos = [128, 64, 32, 16, 8, 4, 2, 1], parts = [];
      pos.forEach(function (p, i) { if (V.bin[i] === "1") parts.push(p); });
      var hi = n >> 4, lo = n & 15;
      $("bExpl").innerHTML = '<div class="fact"><b>' + (all ? "Totul corect! +5 XP" : "Rezolvare pas cu pas") + "</b><br>" +
        "Binar " + V.bin + " = " + (parts.length ? parts.join(" + ") : "0") + " = " + n + "<br>" +
        "Hexa: împarți octetul în două grupe de 4 biți: " + V.bin.slice(0, 4) + " = " + hi + " → " + hi.toString(16).toUpperCase() + ", " + V.bin.slice(4) + " = " + lo + " → " + lo.toString(16).toUpperCase() + " ⇒ " + V.hex + " (" + hi + " × 16 + " + lo + " = " + n + ")</div>";
    };
  }

  /* ---------------- Marcate ---------------- */
  function vMarks() {
    view = "practice"; navbar(true);
    var ids = markedIds().sort(function (a, b) { return P.bm[b][0] - P.bm[a][0]; });
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>⭐ Întrebări marcate <span class="badge gold">' + ids.length + "</span></h2>" + (ids.length ? '<button class="big" id="goM2">Repetă marcatele</button>' : '<p class="muted">Nicio întrebare marcată.</p>') + "</section>";
    ids.forEach(function (id) { var q = BYID[id]; h += '<div class="card rev"><div class="qmeta">' + CATBY[q.c].ic + " " + esc(CATBY[q.c].short) + markBtn(id) + '</div><div class="qq">' + esc(q.q) + '</div><div class="a ok">✅ ' + esc(q.a[0]) + '</div><div class="e">💡 ' + esc(q.e) + "</div></div>"; });
    app.innerHTML = h; wireMarks();
    $("backBtn").onclick = function () { go("practice"); };
    if ($("goM2")) $("goM2").onclick = function () { runQuiz({ mode: "practice", items: shuffle(ids).slice(0, 30).map(function (id) { return BYID[id]; }), hearts: 0, requeue: false, xpEach: 5, title: "Marcate" }); };
  }


  /* ---------------- Fișe rapide (flashcards), Glosar, Foaie de bază ---------------- */
  var FC_DAYS = [0, 1, 2, 4, 7, 15, 30];
  var DECKS = CATS.map(function (c) { return { id: c.id, ic: c.ic, name: c.short }; }).concat([{ id: "gen", ic: "🔤", name: "Acronime generale" }]);
  function fcKey(c, e) { return c + "|" + e[0]; }
  function fcState(c, e) { return P.fc[fcKey(c, e)] || null; }
  function deckInfo(c) {
    var arr = TERMS[c] || [], now = Date.now(), known = 0, due = 0, neu = 0;
    arr.forEach(function (e) { var st = fcState(c, e); if (!st) neu++; else { if (st[0] >= 2) known++; if (st[1] <= now) due++; } });
    return { n: arr.length, known: known, due: due, neu: neu };
  }
  function vCards() {
    view = "cards"; navbar(true);
    var tot = 0, kn = 0, du = 0;
    DECKS.forEach(function (d) { var i = deckInfo(d.id); tot += i.n; kn += i.known; du += i.due + i.neu; });
    var h = '<section class="card"><h2>🃏 Fișe rapide</h2><p class="muted">Termenii de bază pe scurt: <b>ce este</b> și <b>ce face</b>. Întoarce fișa, apoi spune sincer „O știu” sau „Nu o știu” – fișele știute revin tot mai rar (repetiție spațiată).</p>' +
      '<div class="rgrid"><div><b>' + tot + '</b><span>fișe</span></div><div><b>' + kn + '</b><span>învățate</span></div><div><b>' + du + '</b><span>de repetat</span></div></div>' +
      '<button class="big" id="fcAll">Repetă fișele (toate capitolele)</button><button class="ghost" id="glBtn">' + ICON.book + ' Glosar – caută orice termen</button></section><h2 class="sec">Pe capitole</h2>';
    DECKS.forEach(function (d) {
      var i = deckInfo(d.id);
      h += '<div class="card deck"><div class="dh"><span class="cic">' + d.ic + '</span><div><b>' + esc(d.name) + '</b><small>' + i.n + " fișe · " + i.known + " învățate · " + (i.due + i.neu) + ' de repetat</small><span class="bar sm"><i style="width:' + pct(i.known, i.n) + '%"></i></span></div></div><div class="row2"><button class="ghost sm" data-fc="' + d.id + '">🃏 Fișe</button>' + (d.id !== "gen" ? '<button class="ghost sm" data-sheet="' + d.id + '">' + ICON.print + ' Foaie de bază</button>' : "") + "</div></div>";
    });
    app.innerHTML = h;
    $("fcAll").onclick = function () { startCards(DECKS.map(function (d) { return d.id; })); };
    $("glBtn").onclick = function () { go("gloss"); };
    Array.prototype.forEach.call(app.querySelectorAll("[data-fc]"), function (b) { b.onclick = function () { startCards([b.getAttribute("data-fc")]); }; });
    Array.prototype.forEach.call(app.querySelectorAll("[data-sheet]"), function (b) { b.onclick = function () { go("sheet", b.getAttribute("data-sheet")); }; });
  }
  function startCards(decks) {
    var now = Date.now(), due = [], neu = [], rest = [];
    decks.forEach(function (c) { (TERMS[c] || []).forEach(function (e) { var st = fcState(c, e), it = { c: c, e: e }; if (!st) neu.push(it); else if (st[1] <= now) due.push(it); else rest.push(it); }); });
    due.sort(function (a, b) { return fcState(a.c, a.e)[1] - fcState(b.c, b.e)[1]; });
    var list = due.slice(0, 20); list = list.concat(shuffle(neu).slice(0, Math.max(0, 20 - list.length)));
    if (!list.length) list = shuffle(rest).slice(0, 15);
    list = shuffle(list);
    var q = list.map(function (_, i) { return i; }), knew = 0, seen = 0, total = list.length, doneSet = {}, failed = {};
    R = { active: true, kind: "cards" }; document.body.classList.add("inquiz"); navbar(false); hideSheet();
    function paint() {
      if (!q.length) return finish();
      var it = list[q[0]], e = it.e, full = e.length === 3 ? e[1] : "", def = e.length === 3 ? e[2] : e[1];
      hdr.className = "topbar lesson";
      hdr.innerHTML = '<button class="x" id="xBtn" aria-label="Închide">' + ICON.x + '</button><div class="pbar"><i style="width:' + pct(Object.keys(doneSet).length, total) + '%"></i></div><span class="chip">' + Object.keys(doneSet).length + "/" + total + "</span>";
      $("xBtn").onclick = function () { saveP(); go("cards"); };
      var deck = DECKS.filter(function (d) { return d.id === it.c; })[0];
      app.innerHTML = '<div class="flip" id="flip"><div class="fin"><div class="face front"><small>' + deck.ic + " " + esc(deck.name) + '</small><div class="term">' + esc(e[0]) + '</div><span class="hint">Atinge ca să întorci fișa</span></div>' +
        '<div class="face back"><small>' + esc(e[0]) + "</small>" + (full ? '<div class="full">' + esc(full) + "</div>" : "") + '<div class="def">' + esc(def) + "</div></div></div></div>" +
        '<div class="fcbtns hidden" id="fcb"><button class="big no" id="fcNo">✗ Nu o știu</button><button class="big yes" id="fcYes">✓ O știu</button></div><button class="big" id="fcShow">Arată răspunsul</button>';
      function flip() { $("flip").classList.add("flipped"); $("fcb").classList.remove("hidden"); $("fcShow").classList.add("hidden"); SND.tap(); }
      $("flip").onclick = flip; $("fcShow").onclick = flip;
      $("fcNo").onclick = function () { grade(false); }; $("fcYes").onclick = function () { grade(true); };
      toTop();
    }
    function grade(ok) {
      var idx = q.shift(), it = list[idx], k = fcKey(it.c, it.e), st = P.fc[k] || [0, 0, 0], now = Date.now();
      if (ok) { var box = Math.min(FC_DAYS.length - 1, st[0] + 1); P.fc[k] = [box, now + FC_DAYS[box] * 864e5 - 36e5, now]; if (!doneSet[idx] && !failed[idx]) knew++; doneSet[idx] = 1; addXP(1); SND.ok(); }
      else { failed[idx] = 1; P.fc[k] = [0, now, now]; q.splice(Math.min(q.length, 3), 0, idx); SND.bad(); }
      seen++; saveP(); paint();
    }
    function finish() {
      R = null; header(); navbar(false);
      app.innerHTML = '<div class="result card pop"><div class="big-emoji">🃏</div><h1>Fișe terminate!</h1><div class="rgrid"><div><b>' + total + '</b><span>fișe</span></div><div><b>' + knew + '</b><span>știute din prima</span></div></div><p class="muted">Fișele pe care nu le-ai știut revin mâine; cele știute revin peste tot mai multe zile.</p><button class="big" id="doneBtn">Continuă</button></div>';
      $("doneBtn").onclick = function () { go("cards"); };
      SND.done(); toTop();
    }
    if (!total) { R = null; toast("Nu există fișe."); return go("cards"); }
    paint();
  }
  function norm(x) { return String(x).toLowerCase().normalize ? String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : String(x).toLowerCase(); }
  function vGloss(q0) {
    view = "cards"; navbar(true);
    var catName = function (c) { return c === "gen" ? "General" : CATBY[c].short; };
    app.innerHTML = '<section class="card"><button class="back" id="backBtn">‹ Fișe</button><h2>📖 Glosar</h2><input class="search" id="glq" type="search" placeholder="Caută: OTDR, VLAN, masca, fază…" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(q0 || "") + '"><p class="muted small" id="glc"></p></section><div id="gll"></div>';
    $("backBtn").onclick = function () { go("cards"); };
    function render() {
      var qv = norm($("glq").value.trim()), out = [], n = 0;
      GL.forEach(function (g) { if (qv && norm(g.t + " " + g.f + " " + g.d).indexOf(qv) < 0) return; if (n++ < 400) out.push('<div class="gl"><b>' + esc(g.t) + "</b>" + (g.f ? ' <i>' + esc(g.f) + "</i>" : "") + '<span class="tagc">' + esc(catName(g.c)) + "</span><div>" + esc(g.d) + "</div></div>"); });
      $("glc").textContent = n + " termeni" + (n > 400 ? " (primii 400 afișați – rafinează căutarea)" : "");
      $("gll").innerHTML = out.length ? '<div class="card">' + out.join("") + "</div>" : '<div class="card muted">Niciun rezultat.</div>';
    }
    $("glq").oninput = render; render();
  }
  function vSheet(c) {
    view = "cards"; navbar(true);
    var cat = CATBY[c] || CATS[0]; c = cat.id;
    var h = '<div class="sheetp"><div class="card noprint"><button class="back" id="backBtn">‹ Fișe</button><button class="big" id="prBtn">' + ICON.print + ' Tipărește / salvează PDF</button></div>' +
      '<section class="card"><h1>' + cat.ic + " Foaie de bază – " + esc(cat.short) + '</h1><p class="muted">' + esc(cat.name) + '</p><h2>Termeni de bază</h2><table class="tb gl2">' +
      (TERMS[c] || []).map(function (e) { return "<tr><th>" + esc(e[0]) + "</th><td>" + (e.length === 3 ? "<i>" + esc(e[1]) + "</i> – " + esc(e[2]) : esc(e[1])) + "</td></tr>"; }).join("") + "</table>";
    h += "<h2>Ce trebuie să știi (din lecții)</h2>";
    (CHLES[c] || []).forEach(function (l) {
      if (!l.cards || !l.cards.length) return;
      var tmp = document.createElement("div"); tmp.innerHTML = l.cards.join("");
      var facts = Array.prototype.map.call(tmp.querySelectorAll(".fact"), function (f) { return f.innerHTML.replace(/<b>📌 Precis:<\/b>\s*/, ""); });
      var figs = Array.prototype.map.call(tmp.querySelectorAll("figure.dia"), function (f) { return f.outerHTML; });
      h += '<div class="sh-l"><h3>' + l.ic + " " + esc(l.t) + ' <small>Nivel ' + l.lvl + "</small></h3>" + facts.map(function (f) { return "<p>" + f + "</p>"; }).join("") + figs.join("") + "</div>";
    });
    h += "</section></div>";
    app.innerHTML = h;
    $("backBtn").onclick = function () { go("cards"); };
    $("prBtn").onclick = function () { window.print(); };
  }

  /* ---------------- Greșelile mele ---------------- */
  /* ================= 🧠 Teste psihologice (aptitudini) ================= */
  var APS = null, APMODE = "ex", APLVL = 0;
  window.__aps = function () { return APS; }; window.__apmode = function (m, l) { APMODE = m; APLVL = l || 0; };
  function apStop() { if (APS && APS.tm) { clearInterval(APS.tm); APS.tm = null; } if (APS && APS.to) { clearTimeout(APS.to); APS.to = null; } }
  function apNow() { return Math.floor(Date.now() / 1000); }
  function apG(k) { P.cli = P.cli || {}; return P.cli[k] || 0; }
  function apS(k, v) { P.cli = P.cli || {}; P.cli[k] = v; }
  function apLv(t) { var v = apG("ap:lv:" + t); return v ? (v % 10) || 1 : 2; }
  function apSetLv(t, l) { apS("ap:lv:" + t, apNow() * 10 + Math.max(1, Math.min(5, l))); }
  function apMists() { return Object.keys(P.cli || {}).filter(function (k) { return /^am:/.test(k) && P.cli[k] % 10 === 0 && window.APT && APT.TYPES.some(function (t) { return t[0] === k.split(":")[1]; }); }).sort(function (a, b) { return P.cli[b] - P.cli[a]; }); }
  function apTName(t) { var r = (window.APT ? APT.TYPES : []).filter(function (x) { return x[0] === t; })[0]; return r ? r[1] + " " + r[2] : t; }
  var APX = { mix: [20, 600, null, "Examen mixt"], praga: [20, 420, ["praga"], "Atenție distributivă (Praga)"], sjt: [10, 600, ["sjt"], "Judecată situațională"], spat: [12, 480, ["net", "cnt", "top", "fold", "rot3", "dotp"], "Orientare spațială"], rat: [20, 600, ["mat", "fan", "ser", "ser2", "syl", "log"], "Raționament"], verb: [16, 360, ["syn", "syn", "wan", "odd", "ana"], "Verbal (sinonime, antonime, analogii)"] };
  function vApt(arg) {
    view = "apt"; apStop(); APS = null;
    if (!window.APT) { app.innerHTML = '<section class="card"><p>Se încarcă…</p></section>'; return; }
    if (arg === "frazele") return apFraze();
    if (arg === "bou") return apBou(60);
    if (arg === "bou10") return apBou(600);
    if (arg === "krae") return apKrae(120);
    if (arg === "krae10") return apKrae(600);
    if (arg === "mist") return apStart({ mode: "mist" });
    if (arg && arg.indexOf("x:") === 0) { var X = APX[arg.slice(2)]; if (X) return apStart({ mode: "exam", n: X[0], time: X[1], types: X[2], title: X[3] }); }
    if (arg && arg.indexOf("t:") === 0) return apStart({ mode: APMODE, types: arg.slice(2) === "mix" ? null : [arg.slice(2)] });
    navbar(true);
    var mc = apMists().length, best = apG("ap:best:exam"), tn = 0, tk = 0;
    APT.TYPES.forEach(function (t) { tn += apG("ap:n:" + t[0]); tk += apG("ap:k:" + t[0]); });
    var h = '<section class="card ioshero"><button class="back" id="apBack">‹ Grile</button><div class="iosk">Teste psihologice · aptitudini</div><h2>🧠 ' + APT.TYPES.length + ' tipuri de probe</h2><p class="small muted">Lista oficială exactă a probelor <b>nu este publică</b>. Exersezi tipurile descrise public pentru concursurile din instituțiile publice. Itemii se generează la nesfârșit și fiecare răspuns e verificat automat.</p>' +
      '<button class="big gogreen" id="apGo">▶️ Examen mixt: 20 itemi · 10 min</button><p class="small muted" style="margin:6px 0 0">' + (tn ? "Ai rezolvat " + tn + " itemi · " + Math.round(100 * tk / tn) + "% corecte" + (best ? " · cel mai bun examen: " + best + "%" : "") : "Începe cu un tip din listă, în modul Învățare.") + "</p></section>";
    h += '<section class="card"><div class="iosk">Cum lucrezi</div><div class="seg wrap" id="apMode">' + [["learn", "📘 Învățare"], ["ex", "✏️ Exercițiu"], ["ada", "📈 Adaptiv"], ["mar", "🏃 Maraton"]].map(function (m) { return '<button data-m="' + m[0] + '" class="' + (APMODE === m[0] ? "on" : "") + '">' + m[1] + "</button>"; }).join("") + '</div><p class="small muted" id="apModeD"></p>' +
      '<div id="apLvW"><div class="small muted">Dificultate</div><div class="seg" id="apLvl">' + [[0, "Auto"], [1, "1"], [2, "2"], [3, "3"], [4, "4"], [5, "5"]].map(function (l) { return '<button data-l="' + l[0] + '" class="' + (APLVL === l[0] ? "on" : "") + '">' + l[1] + "</button>"; }).join("") + "</div></div></section>";
    var G = [["⏱️ Examen pe timp", [["apt:x:mix", "📝", "Examen mixt", "20 itemi · 10 min"], ["apt:x:praga", "🔢", "Atenție distributivă (Praga)", "20 itemi · 7 min"], ["apt:x:sjt", "🎖️", "Judecată situațională", "10 itemi · 10 min"], ["apt:x:spat", "🧊", "Orientare spațială", "12 itemi · 8 min"], ["apt:x:rat", "🧩", "Raționament", "20 itemi · 10 min"], ["apt:x:verb", "🔤", "Verbal", "16 itemi · 6 min"], ["apt:bou10", "🔍", "Baraj (anulare) interactiv", "10 min"], ["apt:krae10", "➕", "Kraepelin", "10 min, scor pe minut"]]]];
    if (mc) G.unshift(["❗ Greșelile mele", [["apt:mist", "❗", "Reia itemii greșiți", mc + ""]]]);
    G.push(["🎲 Toate tipurile", [["apt:t:mix", "🎲", "Mix din toate tipurile", ""], ["apt:bou", "🔍", "Baraj rapid", "60 s, atingi țintele"], ["apt:krae", "➕", "Kraepelin rapid", "2 min"]]]);
    APT.SECT.forEach(function (s) { G.push([s[0], s[1].map(function (t) { var n = apG("ap:n:" + t[0]), k = apG("ap:k:" + t[0]); return ["apt:t:" + t[0], t[1], t[2], "nivel " + apLv(t[0]) + (n ? " · " + Math.round(100 * k / n) + "%" : "")]; })]); });
    G.push(["📄 Personalitate (fără punctaj)", [["apt:frazele", "📄", "Frazele de completat (A.N.P): ghid", "sinceritate, consecvență"]]]);
    app.innerHTML = h + hubList(G); hubWire();
    var MD = { learn: "Vezi întâi cum se rezolvă, apoi răspunzi; după fiecare item: explicația pas cu pas.", ex: "Fără cronometru. După fiecare răspuns vezi explicația și de ce sunt greșite celelalte variante.", ada: "Dificultatea crește după 2 răspunsuri corecte la rând și scade după o greșeală (se salvează pe tip).", mar: "Tipuri amestecate, dificultatea crește la fiecare 5 corecte. Ai 3 vieți." };
    function md() { $("apModeD").textContent = MD[APMODE]; $("apLvW").style.display = APMODE === "learn" || APMODE === "ex" ? "" : "none"; }
    md();
    Array.prototype.forEach.call(app.querySelectorAll("#apMode button"), function (b) { b.onclick = function () { APMODE = b.getAttribute("data-m"); Array.prototype.forEach.call(app.querySelectorAll("#apMode button"), function (x) { x.classList.toggle("on", x === b); }); md(); }; });
    Array.prototype.forEach.call(app.querySelectorAll("#apLvl button"), function (b) { b.onclick = function () { APLVL = +b.getAttribute("data-l"); Array.prototype.forEach.call(app.querySelectorAll("#apLvl button"), function (x) { x.classList.toggle("on", x === b); }); }; });
    $("apGo").onclick = function () { go("apt", "x:mix"); };
    $("apBack").onclick = function () { go("practice"); };
  }
  function apStart(o) {
    APS = { mode: o.mode, types: o.types || null, n: o.n || (o.mode === "mist" ? Math.min(20, apMists().length) : o.mode === "mar" ? Infinity : 10), i: 0, ok: 0, bad: 0, lives: 3, res: [], streak: {}, title: o.title, end: o.time ? Date.now() + o.time * 1000 : 0, time: o.time || 0, t0: Date.now(), mist: o.mode === "mist" ? apMists().slice(0, 20) : null, order: null };
    if (APS.mode === "mist" && !APS.n) { toast("Nu ai itemi greșiți."); return go("apt"); }
    if (APS.mode === "exam") { var ts = APS.types || APT.TYPES.map(function (t) { return t[0]; }).filter(function (t) { return t !== "dot"; }), ord = []; while (ord.length < APS.n) ord = ord.concat(shuffle(ts)); APS.order = ord.slice(0, APS.n); }
    document.body.classList.add("inex"); navbar(false);
    if (APS.end) APS.tm = setInterval(function () { var el = $("apTime"); var left = Math.max(0, Math.round((APS.end - Date.now()) / 1000)); if (el) el.textContent = "⏱ " + Math.floor(left / 60) + ":" + ("0" + left % 60).slice(-2); if (left <= 0) { apStop(); apEnd(true); } }, 500);
    apNext();
  }
  function apPickType() {
    var all = APT.TYPES.map(function (t) { return t[0]; }), ts = APS.types || all;
    if (APS.mode === "ada" && ts.length > 1) { /* tipurile cu acuratețe mică apar mai des */ var w = ts.map(function (t) { var n = apG("ap:n:" + t), k = apG("ap:k:" + t); return 1.5 - (n ? k / n : 0.5); }), s = w.reduce(function (a, b) { return a + b; }, 0), r = Math.random() * s; for (var i = 0; i < ts.length; i++) { r -= w[i]; if (r <= 0) return ts[i]; } }
    return ts[Math.floor(Math.random() * ts.length)];
  }
  function apNext() {
    apStop0();
    if (APS.i >= APS.n || (APS.mode === "mar" && APS.lives <= 0)) return apEnd(false);
    var t, lv, seed = (Math.random() * 2147483647) | 0, k;
    if (APS.mode === "mist") { k = APS.mist[APS.i].split(":"); t = k[1]; seed = +k[2]; lv = +k[3]; }
    else if (APS.mode === "exam") { t = APS.order[APS.i]; lv = Math.max(3, apLv(t)); }
    else if (APS.mode === "mar") { t = apPickType(); lv = Math.min(5, 1 + Math.floor(APS.ok / 5)); }
    else { t = apPickType(); lv = APS.mode === "ada" ? apLv(t) : (APLVL || apLv(t)); }
    var it; try { it = APT.gen(t, seed, lv); } catch (e) { it = APT.gen("ser", seed, lv); }
    APS.it = it; APS.done = false; APS.shown = !it.mem;
    apRender();
  }
  function apStop0() { if (APS && APS.to) { clearTimeout(APS.to); APS.to = null; } }
  function apHead() {
    var prog = APS.mode === "mar" ? "✔ " + APS.ok + " · " + "❤️".repeat(Math.max(0, APS.lives)) + "🖤".repeat(3 - Math.max(0, APS.lives)) : "Itemul " + (APS.i + 1) + " / " + APS.n;
    var md = { learn: "📘 Învățare", ex: "✏️ Exercițiu", ada: "📈 Adaptiv", mar: "🏃 Maraton", exam: "⏱️ " + (APS.title || "Examen"), mist: "❗ Greșelile mele" }[APS.mode];
    return '<div class="aphead"><button class="ghost sm" id="apQuit">‹ Ieși</button><span class="small"><b>' + md + "</b> · " + prog + " · nivel " + APS.it.lv + '</span><span id="apTime" class="small"></span></div>';
  }
  function apRender() {
    var it = APS.it, h = '<section class="card apcard">' + apHead();
    h += '<div class="aptype small muted">' + esc(apTName(it.t)) + "</div>";
    if (!APS.shown) {
      h += '<div class="apmem">' + it.mem.html + '<div class="iosbar"><i id="apMemBar" style="width:100%;transition:width ' + it.mem.ms + 'ms linear"></i></div><button class="ghost" id="apMemOk">Am reținut ›</button></div></section>';
      app.innerHTML = h; apWireQuit();
      setTimeout(function () { var b = $("apMemBar"); if (b) b.style.width = "0%"; }, 30);
      var go2 = function () { if (APS && APS.it === it && !APS.shown) { APS.shown = true; apRender(); } };
      APS.to = setTimeout(go2, it.mem.ms); $("apMemOk").onclick = go2;
      return;
    }
    if (APS.mode === "learn") h += '<div class="fact tip small"><b>📘 Cum rezolvi:</b> ' + esc(APT.TIP[it.t] || "") + "</div>";
    h += '<p class="apq"><b>' + it.q + "</b></p>" + (it.stim ? '<div class="apstim">' + it.stim + "</div>" : "");
    if (it.interactive === "dot") h += apDotHtml(it);
    else h += '<div class="apopts c' + (it.cols || 2) + '">' + it.opts.map(function (o, i) { return '<button class="apopt" data-i="' + i + '"><span class="apl">' + String.fromCharCode(65 + i) + "</span>" + o + "</button>"; }).join("") + "</div>";
    h += '<div id="apFb"></div></section>';
    app.innerHTML = h; apWireQuit();
    if (it.interactive === "dot") apDotWire(it);
    else Array.prototype.forEach.call(app.querySelectorAll(".apopt"), function (b) { b.onclick = function () { if (!APS.done) apAnswer(+b.getAttribute("data-i") === it.ans, +b.getAttribute("data-i")); }; });
    if (APS.end) { var el = $("apTime"), left = Math.max(0, Math.round((APS.end - Date.now()) / 1000)); if (el) el.textContent = "⏱ " + Math.floor(left / 60) + ":" + ("0" + left % 60).slice(-2); }
  }
  function apWireQuit() { $("apQuit").onclick = function () { if (APS && APS.mode === "exam" && APS.i < APS.n && !confirm("Ieși din examen? Rezultatul nu se salvează.")) return; apStop(); APS = null; go("apt"); }; }
  function apAnswer(ok, pick) {
    var it = APS.it; APS.done = true;
    apS("ap:n:" + it.t, apG("ap:n:" + it.t) + 1); if (ok) { apS("ap:k:" + it.t, apG("ap:k:" + it.t) + 1); APS.ok++; addXP(2); } else APS.bad++;
    var mk = "am:" + it.t + ":" + it.seed + ":" + it.lv;
    if (!ok) apS(mk, apNow() * 10); else if (apG(mk) && apG(mk) % 10 === 0) apS(mk, apNow() * 10 + 1);
    if (APS.mode === "ada") { var st = APS.streak[it.t] || 0; if (ok) { st++; if (st >= 2) { apSetLv(it.t, apLv(it.t) + 1); st = 0; } } else { apSetLv(it.t, apLv(it.t) - 1); st = 0; } APS.streak[it.t] = st; }
    if (APS.mode === "mar" && !ok) APS.lives--;
    APS.res.push({ it: it, ok: ok, pick: pick });
    saveP();
    if (APS.mode === "exam") { APS.i++; return apNext(); }
    try { SND[ok ? "ok" : "bad"](); } catch (e) {}
    Array.prototype.forEach.call(app.querySelectorAll(".apopt"), function (b) { var i = +b.getAttribute("data-i"); b.disabled = true; if (i === it.ans) b.classList.add("good"); else if (i === pick) b.classList.add("badp"); });
    var why = (it.why || []).map(function (w, i) { return i === it.ans || !w ? "" : "<li><b>" + String.fromCharCode(65 + i) + ":</b> " + esc(w) + "</li>"; }).join("");
    $("apFb").innerHTML = '<div class="apfb ' + (ok ? "ok" : "no") + '"><b>' + (ok ? "✅ Corect!" : "❌ Greșit." + (it.ans >= 0 ? " Corect era " + String.fromCharCode(65 + it.ans) + "." : "")) + "</b><p>" + esc(it.expl) + "</p>" + (why ? "<div class=\"small\"><b>De ce nu celelalte:</b><ul>" + why + "</ul></div>" : "") + (APS.mode === "ada" ? '<p class="small muted">Nivelul pentru acest tip: ' + apLv(it.t) + "</p>" : "") + '</div><button class="big gogreen" id="apNx">Următorul ›</button>';
    $("apNx").onclick = function () { APS.i++; apNext(); };
    try { $("apFb").scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {}
  }
  /* --- copierea figurii pe grila de puncte --- */
  function apDotHtml(it) { var N = it.dot.N, sp = 56, b = ""; for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) b += '<button class="apdot' + (x === it.dot.start[0] && y === it.dot.start[1] ? " st" : "") + '" data-x="' + x + '" data-y="' + y + '" style="left:' + (x * sp) + "px;top:" + (y * sp) + 'px" aria-label="punct ' + (x + 1) + "," + (y + 1) + '"><i></i></button>'; return '<div class="apdotw" style="width:' + ((N - 1) * sp + 44) + "px;height:" + ((N - 1) * sp + 44) + 'px"><svg class="apdotl" width="' + ((N - 1) * sp + 44) + '" height="' + ((N - 1) * sp + 44) + '"></svg>' + b + '</div><div class="row"><button class="ghost" id="apDU">↩ Anulează</button><button class="big gogreen" id="apDC">Verifică</button></div><p class="small muted" id="apDM">Începe cu punctul roșu.</p>'; }
  function apDotWire(it) {
    var path = [], sp = 56;
    function draw() { var s = app.querySelector(".apdotl"); if (!s) return; s.innerHTML = path.length > 1 ? '<polyline points="' + path.map(function (p) { return (22 + p[0] * sp) + "," + (22 + p[1] * sp); }).join(" ") + '" fill="none" stroke="#1d4ed8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' : ""; Array.prototype.forEach.call(app.querySelectorAll(".apdot"), function (b) { var x = +b.getAttribute("data-x"), y = +b.getAttribute("data-y"); b.classList.toggle("on", path.some(function (p) { return p[0] === x && p[1] === y; })); }); }
    Array.prototype.forEach.call(app.querySelectorAll(".apdot"), function (b) { b.onclick = function () { if (APS.done) return; var x = +b.getAttribute("data-x"), y = +b.getAttribute("data-y"), m = $("apDM");
      if (!path.length) { if (x !== it.dot.start[0] || y !== it.dot.start[1]) { m.textContent = "Pornește din punctul ROȘU."; return; } path.push([x, y]); draw(); return; }
      var l = path[path.length - 1], dx = Math.abs(x - l[0]), dy = Math.abs(y - l[1]);
      if ((dx > 1 || dy > 1) || (!dx && !dy) || (!it.dot.diag && dx && dy)) { m.textContent = it.dot.diag ? "Alege un punct vecin (și pe diagonală)." : "Alege un punct vecin pe orizontală sau verticală."; return; }
      path.push([x, y]); m.textContent = (path.length - 1) + " segmente desenate."; draw(); }; });
    $("apDU").onclick = function () { if (!APS.done) { path.pop(); draw(); } };
    $("apDC").onclick = function () { if (APS.done) return; var segs = []; for (var i = 1; i < path.length; i++) segs.push(APT.dotKey(path[i - 1], path[i])); var ok = APT.dotCheck(it, segs); if (!ok && APS.mode !== "exam") { /* arată figura corectă */ var s = app.querySelector(".apdotl"); s.innerHTML += it.dot.target.map(function (k) { var ab = k.split("|").map(function (p) { return p.split(",").map(Number); }); return '<line x1="' + (22 + ab[0][0] * sp) + '" y1="' + (22 + ab[0][1] * sp) + '" x2="' + (22 + ab[1][0] * sp) + '" y2="' + (22 + ab[1][1] * sp) + '" stroke="#16a34a" stroke-width="3" stroke-dasharray="6 4"/>'; }).join(""); } apAnswer(ok, ok ? 0 : 1); };
  }
  function apEnd(timeUp) {
    apStop(); document.body.classList.remove("inex");
    var n = APS.res.length, ok = APS.ok, tot = APS.mode === "exam" ? APS.n : n, pc = tot ? Math.round(100 * ok / tot) : 0, lvl = pc < 40 ? 1 : pc < 55 ? 2 : pc < 70 ? 3 : pc < 85 ? 4 : 5;
    if (APS.mode === "exam" && (APS.title === "Examen mixt" || !APS.title)) apS("ap:best:exam", Math.max(apG("ap:best:exam"), pc));
    if (APS.mode === "mar") apS("ap:best:mar", Math.max(apG("ap:best:mar"), ok));
    saveP(); navbar(true);
    var h = '<section class="card ioshero"><div class="iosk">' + esc(APS.title || ({ learn: "Învățare", ex: "Exercițiu", ada: "Adaptiv", mar: "Maraton", mist: "Greșelile mele" }[APS.mode] || "Rezultat")) + "</div><h2>" + (timeUp ? "⏰ Timpul a expirat · " : "") + ok + " / " + tot + " corecte (" + pc + "%)</h2>";
    if (APS.mode === "exam") h += '<p class="small muted">Nivel estimat: <b>' + lvl + " din 5</b> (orientativ; la concursurile de subofițeri e nevoie de nivel ≥ 2 la toate probele și ≥ 3 la cel puțin una). Timp folosit: " + Math.round((Date.now() - APS.t0) / 60000) + " min.</p>";
    if (APS.mode === "mar") h += '<p class="small muted">Recordul tău la maraton: ' + apG("ap:best:mar") + " corecte.</p>";
    h += '<button class="big gogreen" id="apAgain">↻ Încă o dată</button><button class="ghost" id="apHub">‹ Înapoi la teste</button></section>';
    var wrong = APS.res.filter(function (r) { return !r.ok; });
    if (wrong.length) h += '<section class="card"><h2>❗ Ce ai greșit (' + wrong.length + ')</h2><p class="small muted">Au intrat în „Greșelile mele” și le poți relua.</p>' + wrong.map(function (r) { var it = r.it; return '<div class="aprev"><div class="small muted">' + esc(apTName(it.t)) + '</div><p><b>' + it.q + "</b></p>" + (it.stim ? '<div class="apstim">' + it.stim + "</div>" : "") + (it.ans >= 0 ? '<div class="small">Corect: <b>' + String.fromCharCode(65 + it.ans) + '</b></div><div class="apopts c' + (it.cols || 2) + ' sm"><div class="apopt good">' + it.opts[it.ans] + "</div></div>" : "") + '<p class="small">💡 ' + esc(it.expl) + "</p></div>"; }).join("") + "</section>";
    app.innerHTML = h; toTop();
    if (STQ && STQ.ph === "psy" && APS.mode === "exam") { STQ.psy = pc; STQ.ph = "back"; var sb = document.createElement("div"); sb.className = "cohook"; sb.innerHTML = '<p class="small muted">🎮 Examenul din joc · proba teoretică: ' + fmtG(STQ.g) + ' · psihologice: ' + pc + '%</p><button class="big gogreen" id="stqBack">🎖️ Înapoi în sala de examen</button>'; app.insertBefore(sb, app.firstChild); $("stqBack").onclick = function () { go("game", "story"); }; return; }
    coHook("ap");
    var last = APS; $("apAgain").onclick = function () { apStart({ mode: last.mode === "mist" ? (apMists().length ? "mist" : "ex") : last.mode, n: last.mode === "exam" ? last.n : 0, time: last.time, types: last.types, title: last.title }); };
    $("apHub").onclick = function () { go("apt"); };
  }
  /* --- baraj interactiv (Bourdon) --- */
  function apBou(sec) {
    document.body.classList.add("inex"); navbar(false);
    var st = { end: Date.now() + sec * 1000, hit: 0, miss: 0, fa: 0, pages: 0 }, B;
    APS = { mode: "bou", tm: null };
    function page() {
      B = APT.bourBoard((Math.random() * 2147483647) | 0, 3); var on = {};
      var h = '<section class="card apcard"><div class="aphead"><button class="ghost sm" id="apQuit">‹ Ieși</button><span class="small"><b>🔍 Baraj</b> · pagina ' + (st.pages + 1) + '</span><span id="apTime" class="small"></span></div><p class="small">Atinge toate literele <b>„d” cu o liniuță sus și una jos</b>. Restul NU.</p><div class="apref">' + B.cell(["d", 3]) + '</div><div class="apbou" style="grid-template-columns:repeat(' + B.cols + ',1fr)">' + B.g.map(function (c, i) { return '<button class="apbc" data-i="' + i + '">' + B.cell(c) + "</button>"; }).join("") + '</div><button class="big gogreen" id="apPg">Pagina următoare ›</button></section>';
      app.innerHTML = h;
      $("apQuit").onclick = function () { apStop(); APS = null; go("apt"); };
      Array.prototype.forEach.call(app.querySelectorAll(".apbc"), function (b) { b.onclick = function () { var i = +b.getAttribute("data-i"); on[i] = !on[i]; b.classList.toggle("on", !!on[i]); }; });
      $("apPg").onclick = function () { score(on); page(); };
      st.cur = on;
    }
    function score(on) { B.g.forEach(function (c, i) { var t = B.match(c); if (t && on[i]) st.hit++; else if (t) st.miss++; else if (on[i]) st.fa++; }); st.pages++; }
    function fin() { apStop(); score(st.cur); document.body.classList.remove("inex"); navbar(true); var sc = st.hit - st.fa, acc = st.hit + st.miss ? Math.round(100 * st.hit / (st.hit + st.miss)) : 0, k = sec >= 600 ? "ap:best:bou10" : "ap:best:bou"; apS(k, Math.max(apG(k), sc)); apS("ap:n:bou", apG("ap:n:bou") + 1); saveP();
      app.innerHTML = '<section class="card ioshero"><div class="iosk">Baraj · ' + (sec / 60) + ' min</div><h2>Scor: ' + sc + '</h2><p>✅ ținte găsite: <b>' + st.hit + '</b> · ⛔ ratate: <b>' + st.miss + '</b> · ❌ greșit bifate: <b>' + st.fa + '</b> · acuratețe ' + acc + '%</p><p class="small muted">Scor = ținte găsite − bifări greșite. Record: ' + apG(k) + '. Truc: mergi rând cu rând, ritm constant, fără să te întorci.</p><button class="big gogreen" id="apAgain">↻ Încă o dată</button><button class="ghost" id="apHub">‹ Înapoi la teste</button></section>';
      $("apAgain").onclick = function () { apBou(sec); }; $("apHub").onclick = function () { go("apt"); }; }
    page();
    APS.tm = setInterval(function () { var left = Math.max(0, Math.round((st.end - Date.now()) / 1000)), el = $("apTime"); if (el) el.textContent = "⏱ " + Math.floor(left / 60) + ":" + ("0" + left % 60).slice(-2); if (left <= 0) fin(); }, 500);
  }
  /* --- Kraepelin interactiv --- */
  function apKrae(sec) {
    document.body.classList.add("inex"); navbar(false);
    var st = { end: Date.now() + sec * 1000, t0: Date.now(), ok: 0, bad: 0, min: [] }, d = [], p = 0;
    APS = { mode: "krae", tm: null };
    function more() { while (d.length < p + 12) d.push(1 + Math.floor(Math.random() * 9)); }
    function draw() { more(); var a = d[p], b = d[p + 1];
      app.innerHTML = '<section class="card apcard"><div class="aphead"><button class="ghost sm" id="apQuit">‹ Ieși</button><span class="small"><b>➕ Kraepelin</b> · ✔ ' + st.ok + ' · ✖ ' + st.bad + '</span><span id="apTime" class="small"></span></div><p class="small">Prima ≤ a doua → <b>aduni</b>; prima > a doua → <b>scazi</b>. Scrii doar <b>ultima cifră</b> a rezultatului.</p><div class="apser big">' + d.slice(p, p + 6).map(function (x, i) { return i < 2 ? '<b class="aphl">' + x + "</b>" : '<span class="muted">' + x + "</span>"; }).join(" ") + '</div><div class="apkp">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(function (k) { return '<button data-k="' + k + '">' + k + "</button>"; }).join("") + "</div></section>";
      $("apQuit").onclick = function () { apStop(); APS = null; go("apt"); };
      Array.prototype.forEach.call(app.querySelectorAll(".apkp button"), function (bt) { bt.onclick = function () { var r = APT._ ? null : null, res = (a <= b ? a + b : a - b) % 10, mi = Math.floor((Date.now() - st.t0) / 60000); st.min[mi] = st.min[mi] || [0, 0]; if (+bt.getAttribute("data-k") === res) { st.ok++; st.min[mi][0]++; } else { st.bad++; st.min[mi][1]++; } p++; draw(); upd(); }; });
      upd(); }
    function upd() { var left = Math.max(0, Math.round((st.end - Date.now()) / 1000)), el = $("apTime"); if (el) el.textContent = "⏱ " + Math.floor(left / 60) + ":" + ("0" + left % 60).slice(-2); }
    function fin() { apStop(); document.body.classList.remove("inex"); navbar(true); var k = sec >= 600 ? "ap:best:krae10" : "ap:best:krae"; apS(k, Math.max(apG(k), st.ok)); apS("ap:n:krae", apG("ap:n:krae") + 1); saveP();
      var bars = st.min.map(function (m, i) { m = m || [0, 0]; return '<div class="rdy"><span>min ' + (i + 1) + '</span><div class="iosbar"><i style="width:' + Math.min(100, m[0] * 2) + '%"></i></div><small>' + m[0] + " ✔ · " + m[1] + " ✖</small></div>"; }).join("");
      app.innerHTML = '<section class="card ioshero"><div class="iosk">Kraepelin · ' + (sec / 60) + ' min</div><h2>' + st.ok + ' corecte · ' + st.bad + ' greșite</h2><p class="small muted">Record: ' + apG(k) + '. Un ritm constant de la un minut la altul arată o atenție stabilă; scăderea spre final = oboseală.</p>' + bars + '<button class="big gogreen" id="apAgain">↻ Încă o dată</button><button class="ghost" id="apHub">‹ Înapoi la teste</button></section>';
      $("apAgain").onclick = function () { apKrae(sec); }; $("apHub").onclick = function () { go("apt"); }; }
    draw();
    APS.tm = setInterval(function () { upd(); if (Date.now() >= st.end) fin(); }, 500);
  }
  /* --- ghid: frazele de personalitate (fără punctaj) --- */
  function apFraze() {
    navbar(true);
    var ex = [["Când eram mic…", "„…îmi plăcea să construiesc lucruri și să le desfac.”", "„…eram mereu certat de toată lumea.”"], ["Colegii mei de serviciu…", "„…se bazează pe mine când e greu.”", "„…sunt toți niște leneși.”"], ["Mă enervez când…", "„…nu se respectă ce am stabilit, dar îmi revin repede.”", "„…nu mă enervez niciodată.” (nu e credibil)"], ["Șeful meu…", "„…e corect; când nu sunt de acord, îi spun respectuos.”", "„…mă urăște.”"], ["Cel mai mult mă tem…", "„…să nu-mi dezamăgesc familia.”", "„…de tot.”"], ["În timpul liber…", "„…fac sport și mai repar calculatoare.”", "„…nu fac nimic, stau.”"]];
    app.innerHTML = '<section class="card"><button class="back" id="apBack">‹ Teste psihologice</button><h2>📄 Frazele de completat (personalitate)</h2><p>Primești începuturi de propoziții („Când eram mic…”, „Colegii mei…”) și le completezi cum îți vine. <b>Aici NU există răspuns corect</b> și nu se dă notă – psihologul caută un profil echilibrat și sincer.</p><div class="fact tip"><b>Reguli simple</b><ul><li><b>Sincer</b> – scrie ce gândești, nu ce crezi că „vor să audă”.</li><li><b>Consecvent</b> – aceeași idee despre tine la toate frazele (testul are și întrebări de control).</li><li><b>Fără extreme</b> – evită „niciodată”, „mereu”, „toți”, „nimeni”.</li><li><b>Pozitiv, dar adevărat</b> – poți recunoaște o slăbiciune, spunând ce faci cu ea.</li><li><b>Scurt și clar</b> – o propoziție completă, fără glume sau sarcasm.</li><li>Nu lăsa fraze necompletate.</li></ul></div></section><section class="card"><h2>Exemple</h2>' + ex.map(function (e) { return '<div class="aprev"><p><b>' + e[0] + '</b></p><p class="small">✅ Echilibrat: ' + e[1] + '</p><p class="small">⚠️ Riscant: ' + e[2] + "</p></div>"; }).join("") + '<p class="small muted">Exemplele sunt doar ca să vezi tonul – folosește propriile tale cuvinte.</p></section>';
    $("apBack").onclick = function () { go("apt"); };
  }
  function vMist() {
    view = "mist"; navbar(true);
    var ids = activeMistakes().sort(function (a, b) { return P.mist[b][0] - P.mist[a][0]; }), amc = apMists().length;
    var h = (amc ? '<section class="card"><h2>🧠 Teste psihologice greșite <span class="badge">' + amc + '</span></h2><p class="muted small">Itemii greșiți rămân aici până îi rezolvi corect.</p><button class="big sec" id="apMist">Reia itemii greșiți (' + Math.min(20, amc) + ')</button></section>' : '') + '<section class="card"><h2>❗ Greșelile mele <span class="badge">' + ids.length + "</span></h2>" +
      (ids.length ? '<p class="muted">Întrebările greșite rămân aici până le răspunzi corect într-o sesiune de recapitulare.</p><button class="big" id="rvBtn">🧠 Exersează greșelile (' + weakIds().length + ') – în formate diferite</button><button class="ghost" id="revBtn">↻ Grilă clasică cu greșelile (' + Math.min(20, ids.length) + ")</button>" : '<p class="muted">Nicio greșeală salvată. Continuă lecțiile! 💪</p>') + "</section>";
    if (ids.length > 150) h += '<p class="muted small">Se afișează primele 150 din ' + ids.length + ' (cele mai recente).</p>';
    ids.slice(0, 150).forEach(function (id) { var q = BYID[id], r = P.q[id] || [0, 0]; h += '<div class="card rev"><div class="qmeta">' + CATBY[q.c].ic + " " + esc(CATBY[q.c].short) + " · greșită de " + r[1] + "× " + mDots(id) + markBtn(id) + "</div><div class=\"qq\">" + esc(q.q) + '</div><div class="a ok">✅ ' + esc(q.a[0]) + '</div><div class="e">💡 ' + esc(q.e) + "</div></div>"; });
    app.innerHTML = h;
    wireMarks();
    if ($("rvBtn")) $("rvBtn").onclick = function () { go("rev"); };
    if ($("apMist")) $("apMist").onclick = function () { go("apt", "mist"); };
    if ($("revBtn")) $("revBtn").onclick = function () { runQuiz({ mode: "mist", items: shuffle(ids).slice(0, 20).map(function (id) { return BYID[id]; }), hearts: 0, requeue: true, xpEach: 5, title: "Greșeli" }); };
  }

  /* ---------------- Statistici ---------------- */
  function vStats() {
    view = "stats"; navbar(true);
    var A = 0, C = 0, seen = 0;
    CATS.forEach(function (c) { var s = catStats(c.id); A += s.a; C += s.c; seen += s.seen; });
    var ld = Object.keys(P.lessons).filter(function (k) { return P.lessons[k].n > 0 && LBY[k]; }).length;
    var cpl = completion();
    var h = '<section class="card"><h2>📊 Statistici</h2><div class="gend"><b>' + String(cpl.pct).replace(".", ",") + '%</b><span>progres total pe site (' + cpl.done + " / " + cpl.total + ')</span><button class="ghost sm" id="boardBtn">🏆 Clasament</button></div><div class="rgrid">' +
      "<div><b>" + xpTotal() + "</b><span>XP total</span></div><div><b>🔥 " + dayStreak() + "</b><span>zile la rând</span></div><div><b>" + (P.best || 0) + "</b><span>combo record</span></div>" +
      "<div><b>" + pct(C, A) + "%</b><span>precizie</span></div><div><b>" + A + "</b><span>răspunsuri</span></div><div><b>" + seen + "/" + QS.length + "</b><span>întrebări văzute</span></div>" +
      "<div><b>" + ld + "/" + Object.keys(LBY).length + "</b><span>lecții terminate</span></div><div><b>" + activeMistakes().length + "</b><span>greșeli active</span></div><div><b>" + markedIds().length + "</b><span>marcate ⭐</span></div><div><b>" + P.exams.length + "</b><span>simulări</span></div><div><b>" + P.sub[0] + "/" + (P.sub[0] + P.sub[1]) + "</b><span>subnetting</span></div></div>";
    var d = new Date(), days = [];
    for (var i = 6; i >= 0; i--) { var dd = new Date(d); dd.setDate(d.getDate() - i); days.push([dayKey(dd), ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"][dd.getDay()]]); }
    var mx = Math.max.apply(null, days.map(function (x) { return P.days[x[0]] || 0; }).concat([DAILY_GOAL]));
    h += '<h3>XP în ultimele 7 zile</h3><div class="week">' + days.map(function (x) { var v = P.days[x[0]] || 0; return '<div><i style="height:' + Math.round(100 * v / mx) + '%"></i><b>' + v + "</b><span>" + x[1] + "</span></div>"; }).join("") + "</div></section>";
    h += '<section class="card"><h2>Pe capitole</h2>';
    CATS.forEach(function (c) { var s = catStats(c.id), tot = QS.filter(function (q) { return q.c === c.id; }).length, pr = chapterProgress(c.id); h += '<div class="crow2"><div><b>' + c.ic + " " + esc(c.short) + "</b><small>" + s.seen + "/" + tot + " văzute · " + s.a + " răspunsuri · lecții " + pr.d + "/" + pr.n + '</small></div><b class="' + (s.a ? (pct(s.c, s.a) >= 70 ? "okc" : "badc") : "") + '">' + (s.a ? pct(s.c, s.a) + "%" : "–") + '</b><span class="bar sm"><i style="width:' + pct(s.c, s.a) + '%"></i></span></div>'; });
    h += "</section>";
    h += '<section class="card"><h2>Istoric simulări</h2>' + (P.exams.length ? P.exams.slice().reverse().slice(0, 15).map(function (e) { return '<div class="crow"><span>' + fmtDate(e.t) + "</span><b>" + e.c + "/" + e.n + " (" + pct(e.c, e.n) + "%)</b><span>" + (e.d ? fmtTime(e.d) : "") + "</span></div>"; }).join("") : '<p class="muted">Nicio simulare încă.</p>') + "</section>";
    h += '<section class="card"><button class="ghost danger" id="resetBtn">Resetează tot progresul</button></section>';
    app.innerHTML = h;
    $("boardBtn").onclick = function () { go("board"); };
    $("resetBtn").onclick = function () {
      if (!confirm("Sigur ștergi tot progresul" + (AUTH ? " (inclusiv din cont, de pe toate dispozitivele)" : "") + "?")) return;
      var done = function () { P = merge.empty(); saveP(true); go("stats"); toast("Progres resetat."); };
      if (AUTH) api("DELETE", "/api/progress").then(done).catch(function (e) { toast("Nu s-a putut reseta în cont: " + e.message); }); else done();
    };
  }

  /* ---------------- Cont ---------------- */
  /* Import progres din site-ul vechi (export JSON). Combinare ca la sincronizarea în cloud: nu scade nimic. */
  function importOld(text) {
    var j; if (!text) return { ok: false, msg: "Nu ai lipit nimic. Lipește textul copiat de pe site-ul vechi." };
    if (text.length > 8e6) return { ok: false, msg: "Textul e prea mare." };
    try { j = JSON.parse(text); } catch (e) { return { ok: false, msg: "Textul nu e valid. Copiază-l din nou, complet (de la { până la })." }; }
    var cands = [];
    if (j && j.app === "sts-grila-export") { if (j.local) cands.push(j.local); if (j.cloud) cands.push(j.cloud); }
    else if (j && j.v === 2) cands.push(j); else if (j && j.progress && j.progress.v === 2) cands.push(j.progress);
    cands = cands.filter(function (c) { return c && typeof c === "object" && c.v === 2; });
    if (!cands.length) return { ok: false, msg: "Nu am găsit progres în acest text. Ești sigur că l-ai copiat de pe site-ul vechi?" };
    ensure();
    var before = { q: Object.keys(P.q || {}).length, l: Object.keys(P.lessons || {}).length, xp: xpTotal() };
    var m = P;
    cands.forEach(function (c) { m = merge(m, merge(merge.empty(), c)); });
    m.t = Math.max(Date.now(), m.t || 0); P = m; ensure(); saveP();
    var after = { q: Object.keys(P.q || {}).length, l: Object.keys(P.lessons || {}).length, xp: xpTotal() };
    if (AUTH) syncNow();
    return { ok: true, msg: "Gata ✓ Întrebări cu istoric: " + before.q + " → " + after.q + " · lecții: " + before.l + " → " + after.l + " · XP total: " + before.xp + " → " + after.xp + (AUTH ? ". Se salvează în cont." : ". Intră în cont ca să se salveze și în cloud.") };
  }
  function vAcct() {
    view = "acct"; navbar(true);
    var h;
    if (AUTH) {
      h = '<section class="card"><h2>👤 Cont: ' + esc(AUTH.user) + '</h2><p>Progresul (XP, serii, lecții, greșeli, statistici, simulări) se salvează în cloud și se sincronizează automat pe toate dispozitivele.</p>' +
        '<p class="muted" id="syncInfo">' + (syncState === "ok" ? "✓ Sincronizat" + (lastSync ? " la " + fmtDate(lastSync) : "") : syncState === "off" ? "⚠ Offline – modificările sunt păstrate local și se trimit automat când revine conexiunea." : syncState === "auth" ? "⚠ Serverul nu recunoaște sesiunea. Progresul e păstrat pe acest dispozitiv. Apasă „Reautentificare” – nu pierzi nimic." : "Se sincronizează…") + "</p>" + (syncState === "auth" ? '<button class="big" id="reBtn">Reautentificare (păstrez progresul)</button>' : "") +
        '<button class="big" id="syncBtn">' + ICON.cloudSync + ' Sincronizează acum</button><button class="ghost" id="outBtn">Deconectare</button></section>';
    } else {
      h = '<section class="card"><h2>👤 Cont</h2><p>Creează un cont ca progresul să fie salvat în cloud și să-l ai pe orice telefon sau calculator. Fără cont, progresul rămâne doar în acest browser.</p>' +
        '<div class="seg" id="modeSeg"><button data-m="login" class="on">Autentificare</button><button data-m="register">Cont nou</button></div>' +
        '<form id="authForm" class="tform"><label><span>Utilizator</span><input id="au" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="ex. andrei92" required></label>' +
        '<label><span>Parolă (min. 6 caractere)</span><input id="ap" type="password" autocomplete="current-password" required minlength="6"></label>' +
        '<label class="hidden" id="ap2l"><span>Repetă parola</span><input id="ap2" type="password" autocomplete="new-password"></label>' +
        '<div id="authErr" class="err"></div><button class="big" type="submit" id="authBtn">Intră în cont</button></form>' +
        '<p class="muted small">Parolele sunt stocate doar sub formă de hash (scrypt cu salt). Progresul local existent se combină cu cel din cont la autentificare.</p></section>';
    }
    h += '<section class="card" id="impCard"><h2>📥 Import progres din site-ul vechi</h2><p class="muted small">Ai progres pe site-ul vechi? Mută-l aici. Se combină cu ce ai deja (ia mereu valoarea mai mare / mai nouă, nu scade nimic) și apoi se salvează în cont.</p>' +
      '<p class="small"><a href="/export-vechi.html" target="_blank" rel="noopener"><b>Pasul 1: cum scot progresul din site-ul vechi (cu poze)</b></a></p>' +
      '<label class="tform"><span>Pasul 2: lipește aici textul copiat (sau alege fișierul)</span><textarea id="impTxt" rows="4" placeholder="Lipește aici…" style="width:100%;font:12px monospace"></textarea></label>' +
      '<input type="file" id="impFile" accept=".json,application/json,text/plain" class="small">' +
      '<div id="impMsg" class="muted small" role="status"></div><button class="big" id="impBtn">Importă progresul</button></section>';
    h += '<section class="card"><h2>' + ICA.photo + ' Despre imagini</h2><p class="muted small">Fotografiile provin de pe Wikimedia Commons, cu licențe libere. Autorii și licențele sunt listate pe pagina de credite.</p><button class="ghost" id="credBtn">Credite foto</button></section>';
    h += '<section class="card"><button class="ghost" id="talkBtn">📞 Discuția cu STS – cum vorbești calm și ce întrebi</button></section>';
    app.innerHTML = h;
    $("impFile").onchange = function () { var f = this.files && this.files[0]; if (!f) return; if (f.size > 8e6) { $("impMsg").textContent = "Fișier prea mare."; return; } var fr = new FileReader(); fr.onload = function () { $("impTxt").value = String(fr.result || ""); $("impMsg").textContent = "Fișier citit. Apasă „Importă progresul”."; }; fr.readAsText(f); };
    $("impBtn").onclick = function () {
      var m = $("impMsg"), t = $("impTxt").value.trim(), r = importOld(t);
      m.style.color = r.ok ? "#166534" : "#b91c1c"; m.textContent = r.msg;
      if (r.ok) { toast("Progres importat ✓"); setTimeout(function () { vAcct(); var mm = $("impMsg"); if (mm) { mm.style.color = "#166534"; mm.textContent = r.msg; } }, 300); }
    };
    $("credBtn").onclick = function () { go("credits"); }; if ($("talkBtn")) $("talkBtn").onclick = function () { go("talk"); };
    if (AUTH) {
      $("syncBtn").onclick = function () { var b = this; b.disabled = true; b.textContent = "Se sincronizează…"; syncNow().then(function (ok) { toast(ok ? "Sincronizat ✓" : "Nu s-a putut sincroniza acum."); vAcct(); }); };
      if ($("reBtn")) $("reBtn").onclick = function () { AUTH = null; lsSet(LS_A, null); syncState = ""; go("acct"); };
      $("outBtn").onclick = function () {
        if (!confirm("Te deconectezi? Progresul rămâne salvat în cont și va fi șters de pe acest dispozitiv.")) return;
        var tok = AUTH.token;
        syncNow().then(function (okS) {
          if (!okS) { alert("Nu ești online sau serverul nu răspunde, așa că NU te deconectez – progresul de pe acest telefon nu a ajuns încă în cont. Încearcă din nou când ai internet."); return; }
          return api("POST", "/api/auth/logout", {}, tok).catch(function () {}).then(function () {
            AUTH = null; lsSet(LS_A, null); P = merge.empty(); lsSet(LS_P, P); syncState = ""; go("acct"); toast("Te-ai deconectat.");
          });
        });
      };
      return;
    }
    var mode = "login";
    Array.prototype.forEach.call(app.querySelectorAll("#modeSeg button"), function (b) { b.onclick = function () { mode = b.getAttribute("data-m"); Array.prototype.forEach.call(app.querySelectorAll("#modeSeg button"), function (x) { x.classList.toggle("on", x === b); }); $("ap2l").classList.toggle("hidden", mode !== "register"); $("authBtn").textContent = mode === "register" ? "Creează contul" : "Intră în cont"; $("ap").setAttribute("autocomplete", mode === "register" ? "new-password" : "current-password"); }; });
    $("authForm").onsubmit = function (ev) {
      ev.preventDefault();
      var u = $("au").value.trim().toLowerCase(), p = $("ap").value, err = $("authErr");
      err.textContent = "";
      if (mode === "register" && p !== $("ap2").value) { err.textContent = "Parolele nu coincid."; return; }
      var b = $("authBtn"); b.disabled = true; b.textContent = "Se verifică…";
      api("POST", "/api/auth/" + mode, { u: u, p: p }, "-").then(function (r) {
        var lu = ""; try { lu = localStorage.getItem("sts_lastu") || ""; } catch (e) {}
        var hasLocal = P && ((P.q && Object.keys(P.q).length) || (P.cli && Object.keys(P.cli).length));
        if (lu && lu !== r.user && hasLocal && !confirm("Pe acest telefon este progresul contului „" + lu + "”. Îl adaug și în contul „" + r.user + "”?\n\nOK = da, le unesc · Anulează = nu (progresul lui „" + lu + "” rămâne neatins în contul lui)")) { try { localStorage.setItem("sts_p2_copie_" + lu, JSON.stringify(P)); } catch (e) {} P = merge.empty(); }
        try { localStorage.setItem("sts_lastu", r.user); } catch (e) {}
        AUTH = { token: r.token, user: r.user }; lsSet(LS_A, AUTH);
        return api("PUT", "/api/progress", { progress: P });
      }).then(function (r) {
        P = merge(P, r.progress); P.t = r.progress.t; lsSet(LS_P, P); syncState = "ok"; lastSync = Date.now();
        toast(mode === "register" ? "Cont creat ✓ Progresul se salvează în cloud." : "Bine ai revenit, " + AUTH.user + "! Progres restaurat ✓");
        go("home");
      }).catch(function (e) {
        b.disabled = false; b.textContent = mode === "register" ? "Creează contul" : "Intră în cont";
        err.textContent = e.name === "AbortError" ? "Serverul nu răspunde. Verifică conexiunea." : e.message;
        if (AUTH && e.status !== 401) { syncState = "off"; go("home"); }
      });
    };
  }

  /* ---------------- pornire ---------------- */
  var JOC0 = /^#joc$/i.test(location.hash) || /(^|[?&])joc(=|&|$)/.test(location.search.replace(/^\?/, "&"));
  go("home"); if (JOC0) go("game");
  window.addEventListener("hashchange", function () { if (/^#joc$/i.test(location.hash) && view !== "game") go("game"); });
  if (AUTH) syncNow().then(function (ok) { if (ok && !R && view === "home") go("home"); else header(); });
})();

/* Tastatură virtuală iOS: ascunde bara de jos și aduce câmpul în vizor; fără salturi la focus */
(function () {
  var vv = window.visualViewport;
  function kb() { if (!vv) return; var open = window.innerHeight - vv.height > 140; document.body.classList.toggle("kb", open); }
  if (vv) { vv.addEventListener("resize", kb); vv.addEventListener("scroll", kb); }
  document.addEventListener("focusin", function (e) {
    var t = e.target; if (!t || !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    setTimeout(function () { kb(); try { t.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (x) {} }, 320);
  });
  document.addEventListener("focusout", function () { setTimeout(kb, 150); });
})();
