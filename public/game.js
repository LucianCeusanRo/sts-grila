/* Panouri realiste (SVG) – Cisco Catalyst 2960-24TT-L (față + spate) și Cisco 1941 (spate).
   Aceleași coordonate sunt folosite pentru texturile 3D, LED-uri și punctele de conectare. */
var JGP = (function () {
  var L = { swf: { w: 880, h: 90, p: {} }, swr: { w: 880, h: 90, p: {} }, rr: { w: 880, h: 180, p: {} } };
  var i, x;
  for (i = 1; i <= 24; i++) { var col = Math.floor((i - 1) / 2), row = (i - 1) % 2; x = 212 + col * 31 + (col >= 6 ? 18 : 0); L.swf.p["fa" + i] = [x, row ? 52 : 20, "rj", i % 2 ? "t" : "b", "Fa0/" + i]; }
  L.swf.p.gi1 = [668, 20, "rj", "t", "Gi0/1"]; L.swf.p.gi2 = [668, 52, "rj", "b", "Gi0/2"];
  L.swr.p.con = [640, 34, "con", "t", "Console"];
  L.rr.p.g0 = [520, 108, "rj", "t", "G0/0"]; L.rr.p.g1 = [566, 108, "rj", "t", "G0/1"]; L.rr.p.con = [430, 108, "con", "t", "Console"]; L.rr.p.aux = [474, 108, "aux", "t", "AUX"];
  L.rr.p.usb0 = [370, 112, "usb", "t", "USB 0"]; L.rr.p.usb1 = [370, 132, "usb", "t", "USB 1"]; L.rr.p.minicon = [430, 146, "mini", "t", "Consolă mini-USB"];
  var LED = { off: "#2b2f36", amber: "#f59e0b", green: "#22c55e", blink: "#22c55e" };
  function led(id, cx, cy, s, r) { var c = LED[s] || LED.off, glow = s && s !== "off" ? ' filter="url(#jgGlow)"' : ""; return '<circle class="jgled" data-led="' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + (r || 2.6) + '" fill="' + c + '"' + glow + ">" + (s === "blink" ? '<animate attributeName="opacity" values="1;.25;1;1;.3;1" dur=".9s" repeatCount="indefinite"/>' : "") + "</circle>"; }
  function defs() { return '<defs><filter id="jgGlow" x="-2" y="-2" width="5" height="5"><feGaussianBlur stdDeviation="1.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><linearGradient id="jgSwG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b5d70"/><stop offset="1" stop-color="#34414f"/></linearGradient><linearGradient id="jgRtG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9cdd2"/><stop offset="1" stop-color="#9ea4ab"/></linearGradient></defs>'; }
  function rj(id, p, st, body) {
    var x = p[0], y = p[1], sel = st.sel === id, plug = st.plugged && st.plugged[id], s = '<g class="jgp" data-port="' + id + '" tabindex="-1" role="button" aria-label="Port ' + p[4] + '">';
    s += '<rect x="' + (x - 5) + '" y="' + (y - 5) + '" width="32" height="30" fill="transparent"/>';
    s += '<rect x="' + x + '" y="' + y + '" width="22" height="19" rx="1.5" fill="' + (body || "#15181c") + '" stroke="' + (sel ? "#facc15" : "#0b0d10") + '" stroke-width="' + (sel ? 3 : 1) + '"/>';
    s += '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="16" height="10" fill="#050608"/><rect x="' + (x + 8) + '" y="' + (y + 13) + '" width="6" height="3" fill="#050608"/>';
    for (var k = 0; k < 8; k++) s += '<rect x="' + (x + 4.4 + k * 1.75) + '" y="' + (y + 3.5) + '" width=".9" height="4" fill="#d4a017"/>';
    if (!st.noimg) { s += '<image href="img3d/rj' + (p[3] === "b" ? "b" : "t") + '.webp" x="' + (x - 1.5) + '" y="' + (y - 1.5) + '" width="25" height="22" preserveAspectRatio="none" pointer-events="none"/>'; if (sel) s += '<rect x="' + x + '" y="' + y + '" width="22" height="19" rx="1.5" fill="none" stroke="#facc15" stroke-width="3" pointer-events="none"/>'; }
    if (plug) s += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="18" height="15" rx="2" fill="' + plug + '" opacity=".95"/><rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="14" height="5" fill="rgba(255,255,255,.35)"/>';
    return s + "</g>";
  }
  function portLed(pid, p, st) { var s = (st.leds && st.leds[pid]) || "off"; return led(pid, p[0] + 11, p[3] === "t" ? p[1] - 5 : p[1] + 25, s); }
  function switchFront(st) {
    st = st || {}; var s = '<svg class="jgsvg" viewBox="0 0 880 90" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica,Arial,sans-serif">' + defs();
    s += '<rect x="0" y="0" width="880" height="90" rx="3" fill="url(#jgSwG)"/><rect x="0" y="0" width="22" height="90" fill="#2a3440"/><rect x="858" y="0" width="22" height="90" fill="#2a3440"/>';
    s += '<circle cx="11" cy="20" r="3.5" fill="#1b2128"/><circle cx="11" cy="70" r="3.5" fill="#1b2128"/><circle cx="869" cy="20" r="3.5" fill="#1b2128"/><circle cx="869" cy="70" r="3.5" fill="#1b2128"/>';
    s += '<g fill="#e8eef5"><text x="34" y="26" font-size="13" font-weight="700" letter-spacing="1">CISCO</text><text x="34" y="40" font-size="7.5" opacity=".85">Catalyst 2960 Series</text><text x="34" y="80" font-size="6.5" opacity=".7">WS-C2960-24TT-L</text></g>';
    s += '<path d="M36 14 v-4 M40 14 v-6 M44 14 v-4 M48 14 v-6 M52 14 v-4" stroke="#e8eef5" stroke-width="1.6"/>';
    var sl = ["SYST", "RPS", "STAT", "DUPLX", "SPEED"];
    sl.forEach(function (n, k) { var y = 18 + k * 12; s += led(k ? "sw.m" + k : "sw.syst", 128, y, k === 0 ? (st.sys || "off") : k === 2 ? (st.stat || "off") : "off", 2.4) + '<text x="134" y="' + (y + 2.5) + '" font-size="6" fill="#dfe6ee">' + n + "</text>"; });
    s += '<rect x="158" y="70" width="18" height="10" rx="3" fill="#20272f" stroke="#7b8794"/><text x="167" y="66" font-size="5.5" fill="#dfe6ee" text-anchor="middle">MODE</text>';
    s += '<text x="300" y="86" font-size="6" fill="#dfe6ee" text-anchor="middle">10/100BASE-TX</text><text x="679" y="86" font-size="6" fill="#dfe6ee" text-anchor="middle">10/100/1000</text>';
    s += '<rect x="196" y="9" width="2" height="72" fill="#2a3440"/><rect x="390" y="9" width="2" height="72" fill="#2a3440"/>';
    Object.keys(L.swf.p).forEach(function (id) { var p = L.swf.p[id]; s += rj(id, p, st) + portLed(id, p, st) + '<text x="' + (p[0] + 11) + '" y="' + (p[3] === "t" ? p[1] - 10 : p[1] + 34) + '" font-size="6.5" fill="#dfe6ee" text-anchor="middle">' + (id.charAt(0) === "f" ? id.slice(2) : id.slice(2)) + "</text>"; });
    s += '<text x="720" y="36" font-size="7" fill="#dfe6ee">Uplink</text><text x="720" y="46" font-size="6" fill="#b8c4d0">1 = Gi0/1</text><text x="720" y="56" font-size="6" fill="#b8c4d0">2 = Gi0/2</text>';
    return s + "</svg>";
  }
  function switchRear(st) {
    st = st || {}; var s = '<svg class="jgsvg" viewBox="0 0 880 90" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica,Arial,sans-serif">' + defs();
    s += '<rect x="0" y="0" width="880" height="90" rx="3" fill="#3a4654"/>';
    for (var k = 0; k < 18; k++) s += '<circle cx="' + (60 + (k % 9) * 14) + '" cy="' + (30 + Math.floor(k / 9) * 14) + '" r="4.5" fill="#20262e"/>';
    s += '<rect x="250" y="22" width="70" height="46" rx="4" fill="#1d232a"/><rect x="262" y="32" width="46" height="26" rx="3" fill="#0d1014"/><text x="285" y="80" font-size="6.5" fill="#dfe6ee" text-anchor="middle">100-240V~ 50-60 Hz</text>';
    s += '<rect x="420" y="26" width="120" height="38" rx="3" fill="#2d3742"/><text x="480" y="48" font-size="7" fill="#9fb0c2" text-anchor="middle">RPS (nefolosit)</text>';
    var p = L.swr.p.con; s += rj("con", p, st, "#78c8f0") + '<text x="' + (p[0] + 11) + '" y="' + (p[1] + 32) + '" font-size="7" fill="#9be0ff" text-anchor="middle" font-weight="700">CONSOLE</text>';
    s += '<text x="760" y="50" font-size="7" fill="#dfe6ee" text-anchor="middle">SPATELE switch-ului</text>';
    return s + "</svg>";
  }
  function routerRear(st) {
    st = st || {}; var s = '<svg class="jgsvg" viewBox="0 0 880 180" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica,Arial,sans-serif">' + defs();
    s += '<rect x="0" y="0" width="880" height="180" rx="4" fill="url(#jgRtG)"/><rect x="0" y="0" width="880" height="8" fill="#7d838a"/>';
    [[30, 22, "EHWIC 0"], [30, 98, "EHWIC 1"]].forEach(function (e) { s += '<rect x="' + e[0] + '" y="' + e[1] + '" width="300" height="64" rx="2" fill="#8d939a" stroke="#6b7178"/><circle cx="' + (e[0] + 12) + '" cy="' + (e[1] + 32) + '" r="5" fill="#5f656c"/><circle cx="' + (e[0] + 288) + '" cy="' + (e[1] + 32) + '" r="5" fill="#5f656c"/><text x="' + (e[0] + 150) + '" y="' + (e[1] + 36) + '" font-size="10" fill="#4a5056" text-anchor="middle">' + e[2] + "</text>"; });
    s += '<rect x="350" y="22" width="44" height="14" rx="2" fill="#3a3f45"/><text x="372" y="46" font-size="6" fill="#333" text-anchor="middle">CF 0</text><rect x="350" y="54" width="44" height="14" rx="2" fill="#3a3f45"/><text x="372" y="78" font-size="6" fill="#333" text-anchor="middle">CF 1</text>';
    s += '<text x="740" y="40" font-size="13" font-weight="700" fill="#2b3036">CISCO 1941</text><text x="740" y="54" font-size="7" fill="#2b3036">Integrated Services Router</text>';
    s += led("r.sys", 420, 30, st.sys || "off") + '<text x="428" y="33" font-size="6.5" fill="#222">SYS</text>';
    ["usb0", "usb1"].forEach(function (id) { var p = L.rr.p[id]; s += '<g class="jgp" data-port="' + id + '" role="button" aria-label="' + p[4] + '"><rect x="' + (p[0] - 4) + '" y="' + (p[1] - 4) + '" width="40" height="20" fill="transparent"/><rect x="' + p[0] + '" y="' + p[1] + '" width="32" height="11" rx="1" fill="#1d2126" stroke="' + (st.sel === id ? "#facc15" : "#111") + '" stroke-width="' + (st.sel === id ? 3 : 1) + '"/><rect x="' + (p[0] + 4) + '" y="' + (p[1] + 3) + '" width="24" height="4" fill="#e6e6e6"/></g>'; });
    s += '<text x="386" y="160" font-size="6" fill="#222" text-anchor="middle">USB</text>';
    var mp = L.rr.p.minicon; s += '<g class="jgp" data-port="minicon" role="button" aria-label="Consolă mini-USB"><rect x="' + (mp[0] - 4) + '" y="' + (mp[1] - 4) + '" width="30" height="18" fill="transparent"/><rect x="' + mp[0] + '" y="' + mp[1] + '" width="16" height="8" rx="2" fill="#1d2126" stroke="' + (st.sel === "minicon" ? "#facc15" : "#111") + '" stroke-width="' + (st.sel === "minicon" ? 3 : 1) + '"/></g>';
    ["con", "aux", "g0", "g1"].forEach(function (id) { var p = L.rr.p[id]; s += rj(id, p, st, id === "con" ? "#78c8f0" : id === "aux" ? "#111" : "#15181c"); });
    s += '<text x="441" y="140" font-size="6.5" fill="#0b5e86" text-anchor="middle" font-weight="700">CON</text><text x="485" y="140" font-size="6.5" fill="#222" text-anchor="middle" font-weight="700">AUX</text>';
    ["g0", "g1"].forEach(function (id, k) { var p = L.rr.p[id], ls = (st.leds && st.leds[id]) || "off"; s += led("r." + id, p[0] + 4, p[1] - 6, ls, 2.2) + led("r." + id + "s", p[0] + 18, p[1] - 6, ls === "off" ? "off" : "green", 2.2) + '<text x="' + (p[0] + 11) + '" y="140" font-size="6.5" fill="#222" text-anchor="middle" font-weight="700">GE 0/' + k + '</text><text x="' + (p[0] + 11) + '" y="96" font-size="5" fill="#333" text-anchor="middle">L    S</text>'; });
    s += '<rect x="640" y="96" width="44" height="52" rx="4" fill="#2a2e33"/><rect x="650" y="104" width="24" height="16" rx="2" fill="#111"/><text x="662" y="158" font-size="6" fill="#222" text-anchor="middle">I / O</text><rect x="700" y="96" width="56" height="52" rx="4" fill="#2a2e33"/><rect x="712" y="106" width="32" height="26" rx="3" fill="#0d0f12"/><text x="728" y="158" font-size="6" fill="#222" text-anchor="middle">100-240V~</text>';
    return s + "</svg>";
  }
  function testerSvg(main, rem, lit) {
    var s = '<svg class="jgsvg" viewBox="0 0 440 150" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica,Arial,sans-serif">' + defs();
    s += '<rect x="6" y="10" width="206" height="130" rx="12" fill="#1e293b"/><rect x="228" y="10" width="206" height="130" rx="12" fill="#1e293b"/><text x="109" y="32" font-size="11" fill="#e2e8f0" text-anchor="middle" font-weight="700">MAIN</text><text x="331" y="32" font-size="11" fill="#e2e8f0" text-anchor="middle" font-weight="700">REMOTE</text>';
    for (var k = 0; k < 8; k++) { var x1 = 30 + k * 23, x2 = 252 + k * 23; s += led("tm" + k, x1, 70, lit === k ? "green" : "off", 7) + '<text x="' + x1 + '" y="96" font-size="11" fill="#e2e8f0" text-anchor="middle">' + (k + 1) + "</text>"; s += led("tr" + k, x2, 70, lit != null && lit >= 0 && rem[lit] === k ? "green" : "off", 7) + '<text x="' + x2 + '" y="96" font-size="11" fill="#e2e8f0" text-anchor="middle">' + (k + 1) + "</text>"; }
    s += '<text x="220" y="128" font-size="10" fill="#e2e8f0" text-anchor="middle">' + (main || "") + "</text>";
    return s + "</svg>";
  }
  return { L: L, switchFront: switchFront, switchRear: switchRear, routerRear: routerRear, tester: testerSvg };
})();
/* Controale joc (joystick + butoane pe telefon, tastatură pe PC). Schiță generată cu Gemini, revizuită și corectată. */
var jgControls = function(root, opt) {
  var isMobile = (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) || ('ontouchstart' in window);
  var rafId = null;
  var keys = {};
  var joy = { active: false, id: null, x: 0, y: 0, dx: 0, dy: 0 };
  var lastMove = { dx: 0, dy: 0 };
  var buttons = {};
  var labels = opt.labels || {};
  var enabled = { act: true, plug: true, zoom: true, con: true, menu: true, tab: true, prev: true, next: true };

  if (!document.getElementById('jgCtlCss')) {
    var style = document.createElement('style');
    style.id = 'jgCtlCss';
    style.innerHTML = 
      '.jgc-root { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; font-family: sans-serif; user-select: none; -webkit-user-select: none; z-index: 9999; }' +
      '.jgc-btn { position: absolute; pointer-events: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%; color: #fff; text-align: center; cursor: pointer; transition: transform 0.1s, opacity 0.2s; background: rgba(17,24,39,0.55); border: 1px solid rgba(255,255,255,0.2); }' +
      '.jgc-btn:active { transform: scale(0.92); background: rgba(17,24,39,0.8); }' +
      '.jgc-btn-label { position: absolute; left: 50%; bottom: -8px; transform: translateX(-50%); font-size: 11px; line-height: 14px; font-weight: bold; white-space: nowrap; overflow: visible; padding: 0 6px; border-radius: 8px; background: rgba(17,24,39,0.88); border: 1px solid rgba(255,255,255,0.28); letter-spacing: -0.1px; } .jgc-btn-label:empty { display: none; } .jgc-btn { overflow: visible; } .jgc-btn-act .jgc-btn-label { font-size: 12px; }' +
      '.jgc-joy-base { position: absolute; width: 120px; height: 120px; background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; bottom: calc(16px + env(safe-area-inset-bottom)); left: calc(16px + env(safe-area-inset-left)); pointer-events: auto; touch-action: none; }' +
      '.jgc-joy-knob { position: absolute; width: 56px; height: 56px; background: rgba(255,255,255,0.4); border: 2px solid #fff; border-radius: 50%; left: 50%; top: 50%; margin: -28px 0 0 -28px; pointer-events: none; }' +
      '.jgc-btn-act { width: 76px; height: 76px; right: calc(24px + env(safe-area-inset-right)); bottom: calc(48px + env(safe-area-inset-bottom)); }' +
      '.jgc-btn-plug { width: 60px; height: 60px; right: calc(110px + env(safe-area-inset-right)); bottom: calc(40px + env(safe-area-inset-bottom)); }' +
      '.jgc-btn-zoom { width: 60px; height: 60px; right: calc(100px + env(safe-area-inset-right)); bottom: calc(120px + env(safe-area-inset-bottom)); }' +
      '.jgc-btn-con { width: 60px; height: 60px; right: calc(20px + env(safe-area-inset-right)); bottom: calc(140px + env(safe-area-inset-bottom)); }' +
      '.jgc-btn-menu { width: 48px; height: 48px; top: calc(8px + env(safe-area-inset-top)); right: calc(16px + env(safe-area-inset-right)); }' +
      '.jgc-legend { position: absolute; bottom: calc(10px + env(safe-area-inset-bottom)); left: 10px; color: rgba(255,255,255,0.7); font-size: 11px; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px; pointer-events: none; }' +
      '.jgc-hidden { display: none !important; } .jgc-ic{font-size:24px;line-height:1} .jgc-btn-act .jgc-ic{font-size:30px}';
    document.head.appendChild(style);
  }

  var container = document.createElement('div');
  container.className = 'jgc-root';
  root.appendChild(container);

  var joyBase = document.createElement('div');
  joyBase.className = 'jgc-joy-base' + (isMobile ? '' : ' jgc-hidden');
  var joyKnob = document.createElement('div');
  joyKnob.className = 'jgc-joy-knob';
  joyBase.appendChild(joyKnob);
  container.appendChild(joyBase);

  var legend = document.createElement('div');
  legend.className = 'jgc-legend' + (isMobile ? ' jgc-hidden' : '');
  legend.innerText = 'W A S D mers · săgeți ←→ / mouse rotire · E folosește · F conectează · Z zoom · C consolă · Tab următorul · Esc meniu';
  container.appendChild(legend);

  function createBtn(id, emoji, className) {
    var b = document.createElement('div');
    b.className = 'jgc-btn ' + className + (isMobile ? '' : ' jgc-hidden');
    var icon = document.createElement('div');
    icon.className = 'jgc-ic'; icon.textContent = emoji;
    var lbl = document.createElement('div');
    lbl.className = 'jgc-btn-label';
    lbl.innerText = labels[id] || '';
    b.appendChild(icon);
    b.appendChild(lbl);
    b.setAttribute('role', 'button'); b.setAttribute('aria-label', labels[id] || id);
    b.onpointerdown = function(e) { e.preventDefault();
      if (!enabled[id]) return;
      if (navigator.vibrate) navigator.vibrate(10);
      opt.onAction(id);
      e.stopPropagation();
    };
    container.appendChild(b);
    buttons[id] = { el: b, lbl: lbl };
  }

  createBtn('act', '✊', 'jgc-btn-act');
  createBtn('plug', '🔌', 'jgc-btn-plug');
  createBtn('zoom', '🔍', 'jgc-btn-zoom');
  createBtn('con', '⌨️', 'jgc-btn-con');
  createBtn('menu', '☰', 'jgc-btn-menu'); buttons.menu.el.classList.remove('jgc-hidden');

  function getIsTyping() {
    var el = document.activeElement;
    if (!el) return false;
    var tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  }

  function handleKey(e) {
    var typing = getIsTyping();
    var code = e.keyCode;
    if (code === 27) { // Esc
      if (typing) document.activeElement.blur();
      opt.onAction('menu');
      return;
    }
    if (typing) return;
    var down = e.type === 'keydown';
    if (code === 9 || (code >= 37 && code <= 40)) e.preventDefault();
    keys[code] = down;

    if (down && !e.repeat) {
      if (code === 69) opt.onAction('act'); // E
      if (code === 70 || code === 80) opt.onAction('plug'); // F, P
      if (code === 90) opt.onAction('zoom'); // Z
      if (code === 67) opt.onAction('con'); // C
      if (code === 81) opt.onAction('prev'); // Q
      if (code === 82) opt.onAction('next'); // R
      if (code === 9) { // Tab
        e.preventDefault();
        opt.onAction(e.shiftKey ? 'prev' : 'tab');
      }
    }
  }

  function blurAll() { keys = {}; }
  window.addEventListener('keydown', handleKey);
  window.addEventListener('keyup', handleKey);
  window.addEventListener('blur', blurAll);

  joyBase.onpointerdown = function(e) {
    joy.active = true;
    joy.id = e.pointerId;
    joyBase.setPointerCapture(e.pointerId);
    updateJoy(e);
  };
  joyBase.onpointermove = function(e) {
    if (joy.active && e.pointerId === joy.id) updateJoy(e);
  };
  joyBase.onpointerup = joyBase.onpointercancel = function(e) {
    if (e.pointerId === joy.id) {
      joy.active = false;
      joy.id = null;
      joy.dx = 0; joy.dy = 0;
      joyKnob.style.transform = 'translate(0,0)';
    }
  };

  function updateJoy(e) {
    var rect = joyBase.getBoundingClientRect();
    var cx = rect.left + 60, cy = rect.top + 60;
    var dx = e.clientX - cx, dy = e.clientY - cy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var max = 60;
    if (dist > max) { dx *= max / dist; dy *= max / dist; }
    joyKnob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    var nx = dx / max, ny = dy / max;
    var dead = 0.15;
    joy.dx = Math.abs(nx) < dead ? 0 : nx;
    joy.dy = Math.abs(ny) < dead ? 0 : ny;
  }

  function loop() {
    var dx = 0, dy = 0, src = 'keys', tr = 0;
    if (joy.active) {
      dx = joy.dx; dy = joy.dy; src = 'joy';
    } else {
      if (keys[87]) dy -= 1; // W
      if (keys[83]) dy += 1; // S
      if (keys[65]) dx -= 1; // A
      if (keys[68]) dx += 1; // D
      if (keys[38]) dy -= 1; if (keys[40]) dy += 1; // săgeți sus/jos = înainte/înapoi
      if (keys[37]) tr -= 1; if (keys[39]) tr += 1; // săgeți stânga/dreapta = rotire
      dy = Math.max(-1, Math.min(1, dy));
      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
    }
    if (dx !== lastMove.dx || dy !== lastMove.dy || tr !== lastMove.tr || dx !== 0 || dy !== 0 || tr !== 0) {
      opt.onMove(dx, dy, src, tr);
      lastMove.dx = dx; lastMove.dy = dy; lastMove.tr = tr;
    }
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);

  return {
    destroy: function() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey); window.removeEventListener('blur', blurAll);
      if (container.parentNode) container.parentNode.removeChild(container);
    },
    setEnabled: function(name, bool) {
      enabled[name] = bool;
      if (buttons[name]) buttons[name].el.style.opacity = bool ? '1' : '0.3';
    },
    setLabel: function(name, text) {
      if (buttons[name]) buttons[name].lbl.innerText = text;
    },
    show: function(bool) {
      container.classList.toggle('jgc-hidden', !bool);
    }
  };
};
/* ===================== 🎮 JOC PRACTIC STS – logica jocului ===================== */
var JG = (function () {
  "use strict";
  var B = null, root = null, G = null, V3 = null, CTL = null, PANEL = null, tickT = 0, sayT = 0, timerT = 0;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function now() { return Date.now(); }
  /* ---------- biletele (3 variante, ca la examen) ---------- */
  /* ---------- biletele: generate aleator la fiecare simulare (3 variante trase la start, ca la examen) ---------- */
  function mkRng(seed) { var a = (seed >>> 0) || 1; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function i2ip(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join("."); }
  var HOSTS = ["SW1", "SW-STS", "S1", "SW-BC", "SW-LAB", "SW-ETAJ1", "BC-SW01", "SWITCH-A", "SW-ACCES", "S-BACAU"], VN = ["MGMT", "ADMIN", "STS", "TEHNIC", "BIROU", "LAB", "SERVICIU", "DATE", "ADMINISTRARE", "CONTROL"], DOMS = ["sts.ro", "sts.local", "bacau.sts.ro", "stsbc.ro", "lab.sts.ro", "exam.local", "retea.sts.ro"], USERS = ["admin", "tehnic", "operator", "student", "cisco", "sts", "candidat"], PW = ["Cisco", "Sts", "Bacau", "Retea", "Parola", "Admin"];
  var FAULTS = { shutPort: "Portul laptopului era oprit (administratively down) → no shutdown pe el", speed: "PuTTY era salvat pe altă viteză decât 9600 → caractere ciudate până pui 9600", rtrBad: "Routerul avea deja altă adresă pe interfață (și era oprit) → ip address corect + no shutdown", upVlan: "Portul spre router era într-un VLAN greșit → switchport access vlan corect" };
  function genVar(seed, n) {
    var r = mkRng(seed), pk = function (a) { return a[Math.floor(r() * a.length)]; }, ri = function (lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); };
    var vlan; do { vlan = ri(2, 999); } while (vlan >= 1002); if (r() < 0.4) vlan = pk([10, 20, 30, 40, 50, 99, 100]);
    var pre = pk([24, 24, 24, 25, 26, 27, 28]), sz = Math.pow(2, 32 - pre), base;
    var fam = ri(0, 2); if (fam === 0) base = (192 << 24 | 168 << 16 | ri(0, 254) << 8) >>> 0; else if (fam === 1) base = (10 << 24 | ri(0, 254) << 16 | ri(0, 254) << 8) >>> 0; else base = (172 << 24 | ri(16, 31) << 16 | ri(0, 254) << 8) >>> 0;
    base = (base + Math.floor(r() * (256 / sz)) * sz) >>> 0;
    var hosts = sz - 2, used = {}, pickH = function (pref) { var h = pref; if (!h || used[h]) do { h = ri(1, hosts); } while (used[h]); used[h] = 1; return (base + h) >>> 0; };
    var gw = pickH(r() < 0.6 ? 1 : r() < 0.5 ? hosts : 0), svi = pickH(r() < 0.5 ? 2 : 0), pc = pickH(r() < 0.4 ? 10 : 0);
    var mask = i2ip((0xFFFFFFFF << (32 - pre)) >>> 0), port = ri(1, 24), up = ri(1, 2), rg = ri(0, 1), com = ri(3, 8);
    var o = { n: n || 1, seed: seed, host: pk(HOSTS), vlan: vlan, vname: pk(VN), port: "FastEthernet0/" + port, pshort: "Fa0/" + port, svi: i2ip(svi), gw: i2ip(gw), pc: i2ip(pc), mask: mask, pre: pre, net: i2ip(base),
      dom: pk(DOMS), user: pk(USERS), pass: pk(PW) + ri(10, 9999), up: "GigabitEthernet0/" + up, upa: "sw.gi" + up, upshort: "Gi0/" + up, rif: "GigabitEthernet0/" + rg, ra: "r.g" + rg, rshort: "G0/" + rg, com: com, rcom: com + 1,
      ord: r(), opt: { ident: r() < 0.7, fiber: r() < 0.5 }, faults: [] };
    var V = o; o.tr = "sw.gi" + (3 - up); var v2; do { v2 = ri(2, 999); } while (v2 === vlan || v2 >= 1002); o.vlan2 = v2; o.vname2 = pk(VN.filter(function (x) { return x !== o.vname; }));
    var b2 = (base ^ 0x100) >>> 0; o.net2 = i2ip(b2); o.gw2 = i2ip((b2 + (gw - base)) >>> 0); o.s2ip = i2ip(pickH(0)); o.en = pk(["Cl4s4", "Secret", "Enable", "Priv"]) + ri(10, 999); o.conpw = pk(["Cons", "Linie", "Port"]) + ri(10, 999); o.motd = pk(["Acces autorizat doar personalului STS", "Acces interzis persoanelor neautorizate", "Echipament STS - acces monitorizat"]);
    var fr = -(ri(30, 120) / 10), dirty = 3 + ri(2, 15) / 10, clean = ri(6, 25) / 10; o.fb = { wl: pk([1310, 1550]), ref: fr, dirty: dirty, clean: clean, budget: 3 }; return o;
  }
  function addFaults(V, seed) { var r = mkRng(seed ^ 0x5f3759df), ks = Object.keys(FAULTS), out = []; while (out.length < 2) { var k = ks[Math.floor(r() * ks.length)]; if (out.indexOf(k) < 0) out.push(k); } V.faults = out; return V; }
  function seed0() { return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0; }
  function draw3(diff) { var s = seed0(); return [0, 1, 2].map(function (i) { var V = genVar((s + i * 7919) >>> 0, i + 1); if (diff === "greu") addFaults(V, V.seed); return V; }); }
  var CAB = {
    straight: { n: "Cablu drept UTP (T568B – T568B)", c: "#2563eb", ic: "🔵", why: "Drept = aceeași schemă la ambele capete. Leagă echipamente DIFERITE: laptop/PC → switch, switch → router." },
    cross: { n: "Cablu crossover (T568A – T568B)", c: "#eab308", ic: "🟡", why: "Crossover = perechile 1-2 și 3-6 inversate. Clasic pentru echipamente de ACELAȘI fel (switch–switch, PC–PC). Azi auto-MDIX îl face să meargă oriunde, dar la examen se cere cel corect." },
    roll: { n: "Cablu rollover / consolă (RJ45 – DB9, albastru deschis, plat)", c: "#7dd3fc", ic: "🩵", why: "Rollover = firele în ordine inversă (1↔8). Se pune în portul CONSOLE și la laptop în portul serial (DB9) – azi prin adaptor USB-serial. Nu transportă date de rețea." },
    usb: { n: "Cablu consolă USB – RJ45", c: "#111827", ic: "⚫", why: "Varianta modernă a cablului de consolă: USB în laptop, RJ45 în portul CONSOLE. În Windows apare ca port COM (Device Manager → Ports)." }
  };
  var PN = { "pc.lan": "Laptop – placa de rețea (RJ45)", "pc.usb": "Laptop – USB 1", "pc.usb2": "Laptop – USB 2", "sw.con": "Switch – CONSOLE", "r.con": "Router – CON", "sw.gi1": "Switch – Gi0/1", "sw.gi2": "Switch – Gi0/2", "r.g0": "Router – GE 0/0", "r.g1": "Router – GE 0/1", "r.aux": "Router – AUX", "r.usb0": "Router – USB 0", "r.usb1": "Router – USB 1", "r.minicon": "Router – consolă mini-USB" };
  function pname(a) { if (PN[a]) return PN[a]; var m = /^sw\.fa(\d+)$/.exec(a); if (m) return "Switch – Fa0/" + m[1]; if ((m = /^s2\.fa(\d+)$/.exec(a))) return "SW2 – Fa0/" + m[1]; if ((m = /^s2\.gi(\d)$/.exec(a))) return "SW2 – Gi0/" + m[1]; if (a === "s2.con") return "SW2 – CONSOLE"; return a; }
  function ifOf(a) { var m; if ((m = /^sw\.fa(\d+)$/.exec(a))) return "FastEthernet0/" + m[1]; if (a === "sw.gi1") return "GigabitEthernet0/1"; if (a === "sw.gi2") return "GigabitEthernet0/2"; if ((m = /^s2\.fa(\d+)$/.exec(a))) return "FastEthernet0/" + m[1]; if (a === "s2.gi1") return "GigabitEthernet0/1"; if (a === "s2.gi2") return "GigabitEthernet0/2"; if (a === "r.g0") return "GigabitEthernet0/0"; if (a === "r.g1") return "GigabitEthernet0/1"; return null; }
  function anchorOfIf(n) { var m; if ((m = /^FastEthernet0\/(\d+)$/.exec(n))) return "sw.fa" + m[1]; return n === "GigabitEthernet0/1" ? "sw.gi1" : n === "GigabitEthernet0/2" ? "sw.gi2" : null; }
  /* ---------- sunete realiste (folosesc mute-ul aplicației) ---------- */
  var SFX = {
    click: function () { B.tone([[1800, 0, 0.012, "square"], [900, 0.012, 0.02, "square"]]); },
    plug: function () { B.tone([[2400, 0, 0.01, "square"], [1200, 0.01, 0.03, "square"], [500, 0.04, 0.02, "triangle"]]); },
    crimp: function () { B.tone([[140, 0, 0.12, "sawtooth"], [90, 0.1, 0.14, "sawtooth"], [2600, 0.24, 0.015, "square"]]); },
    beep: function () { B.tone([[1000, 0, 0.08, "square"]]); },
    step: function () { B.tone([[110, 0, 0.03, "triangle"]]); },
    key: function () { B.tone([[2000 + Math.random() * 600, 0, 0.008, "square"]]); },
    ok: function () { B.SND.ok(); }, bad: function () { B.SND.bad(); }, done: function () { B.SND.done(); }
  };
  /* ---------- starea jocului ---------- */
  function newState(mode, mis, V) {
    var S = B.gxSession({}); if (!V || typeof V !== "object") { V = genVar(seed0(), 1); if (DIFF === "greu" && (mode === "exam" || mode === "story")) addFaults(V, V.seed); }
    var st = { mode: mode, mis: mis, V: V, S: S, cab: [], carry: null, led: {}, linkT: {}, act: {}, fast: false, hints: 0, err: 0, t0: now(), dl: 0, obj: [], done: {}, log: [], putty: { type: "ssh", line: "COM1", speed: "9600", host: "", port: "22" }, con: null, crimp: null, fiber: null, ident: null, theory: null, story: null, lv: "prac", res: {}, scored: false };
    ["sw", "r"].forEach(function (d) { var s = S[d]; s.unpl = {}; Object.keys(s.ifs).forEach(function (n) { if (!/^Vlan/.test(n)) s.unpl[n] = 1; }); });
    S.pc.ip = "169.254.12.7"; S.pc.mask = "255.255.0.0"; S.pc.gw = ""; S.pc.dhcp = true; S.pc.dns = "";
    var L = S.pc, sw = S.sw, rr = S.r, s0 = L.ssh; st.putty.speed = "9600";
    L.reach = function (ip) { return pcReach(st, ip); }; L.dhcpGet = function () { var g = dhcpGet(st); if (g) L.ipFrom = "dhcp"; return g; };
    L.ssh = function (user, host) { return s0(user, host).map(function (x) { return String(x).replace(/portului Fa0\/1/g, "portului " + V.pshort).replace(/ssh -l admin /g, "ssh -l " + V.user + " "); }); };
    applyFaults(st);
    return st;
  }
  function fwd(st) { var c = lanCable(st); if (!c) return false; var a = c.a === "pc.lan" ? c.b : c.a; return st.led[a] === "green" || st.led[a] === "blink"; }
  function uplinkFwd(st) { if (!uplink(st)) return false; var a = st.V.upa; return (st.led[a] === "green" || st.led[a] === "blink") && (st.led[st.V.ra] === "green" || st.led[st.V.ra] === "blink"); }
  function applyFaults(st) { var V = st.V, f = V.faults || []; st.faultsFixed = {};
    if (f.indexOf("shutPort") >= 0) ["enable", "configure terminal", "interface " + V.port, "shutdown", "end", ""].forEach(function (c) { B.cliRun(st.S.sw, c); });
    if (f.indexOf("upVlan") >= 0) ["enable", "configure terminal", "vlan 999", "name PARCARE", "exit", "interface " + V.up, "switchport mode access", "switchport access vlan 999", "end", ""].forEach(function (c) { B.cliRun(st.S.sw, c); });
    if (f.indexOf("rtrBad") >= 0) { var p = V.gw.split("."); p[3] = String((+p[3] + 3) % 254 + 1); ["enable", "configure terminal", "interface " + V.rif, "ip address " + p.join(".") + " 255.255.255.252", "shutdown", "end", ""].forEach(function (c) { B.cliRun(st.S.r, c); }); }
    if (f.indexOf("speed") >= 0) st.putty.speed = "115200";
    ["sw", "r"].forEach(function (d) { var s = st.S[d]; s.mode = "user"; s.hist = []; s.did = {}; s.saved = false; }); }
  function cableAt(st, a) { for (var i = 0; i < st.cab.length; i++) if (st.cab[i].a === a || st.cab[i].b === a) return st.cab[i]; return null; }
  function other(c, a) { return c.a === a ? c.b : c.a; }
  function lanCable(st) { var c = cableAt(st, "pc.lan"); if (!c) return null; var o = other(c, "pc.lan"); return /^sw\.(fa|gi)/.test(o) && (c.t === "straight" || c.t === "cross") ? c : null; }
  function conCable(st, dev) { var c = cableAt(st, dev + ".con"); if (!c) return null; var o = other(c, dev + ".con"); return /^pc\.usb/.test(o) && (c.t === "usb" || c.t === "roll") ? c : null; }
  function comOf(st, dev) { var c = conCable(st, dev); if (!c) return ""; return "COM" + (other(c, dev + ".con") === "pc.usb" ? st.V.com : st.V.rcom); }
  function uplink(st) { var c = cableAt(st, st.V.ra); if (!c) return null; var o = other(c, st.V.ra); return o === st.V.upa && (c.t === "straight" || c.t === "cross") ? c : null; }
  /* ---------- LED-uri și legături (ca pe echipamentul real) ---------- */
  function partnerUp(st, a, c) { var o = other(c, a); if (c.t === "usb" || c.t === "roll") return false; if (o === "pc.lan") return true; if (/^r\.g/.test(o)) { var f = st.S.r.ifs[ifOf(o)]; return f && !f.shut; } if (/^s2\./.test(o)) { var h = st.S.s2 && st.S.s2.ifs[ifOf(o)]; return h && !h.shut; } if (/^sw\./.test(o)) { var g = st.S.sw.ifs[ifOf(o)]; return g && !g.shut; } return false; }
  function linkTick() {
    if (!G) return; var st = G, t = now(), sw = st.S.sw, r = st.S.r, chg = false, msgs = [];
    var ports = []; for (var i = 1; i <= 24; i++) ports.push("sw.fa" + i); ports.push("sw.gi1", "sw.gi2", "r.g0", "r.g1"); if (st.S.s2) { for (var j = 1; j <= 24; j++) ports.push("s2.fa" + j); ports.push("s2.gi1", "s2.gi2"); }
    ports.forEach(function (a) {
      var dev = a.indexOf("s2.") === 0 ? st.S.s2 : a.charAt(0) === "s" ? sw : r, n = ifOf(a), f = dev.ifs[n], c = cableAt(st, a), up = !!(c && f && !f.shut && (c.t === "straight" || c.t === "cross") && partnerUp(st, a, c)), was = !dev.unpl[n], s;
      if (up && !st.linkT[a]) { st.linkT[a] = t; }
      if (!up && st.linkT[a]) delete st.linkT[a];
      if (up && !was) { delete dev.unpl[n]; msgs.push([dev, "%LINK-3-UPDOWN: Interface " + n + ", changed state to up"]); setTimeout(function () { if (G === st && !dev.unpl[n]) conMsg(dev, "%LINEPROTO-5-UPDOWN: Line protocol on Interface " + n + ", changed state to up"); }, 1200); chg = true; }
      if (!up && was) { dev.unpl[n] = 1; if (f && !f.shut) { msgs.push([dev, "%LINEPROTO-5-UPDOWN: Line protocol on Interface " + n + ", changed state to down"]); msgs.push([dev, "%LINK-3-UPDOWN: Interface " + n + ", changed state to down"]); } chg = true; }
      if (!up) s = "off"; else if (dev === r) s = st.act[a] && t - st.act[a] < 1500 ? "blink" : "green"; else { var stp = (t - st.linkT[a]) * (st.fast ? 10 : 1); s = stp < 30000 ? "amber" : (st.act[a] && t - st.act[a] < 1500 ? "blink" : "green"); }
      if (st.led[a] !== s) { st.led[a] = s; chg = true; if (V3) V3.setLed(a, s); }
    });
    var lc = lanCable(st); st.S.pcPort = lc ? ifOf(other(lc, "pc.lan")) : "none"; sw.cport = st.S.pcPort !== "none" ? st.S.pcPort : "";
    var sys = "green"; if (V3) { V3.setLed("sw.syst", sys); V3.setLed("r.sys", sys); }
    msgs.forEach(function (m) { conMsg(m[0], m[1]); });
    if (chg) { if (PANEL && PANEL.id === "rack") paintRack(); checkObj(); }
    hudTimer();
  }
  function conMsg(dev, line) { if (G && G.con && G.con.dev === dev && G.con.tb && G.con.awake) { G.con.tb.add(line, "thint"); G.con.tb.paint(); } }
  /* ---------- obiective și scor ---------- */
  function setObj(list) { G.obj = list; G.done = {}; G.oi = 0; checkObj(true); }
  function checkObj(silent) {
    if (!G || !G.obj) return; var st = G, nw = [];
    st.obj.forEach(function (o, i) { var ok = false; try { ok = !!o.ok(st); } catch (e) { ok = false; } if (ok && !st.done[i]) { st.done[i] = now(); nw.push(o); } });
    if (nw.length && !silent) { var o = nw[nw.length - 1]; SFX.ok(); learn("✅ " + o.t, o.why); if (st.mode !== "exam") say(o.say || "Corect. " + (o.why ? o.why.split(".")[0] + "." : ""), 3500); }
    paintObj();
    var all = st.obj.length && st.obj.every(function (o, i) { return st.done[i]; });
    if (all && !st.fin && (st.mode === "mis" || st.mode === "replay")) { st.fin = 1; setTimeout(function () { if (G === st) (st.mode === "replay" ? replayEnd : missionDone)(false); }, 900); }
  }
  function curObj() { if (!G || !G.obj) return null; for (var i = 0; i < G.obj.length; i++) if (!G.done[i]) return G.obj[i]; return null; }
  function learn(t, why) { G.log.unshift([t, why || ""]); if (G.log.length > 40) G.log.length = 40; var l = $("jgLog"); if (l) paintLog(); }
  function mistake(msg, why, key) { G.err++; var ek = key && G.obj && G.obj.some(function (o) { return o.k === key; }) ? key : errKey(); if (ek) { G.errK = G.errK || {}; G.errK[ek] = 1; } SFX.bad(); say("Atenție! " + msg, 5000, true); if (why) learn("❌ " + msg, why); }
  /* ---------- HUD ---------- */
  function say(t, ms, warn) { var b = $("jgSay"); if (!b) return; b.innerHTML = '<b>' + (G && G.lv === "out" ? "🪖 Paznicul" : G && G.lv === "hall" ? "🧑‍💼 Recepția" : "🎖️ Examinatorul") + ":</b> " + esc(t); b.className = "jgsay on" + (warn ? " warn" : ""); clearTimeout(sayT); sayT = setTimeout(function () { b.className = "jgsay"; }, ms || 4500); if (V3) V3.say(); }
  function paintObj() { var o = curObj(), e = $("jgObj"); if (!e) return; var n = G.obj ? G.obj.length : 0, d = Object.keys(G.done).length; e.innerHTML = o ? "<b>" + (d + 1) + "/" + n + "</b> " + esc(o.t) : n ? "✅ Toate cerințele bifate" : esc(G.goal || ""); }
  function paintLog() { var l = $("jgLog"); if (l) l.innerHTML = G.log.slice(0, 8).map(function (x) { return "<li><b>" + esc(x[0]) + "</b>" + (x[1] ? "<br><span>" + esc(x[1]) + "</span>" : "") + "</li>"; }).join(""); }
  function hudTimer() { var e = $("jgTime"); if (!e || !G) return; if (G.dl) { var left = Math.max(0, G.dl - (G.pz || now())), m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60; e.textContent = (G.pz ? "⏸ " : "⏱ ") + m + ":" + (s < 10 ? "0" : "") + s + (DIFF === "greu" ? " · Greu" : ""); e.className = "jgtime" + (left < 300000 ? " low" : ""); [600000, 300000, 60000].forEach(function (w) { if (left <= w && !G["w" + w]) { G["w" + w] = 1; say("Mai aveți " + (w / 60000) + (w === 60000 ? " minut." : " minute."), 4000); } }); if (left <= 0 && !G.scored) { say("Timpul a expirat! Lăsați echipamentele.", 5000, true); timeUp(); } } else e.textContent = ""; }
  function hint() { var o = curObj(); if (!o) return; G.hints++; G.errK = G.errK || {}; G.errK[o.k] = 1; say("Indiciu: " + o.hint, 9000); learn("💡 " + o.t, o.hint); }
  /* ---------- configurații gata făcute (pentru misiunile care încep de la mijloc) ---------- */
  function preCable(st, which) {
    which.forEach(function (w) {
      if (w === "con") addCable(st, "usb", "pc.usb", "sw.con", true);
      if (w === "lan") addCable(st, "straight", "pc.lan", anchorOfIf(st.V.port), true);
      if (w === "up") addCable(st, "straight", st.V.upa, st.V.ra, true);
      if (w === "rcon") addCable(st, "usb", "pc.usb2", "r.con", true);
    });
    Object.keys(st.linkT).forEach(function (k) { st.linkT[k] -= 40000; });
  }
  function cfgSwitch(st, full) {
    var V = st.V, c = ["enable", "configure terminal", "hostname " + V.host, "vlan " + V.vlan, "name " + V.vname, "exit", "interface " + V.port, "switchport mode access", "switchport access vlan " + V.vlan, "exit", "interface vlan " + V.vlan, "ip address " + V.svi + " " + V.mask, "no shutdown", "exit"];
    if (full) c = c.concat(["ip domain-name " + V.dom, "crypto key generate rsa modulus 1024", "username " + V.user + " secret " + V.pass, "line vty 0 4", "login local", "transport input ssh", "exit", "interface " + V.up, "switchport mode access", "switchport access vlan " + V.vlan, "exit"]);
    c.push("end", "copy running-config startup-config", "");
    c.forEach(function (x) { B.cliRun(st.S.sw, x); }); st.S.sw.mode = "user"; st.S.sw.hist = []; st.S.sw.did = {};
  }
  function cfgRouter(st) { ["enable", "configure terminal", "hostname R1", "interface " + st.V.rif, "ip address " + st.V.gw + " " + st.V.mask, "no shutdown", "end", "copy running-config startup-config", ""].forEach(function (x) { B.cliRun(st.S.r, x); }); st.S.r.mode = "user"; st.S.r.hist = []; st.S.r.did = {}; }
  function pcStatic(st) { var L = st.S.pc; L.dhcp = false; L.ip = st.V.pc; L.mask = st.V.mask; L.gw = st.V.gw; }
  /* ---------- verificări pe starea reală a echipamentelor ---------- */
  function swS(st) { return st.S.sw; }
  var CK = {
    conSw: function (st) { return !!conCable(st, "sw"); },
    lan: function (st) { var c = lanCable(st); return !!c && c.t === "straight" && other(c, "pc.lan") === anchorOfIf(st.V.port); },
    up: function (st) { var c = uplink(st); return !!c && c.t === "straight"; },
    lanGreen: function (st) { return fwd(st); },
    putCom: function (st) { return st.con && st.con.dev === st.S.sw && st.con.open; },
    awake: function (st) { return st.con && st.con.awake && st.con.dev === st.S.sw; },
    en: function (st) { return st.con && st.con.dev === st.S.sw && /#$/.test(B.cliPrompt(st.S.sw)); },
    host: function (st) { return swS(st).host === st.V.host; },
    vlan: function (st) { return swS(st).vlans && swS(st).vlans[st.V.vlan] === st.V.vname; },
    acc: function (st) { var f = swS(st).ifs[st.V.port]; return f && !f.shut && f.mode === "access" && f.vlan === st.V.vlan; },
    svi: function (st) { var f = swS(st).ifs["Vlan" + st.V.vlan]; return f && f.ip === st.V.svi && f.mask === st.V.mask && !f.shut; },
    dom: function (st) { return swS(st).dom === st.V.dom; },
    rsa: function (st) { return swS(st).rsa >= 1024; },
    user: function (st) { var u = swS(st).users[st.V.user]; return !!u && u.t === "secret"; },
    vty: function (st) { var l = swS(st).line.vty; return l.local && l.tin === "ssh"; },
    save: function (st) { var s = swS(st); return !!s.saved && B.cfgEq(s); },
    rcon: function (st) { return !!conCable(st, "r"); },
    rip: function (st) { var f = st.S.r.ifs[st.V.rif]; return f && f.ip === st.V.gw && f.mask === st.V.mask; },
    rns: function (st) { var f = st.S.r.ifs[st.V.rif]; return f && !f.shut; },
    upAcc: function (st) { var f = swS(st).ifs[st.V.up]; return f && !f.shut && f.mode !== "trunk" && f.vlan === st.V.vlan; },
    upGreen: function (st) { return st.led[st.V.ra] === "green" || st.led[st.V.ra] === "blink"; },
    pingGw: function (st) { var d = st.S.pc.did; return !!(d.ping && d.ping[st.V.gw]); },
    pcIp: function (st) { var L = st.S.pc; return !L.dhcp && L.ip === st.V.pc && L.mask === st.V.mask && L.gw === st.V.gw; },
    ipcfg: function (st) { return !!st.S.pc.did.ip || !!st.S.pc.did.ipall; },
    pingSw: function (st) { var d = st.S.pc.did; return !!(d.ping && d.ping[st.V.svi]); },
    ssh: function (st) { return !!st.S.pc.did.ssh; },
    ident: function (st) { return st.ident && st.ident.done; },
    crimp: function (st) { return st.crimp && st.crimp.passed; },
    fiber: function (st) { return st.fiber && st.fiber.done; }
  };
  function O(t, k, hint, why, say) { return { t: t, k: k, ok: CK[k], hint: hint, why: why, say: say }; }
  function MS(st) { var M = MS0(st), X = BONUS(st); Object.keys(X).forEach(function (k) { M[k] = X[k]; }); return M; }
  function MS0(st) {
    var V = st.V;
    return {
      m1: { t: "1. Identifică echipamentele", ic: "🔎", st: "rack", d: "Arată switch-ul, routerul, porturile Fa0/x, Gi0/x, G0/0, G0/1 și consola – și spune la ce folosește fiecare.", obj: [O("Răspunde la toate întrebările examinatorului la rack", "ident", "Mergi la masa cu echipamente (rack) și apasă E / Folosește. Atinge exact portul cerut.", "Switch = multe porturi la fel (LAN, adrese MAC). Router = puține porturi, leagă rețele (IP). Consola = configurare directă cu cablu de consolă.")] },
      m2: { t: "2. Mufează un cablu RJ45 (T568B) și testează-l", ic: "🔌", st: "bench", d: "Aranjezi cele 8 fire în ordinea T568B, alegi tipul cablului, sertizezi și verifici cu testerul.", obj: [O("Cablu drept T568B la ambele capete, testat (LED 1→1 … 8→8)", "crimp", "La bancul de mufare: alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro.", "T568B: „portocaliu, verde, albastru, maro” cu albul înainte, dar albastrul stă în mijloc (pinii 4–5) și verdele pe 6.")] },
      m3: { t: "3. Cablează laptopul, switch-ul și routerul", ic: "🧵", st: "box", d: "Iei cablul potrivit din cutie și îl conectezi capăt cu capăt. LED-urile trec din portocaliu în verde (STP ~30 s).", obj: [
        O("Cablu de consolă: laptop (USB) → portul CONSOLE al switch-ului", "conSw", "Din cutie ia cablul negru USB–RJ45 (sau cel albastru deschis rollover). Un capăt în USB 1 la laptop, celălalt în CONSOLE (spatele switch-ului).", "Consola e drumul direct spre switch, fără rețea – așa îl configurezi prima dată."),
        O("Cablu drept: laptop (RJ45) → switch " + V.pshort, "lan", "Ia cablul albastru (drept). Un capăt în placa de rețea a laptopului, celălalt în portul " + V.pshort + " al switch-ului.", "PC → switch = echipamente diferite = cablu drept."),
        O("Cablu drept: switch " + V.upshort + " → router " + V.rshort, "up", "Cablu albastru între portul uplink " + V.upshort + " al switch-ului și " + V.rshort + " (GE " + V.rshort.slice(1) + ") pe spatele routerului.", "Switch → router = tot cablu drept. LED-ul nu se aprinde până nu dai no shutdown pe router: porturile routerului sunt oprite din fabrică."),
        O("Așteaptă LED-ul verde pe portul laptopului (STP)", "lanGreen", "LED-ul e portocaliu ~30 s cât STP verifică să nu fie buclă. Poți apăsa „⏩ STP rapid” din meniu.", "Portocaliu = portul ascultă/învață (STP). Verde = trimite date.")] },
      m4: { t: "4. Consola: PuTTY pe COM, 9600", ic: "⌨️", st: "desk", d: "Pe laptop deschizi PuTTY → Serial → COM" + V.com + " → 9600 → Open, apeși Enter și primești Switch>.", obj: [
        O("PuTTY: Serial, portul COM corect, 9600, Open", "putCom", "Device Manager → Ports (COM & LPT) arată COM" + V.com + ". În PuTTY: Connection type = Serial, Serial line = COM" + V.com + ", Speed = 9600, apoi Open.", "9600 8N1 = viteza standard a consolei Cisco (9600 biți/s, 8 biți de date, fără paritate, 1 bit de stop)."),
        O("Apasă Enter și obține promptul Switch>", "awake", "În fereastra neagră apasă Enter (butonul ⏎ sau tasta Enter).", "> = modul utilizator: doar te uiți."),
        O("Intră în modul privilegiat (Switch#)", "en", "Scrie enable (sau en) și Enter.", "# = modul privilegiat: poți salva, vedea tot, intra în configurare.")] },
      m5: { t: "5. Configurează SSH pe switch cu VLAN " + V.vlan, ic: "🔐", st: "desk", d: "hostname, VLAN și nume, port acces, IP pe interface vlan, domeniu, chei RSA 1024, utilizator, vty doar SSH, salvare.", obj: [
        O("hostname " + V.host, "host", "configure terminal → hostname " + V.host, "Numele apare în prompt și e obligatoriu pentru cheile RSA."),
        O("vlan " + V.vlan + " cu numele " + V.vname, "vlan", "(config)# vlan " + V.vlan + " → name " + V.vname + " → exit", "VLAN = o rețea separată logic pe același switch."),
        O(V.pshort + ": switchport mode access + access vlan " + V.vlan, "acc", "interface " + V.pshort.toLowerCase() + " → switchport mode access → switchport access vlan " + V.vlan + " → exit", "Port acces = aparține unui singur VLAN; laptopul ajunge în VLAN " + V.vlan + "."),
        O("interface vlan " + V.vlan + ": ip address " + V.svi + " " + V.mask + " + no shutdown", "svi", "interface vlan " + V.vlan + " → ip address " + V.svi + " " + V.mask + " → no shutdown → exit", "SVI = adresa IP de administrare a switch-ului. Pe ea intri cu SSH."),
        O("ip domain-name " + V.dom, "dom", "(config)# ip domain-name " + V.dom, "Numele cheii RSA = hostname + domeniu, de aceea trebuie înainte de crypto key."),
        O("crypto key generate rsa (modulus 1024)", "rsa", "(config)# crypto key generate rsa → la întrebare scrie 1024 (sau direct: crypto key generate rsa modulus 1024)", "Cheile RSA pornesc serverul SSH. Minim 768 biți pentru SSH versiunea 2; 1024 e standardul la examen."),
        O("username " + V.user + " secret " + V.pass, "user", "(config)# username " + V.user + " secret " + V.pass, "Contul cu care te loghezi prin SSH. secret = parolă criptată (mai sigur decât password)."),
        O("line vty 0 4: login local + transport input ssh", "vty", "line vty 0 4 → login local → transport input ssh → exit", "vty = liniile virtuale pentru acces de la distanță. login local = cere utilizatorul local; transport input ssh = DOAR SSH, fără telnet."),
        O("copy running-config startup-config", "save", "end → copy running-config startup-config → Enter la întrebare", "running = în RAM (se pierde la restart); startup = în NVRAM. Fără salvare pierzi tot!")] },
      m6: { t: "6. Legătura switch → router și ping", ic: "🔗", st: "rack", d: "Pe router: IP pe " + V.rshort + " și no shutdown. Pe switch: " + V.upshort + " în VLAN-ul laptopului. LED verde, apoi ping de pe laptop.", obj: [
        O("Consolă pe router (al doilea cablu: laptop USB 2 → CON router)", "rcon", "Din cutie ia încă un cablu USB–RJ45: USB 2 la laptop, CON pe spatele routerului. În PuTTY routerul e pe COM" + V.rcom + ".", "Fiecare echipament se configurează prin propria consolă."),
        O("Router: interface " + V.rshort.toLowerCase() + " → ip address " + V.gw + " " + V.mask, "rip", "PuTTY COM" + V.rcom + " → enable → conf t → interface " + V.rshort.toLowerCase() + " → ip address " + V.gw + " " + V.mask, "Adresa routerului = default gateway pentru laptop."),
        O("Router: no shutdown pe " + V.rshort, "rns", "în (config-if)# scrie no shutdown", "Porturile routerului sunt OPRITE din fabrică (administratively down). Pe switch sunt pornite."),
        O("Switch: " + V.upshort + " în VLAN " + V.vlan + " (switchport access vlan " + V.vlan + ")", "upAcc", "PuTTY COM" + V.com + " → conf t → interface " + V.upshort.toLowerCase() + " → switchport mode access → switchport access vlan " + V.vlan, "Laptopul e în VLAN " + V.vlan + "; ca să ajungă la router, și portul spre router trebuie să fie în același VLAN."),
        O("LED verde pe legătura switch – router", "upGreen", "După no shutdown, LED-ul " + V.rshort + " se aprinde; pe switch " + V.upshort + " trece prin portocaliu (STP).", "Verde la ambele capete = legătură fizică bună."),
        O("Laptop: ping " + V.gw + " reușit", "pingGw", "Pe laptop: IP static " + V.pc + " / " + V.mask + ", gateway " + V.gw + "; apoi în cmd: ping " + V.gw, "Reply from = drumul laptop → switch → router funcționează.")] },
      m7: { t: "7. Comenzi pe laptop: IP static, ipconfig, ping, ssh", ic: "💻", st: "desk", d: "Setezi IP-ul din fereastra Windows, verifici cu ipconfig, ping la switch și intri prin SSH.", obj: [
        O("IP static în Windows: " + V.pc + " / " + V.mask + ", gateway " + V.gw, "pcIp", "Laptop → Setări rețea → Ethernet → Properties → Internet Protocol Version 4 → Use the following IP address.", "Laptopul trebuie să fie în aceeași rețea cu switch-ul (" + V.svi + ")."),
        O("cmd: ipconfig", "ipcfg", "Deschide Command Prompt și scrie ipconfig", "ipconfig arată IP-ul, masca și gateway-ul laptopului."),
        O("cmd: ping " + V.svi, "pingSw", "În cmd: ping " + V.svi, "Reply from " + V.svi + " = laptopul vede switch-ul."),
        O("cmd: ssh -l " + V.user + " " + V.svi, "ssh", "În cmd: ssh -l " + V.user + " " + V.svi + " (parola: " + V.pass + ")", "Dacă intri, SSH-ul de pe switch e configurat corect – exact ce verifică examinatorul.")] },
      m9: { t: "9. Fibră optică: conectori și măsurare dBm", ic: "💡", st: "fiber", d: "Recunoști UPC (albastru) / APC (verde), SC / LC, faci referința și calculezi atenuarea.", obj: [O("Exercițiul de la bancul de fibră", "fiber", "Mergi la bancul de fibră optică. Atenuare = Pref − Pmăsurat (în dB).", "dBm = putere față de 1 mW. Pierderea în dB se obține scăzând două valori în dBm.")] }
    };
  }
  var MEX = ["m2", "m3", "m4", "m5", "m6", "m7"], MBON = ["m1", "m9", "b1", "b2", "b3", "b4", "b5"], MORDER = MEX.concat(MBON);
  function faultRep(st) { var f = st.V.faults || []; if (!f.length) return ""; return "<p><b>Defecte ascunse (Greu):</b></p><ul class='jgol'>" + f.map(function (k) { return "<li>⚠️ " + esc(FAULTS[k]) + "</li>"; }).join("") + "</ul>"; }
  function mmss(ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function setupMission(st, id) { if (/^b/.test(id)) return setupBonus(st, id);
    if (id === "m4") preCable(st, ["con", "lan", "up"]);
    if (id === "m5") { preCable(st, ["con", "lan", "up"]); openConsoleSilently(st); }
    if (id === "m6") { preCable(st, ["con", "lan", "up"]); cfgSwitch(st, false); pcStatic(st); }
    if (id === "m7") { preCable(st, ["con", "lan", "up"]); cfgSwitch(st, true); cfgRouter(st); }
  }
  function openConsoleSilently(st) { st.putty = { type: "serial", line: "COM" + st.V.com, speed: "9600", host: "", port: "22" }; st.con = { dev: st.S.sw, open: true, awake: true, title: "COM" + st.V.com + " - PuTTY", kind: "serial", speed: "9600", lines: [] }; B.cliRun(st.S.sw, "enable"); }
  function missionScore(st) { return Math.max(4, Math.round((10 - st.hints * 0.5 - st.err * 0.25) * 10) / 10); }
  function missionDone() {
    var st = G; if (!st || st.scored) return; st.scored = true; var sc = missionScore(st), id = st.mis, P = B.P(); P.cli = P.cli || {};
    P.cli["jg:d:" + id] = P.cli["jg:d:" + id] || now(); var k = "jg:b:" + id; P.cli[k] = Math.max(P.cli[k] || 0, Math.round(sc * 10)); B.saveP(); SFX.done();
    say("Misiune îndeplinită! Nota: " + fmt(sc) + ".", 6000);
    showResult("✅ Misiune îndeplinită", "<p>Nota: <b>" + fmt(sc) + "</b> / 10 · indicii: " + st.hints + " · greșeli: " + st.err + " · timp: " + mmss(now() - st.t0) + "</p>" + (st.tfault ? "<p>Defectul era: <b>" + esc(st.tfault[1]) + "</b></p>" : "") + replayBtn(), true); wireReplay(true);
  }
  function fmt(x) { return (Math.round(x * 100) / 100).toFixed(2).replace(/0$/, "").replace(".", ","); }
  /* ---------- examenul practic (toate punctele, pe timp) ---------- */
  /* barem: 1 din oficiu + 2 identificare + 2 DOAR pentru SSH reușit laptop → switch + 5 împărțite pe celelalte probe = 10; promovat de la 7 */
  var EXG = { ident: ["Identificarea echipamentelor și porturilor", ["ident"], 2], crimp: ["Mufare RJ45 + testare", ["crimp"], 1], cab: ["Cablare (consolă, laptop, switch–router)", ["conSw", "lan", "up"], 1], con: ["Consolă PuTTY (COM, 9600, prompt)", ["putCom", "awake", "en"], 1], cfg: ["Configurare switch: VLAN, SVI, SSH (hostname, domeniu, RSA, user, vty), salvare", ["host", "vlan", "acc", "svi", "dom", "rsa", "user", "vty", "save"], 1], link: ["Legătura switch–router + comenzi pe laptop (IP, ipconfig, ping)", ["rip", "rns", "upAcc", "pcIp", "ipcfg", "pingSw", "pingGw"], 1], ssh: ["Login SSH reușit de pe laptop pe switch", ["ssh"], 2] };
  /* subiectul: ordinea cerințelor e aleatoare pe bilet, dar mereu rezolvabilă (cablare → consolă → configurare → legătură → SSH) */
  function examPlan(V) { var r = mkRng(V.seed ^ 0x9e3779b9), sh = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var phys = sh(["ident", "crimp"]), core = ["cab", "con", "cfg", "link", "ssh"], cut = Math.floor(r() * 3), g = phys.slice(0, cut).concat(core, phys.slice(cut));
    var cfg = sh([["vlan", "acc", "svi"], sh(["host", "dom"]).concat(["rsa"], sh(["user", "vty"]))]), lk = sh([["rip", "rns", "upAcc"], ["pcIp", "ipcfg"]]);
    return { groups: g, ord: { cfg: cfg[0].concat(cfg[1]), link: lk[0].concat(lk[1], sh(["pingSw", "pingGw"]), ["save"]) } }; }
  function allObjs(st) { var M = MS(st), X = {}; Object.keys(M).forEach(function (k) { M[k].obj.forEach(function (o) { if (!X[o.k]) X[o.k] = o; }); }); return X; }
  function examObjs(st) { var X = allObjs(st), P = examPlan(st.V); st.exg = P.groups; var L = []; P.groups.forEach(function (g) { (P.ord[g] || EXG[g][1]).forEach(function (k) { if (X[k]) L.push(X[k]); }); }); return L; }
  function examGrade(st) { var gs = st.exg || Object.keys(EXG); var rows = [["Din oficiu", "–", 1, 1]].concat(gs.map(function (g) { var w = EXG[g], ok = w[1].filter(function (k) { try { return CK[k](st); } catch (e) { return false; } }).length, p = g === "ssh" ? (ok ? 2 : 0) : w[2] * ok / w[1].length; return [w[0], ok + "/" + w[1].length, p, w[2]]; })); var tot = rows.reduce(function (a, r) { return a + r[2]; }, 0), pen = st.hints * (DIFF === "greu" ? 0.5 : 0.25); tot = Math.max(1, Math.min(10, tot - pen)); return { rows: rows, g: Math.round(tot * 100) / 100, pen: pen }; }
  function examSubmit(timeout) {
    var st = G; if (!st || st.scored) return; st.scored = true; closePanel(); var R = examGrade(st), P = B.P(); P.cli = P.cli || {};
    P.cli["jg:b:ex"] = Math.max(P.cli["jg:b:ex"] || 0, Math.round(R.g * 10)); P.cli["jg:d:ex"] = P.cli["jg:d:ex"] || now(); st.res.prac = R.g; B.saveP();
    var pass = R.g >= 7; if (pass) SFX.done(); else SFX.bad();
    var h = '<table class="jgtab"><tr><td><b>Probă</b></td><td><b>Bifat</b></td><td><b>Puncte</b></td></tr>' + R.rows.map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td>" + r[1] + "</td><td><b>" + fmt(r[2]) + "</b>/" + fmt(r[3]) + "</td></tr>"; }).join("") + "</table><p>Indicii folosite: " + st.hints + " (−" + (DIFF === "greu" ? "0,5" : "0,25") + " fiecare)" + (timeout ? " · <b>timpul a expirat</b>" : "") + "</p>" + faultRep(st) + "<p class='jggrade " + (pass ? "ok" : "bad") + "'>Nota la proba practică: <b>" + fmt(R.g) + "</b> – " + (pass ? "ADMIS" : "RESPINS (minim 7)") + "</p>";
    if (st.mode === "story") { st.story.prac = R.g; say(pass ? "Felicitări! Ați promovat proba practică cu nota " + fmt(R.g) + "." : "Nota " + fmt(R.g) + ". Sub 7 – proba practică nu e promovată.", 7000, !pass); storyFinal(h); }
    else { say(pass ? "Proba practică: nota " + fmt(R.g) + ". Admis!" : "Nota " + fmt(R.g) + ". Mai exersați punctele cu puncte pierdute.", 7000, !pass); showResult("📋 Fișa de evaluare – proba practică", h + replayBtn(), true); wireReplay(true); }
  }
  /* ---------- cabluri ---------- */
  var cabN = 0;
  function addCable(st, t, a, b, silent) { var c = { id: "c" + (++cabN), t: t, a: a, b: b }; st.cab.push(c); if (V3 && st === G) V3.setCable(c.id, { a: a, b: b, color: CAB[t].c }); if (!silent) cableJudge(st, c); return c; }
  function removeCable(st, c) { st.cab.splice(st.cab.indexOf(c), 1); if (V3) V3.setCable(c.id, null); }
  function cableJudge(st, c) {
    var a = c.a, b = c.b, t = c.t, ends = [a, b].sort().join("|"), con = /\.con$/.test(a) || /\.con$/.test(b), usbEnd = /^pc\.usb/.test(a) || /^pc\.usb/.test(b), lanEnd = a === "pc.lan" || b === "pc.lan", ck = /r\.con/.test(ends) ? "rcon" : /s2\.con/.test(ends) ? "s2con" : con || usbEnd ? "conSw" : lanEnd ? "lan" : /(^|\|)s2\./.test(ends) && /(^|\|)sw\./.test(ends) ? "tcab" : /(^|\|)r\.g/.test(ends) ? "up" : null;
    if (con && !(t === "usb" || t === "roll")) return mistake("Portul CONSOLE nu e port de rețea: aici merge cablul de consolă (USB–RJ45 sau rollover), nu " + CAB[t].n.split(" (")[0].toLowerCase() + ".", CAB[t].why, ck);
    if (usbEnd && !(t === "usb" || t === "roll")) return mistake("În USB-ul laptopului intră doar cablul de consolă USB (sau rollover-ul prin adaptor).", "Portul USB al laptopului e pentru cablul de consolă USB–RJ45.", ck);
    if ((t === "usb" || t === "roll") && !con) return mistake("Cablul de consolă se pune în portul CONSOLE, nu într-un port de date. Așa nu ai nici legătură de rețea, nici consolă.", CAB[t].why, ck);
    if (con && usbEnd) { learn("🔌 " + CAB[t].n + ": " + pname(a) + " ↔ " + pname(b), CAB[t].why + (t === "roll" ? " (La laptop: prin adaptor USB–serial DB9.)" : "")); if (G.mode !== "exam") say("Bine. Cablul de consolă e pus. Pe laptop o să apară un port COM nou.", 4000); return; }
    if (lanEnd && /^r\./.test(a + b) && !/^sw/.test(a) && !/^sw/.test(b)) { learn("Laptop direct în router", "Merge cu crossover (sau auto-MDIX), dar la examen laptopul se leagă la switch."); }
    if (/^s[w2]\./.test(a) && /^s[w2]\./.test(b) && a.slice(0, 2) !== b.slice(0, 2)) { learn("🔌 " + CAB[t].n + ": " + pname(a) + " ↔ " + pname(b), t === "cross" ? "Switch–switch = același tip de echipament → clasic crossover. Corect." : "Switch–switch: clasic se folosește crossover; cablul drept merge datorită auto-MDIX (porturile Gigabit îl au)."); return; }
    if (t === "cross") return mistake("Cablu crossover între echipamente diferite. Ar merge datorită auto-MDIX, dar la examen se cere cablu DREPT.", CAB.cross.why, ck);
    learn("🔌 " + CAB[t].n + ": " + pname(a) + " ↔ " + pname(b), CAB[t].why);
    if (G.mode !== "exam") say(/^r\.g/.test(a + "") || /^r\.g/.test(b) ? "Cablul e pus. Vedeți LED-ul routerului? Stinge – portul e oprit până dați no shutdown." : "Bun. LED-ul e portocaliu: STP verifică portul ~30 de secunde, apoi devine verde.", 5500);
  }
  function plugAt(a) {
    var st = G; if (!st) return;
    var ex = cableAt(st, a);
    if (!st.carry) { if (ex && (st.unA !== a || Date.now() - (st.unT || 0) > 5000)) { st.unA = a; st.unT = Date.now(); toastG("Atinge încă o dată ca să scoți cablul din " + pname(a) + "."); return; } st.unA = null; if (ex) { removeCable(st, ex); SFX.plug(); learn("Ai scos cablul din " + pname(a)); toastG("Cablu scos: " + pname(a)); linkTick(); refreshPanel(); } else toastG("Ia întâi un cablu din cutie (sau trage capătul din mână pe port)."); return; }
    if (ex) { toastG("Portul " + pname(a) + " e ocupat. Atinge-l fără cablu în mână ca să scoți cablul."); return; }
    if (!st.carry.a) { st.carry.a = a; SFX.plug(); toastG("Primul capăt în " + pname(a) + ". Acum du celălalt capăt la portul de destinație."); refreshPanel(); return; }
    if (st.carry.a === a) return;
    var c = addCable(st, st.carry.t, st.carry.a, a); st.carry = null; if (V3) V3.setCarry(null); SFX.plug(); paintCarry(); linkTick(); checkObj(); refreshPanel();
  }
  function toastG(t) { var e = $("jgToast"); if (!e) return; e.textContent = t; e.className = "jgtoast on"; clearTimeout(e._t); e._t = setTimeout(function () { e.className = "jgtoast"; }, 2600); }
  function paintCarry() { var e = $("jgCarry"); if (!e) return; var c = G.carry; e.innerHTML = c ? '<span class="jgdot" style="background:' + CAB[c.t].c + '"></span>' + esc(CAB[c.t].n.split(" (")[0]) + (c.a ? " · capăt 1 în " + esc(pname(c.a)) : "") + ' <button class="jgx" id="jgDrop" aria-label="Pune cablul înapoi">✕</button>' : ""; e.className = "jgcarry" + (c ? " on" : ""); if ($("jgDrop")) $("jgDrop").onclick = function () { G.carry = null; if (V3) V3.setCarry(null); paintCarry(); refreshPanel(); }; }
  /* ---------- montarea ecranului ---------- */
  var KEYH = null, LOOK = null, VIS = null;
  function mount(app, bridge, arg) {
    B = bridge; unmount(true); root = document.createElement("div"); root.className = "jg"; root.id = "jgRoot";
    root.innerHTML = '<div class="jgview" id="jgView"></div><div class="jgtop"><div class="jgtitle" id="jgTitle">🎮 Joc practic</div><div class="jgobj" id="jgObj"></div><div class="jgrow"><span class="jgtime" id="jgTime"></span><button class="jgbtn" id="jgHint">💡 Indiciu</button><button class="jgbtn" id="jgSnd" aria-label="Sunet">' + (B.mute() ? "🔇" : "🔊") + '</button></div></div><div class="jgsay" id="jgSay"></div><div class="jgcarry" id="jgCarry"></div><div class="jgtoast" id="jgToast"></div><div class="jgnear" id="jgNear"></div><div class="jgpanel" id="jgPanel" aria-hidden="true"></div><div class="jgmodal" id="jgModal"></div>';
    document.body.appendChild(root); document.documentElement.classList.add("jgon");
    $("jgHint").onclick = hint; $("jgSnd").onclick = function () { B.setMute(!B.mute()); $("jgSnd").textContent = B.mute() ? "🔇" : "🔊"; };
    CTL = jgControls(root, { labels: { act: "Folosește", plug: "Conectează", zoom: "Zoom", con: "Consolă" }, onMove: onMove, onAction: onAction });
    var vw = $("jgView"), lx = null; vw.addEventListener("pointerdown", function (e) { if (e.target.closest && e.target.closest(".jgc-root .jgc-btn, .jgc-joy-base")) return; lx = [e.clientX, e.clientY, e.pointerId]; });
    vw.addEventListener("pointermove", function (e) { if (!lx || lx[2] !== e.pointerId || !V3) return; var dx = e.clientX - lx[0], dy = e.clientY - lx[1]; lx[0] = e.clientX; lx[1] = e.clientY; V3.turn(dx * 0.006, dy * 0.004); });
    window.addEventListener("pointerup", LOOK = function () { lx = null; });
    tickT = setInterval(linkTick, 250); document.addEventListener("visibilitychange", VIS = function () { if (document.hidden) pauseT(true); else if (!modalOn()) pauseT(false); });
    var a = String(arg || "menu");
    startView(function () { if (a === "story" || a === "prac") storyResume(a); else if (/^[mb]\d$/.test(a)) startMission(a); else if (a === "ex") drawTicket(function (V) { startMission("ex", null, V); }); else menu(); });
  }
  function unmount(quiet) { clearInterval(tickT); clearInterval(RPT); if (VIS) { document.removeEventListener("visibilitychange", VIS); VIS = null; } clearTimeout(sayT); if (CTL) { CTL.destroy(); CTL = null; } if (V3) { V3.destroy(); V3 = null; } if (LOOK) window.removeEventListener("pointerup", LOOK); if (root && root.parentNode) root.parentNode.removeChild(root); root = null; PANEL = null; document.documentElement.classList.remove("jgon"); }
  var HAS3D = null;
  /* calitatea graficii 3D: auto (PC = înaltă, telefon = medie) / înaltă / medie / redusă */
  function gfxPref() { try { var q = localStorage.getItem("jg_q"); return /^(ultra|high|med|low)$/.test(q) ? q : "auto"; } catch (e) { return "auto"; } }
  function modernIphone() { var ua = navigator.userAgent, m = /iPhone OS (\d+)_/.exec(ua); return /iPhone/.test(ua) && !!m && +m[1] >= 17 && Math.max(screen.width, screen.height) >= 852; }
  function isMob() { return /iPhone|iPad|Android|Mobile/.test(navigator.userAgent) || ("ontouchstart" in window && Math.min(screen.width, screen.height) < 820); }
  var GPU = null; function gpuName() { if (GPU != null) return GPU; GPU = ""; try { var c = document.createElement("canvas"), g = c.getContext("webgl"), x = g && g.getExtension("WEBGL_debug_renderer_info"); GPU = (x ? g.getParameter(x.UNMASKED_RENDERER_WEBGL) : g ? g.getParameter(g.RENDERER) : "") || ""; var lc = g && g.getExtension("WEBGL_lose_context"); if (lc) lc.loseContext(); } catch (e) {} return GPU; }
  function strongGpu() { return /RTX|RX ?[67]\d{3}|Radeon RX ?(6[6-9]|7\d)|Arc\(TM\) A7|Arc A7|Apple M\d (Pro|Max|Ultra)|GTX 10[78]0|GTX 16[56]0/i.test(gpuName()) && !/SwiftShader|llvmpipe|Software/i.test(gpuName()); }
  /* Automată: pornește de la cel mai înalt nivel potrivit dispozitivului și coboară singură până ține ~45 fps; rezultatul se ține minte (jg_auto) */
  function autoStart() { if (isMob()) { if (!modernIphone()) return "med"; return Math.max(screen.width, screen.height) >= 874 ? "ultra" : "high"; } return strongGpu() && window.innerWidth >= 1200 ? "ultra" : "high"; }
  function autoSaved() { try { var a = localStorage.getItem("jg_auto"); return /^(ultra|high|med|low)$/.test(a) ? a : null; } catch (e) { return null; } }
  function gfxTier() { var q = gfxPref(); if (q !== "auto") return q; var st = autoStart(), sv = autoSaved(), O = ["ultra", "high", "med", "low"]; return sv && O.indexOf(sv) > O.indexOf(st) ? sv : st; }
  function tierDown(cur) { var O = ["ultra", "high", "med", "low"], i = O.indexOf(cur); if (i < 0 || i >= 3 || gfxPref() !== "auto" || !V3 || !root) return; try { localStorage.setItem("jg_auto", O[i + 1]); } catch (e) {} toastG("🎨 Grafica s-a ajustat automat: " + ({ high: "Înaltă", med: "Medie", low: "Redusă" })[O[i + 1]] + " (ca să meargă fluid)"); rebuildView(); }
  function rebuildView() { var lv = G ? G.lv : "prac", ps = V3 && V3.pos ? V3.pos() : null; V3.destroy(); V3 = null; startView(function () { if (G) setLevel(lv); else if (V3) V3.setLevel(lv); if (V3 && ps) V3.setPos(ps.x, ps.z, ps.yaw); if (V3 && PANEL && PANEL.live) V3.focus(PANEL.id === "rack" ? RTAB : "box", PANEL.id === "rack" && RNEAR); }); }
  function setGfx(q) { try { localStorage.setItem("jg_q", q); if (q === "auto") localStorage.removeItem("jg_auto"); } catch (e) {} if (!V3 || !root) return; rebuildView(); }
  function startView(cb) {
    var vw = $("jgView"); var want3d = !B.lowGfx() && window.JG3D_OK !== false;
    function two() { V3 = null; vw.innerHTML = ""; vw.className = "jgview jg2d"; paint2d(); cb(); }
    if (!want3d) return two();
    var TQ = gfxTier(); B.loadScripts(TQ === "low" ? ["vendor/three.min.js", "jg3d.js"] : ["vendor/three.min.js", "vendor/three-x.min.js"].concat(TQ === "ultra" ? ["vendor/three-post.min.js"] : [], ["jgnpc.js", "jg3d.js"]), function (ok) {
      if (!root) return; if (!ok || !window.JG3D || !window.JG3D.supported()) return two();
      try { V3 = window.JG3D.create(vw, { level: "prac", lowPower: /iPhone|iPad|Android/.test(navigator.userAgent), tier: TQ, dprCap: isMob() && (TQ === "high" || TQ === "ultra") ? 2 : undefined, fpsFloor: isMob() && (TQ === "high" || TQ === "ultra") ? 45 : 0, onTierDown: gfxPref() === "auto" && TQ !== "low" && (!B.noSlow() || /[?&]jgauto=1/.test(location.search)) && !/[?&]jgfull=1/.test(location.search) ? function () { tierDown(TQ); } : null, noDown: /[?&]jgfull=1/.test(location.search), onNear: onNear, onPick: openStation, onPort: function (a) { if (PANEL && PANEL.id === "rack" && PANEL.live) portTap(a, null); }, onSlow: function () { if (B.noSlow && B.noSlow()) return; toastG("Grafica 3D merge greu pe acest dispozitiv – trec pe vederea 2D."); V3.destroy(); V3 = null; two(); } }); }
      catch (e) { V3 = null; return two(); }
      cb();
    });
  }
  function setLevel(lv) { G.lv = lv; if (V3) { V3.setLevel(lv); G.cab.forEach(function (c) { if (lv === "prac") V3.setCable(c.id, { a: c.a, b: c.b, color: CAB[c.t].c }); }); Object.keys(G.led).forEach(function (k) { if (lv === "prac") V3.setLed(k, G.led[k]); }); } else paint2d(); onNear(null); }
  var ST2D = { out: [["guard", "🪖 Punct de control"], ["barrier", "🚧 Bariera"], ["door", "🚪 Intrarea în clădire"]], hall: [["desk", "📋 Recepția"], ["up", "🪜 Scări → etajul 1, sala de examen"]], theory: [["mydesk", "📝 Locul tău – proba teoretică"], ["examiner", "🎖️ Comisia"], ["door", "🚪 Spre sala de practică"]], prac: [["examiner", "🎖️ Examinatorul"], ["rack", "🗄️ Switch 2960 + router 1941"], ["desk", "💻 Laptop"], ["box", "📦 Cutia cu cabluri"], ["bench", "🔧 Banc de mufare RJ45"], ["fiber", "💡 Fibră optică"]] };
  function paint2d() { var vw = $("jgView"); if (!vw || V3) return; var lv = G ? G.lv : "prac"; vw.innerHTML = '<div class="jg2dmap"><p class="jg2dh">' + ({ out: "Exteriorul unității", hall: "Holul clădirii", theory: "Sala 12 – proba teoretică", prac: "Sala de practică" })[lv] + '</p>' + ST2D[lv].map(function (s) { return '<button class="jg2ds" data-st="' + s[0] + '">' + s[1] + "</button>"; }).join("") + '<p class="jg2dn">Vedere 2D (dispozitivul nu suportă 3D fluent). Atinge o stație.</p></div>'; Array.prototype.forEach.call(vw.querySelectorAll("[data-st]"), function (b) { b.onclick = function () { openStation(b.getAttribute("data-st")); }; }); }
  var NEARN = { guard: "Paznicul", barrier: "Bariera", door: "Ușa", desk: "Laptop", up: "Scările", mydesk: "Locul tău", examiner: "Examinatorul", rack: "Switch + router", box: "Cutia cu cabluri", bench: "Banc RJ45", fiber: "Fibră optică", gate: "Ușa" };
  function onNear(id) { var e = $("jgNear"); if (!e) return; if (G && G.lv === "hall" && id === "desk") id = "desk"; e.innerHTML = id ? '<button class="jgnearb" id="jgNearB">✋ ' + esc(stationName(id)) + ' <small>(E)</small></button>' : ""; e.className = "jgnear" + (id ? " on" : ""); if ($("jgNearB")) $("jgNearB").onclick = function () { openStation(id); }; }
  function stationName(id) { if (G && G.lv === "hall" && id === "desk") return "Recepția"; return NEARN[id] || id; }
  var CYC = 0;
  function onMove(dx, dy, src, tr) { if (!V3 || PANEL || modalOn()) { if (V3) V3.move(0, 0); return; } if (src === "joy") { V3.move(-dy, 0); if (dx) V3.turn(dx * 0.045, 0); } else { V3.move(-dy, dx); if (tr) V3.turn(tr * 0.04, 0); } }
  function modalOn() { var m = $("jgModal"); return m && m.className.indexOf("on") >= 0; }
  function onAction(n) {
    if (!G) return; var m = modalOn();
    if (n === "menu") { if (m) return closeModal(); if (PANEL) return closePanel(); return menu(); }
    if (m) { if (n === "act") { var f = document.querySelector("#jgModal .jgfocus") || document.querySelector("#jgModal [data-f]"); if (f) f.click(); } else if (n === "tab" || n === "next" || n === "prev") focusCycle($("jgModal"), n === "prev" ? -1 : 1); return; }
    if (PANEL) { var cur = PANEL.el.querySelector(".jgfocus");
      if (n === "tab" || n === "next" || n === "prev") return focusCycle(PANEL.el, n === "prev" ? -1 : 1);
      if (n === "act") { if (cur) cur.dispatchEvent(new MouseEvent("click", { bubbles: true })); return; }
      if (n === "plug") { if (cur && cur.getAttribute("data-port")) plugAt(cur.getAttribute("data-anc")); return; }
      if (n === "zoom") { if (PANEL.zoom) PANEL.zoom(); return; }
      if (n === "con") { closePanel(); return openStation("desk", "putty"); }
      return; }
    if (n === "act") { if (V3) { if (!V3.interact()) toastG("Apropie-te de o stație (mergi spre eticheta ei)."); } return; }
    if (n === "tab" || n === "next" || n === "prev") { if (V3) { var L = V3.stationList(); CYC = (CYC + (n === "prev" ? L.length - 1 : 1)) % L.length; V3.goTo(L[CYC]); toastG("→ " + stationName(L[CYC])); } return; }
    if (n === "zoom") { if (V3 && V3.near()) openStation(V3.near()); return; }
    if (n === "con") { if (G.lv === "prac") openStation("desk", "putty"); return; }
    if (n === "plug") { toastG(G.carry ? "Deschide o stație (rack sau laptop) și atinge portul." : "Ia un cablu din cutie."); }
  }
  function focusCycle(el, d) { var L = Array.prototype.slice.call(el.querySelectorAll("[data-f]")).filter(function (x) { return x.offsetParent !== null || x.getBBox; }); if (!L.length) return; var i = L.indexOf(el.querySelector(".jgfocus")); if (i >= 0) L[i].classList.remove("jgfocus"); i = (i + d + L.length) % L.length; L[i].classList.add("jgfocus"); if (L[i].scrollIntoView) L[i].scrollIntoView({ block: "nearest", inline: "center" }); var lab = L[i].getAttribute("aria-label") || L[i].textContent; if (lab) toastG("🔎 " + lab.trim().slice(0, 60)); }
  /* ---------- panouri (vederi de aproape) și ferestre ---------- */
  function openPanel(id, title, html, wire, opt) { var p = $("jgPanel"); PANEL = { id: id, el: p, zoom: opt && opt.zoom, wire: wire, title: title, live: !!(opt && opt.live) }; p.innerHTML = '<div class="jgph"><button class="jgback" id="jgBack">‹ Înapoi <small>(Esc)</small></button><b>' + esc(title) + "</b></div><div class=\"jgpb\" id=\"jgPB\">" + html + "</div>"; p.className = "jgpanel on" + (opt && opt.cls ? " " + opt.cls : ""); p.setAttribute("aria-hidden", "false"); $("jgBack").onclick = closePanel; if (CTL) CTL.show(false); if (V3) { V3.move(0, 0); V3.pause(!(opt && opt.live)); if (!(opt && opt.live) && V3.unfocus) V3.unfocus(); } if (wire) wire(p); }
  function closePanel() { var p = $("jgPanel"); if (!p) return; if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); p.className = "jgpanel"; p.innerHTML = ""; p.setAttribute("aria-hidden", "true"); PANEL = null; if (CTL) CTL.show(true); if (V3) { V3.pause(false); if (V3.unfocus) V3.unfocus(); } paintCarry(); }
  function refreshPanel() { if (!PANEL) return; if (PANEL.id === "rack") paintRack(); else if (PANEL.id === "desk") paintDeskPorts(); }
  function modal(html, wire) { var m = $("jgModal"); m.innerHTML = '<div class="jgmc">' + html + "</div>"; m.className = "jgmodal on"; pauseT(true); if (CTL) CTL.show(false); if (V3) V3.move(0, 0); if (wire) wire(m); var f = m.querySelector("[data-f]"); if (f && !("ontouchstart" in window)) f.classList.add("jgfocus"); }
  function closeModal() { var m = $("jgModal"); if (!m) return; m.className = "jgmodal"; m.innerHTML = ""; pauseT(false); if (CTL && !PANEL) CTL.show(true); }
  function showResult(t, h, again) { modal("<h2>" + esc(t) + "</h2>" + h + '<div class="jgbtns">' + (B.coActive() ? '<button class="jgbig" data-f id="jgCoNext">▶️ Continuă planul</button>' : "") + (again ? '<button class="jgbig2" data-f id="jgMenu2">📋 Alte misiuni</button>' : "") + '<button class="jgbig2" data-f id="jgExit">🏠 Ieși din joc</button></div>', function (m) { if ($("jgCoNext")) $("jgCoNext").onclick = function () { var b = B; unmount(); b.coDone(); }; if ($("jgMenu2")) $("jgMenu2").onclick = function () { closeModal(); menu(); }; $("jgExit").onclick = exitGame; }); }
  function exitGame() { var b = B; unmount(); b.go("home"); }
  /* ---------- meniu și misiuni ---------- */
  function menu() {
    var P = B.P(), cli = P.cli || {}, st = G && !G.scored && G.mis ? G : null; var M = MS(G || { V: genVar(1, 1), S: B.gxSession({}) });
    var row = function (k) { var b = cli["jg:b:" + k]; return '<button class="jgmrow" data-f data-m="' + k + '"><span>' + M[k].ic + '</span><span><b>' + esc(M[k].t) + "</b><small>" + esc(M[k].d) + "</small></span><em>" + (b ? "✅ " + fmt(b / 10) : "") + "</em></button>"; }, rows = '<h3>📋 Examen <small>(ce se cere la proba practică)</small></h3><div class="jgml">' + MEX.map(row).join("") + '</div><h3>⭐ Bonus <small>(peste cerințele examenului)</small></h3><div class="jgml">' + MBON.map(row).join("") + "</div>";
    var be = cli["jg:b:ex"], bs = cli["jg:sg"];
    modal('<h2>🎮 Joc practic – STS</h2><p class="jgsm">Proba practică așa cum a povestit-o un candidat: identificare, mufare RJ45, cablare, PuTTY pe COM, SSH pe switch cu VLAN, router, comenzi pe laptop. ' + (("ontouchstart" in window) ? "Joystick stânga = mers, glisează pe ecran = privești, butoanele din dreapta = acțiuni." : "W A S D = mers, mouse (trage) / săgeți = privești, E = folosește, F = conectează, Tab = următorul, Esc = meniu.") + "</p>" +
      '<button class="jgbig" data-f id="jgStory">🎖️ Examenul complet (poveste)<small>Poarta → legitimația → scările → proba teoretică → sala de practică → nota finală' + (bs ? " · ultima notă: " + fmt(bs / 10) : "") + "</small></button>" +
      '<button class="jgbig gold" data-f id="jgEx">⏱️ Examen practic pe timp (nota /10, 3 bilete la alegere)' + (be ? "<small>Cel mai bun: " + fmt(be / 10) + "</small>" : "<small>Toate punctele legate, fără explicații până la final</small>") + "</button>" +
        '<div class="jgseg jgdiff" id="jgDiff"><button data-d="normal" data-f class="' + (DIFF === "normal" ? "on" : "") + '">Normal<small>timer cu pauză</small></button><button data-d="greu" data-f class="' + (DIFF === "greu" ? "on" : "") + '">Greu<small>timp strict, fără pauză, defecte ascunse</small></button></div><p class="jgsm">Fiecare simulare are alte valori (hostname, VLAN, IP-uri, porturi, interfața routerului, utilizator…), trase la sorți. Toate misiunile sunt pe timp; după fiecare urmează „🔁 Reia greșelile”.</p>' + rows +
      '<div class="jgbtns">' + (st ? '<button class="jgbig2" data-f id="jgResume">▶️ Continuă misiunea</button>' : "") + '<button class="jgbig2" data-f id="jgFast">' + (G && G.fast ? "⏩ STP rapid: PORNIT" : "⏩ STP rapid (LED verde în 3 s)") + '</button><button class="jgbig2" data-f id="jgBob">' + (V3 && V3.bob && !V3.bob() ? "🚶 Mișcarea capului la mers: OPRITĂ" : "🚶 Mișcarea capului la mers: PORNITĂ") + '</button><button class="jgbig2" data-f id="jgGfx">' + gfxLabel() + '</button><button class="jgbig2" data-f id="jgCred">ℹ️ Credite</button><button class="jgbig2" data-f id="jgExit">🏠 Ieși din joc</button></div>',
      function () {
        Array.prototype.forEach.call(document.querySelectorAll("[data-d]"), function (b) { b.onclick = function () { setDiff(b.getAttribute("data-d")); SFX.click(); Array.prototype.forEach.call(document.querySelectorAll("[data-d]"), function (x) { x.className = x === b ? "on" : ""; }); }; });
        $("jgStory").onclick = function () { closeModal(); startStory(); }; $("jgEx").onclick = function () { closeModal(); drawTicket(function (V) { startMission("ex", null, V); }); };
        Array.prototype.forEach.call(document.querySelectorAll("[data-m]"), function (b) { b.onclick = function () { closeModal(); startMission(b.getAttribute("data-m")); }; });
        if ($("jgResume")) $("jgResume").onclick = closeModal; $("jgExit").onclick = exitGame; $("jgCred").onclick = credits; $("jgGfx").onclick = function () { var o = ["auto", "ultra", "high", "med", "low"], q = o[(o.indexOf(gfxPref()) + 1) % o.length]; setGfx(q); $("jgGfx").textContent = gfxLabel(); }; $("jgBob").onclick = function () { if (V3 && V3.setBob) { V3.setBob(!V3.bob()); $("jgBob").textContent = V3.bob() ? "🚶 Mișcarea capului la mers: PORNITĂ" : "🚶 Mișcarea capului la mers: OPRITĂ"; } };
        $("jgFast").onclick = function () { if (!G) startMission("m3"); G.fast = !G.fast; closeModal(); toastG(G.fast ? "STP rapid: LED-urile trec în verde de 10× mai repede (în realitate ~30 s)." : "STP real: ~30 s până la verde."); };
      });
  }
  function gfxLabel() { var N = { ultra: "Ultra", high: "Înaltă", med: "Medie", low: "Redusă" }, q = gfxPref(); return "🎨 Grafică: " + (q === "auto" ? "Automată (" + N[gfxTier()] + ")" : N[q]); }
  var PHC = [["Porturi RJ45 (switch)", "Ben Franske", "CC BY-SA 4.0", "RJ45_Switch_Ports.jpg"], ["Clește de sertizat", "Appaloosa", "CC BY-SA 3.0", "CrimpZangeRJ.jpg"], ["Tester de cablu", "Reise Reise", "CC BY-SA 4.0", "Network_Cable_Tester_(1).jpg"], ["Mufe RJ45", "CyberXRef", "CC BY-SA 3.0", "8P8C_modular_plug.JPG"], ["Cablu de consolă", "Pries", "CC BY-SA 4.0", "CiscoConsoleCable.jpg"], ["Modul SFP", "Aurélien Rinaldi", "CC BY-SA 4.0", "Module_SFP_Module_Fibre_GLC-SX-MMD_CISCO.jpg"], ["Conector LC", "Adamantios", "CC BY-SA 3.0", "LC-optical-fiber-connector-hdr-0a.jpg"], ["Multimetru", "Tomasz Sienicki", "CC BY 3.0", "Digital_universal_multimeter_(ubt).jpeg"], ["Trusă de scule", "heimnetzwerke.net", "CC BY 4.0", "Cable_stripper,_cable_tester_(RJ45,_RJ11),_LSA-Tool_and_crimping_tool.jpg"], ["Rack cu patch panel-uri", "Dsimic", "CC BY-SA 4.0", "19-inch_rackmount_Ethernet_switches_and_patch_panels.jpg"], ["Rack cu switch-uri Catalyst", "Jemimus", "CC BY 2.0", "Cisco_Catalyst_2950_network_switches_in_situ_-_IMG_1076.jpg"]];
  function credits() { modal('<h2>ℹ️ Credite și licențe</h2><ul class="jgcr"><li><b>three.js</b> r149 (cu GLTFLoader, RoomEnvironment, SkeletonUtils) – © three.js authors, licență MIT (vendor/LICENSE-three.txt). Inclus local, fără CDN.</li>' +
    '<li><b>Fotografii reale în sala 3D</b> – Wikimedia Commons. Modificări: decupate, îndreptate în perspectivă, redimensionate; versiunile modificate rămân sub aceeași licență.<ul>' + PHC.map(function (p) { var u = "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(p[3]).replace(/%2C/g, ",").replace(/%28/g, "(").replace(/%29/g, ")"); return '<li>' + esc(p[0]) + ' – ' + esc(p[1]) + ', <a href="' + u + '" target="_blank" rel="noopener">' + esc(p[2]) + '</a></li>'; }).join("") + '</ul></li>' +
    '<li><b>Oamenii 3D</b> – „Universal Base Characters” și „Universal Animation Library” de Quaternius (quaternius.com), licență CC0 1.0. Hainele sunt colorate în joc.</li>' +
    '<li><b>Texturi și cer</b> – Poly Haven (polyhaven.com), CC0 1.0: terrazzo_tiles, laminate_floor_02, marble_tiles, plastered_wall_04, ceiling_interior, wood_table_001, white_plaster_02, leafy_grass, clean_asphalt, rectangular_paving, cerul kloofendal_48d_partly_cloudy_puresky.</li>' +
    '<li>Panourile Cisco 2960-24TT-L și 1941 sunt desenate după modelele reale (aceleași porturi și etichete), cu porturile RJ45 din fotografia de mai sus.</li><li>Clădirea și interioarele sunt generice, inventate – nu reproduc spații reale.</li><li>Controalele pentru telefon au fost schițate cu Gemini și revizuite manual.</li></ul><div class="jgbtns"><button class="jgbig2" data-f id="jgCB">Înapoi</button></div>', function () { $("jgCB").onclick = menu; }); }
  function startMission(id, keep, V) {
    var st = keep || newState(id === "ex" ? "exam" : "mis", id, V); if (G && G.fast) st.fast = true; G = st;
    if (V3) { V3.setLevel("prac"); } st.lv = "prac"; if (!V3) paint2d();
    if (id === "ex") { setupExam(st); } else { var M = MS(st)[id]; setupMission(st, id); $("jgTitle").textContent = M.ic + " " + M.t; G.cab.forEach(function (c) { if (V3) V3.setCable(c.id, { a: c.a, b: c.b, color: CAB[c.t].c }); }); setObj(M.obj); st.dl = now() + minsFor(st, M.obj.length) * 60000; say(M.d + " Ai " + minsFor(st, M.obj.length) + " min" + (DIFF === "greu" ? " (Greu – fără pauză)." : "."), 7000); if (V3) V3.goTo(M.st); }
    paintCarry(); linkTick();
  }
  function drawTicket(cb, title) { var T3 = draw3(DIFF); modal("<h2>" + (title || "🎫 Extrageți un bilet") + '</h2><p>Trei bilete cu fața în jos – fiecare cu alte valori (hostname, VLAN, adrese, porturi' + (DIFF === "greu" ? ", plus defecte ascunse" : "") + ').</p><div class="jgbilete">' + [0, 1, 2].map(function (i) { return '<button class="jgbil" data-f data-b="' + i + '">🎫<br>Bilet ' + (i + 1) + "</button>"; }).join("") + "</div>", function (m) { Array.prototype.forEach.call(m.querySelectorAll("[data-b]"), function (b) { b.onclick = function () { SFX.click(); closeModal(); cb(T3[+b.getAttribute("data-b")]); }; }); }); }
  function setupExam(st) { st.mode = st.mode === "story" ? "story" : "exam"; var mn = minsFor(st, 0, "exam"); st.dl = now() + mn * 60000; $("jgTitle").textContent = "⏱️ Examen practic · biletul " + st.V.n; setObj(examObjs(st)); say("Aveți " + mn + " de minute" + (DIFF === "greu" ? ", fără pauză" : "") + ". Citiți biletul de la mine (examinatorul) și lucrați. La final veniți la mine pentru evaluare.", 8000); if (V3) V3.goTo("examiner"); }
  /* ---------- stațiile ---------- */
  function openStation(id, sub) {
    if (!G) return; SFX.click(); var lv = G.lv;
    if (lv === "out") return id === "guard" ? stGuard() : id === "barrier" ? say(G.story && G.story.card ? "Bariera e ridicată. Treceți." : "Mai întâi legitimația, la ghișeul pazei.", 4000) : stDoorIn();
    if (lv === "hall") return id === "desk" ? stReception() : stUp();
    if (lv === "theory") return id === "mydesk" ? stTheoryDesk() : id === "examiner" ? stTheoryExaminer() : stTheoryDoor();
    if (id === "rack") return stRack();
    if (id === "box") return stBox();
    if (id === "desk") return stDesk(sub);
    if (id === "bench") return stBench();
    if (id === "fiber") return stFiber();
    if (id === "examiner") return stExaminer();
    if (id === "gate") return say(G.mode === "story" ? "Rămâneți în sală până la evaluare." : "Pentru alte misiuni deschide meniul (☰ / Esc).", 4000);
  }
  /* rack: switch față / spate, router spate */
  var RTAB = "swf";
  function rackTabs() { return '<div class="jgseg" id="jgRT"><button data-t="swf" data-f>Switch – față</button><button data-t="swr" data-f>Switch – spate</button><button data-t="rr" data-f>Router</button>' + (G.S.s2 ? '<button data-t="s2f" data-f>SW2 – față</button><button data-t="s2r" data-f>SW2 – spate</button>' : "") + '</div>'; }
  /* lucru direct în 3D: camera se apropie lin de echipament, atingi portul în scenă (fără fereastră) */
  function stRack() { if (V3 && V3.focus) return stRack3d(); stRack2d(); }
  function stRack3d() { openPanel("rack", "Masa cu echipamente", rackTabs() + '<div class="jgask" id="jgAsk"></div><div class="jgpinfo" id="jgPI">Atinge portul direct pe echipament. Cu un cablu în mână îl conectezi. Glisează stânga–dreapta ca să te uiți de-a lungul switch-ului.</div><div class="jgsbt"><button data-f id="jgZm">🔍 Mai aproape</button></div>', function (p) { Array.prototype.forEach.call(p.querySelectorAll("#jgRT button"), function (b) { b.onclick = function () { RTAB = b.getAttribute("data-t"); paintRack(); }; }); $("jgZm").onclick = rackZoom; paintRack(); if (needIdent()) identStart(); }, { zoom: rackZoom, cls: "jgstrip", live: true }); }
  var RNEAR = false;
  function rackZoom() { RNEAR = !RNEAR; if (V3) V3.focus(RTAB, RNEAR); var z = $("jgZm"); if (z) z.textContent = RNEAR ? "🔍 Mai departe" : "🔍 Mai aproape"; }
  function stRack2d() { openPanel("rack", "Switch Cisco 2960-24TT-L și router Cisco 1941", '<div class="jgseg" id="jgRT"><button data-t="swf" data-f>Switch – față</button><button data-t="swr" data-f>Switch – spate</button><button data-t="rr" data-f>Router – spate</button>' + (G.S.s2 ? '<button data-t="s2f" data-f>SW2 – față</button><button data-t="s2r" data-f>SW2 – spate</button>' : "") + '</div><div class="jgask" id="jgAsk"></div><div class="jgsvgw" id="jgSvgW"></div><div class="jgpinfo" id="jgPI">Atinge un port. Cu un cablu în mână (sau trăgând capătul ✋ pe port) îl conectezi.</div>', function (p) { Array.prototype.forEach.call(p.querySelectorAll("#jgRT button"), function (b) { b.onclick = function () { RTAB = b.getAttribute("data-t"); paintRack(); }; }); paintRack(); if (needIdent()) identStart(); }, { zoom: function () { var w = $("jgSvgW"); if (w) { w.classList.toggle("z2"); } }, cls: "wide" }); }
  function paintRack() {
    if (!G.S.s2 && /^s2/.test(RTAB)) RTAB = "swf"; if (PANEL && PANEL.live && V3) { if (V3.focused() !== RTAB) V3.focus(RTAB, RNEAR); Array.prototype.forEach.call(document.querySelectorAll("#jgRT button"), function (b) { b.className = b.getAttribute("data-t") === RTAB ? "on" : ""; }); return; } var w = $("jgSvgW"); if (!w) return; var st = G, dev = RTAB === "rr" ? "r" : /^s2/.test(RTAB) ? "s2" : "sw", LK = RTAB === "s2f" ? "swf" : RTAB === "s2r" ? "swr" : RTAB, L = JGP.L[LK], leds = {}, plg = {};
    Object.keys(L.p).forEach(function (pid) { var a = dev + "." + pid, c = cableAt(st, a); if (c) plg[pid] = CAB[c.t].c; if (st.led[a]) leds[pid] = st.led[a]; });
    if (st.carry && st.carry.a && st.carry.a.indexOf(dev + ".") === 0) plg[st.carry.a.split(".")[1]] = CAB[st.carry.t].c;
    var s = LK === "swf" ? JGP.switchFront({ leds: leds, plugged: plg, sys: "green", stat: "green" }) : LK === "swr" ? JGP.switchRear({ plugged: plg }) : JGP.routerRear({ leds: leds, plugged: plg, sys: "green" });
    w.innerHTML = s; Array.prototype.forEach.call(document.querySelectorAll("#jgRT button"), function (b) { b.className = b.getAttribute("data-t") === RTAB ? "on" : ""; });
    Array.prototype.forEach.call(w.querySelectorAll(".jgp"), function (g) { var pid = g.getAttribute("data-port"), a = dev + "." + pid; g.setAttribute("data-f", ""); g.setAttribute("data-anc", a); g.addEventListener("click", function () { portTap(a, g); }); });
    dropTargets(w);
  }
  function portTap(a, g) {
    if (G.ident && !G.ident.done && G.ident.ask) return identAnswer(a);
    var c = cableAt(G, a), n = pname(a), info = PORTWHY(a);
    var pi = $("jgPI"); if (pi) pi.innerHTML = "<b>" + esc(n) + "</b> – " + esc(info) + (c ? "<br>Conectat: " + esc(CAB[c.t].n.split(" (")[0]) + " → " + esc(pname(other(c, a))) + ". LED: " + ledRo(G.led[a]) : "");
    if (G.carry || c) plugAt(a);
  }
  function ledRo(s) { return { off: "stins", amber: "portocaliu (STP: ascultă/învață)", green: "verde (trimite date)", blink: "verde clipind (trafic)" }[s || "off"]; }
  function PORTWHY(a) { if (/^s2\.gi/.test(a)) return "port Gigabit al lui SW2: aici vine trunk-ul de la SW1."; if (/^s[w2]\.fa/.test(a)) return "port de acces 10/100 Mb/s (FastEthernet): aici legi PC-uri, laptopuri, telefoane IP."; if (/^sw\.gi/.test(a)) return "port Gigabit (uplink) 10/100/1000: legătura spre router sau alt switch."; if (/\.con$/.test(a)) return "port de CONSOLĂ (albastru deschis): configurare directă cu cablul de consolă, prin PuTTY, 9600 8N1."; if (/^r\.g/.test(a)) return "interfață Gigabit a routerului: are adresă IP și e OPRITĂ din fabrică (no shutdown)."; if (a === "r.aux") return "AUX: port auxiliar pentru modem (acces de la distanță de urgență)."; if (/usb/.test(a)) return "USB pe router: stick cu IOS/configurație (sau consolă mini-USB)."; return ""; }
  /* tragerea capătului de cablu pe un port (touch + mouse) */
  function dropTargets(w) { var h = $("jgHand"); if (h) h.remove(); if (!G.carry) return; var d = document.createElement("button"); d.className = "jghand"; d.id = "jgHand"; d.innerHTML = '<span class="jgdot" style="background:' + CAB[G.carry.t].c + '"></span>✋ Trage capătul pe port'; w.parentNode.insertBefore(d, w); var ghost = null;
    d.addEventListener("pointerdown", function (e) { e.preventDefault(); d.setPointerCapture(e.pointerId); ghost = document.createElement("div"); ghost.className = "jgghost"; ghost.style.background = CAB[G.carry.t].c; document.body.appendChild(ghost); mv(e); });
    function mv(e) { if (!ghost) return; ghost.style.transform = "translate(" + (e.clientX - 14) + "px," + (e.clientY - 14) + "px)"; var el = document.elementFromPoint(e.clientX, e.clientY), g = el && el.closest && el.closest(".jgp, [data-lport]"); Array.prototype.forEach.call(document.querySelectorAll(".jgdrop"), function (x) { x.classList.remove("jgdrop"); }); if (g) g.classList.add("jgdrop"); }
    d.addEventListener("pointermove", mv);
    d.addEventListener("pointerup", function (e) { if (!ghost) return; ghost.remove(); ghost = null; var el = document.elementFromPoint(e.clientX, e.clientY), g = el && el.closest && el.closest(".jgp, [data-lport]"); Array.prototype.forEach.call(document.querySelectorAll(".jgdrop"), function (x) { x.classList.remove("jgdrop"); }); if (g) plugAt(g.getAttribute("data-anc")); });
    d.addEventListener("pointercancel", function () { if (ghost) { ghost.remove(); ghost = null; } Array.prototype.forEach.call(document.querySelectorAll(".jgdrop"), function (x) { x.classList.remove("jgdrop"); }); }); }
  /* identificarea (misiunea 1 și examen) */
  function needIdent() { return G.obj && G.obj.some(function (o) { return o.k === "ident"; }) && !(G.ident && G.ident.done); }
  function identStart() { if (!G.ident) { var V = G.V, Q = [["swf", "sw.fa" + (/(\d+)$/.exec(V.port)[1]), "Arată-mi portul " + V.pshort + " pe switch.", ["Port de acces pentru un PC/laptop", "Port de consolă", "Port serial WAN"]], ["swf", V.upa, "Arată-mi portul " + V.upshort + ".", ["Port Gigabit (uplink) spre router sau alt switch", "Port de consolă", "Port pentru alimentare redundantă (RPS)"]], ["swr", "sw.con", "Unde e portul de consolă al switch-ului?", ["Configurare directă cu cablu de consolă (PuTTY 9600)", "Legătura spre router", "Port de management prin rețea (SSH)"]], ["rr", V.ra, "Pe router: arată-mi " + V.rshort + ".", ["Interfață de rețea a routerului (primește IP, no shutdown)", "Port de consolă", "Port AUX pentru modem"]], ["rr", V.ra === "r.g0" ? "r.g1" : "r.g0", "Și " + (V.ra === "r.g0" ? "G0/1" : "G0/0") + "?", ["Cealaltă interfață Gigabit a routerului (altă rețea)", "Port USB pentru stick", "Port de consolă mini-USB"]], ["rr", "r.con", "Consola routerului?", ["Configurare inițială prin cablu de consolă", "Port de date Gigabit", "Port pentru modem"]], ["rr", "r.aux", "Ce e portul negru AUX?", ["Port auxiliar pentru modem (acces de urgență)", "A doua consolă USB", "Port Gigabit"]]];
      Q = shuffle(Q).slice(0, 5).concat(shuffle(LEDQ.slice()).slice(0, 2)); G.ident = { q: Q, i: -1, ok: 0, done: false, dev: 0 }; say("Bun venit la masa de lucru. Întâi spuneți-mi: care dintre ele e switch-ul și care e routerul?", 6000); identDevQ(); return; } identNext(); }
  function identDevQ() { var a = $("jgAsk"); if (!a) return; a.innerHTML = '<b>🎖️ Care e SWITCH-ul?</b><div class="jgopts"><button data-f data-o="sw">Cel cu 24 de porturi la fel, sus (Catalyst 2960)</button><button data-f data-o="r">Cel cu puține porturi, sloturi EHWIC (1941)</button></div>'; Array.prototype.forEach.call(a.querySelectorAll("[data-o]"), function (b) { b.onclick = function () { if (b.getAttribute("data-o") === "sw") { SFX.ok(); G.ident.ok++; learn("✅ Switch vs router", "Switch = multe porturi identice, leagă stațiile din aceeași rețea (MAC, nivel 2). Router = puține interfețe, sloturi de module, leagă rețele diferite (IP, nivel 3)."); } else mistake("Nu: switch-ul are 24 de porturi identice; routerul are puține interfețe și sloturi de module.", "Switch = nivel 2 (MAC); router = nivel 3 (IP)."); identNext(); }; }); }
  function identNext() { var I = G.ident; I.i++; var a = $("jgAsk"); if (I.i >= I.q.length) { I.done = true; I.ask = null; if (a) a.innerHTML = "<b>✅ Identificare terminată: " + I.ok + " răspunsuri corecte.</b>"; checkObj(); return; } var q = I.q[I.i]; if (q[0] === "led") return ledQ(q); I.ask = q; RTAB = q[0]; paintRack(); a = $("jgAsk"); if (a) a.innerHTML = "<b>🎖️ " + esc(q[2]) + "</b> <small>(" + (I.i + 1) + "/" + I.q.length + ")</small>"; say(q[2], 4000); }
  var LEDQ = [["led", 0, "LED-ul portului e PORTOCALIU fix, imediat după ce ai pus cablul. Ce înseamnă?", ["STP verifică portul (listening/learning ~30 s), apoi devine verde", "Cablul e defect", "Portul e oprit administrativ"]], ["led", 0, "LED-ul portului clipește VERDE. Ce înseamnă?", ["Trafic pe port (se trimit/primesc date)", "Eroare de duplex", "Portul pornește"]], ["led", 0, "Ai pus cablul în GE-ul routerului și LED-ul e STINS. Cauza cea mai probabilă?", ["Interfața e oprită (shutdown) – lipsește no shutdown", "Cablul e de tip crossover", "Routerul nu are IP pe Vlan1"]], ["led", 0, "LED-ul SYST al switch-ului e PORTOCALIU la pornire, după POST. Ce înseamnă?", ["POST a găsit o problemă (sistemul nu funcționează normal)", "Totul e în regulă", "Un port e în trunk"]], ["led", 0, "Pe portul de CONSOLĂ se aprinde vreun LED de legătură?", ["Nu – consola nu e port de rețea, nu are LED de link", "Da, verde", "Da, portocaliu"]]];
  function ledQ(q) { var I = G.ident, a = $("jgAsk"); I.ask = null; RTAB = "swf"; paintRack(); a = $("jgAsk"); var o = shuffle(q[3].map(function (x, k) { return [x, k]; })); if (!a) return; a.innerHTML = "<b>🎖️ " + esc(q[2]) + "</b><div class=\"jgopts\">" + o.map(function (x) { return '<button data-f data-k="' + x[1] + '">' + esc(x[0]) + "</button>"; }).join("") + "</div>"; say(q[2], 5000); Array.prototype.forEach.call(a.querySelectorAll("[data-k]"), function (b) { b.onclick = function () { if (b.getAttribute("data-k") === "0") { SFX.ok(); I.ok++; learn("✅ LED: " + q[3][0], q[2]); } else mistake("Nu. " + q[3][0] + ".", q[2]); identNext(); }; }); }
  function identAnswer(a) { var I = G.ident, q = I.ask; if (a !== q[1]) { mistake("Acela e " + pname(a) + ". Căutați " + pname(q[1]) + ".", PORTWHY(q[1])); return; } SFX.ok(); I.ok++; I.ask = null; var o = q[3].map(function (x, k) { return [x, k]; }); for (var i = o.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = o[i]; o[i] = o[j]; o[j] = t; } var el = $("jgAsk"); el.innerHTML = "<b>✅ Corect: " + esc(pname(a)) + ". La ce folosește?</b><div class=\"jgopts\">" + o.map(function (x) { return '<button data-f data-k="' + x[1] + '">' + esc(x[0]) + "</button>"; }).join("") + "</div>"; Array.prototype.forEach.call(el.querySelectorAll("[data-k]"), function (b) { b.onclick = function () { if (b.getAttribute("data-k") === "0") { SFX.ok(); I.ok++; learn("✅ " + pname(a), PORTWHY(a)); } else mistake("Nu chiar. " + pname(a) + ": " + PORTWHY(a)); identNext(); }; }); }
  /* cutia cu cabluri */
  function stBox() { if (V3 && V3.focus) V3.focus("box"); openPanel("box", "Cutia cu cabluri", '<p class="jgsm">Alege cablul. Îl iei în mână, apoi atingi portul de la un capăt și portul de la celălalt capăt (la rack și la laptop).</p>' + Object.keys(CAB).map(function (k) { return '<button class="jgcab" data-f data-c="' + k + '"><span class="jgcoil" style="border-color:' + CAB[k].c + '"></span><span><b>' + esc(CAB[k].n) + "</b><small>" + esc(CAB[k].why) + "</small></span></button>"; }).join(""), function (p) { Array.prototype.forEach.call(p.querySelectorAll("[data-c]"), function (b) { b.onclick = function () { G.carry = { t: b.getAttribute("data-c") }; if (V3) V3.setCarry(CAB[G.carry.t].c); SFX.click(); paintCarry(); closePanel(); toastG("Ai luat: " + CAB[G.carry.t].n.split(" (")[0] + ". Du-l la rack sau la laptop."); }; }); }, V3 && V3.focus ? { cls: "jgstrip", live: true } : null); }
  /* examinatorul (sala de practică) */
  function stExaminer() {
    var st = G, V = st.V, ex = st.mode === "exam" || st.mode === "story";
    var bil = ticketHtml(st);
    var left = st.obj.filter(function (o, i) { return !st.done[i]; }).length;
    openPanel("examiner", "🎖️ Examinatorul", (ex ? bil : '<p>' + esc(curObj() ? "Cerința curentă: " + curObj().t : "Ai terminat cerințele acestei misiuni.") + "</p>") + '<p class="jgsm">Cerințe rămase: <b>' + left + "</b> din " + st.obj.length + '.</p><ul class="jgol">' + st.obj.map(function (o, i) { return "<li class='" + (st.done[i] ? "ok" : "") + "'>" + (st.done[i] ? "✅ " : "⬜ ") + esc(o.t) + "</li>"; }).join("") + "</ul>" + (st.mis === "b5" && !st.diagOK ? diagQ(st) : "") + (ex && !st.scored ? '<button class="jgbig" data-f id="jgSubmit">📋 Am terminat – evaluați-mă</button>' : "") + '<h3>📘 Ce ai învățat</h3><ul class="jglog" id="jgLog"></ul>', function () { paintLog(); wireDiag(st); if ($("jgSubmit")) $("jgSubmit").onclick = function () { modal("<h2>Predai lucrarea?</h2><p>Mai ai " + left + " cerințe neterminate. După evaluare nu mai poți modifica nimic.</p><div class='jgbtns'><button class='jgbig' data-f id='jgY'>Da, evaluați</button><button class='jgbig2' data-f id='jgN'>Mai lucrez</button></div>", function () { $("jgY").onclick = function () { closeModal(); examSubmit(false); }; $("jgN").onclick = closeModal; }); }; });
    if (V3) V3.say();
  }
  function ticketHtml(st) { var V = st.V, g = st.exg || [], T = { ident: "Identificați switch-ul, routerul, porturile " + V.pshort + ", " + V.upshort + ", " + V.rshort + ", consola și semnificația LED-urilor.", crimp: "Confecționați un cablu UTP drept T568B și verificați-l cu testerul.", fiber: "Fibră optică: recunoașteți conectorii (SC/LC, UPC/APC), faceți referința la " + V.fb.wl + " nm și calculați atenuarea legăturii.", barem: "",
      cab: "Conectați laptopul la consola switch-ului și la portul " + V.pshort + "; legați switch-ul (" + V.upshort + ") de router (" + V.rshort + ").", con: "Deschideți consola în PuTTY (Serial, portul COM din Device Manager, 9600).",
      cfg: "Pe switch: hostname " + V.host + ", VLAN " + V.vlan + " " + V.vname + ", " + V.pshort + " acces în VLAN " + V.vlan + ", interface vlan " + V.vlan + " " + V.svi + " " + V.mask + ", ip domain-name " + V.dom + ", RSA 1024, username " + V.user + " secret " + V.pass + ", vty 0 4 login local + transport input ssh, salvare cu copy running-config startup-config LA FINAL (după toate modificările, inclusiv portul spre router).",
      link: "Router: " + V.rshort + " = " + V.gw + " " + V.mask + ", no shutdown; " + V.upshort + " pe switch în VLAN " + V.vlan + "; ping de pe laptop la " + V.gw + ". Laptop: IP static " + V.pc + " " + V.mask + ", gateway " + V.gw + "; ipconfig, ping " + V.svi + ".", ssh: "De pe laptop: ssh -l " + V.user + " " + V.svi + " – login reușit (2 puncte, doar dacă intri)." };
    return '<div class="jgbilet"><b>BILET NR. ' + V.n + " – PROBA PRACTICĂ</b><small> · rețeaua " + V.net + "/" + V.pre + (DIFF === "greu" && (V.faults || []).length ? " · ⚠️ pot exista defecte ascunse" : "") + "</small><ol>" + (g.length ? g : ["cab", "con", "cfg", "link", "ssh"]).map(function (k) { return "<li>" + esc(T[k]) + "</li>"; }).join("") + "</ol><p class='jgsm'>Barem: 1 din oficiu · identificare 2 · mufare 1 · cablare 1 · consolă 1 · configurare 1 · legătură + laptop 1 · SSH reușit 2. Promovat: minim 7.</p></div>"; }
  /* ---------- laptopul: porturi + Windows ---------- */
  var WIN = "desk";
  function stDesk(sub) { if (sub) WIN = sub; else if (WIN === "puttyterm" && !(G.con && G.con.open)) WIN = "desk"; openPanel("desk", "Laptop – Windows 10", '<div class="jglports" id="jgLP"></div><div class="win10" id="jgWin"></div>', function () { paintDeskPorts(); paintWin(); }, { cls: "wide" }); }
  function paintDeskPorts() { var e = $("jgLP"); if (!e) return; e.innerHTML = [["pc.lan", "🔌 Placă de rețea RJ45"], ["pc.usb", "USB 1"], ["pc.usb2", "USB 2"]].map(function (p) { var c = cableAt(G, p[0]), hold = G.carry && G.carry.a === p[0]; return '<button class="jglp' + (c || hold ? " on" : "") + '" data-f data-lport data-anc="' + p[0] + '" aria-label="' + esc(pname(p[0])) + '">' + (c || hold ? '<span class="jgdot" style="background:' + CAB[(c || G.carry).t].c + '"></span>' : "") + esc(p[1]) + (c ? "<small>→ " + esc(pname(other(c, p[0])).replace(/^(Switch|Router) – /, "$1 ")) + "</small>" : "") + "</button>"; }).join(""); Array.prototype.forEach.call(e.querySelectorAll("[data-lport]"), function (b) { b.onclick = function () { plugAt(b.getAttribute("data-anc")); }; }); dropTargets(e); }
  function winFrame(title, body, cls) { return '<div class="wwin ' + (cls || "") + '"><div class="wtitle"><span>' + esc(title) + '</span><span class="wctl"><i>—</i><i>☐</i><button class="wx" data-f id="wClose" aria-label="Închide">✕</button></span></div><div class="wbody">' + body + "</div></div>"; }
  function taskbar() { var d = new Date(); return '<div class="wtask"><span class="wstart">⊞</span><span class="wsearch">🔍 Caută</span><span class="wtk">' + (G.con && G.con.open ? "🖥️ PuTTY" : "") + '</span><span class="wclock">' + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + "<br>" + d.toLocaleDateString("ro-RO") + "</span></div>"; }
  function paintWin() {
    var w = $("jgWin"); if (!w) return; var h = "";
    if (WIN === "desk") h = '<div class="wdesk">' + [["putty", "🖥️", "PuTTY"], ["cmd", "⬛", "Command Prompt"], ["net", "🌐", "Setări rețea"], ["dev", "🧰", "Device Manager"]].concat(G.con && G.con.open ? [["puttyterm", "🟩", G.con.title]] : []).map(function (x) { return '<button class="wicon" data-f data-w="' + x[0] + '"><span>' + x[1] + "</span>" + esc(x[2]) + "</button>"; }).join("") + "</div>";
    else if (WIN === "putty") h = winFrame("PuTTY Configuration", puttyCfg(), "wputty");
    else if (WIN === "puttyterm") h = winFrame(G.con.title, '<div id="jgPT" class="ptwrap"></div>', "wterm");
    else if (WIN === "cmd") h = winFrame("Command Prompt", '<div id="jgCmd"></div>', "wcmdw");
    else if (WIN === "net") h = winFrame("Internet Protocol Version 4 (TCP/IPv4) Properties", netDlg(), "wnet");
    else if (WIN === "dev") h = winFrame("Device Manager", devMgr(), "wdev");
    w.innerHTML = h + taskbar();
    Array.prototype.forEach.call(w.querySelectorAll("[data-w]"), function (b) { b.onclick = function () { WIN = b.getAttribute("data-w"); SFX.click(); paintWin(); }; });
    if ($("wClose")) $("wClose").onclick = function () { if (WIN === "puttyterm" && G.con) { modal("<h2>PuTTY Exit Confirmation</h2><p>Are you sure you want to close this session?</p><div class='jgbtns'><button class='jgbig2' data-f id='jgY'>OK</button><button class='jgbig2' data-f id='jgN'>Cancel</button></div>", function () { $("jgY").onclick = function () { closeModal(); G.con.open = false; G.con.awake = false; G.con = null; WIN = "desk"; paintWin(); }; $("jgN").onclick = closeModal; }); return; } WIN = "desk"; paintWin(); };
    if (WIN === "putty") wirePutty(); if (WIN === "puttyterm") wireTerm(); if (WIN === "cmd") wireCmd(); if (WIN === "net") wireNet();
  }
  /* PuTTY Configuration – ca în original */
  function puttyCfg() { var p = G.putty, ser = p.type === "serial";
    var tree = ["Session", "  Logging", "Terminal", "  Keyboard", "  Bell", "  Features", "Window", "  Appearance", "  Behaviour", "  Translation", "  Selection", "  Colours", "Connection", "  Data", "  Proxy", "  SSH", "  Serial", "  Telnet", "  Rlogin"];
    return '<div class="pcfg"><div class="ptree"><div class="pcat">Category:</div>' + tree.map(function (t, i) { return '<div class="' + (i === 0 ? "sel" : "") + (/^ /.test(t) ? " sub" : "") + '">' + (/^ /.test(t) ? "" : "⊟ ") + esc(t.trim()) + "</div>"; }).join("") + '</div><div class="pmain"><fieldset><legend>Basic options for your PuTTY session</legend><div class="psub">Specify the destination you want to connect to</div><div class="prow2"><label>' + (ser ? "Serial line" : "Host Name (or IP address)") + '<input id="pHost" data-f autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc(ser ? p.line : p.host) + '"></label><label class="psm">' + (ser ? "Speed" : "Port") + '<input id="pPort" data-f inputmode="numeric" value="' + esc(ser ? p.speed : p.port) + '"></label></div><div class="psub">Connection type:</div><div class="pradio">' + [["ssh", "SSH"], ["serial", "Serial"], ["telnet", "Other: Telnet"]].map(function (r) { return '<label><input type="radio" name="pct" data-f value="' + r[0] + '"' + (p.type === r[0] ? " checked" : "") + "> " + r[1] + "</label>"; }).join("") + '</div></fieldset><fieldset><legend>Load, save or delete a stored session</legend><div class="psub">Saved Sessions</div><input disabled value=""><div class="plist"><div class="sel">Default Settings</div></div></fieldset><div class="pclose">Close window on exit: <label><input type="radio" disabled> Always</label> <label><input type="radio" disabled> Never</label> <label><input type="radio" checked disabled> Only on clean exit</label></div></div></div><div class="pbtns"><button class="pb" data-f>About</button><span></span><button class="pb pri" data-f id="pOpen">Open</button><button class="pb" data-f id="pCancel">Cancel</button></div>'; }
  function puttySave() { var p = G.putty, h = $("pHost"), pt = $("pPort"); if (!h) return; if (p.type === "serial") { p.line = h.value.trim(); p.speed = pt.value.trim(); } else { p.host = h.value.trim(); p.port = pt.value.trim(); } }
  function wirePutty() {
    Array.prototype.forEach.call(document.querySelectorAll('input[name="pct"]'), function (r) { r.onchange = function () { puttySave(); G.putty.type = r.value; if (r.value === "ssh") G.putty.port = "22"; if (r.value === "telnet") G.putty.port = "23"; SFX.click(); paintWin(); }; });
    $("pCancel").onclick = function () { WIN = "desk"; paintWin(); };
    $("pOpen").onclick = function () { puttySave(); var p = G.putty;
      if (p.type === "serial") { var line = p.line.toUpperCase().replace(/\s/g, ""), dev = comOf(G, "sw") === line ? G.S.sw : comOf(G, "r") === line ? G.S.r : G.S.s2 && comOf(G, "s2") === line ? G.S.s2 : null;
        if (!/^COM\d+$/.test(line)) return puttyErr("Unable to open connection to " + p.line + ":\nUnable to open serial port", "Serial line trebuie să fie de forma COM3 (vezi Device Manager → Ports).");
        if (!dev) return puttyErr("Unable to open connection to " + line + ":\nUnable to open serial port", comOf(G, "sw") ? "Cablul de consolă al switch-ului e pe " + comOf(G, "sw") + " (Device Manager → Ports (COM & LPT))." : "Nu există niciun cablu de consolă conectat la laptop. Ia cablul USB–RJ45 din cutie.");
        G.con = { dev: dev, open: true, awake: false, title: line + " - PuTTY", lines: [], speed: p.speed.trim(), kind: "serial" }; if (p.speed.trim() !== "9600") learn("⚠️ Viteză greșită: " + p.speed, "Consola Cisco merge implicit la 9600 baud. La altă viteză vezi caractere ciudate.");
        WIN = "puttyterm"; SFX.click(); paintWin(); checkObj(); return; }
      if (p.type === "ssh") { var host = p.host.trim(); if (!host) return puttyErr("Unable to open connection to\nHost does not exist", "Scrie adresa IP a switch-ului (SVI)."); if (!G.S.pc.reach(host)) return puttyErr("Network error: Connection timed out", "Laptopul nu ajunge la " + host + ": verifică IP-ul laptopului, cablul, VLAN-ul portului."); var why = B.cliSshWhy(G.S.sw); var isSw = Object.keys(G.S.sw.ifs).some(function (n) { return G.S.sw.ifs[n].ip === host; }); if (!isSw) return puttyErr("Network error: Connection refused", "Pe " + host + " nu e configurat SSH (doar pe switch, la SVI)."); if (why) return puttyErr("Network error: Connection refused", why);
        G.con = { dev: G.S.sw, open: true, awake: true, title: host + " - PuTTY", lines: [], kind: "ssh", stage: "user" }; WIN = "puttyterm"; paintWin(); return; }
      puttyErr("Network error: Connection refused", "Telnet e dezactivat (transport input ssh) – și la examen se cere SSH.");
    }; }
  function puttyErr(m, why) { SFX.bad(); modal('<h2>⚠️ PuTTY Error</h2><pre class="perr">' + esc(m) + "</pre>" + (why ? '<p class="jgsm">💡 ' + esc(why) + "</p>" : "") + '<div class="jgbtns"><button class="jgbig2" data-f id="jgOK">OK</button></div>', function () { $("jgOK").onclick = closeModal; }); if (why && G.mode !== "exam") learn("PuTTY: " + m.split("\n")[0], why); }
  function garble(n) { var g = "þ€ÿ~ø¤x§Ã¿"; var s = ""; for (var i = 0; i < Math.max(3, n); i++) s += g.charAt(Math.floor(Math.random() * g.length)); return s; }
  function wireTerm() {
    var c = G.con, s = c.dev; if (!c.lines) c.lines = [];
    c.tb = B.termBox($("jgPT"), { cls: "putty", lines: c.lines, hist: s.hist = s.hist || [],
      prompt: function () { if (c.kind === "ssh" && c.stage === "user") return "login as: "; if (c.kind === "ssh" && c.stage === "pass") return c.user + "@" + G.putty.host + "'s password: "; if (!c.awake) return ""; return s.pend ? "" : gPrompt(s); },
      echo: function (v) { if (c.kind === "ssh" && c.stage === "user") return "login as: " + v; if (c.kind === "ssh" && c.stage === "pass") return c.user + "@" + G.putty.host + "'s password: "; if (!c.awake) return v; var pw = s.pend && c.lines.length && /assword|parola/i.test(c.lines[c.lines.length - 1][0]); return (s.pend ? "" : gPrompt(s)) + (pw ? "" : v); },
      run: function (v) { SFX.key();
        if (c.kind === "serial" && c.speed !== "9600") return [garble(v.length + 4)];
        if (c.kind === "ssh") { if (c.stage === "user") { c.user = v.trim(); c.stage = "pass"; return []; } if (c.stage === "pass") { var u = G.S.sw.users[c.user]; if (!u || v !== u.p) { c.stage = "user"; return ["Access denied"]; } c.stage = "cli"; G.S.pc.did.ssh = 1; s.mode = u.pr >= 15 ? "priv" : "user"; checkObj(); return ["", G.S.sw.banner || "", "(Ești pe switch prin SSH – exact ce verifică examinatorul.)"].filter(function (x, i) { return i !== 1 || x; }); } }
        if (!c.awake) { c.awake = true; checkObj(); return ["", ""]; }
        var out = gRun(s, v); setTimeout(function () { checkObj(); }, 0); if (/^\s*(do\s+)?(no\s+)?sh(u|ut|utd|utdo|utdow|utdown)?\b/i.test(v) || /^\s*(do\s+)?ping/i.test(v)) { linkTick(); var lc = lanCable(G); if (lc) G.act[other(lc, "pc.lan")] = Date.now(); }
        return out; },
      complete: function (v) { return B.cliComplete(s, v); },
      cls2: function (l) { return /^%(?!SYS|LINK|LINEPROTO|SSH| Generating| You already)|^\s*\^$/.test(l) ? "terr" : /^\(/.test(l) ? "thint" : ""; },
      tip: function (v, out) { return out.some(function (l) { return /Invalid input|Incomplete|Ambiguous|Unknown command/.test(l); }) ? B.cliTip(s, v) : ""; },
      onChange: function () { checkObj(); } });
    if (!c.awake && !c.lines.length) { c.lines.push(["", ""]); c.tb.paint(); }
    var inp = $("jgPT").querySelector("input"); if (inp && !("ontouchstart" in window)) inp.focus();
  }
  function wireCmd() { var L = G.S.pc; B.winBox($("jgCmd"), L, function () { return curObj() ? curObj().hint : ""; }, function () { var lc = lanCable(G); if (lc) G.act[other(lc, "pc.lan")] = Date.now(); checkObj(); }); var inp = $("jgCmd").querySelector("input"); if (inp && !("ontouchstart" in window)) inp.focus(); }
  function netDlg() { var L = G.S.pc, st = !L.dhcp; return '<div class="wnetb"><p>You can get IP settings assigned automatically if your network supports this capability. Otherwise, you need to ask your network administrator for the appropriate IP settings.</p><label class="wr"><input type="radio" name="nip" data-f value="dhcp"' + (st ? "" : " checked") + '> Obtain an IP address automatically</label><label class="wr"><input type="radio" name="nip" data-f value="st"' + (st ? " checked" : "") + '> Use the following IP address:</label><div class="wgrid"><label>IP address:<input id="nIp" data-f inputmode="decimal" value="' + (st ? esc(L.ip) : "") + '"' + (st ? "" : " disabled") + '></label><label>Subnet mask:<input id="nMk" data-f inputmode="decimal" value="' + (st ? esc(L.mask) : "") + '"' + (st ? "" : " disabled") + '></label><label>Default gateway:<input id="nGw" data-f inputmode="decimal" value="' + (st ? esc(L.gw) : "") + '"' + (st ? "" : " disabled") + '></label></div><label class="wr"><input type="radio" checked disabled> Use the following DNS server addresses:</label><div class="wgrid"><label>Preferred DNS server:<input id="nDns" inputmode="decimal" value="' + esc(L.dns || "") + '"></label></div><div class="pbtns"><span></span><button class="pb pri" data-f id="nOk">OK</button><button class="pb" data-f id="nCancel">Cancel</button></div></div>'; }
  function wireNet() {
    Array.prototype.forEach.call(document.querySelectorAll('input[name="nip"]'), function (r) { r.onchange = function () { var on = r.value === "st" && r.checked; ["nIp", "nMk", "nGw"].forEach(function (id) { $(id).disabled = !on; }); if (on && !$("nMk").value) $("nMk").value = "255.255.255.0"; }; });
    $("nIp").addEventListener("blur", function () { if ($("nIp").value && !$("nMk").value) $("nMk").value = "255.255.255.0"; });
    $("nCancel").onclick = function () { WIN = "desk"; paintWin(); };
    $("nOk").onclick = function () { var L = G.S.pc, stc = document.querySelector('input[name="nip"][value="st"]').checked;
      if (!stc) { L.dhcp = true; var dg = L.dhcpGet && L.dhcpGet(); if (dg) { L.ip = dg.ip; L.mask = dg.mask; L.gw = dg.gw; L.dns = dg.dns; learn("💻 DHCP: laptopul a primit " + dg.ip, "Serverul DHCP de pe router i-a dat IP, mască și gateway (DORA)."); } else { L.ipFrom = ""; L.ip = "169.254." + (12 + (G.V.seed % 200)) + ".7"; L.mask = "255.255.0.0"; L.gw = ""; learn("💻 DHCP: niciun server – adresă APIPA 169.254.x.x", "Dacă nu răspunde niciun server DHCP, Windows își dă singur o adresă 169.254.x.x (fără gateway)."); } WIN = "desk"; paintWin(); checkObj(); return; }
      var ip = $("nIp").value.trim(), mk = $("nMk").value.trim(), gw = $("nGw").value.trim(), dns = $("nDns").value.trim();
      if (!B.ipOk(ip)) return winMsg("The IP address you have entered is not valid."); if (!B.maskOk(mk)) return winMsg("The subnet mask you entered is not valid. Enter a valid subnet mask.");
      if (gw && !B.ipOk(gw)) return winMsg("The default gateway you entered is not valid.");
      if (gw && !B.ipIn(gw, ip, mk)) { winMsg("The default gateway is not on the same network segment (subnet) that is defined by the IP address and subnet mask. Do you want to save this configuration?"); }
      L.dhcp = false; L.ipFrom = ""; L.ip = ip; L.mask = mk; L.gw = gw; L.dns = dns; SFX.click(); learn("💻 IP static: " + ip + " / " + mk + (gw ? ", gateway " + gw : ""), "Laptopul și switch-ul trebuie să fie în aceeași rețea; gateway = routerul."); WIN = "desk"; paintWin(); checkObj(); }; }
  function winMsg(t) { SFX.bad(); modal('<h2>Microsoft TCP/IP</h2><p>' + esc(t) + '</p><div class="jgbtns"><button class="jgbig2" data-f id="jgOK">OK</button></div>', function () { $("jgOK").onclick = closeModal; }); }
  function devMgr() { var com = []; if (conCable(G, "sw")) com.push(comOf(G, "sw")); if (conCable(G, "r")) com.push(comOf(G, "r")); if (G.S.s2 && conCable(G, "s2")) com.push(comOf(G, "s2")); com.sort(); return '<div class="wdevb"><div>🖥️ LAPTOP-STS01</div><div class="d1">› 🔊 Audio inputs and outputs</div><div class="d1">› 🔋 Batteries</div><div class="d1">› 💽 Disk drives</div><div class="d1">› 🖥️ Display adapters</div><div class="d1">› ⌨️ Keyboards</div><div class="d1">› 🌐 Network adapters</div><div class="d2">Intel(R) Ethernet Connection I219-LM</div><div class="d1">⌄ 🔌 Ports (COM &amp; LPT)</div>' + (com.length ? com.map(function (c) { return '<div class="d2 hl">USB Serial Port (' + c + ")</div>"; }).join("") : '<div class="d2 muted">(niciun port COM – nu e conectat niciun cablu de consolă)</div>') + '<div class="d1">› 🖱️ Mice and other pointing devices</div><div class="d1">› 🔌 Universal Serial Bus controllers</div></div>'; }
  /* ---------- bancul de mufare RJ45 ---------- */
  var T568B = ["alb-portocaliu", "portocaliu", "alb-verde", "albastru", "alb-albastru", "verde", "alb-maro", "maro"], T568A = ["alb-verde", "verde", "alb-portocaliu", "albastru", "alb-albastru", "portocaliu", "alb-maro", "maro"];
  var WCOL = { "alb-portocaliu": ["#fff", "#f97316"], portocaliu: ["#f97316"], "alb-verde": ["#fff", "#16a34a"], verde: ["#16a34a"], albastru: ["#2563eb"], "alb-albastru": ["#fff", "#2563eb"], "alb-maro": ["#fff", "#92400e"], maro: ["#92400e"] };
  function wsw(n) { var c = WCOL[n]; return '<span class="jgw" style="background:' + (c[1] ? "repeating-linear-gradient(90deg," + c[0] + " 0 5px," + c[1] + " 5px 10px)" : c[0]) + '"></span>'; }
  function stBench() { var C = G.crimp || (G.crimp = { end: 0, step: 0, got: [[], []], std: ["B", "B"], pool: null, type: "", passed: false, tries: 0 }); openPanel("bench", "Banc de mufare RJ45", '<div id="jgCr"></div>', paintCrimp, { cls: "wide" }); }
  var CRS = ["Taie cablul și dezizolează ~2–3 cm de manta", "Desfă perechile și aranjează firele în ordinea T568B", "Taie firele drept, la ~12 mm", "Introdu firele în mufă (clema în jos, până la capăt)", "Sertizează cu cleștele"];
  function paintCrimp() {
    var C = G.crimp, e = $("jgCr"); if (!e) return; var h = "";
    if (C.passed) h = '<p class="jggrade ok">✅ Cablul e gata și testat: drept T568B – T568B.</p>' + JGP.tester("Cablu drept: 1→1 … 8→8", [0, 1, 2, 3, 4, 5, 6, 7], -1) + '<button class="jgbig2" data-f id="crNew">↻ Fă încă un cablu</button>';
    else if (C.step === 5) { h = '<h3>Testare</h3><p class="jgsm">Pune cele două capete în tester (MAIN și REMOTE) și pornește-l.</p><div id="crT">' + JGP.tester("", remap(), -1) + '</div><button class="jgbig" data-f id="crTest">▶ Pornește testerul</button>'; }
    else if (C.step === -1) h = '<h3>Ce cablu faci?</h3><p class="jgsm">Examinatorul: „Faceți un cablu pentru switch → router.”</p><div class="jgopts">' + [["straight", "Drept (T568B la ambele capete)"], ["cross", "Crossover (T568A la un capăt, T568B la celălalt)"], ["roll", "Rollover (consolă)"]].map(function (x) { return '<button data-f data-ty="' + x[0] + '">' + x[1] + "</button>"; }).join("") + "</div>";
    else {
      h = '<div class="crsteps">' + CRS.map(function (s, i) { return '<div class="' + (i < C.step ? "ok" : i === C.step ? "cur" : "") + '">' + (i < C.step ? "✅" : i + 1 + ".") + " " + esc(s) + "</div>"; }).join("") + '</div><p class="jgsm"><b>Capătul ' + (C.end + 1) + " din 2</b> · standard T568" + C.std[C.end] + "</p>";
      if (C.step === 1) { if (!C.pool) C.pool = shuffle(T568B.slice()); var got = C.got[C.end];
        h += '<div class="rjslots" id="crSlots">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var n = got[i]; return '<button class="rjslot' + (n ? " on" : "") + '" data-f data-slot="' + i + '" aria-label="Pinul ' + (i + 1) + (n ? ": " + n : " gol") + '"><small>' + (i + 1) + "</small>" + (n ? wsw(n) : "") + "</button>"; }).join("") + '</div><p class="jgsm">Trage firele în pinii 1→8 (clema în jos, contactele spre tine) sau atinge firul, apoi pinul. Atinge un pin ocupat ca să scoți firul.</p><div class="rjpool" id="crPool">' + C.pool.map(function (n) { return got.indexOf(n) >= 0 ? "" : '<button class="rjwire" data-f data-wire="' + n + '">' + wsw(n) + esc(n) + "</button>"; }).join("") + '</div><button class="jgbig" data-f id="crOk"' + (got.filter(Boolean).length < 8 ? " disabled" : "") + ">Gata ordinea →</button>";
      } else if (C.step === 4) h += '<button class="jgbig crhold" data-f id="crDo">✊ Ține apăsat ca să sertizezi</button><div class="crbar"><i id="crBar"></i></div>';
      else h += '<button class="jgbig" data-f id="crDo">' + ["✂️ Dezizolează", "", "✂️ Taie la 12 mm", "➡️ Introdu în mufă"][C.step] + "</button>";
    }
    e.innerHTML = h; wireCrimp();
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var SEL = null;
  function wireCrimp() {
    var C = G.crimp; if ($("crNew")) $("crNew").onclick = function () { G.crimp = null; stBench(); };
    Array.prototype.forEach.call(document.querySelectorAll("[data-ty]"), function (b) { b.onclick = function () { C.type = b.getAttribute("data-ty"); if (C.type !== "straight") mistake("Switch → router = echipamente diferite → cablu DREPT (T568B la ambele capete).", CAB.straight.why); else { SFX.ok(); learn("✅ Cablu drept pentru switch → router", CAB.straight.why); } C.type = "straight"; C.step = 0; paintCrimp(); }; });
    if (C.step === 0 && !C.asked) { C.asked = 1; C.step = -1; paintCrimp(); return; }
    var d = $("crDo"); if (d && C.step !== 4) d.onclick = function () { SFX.click(); C.step++; if (C.step === 2) {} paintCrimp(); };
    if (d && C.step === 4) { var t0 = 0, raf = 0; function up() { var k = Math.min(1, (performance.now() - t0) / 900); var bar = $("crBar"); if (bar) bar.style.width = (k * 100) + "%"; if (k >= 1) { cancelAnimationFrame(raf); t0 = 0; SFX.crimp(); learn("✊ Sertizat capătul " + (C.end + 1), "Cleștele împinge contactele aurii prin izolația firelor și blochează mantaua în mufă."); if (C.end === 0) { C.end = 1; C.step = 0; C.asked = 1; C.pool = null; } else C.step = 5; paintCrimp(); return; } raf = requestAnimationFrame(up); }
      function dn(e) { e.preventDefault(); t0 = performance.now(); raf = requestAnimationFrame(up); } function cancel() { if (t0) { cancelAnimationFrame(raf); t0 = 0; var bar = $("crBar"); if (bar) bar.style.width = "0"; toastG("Ține apăsat până se umple bara."); } }
      d.addEventListener("pointerdown", dn); d.addEventListener("pointerup", cancel); d.addEventListener("pointerleave", cancel); d.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && !t0) dn(e); }); d.onclick = function (e) { if (e.detail === 0 && !t0) { t0 = performance.now() - 900; up(); } }; }
    var got = C.got[C.end];
    Array.prototype.forEach.call(document.querySelectorAll("[data-wire]"), function (b) { b.onclick = function () { SEL = b.getAttribute("data-wire"); Array.prototype.forEach.call(document.querySelectorAll("[data-wire]"), function (x) { x.classList.toggle("sel", x === b); }); var fr = got.indexOf(undefined); var free = -1; for (var i = 0; i < 8; i++) if (!got[i]) { free = i; break; } if (b.classList.contains("jgfocus") && free >= 0) { got[free] = SEL; SEL = null; SFX.click(); paintCrimp(); } };
      wireDrag(b); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-slot]"), function (b) { b.onclick = function () { var i = +b.getAttribute("data-slot"); if (got[i]) { got[i] = undefined; paintCrimp(); return; } if (SEL) { got[i] = SEL; SEL = null; SFX.click(); paintCrimp(); } }; });
    if ($("crOk")) $("crOk").onclick = function () { var bad = []; for (var i = 0; i < 8; i++) if (got[i] !== T568B[i]) bad.push(i + 1); C.tries++; if (bad.length) { mistake("Ordinea nu e T568B (pinii " + bad.join(", ") + "). Amintește-ți: alb-portocaliu, portocaliu, alb-verde, ALBASTRU, alb-albastru, VERDE, alb-maro, maro.", "Mnemonic: „Portocala Verde, Albastră în mijloc, Maro la final” – albul vine mereu înaintea culorii, dar perechea albastră stă în mijloc (4–5)."); if (G.mode === "exam" || G.mode === "story") { C.bad = (C.bad || 0) + 1; C.step = 2; paintCrimp(); } return; } SFX.ok(); C.step = 2; paintCrimp(); };
    if ($("crTest")) $("crTest").onclick = function () { var rm = remap(), k = 0, ok = rm.every(function (x, i) { return x === i; }); $("crTest").disabled = true; (function lit() { var t = $("crT"); if (!t) return; t.innerHTML = JGP.tester(k < 8 ? "LED " + (k + 1) + " MAIN → " + (rm[k] >= 0 ? rm[k] + 1 : "—") + " REMOTE" : (ok ? "1→1 2→2 … 8→8: cablu drept corect" : "Ordinea diferă la REMOTE: cablu greșit"), rm, k < 8 ? k : -1); SFX.beep(); k++; if (k <= 8) setTimeout(lit, 280); else { if (ok) { C.passed = true; SFX.ok(); learn("✅ Testerul: 1→1 … 8→8", "La cablul drept LED-urile se aprind în aceeași ordine la MAIN și REMOTE. La crossover: 1→3, 2→6, 3→1, 6→2."); checkObj(); paintCrimp(); } else { mistake("Testerul arată ordine greșită – cablul trebuie refăcut.", "Taie mufa și reia capătul greșit."); G.crimp = null; setTimeout(function () { if (PANEL && PANEL.id === "bench") stBench(); }, 1500); } } })(); };
  }
  function remap() { var C = G.crimp, a = C.got[0], b = C.got[1]; return [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var w = a[i]; var j = b.indexOf(w); return j; }); }
  function wireDrag(b) { var gh = null; b.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse" && e.button !== 0) return; b._sx = e.clientX; b._sy = e.clientY; b._pid = e.pointerId; });
    b.addEventListener("pointermove", function (e) { if (b._pid !== e.pointerId) return; if (!gh && Math.abs(e.clientX - b._sx) + Math.abs(e.clientY - b._sy) > 8) { b.setPointerCapture(e.pointerId); gh = b.cloneNode(true); gh.className = "rjwire jgghostw"; document.body.appendChild(gh); } if (gh) { gh.style.transform = "translate(" + (e.clientX - 40) + "px," + (e.clientY - 20) + "px)"; var el = document.elementFromPoint(e.clientX, e.clientY), s = el && el.closest && el.closest("[data-slot]"); Array.prototype.forEach.call(document.querySelectorAll(".rjslot.jgdrop"), function (x) { x.classList.remove("jgdrop"); }); if (s) s.classList.add("jgdrop"); } });
    b.addEventListener("pointercancel", function () { b._pid = null; if (gh) { gh.remove(); gh = null; } Array.prototype.forEach.call(document.querySelectorAll(".rjslot.jgdrop"), function (x) { x.classList.remove("jgdrop"); }); });
    b.addEventListener("pointerup", function (e) { b._pid = null; if (!gh) return; gh.remove(); gh = null; var el = document.elementFromPoint(e.clientX, e.clientY), s = el && el.closest && el.closest("[data-slot]"); if (s) { var i = +s.getAttribute("data-slot"), got = G.crimp.got[G.crimp.end]; if (!got[i]) { got[i] = b.getAttribute("data-wire"); SFX.click(); } setTimeout(paintCrimp, 0); } b._drag = 1; setTimeout(function () { b._drag = 0; }, 50); });
    b.addEventListener("click", function (e) { if (b._drag) { e.stopImmediatePropagation(); } }, true); }
  /* ---------- bancul de fibră optică ---------- */
  function stFiber() { var F = G.fiber || (G.fiber = { s: 0, ok: 0, clean: false, q: shuffle([0, 1, 2]) }); openPanel("fiber", "Fibră optică – conectori și măsurare", '<div id="jgFb"></div>', paintFiber, { cls: "wide" }); }
  var FQ = [["Care conector e APC?", [["Verde (șlefuit la 8°)", 1], ["Albastru", 0], ["Bej (multimod)", 0]], "APC = verde, capăt înclinat la 8° (reflexie mică – CATV, GPON). UPC = albastru, capăt drept. NU le cupla între ele: se strică ferula și crește pierderea."], ["Conectorul mic, cu clemă (ca RJ45), cât jumătate din SC?", [["LC", 1], ["SC", 0], ["ST", 0]], "LC = Lucent Connector, mic (1,25 mm), pe SFP-uri. SC = pătrat, push-pull (2,5 mm). ST = baionetă, rotund."], ["Sursa și power-metrul sunt SC/UPC. Ce patch-cord de referință folosești?", [["SC/UPC – SC/UPC (albastru)", 1], ["SC/APC – SC/UPC", 0], ["LC/APC – LC/APC", 0]], "Referința trebuie să aibă aceiași conectori ca aparatele, altfel măsori greșit (și poți zgâria ferulele)."]];
  function paintFiber() {
    var F = G.fiber, e = $("jgFb"); if (!e) return; var h = "";
    var fb = G.V.fb, f2 = function (x) { return x.toFixed(2).replace(".", ","); }; if (F.s < FQ.length) { var q = FQ[F.q[F.s]]; h = '<div class="fbconn"><span class="fc apc">SC/APC</span><span class="fc upc">SC/UPC</span><span class="fc lc">LC/UPC</span><span class="fc lca">LC/APC</span></div><h3>' + esc(q[0]) + '</h3><div class="jgopts">' + shuffle(q[1].slice()).map(function (o) { return '<button data-f data-ok="' + o[1] + '">' + esc(o[0]) + "</button>"; }).join("") + "</div>"; }
    else if (F.s === FQ.length) h = '<h3>Pasul 1: referința</h3><div class="pm"><div class="pmscr">' + (F.ref ? fb.ref.toFixed(2) + " dBm" : "--.-- dBm") + '</div><div class="pml">Sursă ' + fb.wl + ' nm → patch-cord referință → power-metru</div></div><p class="jgsm">Setează aceeași lungime de undă pe sursă și pe aparat, apoi „REF”.</p><div class="jgopts"><button data-f data-wl="1310">λ = 1310 nm</button><button data-f data-wl="1550">λ = 1550 nm</button><button data-f data-wl="850">λ = 850 nm</button></div><button class="jgbig" data-f id="fbRef"' + (F.wl ? "" : " disabled") + '>REF (zero)</button>';
    else if (F.s === FQ.length + 1) { var p = fb.ref - (F.clean ? fb.clean : fb.dirty); h = '<h3>Pasul 2: măsoară legătura</h3><div class="pm"><div class="pmscr">' + p.toFixed(2) + ' dBm</div><div class="pml">Referință: ' + f2(fb.ref) + ' dBm · bugetul admis al legăturii: 3,0 dB</div></div><label class="jgin">Atenuarea legăturii (dB) = <input id="fbIn" data-f inputmode="decimal" autocomplete="off" placeholder="ex. 2,5"></label><button class="jgbig" data-f id="fbChk">Verifică</button>' + (F.need ? '<button class="jgbig2" data-f id="fbClean">🧽 Curăță conectorii (click-cleaner) și remăsoară</button>' : ""); }
    else h = '<p class="jggrade ok">✅ Exercițiul de fibră e gata.</p><p class="jgsm">Atenuare = P<sub>ref</sub> − P<sub>măsurat</sub> = ' + f2(fb.ref) + ' − (' + f2(fb.ref - fb.clean) + ') = ' + f2(fb.clean) + ' dB ≤ 3 dB → legătura e bună.</p>';
    e.innerHTML = h;
    Array.prototype.forEach.call(e.querySelectorAll("[data-ok]"), function (b) { b.onclick = function () { var q = FQ[F.q[F.s]]; if (b.getAttribute("data-ok") === "1") { SFX.ok(); learn("✅ " + q[0], q[2]); } else mistake("Nu. " + q[2].split(".")[0] + ".", q[2]); F.s++; paintFiber(); }; });
    Array.prototype.forEach.call(e.querySelectorAll("[data-wl]"), function (b) { b.onclick = function () { F.wl = b.getAttribute("data-wl"); SFX.click(); Array.prototype.forEach.call(e.querySelectorAll("[data-wl]"), function (x) { x.classList.toggle("on", x === b); }); $("fbRef").disabled = false; }; });
    if ($("fbRef")) $("fbRef").onclick = function () { if (F.wl !== String(fb.wl)) { mistake("Sursa e pe " + fb.wl + " nm – power-metrul trebuie pe ACEEAȘI lungime de undă.", "Atenuarea fibrei depinde de λ (~0,35 dB/km la 1310, ~0,2 dB/km la 1550)."); return; } F.ref = 1; SFX.beep(); learn("✅ Referința făcută la " + f2(fb.ref) + " dBm", "REF = aparatul ține minte puterea sursei, apoi îți arată direct pierderea."); F.s++; paintFiber(); };
    if ($("fbChk")) $("fbChk").onclick = function () { var v = parseFloat(String($("fbIn").value).replace(",", ".")), want = Math.round((F.clean ? fb.clean : fb.dirty) * 100) / 100; if (!isFinite(v) || Math.abs(Math.abs(v) - want) > 0.051) { mistake("Calculează: " + f2(fb.ref) + " − (" + f2(fb.ref - want) + ") = " + f2(want) + " dB.", "Pierdere (dB) = diferența dintre două niveluri în dBm."); return; } SFX.ok(); if (!F.clean) { F.need = 1; say(f2(fb.dirty) + " dB e peste bugetul de 3 dB. Ce faceți?", 5000); learn(f2(fb.dirty) + " dB > 3 dB: legătura NU e în buget", "Prima cauză: conectori murdari. Curăță-i cu click-cleaner și remăsoară."); paintFiber(); return; } F.s++; F.done = true; learn("✅ " + f2(fb.clean) + " dB ≤ 3 dB", "După curățare pierderea a scăzut – legătura e bună."); checkObj(); paintFiber(); };
    if ($("fbClean")) $("fbClean").onclick = function () { F.clean = true; F.need = 0; SFX.click(); toastG("Click! Conectori curățați. Remăsoară."); paintFiber(); };
  }
  /* ---------- povestea: poarta → hol → scări → proba teoretică → sala de practică ---------- */
  var STORY = null;
  function startStory() {
    var st = newState("story", "ex"); st.story = { card: false, signed: false, vi: 0, drawn: false, theory: null, prac: null, phase: "out" }; if (G && G.fast) st.fast = true; G = st; STORY = st; 
    $("jgTitle").textContent = "🎖️ Examenul STS – Bacău"; G.obj = []; G.done = {}; G.goal = "Mergi la punctul de control (ghereta pazei) și arată legitimația.";
    setLevel("out"); paintObj(); say("Bună dimineața! Candidații se prezintă la punctul de control, cu legitimația.", 6000);
  }
  function stGuard() { var S = G.story; if (!S) return say("Pentru poveste, alege „Examenul complet” din meniu.", 4000); if (S.card) return say("Sunteți înregistrat. Intrați în clădire, la etajul 1.", 4000);
    var nm = (B.user() || "Candidat").replace(/^./, function (c) { return c.toUpperCase(); });
    modal('<h2>🪖 Punctul de control</h2><p>„Bună dimineața. Legitimația și actul de identitate, vă rog.”</p><div class="jgcard"><div class="jgcardh">LEGITIMAȚIE DE CANDIDAT</div><div class="jgcardb"><div class="jgph">👤</div><div><b>' + esc(nm) + '</b><br>Concurs: subofițer / maistru militar B.E.S.A<br>Centrul de examinare: Bacău<br>Data: 19.10.2026 · ora 08:00</div></div></div><div class="jgbtns"><button class="jgbig" data-f id="jgShow">🪪 Arată legitimația</button></div>', function () { $("jgShow").onclick = function () { closeModal(); S.card = true; SFX.beep(); if (V3 && V3.openBarrier) V3.openBarrier(); say("În regulă, mult succes! Intrați pe ușa principală, apoi urcați la etajul 1, sala 12.", 6000); G.goal = "Intră în clădire (ușa principală), apoi urcă la etajul 1."; paintObj(); }; }); }
  function stDoorIn() { if (!G.story || !G.story.card) return say("Mai întâi la punctul de control, cu legitimația.", 4000, true); if (V3) V3.openDoor("door"); fade(function () { setLevel("hall"); G.goal = "Semnează la recepție, apoi urcă scările la etajul 1."; paintObj(); say("Bună ziua. Semnați în registru, vă rog, apoi urcați scările la sala 12.", 5000); }); }
  function stReception() { if (G.story.signed) return say("Etajul 1, sala 12. Scările sunt în față.", 3500); G.story.signed = true; SFX.click(); say("Mulțumesc. Sala 12, la etajul 1. Telefonul se predă la intrarea în sală.", 5000); G.goal = "Urcă scările până la ușa sălii 12."; paintObj(); }
  function stUp() { if (!G.story.signed) return say("Mai întâi semnați la recepție, vă rog.", 4000, true); fade(function () { setLevel("theory"); G.goal = "Mergi la comisie (examinatorul) și extrage biletul."; paintObj(); say("Bună dimineața. Telefoanele pe masa comisiei. Veniți să extrageți biletul.", 6000); }); }
  function stTheoryExaminer() { var S = G.story; if (!S) return; if (S.theory != null) return say("Proba teoretică s-a încheiat cu nota " + fmt(S.theory) + ". Urmați-mă în sala de practică – ușa din dreapta.", 6000);
    if (S.drawn) return say("Luați loc la masa liberă din primul rând și începeți când sunteți gata. Aveți 20 de minute pentru grilă.", 6000);
    drawTicket(function (V) { var ns = newState("story", "ex", V); ns.story = S; ns.lv = G.lv; ns.fast = G.fast; ns.log = G.log; G = ns; STORY = ns; S.drawn = true;
      modal("<h2>🎫 Biletul nr. " + V.n + "</h2><p>Proba practică: hostname <b>" + esc(V.host) + "</b>, VLAN <b>" + V.vlan + " " + esc(V.vname) + "</b>, port <b>" + esc(V.pshort) + "</b>, switch <b>" + esc(V.svi) + "</b>, router <b>" + esc(V.rshort) + " " + esc(V.gw) + "</b>, masca <b>" + esc(V.mask) + "</b>, laptop <b>" + esc(V.pc) + "</b>, utilizator <b>" + esc(V.user) + "</b>.</p><p>Întâi proba teoretică: <b>18 întrebări în 20 de minute</b>, apoi <b>12 teste psihologice în 6 minute</b>. Nota minimă: 7.</p><div class='jgbtns'><button class='jgbig' data-f id='jgOK'>Am înțeles</button></div>", function () { $("jgOK").onclick = function () { closeModal(); G.goal = "Mergi la locul tău (masa liberă din primul rând) și începe proba teoretică."; paintObj(); say("Luați loc. Când porniți, timpul curge. Succes!", 5000); }; }); }, "🎫 Extrageți un bilet – comisia");
  }
  function stTheoryDesk() { var S = G.story; if (!S) return; if (!S.drawn) return say("Mai întâi extrageți biletul de la comisie.", 4000, true); if (S.theory != null) return say("Ați terminat grila. Mergeți la comisie.", 4000);
    modal('<h2>📝 Proba teoretică</h2><p>18 întrebări grilă din tematica de examen, <b>20 de minute</b>, apoi 12 teste psihologice în 6 minute. După ce predai, revii automat în sală, la comisie.</p><div class="jgbtns"><button class="jgbig" data-f id="jgGoT">▶️ Încep proba</button><button class="jgbig2" data-f id="jgNT">Mai târziu</button></div>', function () { $("jgNT").onclick = closeModal; $("jgGoT").onclick = function () { closeModal(); S.phase = "theory"; var b = B; unmount(); b.storyTheory(); }; }); }
  function stTheoryDoor() { var S = G.story; if (!S || S.theory == null) return say("Ușa spre sala de practică se deschide după proba teoretică.", 4000, true); if (V3) V3.openDoor("door"); fade(function () { setLevel("prac"); S.phase = "prac"; setupExam(G); }); }
  /* revenirea din proba teoretică (aplicația îl trimite înapoi în joc) */
  function storyResume(a) {
    if (!STORY) { startStory(); return; } G = STORY; var S = G.story, R = B.storyRes();
    S.theory = R.grade; S.psy = R.psy; setLevel("theory"); if (V3) V3.place("examiner"); $("jgTitle").textContent = "🎖️ Examenul STS – biletul " + G.V.n;
    var pass = S.theory >= 7; G.goal = pass ? "Ușa din dreapta: sala de practică." : "Proba teoretică nepromovată – poți continua la practică pentru exercițiu."; paintObj();
    say("Proba teoretică: nota " + fmt(S.theory) + (S.psy != null ? ", teste psihologice " + S.psy + "%" : "") + ". " + (pass ? "Admis! Urmați-mă în sala de practică, ușa din dreapta." : "Sub 7. Continuați totuși la practică, pentru antrenament."), 9000, !pass);
  }
  function storyFinal(h) { var S = G.story, P = B.P(); var t = S.theory || 0, p = S.prac || 0, fin = Math.round((t + p) / 2 * 100) / 100, pass = t >= 7 && p >= 7; P.cli = P.cli || {}; P.cli["jg:sg"] = Math.max(P.cli["jg:sg"] || 0, Math.round(fin * 10)); P.cli["jg:d:story"] = P.cli["jg:d:story"] || now(); B.saveP();
    showResult("🎖️ Rezultatul examenului", '<table class="jgtab"><tr><td>Proba teoretică (grilă)</td><td><b>' + fmt(t) + "</b></td></tr>" + (S.psy != null ? "<tr><td>Teste psihologice</td><td><b>" + S.psy + "%</b></td></tr>" : "") + "<tr><td>Proba practică</td><td><b>" + fmt(p) + "</b></td></tr><tr><td><b>Media</b></td><td><b>" + fmt(fin) + "</b></td></tr></table>" + h + "<p class='jggrade " + (pass ? "ok" : "bad") + "'>" + (pass ? "🎉 ADMIS – ambele probe cu minim 7." : "Nepromovat: fiecare probă trebuie să aibă minim 7.") + "</p>" + replayBtn(), true); wireReplay(); }
  function fade(cb) { var f = document.createElement("div"); f.className = "jgfade"; root.appendChild(f); SFX.step(); setTimeout(function () { try { cb(); } finally { setTimeout(function () { f.remove(); }, 400); } }, 560); }
  /* ===== dispozitive și comenzi suplimentare: SW2, DHCP pe router, rutare între VLAN-uri ===== */
  function allowHas(f, v) { if (!f || f.mode !== "trunk") return false; if (f.allow == null) return true; if (f.allow === "none") return false; return String(f.allow).split(",").some(function (p) { var m = /^(\d+)(?:-(\d+))?$/.exec(p); return m && v >= +m[1] && v <= +(m[2] || m[1]); }); }
  function swOf(st, a) { return a.indexOf("s2.") === 0 ? st.S.s2 : a.charAt(0) === "s" ? st.S.sw : st.S.r; }
  function ledUp(st, a) { return st.led[a] === "green" || st.led[a] === "blink"; }
  /* răspunde routerul în VLAN-ul lv la adresa ip? (interfață fizică în VLAN de acces sau sub-interfață dot1Q pe trunk) */
  function rtrIn(st, lv, ip) { var V = st.V, r = st.S.r, sw = st.S.sw, u = sw.ifs[V.up], g = r.ifs[V.rif]; if (!uplinkFwd(st) || !g || g.shut || !u || u.shut) return null;
    if (g.ip && (!ip || g.ip === ip) && (u.mode !== "trunk" ? (u.vlan || 1) === lv : lv === 1)) return g;
    var hit = null; Object.keys(r.ifs).forEach(function (n) { var f = r.ifs[n]; if (n.indexOf(V.rif + ".") === 0 && f.enc === lv && f.ip && !f.shut && (!ip || f.ip === ip) && allowHas(u, lv)) hit = f; }); return hit; }
  function rtrUpIps(st) { var V = st.V, r = st.S.r, g = r.ifs[V.rif], ips = []; if (!g || g.shut) return ips; if (g.ip) ips.push(g.ip); Object.keys(r.ifs).forEach(function (n) { var f = r.ifs[n]; if (n.indexOf(V.rif + ".") === 0 && f.ip && f.enc && !f.shut) ips.push(f.ip); }); return ips; }
  function s2In(st, lv, ip) { var s2 = st.S.s2, V = st.V; if (!s2) return false; var c = cableAt(st, V.tr); if (!c || other(c, V.tr) !== "s2.gi1" || !(c.t === "straight" || c.t === "cross")) return false; if (!ledUp(st, V.tr) || !ledUp(st, "s2.gi1")) return false;
    var a = st.S.sw.ifs[ifOf(V.tr)], b = s2.ifs["GigabitEthernet0/1"]; if (!allowHas(a, lv) || !allowHas(b, lv) || !st.S.sw.vlans[lv] || !s2.vlans[lv]) return false; var f = s2.ifs["Vlan" + lv]; return !!(f && f.ip === ip && !f.shut); }
  function pcReach(st, ip) { var S = st.S, L = S.pc, sw = S.sw; if (!L.ip || !B.ipOk(ip)) return false; if (ip === L.ip || ip === "127.0.0.1") return true; if (!fwd(st)) return false;
    var p1 = sw.ifs[S.pcPort]; if (!p1 || p1.shut) return false; var lv = p1.mode === "trunk" ? 1 : (p1.vlan || 1); if (!sw.vlans[lv]) return false;
    if (B.ipIn(ip, L.ip, L.mask)) { var svi = sw.ifs["Vlan" + lv]; if (svi && svi.ip === ip && !svi.shut) return true; var g = rtrIn(st, lv, ip); if (g && B.ipIn(ip, g.ip, g.mask)) return true; return s2In(st, lv, ip); }
    if (!L.gw || !B.ipIn(L.gw, L.ip, L.mask)) return false; var gw = rtrIn(st, lv, L.gw); if (!gw || !B.ipIn(L.gw, gw.ip, gw.mask)) return false; return rtrUpIps(st).indexOf(ip) >= 0; }
  function dhcpGet(st) { var S = st.S, r = S.r, L = S.pc, sw = S.sw; if (!fwd(st) || !r.dpool) return null; var p1 = sw.ifs[S.pcPort]; if (!p1 || p1.shut) return null; var lv = p1.vlan || 1, g = rtrIn(st, lv, null); if (!g || !g.ip) return null;
    var pool = null; Object.keys(r.dpool).forEach(function (k) { var p = r.dpool[k]; if (p.net && p.mask && B.ipIn(g.ip, p.net, p.mask)) pool = p; }); if (!pool) return null;
    var n = pool.net.split(".").map(Number), m = pool.mask.split(".").map(Number), base = ((n[0] & m[0]) << 24 | (n[1] & m[1]) << 16 | (n[2] & m[2]) << 8 | (n[3] & m[3])) >>> 0, hz = (~((m[0] << 24 | m[1] << 16 | m[2] << 8 | m[3]) >>> 0)) >>> 0, ex = r.dexcl || [];
    var used = [g.ip]; Object.keys(sw.ifs).forEach(function (k) { if (sw.ifs[k].ip) used.push(sw.ifs[k].ip); });
    for (var h = 1; h < hz && h < 4096; h++) { var ip = i2ip((base + h) >>> 0), x = (base + h) >>> 0; if (used.indexOf(ip) >= 0) continue; if (ex.some(function (e) { return x >= e[0] && x <= e[1]; })) continue; return { ip: ip, mask: pool.mask, gw: pool.gw || "", dns: pool.dns || "" }; }
    return null; }
  function ip2i(ip) { var p = ip.split(".").map(Number); return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0; }
  function pfx(t, w, n) { t = (t || "").toLowerCase(); return t.length >= (n || 1) && w.indexOf(t) === 0; }
  /* interpretorul IOS al jocului = motorul verificat din aplicație + DHCP (ip dhcp pool) */
  function gPrompt(s) { if (s.mode === "dhcp") return s.host + "(dhcp-config)#"; return B.cliPrompt(s); }
  function gRun(s, v) {
    var t = String(v).trim().split(/\s+/).filter(Boolean), o = [];
    if (s.pend) return B.cliRun(s, v);
    if (s.mode === "dhcp") {
      if (!t.length) return []; var P = s.dpool[s.dctx];
      if (pfx(t[0], "network", 3)) { if (!t[1] || !B.ipOk(t[1])) return [t[1] ? "% Invalid input detected at '^' marker." : "% Incomplete command."]; if (t[2] && !B.maskOk(t[2])) return ["% Invalid input detected at '^' marker."]; P.net = t[1]; P.mask = t[2] || (+t[1].split(".")[0] < 128 ? "255.0.0.0" : +t[1].split(".")[0] < 192 ? "255.255.0.0" : "255.255.255.0"); return []; }
      if (pfx(t[0], "default-router", 3)) { if (!t[1] || !B.ipOk(t[1])) return ["% Incomplete command."]; P.gw = t[1]; return []; }
      if (pfx(t[0], "dns-server", 2)) { if (!t[1] || !B.ipOk(t[1])) return ["% Incomplete command."]; P.dns = t[1]; return []; }
      if (pfx(t[0], "domain-name", 2)) { P.dom = t[1] || ""; return []; }
      if (pfx(t[0], "lease", 2)) return [];
      if (pfx(t[0], "exit", 2)) { s.mode = "config"; s.dctx = null; return []; }
      if (pfx(t[0], "end", 2)) { s.mode = "priv"; s.dctx = null; return ["%SYS-5-CONFIG_I: Configured from console by console"]; }
      if (t[0] === "?") return ["  default-router  Default routers", "  dns-server      DNS servers", "  domain-name     Domain name", "  exit            Exit from DHCP pool configuration mode", "  lease           Address lease time", "  network         Network number and mask"];
      if (pfx(t[0], "do", 2)) { s.mode = "priv"; var r0 = gRun(s, t.slice(1).join(" ")); if (s.mode === "priv") s.mode = "dhcp"; return r0; }
      s.mode = "config"; s.dctx = null; return gRun(s, v);
    }
    var cfg = s.mode === "config" || s.mode === "if" || s.mode === "line" || s.mode === "vlan";
    if (cfg && t.length >= 4 && t[0] === "no" && pfx(t[1], "ip", 2) && pfx(t[2], "dhcp", 2) && pfx(t[3], "excluded-address", 2) && s.dev === "router") { if (!t[4] || !B.ipOk(t[4])) return ["% Incomplete command."]; var x1 = ip2i(t[4]), x2 = ip2i(t[5] || t[4]), n0 = (s.dexcl || []).length; s.dexcl = (s.dexcl || []).filter(function (e) { return !(e[0] === x1 && e[1] === x2); }); return n0 === s.dexcl.length ? ["% Range [" + t[4] + ", " + (t[5] || t[4]) + "] is not in the excluded list"] : []; }
    if (cfg && t.length >= 2 && pfx(t[0], "ip", 2) && pfx(t[1], "dhcp", 2)) {
      if (s.dev !== "router") return ["(Pe Catalyst 2960 din examen serverul DHCP se face pe router.)"];
      if (pfx(t[2], "pool", 2)) { if (!t[3]) return ["% Incomplete command."]; s.dpool = s.dpool || {}; s.dpool[t[3]] = s.dpool[t[3]] || { net: "", mask: "", gw: "", dns: "" }; s.mode = "dhcp"; s.dctx = t[3]; return []; }
      if (pfx(t[2], "excluded-address", 2)) { if (!t[3] || !B.ipOk(t[3]) || (t[4] && !B.ipOk(t[4]))) return ["% Incomplete command."]; s.dexcl = s.dexcl || []; s.dexcl.push([ip2i(t[3]), ip2i(t[4] || t[3])]); return []; }
      return ["% Incomplete command."];
    }
    if (cfg && t.length >= 2 && t[0] === "no" && pfx(t[1], "ip", 2) && pfx(t[2], "dhcp", 2) && pfx(t[3], "pool", 2) && s.dpool) { delete s.dpool[t[4]]; return []; }
    var out = B.cliRun(s, v);
    if (s.dev === "router" && /^\s*(do\s+)?sh(o|ow)?\s+(ip\s+dhcp\s+b|ip\s+dh\w*\s+b)/i.test(v)) { var L = G.S.pc; out = ["Bindings from all pools not associated with VRF:", "IP address          Client-ID/              Lease expiration        Type", "                    Hardware address/", "                    User name"]; if (L.dhcp && L.ipFrom === "dhcp") out.push(pad2(L.ip, 20) + "0100.1e64.a1b2.c3      Oct 20 2026 08:00 AM    Automatic"); return out; }
    if (s.dev === "router" && s.dpool && /^\s*(do\s+)?sh\w*\s+run/i.test(v)) { var ix = out.lastIndexOf("end"), add = []; (s.dexcl || []).forEach(function (e) { add.push("ip dhcp excluded-address " + i2ip(e[0]) + (e[1] !== e[0] ? " " + i2ip(e[1]) : "")); }); Object.keys(s.dpool).forEach(function (k) { var p = s.dpool[k]; add.push("ip dhcp pool " + k); if (p.net) add.push(" network " + p.net + " " + p.mask); if (p.gw) add.push(" default-router " + p.gw); if (p.dns) add.push(" dns-server " + p.dns); add.push("!"); }); if (ix > 0) out.splice.apply(out, [ix, 0].concat(add)); }
    return out;
  }
  function pad2(x, n) { x = String(x); while (x.length < n) x += " "; return x; }
  /* ---------- misiunile bonus (toate pe timp, valori aleatoare) ---------- */
  function O2(t, k, ok, hint, why) { return { t: t, k: k, ok: ok, hint: hint, why: why }; }
  function BONUS(st) {
    var V = st.V, A = V.vlan, Bv = V.vlan2, tr = ifOf(V.tr), trs = tr.replace("GigabitEthernet", "Gi"), sw = function () { return st.S.sw; }, s2 = function () { return st.S.s2; }, r = function () { return st.S.r; }, L = function () { return st.S.pc; };
    return {
      b1: { t: "Trunk între 2 switch-uri (802.1Q)", ic: "🔀", st: "rack", d: "Legi SW1 (" + trs + ") de SW2 (Gi0/1), faci trunk cu VLAN-urile " + A + " și " + Bv + " permise și dai ping de pe laptop la SW2.", obj: [
        O2("Cablu între SW1 " + trs + " și SW2 Gi0/1", "tcab", function () { var c = cableAt(st, V.tr); return !!c && other(c, V.tr) === "s2.gi1" && (c.t === "straight" || c.t === "cross"); }, "Din cutie: cablu drept (auto-MDIX) sau crossover (clasic pentru switch–switch). " + trs + " pe SW1 → Gi0/1 pe SW2.", "Switch–switch = echipamente de același fel: clasic crossover; azi auto-MDIX acceptă și cablu drept."),
        O2("Consolă pe SW2 (laptop USB 2 → CONSOLE SW2)", "s2con", function () { return !!conCable(st, "s2"); }, "Al doilea cablu USB–RJ45: USB 2 la laptop, CONSOLE pe SW2. Apare pe COM" + V.rcom + ".", "Fiecare switch are propria consolă."),
        O2("SW1 " + trs + ": switchport mode trunk + allowed vlan " + A + "," + Bv, "t1", function () { var f = sw().ifs[tr]; return allowHas(f, A) && allowHas(f, Bv) && f.allow != null; }, "PuTTY COM" + V.com + " → conf t → interface " + trs.toLowerCase() + " → switchport mode trunk → switchport trunk allowed vlan " + A + "," + Bv, "Trunk = un singur cablu care duce mai multe VLAN-uri, fiecare cadru cu eticheta 802.1Q (numărul VLAN-ului). allowed = doar VLAN-urile listate trec."),
        O2("SW2: vlan " + A + " și vlan " + Bv, "s2v", function () { return !!(s2().vlans[A] && s2().vlans[Bv]); }, "PuTTY COM" + V.rcom + " → enable → conf t → vlan " + A + " → exit → vlan " + Bv + " → exit", "VLAN-ul trebuie să existe pe fiecare switch prin care trece (fără VTP)."),
        O2("SW2 Gi0/1: switchport mode trunk + allowed vlan " + A + "," + Bv, "t2", function () { var f = s2().ifs["GigabitEthernet0/1"]; return allowHas(f, A) && allowHas(f, Bv) && f.allow != null; }, "Pe SW2: interface gi0/1 → switchport mode trunk → switchport trunk allowed vlan " + A + "," + Bv, "Ambele capete ale trunk-ului trebuie să fie trunk, cu aceleași VLAN-uri permise."),
        O2("SW2: interface vlan " + A + " → " + V.s2ip + " " + V.mask + ", no shutdown", "s2svi", function () { var f = s2().ifs["Vlan" + A]; return !!f && f.ip === V.s2ip && f.mask === V.mask && !f.shut; }, "interface vlan " + A + " → ip address " + V.s2ip + " " + V.mask + " → no shutdown", "Adresa de administrare a lui SW2, în VLAN-ul laptopului."),
        O2("Laptop: ping " + V.s2ip + " (SW2, prin trunk)", "pingS2", function () { var d = L().did; return !!(d.ping && d.ping[V.s2ip]); }, "În cmd pe laptop: ping " + V.s2ip + ". Dacă nu merge: LED verde pe trunk? VLAN " + A + " permis pe ambele capete?", "Reply = cadrul a plecat din VLAN " + A + ", a trecut etichetat prin trunk și a ajuns la SW2.")] },
      b2: { t: "Router-on-a-stick (dot1Q)", ic: "🪵", st: "desk", d: "Pe un singur port fizic " + V.rshort + ": sub-interfețe pentru VLAN " + A + " și " + Bv + ", trunk pe switch, ping între VLAN-uri.", obj: [
        O2("Switch " + V.upshort + ": switchport mode trunk (VLAN " + A + " și " + Bv + " permise)", "rtk", function () { var f = sw().ifs[V.up]; return allowHas(f, A) && allowHas(f, Bv) && !f.shut; }, "PuTTY COM" + V.com + " → conf t → interface " + V.upshort.toLowerCase() + " → switchport mode trunk (opțional: switchport trunk allowed vlan " + A + "," + Bv + ")", "Routerul primește ambele VLAN-uri pe același cablu, etichetate 802.1Q."),
        O2("Router " + V.rshort + "." + A + ": encapsulation dot1Q " + A + " + ip " + V.gw + " " + V.mask, "subA", function () { var f = r().ifs[V.rif + "." + A]; return !!f && f.enc === A && f.ip === V.gw && f.mask === V.mask; }, "PuTTY COM" + V.rcom + " → conf t → interface " + V.rshort.toLowerCase() + "." + A + " → encapsulation dot1Q " + A + " → ip address " + V.gw + " " + V.mask, "Sub-interfața = o interfață logică pe portul fizic; dot1Q " + A + " = acceptă cadrele etichetate cu VLAN " + A + "."),
        O2("Router " + V.rshort + "." + Bv + ": encapsulation dot1Q " + Bv + " + ip " + V.gw2 + " " + V.mask, "subB", function () { var f = r().ifs[V.rif + "." + Bv]; return !!f && f.enc === Bv && f.ip === V.gw2 && f.mask === V.mask; }, "interface " + V.rshort.toLowerCase() + "." + Bv + " → encapsulation dot1Q " + Bv + " → ip address " + V.gw2 + " " + V.mask, "Fiecare VLAN = altă rețea IP, cu gateway-ul lui pe router."),
        O2("Router: no shutdown pe interfața fizică " + V.rshort, "rns", CK.rns, "interface " + V.rshort.toLowerCase() + " → no shutdown", "Sub-interfețele urmează starea interfeței fizice: fără no shutdown pe " + V.rshort + " nu merge nimic."),
        O2("Laptop: ping " + V.gw + " (gateway VLAN " + A + ")", "pA", function () { var d = L().did; return !!(d.ping && d.ping[V.gw]); }, "cmd → ping " + V.gw, "Laptopul ajunge la sub-interfața din VLAN-ul lui."),
        O2("Laptop: ping " + V.gw2 + " (alt VLAN – rutare între VLAN-uri)", "pB", function () { var d = L().did; return !!(d.ping && d.ping[V.gw2]); }, "cmd → ping " + V.gw2 + " (pachetul merge la gateway-ul " + V.gw + ", routerul îl rutează în VLAN " + Bv + ")", "Inter-VLAN routing: comunicarea între VLAN-uri trece obligatoriu printr-un echipament de nivel 3.")] },
      b3: { t: "DHCP pe router", ic: "📡", st: "desk", d: "Faci un pool DHCP pe router pentru rețeaua " + V.net + "/" + V.pre + " și laptopul ia singur adresa.", obj: [
        O2("ip dhcp excluded-address " + V.gw + " (adresa routerului nu se dă)", "dex", function () { var x = ip2i(V.gw); return (r().dexcl || []).some(function (e) { return x >= e[0] && x <= e[1]; }); }, "PuTTY COM" + V.rcom + " → conf t → ip dhcp excluded-address " + V.gw + (V.svi ? " (poți exclude și " + V.svi + ")" : ""), "Adresele excluse nu sunt date clienților: gateway-ul, switch-ul, serverele."),
        O2("ip dhcp pool LAN: network " + V.net + " " + V.mask, "dnet", function () { var P = r().dpool || {}; return Object.keys(P).some(function (k) { return P[k].net && B.ipIn(V.gw, P[k].net, P[k].mask) && P[k].mask === V.mask; }); }, "(config)# ip dhcp pool LAN → network " + V.net + " " + V.mask, "Pool = intervalul din care routerul împarte adrese."),
        O2("default-router " + V.gw, "dgw", function () { var P = r().dpool || {}; return Object.keys(P).some(function (k) { return P[k].gw === V.gw; }); }, "(dhcp-config)# default-router " + V.gw, "Clientul primește și gateway-ul, nu doar IP-ul."),
        O2("Laptop: „Obtain an IP address automatically” + adresă primită din pool", "dgot", function () { var l = L(); return l.dhcp && l.ipFrom === "dhcp" && B.ipIn(l.ip, V.gw, V.mask) && l.gw === V.gw; }, "Laptop → Setări rețea → IPv4 → Obtain an IP address automatically → OK; apoi cmd → ipconfig /renew", "DHCP = Discover → Offer → Request → Ack (DORA)."),
        O2("cmd: ipconfig (verifici adresa primită)", "dcfg", function () { var l = L(); return l.ipFrom === "dhcp" && (!!l.did.ip || !!l.did.ipall); }, "cmd → ipconfig (sau ipconfig /all ca să vezi și serverul DHCP)", "ipconfig /all arată „DHCP Enabled: Yes” și serverul DHCP.")] },
      b4: { t: "Securitate de bază pe switch", ic: "🛡️", st: "desk", d: "enable secret, parolă pe consolă, criptarea parolelor, banner motd și salvare.", obj: [
        O2("enable secret " + V.en, "esec", function () { return sw().secret === V.en; }, "conf t → enable secret " + V.en, "Parola pentru modul privilegiat (#), stocată criptat (MD5/SHA). secret e mai bun decât enable password."),
        O2("line console 0: password " + V.conpw + " + login", "conp", function () { var l = sw().line.con; return l.pw === V.conpw && l.login; }, "line console 0 → password " + V.conpw + " → login → exit", "Fără login, parola de consolă nu e cerută!"),
        O2("service password-encryption", "spe", function () { return !!sw().enc; }, "(config)# service password-encryption", "Criptează (tip 7, slab) parolele scrise în clar în configurație – să nu le vadă cine se uită peste umăr."),
        O2("banner motd cu textul: " + V.motd, "ban", function () { return String(sw().banner || "").indexOf(V.motd) >= 0; }, "(config)# banner motd #" + V.motd + "#", "MOTD = mesajul afișat la conectare (avertisment legal)."),
        O2("copy running-config startup-config", "save", CK.save, "end → copy running-config startup-config → Enter", "Salvezi în NVRAM, altfel se pierde la restart.")] },
      b5: { t: "Depanare: găsește defectul", ic: "🧰", st: "examiner", d: "Rețeaua era funcțională, dar cineva a stricat ceva (aleator). Găsește defectul, repară-l și spune examinatorului ce era.", obj: [
        O2("Laptop: ping " + V.svi + " (switch) reușit", "tpS", function () { var d = L().did; return !!(d.ping && d.ping[V.svi]); }, "Verifică în ordine: LED-uri (cabluri), show ip interface brief / show vlan brief pe switch, ipconfig pe laptop.", "Depanare de jos în sus: fizic → VLAN → IP."),
        O2("Laptop: ping " + V.gw + " (router) reușit", "tpG", function () { var d = L().did; return !!(d.ping && d.ping[V.gw]); }, "Dacă switch-ul răspunde dar routerul nu: legătura " + V.upshort + "–" + V.rshort + ", no shutdown pe router, VLAN-ul portului spre router.", "Gateway-ul trebuie să fie în aceeași rețea cu laptopul."),
        O2("Spune examinatorului care a fost defectul", "diag", function () { return !!st.diagOK; }, "Mergi la examinator și alege defectul găsit.", "La examen explici și CE ai găsit, nu doar repari.")] }
    };
  }
  var TFAULTS = [["cable", "Cablul switch → router era unul de consolă (rollover), nu cablu drept"], ["shut", "Portul laptopului de pe switch era oprit (shutdown)"], ["vlan", "Portul laptopului era în alt VLAN"], ["mask", "Laptopul avea masca de rețea greșită"], ["gw", "Laptopul avea default gateway greșit"], ["rshut", "Interfața routerului era oprită (shutdown)"]];
  function setupBonus(st, id) {
    var V = st.V, r = mkRng(V.seed ^ 0xb0b);
    if (id === "b1") { st.S.s2 = B.cliNew("switch"); st.S.s2.unpl = {}; Object.keys(st.S.s2.ifs).forEach(function (n) { if (!/^Vlan/.test(n)) st.S.s2.unpl[n] = 1; }); preCable(st, ["con", "lan"]); B.cliRun(st.S.s2, "enable"); ["enable", "configure terminal", "hostname SW2", "end", ""].forEach(function (c) { B.cliRun(st.S.s2, c); }); st.S.s2.mode = "user"; st.S.s2.hist = []; st.S.s2.did = {};
      ["enable", "configure terminal", "hostname " + V.host, "vlan " + V.vlan, "name " + V.vname, "exit", "vlan " + V.vlan2, "name " + V.vname2, "exit", "interface " + V.port, "switchport mode access", "switchport access vlan " + V.vlan, "end", ""].forEach(function (c) { B.cliRun(st.S.sw, c); }); st.S.sw.mode = "user"; st.S.sw.hist = []; st.S.sw.did = {}; pcStatic(st); openConsoleSilently(st); }
    if (id === "b2") { preCable(st, ["con", "lan", "up", "rcon"]); ["enable", "configure terminal", "hostname " + V.host, "vlan " + V.vlan, "name " + V.vname, "exit", "vlan " + V.vlan2, "name " + V.vname2, "exit", "interface " + V.port, "switchport mode access", "switchport access vlan " + V.vlan, "end", ""].forEach(function (c) { B.cliRun(st.S.sw, c); }); st.S.sw.mode = "user"; st.S.sw.hist = []; st.S.sw.did = {}; pcStatic(st); }
    if (id === "b3") { preCable(st, ["con", "lan", "up", "rcon"]); cfgSwitch(st, true); cfgRouter(st); var l = st.S.pc; l.dhcp = false; l.ip = V.pc; l.mask = V.mask; l.gw = ""; }
    if (id === "b4") { preCable(st, ["con"]); openConsoleSilently(st); B.cliRun(st.S.sw, "disable"); }
    if (id === "b5") { preCable(st, ["con", "lan", "up", "rcon"]); cfgSwitch(st, true); cfgRouter(st); pcStatic(st); var TF = TFAULTS.filter(function (x) { return x[0] !== "gw"; }), f = TF[Math.floor(r() * TF.length)]; st.tfault = f;
      var run = function (dev, cs) { ["enable", "configure terminal"].concat(cs, ["end", ""]).forEach(function (c) { B.cliRun(dev, c); }); dev.mode = "user"; dev.hist = []; dev.did = {}; };
      if (f[0] === "cable") { var u = uplink(st); removeCable(st, u); addCable(st, "roll", V.upa, V.ra, true); }
      if (f[0] === "shut") run(st.S.sw, ["interface " + V.port, "shutdown"]);
      if (f[0] === "vlan") run(st.S.sw, ["vlan " + (V.vlan === 2 ? 3 : V.vlan - 1), "exit", "interface " + V.port, "switchport access vlan " + (V.vlan === 2 ? 3 : V.vlan - 1)]);
      if (f[0] === "mask") st.S.pc.mask = V.mask === "255.255.255.252" ? "255.255.255.255" : "255.255.255.252";
      if (f[0] === "gw") { var g = V.gw.split("."); g[3] = String((+g[3] % 250) + 3); st.S.pc.gw = g.join(".") === V.svi || g.join(".") === V.pc ? V.svi.replace(/\d+$/, "0") : g.join("."); }
      if (f[0] === "rshut") run(st.S.r, ["interface " + V.rif, "shutdown"]);
      if (f[0] === "mask") { var pc = st.S.pc; if (B.ipIn(V.svi, pc.ip, pc.mask) && B.ipIn(V.gw, pc.ip, pc.mask)) pc.mask = "255.255.255.255"; }
      st.S.pc.did = {}; }
    if (id === "m9" || id === "m1") {}
  }
  function diagQ(st) { var opts = TFAULTS.map(function (f) { return f; }); return '<h3>Ce defect ai găsit?</h3><div class="jgopts">' + opts.map(function (f) { return '<button data-f data-dg="' + f[0] + '">' + esc(f[1]) + "</button>"; }).join("") + "</div>"; }
  function wireDiag(st) { Array.prototype.forEach.call(document.querySelectorAll("[data-dg]"), function (b) { b.onclick = function () { if (b.getAttribute("data-dg") === st.tfault[0]) { st.diagOK = true; SFX.ok(); learn("✅ Defect identificat: " + st.tfault[1]); checkObj(); closePanel(); } else mistake("Nu acesta a fost defectul. Mai verifică (LED-uri, show vlan brief, show ip interface brief, ipconfig).", "Diagnosticul trebuie să se bazeze pe ce vezi, nu pe ghicit."); }; }); }
  /* ===== nivel (Normal / Greu), timpi, pauză, „Reia greșelile” pe timp, rezolvare automată (teste) ===== */
  var DIFF = (function () { try { return localStorage.getItem("jg_diff") === "greu" ? "greu" : "normal"; } catch (e) { return "normal"; } })();
  function setDiff(d) { DIFF = d === "greu" ? "greu" : "normal"; try { localStorage.setItem("jg_diff", DIFF); } catch (e) {} }
  function pauseT(on) { if (!G || !G.dl || G.scored) return; if (on) { if (DIFF === "greu" || G.pz) return; G.pz = now(); } else if (G.pz) { G.dl += now() - G.pz; G.pz = 0; } hudTimer(); }
  function minsFor(st, n, kind) { var g = DIFF === "greu"; if (kind === "exam") return g ? 35 : 45; if (kind === "replay") return Math.max(2, Math.ceil(n * (g ? 1.5 : 2.5))); var per = { m2: 6, m9: 5, m1: 5 }[st.mis]; if (per) return g ? Math.ceil(per * 0.7) : per; return Math.max(3, Math.ceil(n * (g ? 1.2 : 2))); }
  function timeUp() { var st = G; if (!st || st.scored) return; if (st.mode === "exam" || st.mode === "story") return examSubmit(true); if (st.mode === "replay") return replayEnd(true); missionTimeout(); }
  function missionTimeout() { var st = G; st.scored = true; closePanel(); SFX.bad(); var ok = st.obj.filter(function (o, i) { return st.done[i]; }).length; var P = B.P(); P.cli = P.cli || {}; var k = "jg:t:" + st.mis; P.cli[k] = (P.cli[k] || 0) + 1; B.saveP();
    showResult("⏱️ Timpul a expirat", "<p>Ai bifat <b>" + ok + "</b> din " + st.obj.length + " cerințe în " + minsFor(st, st.obj.length) + " min" + (DIFF === "greu" ? " (Greu)" : "") + ".</p>" + (st.tfault ? "<p>Defectul era: <b>" + esc(st.tfault[1]) + "</b></p>" : "") + replayBtn(), true); wireReplay(true); }
  /* care pas a fost greșit: după panoul deschis, altfel cerința curentă */
  function errKey() { if (!G || !G.obj || !G.obj.length) return null; var has = function (k) { return G.obj.some(function (o) { return o.k === k; }); };
    if (PANEL) { if (PANEL.id === "bench" && has("crimp")) return "crimp"; if (PANEL.id === "fiber" && has("fiber")) return "fiber"; if (PANEL.id === "rack" && G.ident && !G.ident.done && has("ident")) return "ident"; }
    for (var i = 0; i < G.obj.length; i++) { var k = G.obj[i].k; if (!G.done[i] && k !== "crimp" && k !== "fiber" && k !== "ident") return k; } var o = curObj(); return o ? o.k : null; }
  function failedObjs(st) { return st.obj.filter(function (o, i) { return !st.done[i] || (st.errK && st.errK[o.k]); }); }
  var RPT = 0;
  function replayBtn() { clearInterval(RPT); var f = G ? failedObjs(G) : []; return f.length ? '<div class="jgrep"><p><b>🔁 Reia greșelile</b> – doar cei ' + f.length + " pași greșiți / nefăcuți, pe timp (" + minsFor(G, f.length, "replay") + " min" + (DIFF === "greu" ? ", Greu: fără pauză" : "") + "):</p><ul class='jgol'>" + f.slice(0, 8).map(function (o) { return "<li>❌ " + esc(o.t) + "</li>"; }).join("") + (f.length > 8 ? "<li>… încă " + (f.length - 8) + "</li>" : "") + '</ul><div class="jgbtns"><button class="jgbig gold" data-f id="jgReplay">🔁 Reia greșelile acum</button><button class="jgbig2" data-f id="jgNoRep">Nu acum</button></div></div>' : '<p class="jgsm">Nicio greșeală de reluat. 👏</p>'; }
  function wireReplay(auto) { var b = $("jgReplay"); if (!b) return; var go = function () { clearInterval(RPT); closeModal(); startReplay(); }; b.onclick = go; if ($("jgNoRep")) $("jgNoRep").onclick = function () { clearInterval(RPT); b.textContent = "🔁 Reia greșelile acum"; var n = $("jgNoRep"); if (n) n.remove(); };
    if (auto && !B.coActive() && !(G && G.mode === "replay" && G.rpN > 2)) { var t = 10; b.textContent = "🔁 Pornește automat în " + t + " s"; RPT = setInterval(function () { t--; var e = $("jgReplay"); if (!e) { clearInterval(RPT); return; } if (t <= 0) go(); else e.textContent = "🔁 Pornește automat în " + t + " s"; }, 1000); } }
  var FREL = { shutPort: ["acc", "lan", "pingSw", "pcIp"], speed: ["putCom", "awake", "en"], rtrBad: ["rip", "rns", "pingGw"], upVlan: ["upAcc", "pingGw"] };
  var CFGK = ["host", "vlan", "acc", "svi", "dom", "rsa", "user", "vty", "upAcc", "esec", "conp", "spe", "ban"];
  function expandFail(keys, all) { var f = {}; keys.forEach(function (k) { f[k] = 1; }); var dep = function (a, bs) { if (f[a]) bs.forEach(function (b) { if (all.indexOf(b) >= 0) f[b] = 1; }); };
    dep("conSw", ["putCom", "awake", "en"]); dep("putCom", ["awake", "en"]); dep("awake", ["en"]); dep("host", ["rsa"]); dep("dom", ["rsa"]); CFGK.forEach(function (k) { dep(k, ["save"]); }); dep("dnet", ["dgot", "dcfg"]); dep("dgw", ["dgot", "dcfg"]); dep("dgot", ["dcfg"]); return all.filter(function (k) { return f[k]; }); }
  function buildReplay(st, keys) {
    var V = JSON.parse(JSON.stringify(st.V)); V.faults = (V.faults || []).filter(function (fk) { return FREL[fk].some(function (k) { return keys.indexOf(k) >= 0; }); });
    var s2 = newState("replay", st.mis, V); s2.fast = st.fast; s2.rpN = (st.rpN || 0) + 1; s2.from = st.mode; s2.story = st.story; if (/^[mb]/.test(st.mis) && st.mis !== "ex") setupMission(s2, st.mis); s2.tfault = st.tfault;
    var all = st.obj.map(function (o) { return o.k; }), fail = expandFail(keys, all), saveG = G; G = s2;
    try { all.forEach(function (k) { if (fail.indexOf(k) < 0 && SOLVE[k]) SOLVE[k](s2); }); } finally { G = saveG; }
    var X = allObjs(s2); s2.obj = fail.map(function (k) { return X[k]; }).filter(Boolean); s2.done = {}; s2.S.pc.did = s2.S.pc.did || {}; return s2; }
  function startReplay() { var st = G; if (!st) return; var f = failedObjs(st).map(function (o) { return o.k; }); if (!f.length) return; var s2 = buildReplay(st, f); G = s2;
    s2.dl = now() + minsFor(s2, s2.obj.length, "replay") * 60000; $("jgTitle").textContent = "🔁 Reia greșelile · " + (DIFF === "greu" ? "Greu" : "Normal"); setLevel("prac"); if (!V3) paint2d(); paintCarry(); setObj(s2.obj); linkTick(); say("Reluăm doar pașii greșiți (" + s2.obj.length + "). Ceasul pornește acum" + (DIFF === "greu" ? " și nu se oprește." : "."), 6000); }
  function replayEnd(timeout) { var st = G; if (st.scored) return; st.scored = true; closePanel(); var ok = st.obj.filter(function (o, i) { return st.done[i]; }).length; var P = B.P(); P.cli = P.cli || {}; P.cli["jg:rp"] = (P.cli["jg:rp"] || 0) + 1; if (!timeout && ok === st.obj.length) P.cli["jg:rpok"] = (P.cli["jg:rpok"] || 0) + 1; B.saveP(); if (ok === st.obj.length && !timeout) SFX.done(); else SFX.bad();
    showResult(timeout ? "⏱️ Timpul a expirat" : "🔁 Reluare terminată", "<p>Ai rezolvat <b>" + ok + "</b> din " + st.obj.length + " pași reluați în " + mmss(now() - st.t0) + (timeout ? " – timpul a expirat" : "") + ".</p>" + replayBtn(), true); wireReplay(false); }
  /* ---------- rezolvitor: face fiecare pas prin aceleași motoare (cabluri, IOS, Windows) – folosit la reluare și la testele automate ---------- */
  function cli(st, dev, cmds) { var d = st.S[dev], V = st.V; if (d.pend) gRun(d, ""); var seq = ["", "enable"]; seq.forEach(function (c) { gRun(d, c); if (d.pend && c === "enable") gRun(d, d.secret === V.en ? V.en : d.secret || d.epw); }); if (d.mode === "user") return; gRun(d, "configure terminal"); cmds.forEach(function (c) { var o = gRun(d, c); if (d.pend) gRun(d, /rsa/.test(c) ? "1024" : ""); }); gRun(d, "end"); }
  function settle(st) { linkTick(); Object.keys(st.linkT).forEach(function (k) { st.linkT[k] -= 40000; }); linkTick(); }
  function cab(st, t, a, b) { [a, b].forEach(function (x) { var c = cableAt(st, x); if (c) removeCable(st, c); }); addCable(st, t, a, b, true); settle(st); }
  function win(st, c) { var L = st.S.pc; settle(st); return B.winRun(L, c); }
  var SOLVE = {
    conSw: function (st) { cab(st, "usb", "pc.usb", "sw.con"); }, lan: function (st) { cab(st, "straight", "pc.lan", anchorOfIf(st.V.port)); }, up: function (st) { cab(st, "straight", st.V.upa, st.V.ra); }, rcon: function (st) { cab(st, "usb", "pc.usb2", "r.con"); },
    lanGreen: settle, upGreen: settle,
    putCom: function (st) { st.putty = { type: "serial", line: "COM" + st.V.com, speed: "9600", host: "", port: "22" }; st.con = { dev: st.S.sw, open: true, awake: false, title: "COM" + st.V.com + " - PuTTY", lines: [], speed: "9600", kind: "serial" }; },
    awake: function (st) { if (st.con) st.con.awake = true; }, en: function (st) { var s = st.S.sw; if (s.mode === "user") { gRun(s, "enable"); if (s.pend) gRun(s, s.secret || s.epw); } },
    host: function (st) { cli(st, "sw", ["hostname " + st.V.host]); }, vlan: function (st) { cli(st, "sw", ["vlan " + st.V.vlan, "name " + st.V.vname, "exit"]); },
    acc: function (st) { cli(st, "sw", ["interface " + st.V.port, "switchport mode access", "switchport access vlan " + st.V.vlan, "no shutdown"]); }, svi: function (st) { cli(st, "sw", ["interface vlan " + st.V.vlan, "ip address " + st.V.svi + " " + st.V.mask, "no shutdown"]); },
    dom: function (st) { cli(st, "sw", ["ip domain-name " + st.V.dom]); }, rsa: function (st) { cli(st, "sw", ["crypto key generate rsa modulus 1024"]); }, user: function (st) { cli(st, "sw", ["username " + st.V.user + " secret " + st.V.pass]); },
    vty: function (st) { cli(st, "sw", ["line vty 0 4", "login local", "transport input ssh"]); }, save: function (st) { var s = st.S.sw; cli(st, "sw", []); gRun(s, "copy running-config startup-config"); if (s.pend) gRun(s, ""); },
    rip: function (st) { cli(st, "r", ["interface " + st.V.rif, "ip address " + st.V.gw + " " + st.V.mask]); }, rns: function (st) { cli(st, "r", ["interface " + st.V.rif, "no shutdown"]); settle(st); },
    upAcc: function (st) { cli(st, "sw", ["interface " + st.V.up, "switchport mode access", "switchport access vlan " + st.V.vlan, "no shutdown"]); settle(st); },
    pcIp: function (st) { pcStatic(st); st.S.pc.ipFrom = ""; }, ipcfg: function (st) { win(st, "ipconfig"); }, pingGw: function (st) { win(st, "ping " + st.V.gw); }, pingSw: function (st) { win(st, "ping " + st.V.svi); }, ssh: function (st) { win(st, "ssh -l " + st.V.user + " " + st.V.svi); },
    ident: function (st) { st.ident = { done: true, q: [], i: 0, ok: 0 }; }, crimp: function (st) { st.crimp = { passed: true, got: [[], []], end: 1, step: 5 }; }, fiber: function (st) { st.fiber = { done: true, s: 9 }; },
    tcab: function (st) { cab(st, "straight", st.V.tr, "s2.gi1"); }, s2con: function (st) { cab(st, "usb", "pc.usb2", "s2.con"); },
    t1: function (st) { cli(st, "sw", ["interface " + ifOf(st.V.tr), "switchport mode trunk", "switchport trunk allowed vlan " + st.V.vlan + "," + st.V.vlan2]); settle(st); },
    s2v: function (st) { cli(st, "s2", ["vlan " + st.V.vlan, "exit", "vlan " + st.V.vlan2, "exit"]); }, t2: function (st) { cli(st, "s2", ["interface GigabitEthernet0/1", "switchport mode trunk", "switchport trunk allowed vlan " + st.V.vlan + "," + st.V.vlan2]); settle(st); },
    s2svi: function (st) { cli(st, "s2", ["interface vlan " + st.V.vlan, "ip address " + st.V.s2ip + " " + st.V.mask, "no shutdown"]); }, pingS2: function (st) { win(st, "ping " + st.V.s2ip); },
    rtk: function (st) { cli(st, "sw", ["interface " + st.V.up, "switchport mode trunk", "switchport trunk allowed vlan " + st.V.vlan + "," + st.V.vlan2, "no shutdown"]); settle(st); },
    subA: function (st) { cli(st, "r", ["interface " + st.V.rif + "." + st.V.vlan, "encapsulation dot1Q " + st.V.vlan, "ip address " + st.V.gw + " " + st.V.mask]); }, subB: function (st) { cli(st, "r", ["interface " + st.V.rif + "." + st.V.vlan2, "encapsulation dot1Q " + st.V.vlan2, "ip address " + st.V.gw2 + " " + st.V.mask]); },
    pA: function (st) { win(st, "ping " + st.V.gw); }, pB: function (st) { win(st, "ping " + st.V.gw2); },
    dex: function (st) { cli(st, "r", ["ip dhcp excluded-address " + st.V.gw]); }, dnet: function (st) { cli(st, "r", ["ip dhcp pool LAN", "network " + st.V.net + " " + st.V.mask]); }, dgw: function (st) { cli(st, "r", ["ip dhcp pool LAN", "default-router " + st.V.gw]); },
    dgot: function (st) { var L = st.S.pc; L.dhcp = true; settle(st); var g = L.dhcpGet(); if (g) { L.ip = g.ip; L.mask = g.mask; L.gw = g.gw; } }, dcfg: function (st) { win(st, "ipconfig /all"); },
    esec: function (st) { cli(st, "sw", ["enable secret " + st.V.en]); }, conp: function (st) { cli(st, "sw", ["line console 0", "password " + st.V.conpw, "login"]); }, spe: function (st) { cli(st, "sw", ["service password-encryption"]); }, ban: function (st) { cli(st, "sw", ["banner motd #" + st.V.motd + "#"]); },
    tpS: function (st) { var f = st.tfault && st.tfault[0], V = st.V; if (f === "cable") cab(st, "straight", V.upa, V.ra); if (f === "shut") cli(st, "sw", ["interface " + V.port, "no shutdown"]); if (f === "vlan") cli(st, "sw", ["interface " + V.port, "switchport access vlan " + V.vlan]); if (f === "mask") st.S.pc.mask = V.mask; if (f === "rshut") cli(st, "r", ["interface " + V.rif, "no shutdown"]); settle(st); win(st, "ping " + V.svi); },
    tpG: function (st) { win(st, "ping " + st.V.gw); }, diag: function (st) { st.diagOK = true; }
  };
  /* rulează o misiune întreagă cu rezolvitorul (doar pentru teste: window.__jg) */
  function autoSolve(id, seed, diff, skip) { var d0 = DIFF; setDiff(diff); try { var V = genVar(seed, 1); if (diff === "greu" && id === "ex") addFaults(V, seed); var st = newState(id === "ex" ? "exam" : "mis", id, V), saveG = G; G = st; st.fast = true;
      try { if (id === "ex") st.obj = examObjs(st); else { setupMission(st, id); st.obj = MS(st)[id].obj; } st.done = {}; st.obj.forEach(function (o) { if (!(skip && skip.indexOf(o.k) >= 0)) { if (!SOLVE[o.k]) throw new Error("fără rezolvitor: " + o.k); SOLVE[o.k](st); } settle(st); });
        st.obj.forEach(function (o, i) { var ok = false; try { ok = !!o.ok(st); } catch (e) { ok = false; } if (ok) st.done[i] = 1; });
        var res = { id: id, seed: seed, total: st.obj.length, done: Object.keys(st.done).length, fail: st.obj.filter(function (o, i) { return !st.done[i]; }).map(function (o) { return o.k; }), grade: id === "ex" ? examGrade(st).g : null, V: { host: V.host, vlan: V.vlan, net: V.net + "/" + V.pre, rif: V.rif, up: V.up, port: V.port, faults: V.faults, groups: st.exg }, dbg: { lu: st.led[V.upa], lr: st.led[V.ra], u: st.S.sw.ifs[V.up], g: st.S.r.ifs[V.rif], pc: [st.S.pc.ip, st.S.pc.mask, st.S.pc.gw], gw: V.gw, svi: V.svi, cab: st.cab.map(function (c) { return c.t + ":" + c.a + "-" + c.b; }), save: CK.save(st) } };
        if (skip && skip.length) { var r2 = buildReplay(st, skip.filter(function (k) { return st.obj.some(function (o) { return o.k === k; }); })); G = r2; r2.obj.forEach(function (o) { SOLVE[o.k](r2); settle(r2); }); res.replay = { total: r2.obj.length, done: r2.obj.filter(function (o) { try { return o.ok(r2); } catch (e) { return false; } }).length, keys: r2.obj.map(function (o) { return o.k; }) }; }
        return res; } finally { G = saveG; } } finally { setDiff(d0); } }
  /* test negativ: valori greșite (dar plauzibile) NU trebuie acceptate */
  function negTest(seed) { var V0 = genVar(seed, 1), bad = [], saveG = G;
    function alt(ip) { var a = ip.split("."); a[3] = String(((+a[3] + 7) % 250) + 1); var x = a.join("."); return x === V0.pc || x === V0.gw || x === V0.svi ? alt(x) : x; }
    var portN = String(V0.port).replace(/(\d+)$/, function (m) { return String((+m % 20) + 1 === +m ? +m + 1 : (+m % 20) + 1); });
    var C = [["host", function (st) { cli(st, "sw", ["hostname " + st.V.host + "X"]); }],
      ["vlan", function (st) { cli(st, "sw", ["vlan " + (+st.V.vlan + 1), "name " + st.V.vname, "exit"]); }],
      ["vlan", function (st) { cli(st, "sw", ["vlan " + st.V.vlan, "name GRESIT", "exit"]); }],
      ["acc", function (st) { cli(st, "sw", ["interface " + portN, "switchport mode access", "switchport access vlan " + st.V.vlan, "no shutdown"]); }],
      ["acc", function (st) { cli(st, "sw", ["interface " + st.V.port, "switchport mode access", "switchport access vlan " + (+st.V.vlan + 1), "no shutdown"]); }],
      ["svi", function (st) { cli(st, "sw", ["interface vlan " + st.V.vlan, "ip address " + alt(st.V.svi) + " " + st.V.mask, "no shutdown"]); }],
      ["dom", function (st) { cli(st, "sw", ["ip domain-name gresit.ro"]); }],
      ["user", function (st) { cli(st, "sw", ["username " + st.V.user + "x secret " + st.V.pass]); }],
      ["pcIp", function (st) { pcStatic(st); st.S.pc.mask = "255.255.255.252" === st.V.mask ? "255.255.255.0" : "255.255.255.252"; st.S.pc.ipFrom = ""; }],
      ["pcIp", function (st) { pcStatic(st); st.S.pc.gw = alt(st.V.gw); st.S.pc.ipFrom = ""; }],
      ["upAcc", function (st) { cli(st, "sw", ["interface " + st.V.up, "switchport mode trunk", "no shutdown"]); settle(st); }],
      ["upAcc", function (st) { cli(st, "sw", ["interface " + st.V.up, "switchport mode access", "switchport access vlan " + st.V.vlan, "shutdown"]); settle(st); }]];
    C.forEach(function (c) { var st = newState("exam", "ex", genVar(seed, 1)); G = st; st.fast = true; try { st.obj = examObjs(st); st.obj.forEach(function (o) { if (o.k !== c[0]) SOLVE[o.k](st); else c[1](st); settle(st); });
      var o = st.obj.filter(function (x) { return x.k === c[0]; })[0]; var ok = false; try { ok = !!o.ok(st); } catch (e) {} if (ok) bad.push(c[0] + ":" + C.indexOf(c)); if (examGrade(st).g >= 10) bad.push("grade10:" + C.indexOf(c)); } catch (e) { bad.push("EXC " + c[0] + " " + e.message); } finally { G = saveG; } });
    var d = newState("mis", "b3", genVar(seed, 1)); G = d; try { setupMission(d, "b3"); cli(d, "r", ["ip dhcp excluded-address " + d.V.gw]); var n1 = (d.S.r.dexcl || []).length; cli(d, "r", ["no ip dhcp excluded-address " + d.V.gw]); if (!(n1 === 1 && d.S.r.dexcl.length === 0)) bad.push("dhcp-no-excl"); } catch (e) { bad.push("EXC dhcp " + e.message); } finally { G = saveG; }
    return bad; }

  /* ---------- interfața publică ---------- */
  var API = { mount: mount, unmount: unmount, active: function () { return !!root; }, storyResume: function () { storyResume("prac"); }, ticketNo: function () { return STORY && STORY.V ? { n: STORY.V.n } : null; } };
  if (typeof window !== "undefined" && /[?&]jgtest=1/.test(location.search)) window.__jg = { negTest: negTest, autoSolve: autoSolve, genVar: genVar, addFaults: addFaults, draw3: draw3, G: function () { return G; }, setDiff: setDiff, diff: function () { return DIFF; }, start: function (id, V) { startMission(id, null, V); }, startStory: startStory, replay: startReplay, solve: function (k) { SOLVE[k](G); settle(G); checkObj(); }, timeUp: timeUp, check: checkObj, failed: function () { return failedObjs(G).map(function (o) { return o.k; }); }, mistake: mistake, open: openStation, menu: menu, V3: function () { return V3; }, gRun: function (d, c) { return gRun(G.S[d], c); }, win: function (c) { return B.winRun(G.S.pc, c); }, pcReach: function (ip) { return pcReach(G, ip); }, MS: function () { return MS(G); }, ticket: function () { return ticketHtml(G); } };
  return API;
})();
