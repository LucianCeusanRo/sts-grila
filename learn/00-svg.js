/* Diagrame SVG desenate manual (conținut tehnic exact). */
window.SVG = (function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 12) + '" font-weight="' + (o.w || 400) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 6 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "none") + '" stroke-width="' + (o.sw || 1) + '"/>'; }
  function l(x1, y1, x2, y2, c, w, d) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#14213d") + '" stroke-width="' + (w || 2) + '"' + (d ? ' stroke-dasharray="' + d + '"' : "") + "/>"; }
  var arrowDef = '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#14213d"/></marker></defs>';
  function ar(x1, y1, x2, y2, c) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#14213d") + '" stroke-width="2" marker-end="url(#ah)"/>'; }

  var S = {};
  S.fiber = function () {
    var g = arrowDef;
    // secțiune transversală
    g += '<circle cx="80" cy="85" r="70" fill="#ffd8a8" stroke="#b45309"/>' + '<circle cx="80" cy="85" r="50" fill="#cfe8ff" stroke="#1d4ed8"/>' + '<circle cx="80" cy="85" r="13" fill="#fde047" stroke="#a16207"/>';
    g += t(80, 88.5, "miez", { s: 8, w: 700 }) + t(80, 55, "manta", { s: 11 }) + t(80, 26, "acoperire", { s: 11 });
    g += t(80, 170, "SM: miez 9 µm · manta 125 µm", { s: 10 }) + t(80, 184, "acoperire 250 µm", { s: 10 });
    // vedere longitudinală cu reflexie totală internă
    g += r(180, 40, 300, 90, "#ffd8a8", { rx: 4 }) + r(180, 62, 300, 46, "#cfe8ff", { rx: 0 });
    g += '<polyline points="180,95 225,63 275,107 325,63 375,107 425,63 475,107" fill="none" stroke="#dc2626" stroke-width="2.5"/>';
    g += t(330, 30, "lumina „sare” între pereți – reflexie totală internă", { s: 11, w: 600 });
    g += t(330, 150, "n(miez) > n(manta) → lumina rămâne în miez", { s: 11 });
    return W("0 0 490 192", g, "Fibra optică: miez, manta și reflexia totală internă");
  };
  S.osi = function () {
    var L = [["7", "Aplicație", "Date", "HTTP, DNS, DHCP", "#7c3aed"], ["6", "Prezentare", "Date", "criptare, format", "#8b5cf6"], ["5", "Sesiune", "Date", "dialog, sesiuni", "#a78bfa"], ["4", "Transport", "Segment", "TCP, UDP, porturi", "#2563eb"], ["3", "Rețea", "Pachet", "IP · ROUTER", "#0891b2"], ["2", "Legătură date", "Cadru", "MAC · SWITCH", "#16a34a"], ["1", "Fizic", "Biți", "cabluri · HUB", "#ca8a04"]];
    var g = "";
    L.forEach(function (x, i) { var y = 6 + i * 34; g += r(6, y, 330, 30, x[4]) + t(22, y + 20, x[0], { f: "#fff", w: 800 }) + t(42, y + 20, x[1], { a: "start", f: "#fff", w: 700 }) + t(175, y + 20, x[2], { a: "start", f: "#fff" }) + t(240, y + 20, x[3], { a: "start", f: "#fff", s: 11 }); });
    g += r(344, 6, 120, 98, "#ede9fe", { st: "#7c3aed" }) + t(404, 60, "Aplicație", { w: 700 });
    g += r(344, 108, 120, 30, "#dbeafe", { st: "#2563eb" }) + t(404, 128, "Transport", { w: 700 });
    g += r(344, 142, 120, 30, "#cffafe", { st: "#0891b2" }) + t(404, 162, "Internet", { w: 700 });
    g += r(344, 176, 120, 64, "#dcfce7", { st: "#16a34a" }) + t(404, 212, "Acces la rețea", { w: 700 });
    g += t(170, 256, "OSI (7 straturi) · nr · nume · PDU · exemple", { s: 11 }) + t(404, 256, "TCP/IP (4)", { s: 11 });
    return W("0 0 470 262", g, "Modelul OSI și corespondența cu modelul TCP/IP");
  };
  S.encap = function () {
    var g = "";
    g += r(250, 8, 90, 26, "#ede9fe", { st: "#7c3aed" }) + t(295, 26, "DATE");
    g += r(200, 44, 50, 26, "#bfdbfe", { st: "#2563eb" }) + t(225, 62, "TCP", { s: 11 }) + r(250, 44, 90, 26, "#ede9fe", { st: "#7c3aed" }) + t(295, 62, "date") + t(420, 62, "= SEGMENT", { w: 700, a: "start" });
    g += r(150, 80, 50, 26, "#a5f3fc", { st: "#0891b2" }) + t(175, 98, "IP", { s: 11 }) + r(200, 80, 140, 26, "#e2e8f0", { st: "#64748b" }) + t(270, 98, "segment") + t(420, 98, "= PACHET", { w: 700, a: "start" });
    g += r(80, 116, 70, 26, "#bbf7d0", { st: "#16a34a" }) + t(115, 134, "MAC", { s: 11 }) + r(150, 116, 190, 26, "#e2e8f0", { st: "#64748b" }) + t(245, 134, "pachet") + r(340, 116, 50, 26, "#bbf7d0", { st: "#16a34a" }) + t(365, 134, "FCS", { s: 11 }) + t(420, 134, "= CADRU", { w: 700, a: "start" });
    g += t(235, 170, "0101100111010010 … → BIȚI pe cablu / fibră / radio", { s: 12, w: 600 });
    return W("0 0 500 180", g, "Încapsularea: fiecare strat adaugă propriul antet");
  };
  S.t568 = function () {
    var A = [["#fff", "#16a34a"], ["#16a34a"], ["#fff", "#f97316"], ["#2563eb"], ["#fff", "#2563eb"], ["#f97316"], ["#fff", "#92400e"], ["#92400e"]];
    var B = [["#fff", "#f97316"], ["#f97316"], ["#fff", "#16a34a"], ["#2563eb"], ["#fff", "#2563eb"], ["#16a34a"], ["#fff", "#92400e"], ["#92400e"]];
    var na = ["alb-verde", "verde", "alb-portoc.", "albastru", "alb-albastru", "portocaliu", "alb-maro", "maro"];
    var nb = ["alb-portoc.", "portocaliu", "alb-verde", "albastru", "alb-albastru", "verde", "alb-maro", "maro"];
    function con(x, P, N, title) {
      var g = t(x + 100, 16, title, { w: 800, s: 14 });
      P.forEach(function (c, i) { var y = 26 + i * 24; g += r(x, y, 34, 18, c[0], { st: "#475569", rx: 2 }); if (c[1]) g += r(x + 13, y, 8, 18, c[1], { rx: 0 }); g += t(x + 44, y + 13, (i + 1) + ". " + N[i], { a: "start", s: 12 }); });
      return g;
    }
    var g = con(10, A, na, "T568A") + con(250, B, nb, "T568B");
    g += t(240, 228, "pinul 1 = stânga, cu clema în jos · diferă perechile verde ↔ portocaliu", { s: 11 });
    return W("0 0 480 236", g, "Ordinea firelor RJ45: T568A și T568B");
  };
  S.star = function () {
    var g = r(190, 85, 100, 36, "#1d4ed8") + t(240, 108, "SWITCH", { f: "#fff", w: 700 });
    var P = [[40, 20], [40, 160], [440, 20], [440, 160], [240, 12]];
    P.forEach(function (p, i) { g += l(240, 103, p[0], p[1] + 14, "#64748b", 2) + r(p[0] - 30, p[1], 60, 28, "#e2e8f0", { st: "#475569" }) + t(p[0], p[1] + 18, i === 4 ? "Router" : "PC" + (i + 1), { s: 11, w: 600 }); });
    g += t(240, 210, "Topologie stea: fiecare dispozitiv are cablul lui până la switch", { s: 11 });
    return W("0 0 480 218", g, "Topologia stea (Ethernet modern)");
  };
  S.vlan = function () {
    var g = r(120, 70, 240, 44, "#0b1f3a") + t(240, 97, "SWITCH", { f: "#fff", w: 700 });
    var pcs = [[40, 175, "#16a34a", "VLAN 10"], [130, 175, "#16a34a", "VLAN 10"], [350, 175, "#dc2626", "VLAN 20"], [440, 175, "#dc2626", "VLAN 20"]];
    pcs.forEach(function (p) { g += l(p[0], p[1], p[0] < 240 ? 170 : 310, 114, p[2], 3) + r(p[0] - 32, p[1], 64, 28, p[2]) + t(p[0], p[1] + 18, p[3], { f: "#fff", s: 11, w: 700 }); });
    g += l(240, 70, 240, 30, "#7c3aed", 5) + r(190, 4, 100, 28, "#7c3aed") + t(240, 23, "ROUTER", { f: "#fff", w: 700 });
    g += t(252, 48, "TRUNK 802.1Q", { s: 11, a: "start", f: "#7c3aed", w: 700 }) + t(252, 62, "(VLAN 10 + 20 etichetate)", { s: 10, a: "start", f: "#7c3aed", w: 600 });
    g += t(240, 222, "Același switch, două rețele separate. Între VLAN-uri traficul trece doar prin router.", { s: 11 });
    return W("0 0 480 230", g, "VLAN-uri: domenii de broadcast separate pe același switch");
  };
  S.subnet = function () {
    var cols = ["#dbeafe", "#dcfce7", "#fef3c7", "#fce7f3"], g = "";
    for (var i = 0; i < 4; i++) { var x = 10 + i * 115; g += r(x, 40, 115, 40, cols[i], { st: "#475569", rx: 0 }) + t(x + 57, 58, "subrețeaua " + (i + 1), { s: 11, w: 700 }) + t(x + 57, 73, "." + (i * 64) + " – ." + (i * 64 + 63), { s: 11 }) + t(x + 4, 100, "." + (i * 64), { a: "start", s: 10, f: "#1d4ed8" }) + t(x + 111, 100, "." + (i * 64 + 63), { a: "end", s: 10, f: "#dc2626" }); }
    g += t(240, 24, "192.168.1.0/24 împărțit în 4 × /26 (pas = 256 − 192 = 64)", { w: 700 });
    g += t(240, 124, "albastru = adresa de rețea · roșu = broadcast · între ele: 62 de host-uri", { s: 11 });
    return W("0 0 480 132", g, "Subnetting: blocuri egale de câte 64 de adrese");
  };
  S.ohm = function () {
    var g = '<polygon points="120,10 230,190 10,190" fill="#dbeafe" stroke="#1d4ed8" stroke-width="3"/>' + l(52, 120, 188, 120, "#1d4ed8", 3) + l(120, 120, 120, 190, "#1d4ed8", 3);
    g += t(120, 95, "U", { s: 34, w: 800, f: "#1d4ed8" }) + t(70, 170, "R", { s: 30, w: 800 }) + t(170, 170, "I", { s: 30, w: 800 });
    g += t(370, 50, "Acoperă mărimea căutată:", { w: 700 }) + t(370, 85, "U = R · I", { s: 18, w: 700 }) + t(370, 120, "I = U / R", { s: 18, w: 700 }) + t(370, 155, "R = U / I", { s: 18, w: 700 });
    return W("0 0 480 200", g, "Triunghiul legii lui Ohm");
  };
  S.water = function () {
    var g = r(20, 30, 60, 120, "#bfdbfe", { st: "#1d4ed8" }) + t(50, 22, "rezervor", { s: 11 }) + t(50, 165, "tensiune U", { s: 11, w: 700 }) + t(50, 180, "= presiunea", { s: 11 });
    g += r(80, 120, 300, 20, "#93c5fd", { rx: 0 }) + r(220, 120, 40, 20, "#1e3a8a", { rx: 0 }) + t(240, 112, "îngustare", { s: 11 }) + t(240, 160, "rezistență R", { s: 11, w: 700 }) + t(240, 175, "= țeava îngustă", { s: 11 });
    g += arrowDef + ar(300, 130, 370, 130, "#14213d") + t(400, 112, "debit", { s: 11 }) + t(400, 160, "curent I", { s: 11, w: 700 }) + t(400, 175, "= cât curge", { s: 11 });
    return W("0 0 470 190", g, "Analogia cu apa: tensiunea împinge, rezistența frânează, curentul curge");
  };
  S.db = function () {
    var rows = [["+30 dBm", "1 W"], ["+20 dBm", "100 mW"], ["+10 dBm", "10 mW"], ["+3 dBm", "2 mW"], ["0 dBm", "1 mW"], ["−3 dBm", "0,5 mW"], ["−10 dBm", "0,1 mW"], ["−20 dBm", "10 µW"], ["−30 dBm", "1 µW"]];
    var g = t(120, 18, "dBm", { w: 800 }) + t(330, 18, "putere", { w: 800 });
    rows.forEach(function (x, i) { var y = 26 + i * 22; g += r(40, y, 400, 20, i === 4 ? "#fef3c7" : (i % 2 ? "#f1f5f9" : "#e2e8f0"), { rx: 3 }) + t(120, y + 15, x[0], { w: 700 }) + t(330, y + 15, x[1]); });
    g += t(240, 232, "+3 dB = ×2 · +10 dB = ×10 · −3 dB = ÷2 · −10 dB = ÷10", { w: 700, s: 12, f: "#1d4ed8" });
    return W("0 0 480 240", g, "Scara dBm ↔ miliwați (de ținut minte)");
  };
  S.pc = function () {
    var g = arrowDef;
    g += r(180, 10, 120, 44, "#1d4ed8") + t(240, 30, "CPU", { f: "#fff", w: 800 }) + t(240, 46, "nuclee + cache", { f: "#fff", s: 10 });
    g += r(350, 10, 110, 44, "#16a34a") + t(405, 30, "RAM", { f: "#fff", w: 800 }) + t(405, 46, "memorie de lucru", { f: "#fff", s: 10 });
    g += r(10, 10, 120, 44, "#7c3aed") + t(70, 30, "GPU (PCIe x16)", { f: "#fff", w: 700, s: 11 }) + t(70, 46, "→ monitor", { f: "#fff", s: 10 });
    g += l(300, 32, 350, 32, "#14213d", 3) + l(130, 32, 180, 32, "#14213d", 3);
    g += r(165, 90, 150, 40, "#0b1f3a") + t(240, 115, "Chipset (PCH)", { f: "#fff", w: 700 }) + l(240, 54, 240, 90, "#14213d", 3);
    var B = [[20, "SSD / HDD", "SATA · NVMe"], [135, "USB", "periferice"], [250, "Placă rețea", "Ethernet / Wi-Fi"], [365, "BIOS / UEFI", "firmware"]];
    B.forEach(function (b) { g += r(b[0], 160, 100, 40, "#e2e8f0", { st: "#475569" }) + t(b[0] + 50, 178, b[1], { w: 700, s: 11 }) + t(b[0] + 50, 193, b[2], { s: 10 }) + l(240, 130, b[0] + 50, 160, "#64748b", 2); });
    g += r(380, 90, 90, 40, "#fde68a", { st: "#a16207" }) + t(425, 108, "Sursă ATX", { w: 700, s: 11 }) + t(425, 122, "+3,3/+5/+12 V", { s: 10 });
    return W("0 0 480 210", g, "Componentele principale ale unui PC");
  };
  S.otdr = function () {
    var g = arrowDef + l(30, 20, 30, 170, "#475569", 1.5) + l(30, 170, 470, 170, "#475569", 1.5) + t(16, 95, "dB", { s: 11 }) + t(440, 186, "distanță (km)", { s: 11 });
    g += '<polyline points="35,30 45,45 60,55 150,75 150,62 156,62 160,85 250,103 250,111 340,129 340,116 346,116 350,137 400,147 402,60 408,60 412,165 470,166" fill="none" stroke="#dc2626" stroke-width="2.5"/>';
    g += t(50, 22, "panta = atenuarea fibrei (dB/km)", { s: 10, a: "start" }) + t(150, 52, "conector", { s: 10, f: "#1d4ed8" }) + t(255, 96, "sudură (treaptă)", { s: 10, a: "start", f: "#16a34a" }) + t(340, 106, "conector", { s: 10, f: "#1d4ed8" }) + t(402, 52, "capăt / ruptură", { s: 10, f: "#7c3aed" });
    return W("0 0 480 196", g, "Trasa OTDR: ce înseamnă fiecare formă");
  };
  S.pon = function () {
    var g = r(10, 80, 80, 40, "#1d4ed8") + t(50, 105, "OLT", { f: "#fff", w: 800 }) + t(50, 140, "la operator", { s: 10 });
    g += l(90, 100, 220, 100, "#f59e0b", 4) + t(155, 92, "o fibră", { s: 11 });
    g += '<polygon points="220,80 260,100 220,120" fill="#0b1f3a"/>' + t(240, 140, "splitter 1:32", { s: 11, w: 700 }) + t(240, 155, "(pasiv, fără curent)", { s: 10 });
    for (var i = 0; i < 4; i++) { var y = 20 + i * 52; g += l(260, 100, 380, y + 15, "#f59e0b", 2) + r(380, y, 90, 30, "#16a34a") + t(425, y + 20, "ONT " + (i + 1), { f: "#fff", w: 700, s: 11 }); }
    g += t(240, 210, "↓ 1490 nm descărcare · ↑ 1310 nm încărcare (GPON)", { s: 11, w: 600 });
    return W("0 0 480 218", g, "Rețea GPON: un OLT, splitter pasiv, mulți abonați (ONT)");
  };
  S.channel = function () {
    var g = arrowDef + r(10, 40, 90, 60, "#0b1f3a") + t(55, 65, "Cameră", { f: "#fff", s: 11, w: 700 }) + t(55, 80, "telecom", { f: "#fff", s: 11, w: 700 });
    g += r(380, 50, 50, 40, "#e2e8f0", { st: "#475569" }) + t(405, 74, "priză", { s: 11 }) + r(440, 50, 34, 40, "#cbd5e1", { st: "#475569" }) + t(457, 74, "PC", { s: 11 });
    g += l(100, 70, 380, 70, "#2563eb", 5) + t(240, 60, "legătura permanentă ≤ 90 m (cablu rigid)", { s: 11, w: 700 });
    g += l(20, 130, 470, 130, "#16a34a", 2, "6 4") + t(240, 150, "CANAL ≤ 100 m = 90 m + max. 10 m patchcorduri", { s: 12, w: 800, f: "#16a34a" });
    return W("0 0 480 160", g, "Cablarea orizontală conform TIA-568");
  };
  S.voiceband = function () {
    var X = function (hz) { return 20 + Math.log(hz / 20) / Math.log(1000) * 440; };
    var g = arrowDef + l(20, 120, 460, 120, "#475569", 2);
    g += r(20, 70, 440, 40, "#e2e8f0", { st: "#94a3b8" }) + t(240, 64, "Urechea: 20 Hz – 20 000 Hz", { s: 11, w: 700 });
    g += r(X(300), 76, X(3400) - X(300), 28, "#16a34a") + t((X(300) + X(3400)) / 2, 95, "VOCEA LA TELEFON 300–3400 Hz", { f: "#fff", s: 10, w: 800 });
    [[20, "20"], [300, "300"], [3400, "3400"], [4000, ""], [20000, "20 000 Hz"]].forEach(function (p) { g += l(X(p[0]), 116, X(p[0]), 124, "#475569", 2) + (p[1] ? t(X(p[0]), 138, p[1], { s: 10 }) : ""); });
    g += r(X(300) - 2, 148, X(4000) - X(300) + 2, 18, "#2563eb") + t((X(300) + X(4000)) / 2, 161, "un CANAL = 4 kHz alocați", { f: "#fff", s: 10, w: 700 });
    g += t(240, 186, "Canal = „culoarul” rezervat unei convorbiri: vocea 3,1 kHz + benzi de gardă = 4 kHz.", { s: 10 });
    return W("0 0 480 196", g, "Banda canalului telefonic: 300–3400 Hz, canal de 4 kHz");
  };
  S.handshake = function () {
    var g = arrowDef + l(80, 20, 80, 200, "#475569", 2) + l(400, 20, 400, 200, "#475569", 2) + t(80, 14, "Client", { w: 800 }) + t(400, 14, "Server", { w: 800 });
    g += ar(80, 50, 398, 80) + t(240, 55, "1. SYN", { w: 700 }) + ar(400, 100, 82, 130) + t(240, 105, "2. SYN-ACK", { w: 700 }) + ar(80, 150, 398, 180) + t(240, 155, "3. ACK", { w: 700 });
    return W("0 0 480 210", g, "TCP three-way handshake");
  };
  S.fresnel = function () {
    var g = r(20, 60, 14, 130, "#64748b", { rx: 0 }) + r(446, 60, 14, 130, "#64748b", { rx: 0 }) + '<circle cx="27" cy="60" r="10" fill="#1d4ed8"/><circle cx="453" cy="60" r="10" fill="#1d4ed8"/>';
    g += l(27, 60, 453, 60, "#dc2626", 2, "6 4") + '<ellipse cx="240" cy="60" rx="213" ry="34" fill="rgba(37,99,235,.15)" stroke="#2563eb"/>';
    g += '<path d="M150,190 L200,105 L250,190 z" fill="#16a34a"/>' + t(200, 205, "obstacol: nu are voie să intre mult în elipsă", { s: 11 });
    g += t(240, 52, "linie de vedere", { s: 11, f: "#dc2626" }) + t(240, 20, "prima zonă Fresnel – liberă ≥ 60%", { s: 12, w: 700, f: "#1d4ed8" });
    return W("0 0 480 212", g, "Zona Fresnel la o legătură radio în linie de vedere");
  };
  S.yagi = function () {
    var g = arrowDef + l(40, 100, 440, 100, "#475569", 4);
    g += l(70, 40, 70, 160, "#dc2626", 5) + t(70, 175, "reflector", { s: 11 }) + t(70, 190, "(cel mai lung)", { s: 10 });
    g += l(140, 48, 140, 152, "#1d4ed8", 5) + t(140, 175, "dipol", { s: 11, w: 700 }) + t(140, 190, "(alimentat)", { s: 10 });
    [220, 290, 360].forEach(function (x, i) { g += l(x, 56 + i * 4, x, 144 - i * 4, "#16a34a", 5); });
    g += t(290, 175, "directori (tot mai scurți)", { s: 11 }) + ar(380, 30, 470, 30, "#14213d") + t(400, 22, "direcția de radiație", { s: 11, w: 700 });
    return W("0 0 480 200", g, "Antena Yagi");
  };
  S.polar = function () {
    var g = arrowDef + t(120, 18, "Polarizare verticală", { w: 700 }) + t(360, 18, "Polarizare orizontală", { w: 700 });
    g += l(120, 40, 120, 160, "#1d4ed8", 6) + ar(160, 140, 160, 50, "#1d4ed8") + t(185, 100, "E", { w: 800, f: "#1d4ed8" });
    g += l(300, 100, 420, 100, "#dc2626", 6) + ar(310, 130, 410, 130, "#dc2626") + t(360, 150, "E", { w: 800, f: "#dc2626" });
    g += t(240, 190, "Antenele de la capete trebuie să aibă ACEEAȘI polarizare", { s: 12, w: 700 });
    return W("0 0 480 200", g, "Polarizarea = orientarea câmpului electric");
  };
  S.vswr = function () {
    var rows = [["1,0 : 1", "0 %", "∞ dB", "perfect"], ["1,2 : 1", "0,8 %", "20,8 dB", "excelent"], ["1,5 : 1", "4 %", "14 dB", "bun"], ["2,0 : 1", "11 %", "9,5 dB", "la limită"], ["3,0 : 1", "25 %", "6 dB", "defect!"]];
    var g = t(80, 18, "VSWR", { w: 800 }) + t(200, 18, "putere reflectată", { w: 800 }) + t(320, 18, "return loss", { w: 800 }) + t(420, 18, "verdict", { w: 800 });
    rows.forEach(function (x, i) { var y = 28 + i * 26; g += r(20, y, 450, 22, i % 2 ? "#f1f5f9" : "#e2e8f0", { rx: 3 }) + t(80, y + 16, x[0], { w: 700 }) + t(200, y + 16, x[1]) + t(320, y + 16, x[2]) + t(420, y + 16, x[3], { f: i > 2 ? "#dc2626" : "#16a34a", w: 700 }); });
    return W("0 0 480 160", g, "VSWR, putere reflectată și return loss");
  };

  S.cables = function () {
    var g = "", cols = { 1: "#fff|#f97316", 2: "#f97316", 3: "#fff|#16a34a", 4: "#2563eb", 5: "#fff|#2563eb", 6: "#16a34a", 7: "#fff|#92400e", 8: "#92400e" };
    function pin(x, y, n) { var c = cols[n].split("|"); return r(x, y, 26, 14, c[0], { st: "#475569", rx: 2 }) + (c[1] ? r(x + 9, y, 8, 14, c[1], { rx: 0 }) : "") + t(x + 13, y - 3, "", {}); }
    function block(x0, title, map, note) {
      var h = t(x0 + 75, 14, title, { w: 800, s: 13 });
      for (var i = 1; i <= 8; i++) {
        var y = 24 + (i - 1) * 19, j = map[i - 1];
        h += t(x0 + 8, y + 11, i, { s: 10 }) + pin(x0 + 16, y, i) + l(x0 + 44, y + 7, x0 + 104, 24 + (j - 1) * 19 + 7, i === 1 || i === 2 || i === 3 || i === 6 ? "#dc2626" : "#94a3b8", i === 1 || i === 2 || i === 3 || i === 6 ? 2 : 1) + t(x0 + 140, 24 + (i - 1) * 19 + 11, i, { s: 10 });
      }
      h += t(x0 + 75, 186, note, { s: 10 });
      return h;
    }
    g += block(0, "DREPT (straight)", [1, 2, 3, 4, 5, 6, 7, 8], "1→1, 2→2 … 8→8");
    g += block(160, "CROSSOVER", [3, 6, 1, 4, 5, 2, 7, 8], "1↔3 și 2↔6");
    g += block(320, "ROLLOVER (consolă)", [8, 7, 6, 5, 4, 3, 2, 1], "1→8, 2→7 … 8→1");
    g += t(240, 206, "roșu = perechile de date la 10/100 Mbit/s (pinii 1, 2, 3, 6)", { s: 11, f: "#dc2626" });
    return W("0 0 480 214", g, "Cele trei tipuri de cabluri: cum se leagă pinii între cele două capete");
  };
  S.cableuse = function () {
    var rows = [["PC ↔ switch", "drept", "#16a34a"], ["router ↔ switch", "drept", "#16a34a"], ["switch ↔ switch", "crossover*", "#f97316"], ["PC ↔ PC", "crossover*", "#f97316"], ["PC ↔ router (Ethernet)", "crossover*", "#f97316"], ["PC (serial/USB) ↔ port CONSOLE", "rollover", "#7c3aed"]];
    var g = t(120, 16, "Legătura", { w: 800 }) + t(360, 16, "Cablu", { w: 800 });
    rows.forEach(function (x, i) { var y = 24 + i * 26; g += r(10, y, 460, 22, i % 2 ? "#f1f5f9" : "#e2e8f0", { rx: 3 }) + t(120, y + 16, x[0]) + t(360, y + 16, x[1], { w: 800, f: x[2] }); });
    g += t(240, 196, "* Cu Auto-MDIX (aproape toate echipamentele moderne) merge și cablul drept.", { s: 11 });
    return W("0 0 480 204", g, "Ce cablu folosesc? Regula: echipamente DIFERITE → drept; LA FEL → crossover");
  };
  S.topo = function () {
    var g = "";
    function nd(x, y, c) { return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + (c || "#2563eb") + '"/>'; }
    function box(x, y, title) { return r(x, y, 150, 100, "#f8fafc", { st: "#cbd5e1" }) + t(x + 75, y + 94, title, { w: 800, s: 12 }); }
    // magistrală
    g += box(5, 5, "Magistrală (bus)") + l(20, 45, 140, 45, "#475569", 4); [30, 60, 90, 120].forEach(function (x, i) { g += l(x, 45, x, i % 2 ? 70 : 20, "#475569", 2) + nd(x, i % 2 ? 72 : 18); });
    // stea
    g += box(165, 5, "Stea (star)") + nd(240, 45, "#0b1f3a"); [[200, 20], [280, 20], [200, 70], [280, 70], [240, 15]].forEach(function (p) { g += l(240, 45, p[0], p[1], "#475569", 2) + nd(p[0], p[1]); });
    // inel
    g += box(325, 5, "Inel (ring)") + '<circle cx="400" cy="45" r="28" fill="none" stroke="#475569" stroke-width="2"/>'; [0, 72, 144, 216, 288].forEach(function (a) { var rad = a * Math.PI / 180; g += nd(400 + 28 * Math.sin(rad), 45 - 28 * Math.cos(rad)); });
    // plasă
    var M = [[40, 25], [120, 25], [40, 70], [120, 70], [80, 47]];
    g += box(5, 115, "Plasă (mesh)"); M.forEach(function (a, i) { M.forEach(function (b, j) { if (j > i) g += l(a[0], a[1] + 110, b[0], b[1] + 110, "#94a3b8", 1.5); }); }); M.forEach(function (a) { g += nd(a[0], a[1] + 110); });
    // arbore
    g += box(165, 115, "Arbore (tree)") + nd(240, 128, "#0b1f3a") + l(240, 128, 205, 155, "#475569", 2) + l(240, 128, 275, 155, "#475569", 2) + nd(205, 155, "#0891b2") + nd(275, 155, "#0891b2");
    [[185, 185], [222, 185], [258, 185], [295, 185]].forEach(function (p, i) { g += l(i < 2 ? 205 : 275, 155, p[0], p[1], "#475569", 1.5) + nd(p[0], p[1]); });
    // hibrid
    g += box(325, 115, "Hibridă") + '<circle cx="370" cy="155" r="20" fill="none" stroke="#475569" stroke-width="2"/>' + nd(350, 155, "#0b1f3a") + nd(390, 155, "#0b1f3a") + nd(370, 135) + nd(370, 175) + l(390, 155, 430, 155, "#475569", 2) + nd(430, 155, "#0b1f3a") + l(430, 155, 455, 130, "#475569", 1.5) + l(430, 155, 455, 180, "#475569", 1.5) + nd(455, 130) + nd(455, 180);
    return W("0 0 480 222", g, "Topologii de rețea (albastru închis = switch/nod central)");
  };
  S.nettypes = function () {
    var L = [["PAN", "personală", "~10 m · Bluetooth, USB", "#a78bfa"], ["LAN / WLAN", "locală (cu fir / fără fir)", "o clădire · Ethernet, Wi-Fi", "#60a5fa"], ["CAN", "campus", "mai multe clădiri apropiate", "#22d3ee"], ["MAN", "metropolitană", "un oraș · fibră", "#34d399"], ["WAN", "extinsă", "țări/continente · Internet", "#fbbf24"]];
    var g = "";
    L.forEach(function (x, i) { var w = 300 + i * 45; g += r(240 - w / 2, 10 + i * 34, w, 30, x[3], { rx: 8 }) + t(240, 30 + i * 34, x[0] + " – " + x[1] + " · " + x[2], { s: 10, w: 700 }); });
    g += t(240, 194, "Speciale: SAN = rețea de stocare · VPN = tunel privat prin Internet", { s: 10 }) + t(240, 208, "VAN = rețea cu servicii adăugate de un furnizor", { s: 10 });
    return W("0 0 480 216", g, "Tipuri de rețele, de la mică la mare");
  };
  S.media = function () {
    var g = "";
    g += t(80, 14, "Coaxial", { w: 800 }) + '<circle cx="80" cy="80" r="52" fill="#1f2937"/><circle cx="80" cy="80" r="44" fill="#d4a017"/><circle cx="80" cy="80" r="38" fill="#e5e7eb"/><circle cx="80" cy="80" r="8" fill="#b45309"/>';
    g += t(80, 150, "conductor central · dielectric", { s: 10 }) + t(80, 163, "tresă/ecran · manta", { s: 10 });
    g += t(240, 14, "Torsadat (UTP)", { w: 800 }) + '<circle cx="240" cy="80" r="52" fill="#93c5fd"/>';
    [[220, 60, "#f97316"], [260, 60, "#16a34a"], [220, 100, "#2563eb"], [260, 100, "#92400e"]].forEach(function (p) { g += '<circle cx="' + (p[0] - 7) + '" cy="' + p[1] + '" r="8" fill="' + p[2] + '"/><circle cx="' + (p[0] + 7) + '" cy="' + p[1] + '" r="8" fill="#fff" stroke="' + p[2] + '" stroke-width="3"/>'; });
    g += t(240, 150, "4 perechi răsucite, fără ecran", { s: 10 }) + t(240, 163, "STP/FTP: + folie/tresă", { s: 10 });
    g += t(400, 14, "Fibră optică", { w: 800 }) + '<circle cx="400" cy="80" r="52" fill="#fde68a"/><circle cx="400" cy="80" r="34" fill="#cfe8ff"/><circle cx="400" cy="80" r="6" fill="#fde047" stroke="#a16207"/>';
    g += t(400, 150, "miez · manta · acoperire", { s: 10 }) + t(400, 163, "lumină, nu curent", { s: 10 });
    return W("0 0 480 172", g, "Cele trei medii pe cablu: coaxial, perechi torsadate, fibră optică");
  };
  S.acdc = function () {
    var g = arrowDef;
    g += t(115, 14, "Curent continuu (DC)", { w: 800 }) + l(20, 100, 220, 100, "#475569", 1) + l(20, 30, 20, 160, "#475569", 1) + l(20, 60, 220, 60, "#dc2626", 3) + t(120, 52, "+12 V constant", { s: 11, f: "#dc2626" }) + t(120, 120, "baterie, acumulator, sursă PC", { s: 11 });
    var pts = []; for (var x = 0; x <= 200; x += 4) pts.push((260 + x) + "," + (100 - 55 * Math.sin(x / 100 * 2 * Math.PI)).toFixed(1));
    g += t(365, 14, "Curent alternativ (AC)", { w: 800 }) + l(260, 100, 465, 100, "#475569", 1) + l(260, 30, 260, 165, "#475569", 1) + '<polyline points="' + pts.join(" ") + '" fill="none" stroke="#1d4ed8" stroke-width="3"/>';
    g += l(260, 45, 465, 45, "#16a34a", 1, "4 3") + t(470, 42, "+325 V vârf", { s: 10, a: "end", f: "#16a34a" }) + l(260, 61, 465, 61, "#7c3aed", 1, "4 3") + t(470, 72, "230 V efectiv", { s: 10, a: "end", f: "#7c3aed" });
    g += l(260, 172, 360, 172, "#14213d", 1) + t(310, 186, "perioada T = 20 ms (f = 50 Hz)", { s: 10 });
    return W("0 0 480 196", g, "DC are valoare constantă; AC își schimbă sensul de 50 de ori pe secundă");
  };
  S.power = function () {
    var g = arrowDef, B = [["Rețea 230 V AC", "#fde68a"], ["Transformator", "#e2e8f0"], ["Redresor (diode)", "#e2e8f0"], ["Filtru (condensator)", "#e2e8f0"], ["DC pentru echipament", "#bbf7d0"]];
    B.forEach(function (b, i) { var x = 4 + i * 95; g += r(x, 30, 88, 46, b[1], { st: "#475569" }) + t(x + 44, 50, b[0].split(" ")[0], { s: 11, w: 700 }) + t(x + 44, 66, b[0].split(" ").slice(1).join(" "), { s: 10 }); if (i < 4) g += ar(x + 88, 53, x + 95, 53); });
    g += t(240, 104, "Transformatorul schimbă tensiunea AC (de ex. 230 V → 12 V); redresorul face din AC → DC.", { s: 11 });
    g += t(240, 124, "Invertorul face invers: DC → AC (ex. în UPS, din acumulator în 230 V).", { s: 11 });
    g += r(60, 140, 360, 40, "#eaf2ff", { st: "#2563eb" }) + t(240, 158, "UPS = acumulator + redresor/încărcător + invertor:", { s: 11, w: 700 }) + t(240, 173, "ține echipamentele pornite când pică rețeaua", { s: 11 });
    return W("0 0 480 188", g, "Lanțul de alimentare: de la priză la placa de bază");
  };
  S.phase = function () {
    var g = "", col = ["#92400e", "#111827", "#6b7280"];
    for (var k = 0; k < 3; k++) { var pts = []; for (var x = 0; x <= 300; x += 4) pts.push((60 + x) + "," + (90 - 55 * Math.sin((x / 150) * 2 * Math.PI - k * 2 * Math.PI / 3)).toFixed(1)); g += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + col[k] + '" stroke-width="2.5"/>'; }
    g += l(60, 90, 365, 90, "#475569", 1) + t(420, 40, "L1 (maro)", { s: 11, f: col[0], w: 700 }) + t(420, 60, "L2 (negru)", { s: 11, f: col[1], w: 700 }) + t(420, 80, "L3 (gri)", { s: 11, f: col[2], w: 700 }) + t(420, 104, "N = albastru", { s: 11, f: "#2563eb", w: 700 }) + t(420, 124, "PE = galben-verde", { s: 11, f: "#15803d", w: 700 });
    g += t(220, 165, "Monofazat: o fază + nul = 230 V · Trifazat: între două faze = 400 V", { s: 11, w: 700 });
    return W("0 0 480 176", g, "Sistemul trifazat: trei sinusoide decalate cu 120°");
  };

  /* ---- electricitate de la zero ---- */
  function bulb(x, y, on) { return '<circle cx="' + x + '" cy="' + y + '" r="16" fill="' + (on ? "#fde047" : "#e5e7eb") + '" stroke="#a16207" stroke-width="2"/>' + l(x - 8, y - 8, x + 8, y + 8, "#a16207", 1.5) + l(x - 8, y + 8, x + 8, y - 8, "#a16207", 1.5) + (on ? l(x, y - 22, x, y - 30, "#f59e0b") + l(x + 20, y - 14, x + 27, y - 20, "#f59e0b") + l(x - 20, y - 14, x - 27, y - 20, "#f59e0b") : ""); }
  function batt(x, y) { return l(x - 14, y - 6, x + 14, y - 6, "#14213d", 3) + l(x - 8, y + 6, x + 8, y + 6, "#14213d", 5) + t(x + 24, y - 2, "+", { s: 14, w: 800, f: "#dc2626" }) + t(x + 24, y + 14, "−", { s: 14, w: 800 }); }
  S.electrons = function () {
    var g = arrowDef + r(20, 40, 440, 50, "#fcd9b6", { st: "#b45309", rx: 25 }) + t(240, 30, "un fir de cupru (conductor) văzut „la microscop”", { s: 11, w: 700 });
    for (var i = 0; i < 12; i++) { var x = 45 + i * 35, y = i % 2 ? 58 : 74; g += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="#2563eb"/>' + t(x, y + 4, "−", { s: 10, w: 800, f: "#fff" }); }
    g += ar(120, 112, 360, 112, "#2563eb") + t(240, 130, "electronii liberi se împing unii pe alții prin fir = curent electric", { s: 11, w: 600, f: "#1d4ed8" });
    g += r(20, 150, 210, 56, "#dcfce7", { st: "#16a34a" }) + t(125, 172, "CONDUCTOR (lasă curentul)", { s: 11, w: 700, f: "#166534" }) + t(125, 192, "cupru, aluminiu, apă cu săruri, corpul", { s: 10 });
    g += r(250, 150, 210, 56, "#fee2e2", { st: "#dc2626" }) + t(355, 172, "IZOLATOR (oprește curentul)", { s: 11, w: 700, f: "#991b1b" }) + t(355, 192, "cauciuc, PVC, sticlă, lemn uscat", { s: 10 });
    return W("0 0 480 214", g, "Curentul electric = electroni care se deplasează împreună printr-un conductor");
  };
  S.circuit = function () {
    function one(ox, closed) {
      var g = batt(ox + 30, 100) + l(ox + 30, 94, ox + 30, 40) + l(ox + 30, 40, ox + 100, 40);
      g += closed ? l(ox + 100, 40, ox + 150, 40, "#14213d", 3) : l(ox + 100, 40, ox + 145, 16, "#14213d", 3);
      g += '<circle cx="' + (ox + 100) + '" cy="40" r="3" fill="#14213d"/><circle cx="' + (ox + 150) + '" cy="40" r="3" fill="#14213d"/>';
      g += l(ox + 150, 40, ox + 190, 40) + l(ox + 190, 40, ox + 190, 84) + bulb(ox + 190, 100, closed) + l(ox + 190, 116, ox + 190, 160) + l(ox + 190, 160, ox + 30, 160) + l(ox + 30, 160, ox + 30, 106);
      g += t(ox + 125, closed ? 30 : 12, "întrerupător", { s: 10 }) + t(ox + 75, 120, "sursă", { s: 10 }) + t(ox + 228, 104, "bec", { s: 10, a: "start" });
      g += t(ox + 115, 185, closed ? "ÎNCHIS → becul arde" : "DESCHIS → nu trece curent", { s: 11, w: 700, f: closed ? "#166534" : "#991b1b" });
      return g;
    }
    return W("0 0 500 196", one(0, true) + one(250, false), "Circuitul: sursă → fir → consumator → înapoi la sursă; drumul trebuie să fie închis");
  };
  S.serpar = function () {
    var g = t(120, 18, "SERIE (unul după altul)", { w: 800 }) + t(370, 18, "PARALEL (unul lângă altul)", { w: 800 });
    g += batt(30, 100) + l(30, 94, 30, 50) + l(30, 50, 74, 50) + bulb(90, 50, true) + l(106, 50, 144, 50) + bulb(160, 50, true) + l(176, 50, 210, 50) + l(210, 50, 210, 150) + l(210, 150, 30, 150) + l(30, 150, 30, 106);
    g += t(120, 182, "același curent prin toate;", { s: 10 }) + t(120, 196, "R total = R1 + R2 (crește)", { s: 10, w: 700 }) + t(120, 210, "un bec ars → se sting toate", { s: 10 });
    g += batt(280, 100) + l(280, 94, 280, 50) + l(280, 50, 440, 50) + l(280, 150, 440, 150) + l(280, 150, 280, 106);
    g += l(360, 50, 360, 84) + bulb(360, 100, true) + l(360, 116, 360, 150) + l(440, 50, 440, 84) + bulb(440, 100, true) + l(440, 116, 440, 150);
    g += t(370, 182, "aceeași tensiune pe fiecare;", { s: 10 }) + t(370, 196, "R total < cea mai mică rezistență", { s: 10, w: 700 }) + t(370, 210, "un bec ars → celelalte merg (ca în casă)", { s: 10 });
    return W("0 0 490 218", g, "Legarea în serie și în paralel");
  };
  S.socket = function () {
    var g = '<circle cx="110" cy="100" r="80" fill="#f8fafc" stroke="#475569" stroke-width="3"/><circle cx="110" cy="100" r="58" fill="#e2e8f0" stroke="#94a3b8"/>';
    g += '<circle cx="80" cy="100" r="9" fill="#14213d"/><circle cx="140" cy="100" r="9" fill="#14213d"/>' + r(98, 30, 24, 10, "#a3a3a3", { rx: 2 }) + r(98, 160, 24, 10, "#a3a3a3", { rx: 2 });
    g += t(80, 128, "L / N", { s: 10, w: 700 }) + t(140, 128, "N / L", { s: 10, w: 700 }) + t(110, 24, "PE", { s: 10, w: 700, f: "#15803d" });
    g += t(345, 30, "Priza Schuko (tip F) din România", { w: 800 });
    g += r(205, 44, 14, 14, "#92400e", { rx: 2 }) + t(225, 56, "FAZA (L) – firul „viu”: ELECTROCUTEAZĂ", { a: "start", s: 10, w: 700, f: "#991b1b" });
    g += r(205, 70, 14, 14, "#2563eb", { rx: 2 }) + t(225, 82, "NULUL (N) – drumul de întoarcere, albastru", { a: "start", s: 10 });
    g += r(205, 96, 7, 14, "#eab308", { rx: 0 }) + r(212, 96, 7, 14, "#16a34a", { rx: 0 }) + t(225, 108, "ÎMPĂMÂNTAREA (PE) – siguranța, galben-verde", { a: "start", s: 10 });
    g += t(205, 136, "Fază–nul ≈ 230 V  ·  Fază–PE ≈ 230 V", { a: "start", s: 11, w: 700 }) + t(205, 154, "Nul–PE ≈ 0 V (câțiva volți)", { a: "start", s: 11, w: 700 });
    g += t(205, 178, "Ștecherul se poate întoarce → faza poate fi", { a: "start", s: 10, f: "#991b1b" }) + t(205, 192, "în oricare gaură. Verifică, nu ghici!", { a: "start", s: 10, f: "#991b1b", w: 700 });
    return W("0 0 480 200", g, "Ce găsești într-o priză: fază, nul și împământare");
  };
  S.meter = function () {
    var g = r(20, 10, 170, 250, "#facc15", { st: "#a16207", rx: 18 }) + r(40, 24, 130, 46, "#d9f99d", { st: "#365314" }) + t(105, 55, "229.8 V~", { s: 18, w: 800 });
    g += '<circle cx="105" cy="135" r="45" fill="#1f2937"/><line x1="105" y1="135" x2="78" y2="104" stroke="#fde047" stroke-width="5" stroke-linecap="round"/>';
    g += t(64, 92, "V~", { s: 11, w: 800 }) + t(146, 92, "V⎓", { s: 11, w: 800 }) + t(56, 190, "A", { s: 11, w: 800 }) + t(154, 190, "Ω", { s: 11, w: 800 }) + t(105, 84, "OFF", { s: 9 });
    var jx = [50, 105, 160], jl = ["A", "COM", "VΩ"], jc = ["#dc2626", "#111827", "#dc2626"];
    for (var i = 0; i < 3; i++) g += '<circle cx="' + jx[i] + '" cy="225" r="12" fill="#111827" stroke="' + jc[i] + '" stroke-width="3"/>' + t(jx[i], 252, jl[i], { s: 10, w: 800 });
    g += t(340, 30, "Cei 4 pași", { w: 800, s: 14 });
    var st = ["1. FUNCȚIA: ce măsori (V~, V⎓, A, Ω)", "2. DOMENIUL: mai mare decât ce aștepți", "    (ex. 600 V~ la priză) sau AUTO", "3. BORNELE: negru → COM;", "    roșu → VΩ (tensiune, rezistență)", "    roșu → A doar pentru curent", "4. LEGAREA: voltmetru în PARALEL,", "    ampermetru în SERIE,", "    ohmmetru doar FĂRĂ tensiune"];
    st.forEach(function (x, k) { g += t(208, 60 + k * 21, x, { a: "start", s: 11, w: x.charAt(0) === " " ? 400 : 700 }); });
    return W("0 0 490 262", g, "Multimetrul: comutatorul de funcții și cele trei borne");
  };

  /* ---- radio de la zero ---- */
  S.wave = function () {
    var d = "M20,80", i;
    for (i = 0; i <= 360; i += 4) d += " L" + (20 + i * 1.2) + "," + (80 - 45 * Math.sin(i * Math.PI / 90)).toFixed(1);
    var g = arrowDef + '<path d="' + d + '" fill="none" stroke="#2563eb" stroke-width="3"/>' + l(20, 80, 460, 80, "#94a3b8", 1, "4 4");
    g += ar(74, 22, 290, 22) + ar(290, 22, 74, 22) + t(182, 15, "o lungime de undă λ (de la o creastă la următoarea)", { s: 11, w: 700 }) + l(74, 26, 74, 36, "#94a3b8", 1, "2 2") + l(290, 26, 290, 36, "#94a3b8", 1, "2 2");
    g += t(240, 150, "λ = c / f   (c = 300 000 km/s = 3·10⁸ m/s)", { s: 13, w: 800 });
    g += t(240, 172, "Scurtătura: λ [m] = 300 / f [MHz]", { s: 12, w: 700, f: "#1d4ed8" });
    g += t(240, 194, "100 MHz → 3 m   ·   300 MHz → 1 m   ·   2,4 GHz → 12,5 cm", { s: 11 });
    return W("0 0 480 204", g, "Unda radio: frecvența = câte valuri pe secundă; lungimea de undă = distanța dintre două creste");
  };
  S.bands = function () {
    var b = [["HF", "3–30 MHz", "unde scurte: ionosferă, sute–mii km", "#fde68a", "λ 100–10 m"], ["VHF", "30–300 MHz", "radio FM, stații portabile, aviație", "#bbf7d0", "λ 10–1 m"], ["UHF", "0,3–3 GHz", "TETRA, GSM, Wi-Fi 2,4, GPS", "#bfdbfe", "λ 1 m–10 cm"], ["SHF", "3–30 GHz", "radioreleu, satelit, Wi-Fi 5 GHz", "#ddd6fe", "λ 10–1 cm"], ["EHF", "30–300 GHz", "radioreleu E-band (70/80 GHz)", "#fbcfe8", "λ 1 cm–1 mm"]];
    var g = "";
    b.forEach(function (x, i) { var y = 10 + i * 38; g += r(10, y, 70, 32, x[3], { st: "#475569" }) + t(45, y + 21, x[0], { w: 800, s: 13 }) + t(90, y + 14, x[1] + "  (" + x[4] + ")", { a: "start", s: 11, w: 700 }) + t(90, y + 28, x[2], { a: "start", s: 10.5 }); });
    g += t(240, 206, "↓ frecvență mai mare = undă mai scurtă = antenă mai mică, dar acoperire mai „în linie dreaptă”", { s: 10, f: "#475569" });
    return W("0 0 480 214", g, "Benzile de frecvență și la ce se folosesc");
  };
  S.trx = function () {
    var g = arrowDef;
    function box(x, y, w, txt, sub, f) { return r(x, y, w, 40, f, { st: "#475569" }) + t(x + w / 2, y + 18, txt, { s: 11, w: 800 }) + t(x + w / 2, y + 32, sub, { s: 9 }); }
    g += box(5, 30, 70, "microfon", "voce → semnal", "#f1f5f9") + ar(75, 50, 95, 50) + box(95, 30, 80, "EMIȚĂTOR TX", "modulează", "#fecaca") + ar(175, 50, 195, 50) + l(195, 50, 215, 50) + l(215, 50, 215, 20, "#14213d", 3) + l(205, 20, 225, 20, "#14213d", 3);
    g += '<path d="M232,30 q12,20 0,40 M244,22 q18,28 0,56" fill="none" stroke="#2563eb" stroke-width="2"/>' + t(240, 100, "unda radio", { s: 10, f: "#1d4ed8" });
    g += '<path d="M256,30 q-12,20 0,40" fill="none" stroke="#2563eb" stroke-width="2"/>' + l(265, 20, 285, 20, "#14213d", 3) + l(275, 20, 275, 50, "#14213d", 3) + ar(275, 50, 300, 50);
    g += box(300, 30, 85, "RECEPTOR RX", "demodulează", "#bbf7d0") + ar(385, 50, 405, 50) + box(405, 30, 70, "difuzor", "semnal → voce", "#f1f5f9");
    g += r(40, 120, 400, 78, "#eff6ff", { st: "#1d4ed8" }) + t(240, 140, "TRANSCEIVER (TRX) = TX + RX în aceeași cutie (stația radio)", { s: 11, w: 800 });
    g += t(240, 158, "Simplex: pe rând, apeși PTT ca să vorbești", { s: 10 }) + t(240, 172, "Duplex: ambii deodată (ca telefonul)", { s: 10 });
    g += t(240, 188, "Antena și cablul sunt aceleași pentru TX și RX", { s: 10 });
    return W("0 0 480 204", g, "Lanțul radio: emițător → antenă → aer → antenă → receptor");
  };
  S.anttypes = function () {
    var g = "";
    function cap(x, a, b) { return t(x, 128, a, { s: 11, w: 800 }) + t(x, 143, b, { s: 9.5 }); }
    // dipol
    g += l(20, 60, 55, 60, "#14213d", 4) + l(65, 60, 100, 60, "#14213d", 4) + l(60, 60, 60, 105, "#94a3b8", 2) + t(60, 50, "λ/2", { s: 10 }) + cap(60, "Dipol", "λ/2");
    // monopol
    g += l(150, 20, 150, 90, "#14213d", 4) + l(120, 92, 180, 92, "#64748b", 3) + l(125, 92, 115, 105, "#64748b", 2) + l(175, 92, 185, 105, "#64748b", 2) + t(165, 50, "λ/4", { s: 10, a: "start" }) + cap(150, "Monopol", "λ/4 + plan de masă");
    // yagi
    g += l(205, 60, 290, 60, "#14213d", 3) + l(210, 35, 210, 85, "#dc2626", 3) + l(230, 40, 230, 80, "#14213d", 3) + l(250, 44, 250, 76, "#2563eb", 3) + l(268, 46, 268, 74, "#2563eb", 3) + l(285, 48, 285, 72, "#2563eb", 3) + cap(248, "Yagi", "directivă");
    // panou
    g += r(320, 20, 34, 80, "#e2e8f0", { st: "#475569" }) + t(337, 64, "panou", { s: 9 }) + cap(337, "Panou", "sector 60–120°");
    // parabolic
    g += '<path d="M410,20 Q450,60 410,100" fill="#e0f2fe" stroke="#0369a1" stroke-width="3"/>' + l(420, 60, 455, 60, "#14213d", 2) + '<circle cx="456" cy="60" r="4" fill="#14213d"/>' + cap(435, "Parabolică", "fascicul îngust");
    g += r(10, 156, 220, 44, "#dcfce7", { st: "#16a34a" }) + t(120, 174, "OMNIDIRECȚIONALĂ: 360° pe orizontală", { s: 10.5, w: 700 }) + t(120, 190, "dipol vertical, monopol (stații, TETRA)", { s: 10 });
    g += r(250, 156, 220, 44, "#fef3c7", { st: "#d97706" }) + t(360, 174, "DIRECȚIONALĂ: o singură direcție", { s: 10.5, w: 700 }) + t(360, 190, "Yagi, panou, parabolă (legături fixe)", { s: 10 });
    return W("0 0 480 206", g, "Tipuri de antene: omnidirecționale și direcționale");
  };
  S.rfconn = function () {
    var c = [["N", "filet, 50 Ω, până la ~11 GHz", "exterior, piloni, cabluri groase", "#94a3b8", 30], ["SMA", "filet mic, până la ~18 GHz", "plăci, Wi-Fi, module radio", "#fcd34d", 18], ["BNC", "baionetă (răsucești ¼ tură)", "aparate de măsură, video, radio", "#cbd5e1", 24], ["PL-259 / SO-239", "„UHF connector”, filet mare", "stații HF/VHF, CB, radioamatori", "#e5e7eb", 34], ["TNC", "BNC cu filet (rezistă la vibrații)", "GPS, vehicule", "#cbd5e1", 22], ["7/16 DIN, 4.3-10", "mari, PIM redus", "stații de bază celulare", "#9ca3af", 36]];
    var g = "";
    c.forEach(function (x, i) { var col = i % 2, row = Math.floor(i / 2), X = 10 + col * 240, Y = 8 + row * 66; g += '<circle cx="' + (X + 28) + '" cy="' + (Y + 28) + '" r="' + x[4] / 1.4 + '" fill="' + x[3] + '" stroke="#334155" stroke-width="2"/><circle cx="' + (X + 28) + '" cy="' + (Y + 28) + '" r="3" fill="#b45309"/>' + t(X + 62, Y + 16, x[0], { a: "start", s: 12, w: 800 }) + t(X + 62, Y + 32, x[1], { a: "start", s: 10 }) + t(X + 62, Y + 46, x[2], { a: "start", s: 10, f: "#475569" }); });
    g += t(240, 212, "Cablu coaxial radio: 50 Ω (TV/satelit: 75 Ω, conector F)", { s: 11, w: 700 });
    return W("0 0 480 220", g, "Conectori RF des întâlniți");
  };
  S.budget = function () {
    var g = arrowDef, x = [20, 95, 170, 245, 320, 395], v = [["Ptx", "+30 dBm", "#fecaca"], ["−cablu", "−2 dB", "#fee2e2"], ["+Gtx", "+15 dBi", "#bbf7d0"], ["−spațiu liber", "−124 dB", "#e5e7eb"], ["+Grx", "+15 dBi", "#bbf7d0"], ["−cablu", "−2 dB", "#fee2e2"]];
    v.forEach(function (a, i) { g += r(x[i], 20, 70, 44, a[2], { st: "#475569" }) + t(x[i] + 35, 38, a[0], { s: 10.5, w: 700 }) + t(x[i] + 35, 56, a[1], { s: 11, w: 800 }); });
    g += t(240, 92, "Prx = 30 − 2 + 15 − 124 + 15 − 2 = −68 dBm", { s: 13, w: 800, f: "#1d4ed8" });
    g += t(240, 116, "Receptorul are sensibilitate −90 dBm → marja = −68 − (−90) = 22 dB ✓", { s: 11, w: 700 });
    g += t(240, 140, "Pierderea în spațiul liber: FSPL = 32,44 + 20·log d[km] + 20·log f[MHz]", { s: 10.5 });
    g += t(240, 158, "(ex. 10 km la 4 GHz ≈ 124 dB). Dublarea distanței → +6 dB pierdere.", { s: 10.5 });
    g += t(240, 182, "Regula: semnalul primit trebuie să fie peste sensibilitate + o marjă (fading).", { s: 10.5, f: "#475569" });
    return W("0 0 480 192", g, "Bugetul legăturii: aduni câștigurile, scazi pierderile (totul în dB)");
  };
  S.nat = function () {
    var g = arrowDef + r(10, 20, 200, 170, "#eff6ff", { st: "#1d4ed8" }) + t(110, 38, "REȚEAUA DE ACASĂ / BIROU", { s: 10.5, w: 800 }) + t(110, 52, "IP-uri PRIVATE (192.168.x.x)", { s: 10 });
    var pcs = [["PC1", "192.168.1.10"], ["Telefon", "192.168.1.11"], ["Laptop", "192.168.1.12"]];
    pcs.forEach(function (p, i) { var y = 66 + i * 40; g += r(20, y, 110, 30, "#fff", { st: "#64748b" }) + t(75, y + 13, p[0], { s: 10, w: 700 }) + t(75, y + 25, p[1], { s: 9.5 }) + l(130, y + 15, 190, 110, "#64748b", 1.5); });
    g += r(190, 88, 90, 46, "#fde68a", { st: "#a16207" }) + t(235, 106, "ROUTER", { s: 11, w: 800 }) + t(235, 122, "face NAT/PAT", { s: 9.5 });
    g += ar(280, 111, 340, 111) + t(310, 102, "203.0.113.5", { s: 9.5, w: 700 });
    g += '<ellipse cx="405" cy="111" rx="65" ry="40" fill="#f1f5f9" stroke="#475569"/>' + t(405, 108, "INTERNET", { s: 11, w: 800 }) + t(405, 124, "IP-uri PUBLICE", { s: 9.5 });
    g += r(10, 200, 460, 70, "#fff7ed", { st: "#d97706" }) + t(240, 218, "Tabela PAT (NAT overload) din router:", { s: 10.5, w: 800 });
    g += t(240, 236, "192.168.1.10:51000 ↔ 203.0.113.5:40001", { s: 10 }) + t(240, 250, "192.168.1.11:51000 ↔ 203.0.113.5:40002", { s: 10 }) + t(240, 264, "→ toți ies pe UN singur IP public, deosebiți prin PORT", { s: 10, w: 700 });
    return W("0 0 480 276", g, "NAT: mai multe dispozitive cu IP privat ies pe Internet printr-un singur IP public");
  };

  /* ---- munca la STS ---- */
  S.rack = function () {
    var g = r(20, 10, 200, 290, "#1f2937", { rx: 4 }) + r(30, 18, 180, 274, "#111827", { rx: 2 });
    var items = [["patch panel 24 porturi", "#e5e7eb", 1], ["organizator cabluri", "#6b7280", 1], ["SWITCH 24/48 porturi", "#2563eb", 1], ["patch panel fibră (ODF)", "#fde68a", 1], ["organizator cabluri", "#6b7280", 1], ["SWITCH", "#2563eb", 1], ["ROUTER / firewall", "#16a34a", 1], ["", "#111827", 2], ["SERVER", "#475569", 2], ["", "#111827", 1], ["UPS (acumulatori)", "#b91c1c", 3]];
    var y = 22;
    items.forEach(function (it) { var h = it[2] * 17.5; if (it[0]) { g += r(34, y, 172, h - 2, it[1], { rx: 2 }) + t(120, y + h / 2 + 3, it[0], { s: 9.5, w: 700, f: it[1] === "#e5e7eb" || it[1] === "#fde68a" ? "#111827" : "#fff" }); } y += h; });
    g += l(20, 300, 20, 312, "#14213d") + l(220, 300, 220, 312, "#14213d") + t(120, 324, "lățime de montaj 19\" (482,6 mm)", { s: 10, w: 700 });
    g += t(335, 30, "Rack-ul de 19\"", { s: 14, w: 800 });
    var tx = ["1U = 1,75\" = 44,45 mm înălțime", "Rack-uri uzuale: 42U, 24U, 12U (de perete)", "Sus: patch panel + organizator + switch", "Jos: echipamente grele (UPS, servere)", "Cablurile: etichetate la ambele capete", "Rack-ul se leagă la bara de împământare", "Aer rece prin față, aer cald prin spate", "PDU = prelungitorul de rack"];
    tx.forEach(function (x, i) { g += t(240, 60 + i * 24, "• " + x, { a: "start", s: 10.5 }); });
    return W("0 0 490 332", g, "Un rack de comunicații tipic (vedere din față)");
  };
  S.e112 = function () {
    var g = arrowDef;
    function box(x, y, w, a, b, f) { return r(x, y, w, 46, f, { st: "#475569" }) + t(x + w / 2, y + 20, a, { s: 10.5, w: 800 }) + t(x + w / 2, y + 36, b, { s: 9 }); }
    g += box(5, 20, 100, "Cetățean", "sună / SMS la 112", "#f1f5f9") + ar(105, 43, 140, 43);
    g += box(140, 20, 120, "Centrul 112", "preia apelul, localizează", "#fde68a") + ar(260, 43, 300, 43);
    g += box(290, 8, 186, "Dispecerat integrat", "ISU-SMURD-Ambulanță", "#fecaca") + box(290, 58, 186, "Dispecerat", "Poliție / Jandarmerie", "#bfdbfe");
    g += ar(390, 104, 390, 140) + box(270, 140, 205, "Echipaje în teren", "radio TETRA + tablete (date mobile)", "#bbf7d0");
    g += r(5, 110, 250, 76, "#eff6ff", { st: "#1d4ed8" }) + t(130, 128, "STS administrează sistemul 112 (SNUAU)", { s: 10, w: 800 }) + t(130, 146, "și platforma radio TETRA folosită de", { s: 10 }) + t(130, 162, "Poliție, ISU/SMURD, Ambulanță, Jandarmerie", { s: 10 }) + t(130, 178, "(rețele de date WAN, radio, centre de date)", { s: 9, f: "#475569" });
    return W("0 0 480 196", g, "Drumul unei urgențe: de la apelul 112 la echipajul din teren (informații publice)");
  };
  S.tir = S.fiber;
  return S;
})();
