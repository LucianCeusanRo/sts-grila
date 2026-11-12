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
    if (plug) s += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="18" height="15" rx="2" fill="' + plug + '" opacity=".95"/><rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="14" height="5" fill="rgba(255,255,255,.35)"/>';
    return s + "</g>";
  }
  function portLed(pid, p, st) { var s = (st.leds && st.leds[pid]) || "off"; return led(pid, p[0] + 11, p[3] === "t" ? p[1] - 5 : p[1] + 25, s); }
  function switchFront(st) {
    st = st || {}; var s = '<svg class="jgpanel" viewBox="0 0 880 90" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica,Arial,sans-serif">' + defs();
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
    st = st || {}; var s = '<svg class="jgpanel" viewBox="0 0 880 90" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica,Arial,sans-serif">' + defs();
    s += '<rect x="0" y="0" width="880" height="90" rx="3" fill="#3a4654"/>';
    for (var k = 0; k < 18; k++) s += '<circle cx="' + (60 + (k % 9) * 14) + '" cy="' + (30 + Math.floor(k / 9) * 14) + '" r="4.5" fill="#20262e"/>';
    s += '<rect x="250" y="22" width="70" height="46" rx="4" fill="#1d232a"/><rect x="262" y="32" width="46" height="26" rx="3" fill="#0d1014"/><text x="285" y="80" font-size="6.5" fill="#dfe6ee" text-anchor="middle">100-240V~ 50-60 Hz</text>';
    s += '<rect x="420" y="26" width="120" height="38" rx="3" fill="#2d3742"/><text x="480" y="48" font-size="7" fill="#9fb0c2" text-anchor="middle">RPS (nefolosit)</text>';
    var p = L.swr.p.con; s += rj("con", p, st, "#78c8f0") + '<text x="' + (p[0] + 11) + '" y="' + (p[1] + 32) + '" font-size="7" fill="#9be0ff" text-anchor="middle" font-weight="700">CONSOLE</text>';
    s += '<text x="760" y="50" font-size="7" fill="#dfe6ee" text-anchor="middle">SPATELE switch-ului</text>';
    return s + "</svg>";
  }
  function routerRear(st) {
    st = st || {}; var s = '<svg class="jgpanel" viewBox="0 0 880 180" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica,Arial,sans-serif">' + defs();
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
    var s = '<svg class="jgpanel" viewBox="0 0 440 150" xmlns="http://www.w3.org/2000/svg" font-family="Helvetica,Arial,sans-serif">' + defs();
    s += '<rect x="6" y="10" width="206" height="130" rx="12" fill="#1e293b"/><rect x="228" y="10" width="206" height="130" rx="12" fill="#1e293b"/><text x="109" y="32" font-size="11" fill="#e2e8f0" text-anchor="middle" font-weight="700">MAIN</text><text x="331" y="32" font-size="11" fill="#e2e8f0" text-anchor="middle" font-weight="700">REMOTE</text>';
    for (var k = 0; k < 8; k++) { var x1 = 30 + k * 23, x2 = 252 + k * 23; s += led("tm" + k, x1, 70, lit === k ? "green" : "off", 7) + '<text x="' + x1 + '" y="96" font-size="11" fill="#e2e8f0" text-anchor="middle">' + (k + 1) + "</text>"; s += led("tr" + k, x2, 70, lit != null && lit >= 0 && rem[lit] === k ? "green" : "off", 7) + '<text x="' + x2 + '" y="96" font-size="11" fill="#e2e8f0" text-anchor="middle">' + (k + 1) + "</text>"; }
    s += '<text x="220" y="128" font-size="10" fill="#e2e8f0" text-anchor="middle">' + (main || "") + "</text>";
    return s + "</svg>";
  }
  return { L: L, switchFront: switchFront, switchRear: switchRear, routerRear: routerRear, tester: testerSvg };
})();
