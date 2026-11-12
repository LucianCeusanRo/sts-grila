/* Lecții generate din learn/*.js */
/* ===== Animații pas cu pas (SVG + SMIL, ușoare; playerul e în app.js) ===== */
var ANIMS = {};
function AN(k) { return '<div class="anim" data-anim="' + k + '"></div>'; }
(function () {
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 11) + '" font-weight="' + (o.w || 700) + '"' + (o.x || "") + ">" + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 5 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "#334155") + '" stroke-width="' + (o.sw || 1.2) + '"' + (o.x || "") + "/>"; }
  function ln(x1, y1, x2, y2, c, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (w || 2) + '"' + (o || "") + "/>"; }
  function A(attr, from, to, dur, begin, extra) { return '<animate attributeName="' + attr + '" from="' + from + '" to="' + to + '" dur="' + dur + 's" begin="' + (begin || 0) + 's" fill="freeze"' + (extra || "") + "/>"; }
  function show(begin, dur) { return '<set attributeName="opacity" to="1" begin="' + begin + 's" fill="freeze"/>' ; }
  function mv(path, dur, begin, rep) { return '<animateMotion path="' + path + '" dur="' + dur + 's" begin="' + (begin || 0) + 's" fill="freeze"' + (rep ? ' repeatCount="indefinite"' : "") + "/>"; }
  function env(lbl, c) { return '<g>' + r(-16, -10, 32, 20, c || "#fde68a", { rx: 3 }) + '<path d="M-16 -10 L0 2 L16 -10" fill="none" stroke="#334155"/>' + (lbl ? t(0, 24, lbl, { s: 8.5 }) : "") ; }
  function draw(d, c, w, dur, begin, extra) { return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + (w || 2.5) + '" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"' + (extra || "") + '>' + A("stroke-dashoffset", 1, 0, dur, begin) + "</path>"; }
  function node(x, y, lbl, sub, c) { var ss = sub ? String(sub).split(" · ") : [], h = 36 + (ss.length > 1 ? 10 * (ss.length - 1) : 0); return r(x - 36, y - 18, 72, h, c || "#e2e8f0") + t(x, y - 3, lbl, { s: 10.5 }) + ss.map(function (z, k) { return t(x, y + 10 + k * 10, z, { s: 8.5, w: 400 }); }).join(""); }
  /* culori T568B */
  var B = [["#fff", "#f97316"], ["#f97316"], ["#fff", "#16a34a"], ["#2563eb"], ["#fff", "#2563eb"], ["#16a34a"], ["#fff", "#92400e"], ["#92400e"]];
  function wire(x1, y1, x2, y2, c, extra) { var s = ln(x1, y1, x2, y2, c[0], 5, ' stroke-linecap="round"' + (extra || "")); if (c[1]) s += ln(x1, y1, x2, y2, c[1], 5, ' stroke-dasharray="4 4"' + (extra || "")); return s; }

  /* 1. mufarea RJ45 */
  var jacket = r(20, 72, 250, 36, "#94a3b8", { rx: 10 }) + t(120, 95, "cablu UTP (manta)", { s: 10, f: "#f8fafc" });
  function fan(spread) { var s = ""; for (var i = 0; i < 8; i++) { var y = spread ? 62 + i * 8 : 82 + (i % 4) * 4; s += wire(270, 84 + (i % 4) * 4, 370, y, B[i]); } return s; }
  ANIMS.crimp = { t: "Mufarea unui cablu RJ45 (T568B)", vb: "0 0 480 180", steps: [
    { c: "1. Dezizolezi ~2–3 cm din manta (fără să crestezi firele).", d: 2200, s: jacket + '<g>' + r(270, 72, 60, 36, "#94a3b8", { rx: 6 }) + '<animateTransform attributeName="transform" type="translate" from="0 0" to="90 0" dur="1.6s" fill="freeze"/>' + A("opacity", 1, 0, 1.2, 0.8) + '</g>' + '<g opacity="0">' + fan(false) + show(0.6) + "</g>" },
    { c: "2. Desfaci perechile și îndrepți fiecare fir.", d: 2200, s: jacket + '<g>' + fan(false) + A("opacity", 1, 0, 0.8, 0) + '</g><g opacity="0">' + fan(true) + A("opacity", 0, 1, 1, 0.4) + "</g>" },
    { c: "3. Le pui în ordinea T568B: AP · P · AV · A · AA · V · AM · M și tai drept la ~12–13 mm.", d: 2600, s: jacket + fan(true) + '<line x1="352" y1="50" x2="352" y2="130" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 4" opacity="0"><set attributeName="opacity" to="1" begin="0.8s" fill="freeze"/></line>' + '<rect x="353" y="56" width="20" height="66" fill="#fff" opacity="0">' + A("opacity", 0, 1, 0.6, 1.4) + "</rect>" + t(352, 145, "tăietură dreaptă", { s: 9, f: "#dc2626" }) },
    { c: "4. Împingi firele în mufă (clema în jos) până ating peretele din față; mantaua intră sub clema de strângere.", d: 2600, s: jacket + fan(true).replace(/370/g, "352") + '<g>' + r(300, 52, 90, 76, "rgba(186,230,253,.45)", { st: "#0369a1", rx: 4 }) + t(345, 46, "mufă RJ45", { s: 9.5, f: "#0369a1" }) + '<animateTransform attributeName="transform" type="translate" from="110 0" to="0 0" dur="1.8s" fill="freeze"/></g>' },
    { c: "5. Sertizezi ferm cu cleștele: contactele aurii coboară și străpung izolația firelor.", d: 2400, s: jacket + fan(true).replace(/370/g, "352") + r(300, 52, 90, 76, "rgba(186,230,253,.45)", { st: "#0369a1", rx: 4 }) + (function () { var s = ""; for (var i = 0; i < 8; i++) s += '<rect x="368" y="' + (58 + i * 8) + '" width="12" height="3" fill="#eab308"><animate attributeName="x" from="368" to="356" begin="0.9s" dur="0.5s" fill="freeze"/></rect>'; return s; })() + '<g><path d="M290 20 h110 v26 h-110z" fill="#1f2937"/><animateTransform attributeName="transform" type="translate" from="0 -30" to="0 6" dur="0.9s" fill="freeze"/></g><g><path d="M290 134 h110 v26 h-110z" fill="#1f2937"/><animateTransform attributeName="transform" type="translate" from="0 30" to="0 -6" dur="0.9s" fill="freeze"/></g>' + t(345, 175, "clește", { s: 9 }) },
    { c: "6. Testezi: pe master și pe remote LED-urile 1→8 se aprind pe rând, în aceeași ordine = cablu drept bun.", d: 4200, s: (function () { var s = r(40, 40, 150, 100, "#e5e7eb") + t(115, 58, "MASTER", { s: 10 }) + r(290, 40, 150, 100, "#e5e7eb") + t(365, 58, "REMOTE", { s: 10 }) + ln(190, 90, 290, 90, "#94a3b8", 6); for (var i = 0; i < 8; i++) { [55, 305].forEach(function (x0) { s += '<circle cx="' + (x0 + i * 17) + '" cy="96" r="6" fill="#334155"><animate attributeName="fill" values="#334155;#22c55e;#22c55e;#334155" keyTimes="0;0.01;0.11;0.12" dur="3.2s" begin="' + (i * 0.4) + 's" repeatCount="indefinite"/></circle>' + t(x0 + i * 17, 118, i + 1, { s: 9 }); }); } return s; })() } ] };

  /* 2. pachetul PC → switch → router → server */
  var net = node(50, 70, "PC A", "192.168.1.10 · MAC AA") + node(170, 70, "Switch", "nivel 2") + node(300, 70, "Router", "G0/0 R1 · G0/1 R2") + node(430, 70, "Server", "10.0.0.5 · MAC BB") + ln(84, 70, 136, 70, "#64748b") + ln(204, 70, 266, 70, "#64748b") + ln(334, 70, 396, 70, "#64748b");
  function hdr(mac, ip, y) { return r(90, y || 120, 300, 40, "#f8fafc") + t(240, (y || 120) + 16, mac, { s: 10, f: "#b45309" }) + t(240, (y || 120) + 32, ip, { s: 10, f: "#1d4ed8" }); }
  ANIMS.packet = { t: "Un pachet de la PC la server prin switch și router", vb: "0 0 480 170", steps: [
    { c: "PC-ul vede că 10.0.0.5 e în ALTĂ rețea → trimite cadrul către gateway (MAC-ul routerului, R1).", d: 2600, s: net + hdr("MAC: AA → R1 (gateway)", "IP: 192.168.1.10 → 10.0.0.5") + '<g transform="translate(50,32)">' + env("") + mv("M0 0 L120 0", 1.6, 0.3) + "</g></g>" },
    { c: "Switch-ul citește doar MAC-ul destinație și trimite cadrul pe portul routerului.", d: 2400, s: net + hdr("MAC: AA → R1", "IP: 192.168.1.10 → 10.0.0.5") + '<g transform="translate(170,32)">' + env("") + mv("M0 0 L130 0", 1.6, 0.3) + "</g></g>" },
    { c: "Routerul citește IP-ul, alege ieșirea G0/1 și RESCRIE MAC-urile (R2 → BB). IP-urile rămân aceleași!", d: 3000, s: net + hdr("MAC: R2 → BB (rescris)", "IP: 192.168.1.10 → 10.0.0.5 (neschimbat)") + '<g transform="translate(300,32)">' + env("", "#bbf7d0") + mv("M0 0 L130 0", 1.6, 0.8) + "</g></g>" },
    { c: "Răspunsul face drumul invers: IP-urile se inversează, MAC-urile se schimbă la fiecare hop.", d: 3000, s: net + hdr("MAC: BB → R2, apoi R1 → AA", "IP: 10.0.0.5 → 192.168.1.10") + '<g transform="translate(430,32)">' + env("", "#bfdbfe") + mv("M0 0 L-380 0", 2.6, 0.2) + "</g></g>" } ] };

  /* 3. ARP */
  var lan = node(60, 50, "PC A", "192.168.1.10") + node(240, 50, "Switch") + node(150, 140, "PC B", "192.168.1.20") + node(330, 140, "PC C", "192.168.1.30") + node(420, 50, "PC D", "192.168.1.40") + ln(94, 50, 206, 50, "#64748b") + ln(274, 50, 386, 50, "#64748b") + ln(225, 68, 165, 122, "#64748b") + ln(255, 68, 315, 122, "#64748b");
  ANIMS.arp = { t: "ARP: aflarea adresei MAC", vb: "0 0 480 230", steps: [
    { c: "A vrea să vorbească cu 192.168.1.20, dar nu-i știe MAC-ul → ARP Request „Cine are .20?” către broadcast FF:FF:FF:FF:FF:FF.", d: 3000, s: lan + [["M60 50 L240 50 L150 140"], ["M60 50 L240 50 L330 140"], ["M60 50 L240 50 L420 50"]].map(function (p) { return '<g transform="translate(0,-30)">' + env("", "#fecaca") + mv(p[0], 2, 0.2) + "</g></g>"; }).join("") + t(240, 180, "broadcast: switch-ul îl trimite pe TOATE porturile", { s: 10, f: "#b91c1c" }) },
    { c: "Doar B (care are IP-ul .20) răspunde, direct lui A (unicast): „.20 este la MAC BB”. C și D ignoră cererea.", d: 2800, s: lan + '<g transform="translate(0,-30)">' + env("", "#bbf7d0") + mv("M150 140 L240 50 L60 50", 2, 0.2) + "</g></g>" + t(240, 180, "răspuns unicast", { s: 10, f: "#15803d" }) },
    { c: "A notează perechea în tabela ARP (o vezi cu arp -a) și abia acum trimite datele. Următoarele pachete nu mai au nevoie de ARP.", d: 2600, s: lan + '<g opacity="0">' + r(20, 176, 200, 34, "#f8fafc") + t(120, 190, "Tabela ARP a lui A", { s: 9.5 }) + t(120, 204, "192.168.1.20 → BB-BB-BB-BB-BB-BB", { s: 9, w: 400 }) + A("opacity", 0, 1, 0.6, 0.2) + "</g>" + '<g transform="translate(0,-30)">' + env("", "#fde68a") + mv("M60 50 L240 50 L150 140", 2, 0.9) + "</g></g>" } ] };

  /* 4. NAT */
  var natN = node(50, 60, "PC", "192.168.1.10") + node(230, 60, "Router NAT", "public 86.120.5.7") + node(420, 60, "Server", "8.8.8.8") + ln(84, 60, 196, 60, "#64748b") + ln(264, 60, 386, 60, "#64748b") + t(140, 100, "rețea privată", { s: 9, w: 400 }) + t(330, 100, "Internet", { s: 9, w: 400 });
  function tbl(on) { return '<g' + (on ? "" : ' opacity="0"') + ">" + r(90, 118, 300, 46, "#f8fafc") + t(240, 133, "Tabela NAT (PAT)", { s: 9.5 }) + t(240, 150, "192.168.1.10:51000 ⇄ 86.120.5.7:40001", { s: 10, f: "#7c3aed" }) + (on ? "" : A("opacity", 0, 1, 0.5, 1.2)) + "</g>"; }
  ANIMS.nat = { t: "NAT/PAT: adresa privată devine publică", vb: "0 0 480 170", steps: [
    { c: "PC-ul trimite: sursa 192.168.1.10:51000 → 8.8.8.8:53. Adresa privată nu poate ieși ca atare pe Internet.", d: 2400, s: natN + t(140, 34, "src 192.168.1.10:51000", { s: 9, f: "#1d4ed8" }) + '<g transform="translate(50,20)">' + env("") + mv("M0 0 L180 0", 1.6, 0.3) + "</g></g>" },
    { c: "Routerul înlocuiește sursa cu IP-ul lui public și un port liber (86.120.5.7:40001) și ține minte asta în tabelă.", d: 2800, s: natN + t(330, 34, "src 86.120.5.7:40001", { s: 9, f: "#7c3aed" }) + tbl(false) + '<g transform="translate(230,20)">' + env("", "#ddd6fe") + mv("M0 0 L190 0", 1.6, 1) + "</g></g>" },
    { c: "Răspunsul vine la 86.120.5.7:40001; routerul caută în tabelă și îl trimite înapoi la 192.168.1.10:51000.", d: 3000, s: natN + tbl(true) + t(240, 34, "dst 86.120.5.7:40001 → 192.168.1.10:51000", { s: 9, f: "#15803d" }) + '<g transform="translate(420,20)">' + env("", "#bbf7d0") + mv("M0 0 L-370 0", 2.4, 0.2) + "</g></g>" } ] };

  /* 5. subnetting */
  function bar(parts, y, lbl) { var w = 440 / parts.length, s = ""; parts.forEach(function (p, i) { s += r(20 + i * w, y, w, 34, p[1], { rx: 2 }) + t(20 + i * w + w / 2, y + 15, p[0], { s: 9.5 }) + t(20 + i * w + w / 2, y + 28, p[2], { s: 8.5, w: 400 }); }); return s + t(20, y - 6, lbl, { s: 10, a: "start" }); }
  ANIMS.subnet = { t: "Împărțirea unei rețele /24 în subrețele", vb: "0 0 480 190", steps: [
    { c: "192.168.1.0/24 = 256 de adrese (.0 rețea, .255 broadcast, 254 de host-uri).", d: 2200, s: bar([["192.168.1.0/24", "#bfdbfe", ".0 – .255 · 254 host-uri"]], 30, "1 rețea") },
    { c: "Împrumuți 1 bit din partea de host → /25: 2 subrețele × 128 adrese (126 host-uri).", d: 2400, s: bar([["192.168.1.0/24", "#bfdbfe", ""]], 30, "1 rețea") + '<g opacity="0">' + bar([[".0/25", "#bbf7d0", ".0 – .127"], [".128/25", "#fde68a", ".128 – .255"]], 90, "2 subrețele /25 (mască .128)") + A("opacity", 0, 1, 0.8, 0.3) + "</g>" },
    { c: "Împrumuți 2 biți → /26: 4 subrețele × 64 (62 host-uri). Saltul = 256 − 192 = 64.", d: 3000, s: bar([[".0/25", "#bbf7d0", ".0 – .127"], [".128/25", "#fde68a", ".128 – .255"]], 30, "2 × /25") + '<g opacity="0">' + bar([[".0/26", "#a7f3d0", ".0–.63"], [".64/26", "#bae6fd", ".64–.127"], [".128/26", "#fde68a", ".128–.191"], [".192/26", "#fecaca", ".192–.255"]], 90, "4 subrețele /26 (mască 255.255.255.192)") + A("opacity", 0, 1, 0.8, 0.3) + "</g>" + t(240, 160, "prima adresă = rețea, ultima = broadcast în fiecare bloc", { s: 9.5, f: "#475569" }) } ] };

  /* 6. serie / paralel cu aparate */
  function bat(x, y) { return ln(x, y - 14, x, y + 14, "#334155", 3) + ln(x + 8, y - 8, x + 8, y + 8, "#334155", 5) + t(x - 10, y - 16, "+", { s: 11 }) + t(x + 4, y + 34, "12 V", { s: 9 }); }
  function res(x, y, l, v) { return r(x - 22, y - 9, 44, 18, "#fde68a") + t(x, y + 4, l, { s: 9.5 }) + (v ? t(x, y - 14, v, { s: 8.5, f: "#475569", w: 400 }) : ""); }
  function meter(x, y, l, c) { return '<circle cx="' + x + '" cy="' + y + '" r="13" fill="#fff" stroke="' + c + '" stroke-width="2"/>' + t(x, y + 4, l, { s: 11, f: c }); }
  function dots(path, n, dur) { var s = ""; for (var i = 0; i < n; i++) s += '<circle r="3.5" fill="#f59e0b">' + mv(path, dur, -i * dur / n, true) + "</circle>"; return s; }
  var serP = "M60 40 L420 40 L420 140 L60 140 Z";
  ANIMS.circuit = { t: "Curentul în serie și în paralel; unde pui aparatele", vb: "0 0 480 190", steps: [
    { c: "SERIE: un singur drum → același curent prin toate elementele; tensiunile se adună (6 V + 6 V = 12 V).", d: 3200, s: '<path d="' + serP + '" fill="none" stroke="#64748b" stroke-width="2"/>' + bat(60, 90).replace(/60/g, "60") + res(180, 40, "R1 6 Ω", "6 V") + res(320, 40, "R2 6 Ω", "6 V") + dots(serP, 10, 4) + t(240, 175, "I = 12 V / 12 Ω = 1 A, la fel peste tot", { s: 10 }) },
    { c: "PARALEL: curentul se împarte pe ramuri; fiecare ramură are aceeași tensiune (12 V).", d: 3200, s: '<path d="M60 40 L340 40 M60 140 L340 140 M60 40 L60 140 M200 40 L200 140 M340 40 L340 140" fill="none" stroke="#64748b" stroke-width="2"/>' + bat(60, 90) + res(200, 90, "R1 12 Ω", "") + res(340, 90, "R2 12 Ω", "") + dots("M60 40 L200 40 L200 140 L60 140 Z", 6, 3) + dots("M60 40 L340 40 L340 140 L60 140 Z", 8, 4) + t(240, 175, "1 A + 1 A = 2 A din baterie; 12 V pe fiecare ramură", { s: 10 }) },
    { c: "Ampermetrul (A) se pune ÎN SERIE, în drumul curentului; voltmetrul (V) ÎN PARALEL, la capetele elementului.", d: 3600, s: '<path d="' + serP + '" fill="none" stroke="#64748b" stroke-width="2"/>' + bat(60, 90) + res(250, 40, "R 12 Ω", "") + meter(140, 40, "A", "#dc2626") + '<path d="M228 40 L228 80 L272 80 L272 40" fill="none" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="4 3"/>' + meter(250, 80, "V", "#1d4ed8") + dots(serP, 10, 4) + t(240, 175, "ampermetru în paralel = scurtcircuit (se arde siguranța!)", { s: 10, f: "#b91c1c" }) } ] };

  /* 7. AC vs DC */
  function axes(y) { return ln(30, y, 460, y, "#94a3b8", 1) + ln(30, 20, 30, 170, "#94a3b8", 1); }
  var sine = (function () { var d = "M30 95"; for (var x = 0; x <= 420; x += 5) d += " L" + (30 + x) + " " + (95 - 60 * Math.sin(x / 420 * 4 * Math.PI)).toFixed(1); return d; })();
  ANIMS.acdc = { t: "Curent continuu (DC) și alternativ (AC)", vb: "0 0 480 190", steps: [
    { c: "DC (bateria, alimentatorul): tensiunea are mereu același sens și aceeași valoare. Multimetru pe V⎓.", d: 2600, s: axes(150) + draw("M30 70 L450 70", "#dc2626", 3, 2) + t(440, 62, "+12 V", { s: 10, a: "end", f: "#dc2626" }) + t(40, 166, "0 V", { s: 9, a: "start" }) },
    { c: "AC (priza): sensul se schimbă de 50 de ori pe secundă (50 Hz, perioada 20 ms). 230 V efectiv, ~325 V la vârf. Multimetru pe V~.", d: 3400, s: axes(95) + draw(sine, "#2563eb", 3, 3) + ln(30, 35, 460, 35, "#94a3b8", 1, ' stroke-dasharray="3 3"') + t(450, 30, "+325 V vârf", { s: 9, a: "end" }) + t(240, 182, "o perioadă = 20 ms → 2 perioade desenate", { s: 9.5 }) } ] };

  /* 8. trifazat */
  function ph(sh, c) { var d = ""; for (var x = 0; x <= 300; x += 4) d += (x ? " L" : "M") + (30 + x) + " " + (95 - 55 * Math.sin((x / 300) * 2 * Math.PI * 1.5 - sh)).toFixed(1); return d; }
  ANIMS.three = { t: "Sistemul trifazat: 3 faze defazate cu 120°", vb: "0 0 480 190", steps: [
    { c: "L1, L2, L3 sunt trei tensiuni alternative identice, decalate cu 120° (o treime de perioadă). Culori uzuale: maro, negru, gri.", d: 3600, s: axes(95) + draw(ph(0), "#92400e", 3, 3) + draw(ph(2 * Math.PI / 3), "#111827", 3, 3, 0.4) + draw(ph(4 * Math.PI / 3), "#9ca3af", 3, 3, 0.8) + t(400, 40, "L1", { s: 11, f: "#92400e" }) + t(400, 58, "L2", { s: 11 }) + t(400, 76, "L3", { s: 11, f: "#6b7280" }) },
    { c: "Ca trei săgeți care se rotesc împreună, la 120° una de alta: între fază și nul 230 V, între două faze 400 V (230 × √3).", d: 4000, s: '<circle cx="240" cy="95" r="70" fill="none" stroke="#cbd5e1"/><g>' + ln(240, 95, 310, 95, "#92400e", 4) + ln(240, 95, 205, 34.4, "#111827", 4) + ln(240, 95, 205, 155.6, "#9ca3af", 4) + '<animateTransform attributeName="transform" type="rotate" from="0 240 95" to="-360 240 95" dur="4s" repeatCount="indefinite"/></g>' + t(70, 60, "L1 – N: 230 V", { s: 10 }) + t(70, 80, "L1 – L2: 400 V", { s: 10 }) + t(410, 60, "120° între faze", { s: 10 }) } ] };

  /* 9. fibra SM / MM */
  function zig(n, h, y0) { var d = "M30 " + y0, x = 30, up = true; while (x < 450) { x += n; d += " L" + Math.min(x, 450) + " " + (up ? y0 - h : y0 + h); up = !up; } return d; }
  ANIMS.fiber = { t: "Lumina în fibra multimode și single-mode", vb: "0 0 480 190", steps: [
    { c: "Multimode (miez 50/62,5 µm): lumina merge pe mai multe drumuri (moduri). Cele în zig-zag ajung mai târziu → impulsul se lățește (dispersie modală) → distanțe scurte (sute de m).", d: 4200, s: r(20, 50, 440, 90, "#e0f2fe", { st: "#0ea5e9", rx: 4 }) + r(20, 65, 440, 60, "#bae6fd", { st: "none", rx: 0 }) + '<path d="' + zig(40, 26, 95) + '" fill="none" stroke="#f97316" stroke-width="1" opacity=".5"/><path d="' + zig(90, 26, 95) + '" fill="none" stroke="#dc2626" stroke-width="1" opacity=".5"/>' + ln(30, 95, 450, 95, "#16a34a", 1, ' opacity=".5"') + '<circle r="5" fill="#16a34a">' + mv("M30 95 L450 95", 2.2, 0, true) + '</circle><circle r="5" fill="#dc2626">' + mv(zig(90, 26, 95), 2.7, 0, true) + '</circle><circle r="5" fill="#f97316">' + mv(zig(40, 26, 95), 3.3, 0, true) + "</circle>" + t(240, 165, "aceeași plecare, sosiri diferite", { s: 10 }) },
    { c: "Single-mode (miez ~9 µm): un singur drum, aproape drept → impulsul rămâne curat → zeci de km (laser 1310/1550 nm).", d: 3000, s: r(20, 60, 440, 70, "#fef9c3", { st: "#ca8a04", rx: 4 }) + r(20, 90, 440, 10, "#fde047", { st: "none", rx: 0 }) + '<circle r="5" fill="#dc2626">' + mv("M30 95 L450 95", 2, 0, true) + "</circle>" + t(240, 160, "miez subțire = un singur mod", { s: 10 }) } ] };

  /* 10. propagare și zona Fresnel */
  function tower(x, h) { return '<path d="M' + (x - 8) + " 170 L" + x + " " + (170 - h) + " L" + (x + 8) + ' 170" fill="none" stroke="#334155" stroke-width="2"/>' + r(x - 4, 166 - h, 8, 14, "#2563eb", { rx: 2 }); }
  ANIMS.fresnel = { t: "Unda radio, linia de vedere și zona Fresnel", vb: "0 0 480 190", steps: [
    { c: "Antena radiază unde care se îndepărtează (ca valurile în apă); semnalul scade cu distanța.", d: 3000, s: tower(60, 100) + (function () { var s = ""; for (var i = 0; i < 4; i++) s += '<circle cx="60" cy="74" r="5" fill="none" stroke="#2563eb" stroke-width="2"><animate attributeName="r" from="5" to="200" dur="3s" begin="' + (i * 0.75) + 's" repeatCount="indefinite"/><animate attributeName="opacity" from="1" to="0" dur="3s" begin="' + (i * 0.75) + 's" repeatCount="indefinite"/></circle>'; return s; })() },
    { c: "Între antene nu ajunge o linie subțire: energia trece printr-un „trabuc” – prima zonă Fresnel. Un deal care intră în ea (> ~40%) strică legătura chiar dacă „se vede”.", d: 3400, s: tower(40, 100) + tower(440, 100) + ln(40, 74, 440, 74, "#16a34a", 1.5, ' stroke-dasharray="5 4"') + '<ellipse cx="240" cy="74" rx="200" ry="2" fill="rgba(34,197,94,.15)" stroke="#16a34a">' + A("ry", 2, 30, 1.2, 0.2) + "</ellipse>" + '<path d="M170 170 Q240 20 310 170 Z" fill="#a3a3a3"><animate attributeName="fill" from="#a3a3a3" to="#ef4444" begin="1.6s" dur="0.4s" fill="freeze"/></path>' + t(240, 186, "obstacol în zona Fresnel", { s: 10, f: "#b91c1c" }) },
    { c: "Soluția: antene mai sus (sau traseu ocolitor) până când zona Fresnel e liberă în proporție de cel puțin ~60%.", d: 3000, s: '<g>' + tower(40, 100) + tower(440, 100) + ln(40, 74, 440, 74, "#16a34a", 1.5, ' stroke-dasharray="5 4"') + '<ellipse cx="240" cy="74" rx="200" ry="30" fill="rgba(34,197,94,.15)" stroke="#16a34a"/><animateTransform attributeName="transform" type="translate" from="0 0" to="0 -28" dur="1.6s" fill="freeze"/></g>' + r(32, 120, 16, 50, "#94a3b8", { rx: 1 }) + r(432, 120, 16, 50, "#94a3b8", { rx: 1 }) + '<path d="M170 170 Q240 20 310 170 Z" fill="#a3a3a3"/>' + t(240, 186, "antene mai înalte → zona Fresnel liberă", { s: 10, f: "#15803d" }) } ] };

  /* 11. diagrama de radiație */
  function polar() { return '<circle cx="240" cy="95" r="80" fill="none" stroke="#e2e8f0"/><circle cx="240" cy="95" r="50" fill="none" stroke="#e2e8f0"/><circle cx="240" cy="95" r="20" fill="none" stroke="#e2e8f0"/>' + ln(150, 95, 330, 95, "#e2e8f0", 1) + ln(240, 10, 240, 180, "#e2e8f0", 1); }
  function grow(d, c) { return '<g><path d="' + d + '" fill="' + c + '" fill-opacity=".35" stroke="' + c + '" stroke-width="2"/><animateTransform attributeName="transform" type="scale" from="0.05" to="1" dur="1.4s" fill="freeze" additive="sum"/></g>'; }
  function at(d) { return '<g transform="translate(240 95)">' + d + "</g>"; }
  ANIMS.pattern = { t: "Diagrama de radiație (văzută de sus)", vb: "0 0 480 190", steps: [
    { c: "Antena omnidirecțională (dipol vertical, bici TETRA): radiază la fel în toate direcțiile din plan orizontal.", d: 2600, s: polar() + at(grow("M-70 0 A70 70 0 1 1 70 0 A70 70 0 1 1 -70 0", "#2563eb")) + t(420, 40, "omni", { s: 11, f: "#2563eb" }) },
    { c: "Antena panou (sector 65–120°): acoperă o felie – trei panouri pe un pilon fac 360°.", d: 2600, s: polar() + at(grow("M0 0 L72 -42 A84 84 0 0 1 72 42 Z", "#16a34a")) + t(420, 40, "sector", { s: 11, f: "#16a34a" }) },
    { c: "Yagi: un lob principal îngust și lung (câștig mare) + lobi mici în spate/lateral. Trebuie orientată precis spre stația cealaltă.", d: 2600, s: polar() + at(grow("M0 0 C30 -18 82 -12 86 0 C82 12 30 18 0 0 Z M0 0 C-10 -8 -22 -6 -22 0 C-22 6 -10 8 0 0 Z", "#dc2626")) + t(420, 40, "Yagi", { s: 11, f: "#dc2626" }) + t(330, 120, "lob principal", { s: 9, w: 400 }) + t(200, 120, "lob spate", { s: 9, w: 400 }) } ] };
})();

/* Trucuri de memorie (🧠) și avertismente „❗ Nu te lăsa păcălit” – atașate automat în lecții și în explicațiile întrebărilor, după cuvintele-cheie. Fiecare truc a fost verificat. */
var HACKS = [
  { id: "trkallow", k: "trap", re: /allowed vlan/i, t: "allowed vlan fără „add” ÎNLOCUIEȘTE lista", h: "<code>switchport trunk allowed vlan 30</code> șterge 10 și 20 din listă. Vrei să completezi? Scrie <code>… allowed vlan <b>add</b> 30</code>. Truc: „<b>add</b> = adaugă la grămadă”." },
  { id: "trknat", k: "trap", re: /VLAN nativ|native vlan|nativ/i, t: "Nativul trebuie să fie IDENTIC la ambele capete", h: "Nativ = cadrele fără etichetă. Dacă un capăt are 1 și celălalt 99, cadrele „sar” în alt VLAN și CDP strigă <i>NATIVE_VLAN_MISMATCH</i>. Verifici cu <code>show interfaces trunk</code>, coloana Native vlan." },
  { id: "trkenc", k: "trap", re: /trunk encapsulation|encapsulation dot1q.*trunk|Catalyst 2960|Catalyst 3560|ISL/i, t: "Encapsulation dot1q: depinde de switch", h: "Catalyst <b>3560</b> știe ISL și 802.1Q, deci cere întâi <code>switchport trunk encapsulation dot1q</code>, apoi <code>mode trunk</code>. Catalyst <b>2960</b> știe numai 802.1Q: comanda lipsește, scrii direct <code>mode trunk</code>." },
  { id: "trkdtp", k: "trap", re: /\bDTP\b|dynamic auto|dynamic desirable|nonegotiate/i, t: "auto + auto = ACCESS, nu trunk", h: "Doi vecini în <i>dynamic auto</i> așteaptă amândoi o cerere și rămân access. Trunk apare dacă măcar unul e <i>trunk</i> sau <i>desirable</i>. Cel mai sigur: <code>mode trunk</code> la ambele capete + <code>nonegotiate</code>." },
  { id: "trkroas", k: "trap", re: /router-on-a-stick|sub-interfa|subinterfa|g0\/0\.\d+/i, t: "IP pe sub-interfețe, nu pe cea fizică", h: "La router-on-a-stick, interfața fizică are doar <code>no shutdown</code>. Fiecare sub-interfață are <code>encapsulation dot1Q &lt;VLAN&gt;</code> + IP-ul ei. Numărul din nume (.10) e doar etichetă; contează numărul din <code>dot1Q</code>." },
  { id: "trkmem", k: "mem", re: /\btrunk\b|802\.1Q|VLAN-uri pe (același|un) cablu/i, t: "Trunk = autostradă cu benzi colorate", h: "<b>Access</b> = un culoar, o culoare, spre calculator, fără etichetă. <b>Trunk</b> = autostrada dintre switch-uri: toate culorile (VLAN-urile) pe același cablu, fiecare cu <b>etichetă 802.1Q de 4 octeți</b>. Excepție: VLAN-ul <b>nativ</b> trece fără etichetă („fără bilet”)." },
  { id: "vpas", k: "mem", re: /voltmetr|ampermetr|în serie|în paralel|serie și paralel/i, t: "„V și P, A și S”", h: "<b>V</b>oltmetrul în <b>P</b>aralel, <b>A</b>mpermetrul în <b>S</b>erie. Și: în serie curentul e același (<b>S-C</b>), în paralel tensiunea e aceeași (<b>P-T</b>)." },
  { id: "ampshort", k: "trap", re: /ampermetr|măsoară curentul|borna 10A|mA⎓/i, t: "Ampermetrul pus în paralel = scurtcircuit", h: "Ampermetrul are rezistență aproape zero: pus în paralel pe o sursă face scurtcircuit și arde siguranța aparatului. Curentul se măsoară DESCHIZÂND circuitul (în serie)." },
  { id: "smmm", k: "mem", re: /monomod|multimod|single[- ]?mode|multi[- ]?mode|OM[1-5]|OS[12]\b/i, t: "Galben = sinGur (Single-mode)", h: "Mantaua <b>galbenă</b> = <b>monomod</b> (un singur mod, „unul singur”), 1310/1550 nm, zeci de km. <b>Portocaliu</b> (OM1/OM2) / <b>aqua</b> (OM3/OM4) / lime (OM5) = <b>multimod</b>, 850/1300 nm, sute de metri." },
  { id: "smtrap", k: "trap", re: /monomod|multimod|galben|aqua|portocali/i, t: "Culorile fibrei", h: "Galben = monomod (SM), NU multimod. Aqua și portocaliu = multimod. Miezul SM e ~9 µm, MM 50/62,5 µm – dar mantaua exterioară are 125 µm la ambele." },
  { id: "apc", k: "mem", re: /\bAPC\b|\bUPC\b|verde.*conector|conector.*verde|8°|8 grade/i, t: "Verde = înclinat (APC 8°)", h: "<b>V</b>erde = <b>A</b>PC = fața șlefuită la <b>8°</b> (reflexie foarte mică). <b>Albastru</b> = UPC (drept). Truc: „<b>APC = Angled</b>, ca un acoperiș în pantă – și acoperișul e verde”." },
  { id: "apctrap", k: "trap", re: /\bAPC\b|\bUPC\b/i, t: "APC are 8°, nu 6° sau 45°", h: "Unghiul APC este <b>8°</b>. APC (verde) și UPC (albastru) NU se cuplează între ele: rămâne aer între fețe → pierderi mari și fețe zgâriate." },
  { id: "osiro", k: "mem", re: /\bOSI\b|nivelul (fizic|legătur|rețea|transport|sesiune|prezentare|aplicație)|cele 7 niveluri/i, t: "OSI în ambele sensuri", h: "De jos în sus (1→7) – Fizic, Legătură de date, Rețea, Transport, Sesiune, Prezentare, Aplicație: „<b>F</b>iecare <b>L</b>up <b>R</b>âde <b>T</b>are <b>S</b>eara <b>P</b>e <b>A</b>fară”. De sus în jos (7→1): „<b>A</b>ici <b>P</b>ot <b>S</b>ta <b>T</b>oți, <b>R</b>âzând <b>L</b>iber, <b>F</b>ericiți”. În engleză (7→1): „All People Seem To Need Data Processing”." },
  { id: "pdu", k: "mem", re: /\bPDU\b|\bcadre(le)?\b|\bframe|segmente(le)? .*(TCP|nivel)|nivelul (2|3|4).*(cadre|pachete|segmente)/i, t: "PDU: „Bunicul Cumpără Pâine, Smântână, Dulceață”", h: "De jos în sus: <b>B</b>iți (L1) – <b>C</b>adre (L2) – <b>P</b>achete (L3) – <b>S</b>egmente (L4, TCP; la UDP: datagrame) – <b>D</b>ate (L5–7)." },
  { id: "pdutrap", k: "trap", re: /\bPDU\b|\bcadre(le)?\b|\bframe/i, t: "Nivelul 2 = cadre, nu segmente", h: "Cadrele (frames) sunt la nivelul 2 (MAC, switch). Segmentele sunt la nivelul 4 (TCP). Pachetele la nivelul 3 (IP, router). Varianta „aproape corectă” inversează des 2 cu 4." },
  { id: "t568b", k: "mem", re: /T568B|T568A|ordinea firelor|alb-portocaliu|RJ45/i, t: "T568B: „Portocala deschide, maro închide, albastrul stă la mijloc”", h: "1 alb-portocaliu, 2 portocaliu, 3 alb-verde, <b>4 albastru, 5 alb-albastru</b>, 6 verde, 7 alb-maro, 8 maro. Albul vine mereu ÎNAINTEA culorii lui, cu o excepție: perechea albastră din mijloc (4 albastru, 5 alb-albastru). Verdele „îmbrățișează” albastrul (pinii 3 și 6). T568A = B cu portocaliul și verdele schimbate." },
  { id: "cross", k: "mem", re: /crossover|cablu încrucișat|cablu drept|straight[- ]through|MDI/i, t: "Crossover: „1-3, 2-6”", h: "Crossover = T568A la un capăt + T568B la celălalt: pinii <b>1↔3</b> și <b>2↔6</b> (perechile portocalie și verde se schimbă). Regula: aparate de <b>același fel</b> (PC–PC, switch–switch, <b>PC–router</b>) → crossover; <b>diferite</b> (PC–switch, switch–router) → drept. Truc: „<b>Rudele se încrucișează, străinii merg drept</b>” (PC și router sunt „rude”; switch și hub sunt „rude”)." },
  { id: "crosstrap", k: "trap", re: /crossover|rollover|cablu drept|straight|consol/i, t: "Drept vs crossover vs rollover", h: "<b>Drept</b> (B–B): PC–switch, switch–router. <b>Crossover</b> (A–B, 1↔3, 2↔6): PC–router, switch–switch, PC–PC. <b>Rollover</b> (1↔8, 2↔7… „răsturnat”, albastru Cisco): NUMAI pentru consolă (PC → portul CON). Rollover-ul nu transportă date Ethernet." },
  { id: "bps", k: "trap", re: /\bbps\b|\bBps\b|Mbps|MB\/s|biți pe secundă|octeți|\bbyte/i, t: "b mic ≠ B mare", h: "<b>b</b> = bit, <b>B</b> = Byte (octet) = 8 biți. 100 Mbps ≈ 12,5 MB/s. Viteza rețelei se dă în biți pe secundă (bps); fișierele în octeți (MB). Truc: „<b>B</b>-ul mare e mai gras – are 8 biți în el”." },
  { id: "cat", k: "trap", re: /\bCat ?5e?\b|\bCat ?6a?\b|\bCat ?7\b|categori[ae] (de )?cablu|100 (de )?m(etri)?\b/i, t: "Categorii de cablu și distanța", h: "Cuprul Ethernet: maxim <b>100 m</b> pe segment (90 m permanent + 10 m patch-corduri), indiferent de categorie. Cat5 = 100 Mbps; <b>Cat5e = 1 Gbps</b>; Cat6 = 1 Gbps (10 Gbps doar până la ~55 m); Cat6a = 10 Gbps la 100 m. Capcană: Cat5e NU merge mai departe de 100 m." },
  { id: "mac", k: "trap", re: /\bMAC\b|adresa fizică|physical address|spoof/i, t: "MAC-ul se poate falsifica", h: "MAC-ul e „ars” în placa de rețea (48 de biți, 12 cifre hexa, primii 24 = producătorul/OUI), DAR poate fi schimbat din software (MAC spoofing). Deci „MAC-ul nu se poate schimba niciodată” e FALS." },
  { id: "devs", k: "mem", re: /\bhub(-ul|-uri)?\b|\bHub-ul|[Ss]witch și router|[Rr]outer și switch|nivelul 2.{0,60}nivelul 3|nivelul 3.{0,60}nivelul 2/, t: "Hub hăulește, Switch știe, Router rutează", h: "<b>Hub</b> (L1) trimite tot la toți porturile. <b>Switch</b> (L2) știe MAC-urile și trimite cadrul doar portului potrivit. <b>Router</b> (L3) leagă rețele diferite după IP (pachete)." },
  { id: "devtrap", k: "trap", re: /\bhub(-ul|-uri)?\b|\bHub-ul|[Ss]witch.{0,60}[Rr]outer.{0,60}(MAC|IP|cadre|pachete|nivel)|[Rr]outer.{0,60}[Ss]witch.{0,60}(MAC|IP|cadre|pachete|nivel)/, t: "Switch = cadre/MAC, router = pachete/IP", h: "Varianta „aproape corectă” inversează: switch-ul NU rutează IP (switch-ul de nivel 2), routerul NU învață MAC-uri pentru a comuta cadre. Hub-ul nu are tabelă MAC – trimite la toți (un singur domeniu de coliziune)." },
  { id: "vlan", k: "trap", re: /\bVLAN|subrețea|subnet/i, t: "VLAN ≠ subrețea", h: "<b>VLAN</b> = separare la nivelul 2, pe porturile switch-ului (domenii de broadcast). <b>Subrețea</b> = împărțirea adreselor IP cu masca (nivelul 3). În practică fiecărui VLAN îi dai o subrețea, dar sunt noțiuni diferite." },
  { id: "netbc", k: "mem", re: /adresa de rețea|broadcast|gateway|prima adresă|ultima adresă|host(uri)? utilizabil/i, t: "Rețea – gazde – broadcast", h: "Prima adresă (biții de host toți 0) = <b>rețeaua</b>; ultima (toți 1) = <b>broadcast</b>; între ele = gazde (2ⁿ − 2). Gateway-ul e o gazdă obișnuită – de obicei, prin convenție, prima utilizabilă (.1). Ex. 192.168.1.0/24: rețea .0, gazde .1–.254, broadcast .255." },
  { id: "netbctrap", k: "trap", re: /adresa de rețea|broadcast|gateway/i, t: "Adresa de rețea nu se dă unui PC", h: "192.168.1.0/24 și 192.168.1.255/24 NU pot fi puse pe un PC. Gateway-ul NU e obligatoriu .1 – e doar o convenție; examenul poate da .254." },
  { id: "class", k: "mem", re: /clas[aeă] [ABCDE]\b|primul octet|class [ABC]/i, t: "Clasele după primul octet", h: "A: <b>1–126</b> (127 = loopback, „acasă”) · B: <b>128–191</b> · C: <b>192–223</b> (ca 192.168) · D: 224–239 (multicast) · E: 240–255. Truc binar: A începe cu <b>0</b>, B cu <b>10</b>, C cu <b>110</b>, D cu <b>1110</b>." },
  { id: "classtrap", k: "trap", re: /clas[aeă] [ABC]\b|primul octet/i, t: "Clasa C începe la 192, nu la 191", h: "191.x este clasa B; 192.x–223.x clasa C; 224.x nu e clasa C (e multicast, D). 127.x nu e clasa A utilizabilă – e loopback." },
  { id: "priv", k: "mem", re: /adres[ăe] privat|RFC ?1918|10\.0\.0\.0|172\.16|192\.168/i, t: "Private: „10 – 172.16–31 – 192.168”", h: "10.0.0.0/8 · 172.16.0.0–172.31.255.255 (/12) · 192.168.0.0/16. Capcană: 172.32.x.x este PUBLICĂ." },
  { id: "ohm", k: "mem", re: /legea lui Ohm|U ?= ?R|rezistenț|putere(a)? electric|P ?= ?U/i, t: "„URI” și „PUI”", h: "<b>U = R · I</b> (citește „URI”) și <b>P = U · I</b> („PUI” – ca puiul). Triunghiul: U sus, R și I jos – acoperi ce cauți." },
  { id: "ports", k: "mem", re: /\bport(ul)? (20|21|22|23|25|53|67|68|80|110|143|443|3389)\b|SSH|Telnet|HTTPS?\b|\bDNS\b.*port|SMTP/i, t: "Porturi: 21 FTP · 22 SSH · 23 Telnet · 25 SMTP · 53 DNS · 80 HTTP · 443 HTTPS", h: "Truc: „<b>22 = SSH</b> – doi de S (Secure Shell), doi de 2”; Telnet e vecinul nesigur, 23. DNS 53 – reține-l ca „cinci-trei”. DHCP 67/68, POP3 110, IMAP 143, RDP 3389." },
  { id: "sshtrap", k: "trap", re: /SSH|Telnet|transport input/i, t: "SSH criptează, Telnet nu", h: "Telnet (23) trimite parola în clar. SSH (22) criptează și cere: hostname non-implicit, ip domain-name, chei RSA (≥ 768 biți pentru v2; folosește 1024), utilizator local + login local pe vty." },
  { id: "con", k: "mem", re: /9600|PuTTY|consol|COM\d|8N1/i, t: "Consola: „9600, 8-N-1, fără flow”", h: "Viteză <b>9600</b>, <b>8</b> biți de date, <b>N</b>o parity, <b>1</b> bit de stop, flow control None. Portul COM îl afli din Device Manager → Ports (COM & LPT)." },
  { id: "tcpudp", k: "mem", re: /\bTCP\b|\bUDP\b/i, t: "TCP = telefon, UDP = carte poștală", h: "TCP: stabilește conexiunea (3-way handshake SYN, SYN-ACK, ACK), confirmă, retransmite – sigur. UDP: trimite și atât – rapid (voce, video, DNS)." },
  { id: "dora", k: "mem", re: /\bDHCP\b/i, t: "DHCP = „DORA”", h: "<b>D</b>iscover → <b>O</b>ffer → <b>R</b>equest → <b>A</b>cknowledge. Fără server DHCP, Windows își pune 169.254.x.x (APIPA)." },
  { id: "arpdns", k: "mem", re: /\bARP\b|\bDNS\b/i, t: "„ARP Află MAC-ul, DNS Dă IP-ul”", h: "ARP: din IP → MAC (în rețeaua locală). DNS: din nume (www…) → IP." },
  { id: "wifi", k: "mem", re: /2[,.]4 ?GHz|canal(ele)? (1, 6|Wi-Fi)|Wi-Fi|802\.11/i, t: "Wi-Fi 2,4 GHz: canalele 1-6-11", h: "Pe 2,4 GHz doar <b>1, 6, 11</b> nu se suprapun. 5 GHz: mai multe canale, viteză mai mare, rază mai mică." },
  { id: "db", k: "mem", re: /\bdBm?\b|decibel/i, t: "„3 dublează, 10 înzecește”", h: "+3 dB ≈ ×2 putere, +10 dB = ×10; −3 dB = jumătate. 0 dBm = 1 mW; 30 dBm = 1 W; 20 dBm = 100 mW." },
  { id: "pcm", k: "mem", re: /300.?3400|PCM|64 ?kbit|E1\b|2048|eșantion/i, t: "Telefonul: „3-34, 8 pe 8 = 64”", h: "Canal vocal 300–3400 Hz (4 kHz alocat). Eșantionare 8 kHz × 8 biți = 64 kbit/s. E1 = 32 × 64 = 2048 kbit/s (30 de voci + sincronizare + semnalizare)." },
  { id: "rj11", k: "mem", re: /RJ11|RJ12|RJ9|RJ22|6P2C|6P4C|4P4C|telefon(ul)? fix/i, t: "„Telefonul vorbește prin mijloc”", h: "La RJ11 linia 1 e pe <b>pinii din mijloc 3–4</b> (roșu/verde la cordoanele vechi; albastru/alb-albastru în cablarea structurată). Linia 2 pe pinii 2–5 (negru/galben sau portocaliu/alb-portocaliu)." },
  { id: "rj11trap", k: "trap", re: /RJ11|RJ12|RJ45|8P8C/i, t: "RJ11 intră în portul RJ45, dar NU e Ethernet", h: "Mufa RJ11 (6 poziții) intră fizic într-o priză RJ45 (8 poziții) și poate chiar strica pinii marginali – dar nu transportă Ethernet. RJ45 = 8P8C; RJ11 = 6P2C/6P4C; RJ12 = 6P6C; RJ9/RJ22 = 4P4C (cordonul spiralat al receptorului)." },
  { id: "ipv6", k: "mem", re: /IPv6|IPv4/i, t: "„4 → 32, 6 → 128”", h: "IPv4 = 32 de biți (4 octeți zecimali). IPv6 = 128 de biți (8 grupuri hexa de câte 16 biți, „::” înlocuiește o singură dată grupuri de zerouri)." },
  { id: "coax", k: "mem", re: /coaxial|50 ?Ω|75 ?Ω/i, t: "„Radioul are 50, televizorul 75”", h: "Coaxialul radio/emisie = 50 Ω; TV/antenă de casă = 75 Ω. Le amesteci → dezadaptare (VSWR mare)." },
  { id: "lambda", k: "mem", re: /lungime(a)? de undă|λ|wavelength/i, t: "λ (m) = 300 / f (MHz)", h: "Ex. 300 MHz → 1 m; 400 MHz (TETRA) → 0,75 m; 100 MHz → 3 m. Dipolul are λ/2." },
  { id: "secret", k: "trap", re: /enable secret|enable password|password-encryption/i, t: "enable secret bate enable password", h: "Dacă există ambele, IOS cere <b>enable secret</b> (hash). service password-encryption doar „ascunde” slab (tip 7) parolele scrise în clar – nu înlocuiește secret." },
  { id: "save", k: "trap", re: /copy run|running-config|startup-config|write memory|reload/i, t: "Nesalvat = pierdut la reload", h: "running-config e în RAM; startup-config în NVRAM. Fără <b>copy running-config startup-config</b> (sau write), după reload totul dispare. Ordinea contează: run → start." },
  { id: "phase", k: "mem", re: /trifazat|120°|400 ?V|monofazat/i, t: "Trifazat: 3 faze la 120°, 230/400", h: "Între fază și nul 230 V; între două faze 400 V (230 × √3). Fazele sunt decalate cu 120° (360° / 3)." },
  { id: "not", k: "trap", qOnly: "q", re: /\bNU\b|cu excepția|\bFALS|este falsă|INCORECT/, t: "Citește „NU / CU EXCEPȚIA / FALS”", h: "Întrebările negative cer varianta GREȘITĂ. Pune degetul pe „NU” și repetă-l în gând la fiecare variantă: „Aceasta NU este …?”." },
  { id: "almost", k: "trap", qOnly: "a", re: /întotdeauna|niciodată|\bmereu\b/i, t: "Variantele cu „întotdeauna / niciodată / doar” sunt suspecte", h: "Distractorii „aproape corecți” folosesc cuvinte absolute. În rețelistică aproape orice are o excepție – verifică de două ori o variantă cu „mereu” sau „niciodată”." }
];
function HACK_FIND(text, seen, q) {
  /* text = textul lecției/întrebării; q (opțional) = întrebarea, pentru trucurile care se uită doar la enunț („NU”) sau la variante („mereu/niciodată”). Maxim 1 truc + 1 avertisment. */
  var out = [], got = {};
  for (var i = 0; i < HACKS.length; i++) {
    var x = HACKS[i]; if (got[x.k] || (seen && seen[x.id])) continue;
    var t = x.qOnly ? (q ? (x.qOnly === "q" ? q.q : q.a.slice(1).join(" | ")) : "") : text;
    if (t && x.re.test(t)) { out.push(x); got[x.k] = 1; if (seen) seen[x.id] = 1; }
  }
  return out;
}
function HACK_HTML(list) { return list.map(function (x) { return x.k === "mem" ? '<div class="memo"><b>🧠 Truc de memorie: ' + x.t + "</b><br>" + x.h + "</div>" : '<div class="trapbox"><span class="trapi" aria-hidden="true">!</span><div><b>Nu te lăsa păcălit: ' + x.t + "</b><br>" + x.h + "</div></div>"; }).join(""); }

/* Fotografii cu licență liberă de pe Wikimedia Commons, găzduite local (redimensionate, convertite în WebP). Lista completă: ecranul „Credite foto”. */
var PHOTOS = {
"console": {
"f": "img/console.webp",
"w": 720,
"h": 540,
"c": "Cablu de consolă Cisco (rollover, albastru): RJ45 la portul Console, DB9/USB la PC",
"a": "Pries",
"l": "CC BY-SA 4.0",
"lu": "https://creativecommons.org/licenses/by-sa/4.0",
"s": "https://commons.wikimedia.org/wiki/File:CiscoConsoleCable.jpg",
"t": "CiscoConsoleCable.jpg"
},
"crimper2": {
"f": "img/crimper2.webp",
"w": 720,
"h": 519,
"c": "Clește de sertizat RJ45/RJ11, cu lame de tăiere și dezizolare",
"a": "Appaloosa",
"l": "CC BY-SA 3.0",
"lu": "http://creativecommons.org/licenses/by-sa/3.0/",
"s": "https://commons.wikimedia.org/wiki/File:CrimpZangeRJ.jpg",
"t": "CrimpZangeRJ.jpg"
},
"hdd": {
"f": "img/hdd.webp",
"w": 720,
"h": 551,
"c": "Hard disk de 2,5\" deschis: platanul și capul de citire",
"a": "Evan-Amos",
"l": "CC BY-SA 3.0",
"lu": "https://creativecommons.org/licenses/by-sa/3.0",
"s": "https://commons.wikimedia.org/wiki/File:Laptop-hard-drive-exposed.jpg",
"t": "Laptop-hard-drive-exposed.jpg"
},
"lc": {
"f": "img/lc.webp",
"w": 720,
"h": 540,
"c": "Conector de fibră LC duplex (mic, cu clemă)",
"a": "Adamantios",
"l": "CC BY-SA 3.0",
"lu": "https://creativecommons.org/licenses/by-sa/3.0",
"s": "https://commons.wikimedia.org/wiki/File:LC-optical-fiber-connector-hdr-0a.jpg",
"t": "LC-optical-fiber-connector-hdr-0a.jpg"
},
"mobo": {
"f": "img/mobo.webp",
"w": 720,
"h": 686,
"c": "Placă de bază µATX: socket CPU, sloturi RAM, PCIe, conectori SATA",
"a": "Smial",
"l": "FAL",
"lu": "http://artlibre.org/licence/lal/en",
"s": "https://commons.wikimedia.org/wiki/File:Gigabyte_GA-H87M-D3H_motherboard_%C2%B5ATX_with_Intel_Socket_1150.jpg",
"t": "Gigabyte GA-H87M-D3H motherboard µATX with Intel Socket 1150.jpg"
},
"multimeter": {
"f": "img/multimeter.webp",
"w": 487,
"h": 720,
"c": "Multimetru digital: selector rotativ (V~, V⎓, A, Ω, continuitate) și bornele COM / VΩmA / 10A",
"a": "Tomasz Sienicki",
"l": "CC BY 3.0",
"lu": "https://creativecommons.org/licenses/by/3.0",
"s": "https://commons.wikimedia.org/wiki/File:Digital_universal_multimeter_(ubt).jpeg",
"t": "Digital universal multimeter (ubt).jpeg"
},
"multimeter3": {
"f": "img/multimeter3.webp",
"w": 720,
"h": 518,
"c": "Multimetru cu cordoane de măsură: negru în COM, roșu în VΩ",
"a": "Jacek Halicki",
"l": "CC BY-SA 4.0",
"lu": "https://creativecommons.org/licenses/by-sa/4.0",
"s": "https://commons.wikimedia.org/wiki/File:2017_Cyfrowy_miernik_uniwersalny.jpg",
"t": "2017 Cyfrowy miernik uniwersalny.jpg"
},
"punch": {
"f": "img/punch.webp",
"w": 720,
"h": 540,
"c": "Scule de impact (punch-down) pentru patch panel și priză: tip Krone/LSA și 110",
"a": "Adamantios",
"l": "CC BY-SA 3.0",
"lu": "https://creativecommons.org/licenses/by-sa/3.0",
"s": "https://commons.wikimedia.org/wiki/File:Punch-down-tool-Krone-and-110-0a.jpg",
"t": "Punch-down-tool-Krone-and-110-0a.jpg"
},
"rack": {
"f": "img/rack.webp",
"w": 720,
"h": 540,
"c": "Rack-uri de 19\" într-o sală tehnică",
"a": "ArnoldReinhold",
"l": "CC BY-SA 4.0",
"lu": "https://creativecommons.org/licenses/by-sa/4.0",
"s": "https://commons.wikimedia.org/wiki/File:19_inch_racks_MIT.agr.jpg",
"t": "19 inch racks MIT.agr.jpg"
},
"ram": {
"f": "img/ram.webp",
"w": 720,
"h": 175,
"c": "Modul RAM DDR4 – crestătura nu e la mijloc, deci intră într-un singur sens",
"a": "PantheraLeo1359531",
"l": "CC BY 4.0",
"lu": "https://creativecommons.org/licenses/by/4.0",
"s": "https://commons.wikimedia.org/wiki/File:16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
"t": "16 GiB-DDR4-RAM-Riegel RAM019FIX Small Crop 90 PCNT.png"
},
"rj45": {
"f": "img/rj45.webp",
"w": 720,
"h": 540,
"c": "Mufă RJ45 (8P8C) transparentă – se văd cele 8 contacte aurii",
"a": "CyberXRef",
"l": "CC BY-SA 3.0",
"lu": "https://creativecommons.org/licenses/by-sa/3.0",
"s": "https://commons.wikimedia.org/wiki/File:8P8C_modular_plug.JPG",
"t": "8P8C modular plug.JPG"
},
"router": {
"f": "img/router.webp",
"w": 720,
"h": 540,
"c": "Router Cisco seria 1900 în rack",
"a": "Maraguache",
"l": "CC BY-SA 4.0",
"lu": "https://creativecommons.org/licenses/by-sa/4.0",
"s": "https://commons.wikimedia.org/wiki/File:Router_Cisco_1900_series.jpg",
"t": "Router Cisco 1900 series.jpg"
},
"sc": {
"f": "img/sc.webp",
"w": 720,
"h": 540,
"c": "Conector de fibră SC (pătrat, push-pull)",
"a": "Adamantios",
"l": "CC BY-SA 3.0",
"lu": "https://creativecommons.org/licenses/by-sa/3.0",
"s": "https://commons.wikimedia.org/wiki/File:SC-optical-fiber-connector-hdr-0a.jpg",
"t": "SC-optical-fiber-connector-hdr-0a.jpg"
},
"ssd": {
"f": "img/ssd.webp",
"w": 720,
"h": 540,
"c": "SSD SATA de 2,5\" (spate): conectorii de date și alimentare SATA",
"a": "Djsumdog",
"l": "CC BY-SA 3.0",
"lu": "https://creativecommons.org/licenses/by-sa/3.0",
"s": "https://commons.wikimedia.org/wiki/File:Crucial_CT256M4SSD2_rear_20120123.jpg",
"t": "Crucial CT256M4SSD2 rear 20120123.jpg"
},
"st": {
"f": "img/st.webp",
"w": 462,
"h": 720,
"c": "Conectori de fibră ST (rotunzi, cu baionetă)",
"a": "Adamantios",
"l": "CC BY-SA 3.0",
"lu": "https://creativecommons.org/licenses/by-sa/3.0",
"s": "https://commons.wikimedia.org/wiki/File:ST-optical-fiber-connector-hdr-0a.jpg",
"t": "ST-optical-fiber-connector-hdr-0a.jpg"
},
"tester": {
"f": "img/tester.webp",
"w": 720,
"h": 720,
"c": "Tester de cablu cu unitate master și remote: LED-urile 1–8 se aprind pe rând",
"a": "Reise Reise",
"l": "CC BY-SA 4.0",
"lu": "https://creativecommons.org/licenses/by-sa/4.0",
"s": "https://commons.wikimedia.org/wiki/File:Network_Cable_Tester_(1).jpg",
"t": "Network Cable Tester (1).jpg"
},
"toolset": {
"f": "img/toolset.webp",
"w": 720,
"h": 540,
"c": "Trusă tipică: dezizolator, tester de cablu RJ45/RJ11, sculă LSA (punch-down) și clește de sertizat",
"a": "heimnetzwerke.net",
"l": "CC BY 4.0",
"lu": "https://creativecommons.org/licenses/by/4.0",
"s": "https://commons.wikimedia.org/wiki/File:Cable_stripper,_cable_tester_(RJ45,_RJ11),_LSA-Tool_and_crimping_tool.jpg",
"t": "Cable stripper, cable tester (RJ45, RJ11), LSA-Tool and crimping tool.jpg"
},
"tower": {
"f": "img/tower.webp",
"w": 583,
"h": 720,
"c": "Pilon de telecomunicații cu antene",
"a": "Obsidian Soul",
"l": "CC0",
"lu": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
"s": "https://commons.wikimedia.org/wiki/File:Cell_site_tower_(Central_Mindanao_University)_02.jpg",
"t": "Cell site tower (Central Mindanao University) 02.jpg"
},
"switch": {
"f": "img/switch.webp",
"w": 720,
"h": 540,
"c": "Switch-uri Cisco Catalyst 2950 montate în rack (cablare reală, nu perfectă)",
"a": "Jemimus",
"l": "CC BY 2.0",
"lu": "https://creativecommons.org/licenses/by/2.0",
"s": "https://commons.wikimedia.org/wiki/File:Cisco_Catalyst_2950_network_switches_in_situ_-_IMG_1076.jpg",
"t": "Cisco Catalyst 2950 network switches in situ - IMG 1076.jpg"
},
"rackpp": {
"f": "img/rackpp.webp",
"w": 720,
"h": 540,
"c": "Rack de 19\" cu switch-uri și patch panel-uri, cablare ordonată",
"a": "Dsimic",
"l": "CC BY-SA 4.0",
"lu": "https://creativecommons.org/licenses/by-sa/4.0",
"s": "https://commons.wikimedia.org/wiki/File:19-inch_rackmount_Ethernet_switches_and_patch_panels.jpg",
"t": "19-inch rackmount Ethernet switches and patch panels.jpg"
},
"fx": {
"f": "img/fx.webp",
"w": 720,
"h": 540,
"c": "Detaliu Catalyst 2950: porturi 100BASE-FX pentru fibră",
"a": "Pmauduit",
"l": "CC BY-SA 3.0",
"lu": "https://creativecommons.org/licenses/by-sa/3.0",
"s": "https://commons.wikimedia.org/wiki/File:100basefx_ports_on_a_cisco_2950_switch.JPG",
"t": "100basefx ports on a cisco 2950 switch.JPG"
}
};
function PH(k, cap) { var p = PHOTOS[k]; if (!p) return ""; return '<figure class="ph"><img src="' + p.f + '" width="' + p.w + '" height="' + p.h + '" loading="lazy" decoding="async" alt="' + p.c.replace(/"/g, "&quot;") + '"><figcaption>' + (cap || p.c) + '<small>Foto: ' + p.a + ' · ' + p.l + ' · Wikimedia Commons</small></figcaption></figure>'; }

/* Fotografii suplimentare (Wikimedia Commons, licență liberă, găzduite local). */
Object.assign(PHOTOS, {
 "isr1900": {
  "f": "img/isr1900.webp",
  "w": 720,
  "h": 540,
  "c": "Router Cisco seria 1900 (familia lui 1941) montat în rack – vezi fața; porturile GE 0/0, GE 0/1 și CONSOLE sunt pe SPATE",
  "a": "Maraguache",
  "l": "CC BY-SA 4.0",
  "lu": "https://creativecommons.org/licenses/by-sa/4.0",
  "s": "https://commons.wikimedia.org/wiki/File:Router_Cisco_1900_series.jpg",
  "t": "Router Cisco 1900 series.jpg"
 },
 "rtr2800": {
  "f": "img/rtr2800.webp",
  "w": 720,
  "h": 540,
  "c": "Router Cisco ISR seria 2800 pe masa de laborator (porturile sunt pe spate; pe față doar LED-uri)",
  "a": "Robert",
  "l": "CC BY 2.0",
  "lu": "https://creativecommons.org/licenses/by/2.0",
  "s": "https://commons.wikimedia.org/wiki/File:Cisco_2800_series_router_(1).jpg",
  "t": "Cisco 2800 series router (1).jpg"
 },
 "sw2960": {
  "f": "img/sw2960.webp",
  "w": 540,
  "h": 720,
  "c": "Switch Cisco Catalyst 2960-S într-un rack, cu patch-cord-uri galbene în porturile RJ45",
  "a": "Dmitry Grigoriev from Nakhabino, Russia",
  "l": "CC BY 2.0",
  "lu": "https://creativecommons.org/licenses/by/2.0",
  "s": "https://commons.wikimedia.org/wiki/File:Cisco_Catalyst_2960-S_(11625112186).jpg",
  "t": "Cisco Catalyst 2960-S (11625112186).jpg"
 },
 "sgfront": {
  "f": "img/sgfront.webp",
  "w": 720,
  "h": 405,
  "c": "Switch Cisco compact, de birou (8 porturi): mic, fără ventilator, se pune pe masă",
  "a": "Антон Пищулин",
  "l": "CC BY-SA 4.0",
  "lu": "https://creativecommons.org/licenses/by-sa/4.0",
  "s": "https://commons.wikimedia.org/wiki/File:Cisco_SG_200-08P_front.jpg",
  "t": "Cisco SG 200-08P front.jpg"
 },
 "sgback": {
  "f": "img/sgback.webp",
  "w": 720,
  "h": 405,
  "c": "Switch compact deschis la culoare, văzut din partea porturilor RJ45 numerotate 1–8",
  "a": "Антон Пищулин",
  "l": "CC BY-SA 4.0",
  "lu": "https://creativecommons.org/licenses/by-sa/4.0",
  "s": "https://commons.wikimedia.org/wiki/File:Cisco_SG_200-08P_back_side.jpg",
  "t": "Cisco SG 200-08P back side.jpg"
 },
 "sg300": {
  "f": "img/sg300.webp",
  "w": 720,
  "h": 540,
  "c": "Switch Cisco de 28 de porturi, format 19\" (1U), scos din cutie",
  "a": "Dsimic",
  "l": "CC BY-SA 3.0",
  "lu": "https://creativecommons.org/licenses/by-sa/3.0",
  "s": "https://commons.wikimedia.org/wiki/File:Cisco_small_business_SG300-28_28-port_Gigabit_Ethernet_rackmount_switch.jpg",
  "t": "Cisco small business SG300-28 28-port Gigabit Ethernet rackmount switch.jpg"
 },
 "swports": {
  "f": "img/swports.webp",
  "w": 720,
  "h": 480,
  "c": "Porturi RJ45 pe switch-uri de 48 de porturi montate în rack",
  "a": "Ben Franske",
  "l": "CC BY-SA 4.0",
  "lu": "https://creativecommons.org/licenses/by-sa/4.0",
  "s": "https://commons.wikimedia.org/wiki/File:RJ45_Switch_Ports.jpg",
  "t": "RJ45 Switch Ports.jpg"
 },
 "swstack": {
  "f": "img/swstack.webp",
  "w": 720,
  "h": 540,
  "c": "Stivă de laborator: router Cisco sus, mai multe switch-uri Catalyst dedesubt, cabluri de patch roșii/galbene",
  "a": "Jemimus",
  "l": "CC BY 2.0",
  "lu": "https://creativecommons.org/licenses/by/2.0",
  "s": "https://commons.wikimedia.org/wiki/File:Cisco_switch_stack_-_IMG_0691.jpg",
  "t": "Cisco switch stack - IMG 0691.jpg"
 },
 "rj11": {
  "f": "img/rj11.webp",
  "w": 720,
  "h": 470,
  "c": "Mufă RJ11 (6P2C): 6 poziții, 2 contacte – linia 1 pe pinii din mijloc",
  "a": "Aeroid",
  "l": "CC BY-SA 4.0",
  "lu": "https://creativecommons.org/licenses/by-sa/4.0",
  "s": "https://commons.wikimedia.org/wiki/File:6P2C_RJ-11.jpg",
  "t": "6P2C RJ-11.jpg"
 },
 "rjxx": {
  "f": "img/rjxx.webp",
  "w": 600,
  "h": 374,
  "c": "Mufe modulare: RJ45 8P8C (rețea), 6P (RJ11/RJ12, telefon), 4P4C (RJ9/RJ22, cordonul spiralat al receptorului) și o priză",
  "a": "Andrewa at English Wikipedia",
  "l": "CC BY-SA 3.0",
  "lu": "http://creativecommons.org/licenses/by-sa/3.0/",
  "s": "https://commons.wikimedia.org/wiki/File:Rjxx.jpg",
  "t": "Rjxx.jpg"
 },
 "rj12": {
  "f": "img/rj12.webp",
  "w": 720,
  "h": 540,
  "c": "Priză (jack) modulară cu 6 poziții, tip keystone – nu e RJ45",
  "a": "CyberXRef",
  "l": "CC BY-SA 3.0",
  "lu": "https://creativecommons.org/licenses/by-sa/3.0",
  "s": "https://commons.wikimedia.org/wiki/File:6P6C_crimp-on_(RJ-11)_modular_connector_on_a_white_background.JPG",
  "t": "6P6C crimp-on (RJ-11) modular connector on a white background.JPG"
 },
 "sfp": {
  "f": "img/sfp.webp",
  "w": 720,
  "h": 405,
  "c": "Modul SFP Cisco pentru fibră (GLC-SX-MMD, multimod 850 nm): se introduce în slotul SFP al switch-ului, fibra intră în conectorul LC",
  "a": "Aurélien Rinaldi",
  "l": "CC BY-SA 4.0",
  "lu": "https://creativecommons.org/licenses/by-sa/4.0",
  "s": "https://commons.wikimedia.org/wiki/File:Module_SFP_Module_Fibre_GLC-SX-MMD_CISCO.jpg",
  "t": "Module SFP Module Fibre GLC-SX-MMD CISCO.jpg"
 },
 "fc": {
  "f": "img/fc.webp",
  "w": 720,
  "h": 540,
  "c": "Conector de fibră FC: rotund, metalic, cu filet (se înșurubează)",
  "a": "Adamantios",
  "l": "CC BY-SA 3.0",
  "lu": "https://creativecommons.org/licenses/by-sa/3.0",
  "s": "https://commons.wikimedia.org/wiki/File:FC-optical-fiber-connector-hdr-0a.jpg",
  "t": "FC-optical-fiber-connector-hdr-0a.jpg"
 },
 "fcapc": {
  "f": "img/fcapc.webp",
  "w": 720,
  "h": 450,
  "c": "Patch-cord de fibră cu conectori FC/APC (verzi = șlefuire la 8°)",
  "a": "Geek3",
  "l": "CC BY-SA 4.0",
  "lu": "https://creativecommons.org/licenses/by-sa/4.0",
  "s": "https://commons.wikimedia.org/wiki/File:Optical-patch-fiber-FC-APC-connectors.jpg",
  "t": "Optical-patch-fiber-FC-APC-connectors.jpg"
 }
});

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

window.LESSONS = [];
function L(c, lvl, t, ic, re, cards, opt) { LESSONS.push(Object.assign({ id: c + "-" + (LESSONS.filter(function (x) { return x.c === c; }).length + 1), c: c, lvl: lvl, t: t, ic: ic, re: re, cards: cards }, opt || {})); }
function K(h, eli, fact, extra) { return "<h3>" + h + "</h3>" + (eli ? '<div class="eli"><b>🧒 Pe înțeles:</b> ' + eli + "</div>" : "") + (fact ? '<div class="fact"><b>📌 Precis:</b> ' + fact + "</div>" : "") + (extra || ""); }

/* ===== FIBRĂ OPTICĂ ===== */
L("fo", 1, "Ce este fibra optică", "💡", /reflexi|miez|manta|indice de refrac|lumin|avantaj|interferen|EMI|125|sticl/i, [
  K("O țeavă cu oglinzi pentru lumină", "Imaginează-ți un furtun foarte subțire din sticlă, cu pereții ca o oglindă. Lumina intră la un capăt și „ricoșează” de pereți până la celălalt capăt, fără să iasă afară.", "Fibra are <b>miez</b> (core) și <b>manta</b> (cladding). Indicele de refracție al miezului este <b>mai mare</b> decât al mantalei, deci lumina suferă <b>reflexie totală internă</b>.", SVG.fiber()),
  K("De ce o iubim", "Lumina nu „aude” curentul din cablurile de lângă ea, așa că nu se strică semnalul. Și merge foarte departe fără să obosească.", "Avantaje: imunitate la interferențe electromagnetice (EMI), atenuare mică, bandă foarte mare, greutate mică, separare galvanică, greu de interceptat. Dezavantaj: îmbinarea cere scule speciale (sudură prin fuziune)."),
]);
L("fo", 1, "Monomod și multimod", "🔀", /monomod|multimod|OM\d|OS\d|9\/125|50\/125|62[,.]5|dispersi|G\.65|single.?mode|multi.?mode/i, [
  K("Drum îngust vs. drum lat", "Monomodul e ca o potecă îngustă: lumina merge pe un singur drum, drept, deci ajunge „la timp”. Multimodul e ca o autostradă lată: razele merg pe drumuri diferite, ajung la momente diferite și semnalul se „lățește”.", "<b>Monomod (SM)</b>: miez ~9 µm, laser 1310/1550 nm, distanțe de zeci de km (OS1/OS2, G.652, G.657 rezistentă la îndoire). <b>Multimod (MM)</b>: miez 50 sau 62,5 µm, 850/1300 nm, sute de metri (OM1–OM5). Limitarea MM: <b>dispersia modală</b>."),
  K("Culori de recunoaștere", "Ca la semafor, culoarea mantalei îți spune ce fel de fibră ai în mână.", "Uzual: galben = monomod; portocaliu = OM1/OM2; aqua (turcoaz) = OM3/OM4; verde-lime = OM5. Conectori: albastru = UPC, <b>verde = APC</b> (șlefuit la 8°)."),
]);
L("fo", 2, "Ferestre, atenuare, buget", "📉", /fereastr|nm|atenua|dB\/km|buget|pierder|curbur|macro|micro|raz.*îndoire/i, [
  K("Lumina obosește puțin pe drum", "Ca o lanternă într-o ceață foarte ușoară: după mulți kilometri, lumina e mai slabă. Dar fibra e atât de curată încât abia după zeci de km se simte.", "Ferestre de transmisie: <b>850 nm</b> (MM), <b>1310 nm</b> (~0,35 dB/km SM) și <b>1550 nm</b> (~0,2 dB/km SM, cea mai mică atenuare). Îndoirile prea strânse (macrocurburi) scot lumina din fibră – se respectă raza minimă de curbură."),
  K("Bugetul de putere", "E ca un portofel: pornești cu o sumă (puterea emițătorului) și fiecare km, sudură sau conector „costă” ceva. La final trebuie să-ți rămână mai mult decât minimul cerut de receptor.", "Pierderea totală = L×α + nr. suduri × ~0,1 dB + nr. conectori × ~0,3–0,75 dB (+ splittere). Marja = P<sub>emisie</sub> − pierderi − sensibilitate receptor."),
]);
L("fo", 2, "Sudura și conectorii", "🔥", /sudur|fuziune|clivi|cleav|pigtail|patchcord|conector|SC|LC|ST\b|MPO|APC|UPC|mecanic|manșon|caset|ODF|stripp|curăț/i, [
  K("Lipim două fire de sticlă", "Sudura prin fuziune e ca și cum ai topi două fire de ciocolată și le-ai lipi cap la cap perfect, sub microscop, cu o scânteie.", "Pași: dezizolare → curățare cu alcool izopropilic → <b>clivare</b> (tăiere la 90°) → aliniere și arc electric → protecție cu <b>manșon termocontractabil</b> → așezare în <b>caseta</b> de joncțiune. Pierdere tipică &lt; 0,1 dB. Alternativa rapidă: îmbinarea mecanică (pierdere mai mare)."),
  K("Conectori", "Conectorul este „ștecherul” fibrei: trebuie să fie curat ca o lentilă de ochelari, altfel lumina se lovește de praf.", "Tipuri: <b>LC</b> (mic, SFP), <b>SC</b> (pătrat, push-pull), <b>ST</b> (baionetă), <b>MPO/MTP</b> (multe fibre). APC (verde, 8°) are reflexie foarte mică – folosit în GPON/CATV. <b>Nu se cuplează APC cu UPC!</b> Inspecție cu microscop înainte de conectare."),
]);
L("fo", 3, "Măsurători: OTDR și power meter", "📈", /OTDR|power meter|VFL|reflectometr|zon[ăa] moart|dead zone|lansare|launch|fantom|ghost|Rayleigh|Fresnel|dBm|surs[ăa] de lumin|identificat|microscop|Tier/i, [
  K("OTDR = radarul fibrei", "Strigi într-o peșteră și asculți ecoul: din cât durează ecoul îți dai seama cât de departe e peretele. OTDR-ul trimite impulsuri de lumină și „ascultă” ce se întoarce.", "OTDR măsoară lungimea, atenuarea pe km, pierderea la suduri/conectori și locul unei întreruperi, <b>de la un singur capăt</b>. Folosește retroîmprăștierea Rayleigh și reflexiile Fresnel. Are <b>zonă moartă</b> – de aceea se folosește o <b>fibră de lansare</b>.", SVG.otdr()),
  K("Power meter + sursă = adevărul despre pierdere", "Pui un bec la un capăt și un luxmetru la celălalt: vezi exact câtă lumină s-a pierdut.", "Metoda sursă + power meter (Tier 1) măsoară pierderea totală de inserție în dB (puterea în dBm). <b>VFL</b> (laser roșu vizibil) arată cu ochiul rupturile și îndoirile pe distanțe scurte. Atenție: <b>nu privi niciodată în fibră activă</b>!"),
]);
L("fo", 3, "Rețele de acces: FTTx, PON, WDM", "🏘️", /FTT|PON|GPON|OLT|ONT|ONU|splitter|WDM|CWDM|DWDM|1490|SFP|BiDi|acces|distribuți|ADSS|OPGW|microduct|tub/i, [
  K("Un copac de lumină", "Ca o țeavă de apă din care se ramifică robinete pentru fiecare apartament: o singură fibră de la operator se împarte pasiv către mulți abonați.", "<b>GPON</b>: OLT la operator → splitter pasiv (1:32/1:64) → ONT la abonat. Downstream 1490 nm, upstream 1310 nm (TDMA). FTTH = fibra până în casă; FTTB = până în clădire; FTTC = până la cabinetul de stradă.", SVG.pon()),
  K("Mai multe culori pe aceeași fibră", "Ca la radio: mai multe posturi pe frecvențe diferite în același aer. Pe fibră, „posturile” sunt culori (lungimi de undă).", "<b>WDM</b> multiplexează lungimi de undă: CWDM (pas 20 nm, până la 18 canale), DWDM (pas foarte mic, zeci de canale, distanțe mari cu amplificatoare EDFA). Cabluri aeriene: ADSS (complet dielectric), OPGW (în firul de gardă al liniilor de înaltă tensiune)."),
]);

/* ===== CABLARE STRUCTURATĂ ===== */
L("cab", 1, "Medii de transmisie: coaxial, torsadat, fibră", "🧶", /coaxial|RG-?\d|UTP|STP|FTP|S\/FTP|F\/UTP|ecran|torsad|monomod|multimod|mediu|medii|thinnet|thicknet|10BASE/i, [
  K("Trei feluri de „drumuri” pentru date", "Coaxialul e ca un furtun cu un fir în mijloc și o plasă metalică de jur-împrejur care îl apără de zgomote. Cablul torsadat are 4 perechi de fire răsucite două câte două. Fibra optică nu duce curent, ci lumină.", "<b>Coaxial</b>: conductor central + dielectric + tresă (ecran) + manta. 75 Ω pentru TV/satelit/CCTV (RG-6, RG-59), 50 Ω pentru radio/antene (RG-58, RG-213, LMR). Vechiul Ethernet pe coaxial: 10BASE2 (thinnet), 10BASE5 (thicknet). <b>Torsadat</b>: UTP (fără ecran), FTP/F-UTP (folie în jurul tuturor perechilor), STP/S-FTP (ecran pe fiecare pereche + tresă). <b>Fibră</b>: monomod (SM, miez 9 µm, distanțe mari) și multimod (MM, miez 50/62,5 µm, sute de metri).", SVG.media()),
  K("Cum citești denumirea ecranării", "Prima literă spune ce ecran are tot cablul, a doua ce ecran are fiecare pereche.", "Formatul ISO: <b>X/YTP</b> – X = ecran general (U = fără, F = folie, S = tresă, SF = tresă + folie), Y = ecranul fiecărei perechi (U = fără, F = folie). Exemple: <b>U/UTP</b> = neecranat; <b>F/UTP</b> = folie generală; <b>S/FTP</b> = tresă generală + folie pe fiecare pereche (Cat7). Ecranul trebuie legat la pământ la un capăt/ambele, altfel nu ajută."),
]);
L("cab", 1, "Cablul torsadat și categoriile", "🧵", /Cat ?\d|categori|torsad|UTP|STP|FTP|MHz|ecran|AWG|rigid|multifilar|LSZH/i, [
  K("De ce firele sunt răsucite", "Două fire răsucite sunt ca doi prieteni care se țin de mână și se rotesc: orice zgomot din jur îi lovește pe amândoi la fel, iar la capăt zgomotul se anulează.", "Torsadarea reduce diafonia (NEXT) și interferențele. <b>UTP</b> = neecranat; <b>F/UTP, S/FTP</b> = ecranate. Categorii: Cat5e (100 MHz, 1 Gbit/s), Cat6 (250 MHz), Cat6A (500 MHz, 10 Gbit/s la 100 m), Cat7 (600 MHz), Cat8 (2000 MHz, 30 m)."),
  K("Rigid sau multifilar", "Firul rigid e ca un creion – bun pus fix în perete. Firul multifilar e ca o sfoară – se îndoaie des fără să se rupă.", "Cablu cu fir rigid (solid) pentru instalația fixă (în perete, pe patch panel); multifilar (stranded) pentru patchcorduri. Mantaua <b>LSZH</b> nu degajă fum toxic halogenat în caz de incendiu."),
]);
L("cab", 1, "RJ45: T568A, T568B, tipuri de cabluri", "🔌", /T568|568A|568B|RJ-?45|8P8C|pin|drept|straight|crossover|încrucișat|rollover|consol|MDIX|perechi/i, [
  K("Ordinea culorilor", "E ca o rețetă: dacă pui ingredientele în altă ordine, nu iese prăjitura. Firele trebuie să stea exact în ordinea standardului.", "Cablu <b>drept</b>: același standard la ambele capete (PC–switch). Cablu <b>crossover</b>: T568A la un capăt și T568B la celălalt (dispozitive de același fel, fără Auto-MDIX). Cablu <b>rollover</b> (consolă): ordinea complet inversată, pentru portul de consolă Cisco.", SVG.t568()),
  K("Ce perechi se folosesc", "La 100 Mbit/s lucrează doar două perechi, la 1 Gbit/s lucrează toate patru.", "10/100BASE-TX folosește pinii <b>1-2 și 3-6</b>; 1000BASE-T folosește toate cele 4 perechi, în ambele sensuri simultan. Auto-MDIX detectează automat tipul de cablu."),
]);
L("cab", 1, "Cablu drept, crossover și rollover", "🔁", /drept|straight|crossover|încrucișat|rollover|consol|Auto-?MDIX|MDI|același tip|PC.*switch|switch.*switch/i, [
  K("Cine vorbește și cine ascultă", "Gândește-te la două walkie-talkie-uri: gura unuia trebuie să ajungă la urechea celuilalt. Un PC „vorbește” pe pinii 1-2 și „ascultă” pe 3-6; switch-ul face invers, deci un cablu drept îi potrivește perfect. Două PC-uri între ele ar vorbi „gură la gură” – de aceea crossover-ul încrucișează firele.", "<b>Drept</b> (straight-through): același standard la ambele capete (T568B–T568B) – între echipamente <b>diferite</b> (PC–switch, router–switch). <b>Crossover</b>: T568A la un capăt, T568B la celălalt (1↔3, 2↔6) – între echipamente <b>de același fel</b> (switch–switch, PC–PC, PC–router pe Ethernet). <b>Rollover</b> (consolă, de regulă albastru): pinii complet inversați (1→8 … 8→1) – de la PC la portul <b>CONSOLE</b> al routerului/switch-ului Cisco, pentru configurare.", SVG.cables()),
  K("Auto-MDIX – switch-ul care se descurcă singur", "E ca un ștecher care se întoarce singur ca să intre în priză.", "<b>Auto-MDIX</b> detectează automat dacă firele trebuie încrucișate, deci aproape orice cablu drept funcționează și între echipamente de același fel. La examen însă se cere regula clasică: diferite → drept, la fel → crossover, consolă → rollover.", SVG.cableuse()),
]);
L("cab", 2, "Subsistemele cablării structurate", "🏢", /90 ?m|100 ?m|orizontal|backbone|vertical|camer[ăa] (de )?telecom|zon[ăa] de lucru|work area|intrare|subsistem|TIA|ISO|11801|50173|606|569|607|942|patch ?panel|legătur[ăa] permanent|canal|MUTO|cross-?connect|etichet/i, [
  K("Ca instalația de apă a unei clădiri", "Ai o conductă principală pe verticală (backbone), țevi pe fiecare etaj până la fiecare cameră (orizontal) și robinetul din cameră (priza).", "Subsisteme (TIA-568/ISO 11801/EN 50173): intrarea în clădire, camera echipamentelor, <b>backbone</b> (vertical), camera de telecomunicații, cablarea <b>orizontală</b> și zona de lucru. Etichetare: TIA-606; trasee: TIA-569; împământare: TIA-607; centre de date: TIA-942.", SVG.channel()),
  K("Regula 90 + 10", "Cablul fix din perete are voie la 90 m; mai ai 10 m pentru cablurile scurte de la capete.", "Legătura permanentă ≤ <b>90 m</b>; canalul complet ≤ <b>100 m</b>. Distorsiunea perechilor la terminare: maxim ~13 mm (0,5 in) pentru Cat6, minimă posibilă."),
]);
L("cab", 2, "Scule și testere", "🛠️", /scul|clește|sertiz|crimp|punch|impact|tester|wire ?map|certific|split pair|stripper|dezizol|tonă|toner|NEXT|TDR|return loss|insertion|skew/i, [
  K("Trusa tehnicianului", "Ca un bucătar care are cuțit, tel și cântar: tu ai clește de sertizat, sculă de impact și tester.", "<b>Clește de sertizat</b> – mufe RJ45; <b>sculă de impact (punch-down)</b> – terminare pe patch panel/priză (tip 110/LSA); <b>stripper</b> – dezizolare; <b>tester de continuitate</b> – wire map (inversări, perechi încrucișate, întreruperi); <b>certificator</b> – NEXT, return loss, insertion loss, lungime, delay skew (conformitate pe categorie)."),
  K("Split pair – defectul ascuns", "Ai legat firele „cap la cap” corect, dar le-ai amestecat din perechi diferite: continuitatea pare OK, dar zgomotul crește mult.", "Un <b>split pair</b> trece de un tester simplu de continuitate, dar apare la certificare prin NEXT mare. Un generator de ton + sondă (toner) identifică un cablu într-un mănunchi."),
]);
L("cab", 3, "Amenajarea camerei de echipamente", "🗄️", /rack|19|1U|44[,.]45|temperatur|umiditat|cul(oar|uar)|răcir|UPS|PDU|podea|incendi|gaz|împământ|legare la pământ|ventila|blank|aer condiț|EPO|VESDA|redundan|N\+1/i, [
  K("Casa calculatoarelor", "Serverele sunt ca niște sportivi care transpiră mult: au nevoie de aer rece din față, de curent fără pauze și de un pompier care să nu-i ude.", "Rack de <b>19\"</b>; 1U = <b>44,45 mm</b>. Culoar rece/culoar cald; panouri oarbe (blanking) pe sloturile goale. Temperatură recomandată ~18–27 °C. UPS + generator, PDU, împământare (TIA-607). Stingere cu <b>gaz inert</b>, nu cu apă. Detecție timpurie de fum (VESDA), buton EPO, podea tehnică."),
]);
L("cab", 3, "Conectori și cabluri în IT", "🔗", /BNC|coaxial|75 ?Ω|50 ?Ω|RG-?\d|F\b|N-type|conector|RJ-?11|RS-?232|DB-?9|USB|HDMI|DisplayPort|C13|C14|PoE|802\.3a[ft]|802\.3bt|keystone/i, [
  K("Fiecare mufă are rolul ei", "Ca la o trusă de chei: fiecare mufă intră doar unde trebuie și duce un anumit tip de semnal.", "<b>RJ45</b> (8P8C) – Ethernet; <b>RJ11</b> – telefon; <b>BNC/F/N</b> – coaxiale (75 Ω video/TV, 50 Ω radio/date); <b>RS-232/DB9</b> – serial/consolă; C13/C14 – alimentare echipamente. <b>PoE</b>: 802.3af (15,4 W), 802.3at (30 W), 802.3bt (60/90 W) pe cablul de rețea."),
]);

/* ===== PC ===== */
L("pc", 1, "Componentele unui calculator", "🖥️", /CPU|procesor|ALU|plac[ăa] de baz|chipset|Von Neumann|nucle|cache|component|socket|GPU|plac[ăa] video/i, [
  K("Calculatorul ca o bucătărie", "Procesorul este bucătarul, memoria RAM este masa de lucru, iar SSD-ul/HDD-ul este cămara. Cu cât masa e mai mare, cu atât bucătarul poate lucra la mai multe feluri deodată.", "<b>CPU</b> execută instrucțiunile (ALU + unitate de control + registre + cache L1/L2/L3 din SRAM). <b>Placa de bază</b> leagă totul prin chipset și magistrale (PCIe). Arhitectura Von Neumann: programul și datele stau în aceeași memorie.", SVG.pc()),
]);
L("pc", 1, "Memoria RAM și stocarea", "💾", /RAM|DDR|DIMM|ECC|volatil|SSD|HDD|NVMe|SATA|M\.2|RAID|S\.M\.A\.R\.T|TRIM|platan|ROM|flash/i, [
  K("Masa de lucru și cămara", "RAM-ul e masa: rapidă, dar când stingi lumina (curentul) se golește. SSD-ul/HDD-ul e cămara: mai lentă, dar păstrează totul.", "RAM este <b>volatilă</b> (DDR3/DDR4/DDR5, module DIMM; SO-DIMM la laptop; ECC la servere). Stocare: HDD (discuri magnetice rotative), SSD (flash, SATA sau <b>NVMe</b> pe PCIe – mult mai rapid). RAID 0 = viteză fără redundanță; RAID 1 = oglindire; RAID 5 = paritate (min. 3 discuri); RAID 10 = oglindire + striping."),
]);
L("pc", 2, "BIOS/UEFI, POST și sursa", "⚙️", /BIOS|UEFI|POST|CMOS|baterie|bip|beep|Secure Boot|TPM|surs[ăa]|ATX|12 ?V|5 ?V|3[,.]3 ?V|80 PLUS|MBR|GPT|boot/i, [
  K("Dimineața calculatorului", "Când pornești PC-ul, BIOS-ul face o „strigare la apel”: verifică dacă sunt toți – memoria, placa video, tastatura. Dacă cineva lipsește, scoate bipuri.", "<b>POST</b> = autotestul la pornire. BIOS/UEFI inițializează hardware-ul și pornește încărcătorul sistemului de operare. Setările sunt păstrate în CMOS, alimentat de bateria CR2032 (ceasul se resetează când e descărcată). UEFI suportă discuri <b>GPT</b> și Secure Boot. Sursa ATX dă +3,3 V, +5 V și <b>+12 V</b> (procesor, placă video)."),
]);
L("pc", 2, "Periferice și interfețe", "🖨️", /USB|HDMI|DisplayPort|VGA|DVI|Thunderbolt|PS\/2|imprimant|laser|toner|cuptor|fuser|cerneal|inkjet|scaner|DPI|monitor|KVM|Bluetooth|periferic/i, [
  K("Mâinile, ochii și gura calculatorului", "Tastatura și mouse-ul sunt urechile (intrare), monitorul și imprimanta sunt gura (ieșire).", "Video: VGA (analogic), DVI, HDMI și DisplayPort (digitale, cu audio la HDMI/DP). USB 2.0 = 480 Mbit/s; USB 3.0 (3.2 Gen 1) = 5 Gbit/s. Imprimanta laser: tambur fotosensibil → toner → <b>cuptor (fuser)</b> care fixează tonerul prin căldură. Dacă tonerul se șterge cu degetul → fuser defect."),
]);
L("pc", 3, "Diagnosticare defecte", "🔧", /defect|simptom|diagnostic|nu porne|ecran negru|supraîncălz|pastă|termic|condensator|umflat|zgomot|clic|ESD|electrostatic|brățar|depanare|artefact|reporni/i, [
  K("Detectivul de defecte", "Ca un doctor: întâi întrebi ce s-a întâmplat, apoi faci o ipoteză, verifici, repari și la final controlezi că pacientul e bine.", "Metodologie: 1) identifică problema; 2) stabilește o teorie a cauzei probabile; 3) testează teoria; 4) plan de acțiune și implementare; 5) verifică funcționarea completă; 6) documentează. Folosește <b>brățara antistatică (ESD)</b>. Simptome clasice: clicuri HDD → disc pe moarte; opriri bruște la sarcină → supraîncălzire/pastă termică; condensatori umflați → placă/sursă defectă."),
]);
L("pc", 3, "Sisteme de numerație", "🔢", /binar|hexa|zecimal|bit|octet|byte|KB|MB|GB|bază/i, [
  K("Numărăm cu becuri", "În binar avem doar becuri aprinse (1) sau stinse (0). Fiecare bec spre stânga valorează dublu: 1, 2, 4, 8, 16, 32, 64, 128.", "Exemplu: 11000000 = 128 + 64 = <b>192</b>. Hexazecimal: cifre 0–9 și A–F (A=10 … F=15); un caracter hex = 4 biți. Exemplu: C0 = 12×16 + 0 = 192. 1 octet (byte) = 8 biți."),
]);

/* ===== WINDOWS ===== */
L("win", 1, "Instalarea Windows", "💿", /instal|upgrade|clean|cerin|NTFS|FAT32|exFAT|partiț|sysprep|unattend|licen|activ|edi[țt]i|Home|Pro|32|64.?bi|XP|Windows 7|8\.1|Windows 10/i, [
  K("Mutarea într-o casă nouă", "Instalare curată = te muți într-o casă goală și aduci doar ce vrei. Upgrade = rămâi în aceeași casă și schimbi mobila, cu tot ce e prin sertare.", "Clean install șterge tot; upgrade păstrează fișiere, setări și aplicații (unde calea de upgrade este permisă – XP nu face upgrade direct la 7). Sistem de fișiere recomandat: <b>NTFS</b> (permisiuni, criptare, fișiere &gt; 4 GB; FAT32 nu acceptă fișiere peste 4 GB). Un sistem pe 32 de biți vede maxim ~4 GB RAM. Sysprep pregătește o imagine pentru clonare."),
]);
L("win", 1, "Instrumente de administrare", "🧰", /\.msc|\.cpl|msconfig|regedit|Task Manager|Gestionar|Event Viewer|eveniment|Device Manager|Disk Management|services|serviciu|msinfo|resmon|winver|dxdiag|Control Panel|Panou/i, [
  K("Cutia cu scule a lui Windows", "Fiecare unealtă are un nume scurt pe care îl scrii în Run (Win+R), ca un cuvânt magic.", "<b>devmgmt.msc</b> – dispozitive și drivere; <b>diskmgmt.msc</b> – partiții; <b>eventvwr.msc</b> – jurnale; <b>services.msc</b> – servicii; <b>compmgmt.msc</b> – Computer Management; <b>lusrmgr.msc</b> – utilizatori locali; <b>gpedit.msc</b> – politici locale; <b>msconfig</b> – pornire; <b>regedit</b> – registry; <b>ncpa.cpl</b> – conexiuni de rețea; <b>appwiz.cpl</b> – programe."),
]);
L("win", 2, "Linia de comandă", "⌨️", /ipconfig|ping|tracert|nslookup|netstat|sfc|chkdsk|net use|net user|net share|robocopy|xcopy|shutdown|gpupdate|tasklist|taskkill|getmac|arp -a|route|pathping|attrib|icacls|DISM|powercfg|comand/i, [
  K("Vorbim direct cu calculatorul", "În loc să dai click prin meniuri, îi spui scurt ce să facă, ca unui soldat: „ipconfig, raportează adresa!”.", "<b>ipconfig /all</b> (configurație IP, MAC, DNS), <b>/release /renew</b> (DHCP), <b>/flushdns</b>; <b>ping</b>, <b>tracert</b>, <b>nslookup</b>; <b>netstat -an</b> (conexiuni și porturi); <b>sfc /scannow</b> (fișiere de sistem); <b>chkdsk /f</b> (disc); <b>net use Z: \\\\server\\share</b>; <b>gpupdate /force</b>; <b>robocopy</b> (copiere robustă)."),
]);
L("win", 2, "Utilizatori, permisiuni, partajare", "🔐", /permisiun|NTFS|share|partaj|Full Control|Modify|Read|Deny|Allow|cont|Administrator|Guest|UAC|grup de lucru|workgroup|domeniu|domain|Active Directory|C\$|UNC|BitLocker|EFS|moșten/i, [
  K("Cheile casei", "Permisiunea de share e cheia de la poarta curții, permisiunea NTFS e cheia de la fiecare cameră. Intri doar dacă ai ambele chei, și primește cuvântul cea mai strictă.", "Când accesezi prin rețea se combină share + NTFS și se aplică <b>cea mai restrictivă</b>. <b>Deny</b> are prioritate față de Allow. Workgroup = calculatoare egale, conturi locale; <b>domeniu</b> = administrare centralizată (Active Directory, controler de domeniu). Partajările administrative ascunse: C$, ADMIN$. UAC cere confirmare pentru acțiuni administrative."),
]);
L("win", 3, "Backup și recuperare", "💾", /backup|copi[ae] de rezerv|increment|diferen|complet|full|System Restore|restaurare|punct de restaur|File History|imagine|Safe Mode|mod sigur|F8|bootrec|BCD|recuper|Last Known|3-2-1|wbadmin|NTBackup|Previous Versions|Reset/i, [
  K("Copii de rezervă ca fotografii", "Backup complet = poza întregii camere. Incremental = poza doar cu ce s-a schimbat de la ULTIMA poză. Diferențial = poza cu tot ce s-a schimbat de la ultima poză COMPLETĂ.", "Restaurare: <b>complet + diferențialul cel mai recent</b> (2 seturi) sau <b>complet + toate incrementalele</b> în ordine. Regula <b>3-2-1</b>: 3 copii, 2 medii diferite, 1 în altă locație. System Restore revine la setările de sistem (nu salvează documentele). Safe Mode pornește cu drivere minime; <b>bootrec /fixmbr /fixboot /rebuildbcd</b> repară pornirea."),
]);
L("win", 3, "Servicii de rețea în Windows", "🌐", /DHCP|DNS|RDP|3389|Remote Desktop|Remote Assistance|firewall|VPN|SMB|445|hosts|profil de rețea|Public|Privat|ICS|Wi-?Fi|netsh|mstsc|proxy|APIPA|169\.254/i, [
  K("Windows în rețea", "Fiecare calculator are nevoie de o adresă (IP), de cineva care să-i traducă numele în adrese (DNS) și de o poartă spre lume (gateway).", "Adresă <b>169.254.x.x</b> (APIPA) = nu a răspuns serverul DHCP. Remote Desktop (<b>mstsc</b>, TCP <b>3389</b>) – serverul RDP doar pe ediții Pro/Enterprise. Partajare de fișiere: <b>SMB</b> (TCP 445). Profilul de rețea <b>Public</b> este cel mai restrictiv în Firewall. Fișierul hosts: C:\\Windows\\System32\\drivers\\etc\\hosts."),
]);

/* ===== REȚELE (CCNA 1 / ITN) ===== */
L("net", 1, "Ce este o rețea", "🕸️", /LAN|WAN|MAN|topologi|stea|magistral|inel|mesh|client|server|peer|P2P|intranet|extranet|Internet|toleran|scalab|QoS|convergent|end device|intermediar/i, [
  K("Drumurile datelor", "O rețea e ca un oraș: casele sunt calculatoarele, străzile sunt cablurile, intersecțiile cu semafor sunt switch-urile, iar vama dintre orașe este routerul.", "<b>LAN</b> = rețea locală (clădire); <b>WAN</b> = rețea extinsă (orașe/țări); dispozitive finale (PC, telefon, server) și intermediare (switch, router, AP, firewall). Arhitectura <b>client-server</b>: serverul oferă servicii, clientul le cere. Rețea fiabilă: toleranță la defecte, scalabilitate, QoS, securitate.", SVG.star()),
]);
L("net", 1, "Tipuri de rețele: PAN, LAN, MAN, WAN…", "🗺️", /PAN|LAN|WLAN|CAN|MAN|WAN|VAN|SAN|VPN|metropolitan|campus|personal|extins|stocare|valoare adăugată/i, [
  K("De la buzunar la planetă", "Căștile Bluetooth legate de telefon = o rețea de buzunar (PAN). Calculatoarele din birou = rețeaua casei (LAN). Mai multe clădiri dintr-o unitate = campusul (CAN). Tot orașul = MAN. Țara și lumea întreagă = WAN.", "<b>PAN</b> (Personal Area Network) – câțiva metri, Bluetooth/USB. <b>LAN</b> (Local Area Network) – o clădire, Ethernet; <b>WLAN</b> = LAN fără fir (Wi-Fi). <b>CAN</b> (Campus Area Network) – mai multe clădiri apropiate. <b>MAN</b> (Metropolitan Area Network) – un oraș, de obicei pe fibră. <b>WAN</b> (Wide Area Network) – orașe, țări (Internetul este cel mai mare WAN).", SVG.nettypes()),
  K("Rețele „speciale”", "Unele rețele nu se numesc după mărime, ci după ce fac.", "<b>SAN</b> (Storage Area Network) – rețea dedicată, foarte rapidă, între servere și sistemele de stocare (discuri). <b>VPN</b> (Virtual Private Network) – un „tunel” criptat prin Internet care leagă în siguranță un utilizator sau o sucursală de rețeaua instituției. <b>VAN</b> (Value-Added Network) – rețea privată oferită de un furnizor, cu servicii adăugate (ex. schimb securizat de documente electronice între firme). Intranet = rețea internă; extranet = acces controlat pentru parteneri externi."),
]);
L("net", 1, "Topologii de rețea", "🔷", /topologi|magistral|bus|stea|star|inel|ring|plas[ăa]|mesh|arbore|tree|hibrid|redundan|punct central/i, [
  K("Cum sunt legate între ele", "Topologia e „harta” legăturilor. Ca la drumuri: o singură stradă lungă (magistrală), un sens giratoriu (inel), o piață din care pleacă străzi spre fiecare casă (stea), sau drumuri de la fiecare oraș la fiecare oraș (plasă).", "<b>Magistrală (bus)</b>: un singur cablu comun (coaxial, 10BASE2); o ruptură oprește tot. <b>Stea</b>: fiecare echipament are cablul lui până la switch – cea mai folosită azi; dacă pică switch-ul, pică tot. <b>Inel</b>: fiecare nod e legat de doi vecini (Token Ring, inele SDH pe fibră). <b>Plasă (mesh)</b>: legături multiple – foarte redundantă; plasă completă cu n noduri are n(n−1)/2 legături. <b>Arbore</b>: stele legate ierarhic. <b>Hibridă</b>: combinație.", SVG.topo()),
]);
L("net", 1, "Modelul OSI și TCP/IP", "🧱", /OSI|strat|nivel|layer|PDU|încapsul|decapsul|TCP\/IP|segment|pachet|cadru|frame|bi[țt]i|aplicați|prezentare|sesiune/i, [
  K("Scrisoarea în plicuri", "Când trimiți o scrisoare: o scrii (aplicație), o pui în plic cu numele destinatarului (transport), apoi poșta pune adresa orașului (rețea), iar curierul o duce pe stradă (legătură de date și fizic). La destinație plicurile se deschid în ordine inversă.", "7 Aplicație · 6 Prezentare · 5 Sesiune · 4 Transport (<b>segment</b>) · 3 Rețea (<b>pachet</b>, IP, router) · 2 Legătură de date (<b>cadru</b>, MAC, switch) · 1 Fizic (<b>biți</b>). Truc: „<i>All People Seem To Need Data Processing</i>” (7→1).", SVG.osi()),
  K("Încapsularea", "Fiecare strat pune datele într-un plic nou, cu propria etichetă.", "Date → segment (antet TCP/UDP cu porturi) → pachet (antet IP cu adrese IP) → cadru (antet MAC + FCS la final) → biți.", SVG.encap()),
]);
L("net", 1, "Ethernet, MAC și switch-ul", "🔀", /MAC|Ethernet|switch|comutator|tabel[ăa] MAC|flood|inund|OUI|48|FF-FF|FCS|CRC|domeni(ul|u) de coliziune|CSMA\/CD|full.duplex|half|cut-through|store-and-forward|hub|MTU|1518|1500|EtherType/i, [
  K("Poștașul care învață adresele", "Switch-ul e un poștaș nou în cartier: la început strigă la toate ușile, dar notează cine a răspuns. Data viitoare duce scrisoarea direct la ușa corectă.", "Adresa MAC are <b>48 de biți</b> (primii 24 = OUI, producătorul). Switch-ul <b>învață MAC-ul sursă</b> pe portul de intrare și trimite după MAC-ul destinație; destinație necunoscută sau broadcast (FF-FF-FF-FF-FF-FF) → <b>inundă</b> (flood) pe toate porturile din VLAN, mai puțin cel de intrare. Fiecare port de switch = un domeniu de coliziune. Cadru Ethernet: 64–1518 octeți (MTU 1500)."),
]);
L("net", 2, "Adresarea IPv4", "🏷️", /IPv4|clas[ăa]|privat|1918|10\.0\.0|172\.16|192\.168|loopback|127\.|masc|prefix|gateway|poart|unicast|broadcast|multicast|APIPA|169\.254|NAT|public/i, [
  K("Adresa ca număr de casă", "O adresă IP e ca „Strada Lalelelor nr. 7”: o parte spune strada (rețeaua), cealaltă spune casa (host-ul). Masca îți spune unde se termină numele străzii.", "IPv4 = <b>32 de biți</b>, 4 octeți. Private (RFC 1918): <b>10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</b>. Loopback 127.0.0.1. APIPA 169.254.0.0/16. Gateway-ul implicit = routerul local, pentru destinații din alte rețele. NAT/PAT traduce adresele private într-o adresă publică."),
]);
L("net", 2, "ARP, DHCP și DNS", "📇", /ARP|DHCP|DORA|Discover|Offer|Request|Acknowledg|67|68|helper|relay|rezervar|lease|DNS|53|nslookup|record|înregistr|\bA\b|AAAA|MX|CNAME|PTR|FQDN|rezolv/i, [
  K("Trei ajutoare", "<b>DNS</b> e agenda telefonică (nume → număr IP). <b>ARP</b> e întrebarea strigată în cameră: „Cine are IP-ul 192.168.1.1? Spune-mi MAC-ul tău!”. <b>DHCP</b> e recepția hotelului care îți dă cheia camerei (adresa IP) la sosire.", "ARP: request = broadcast, reply = unicast; tabel ARP (<b>arp -a</b>). DHCP: <b>D</b>iscover → <b>O</b>ffer → <b>R</b>equest → <b>A</b>ck (UDP 67 server / 68 client); în altă rețea → <b>ip helper-address</b>. DNS: port <b>53</b>; înregistrări A (IPv4), AAAA (IPv6), MX (mail), CNAME (alias), PTR (invers), NS."),
]);
L("net", 2, "TCP, UDP și porturi", "🚚", /TCP|UDP|port|socket|handshake|SYN|ACK|FIN|fereastr|window|secvenț|retransmi|fiabil|orientat|HTTP|HTTPS|FTP|SSH|Telnet|SMTP|POP3|IMAP|SNMP|TFTP|NTP|Syslog|80|443|22|23|25|110|143|161|69|123/i, [
  K("Recomandată sau carte poștală", "TCP e scrisoarea recomandată: ți se confirmă primirea și, dacă se pierde, se retrimite. UDP e cartea poștală: pleacă repede, fără confirmare – perfectă pentru voce și video, unde mai bine pierzi un fragment decât să aștepți.", "TCP: orientat pe conexiune (<b>three-way handshake</b> SYN, SYN-ACK, ACK), numere de secvență, confirmări, control al fluxului (fereastră). UDP: fără conexiune, overhead mic (DNS, DHCP, TFTP, VoIP).", SVG.handshake()),
  K("Porturile – ușile serviciilor", "Adresa IP îți spune clădirea, portul îți spune biroul.", "FTP 20/21 · <b>SSH 22</b> · Telnet 23 · SMTP 25 · DNS 53 · DHCP 67/68 · TFTP 69 · HTTP 80 · POP3 110 · NTP 123 · IMAP 143 · SNMP 161 · <b>HTTPS 443</b> · SMB 445 · RDP 3389. Porturi bine-cunoscute 0–1023, înregistrate 1024–49151, dinamice 49152–65535."),
]);
L("net", 2, "NAT – traducerea adreselor", "🔄", /NAT|PAT|overload|translat|traducer|IP public|IP-ul public|adres[ăa] public|inside|outside|port forwarding|redirecționare de port|IPv4.*epuiz|epuiz/i, [
  K("Centrala telefonică a firmei", "Într-o firmă, fiecare angajat are un interior (101, 102, 103), dar spre exterior toți sună de pe <b>același număr</b> al firmei. Centrala ține minte cine a sunat pe cine, ca să trimită răspunsul la interiorul potrivit. Routerul de acasă face exact asta cu adresele IP: e <b>NAT</b>.", "<b>NAT</b> (Network Address Translation – traducerea adreselor de rețea) = routerul <b>înlocuiește adresa IP privată</b> a unui dispozitiv din rețeaua internă cu o <b>adresă IP publică</b> când pachetul iese spre Internet, și face invers la răspuns. Se configurează de obicei pe routerul de margine (cel care leagă rețeaua de Internet).", SVG.nat()),
  K("IP privat vs. IP public – și de ce există NAT", "IP-ul privat e ca numărul de apartament: e unic în bloc, dar există în mii de blocuri. IP-ul public e adresa blocului pe stradă: unică în tot orașul.", "<b>IP-uri private</b> (RFC 1918, nu circulă pe Internet): <b>10.0.0.0/8</b>, <b>172.16.0.0/12</b> (172.16–172.31), <b>192.168.0.0/16</b>. <b>IP public</b> = unic pe Internet, dat de furnizor. NAT există pentru că: ① adresele <b>IPv4 publice s-au epuizat</b> (doar ~4,3 miliarde) – o casă/firmă întreagă iese pe un singur IP; ② <b>ascunde</b> structura rețelei interne (din exterior nu se văd adresele interne)."),
  K("Static, dinamic și PAT (overload)", "<b>Static</b> = un angajat are mereu propriul număr direct. <b>Dinamic</b> = firma are câteva numere și le împarte cui sună primul. <b>PAT</b> = toți folosesc același număr, iar centrala îi deosebește după „interior” (port).", "<b>NAT static</b>: o adresă privată ↔ o adresă publică, fix (1:1) – pentru servere care trebuie accesate din Internet. <b>NAT dinamic</b>: adrese private ↔ un <b>grup (pool)</b> de adrese publice, alocate pe rând (dacă se termină pool-ul, ceilalți așteaptă). <b>PAT</b> (Port Address Translation) = <b>NAT overload</b>: <b>mulți → un singur IP public</b>, conexiunile deosebite prin <b>numărul de port</b>; este ce face routerul de acasă. Pe Cisco: <code>ip nat inside source list 1 interface g0/1 overload</code>; interfețele se marchează <code>ip nat inside</code>/<code>ip nat outside</code>. <b>Port forwarding</b> = NAT static pe un port (ex. TCP 443 → serverul intern).", EX("ce înseamnă NAT, cele 3 clase private, diferența static/dinamic/PAT, „overload” = PAT.")),
]);
L("net", 2, "Configurare de bază Cisco IOS", "💻", /IOS|enable|configure terminal|hostname|secret|password|service password|line vty|line con|banner|copy run|startup|running|NVRAM|show |no shutdown|interface vlan|SVI|default-gateway|ip address|ssh|crypto|domain|exec-timeout|logging|Ctrl/i, [
  K("Modurile ca niște uși", "Intri în clădire (modul utilizator, &gt;), primești cheia de birou (enable, #), apoi intri în camera de control (configure terminal, (config)#).", "<pre>enable\nconfigure terminal\nhostname SW1\nenable secret Cl@sa1\nline console 0\n password cisco\n login\nline vty 0 15\n transport input ssh\n login local\nservice password-encryption\nbanner motd #Acces autorizat!#\ninterface vlan 1\n ip address 192.168.1.2 255.255.255.0\n no shutdown\nip default-gateway 192.168.1.1\nend\ncopy running-config startup-config</pre>Running-config = în RAM (se pierde la repornire); startup-config = în <b>NVRAM</b>."),
]);
L("net", 3, "Routere și rutare", "🧭", /rout|rut[ăa]|tabel[ăa] de rutare|static|dinamic|OSPF|EIGRP|RIP|BGP|distanț[ăa] administrativ|metric|default route|0\.0\.0\.0|longest|prefix|hop|TTL|gateway of last/i, [
  K("GPS-ul pachetelor", "Routerul se uită la adresa destinație și, ca un GPS, alege cel mai bun drum din harta lui (tabela de rutare). Dacă nu știe drumul, trimite spre „drumul implicit”.", "Routerul lucrează la nivelul 3 și separă domeniile de broadcast. Alege ruta cu <b>cea mai lungă potrivire de prefix</b>; la egalitate de prefix între surse diferite – <b>distanța administrativă</b> cea mai mică (conectat 0, static 1, EIGRP 90, OSPF 110, RIP 120). Ruta implicită: <b>ip route 0.0.0.0 0.0.0.0 next-hop</b>."),
]);
L("net", 3, "VLAN, trunk și STP", "🎨", /VLAN|802\.1Q|trunk|access|nativ|tag|etichet|router-on-a-stick|subinterf|inter-VLAN|STP|spanning|bucl|root|BPDU|PortFast|VTP|EtherChannel|LACP/i, [
  K("Pereți invizibili în switch", "Un VLAN e ca un perete de sticlă pus în mijlocul unei săli: oamenii din stânga nu-i mai aud pe cei din dreapta, deși sunt în aceeași sală. Ca să vorbească între ei, trebuie să treacă pe la recepție (routerul).", "VLAN = domeniu de broadcast separat. Port <b>access</b> = un singur VLAN; port <b>trunk</b> = mai multe VLAN-uri etichetate <b>802.1Q</b> (VLAN nativ – neetichetat, implicit 1). Între VLAN-uri: router-on-a-stick (subinterfețe cu <b>encapsulation dot1q</b>) sau switch L3. <b>STP</b> (802.1D) blochează buclele de nivel 2.", SVG.vlan()),
]);
L("net", 3, "IPv6", "🔢", /IPv6|::|FE80|link-local|FF0|2000::|global unicast|SLAAC|EUI-64|NDP|Neighbor|Router Solicitation|Advertisement|ICMPv6|DAD|dual.?stack|tunel|NAT64|128 de bi|hextet|anycast|FC00|FD00/i, [
  K("Adrese pentru fiecare fir de nisip", "IPv4 are cam 4 miliarde de adrese – prea puține. IPv6 are atât de multe încât ai putea da o adresă fiecărui fir de nisip de pe Pământ.", "<b>128 de biți</b>, 8 grupuri hexa de 16 biți. Abreviere: se omit zerourile din față în fiecare grup și <b>o singură dată</b> „::” pentru grupuri consecutive de zero. Tipuri: global unicast 2000::/3; <b>link-local FE80::/10</b> (obligatoriu pe fiecare interfață); unique local FC00::/7; multicast FF00::/8; loopback ::1. <b>Nu există broadcast</b>. SLAAC folosește RS/RA (ICMPv6), EUI-64 extinde MAC-ul cu FFFE."),
]);
L("net", 3, "Wireless și securitate", "📶", /wireless|Wi-?Fi|802\.11|SSID|WPA|WEP|AES|TKIP|2[,.]4 ?GHz|5 ?GHz|canal|AP\b|access point|CSMA\/CA|WPS|802\.1X|RADIUS|EAP|evil twin|firewall|ACL|DMZ|IDS|IPS|VPN|IPsec|SSL|TLS|atac|malware|vierme|virus|phishing|DoS|DDoS|spoof|port.security|AAA/i, [
  K("Lacăte pentru rețea", "Wi-Fi-ul e ca o conversație într-o piață: oricine aude. Criptarea e ca vorbitul într-o limbă secretă; firewall-ul e paznicul de la poartă cu lista de invitați; VPN-ul e un tunel blindat prin oraș.", "Wi-Fi: 2,4 GHz (canale nesuprapuse 1, 6, 11) și 5 GHz; CSMA/<b>CA</b>. Securitate: <b>WPA2/WPA3 cu AES</b> (WEP și WPS sunt nesigure); Enterprise = 802.1X cu server RADIUS. Firewall stateful, ACL (implicit <b>deny any</b> la final), DMZ pentru serverele publice. VPN: site-to-site sau remote-access, IPsec (ESP criptează) sau SSL/TLS."),
]);

/* ===== SUBNETTING ===== */
L("sub", 1, "Binarul pentru IP și masca", "🧮", /binar|mască|masc|octet|255\.|\/\d\d|biți|contigu/i, [
  K("Adresa IP ca o adresă poștală", "O adresă poștală are <b>strada</b> și <b>numărul casei</b>. La IP e la fel: o parte este „strada” (rețeaua) și o parte este „numărul casei” (host-ul, adică echipamentul). <b>Masca</b> îți spune unde se termină numele străzii și unde începe numărul.", "Exemplu: <b>192.168.1.25/24</b> – masca 255.255.255.0 (24 de biți de 1). Primii 3 octeți (192.168.1) = rețeaua (strada), ultimul (25) = host-ul (casa). Pe strada 192.168.1 sunt 256 de adrese: .0 = adresa rețelei, .255 = broadcast (strigă la toți), iar .1–.254 = <b>254 de case</b> pentru calculatoare. Două PC-uri vorbesc direct doar dacă sunt pe aceeași „stradă”; altfel trec prin router (poștașul dintre străzi)."),
  K("Becurile din fiecare octet", "Fiecare octet are 8 becuri cu valorile 128, 64, 32, 16, 8, 4, 2, 1. Aprinzi becurile și aduni valorile.", "Masca are biții de 1 <b>la stânga, consecutivi</b>. Prefixul /n = câți biți de 1 are masca. Valorile posibile ale unui octet de mască: 0, 128, 192, 224, 240, 248, 252, 254, 255.", '<table class="tb"><tr><th>/</th><th>ultimul octet</th><th>bloc</th><th>host-uri</th></tr><tr><td>/24</td><td>0</td><td>256</td><td>254</td></tr><tr><td>/25</td><td>128</td><td>128</td><td>126</td></tr><tr><td>/26</td><td>192</td><td>64</td><td>62</td></tr><tr><td>/27</td><td>224</td><td>32</td><td>30</td></tr><tr><td>/28</td><td>240</td><td>16</td><td>14</td></tr><tr><td>/29</td><td>248</td><td>8</td><td>6</td></tr><tr><td>/30</td><td>252</td><td>4</td><td>2</td></tr></table>'),
]);
L("sub", 1, "Rețea, broadcast și host-uri", "🎯", /adres[ăa] de rețea|broadcast|host|utilizabil|prim|ultim|câte|2\^|aceeași subrețea/i, [
  K("Rândul de case", "Subrețeaua e un rând de case: prima casă e „biroul străzii” (adresa de rețea), ultima e „difuzorul” care strigă la toți (broadcast). Oamenii locuiesc doar în casele dintre ele.", "Host-uri utilizabile = <b>2<sup>h</sup> − 2</b>, unde h = 32 − prefix. Pas (bloc) = <b>256 − octetul interesant al măștii</b>. Adresa de rețea = cel mai mare multiplu al pasului ≤ octetul adresei; broadcast = rețea + pas − 1.", SVG.subnet()),
  K("Tăiem strada în 4: /26", "Dacă strada e prea lungă, o împărțim în 4 străzi mai mici, fiecare cu primul număr pentru „plăcuța străzii” și ultimul pentru „difuzor”.", "192.168.1.0/24 → <b>/26</b> (împrumutăm 2 biți de la host): <b>2<sup>n</sup> = 2² = 4 subrețele</b>, fiecare cu 2<sup>h</sup> − 2 = 2⁶ − 2 = <b>62 de host-uri</b>. Subrețelele încep la <b>.0, .64, .128, .192</b> (pas 64). Formule: <b>subrețele = 2<sup>n</sup></b> (n = biți împrumutați), <b>host-uri = 2<sup>h</sup> − 2</b> (h = biți rămași pentru host; scădem adresa de rețea și broadcast-ul)."),
  K("Exemplu rezolvat", "Hai să o facem pas cu pas, ca la matematică.", "<b>192.168.1.130/26</b>: masca 255.255.255.192 → pas 256−192 = 64 → blocuri .0, .64, <b>.128</b>, .192 → 130 e în blocul .128. Rețea <b>.128</b>, primul host .129, ultimul host .190, broadcast <b>.191</b>, 62 de host-uri."),
], { gen: "subnet" });
L("sub", 2, "Împărțirea în subrețele", "✂️", /subrețele|împ[aă]r|împrumut|pas|al treilea octet|\/1\d|\/2[0-3]|172\.16|10\.\d/i, [
  K("Tăiem pizza", "Ai o pizza (rețeaua /24). Dacă împrumuți 1 bit, o tai în 2; 2 biți – în 4; 3 biți – în 8. Felii mai multe = felii mai mici.", "Subrețele = <b>2<sup>n</sup></b> (n = biți împrumutați); host-uri pe subrețea = 2<sup>h</sup> − 2. Când octetul interesant e al treilea (ex. /20), pasul se aplică acolo: 172.16.0.0/20 → 172.16.0.0, 172.16.16.0, 172.16.32.0 …"),
], { gen: "subnet" });
L("sub", 3, "VLSM, sumarizare, wildcard", "🧩", /VLSM|sumariz|wildcard|\/30|\/31|\/32|punct-la-punct|P2P|agreg/i, [
  K("Haine pe măsură", "Nu dai aceeași mărime de tricou tuturor: copilului mic, unul mic; uriașului, unul mare. VLSM dă fiecărei rețele exact câte adrese îi trebuie.", "Pași VLSM: sortezi cerințele <b>descrescător</b>, alegi cel mai mic bloc care încape (2<sup>h</sup>−2 ≥ cerința), aloci de la prima adresă liberă. Legături între routere: <b>/30</b> (sau /31). Sumarizare: găsești biții comuni (ex. 10.1.4.0–10.1.7.0 → 10.1.4.0/22). Wildcard = 255.255.255.255 − mască."),
], { gen: "subnet" });

/* ===== CABLURI TELEFONICE ===== */
L("tel", 1, "Cabluri telefonice din cupru", "☎️", /cupru|telefon|pereche|quad|cuart|TSY|TCYY|izola|perechi|diametr|0[,.][456]|distribuți|repartitor|MDF|abonat|bucl|pupiniz|ecran|armat|umplut|petrolat/i, [
  K("Firele vechi care încă vorbesc", "Cablul telefonic e un mănunchi de perechi de fire răsucite, ca niște spaghete legate două câte două. Fiecare pereche duce o convorbire.", "Clasificare: cabluri de abonat/distribuție, de joncțiune, interurbane; de interior/exterior; aeriene, subterane, în canalizație; cu sau fără ecran/armătură, umplute cu gel (petrolatum) contra apei. Conductoare de cupru cu diametre uzuale 0,4–0,9 mm; diametru mai mare = rezistență și atenuare mai mici. Elemente: perechi sau cuarte (4 fire). Terminare în repartitorul principal (MDF)."),
]);
L("tel", 2, "Parametrii liniilor", "📏", /rezisten|capacit|inductan|atenua|diafoni|impedan|frecvenț|bucl[ăa]|kHz|izolați|parametr|primar|secundar/i, [
  K("Ce strică semnalul pe drum", "Cu cât firul e mai lung și mai subțire, cu atât vocea ajunge mai slabă; iar firele vecine „șoptesc” între ele (diafonie).", "Parametri primari: rezistența R, inductanța L, capacitatea C, conductanța G (pe km). Secundari: impedanța caracteristică și constanta de propagare (atenuare + fază). Atenuarea crește cu frecvența și lungimea. Diafonia (NEXT/FEXT) – cuplaj nedorit între perechi."),
]);
L("tel", 3, "Cabluri optice de telecomunicații", "🧶", /optic|fibr|tub|loose|tight|ribbon|ADSS|OPGW|armat|rozătoare|gel|cod de culori|TIA-598|număr de fibre|canalizați/i, [
  K("Cablul optic pe dinăuntru", "Fibrele stau ca niște spaghete într-un tub cu gel care le ferește de apă și de întinderi, iar în mijloc e o „coloană vertebrală” rezistentă.", "Construcții: <b>loose tube</b> (fibre libere în tuburi cu gel – exterior), <b>tight buffer</b> (900 µm – interior), ribbon (panglici, densitate mare). Element central de rezistență, fire de aramidă (Kevlar), manta PE (exterior) sau LSZH (interior), armătură metalică contra rozătoarelor. Cod de culori TIA-598: albastru, portocaliu, verde, maro, gri, alb, roșu, negru, galben, violet, roz, aqua."),
]);

/* ===== MĂSURĂTORI ===== */
L("mas", 1, "Decibelul pe înțeles", "🔊", /\bdB\b|decibel|logaritm|raport|câștig|amplific|atenua|3 dB|10 dB|×2|dublu|jumătat/i, [
  K("Rigla care strânge numerele", "Urechea noastră nu simte diferențele în „ori”, ci în pași. Decibelul transformă înmulțirile în adunări: în loc de „×2 ×10 ×1000”, spui „+3 +10 +30”.", "Raport de puteri: <b>dB = 10·log(P2/P1)</b>. Raport de tensiuni (pe aceeași impedanță): <b>dB = 20·log(U2/U1)</b>. +3 dB ≈ ×2 putere; +10 dB = ×10; −3 dB = jumătate. Într-un lanț, câștigurile și pierderile în dB <b>se adună</b>."),
]);
L("mas", 2, "dBm, dBW, Neper și nivele", "📐", /dBm|dBW|dBu|dBV|Np|neper|nivel|0 dBm|1 mW|absolut|relativ|775|600 ?Ω/i, [
  K("dB-ul cu punct de plecare", "dB singur spune „de câte ori”. dBm spune „față de 1 miliwatt”, deci e o valoare concretă, ca temperatura în grade.", "<b>0 dBm = 1 mW</b>; 30 dBm = 1 W; 0 dBW = 1 W = 30 dBm. 0 dBu = 0,775 V (tensiunea care dă 1 mW pe 600 Ω). <b>1 Np = 8,686 dB</b> (neperul folosește logaritmul natural). Nivel absolut = față de o referință fixă; nivel relativ = față de un punct al sistemului.", SVG.db()),
]);
L("mas", 3, "Generatoare, indicatoare și aparate", "🎛️", /generator|indicator|nivelmetru|voltmetr|multimetr|osciloscop|analizor|spectru|BER|frecvențmetr|psofometr|zgomot|SNR|raport semnal|True RMS|atenuator|ochi|eye|reflectometr|calibr/i, [
  K("Gura și urechea măsurătorii", "Generatorul de nivel „vorbește” cu un semnal cunoscut, iar indicatorul (nivelmetrul) „ascultă” la celălalt capăt cât a ajuns.", "Generator de nivel – semnal de frecvență și nivel cunoscute (ex. 800 Hz/1020 Hz, 0 dBm). Indicator/nivelmetru – măsoară nivelul în dB/dBm. Analizor de spectru – nivelul în funcție de frecvență. Osciloscop – forma semnalului în timp. Tester BER – rata erorilor de bit. Psofometru – zgomot ponderat ca la ureche. SNR (dB) = nivel semnal − nivel zgomot."),
]);

/* ===== ELECTRICITATE ===== */
function EX(s) { return '<div class="exam"><b>🎯 Probabil la examen:</b> ' + s + "</div>"; }
L("el", 1, "Ce este electricitatea", "⚛️", /electron|atom|sarcin|conductor|izolator|coulomb|semiconductor|proton|neutron/i, [
  K("Totul e făcut din bucățele mici", "Orice lucru – masa, firul de cupru, tu – e făcut din <b>atomi</b>, niște bile foarte, foarte mici. În jurul fiecărui atom se învârt <b>electroni</b>, niște particule și mai mici, cu „sarcină” negativă (−). În metale, unii electroni sunt „liberi”: pot sări de la un atom la altul.", "<b>Curentul electric</b> = deplasarea ordonată a sarcinilor electrice (în metale: electronii liberi) printr-un material. Sarcina electrică se măsoară în <b>coulombi (C)</b>. Electronul are sarcină negativă, protonul pozitivă.", SVG.electrons()),
  K("Conductori și izolatori", "Unele materiale lasă electronii să treacă ușor, ca o autostradă liberă: sunt <b>conductori</b>. Altele îi țin pe loc, ca un zid: sunt <b>izolatori</b>. Cablurile au miezul din cupru (conductor) și învelișul din plastic (izolator), ca să nu te electrocutezi.", "<b>Conductori</b>: cupru, aluminiu, argint, aur, apa obișnuită (cu săruri), corpul omenesc. <b>Izolatori</b>: cauciuc, PVC, sticlă, porțelan, lemn uscat, aer uscat. <b>Semiconductori</b> (siliciu): între cele două – din ei se fac diodele și tranzistoarele.", EX("care material e conductor și care e izolator; ce este curentul electric.")),
]);
L("el", 1, "Circuitul electric", "🔁", /circuit|scurtcircuit|întrerupător|consumator|sursă de tensiune|born[ăe]|bucl/i, [
  K("Un drum închis, ca o pistă de curse", "Curentul circulă doar dacă are un <b>drum închis</b>: pleacă de la sursă (bateria), trece prin fir, prin bec, și se întoarce la sursă. Dacă tai drumul undeva (apeși întrerupătorul pe „stins”), curentul se oprește peste tot, ca o pistă cu un pod ridicat.", "Un <b>circuit</b> are: <b>sursă</b> (baterie, priză), <b>conductoare</b> (fire), <b>consumator</b> (bec, motor, PC) și de obicei un <b>întrerupător</b>. Circuit <b>închis</b> = trece curent; <b>deschis</b> (întrerupt) = nu trece curent.", SVG.circuit()),
  K("Scurtcircuitul – drumul „prea ușor”", "Dacă cele două fire de la sursă se ating direct, fără consumator între ele, curentul găsește un drum fără nicio frână și crește uriaș – firele se încing, sar scântei. Asta e un <b>scurtcircuit</b>.", "<b>Scurtcircuit</b> = legarea directă a bornelor sursei printr-o rezistență foarte mică → curent foarte mare → încălzire, incendiu. Protecție: <b>siguranța fuzibilă</b> sau <b>disjunctorul</b> (întrerup automat circuitul).", EX("circuit închis/deschis, ce este scurtcircuitul și ce protejează împotriva lui.")),
]);
L("el", 1, "Siguranța electrică – reguli de aur", "⛑️", /siguranț|electrocut|șoc|accident|RCD|diferențial|30 ?mA|ud[ăe]?\b|sub tensiune|lipsa tensiunii|absenț|reguli|disjunctor|mănuș|prim ajutor|primul ajutor|victim|pericul|letal|periculos/i, [
  K("Electricitatea nu se vede, nu se aude, nu miroase", "Un fir „viu” arată exact ca unul oprit. De aceea nu ghicim niciodată – <b>verificăm</b>. Curentul care trece prin corp poate opri inima chiar la valori mici: <b>30 mA</b> (trei sutimi de amper) pot fi deja periculoși.", "Pericolul vine de la <b>curentul prin corp</b>: ~1 mA se simte, ~10 mA nu mai poți da drumul firului (crispare), <b>~30 mA</b> și peste pot provoca fibrilație (oprirea inimii). Pielea udă scade mult rezistența corpului → curent mai mare. De aceea <b>RCD-ul (protecția diferențială) de 30 mA</b> protejează oamenii.", EX("valoarea de 30 mA a protecției diferențiale (RCD).")),
  K("Ce NU faci niciodată", "Gândește-te la priză ca la un câine care mușcă: nu-l atingi până nu ești sigur că e legat.", "❌ Nu atingi <b>faza</b> sau un conductor neizolat. ❌ Nu lucrezi <b>sub tensiune</b> – întâi oprești. ❌ Nu lucrezi cu <b>mâinile ude</b> sau stând în apă. ❌ Nu bagi multimetrul pe funcția <b>A (curent)</b> în priză – e scurtcircuit. ❌ Nu măsori rezistența (Ω) pe un circuit alimentat. ❌ Nu ocolești sau „întărești” siguranțele (sârmă în loc de fuzibil). ❌ Nu folosești scule sau cabluri cu izolația deteriorată."),
  K("Cele 5 reguli înainte de a lucra la o instalație", "Ca la un pilot înainte de decolare: urmezi lista, pas cu pas, de fiecare dată.", "1. <b>Deconectează</b> (oprește siguranța/disjunctorul). 2. <b>Asigură împotriva reconectării</b> (lacăt, etichetă „Nu porniți! Se lucrează”). 3. <b>Verifică lipsa tensiunii</b> cu un aparat verificat înainte și după (creion/detector, multimetru). 4. <b>Leagă la pământ și scurtcircuitează</b> (la instalații mari). 5. <b>Îngrădește/acoperă</b> părțile vecine aflate sub tensiune. Accident: <b>întâi întrerupi curentul</b> (sau îndepărtezi victima cu un obiect izolant uscat), abia apoi o atingi; suni la <b>112</b>.", EX("ordinea: deconectare → asigurare → verificarea lipsei tensiunii; ce faci întâi la un electrocutat.")),
]);
L("el", 1, "Tensiune, curent, rezistență", "💧", /tensiun|curent|rezisten|volt|amper|ohm\b|Ω|debit|presiun/i, [
  K("Electricitatea ca apa", "Gândește-te la o instalație de apă. <b>Tensiunea (U)</b> e presiunea care împinge apa. <b>Curentul (I)</b> e cât de multă apă curge pe secundă. <b>Rezistența (R)</b> e cât de îngustă e țeava: cu cât e mai îngustă, cu atât curge mai puțină apă.", "<b>Tensiunea</b> U se măsoară în <b>volți (V)</b> – „împingerea”. <b>Curentul</b> I se măsoară în <b>amperi (A)</b> – „cât curge”. <b>Rezistența</b> R se măsoară în <b>ohmi (Ω)</b> – „frâna”. Fără tensiune nu există curent; tensiunea poate exista și fără curent (bateria pe masă, priza fără nimic în ea).", SVG.water()),
  K("Exemple din viața de zi cu zi", "O baterie AA „împinge” cu 1,5 V, o baterie de mașină cu 12 V, priza cu 230 V. Un încărcător de telefon trage cam 1–2 A, un fierbător cam 9 A.", "Valori de reținut: baterie AA <b>1,5 V</b>; acumulator auto <b>12 V</b>; USB <b>5 V</b>; priza <b>230 V</b> AC; PoE ~<b>48 V</b> DC. Rezistența firelor bune e foarte mică (sub 1 Ω); a izolatorilor e uriașă (MΩ).", EX("unitățile: U în volți, I în amperi, R în ohmi.")),
]);
L("el", 1, "Unități de măsură și prefixe", "📐", /prefix|mili|micro|kilo|mega|giga|µ|\bmA\b|kΩ|MΩ|kV|mV|unitat|SI\b|transform[aă] .*în|câți|exprimat/i, [
  K("Prefixele sunt doar „scurtături” pentru zerouri", "Ca la bani: 1 leu = 100 de bani. La electricitate, în loc să scrii 0,001 A scrii 1 mA, iar în loc de 1000 Ω scrii 1 kΩ.", '<b>k</b> (kilo) = ×1 000; <b>M</b> (mega) = ×1 000 000; <b>G</b> (giga) = ×1 000 000 000. <b>m</b> (mili) = ÷1 000; <b>µ</b> (micro) = ÷1 000 000; <b>n</b> (nano) = ÷1 000 000 000.', '<table class="tb"><tr><th>Mărime</th><th>Simbol</th><th>Unitate</th></tr><tr><td>Tensiune</td><td>U</td><td>volt (V)</td></tr><tr><td>Curent</td><td>I</td><td>amper (A)</td></tr><tr><td>Rezistență</td><td>R</td><td>ohm (Ω)</td></tr><tr><td>Putere</td><td>P</td><td>watt (W)</td></tr><tr><td>Energie</td><td>W</td><td>joule (J), kWh</td></tr><tr><td>Frecvență</td><td>f</td><td>hertz (Hz)</td></tr><tr><td>Sarcină</td><td>Q</td><td>coulomb (C)</td></tr></table>'),
  K("Conversii pas cu pas", "Mergi „în jos” (de la A la mA)? Înmulțești cu 1000. Mergi „în sus” (de la mA la A)? Împarți la 1000.", "Exemple: 0,5 A = <b>500 mA</b>; 250 mA = <b>0,25 A</b>; 4,7 kΩ = <b>4 700 Ω</b>; 2 200 Ω = <b>2,2 kΩ</b>; 1 MΩ = <b>1 000 kΩ</b>; 3 kW = <b>3 000 W</b>; 1 kWh = 1 000 W timp de 1 oră = <b>3,6 MJ</b>.", EX("transformări mA ↔ A și kΩ ↔ Ω înainte de a aplica legea lui Ohm.")),
]);
L("el", 2, "Serie și paralel", "🔗", /serie|paralel|echivalent|Kirchhoff|nod|ochi|divizor|în șir|beculețe|ghirland/i, [
  K("În șir sau una lângă alta", "<b>În serie</b>, consumatorii sunt ca vagoanele unui tren: curentul trece prin toți, pe rând. Dacă se rupe unul, se oprește tot trenul. <b>În paralel</b>, sunt ca benzile unei autostrăzi: fiecare primește aceeași tensiune și merge independent – așa sunt legate prizele și becurile din casă.", "<b>Serie</b>: același curent prin toate; tensiunile se adună (U = U1 + U2); <b>R<sub>e</sub> = R1 + R2</b>. <b>Paralel</b>: aceeași tensiune pe fiecare; curenții se adună (I = I1 + I2); <b>1/R<sub>e</sub> = 1/R1 + 1/R2</b>; două rezistențe egale în paralel → jumătate (ex. 2 × 100 Ω → 50 Ω).", SVG.serpar()),
  K("Calcule mici", "Doar adunări și o împărțire.", "Serie: 100 Ω + 220 Ω = <b>320 Ω</b>. Paralel: 6 Ω și 3 Ω → (6·3)/(6+3) = 18/9 = <b>2 Ω</b> (formula „produs pe sumă” pentru două rezistențe). Bateriile în serie: 2 × 1,5 V = <b>3 V</b>. Ampermetrul se leagă în <b>serie</b>, voltmetrul în <b>paralel</b>.", EX("rezistența echivalentă serie/paralel și cum se leagă ampermetrul (serie) și voltmetrul (paralel).")),
]);
L("el", 2, "Legea lui Ohm pas cu pas", "🔺", /Ohm|U ?= ?R|I ?= ?U|R ?= ?U|calcul|rezistor|LED|ce curent|ce tensiune|ce rezisten/i, [
  K("Triunghiul magic", "Scrii U sus, R și I jos. Acoperi cu degetul ce cauți: dacă acoperi U, rămân R și I unul lângă altul → înmulțești. Dacă acoperi I, rămâne U deasupra lui R → împarți.", "<b>U = R · I</b> &nbsp; <b>I = U / R</b> &nbsp; <b>R = U / I</b>. Unitățile trebuie să fie de bază: volți, amperi, ohmi (transformă întâi mA → A, kΩ → Ω).", SVG.ohm()),
  K("Trei exemple mici", "Pas 1: scrie ce știi. Pas 2: alege formula. Pas 3: pune numerele. Pas 4: scrie unitatea.", "① Știu U = 12 V și R = 4 Ω. Caut I → I = U/R = 12/4 = <b>3 A</b>. ② Știu R = 100 Ω și I = 0,2 A. Caut U → U = R·I = 100·0,2 = <b>20 V</b>. ③ Știu U = 230 V și I = 2 A. Caut R → R = U/I = 230/2 = <b>115 Ω</b>. ④ Capcană: U = 5 V, R = 1 kΩ → R = 1000 Ω → I = 5/1000 = 0,005 A = <b>5 mA</b>.", EX("calcule directe cu U = R·I, inclusiv cu mA și kΩ.")),
]);
L("el", 2, "Puterea și energia", "💡", /puter|watt|\bW\b|kWh|energi|P ?=|I²|Joule|căldur|consum|factur/i, [
  K("Cât de tare muncește curentul", "Puterea spune <b>cât de repede</b> se face treaba: un bec de 100 W „mănâncă” de 10 ori mai repede decât unul de 10 W. Energia spune <b>cât s-a muncit în total</b> – asta plătești la factură.", "<b>P = U · I</b> (wați). Variante: P = R·I² = U²/R. <b>Energia W = P · t</b>; la factură în <b>kWh</b> (1 kW timp de 1 oră). Rezistențele transformă energia electrică în căldură (efect Joule)."),
  K("Calcule mici", "Tensiune ori curent = putere. Putere ori ore = energie.", "① Fierbător: 230 V × 9 A ≈ <b>2 070 W ≈ 2 kW</b>. ② Ce curent trage un PC de 460 W la 230 V? I = P/U = 460/230 = <b>2 A</b>. ③ Un router de 10 W pornit 24 h: 10 × 24 = 240 Wh = <b>0,24 kWh</b> pe zi. ④ 2 kW timp de 3 h = <b>6 kWh</b>.", EX("P = U·I, curentul absorbit de un consumator și energia în kWh.")),
]);
L("el", 2, "Curent continuu și curent alternativ", "〰️", /continuu|alternativ|\bDC\b|\bAC\b|c\.c|c\.a|50 ?Hz|frecvenț|perioad|sinus|efectiv|vârf|325|baterie|acumulator|redres/i, [
  K("Apa care curge într-un sens sau se leagănă", "<b>Curentul continuu (DC)</b> e ca apa care curge mereu în același sens printr-o țeavă, cu aceeași presiune. <b>Curentul alternativ (AC)</b> e ca apa împinsă înainte și înapoi prin țeavă, de 50 de ori pe secundă – nu ajunge „departe”, dar învârte orice roată pusă în drum.", "<b>DC</b>: polaritate fixă (+ și −). Surse: baterii, acumulatori, redresoare/alimentatoare, sursa PC (3,3/5/12 V), PoE. <b>AC</b>: își schimbă sensul periodic, forma de undă este o <b>sinusoidă</b>. În România: <b>230 V, 50 Hz</b> → <b>perioada T = 1/f = 20 ms</b>. 230 V este valoarea <b>efectivă</b> (RMS, cea care încălzește la fel ca un DC de 230 V); valoarea de <b>vârf</b> este 230 × √2 ≈ <b>325 V</b>.", SVG.acdc() + EX("230 V / 50 Hz, T = 20 ms, 325 V vârf, ce surse dau DC.")),
]);
L("el", 3, "Monofazat și trifazat", "🔄", /monofazat|trifazat|faz[ăa]|L1|L2|L3|400 ?V|120°|nul|neutru/i, [
  K("Pedalele bicicletei", "Pe o bicicletă, pedalele nu apasă toate deodată, ci pe rând, ca mișcarea să fie lină. La trifazat sunt <b>trei „pedale”</b> (fazele L1, L2, L3) care împing pe rând, decalate cu o treime de tură (<b>120°</b>). Rezultatul: putere mare, constantă – bună pentru motoare și clădiri mari.", "<b>Monofazat</b>: o fază (L) + nul (N) → <b>230 V</b> (prizele obișnuite). <b>Trifazat</b>: trei faze L1, L2, L3 decalate cu 120°; între o fază și nul tot <b>230 V</b>, dar <b>între două faze 400 V</b> (230 × √3 ≈ 400). Culori uzuale ale conductoarelor: faze maro/negru/gri, nul <b>albastru</b>, protecție (PE) <b>galben-verde</b>.", SVG.phase() + EX("230 V fază–nul, 400 V între faze, culorile conductoarelor.")),
]);
L("el", 3, "Transformator, redresor, invertor, UPS, PoE", "🔋", /transformator|redres|invertor|UPS|PoE|alimentator|sursă|diod|condensator/i, [
  K("Lanțul de la priză la placa de bază", "Priza dă AC „mare” (230 V). Echipamentele electronice vor DC „mic” (5 V, 12 V). Transformatorul micșorează tensiunea, redresorul o face „într-un singur sens”, iar condensatorul o netezește – ca un rezervor care umple golurile.", "<b>Transformator</b>: schimbă valoarea tensiunii <b>alternative</b> (nu funcționează în DC). <b>Redresor</b> (cu diode): AC → DC. <b>Invertor</b>: DC → AC. <b>UPS</b>: acumulator + încărcător + invertor – ține echipamentele pornite la căderea rețelei (online, line-interactive, offline). <b>PoE</b> (Power over Ethernet): trimite <b>curent continuu</b> (~48 V nominal) prin cablul de rețea către telefoane IP, camere, access point-uri (802.3af/at/bt).", SVG.power() + EX("redresor = AC→DC, invertor = DC→AC, transformatorul merge doar în AC, PoE = DC prin cablul UTP.")),
]);
L("el", 3, "Multimetrul și măsurarea la priză", "🧪", /multimetr|voltmetr|ampermetr|ohmmetr|clește|creion|priz|COM\b|V~|scal|domeniu|măsur|continuitat/i, [
  K("Cum reglezi multimetrul – 4 pași", "Multimetrul e ca o trusă cu mai multe aparate într-unul: trebuie să-i spui ce vrei să măsori, cât de mare e valoarea, unde bagi firele și cum îl legi.", "<b>1. Funcția</b>: V⎓ (tensiune continuă), <b>V~</b> (tensiune alternativă), A (curent), Ω (rezistență), continuitate (bip). <b>2. Domeniul</b>: alege o scală mai mare decât valoarea așteptată (ex. 600 V~ pentru priză) sau „auto”. <b>3. Bornele</b>: firul negru în <b>COM</b>, roșu în <b>VΩ</b> pentru tensiune/rezistență, sau în <b>A/mA</b> pentru curent. <b>4. Legarea</b>: voltmetrul <b>în paralel</b> (pe cele două puncte), ampermetrul <b>în serie</b> (circuitul se desface și curentul trece prin aparat), ohmmetrul doar cu circuitul <b>fără tensiune</b>.", SVG.meter()),
  K("Măsurarea la priză – în siguranță", "Priza are trei „găuri”: faza (cea „vie”), nulul (drumul de întoarcere) și împământarea (drumul de siguranță spre pământ).", "Cu multimetrul pe <b>V~</b>, scala ≥ 600 V, firele în COM și VΩ: <b>fază–nul ≈ 230 V</b>, <b>fază–împământare ≈ 230 V</b>, <b>nul–împământare ≈ 0 V</b> (câțiva volți). <b>Creionul de tensiune</b> (indicator) se aprinde pe fază. Curentul unui cablu se măsoară cu <b>clește ampermetric</b>, prinzând <b>un singur conductor</b>, fără a desface circuitul. ⚠️ <b>Niciodată nu băga multimetrul pe funcția A (ampermetru) în priză</b> – este un scurtcircuit: arde siguranța aparatului sau aparatul și te poate răni. Ține degetele în spatele protecțiilor sondelor.", SVG.socket() + EX("unde se pune firul negru (COM), V~ pentru priză, ampermetru în serie, clește pe un singur conductor.")),
]);

/* ===== EXTRA ===== */
L("extra", 1, "Telefonie digitală și PCM", "📞", /PCM|eșantion|8000|8 ?kHz|64 ?kbit|E1|T1|2[,.]048|TDM|FDM|multiplex|ISDN|PBX|central|DTMF|SS7|SDH|PDH|comutați|A-law|cuantiz/i, [
  K("Vocea tăiată în felii", "Vocea e un val continuu. PCM o fotografiază de 8000 de ori pe secundă și scrie fiecare „poză” cu un număr de 8 biți.", "PCM: eșantionare 8 kHz (Nyquist: ≥ 2 × 3,4 kHz), cuantizare (lege A în Europa), codare pe 8 biți → <b>64 kbit/s</b> (DS0). <b>E1 = 2,048 Mbit/s</b> = 32 de intervale (30 voce + TS0 sincronizare + TS16 semnalizare). ISDN BRI = 2B+D (144 kbit/s); PRI european = 30B+D."),
]);
L("extra", 2, "VoIP", "🎧", /VoIP|SIP|H\.323|RTP|codec|G\.7|jitter|întârzier|latenț|MOS|QoS|DSCP|EF|gateway|FXS|FXO|ecou|5060/i, [
  K("Telefonul care merge pe Internet", "Vocea e pusă în pachețele mici, trimise rapid unul după altul. Dacă unele întârzie, se aude „robotic”.", "<b>SIP</b> (5060/5061) stabilește apelul; <b>RTP</b> (peste UDP) transportă vocea. Codecuri: G.711 (64 kbit/s), G.729 (8 kbit/s), Opus. Calitate: întârziere ≤ 150 ms (G.114), jitter mic, pierderi &lt; 1%; QoS cu DSCP <b>EF (46)</b>. FXS → telefonul analogic; FXO → linia de la centrală."),
]);
L("extra", 3, "Radio și satelit pe scurt", "🛰️", /satelit|geostaționar|36|LEO|GPS|GNSS|VSAT|LNB|transponder|Ku|Ka|banda C|VHF|UHF|repetor|simplex|duplex|PTT|FM|AM|ISM|λ|lungime de und/i, [
  K("Oglinda din cer", "Un satelit geostaționar stă „pe loc” deasupra Ecuatorului și reflectă semnalele ca o oglindă foarte îndepărtată, deci semnalul face un drum lung.", "Orbita geostaționară: ~<b>35 786 km</b>; întârziere dus-întors prin satelit ~0,5 s. λ = c / f (150 MHz → 2 m). VHF 30–300 MHz, UHF 300 MHz–3 GHz – propagare în linie de vedere. Simplex = pe rând (PTT); duplex = simultan."),
]);

/* ===== ANTENE ȘI RADIO ===== */
L("ant", 1, "Ce este o undă radio", "🌊", /und[ăa] radio|electromagnetic|lungime de und|λ|lambda|c ?= ?|300 ?000|3 ?· ?10|viteza luminii|frecvenț|hertz|Hz\b|perioad/i, [
  K("Valuri pe un lac", "Arunci o piatră în lac și se fac valuri care pleacă în toate părțile. O antenă face la fel, dar cu „valuri” electrice și magnetice invizibile: <b>undele radio</b>. Ele merg cu viteza luminii și nu au nevoie de aer sau de fire.", "Unda radio = undă <b>electromagnetică</b>; viteza <b>c ≈ 300 000 km/s = 3·10⁸ m/s</b>. <b>Frecvența f</b> = câte oscilații pe secundă, în <b>hertz (Hz)</b>: 1 kHz = 1 000 Hz, 1 MHz = 1 000 000 Hz, 1 GHz = 1 000 MHz.", SVG.wave()),
  K("Lungimea de undă λ", "Lungimea de undă e distanța dintre două creste de val. Valuri dese (frecvență mare) → creste apropiate (undă scurtă). Valuri rare → creste departe.", "<b>λ = c / f</b>. Scurtătură: <b>λ [m] = 300 / f [MHz]</b>. Exemple: 3 MHz → 100 m; 30 MHz → 10 m; 150 MHz → 2 m; 300 MHz → 1 m; 400 MHz → 75 cm; 900 MHz → 33 cm; 2,4 GHz (2 400 MHz) → 12,5 cm; 5 GHz → 6 cm. Mărimea antenei depinde de λ (ex. dipol ≈ λ/2).", EX("calculul λ = 300/f[MHz] și legătura invers proporțională frecvență – lungime de undă.")),
]);
L("ant", 1, "Benzile de frecvență", "📻", /HF|VHF|UHF|SHF|EHF|MF\b|LF\b|band[ăa]|unde scurte|unde medii|unde lungi|ISM|2[,.]4 ?GHz|5 ?GHz|FM\b/i, [
  K("Benzile sunt ca benzile unei autostrăzi", "Spectrul radio e împărțit în „benzi”, fiecare cu felul ei de a se purta: undele joase ocolesc dealurile și pot sări peste continente; undele înalte merg drept, ca lumina, și duc multe date.", "<b>HF</b> 3–30 MHz (unde scurte, reflexie în ionosferă, distanțe mari); <b>VHF</b> 30–300 MHz (radio FM 88–108 MHz, stații portabile, aviație); <b>UHF</b> 300 MHz–3 GHz (TETRA ~380–400 MHz, GSM, Wi-Fi 2,4 GHz, GPS); <b>SHF</b> 3–30 GHz (radioreleu, satelit, Wi-Fi 5 GHz); <b>EHF</b> 30–300 GHz. Benzile <b>ISM</b> (2,4 / 5 GHz) se folosesc fără licență individuală.", SVG.bands()),
  K("Regula de aur", "Cu cât urci în frecvență, cu atât antena e mai mică, poți duce mai multe date, dar semnalul trece mai greu prin obstacole și e mai afectat de ploaie.", "Frecvență mai mare → λ mai mică → antene mai mici, lățime de bandă mai mare, propagare în <b>linie de vedere</b>, atenuare mai mare (inclusiv ploaie peste ~10 GHz). VHF/UHF/SHF: practic linie de vedere; HF: reflexie ionosferică.", EX("limitele benzilor HF/VHF/UHF/SHF și exemple de utilizare.")),
]);
L("ant", 1, "Emițător, receptor, transceiver", "🎙️", /emițător|receptor|transceiver|\bTX\b|\bRX\b|\bTRX\b|PTT|simplex|duplex|semi-?duplex|repetor|modula|demodula|IDU|ODU|stați[ae] radio|squelch|sensibilitat/i, [
  K("Gura și urechea", "<b>Emițătorul (TX)</b> e „gura”: transformă vocea sau datele în undă radio. <b>Receptorul (RX)</b> e „urechea”: prinde unda și o transformă înapoi. O stație radio portabilă are amândouă într-o singură cutie: e un <b>transceiver</b>.", "<b>TX</b> modulează și amplifică semnalul; <b>RX</b> îl amplifică și demodulează; <b>TRX/transceiver</b> = TX + RX. <b>Modulația</b> = „încărcarea” informației pe unda purtătoare (AM, FM, digitale). La radioreleu: <b>IDU</b> (unitatea de interior, în clădire) și <b>ODU</b> (unitatea de exterior, lângă antenă).", SVG.trx()),
  K("Pe rând sau deodată", "Ca la walkie-talkie: apeși butonul (PTT) și vorbești, celălalt doar ascultă. Asta e <b>simplex</b>. La telefon vorbiți amândoi deodată: <b>duplex</b>.", "<b>Simplex</b>: pe rând, aceeași frecvență, cu <b>PTT</b> (Push-To-Talk). <b>Semi-duplex</b>: două frecvențe, dar tot pe rând (de ex. prin repetor). <b>Duplex</b>: emisie și recepție simultan, pe frecvențe diferite. <b>Repetorul</b> primește pe o frecvență și retransmite pe alta, de pe un loc înalt, ca să mărească acoperirea. <b>Sensibilitatea</b> receptorului = cel mai slab semnal pe care îl poate folosi (ex. −110 dBm).", EX("TX/RX/transceiver, simplex vs duplex, rolul repetorului.")),
]);
L("ant", 1, "Antena și tipurile de antene", "📡", /antena|antenă|dipol|monopol|vertical|Yagi|panou|sectorial|parabol|omni|direcțional|directiv|plan de mas|sfert de und|λ\/2|λ\/4|reflector|director|whip/i, [
  K("Antena este „traducătorul” dintre fir și aer", "În cablu, semnalul e un curent electric. Antena îl transformă în undă radio care pleacă prin aer (la emisie) și invers, prinde unda și o transformă în curent (la recepție). Aceeași antenă poate face ambele lucruri.", "Antena <b>convertește</b> energia electrică din cablu în energie electromagnetică radiată și invers (reciprocitate). Dimensiunea ține de λ: <b>dipolul</b> are ~λ/2 (două brațe de λ/4); <b>monopolul</b> (antena verticală, „bici”) are ~λ/4 și are nevoie de un <b>plan de masă</b> (caroseria mașinii, radiale).", SVG.anttypes()),
  K("Omnidirecționale vs. direcționale", "Un bec gol luminează peste tot (omnidirecțional). O lanternă strânge lumina într-o direcție (direcțional). Antenele fac la fel.", "<b>Omnidirecționale</b> (360° pe orizontală): dipol vertical, monopol – pentru stații mobile, TETRA, acoperire în jur. <b>Direcționale</b>: <b>Yagi</b> (reflector + element activ + directori), <b>panou/sectorială</b> (60–120°, pe pilonii celulari), <b>parabolică</b> (fascicul foarte îngust, radioreleu și satelit). Direcțional = câștig mare într-o direcție, trebuie aliniată.", EX("ce antenă e omni și ce antenă e directivă; dipol λ/2, monopol λ/4.")),
]);
L("ant", 1, "dB și dBm pe înțeles", "🔢", /\bdB\b|dBm|dBW|mW|\bW\b|decibel|logarit|dublu|jumătate|\+3|−3|-3|\+10|×10|putere de emisie|watt/i, [
  K("De ce dB? Pentru că e ușor de adunat", "În radio, puterile sunt fie uriașe, fie minuscule (de la 1 W la un miliardime de miliardime de W). În loc să înmulțim numere lungi, folosim <b>decibeli</b>: înmulțirea devine adunare.", "<b>dB</b> = raport (cât crește sau scade). <b>dBm</b> = putere absolută față de 1 mW: <b>0 dBm = 1 mW</b>; <b>+10 dBm = 10 mW</b>; <b>+20 dBm = 100 mW</b>; <b>+30 dBm = 1 W</b>; −30 dBm = 1 µW. Regulile: <b>+3 dB ≈ ×2</b>; <b>−3 dB ≈ jumătate</b>; <b>+10 dB = ×10</b>; <b>−10 dB = ÷10</b>; +20 dB = ×100.", SVG.db()),
  K("Calcule mici", "Pornești de la o valoare pe care o știi și aduni pași de 3 și de 10.", "① 100 mW = <b>+20 dBm</b>. ② 2 W = 1 W + 3 dB = <b>+33 dBm</b>. ③ 5 W ≈ <b>+37 dBm</b>. ④ Un emițător de +30 dBm trece printr-un cablu cu pierdere 3 dB → rămân <b>+27 dBm</b> = 0,5 W. ⑤ Semnale primite tipice: −50 dBm = foarte bun; −90 dBm = slab; −110 dBm = la limită.", EX("0 dBm = 1 mW, 30 dBm = 1 W, ±3 dB = dublu/jumătate, ±10 dB = ×10/÷10.")),
]);
L("ant", 2, "Câștigul antenei: dBi și dBd", "📈", /câștig|dBi|dBd|izotrop|diagram|lob|fascicul|beamwidth|față-spate|front|EIRP|ERP/i, [
  K("Lanterna cu reflector", "Un bec gol luminează puțin în toate părțile. Pui un reflector și lumina se strânge într-un fascicul puternic într-o singură direcție. Antena directivă face la fel cu undele radio – <b>nu creează energie</b>, doar o strânge.", "Câștigul în <b>dBi</b> = față de antena <b>izotropă</b> (ideală, radiază egal în toate direcțiile); în <b>dBd</b> = față de dipolul λ/2. Dipolul are <b>2,15 dBi = 0 dBd</b> → dBi = dBd + 2,15. Câștig mare ⇒ fascicul îngust ⇒ aliniere precisă. Raportul <b>față-spate</b> = cât de puțin radiază în spate.", SVG.yagi()),
  K("EIRP – puterea „văzută” din față", "Dacă pui un emițător mic pe o antenă care strânge tot într-o direcție, cine stă în fața ei „simte” un emițător mult mai puternic.", "<b>EIRP</b> = Ptx − pierderi cablu + câștig antenă (dBi). Ex: 20 dBm − 2 dB + 15 dBi = <b>33 dBm</b> (≈ 2 W). Limitele legale (ANCOM) se dau adesea în EIRP.", EX("dBi vs dBd (2,15), izotrop, calculul EIRP.")),
]);
L("ant", 2, "Polarizarea", "↕️", /polariz|vertical|orizontal|circular|XPIC|skew|RHCP|LHCP/i, [
  K("Gardul cu ulucii verticali", "Dacă arunci o coardă printr-un gard cu ulucii verticali, trece doar dacă o scuturi în sus și-n jos. Undele radio „vibrează” și ele într-o direcție: aceea e polarizarea.", "Polarizare verticală (stații mobile, TETRA), orizontală, circulară (GPS, unii sateliți). Antenele celor două capete trebuie să aibă <b>aceeași polarizare</b>; nepotrivirea V/H → pierderi foarte mari (practic ≥ 20 dB). Radioreleele pot folosi ambele polarizări pe aceeași frecvență (<b>XPIC</b>). La satelit, rotirea LNB-ului = reglaj <b>skew</b>.", SVG.polar() + EX("aceeași polarizare la ambele capete; pierdere mare la V↔H.")),
]);
L("ant", 2, "Cablul coaxial, 50 Ω și conectorii", "🔌", /coaxial|coax|50 ?Ω|75 ?Ω|impedan|conector|\bN\b|SMA|BNC|PL-?259|SO-?239|TNC|7\/16|4\.3-10|LMR|RG-?\d|factor de vitez|atenuare.*cablu|pierder.*cablu|etanș|bandă autovulcan/i, [
  K("Țeava prin care călătorește semnalul", "Cablul coaxial are un fir în mijloc și o „cămașă” de plasă în jur, ca un tub în tub. Cămașa ține semnalul înăuntru și perturbațiile afară.", "Coaxialul: <b>conductor central</b> + <b>dielectric</b> + <b>ecran</b> (tresă/folie) + manta. Impedanța: <b>50 Ω</b> în radio-comunicații (stații, radioreleu, Wi-Fi, celular), <b>75 Ω</b> în TV/satelit/video. Pierderea cablului crește cu <b>frecvența</b> și cu <b>lungimea</b> → cabluri cât mai scurte și mai groase (ex. LMR-400, 1/2\", 7/8\"). Toate elementele (TX, cablu, antenă) trebuie să aibă aceeași impedanță."),
  K("Conectori RF", "Conectorii sunt „prizele” semnalului radio. Fiecare tip se potrivește doar cu perechea lui și are o frecvență maximă.", "<b>N</b> – filetat, robust, exterior (până la ~11 GHz). <b>SMA</b> – mic, filetat (Wi-Fi, module, până la ~18 GHz). <b>BNC</b> – cu baionetă, aparate de măsură. <b>PL-259</b> (mufa) / <b>SO-239</b> (soclul) – „conectorul UHF”, stații HF/VHF, CB (doar până la ~300 MHz în practică). <b>TNC</b> – BNC cu filet. <b>7/16 DIN</b> și <b>4.3-10</b> – stații celulare (PIM redus). Montaj: strângere corectă, etanșare cu <b>bandă autovulcanizantă + bandă PVC</b>.", SVG.rfconn() + EX("50 Ω radio vs 75 Ω TV; conectorii N, SMA, BNC, PL-259; atenuarea crește cu frecvența și lungimea.")),
]);
L("ant", 2, "VSWR (ROS) – potrivirea antenei", "〽️", /VSWR|ROS|SWR|und[ăa] staționar|reflect|return loss|adaptar|DTF|Site Master|analizor|putere reflectat|puterea reflectat/i, [
  K("Ecoul din țeavă", "Dacă torni apă într-o țeavă care se îngustează brusc, o parte se întoarce înapoi. La fel, dacă antena nu se „potrivește” cu cablul, o parte din putere se întoarce spre emițător – și poate chiar să-l strice.", "<b>VSWR</b> (în română <b>ROS</b> – raport de undă staționară) arată cât de bine e adaptată antena: <b>1:1</b> = perfect; <b>&lt; 1,5:1</b> = bun; <b>2:1</b> ≈ 11% din putere reflectată (return loss ≈ 9,5 dB); peste 3:1 = problemă. Cauze de VSWR mare: apă în conector, conector prost montat, cablu strivit/îndoit, antenă ruptă sau acordată pe altă frecvență.", SVG.vswr()),
  K("Cum măsori", "Ca la un doctor care ascultă inima: aparatul trimite semnal în cablu și ascultă ce se întoarce.", "Se măsoară cu <b>reflectometru/SWR-metru</b> sau cu <b>analizorul de cablu și antenă</b> (ex. Site Master): VSWR, return loss și <b>DTF</b> (distance to fault – distanța până la defect). Return loss mare (în dB) = bine.", EX("VSWR 1:1 ideal, 2:1 ≈ 11% reflectat, cauzele VSWR mare.")),
]);
L("ant", 2, "Linia de vedere și zona Fresnel", "👀", /linie de vedere|LOS|Fresnel|curbur|orizont|obstacol|vegeta|multipath|fading|diversitat|k ?= ?4\/3|60 ?%/i, [
  K("Nu doar să se vadă, ci să aibă loc", "Două antene care „se văd” nu ajung: unda radio e ca un balon de rugby lung și gros între ele. Dacă un deal sau un copac intră în balon, semnalul slăbește.", "Prima <b>zonă Fresnel</b> trebuie să fie liberă în proporție de <b>≥ 60%</b>. La mijlocul saltului: r ≈ 8,66·√(D[km]/f[GHz]) metri (ex. 10 km la 6 GHz → ~11 m). Se ține cont de curbura Pământului (k = 4/3; orizont radio ≈ 4,12·√h km). Fadingul multipath (semnale reflectate care se anulează) se combate prin diversitate.", SVG.fresnel() + EX("LOS + 60% din prima zonă Fresnel liberă.")),
]);
L("ant", 3, "Bugetul legăturii radio", "🧾", /buget|link budget|FSPL|spațiu liber|pierder.*propag|marj|nivel recepț|RSL|−\d+ ?dBm|-\d+ ?dBm|sensibilitat/i, [
  K("Portofelul cu decibeli", "Pornești cu o sumă (puterea emițătorului). Antenele îți „dau bani” (câștig), iar cablurile și distanța „îți iau” (pierderi). La final trebuie să-ți rămână mai mult decât minimul cerut de receptor.", "<b>Prx = Ptx − Lcablu,tx + Gtx − FSPL + Grx − Lcablu,rx</b> (totul în dB/dBm). <b>Marja</b> = Prx − sensibilitatea receptorului (se vrea câțiva–zeci de dB pentru fading/ploaie). <b>FSPL</b> (pierderea în spațiul liber) = 32,44 + 20·log d[km] + 20·log f[MHz]: dublarea distanței sau a frecvenței → <b>+6 dB</b> pierdere.", SVG.budget() + EX("calcul simplu de buget: adunăm câștigurile, scădem pierderile; +6 dB la dublarea distanței.")),
]);
L("ant", 3, "Radioreleu, TETRA, HF, satelit", "🗼", /radioreleu|microunde|ATPC|ACM|TETRA|unde scurte|NVIS|ionosfer|satelit|azimut|elevaț|offset|sud|ANCOM|geostaționar|LNB/i, [
  K("Poduri invizibile", "Un radioreleu e un pod invizibil între două turnuri: două „farfurii” care se privesc fix una pe alta, la zeci de km.", "Radioreleu: antene parabolice, aliniere fină pentru <b>RSL maxim</b> pe lobul principal; ATPC (putere automată), ACM (modulație adaptivă). Frecvențe mari (23–80 GHz) → salturi scurte (ploaie). <b>TETRA</b>: ~380–400 MHz, 4 intervale TDMA, 25 kHz. <b>HF</b>: reflexie ionosferică; NVIS pentru acoperire regională. Satelit geostaționar din România: spre <b>sud</b>, elevație ~30–37°. Spectrul se licențiază la <b>ANCOM</b>.", EX("TETRA ~380–400 MHz, antena de satelit spre sud, aliniere radioreleu pe RSL maxim.")),
]);
L("ant", 3, "Proceduri radio și alfabetul fonetic", "🗣️", /alfabet|fonetic|Alfa|Bravo|Charlie|Delta|indicativ|procedur|disciplin|recepț|terminat|PTT|mesaj|rețea radio|stație director|verificare a legăturii|cum mă auzi/i, [
  K("Vorbești clar, scurt și pe rând", "Pe o frecvență poate vorbi doar unul odată – ca la o masă unde toată lumea aude tot. De aceea există reguli: te prezinți, spui scurt mesajul și eliberezi frecvența.", "Reguli: asculți întâi că frecvența e liberă; apeși <b>PTT</b>, aștepți o clipă, vorbești clar, nu prea repede; folosești <b>indicative</b> (nume de cod), nu nume reale; mesaje scurte; nu transmiți date clasificate în clar. Într-o <b>rețea radio</b> există o <b>stație directoare</b> care conduce traficul. „Recepție” = te ascult/aștept răspuns; „Terminat” = închei legătura."),
  K("Alfabetul fonetic NATO", "Pe radio, „B” și „D” sau „M” și „N” se confundă. Așa că fiecare literă are un cuvânt al ei.", "A <b>Alfa</b>, B <b>Bravo</b>, C <b>Charlie</b>, D <b>Delta</b>, E <b>Echo</b>, F <b>Foxtrot</b>, G <b>Golf</b>, H <b>Hotel</b>, I <b>India</b>, J <b>Juliett</b>, K <b>Kilo</b>, L <b>Lima</b>, M <b>Mike</b>, N <b>November</b>, O <b>Oscar</b>, P <b>Papa</b>, Q <b>Quebec</b>, R <b>Romeo</b>, S <b>Sierra</b>, T <b>Tango</b>, U <b>Uniform</b>, V <b>Victor</b>, W <b>Whiskey</b>, X <b>X-ray</b>, Y <b>Yankee</b>, Z <b>Zulu</b>.", EX("alfabetul fonetic (ex. „STS” = Sierra Tango Sierra) și regulile de disciplină radio.")),
]);
L("ant", 3, "Pilon, trăsnet și siguranță", "⛑️", /pământ|împământ|trăsnet|descărc|supratensiun|drip|bucl[ăa] de scurgere|înălțime|ham|cască|furtun|RF|expunere|pilon|stâlp|paratrăsnet|priză de pământ/i, [
  K("Pilonul e locul cel mai înalt – și cel mai lovit de trăsnet", "Trăsnetul caută drumul cel mai ușor spre pământ. Noi îi construim acel drum (împământarea), ca să nu treacă prin echipamente sau prin oameni.", "Pilonul și ecranul coaxialului se leagă la pământ <b>sus, la bază și la intrarea în clădire</b>; <b>descărcător de supratensiune</b> pe cablu; <b>buclă de scurgere</b> (drip loop) înainte de intrare, ca apa să nu curgă pe cablu în clădire. Toate împământările se leagă la aceeași bară (echipotențializare).", EX("unde se leagă la pământ coaxialul și rolul descărcătorului.")),
  K("Lucrul la înălțime", "Un pilon nu iartă greșelile. Te legi mereu, nu urci singur și nu urci pe vreme rea.", "<b>Ham complet + sistem antiprăbușire, cască, ancorare permanentă</b> (mereu cel puțin un punct de prindere), <b>minimum 2 oameni</b>, scule legate, zonă îngrădită jos. Nu se urcă pe furtună, vânt puternic, polei. Emițătoarele se opresc înainte de lucru lângă antene (expunere la radiații RF), mai ales în fața antenelor de radioreleu și sectoriale.", EX("echipamentul de protecție la înălțime și oprirea emisiei înainte de lucru.")),
]);

/* ===== MUNCA LA STS (informații publice + bune practici generale) ===== */
L("sts", 1, "STS și sistemul 112", "🚨", /112|SNUAU|apel(uri)? de urgenț|dispecerat|AML|localiz|Cell ID|centru 112|centrul 112|operator 112|agenți|SMURD|ISU|UPU|RTT/i, [
  K("Un singur număr pentru toate urgențele", "Când suni la 112, nu suni direct la ambulanță sau la poliție. Suni la un „recepționer” (centrul 112) care află ce s-a întâmplat și unde, apoi trimite cazul la agenția potrivită – ca un recepționer de hotel care te trimite la camera corectă.", "<b>STS</b> (Serviciul de Telecomunicații Speciale) administrează <b>Sistemul național unic pentru apeluri de urgență (SNUAU)</b> – numărul <b>112</b>. Operatorul 112 preia apelul și îl transferă către <b>dispeceratele</b> agențiilor: <b>ISU-SMURD-Ambulanță</b> (dispecerat integrat), <b>Poliție</b>, <b>Jandarmerie</b>. Apelul la 112 este <b>gratuit</b> (și fără credit pe cartelă).", SVG.e112()),
  K("Localizarea și noile canale", "Telefonul îți poate „spune” singur unde ești, chiar dacă tu nu știi adresa.", "Localizare: <b>Cell ID/Sector ID</b> (după antena rețelei mobile – aproximativ), <b>AML</b> (Advanced Mobile Location – telefonul trimite automat poziția GPS/Wi-Fi la apelul 112, mult mai precis). Proiecte publice recente extind 112 cu <b>SMS, video și RTT</b> (text în timp real) pentru persoanele cu dizabilități. Sistemul e critic: trebuie să funcționeze <b>permanent</b>, cu redundanță.", EX("STS administrează 112 (SNUAU); AML = localizare precisă trimisă automat de telefon.")),
]);
L("sts", 1, "Camera de echipamente și rack-ul", "🗄️", /rack|19|\bU\b|unitat[ei] de rack|42U|patch panel|organizator|etichet|PDU|răcire|culoar|aer (cald|rece)|camera de echipamente|camera serverelor|data ?center|centru de date|cable management|bara de împământare|umiditat|temperatur/i, [
  K("Un dulap cu rafturi standard", "Rack-ul e ca un dulap de bucătărie în care toate sertarele au aceeași lățime, ca să încapă orice aparat de la orice firmă. Înălțimea se măsoară în „unități” (U), ca etajele unui bloc.", "Rack standard de <b>19\"</b> (lățimea panourilor 482,6 mm). <b>1U = 1,75\" = 44,45 mm</b>. Uzual: 42U (rack de podea), 12–24U (rack de perete). Ordine tipică: <b>patch panel</b> (unde se termină cablurile din clădire) → <b>organizator de cabluri</b> → <b>switch</b>; echipamentele grele (UPS, servere) <b>jos</b>. <b>PDU</b> = prelungitorul de rack.", SVG.rack()),
  K("Ordine, etichete, curent și răcoare", "O cameră de echipamente bine făcută arată ca o bibliotecă: fiecare cablu are „cotă”, iar cine vine după tine găsește totul fără să ghicească.", "<b>Etichetare</b> la ambele capete ale fiecărui cablu și pe fiecare port (aceeași denumire în documentație). Cabluri patch scurte, culori pe funcții, fără îndoiri bruște, legate cu velcro (nu strâns). <b>UPS</b> pentru echipamentele critice + alimentare din două surse (A/B) unde se poate. <b>Răcire</b>: aer rece intră prin față, iese cald prin spate (culoare cald/rece); temperatură uzuală ~18–27 °C. <b>Împământarea</b> rack-ului la bara de împământare. Ușa camerei închisă, acces controlat.", EX("1U = 44,45 mm, rack 19\", rolul patch panel-ului, al UPS-ului și al etichetării.")),
]);
L("sts", 1, "PC-uri și terminale: instalare și depanare", "🖥️", /ipconfig|ping|tracert|nslookup|driver|domeniu|imagine|gateway|DNS|APIPA|169\.254|depan|nu are internet|nu merge|placa de rețea|LED|cablu de rețea|actualiz|antivirus|cont de utilizator|instalare|BIOS/i, [
  K("Depanarea de jos în sus", "Când „nu merge internetul”, nu începi cu setările complicate. Verifici întâi dacă e băgat cablul în priză – ca la o lampă care nu se aprinde.", "Pași (modelul OSI de jos în sus): ① <b>Fizic</b>: cablu conectat, LED-ul de pe port aprins, Wi-Fi pornit. ② <b>Adresa IP</b>: <code>ipconfig /all</code> – dacă vezi <b>169.254.x.x</b> (APIPA), PC-ul nu a primit adresă de la DHCP. ③ <code>ping</code> la <b>gateway</b> (routerul local). ④ <code>ping 8.8.8.8</code> (ieșirea spre exterior). ⑤ <code>nslookup</code> / ping la un nume (DNS). ⑥ Abia apoi aplicația, proxy-ul, firewall-ul. <code>tracert</code> arată pe unde se oprește drumul."),
  K("Pregătirea unui PC sau terminal nou", "Ca la o mașină nouă de serviciu: o înmatriculezi, îi pui echipamentul standard și o verifici înainte s-o dai cuiva.", "Pași tipici: instalare din <b>imaginea standard</b> a instituției, drivere, <b>actualizări</b>, antivirus/EDR, alăturare la <b>domeniu</b>, conturi fără drepturi de administrator pentru utilizatori, setări de rețea (IP/DHCP, gateway, DNS), aplicațiile necesare, test complet și <b>documentare</b> (inventar: serie, MAC, utilizator, locație). Date sensibile → criptarea discului (BitLocker).", EX("ordinea de depanare: fizic → IP (ipconfig) → ping gateway → ping extern → DNS; 169.254.x.x = APIPA.")),
]);
L("sts", 2, "Configurarea de bază a unui switch Cisco", "🔀", /enable|conf(igure)? t|hostname|vlan|switchport|interface|show (run|vlan|interfaces|ip|mac)|copy run|write memory|startup-config|running-config|SVI|line vty|ssh|enable secret|shutdown|trunk|access|description/i, [
  K("Vorbești cu switch-ul pe „etaje”", "Linia de comandă Cisco are „etaje”: la parter doar te uiți, urci un etaj ca să ai drepturi de șef, încă unul ca să schimbi setările, apoi intri în „camera” unui port.", "<b>Switch&gt;</b> = mod utilizator (doar câteva comenzi). <code>enable</code> → <b>Switch#</b> = mod privilegiat (show, copy, reload). <code>configure terminal</code> (<code>conf t</code>) → <b>Switch(config)#</b> = configurare globală. <code>interface g0/1</code> → <b>Switch(config-if)#</b>. <code>exit</code> urcă un nivel, <code>end</code> (Ctrl+Z) te duce direct în #. <b>Configurația activă</b> (running-config) e în RAM și se pierde la repornire dacă nu o salvezi."),
  K("Rețeta de bază", "Ca o listă de cumpărături: o urmezi de fiecare dată, în aceeași ordine. Rândurile cu spațiu în față sunt în „camera” de deasupra.", '<b>Verificare</b>: <code>show running-config</code>, <code>show vlan brief</code>, <code>show interfaces status</code>, <code>show ip interface brief</code>, <code>show mac address-table</code>. <b>Salvare</b>: <code>copy running-config startup-config</code> (sau <code>write memory</code>). Acces de la distanță sigur: <b>SSH</b>, nu Telnet.', '<pre class="nogl">enable\nconfigure terminal\n hostname SW-ETAJ1\n enable secret ParolaPuternica\n vlan 10\n  name DATE\n vlan 20\n  name VOCE\n interface range g0/1 - 20\n  switchport mode access\n  switchport access vlan 10\n interface g0/24\n  description UPLINK-ROUTER\n  switchport mode trunk\n interface vlan 10\n  ip address 10.10.10.2 255.255.255.0\n  no shutdown\n ip default-gateway 10.10.10.1\nend\ncopy running-config startup-config</pre>' + EX("modurile >, #, (config)#; „copy running-config startup-config” pentru salvare; show vlan brief.")),
]);
L("sts", 2, "Terminale mobile, tablete și cartele SIM", "📱", /SIM|eSIM|PIN|PUK|IMSI|ICCID|IMEI|APN|date mobile|4G|5G|LTE|MDM|tabletă|tablete|terminal mobil|roaming|semnal|operator|hotspot|VPN|mod avion/i, [
  K("Cartela SIM e „buletinul” telefonului în rețea", "Telefonul (sau tableta) e aparatul; cartela SIM spune rețelei <b>cine ești</b> și ce ai voie să folosești. Fără SIM (sau eSIM), tableta nu are date mobile, doar Wi-Fi.", "<b>SIM</b> conține identitatea abonatului (<b>IMSI</b>) și are un număr de serie tipărit (<b>ICCID</b>). Aparatul are propriul identificator: <b>IMEI</b> (afișat cu *#06#). <b>PIN</b> (4–8 cifre) protejează cartela; după <b>3 PIN-uri greșite</b> se blochează și ceri <b>PUK</b>-ul (8 cifre); 10 PUK-uri greșite → SIM blocat definitiv. <b>eSIM</b> = SIM încorporat, descărcat prin profil."),
  K("APN și depanarea datelor mobile", "APN-ul e ca „poarta” prin care tableta iese din rețeaua operatorului. Dacă e scrisă greșit, tableta are semnal, dar nu are internet/date.", "<b>APN</b> (Access Point Name) = setarea care spune prin ce „poartă” a operatorului ies datele; instituțiile folosesc adesea un <b>APN privat</b> care duce direct în rețeaua lor. Depanare: semnal/bare? → date mobile pornite, mod avion oprit? → <b>APN corect</b>? → SIM activ (nu blocat PIN/PUK, abonament activ)? → repornire. Flota de tablete se administrează centralizat prin <b>MDM</b> (Mobile Device Management): aplicații, politici, ștergere la distanță; datele sensibile trec prin <b>VPN</b>. Exemplu public: tabletele din ambulanțele SMURD (proiect STS) transmit electronic fișa pacientului și, la nevoie, imagini video la dispecerat.", EX("PIN/PUK, IMEI vs IMSI/ICCID, APN greșit = semnal fără date.")),
]);
L("sts", 2, "TETRA și radioul digital profesional", "📻", /TETRA|DMO|TMO|ISSI|GSSI|apel de grup|grup de vorbire|talkgroup|buton de urgenț|TEA|criptar|stați[ae] de baz|terminal (portabil|mobil|fix)|PMR|DMR|ETSI|interoperab/i, [
  K("Un „telefon de grup” pentru echipaje", "Cu un telefon suni o persoană. Cu o stație TETRA apeși un buton și te aud imediat toți colegii din grup (de exemplu toate echipajele dintr-un oraș), iar dispeceratul vede cine vorbește.", "<b>TETRA</b> (Terrestrial Trunked Radio) = standard <b>ETSI</b> de radio digital profesional pentru servicii de siguranță publică. În Europa, siguranța publică lucrează în jur de <b>380–400 MHz</b>; canale de <b>25 kHz</b> cu <b>4 intervale de timp (TDMA)</b>. STS administrează <b>platforma unică TETRA</b> din România, folosită de structuri precum Poliția, ISU/SMURD, Ambulanța, Jandarmeria; terminalele propuse se verifică/avizează de STS pentru interoperabilitate."),
  K("Ce știe să facă un terminal TETRA", "E mai mult decât un walkie-talkie: are apel de grup, apel individual, mesaje, GPS și buton roșu de urgență.", "<b>Apel de grup</b> (talkgroup, apeși PTT), apel individual, mesaje scurte (SDS), transmitere de poziție GPS, <b>buton de urgență</b> cu prioritate maximă. <b>TMO</b> (Trunked Mode) = prin stațiile de bază ale rețelei; <b>DMO</b> (Direct Mode) = direct între terminale, fără rețea (ex. în subsol sau zone fără acoperire). Identificatori: <b>ISSI</b> (al terminalului), <b>GSSI</b> (al grupului). Criptare pe interfața radio (TEA) și, opțional, end-to-end. Terminale: <b>portabile</b> (în mână), <b>mobile</b> (în mașină, cu antenă pe caroserie), <b>fixe</b> (în dispecerate/secții).", EX("TETRA = standard ETSI, ~380–400 MHz, 4 sloturi TDMA, TMO vs DMO, apel de grup.")),
]);
L("sts", 3, "Instalarea antenelor la o secție sau un sediu", "🏢", /instal|montaj|catarg|suport|separar|izolare între antene|traseu|trecere|etanș|descărcător|împământ|drip|VSWR|test|recepți|documentaț|fotografi|acoperiș|antenă fix/i, [
  K("Pas cu pas, de la acoperiș la stație", "Ca la montarea unei antene TV, dar cu reguli mai stricte: sus, sigur, etanș, împământat și testat.", "① <b>Evaluarea locului</b>: înălțime, linie de vedere spre stația de bază/repetor, acces sigur pe acoperiș. ② <b>Suport/catarg</b> fixat solid, departe de alte antene (separare pe verticală reduce interferențele). ③ <b>Antena</b> potrivită benzii (de ex. verticală omnidirecțională pentru o stație fixă) și cu <b>aceeași polarizare</b> ca rețeaua. ④ <b>Cablu coaxial de 50 Ω cu pierderi mici, cât mai scurt</b>, prins des, fără îndoiri strânse. ⑤ <b>Conectori N</b> bine montați și <b>etanșați</b> (bandă autovulcanizantă + PVC). ⑥ <b>Împământare</b> la antenă/catarg, <b>descărcător de supratensiune</b> la intrarea în clădire, <b>buclă de scurgere</b>. ⑦ <b>Test</b>: VSWR/return loss, nivel de semnal, apel de probă. ⑧ <b>Documentare</b>: fotografii, măsurători, etichete.", EX("cablul cât mai scurt, conectori etanșați, împământare + descărcător, test VSWR la final.")),
]);
L("sts", 3, "Migrarea de la echipamente vechi la noi", "🔁", /migr|înlocui|vechi|nou|backup|rollback|revenire|fereastr[ăa] de mentenanț|planific|inventar|compatibil|LMDS|analogic|digital|paralel|tranziț|scoatere din uz|casare|documentaț/i, [
  K("Muți casa fără să rămâi pe drumuri", "Când te muți, nu arunci mobila veche înainte să ai unde dormi. La fel, echipamentele vechi se scot abia după ce cele noi merg sigur – mai ales la sisteme care nu au voie să se oprească (112, radio).", "Pași: ① <b>Inventar</b> (ce există, ce conectează, configurații). ② <b>Backup</b> la configurații (<code>show running-config</code> salvat, exporturi). ③ <b>Plan</b> scris: ordinea pașilor, cine face ce, <b>fereastră de mentenanță</b>, anunțarea utilizatorilor. ④ <b>Plan de revenire (rollback)</b> dacă ceva nu merge. ⑤ Instalare și <b>test în paralel</b> cu sistemul vechi, unde se poate. ⑥ Trecerea propriu-zisă, verificare completă (apeluri, date, alarme). ⑦ Etichetare și <b>documentație actualizată</b>; abia apoi scoaterea din uz a vechiului echipament."),
  K("Exemple publice", "Tehnologia îmbătrânește: piesele nu se mai fabrică, iar defectele se înmulțesc.", "Exemplu din documente publice (HG 725/2018): legăturile radio de bandă largă <b>LMDS în banda de 28 GHz</b>, din arhitectura 112 implementată în 2004, nu mai aveau piese și suport, așa că s-a prevăzut o soluție nouă de comunicații pentru amplasamentele SNUAU. Alt exemplu tipic: trecerea de la stații radio <b>analogice</b> la radio <b>digital (TETRA)</b> – se planifică acoperirea, se programează terminalele (grupuri, identificatori) și se instruiesc utilizatorii.", EX("ordinea: inventar → backup → plan + rollback → test în paralel → trecere → documentare.")),
]);

L("sts", 2, "Plan de lecție: administrarea echipamentelor de rețea", "🧑‍🏫", /Plan lecție/, [
  K("Din ce e făcută o rețea", "Gândește-te la o clădire: oamenii (dispozitivele terminale) stau în birouri, holul unui etaj (switch-ul) îi leagă între ei, ușa clădirii (routerul) duce în oraș, iar portarul (firewall-ul) verifică cine intră.", "<b>Dispozitive terminale</b>: PC, laptop, smartphone, servere. <b>Switch</b>: leagă dispozitivele din <b>aceeași</b> rețea, 24/48 de porturi, adrese <b>MAC</b>. <b>Router</b>: leagă rețele <b>diferite</b> (și spre Internet), 2–5 porturi, adrese <b>IP</b>. <b>Firewall</b>: protejează rețeaua de atacuri din Internet. <b>Medii</b>: cupru, fibră (legături rapide switch–switch, server–switch), wireless.", SVG.star()),
  K("Setările unui PC și aplicațiile", "Ca să trimiți o scrisoare îți trebuie adresa ta, codul zonei, oficiul poștal și o agendă de nume – exact ce îi trebuie unui PC.", "<b>IP</b> unic + <b>mască</b> (/28 → 14 gazde, /25 → 126, /24 → 254, /23 → 510) + <b>default gateway</b> (routerul) + <b>DNS</b> (nume → IP); static sau prin <b>DHCP</b> (UDP 67/68). <b>TCP</b> (sigur, 3-way handshake SYN/ACK, cu întârziere: HTTP 80, HTTPS 443, FTP 20/21, SSH 22, Telnet 23) vs. <b>UDP</b> (rapid, pentru voce/video). DNS: 53 (UDP pentru interogări, TCP între servere). VoIP: întârziere &lt; 150 ms, pierderi &lt; 1%, jitter &lt; 30 ms, 50 de pachete/s la 20 ms. Porturi 1–65 535; portul sursă al browserului e aleator. Unicast / multicast / broadcast.", EX("Rolul fiecărui echipament, cele 4 setări IP, gazde pe mască, TCP vs. UDP, porturile uzuale, pragurile VoIP.") + '<div class="fact"><b>🧑‍🏫 Sursa:</b> plan de lecție „Administrarea echipamentelor de rețea” (tema Monitorizarea și administrarea rețelelor) – reformulat.</div>', { }),
], { byE: true });

/* ===== CAPCANE LA EXAMEN ===== */
function TR(h, why, right, mem, extra) { return "<h3>⚠️ " + h + '</h3><div class="eli trapw"><b>De ce greșesc oamenii:</b> ' + why + '</div><div class="fact"><b>📌 Corect:</b> ' + right + "</div>" + (mem ? '<div class="mnemo"><b>🧠 Cum ții minte:</b> ' + mem + "</div>" : "") + (extra || ""); }
L("cap", 1, "Capcane: cabluri, culori și fibră", "🧵", /drept|crossover|încrucișat|T568|568A|568B|portocaliu|verde|monomod|multimod|SM\b|MM\b|galben|aqua|Auto-?MDIX/i, [
  TR("Cablu drept vs. crossover", "rețin „PC–switch = crossover” pentru că „sunt diferite”. E invers: echipamentele <b>diferite</b> se leagă cu cablu <b>drept</b>.", "<b>Drept</b> (straight-through): PC–switch, router–switch, PC–hub. <b>Crossover</b>: echipamente <b>de același fel</b> – PC–PC, switch–switch, router–router și, clasic, <b>PC–router</b> (amândouă „emit” pe aceiași pini). <b>Rollover</b> = cablul de consolă. Azi, <b>Auto-MDIX</b> face ca orice cablu să meargă – dar la examen se cere regula clasică.", "„Diferite → drept; la fel → încrucișat”. PC și router sunt „la fel” (amândouă sunt capete de rețea).", SVG.cables()),
  TR("T568A vs. T568B", "le încurcă pentru că diferă doar două perechi; sau cred că „B e mai rapid”.", "Ordinea pinilor 1–8: <b>T568B</b> = alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro. <b>T568A</b> = schimbă între ele perechea <b>portocalie</b> cu cea <b>verde</b>. Viteza e aceeași. Cablu <b>drept</b> = același standard la ambele capete; <b>crossover</b> = A la un capăt, B la celălalt.", "T568B e cel mai folosit și începe cu <b>alb-portocaliu</b>; T568A începe cu <b>alb-verde</b> – în rest, albastrul și maroul stau pe loc.", SVG.t568()),
  TR("Fibră monomod vs. multimod", "cred că „multimod = mai bun, are mai multe moduri”, sau încurcă diametrele.", "<b>Monomod (SM)</b>: miez ~<b>9 µm</b>, laser 1310/1550 nm, distanțe <b>mari</b> (zeci de km), mantaua exterioară (culoarea) de obicei <b>galbenă</b>. <b>Multimod (MM)</b>: miez <b>50 sau 62,5 µm</b>, 850/1300 nm, distanțe <b>scurte</b> (sute de m), manta portocalie (OM1/OM2) sau aqua (OM3/OM4). Atenție: <b>125 µm</b> e învelișul de sticlă (cladding) din jurul miezului, la ambele – NU mantaua exterioară colorată (aceea are ~0,9–3 mm).", "„Mono = o singură bandă, drumul cel mai lung fără ambuteiaj.”"),
]);
L("cap", 1, "Capcane: echipamente, adrese și straturi", "🧱", /hub|switch|router|MAC|adres[ăa] fizic|adres[ăa] logic|strat|nivel(ul)? OSI|layer|bridge|repetor|access point|firewall|ARP|ICMP|HTTP|Ethernet|IP\b/i, [
  TR("Hub vs. switch vs. router", "pun hub-ul și switch-ul la același nivel, sau cred că switch-ul „rutează”.", "<b>Hub</b> (stratul 1, fizic): repetă semnalul pe <b>toate</b> porturile, un singur domeniu de coliziune. <b>Switch</b> (stratul 2, legătură de date): trimite cadrul doar pe portul unde e <b>adresa MAC</b> destinație; fiecare port = domeniu de coliziune separat. <b>Router</b> (stratul 3, rețea): leagă <b>rețele diferite</b> după <b>adresa IP</b> și separă domeniile de broadcast.", "Hub = megafon; switch = poștaș în bloc (după numele de pe ușă = MAC); router = poștaș între orașe (după adresă = IP)."),
  TR("Adresa MAC vs. adresa IP", "le consideră la fel sau cred că MAC-ul se schimbă de la o rețea la alta.", "<b>MAC</b>: adresă <b>fizică</b>, 48 de biți, scrisă în hex (ex. 00:1A:2B:3C:4D:5E), „arsă” în placa de rețea, folosită în rețeaua locală (stratul 2). <b>IP</b>: adresă <b>logică</b>, IPv4 pe 32 de biți (ex. 192.168.1.10), dată de administrator sau DHCP, se schimbă când muți aparatul; folosită pentru rutare (stratul 3). <b>ARP</b> află MAC-ul pornind de la IP.", "MAC = CNP-ul plăcii (nu se schimbă); IP = adresa de domiciliu (se schimbă când te muți)."),
  TR("Pe ce strat OSI lucrează fiecare?", "pun TCP la stratul 3 sau IP la stratul 4; încurcă prezentarea cu sesiunea.", "7 Aplicație: HTTP, DNS, FTP, SMTP, DHCP · 6 Prezentare: codare, criptare, compresie · 5 Sesiune · 4 Transport: <b>TCP, UDP</b> (porturi, segmente) · 3 Rețea: <b>IP, ICMP</b>, router (pachete) · 2 Legătură de date: <b>Ethernet, MAC, switch</b>, bridge (cadre) · 1 Fizic: cabluri, hub, repetor, biți. <b>ARP</b> stă între 2 și 3 (de obicei trecut la stratul 2).", "De jos în sus: „<b>F</b>ata <b>L</b>ui <b>R</b>adu <b>T</b>ine <b>S</b>ecretul <b>P</b>rintr-o <b>A</b>plicație” (Fizic, Legătură, Rețea, Transport, Sesiune, Prezentare, Aplicație).", SVG.osi()),
]);
L("cap", 2, "Capcane: protocoale, porturi și adrese IP", "🔢", /TCP|UDP|port|privat|RFC ?1918|10\.|172\.|192\.168|broadcast|adres[ăa] de rețea|host|IPv6|::|zero|comprim|prescurt/i, [
  TR("TCP vs. UDP", "cred că UDP e „nesigur deci inutil” sau că TCP e mai rapid.", "<b>TCP</b>: <b>orientat pe conexiune</b> (three-way handshake SYN, SYN-ACK, ACK), confirmă, retransmite, ordonează – web, e-mail, SSH, FTP. <b>UDP</b>: <b>fără conexiune</b>, fără confirmări, antet mic, <b>mai rapid</b> – voce/video (RTP), DNS (interogări), DHCP, TFTP, SNMP, streaming.", "TCP = scrisoare recomandată (cu confirmare); UDP = carte poștală (o arunci și speri să ajungă).", SVG.handshake()),
  TR("Numerele de port", "încurcă 22/23, 20/21, 67/68, 110/143.", "FTP <b>20</b> (date)/<b>21</b> (control) · SSH <b>22</b> · Telnet <b>23</b> · SMTP <b>25</b> · DNS <b>53</b> · DHCP <b>67</b> (server)/<b>68</b> (client) · TFTP <b>69</b> · HTTP <b>80</b> · POP3 <b>110</b> · NTP <b>123</b> · IMAP <b>143</b> · SNMP <b>161</b> · HTTPS <b>443</b> · RDP <b>3389</b> · SIP <b>5060</b>.", "22 = SSH „sigur” (doi de 2, dublă protecție), 23 = Telnet „în clar”. 80 → HTTP, adaugi „S” și sari la 443."),
  TR("Adresa de rețea vs. broadcast", "dau ca răspuns pentru „primul host” chiar adresa de rețea, sau uită că broadcast-ul nu se dă unui PC.", "Într-o subrețea: <b>prima adresă = adresa de rețea</b> (toți biții de host 0), <b>ultima = broadcast</b> (toți biții de host 1) – <b>niciuna nu se dă unui calculator</b>. Ex. 192.168.1.0/26: rețea .0, host-uri .1–.62, broadcast .63. Host-uri = 2<sup>h</sup> − 2.", "Ca la un bloc: numărul blocului (rețeaua) și interfonul general (broadcast) nu sunt apartamente."),
  TR("Intervalele IP private", "cred că tot 172.x.x.x e privat, sau că 169.254 e privat RFC 1918.", "Private (RFC 1918): <b>10.0.0.0/8</b>, <b>172.16.0.0/12</b> = doar <b>172.16.0.0 – 172.31.255.255</b>, <b>192.168.0.0/16</b>. Separat: <b>127.0.0.0/8</b> = loopback; <b>169.254.0.0/16</b> = APIPA (link-local), nu sunt RFC 1918.", "„10, 172 de la 16 la 31, 192.168” – și atât."),
  TR("Prescurtarea adreselor IPv6", "folosesc „::” de două ori sau taie zerourile de la sfârșitul unui grup.", "Reguli: ① în fiecare grup se pot omite <b>zerourile din față</b> (0db8 → db8, dar <b>nu</b> cele de la final: 2000 rămâne 2000). ② <b>O singură dată</b> pe adresă, un șir de grupuri de 0 consecutive se înlocuiește cu <b>::</b>. Ex. 2001:0db8:0000:0000:0000:ff00:0042:8329 → <b>2001:db8::ff00:42:8329</b>.", "„Zerourile din FAȚĂ pleacă; :: doar O dată.”"),
]);
L("cap", 2, "Capcane: electricitate și decibeli", "⚡", /dBm|\bdB\b|mW|voltmetr|ampermetr|paralel|serie|efectiv|vârf|RMS|325|230|valoare/i, [
  TR("dB vs. dBm", "scriu „+3 dBm înseamnă dublu” sau adună dBm cu dBm.", "<b>dB</b> = <b>raport</b> (cât de mult crește/scade): +3 dB ≈ dublu, +10 dB = ×10. <b>dBm</b> = putere <b>absolută</b> față de 1 mW: 0 dBm = 1 mW, 30 dBm = 1 W. Corect: <b>dBm ± dB = dBm</b> (20 dBm + 3 dB = 23 dBm). Nu aduni două puteri în dBm (10 dBm + 10 dBm nu fac 20 dBm, ci ≈ 13 dBm).", "dB = „cu cât”; dBm = „cât” (are o unitate de referință: miliwattul).", SVG.db()),
  TR("Voltmetru în paralel, ampermetru în serie", "leagă ampermetrul ca pe voltmetru, direct pe priză – scurtcircuit!", "<b>Voltmetrul</b> se pune <b>în paralel</b> (cele două sonde pe cele două puncte) și are rezistență internă foarte <b>mare</b>. <b>Ampermetrul</b> se pune <b>în serie</b> (circuitul se desface și curentul trece prin aparat) și are rezistență foarte <b>mică</b> – de aceea, pus în paralel pe o sursă, face scurtcircuit. Fără desfacerea circuitului → <b>clește ampermetric</b>.", "Ampermetrul „A” stă „Alături în șir” (serie); Voltmetrul stă „Vizavi” (paralel)."),
  TR("230 V efectiv vs. 325 V de vârf", "cred că tensiunea maximă a prizei e 230 V, sau că 230 V e o medie oarecare.", "230 V este valoarea <b>efectivă (RMS)</b> – cea care încălzește un rezistor la fel ca 230 V DC. Sinusoida urcă de fapt până la <b>U<sub>vârf</sub> = U<sub>ef</sub> · √2 ≈ 325 V</b> (și −325 V). Vârf la vârf ≈ 650 V. Frecvența 50 Hz → perioada 20 ms.", "„Eficient” × 1,41 = „vârf”. 230 × 1,41 ≈ 325.", SVG.acdc()),
]);

/* ===== BAZELE ESENȚIALE (lacunele din testul de nivel) ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 12) + '" font-weight="' + (o.w || 400) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 6 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "none") + '" stroke-width="' + (o.sw || 1) + '"/>'; }
  function l(x1, y1, x2, y2, c, w, d) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#14213d") + '" stroke-width="' + (w || 2) + '"' + (d ? ' stroke-dasharray="' + d + '"' : "") + "/>"; }

  /* Switch-ul și tabela MAC */
  SVG.macTable = function () {
    var g = r(20, 70, 200, 40, "#14213d") + t(120, 95, "SWITCH", { f: "#fff", w: 800, s: 13 });
    var px = [55, 120, 185], nm = ["A", "B", "C"], col = ["#2563eb", "#16a34a", "#d97706"];
    for (var i = 0; i < 3; i++) {
      g += r(px[i] - 9, 104, 18, 6, "#fde047", { rx: 1 }) + l(px[i], 110, px[i], 160, col[i], 3);
      g += t(px[i] + 4, 140, "port " + (i + 1), { a: "start", s: 9, f: "#475569" });
      g += r(px[i] - 26, 160, 52, 34, col[i]) + t(px[i], 182, "PC " + nm[i], { f: "#fff", w: 700 });
    }
    g += t(120, 24, "Switch-ul învață: citește MAC-ul SURSĂ", { s: 11, w: 700 }) + t(120, 40, "al fiecărui cadru și îl notează lângă port.", { s: 11 });
    g += t(120, 214, "Destinație cunoscută → doar pe portul ei.", { s: 10.5, w: 700 }) + t(120, 230, "Necunoscută → pe toate porturile (flooding).", { s: 10.5 });
    g += r(240, 14, 230, 30, "#e0e7ff", { st: "#4338ca", rx: 4 }) + t(355, 34, "Tabela MAC (CAM) a switch-ului", { s: 11.5, w: 800 });
    g += t(262, 64, "Port", { a: "start", w: 700, s: 11 }) + t(320, 64, "Adresa MAC (48 biți, hex)", { a: "start", w: 700, s: 11 }) + l(240, 70, 470, 70, "#94a3b8", 1);
    var mac = ["00:1A:2B:00:00:0A", "00:1A:2B:00:00:0B", "00:1A:2B:00:00:0C"];
    for (i = 0; i < 3; i++) { var y = 92 + i * 26; g += r(244, y - 15, 222, 22, i % 2 ? "#f8fafc" : "#eef2ff", { rx: 3 }) + t(266, y, String(i + 1), { a: "start", w: 800, f: col[i] }) + t(320, y, mac[i], { a: "start", s: 11.5, f: col[i], w: 700 }); }
    g += t(355, 186, "00:1A:2B = producătorul (OUI)", { s: 10.5, w: 700 }) + t(355, 202, "00:00:0A = numărul plăcii", { s: 10.5 });
    g += t(355, 224, "6 octeți = 12 cifre hex = 48 de biți", { s: 10.5, w: 700, f: "#4338ca" });
    return W("0 0 480 240", g, "Switch-ul trimite cadrele după adresa MAC, folosind tabela învățată");
  };

  /* IPv4 – 4 octeți */
  SVG.ipv4 = function () {
    var v = ["192", "168", "1", "10"], b = ["11000000", "10101000", "00000001", "00001010"], c = ["#2563eb", "#16a34a", "#d97706", "#db2777"], g = "";
    g += t(240, 20, "O adresă IPv4 = 4 octeți separați prin puncte", { w: 800, s: 13 });
    for (var i = 0; i < 4; i++) {
      var x = 18 + i * 114;
      g += r(x, 34, 100, 44, c[i]) + t(x + 50, 63, v[i], { f: "#fff", w: 800, s: 20 });
      if (i < 3) g += t(x + 107, 66, ".", { w: 800, s: 26 });
      g += t(x + 50, 96, "octetul " + (i + 1), { s: 11, w: 700, f: c[i] }) + t(x + 50, 112, b[i], { s: 11, f: "#334155" }) + t(x + 50, 127, "8 biți · 0–255", { s: 10, f: "#475569" });
    }
    g += r(18, 140, 444, 26, "#fef9c3", { st: "#ca8a04", rx: 4 }) + t(240, 158, "4 octeți × 8 biți = 32 de biți   (MAC: 6 octeți = 48 biți · IPv6: 128 biți)", { s: 11, w: 700 });
    g += t(24, 190, "✔ 10.0.0.1", { a: "start", s: 12, w: 700, f: "#15803d" }) + t(150, 190, "✘ 192.168.1.256  (256 > 255)", { a: "start", s: 12, w: 700, f: "#b91c1c" });
    g += t(24, 212, "✔ 172.16.5.20", { a: "start", s: 12, w: 700, f: "#15803d" }) + t(150, 212, "✘ 192.168.1  (doar 3 octeți)   ✘ 1.2.3.4.5", { a: "start", s: 12, w: 700, f: "#b91c1c" });
    return W("0 0 480 222", g, "IPv4: patru numere de la 0 la 255, fiecare pe 8 biți");
  };

  /* Regula cablurilor după tipul echipamentului */
  SVG.cableRule = function () {
    var g = r(10, 30, 180, 120, "#dbeafe", { st: "#2563eb" }) + t(100, 50, "GRUPA 1 – „capete”", { w: 800, s: 12, f: "#1d4ed8" });
    ["PC / laptop", "Server", "Router", "Imprimantă de rețea"].forEach(function (s, i) { g += t(100, 74 + i * 20, s, { s: 12 }); });
    g += r(290, 30, 180, 120, "#dcfce7", { st: "#16a34a" }) + t(380, 50, "GRUPA 2 – „centru”", { w: 800, s: 12, f: "#15803d" });
    ["Switch", "Hub"].forEach(function (s, i) { g += t(380, 84 + i * 22, s, { s: 12 }); });
    g += l(190, 90, 290, 90, "#14213d", 3) + r(203, 64, 74, 20, "#14213d", { rx: 10 }) + t(240, 78, "DREPT", { f: "#fff", w: 800, s: 11 });
    g += t(240, 108, "grupe diferite", { s: 10, f: "#475569" });
    g += '<path d="M60,150 C60,190 140,190 140,150" fill="none" stroke="#dc2626" stroke-width="3"/>' + '<path d="M340,150 C340,190 420,190 420,150" fill="none" stroke="#dc2626" stroke-width="3"/>';
    g += t(100, 202, "CROSSOVER", { w: 800, s: 11, f: "#b91c1c" }) + t(380, 202, "CROSSOVER", { w: 800, s: 11, f: "#b91c1c" });
    g += t(100, 216, "PC–PC, PC–router, router–router", { s: 9.5 }) + t(380, 216, "switch–switch, switch–hub", { s: 9.5 });
    g += t(240, 14, "Regula clasică (fără Auto-MDIX): DIFERITE → drept · LA FEL → crossover", { s: 11, w: 800 });
    g += r(10, 228, 460, 24, "#e0f2fe", { st: "#0284c7", rx: 4 }) + t(240, 244, "PC → portul „Console” al unui switch/router = ROLLOVER (cablul albastru de consolă)", { s: 10.5, w: 700 });
    return W("0 0 480 258", g, "Ce cablu UTP alegi: te uiți din ce grupă face parte fiecare capăt");
  };

  /* Culorile fibrei */
  SVG.fiberColors = function () {
    var g = t(120, 18, "Mantaua patch-cordului", { w: 800, s: 12 }) + t(360, 18, "Culoarea conectorului", { w: 800, s: 12 });
    var j = [["#facc15", "MONOMOD (OS1/OS2)", "galben · distanțe mari (km)"], ["#f97316", "Multimod OM1/OM2", "portocaliu · sute de metri"], ["#22d3ee", "Multimod OM3/OM4", "aqua (OM4 uneori violet)"], ["#a3e635", "Multimod OM5", "verde-lime"]];
    j.forEach(function (x, i) { var y = 32 + i * 46; g += r(10, y, 34, 34, x[0], { st: "#334155", rx: 4 }) + t(52, y + 15, x[1], { a: "start", s: 11.5, w: 700 }) + t(52, y + 30, x[2], { a: "start", s: 10.5, f: "#334155" }); });
    var k = [["#2563eb", "albastru", "monomod UPC (lustruit drept)"], ["#16a34a", "verde", "monomod APC (lustruit la 8°)"], ["#e7d7b8", "bej", "multimod OM1/OM2"], ["#22d3ee", "aqua", "multimod OM3/OM4"]];
    k.forEach(function (x, i) { var y = 32 + i * 46; g += r(252, y + 4, 30, 26, x[0], { st: "#334155", rx: 3 }) + t(290, y + 15, x[1], { a: "start", s: 11.5, w: 700 }) + t(290, y + 30, x[2], { a: "start", s: 10.5, f: "#334155" }); });
    g += r(10, 218, 460, 40, "#fef9c3", { st: "#ca8a04", rx: 4 }) + t(240, 234, "Truc: GALBEN = monomod = „Mono merge departe”.", { s: 11, w: 700 }) + t(240, 250, "Verde (APC) nu se cuplează niciodată cu albastru (UPC)!", { s: 11, w: 700, f: "#b91c1c" });
    return W("0 0 480 264", g, "Fibra după culoare (codurile uzuale TIA-598 / TIA-568)");
  };

  /* Triunghiul legii lui Ohm */
  SVG.ohmTri = function () {
    var g = '<polygon points="120,14 220,184 20,184" fill="#fef3c7" stroke="#b45309" stroke-width="3"/>' + l(54, 126, 186, 126, "#b45309", 3) + l(120, 126, 120, 184, "#b45309", 3);
    g += t(120, 98, "U", { s: 34, w: 800, f: "#b91c1c" }) + t(80, 168, "I", { s: 30, w: 800, f: "#1d4ed8" }) + t(160, 168, "R", { s: 30, w: 800, f: "#15803d" });
    g += t(120, 200, "linia orizontală = ÎMPARTE", { s: 10, w: 700 }) + t(120, 214, "I și R alăturate = ÎNMULȚEȘTE", { s: 10, w: 700 });
    g += t(250, 28, "Acoperă cu degetul ce cauți:", { a: "start", s: 12, w: 800 });
    g += r(248, 40, 222, 40, "#eff6ff", { st: "#1d4ed8", rx: 6 }) + t(258, 58, "Cauți I (curentul):", { a: "start", s: 11, w: 700, f: "#1d4ed8" }) + t(258, 74, "I = U ÷ R   (împarți!)", { a: "start", s: 13, w: 800 });
    g += r(248, 88, 222, 40, "#f0fdf4", { st: "#15803d", rx: 6 }) + t(258, 106, "Cauți R (rezistența):", { a: "start", s: 11, w: 700, f: "#15803d" }) + t(258, 122, "R = U ÷ I   (împarți!)", { a: "start", s: 13, w: 800 });
    g += r(248, 136, 222, 40, "#fef2f2", { st: "#b91c1c", rx: 6 }) + t(258, 154, "Cauți U (tensiunea):", { a: "start", s: 11, w: 700, f: "#b91c1c" }) + t(258, 170, "U = R × I   („URI”)", { a: "start", s: 13, w: 800 });
    g += t(359, 200, "Doar pentru U se înmulțește!", { s: 11, w: 800, f: "#b91c1c" });
    return W("0 0 480 222", g, "Triunghiul legii lui Ohm: U sus, I și R jos");
  };

  /* Ampermetrul în serie, voltmetrul în paralel */
  SVG.meters = function () {
    function M(x, y, s, c) { return '<circle cx="' + x + '" cy="' + y + '" r="17" fill="#fff" stroke="' + c + '" stroke-width="3"/>' + t(x, y + 6, s, { s: 16, w: 800, f: c }); }
    var g = "";
    // baterie
    g += l(40, 80, 40, 112) + l(26, 112, 54, 112, "#14213d", 4) + l(32, 120, 48, 120, "#14213d", 4) + l(40, 120, 40, 180) + t(16, 108, "+", { s: 14, w: 800 }) + t(16, 132, "−", { s: 14, w: 800 }) + t(22, 150, "12 V", { s: 10, a: "start" });
    // fir sus cu ampermetru
    g += l(40, 80, 40, 40) + l(40, 40, 103, 40) + M(120, 40, "A", "#1d4ed8") + l(137, 40, 260, 40) + l(260, 40, 260, 86);
    // bec
    g += '<circle cx="260" cy="110" r="22" fill="#fde047" stroke="#a16207" stroke-width="2"/>' + t(260, 115, "bec", { s: 11, w: 700 });
    g += l(260, 132, 260, 180) + l(260, 180, 40, 180);
    // voltmetru in paralel pe bec
    g += l(260, 62, 330, 62, "#b91c1c", 2) + l(330, 62, 330, 93, "#b91c1c", 2) + M(330, 110, "V", "#b91c1c") + l(330, 127, 330, 158, "#b91c1c", 2) + l(330, 158, 260, 158, "#b91c1c", 2);
    g += '<circle cx="260" cy="62" r="3.5" fill="#b91c1c"/><circle cx="260" cy="158" r="3.5" fill="#b91c1c"/>';
    g += t(120, 18, "AMPERMETRU în SERIE", { s: 11.5, w: 800, f: "#1d4ed8" }) + t(120, 70, "curentul trece PRIN el", { s: 10, f: "#1d4ed8" });
    g += t(410, 96, "VOLTMETRU", { s: 11.5, w: 800, f: "#b91c1c" }) + t(410, 112, "în PARALEL", { s: 11.5, w: 800, f: "#b91c1c" }) + t(410, 128, "pe cele 2 capete", { s: 10, f: "#b91c1c" });
    g += r(10, 196, 460, 44, "#f8fafc", { st: "#94a3b8", rx: 4 });
    g += t(240, 213, "Ampermetrul are rezistență ~0 → pus în paralel pe o sursă = SCURTCIRCUIT!", { s: 10.5, w: 700, f: "#b91c1c" });
    g += t(240, 230, "Voltmetrul are rezistență foarte mare → nu „fură” curent din circuit.", { s: 10.5, w: 700 });
    return W("0 0 480 246", g, "Cum se leagă aparatele: A în serie, V în paralel");
  };
})();
L("baz", 1, "Switch-ul și adresa MAC", "🔀", /switch|MAC|cadru|tabel|hub|OUI|hexa|48|flood/i, [
  K("Ce face un switch, pe scurt", "Switch-ul e ca portarul unui bloc care știe pe ce ușă stă fiecare locatar. Când vine un plic, nu-l strigă pe tot holul (asta făcea hub-ul), ci îl duce direct la ușa potrivită. „Numele de pe ușă” este <b>adresa MAC</b>.", "Switch-ul leagă calculatoarele din <b>aceeași rețea locală</b> (LAN). Lucrează la <b>stratul 2</b> (legătură de date) și trimite <b>cadre</b> după <b>adresa MAC destinație</b>. Fiecare port al lui este un domeniu de coliziune separat. Pentru a lega <b>rețele diferite</b> folosești <b>routerul</b> (după adresa IP) – asta știai deja!", SVG.macTable()),
  K("Cum își învață switch-ul tabela", "La început switch-ul nu știe pe nimeni. De fiecare dată când un calculator „vorbește”, switch-ul se uită cine a trimis și notează: „A stă la portul 1”.", "① Primește un cadru → citește <b>MAC-ul SURSĂ</b> și îl scrie în <b>tabela MAC</b> (CAM) lângă portul pe care a venit. ② Caută <b>MAC-ul DESTINAȚIE</b> în tabelă: dacă îl găsește → trimite <b>doar pe acel port</b>; dacă nu-l găsește (sau e broadcast FF:FF:FF:FF:FF:FF) → trimite pe <b>toate celelalte porturi</b> (<i>flooding</i>). ③ Intrările vechi se șterg după un timp (implicit 300 s la Cisco)."),
  K("Cum arată o adresă MAC", "MAC-ul e ca seria de șasiu a unei mașini: e pusă din fabrică pe placa de rețea și nu ține de locul unde te afli.", "<b>48 de biți = 6 octeți</b>, scriși ca <b>12 cifre hexazecimale</b> (0–9 și A–F): 00:1A:2B:3C:4D:5E sau 00-1A-2B-3C-4D-5E sau 001A.2B3C.4D5E (stil Cisco). Primii 3 octeți = <b>OUI</b>, codul producătorului; ultimii 3 = numărul plăcii. Literele G–Z <b>nu</b> apar niciodată (nu sunt cifre hex).", EX("„După ce adresă lucrează switch-ul?” → MAC. „Câți biți are MAC-ul?” → 48. „Ce face switch-ul cu o destinație necunoscută?” → flooding pe toate porturile, mai puțin cel de intrare.")),
]);
L("baz", 1, "Adresa IPv4: 4 octeți", "🔢", /IPv4|octet|32 de biți|255|256|zecimal|punct|binar|192\.168|172\.16|masc/i, [
  K("Patru numere cu puncte între ele", "O adresă IPv4 e ca o adresă poștală în 4 bucăți: țara.orașul.strada.numărul. Fiecare bucată e un număr de la <b>0 la 255</b>.", "IPv4 = <b>32 de biți</b>, împărțiți în <b>4 octeți</b> (un octet = 8 biți), scriși în <b>zecimal cu puncte</b>: 192.168.1.10. Un octet are 8 biți, deci 2⁸ = <b>256 de valori: 0…255</b>. Orice număr peste 255 face adresa <b>invalidă</b>.", SVG.ipv4()),
  K("De ce exact 255?", "Un octet e ca 8 becuri care pot fi aprinse (1) sau stinse (0). Toate aprinse = 11111111 = cel mai mare număr care încape.", "Valorile pozițiilor din octet: 128 64 32 16 8 4 2 1. Toate aprinse: 128+64+32+16+8+4+2+1 = <b>255</b>. Ex.: 192 = 128+64 → 11000000; 168 = 128+32+8 → 10101000; 10 = 8+2 → 00001010."),
  K("Rețea și host – ce face masca", "Ca la o adresă: o parte spune „ce stradă” (rețeaua), restul „ce număr de casă” (calculatorul).", "Adresa IPv4 are o <b>parte de rețea</b> și o <b>parte de host</b>; granița o dă <b>masca de subrețea</b>. 255.255.255.0 = /24 = primii 3 octeți (24 de biți) sunt rețeaua, ultimul octet e host-ul. IP-ul îl dă administratorul sau DHCP-ul și <b>se schimbă</b> când muți aparatul în altă rețea – spre deosebire de MAC.", EX("„Câți octeți / biți are IPv4?” → 4 octeți, 32 de biți. „Care adresă e invalidă?” → cea cu un număr peste 255 sau cu alt număr de octeți decât 4. Compară: MAC 48 biți (hex), IPv6 128 biți (hex).")),
]);
L("baz", 1, "Ce cablu UTP alegi: regula grupelor", "🔌", /drept|crossover|încrucișat|rollover|consol|MDIX|cablu|pinii|568/i, [
  K("Regula care nu se mai uită", "Împarte echipamentele în două grupe: <b>„capete”</b> (PC, server, router, imprimantă) și <b>„centru”</b> (switch, hub). Dacă legi două lucruri din <b>grupe diferite</b> → cablu <b>drept</b>. Dacă sunt din <b>aceeași grupă</b> → cablu <b>încrucișat (crossover)</b>.", "De ce? Capetele (MDI) <b>emit pe pinii 1-2</b> și ascultă pe 3-6; switch-ul/hub-ul (MDI-X) face invers. Între grupe diferite, „gura” unuia ajunge deja la „urechea” celuilalt → drept. Între două aparate la fel, ar emite amândouă pe aceiași pini → trebuie încrucișat 1-2 ↔ 3-6.", SVG.cableRule()),
  K("Exemple de examen", "Întreabă-te mereu: „din ce grupă e fiecare capăt?”", "PC–switch: <b>drept</b> · router–switch: <b>drept</b> · server–switch: <b>drept</b> · PC–PC: <b>crossover</b> · switch–switch: <b>crossover</b> · switch–hub: <b>crossover</b> · router–router: <b>crossover</b> · PC–router (direct, port Ethernet): <b>crossover</b> · PC → portul Console: <b>rollover</b> (pinii inversați complet 1↔8).", EX("„PC–router” e capcana preferată: mulți zic „drept, că sunt diferite”. NU – amândouă sunt „capete” (grupa 1) → crossover.")),
  K("Cum faci fizic cablurile", "Același „model” de culori la ambele capete = drept; modele diferite = încrucișat.", "<b>Drept</b>: T568B–T568B (sau A–A). <b>Crossover</b>: T568A la un capăt, T568B la celălalt. <b>Rollover</b>: ordinea complet inversată. Azi majoritatea porturilor au <b>Auto-MDIX</b> și merge orice cablu UTP – dar la examen se cere regula clasică."),
]);
L("baz", 1, "Fibra optică după culori", "🌈", /galben|portocaliu|aqua|culoare|culori|OM[1-5]|OS[12]|monomod|multimod|APC|UPC|verde|albastr|bej|lime|violet/i, [
  K("Culoarea îți spune tipul fibrei", "În rack vezi mai multe patch-corduri colorate. Nu sunt „pentru frumusețe”: <b>galben = monomod</b>, portocaliu sau aqua = multimod.", "<b>Monomod (SM, OS1/OS2)</b>: manta <b>galbenă</b>, miez ~9 µm, laser 1310/1550 nm, distanțe de <b>kilometri</b>. <b>Multimod</b>: OM1/OM2 <b>portocaliu</b>, OM3/OM4 <b>aqua</b> (OM4 apare și violet), OM5 <b>verde-lime</b>; miez 50 sau 62,5 µm, distanțe de <b>sute de metri</b>.", SVG.fiberColors()),
  K("Culoarea conectorului", "Conectorul are și el un „cod”: albastru, verde, bej sau aqua.", "<b>Albastru</b> = monomod <b>UPC</b> (fața lustruită drept). <b>Verde</b> = monomod <b>APC</b> (fața tăiată la 8°, reflexie foarte mică – folosit în GPON/CATV). <b>Bej</b> = multimod OM1/OM2. <b>Aqua</b> = multimod OM3/OM4. Verde nu se cuplează cu albastru!"),
  K("Mnemonic", "„<b>Mono</b> merge <b>departe</b>, ca un <b>taxi galben</b> pe autostradă; multimodul e ca un <b>autobuz portocaliu</b> de oraș – multe drumuri, distanțe scurte.”", "SM = single-mode, MM = multi-mode. Atenție: <b>125 µm</b> e învelișul de sticlă (cladding) din jurul miezului, la ambele – NU mantaua exterioară colorată (aceea are ~0,9–3 mm); diferă <b>miezul</b>.", EX("„Ce culoare are de obicei fibra monomod?” → galben. „Conector verde?” → APC. „OM3?” → aqua.")),
]);
L("baz", 2, "Legea lui Ohm: triunghiul (când împarți?)", "🔺", /Ohm|împar|înmul|amper|curent|rezisten|tensiun|Ω|URI|triunghi/i, [
  K("Greșeala de la testul de nivel", "La curent ai înmulțit în loc să împarți. Gândește-te la apă: <b>presiunea</b> (U) împinge apa, <b>țeava îngustă</b> (R) o frânează. Mai multă presiune → mai multă apă (I crește); țeavă mai îngustă → mai puțină apă (I scade). Deci R trebuie să fie <b>jos, la împărțire</b>: <b>I = U ÷ R</b>.", "Legea lui Ohm: <b>U = R · I</b> (mnemonic „<b>URI</b>”). De aici: <b>I = U / R</b> și <b>R = U / I</b>. Unități: U în volți (V), I în amperi (A), R în ohmi (Ω).", SVG.ohmTri()),
  K("Pas cu pas: 4 exemple mici", "Scrie mereu: ① ce știu, ② ce caut, ③ formula din triunghi, ④ calculul, ⑤ unitatea.", "<b>a)</b> 12 V pe 4 Ω → caut I → I = U/R = 12/4 = <b>3 A</b> (nu 48!).<br><b>b)</b> 230 V pe un bec de 460 Ω → I = 230/460 = <b>0,5 A</b>.<br><b>c)</b> 2 A prin 10 Ω → caut U → U = R·I = 10·2 = <b>20 V</b>.<br><b>d)</b> 24 V și 2 A → caut R → R = U/I = 24/2 = <b>12 Ω</b>."),
  K("Verificarea de bun-simț", "Dacă îți iese un curent uriaș (mii de amperi) dintr-o priză și un bec, ai greșit – o siguranță de casă sare la 16 A.", "Test rapid: <b>tensiune mai mare → curent mai mare</b>; <b>rezistență mai mare → curent mai mic</b>. Dacă formula ta face ca un R mai mare să dea un I mai mare, ai înmulțit greșit. Atenție la prefixe: 1 kΩ = 1000 Ω, 20 mA = 0,02 A.", EX("Exerciții cu „calculați curentul / rezistența / tensiunea”. Doar pentru <b>U</b> se înmulțește; pentru <b>I</b> și <b>R</b> se împarte.")),
]);
L("baz", 2, "Serie, paralel și cum legi aparatele", "🔁", /serie|paralel|ampermetr|voltmetr|clește|măsur|sond|bec|priz|domeniu/i, [
  K("Serie vs. paralel", "<b>Serie</b> = becurile stau unul după altul pe același fir, ca vagoanele unui tren: dacă se rupe unul, se oprește tot. <b>Paralel</b> = fiecare bec are drumul lui, ca benzile unei autostrăzi: prizele din casă sunt în paralel.", "<b>Serie</b>: același <b>curent</b> prin toate; R<sub>total</sub> = R1 + R2 (crește); tensiunea se împarte. <b>Paralel</b>: aceeași <b>tensiune</b> pe toate; R<sub>total</sub> mai mică decât cea mai mică (două egale → jumătate); curenții se adună.", SVG.serpar()),
  K("Ampermetrul în SERIE, voltmetrul în PARALEL", "Ca să numeri mașinile de pe un drum, stai <b>pe drum</b> (serie) – asta face ampermetrul. Ca să compari înălțimea a două dealuri, te uiți la <b>ambele capete</b> deodată (paralel) – asta face voltmetrul.", "<b>Ampermetrul</b> (curent, A): se pune <b>în serie</b> – desfaci circuitul și curentul trece prin aparat; are rezistență aproape <b>zero</b>. <b>Voltmetrul</b> (tensiune, V): se pune <b>în paralel</b> – sondele pe cele două puncte; rezistență foarte <b>mare</b>. Fără să desfaci firul → <b>clește ampermetric</b> pe <b>un singur</b> conductor.", SVG.meters()),
  K("Greșeala periculoasă", "Ampermetrul are rezistență ~0. Dacă îl bagi direct în priză (în paralel), e ca și cum ai lega faza de nul cu o bucată de sârmă.", "Rezultat: <b>scurtcircuit</b>, arc electric, siguranța aparatului se arde – risc de arsuri. La priză măsori doar <b>tensiune</b>: comutator pe V~, negru în COM, roșu în VΩ, o sondă în fiecare gaură.", EX("„Cum se conectează ampermetrul/voltmetrul?” → A în serie, V în paralel. „În serie ce e comun?” → curentul. „În paralel?” → tensiunea.")),
]);

/* ===== TANENBAUM – „Rețele de calculatoare”, ed. a 4-a: rezumate ORIGINALE, simplificate, pe capitole ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 12) + '" font-weight="' + (o.w || 400) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 3 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "none") + '" stroke-width="' + (o.sw || 1) + '"/>'; }
  SVG.mux = function () {
    var c = ["#2563eb", "#16a34a", "#d97706", "#db2777"], g = "", i, k;
    g += t(120, 16, "FDM – fiecare are banda lui", { w: 800, s: 12 }) + t(360, 16, "TDM – fiecare are rândul lui", { w: 800, s: 12 });
    for (i = 0; i < 4; i++) g += r(20, 28 + i * 34, 200, 28, c[i]) + t(120, 47 + i * 34, "utilizator " + (i + 1) + " · frecvența f" + (i + 1), { f: "#fff", s: 11, w: 700 });
    g += t(120, 178, "↑ frecvență · tot timpul", { s: 10, f: "#475569" });
    for (k = 0; k < 8; k++) g += r(250 + k * 27, 28, 25, 130, c[k % 4]) + t(262 + k * 27, 98, String(k % 4 + 1), { f: "#fff", w: 800 });
    g += t(360, 178, "→ timp · toată banda, câte o cuantă", { s: 10, f: "#475569" });
    g += t(240, 200, "WDM = FDM pentru lumină: mai multe lungimi de undă („culori”) pe aceeași fibră", { s: 10.5, w: 700 });
    return W("0 0 480 208", g, "Multiplexarea: împărțirea unui canal între mai mulți utilizatori");
  };
})();
function TB(s) { return '<div class="fact"><b>📘 Unde găsești în manual:</b> ' + s + "</div>"; }
L("tan", 1, "Cap. 1 – Ce este o rețea; ierarhii de protocoale", "📘", /cap\. 1\.[0-3]\b|cap\. 1[,)]/, [
  K("Rețea, gazde, subrețea", "O rețea = calculatoare <b>autonome</b> legate ca să schimbe informații. Calculatoarele utilizatorilor se numesc <b>gazde</b>; cablurile și ruterele care le duc mesajele formează <b>subrețeaua de comunicație</b>.", "După tehnologie: rețele <b>cu difuzare</b> (un canal comun, toți aud tot; adresa spune cui îi e destinat) și <b>punct-la-punct</b> (pachetul trece din nod în nod, <b>memorează-și-retransmite</b>). După mărime: PAN → LAN → MAN → WAN → inter-rețea (Internet). Modele de utilizare: <b>client-server</b> și <b>de la egal la egal</b>.", TB("cap. 1.1–1.2")),
  K("Niveluri, protocoale, servicii", "Ca la o scrisoare oficială: directorul dictează, secretara o pune în plic, curierul o duce. Fiecare „nivel” își face doar treaba lui și vorbește „logic” cu colegul de același nivel de la destinație.", "<b>Protocol</b> = regulile dintre entitățile <b>pereche</b> (același nivel, mașini diferite). <b>Interfață</b> = granița dintre două niveluri vecine pe aceeași mașină. <b>Arhitectură</b> = niveluri + protocoale. Servicii <b>orientate pe conexiune</b> (ca telefonul: stabilire–folosire–eliberare) și <b>fără conexiune</b> (ca poșta; datagramă). Serviciul se descrie prin <b>primitive</b>: LISTEN, CONNECT, SEND, RECEIVE, DISCONNECT.", EX("Diferența serviciu/protocol, orientat pe conexiune vs. fără conexiune, tipurile de rețele după mărime.") + TB("cap. 1.3")),
]);
L("tan", 1, "Cap. 1 – Modelele OSI și TCP/IP, standarde, unități", "🧱", /cap\. 1\.[4-9]\b/, [
  K("OSI (7 niveluri) și TCP/IP (4 niveluri)", "OSI e „harta teoretică”, TCP/IP e „drumul pe care mergem de fapt” în Internet.", "<b>OSI</b> (ISO): fizic, legătură de date, rețea, transport, sesiune, prezentare, aplicație. Nivelurile 1–3 vorbesc cu vecinul; de la <b>transport</b> în sus dialogul este <b>cap-la-cap</b>. <b>TCP/IP</b> la Tanenbaum: <b>gazdă-rețea</b>, <b>internet</b> (IP), <b>transport</b> (TCP, UDP), <b>aplicație</b> (Telnet, FTP, SMTP, DNS, HTTP). Cartea folosește un <b>model hibrid cu 5 niveluri</b>.", SVG.osi()),
  K("Cine face standardele", "Fiecare „lume” are arbitrul ei.", "<b>ITU</b> (ITU-T) – telecomunicații; <b>ISO</b> – standarde internaționale (inclusiv OSI); <b>IEEE 802</b> – LAN-uri (802.3 Ethernet, 802.11 Wi-Fi, 802.15 Bluetooth, 802.16 WiMAX); <b>IETF</b> – Internet, publicat ca <b>RFC</b>. Unități: în comunicații <b>1 kbps = 1000 bps</b> (puteri ale lui 10). Exemple istorice: ARPANET → NSFNET → Internet.", EX("Câte niveluri are fiecare model, ce nivel face ce, ce organizație face ce standard.") + TB("cap. 1.4–1.7")),
]);
L("tan", 2, "Cap. 2 – Nivelul fizic: limite teoretice și medii de transmisie", "〰️", /cap\. 2\.[1-3]\b/, [
  K("Cât de repede se poate transmite?", "Un canal e ca o țeavă: are o „lățime” (lățimea de bandă). <b>Nyquist</b> spune cât poți împinge dacă țeava e perfect curată; <b>Shannon</b> spune cât poți împinge când e și „murdărie” (zgomot).", "Nyquist (fără zgomot): <b>2·H·log₂V</b> bps (H = lățimea de bandă, V = niveluri). Ex.: 3 kHz, binar → 6 kbps. Shannon (cu zgomot): <b>H·log₂(1 + S/N)</b>; S/N din dB: 30 dB = 1000 → ~30 kbps la 3 kHz. Analiza Fourier: orice semnal = sumă de sinusoide; canalul taie armonicile de sus și deformează semnalul."),
  K("Medii ghidate și fără fir", "Ghidat = semnalul merge „pe fir” (cupru, sticlă); fără fir = prin aer.", "<b>Torsadat</b>: firele răsucite își anulează interferențele (Cat 3, Cat 5). <b>Coaxial</b>: ecranare mai bună, distanțe mai mari. <b>Fibra</b>: sursă de lumină + fibră + detector, <b>reflexie totală internă</b>; ferestre ~0,85, 1,30, 1,55 µm; monomod (miez subțire) vs. multimod. <b>Radio</b> (joasă frecvență – ocolește, trece prin clădiri), <b>microunde</b> (linie dreaptă, antene aliniate, repetoare pe turnuri), <b>infraroșu</b> (nu trece prin pereți), benzi <b>ISM</b> fără licență. λ·f = c.", EX("Formulele Nyquist/Shannon, avantajele fibrei, de ce se răsucesc firele, benzile ISM.") + TB("cap. 2.1–2.3")),
]);
L("tan", 2, "Cap. 2 – Sateliți, telefonie, multiplexare, comutare, mobil", "☎️", /cap\. 2\.[4-7]\b/, [
  K("Sateliți și sistemul telefonic", "Satelitul geostaționar e un repetor „atârnat” la 35 800 km – vede o treime din Pământ, dar semnalul face drum lung.", "<b>GEO</b> ~35 800 km, perioadă 24 h, întârziere 250–300 ms; <b>MEO</b>; <b>LEO</b> (Iridium) – jos, mulți sateliți, întârziere mică. Telefonia: <b>bucle locale</b> (cupru, analogic) + <b>trunchiuri</b> (fibră, digital) + <b>oficii de comutare</b>. Modem: baud = simboluri/s; QPSK 2 biți/simbol, QAM-16 4 biți/simbol. <b>ADSL</b> – asimetric, pe bucla locală."),
  K("Multiplexare și comutare", "Multiplexarea = mai mulți vorbesc pe același „drum” fără să se încurce.", "<b>FDM</b> – benzi de frecvență separate; <b>TDM</b> – pe rând, câte o cuantă de timp; <b>WDM</b> – lungimi de undă pe fibră. PCM: 8000 eșantioane/s × 8 biți = <b>64 kbps</b>. <b>T1</b> = 1,544 Mbps (24 canale), <b>E1</b> = 2,048 Mbps (32 intervale, Europa). SONET/SDH: OC-3 = STM-1 = 155,52 Mbps. <b>Comutare de circuite</b> (cale rezervată, ca telefonul) vs. <b>de pachete</b> (fără rezervare, bandă folosită eficient). Mobil: 1G analogic (AMPS), 2G digital (GSM), 3G voce + date; celule cu reutilizarea frecvențelor. Cablu TV: HFC.", SVG.mux() + TB("cap. 2.4–2.7")),
]);
L("tan", 2, "Cap. 3 – Legătura de date: încadrare și erori", "🧾", /cap\. 3\.[12]\b/, [
  K("Încadrarea", "Biții vin ca un șir lung; receptorul trebuie să știe unde începe și unde se termină fiecare „plic” (cadru).", "Metode: numărarea caracterelor (fragilă), <b>octeți indicatori</b> cu inserare de octeți (escape), <b>indicatorul 01111110</b> cu <b>inserare de biți</b> (după cinci de 1 se pune un 0), violarea codificării fizice. Servicii: fără conexiune fără confirmare, fără conexiune cu confirmare, orientat pe conexiune. Cronometre + numere de secvență; controlul fluxului."),
  K("Detectarea și corectarea erorilor", "Ca la un CNP: cifra de control îți arată că s-a greșit ceva. Codurile corectoare merg mai departe – îți spun și <b>unde</b>.", "<b>Distanța Hamming</b> = numărul de biți diferiți. Detectezi d erori cu distanța <b>d+1</b>; corectezi d erori cu <b>2d+1</b>. Paritatea detectează un număr impar de erori. Codul Hamming: biți de control pe pozițiile 1, 2, 4, 8… <b>CRC</b>: împărțire polinomială, restul se adaugă la cadru – detectează toate rafalele mai scurte decât gradul polinomului. Corecția se preferă pe canale zgomotoase (radio).", EX("Inserarea de biți, distanța Hamming d+1 / 2d+1, CRC.") + TB("cap. 3.1–3.2")),
]);
L("tan", 2, "Cap. 3 – Fereastra glisantă, HDLC și PPP", "🪟", /cap\. 3\.[3-6]\b/, [
  K("De la stop-and-wait la fereastra glisantă", "Stop-and-wait = trimiți o scrisoare și aștepți răspunsul înainte de următoarea. Fereastra glisantă = poți avea mai multe scrisori „pe drum” deodată.", "<b>Atașarea</b> (piggybacking): confirmarea călătorește în cadrul de date de întoarcere. <b>Go Back N</b>: la o pierdere, receptorul aruncă tot ce urmează; se retransmite de la cel pierdut (fereastră max. MAX_SEQ). <b>Repetare selectivă</b>: receptorul păstrează cadrele bune, se retransmite doar cel pierdut (fereastră max. (MAX_SEQ+1)/2). Verificare formală: automate finite, rețele Petri."),
  K("HDLC și PPP", "Două protocoale reale ale legăturii de date.", "<b>HDLC</b> – orientat pe biți, indicator 01111110. <b>PPP</b> – în Internet, pe linii punct-la-punct: încadrare cu detecție de erori, <b>LCP</b> (pornește/testează/negociază linia), <b>NCP</b> (configurează nivelul rețea, ex. adresa IP).", TB("cap. 3.3–3.6")),
]);
L("tan", 2, "Cap. 4 – Subnivelul MAC: ALOHA, CSMA, rețele fără fir", "📻", /cap\. 4\.[12]\b|cap\. 4\)/, [
  K("Cine vorbește pe canalul comun?", "Ca la o ședință fără moderator: dacă vorbesc doi deodată, nu se înțelege nimic (coliziune).", "Alocarea statică (FDM) irosește banda la trafic în rafale. <b>ALOHA pur</b>: transmiți oricând; maxim ~<b>18%</b> (1/2e). <b>ALOHA cuantificat</b>: doar la început de cuantă; maxim ~<b>37%</b> (1/e). <b>CSMA</b>: asculți înainte – 1-persistent, nepersistent, p-persistent. <b>CSMA/CD</b>: oprești imediat la coliziune (Ethernet clasic). Protocoale fără coliziuni: hartă de biți, numărătoare inversă binară."),
  K("Problemele radio", "În radio nu „auzi” tot ce aude receptorul.", "<b>Stația ascunsă</b>: doi emițători nu se aud între ei, dar ajung la același receptor → coliziuni. <b>Stația expusă</b>: renunți inutil pentru că auzi o transmisie care nu te-ar deranja. <b>MACA</b>: <b>RTS</b> scurt → <b>CTS</b> de la receptor; cine aude CTS tace.", EX("Eficiența ALOHA 18% / 37%, CSMA/CD, stația ascunsă și RTS/CTS.") + TB("cap. 4.1–4.2")),
]);
L("tan", 3, "Cap. 4 – Ethernet, 802.11, Bluetooth, punți și VLAN", "🔗", /cap\. 4\.[3-7]\b/, [
  K("Ethernet", "Ethernetul clasic e CSMA/CD pe un cablu comun; azi e aproape mereu comutat (switch).", "Cabluri: <b>10Base5</b> (coaxial gros, 500 m), <b>10Base2</b> (subțire, 185 m), <b>10Base-T</b> (torsadat, hub, 100 m), 10Base-F. <b>Manchester</b>: tranziție la mijlocul fiecărui bit (sincronizare). Adrese de <b>6 octeți</b>; cadru minim <b>64 de octeți</b>, date max. <b>1500</b>. <b>Regresie exponențială binară</b>: după i coliziuni aștepți 0…2ⁱ−1 cuante (cuanta = 51,2 µs); maxim 1023, eșec după 16. Fast Ethernet 100 Mbps, Gigabit 1000 Mbps; <b>LLC</b> (802.2) deasupra MAC."),
  K("Wi-Fi, Bluetooth, punți", "Punțile și comutatoarele „învață” cine unde stă.", "<b>802.11</b>: <b>CSMA/CA</b> (nu poate detecta coliziunile radio), DCF/PCF; 802.11b 2,4 GHz 11 Mbps, 802.11a 5 GHz 54 Mbps, 802.11g 2,4 GHz 54 Mbps. <b>802.16</b> WiMAX. <b>Bluetooth</b>: piconet = 1 master + max. 7 slave active, 2,4 GHz. <b>Punte transparentă</b>: învață din adresele sursă, inundă destinațiile necunoscute; <b>arbore de acoperire</b> contra buclelor. Niveluri: repetor/hub – fizic; punte/switch – legătură de date; ruter – rețea; porți de transport/aplicație. <b>VLAN</b> + etichetă <b>802.1Q</b>.", EX("Cadru minim 64 / maxim 1500, backoff, CSMA/CA vs. CD, la ce nivel lucrează fiecare echipament.") + TB("cap. 4.3–4.7")),
]);
L("tan", 3, "Cap. 5 – Dirijare, congestie și calitatea serviciilor", "🧭", /cap\. 5\.[1-5]\b/, [
  K("Algoritmi de dirijare", "Dirijarea = ruterele își fac „harta drumurilor”; retransmiterea = folosesc harta pentru fiecare pachet.", "Subrețele <b>datagramă</b> vs. <b>circuite virtuale</b>. <b>Principiul optimalității</b> → <b>arborele de scufundare</b>. <b>Dijkstra</b> = cel mai scurt drum. <b>Inundarea</b> = pe toate liniile (robustă, multe duplicate). <b>Vectori distanță</b> (Bellman-Ford, RIP): schimbi tabela cu vecinii; problema <b>numărării la infinit</b>. <b>Starea legăturilor</b> (OSPF, IS-IS): HELLO, ECHO, pachet de stare trimis tuturor, Dijkstra. Dirijare ierarhică, difuzare, multicast."),
  K("Congestie și QoS", "Congestia = ambuteiaj în toată rețeaua; controlul fluxului = să nu „îneci” un singur receptor.", "Tehnici: <b>pachete de șoc</b>, <b>împrăștierea încărcării</b> (RED aruncă devreme), controlul <b>fluctuației</b> (jitter). <b>Găleata găurită</b> – ieșire constantă; <b>găleata cu jetoane</b> – permite rafale. Servicii integrate (RSVP) vs. <b>diferențiate</b> (clase). <b>MPLS</b> – etichete. Interconectare: <b>tunel</b> (încapsulare), <b>fragmentare</b> (MTU).", EX("Vectori distanță vs. starea legăturilor, count-to-infinity, leaky vs. token bucket.") + TB("cap. 5.1–5.5")),
]);
L("tan", 3, "Cap. 5.6 – Nivelul rețea în Internet: IP, ICMP, ARP, DHCP, OSPF, BGP, IPv6", "🌍", /cap\. 5\.6/, [
  K("Antetul IP și adresele", "IP e „plicul” Internetului: are adresa expeditorului, a destinatarului și câteva „ștampile”.", "Antet IPv4 <b>20 de octeți</b> (fără opțiuni); <b>TTL</b> scade la fiecare ruter (la 0 pachetul moare → ICMP time exceeded); câmpul <b>Protocol</b> (6 = TCP, 17 = UDP); suma de control doar pentru antet. Clase: A 1–126, B 128–191, C 192–223, D 224–239 (multicast), E. <b>CIDR</b> – blocuri variabile, cel mai lung prefix. <b>NAT</b> + adrese private 10/8, 172.16/12, 192.168/16."),
  K("Protocoalele de control și dirijare", "Ajutoarele lui IP.", "<b>ICMP</b> – erori și ping; <b>ARP</b> – IP → MAC; RARP/BOOTP → <b>DHCP</b> – adrese automate cu închiriere. <b>OSPF</b> – interior, starea legăturilor; <b>BGP</b> – între sisteme autonome, vectori de drum, politici. <b>IPv6</b>: 128 de biți, antet fix 40 octeți fără sumă de control, „hop limit”.", EX("Mărimea antetelor (IPv4 20, IPv6 40), TTL, ARP vs. DHCP, OSPF vs. BGP, clasele de adrese.") + TB("cap. 5.6")),
]);
L("tan", 3, "Cap. 6 – Nivelul transport: socluri, TCP, UDP", "🚚", /cap\. 6\b/, [
  K("Servicii și socluri", "Transportul e „curierul cap-la-cap”: rulează doar în gazde și repară ce nu garantează rețeaua.", "Unitatea: <b>TPDU</b> (segment în TCP). <b>Socluri Berkeley</b>: serverul SOCKET → BIND → LISTEN → ACCEPT; clientul SOCKET → CONNECT; apoi SEND/RECEIVE, CLOSE. TSAP = <b>port</b>. Stabilire în <b>trei pași</b> (SYN, SYN+ACK, ACK). <b>Problema celor două armate</b>: eliberarea nu poate fi garantată perfect → temporizatoare. Multiplexare după porturi.", SVG.handshake()),
  K("UDP și TCP în detaliu", "UDP = carte poștală; TCP = colet cu confirmare și urmărire.", "<b>UDP</b>: antet <b>8 octeți</b>; DNS, RPC, <b>RTP</b> (timp real). <b>TCP</b>: antet <b>20 octeți</b>; indicatori SYN, ACK, FIN, RST, PSH, URG; câmpul <b>fereastră</b> = control al fluxului. <b>Nagle</b>: adună octeții mici; <b>fereastra stupidă</b> – soluția lui Clark. Emițătorul trimite min(fereastra receptorului, <b>fereastra de congestie</b>). <b>Start lent</b>: fereastra se dublează până la prag, apoi crește liniar; la expirarea temporizatorului: prag = ½ fereastră, fereastră = 1 segment. RTT: Jacobson, Karn. Pe radio, pierderile par congestie.", EX("Antet UDP 8 / TCP 20, three-way handshake, slow start, Nagle, two-army.") + TB("cap. 6")),
]);
L("tan", 3, "Cap. 7 – Nivelul aplicație: DNS, e-mail, Web, multimedia", "✉️", /cap\. 7\b/, [
  K("DNS", "DNS e „cartea de telefon” a Internetului, împărțită pe mii de servere.", "Arbore de nume: rădăcină → domenii de nivel superior generice (com, org…) sau de țară (<b>ro</b>) → subdomenii; <b>zone</b> cu servere primare/secundare. Înregistrări: <b>A</b> (IPv4), <b>MX</b> (e-mail), <b>NS</b>, <b>CNAME</b> (alias), <b>PTR</b>, <b>SOA</b>. Interogări recursive/iterative, cache; UDP 53."),
  K("E-mail și Web", "", "E-mail: <b>agenți utilizator</b> + <b>agenți de transfer</b>; <b>MIME</b> (atașamente, base64); <b>SMTP</b> 25 între servere; livrarea finală cu <b>POP3</b> 110 (descarcă) sau <b>IMAP</b> 143 (rămâne pe server). Web: <b>URL</b>, <b>HTTP</b> pe TCP 80 (GET, POST, HEAD…; 1.1 = conexiuni persistente), <b>HTML</b>, pagini statice vs. dinamice, <b>cookie-uri</b>, proxy-cache. Multimedia: MP3 (codare perceptuală), VoIP cu <b>H.323</b> și <b>SIP</b>, MPEG (diferențe între cadre).", EX("Tipurile de înregistrări DNS, porturile SMTP/POP3/IMAP/HTTP, MIME.") + TB("cap. 7")),
]);
L("tan", 3, "Cap. 8 – Securitatea rețelelor (noțiuni de bază)", "🔐", /cap\. 8\b/, [
  K("Criptografie", "Criptarea = încui mesajul; cheia e cea care contează, nu lacătul (principiul lui Kerckhoff).", "Text clar → (algoritm + cheie) → text cifrat. Cifruri cu <b>substituție</b> (Cezar) și cu <b>transpoziție</b>; <b>cheia acoperitoare</b> (one-time pad) – de nespart. <b>Cheie secretă</b> (simetric): <b>DES</b> 56 biți (slab), 3DES, <b>AES</b> (Rijndael, 128/192/256); modurile ECB (slab) și CBC. <b>Cheie publică</b>: <b>RSA</b> (factorizare), Diffie-Hellman (stabilirea unei chei comune; atenție la „omul din mijloc”)."),
  K("Semnături, certificate, protecția comunicației", "", "<b>Semnătura digitală</b>: autentificare + integritate + nerepudiere. <b>Rezumate</b>: MD5 (128 biți), SHA-1 (160 biți); atacul zilei de naștere ~2^(m/2). <b>Certificate X.509</b>, <b>CA</b>, <b>PKI</b>. <b>IPsec</b> (AH – integritate, ESP – și criptare; transport/tunel), <b>ziduri de protecție</b> (filtre de pachete + poartă de aplicație), <b>VPN</b>, <b>WEP</b> – nesigur. Autentificare: Kerberos. E-mail: PGP, S/MIME. Web: <b>SSL</b>/HTTPS, DNS spoofing.", EX("Simetric vs. cheie publică, DES 56 biți, AES, RSA, semnătura digitală, firewall, VPN.") + TB("cap. 8")),
]);

/* ===== MUNTEANU & GREAVU-ȘERBAN – „Rețele locale de calculatoare”: rezumate ORIGINALE, simplificate, pe capitole ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 12) + '" font-weight="' + (o.w || 400) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 6 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "none") + '" stroke-width="' + (o.sw || 1) + '"/>'; }
  function l(x1, y1, x2, y2, c, w) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#64748b") + '" stroke-width="' + (w || 2) + '"/>'; }
  SVG.hier = function () {
    var g = "", i;
    g += l(240, 44, 130, 104) + l(240, 44, 350, 104);
    for (i = 0; i < 4; i++) { g += l(130, 124, 50 + i * 54, 168); g += l(350, 124, 270 + i * 54, 168); }
    g += r(180, 20, 120, 28, "#1d4ed8") + t(240, 39, "CORE (central)", { f: "#fff", w: 800, s: 11 });
    g += r(70, 100, 120, 28, "#16a34a") + t(130, 119, "DISTRIBUȚIE", { f: "#fff", w: 800, s: 11 });
    g += r(290, 100, 120, 28, "#16a34a") + t(350, 119, "DISTRIBUȚIE", { f: "#fff", w: 800, s: 11 });
    for (i = 0; i < 4; i++) { g += r(28 + i * 54, 166, 44, 22, "#d97706") + t(50 + i * 54, 181, "acces", { f: "#fff", s: 10, w: 700 }); g += r(248 + i * 54, 166, 44, 22, "#d97706") + t(270 + i * 54, 181, "acces", { f: "#fff", s: 10, w: 700 }); }
    g += r(150, 59, 180, 15, "#fff", { rx: 4 }) + r(140, 137, 200, 15, "#fff", { rx: 4 });
    g += t(240, 70, "comutare cât mai rapidă · fără ACL", { s: 10, f: "#1d4ed8" });
    g += t(240, 148, "politici, ACL, rutare între VLAN-uri", { s: 10, f: "#16a34a" });
    g += t(240, 206, "aici se conectează PC-urile utilizatorilor (switch-uri de acces)", { s: 10, f: "#b45309" });
    return W("0 0 480 214", g, "Modelul ierarhic pe 3 niveluri (Cisco)");
  };
  SVG.aclPlace = function () {
    var g = "";
    g += r(10, 60, 70, 34, "#e0e7ff", { st: "#1d4ed8" }) + t(45, 82, "PC sursă", { s: 11, w: 700 });
    g += r(130, 60, 80, 34, "#dcfce7", { st: "#16a34a" }) + t(170, 82, "Router A", { s: 11, w: 700 });
    g += r(270, 60, 80, 34, "#dcfce7", { st: "#16a34a" }) + t(310, 82, "Router B", { s: 11, w: 700 });
    g += r(400, 60, 70, 34, "#fee2e2", { st: "#dc2626" }) + t(435, 82, "Server", { s: 11, w: 700 });
    g += l(80, 77, 130, 77) + l(210, 77, 270, 77) + l(350, 77, 400, 77);
    g += t(170, 40, "EXTINSĂ (100–199)", { s: 11, w: 800, f: "#7c3aed" }) + t(170, 54, "lângă SURSĂ ↓", { s: 10, f: "#7c3aed" });
    g += t(310, 40, "STANDARD (1–99)", { s: 11, w: 800, f: "#b45309" }) + t(310, 54, "lângă DESTINAȚIE ↓", { s: 10, f: "#b45309" });
    g += t(240, 120, "Standard = verifică doar sursa → pusă lângă sursă ar bloca tot.", { s: 10.5 });
    g += t(240, 138, "La final orice ACL are un „deny any” implicit (nevăzut).", { s: 10.5, w: 700 });
    return W("0 0 480 146", g, "Unde pui o listă de acces (ACL)");
  };
})();
function MB(s) { return '<div class="fact"><b>📗 Unde găsești în manual:</b> ' + s + "</div>"; }
function AZI(s) { return '<div class="eli trapw"><b>⚠ Azi:</b> ' + s + "</div>"; }
L("mun", 1, "Cap. 1–2 – Istorie, topologii, modelele OSI și TCP/IP", "📗", /cap\. [12]\b/, [
  K("De unde vin rețelele și cum se leagă", "Rețelele au început ca o legătură între câteva calculatoare universitare (ARPANET, 1969) și au crescut până la Internet. Forma în care legi calculatoarele se numește <b>topologie</b>.", "Topologii: <b>magistrală</b> (un cablu comun, terminatoare la capete), <b>inel</b> (Token Ring, FDDI), <b>stea</b> (toate la un hub/switch – cea de azi), <b>plasă</b> (redundanță). Tipuri după mărime: LAN, MAN, WAN. Modele: client-server și peer-to-peer.", SVG.topo()),
  K("Modelele pe niveluri", "Modelul OSI e ca un tort cu 7 straturi; fiecare strat are o treabă clară și „vorbește” doar cu stratul identic de la celălalt capăt.", "<b>OSI</b>: fizic, legătură de date (MAC + LLC), rețea, transport, sesiune, prezentare, aplicație. <b>TCP/IP</b> are 4 niveluri: acces la rețea, Internet, transport, aplicație. Unități: bit → cadru → pachet → segment. Încapsularea adaugă un antet la fiecare nivel la coborâre.", SVG.osi() + EX("Ordinea nivelurilor OSI, ce face fiecare, corespondența cu TCP/IP, unitatea de date pe fiecare nivel.") + MB("cap. 1–2")),
]);
L("mun", 1, "Cap. 3 – Ethernet, CSMA/CD și infrastructura LAN", "🔌", /cap\. 3\b/, [
  K("Cum „vorbesc” stațiile pe Ethernet", "Ca la o masă cu mulți invitați: asculți întâi dacă vorbește cineva (CS), apoi vorbești; dacă doi încep deodată (coliziune), tac amândoi și reîncearcă după o pauză aleatoare.", "<b>CSMA/CD</b> = ascultă purtătoarea, acces multiplu, detectează coliziunea; după coliziune: semnal de bruiaj (jam) și <b>backoff exponențial</b>. Cadrul Ethernet: preambul, MAC destinație, MAC sursă, tip/lungime, date (46–1500 octeți), FCS (CRC). Cadru minim 64 octeți. În <b>full-duplex</b> (switch) nu mai există coliziuni."),
  K("Echipamente și reguli", "Hub-ul „strigă” tot ce primește pe toate porturile; switch-ul trimite doar unde trebuie, după adresa MAC.", "Hub/repetor = nivel 1 (un singur domeniu de coliziune). Punte/switch = nivel 2 (fiecare port e un domeniu de coliziune). Router = nivel 3 (separă domeniile de broadcast). Regula veche <b>5-4-3</b> pentru 10 Mbps: max. 5 segmente, 4 repetoare, 3 segmente cu stații. Variante: 10Base5, 10Base2, 10BaseT, 100BaseTX, 1000BaseT.", SVG.cables() + EX("CSMA/CD, cadru minim 64 / maxim 1518 octeți, regula 5-4-3, ce separă hub/switch/router.") + MB("cap. 3")),
]);
L("mun", 1, "Cap. 4 – Adresare IPv4, clase, subrețele, supernetting", "🔢", /cap\. 4\b|cap\. 3–4/, [
  K("Clase și măști", "Adresa IP e ca o adresă poștală: o parte spune strada (rețeaua), restul spune numărul casei (gazda). Masca arată unde se termină strada.", "Clase: <b>A</b> 1–126 (/8), <b>B</b> 128–191 (/16), <b>C</b> 192–223 (/24), D multicast 224–239, E experimental. 127 = loopback. Private: 10/8, 172.16/12, 192.168/16. Gazde utilizabile = <b>2<sup>h</sup> − 2</b> (h = biți de gazdă), pentru că adresa de rețea și broadcast-ul nu se dau stațiilor.", SVG.subnet()),
  K("Subrețele și agregare", "Împarți o rețea mare în bucăți mai mici „împrumutând” biți de la partea de gazdă.", "Cu n biți împrumutați obții <b>2<sup>n</sup> subrețele</b>. Supernetting/CIDR = invers: unești mai multe rețele într-un singur prefix (rute mai puține).", AZI("cartea folosește regula veche „2<sup>n</sup> − 2 subrețele” (fără prima și ultima subrețea). Azi (ip subnet-zero, implicit) se folosesc <b>toate 2<sup>n</sup></b>. Dacă grila oferă doar varianta veche, recunoaște-o: 3 biți → 8 azi, 6 după regula veche.") + EX("Calculul gazdelor 2<sup>h</sup>−2, numărul de subrețele, clasa după primul octet, adresele private.") + MB("cap. 4")),
]);
L("mun", 2, "Cap. 5–7 – TCP, UDP, porturi, ARP, ICMP și aplicații", "🚚", /cap\. [5-7]\b|cap\. 4–5/, [
  K("TCP vs. UDP", "TCP e ca o scrisoare recomandată (confirmare, ordine, retrimitere); UDP e ca o carte poștală (rapid, fără garanții).", "TCP: orientat pe conexiune, <b>3-way handshake</b> SYN → SYN-ACK → ACK, numere de secvență, confirmări, fereastră. UDP: fără conexiune, antet de 8 octeți (DNS, DHCP, TFTP, SNMP, streaming). Porturi: FTP 20/21, SSH 22, Telnet 23, SMTP 25, DNS 53, HTTP 80, POP3 110, SNMP 161, HTTPS 443.", SVG.handshake() + AZI("porturi: 0–1023 bine-cunoscute, 1024–49151 înregistrate, 49152–65535 dinamice. Cartea folosește o împărțire mai veche.")),
  K("ARP, ICMP și aplicațiile", "ARP întreabă în gura mare: „Cine are IP-ul ăsta? Să-mi spună MAC-ul!”. ICMP e „poșta de erori” a IP-ului.", "<b>ARP</b>: IP → MAC, prin broadcast; răspunsul e unicast și se păstrează în cache. Proxy ARP: routerul răspunde în locul unei gazde din altă rețea. <b>ICMP</b>: echo request/reply (ping), destinație inaccesibilă, TTL expirat (tracert). <b>DNS</b>: spațiu de nume + servere + resolvere; UDP 53, transfer de zonă pe TCP 53; zona inversă in-addr.arpa. <b>SNMP</b>: agent, MIB, trap. URI = URL (locația) sau URN (numele).", EX("Handshake-ul TCP, porturile uzuale, ce face ARP, ping/tracert, componentele DNS.") + MB("cap. 5–7")),
]);
L("mun", 2, "Cap. 8 – Cablarea structurată (TIA/EIA-568)", "🧵", /cap\. 8\b/, [
  K("Cele 6 subsisteme și distanțele", "Cablarea unei clădiri e ca instalația de apă: o coloană principală pe verticală (backbone) și „țevi” pe fiecare etaj (orizontal) până la fiecare priză.", "Subsisteme: <b>orizontal</b>, <b>backbone</b>, <b>zona de lucru</b>, <b>camera de telecomunicații</b>, <b>camera echipamentelor</b>, <b>facilitățile de intrare</b>. Orizontal: <b>90 m</b> permanent + <b>10 m</b> cabluri de conectare = 100 m; topologie stea. Backbone: stea ierarhică; fibră MM până la 2000 m, SM până la 3000 m. Nodul principal = <b>MDF</b>, cele de etaj = <b>IDF</b>.", SVG.rack()),
  K("Fire, pini și măsurători", "Culorile perechilor se învață o dată: albastru, portocaliu, verde, maro.", "<b>T568B</b>: alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro. 10/100 Mbps folosește pinii <b>1, 2, 3, 6</b>; gigabitul toți 8. Drept = același standard la ambele capete; crossover = T568A la un capăt, T568B la celălalt. Teste: lungime (NVP), atenuare, <b>NEXT/FEXT</b> (diafonie), reflexii (impedanță). Bugetul de întârziere: <b>512 durate de bit</b> dus-întors. Fast Ethernet: max. 2 repetoare de clasa II.", SVG.t568() + EX("90 + 10 m, cele 6 subsisteme, ordinea T568B, pinii 1-2-3-6, NEXT.") + MB("cap. 8")),
]);
L("mun", 2, "Cap. 9–10 – Comutare, STP, VLAN și VTP", "🔀", /cap\. (9|10)\b/, [
  K("Cum comută un switch", "Switch-ul își face o agendă: „pe portul 3 stă MAC-ul X”. Apoi trimite fiecare cadru doar pe portul potrivit.", "Metode: <b>store-and-forward</b> (primește tot, verifică CRC – latență mare, sigur), <b>cut-through fast-forward</b> (pornește după MAC-ul destinație – latență minimă, trec și erorile), <b>fragment-free</b> (după primii 64 de octeți – elimină runt-urile). Legăturile redundante fără <b>STP</b> dau furtuni de broadcast; STP blochează logic o cale. Stări STP: blocking → listening → learning → forwarding.", SVG.macTable()),
  K("VLAN și VTP", "VLAN-ul e ca un perete invizibil: împarte un switch fizic în mai multe „switch-uri logice”, fiecare cu broadcast-ul lui.", "Apartenență: <b>pe port</b> (cea mai folosită), pe MAC, pe protocol. Între VLAN-uri e nevoie de <b>router</b> sau switch L3 (router-on-a-stick pe trunk). Trunk: <b>802.1Q</b> (standard) vs. ISL (Cisco, vechi). <b>VTP</b>: server (creează/șterge), client (doar primește), transparent (păstrează VLAN-uri locale, doar retransmite).", SVG.vlan() + AZI("comenzile vechi de Catalyst 1900 („vlan-membership static”) nu mai există; azi: <b>switchport mode access</b> + <b>switchport access vlan N</b>, IP de management pe <b>interface vlan 1</b>.") + EX("Store-and-forward vs. fragment-free, stările STP, 802.1Q, modurile VTP.") + MB("cap. 9–10")),
]);
L("mun", 3, "Cap. 11 – Routere Cisco: memorii, IOS, rutare și ACL", "🛣️", /cap\. 11\b/, [
  K("Memorii, pornire, moduri", "Routerul e un mic calculator: ROM = „BIOS-ul”, Flash = „hard-diskul” cu IOS, NVRAM = configurația salvată, RAM = ce rulează acum.", "Pornire: <b>POST</b> → bootstrap → IOS din Flash → startup-config din <b>NVRAM</b> (fără ea → setup dialog). Moduri: <b>Router&gt;</b> (utilizator) → enable → <b>Router#</b> → configure terminal → <b>Router(config)#</b>. Salvare: <b>copy running-config startup-config</b>. Interfețele sunt oprite implicit: <b>no shutdown</b>. Serial: <b>clock rate</b> pe capătul DCE. <b>enable secret</b> bate enable password; Telnet: <b>line vty 0 4</b>. CDP: vecini Cisco, 60 s / 180 s."),
  K("Rutare statică și dinamică", "Ruta statică = indicator bătut în cuie de tine; protocolul dinamic = GPS care își schimbă singur traseul.", "Default: <b>ip route 0.0.0.0 0.0.0.0 next-hop</b>. Distance-vector (RIP): trimite toată tabela vecinilor; RIP: max. 15 salturi, <b>16 = inaccesibil</b>, la 30 s; anti-bucle: split horizon, hold-down. Link-state (<b>OSPF</b>, Dijkstra/SPF): convergență rapidă, arii. Classful: RIPv1, IGRP; classless: RIPv2, OSPF, EIGRP.", AZI("IGRP (actualizări la 90 s) a fost înlocuit de <b>EIGRP</b>; RIP se mai întâlnește doar în rețele mici.")),
  K("Liste de acces (ACL)", "ACL-ul e portarul de la intrare: are o listă și o citește de sus în jos; la prima potrivire decide. Cine nu e pe listă nu intră.", "Standard <b>1–99</b> (doar sursa) → lângă <b>destinație</b>; extinsă <b>100–199</b> (sursă, destinație, protocol, port) → lângă <b>sursă</b>. La final: <b>deny implicit</b>. Wildcard = inversul măștii (/24 → 0.0.0.255). Aplicare: ip access-group N in|out.", SVG.aclPlace() + EX("Memoriile routerului, copy run start, no shutdown, RIP 15/16, ACL 1–99 vs. 100–199, deny implicit, wildcard.") + MB("cap. 11")),
]);
L("mun", 3, "Cap. 12 – Proiectare, atacuri, firewall, NAT, VPN", "🛡️", /cap\. 12\b/, [
  K("Proiectarea rețelei", "Întâi afli <b>ce aplicații</b> se folosesc, apoi construiești drumurile pe care merg.", "Modelul ierarhic: <b>core</b> (rapid, fără filtrare), <b>distribuție</b> (politici, ACL, rutare între VLAN-uri), <b>acces</b> (utilizatori). Praguri Cisco: utilizare Ethernet ≤ 40%, broadcast ≤ 20%, coliziuni ≤ 0,1%. Serverele de firmă în MDF, cele de grup în IDF.", SVG.hier() + AZI("regula 80/20 (80% trafic local) nu mai e valabilă – azi traficul merge mult spre servere centrale și Internet.")),
  K("Atacuri și apărare", "Atacurile DoS „sufocă” o țintă; sniffing-ul „ascultă la ușă”.", "<b>SYN flood</b> (conexiuni pe jumătate deschise), <b>Smurf</b> (ping la broadcast cu sursa victimei), <b>Ping of Death</b> (ICMP supradimensionat), <b>Teardrop</b> (fragmente suprapuse), sniffing (placă în mod promiscuous), hijacking. Firewall: filtru de pachete, gateway de circuit (SOCKS), gateway de aplicație (proxy). <b>NAT</b> static / dinamic / PAT. <b>IPsec</b>: transport (doar datele) vs. tunel (tot pachetul). <b>VPN</b> = tunel criptat peste Internet.", SVG.nat() + AZI("SSL → azi <b>TLS</b>; Legea 161/2003 → azi infracțiunile informatice sunt în <b>noul Cod penal, art. 360–366</b>.") + EX("Cele 3 niveluri, tipurile de atac, tipurile de NAT, IPsec tunel vs. transport.") + MB("cap. 12")),
]);
L("mun", 3, "Cap. 13–14 – Windows în rețea și utilitare de diagnostic", "🧰", /cap\. 1[34]\b/, [
  K("Server Windows și domeniu", "Domeniul e ca un registru central cu toți utilizatorii și calculatoarele firmei; controlerul de domeniu (DC) ține registrul.", "Partiții <b>NTFS</b> (permisiuni, cote, criptare). Active Directory depinde de <b>DNS</b>; un server devine DC cu dcpromo; în Windows 2000+ toate DC-urile sunt egale (în NT 4.0: PDC + BDC). Profiluri: local, roaming, mandatory (NTUSER.MAN). Partajare ascunsă: nume terminat cu <b>$</b>."),
  K("Diagnostic pas cu pas", "Mergi de jos în sus: cablu → IP → gateway → nume.", "<b>ipconfig</b> (/all, /release, /renew, /flushdns), <b>ping</b> (loopback → propriul IP → gateway → server), <b>tracert</b>, <b>pathping</b> (traseu + pierderi), <b>arp -a</b>, <b>netstat</b>, <b>nslookup</b>. Ping pe IP merge, pe nume nu → problemă de DNS.", AZI("în loc de Network Monitor/RouterSim din carte: <b>Wireshark</b>, <b>Cisco Packet Tracer</b>, GNS3.") + EX("Ordinea testelor cu ping, ce face fiecare comandă ipconfig, DNS vs. conectivitate.") + MB("cap. 13–14")),
]);

/* ===== RĂDULESCU – „Rețele de telecomunicații”: rezumate ORIGINALE, pentru începători, pe temele din cuprins ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 12) + '" font-weight="' + (o.w || 400) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 3 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "none") + '" stroke-width="' + (o.sw || 1) + '"/>'; }
  SVG.e1 = function () {
    var g = "", i, x, c;
    g += t(240, 16, "Un cadru E1 = 125 µs = 32 intervale × 8 biți = 256 biți", { w: 800, s: 12 });
    for (i = 0; i < 32; i++) { x = 16 + i * 14; c = i === 0 ? "#dc2626" : i === 16 ? "#7c3aed" : "#2563eb"; g += r(x, 28, 13, 40, c, { rx: 2 }); }
    g += t(22, 84, "TS0", { s: 10, w: 700, f: "#dc2626" }) + t(246, 84, "TS16", { s: 10, w: 700, f: "#7c3aed" });
    g += t(22, 98, "sincronizare", { s: 9.5, f: "#dc2626", a: "start" }) + t(246, 98, "semnalizare", { s: 9.5, f: "#7c3aed" });
    g += t(370, 92, "30 canale de voce (albastru)", { s: 10.5, f: "#1d4ed8", w: 700 });
    g += t(240, 124, "8000 eșantioane/s × 8 biți = 64 kbit/s pe canal", { s: 11 });
    g += t(240, 142, "32 × 64 kbit/s = 2,048 Mbit/s", { s: 12, w: 800 });
    return W("0 0 480 152", g, "PCM: cadrul primar E1 (Europa)");
  };
  SVG.hierTx = function () {
    var g = "", rows = [["E1", "2,048 Mbit/s", "30 canale"], ["E2", "8,448 Mbit/s", "4 × E1 · 120"], ["E3", "34,368 Mbit/s", "16 × E1 · 480"], ["E4", "139,264 Mbit/s", "64 × E1 · 1920"]], i;
    g += t(115, 16, "PDH (plesiocron)", { w: 800, f: "#b45309" }) + t(360, 16, "SDH (sincron)", { w: 800, f: "#1d4ed8" });
    for (i = 0; i < 4; i++) { g += r(10, 26 + i * 34, 210, 28, "#fef3c7", { st: "#d97706" }) + t(20, 45 + i * 34, rows[i][0], { a: "start", w: 800, s: 12 }) + t(52, 45 + i * 34, rows[i][1], { a: "start", s: 11 }) + t(212, 45 + i * 34, rows[i][2], { a: "end", s: 10, f: "#78350f" }); }
    var s = [["STM-1", "155,52 Mbit/s", "63 E1 / 1 E4"], ["STM-4", "622,08 Mbit/s", "4 × STM-1"], ["STM-16", "≈ 2,5 Gbit/s", "16 × STM-1"], ["STM-64", "≈ 10 Gbit/s", "64 × STM-1"]];
    for (i = 0; i < 4; i++) { g += r(250, 26 + i * 34, 220, 28, "#dbeafe", { st: "#2563eb" }) + t(258, 45 + i * 34, s[i][0], { a: "start", w: 800, s: 11.5 }) + t(312, 45 + i * 34, s[i][1], { a: "start", s: 10.5 }) + t(464, 45 + i * 34, s[i][2], { a: "end", s: 9.5, f: "#1e3a8a" }); }
    g += t(240, 172, "PDH: ca să scoți un E1 din E4 desfaci tot, treaptă cu treaptă.", { s: 10.5 });
    g += t(240, 188, "SDH: multiplexorul add-drop scoate direct E1-ul dorit.", { s: 10.5, w: 700 });
    return W("0 0 480 196", g, "Ierarhiile digitale de transmisie");
  };
  SVG.atmCell = function () {
    var g = "";
    g += r(20, 30, 70, 44, "#7c3aed") + t(55, 50, "ANTET", { f: "#fff", w: 800, s: 11 }) + t(55, 65, "5 octeți", { f: "#fff", s: 10 });
    g += r(92, 30, 368, 44, "#16a34a") + t(276, 50, "DATE UTILE (payload)", { f: "#fff", w: 800, s: 11 }) + t(276, 65, "48 octeți", { f: "#fff", s: 10 });
    g += t(240, 18, "Celula ATM = 53 de octeți, lungime FIXĂ", { w: 800 });
    g += t(55, 92, "VPI/VCI + HEC", { s: 10, f: "#5b21b6", w: 700 });
    g += t(276, 92, "AAL1 = voce (debit constant) · AAL5 = date (IP)", { s: 10, f: "#166534" });
    return W("0 0 480 100", g, "Celula ATM");
  };
})();
function RB(s) { return '<div class="fact"><b>📙 Tema din manual:</b> ' + s + "</div>"; }
L("rad", 1, "Semnale, modulație, PCM și DPCM", "📙", /cap\. 2\.[1-4]\b/, [
  K("Analogic, digital, modulație", "Vocea e o undă care urcă și coboară lin (analogic). Ca s-o trimitem „digital”, o transformăm în numere (biți) – iar pe drum un regenerator poate „curăța” biții, fără să adune zgomot.", "<b>Modulația</b> = schimbi amplitudinea, frecvența sau faza unei purtătoare după semnal. <b>Multiplexarea</b> = mai multe semnale pe același canal: <b>FDM</b> (benzi de frecvență), <b>TDM</b> (intervale de timp), <b>WDM</b> (lungimi de undă pe fibră). Canalul telefonic vocal: <b>300–3400 Hz</b>."),
  K("PCM pas cu pas", "Ca la un film: „fotografiezi” vocea de 8000 de ori pe secundă, fiecare poză o rotunjești la una din 256 de trepte și scrii treapta ca un număr pe 8 biți.", "<b>Eșantionare</b> la <b>8 kHz</b> (cel puțin dublul celei mai mari frecvențe, ~4 kHz) → <b>cuantizare</b> (256 de niveluri, neuniforme: legea <b>A</b> în Europa, legea µ în SUA/Japonia) → <b>codare</b> pe <b>8 biți</b>. 8000 × 8 = <b>64 kbit/s</b>; un cadru = <b>125 µs</b>. <b>E1</b> = 32 de intervale (TS0 sincronizare, TS16 semnalizare, 30 voce) = <b>2,048 Mbit/s</b>. T1 (SUA) = 24 canale, 1,544 Mbit/s. <b>DPCM</b> trimite doar diferența față de o predicție (mai puțini biți); <b>ADPCM</b> G.726 = 32 kbit/s; modulația delta = 1 bit/eșantion.", SVG.e1() + EX("8 kHz, 8 biți, 64 kbit/s, 125 µs, E1 = 32 intervale / 30 voce / 2,048 Mbit/s, legea A.") + RB("cap. 2.1–2.4")),
]);
L("rad", 1, "QAM, DMT/ADSL și modurile de transfer", "📶", /cap\. 2\.[5-7]\b/, [
  K("QAM: mai mulți biți pe simbol", "Fiecare „simbol” e un punct pe o hartă (amplitudine + fază). Cu cât harta are mai multe puncte, cu atât fiecare punct poartă mai mulți biți – dar punctele sunt mai înghesuite și zgomotul le încurcă mai ușor.", "16-QAM = <b>4 biți</b>/simbol, 64-QAM = <b>6</b>, 256-QAM = <b>8</b> (2<sup>biți</sup> = puncte). Debit = viteza de simboluri (baud) × biți pe simbol. Diagrama de puncte = <b>constelație</b>."),
  K("DMT și ADSL; STM vs. ATM", "DMT împarte drumul în sute de benzi înguste; pe benzile „curate” pune mulți biți, pe cele zgomotoase puțini.", "ADSL: <b>256 subcanale</b> de ~<b>4,3125 kHz</b>, până la ~1,1 MHz; telefonul rămâne jos (0–4 kHz), separat de <b>splitter</b>; asimetric (mai mult spre abonat). <b>Modul de transfer sincron (STM)</b> = intervale de timp fixe, rezervate (circuite). <b>Modul asincron (ATM)</b> = celule trimise doar când există date (bandă împărțită după nevoie).", EX("Biți/simbol la QAM, cum lucrează DMT/ADSL, STM vs. ATM.") + RB("cap. 2.5–2.7")),
]);
L("rad", 1, "Rețele și servicii; PSTN – telefonia clasică", "☎️", /cap\. (1|3\.[1-5]|6)\b/, [
  K("Servicii și rețele", "Rețeaua e „drumul”, serviciul e „ce transporți” pe el.", "<b>Servicii suport</b> (transportul informației, ex. 64 kbit/s) vs. <b>teleservicii</b> (telefonie, fax) și <b>servicii suplimentare</b> (redirecționare, apel în așteptare, conferință). Rețele descrise în manual: PSTN, N-ISDN, SS7, IN, PLMN, X.25, Frame Relay, ATM/B-ISDN, Internet, rețele de acces."),
  K("Cum funcționează linia de telefon", "Telefonul analogic e alimentat de centrală prin perechea de cupru – de aceea merge și când se ia curentul în casă.", "<b>Bucla locală</b> = perechea abonat–centrală. Alimentare <b>−48 V c.c.</b>; soneria = tensiune alternativă (~75 V, ~25 Hz). Ridici receptorul → se închide bucla → ton de disc. Numărul: <b>DTMF</b> (două tonuri pe tastă, ex. 1 = 697 + 1209 Hz) sau impulsuri decadice (disc). Ierarhie: centrală locală → tranzit → internațională. <b>Comutație de circuite</b>: circuit rezervat toată convorbirea – întârziere mică, dar bandă irosită la date.", EX("Bucla locală, −48 V, DTMF, comutație de circuite vs. de pachete.") + RB("cap. 1, 3, 6")),
]);
L("rad", 2, "Centrale telefonice digitale și semnalizări", "🏢", /cap\. 5\b/, [
  K("Comutația digitală", "Centrala digitală nu mai leagă fire; mută octeți de vorbire dintr-un „sertar” de timp în altul.", "<b>Comutator temporal (T)</b> = schimbă intervalul de timp (scrie în memorie, citește în altă ordine). <b>Comutator spațial (S)</b> = leagă o magistrală de intrare de una de ieșire, în același interval. Structuri tipice: <b>T-S-T</b>. Comanda: <b>SPC</b> – programe pe calculatoare, nu relee."),
  K("Interfața de abonat și semnalizările", "Placa de abonat din centrală face 7 treburi pentru fiecare telefon analogic.", "<b>BORSCHT</b>: alimentare, protecție la supratensiuni, sonerie, supraveghere (receptor ridicat?), codare (codec PCM), <b>hibrid</b> 2/4 fire, testare. Semnalizări: de abonat (buclă, tonuri, DTMF) și între centrale: <b>CAS</b> (asociată canalului, ex. R2 pe TS16) sau <b>CCS</b> (canal comun, SS7).", EX("T vs. S, BORSCHT, hibridul 2/4 fire, CAS vs. CCS.") + RB("cap. 5")),
]);
L("rad", 2, "ISDN: BRI 2B+D și PRI 30B+D", "🔢", /cap\. (3\.6|7)\b/, [
  K("Digital până la abonat", "ISDN aduce linia digitală până în casă: în loc de o singură convorbire analogică, ai două canale digitale separate.", "<b>BRI</b> = <b>2B + D</b>: 2 × 64 + 16 = <b>144 kbit/s</b> util (192 kbit/s pe interfața S/T, cu încadrare). <b>PRI</b> european = <b>30B + D</b> (D = 64 kbit/s) pe E1 de <b>2,048 Mbit/s</b>; în SUA 23B + D pe T1. Canal <b>B</b> = 64 kbit/s (voce/date), canal <b>D</b> = semnalizare (DSS1/Q.931)."),
  K("Echipamente și puncte de referință", "Ca o priză cu adaptor: NT1 transformă linia de la centrală în „priza” la care pui terminalele.", "Puncte: <b>R – S – T – U</b>. <b>NT1</b>: termină linia U (2 fire) și oferă S/T (4 fire). TE1 = terminal ISDN; TE2 = terminal ne-ISDN, prin <b>TA</b>. Pe magistrala S: până la 8 terminale, dar doar 2 convorbiri simultane.", EX("2B+D = 144 kbit/s, 30B+D pe E1, rolul canalului D, NT1, R/S/T/U.") + RB("cap. 3.6, 7")),
]);
L("rad", 2, "SS7 și rețeaua inteligentă", "🧠", /cap\. (3\.8|3\.13|8|9)\b/, [
  K("SS7 – semnalizarea pe canal comun", "Vocea merge pe un drum, iar „bilețelele” dintre centrale (cine sună pe cine, eliberează linia) merg pe o rețea separată.", "Noduri: <b>SSP</b> (centrala), <b>STP</b> (dirijează mesajele de semnalizare), <b>SCP</b> (baze de date de servicii). Stivă: <b>MTP 1–3</b>, <b>ISUP</b> (apeluri: IAM, ACM, ANM, REL, RLC), SCCP, TCAP. Legături de <b>64 kbit/s</b>. Avantaje: apeluri mai rapide, roaming, SMS, servicii IN. Standard ITU-T seria Q.700."),
  K("Rețeaua inteligentă (IN)", "În loc să programezi fiecare centrală, pui „creierul” serviciului într-un singur loc și centralele îl întreabă.", "SSP detectează un apel special și cere instrucțiuni de la <b>SCP</b> prin SS7 (protocol INAP). Servicii: <b>0800</b> gratuit, <b>0900</b> tarif special, portabilitate, cartele preplătite, VPN, televoting. Standardizare pe etape: CS-1, CS-2.", EX("STP/SSP/SCP, ISUP, 64 kbit/s, ce înseamnă IN și exemple de servicii.") + RB("cap. 3.8, 3.13, 8, 9")),
]);
L("rad", 2, "PLMN: GSM, GPRS, UMTS", "📱", /cap\. (3\.7|10)\b/, [
  K("Arhitectura GSM", "Telefonul vorbește cu antena (BTS); antenele sunt conduse de un BSC; apelurile le face centrala mobilă (MSC), care ține evidența abonaților în registre.", "<b>BSS</b> = BTS + BSC. <b>MSC</b> + registre: <b>HLR</b> (abonații proprii și unde sunt), <b>VLR</b> (vizitatorii din zonă), <b>AuC</b> (chei de autentificare), <b>EIR</b> (IMEI). <b>Handover</b> = convorbirea trece la altă celulă fără întrerupere."),
  K("Frecvențe și evoluție", "GSM împarte banda în purtătoare de 200 kHz, iar fiecare purtătoare în 8 „felii” de timp.", "GSM 900: <b>890–915</b> MHz (de la mobil) / <b>935–960</b> MHz (spre mobil), duplex 45 MHz; DCS 1800: 1710–1785 / 1805–1880 MHz. <b>200 kHz</b>, <b>8 intervale</b> TDMA. <b>GPRS</b> = pachete (SGSN, GGSN). <b>UMTS</b> = W-CDMA, 5 MHz, Node B + RNC.", EX("BTS/BSC/MSC/HLR/VLR, 200 kHz și 8 intervale, benzile GSM 900, GPRS = pachete.") + RB("cap. 3.7, 10")),
]);
L("rad", 3, "Rețele de date: X.25, Frame Relay, ATM", "📦", /cap\. (3\.(9|10|11)|11|12|13)\b/, [
  K("X.25 și Frame Relay", "X.25 verifica fiecare pachet la fiecare nod (bun pe linii proaste, dar lent). Frame Relay are încredere în liniile digitale bune: aruncă cadrele stricate și lasă capetele să le ceară din nou.", "<b>X.25</b>: comutație de pachete, circuite virtuale (SVC/PVC), 3 niveluri (fizic, LAPB, pachet), <b>PAD</b> pentru terminale simple, X.75 între rețele, adrese X.121. <b>Frame Relay</b>: nivel 2, <b>DLCI</b> (circuit virtual, semnificație locală), <b>CIR</b> (debit garantat), bit <b>DE</b>, congestie <b>FECN/BECN</b>."),
  K("ATM și B-ISDN", "ATM taie totul în „cutii” identice de 53 de octeți, ca să poată fi sortate foarte repede în hardware.", "Celula: <b>5 octeți antet + 48 date = 53</b>. Conexiune identificată prin <b>VPI/VCI</b>; <b>HEC</b> protejează doar antetul. Orientat pe conexiune. <b>AAL</b> adaptează: AAL1 voce (CBR), AAL5 date. Clase: CBR, rt-VBR, nrt-VBR, ABR, UBR. Interfețe B-ISDN: 155,52 și 622,08 Mbit/s (pe SDH).", SVG.atmCell() + EX("Celula 53 = 5 + 48, VPI/VCI, DLCI/CIR la Frame Relay, X.25 corectează la fiecare nod.") + RB("cap. 3.9–3.11, 11–13")),
]);
L("rad", 3, "Transmisiuni digitale: PDH, SDH și fibra", "🧬", /cap\. 4\b/, [
  K("PDH – ierarhia plesiocronă", "Plesiocron = „aproape sincron”: fiecare echipament are ceasul lui, aproape la fel; diferențele se umplu cu biți de justificare.", "Europa: <b>E1 2,048</b> → <b>E2 8,448</b> → <b>E3 34,368</b> → <b>E4 139,264 Mbit/s</b> (câte 4 fluxuri din treapta de jos); canale: 30 / 120 / 480 / 1920. Coduri de linie: <b>HDB3</b> (E1–E3), CMI (E4). Dezavantaj: ca să scoți un E1 din E4, demultiplexezi tot."),
  K("SDH – ierarhia sincronă", "SDH are un ceas comun în toată rețeaua, așa că poți „pescui” direct un E1 dintr-un flux mare.", "<b>STM-1 = 155,52 Mbit/s</b> (cadru 9 × 270 octeți în 125 µs) = <b>63 × E1</b> sau 1 × E4; STM-4 = 622,08 Mbit/s; STM-16 ≈ 2,5 Gbit/s; STM-64 ≈ 10 Gbit/s. Echipamente: <b>ADM</b> (add-drop), DXC, regeneratoare. Inele cu autoprotecție &lt; <b>50 ms</b>. SONET: OC-3 = STM-1. Fibra: atenuare mică, bandă mare, fără EMI; LED/laser la emisie, fotodiode PIN/APD la recepție.", SVG.hierTx() + EX("Debitele E1–E4 și STM-1/4/16, 63 × E1 în STM-1, ce face un ADM, plesiocron vs. sincron.") + RB("cap. 4")),
]);
L("rad", 3, "Internet, VoIP și rețele de acces", "🏠", /cap\. (3\.12|14|15)\b/, [
  K("Internet și telefonie prin IP", "Internetul trimite pachete independente; vocea trebuie să ajungă la timp, deci „suferă” la întârzieri și pierderi.", "Comutație de pachete, fără conexiune la nivel IP. VoIP: semnalizare <b>H.323</b> sau <b>SIP</b>, voce pe <b>RTP/UDP</b>; codec <b>G.711</b> = 64 kbit/s, G.729 = 8 kbit/s. Probleme: întârziere, <b>jitter</b>, pierderi → QoS. <b>Gateway VoIP</b> = legătura cu PSTN/ISDN."),
  K("Rețeaua de acces", "Ultimul „kilometru” până la abonat: poate fi cupru, fibră, coaxial sau radio.", "<b>Concentrare</b> (mai mulți abonați pe mai puține căi) vs. <b>multiplexare</b>. Cupru: ADSL (asimetric), HDSL/SDSL (simetric), VDSL (rapid, distanțe scurte). Fibră: <b>FTTH</b>/FTTB/FTTC, <b>PON</b> cu splittere pasive (OLT – ONT). Coaxial: <b>HFC</b>, modem de cablu DOCSIS, CMTS, bandă de urcare partajată. Radio: <b>WLL</b>.", EX("ADSL vs. HDSL vs. VDSL, FTTH, PON, HFC, G.711 = 64 kbit/s, SIP/H.323.") + RB("cap. 3.12, 14, 15")),
]);

/* ===== NORTON & KEARNS – „Rețele de calculatoare”: rezumate ORIGINALE, simplificate, pe capitole ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 12) + '" font-weight="' + (o.w || 400) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 4 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "none") + '" stroke-width="' + (o.sw || 1) + '"/>'; }
  function disk(x, y, lab, f) { return r(x, y, 40, 54, f, { st: "#334155" }) + t(x + 20, y + 32, lab, { s: 10.5, w: 700, f: "#fff" }); }
  SVG.raid = function () {
    var g = "";
    g += t(70, 16, "RAID 0 (striping)", { w: 800, s: 11 }) + disk(25, 24, "A1 A3", "#2563eb") + disk(70, 24, "A2 A4", "#2563eb") + t(70, 96, "rapid, ZERO toleranță", { s: 10, f: "#dc2626", w: 700 });
    g += t(240, 16, "RAID 1 (oglindire)", { w: 800, s: 11 }) + disk(195, 24, "A1 A2", "#16a34a") + disk(240, 24, "A1 A2", "#16a34a") + t(240, 96, "copie identică · 50% util", { s: 10, f: "#166534", w: 700 });
    g += t(400, 16, "RAID 5 (paritate distrib.)", { w: 800, s: 11 }) + disk(333, 24, "A1 P2", "#7c3aed") + disk(378, 24, "A2 B1", "#7c3aed") + disk(423, 24, "P1 B2", "#7c3aed") + t(398, 96, "1 disc poate cădea · min. 3", { s: 9.5, f: "#5b21b6", w: 700 });
    g += t(240, 120, "⚠ RAID ≠ backup: nu te apără de ștergere, ransomware, incendiu.", { s: 10.5, w: 700 });
    return W("0 0 480 128", g, "Nivelurile RAID uzuale");
  };
  SVG.backup = function () {
    var g = "", d = ["D", "L", "Ma", "Mi", "J", "V"], i;
    g += t(10, 18, "Incremental: L…V = doar ce s-a schimbat de IERI (bitul de arhivă se resetează)", { a: "start", s: 10.5, w: 700, f: "#1d4ed8" });
    for (i = 0; i < 6; i++) g += r(10 + i * 76, 26, 70, 26, i ? "#93c5fd" : "#1d4ed8") + t(45 + i * 76, 44, i ? d[i] + ": mic" : "D: complet", { s: 10.5, w: 700, f: i ? "#1e3a8a" : "#fff" });
    g += t(10, 74, "Restaurare vineri: completul de duminică + TOATE incrementalele L…V", { a: "start", s: 10.5 });
    g += t(10, 100, "Diferențial: L…V = tot ce s-a schimbat de la COMPLET (bitul NU se resetează)", { a: "start", s: 10.5, w: 700, f: "#16a34a" });
    for (i = 0; i < 6; i++) g += r(10 + i * 76, 108, i ? 22 + i * 9.6 : 70, 26, i ? "#86efac" : "#16a34a") + t(14 + i * 76, 126, i ? d[i] : "D: complet", { a: "start", s: 10.5, w: 700, f: i ? "#14532d" : "#fff" });
    g += t(10, 156, "Restaurare vineri: completul de duminică + ULTIMUL diferențial (2 benzi)", { a: "start", s: 10.5 });
    return W("0 0 480 164", g, "Backup incremental vs. diferențial");
  };
})();
function NB(s) { return '<div class="fact"><b>📒 Unde găsești în manual:</b> ' + s + "</div>"; }
function NC(s) { return '<div class="eli trapw"><b>⚠ Atenție la carte:</b> ' + s + "</div>"; }
L("nor", 1, "Cap. 1 – Organisme de standardizare, OSI, componente", "📒", /cap\. 1\b/, [
  K("Cine face regulile", "Ca la fotbal: cineva scrie regulamentul, ca toți să joace la fel. În rețele sunt mai mulți „arbitri”.", "<b>ISO</b> – modelul OSI (numele vine de la „isos” = egal). <b>IEC</b> – electricitate/electronică (cu ISO formează JTC1). <b>ANSI</b> – SUA, standarde voluntare. <b>IEEE</b> – Project 802 (LAN). <b>IAB</b> coordonează <b>IETF</b>, care publică RFC-urile."),
  K("OSI în 7 trepte", "Fiecare nivel face o treabă și folosește serviciile celui de dedesubt; nivelurile „pereche” de pe cele două calculatoare vorbesc logic între ele.", "1 Fizic (biți ↔ semnale) · 2 Legătură de date (cadre, MAC, CRC) · 3 Rețea (rutare, adrese logice – necesar doar între rețele diferite) · 4 Transport (livrare cap-la-cap) · 5 Sesiune (dialogul) · 6 Prezentare (ASCII/EBCDIC, criptare, compresie) · 7 Aplicație (interfața spre aplicații, nu aplicația). Componente: NIC (acces în LAN), router (acces în WAN), repetor (amplifică fără să interpreteze).", SVG.osi() + EX("Ordinea și rolul nivelurilor OSI, ce organism face ce standard.") + NB("cap. 1")),
]);
L("nor", 1, "Cap. 2–3 – Semnale, cabluri, fibră, wireless, cadre și acces la mediu", "🔌", /cap\. [23]\b/, [
  K("Semnale și medii", "Baud = de câte ori se schimbă semnalul pe secundă; dacă fiecare schimbare duce 2 biți, ai de două ori mai mulți bps decât baud.", "Lățimea de bandă = f<sub>max</sub> − f<sub>min</sub> (902–928 MHz → 26 MHz). Atenuarea se rezolvă cu repetoare; distorsiunea, cu CRC + retransmisie. Coaxial RG-58 <b>50 Ω</b> (10Base2, 185 m); coaxial gros 500 m. UTP: Cat 3 = <b>16 MHz</b>, Cat 4 = 20 MHz, Cat 5 = <b>100 MHz</b>. Fibră: multimod 62,5/125 cu LED (850 nm), monomod ~8–10 µm cu laser. Wi-Fi: benzi ISM, <b>CSMA/CA</b>; infraroșul nu trece prin pereți.", SVG.cables()),
  K("Cadre și acces la mediu", "Cadrul e „plicul” de nivel 2: pe el scrie adresa destinatarului și a expeditorului, iar la final are o sumă de control.", "MAC: primii 3 octeți = producătorul (<b>OUI</b>). Ethernet II are câmpul <b>Tip</b>, 802.3 „brut” are <b>Lungime</b>; 802.2 LLC și SNAP adaugă câmpuri. Cadru <b>64–1518</b> octeți (date 46–1500); pauză între cadre <b>96 de biți</b>; minimul de 64 vine din slotul de 512 biți (51,2 µs la 10 Mbps). Nivelul 2 = <b>LLC</b> + <b>MAC</b>. Acces: concurență (CSMA/CD), jeton (determinist), prioritatea cererii (802.12), comutat (full-duplex, fără coliziuni).", NC("în carte apar „64–1500” sau „1524” pentru cadru și „Ethernet la 100 MHz”. Corect: cadru 64–1518, Ethernet clasic = 10 Mbps.") + EX("Baud vs. bps, Cat 3/5, 50 Ω, cadrul 64–1518, de ce minim 64, LLC/MAC, CSMA/CA la Wi-Fi.") + NB("cap. 2–3")),
]);
L("nor", 1, "Cap. 4 – TCP/IP, adrese IPv4/IPv6 și protocoalele vechi", "🔢", /cap\. 4\b/, [
  K("Stive și antete", "Fiecare nivel „împachetează” datele celui de deasupra: segmentul TCP intră în pachetul IP, care intră în cadrul Ethernet.", "TCP/IP la Norton: proces/aplicație · <b>gazdă-la-gazdă</b> (TCP, UDP) · <b>interrețea</b> (IP) · acces la rețea. UDP: 8 octeți (porturi, lungime, sumă de control). TCP ≥ 20 octeți (secvență, confirmare, fereastră). IPv4: max. <b>65 535</b> octeți.", NC("cartea scrie 65 536 pentru lungimea IP și 16 774 214 gazde la clasa A. Corect: 65 535 și 16 777 214 (2²⁴ − 2).")),
  K("Adrese", "IPv4 are 32 de biți; IPv6 are 128 – un număr uriaș de adrese.", "Clase: A 1–126 (0…), B 128–191 (10…), C 192–223 (110…), D multicast, E experimental. Exemplul firmei cu 300 de PC-uri arată risipa claselor → subnetare, CIDR. IPv6: <b>FE80::/10</b> link-local, FF multicast, <b>anycast</b> (nou), ::FFFF:a.b.c.d = IPv4 mapat; azi unicast global 2000::/3, ULA FC00::/7. Protocoale vechi: <b>NetBEUI</b> (nerutabil, multe broadcast-uri), IPX (adresă de 80 de biți), AppleTalk.", SVG.ipv4() + EX("Clasele și biții de început, gazde pe clasă, IPv6 128 biți, FE80::/10, anycast, NetBEUI nerutabil.") + NB("cap. 4")),
]);
L("nor", 2, "Cap. 5–6 – Topologii LAN și Ethernet (10/100/1000)", "🔗", /cap\. [56]\b/, [
  K("Tipuri de rețele și topologii", "Peer-to-peer = fiecare PC e și client, și server (ieftin, pentru puțini utilizatori). Pe server = totul centralizat (securitate, backup).", "Topologii: magistrală, inel (Token Ring – fizic stea cu <b>MSAU</b>), stea (hub/switch), comutată (fiecare port e un domeniu de coliziune). Backbone: serie (cascadă), distribuită, <b>restrânsă</b> (un echipament central – punct unic de defectare), paralelă (legături duble).", SVG.topo()),
  K("Ethernet pe viteze", "Numele spune tot: 10Base-T = 10 Mbps, bandă de bază, perechi torsadate.", "10Base2: 185 m, 30 de prize · 10Base5: 500 m, 100 de prize · 10Base-T: 100 m · 10Base-FL: 2 km · max. <b>1024</b> de stații. Fast Ethernet: 100Base-TX (Cat 5, 2 perechi), 100Base-FX (~2 km full-duplex), 100Base-T4 (8B6T); codare <b>4B/5B</b> (125 Mbaud); max. 2 repetoare de clasa II. Gigabit (<b>1000 Mbps</b>): 8B/10B, 1,25 Gbaud; SX 550 m pe 50 µm, LX ~5 km monomod, CX 25 m, 1000Base-T (802.3ab, 1999) pe 4 perechi; buget de întârziere &lt; 51,2 µs la 10 Mbps.", NC("„Gigabit = 1024 Mbps” și „802.3ab în 1990” sunt greșeli; corect 1000 Mbps și 1999.") + EX("Lungimile maxime pe tip de cablu, 1024 de stații, 4B/5B vs. 8B/10B, peer-to-peer vs. server.") + NB("cap. 5–6")),
]);
L("nor", 2, "Cap. 7–9 – Token Ring, FDDI și ATM (tehnologii istorice)", "💍", /cap\. [789]\b/, [
  K("Token Ring și FDDI", "Un „bețișor” (jetonul) circulă pe inel; vorbește doar cine îl ține. Așa nu există coliziuni.", "<b>Token Ring</b> (802.5): 4/16 Mbps, max. <b>260</b> de stații, jeton ținut implicit 10 ms, monitor activ (ceas, cadre orfane, buffer de 24 de biți), MSAU cu porturi RI/RO. <b>FDDI</b>: 100 Mbps, două inele de fibră contrarotative care se „înfășoară” la defect, max. 500 de stații, inel &lt; 200 km, cadru max. 4500 octeți, stații DAS/SAS."),
  K("ATM", "Celule mici și identice = comutare rapidă în hardware.", "Celulă <b>53 = 5 + 48</b> (48 = compromis între 64 cerut de SUA și 32 cerut de Europa). VPI 8 biți la UNI / 12 la NNI, VCI 16 biți. Clase A–D cu AAL1…AAL5 (AAL5 pentru date). <b>LANE</b> emulează Ethernet/Token Ring peste ATM. OC-3 = 155,52 Mbps.", AZI_N() + EX("260 de stații Token Ring, FDDI 100 Mbps cu inel dublu, celula ATM 53 = 5 + 48.") + NB("cap. 7–9")),
]);
function AZI_N() { return '<div class="eli trapw"><b>⚠ Azi:</b> Token Ring, FDDI și ATM au dispărut din LAN-uri; au rămas întrebări de cultură generală la examen.</div>'; }
L("nor", 2, "Cap. 10–11 – WAN: T1/E1, SONET/SDH, Frame Relay, X.25, topologii", "🌐", /cap\. 1[01]\b/, [
  K("Linii și ierarhii", "O linie închiriată e un „culoar” rezervat doar pentru tine, obținut prin multiplexare în timp.", "<b>DS-0</b> = 64 kbps. <b>T-1</b> = 1,544 Mbps = 24 canale (cadru D-4 de <b>193</b> biți; ESF = 24 de cadre); <b>E-1</b> = 2,048 Mbps = 32 de intervale (30 utile); <b>T-3</b> = 44,736 Mbps = 28 × T-1 = 672 canale; E-3 = 34,368 Mbps. Cod de linie AMI + <b>B8ZS</b> (în Europa HDB3). SONET: OC-1 51,84 · <b>OC-3 155,52</b> · OC-12 622,08 · OC-48 2,488 Gbps · OC-192 ≈ 10 Gbps; STS-n = varianta electrică. În Europa: SDH (STM-1 = 155,52 Mbps). T-1 fracționat = doar o parte din canale.", NC("„STS-3 = OC-1” și „X.25 proiectat în 1996” sunt greșeli; corect STS-3 ↔ OC-3 și X.25 din 1976.")),
  K("Pachete, hardware și topologii", "X.25 verifică totul la fiecare nod (lent, sigur); Frame Relay lasă verificarea pe seama capetelor (rapid).", "X.25: pachete de 128 de octeți, LAPB, X.121. Frame Relay: <b>DLCI</b>, <b>CIR</b>, PVC/SVC, FECN/BECN/DE; nu supraabona. <b>CSU/DSU</b> termină linia digitală; CPE = echipamentul clientului. Rutare: distance-vector, link-state, hibridă (EIGRP), statică. Topologii WAN: stea (max. 2 salturi, punct unic de cădere), inel, <b>plasă completă n(n−1)/2</b>, plasă parțială, pe niveluri. Adrese private RFC 1918.", EX("T-1/E-1/T-3, OC-3 = 155,52, 193 de biți D-4, DLCI/CIR, n(n−1)/2, CSU/DSU.") + NB("cap. 10–11")),
]);
L("nor", 3, "Cap. 12–13 – Modemuri, RS-232, acces la distanță, VPN", "📞", /cap\. 1[23]\b/, [
  K("Modemuri", "Modemul „cântă” biții pe linia telefonică analogică și îi „ascultă” la celălalt capăt.", "Modem = <b>DCE</b>, calculator = <b>DTE</b>. QAM-16: 4 biți/baud → 2400 baud × 4 = <b>9600 bps</b>. V.32 = 9600 · <b>V.32 bis = 14 400</b> · V.34 = 28 800/33 600 · <b>V.90</b> = 56K (≈ 53 kbps descărcare, 33,6 kbps încărcare) · V.42 = corecția erorilor · V.42 bis = compresie. Asincron: ~20–25% overhead (start/stop). RS-232: ~<b>15 m</b>, până la 19,2 kbps; DTR = pinul 20 (DB-25). RS-422 echilibrat: ~1200 m."),
  K("Acces la distanță", "Te conectezi de acasă la rețeaua firmei ca și cum ai fi la birou.", "SLIP: doar IP, fără verificarea erorilor. <b>PPP</b>: LCP (stabilește/testează legătura) + NCP (protocolul de rețea), autentificare PAP/CHAP. Securitate RAS: parole, <b>apel invers</b>, firewall-uri. Extranet = intraneturile partenerilor legate selectiv. VPN = tunel criptat prin Internet.", AZI("PPTP este nesigur; azi VPN cu IPsec, OpenVPN, WireGuard. Modemurile dial-up au fost înlocuite de DSL, fibră și 4G/5G.") + EX("Baud vs. bps la QAM, V.32 bis / V.34 / V.90, V.42 vs. V.42 bis, PPP vs. SLIP, apel invers.") + NB("cap. 12–13")),
]);
L("nor", 3, "Cap. 14–17 – Administrare, monitorizare, UPS, backup, RAID, securitate", "🛟", /cap\. 1[4-7]\b/, [
  K("Administrare și monitorizare", "Drepturile se dau grupurilor, nu oamenilor – așa la un angajat nou doar îl pui în grupul potrivit.", "Nume NetBIOS: <b>16</b> caractere (15 + tipul). Strategia <b>AGLP</b>: conturi → grup Global → grup Local → Permisiuni. Partajare + NTFS → contează cea <b>mai restrictivă</b>. Event Viewer pentru jurnale și audit. <b>ping</b> (timp, TTL), <b>tracert</b> (TTL crescător, max. 30 de salturi implicit), analizoare de rețea."),
  K("UPS, backup, RAID", "Totul se strică la un moment dat – contează să ai plan.", "UPS <b>offline</b> = comută pe baterie la cădere; <b>online</b> = alimentare permanentă prin invertor, tensiune curată. Backup: <b>complet</b> (resetează bitul de arhivă), <b>copie</b> (nu-l atinge), <b>diferențial</b> (de la ultimul complet, nu resetează → complet + ultimul diferențial), <b>incremental</b> (de la ultima salvare, resetează → complet + toate incrementalele). RAID 0 = striping fără toleranță · RAID 1 = oglindire · RAID 5 = paritate distribuită. Securitate la nivel de partajare vs. de utilizator.", SVG.backup() + SVG.raid() + AZI("regula 3-2-1 (3 copii, 2 medii, 1 în afara sediului/offline); RAID 6 și 10; RAID nu înlocuiește backup-ul.") + EX("Tipurile de backup și ce benzi îți trebuie la restaurare, RAID 0/1/5, UPS offline vs. online, AGLP.") + NB("cap. 14–17")),
]);
L("nor", 3, "Cap. 18–19 – Directoare (DNS, LDAP, Kerberos, AD) și depanare (ADJUST)", "🗂️", /cap\. 1[89]\b/, [
  K("Servicii de directoare", "Directorul e „cartea de telefon” a rețelei: cine și ce există, unde și cu ce drepturi.", "X.500: DIB (baza), DIT (arborele), DSA (serverul), DUA (clientul), DAP; nume: C, O, OU, CN; DN = numele complet, RDN = cel relativ. <b>LDAP</b> = DAP „ușor”, TCP <b>389</b> (LDAPS 636). DNS: servere de nume, resolvere, zone. <b>WINS</b>: NetBIOS → IP. <b>Kerberos</b> (MIT): KDC, tichete, tărâmuri; V5 în Windows 2000 (NT 4 folosea NTLM). <b>Active Directory</b>: nume pe DNS, domenii → arbori → păduri, încredere tranzitivă, OU, replicare multimaster."),
  K("Depanare cu metoda ADJUST", "Nu ghicești: izolezi logic defectul, pas cu pas.", "<b>A</b>ssess (prioritatea) → <b>D</b>iscover (informații) → <b>J</b>ustify (cauze probabile) → <b>U</b>nit test (schimbi UN singur lucru) → <b>S</b>tudy (evaluezi) → <b>T</b>ranscribe (documentezi). Lungimi maxime: UTP/STP 100 m, coaxial subțire 185 m, gros 500 m, fibră ~2 km. Unelte: <b>TDR</b> (unde e defectul pe cablu), voltmetru digital, osciloscop, analizor de protocol. Probleme: conflicte IRQ (5/10 libere pe PC-urile vechi), tip de cadru greșit, furtuni de broadcast → segmentare.", EX("LDAP 389, DN/RDN, WINS, KDC, AD pe DNS, pașii ADJUST, TDR.") + NB("cap. 18–19")),
]);

/* ===== Hardware PC în detaliu – lecții ORIGINALE (subiecte de tip „hardware bible”, explicate simplu) ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 11) + '" font-weight="' + (o.w || 700) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 4 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "#334155") + '" stroke-width="1"/>'; }
  SVG.mobo = function () {
    var g = r(4, 4, 472, 292, "#d1fae5", { st: "#065f46", rx: 8 });
    g += r(20, 20, 70, 40, "#e2e8f0") + t(55, 44, "porturi spate", { s: 9.5 });
    g += r(110, 20, 140, 26, "#fde68a") + t(180, 37, "VRM (faze alimentare)", { s: 9.5 });
    g += r(130, 56, 100, 80, "#93c5fd") + t(180, 92, "SOCKET", { s: 12 }) + t(180, 108, "procesor", { s: 10, w: 400 });
    g += r(260, 20, 64, 22, "#fca5a5") + t(292, 35, "EPS 12 V", { s: 9.5 });
    for (var i = 0; i < 4; i++) g += r(340 + i * 18, 20, 12, 140, i % 2 ? "#c4b5fd" : "#a78bfa");
    g += t(373, 178, "RAM (DIMM)", { s: 9.5 });
    g += r(440, 60, 26, 100, "#fca5a5") + t(453, 112, "24p", { s: 9.5 });
    g += r(40, 160, 280, 16, "#fbbf24") + t(180, 172, "PCIe x16 (placa video) – linii de la CPU", { s: 9.5 });
    g += r(130, 140, 100, 14, "#e5e7eb") + t(180, 151, "M.2 (SSD NVMe)", { s: 9 });
    g += r(40, 190, 80, 12, "#fde68a") + t(80, 200, "PCIe x1", { s: 9 });
    g += r(40, 214, 280, 16, "#fbbf24") + t(180, 226, "PCIe x16 fizic (adesea x4)", { s: 9.5 });
    g += r(340, 200, 80, 60, "#cbd5e1") + t(380, 228, "CHIPSET", { s: 10.5 }) + t(380, 244, "(PCH)", { s: 9.5, w: 400 });
    g += r(432, 190, 34, 70, "#e2e8f0") + t(449, 230, "SATA", { s: 8.5 });
    g += r(40, 244, 30, 30, "#e5e7eb", { rx: 15 }) + t(55, 263, "CMOS", { s: 7.5 });
    g += r(90, 250, 110, 22, "#e5e7eb") + t(145, 265, "BIOS/UEFI (flash)", { s: 9 });
    g += r(220, 266, 110, 20, "#e5e7eb") + t(275, 280, "panou frontal", { s: 9 });
    return W("0 0 480 300", g, "Harta unei plăci de bază ATX (simplificat)");
  };
})();
L("pc", 2, "Placa de bază, procesorul și memoria în detaliu", "🧩", /chipset|PCH|socket|VRM|L1|XMP|EXPO|EPS|CL16|iGPU|PWM|DDR4 într-un slot DDR5|dual channel/i, [
  K("Placa de bază = orașul", "Placa de bază e un oraș: procesorul e primăria, memoria RAM e biroul de lângă ea, iar „drumurile” (magistralele) duc spre cartierele cu periferice.", "<b>Socket</b> – soclul procesorului (trebuie să se potrivească: ex. AM5, LGA1700). <b>VRM</b> – coboară 12 V la ~1 V pentru CPU. <b>Chipset (PCH)</b> – SATA, USB, linii PCIe suplimentare, rețea, sunet. Controlerul de memorie și linia x16 pentru placa video sunt azi chiar în procesor.", SVG.mobo()),
  K("Procesorul: nuclee, fire, cache", "Un nucleu e un bucătar. Cu SMT/Hyper-Threading, fiecare bucătar poate supraveghea două oale deodată, dar tot un singur bucătar rămâne.", "Frecvența (GHz) = câte cicluri pe secundă. <b>Cache</b>: L1 (cel mai mic și rapid, în fiecare nucleu) → L2 → L3 (mare, comun). <b>TDP</b> (W) = căldura pe care trebuie s-o evacueze coolerul. Prea cald → <i>thermal throttling</i> (scade frecvența). <b>iGPU</b> = grafică în procesor, folosește din RAM. Ventilatoare cu 4 pini = turație reglată prin PWM."),
  K("Memoria RAM", "Fiecare generație DDR are „cheia” (crestătura) în alt loc, ca un lacăt care nu primește altă cheie.", "DDR3 1,5 V · DDR4 1,2 V · DDR5 1,1 V – nu sunt interschimbabile. Desktop = DIMM, laptop = <b>SO-DIMM</b>. <b>Dual channel</b>: două module identice în sloturile din manual (de obicei aceeași culoare). <b>ECC</b> corectează erorile de un bit (servere). Viteza de pe etichetă se activează cu profilul <b>XMP/EXPO</b>; <b>CL</b> (latența CAS) – mai mic e mai bine la aceeași frecvență.", EX("în ce sloturi pui 2 module pentru dual channel (cele indicate în manual, de obicei A2 + B2) și de ce DDR4 nu intră în slot DDR5.")),
]);
L("pc", 3, "Magistrale, porturi și asamblarea pas cu pas", "🪛", /PCI Express|PCIe|linii|USB4|Thunderbolt|USB-C|distanțier|standoff|asamblarea|pasta termică|panoul frontal|brățării|placă POST|CPU_FAN|SSD NVMe M\.2|2280|NVMe/i, [
  K("Magistralele = autostrăzi", "Vechea magistrală PCI era un singur drum împărțit de toată lumea. PCIe dă fiecărei plăci benzile ei proprii.", "<b>PCIe</b>: linii seriale punct-la-punct; x1/x4/x16 = numărul de linii. Debit pe linie și sens: ~1 GB/s (3.0), ~2 GB/s (4.0), ~4 GB/s (5.0). Vechi: ISA → PCI (133 MB/s) → AGP (grafică). <b>M.2</b> = forma (ex. 2280 = 22 × 80 mm); <b>NVMe</b> = protocolul rapid pe PCIe; SATA III rămâne la ~600 MB/s."),
  K("Porturi", "Conectorul nu spune viteza: un USB-C poate fi lent ca USB 2.0 sau rapid ca Thunderbolt.", "USB 2.0 = 480 Mbit/s · USB 3.2 Gen 1 = 5 Gbit/s · Gen 2 = 10 Gbit/s · USB4/Thunderbolt 4 = 40 Gbit/s. Imagine: HDMI, DisplayPort (VGA/DVI sunt vechi). Sursa ATX: 24 de pini placa, EPS 4+4 procesorul, PCIe 6 pini (75 W) / 8 pini (150 W) placa video; slotul dă încă 75 W."),
  K("Asamblarea în 8 pași", "Ca la LEGO: întâi piesele mici pe placă, abia apoi placa în cutie.", "1) Scoți din priză, brățară antistatică pe metal nevopsit. 2) CPU în socket (triunghiul aliniat), fără forță. 3) Pastă termică – cât un bob de mazăre – și coolerul (CPU_FAN). 4) RAM. 5) Distanțiere, apoi placa în carcasă. 6) Sursa, stocarea (M.2/SATA), placa video în primul x16. 7) Cablurile: 24p, EPS, PCIe, panoul frontal (PWR SW, RESET, LED-uri). 8) Test: intri în UEFI, verifici CPU/RAM/discuri și temperaturile."),
  K("Depanare de la simplu la complex", "Ca la mașină: întâi verifici dacă are benzină, apoi deschizi motorul.", "Nimic nu pornește → priză, întrerupătorul sursei, 24p, butonul. Ventilatoare merg, fără imagine, bipuri/LED DRAM/VGA → reașezi RAM-ul (un singur modul), placa video, EPS. „CPU Fan Error” → coolerul. Clicuri și erori S.M.A.R.T. → backup imediat. O <b>placă POST</b> afișează codul etapei la care s-a oprit pornirea."),
]);

/* ===== VoIP Cisco (Davidson & Peters) – lecții ORIGINALE, explicate de la zero ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 11) + '" font-weight="' + (o.w || 700) + '">' + s + "</text>"; }
  function r(x, y, w, h, f) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" fill="' + f + '" stroke="#334155" stroke-width="1"/>'; }
  function ar(x1, y1, x2, y2, c) { var d = x2 > x1 ? -7 : 7; return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="2"/><path d="M' + x2 + " " + y2 + " l" + d + " -4 v8 z" + '" fill="' + c + '"/>'; }
  SVG.voipPkt = function () {
    var g = t(240, 16, "Un pachet de voce G.711 (20 ms de vorbire)", { s: 12 });
    g += r(10, 28, 60, 34, "#fde68a") + t(40, 44, "IP", { s: 11 }) + t(40, 57, "20 B", { s: 9.5, w: 400 });
    g += r(70, 28, 40, 34, "#fdba74") + t(90, 44, "UDP", { s: 10.5 }) + t(90, 57, "8 B", { s: 9.5, w: 400 });
    g += r(110, 28, 50, 34, "#fca5a5") + t(135, 44, "RTP", { s: 11 }) + t(135, 57, "12 B", { s: 9.5, w: 400 });
    g += r(160, 28, 310, 34, "#86efac") + t(315, 44, "voce: 160 B", { s: 11 }) + t(315, 57, "64 000 bit/s × 0,02 s ÷ 8", { s: 9.5, w: 400 });
    g += t(10, 86, "50 pachete/s × (40 + 160) B × 8 = 80 kbit/s pe sens (nivel IP)", { a: "start", s: 10.5 });
    g += t(10, 106, "G.729: 50 × (40 + 20) B × 8 = 24 kbit/s → antetul cântărește mai mult decât vocea!", { a: "start", s: 10.5, f: "#b91c1c" });
    return W("0 0 480 116", g, "Anatomia unui pachet VoIP");
  };
  SVG.sipFlow = function () {
    var g = t(70, 16, "Telefon A", { s: 11 }) + t(410, 16, "Telefon B", { s: 11 });
    g += '<line x1="70" y1="22" x2="70" y2="232" stroke="#64748b" stroke-width="2"/><line x1="410" y1="22" x2="410" y2="232" stroke="#64748b" stroke-width="2"/>';
    var m = [["INVITE (+ SDP: codecuri, IP, port)", 1], ["100 Trying", 0], ["180 Ringing (sună)", 0], ["200 OK (a răspuns)", 0], ["ACK", 1]], i;
    for (i = 0; i < m.length; i++) { var y = 40 + i * 28; g += m[i][1] ? ar(72, y, 408, y, "#1d4ed8") : ar(408, y, 72, y, "#16a34a"); g += t(240, y - 5, m[i][0], { s: 10 }); }
    g += r(80, 182, 320, 20, "#fde68a") + t(240, 196, "voce prin RTP/UDP, direct între telefoane", { s: 10 });
    g += ar(72, 222, 408, 222, "#b91c1c") + t(240, 217, "BYE → 200 OK (închidere)", { s: 10 });
    return W("0 0 480 236", g, "Un apel SIP simplu (proxy-ul omis)");
  };
})();
function VB(s) { return '<div class="fact"><b>🎧 În manualul Cisco:</b> ' + s + "</div>"; }
L("voip", 1, "Telefonia clasică (PSTN) explicată pentru VoIP", "☎️", /cap\. [1-5]\)/, [
  K("De la fir la centrală", "Gândește-te la PSTN ca la un oficiu poștal uriaș: fiecare casă are drumul ei (bucla locală) până la oficiul din cartier (centrala), iar oficiile sunt legate între ele prin drumuri mari (joncțiuni).", "Analogic: zgomotul se adună la fiecare amplificare. Digital: repetorul decide doar 1/0 și regenerează. Vocea: filtru ~4 kHz → <b>8000 eșantioane/s</b> (Nyquist) × <b>8 biți</b> = <b>64 kbit/s</b> (G.711). Europa: <b>legea A</b>; America/Japonia: legea µ.", VB("cap. 1 – PSTN și comparația cu VoIP.")),
  K("Cum se cere un apel", "Ridici receptorul → curge curent prin buclă (off-hook) → centrala îți dă ton. Între centrale, mesajele merg pe o rețea separată, SS7, ca niște bilețele trimise pe la spate.", "SS7: <b>IAM</b> (cer apelul) → <b>ACM</b> (am găsit, sună – tonul îl face centrala ta) → <b>ANM</b> (a răspuns) → … <b>REL/RLC</b> (închidere). CAS = semnalizare în canalul convorbirii; CCS = canal comun (ISDN D, SS7). QSIG = ISDN între PBX-uri diferite."),
  K("Servicii și numerotare", "Unele servicii le face doar centrala ta (apel în așteptare); altele au nevoie ca informația să circule prin toată rețeaua (afișarea numărului).", "Custom calling (centrala locală) vs. <b>CLASS</b> (cer SS7 cap-la-cap). Numere gratuite: plătește cel apelat. Centrex = PBX „închiriat” de la operator. <b>E.164</b>: cod țară (+40) + cod național + abonat, max. 15 cifre. T3 = 28 T1 = 672 canale (44,736 Mbit/s); E3 = 16 E1 = 480 de canale de voce (16 × 30; 512 intervale de timp în total) la 34,368 Mbit/s.", '<div class="eli trapw"><b>⚠ Atenție la carte:</b> în previzualizare, la T4 scrie „4032 de canale de 4 kbps” – corect este <b>4032 de canale de 64 kbit/s</b> (168 × T1, 274,176 Mbit/s).</div>'),
]);
L("voip", 1, "Vocea în pachete: codecuri, RTP, bandă", "📦", /cap\. [678]\)/, [
  K("De ce VoIP", "În loc să ai două rețele (una de telefon, una de calculatoare), le ai pe una singură – ca o autostradă pe care merg și mașini, și camioane.", "Avantaje: o singură rețea, apeluri între sedii pe WAN-ul propriu (<b>toll bypass</b>), aplicații noi ușor de făcut. Vocea merge pe <b>UDP</b>: un pachet retransmis ar veni prea târziu. Peste UDP, <b>RTP</b> pune număr de secvență și timestamp; <b>RTCP</b> raportează pierderi și jitter."),
  K("Codecuri", "Codecul e „traducătorul” care strânge vocea în cât mai puțini biți – unii păstrează tot (G.711), alții doar esențialul (G.729).", "<b>G.711</b> 64 kbit/s (MOS ≈ 4,1) · <b>G.729</b> 8 kbit/s (MOS ≈ 3,9) · G.726 ADPCM 32 kbit/s · G.723.1 5,3/6,3 kbit/s · <b>G.722</b> bandă largă (~7 kHz) la 64 kbit/s. <b>MOS</b> 1–5. <b>VAD</b> = nu trimite liniștea (+ zgomot de confort). Fax: G.711 sau T.38.", SVG.voipPkt()),
  K("Câtă bandă ocupă un apel", "Fiecare „plic” (pachet) are o etichetă cu adrese de 40 de octeți. Dacă scrisoarea din plic e mică, eticheta costă mai mult decât scrisoarea.", "20 ms/pachet → <b>50 pachete/s</b>. G.711: 160 B voce + 40 B antete → <b>80 kbit/s</b> (~87 pe Ethernet). G.729: 20 B + 40 B → <b>24 kbit/s</b>. <b>cRTP</b> comprimă antetul de 40 B la 2–4 B pe legături lente.", EX("debitul G.711 (64 kbit/s) vs G.729 (8 kbit/s), de ce UDP, ce adaugă RTP.")),
]);
L("voip", 2, "Calitatea apelului: întârziere, jitter, pierderi, QoS", "⏱️", /cap\. (8–9|9)\)/, [
  K("Cei trei dușmani", "O conversație bună e ca o minge pasată între doi: dacă ajunge târziu (întârziere), neregulat (jitter) sau deloc (pierdere), jocul se strică.", "Întârziere pe un sens: ideal <b>≤ 150 ms</b> (ITU-T G.114), peste ~400 ms inacceptabil. Tipuri: propagare, procesare (codec), cozi. <b>Jitter</b> = variația întârzierii → buffer de dejitter (adaugă puțină întârziere). Pierderi: codecul ascunde pachete izolate; peste ~1% se aude. <b>Ecou</b>: de la hibridul 2/4 fire → anulator de ecou (G.168)."),
  K("QoS: vocea are prioritate", "Ca la ambulanță: vocea primește semnal și bandă proprie, ca să nu stea în trafic după camioanele de date.", "Marcare: <b>DSCP EF (46)</b>, CoS 5 pe 802.1Q. Coadă prioritară <b>LLQ</b>. Pe legături lente: un pachet de 1500 B la 64 kbit/s ține linia ~187 ms → fragmentare + intercalare (<b>LFI</b>). <b>CAC</b> refuză apelul în plus în loc să le strice pe toate. RSVP (rezervă pe flux) vs. DiffServ (clase).", EX("150 ms, jitter, EF 46, de ce QoS pe WAN.")),
]);
L("voip", 2, "Protocoale de semnalizare: H.323, SIP, MGCP", "📡", /cap\. 1[0-3]\)/, [
  K("H.323 – familia ITU-T", "H.323 e ca un dosar cu mai multe formulare, fiecare pentru alt pas al apelului.", "Componente: terminal, <b>gateway</b>, <b>gatekeeper</b> (traduce adrese, aprobă apeluri, gestionează banda – RAS), MCU (conferințe). <b>H.225</b> = semnalizarea apelului (din Q.931); <b>H.245</b> = negocierea codecurilor și deschiderea canalelor media."),
  K("SIP – limbajul text al IETF", "SIP seamănă cu o pagină web: mesaje text, coduri ca la HTTP (200 OK, 404 Not Found).", "Port <b>5060</b> (5061 TLS). Componente: agenți utilizator, <b>proxy</b>, <b>registrar</b> (REGISTER), redirect. Corpul INVITE poartă <b>SDP</b> (codec, IP, port). Răspunsuri: 1xx info, 2xx OK, 3xx redirect, 4xx client (404, 486 Busy), 5xx server, 6xx global.", SVG.sipFlow()),
  K("MGCP/H.248 și softswitch", "Gateway-urile sunt „mâinile”, iar call agent-ul e „creierul” care le spune ce să facă.", "<b>MGCP</b> și <b>Megaco/H.248</b>: model stăpân–sclav, control centralizat. <b>Softswitch</b> = controlul apelurilor în software, separat de transportul vocii."),
]);
L("voip", 3, "VoIP în instituție: PBX, telefoane IP, gateway-uri", "🏢", /cap\. 1[45]\)/, [
  K("De la PBX la IP-PBX", "PBX-ul e „centrala de casă” a instituției: interioarele vorbesc gratis între ele și ies în oraș prin câteva linii.", "IP-PBX (Cisco Unified CM, Asterisk) controlează telefoanele IP. Telefon IP: <b>PoE</b> din switch, <b>VLAN de voce</b>, PC-ul legat prin telefon. <b>FXS</b> = port pentru telefon analogic; <b>FXO</b> = port spre linia centralei. Gateway: IP ↔ TDM (E1 PRI = 30 de convorbiri)."),
  K("Planul de numerotare și 112", "Dacă două sedii au aceleași interioare, apelul nu știe unde să meargă – ca două case cu același număr pe aceeași stradă.", "Prefixe de sediu sau renumerotare; funcțiile obișnuite (transfer, așteptare) trebuie să meargă la fel peste IP (<b>transparența funcțiilor</b>). La <b>112</b>: telefonul IP se poate muta, deci locația trebuie configurată, iar apelul trebuie să iasă prin gateway-ul local.", EX("FXS vs FXO, PoE și VLAN de voce, ce face gateway-ul.")),
]);

/* ===== Antene și radio – lecții ORIGINALE pe temele din Colonati („Radiocomunicații digitale”) și Graham et al. („Mobile Radio Network Design in the VHF and UHF Bands”) ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 11) + '" font-weight="' + (o.w || 700) + '">' + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 3 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "#334155") + '" stroke-width="1"/>'; }
  function ln(x1, y1, x2, y2, c, w, d) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (c || "#334155") + '" stroke-width="' + (w || 1.5) + '"' + (d ? ' stroke-dasharray="' + d + '"' : "") + "/>"; }
  /* buget de legătură „cascadă” (exemplul BS → portabil, UHF) */
  SVG.budgetW = function () {
    var y0 = 30, sc = 5, g = "", steps = [["TX", 41.5, "#2563eb"], ["fider −3", -3, "#ef4444"], ["conector −1", -1, "#ef4444"], ["antenă +2,5", 2.5, "#16a34a"]];
    function Y(v) { return y0 + (45 - v) * sc; }
    g += ln(40, Y(40), 470, Y(40), "#94a3b8", 1, "4 3") + t(468, Y(40) - 4, "ERP 40 dBm", { a: "end", s: 9.5, f: "#475569" });
    var lvl = 0, x = 48;
    steps.forEach(function (s, i) { var a = i ? lvl : 0, b = i ? lvl + s[1] : s[1]; var top = Y(Math.max(a, b)), h = Math.max(4, Math.abs(Y(a) - Y(b))); if (!i) { top = Y(b); h = Y(30) - Y(b); } g += r(x, top, 46, h, s[2]) + t(x + 23, Y(30) + 14, s[0], { s: 9 }); lvl = b; x += 60; });
    g += t(48 + 23, Y(41.5) - 5, "41,5", { s: 9.5 });
    g += r(290, 60, 180, 74, "#f8fafc") + t(380, 77, "Drum: −135 dB", { s: 10.5, f: "#b91c1c" }) + t(380, 94, "→ −95 dBm la antena RX", { s: 10 }) + t(380, 111, "portabil −3, conector −1, cablu −0,5", { s: 9, w: 400 }) + t(380, 127, "→ −99,5 dBm la intrarea RX", { s: 10, f: "#1d4ed8" });
    return W("0 0 480 140", g, "Bugetul legăturii pas cu pas (dB se adună și se scad)");
  };
  /* intermodulație de ordinul 3 */
  SVG.imd = function () {
    var g = ln(20, 110, 460, 110, "#334155", 1.5), f = [[372, 18, "#cbd5e1", "372"], [376, 46, "#f97316", "376 = 2A−B"], [380, 92, "#2563eb", "A 380"], [384, 92, "#2563eb", "B 384"], [388, 46, "#f97316", "388 = 2B−A"], [392, 18, "#cbd5e1", "392"]];
    f.forEach(function (p) { var x = 40 + (p[0] - 370) * 18.5; g += r(x - 6, 110 - p[1], 12, p[1], p[2], { rx: 1 }) + t(x, 124, p[3], { s: p[3].length > 4 ? 8.5 : 9.5 }); });
    g += t(240, 14, "Ordinul 3 (portocaliu) pică lângă canalele folosite; ordinul 5 (gri) e mai slab", { s: 10 });
    return W("0 0 480 132", g, "Produse de intermodulație: A = 380 MHz, B = 384 MHz");
  };
  /* arhitecturi de rețele radio mobile */
  SVG.netTypes = function () {
    function bs(x, y, c) { return '<path d="M' + x + " " + (y + 22) + " L" + (x - 7) + " " + (y + 34) + " M" + x + " " + (y + 22) + " L" + (x + 7) + " " + (y + 34) + '" stroke="#334155" stroke-width="1.5"/>' + ln(x, y, x, y + 34, "#334155", 2) + '<circle cx="' + x + '" cy="' + y + '" r="4" fill="' + (c || "#2563eb") + '"/>'; }
    function ms(x, y) { return r(x - 5, y - 9, 10, 18, "#0f172a", { st: "#0f172a", rx: 2 }); }
    var g = "";
    g += t(60, 14, "Mod direct (DMO)", { s: 10 }) + ms(35, 60) + ms(85, 60) + ln(42, 60, 78, 60, "#16a34a", 2, "4 3") + t(60, 92, "fără infrastructură", { s: 9, w: 400 });
    g += t(180, 14, "Single site", { s: 10 }) + bs(180, 30) + ms(150, 82) + ms(210, 82) + ln(176, 36, 154, 72, "#2563eb", 1, "3 3") + ln(184, 36, 206, 72, "#2563eb", 1, "3 3") + t(180, 104, "dispecer + 1 stație", { s: 9, w: 400 });
    g += t(300, 14, "Simulcast", { s: 10 }) + bs(272, 30, "#f97316") + bs(328, 30, "#f97316") + ms(300, 82) + t(300, 104, "aceeași frecvență + voter", { s: 9, w: 400 });
    g += t(420, 14, "Trunking / celular", { s: 10 });
    [[395, 40], [445, 40], [420, 72]].forEach(function (c, i) { g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="22" fill="' + ["#dbeafe", "#dcfce7", "#fef9c3"][i] + '" stroke="#64748b"/>' + t(c[0], c[1] + 4, "f" + (i + 1), { s: 10 }); });
    g += t(420, 112, "canale alocate la cerere", { s: 9, w: 400 });
    return W("0 0 480 118", g, "Patru feluri de a construi o rețea radio");
  };
  /* ionosfera ziua / noaptea */
  SVG.iono = function () {
    var g = r(0, 0, 238, 130, "#e0f2fe", { st: "none", rx: 6 }) + r(242, 0, 238, 130, "#1e293b", { st: "none", rx: 6 });
    g += t(119, 16, "ZIUA", { s: 11 }) + t(361, 16, "NOAPTEA", { s: 11, f: "#f8fafc" });
    g += r(8, 34, 222, 12, "#93c5fd", { st: "none" }) + t(119, 43, "strat F (reflectă)", { s: 9 });
    g += r(8, 70, 222, 12, "#fca5a5", { st: "none" }) + t(119, 79, "strat D (absoarbe < ~5 MHz)", { s: 9 });
    g += r(250, 34, 222, 12, "#334155", { st: "none" }) + t(361, 43, "strat F (reflectă)", { s: 9, f: "#f8fafc" });
    g += t(420, 79, "stratul D dispare", { s: 9, f: "#cbd5e1" });
    g += '<path d="M20 120 L66 84" stroke="#dc2626" stroke-width="2"/>' + t(112, 112, "80 m: absorbit", { s: 9, a: "start", f: "#b91c1c" });
    g += '<path d="M262 120 L320 46 L378 120" fill="none" stroke="#facc15" stroke-width="2"/>' + t(424, 112, "80 m: sute de km", { s: 9, f: "#fde68a" });
    return W("0 0 480 130", g, "De ce benzile joase de unde scurte „se deschid” noaptea");
  };
})();
function CB(s) { return '<div class="fact"><b>📻 În Colonati:</b> ' + s + "</div>"; }
function GB(s) { return '<div class="fact"><b>🗼 În Graham:</b> ' + s + "</div>"; }
function ERR(s) { return '<div class="eli trapw"><b>⚠ Atenție la carte:</b> ' + s + "</div>"; }
/* --- Colonati --- */
L("ant", 2, "Colonati: semnale, modulație și codare", "〰️", /Colonati cap\. [23]\)/, [
  K("Drumul unui mesaj prin radio", "Ca o scrisoare: o scrii (sursa), o pui în plic (codare + modulare), o trimite poșta (mediul, unde se mai și murdărește – zgomot), iar destinatarul o deschide (demodulare + decodare).", "Moduri: <b>simplex</b> (un sens), <b>semiduplex</b> (pe rând – PTT), <b>duplex</b> (simultan). Distorsiunile sunt previzibile, zgomotul e aleator. <b>Nyquist</b>: fₑ ≥ 2·f_max. <b>Shannon</b>: C = B·log₂(1+S/N). Banda unui amplificator se măsoară la <b>−3 dB</b>.", CB("cap. 2 – introducere în telecomunicații și semnale.")),
  K("AM, SSB, FM și modulațiile digitale", "AM schimbă „volumul” undei, FM îi schimbă „ritmul”. Zgomotul strică mai ales volumul, de aceea FM sună mai curat.", "AM ocupă 2·f_mod; supramodulația (m > 1) dă distorsiuni și splatter. SSB/BLU (J3E) ocupă ~jumătate, fără purtătoare. FM (F3E) e robust, dar lat. Variantele digitale: ASK, FSK, PSK; <b>QAM/nPSK</b> = mulți biți/Hz, dar cer SNR mare. GSM folosește <b>GMSK</b>."),
  K("Cum se apără datele de erori", "FEC e ca atunci când repeți un număr de telefon în două feluri ca să nu fie înțeles greșit; ARQ e când întrebi „poți să repeți?”.", "<b>FEC</b> = redundanță, receptorul corectează singur. <b>ARQ</b> = ACK/NAK și retransmisie. <b>Intercalarea</b> împrăștie rafalele de erori. Codare: de sursă (compresie), de canal (corecție), de linie (adaptare la mediu). Spațiu liber: <b>32,44 + 20·log f[MHz] + 20·log d[km]</b>; 2× distanța = +6 dB.", EX("Nyquist, Shannon, lățimea de bandă AM vs SSB, FEC vs ARQ.")),
], { byE: true });
L("ant", 2, "Colonati: CW, RTTY și modurile cu corecție (AMTOR, PACTOR)", "⌨️", /Colonati cap\. ([4-9]|1[0-3])\)/, [
  K("Primele moduri digitale", "Prima emisiune radio (Marconi, 1896) era deja „digitală”: purtătoare pornită sau oprită – Morse.", "<b>CW</b> = A1A, cel mai îngust mod; viteza în WPM cu cuvântul PARIS. <b>RTTY</b>: cod Baudot/ITA2 pe <b>5 biți</b>, <b>45,45 baud</b> (22 ms/bit), shift <b>170 Hz</b>, MARK = frecvența mai mare, fără corecție. F1B = FSK direct; J2B = AFSK (2125/2295 Hz) prin SSB. Purtătoare continuă → reduci puterea 25–50%.", CB("cap. 7–8 – telegrafie și RTTY.")),
  K("ARQ și FEC în unde scurte", "AMTOR Mod A e o convorbire telefonică (doar doi, cu „am înțeles”); Mod B e un anunț la megafon repetat de două ori pentru toți.", "<b>AMTOR</b> 100 baud: A = ARQ (2 stații), B = FEC (fiecare caracter ×2); SITOR-B = NAVTEX. <b>PACTOR</b> = ARQ + Huffman; PACTOR II = PSK + DSP (~8× mai rapid). <b>G-TOR</b> = Golay + intercalare. <b>CLOVER II</b> = adaptiv (Reed-Solomon). ASCII = 7 biți."),
  K("PC-ul legat la stație", "Placa de sunet devine modem: „vorbește” în microfonul stației și „ascultă” difuzorul ei.", "PTT prin RTS/DTR cu tranzistor sau optocuplor; transformatoare audio 1:1 contra buclelor de masă. Nivel audio corect: ALC-ul nu trebuie să lucreze (altfel splatter). Azi: USB + CAT integrate; azi domină <b>FT8</b>; IARU R1: moduri înguste în segmente dedicate."),
], { byE: true });
L("ant", 2, "Colonati: packet, PSK31, MFSK și propagarea în unde scurte", "🛰️", /Colonati cap\. (1[4-9]|2[01])\)/, [
  K("Packet radio și APRS", "Packet radio e un mic Internet prin stații FM: datele merg în pachete cu adresa (indicativul) pe ele.", "<b>AX.25</b> = nivel 2, din HDLC; CRC + retransmisie. 1200 bit/s = AFSK 1200/2200 Hz (Bell 202) prin microfon; 9600 = G3RUH. <b>TNC</b> = modem + protocol (KISS lasă protocolul în PC). <b>Digipeater</b> = repetor digital. <b>APRS</b> = 144,800 MHz. CSMA + problema stației ascunse."),
  K("Moduri înguste și robuste", "Cu cât fiecare simbol durează mai mult, cu atât ecourile (reflexiile) îl strică mai puțin – ca vorbitul rar într-o sală cu ecou.", "<b>PSK31</b>: BPSK 31,25 baud (8000/256), ~31 Hz, Varicode, ~50 WPM; QPSK31 = cu FEC. <b>MFSK16</b>: 16 tonuri, ~316 Hz, FEC + intercalare. <b>MT63</b>: 64 tonuri în 1 kHz. <b>Hellschreiber</b>: citit cu ochiul. DTMF = două tonuri per tastă.", ERR("scrie „31,25 KHz” la PSK31 – corect este <b>31,25 baud (Hz)</b>.")),
  K("Propagarea în unde scurte", "Ionosfera e o oglindă care se schimbă: ziua are un „burete” jos (stratul D) care înghite frecvențele mici; noaptea buretele dispare.", "Ziua: stratul D absoarbe sub ~5 MHz → doar local. Noaptea: 80/160 m dau sute–mii de km. 5–30 MHz: salturi pe stratul F, drum scurt/lung. Ciclul solar ~11 ani; furtuni geomagnetice. VHF: vizibilitate directă + excepții (E sporadic, ductare, meteor scatter). Sateliți: Doppler.", SVG.iono()),
], { byE: true });
L("ant", 3, "Colonati: spread spectrum, benzi ISM și Wi-Fi", "📶", /Colonati cap\. 2[23]\)/, [
  K("Spread spectrum", "În loc să strigi pe o singură notă, șoptești pe toată gama: cine nu știe „cheia” aude doar un foșnet, iar zgomotul pe o notă nu te mai acoperă.", "<b>DSSS</b>: biți × chip-uri, apoi PSK (802.11b); SNR necesar ~12 dB; problema <b>near-far</b>. <b>FHSS</b>: salturi după o secvență, cu dwell time (Bluetooth: 79 canale); ~18 dB. Experimentul din 1952: 25 W spread spectrum la 5000 km, unde 50 kW clasic eșua."),
  K("Benzile fără licență", "ISM e ca un teren de fotbal public: oricine poate juca, dar nimeni nu are teren rezervat.", "ISM: <b>433,05–434,79 MHz</b>, <b>2400–2483,5 MHz</b>, <b>5725–5875 MHz</b> (902–928 doar în Americi). WLAN 2,4 GHz în UE: <b>100 mW EIRP (20 dBm)</b>. Fără protecție la interferențe. Reglementator: <b>ANCOM</b>. AMPRNet = 44.0.0.0/8; EchoLink = VoIP între repetoare."),
  K("Wi-Fi pe scurt", "Canalele Wi-Fi de 2,4 GHz sunt ca niște benzi de autostradă prea late pentru marcaje: se calcă una pe alta, așa că doar trei încap fără suprapunere.", "802.11b = 11 Mbit/s DSSS/CCK; 802.11a = 54 Mbit/s OFDM la 5 GHz; 802.11g = 54 Mbit/s OFDM la 2,4 GHz. Canal 22 MHz, pas 5 MHz → nesuprapuse <b>1, 6, 11</b>. Azi: Wi-Fi 4/5/6/6E (6 GHz)/7.", ERR("asociază 802.11g cu DSSS – în realitate <b>802.11g folosește OFDM</b> pentru 54 Mbit/s.")),
], { byE: true });
L("ant", 3, "Colonati: legătura radio de date, dBm și coduri de emisie", "📐", /Colonati (cap\. 24\)|anexe|– noțiuni)/, [
  K("Proiectezi un link de 2,4 GHz", "Bugetul legăturii e un portofel: pornești cu puterea emițătorului, adaugi câștigurile antenelor, scazi pierderile (cabluri, drum) și vezi dacă îți ajung „banii” pentru receptor.", "P_rx = P_tx − cablu + G_tx − drum + G_rx − cablu. Exemplu: 17 − 3 + 18 − 115 + 2 − 3 = <b>−84 dBm</b> → nu ajunge pentru 11 Mbit/s (−82), dar merge la 5,5 Mbit/s (−87). Debit mic = sensibilitate mai bună. Coax la 2,4 GHz: 4–6 dB / 30 m → cablu scurt, conectori N, descărcător. AP omni sus; UTP ≤ 90 m.", ERR("dă drumul ca „105 + 21·log D”, iar benzile ca „2,4 MHz / 5,7 MHz”. Folosește spațiul liber (<b>~100 + 20·log d</b> la 2,4 GHz) și <b>GHz</b>.")),
  K("Decibelii care contează", "dB-ul e o scară de „de câte ori”: +3 dB = dublu, +10 dB = de zece ori.", "0 dBm = 1 mW ≈ 224 mV pe 50 Ω; 30 dBm = 1 W; 40 dBm = 10 W; 1 µV ≈ −107 dBm. dBi = dBd + 2,15; EIRP = ERP + 2,15. λ[m] = 300/f[MHz] (145 MHz → λ ≈ 2,07 m, λ/4 ≈ 52 cm; practic ~49 cm, cu factorul de scurtare ~0,95). Fresnel la mijloc: 8,66·√(D/f); orizont ≈ 4,12·(√h₁+√h₂). VSWR 1,5 → 4%, 2 → 11% reflectat."),
  K("Codurile de emisie ITU", "Trei semne care spun tot: cum e modulată unda, ce o modulează și ce transportă.", "Litera 1: A = AM, J = SSB fără purtătoare, F = FM, G = PM, C = bandă reziduală. Cifra: 1 = digital direct, 2 = digital pe subpurtătoare, 3 = analogic. Litera 3: A = telegrafie auditivă, B = automată, D = date, E = voce, F = TV. <b>A1A</b> CW · <b>A3E</b> AM · <b>J3E</b> SSB · <b>F3E</b> FM · F1B RTTY · C3F TV.", EX("0 dBm/30 dBm, 1 µV ≈ −107 dBm, J3E vs F3E, calculul unui buget simplu.")),
], { byE: true });
/* --- Graham --- */
L("ant", 2, "Graham: rețele radio mobile, organisme și TETRA", "🚓", /Graham cap\. [1-3][) ]/, [
  K("Cine împarte frecvențele", "Spectrul radio e ca spațiul aerian: are reguli mondiale, europene și naționale.", "<b>ITU</b> (Geneva; R, T, D), Europa = <b>Regiunea 1</b>; <b>WRC</b> schimbă Regulamentul Radiocomunicațiilor; MIFR = registrul mondial. <b>CEPT/ERO</b> armonizează în Europa; <b>ETSI</b> face standardele (GSM, TETRA). În România: <b>ANCOM</b>. ITU-R SG3 = propagare.", GB("cap. 2 – spectru și standarde.")),
  K("Patru arhitecturi de rețea", "Poți vorbi direct cu colegul (DMO), printr-un dispecer (single site), prin multe stații care cântă aceeași notă (simulcast) sau printr-o „centrală” care îți dă un canal liber (trunking).", "<b>DMO</b>: rapid, bătaie mică. <b>Single site</b>: taxi, port. <b>Simulcast</b>: aceeași frecvență, voter pe uplink. <b>Trunking</b>: canale la cerere, apel de grup, urgență, blocarea terminalelor furate (TETRA, MPT 1327). <b>Celular</b>: reutilizare, sectoare, handover; CDMA cere control de putere.", SVG.netTypes()),
  K("TETRA – rețeaua serviciilor de urgență", "TETRA e „telefonul-stație” al intervențiilor: apasă PTT și te aude tot grupul, cu criptare și prioritate la urgență.", "Canal <b>25 kHz</b>, <b>TDMA 4 sloturi</b>, <b>π/4-DQPSK</b>, ~36 kbit/s; <b>380–400 MHz</b> (duplex 10 MHz); <b>TMO</b> (prin rețea) / <b>DMO</b> (direct). DMR: 12,5 kHz, 2 sloturi. PMR446: 0,5 W ERP, fără licență. În România, <b>STS operează rețeaua națională TETRA</b> a structurilor de urgență și ordine publică. Tendință: hibrid TETRA + LTE/5G (MCPTT).", EX("parametrii TETRA, DMO vs TMO, trunking vs simulcast.")),
], { byE: true });
L("ant", 2, "Graham: propagarea VHF/UHF", "⛰️", /Graham cap\. 4\)/, [
  K("Ce i se întâmplă undei pe drum", "Unda radio se comportă ca lumina unei lanterne în ceață: se împrăștie, se reflectă, ocolește puțin colțurile și e înghițită de ziduri și copaci.", "Spațiul liber e valabil doar pe LOS curat. Sol plan, două raze: <b>~40 dB/decadă</b>. Fade-uri rapide la <b>λ/2</b>. Refracție: <b>k = 4/3</b> (raza efectivă ~8500 km); ductare = semnale de foarte departe (interferențe); subrefracție = obturare. Difracție peste dealuri. Ploaia contează abia peste ~10 GHz. Polarizare <b>verticală</b> în mobil."),
  K("Modele de predicție", "Modelele sunt rețete statistice: îți spun ce semnal să te aștepți „în medie” într-un anumit tip de teren.", "<b>Okumura–Hata</b> 150–1500 MHz; <b>COST 231–Hata</b> până la 2 GHz; <b>P.1546</b> 30–3000 MHz (și interferențe); <b>P.526</b> difracție; muchie de cuțit cu vârful pe linie = <b>~6 dB</b>; mai multe obstacole: <b>Deygout</b>. Fresnel: Rₙ ≈ 550·√(n·d₁·d₂/(D·f[MHz])). Clutter = clase de teren. Chiar calibrat, modelul greșește cu σ ≈ 7–8 dB.", GB("cap. 4 – mecanisme și modele de propagare.")),
], { byE: true });
L("ant", 3, "Graham: fading, zgomot și bugetul legăturii", "📉", /Graham cap\. 5[) ]/, [
  K("Trei feluri de fading", "Mergi cu mașina: dealurile îți „umbresc” semnalul încet (fading lent), iar reflexiile din jur îl fac să tremure de la un pas la altul (fading rapid).", "<b>Lent</b> (umbrire) = <b>lognormal</b>, mediat pe ~40λ. <b>Rapid</b> fără LOS = <b>Rayleigh</b>; cu LOS = <b>Rice</b> (factor K). Marjă 90%: Rayleigh <b>8,2 dB</b> (99%: 18,4); lognormal 1,28·σ. Marjele micșorează raza (ex. 18 km → 9,5 km)."),
  K("Zgomot și sensibilitate", "Receptorul aude mereu un „fâșâit” de fond; semnalul trebuie să fie suficient peste el ca să fie înțeles.", "kTB = <b>−174 dBm/Hz</b> → 25 kHz ≈ <b>−130 dBm</b>, 12,5 kHz ≈ −133 dBm. Sensibilitate = kTB + NF + SNR (25 kHz, NF 10, SNR 12 → −108 dBm), dată mereu cu un criteriu (12 dB SINAD, BER), statică sau dinamică."),
  K("Bugetul complet", "Socoteala se face pe ambele drumuri; de obicei stația portabilă, cu putere mică, e veriga slabă.", "ERP = 41,5 − 3 − 1 + 2,5 = <b>40 dBm</b>. MAPL = ERP − nivelul minim necesar. Din MAPL scazi corpul (~6 dB), clădirea (~15–25 dB), marja de fading. Portabil la centură: −10…−30 dB; „rubber duck” UHF ~−8…−10 dB. E[dBµV/m] = P[dBm] + 20·log f + 77,2. TMA = amplificator lângă antenă (ajută uplink-ul).", SVG.budgetW()),
], { byE: true });
L("ant", 3, "Graham: acoperire, trafic și Erlang", "🗺️", /Graham cap\. ([6-9]|1[01])\)/, [
  K("Cerințe de acoperire măsurabile", "„Să meargă peste tot” nu e o cerință; „95% din locații, în 50% din timp, pe drumurile principale, fără goluri mai lungi de 500 m” este.", "În clădiri: marjă de ~20 dB peste stradă. Rețele critice: încrederea unui singur apel. Alegerea site-urilor: grilă, selectivă, puncte înalte (rele pentru rețele limitate de trafic), site-uri existente. Reglaje: înălțime → putere → azimut → tilt, abia apoi site nou. Nominal: BS 30 m la țară / 5–15 m în oraș; mobil 1,5 m; frecvența cea mai mare din bandă."),
  K("Traficul în Erlang", "Un Erlang e o linie ocupată tot timpul; zece oameni care vorbesc câte 6 minute pe oră fac împreună 1 Erlang.", "<b>Erlang B</b>: apelurile blocate se pierd → numărul de canale pentru un GoS (ex. 1,5 E la 5% → <b>4 canale</b>). <b>Erlang C</b>: apelurile așteaptă la coadă (dispecerat). GoS = probabilitatea de blocare. Factor limitativ: acoperire, trafic sau interferență. Documente: URS → FS → proiect → test → acceptanță.", EX("definiția Erlang, B vs C, cum alegi înălțimea și tilt-ul.")),
], { byE: true });
L("ant", 3, "Graham: backhaul radioreleu și interferențe", "📡", /Graham cap\. 1[23]\)/, [
  K("Backhaul-ul", "Backhaul-ul e „autostrada” care leagă stațiile de bază de centru – pe fibră sau pe radioreleu.", "Topologii: stea (simplă), <b>inel</b> și mesh (redundanță). Disponibilitate tipică <b>99,99%</b>. LOS + ≥ 0,6 din prima zonă Fresnel liberă, verificat și cu k mic (~0,6–0,7). FSL = <b>92,45 + 20·log d[km] + 20·log f[GHz]</b> (12 km la 28 GHz ≈ 143 dB). Ploaia peste ~10 GHz → polarizare verticală. Diversitate de spațiu / frecvență."),
  K("Zgomot și interferență", "Într-o cameră liniștită auzi o șoaptă (limitat de zgomot); la o petrecere te acoperă ceilalți vorbitori (limitat de interferență).", "Zgomotul industrial domină în VHF/UHF și desensibilizează. <b>C/I</b> = cu cât semnalul util trebuie să fie peste interferent. Downlink: interferent = altă BS pe aceeași frecvență. Canal adiacent PMR 12,5 kHz: ~6 / 25 / 40 dB la 1 / 2 / 3 canale. Interferenții se adună în putere. Remedii: putere, diagramă, înălțime, tilt, sector/nul, <b>altă frecvență</b>."),
], { byE: true });
L("ant", 3, "Graham: intermodulație, site-ul și drive-test-ul", "🧪", /Graham cap\. 1[45][) ]/, [
  K("Intermodulația", "Două emițătoare „amestecate” într-un element neliniar nasc frecvențe noi, ca două note care, cântate prost, scot un al treilea sunet fals.", "Ordinul 3: <b>2A−B, 2B−A</b> – cele mai periculoase (380/384 → <b>376/388 MHz</b>); ordinul 5: 372/392. Cauze: cuplaj, receptor supraîncărcat, „rusty bolt”. Co-site: armonici (impare mai puternice), frecvența imagine și FI, separare minimă. Duplexor = TX + RX pe aceeași antenă; izolare mai bună cu separare verticală. Trăsnet: paratrăsnet, împământare, descărcătoare.", SVG.imd()),
  K("Verificarea prin drive-test", "Nu crezi harta de acoperire până nu mergi pe teren să măsori.", "Drive-test din vehicul + măsurători pietonale/în interior. Mediana pe sectorul scurt: <b>~50 de eșantioane pe ~40λ → ±1 dB</b>. Eșantionezi pe <b>distanță</b>, nu pe timp. Rețele digitale: și calitate (BER). Simularea portabilului: corecții pentru corp, antenă, înălțime. Final: certificat de acceptanță.", EX("2A−B, cauzele intermodulației, regula de ~50 de eșantioane.")),
], { byE: true });

/* ===== PROBA PRACTICĂ – scenarii de examen, pas cu pas (conținut original) ===== */
(function () {
  function W(vb, inner, title) { return '<figure class="dia"><svg viewBox="' + vb + '" role="img" aria-label="' + (title || "diagramă") + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12">' + inner + "</svg>" + (title ? "<figcaption>" + title + "</figcaption>" : "") + "</figure>"; }
  function t(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" fill="' + (o.f || "#14213d") + '" font-size="' + (o.s || 11) + '" font-weight="' + (o.w || 700) + '"' + (o.ff ? ' font-family="' + o.ff + '"' : "") + ">" + s + "</text>"; }
  function r(x, y, w, h, f, o) { o = o || {}; return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx == null ? 5 : o.rx) + '" fill="' + f + '" stroke="' + (o.st || "#334155") + '" stroke-width="' + (o.sw || 1.2) + '"/>'; }
  function ln(x1, y1, x2, y2, c, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (w || 2) + '"' + (o || "") + "/>"; }
  var B = [["#fff", "#f97316", "alb-portocaliu"], ["#f97316", 0, "portocaliu"], ["#fff", "#16a34a", "alb-verde"], ["#2563eb", 0, "albastru"], ["#fff", "#2563eb", "alb-albastru"], ["#16a34a", 0, "verde"], ["#fff", "#92400e", "alb-maro"], ["#92400e", 0, "maro"]];
  var A568 = [B[2], B[5], B[0], B[3], B[4], B[1], B[6], B[7]];
  function wireV(x, y1, y2, c) { var s = ln(x, y1, x, y2, c[0], 7, ' stroke-linecap="butt"'); if (c[1]) s += ln(x, y1, x, y2, c[1], 7, ' stroke-dasharray="5 5"'); return s + ln(x - 3.5, y1, x - 3.5, y2, "#64748b", 0.6) + ln(x + 3.5, y1, x + 3.5, y2, "#64748b", 0.6); }
  var GR = '<defs><linearGradient id="gMet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5e7eb"/><stop offset=".5" stop-color="#9ca3af"/><stop offset="1" stop-color="#4b5563"/></linearGradient><linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f87171"/><stop offset="1" stop-color="#b91c1c"/></linearGradient><linearGradient id="gBeige" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fefce8"/><stop offset="1" stop-color="#d6d3c4"/></linearGradient><linearGradient id="gYel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde047"/><stop offset="1" stop-color="#ca8a04"/></linearGradient><radialGradient id="gKnob" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4b5563"/><stop offset="1" stop-color="#111827"/></radialGradient></defs>';

  SVG.crimper = function () {
    var g = GR;
    g += '<path d="M150 70 L440 40 L446 58 L160 96 Z" fill="url(#gRed)" stroke="#7f1d1d"/><path d="M150 100 L440 128 L434 146 L156 120 Z" fill="url(#gRed)" stroke="#7f1d1d"/>';
    g += '<path d="M30 52 L170 60 L176 132 L30 140 Q14 96 30 52 Z" fill="url(#gMet)" stroke="#374151" stroke-width="1.5"/>';
    g += r(48, 70, 30, 22, "#1f2937", { rx: 2, st: "#111" }) + t(63, 104, "8P (RJ45)", { s: 8.5, f: "#f8fafc" }) + r(92, 74, 22, 18, "#1f2937", { rx: 2, st: "#111" }) + t(103, 104, "6P", { s: 8.5, f: "#f8fafc" });
    g += r(128, 64, 30, 8, "#d1d5db", { rx: 1 }) + t(143, 60, "lamă tăiere", { s: 8, f: "#334155" }) + r(128, 120, 30, 8, "#d1d5db", { rx: 1 }) + t(143, 140, "dezizolare", { s: 8, f: "#334155" });
    g += '<circle cx="170" cy="96" r="7" fill="#6b7280" stroke="#111"/>';
    g += t(300, 24, "Clește de sertizat RJ45: cavitatea 8P presează contactele", { s: 10.5 }) + t(300, 166, "Strângi până la capăt: clichetul se eliberează doar după sertizare completă", { s: 9.5, w: 400 });
    return W("0 0 480 175", g, "Cleștele de sertizat (ilustrație)");
  };
  SVG.rj45pin = function () {
    var g = GR, i;
    function plug(x0, arr, lbl) {
      var s = '<path d="M' + x0 + ' 40 h120 v70 h-20 v12 h-80 v-12 h-20 z" fill="rgba(186,230,253,.5)" stroke="#0369a1" stroke-width="1.5"/>' + r(x0 + 40, 122, 40, 12, "#bae6fd", { st: "#0369a1", rx: 2 }) + t(x0 + 60, 148, "clema – în jos", { s: 8.5, f: "#0369a1" });
      for (i = 0; i < 8; i++) { var x = x0 + 11 + i * 14; s += r(x - 4, 44, 8, 8, "url(#gYel)", { rx: 1, st: "#a16207", sw: 0.6 }) + wireV(x, 54, 108, arr[i]) + t(x, 38, i + 1, { s: 9 }); }
      return s + t(x0 + 60, 18, lbl, { s: 11 });
    }
    g += plug(30, B, "T568B (cel mai folosit)") + plug(250, A568, "T568A");
    g += t(240, 172, "Contactele spre tine, clema în jos → pinul 1 e în stânga", { s: 10 });
    return W("0 0 480 180", g, "Ordinea firelor în mufă (vedere din față)");
  };
  SVG.tester = function () {
    var g = GR, i;
    function box(x, lbl) { var s = r(x, 20, 150, 120, "url(#gBeige)", { rx: 10, st: "#78716c" }) + t(x + 75, 40, lbl, { s: 10.5 }) + r(x + 55, 112, 40, 22, "#374151", { rx: 3 }) + t(x + 75, 106, "RJ45", { s: 8, f: "#57534e" }); for (i = 0; i < 9; i++) { s += '<circle cx="' + (x + 15 + i * 15) + '" cy="70" r="5.5" fill="' + (i < 8 ? "#22c55e" : "#d1d5db") + '" stroke="#166534"/>' + t(x + 15 + i * 15, 88, i < 8 ? i + 1 : "G", { s: 8.5 }); } return s; }
    g += box(20, "MASTER (cu baterie)") + box(310, "REMOTE");
    g += '<path d="M95 134 C95 170 385 170 385 134" fill="none" stroke="#94a3b8" stroke-width="6"/>';
    g += t(240, 60, "drept: 1→1 … 8→8", { s: 10, f: "#15803d" }) + t(240, 78, "crossover: 1↔3, 2↔6", { s: 9.5, f: "#7c3aed" }) + t(240, 96, "rollover: 1→8 … 8→1", { s: 9.5, f: "#b45309" }) + t(240, 114, "LED stins = fir întrerupt", { s: 9.5, f: "#b91c1c" });
    return W("0 0 480 175", g, "Testerul de cablu: LED-urile se aprind pe rând pe ambele unități");
  };
  SVG.mmDial = function () {
    var g = GR, cx = 160, cy = 156, R = 54;
    g += r(60, 10, 200, 260, "url(#gYel)", { rx: 18, st: "#854d0e" }) + r(72, 22, 176, 236, "#1f2937", { rx: 12, st: "#111" });
    g += r(88, 34, 144, 52, "#cbd5c0", { rx: 4, st: "#4b5563" }) + t(222, 72, "230.4", { s: 30, a: "end", ff: "monospace", f: "#111827" }) + t(98, 48, "AC", { s: 9, a: "start", f: "#111827" }) + t(222, 82, "V", { s: 10, a: "end", f: "#111827" });
    var pos = [["OFF", -90], ["V~", -50], ["V⎓", -15], ["mV", 15], ["Ω", 45], ["•)))", 80], ["mA", 130], ["A⎓", 165], ["A~", 200]];
    pos.forEach(function (p) { var a = p[1] * Math.PI / 180, x = cx + Math.cos(a) * (R + 12), y = cy + Math.sin(a) * (R + 12); g += t(x.toFixed(1), (y + 4).toFixed(1), p[0], { s: 10.5, f: p[0] === "V~" ? "#fde047" : "#e5e7eb" }); });
    g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 6) + '" fill="url(#gKnob)" stroke="#000"/>';
    var a = -50 * Math.PI / 180; g += ln(cx, cy, (cx + Math.cos(a) * (R - 10)).toFixed(1), (cy + Math.sin(a) * (R - 10)).toFixed(1), "#fde047", 5, ' stroke-linecap="round"');
    var jx = [92, 132, 172, 212], jl = ["10A", "mA", "COM", "VΩ"], jc = ["#dc2626", "#dc2626", "#111827", "#dc2626"];
    jx.forEach(function (x, i) { g += '<circle cx="' + x + '" cy="246" r="9" fill="#000" stroke="' + jc[i] + '" stroke-width="3"/>' + t(x, 233, jl[i], { s: 9, f: "#e5e7eb" }); });
    g += '<path d="M172 255 C180 292 300 284 330 244" fill="none" stroke="#111827" stroke-width="4"/><path d="M212 255 C230 300 360 300 400 234" fill="none" stroke="#dc2626" stroke-width="4"/>';
    g += t(370, 60, "Priză 230 V AC:", { s: 11 }) + t(370, 78, "selector pe V~", { s: 10, w: 400 }) + t(370, 94, "negru → COM", { s: 10, w: 400 }) + t(370, 110, "roșu → VΩ", { s: 10, w: 400 }) + t(370, 134, "NICIODATĂ în 10A/mA", { s: 10, f: "#b91c1c" }) + t(370, 150, "când măsori tensiune!", { s: 10, f: "#b91c1c" });
    return W("0 0 480 300", g, "Multimetrul: selectorul și bornele (ilustrație)");
  };
  SVG.iosModes = function () {
    var g = "", y = [30, 82, 134, 186], p = ["Switch>", "Switch#", "Switch(config)#", "Switch(config-if)#"], n = ["utilizator (doar show)", "privilegiat (show, copy, reload)", "configurare globală", "configurare interfață"], c = ["#e2e8f0", "#bfdbfe", "#fde68a", "#bbf7d0"], up = ["enable", "configure terminal", "interface fa0/1"];
    for (var i = 0; i < 4; i++) { g += r(20 + i * 30, y[i] - 18, 190, 34, c[i]) + t(30 + i * 30, y[i] + 4, p[i], { s: 12, a: "start", ff: "monospace" }) + t(230 + i * 30, y[i] + 4, n[i], { s: 9.5, a: "start", w: 400 }); if (i < 3) g += t(150 + i * 30, y[i] + 32, "↓ " + up[i], { s: 10, a: "start", f: "#1d4ed8", ff: "monospace" }); }
    g += t(240, 222, "exit = un nivel în sus · end (Ctrl+Z) = direct la # · disable = la >", { s: 9, f: "#b45309" });
    return W("0 0 480 230", g, "Modurile Cisco IOS și cum treci dintr-unul în altul");
  };
  SVG.straightCross = function () {
    var g = "", i;
    function col(x, arr, lbl) { var s = t(x, 16, lbl, { s: 10 }); for (var k = 0; k < 8; k++) { s += r(x - 18, 26 + k * 16, 36, 12, arr[k][0], { rx: 2, st: "#64748b" }) + (arr[k][1] ? '<rect x="' + (x - 18) + '" y="' + (31 + k * 16) + '" width="36" height="3" fill="' + arr[k][1] + '"/>' : "") + t(x - 26, 36 + k * 16, k + 1, { s: 9, a: "end" }); } return s; }
    g += col(40, B, "B") + col(160, B, "B") + col(300, A568, "A") + col(430, B, "B");
    for (i = 0; i < 8; i++) g += ln(58, 32 + i * 16, 142, 32 + i * 16, "#94a3b8", 1.5);
    var map = [2, 5, 0, 3, 4, 1, 6, 7];
    for (i = 0; i < 8; i++) g += ln(318, 32 + i * 16, 412, 32 + map.indexOf(i) * 16 + 0, i === 0 || i === 1 || i === 2 || i === 5 ? "#dc2626" : "#94a3b8", 1.5);
    g += t(100, 168, "DREPT (B–B): PC–switch, switch–router", { s: 9.5 }) + t(365, 168, "CROSSOVER (A–B): PC–PC, switch–switch", { s: 9.5, f: "#b91c1c" });
    return W("0 0 480 178", g, "Cablu drept și cablu crossover (azi auto-MDIX le face pe amândouă să meargă)");
  };
  SVG.fiberConn = function () {
    var g = "";
    g += r(30, 30, 60, 60, "#60a5fa", { rx: 4, st: "#1e3a8a" }) + '<circle cx="60" cy="60" r="7" fill="#f8fafc" stroke="#475569"/>' + t(60, 110, "SC", { s: 13 }) + t(60, 126, "pătrat, push-pull", { s: 9, w: 400 });
    g += r(150, 44, 34, 34, "#60a5fa", { rx: 3, st: "#1e3a8a" }) + r(188, 44, 34, 34, "#60a5fa", { rx: 3, st: "#1e3a8a" }) + '<circle cx="167" cy="61" r="4" fill="#f8fafc" stroke="#475569"/><circle cx="205" cy="61" r="4" fill="#f8fafc" stroke="#475569"/>' + t(186, 110, "LC duplex", { s: 13 }) + t(186, 126, "mic, clemă, SFP", { s: 9, w: 400 });
    g += '<circle cx="300" cy="60" r="30" fill="#d1d5db" stroke="#374151" stroke-width="2"/><circle cx="300" cy="60" r="18" fill="#9ca3af" stroke="#374151"/><circle cx="300" cy="60" r="6" fill="#f8fafc" stroke="#475569"/>' + r(326, 52, 10, 16, "#6b7280", { rx: 2 }) + t(300, 110, "ST", { s: 13 }) + t(300, 126, "rotund, baionetă ¼ tură", { s: 9, w: 400 });
    g += r(380, 30, 40, 22, "#3b82f6", { rx: 3 }) + t(400, 45, "UPC", { s: 9.5, f: "#fff" }) + '<path d="M425 34 h40 v14 h-40 z" fill="#e5e7eb" stroke="#475569"/>' + t(445, 64, "capăt drept", { s: 8.5, w: 400 });
    g += r(380, 78, 40, 22, "#16a34a", { rx: 3 }) + t(400, 93, "APC", { s: 9.5, f: "#fff" }) + '<path d="M425 82 h36 l4 14 h-40 z" fill="#e5e7eb" stroke="#475569"/>' + t(445, 112, "unghi 8°", { s: 8.5, w: 400 });
    g += t(240, 152, "Albastru = UPC, verde = APC – nu le cupla niciodată între ele!", { s: 10, f: "#b91c1c" });
    return W("0 0 480 162", g, "Conectorii de fibră pe care trebuie să-i recunoști");
  };
  SVG.ramSlot = function () {
    var g = GR;
    g += r(40, 30, 400, 56, "#15803d", { rx: 3, st: "#14532d" });
    for (var i = 0; i < 8; i++) g += r(60 + i * 46 + (i > 3 ? 20 : 0), 40, 30, 22, "#111827", { rx: 2, st: "#000" });
    for (var k = 0; k < 60; k++) { var x = 46 + k * 6.5; if (Math.abs(x - 262) < 6) continue; g += r(x, 76, 4, 10, "url(#gYel)", { rx: 0, st: "none" }); }
    g += '<path d="M256 86 v-10 h12 v10" fill="#fff" stroke="#14532d"/>' + t(262, 104, "crestătură (nu e la mijloc)", { s: 9.5, f: "#b91c1c" });
    g += r(30, 120, 420, 18, "#1f2937", { rx: 3 }) + r(258, 118, 8, 22, "#fbbf24", { rx: 1, st: "#92400e" }) + t(262, 156, "cheia din slot", { s: 9.5 });
    g += r(14, 104, 12, 40, "#9ca3af", { rx: 2 }) + r(454, 104, 12, 40, "#9ca3af", { rx: 2 }) + t(14, 160, "clemă", { s: 9, a: "start" }) + t(466, 160, "clemă", { s: 9, a: "end" });
    g += t(240, 18, "Aliniezi crestătura cu cheia și apeși pe ambele capete până se închid clemele", { s: 10 });
    return W("0 0 480 168", g, "Modulul RAM și slotul");
  };
})();
function SC(title, steps) { return '<div class="scen"><b>🎬 Scenariu la probă:</b> ' + title + "<ol>" + steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol></div>"; }
function CHK(items) { return '<div class="fact"><b>✅ Ce verifică examinatorul:</b><ul>' + items.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul></div>"; }
function MIST(items) { return '<div class="eli trapw"><b>❌ Greșeli care te pică:</b><ul>' + items.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul></div>"; }
function TIME(s) { return '<div class="exam"><b>⏱ Timp țintă:</b> ' + s + "</div>"; }
function TOOL(v, label) { return '<button class="ghost toolbtn" data-go="' + v + '">' + label + "</button>"; }

L("pp", 1, "Scenariul 1: mufezi un cablu drept T568B", "🔌", /Practic: RJ45/, [
  K("Ce primești pe masă", "Comisia îți dă o bucată de cablu UTP, două mufe RJ45 (uneori și una de rezervă), un clește de sertizat și un tester. Cerința sună cam așa: „Realizați un cablu drept T568B și verificați-l.”", "Scule: <b>clește de sertizat 8P</b> (cu lamă de tăiere și de dezizolare), eventual <b>dezizolator rotativ</b>, <b>tester</b> master/remote. Mufele pentru Cat6 cu fir gros pot avea un ghidaj interior (load bar).", PH("toolset") + SVG.crimper() + PH("crimper2")),
  K("Pașii, în ordine", "Fă-o la fel de fiecare dată, ca pe o rețetă – emoția de la examen nu te mai încurcă.", SC("„Primești un cablu UTP, un clește și 2 mufe. Faceți un cablu drept.”", ["Dezizolezi ~2–3 cm de manta (rotești o dată lama, nu crestezi firele).", "Desfaci perechile și îndrepți firele între degete.", "Le aranjezi în ordinea <b>T568B</b>: alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro.", "Le tai drept, la ~12–13 mm de la manta.", "Ții mufa cu clema în jos și împingi firele până ating peretele din față; mantaua intră sub clema de strângere.", "Verifici prin plastic că toate cele 8 fire sunt la capăt și în ordine.", "Sertizezi ferm, până la capăt.", "Repeți la celălalt capăt, tot T568B.", "Testezi: LED-urile 1→8 pe rând pe ambele unități."]), AN("crimp") + SVG.rj45pin() + PH("rj45") + TOOL("rj", "Exersează ordinea culorilor (interactiv)")),
  K("Cum te notează și ce te pică", "Examinatorul se uită întâi cu ochii, apoi folosește testerul. Un cablu care „merge” dar e făcut neglijent poate pierde puncte.", CHK(["ordinea culorilor la ambele capete (vizual, prin mufă)", "mantaua prinsă în mufă, fără fire desfăcute la vedere", "firele tăiate drept, toate la capăt", "testerul: 1-2-3-4-5-6-7-8 la ambele unități", "uneori: cablul pus între PC și switch → LED de link + ping"]) + MIST(["ordinea inversată pentru că ai ținut mufa cu clema în sus", "verdele pus lângă alb-verde (perechea despărțită corect e 3 și 6!)", "fire tăiate inegal → un LED stins", "manta scurtă → 2 cm de fire desfăcute", "ai sertizat înainte să verifici ordinea"]) + TIME("5–8 minute pentru un cablu complet, după 10 cabluri de antrenament acasă. Cumpără un clește ieftin, un tester și 20 de mufe – e cea mai bună investiție pentru probă.")),
], { byE: true });
L("pp", 1, "Testerul de cablu: ce înseamnă LED-urile", "🚦", /Practic: tester/, [
  K("Cum citești testerul", "Testerul trimite curent pe rând prin fiecare fir: dacă LED-ul cu același număr se aprinde la celălalt capăt, firul e bun și e la locul lui.", "Pui master-ul la un capăt și remote-ul la celălalt, pornești. <b>Drept</b>: 1→8 în aceeași ordine. <b>Crossover</b>: 3,6,1,4,5,2,7,8. <b>Rollover</b>: 8→1. <b>LED stins</b> = fir întrerupt. <b>Două LED-uri deodată</b> = scurtcircuit. <b>Ordine greșită</b> = fire inversate.", SVG.tester() + PH("tester")),
  K("Drept, crossover, rollover – când folosești fiecare", "Echipamente diferite (PC–switch) = drept. Echipamente la fel (PC–PC, switch–switch) = crossover, deși azi auto-MDIX se descurcă singur. Consola Cisco = rollover (albastru).", "La probă, cerința spune clar ce cablu vrea. Dacă ți se cere „drept” și testerul arată 8→1, ai pus o mufă invers.", SVG.straightCross() + PH("console")),
  K("Capcana: testerul spune OK, dar cablul e greșit", "Testerul simplu verifică doar că pinul 1 ajunge la pinul 1. Dacă ai greșit la fel la ambele capete, el zice OK – dar perechile răsucite nu mai sunt unde trebuie.", MIST(["aceeași ordine greșită la ambele capete (split pair) – merge prost sau deloc la 100/1000 Mbit/s", "să te bazezi doar pe tester fără să verifici culorile"]) + CHK(["ordinea culorilor", "rezultatul testerului", "eventual link și ping cu cablul în rețea"])),
], { byE: true });
L("pp", 1, "Multimetrul: tensiune, continuitate, rezistență", "🧪", /Practic: multimetru/, [
  K("Ce primești și ce ți se cere", "Un multimetru digital, o baterie, poate o siguranță, un rezistor sau un cablu. Cerințe tipice: „măsurați tensiunea bateriei”, „verificați continuitatea firului”, „măsurați rezistorul”, „ce tensiune are priza?”.", "Negru <b>mereu în COM</b>. Roșu în <b>VΩ</b> pentru tensiune, rezistență, continuitate; în <b>mA/10A</b> doar pentru curent. <b>V⎓</b> = DC (baterie), <b>V~</b> = AC (priză).", SVG.mmDial() + PH("multimeter") + TOOL("mm", "Exersează selectorul și bornele (interactiv)")),
  K("Pas cu pas pentru fiecare măsurare", "Întâi gândești ce măsori, apoi setezi selectorul, apoi bornele – și abia la final atingi circuitul.", SC("„Măsurați tensiunea bateriei de 9 V.”", ["Selector pe <b>V⎓</b> (scala 20 V dacă e manual).", "Negru în COM, roșu în VΩ.", "Roșu pe +, negru pe −.", "Citești ~9 V (o baterie nouă are 9,3–9,6 V; sub ~7,5 V e descărcată). „−9” = vârfuri inversate."]) + SC("„Verificați dacă firul e întrerupt.”", ["Cablul NEALIMENTAT.", "Selector pe continuitate (•)))).", "Atingi vârfurile între ele: trebuie să bipăie (testul aparatului).", "Vârfurile la capetele firului: bip = întreg; „OL” = întrerupt."]) + AN("circuit")),
  K("Siguranța – ce te descalifică", "La 230 V nu există a doua șansă. Comisia urmărește mai ales ce faci înainte să atingi ceva.", MIST(["roșul lăsat în 10A când măsori tensiune → scurtcircuit pe sursă", "măsori rezistență sau continuitate pe circuit alimentat", "ții vârfurile de partea metalică / cu ambele mâini pe 230 V", "selector pe Ω sau A când măsori priza", "aparat fără categorie CAT pe rețea"]) + CHK(["selector corect pentru mărime și tip (AC/DC)", "bornele corecte", "voltmetru în paralel, ampermetru în serie", "citirea cu unitatea de măsură (V, Ω, mA)"]) + TIME("~1 minut pe măsurare. Spune cu voce tare ce faci: „trec pe V alternativ, negru în COM, roșu în V”. Arată că știi.") + PH("multimeter3")),
], { byE: true });
L("pp", 2, "Cisco IOS: primii pași pe consolă", "💻", /Practic: IOS/, [
  K("Legătura la consolă", "Switch-ul nu are ecran: îl „vezi” printr-un cablu de consolă legat la laptop și un program de terminal.", "Cablu <b>rollover</b> (albastru, RJ45–DB9) sau USB, port <b>COM</b> din Device Manager, PuTTY/Tera Term la <b>9600 8N1</b>, fără flow control. Apeși Enter → apare <code>Switch&gt;</code>. Dacă apare „Would you like to enter the initial configuration dialog?”, răspunzi <b>no</b>.", PH("console") + PH("router")),
  K("Modurile IOS", "Ca o clădire cu etaje: la parter (>) doar te uiți, la etajul 1 (#) ai cheile, la etajul 2 (config) schimbi lucruri, iar fiecare interfață e o cameră separată.", "<code>enable</code> → <code>configure terminal</code> → <code>interface …</code>; <code>exit</code> urcă un nivel, <code>end</code> te duce direct la #. Prescurtările merg: <code>en</code>, <code>conf t</code>, <code>int g0/0</code>, <code>sh run</code>. Tasta <b>Tab</b> completează, <b>?</b> arată opțiunile.", SVG.iosModes() + TOOL("cli", "Deschide simulatorul CLI Cisco")),
  K("Scenariul tipic: configurarea de bază", "Cerința vine ca listă. Le faci în ordine și bifezi.", SC("„Configurați switch-ul: nume SW1, parolă privilegiată criptată, parolă pe consolă, banner, salvare.”", ["<code>enable</code>", "<code>configure terminal</code>", "<code>no ip domain-lookup</code> (opțional, te scapă de blocaje la greșeli de tastare)", "<code>hostname SW1</code>", "<code>enable secret Parola123</code>", "<code>line console 0</code> → <code>password cisco</code> → <code>login</code> → <code>exit</code>", "<code>service password-encryption</code>", "<code>banner motd #Acces autorizat#</code>", "<code>end</code> → <code>copy running-config startup-config</code> (Enter la întrebare)"]) + CHK(["<code>show running-config</code>: hostname, enable secret, line con 0 cu login", "promptul SW1#", "configurația salvată (show startup-config)"]) + MIST(["ai uitat <code>login</code> pe linie", "ai uitat să salvezi", "<code>enable password</code> în loc de <code>enable secret</code> când cerința zice „criptată”"]) + TIME("10 minute pentru tot, cu verificare.")),
  K("Routerul: interfața și adresa IP", "Spre deosebire de switch, routerul are interfețele oprite din fabrică. Fără <code>no shutdown</code>, nu merge nimic.", SC("„Configurați pe R1 interfața G0/0 cu 192.168.1.1/24 și verificați.”", ["<code>enable</code> → <code>conf t</code> → <code>hostname R1</code>", "<code>interface g0/0</code>", "<code>ip address 192.168.1.1 255.255.255.0</code>", "<code>no shutdown</code> (apare mesajul „changed state to up”)", "<code>end</code> → <code>show ip interface brief</code>: G0/0 192.168.1.1 <b>up up</b>", "<code>copy running-config startup-config</code>"]) + CHK(["show ip interface brief: IP corect, up/up", "ping de la PC la 192.168.1.1"]) + MIST(["masca scrisă /24 în loc de 255.255.255.0 (IOS clasic cere masca zecimală)", "„administratively down” = ai uitat no shutdown"]) + PH("switch")),
], { byE: true });
L("pp", 2, "VLAN-uri, verificare și salvare", "🗂️", /Practic: VLAN/, [
  K("VLAN-uri în 5 comenzi", "Un VLAN e ca o despărțitură într-un birou mare: PC-urile din camere diferite nu se aud, deși sunt pe același switch.", SC("„Creați VLAN 10 ADMIN și VLAN 20 TEHNIC; Fa0/1 în VLAN 10, Fa0/2 în VLAN 20; verificați.”", ["<code>conf t</code>", "<code>vlan 10</code> → <code>name ADMIN</code> → <code>vlan 20</code> → <code>name TEHNIC</code> → <code>exit</code>", "<code>interface fa0/1</code> → <code>switchport mode access</code> → <code>switchport access vlan 10</code>", "<code>interface fa0/2</code> → <code>switchport mode access</code> → <code>switchport access vlan 20</code>", "<code>end</code> → <code>show vlan brief</code>", "<code>copy running-config startup-config</code>"]) + TOOL("cli", "Fă exercițiul în simulatorul CLI")),
  K("Adresa de management și accesul de la distanță", "Ca să poți administra switch-ul prin rețea, îi dai un IP pe o interfață virtuală (VLAN 1 sau VLAN-ul de management) și parolă pe liniile vty.", "<code>interface vlan 1</code> → <code>ip address 192.168.1.2 255.255.255.0</code> → <code>no shutdown</code> → <code>exit</code> → <code>ip default-gateway 192.168.1.1</code> → <code>line vty 0 15</code> → <code>password cisco</code> → <code>login</code>.", CHK(["show vlan brief: porturile în VLAN-urile cerute", "show ip interface brief: Vlan1 cu IP, up/up", "show running-config: line vty cu login", "ping de la PC la IP-ul switch-ului"]) + MIST(["„interface vlan 10” când voiai să creezi VLAN-ul (asta e SVI)", "porturi uitate în VLAN 1", "ai verificat doar în show run, nu și cu ping"])),
  K("Comenzile de verificare pe care le cere examinatorul", "Gândește-te ca examinatorul: ce comandă dovedește că ai făcut ce ți s-a cerut?", "<code>show running-config</code> (tot), <code>show ip interface brief</code> (IP-uri și stare), <code>show vlan brief</code> (VLAN-uri și porturi), <code>show interfaces trunk</code>, <code>show mac address-table</code>, <code>show version</code>, <code>show startup-config</code> (dacă ai salvat). Din config: <code>do show …</code>.", PH("fx") + PH("rackpp")),
], { byE: true });
L("pp", 1, "IP în Windows: ipconfig, ping, tracert", "🪟", /Practic: Windows/, [
  K("Setezi IP static", "Ca să vorbească cu routerul, PC-ul trebuie să fie în aceeași rețea: aceeași primă parte a adresei, aceeași mască.", SC("„Configurați PC-ul cu 192.168.1.10/24, gateway 192.168.1.1, DNS 8.8.8.8 și verificați legătura.”", ["<b>Win+R</b> → <code>ncpa.cpl</code> → Enter", "Clic dreapta pe Ethernet → Properties", "Internet Protocol Version 4 (TCP/IPv4) → Properties", "Use the following IP address: 192.168.1.10 / 255.255.255.0 / 192.168.1.1", "DNS: 8.8.8.8 → OK → Close", "<code>cmd</code> → <code>ipconfig</code> (verifici) → <code>ping 192.168.1.1</code>"]) + AN("packet")),
  K("Comenzile de diagnostic", "Fiecare comandă răspunde la o întrebare: „ce adresă am?” (ipconfig), „ajung acolo?” (ping), „pe unde trec?” (tracert), „merge DNS-ul?” (nslookup).", "<code>ipconfig /all</code> (MAC, DHCP, DNS) · <code>ipconfig /release</code> + <code>/renew</code> · <code>ping -t</code> (continuu) · <code>ping -n 10</code> · <code>tracert 8.8.8.8</code> · <code>nslookup google.com</code> · <code>arp -a</code> · <code>netstat -an</code>. 169.254.x.x = DHCP n-a răspuns.", AN("arp")),
  K("Depanare când ping-ul nu merge", "Mergi de jos în sus, ca la un etaj cu etaj: cablu → adresă → echipament → firewall.", MIST(["IP în altă rețea decât gateway-ul (ex. 192.168.2.10 cu gateway 192.168.1.1)", "masca greșită", "firewall-ul Windows blochează ping-ul primit", "ai pus gateway-ul în câmpul DNS"]) + CHK(["ipconfig arată exact valorile cerute", "ping la gateway: 4 răspunsuri (primul poate pierde din cauza ARP)", "eventual tracert / nslookup dacă se cere Internet"]) + TIME("3–5 minute.") + AN("nat")),
], { byE: true });
L("pp", 2, "Fibra: conectori, UPC/APC și curățare", "💡", /Practic: fibră/, [
  K("Recunoaște conectorii", "Trei forme de bază: pătrat mare (SC), mic cu clemă (LC), rotund cu baionetă (ST). Culoarea corpului îți spune lustruirea.", "<b>SC</b> push-pull, ferulă 2,5 mm · <b>LC</b> ferulă 1,25 mm, duplex, la SFP · <b>ST</b> baionetă (răsucești) · <b>FC</b> filet. <b>UPC = albastru</b> (drept), <b>APC = verde</b> (8°). Manta galbenă = single-mode, aqua = OM3/OM4, portocalie = OM1/OM2.", SVG.fiberConn() + PH("sc") + PH("lc") + PH("st")),
  K("Curățarea, pas cu pas", "Un fir de praf pe capătul fibrei e ca un bolovan în fața unui far: blochează lumina. De aceea, la fibră, regula nr. 1 e curățenia.", SC("„Conectați patch-cord-ul de fibră la switch.”", ["Nu te uiți niciodată în capăt (laser invizibil).", "Scoți capacul de protecție doar acum.", "<b>Inspectezi</b> capătul cu microscopul/sonda.", "<b>Cureți</b>: one-click cleaner (o apăsare) sau caseta de curățare / șervețel fără scame cu alcool izopropilic, apoi uscat.", "<b>Inspectezi</b> din nou.", "Cuplezi: SC/LC – împingi până face clic; ST – răsucești.", "Pui capacele pe conectorii liberi."]) + AN("fiber")),
  K("Ce te pică la fibră", "Greșelile de la fibră nu se văd cu ochiul liber – de aceea examinatorul întreabă ce ai făcut.", MIST(["APC (verde) cuplat cu UPC (albastru)", "conector necurățat sau atins cu degetul", "te uiți în fibră", "fibră îndoită strâns (raza minimă!)", "single-mode amestecat cu multimode"]) + CHK(["recunoști tipul de conector și lustruirea", "explici inspectează–curăță–inspectează", "VFL/power meter pentru verificare"])),
], { byE: true });
L("pp", 2, "PC: memorie RAM și disc", "🖥️", /Practic: PC/, [
  K("Înainte de orice", "Electricitatea statică de pe tine poate omorî un modul de memorie fără să simți nimic.", "PC oprit, <b>scos din priză</b>, apeși butonul de pornire 5 s (descarci condensatorii), <b>brățară antistatică</b> legată de carcasă (sau atingi carcasa metalică), lucrezi pe masă, nu pe covor. Componentele le ții de margini.", PH("mobo")),
  K("Schimbi RAM-ul", "Modulul are o crestătură care nu e la mijloc: intră doar într-un sens. Dacă trebuie să forțezi, e invers.", SC("„Înlocuiți modulul de memorie și verificați.”", ["Deschizi clemele slotului.", "Scoți modulul vechi ținându-l de margini.", "Aliniezi crestătura noului modul cu cheia din slot.", "Apeși vertical pe ambele capete până clemele se închid singure (clic).", "Pornești și verifici în BIOS sau în Windows (Task Manager → Performance → Memory)."]) + SVG.ramSlot() + PH("ram")),
  K("Schimbi discul (HDD → SSD)", "SSD-ul SATA se leagă ca HDD-ul: un cablu de date și unul de alimentare. SSD-ul M.2 intră direct în placă.", SC("„Înlocuiți HDD-ul cu SSD-ul primit.”", ["Backup/clonare înainte (dacă e PC de lucru).", "Scoți cablurile SATA de date și alimentare, apoi discul din sertar.", "Montezi SSD-ul (adaptor 2,5\"→3,5\" dacă e nevoie), legi cele două cabluri.", "M.2: îl introduci la ~30°, îl apeși și îl prinzi cu șurubul.", "BIOS/UEFI: discul apare? Windows: Disk Management → Initialize (GPT) → New Simple Volume."]) + PH("ssd") + PH("hdd") + MIST(["lucrezi cu PC-ul în priză", "atingi contactele aurii", "forțezi modulul invers", "uiți cablul de alimentare SATA"])),
], { byE: true });
L("pp", 3, "Packet Tracer și strategia la probă", "🧭", /Practic: Packet Tracer/, [
  K("Packet Tracer – simulatorul gratuit Cisco", "E un „laborator” pe calculator: tragi routere, switch-uri și PC-uri, le legi cu cabluri și le configurezi exact ca pe cele reale.", "Îl descarci gratuit cu cont Cisco Networking Academy (curs „Getting Started with Cisco Packet Tracer”). Cabluri: negru continuu = drept, negru punctat = crossover, albastru deschis = consolă, roșu zig-zag = serial, portocaliu = fibră. Becuri: verde = OK, portocaliu = STP (așteaptă), roșu = jos. PC → Desktop → IP Configuration / Command Prompt / Terminal. Router → CLI. <b>Simulation mode</b> îți arată fiecare pachet.", PH("rack")),
  K("Exerciții de făcut acasă", "Fă aceleași 4 scenarii până le poți face fără notițe, cu cronometru.", "<b>1.</b> 2 PC-uri + switch: IP-uri în aceeași rețea, ping. <b>2.</b> Switch: hostname, enable secret, consolă, vty, banner, salvare. <b>3.</b> Router + switch + 2 PC-uri: G0/0 cu IP, gateway pe PC-uri, ping la gateway. <b>4.</b> VLAN 10 și 20 pe switch, câte un PC în fiecare – verifici că NU își dau ping; apoi show vlan brief.", TOOL("cli", "Simulatorul CLI din aplicație") + TOOL("ppsheet", "Fișa „ce fac pas cu pas” (de tipărit)")),
  K("Strategia în sala de examen", "Calm, ordine, verificare. Comisia vrea să vadă că lucrezi sigur și metodic, nu că știi trucuri.", "<b>1.</b> Citește toată cerința și notează pașii. <b>2.</b> Pregătește sculele/aparatul înainte. <b>3.</b> Fă pașii în ordine, cu voce tare dacă ți se cere să explici. <b>4.</b> Verifică fiecare rezultat (tester, show, ping). <b>5.</b> Salvează (copy run start). <b>6.</b> Dacă ai stricat ceva, spune și cere o mufă/încă o încercare – nu ascunde. <b>Formatul exact al probei îl stabilește comisia; aici sunt scenariile tipice.</b>", CHK(["siguranța (priză, ESD, laser)", "rezultatul verificabil", "ordinea și curățenia lucrului", "timpul"]) + TIME("Antrenează-te să termini fiecare scenariu în ~70% din timpul pe care crezi că îl ai.")),
], { byE: true });

/* animații și fotografii adăugate în lecțiile existente */
(function () {
  function add(c, title, k, h) { var l = LESSONS.filter(function (x) { return x.c === c && x.t === title; })[0]; if (l) l.cards.push(K(h, "", "", AN(k))); }
  add("net", "Ethernet, MAC și switch-ul", "packet", "Animație: un pachet prin switch și router");
  add("net", "Routere și rutare", "packet", "Animație: ce rescrie routerul");
  add("baz", "Switch-ul și adresa MAC", "packet", "Animație: MAC-ul se schimbă, IP-ul rămâne");
  add("net", "ARP, DHCP și DNS", "arp", "Animație: ARP pas cu pas");
  add("net", "NAT – traducerea adreselor", "nat", "Animație: NAT/PAT pas cu pas");
  add("sub", "Împărțirea în subrețele", "subnet", "Animație: /24 → /25 → /26");
  add("el", "Serie și paralel", "circuit", "Animație: curentul în serie și în paralel");
  add("baz", "Serie, paralel și cum legi aparatele", "circuit", "Animație: unde pui ampermetrul și voltmetrul");
  add("el", "Curent continuu și curent alternativ", "acdc", "Animație: DC și AC");
  add("el", "Monofazat și trifazat", "three", "Animație: trei faze la 120°");
  add("fo", "Monomod și multimod", "fiber", "Animație: lumina în fibră");
  add("ant", "Linia de vedere și zona Fresnel", "fresnel", "Animație: unda radio și zona Fresnel");
  add("ant", "Antena și tipurile de antene", "pattern", "Animație: diagrame de radiație");
  add("cab", "RJ45: T568A, T568B, tipuri de cabluri", "crimp", "Animație: mufarea pas cu pas");
  function addP(c, title, keys) { var l = LESSONS.filter(function (x) { return x.c === c && x.t === title; })[0]; if (l) l.cards[l.cards.length - 1] += keys.map(function (k) { return PH(k); }).join(""); }
  addP("ant", "Antena și tipurile de antene", ["tower"]);
  addP("el", "Multimetrul și măsurarea la priză", ["multimeter"]);
  addP("cab", "RJ45: T568A, T568B, tipuri de cabluri", ["rj45", "punch"]);
})();

/* ===== EXACT CA LA EXAMEN – temele raportate de un candidat care a trecut proba (valorile corecte; confuziile lui = „Capcană”) ===== */
function CPC(s) { return '<div class="eli trapw"><b>⚠ Capcană (greșeală reală a unui candidat):</b> ' + s + "</div>"; }
function XR(g, t) { return new RegExp("Examen real · " + g + " · (" + t + ")\\)"); }
L("ex", 1, "Canalul telefonic: 300–3400 Hz", "☎️", XR("Telecom", "voce"), [
  K("Ce bandă transmite telefonul", "Telefonul nu transmite tot ce aude urechea. Lasă să treacă doar „mijlocul” vocii, cât să înțelegi cuvintele.", "Canalul de voce: <b>300–3400 Hz</b>. Se alocă <b>4 kHz</b> pe canal (cu benzi de gardă). Urechea aude 20 Hz–20 kHz, dar asta NU e banda telefonului.", (SVG.voiceband ? SVG.voiceband() : "") + '<p class="small">Aici „canal” înseamnă <b>canalul telefonic de voce</b> (culoarul de frecvență al unei convorbiri), nu „canalul” de cablare din TIA-568 (≤ 100 m).</p>' + CPC("„canalul are 20–20 000 Hz” – aceea e banda auzului, nu a telefonului.")),
  K("De la analogic la digital (PCM)", "Vocea se „fotografiază” de 8000 de ori pe secundă și fiecare poză primește un număr pe 8 biți.", "Eșantionare la <b>8 kHz</b> (de 2 ori frecvența maximă de 4 kHz – Nyquist) × <b>8 biți</b> = <b>64 kbit/s</b> (un canal DS0, G.711).", EX("„Ce bandă are canalul telefonic?” → 300–3400 Hz; „cu ce frecvență se eșantionează?” → 8 kHz.")),
], { byE: true });
L("ex", 1, "RJ11 vs RJ45 și telefonia fixă", "🔌", XR("Telecom", "rj11|telefonie"), [
  K("Două mufe care seamănă", "RJ11 e mufa „mică” de telefon; RJ45 e mufa „lată” de rețea.", "<b>RJ11</b>: 6 poziții, de obicei 2 contacte folosite (o linie) sau 4 (două linii). Culori clasice în cordon: <b>roșu + verde</b> la mijloc (linia 1), negru + galben la margine (linia 2). <b>RJ45</b> (8P8C): 8 contacte, Ethernet.", (typeof PH === "function" ? PH("rj45") : "") + EX("RJ11 intră în portul RJ45, dar invers nu – nu le confunda la identificare.")),
  K("Familia mufelor telefonice: RJ11, RJ12, RJ9/RJ22", "Toate arată ca niște RJ45 mai mici. Le deosebești numărând pozițiile (lățimea) și contactele aurii.", "Notația <b>xPyC</b> = x poziții, y contacte. <b>RJ11</b> = 6P2C (o linie) sau 6P4C (două linii; tehnic RJ14) – telefon fix, ADSL. <b>RJ12</b> = 6P6C (toate 6 contactele, ex. centrale/console). <b>RJ9 / RJ22</b> = 4P4C, mufa mică a cordonului spiralat dintre telefon și receptor. <b>RJ45</b> = 8P8C, Ethernet. Linia 1 pe pinii din mijloc <b>3–4</b> (roșu/verde la cordoanele vechi; albastru/alb-albastru în cablarea structurată); linia 2 pe <b>2–5</b> (negru/galben sau portocaliu/alb-portocaliu).", (typeof PH === "function" ? PH("rjxx") + PH("rj11") : "") + '<div class="memo"><b>🧠 Truc de memorie: „Telefonul vorbește prin mijloc”</b><br>Linia telefonică stă pe cele 2 contacte din MIJLOCUL mufei (3–4), oricâte poziții ar avea mufa.</div><div class="trapbox"><span class="trapi" aria-hidden="true">!</span><div><b>Nu te lăsa păcălit:</b> mufa RJ11 intră fizic într-o priză RJ45, dar NU e Ethernet și poate deforma pinii marginali ai prizei. 6 poziții ≠ 8 poziții.</div></div>'),
  K("Telefonia clasică (PSTN) și E1", "La telefonul fix, pe durata convorbirii ai „drumul tău rezervat” prin centrale.", "<b>PSTN</b> = comutare de circuite; linia de abonat = <b>o pereche</b> de cupru. Tastele trimit <b>DTMF</b> (două tonuri). <b>E1</b> = 32 × 64 kbit/s = 2048 kbit/s (30 de canale de voce). <b>ADSL</b> folosește aceeași pereche, peste banda vocii, separată cu un splitter. <b>VoIP</b> = vocea în pachete IP. STS operează rețeaua națională <b>TETRA</b>."),
], { byE: true });
L("ex", 1, "PPPoE: cum te conectezi la furnizor", "🔐", XR("Telecom", "pppoe"), [
  K("Ce este PPPoE", "E ca o „ușă cu parolă” la furnizorul de internet: routerul tău se prezintă cu utilizator și parolă, apoi primește adresa.", "<b>PPPoE</b> = Point-to-Point Protocol over Ethernet. Routerul deschide o sesiune cu ISP-ul, se autentifică (<b>user + parolă</b> de la ISP) și primește IP public și DNS. Nu criptează traficul. <b>MTU 1492</b> (1500 − 8 octeți antet).", EX("„La ce folosește PPPoE?” → autentificarea abonatului și stabilirea sesiunii cu ISP-ul.")),
], { byE: true });
L("ex", 1, "Topologii: stea, plasă, magistrală, inel", "🕸️", XR("General", "top"), [
  K("Cum sunt legate calculatoarele", "Topologia e „desenul” rețelei: cine cu cine e legat.", "<b>Stea</b>: toți la un switch central (azi standard; switch-ul = punct unic de cădere). <b>Plasă (mesh)</b>: fiecare cu fiecare – redundanță maximă, <b>n(n−1)/2</b> legături. <b>Magistrală (bus)</b>: un cablu comun cu terminatori. <b>Inel</b>: în cerc. <b>Arbore</b>: stele pe niveluri. <b>Hibridă</b>: combinații.", SVG.topo ? SVG.topo() : ""),
  K("Ce se cere la examen", "Întrebările sunt simple, dar trebuie să știi avantajul și dezavantajul fiecăreia.", "Full mesh cu 5 noduri = 10 legături; cu 4 noduri = 6. Steaua: un cablu defect afectează doar stația lui. Bus: o întrerupere oprește tot.", EX("„În ce topologie toate stațiile merg la un switch?” → stea; „cea mai redundantă?” → plasă completă.")),
], { byE: true });
L("ex", 1, "LAN, MAN, WAN, PAN, WLAN și client-server", "🗺️", XR("General", "retele|p2p"), [
  K("Rețele după mărime", "De la buzunar la planetă: PAN → LAN → MAN → WAN.", "<b>PAN</b>: câțiva metri (telefon + căști Bluetooth). <b>LAN</b>: casă, birou, clădire. <b>WLAN</b>: LAN fără fir (Wi-Fi). <b>MAN</b>: un oraș. <b>WAN</b>: țări, continente – Internetul e cel mai mare WAN.", SVG.netTypes ? SVG.netTypes() : (SVG.nettypes ? SVG.nettypes() : "")),
  K("Peer-to-peer vs client-server", "Peer-to-peer = între colegi egali; client-server = un „ghișeu” central care servește pe toată lumea.", "<b>Peer-to-peer</b>: fiecare stație e și client, și server; ieftin, pentru câteva calculatoare. <b>Client-server</b>: servere dedicate (fișiere, e-mail, web), administrare și securitate centralizate; serverul e punct critic.", EX("Browser + site web = client-server.")),
], { byE: true });
L("ex", 1, "Viteză: biți vs octeți, bandwidth vs throughput", "🚀", XR("General", "viteza"), [
  K("b mic, B mare", "Un octet are 8 biți – ca un pachet cu 8 bomboane.", "Viteza se măsoară în <b>biți pe secundă</b> (bps, kbps, Mbps, Gbps). <b>b</b> = bit, <b>B</b> = byte (octet). 100 Mbps ≈ <b>12,5 MB/s</b>. Un fișier de 100 MB pe 100 Mbps → ~8 s.", EX("„Ce unitate măsoară viteza?” → biți pe secundă (bps).")),
  K("Bandwidth, throughput, goodput", "Autostrada are 3 benzi (bandwidth), dar în trafic real treci mai încet (throughput), iar din mașini doar unele duc marfă utilă (goodput).", "<b>Lățime de bandă</b> = capacitatea teoretică (ce scrie în oferta ISP). <b>Throughput</b> = debitul real măsurat. <b>Goodput</b> = doar datele utile pentru aplicație. Bandwidth ≥ throughput ≥ goodput.", CPC("„viteza internetului e throughput-ul garantat” – nu: oferta indică lățimea de bandă.")),
], { byE: true });
L("ex", 2, "Medii de transmisie și patch panel", "🧵", XR("General", "medii"), [
  K("Lumină, curent, coaxial", "Fibra duce lumină, cuprul duce curent.", "<b>Fibra</b>: impulsuri de lumină, kilometri, imună la EMI. <b>UTP</b>: semnale electrice, 100 m, ieftin, PoE. <b>Coaxial</b>: miez + izolator + tresă + manta (TV 75 Ω, radio 50 Ω). Distanțe mari → <b>fibră</b>.", SVG.media ? SVG.media() : ""),
  K("Patch panel", "Este „tabloul de prize” din rack: cablurile din pereți vin în spate, iar în față pui cordoane scurte spre switch.", "Patch panel = echipament <b>pasiv</b> pentru terminarea și organizarea cablării în rack (punch-down în spate, porturi RJ45 în față).", (typeof PH === "function" ? PH("rackpp") : "")),
], { byE: true });
L("ex", 2, "Fibra optică: lumina, reflexia totală, SM vs MM", "💡", XR("Fibră", "fibra"), [
  K("Cum merge lumina prin fibră", "Lumina „sare” de pe pereții miezului ca o minge într-un tub, fără să iasă.", "<b>Reflexie totală internă</b>: miezul are indicele de refracție <b>mai mare</b> decât învelișul. Straturi: miez → cladding (125 µm) → coating → manta.", (SVG.tir ? SVG.tir() : "") + (typeof AN === "function" ? AN("fiber") : "")),
  K("Monomod vs multimod", "Monomod = o singură bandă îngustă, drum lung; multimod = drum lat, aglomerat, scurt.", "<b>SM</b>: miez ~<b>9 µm</b>, laser 1310/1550 nm, zeci de km, manta <b>galbenă</b>. <b>MM</b>: miez 50/62,5 µm, 850/1300 nm, sute de m, portocaliu (OM1/2) sau aqua (OM3/4). MM e limitată de <b>dispersia modală</b>.", CPC("„multimod e mai bună, că are mai multe moduri” – mai multe moduri = mai multă dispersie = distanță mai mică.")),
], { byE: true });
L("ex", 2, "Conectori de fibră și UPC/APC", "🔗", XR("Fibră", "conectori"), [
  K("SC, LC, ST, FC, MTRJ", "Fiecare conector are o „formă” ușor de recunoscut.", "<b>SC</b>: pătrat, push-pull, 2,5 mm. <b>LC</b>: mic, clemă, 1,25 mm, la SFP. <b>ST</b>: rotund, baionetă. <b>FC</b>: filet. <b>MTRJ</b>: ambele fibre într-un corp mic de tip RJ.", (SVG.fiberConn ? SVG.fiberConn() : "") + (typeof PH === "function" ? PH("lc") : "")),
  K("UPC albastru, APC verde", "Verde = capăt teșit; albastru = capăt drept. Nu le amesteci niciodată.", "<b>UPC</b> = albastru, capăt drept. <b>APC</b> = <b>verde</b>, capăt lustruit la <b>8°</b>, reflexie înapoi mult mai mică. Curățare: one-click sau șervețel fără scame + alcool izopropilic, inspecție la microscop.", CPC("„APC are 6°” – corect este <b>8°</b>.")),
], { byE: true });
L("ex", 2, "OTDR și diagnosticarea fibrei", "📈", XR("Fibră", "otdr"), [
  K("Ce face OTDR-ul", "Ca un sonar pentru fibră: trimite un impuls de lumină și „ascultă” ecoul.", "<b>OTDR</b> măsoară dintr-<b>un singur capăt</b>: lungimea, atenuarea (dB/km), sudurile, conectorii și <b>distanța până la o ruptură</b>. Folosește retroîmprăștierea Rayleigh și reflexiile Fresnel. Bobina de lansare mută zona moartă.", SVG.otdr ? SVG.otdr() : ""),
  K("Alte unelte", "Pentru defecte apropiate ajunge o lanternă laser roșie.", "<b>VFL</b> (laser roșu vizibil): vezi ruptura sau îndoirea pe primii km. <b>Sursă + powermetru</b>: pierderea totală a legăturii, din ambele capete. ⚠ Nu privi niciodată în fibră.", EX("„Cu ce afli unde e ruptă fibra la distanță?” → OTDR.")),
], { byE: true });
L("ex", 2, "Cablul UTP: T568B, categorii, 100 m", "🧶", XR("CCNA", "cablu"), [
  K("T568B și UTP", "Opt fire în patru perechi răsucite, puse într-o ordine fixă.", "<b>T568B</b>: alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro. <b>UTP</b> = neecranat; răsucirea reduce <b>EMI și diafonia</b>. <b>STP/FTP</b> = ecranat.", (SVG.t568 ? SVG.t568() : "") + (typeof AN === "function" ? AN("crimp") : "")),
  K("Categorii – toate merg 100 m", "Categoria mai mare = mai rapidă, NU mai lungă.", "<b>Cat5</b> 100 MHz/100 Mbps · <b>Cat5e</b> 100 MHz/1 Gbps · <b>Cat6</b> 250 MHz, 10 Gbps doar până la ~55 m · <b>Cat6a</b> 500 MHz, 10 Gbps la 100 m · <b>Cat7</b> 600 MHz, ecranat pe perechi. Lungime maximă Ethernet pe cupru: <b>100 m</b> (90 + 10).", CPC("„Cat5e bate mai departe de 100 m” – greșit, toate au aceeași limită de 100 m.")),
], { byE: true });
L("ex", 2, "Drept, crossover, rollover", "🔀", XR("CCNA", "tipuri-cablu"), [
  K("Regula", "Diferite → drept. La fel → încrucișat. Consolă → rollover.", "<b>Drept</b> (B–B): PC–switch, router–switch. <b>Crossover</b> (A–B, pinii <b>1↔3, 2↔6</b>): switch–switch, PC–PC, router–router, PC–router. <b>Rollover</b> (1↔8…): cablul albastru de <b>consolă</b>. Auto-MDIX face orice cablu să meargă, dar la examen se cere regula clasică.", (SVG.straightCross ? SVG.straightCross() : "") + CPC("a inversat regula („crossover pentru echipamente diferite”) și a încurcat rollover-ul cu crossover-ul.")),
], { byE: true });
L("ex", 3, "OSI și TCP/IP, PDU-uri", "🧅", XR("CCNA", "osi"), [
  K("Cele 7 straturi", "Ca o scrisoare: o scrii (aplicație), o pui în plic (antete), o duce poșta (rețea), camionul (fizic).", "De jos în sus: <b>Fizic, Legătură de date, Rețea, Transport, Sesiune, Prezentare, Aplicație</b>. Mnemotehnică: „<b>P</b>lease <b>D</b>o <b>N</b>ot <b>T</b>hrow <b>S</b>ausage <b>P</b>izza <b>A</b>way”. Stratul 3 = <b>Rețea</b>.", SVG.osi ? SVG.osi() : ""),
  K("TCP/IP și PDU", "TCP/IP are doar 4 „etaje”: sus de tot sunt lipite trei etaje OSI.", "TCP/IP: <b>Acces la rețea</b> (OSI 1+2), <b>Internet</b> (3), <b>Transport</b> (4), <b>Aplicație</b> (OSI <b>5+6+7</b>). PDU: L1 <b>biți</b>, L2 <b>cadre</b>, L3 <b>pachete</b>, L4 <b>segmente</b> (TCP) / datagrame (UDP), L5–7 <b>date</b>.", (SVG.encap ? SVG.encap() : "") + CPC("nu știa PDU-urile – reține „biți, cadre, pachete, segmente, date”.")),
], { byE: true });
L("ex", 3, "Adrese IP: clase, mască, gateway, broadcast", "🔢", XR("CCNA", "ip"), [
  K("Clase și mască", "Primul număr din adresă îți spune clasa.", "<b>A</b> 1–126 (/8), <b>B</b> 128–191 (/16), <b>C</b> 192–223 (/24), D 224–239 multicast. <b>192.x = clasa C</b>. /24 = <b>255.255.255.0</b>. IPv4 = 32 de biți. Private: 10/8, 172.16/12, 192.168/16.", SVG.ipv4 ? SVG.ipv4() : ""),
  K("Rețea, gateway, broadcast", "Prima adresă e „numele străzii”, ultima e „megafonul”, iar routerul stă de obicei la numărul 1.", "În 192.168.0.0/24: rețea <b>192.168.0.0</b>, gateway uzual <b>192.168.0.1</b> (prima utilizabilă), host-uri .1–.254 (<b>254</b>), broadcast <b>192.168.0.255</b>.", (typeof AN === "function" ? AN("subnet") : "") + EX("„Ce clasă e 192.168.0.10 și ce mască are /24?” → C, 255.255.255.0.")),
], { byE: true });
L("ex", 3, "Unicast, multicast, broadcast, anycast; MAC vs IP", "📣", XR("CCNA", "cast|mac"), [
  K("Cui îi trimiți", "Unicast = scrisoare; multicast = newsletter pentru abonați; broadcast = anunț la megafon; anycast = „cel mai apropiat ghișeu”.", "<b>Unicast</b>: unu la unu. <b>Multicast</b>: unu la un grup abonat (224–239.x). <b>Broadcast</b>: unu la toți din rețea (MAC FF:FF:FF:FF:FF:FF). <b>Anycast</b>: aceeași adresă pe mai multe servere, răspunde cel mai apropiat."),
  K("MAC și IP", "MAC = CNP-ul plăcii; IP = adresa de domiciliu.", "<b>MAC</b>: fizică, 48 de biți, scrisă în placă (poate fi falsificată prin software – spoofing), stratul 2. <b>IP</b> (Internet Protocol): logică, stratul 3. <b>ARP</b> află MAC-ul după IP. În Windows: <code>ipconfig /all</code> → Physical Address.", typeof AN === "function" ? AN("arp") : ""),
], { byE: true });
L("ex", 3, "Hub, switch, router, Internet; DNS și NAT", "🌐", XR("CCNA", "echip|dns-nat"), [
  K("Cine ce face", "Hub = megafon; switch = poștaș în bloc (după nume/MAC); router = poștaș între orașe (după adresă/IP).", "<b>Hub</b>: L1, trimite pe toate porturile. <b>Switch</b>: L2, MAC, cadre, în aceeași rețea. <b>Router</b>: L3, IP, pachete, între rețele; separă domeniile de broadcast. <b>Internetul</b> = rețea globală de rețele, miliarde de dispozitive.", (typeof AN === "function" ? AN("packet") : "") + (typeof PH === "function" ? PH("router") : "")),
  K("DNS, NAT, DHCP", "DNS = agenda (nume → număr); NAT = recepția firmei (un singur număr public pentru toți); DHCP = cel care împarte adresele.", "<b>DNS</b> (port 53): nume → IP; <code>ipconfig /displaydns</code>, <code>/flushdns</code>, <code>nslookup</code>. <b>NAT/PAT</b>: IP-uri private → o adresă publică. <b>DHCP</b>: IP, mască, gateway, DNS automat (fără el → 169.254.x.x).", typeof AN === "function" ? AN("nat") : ""),
], { byE: true });
L("ex", 3, "VLAN vs subnetting", "🏷️", XR("CCNA", "vlan"), [
  K("Două feluri de a separa", "VLAN-ul împarte switch-ul în „camere” (nivel 2); subnetting-ul împarte adresele IP în „cartiere” (nivel 3).", "<b>VLAN</b>: separare logică a porturilor switch-ului în domenii de broadcast diferite; trunk cu <b>802.1Q</b>. <b>Subnetting</b>: împărțirea spațiului IP cu masca (ex. /24 → patru /26). De obicei: un VLAN = o subrețea. Între VLAN-uri → router sau switch L3.", (SVG.vlan ? SVG.vlan() : "") + (SVG.subnet ? SVG.subnet() : "")),
], { byE: true });
L("ex", 3, "Wi-Fi și Bluetooth", "📶", XR("General", "wifi"), [
  K("Generațiile Wi-Fi", "Numerele noi (Wi-Fi 4, 5, 6, 7) sunt doar nume prietenoase pentru standardele 802.11.", "<b>802.11</b> = Wi-Fi. b (11 Mbps, 2,4 GHz), a/g (54 Mbps), <b>n = Wi-Fi 4</b>, <b>ac = Wi-Fi 5</b>, <b>ax = Wi-Fi 6/6E</b> (6E în 6 GHz), <b>be = Wi-Fi 7</b>. Benzi: 2,4 / 5 / 6 GHz. <b>Bluetooth = 802.15.1</b> (PAN). 802.3 = Ethernet pe cablu.", EX("„Ce standard e Bluetooth?” → IEEE 802.15.1.")),
], { byE: true });
L("ex", 3, "Pe laptop: ipconfig, netstat, DNS și portul COM al consolei", "💻", XR("CCNA", "windows|consola"), [
  K("Comenzi de rețea în Windows", "Linia de comandă e ca „ghișeul de informații” al calculatorului: scrii o comandă scurtă și primești răspuns.", "<b>ipconfig /all</b> = adresa IP, masca, gateway, DNS și <b>adresa MAC</b> (linia „Physical Address”). <b>netstat</b> = conexiunile și porturile deschise. <b>nslookup nume</b> = întreabă serverul DNS ce IP are un nume. <b>ipconfig /displaydns</b> = arată cache-ul DNS; <b>ipconfig /flushdns</b> = îl golește.", EX("Truc: display = „arată”, flush = „trage apa”. Nu le inversa.")),
  K("Consola: de la cablu la PuTTY", "Cablul de consolă e „telefonul direct” către switch, fără rețea.", "1) Conectezi cablul (rollover sau USB–serial). 2) <b>Manager dispozitive → Porturi (COM și LPT)</b> → notezi numărul <b>COMx</b>. 3) În PuTTY alegi <b>Serial</b>, scrii COMx și viteza <b>9600</b> (8 biți, fără paritate, 1 stop, fără control de flux = <b>8N1</b>). 4) Apeși Enter și apare <b>Switch&gt;</b>.", EX("La examen: „unde afli portul COM?” → Manager dispozitive, la Porturi.")),
], { byE: true });
L("ex", 1, "U, I, R: tensiune, curent, rezistență și măsurătorile de nivel", "⚡", XR("Telecom", "baze|mas"), [
  K("Cele trei litere: U, I, R", "Gândește-te la apă în țeavă: tensiunea e presiunea, curentul e cât curge, rezistența e cât de îngustă e țeava.", "<b>U</b> = tensiune, unitate <b>volt (V)</b>, se măsoară cu voltmetrul <b>în paralel</b>. <b>I</b> = curent, unitate <b>amper (A)</b>, ampermetrul <b>în serie</b>. <b>R</b> = rezistență, unitate <b>ohm (Ω)</b>. Legea lui Ohm: <b>I = U / R</b>.", EX("Mnemonic: U–V, I–A, R–Ω. Exemplu: 5 V pe 100 Ω → 0,05 A.")),
  K("dB, dBm, generator și nivelmetru", "Generatorul „strigă” cu o voce cunoscută; nivelmetrul „ascultă” cât de tare ajunge.", "<b>dBm</b> = putere față de 1 mW (0 dBm = 1 mW). <b>+3 dB ≈ ×2</b> în putere, <b>+10 dB = ×10</b>. Generatorul injectează semnal de nivel și frecvență cunoscute; nivelmetrul măsoară nivelul primit. Diferența = atenuarea liniei.", EX("0 dBm = 1 mW; +3 dB = dublu; −3 dB = jumătate.")),
], { byE: true });

/* ===== TESTE DE INTELIGENȚĂ ȘI VOCABULAR (tip test psihologic/aptitudini) ===== */
function IQNET() { var c = [[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]], s = ["★","●","▲","■","♥","✚"], col = ["#f59e0b","#2563eb","#16a34a","#dc2626","#db2777","#7c3aed"], h = '<svg viewBox="-4 -4 330 206" role="img" aria-label="Desfășurare în cruce și cubul pliat" font-family="system-ui,Arial">'; c.forEach(function (p, i) { h += '<rect x="' + p[0] * 40 + '" y="' + p[1] * 40 + '" width="40" height="40" fill="#fff" stroke="#1e293b" stroke-width="2"/><text x="' + (p[0] * 40 + 20) + '" y="' + (p[1] * 40 + 27) + '" font-size="20" text-anchor="middle" fill="' + col[i] + '">' + s[i] + "</text>"; });
  h += '<path d="M135 80h30" stroke="currentColor" stroke-width="2" marker-end="url(#iqa)"/><defs><marker id="iqa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>';
  h += '<g transform="translate(190 30)"><path d="M0 40 L40 10 L110 10 L70 40Z" fill="#fef3c7" stroke="#1e293b" stroke-width="2"/><rect x="0" y="40" width="70" height="70" fill="#fff" stroke="#1e293b" stroke-width="2"/><path d="M70 40 L110 10 L110 80 L70 110Z" fill="#e0e7ff" stroke="#1e293b" stroke-width="2"/><text x="55" y="31" font-size="16" text-anchor="middle" fill="' + col[0] + '">★</text><text x="35" y="83" font-size="22" text-anchor="middle" fill="' + col[2] + '">▲</text><text x="90" y="66" font-size="18" text-anchor="middle" fill="' + col[3] + '">■</text></g>';
  return h + '<text x="4" y="178" font-size="11" fill="currentColor">★ opus lui ♥ · ● opus lui ■ · ▲ opus lui ✚</text><text x="4" y="193" font-size="11" fill="currentColor">(câte un pătrat între ele)</text></svg>'; }
L("iq", 1, "Cuburi și desfășurări: cum găsești fața opusă", "🧊", /\(Teste · cub\)/, [
  K("Ce se cere", "Primești un „carton” desfăcut (desfășurarea) și trebuie să-ți imaginezi cubul pliat.", "Întrebări tipice: ce față e <b>opusă</b> unui simbol, care desfășurare <b>se poate</b> (sau <b>NU se poate</b>) plia în cub, câte cubulețe au 1/2/3 fețe vopsite.", IQNET()),
  K("Regula de aur: „sari unul”", "Într-un șir drept de pătrate, două pătrate cu UNUL între ele ajung față în față.", "Lipite = vecine (niciodată opuse). Separate de un pătrat în linie dreaptă = <b>opuse</b>. Fiecare față are exact o față opusă și 4 vecine.", '<div class="fact"><b>🧠 Truc de memorie:</b> „<b>Sari unul, dai de opus</b>”.</div>'),
  K("Desfășurări imposibile", "Unele forme din 6 pătrate nu se închid niciodată în cub.", "Imposibil: un <b>bloc 2×2</b>; <b>5 pătrate</b> în linie; două pătrate care se suprapun la pliere (ex. ambele „aripi” pe aceeași parte, la același capăt al șirului de 4). Există exact <b>11</b> desfășurări valide de cub.", '<div class="eli trapw"><b>❗ Nu te lăsa păcălit:</b> citește dacă întrebarea cere „se poate” sau „NU se poate” plia.</div>'),
  K("Cubul vopsit și tăiat", "Vopsești un cub mare și îl tai în cubulețe: câte au culoare pe 3, 2, 1 sau 0 fețe?", "Pentru n×n×n: <b>3 fețe = 8</b> (colțurile, mereu), <b>2 fețe = 12×(n−2)</b> (muchii), <b>1 față = 6×(n−2)²</b>, <b>0 fețe = (n−2)³</b>. La 3×3×3: 8, 12, 6, 1 (total 27).", '<div class="fact"><b>🧠 Truc:</b> „<b>Colț-Muchie-Față-Miez</b>” = 3-2-1-0 fețe vopsite. Cubul: 6 fețe, 8 vârfuri, 12 muchii („6-8-12”). Zarul: fețele opuse dau 7.</div>')
], { byE: true });
L("iq", 1, "Șiruri de numere și litere", "🔢", /\(Teste · șiruri\)/, [
  K("Metoda în 4 pași", "Un șir ascunde o regulă simplă. O găsești încercând pe rând câteva idei.", "1) <b>Diferențele</b> dintre termeni (constante? cresc cu 1?). 2) <b>Rapoartele</b> (×2, ×3, :2). 3) <b>Două șiruri întrețesute</b> (pozițiile pare și impare separat). 4) Șiruri „celebre”: pătrate, cuburi, prime, Fibonacci, puterile lui 2.", '<div class="fact"><b>🧠 Truc:</b> „<b>D-R-I-C</b>” = Diferențe, Rapoarte, Întrețesute, Celebre.</div>'),
  K("Șirurile celebre", "Merită să le recunoști din prima.", "Pătrate: 1, 4, 9, 16, 25, 36, 49. Cuburi: 1, 8, 27, 64, 125. Prime: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21. Puterile lui 2: 1, 2, 4, 8, 16, 32, 64, 128 – exact valorile biților din subnetare!"),
  K("Șiruri de litere", "Transformi literele în numere: A=1, B=2 … Z=26 (alfabet latin fără diacritice).", "Apoi aplici aceleași reguli: +2 (A, C, E…), +3 (C, F, I…), invers (Z, Y, X…), întrețesute (A, Z, B, Y…).", '<div class="fact"><b>🧠 Truc:</b> repere: <b>E=5, J=10, O=15, T=20</b> („EJOT”).</div>')
], { byE: true });
L("iq", 1, "Intrusul și analogiile", "🧩", /\(Teste · (intrusul|analogii)\)/, [
  K("Intrusul", "Patru-cinci elemente au ceva în comun; unul nu.", "Caută întâi regula pentru <b>majoritate</b> (toate prime? toate mamifere? toate echipamente de rețea?), apoi elementul care o încalcă. Dacă găsești două reguli, alege-o pe cea mai simplă și mai evidentă.", '<div class="eli trapw"><b>❗ Nu te lăsa păcălit:</b> intrusul e uneori cel care „pare” normal (ex. 9 printre numere prime – arată impar ca ele, dar e 3×3).</div>'),
  K("Analogii", "„A e pentru B ce C e pentru ?”", "Spune relația cu voce tare într-o propoziție: „medicul <i>lucrează la</i> spital” → „profesorul <i>lucrează la</i> … școală”. Aceeași relație, aceeași direcție.", '<div class="fact"><b>🧠 Truc:</b> „<b>Propoziția-punte</b>”: dacă propoziția merge pentru ambele perechi, ai răspunsul.</div>')
], { byE: true });
L("iq", 1, "Sinonime, antonime și paronime", "📖", /\(Teste · vocabular/, [
  K("Sinonim vs antonim", "Sinonim = același sens. Antonim = sens opus.", "Sinonime: concis = succint, efemer = trecător, perspicace = ager. Antonime: efemer ↔ durabil, explicit ↔ implicit, divergent ↔ convergent.", '<div class="fact"><b>🧠 Truc:</b> „<b>SIN</b>onim = <b>S</b>ens <b>I</b>de<b>N</b>tic”; „<b>ANT</b>onim = <b>ANT</b>i (contra)”.</div><div class="eli trapw"><b>❗ Nu te lăsa păcălit:</b> la sinonime, printre variante e aproape mereu și un ANTONIM – exact cuvântul care îți „sare în ochi”.</div>'),
  K("Testul înlocuirii", "Pui varianta în locul cuvântului într-o propoziție.", "„Un răspuns <b>concis</b>” → „un răspuns <b>succint</b>” – sensul rămâne, deci e sinonim. „Un răspuns <b>prolix</b>” – sensul se inversează, deci e antonim."),
  K("Paronime", "Cuvinte care seamănă la sunet, dar au sens diferit.", "<b>a evalua</b> (a aprecia) / <b>a evolua</b> (a se dezvolta); <b>eminent</b> (remarcabil) / <b>iminent</b> (gata să se întâmple); <b>familial</b> (al familiei) / <b>familiar</b> (cunoscut); <b>oral</b> / <b>orar</b>; <b>ordin</b> (comandă) / <b>ordine</b> (aranjare).", '<div class="fact"><b>🧠 Truc:</b> „<b>I</b>minent = <b>I</b>ntră acum pe ușă”; „<b>E</b>minent = <b>E</b>xcelent”.</div>')
], { byE: true });

/* ===== Packet Tracer de la zero + exersare acasă cu scule reale (text original) ===== */
var PTS = (function () {
  function win(title, inner, h) { h = h || 220; return '<svg class="ptsvg" viewBox="0 0 360 ' + h + '" role="img" aria-label="' + title.replace(/"/g, "") + '"><rect x="1" y="1" width="358" height="' + (h - 2) + '" rx="10" fill="#fff" stroke="#94a3b8"/><rect x="1" y="1" width="358" height="26" rx="10" fill="#1e293b"/><rect x="1" y="18" width="358" height="9" fill="#1e293b"/><circle cx="16" cy="14" r="4" fill="#ef4444"/><circle cx="29" cy="14" r="4" fill="#f59e0b"/><circle cx="42" cy="14" r="4" fill="#22c55e"/><text x="180" y="18" fill="#e2e8f0" font-size="11" text-anchor="middle">' + title + "</text>" + inner + "</svg>"; }
  function btn(x, y, w, t, hi) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="24" rx="6" fill="' + (hi ? "#2563eb" : "#e2e8f0") + '"' + (hi ? ' stroke="#f59e0b" stroke-width="3"' : "") + '/><text x="' + (x + w / 2) + '" y="' + (y + 16) + '" font-size="11" text-anchor="middle" fill="' + (hi ? "#fff" : "#0f172a") + '" font-weight="700">' + t + "</text>"; }
  function fld(x, y, w, lab, val) { return '<text x="' + x + '" y="' + (y - 3) + '" font-size="9" fill="#475569">' + lab + '</text><rect x="' + x + '" y="' + y + '" width="' + w + '" height="18" rx="3" fill="#f8fafc" stroke="#94a3b8"/><text x="' + (x + 5) + '" y="' + (y + 13) + '" font-size="10" fill="#0f172a">' + (val || "") + "</text>"; }
  function tx(x, y, t, s, c, b) { return '<text x="' + x + '" y="' + y + '" font-size="' + (s || 11) + '" fill="' + (c || "#0f172a") + '"' + (b ? ' font-weight="700"' : "") + ">" + t + "</text>"; }
  function arrow(x, y) { return '<path d="M' + x + " " + y + "l-14 -14m14 14l-14 0m14 0l0 -14" + '" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/>'; }
  function dev(x, y, kind, lab) {
    var g = kind === "pc" ? '<rect x="' + (x - 16) + '" y="' + (y - 14) + '" width="32" height="22" rx="2" fill="#cbd5e1" stroke="#334155"/><rect x="' + (x - 6) + '" y="' + (y + 8) + '" width="12" height="5" fill="#334155"/>' :
      kind === "sw" ? '<rect x="' + (x - 22) + '" y="' + (y - 9) + '" width="44" height="18" rx="3" fill="#0ea5e9" stroke="#075985"/><path d="M' + (x - 12) + " " + (y - 3) + "h24m-24 6h24" + '" stroke="#fff" stroke-width="2"/>' :
      '<circle cx="' + x + '" cy="' + y + '" r="14" fill="#0ea5e9" stroke="#075985"/><path d="M' + (x - 8) + " " + y + "h16M" + x + " " + (y - 8) + "v16" + '" stroke="#fff" stroke-width="2"/>';
    return g + '<text x="' + x + '" y="' + (y + 26) + '" font-size="10" text-anchor="middle" fill="#0f172a">' + lab + "</text>";
  }
  function link(x1, y1, x2, y2, kind, l1, l2) { var c = kind === "con" ? "#38bdf8" : "#111827", d = kind === "cross" ? ' stroke-dasharray="5 4"' : ""; return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="2.5"' + d + '/><circle cx="' + (x1 + (x2 - x1) * 0.12) + '" cy="' + (y1 + (y2 - y1) * 0.12) + '" r="3.5" fill="#22c55e"/><circle cx="' + (x1 + (x2 - x1) * 0.88) + '" cy="' + (y1 + (y2 - y1) * 0.88) + '" r="3.5" fill="#22c55e"/>' + (l1 ? tx(x1 + (x2 - x1) * 0.12 + 4, y1 + (y2 - y1) * 0.12 - 5, l1, 8, "#475569") : "") + (l2 ? tx(x1 + (x2 - x1) * 0.88 - 34, y1 + (y2 - y1) * 0.88 - 5, l2, 8, "#475569") : ""); }
  return {
    signup: function () { return win("netacad.com – creare cont", tx(20, 50, "Cisco Networking Academy", 13, "#1d4ed8", 1) + fld(20, 72, 150, "Prenume", "Andrei") + fld(190, 72, 150, "Nume", "…") + fld(20, 110, 320, "E-mail (unul pe care îl citești)", "exemplu@gmail.com") + fld(20, 148, 150, "Țara", "Romania") + fld(190, 148, 150, "Data nașterii", "zz/ll/aaaa") + btn(220, 182, 120, "Sign up / Creează", 1) + tx(20, 198, "apoi confirmi din e-mail", 10, "#475569")); },
    enroll: function () { return win("netacad.com – curs gratuit", '<rect x="20" y="40" width="320" height="70" rx="8" fill="#eff6ff" stroke="#93c5fd"/>' + tx(32, 62, "Getting Started with Cisco Packet Tracer", 12, "#0f172a", 1) + tx(32, 80, "Gratuit · în ritmul tău · câteva ore · certificat", 10, "#475569") + tx(32, 98, "(Packet Tracer: un curs gratuit pentru începători)", 9, "#64748b") + btn(220, 120, 120, "Enroll / Get started", 1) + tx(20, 170, "După înscriere: cursul apare la „My learning”.", 10, "#475569") + tx(20, 188, "Din curs sau din Resource Hub → Download Packet Tracer.", 10, "#475569")); },
    download: function () { return win("netacad.com/resources/lab-downloads", tx(20, 50, "Resource Hub – Packet Tracer (v. curentă)", 12, "#0f172a", 1) + btn(20, 64, 150, "Windows 64-bit", 1) + btn(190, 64, 150, "macOS") + btn(20, 96, 150, "Ubuntu 64-bit") + tx(20, 140, "Nu există variantă pentru telefon sau tabletă.", 10, "#b91c1c") + tx(20, 160, "Fișier: CiscoPacketTracer_…_Windows_64bit.exe", 10, "#475569") + tx(20, 178, "Se salvează în „Descărcări / Downloads”.", 10, "#475569")); },
    install: function () { return win("Setup – Cisco Packet Tracer", tx(20, 50, "License Agreement", 12, "#0f172a", 1) + '<rect x="20" y="58" width="320" height="48" fill="#f1f5f9" stroke="#cbd5e1"/>' + tx(28, 76, "…text licență…", 10, "#64748b") + '<circle cx="28" cy="122" r="6" fill="#2563eb"/>' + tx(40, 126, "I accept the agreement", 11) + tx(20, 150, "Next → Next → Next → Install → Finish", 11, "#1d4ed8", 1) + btn(230, 180, 110, "Next >", 1) + btn(110, 180, 110, "< Back")); },
    login: function () { return win("Cisco Packet Tracer – Login", tx(20, 52, "Multi-user la pornire? → No", 11, "#0f172a") + tx(20, 74, "Alertă Windows Firewall → poți permite sau refuza", 10, "#475569") + '<rect x="20" y="90" width="320" height="80" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>' + tx(36, 112, "Keep me logged in (3 luni)", 11) + '<rect x="270" y="100" width="40" height="18" rx="9" fill="#22c55e"/><circle cx="301" cy="109" r="7" fill="#fff"/>' + btn(36, 130, 100, "LOGIN", 1) + tx(150, 147, "se deschide browserul → te loghezi", 9, "#475569") + tx(20, 198, "„You have successfully logged in” → închizi tab-ul", 10, "#15803d", 1)); },
    workspace: function () { return win("Cisco Packet Tracer – spațiul de lucru", '<rect x="8" y="32" width="344" height="120" fill="#f8fafc" stroke="#e2e8f0"/>' + tx(130, 92, "zona albă = masa de lucru", 11, "#94a3b8") + '<rect x="8" y="156" width="344" height="56" fill="#e2e8f0"/>' + tx(14, 170, "1. Categorii:", 9, "#334155", 1) + btn(14, 176, 54, "Network") + btn(72, 176, 54, "End Dev.") + btn(130, 176, 60, "Connect. ⚡", 1) + tx(200, 170, "2. Modele:", 9, "#334155", 1) + btn(200, 176, 46, "2960", 1) + btn(250, 176, 46, "2911") + btn(300, 176, 46, "PC") + tx(270, 48, "Realtime / Simulation", 8, "#475569") + tx(14, 48, "dreapta-jos:", 8, "#475569"), 220); },
    cables: function () { return win("Connections (fulgerul)", link(30, 46, 130, 46, "con") + tx(20, 66, "Console (albastru deschis): PC RS-232 → Console", 9) + link(30, 90, 130, 90, "str") + tx(20, 110, "Copper Straight-Through (linie plină): PC/router → switch", 9) + link(30, 134, 130, 134, "cross") + tx(20, 154, "Copper Cross-Over (punctat): switch–switch, PC–PC", 9) + tx(20, 185, "Leduri: verde = OK; portocaliu = așteaptă (STP ~30 s);", 9, "#475569") + tx(20, 200, "roșu = oprit (la router: lipsește no shutdown) sau cablu greșit", 9, "#b91c1c"), 214); },
    labA: function () { return win("Lab A – switch + PC", dev(90, 110, "pc", "PC0 192.168.1.10/24") + dev(270, 110, "sw", "SW1 (2960) · VLAN1 192.168.1.2") + link(110, 105, 245, 105, "str", "Fa0", "Fa0/1") + '<path d="M90 128 Q180 180 262 122" stroke="#38bdf8" stroke-width="2.5" fill="none"/>' + tx(140, 182, "consolă: RS-232 → Console", 9, "#0369a1") + tx(20, 205, "Test: PC0 > Command Prompt > ping 192.168.1.2", 10, "#15803d", 1), 214); },
    labB: function () { return win("Lab B – SSH pe switch în VLAN 10", dev(80, 100, "pc", "PC0 192.168.10.10/24") + dev(270, 100, "sw", "SW1 · Vlan10 192.168.10.2") + link(100, 95, 245, 95, "str", "Fa0", "Fa0/1 (VLAN 10)") + tx(20, 150, "SW1: vlan 10 · Fa0/1 access vlan 10 · interface vlan 10", 9) + tx(20, 166, "domain-name · RSA 1024 · username/secret · vty: login local + ssh", 9) + tx(20, 195, "Test: PC0 > ssh -l admin 192.168.10.2", 10, "#15803d", 1), 214); },
    labC: function () { return win("Lab C – router + switch + 2 PC-uri", dev(180, 60, "rt", "R1 (2911) Gi0/0 192.168.1.1") + dev(180, 128, "sw", "") + tx(212, 132, "SW1", 10) + dev(70, 180, "pc", "PC0 .10") + dev(290, 180, "pc", "PC1 .11") + link(180, 74, 180, 119, "str", "", "") + tx(186, 100, "Gi0/0 ↔ Gi0/1", 8, "#475569") + link(160, 135, 85, 168, "str") + link(200, 135, 275, 168, "str") + tx(14, 46, "masca /24, gateway .1", 9, "#475569"), 220); },
    tools: function () { return '<svg class="ptsvg" viewBox="0 0 360 150" role="img" aria-label="Sculele pentru exersare"><rect width="360" height="150" rx="10" fill="#f8fafc" stroke="#cbd5e1"/>' + '<path d="M20 40 l60 20 l-6 14 l-60-20z" fill="#475569"/><path d="M20 80 l60 -20 l4 14 l-60 20z" fill="#64748b"/>' + tx(18, 118, "clește RJ45 (8P8C)", 9) + '<circle cx="150" cy="60" r="26" fill="none" stroke="#2563eb" stroke-width="7"/>' + tx(118, 118, "cablu UTP Cat5e/6", 9) + '<rect x="215" y="45" width="26" height="22" rx="3" fill="#e0f2fe" stroke="#0369a1"/><rect x="246" y="45" width="26" height="22" rx="3" fill="#e0f2fe" stroke="#0369a1"/>' + tx(210, 118, "mufe RJ45", 9) + '<rect x="295" y="30" width="44" height="60" rx="5" fill="#1e293b"/><circle cx="305" cy="45" r="3" fill="#22c55e"/><circle cx="315" cy="45" r="3" fill="#22c55e"/><circle cx="325" cy="45" r="3" fill="#22c55e"/>' + tx(292, 118, "tester", 9) + tx(18, 138, "+ opțional: manșoane (boots), dezizolator rotativ, foarfecă", 9, "#475569") + "</svg>"; }
  };
})();
function TIP(s) { return '<div class="mnemo"><b>💡 Sfat:</b> ' + s + "</div>"; }
function CMD(lines) { return '<div class="term">' + lines.map(function (l) { return '<div class="tline">' + l.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</div>"; }).join("") + "</div>"; }
function STEPS(a) { return "<ol class=\"steps\">" + a.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ol>"; }

L("pp", 3, "Packet Tracer de la zero 1: cont NetAcad și cursul gratuit", "🎓", /Practic: PT-cont/, [
  K("Ce este Packet Tracer", "E un „joc de Lego” cu switch-uri, routere și calculatoare. Le pui pe masă, le legi cu cabluri și le configurezi exact ca pe cele reale – gratuit, pe laptopul tău.", "Packet Tracer e simulatorul oficial Cisco. Programul e <b>gratuit</b>, dar cere un cont <b>Cisco Networking Academy (NetAcad)</b>. Merge pe Windows, macOS și Linux – <b>nu</b> pe telefon sau tabletă.", EX("La examen ți se poate da chiar un laptop cu Packet Tracer sau un terminal real: comenzile sunt aceleași.")),
  K("Pasul 1: îți faci cont", "Ca la orice site: nume, e-mail, parolă, apoi confirmi din e-mail.", STEPS(["Deschide <b>netacad.com</b> în browser (pe laptop sau telefon).", "Apasă butonul de creare cont (<i>Sign up</i> / <i>Get started</i>).", "Completează prenume, nume, țară, data nașterii și un <b>e-mail pe care îl citești</b>.", "Primești un e-mail cu un link sau un cod – îl deschizi ca să confirmi contul.", "Alegi o parolă și o notezi undeva sigur."]), PTS.signup() + TIP("Folosește același e-mail și aceeași parolă și la logarea din Packet Tracer – programul te trimite la NetAcad ca să te recunoască.")),
  K("Pasul 2: te înscrii la cursul gratuit", "Cursul e „cheia” spre program și îți arată în câteva ore cum se folosește.", STEPS(["Logat pe netacad.com, caută cursul <b>„Getting Started with Cisco Packet Tracer”</b> (pagina lui se numește ceva de genul „A Free and Fun Course for Beginners”).", "Apasă <b>Enroll / Get started</b> (înscriere).", "Cursul apare la <b>My learning</b>; îl poți parcurge în ritmul tău.", "Linkul de descărcare îl găsești în curs sau în <b>Resource Hub</b> (netacad.com/resources/lab-downloads)."]), PTS.enroll() + TIP("Numele butoanelor de pe site se mai schimbă; caută cuvintele „Packet Tracer”, „Enroll” și „Download”."))
], { byE: true, noHk: true });
L("pp", 3, "Packet Tracer de la zero 2: instalare și prima pornire", "💾", /Practic: PT-instalare/, [
  K("Descarci programul", "Iei „cutia” programului de pe site, ca pe orice aplicație.", STEPS(["Mergi la <b>netacad.com/resources/lab-downloads</b> (Resource Hub).", "Alege <b>Windows 64-bit</b> (dacă laptopul are Windows).", "Fișierul <code>CiscoPacketTracer_…_Windows_64bit.exe</code> se salvează în <b>Descărcări</b>."]), PTS.download()),
  K("Instalezi (Next, Next…)", "Ca la orice program Windows: accepți licența și apeși Next până la Finish.", STEPS(["Dublu-clic pe fișierul descărcat. Dacă Windows întreabă „Permiți modificări?” → <b>Da</b>.", "<b>I accept the agreement</b> → Next.", "Locația implicită → Next; folderul din meniul Start → Next; scurtătura pe desktop (bifată) → Next.", "<b>Install</b>, aștepți, apoi <b>Finish</b> (cu bifa „Launch Cisco Packet Tracer”)."]), PTS.install()),
  K("Prima pornire și logarea", "Programul te întreabă cine ești, apoi te lasă să construiești.", STEPS(["La întrebarea despre <b>multi-user</b> → <b>No</b>.", "Dacă apare alerta Windows Firewall, poți permite sau refuza – pentru exercițiile noastre nu contează.", "În fereastra de login activează <b>Keep me logged in</b> (ține minte 3 luni – doar pe laptopul tău).", "Apasă <b>LOGIN</b> → se deschide browserul → te loghezi cu contul NetAcad → mesaj „You have successfully logged in” → închizi tab-ul și revii în program."]), PTS.login()),
  K("Cum arată spațiul de lucru", "Jos-stânga e „cutia cu jucării”, în mijloc e masa, dreapta-jos e butonul de timp real/simulare.", "Jos-stânga: <b>categoriile</b> (Network Devices → Switches/Routers, End Devices → PC, Connections = fulgerul). Lângă ele: <b>modelele</b> (switch 2960, router 2911, PC). Tragi cu mouse-ul pe masă. <b>Clic pe un aparat</b> = fereastra lui: la switch/router tab-ul <b>CLI</b>; la PC tab-ul <b>Desktop</b> (IP Configuration, Command Prompt, Terminal).", PTS.workspace() + PTS.cables())
], { byE: true, noHk: true });
L("pp", 3, "Lab A în Packet Tracer: switch + PC, configurare și ping", "🧪", /Practic: PT-labA/, [
  K("Construiești rețeaua", "Un switch, un PC, un cablu de date și unul de consolă.", STEPS(["Network Devices → Switches → <b>2960</b> → trage pe masă (devine Switch0).", "End Devices → <b>PC</b> → trage pe masă (PC0).", "Fulgerul → <b>Copper Straight-Through</b> → clic pe PC0 → <b>FastEthernet0</b> → clic pe switch → <b>FastEthernet0/1</b>.", "Fulgerul → <b>Console</b> (albastru deschis) → PC0 <b>RS 232</b> → switch <b>Console</b>.", "Ledurile devin verzi (pe switch pot sta ~30 s portocalii – e STP; poți apăsa <i>Fast Forward Time</i>)."]), PTS.labA()),
  K("Configurezi switch-ul", "Ca la examen: nume, parole, IP de management, salvare.", "Clic pe PC0 → Desktop → <b>Terminal</b> → OK (9600 8N1, ca la PuTTY) → Enter. Sau direct: clic pe switch → tab <b>CLI</b>.", CMD(["Switch> enable", "Switch# configure terminal", "Switch(config)# hostname SW1", "SW1(config)# enable secret Cisco123", "SW1(config)# line console 0", "SW1(config-line)# password cisco", "SW1(config-line)# login", "SW1(config-line)# exit", "SW1(config)# interface vlan 1", "SW1(config-if)# ip address 192.168.1.2 255.255.255.0", "SW1(config-if)# no shutdown", "SW1(config-if)# end", "SW1# copy running-config startup-config"]) + TIP("Exersează exact aceleași comenzi și în terminalul simulat din aplicație (Exersează → Proba practică → Terminal Cisco).")),
  K("Configurezi PC-ul și verifici", "PC-ul primește o adresă din aceeași rețea, apoi „strigă” la switch cu ping.", STEPS(["PC0 → Desktop → <b>IP Configuration</b> → Static: IP <b>192.168.1.10</b>, mască <b>255.255.255.0</b>.", "PC0 → Desktop → <b>Command Prompt</b> → <code>ping 192.168.1.2</code>.", "Prima încercare poate da un <i>Request timed out</i> (ARP-ul își face treaba) – apoi <b>Reply from 192.168.1.2</b> = reușit.", "Pe switch: <code>show ip interface brief</code> → Vlan1 <b>up/up</b>.", "Salvează fișierul: File → Save As → <code>labA.pkt</code>."]), MIST(["Ai pus IP pe <code>interface fa0/1</code> în loc de <code>interface vlan 1</code> – pe switch-ul 2960 IP-ul de management stă pe interfața VLAN.", "Ai uitat <code>no shutdown</code> pe interface vlan 1."]))
], { byE: true });
L("pp", 3, "Lab B în Packet Tracer: SSH pe switch în VLAN 10", "🔐", /Practic: PT-labB/, [
  K("Rețeaua și VLAN-ul", "Mutăm PC-ul și administrarea switch-ului într-o „cameră” separată: VLAN 10.", STEPS(["Același montaj ca la Lab A (switch 2960 + PC0 pe Fa0/1, cablu drept).", "PC0: IP <b>192.168.10.10</b>, mască 255.255.255.0, gateway 192.168.10.1."]), PTS.labB() + CMD(["SW1(config)# vlan 10", "SW1(config-vlan)# name MGMT", "SW1(config-vlan)# exit", "SW1(config)# interface fa0/1", "SW1(config-if)# switchport mode access", "SW1(config-if)# switchport access vlan 10", "SW1(config-if)# exit", "SW1(config)# interface vlan 10", "SW1(config-if)# ip address 192.168.10.2 255.255.255.0", "SW1(config-if)# no shutdown", "SW1(config-if)# exit", "SW1(config)# ip default-gateway 192.168.10.1"])),
  K("Pornești SSH", "SSH are nevoie de: nume + domeniu (ca să facă cheile), chei RSA, un utilizator și liniile VTY setate pe SSH.", "", CMD(["SW1(config)# ip domain-name sts.local", "SW1(config)# crypto key generate rsa", "How many bits in the modulus [512]: 1024", "SW1(config)# username admin secret Cisco123", "SW1(config)# ip ssh version 2", "SW1(config)# line vty 0 15", "SW1(config-line)# login local", "SW1(config-line)# transport input ssh", "SW1(config-line)# end", "SW1# copy running-config startup-config"]) + TIP("Ordinea care contează: <b>hostname</b> și <b>ip domain-name</b> ÎNAINTE de <code>crypto key generate rsa</code>; cheie de <b>minim 768</b> biți pentru SSH v2 (pune 1024).")),
  K("Verifici ca la examen", "Te conectezi de pe PC la switch prin SSH – dacă îți cere parola, ai reușit.", STEPS(["Pe switch: <code>show ip ssh</code> → „SSH Enabled - version 2.0”.", "Pe switch: <code>show vlan brief</code> → Fa0/1 în VLAN 10; <code>show ip interface brief</code> → Vlan10 up/up.", "PC0 → Command Prompt → <code>ping 192.168.10.2</code>, apoi <code>ssh -l admin 192.168.10.2</code> → parola <b>Cisco123</b> → promptul <b>SW1&gt;</b>."]), MIST(["Vlan10 rămâne <b>down</b>: niciun port activ nu e în VLAN 10 (ai uitat <code>switchport access vlan 10</code>).", "<i>% Please define a domain-name first</i> → lipsește <code>ip domain-name</code>.", "SSH refuzat: lipsesc <code>login local</code> sau <code>transport input ssh</code> pe line vty, ori utilizatorul."]))
], { byE: true });
L("pp", 3, "Lab C în Packet Tracer: router Gi0/0 + switch + 2 PC-uri", "🌐", /Practic: PT-labC/, [
  K("Montajul", "Routerul e „poarta” rețelei; switch-ul leagă PC-urile între ele și de router.", STEPS(["Network Devices → Routers → <b>2911</b>; Switches → <b>2960</b>; End Devices → 2 × <b>PC</b>.", "Cablu drept: router <b>GigabitEthernet0/0</b> → switch <b>GigabitEthernet0/1</b>.", "Cablu drept: PC0 Fa0 → switch Fa0/1; PC1 Fa0 → switch Fa0/2.", "Legătura spre router e <b>roșie</b> – normal: interfețele routerului sunt oprite până dai <code>no shutdown</code>."]), PTS.labC()),
  K("Configurezi routerul și PC-urile", "Routerul primește prima adresă din rețea (.1), PC-urile următoarele și au routerul ca gateway.", "", CMD(["Router> enable", "Router# configure terminal", "Router(config)# hostname R1", "R1(config)# interface gigabitEthernet 0/0", "R1(config-if)# ip address 192.168.1.1 255.255.255.0", "R1(config-if)# no shutdown", "R1(config-if)# end", "R1# copy running-config startup-config"]) + STEPS(["PC0: 192.168.1.10 / 255.255.255.0 / gateway <b>192.168.1.1</b>.", "PC1: 192.168.1.11 / 255.255.255.0 / gateway <b>192.168.1.1</b>.", "Dacă la pornire routerul întreabă „initial configuration dialog? [yes/no]” → <b>no</b>."])),
  K("Verificare", "Toți trebuie să se audă între ei.", STEPS(["PC0: <code>ping 192.168.1.11</code> (PC1) și <code>ping 192.168.1.1</code> (routerul).", "R1: <code>show ip interface brief</code> → Gi0/0 <b>up/up</b>.", "Dacă ping-ul spre router nu merge: verifică gateway-ul și masca pe PC, apoi <code>no shutdown</code> pe Gi0/0."]), TIP("Pe routere mai noi (ISR 4321/4331) interfața se numește <b>Gi0/0/0</b> – citește numele cu <code>show ip interface brief</code> înainte să configurezi."))
], { byE: true });
L("pp", 3, "Packet Tracer: erori frecvente și cum le repari", "🧯", /Practic: PT-erori/, [
  K("Leduri și cabluri", "Culoarea ledului îți spune unde e problema.", "<b>Verde</b> = legătură bună. <b>Portocaliu</b> pe switch = STP învață portul (~30 s) – aștepți sau <i>Fast Forward Time</i>. <b>Roșu</b> = interfață oprită (router fără <code>no shutdown</code>) sau cablu greșit (ex. cross-over între PC și switch).", PTS.cables()),
  K("Mesaje din CLI", "IOS-ul îți spune exact ce nu-i place – citește mesajul.", "<code>% Invalid input detected at '^' marker</code> → comandă greșită sau ești în alt mod (verifică promptul: &gt;, #, (config)#). <code>% Incomplete command</code> → mai trebuie un parametru (pune <b>?</b>). <code>Translating \"…\"...domain server</code> → ai scris greșit o comandă și IOS o tratează ca nume de host; ieși cu <b>Ctrl+Shift+6</b> sau pune <code>no ip domain-lookup</code>.", MIST(["Ping eșuat: IP-uri din rețele diferite sau mască diferită.", "Primul ping cu un timeout – normal (ARP).", "Ai închis Packet Tracer fără salvare: <code>copy run start</code> salvează doar configurația din aparat, fișierul <b>.pkt</b> îl salvezi din File → Save."]))
], { byE: true });
L("pp", 3, "Exersare acasă cu scule reale: ce cumperi", "🧰", /Practic: acasă-scule/, [
  K("Lista de cumpărături", "Cu un clește, câțiva metri de cablu, câteva mufe și un tester exersezi exact ce se cere la probă.", "<b>Clește de sertizat pentru RJ45 (8P8C)</b> – de preferat cu lamă de tăiere și dezizolare. <b>Cablu UTP Cat5e sau Cat6</b>, câțiva metri, cu fire <b>solide sau multifilare</b>. <b>Mufe RJ45 potrivite categoriei</b> (mufele de Cat6 au fire mai groase; ia-le pe cele pentru cablul cumpărat), ia măcar 10–20 – o să strici câteva. <b>Tester simplu de cablu</b> (cu unitate principală și unitate la distanță, LED-uri 1–8). Opțional: <b>manșoane (boots)</b> și un dezizolator rotativ.", PTS.tools() + TIP("Mufe „pass-through” (firele ies prin față) sunt mai ușor de aranjat pentru începători, dar cer clește compatibil cu tăiere la vârf. La examen se folosesc de obicei mufele clasice.")),
  K("Cum alegi corect", "Totul trebuie să „se potrivească”: mufa cu cablul, cleștele cu mufa.", "Cablu Cat5e + mufe Cat5e; Cat6 + mufe Cat6. Mufe pentru fir <b>solid</b> vs <b>multifilar</b> (scrie pe ambalaj). Cleștele trebuie să aibă locașul de <b>8P</b> (cel de 6P e pentru RJ11 de telefon).", CPC("„Orice mufă merge pe orice cablu” – greșit: firele Cat6 mai groase nu intră bine în mufele de Cat5e, iar contactul iese prost."))
], { byE: true });
L("pp", 3, "Exersare acasă: mufezi, testezi, repari", "🔁", /Practic: acasă-mufare/, [
  K("Antrenamentul pas cu pas", "Faci același cablu de 5 ori până îți iese din prima, apoi te cronometrezi.", STEPS(["Taie ~1 m de cablu.", "Dezizolează mantaua <b>2–3 cm</b> (nu tăia izolația firelor!).", "Desfă perechile, îndreaptă firele între degete.", "Aranjează <b>T568B</b>: alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro.", "Taie drept, lasă <b>~12–13 mm</b> de fire.", "Împinge în mufă (clema în jos, contactele spre tine) până firele ating capătul; mantaua intră în mufă.", "Sertizează ferm, o singură apăsare completă.", "Repetă la celălalt capăt cu aceeași ordine (cablu drept)."]), (typeof AN === "function" ? AN("crimp") : "")),
  K("Testul și ce înseamnă rezultatul", "Testerul aprinde LED-urile 1→8 pe ambele părți, în aceeași ordine, dacă ai lucrat bine.", "Cablu drept bun: <b>1-1, 2-2 … 8-8</b>. Un LED nu se aprinde = fir neintrat sau contact nesertizat. Ordine încurcată (ex. 3 cu 6) = fire inversate. Țintă: sub <b>5 minute</b> pe capăt la a 10-a încercare.", MIST(["Fire prea lungi → mantaua nu intră în mufă, cablul se smulge.", "Fire inversate (verde cu albastru) – cea mai frecventă greșeală.", "Sertizare pe jumătate → contacte intermitente.", "Ai pus manșonul DUPĂ ce ai sertizat (se pune pe cablu înainte!)."]) + TIP("Exersează ordinea și în jocurile din aplicație: „Pune în ordine” și exercițiul de culori RJ45."))
], { byE: true });

/* ===== Port TRUNK, VLAN, 802.1Q, nativ, DTP, router-on-a-stick – lecții de la zero ===== */
var TRK = (function () {
  var COL = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b"];
  function t(x, y, s, sz, c, b, a) { return '<text x="' + x + '" y="' + y + '" font-size="' + (sz || 11) + '" fill="' + (c || "#0f172a") + '"' + (b ? ' font-weight="700"' : "") + (a ? ' text-anchor="' + a + '"' : "") + ">" + s + "</text>"; }
  function sw(x, y, l) { return '<rect x="' + (x - 34) + '" y="' + (y - 16) + '" width="68" height="32" rx="5" fill="#0ea5e9" stroke="#075985" stroke-width="2"/><path d="M' + (x - 22) + " " + (y - 5) + "h44m-44 10h44" + '" stroke="#fff" stroke-width="2"/>' + t(x, y + 30, l, 11, "#0f172a", 1, "middle"); }
  function pc(x, y, c, l) { return '<rect x="' + (x - 14) + '" y="' + (y - 11) + '" width="28" height="20" rx="2" fill="' + c + '" stroke="#334155"/><rect x="' + (x - 5) + '" y="' + (y + 9) + '" width="10" height="4" fill="#334155"/>' + t(x, y + 25, l, 9, "#0f172a", 0, "middle"); }
  function svg(h, label, inner) { return '<svg class="ptsvg" viewBox="0 0 360 ' + h + '" role="img" aria-label="' + label + '"><rect x="1" y="1" width="358" height="' + (h - 2) + '" rx="10" fill="#f8fafc" stroke="#cbd5e1"/>' + inner + "</svg>"; }
  return {
    hw: function () {
      var lanes = "";
      for (var i = 0; i < 4; i++) lanes += '<line x1="112" y1="' + (74 + i * 6) + '" x2="248" y2="' + (74 + i * 6) + '" stroke="' + COL[i] + '" stroke-width="4"/>';
      return svg(202, "Trunk: autostradă cu benzi colorate între două switch-uri",
        '<rect x="104" y="64" width="152" height="34" rx="6" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>' + lanes + sw(70, 82, "SW1") + sw(290, 82, "SW2") + t(180, 58, "TRUNK: toate culorile pe un cablu", 10, "#0f172a", 1, "middle") +
        pc(40, 150, COL[0], "VLAN 10") + pc(100, 150, COL[1], "VLAN 20") + pc(260, 150, COL[0], "VLAN 10") + pc(320, 150, COL[1], "VLAN 20") +
        '<path d="M40 139L60 100M100 139L80 100M260 139L280 100M320 139L300 100" stroke="#111827" stroke-width="2"/>' + t(180, 118, "access: o culoare pe cablu", 9, "#475569", 0, "middle") + t(180, 194, "Access = un culoar spre PC · Trunk = autostrada dintre switch-uri", 9, "#475569", 0, "middle"));
    },
    tag: function () {
      return svg(150, "Cadru Ethernet cu eticheta 802.1Q de 4 octeți",
        '<rect x="10" y="40" width="52" height="30" fill="#e2e8f0" stroke="#334155"/>' + t(36, 59, "MAC dest.", 9, 0, 0, "middle") +
        '<rect x="62" y="40" width="52" height="30" fill="#e2e8f0" stroke="#334155"/>' + t(88, 59, "MAC sursă", 9, 0, 0, "middle") +
        '<rect x="114" y="40" width="104" height="30" fill="#fde68a" stroke="#b45309" stroke-width="2"/>' + t(166, 59, "ETICHETĂ 802.1Q · 4 B", 9, "#7c2d12", 1, "middle") +
        '<rect x="218" y="40" width="40" height="30" fill="#e2e8f0" stroke="#334155"/>' + t(238, 59, "Tip", 9, 0, 0, "middle") +
        '<rect x="258" y="40" width="62" height="30" fill="#e2e8f0" stroke="#334155"/>' + t(289, 59, "Date", 9, 0, 0, "middle") +
        '<rect x="320" y="40" width="32" height="30" fill="#e2e8f0" stroke="#334155"/>' + t(336, 59, "FCS", 9, 0, 0, "middle") +
        '<path d="M166 72v14" stroke="#b45309" stroke-width="2"/>' +
        '<rect x="30" y="86" width="64" height="26" fill="#fff7ed" stroke="#b45309"/>' + t(62, 103, "TPID 0x8100", 9, 0, 0, "middle") +
        '<rect x="94" y="86" width="64" height="26" fill="#fff7ed" stroke="#b45309"/>' + t(126, 103, "3 biți prior.", 9, 0, 0, "middle") +
        '<rect x="158" y="86" width="40" height="26" fill="#fff7ed" stroke="#b45309"/>' + t(178, 103, "1 bit", 9, 0, 0, "middle") +
        '<rect x="198" y="86" width="132" height="26" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>' + t(264, 103, "VID: 12 biți = VLAN 1–4094", 9, "#7c2d12", 1, "middle") +
        t(180, 135, "Cadrul crește de la 1518 la 1522 octeți", 10, "#0f172a", 1, "middle"));
    },
    nat: function () {
      var l = "";
      l += '<line x1="112" y1="70" x2="248" y2="70" stroke="' + COL[0] + '" stroke-width="4"/><line x1="112" y1="76" x2="248" y2="76" stroke="' + COL[1] + '" stroke-width="4"/><line x1="112" y1="82" x2="248" y2="82" stroke="#94a3b8" stroke-width="4" stroke-dasharray="6 4"/><line x1="112" y1="88" x2="248" y2="88" stroke="' + COL[2] + '" stroke-width="4"/>';
      return svg(170, "VLAN nativ: banda fără etichetă",
        '<rect x="104" y="60" width="152" height="38" rx="6" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>' + l + sw(70, 80, "SW1") + sw(290, 80, "SW2") +
        t(180, 52, "VLAN 10 ● · VLAN 20 ● · nativ ┅ · VLAN 30 ●", 9, "#0f172a", 1, "middle") +
        t(180, 124, "Linia punctată = VLAN-ul nativ (implicit 1): cadrele lui merg FĂRĂ etichetă", 9, "#475569", 0, "middle") +
        t(180, 145, "Celelalte benzi poartă etichetă. Ambele capete: același nativ!", 9, "#b91c1c", 1, "middle"));
    },
    dtp: function () {
      var rows = [["auto", "auto", "access"], ["auto", "desirable", "TRUNK"], ["desirable", "desirable", "TRUNK"], ["trunk", "auto", "TRUNK"], ["access", "desirable", "access"]], o = t(180, 22, "Ce iese între două porturi (DTP)", 11, "#0f172a", 1, "middle");
      rows.forEach(function (r, i) { var y = 44 + i * 24; o += '<rect x="30" y="' + (y - 14) + '" width="300" height="22" rx="4" fill="' + (r[2] === "TRUNK" ? "#dcfce7" : "#fee2e2") + '" stroke="#cbd5e1"/>' + t(48, y + 2, "SW1 " + r[0], 10) + t(150, y + 2, "SW2 " + r[1], 10) + t(250, y + 2, "→ " + r[2], 10, r[2] === "TRUNK" ? "#166534" : "#991b1b", 1); });
      return svg(176, "Tabel DTP", o + t(180, 168, "Adevărat doar dacă DTP este pornit; nonegotiate îl oprește", 8, "#475569", 0, "middle"));
    },
    roas: function () {
      return svg(210, "Router-on-a-stick: un cablu, două sub-interfețe",
        '<rect x="136" y="20" width="88" height="40" rx="6" fill="#0ea5e9" stroke="#075985" stroke-width="2"/>' + t(180, 38, "R1 · G0/0", 10, "#fff", 1, "middle") + t(180, 53, "fără IP, no shut", 8, "#fff", 0, "middle") +
        '<line x1="180" y1="60" x2="180" y2="100" stroke="#111827" stroke-width="5"/>' + '<line x1="177" y1="60" x2="177" y2="100" stroke="' + COL[0] + '" stroke-width="2"/><line x1="183" y1="60" x2="183" y2="100" stroke="' + COL[1] + '" stroke-width="2"/>' +
        t(198, 80, "trunk (dot1Q)", 9, "#475569") + t(20, 40, "G0/0.10 · dot1Q 10", 9, COL[0], 1) + t(20, 54, "192.168.10.1/24", 9, COL[0]) + t(244, 40, "G0/0.20 · dot1Q 20", 9, COL[1], 1) + t(244, 54, "192.168.20.1/24", 9, COL[1]) +
        sw(180, 118, "SW1 · Gi0/1 trunk") + pc(80, 180, COL[0], "PC1 VLAN 10") + pc(280, 180, COL[1], "PC2 VLAN 20") +
        '<path d="M80 169L150 128M280 169L210 128" stroke="#111827" stroke-width="2"/>');
    }
  };
})();
function TRKX(lines) { return CMD(lines); }

L("trk", 1, "Access și trunk: autostrada cu benzi colorate", "🛣️", /Trunk: bază/, [
  K("Două feluri de porturi pe switch", "Imaginează-ți o clădire cu etaje (VLAN-uri). Fiecare etaj are o culoare. Un port <b>access</b> este ușa unui singur etaj: calculatorul de acolo intră doar pe culoarea lui. Un port <b>trunk</b> este liftul mare dintre clădiri, care duce toate culorile deodată.", "<b>Access</b> = aparține unui singur VLAN, pentru calculatoare, imprimante, telefoane. <b>Trunk</b> = poartă mai multe VLAN-uri pe același cablu, între switch-uri sau spre router.", TRK.hw()),
  K("De ce nu facem un cablu pentru fiecare VLAN?", "Dacă ai 10 culori și câte un cablu pentru fiecare, te alegi cu un munte de cabluri. Trunkul le pune pe toate pe o singură autostradă, cu benzi colorate.", "Trunkul <b>economisește cabluri și porturi</b>. Nu mărește viteza și nu criptează nimic: doar pune VLAN-urile la rând, cu etichete. Pe fiecare cadru, switch-ul lipește o etichetă cu culoarea (numărul VLAN-ului).", MIST(["Crezi că trunkul „e mai rapid”. Nu e; are aceeași viteză ca portul.", "Pui un PC pe trunk. PC-ul nu știe de etichete; stațiile merg pe access.", "Uiți că routerul sau alt switch cere trunk, nu access."]) + '<div class="mnemo"><b>🧠 Truc:</b> TRUNK = TRUNCHI mare cu multe ramuri. ACCESS = ACCES la un singur culoar.</div>'),
  K("Ce comenzi diferențiază cele două porturi", "", "Access: <code>switchport mode access</code> + <code>switchport access vlan 10</code>. Trunk: <code>switchport mode trunk</code>. Un access are un VLAN; un trunk are o <b>listă</b> de VLAN-uri permise.", CMD(["interface fa0/1", " switchport mode access", " switchport access vlan 10", "interface gi0/1", " switchport mode trunk"]))
]);
L("trk", 1, "VLAN: camere separate în aceeași clădire", "🧱", /Trunk: vlan/, [
  K("Ce este un VLAN", "O clădire mare, cu o singură sală uriașă, unde toți strigă și se aude peste tot. VLAN-ul pune pereți invizibili: fiecare cameră aude doar propriile strigăte.", "VLAN = rețea locală <b>logică</b>, creată prin configurare, nu prin cabluri noi. Fiecare VLAN este un <b>domeniu de broadcast</b> separat. ID-uri utilizabile: <b>1–4094</b> (0 și 4095 sunt rezervate). Implicit, toate porturile sunt în <b>VLAN 1</b>."),
  K("Cum creezi VLAN-uri și pui porturi în ele", "", "Creezi VLAN-ul în configurare globală, îi dai nume, apoi pui portul în el. Verifici cu <code>show vlan brief</code>.", CMD(["Switch(config)# vlan 10", "Switch(config-vlan)# name ADMIN", "Switch(config)# interface fa0/1", "Switch(config-if)# switchport mode access", "Switch(config-if)# switchport access vlan 10", "Switch# show vlan brief"]) + MIST(["Dai „switchport access vlan 10” fără să fi creat VLAN 10: pe unele switch-uri se creează singur, dar fără nume; fii explicit.", "Cauți porturile trunk în show vlan brief: nu apar acolo!", "Crezi că VLAN-urile diferite comunică singure: ai nevoie de router sau switch de nivel 3."]))
]);
L("trk", 2, "802.1Q: eticheta de pe fiecare cadru", "🏷️", /Trunk: dot1q/, [
  K("Eticheta de pe valiză", "Pe aeroport, fiecare valiză primește o etichetă cu destinația. Pe trunk, fiecare cadru primește o etichetă cu <b>numărul VLAN-ului</b>, ca să știe celălalt switch în ce cameră îl duce.", "Standard: <b>IEEE 802.1Q</b>. Eticheta are <b>4 octeți</b> și se pune între MAC-ul sursă și câmpul Tip: <b>TPID 0x8100</b> (16 biți), prioritate (3 biți), 1 bit CFI, <b>VID 12 biți</b>. Cadrul maxim crește de la 1518 la <b>1522</b> octeți.", TRK.tag()),
  K("Cine pune și cine scoate eticheta", "Calculatorul nu știe nimic de etichete. Switch-ul o lipește când cadrul intră pe trunk și o rupe când cadrul iese pe un port access.", "Pe <b>access</b>: cadre normale, fără etichetă. Pe <b>trunk</b>: cadre etichetate (în afară de VLAN-ul nativ). <b>ISL</b> este varianta veche, proprietară Cisco (antet de 30 de octeți); azi se folosește 802.1Q.", MIST(["Spui că 802.1Q este proprietar Cisco. Nu e: este standard IEEE.", "Confunzi 802.1Q cu 802.1X (autentificare) sau 802.3 (Ethernet).", "Crezi că eticheta are 2 octeți: TPID are 2, eticheta întreagă are 4."]) + '<div class="mnemo"><b>🧠 Truc:</b> 802.1<b>Q</b> = <b>Q</b>-ul din „cozi”: fiecare VLAN stă la coada lui. Eticheta = 4 octeți, 12 biți de VLAN.</div>')
]);
L("trk", 2, "VLAN-ul nativ: pasagerul fără bilet", "🎟️", /Trunk: nativ/, [
  K("Banda fără etichetă", "Pe autostradă, toate mașinile au un abțibild colorat. O singură bandă are voie să circule fără abțibild: aceea este VLAN-ul <b>nativ</b>.", "VLAN-ul nativ = cadrele lui trec pe trunk <b>fără etichetă 802.1Q</b>. Implicit este <b>VLAN 1</b>. Se schimbă pe trunk cu <code>switchport trunk native vlan 99</code>.", TRK.nat()),
  K("De ce contează să fie la fel la ambele capete", "Dacă un capăt crede că banda fără abțibild e „1”, iar celălalt crede „99”, mașinile ajung în camera greșită.", "Trebuie <b>același nativ pe ambele capete</b>. Dacă diferă, CDP scrie <i>%CDP-4-NATIVE_VLAN_MISMATCH</i> și cadrele pot ajunge în VLAN greșit. Practic: mută nativul într-un VLAN gol (de ex. 999) pe ambele capete și nu folosi VLAN 1 pentru utilizatori.", MIST(["Setezi nativul doar pe un capăt.", "Pui nativul pe un port access: comanda e „switchport trunk native vlan”, pe trunk.", "Crezi că nativul primește etichetă dublă; nu primește nicio etichetă."]) + '<div class="mnemo"><b>🧠 Truc:</b> NATIV = „nativ la pământ”: stă pe jos, fără bilet.</div>')
]);
L("trk", 2, "Comenzile trunk, pas cu pas", "⌨️", /Trunk: cmd/, [
  K("Comanda care face trunk", "Spui portului: „de acum duci mai multe culori”.", "Pas 1 (doar la switch-uri care știu ISL, de ex. Catalyst 3560): <code>switchport trunk encapsulation dot1q</code>. Pas 2: <code>switchport mode trunk</code>. Pe <b>Catalyst 2960</b> există numai 802.1Q, deci sari peste pasul 1.", CMD(["! 3560:", "interface gi0/1", " switchport trunk encapsulation dot1q", " switchport mode trunk", "! 2960:", "interface gi0/1", " switchport mode trunk"]) + MIST(["Pe 3560 dai mode trunk fără encapsulation: apare „Command rejected… encapsulation is Auto”.", "Pe 2960 dai encapsulation dot1q: comanda nu există."])),
  K("Lista VLAN-urilor permise", "Autostrada are benzi pentru toate culorile, dar tu poți închide unele benzi.", "Implicit trunkul permite <b>1–4094</b>. Restrângi cu <code>switchport trunk allowed vlan 10,20</code>. Fără cuvântul <b>add</b>, lista veche este <b>înlocuită</b>! Completezi cu <code>… allowed vlan add 30</code> și scoți cu <code>… allowed vlan remove 20</code>.", CMD(["switchport trunk allowed vlan 10,20", "switchport trunk allowed vlan add 30", "switchport trunk allowed vlan remove 20"]) + MIST(["Scrii „allowed vlan 30” crezând că adaugi: ai tăiat 10 și 20.", "Uiți să permiți VLAN-ul: PC-urile din el nu comunică peste trunk.", "Crezi că allowed vlan creează VLAN-ul: nu-l creează."]) + '<div class="mnemo"><b>🧠 Truc:</b> <b>add</b> = adaugă la grămadă; fără <b>add</b> = rescrii tot.</div>'),
  K("Nativul și încapsularea", "", "Nativ: <code>switchport trunk native vlan 99</code>. Mod fix access: <code>switchport mode access</code> (oprește DTP). Totul pe interfața trunkului.", CMD(["interface gi0/1", " switchport mode trunk", " switchport trunk allowed vlan 10,20,99", " switchport trunk native vlan 99"]))
]);
L("trk", 2, "Verifici: show interfaces trunk și show vlan brief", "🔍", /Trunk: show/, [
  K("Două comenzi de verificare", "Trunkul e ca un drum: după ce îl construiești, îl și parcurgi cu mașina, să vezi dacă merge.", "<code>show interfaces trunk</code>: portul, <b>Mode</b>, <b>Encapsulation</b> (802.1q), <b>Status</b> (trunking), <b>Native vlan</b>, apoi <b>Vlans allowed on trunk</b>. <code>show vlan brief</code>: VLAN-urile și porturile <b>access</b> – trunkurile nu apar acolo.", CMD(["Switch# show interfaces trunk", "Port  Mode  Encapsulation  Status    Native vlan", "Gi0/1 on    802.1q         trunking  1", "Port  Vlans allowed on trunk", "Gi0/1 1-4094"])),
  K("Detalii pe un port", "", "<code>show interfaces fa0/1 switchport</code> arată <b>Administrative Mode</b> (ce ai cerut) și <b>Operational Mode</b> (ce se întâmplă acum), plus VLAN-ul access și nativul.", MIST(["Cauți trunkul în show vlan brief și crezi că e defect.", "Citești Administrative în loc de Operational: pot fi diferite la dynamic auto.", "Uiți să salvezi: copy running-config startup-config."]))
]);
L("trk", 3, "DTP: când două switch-uri se înțeleg singure", "🤝", /Trunk: dtp/, [
  K("Negocierea trunkului", "Doi vecini se întreabă politicos: „vrei să facem trunk?” Unul poate cere (desirable), altul doar acceptă (auto).", "<b>DTP</b> = Dynamic Trunking Protocol (Cisco). Moduri: <b>dynamic auto</b> (acceptă), <b>dynamic desirable</b> (cere), <b>trunk</b> (fix), <b>access</b> (fix). <code>switchport nonegotiate</code> oprește DTP. Implicit la 2960: <b>dynamic auto</b>.", TRK.dtp()),
  K("Regula de aur", "Dacă amândoi doar așteaptă, nu pornește nimeni nimic.", "<b>auto + auto = access</b>. auto + desirable = trunk. trunk + auto = trunk. Practica bună: setezi <b>manual</b> <code>mode trunk</code> la ambele capete și <code>nonegotiate</code>.", MIST(["Lași ambele capete pe dynamic auto și te miri că nu merge trunk.", "Pui un port access cu desirable la vecin și crezi că iese trunk: access nu negociază.", "Lași DTP pornit spre calculatoare: un atacator poate cere trunk."]) + '<div class="mnemo"><b>🧠 Truc:</b> <b>A</b>uto = <b>A</b>șteaptă. <b>D</b>esirable = <b>D</b>ă cerere.</div>')
]);
L("trk", 3, "Trunk între două switch-uri", "🔗", /Trunk: sw2sw/, [
  K("Două clădiri, un tunel", "Etajul roșu din clădirea A trebuie să vorbească cu etajul roșu din clădirea B. Construiești un tunel cu benzi pentru toate culorile.", "Pe <b>ambele</b> porturi: <code>switchport mode trunk</code>, aceleași <b>VLAN-uri permise</b>, același <b>nativ</b>. Și <b>VLAN-urile trebuie create pe ambele switch-uri</b>.", CMD(["SW1(config)# interface gi0/1", "SW1(config-if)# switchport mode trunk", "SW1(config-if)# switchport trunk allowed vlan 10,20,99", "SW1(config-if)# switchport trunk native vlan 99", "! la fel pe SW2"])),
  K("Depanare rapidă", "", "Verifici: 1) <code>show interfaces trunk</code> – portul apare cu trunking? 2) VLAN-ul e în lista permisă? 3) nativul e la fel? 4) VLAN-ul există pe ambele switch-uri? 5) porturile access sunt în VLAN-ul corect?", MIST(["PC-urile din VLAN 10 nu se văd, iar trunkul permite doar 20.", "VLAN 10 nu a fost creat pe al doilea switch.", "Un capăt trunk, celălalt access."]))
]);
L("trk", 3, "Router-on-a-stick: un cablu, mai multe VLAN-uri", "🪢", /Trunk: roas/, [
  K("Un singur cablu spre router", "Ai un singur portar (routerul) care trebuie să vorbească cu mai multe etaje. Pune mai mulți „ghișee” (sub-interfețe) la aceeași ușă, câte unul pentru fiecare culoare.", "Switch: portul spre router în <b>trunk</b>. Router: interfața fizică pornită, <b>fără IP</b>; câte o <b>sub-interfață pe VLAN</b> cu <code>encapsulation dot1Q &lt;VLAN&gt;</code> și IP-ul ei, care e gateway-ul stațiilor.", TRK.roas()),
  K("Comenzile", "", "Numărul din nume (.10) e doar etichetă; contează <code>dot1Q 10</code>. Pentru nativ, pe sub-interfață: <code>encapsulation dot1Q 99 native</code>. Dezavantaj: un singur cablu poartă tot traficul inter-VLAN.", CMD(["R1(config)# interface g0/0", "R1(config-if)# no shutdown", "R1(config)# interface g0/0.10", "R1(config-subif)# encapsulation dot1Q 10", "R1(config-subif)# ip address 192.168.10.1 255.255.255.0", "R1(config)# interface g0/0.20", "R1(config-subif)# encapsulation dot1Q 20", "R1(config-subif)# ip address 192.168.20.1 255.255.255.0"]) + MIST(["Pui IP pe interfața fizică: pune-l pe sub-interfețe.", "Uiți no shutdown pe G0/0: toate sub-interfețele rămân jos.", "Portul de switch spre router este access în loc de trunk.", "Numele sub-interfeței nu se potrivește cu dot1Q: contează dot1Q."]))
]);

/* Termeni de bază pe capitole: [termen, definiție] sau [ACRONIM, formă completă, definiție pe înțeles]. Folosite pentru Fișe, Glosar și explicațiile la atingere. */
window.TERMS = {
fo: [
["Fibră optică", "fir de sticlă foarte subțire prin care datele circulă sub formă de lumină"],
["Miez (core)", "partea centrală a fibrei, prin care merge lumina"],
["Manta (cladding)", "stratul de sticlă din jurul miezului, cu indice de refracție mai mic; „oglinda” care ține lumina în miez"],
["Reflexie totală internă", "fenomenul prin care lumina „ricoșează” de pereții miezului și nu iese din fibră"],
["SM", "Single-Mode (monomod)", "fibră cu miez foarte subțire (~9 µm) – un singur drum pentru lumină, distanțe de zeci de km"],
["MM", "Multi-Mode (multimod)", "fibră cu miez mai gros (50 sau 62,5 µm) – mai multe drumuri, distanțe de sute de metri"],
["OM1–OM5", "Optical Multimode 1–5", "clase de fibră multimod; OM3/OM4 (aqua) sunt optimizate pentru laser, la 10 Gbit/s și peste"],
["OS2", "Optical Single-mode 2", "clasă de fibră monomod pentru exterior/distanțe mari"],
["Atenuare", "pierderea de putere a semnalului pe drum, măsurată în dB (la fibră în dB/km)"],
["Fereastră de transmisie", "lungime de undă la care fibra pierde puțin: 850, 1310, 1550 nm"],
["Dispersie modală", "„lățirea” impulsurilor în fibra multimod, pentru că razele merg pe drumuri diferite"],
["Sudură prin fuziune", "lipirea a două fibre prin topire cu arc electric; pierdere tipică sub 0,1 dB"],
["Clivator (cleaver)", "unealtă care taie fibra perfect drept (la 90°) înainte de sudură"],
["Manșon de protecție", "tub termocontractabil care protejează locul sudurii"],
["Casetă de joncțiune", "cutie în care se așază ordonat sudurile și rezerva de fibră"],
["Pigtail", "fibră scurtă cu conector la un singur capăt, sudată la cablul de linie"],
["Patchcord optic", "cablu optic scurt cu conectori la ambele capete"],
["ODF", "Optical Distribution Frame", "sertar/rack în care se termină și se distribuie fibrele"],
["LC", "Lucent Connector", "conector optic mic, cu clemă, folosit la SFP"],
["SC", "Subscriber Connector", "conector optic pătrat, push-pull"],
["ST", "Straight Tip", "conector optic rotund, cu baionetă (mai vechi)"],
["MPO", "Multi-fiber Push-On", "conector cu multe fibre (12/24) într-o singură mufă, pentru centre de date"],
["APC", "Angled Physical Contact", "conector șlefuit la 8°, verde, cu reflexie foarte mică (GPON, CATV)"],
["UPC", "Ultra Physical Contact", "conector șlefuit drept, albastru; nu se cuplează cu APC"],
["OTDR", "Optical Time-Domain Reflectometer", "reflectometru optic – „radarul” fibrei: arată lungimea, sudurile și rupturile de la un singur capăt"],
["Zonă moartă", "porțiunea de după un eveniment în care OTDR-ul nu „vede”; de aceea se folosește fibră de lansare"],
["Fibră de lansare", "bobină de fibră pusă între OTDR și traseu, ca primul conector să poată fi măsurat"],
["Power meter optic", "aparat care măsoară puterea luminii în dBm"],
["VFL", "Visual Fault Locator", "laser roșu vizibil care arată cu ochiul rupturile și îndoirile pe distanțe scurte"],
["Buget de putere", "câți dB îți permiți să pierzi între emițător și receptor"],
["FTTH", "Fiber To The Home", "fibra ajunge până în locuința abonatului"],
["FTTB", "Fiber To The Building", "fibra ajunge până în clădire, apoi cupru/Ethernet"],
["FTTC", "Fiber To The Cabinet", "fibra ajunge până la un cabinet de stradă"],
["PON", "Passive Optical Network", "rețea optică cu splittere pasive (fără curent) între operator și abonați"],
["GPON", "Gigabit PON", "PON de 2,5 Gbit/s descendent; 1490 nm jos, 1310 nm sus"],
["OLT", "Optical Line Terminal", "echipamentul PON al operatorului (în centrală)"],
["ONT", "Optical Network Terminal", "echipamentul PON de la abonat"],
["Splitter optic", "împarte lumina unei fibre în mai multe (1:8, 1:32…), fără alimentare"],
["WDM", "Wavelength Division Multiplexing", "mai multe „culori” de lumină (lungimi de undă) pe aceeași fibră"],
["CWDM", "Coarse WDM", "WDM cu canale rare (la 20 nm), ieftin"],
["DWDM", "Dense WDM", "WDM cu canale foarte dese, zeci de canale pe distanțe mari"],
["SFP", "Small Form-factor Pluggable", "modul optic/electric mic care se introduce în portul unui switch"],
["ADSS", "All-Dielectric Self-Supporting", "cablu optic aerian fără metal, autoportant"],
["OPGW", "Optical Ground Wire", "fibră în firul de gardă al liniilor de înaltă tensiune"],
["Rază minimă de curbură", "cât de mult ai voie să îndoi cablul fără să pierzi lumină sau să-l rupi"],
],
cab: [
["Cablare structurată", "sistem de cabluri organizat după standarde (TIA-568, ISO/IEC 11801), ușor de extins și administrat"],
["UTP", "Unshielded Twisted Pair", "cablu cu perechi răsucite, fără ecran"],
["STP", "Shielded Twisted Pair", "cablu cu perechi răsucite și ecran metalic"],
["FTP", "Foiled Twisted Pair", "cablu torsadat cu folie metalică de ecranare"],
["Torsadare", "răsucirea firelor câte două, ca zgomotele să se anuleze"],
["Cat5e / Cat6 / Cat6A", "categorii de cablu torsadat: 100 / 250 / 500 MHz; Cat6A duce 10 Gbit/s pe 100 m"],
["RJ45", "Registered Jack 45", "mufa cu 8 pini a cablului de rețea (corect: 8P8C)"],
["RJ11", "Registered Jack 11", "mufa mică a telefonului analogic"],
["T568A / T568B", "cele două ordini standard ale culorilor în mufa RJ45; diferă perechile verde și portocalie"],
["Cablu drept", "aceeași ordine la ambele capete; leagă echipamente diferite (PC–switch)"],
["Cablu crossover", "T568A la un capăt și T568B la celălalt; leagă echipamente de același fel (switch–switch)"],
["Cablu rollover", "cablu de consolă cu pinii inversați (1→8); de la PC la portul CONSOLE"],
["MDIX", "Medium Dependent Interface Crossover", "port care inversează intern emisia/recepția; Auto-MDIX o face automat"],
["Patch panel", "panou cu porturi în rack unde se termină cablurile fixe din clădire"],
["Patchcord", "cablu scurt de legătură (între patch panel și switch sau între priză și PC)"],
["Legătură permanentă", "cablul fix din perete, max. 90 m"],
["Canal", "tot traseul, cu patchcorduri, max. 100 m"],
["Backbone", "cablarea verticală/de coloană dintre camerele de telecomunicații"],
["Cablare orizontală", "cablurile de la camera de telecomunicații până la prizele din birouri"],
["Sculă de impact (punch-down)", "unealtă care apasă firele în contactele patch panel-ului/prizei"],
["Clește de sertizat", "unealtă care fixează mufa RJ45 pe cablu"],
["Tester de cablu", "verifică dacă firele sunt legate corect (wire map)"],
["Certificator", "aparat care verifică dacă legătura respectă performanța categoriei (NEXT, pierderi etc.)"],
["NEXT", "Near-End Crosstalk", "diafonie la capătul apropiat: o pereche „aude” semnalul alteia"],
["Split pair", "fire amestecate din perechi diferite: continuitate bună, dar zgomot mare"],
["Rack 19\"", "dulap standard cu lățimea de montaj de 19 inch"],
["U (unitate rack)", "înălțimea standard a echipamentelor din rack: 1U = 44,45 mm"],
["PDU", "Power Distribution Unit", "prelungitor/distribuitor de curent pentru rack"],
["UPS", "Uninterruptible Power Supply", "sursă neîntreruptibilă: ține echipamentele pornite din acumulator"],
["LSZH", "Low Smoke Zero Halogen", "manta care la ardere face puțin fum și nu degajă gaze toxice halogenate"],
["PoE", "Power over Ethernet", "alimentarea echipamentelor (camere, AP, telefoane) prin cablul de rețea"],
["Coaxial", "cablu cu conductor central și ecran circular (75 Ω TV, 50 Ω radio)"],
["BNC", "Bayonet Neill–Concelman", "conector coaxial cu baionetă (video, echipamente de măsură)"],
["TIA", "Telecommunications Industry Association", "organizația care publică standardele de cablare (TIA-568, 569, 606, 607, 942)"],
["ISO/IEC 11801", "standardul internațional de cablare generică (echivalentul european: EN 50173)"],
["Culoar cald / culoar rece", "aranjarea rack-urilor: aerul rece intră prin față, cel cald iese prin spate"],
["Împământare (TIA-607)", "legarea la pământ a rack-urilor și ecranelor pentru siguranță și mai puțin zgomot"],
],
pc: [
["CPU", "Central Processing Unit", "procesorul – „creierul” care execută instrucțiunile"],
["ALU", "Arithmetic Logic Unit", "partea procesorului care face calcule și comparații"],
["Cache", "memorie foarte rapidă în procesor (L1, L2, L3) pentru datele folosite des"],
["RAM", "Random Access Memory", "memoria de lucru, rapidă; se golește la oprire (volatilă)"],
["ROM", "Read-Only Memory", "memorie care își păstrează conținutul fără curent (firmware)"],
["DDR4 / DDR5", "Double Data Rate", "generații de memorie RAM; nu sunt compatibile între ele"],
["ECC", "Error-Correcting Code", "memorie care corectează singură erorile (servere)"],
["Placă de bază", "placa principală care leagă procesorul, memoria și toate componentele"],
["Chipset", "circuitele de pe placa de bază care coordonează comunicarea dintre componente"],
["BIOS", "Basic Input/Output System", "programul de pornire de pe placa de bază (vechi)"],
["UEFI", "Unified Extensible Firmware Interface", "înlocuitorul modern al BIOS-ului (discuri GPT, Secure Boot)"],
["POST", "Power-On Self-Test", "autotestul de la pornire; erorile se anunță prin bipuri"],
["CMOS", "Complementary Metal-Oxide-Semiconductor", "memoria mică, alimentată de o baterie, care ține setările BIOS și ora"],
["Sursă ATX", "sursa de alimentare a PC-ului: transformă 230 V AC în +3,3 / +5 / +12 V DC"],
["HDD", "Hard Disk Drive", "disc magnetic cu platane rotative"],
["SSD", "Solid State Drive", "disc fără piese mobile, pe memorie flash – mult mai rapid"],
["SATA", "Serial ATA", "interfața pentru discuri HDD/SSD clasice"],
["NVMe", "Non-Volatile Memory Express", "interfață foarte rapidă pentru SSD-uri pe PCIe (de obicei M.2)"],
["PCIe", "PCI Express", "magistrala pentru plăci de extensie (video, rețea, NVMe)"],
["GPU", "Graphics Processing Unit", "procesorul plăcii video"],
["RAID", "Redundant Array of Independent Disks", "mai multe discuri lucrând împreună pentru viteză și/sau siguranță"],
["RAID 1", "oglindire: aceleași date pe două discuri"],
["RAID 5", "date + paritate pe minim 3 discuri; rezistă la pierderea unui disc"],
["S.M.A.R.T.", "Self-Monitoring, Analysis and Reporting Technology", "autodiagnoza discului care avertizează înainte de defectare"],
["USB", "Universal Serial Bus", "portul universal pentru periferice (USB 2.0 = 480 Mbit/s, 3.0 = 5 Gbit/s)"],
["HDMI", "High-Definition Multimedia Interface", "conector digital pentru imagine și sunet"],
["VGA", "Video Graphics Array", "conector video analogic vechi (albastru, 15 pini)"],
["ESD", "Electrostatic Discharge", "descărcare electrostatică – poate distruge componentele; se folosește brățara antistatică"],
["Pastă termică", "pastă între procesor și cooler care ajută transferul căldurii"],
["MBR / GPT", "Master Boot Record / GUID Partition Table", "scheme de partiționare: MBR (vechi, max. 2 TB), GPT (modern, cu UEFI)"],
["Fuser (cuptor)", "componenta imprimantei laser care fixează tonerul prin căldură"],
["DPI", "Dots Per Inch", "puncte pe inch – rezoluția imprimantelor și scanerelor"],
["KVM", "Keyboard, Video, Mouse", "comutator: o tastatură, un monitor și un mouse pentru mai multe calculatoare"],
["Bit / octet (byte)", "bit = 0 sau 1; octet = 8 biți"],
["Hexazecimal", "sistem în baza 16 (0–9, A–F); o cifră hexa = 4 biți"],
],
win: [
["Sistem de operare", "programul de bază care administrează calculatorul și rulează aplicațiile"],
["NTFS", "New Technology File System", "sistemul de fișiere Windows cu permisiuni, criptare și fișiere mari"],
["FAT32", "File Allocation Table 32", "sistem de fișiere vechi, compatibil, max. 4 GB pe fișier"],
["Partiție", "o „felie” a discului folosită ca unitate separată (C:, D:)"],
["Instalare curată", "instalare pe disc gol, fără păstrarea datelor vechi"],
["Upgrade", "instalarea unei versiuni noi peste cea veche, păstrând fișierele și programele"],
["Driver", "programul care învață Windows-ul să folosească o componentă hardware"],
["Device Manager", "devmgmt.msc – lista dispozitivelor și a driverelor"],
["Disk Management", "diskmgmt.msc – partiții și discuri"],
["Event Viewer", "eventvwr.msc – jurnalele de erori și evenimente"],
["Registry", "baza de date cu setările Windows (regedit)"],
["UAC", "User Account Control", "fereastra care cere confirmare pentru acțiuni de administrator"],
["Cont de administrator", "cont cu drepturi depline asupra calculatorului"],
["Workgroup", "grup de calculatoare egale, fiecare cu conturile lui"],
["Domeniu", "rețea administrată central, cu conturi pe un controler de domeniu (Active Directory)"],
["Permisiuni NTFS", "drepturile pe fișiere și foldere (Read, Modify, Full Control)"],
["Permisiuni de partajare", "drepturile pentru accesul prin rețea; se combină cu NTFS – câștigă cea mai strictă"],
["UNC", "Universal Naming Convention", "calea de rețea de forma \\\\server\\partajare"],
["SMB", "Server Message Block", "protocolul Windows de partajare a fișierelor și imprimantelor (port 445)"],
["RDP", "Remote Desktop Protocol", "controlul de la distanță al unui calculator Windows (port 3389)"],
["Backup complet", "copie a tuturor datelor"],
["Backup incremental", "copiază doar ce s-a schimbat de la ultimul backup de orice fel"],
["Backup diferențial", "copiază tot ce s-a schimbat de la ultimul backup complet"],
["System Restore", "readuce setările de sistem la un punct anterior (nu salvează documentele)"],
["Safe Mode", "pornire cu drivere minime, pentru depanare"],
["BitLocker", "criptarea întregului disc în Windows Pro/Enterprise"],
["ipconfig", "comandă care arată adresa IP, masca, gateway-ul, DNS-ul"],
["ping", "comandă care verifică dacă un echipament răspunde în rețea"],
["tracert", "comandă care arată routerele prin care trece un pachet"],
["nslookup", "comandă care întreabă serverul DNS ce IP are un nume"],
["netstat", "comandă care arată conexiunile și porturile deschise"],
["sfc /scannow", "verifică și repară fișierele de sistem Windows"],
["chkdsk", "verifică și repară erorile de pe disc"],
["gpupdate", "aplică imediat politicile de grup"],
["APIPA", "Automatic Private IP Addressing", "adresă 169.254.x.x pe care Windows și-o dă singur când nu răspunde DHCP"],
["Firewall Windows", "filtrul care permite sau blochează traficul în/din calculator"],
],
net: [
["Rețea", "echipamente legate între ele ca să schimbe date"],
["PAN", "Personal Area Network", "rețea personală de câțiva metri (Bluetooth)"],
["LAN", "Local Area Network", "rețea locală – o clădire"],
["WLAN", "Wireless LAN", "rețea locală fără fir (Wi-Fi)"],
["CAN", "Campus Area Network", "rețea care leagă clădirile unui campus"],
["MAN", "Metropolitan Area Network", "rețea la nivel de oraș"],
["WAN", "Wide Area Network", "rețea extinsă între orașe/țări; Internetul"],
["SAN", "Storage Area Network", "rețea dedicată stocării (servere ↔ discuri)"],
["VAN", "Value-Added Network", "rețea privată a unui furnizor, cu servicii adăugate"],
["VPN", "Virtual Private Network", "tunel criptat prin Internet către o rețea privată"],
["Topologie", "felul în care sunt legate echipamentele: stea, magistrală, inel, plasă, arbore, hibridă"],
["Switch", "leagă calculatoarele din aceeași rețea; lucrează cu adrese MAC (nivelul 2)"],
["Router", "leagă rețele diferite și alege drumul pachetelor; lucrează cu adrese IP (nivelul 3)"],
["Hub", "dispozitiv vechi care repetă semnalul pe toate porturile (nivelul 1)"],
["Access point", "punct de acces – conectează dispozitivele Wi-Fi la rețeaua cu fir"],
["Firewall", "„paznicul” rețelei: permite sau blochează traficul după reguli"],
["OSI", "Open Systems Interconnection", "modelul de referință cu 7 straturi al comunicației în rețea"],
["TCP/IP", "Transmission Control Protocol / Internet Protocol", "suita de protocoale a Internetului (model cu 4 straturi)"],
["PDU", "Protocol Data Unit", "„pachetul” de date al fiecărui strat: segment, pachet, cadru, biți"],
["Încapsulare", "adăugarea antetului fiecărui strat la date, de sus în jos"],
["MAC", "Media Access Control", "adresa fizică a plăcii de rețea, 48 de biți (ex. 00-1A-2B-3C-4D-5E)"],
["IP", "Internet Protocol", "protocolul de adresare logică și rutare a pachetelor"],
["IPv4", "Internet Protocol versiunea 4", "adrese de 32 de biți, scrise ca 4 numere (192.168.1.10)"],
["IPv6", "Internet Protocol versiunea 6", "adrese de 128 de biți, scrise în hexazecimal (2001:db8::1)"],
["Gateway implicit", "routerul la care un calculator trimite tot ce nu e în rețeaua lui"],
["ARP", "Address Resolution Protocol", "află adresa MAC corespunzătoare unei adrese IP din rețeaua locală"],
["DHCP", "Dynamic Host Configuration Protocol", "dă automat adresă IP, mască, gateway și DNS calculatoarelor"],
["DNS", "Domain Name System", "„agenda telefonică” a Internetului: traduce nume în adrese IP"],
["TCP", "Transmission Control Protocol", "transport sigur, cu conexiune și confirmări (ca scrisoarea recomandată)"],
["UDP", "User Datagram Protocol", "transport rapid, fără confirmări (voce, video, DNS)"],
["Port", "număr care identifică serviciul/aplicația (HTTP 80, HTTPS 443, SSH 22)"],
["ICMP", "Internet Control Message Protocol", "mesaje de control și eroare (folosit de ping și traceroute)"],
["TTL", "Time To Live", "contor din pachet scăzut la fiecare router; la 0 pachetul e aruncat"],
["NAT", "Network Address Translation", "traduce adresele private în adresa publică a routerului"],
["HTTP / HTTPS", "HyperText Transfer Protocol (Secure)", "protocolul web; HTTPS este varianta criptată"],
["SSH", "Secure Shell", "acces criptat la linia de comandă a echipamentelor (port 22)"],
["Telnet", "acces la distanță necriptat (port 23) – de evitat"],
["IOS", "Internetwork Operating System", "sistemul de operare al routerelor și switch-urilor Cisco"],
["Running-config", "configurația activă, din RAM – se pierde la repornire"],
["Startup-config", "configurația salvată în NVRAM, încărcată la pornire"],
["NVRAM", "Non-Volatile RAM", "memorie care păstrează configurația salvată"],
["VLAN", "Virtual LAN", "rețea logică separată pe același switch (alt domeniu de broadcast)"],
["Trunk", "legătură care transportă mai multe VLAN-uri, etichetate 802.1Q"],
["802.1Q", "standardul de etichetare a cadrelor cu numărul VLAN-ului"],
["STP", "Spanning Tree Protocol", "oprește buclele dintre switch-uri blocând porturile redundante"],
["ACL", "Access Control List", "listă de reguli permit/deny pe router pentru filtrarea traficului"],
["OSPF", "Open Shortest Path First", "protocol de rutare dinamică bazat pe starea legăturilor (cost)"],
["Tabelă de rutare", "lista de rețele cunoscute de router și pe unde se ajunge la ele"],
["Broadcast", "mesaj trimis tuturor din rețea"],
["Wi-Fi (802.11)", "standardele de rețea fără fir pe 2,4 / 5 / 6 GHz"],
["SSID", "Service Set Identifier", "numele rețelei Wi-Fi"],
["WPA2 / WPA3", "Wi-Fi Protected Access", "metode de securizare Wi-Fi cu criptare AES (WEP este nesigur)"],
["IPsec", "IP Security", "suită de protocoale pentru VPN-uri criptate la nivelul IP"],
["DMZ", "Demilitarized Zone", "zonă separată pentru serverele accesibile din Internet"],
["QoS", "Quality of Service", "prioritizarea traficului important (ex. voce)"],
],
sub: [
["Masca de subrețea", "arată ce parte din IP este rețeaua (strada) și ce parte este host-ul (casa)"],
["Prefix (/n)", "numărul de biți de 1 din mască (ex. /24 = 255.255.255.0)"],
["CIDR", "Classless Inter-Domain Routing", "scrierea măștii ca /n și adresarea fără clase"],
["Adresa de rețea", "prima adresă a subrețelei; identifică rețeaua, nu se dă unui calculator"],
["Adresa de broadcast", "ultima adresă a subrețelei; mesaj pentru toți"],
["Host", "orice echipament care primește o adresă IP"],
["Host-uri utilizabile", "2^h − 2, unde h = biții de host"],
["Număr de subrețele", "2^n, unde n = biții împrumutați"],
["Pas (bloc)", "256 − octetul „interesant” al măștii; subrețelele încep la multipli ai pasului"],
["VLSM", "Variable Length Subnet Mask", "subrețele de mărimi diferite, după nevoie"],
["Sumarizare", "o singură rută care acoperă mai multe rețele consecutive"],
["Wildcard", "inversul măștii (255.255.255.255 − mască), folosit în ACL și OSPF"],
["/30", "subrețea cu 4 adrese și 2 host-uri – pentru legături între două routere"],
["Adrese private", "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 – folosite în rețele interne (RFC 1918)"],
["Octet", "un grup de 8 biți; o adresă IPv4 are 4 octeți"],
],
tel: [
["Pereche telefonică", "două fire răsucite care duc o convorbire"],
["Cuartă", "grup de 4 fire răsucite împreună (două perechi)"],
["Repartitor (MDF)", "Main Distribution Frame – locul unde se termină cablurile de abonat în centrală"],
["Buclă de abonat", "perechea de cupru dintre centrală și telefonul abonatului"],
["Diafonie", "semnal nedorit „scurs” dintr-o pereche în alta"],
["Cablu umplut cu gel", "cablu protejat la apă cu umplutură de petrolatum"],
["Ecran / armătură", "folie sau bandă metalică ce protejează cablul la perturbații și la deteriorare"],
["Loose tube", "construcție de cablu optic cu fibre libere în tuburi cu gel (exterior)"],
["Tight buffer", "fibră cu protecție strânsă de 900 µm (interior)"],
["Aramidă (Kevlar)", "fire de rezistență care preiau tracțiunea în cablul optic"],
["Cod de culori TIA-598", "ordinea culorilor fibrelor: albastru, portocaliu, verde, maro, gri, alb, roșu, negru, galben, violet, roz, aqua"],
["Impedanță caracteristică", "„rezistența” pe care o vede semnalul de înaltă frecvență într-o linie"],
],
mas: [
["dB", "decibel", "unitate logaritmică pentru raportul a două puteri: 10·log(P2/P1)"],
["dBm", "decibel față de 1 miliwatt", "nivel absolut de putere: 0 dBm = 1 mW"],
["dBW", "decibel față de 1 watt", "0 dBW = 1 W = 30 dBm"],
["dBu", "decibel față de 0,775 V", "nivel de tensiune (0,775 V dă 1 mW pe 600 Ω)"],
["Np", "neper", "unitate logaritmică naturală: 1 Np = 8,686 dB"],
["Câștig", "creșterea nivelului semnalului (dB pozitivi)"],
["Atenuare", "scăderea nivelului semnalului (dB pierduți)"],
["+3 dB / −3 dB", "dublarea / înjumătățirea puterii"],
["+10 dB", "puterea crește de 10 ori"],
["Nivel absolut", "nivel măsurat față de o referință fixă (ex. 1 mW)"],
["Nivel relativ", "nivel măsurat față de un punct de referință din sistem"],
["Generator de nivel", "aparat care trimite un semnal de frecvență și nivel cunoscute"],
["Nivelmetru (indicator de nivel)", "aparat care măsoară nivelul semnalului primit"],
["Osciloscop", "aparat care arată forma semnalului în timp"],
["Analizor de spectru", "aparat care arată nivelul semnalului pe frecvențe"],
["SNR", "Signal-to-Noise Ratio", "raportul semnal/zgomot, în dB – cu cât mai mare, cu atât mai bine"],
["BER", "Bit Error Rate", "rata erorilor de bit (ex. 10⁻⁹ = o eroare la un miliard de biți)"],
["Psofometru", "aparat care măsoară zgomotul ponderat ca urechea umană"],
["True RMS", "multimetru care măsoară corect valoarea efectivă și pentru semnale nesinusoidale"],
],
el: [
["Tensiune (U)", "„presiunea” care împinge electronii; se măsoară în volți (V)"],
["Curent (I)", "cât de multă electricitate curge pe secundă; în amperi (A)"],
["Rezistență (R)", "cât de mult se opune un material trecerii curentului; în ohmi (Ω)"],
["Legea lui Ohm", "U = R · I"],
["Putere (P)", "cât de repede se consumă energia: P = U · I, în wați (W)"],
["Energie (kWh)", "putere × timp: 1 kW timp de o oră"],
["DC", "Direct Current (curent continuu)", "curge mereu în același sens – baterii, acumulatori, surse PC"],
["AC", "Alternating Current (curent alternativ)", "își schimbă sensul periodic – priza: 230 V, 50 Hz"],
["Frecvență", "de câte ori pe secundă se repetă semnalul; în hertzi (Hz)"],
["Perioadă", "durata unui ciclu: T = 1/f (20 ms la 50 Hz)"],
["Valoare efectivă (RMS)", "valoarea „echivalentă” DC a tensiunii alternative: 230 V"],
["Valoare de vârf", "valoarea maximă a sinusoidei: 230 × √2 ≈ 325 V"],
["Monofazat", "o fază + nul: 230 V"],
["Trifazat", "trei faze decalate cu 120°: 230 V fază–nul, 400 V între faze"],
["Fază (L)", "conductorul „sub tensiune” (maro/negru/gri)"],
["Nul (N)", "conductorul de întoarcere a curentului (albastru)"],
["Împământare (PE)", "conductorul de protecție legat la pământ (galben-verde)"],
["Transformator", "schimbă valoarea tensiunii alternative"],
["Redresor", "transformă AC în DC (cu diode)"],
["Invertor", "transformă DC în AC"],
["UPS", "Uninterruptible Power Supply", "sursă neîntreruptibilă cu acumulator și invertor"],
["Siguranță / disjunctor", "întrerupe circuitul la suprasarcină sau scurtcircuit"],
["RCD", "Residual Current Device (protecție diferențială)", "întrerupe curentul la scurgeri spre pământ (30 mA) – protejează oamenii"],
["Multimetru", "aparat care măsoară tensiune, curent și rezistență"],
["Voltmetru", "măsoară tensiunea; se leagă în paralel"],
["Ampermetru", "măsoară curentul; se leagă în serie"],
["Ohmmetru", "măsoară rezistența; doar cu circuitul nealimentat"],
["Clește ampermetric", "măsoară curentul fără a desface circuitul, prinzând un singur conductor"],
["Creion de tensiune", "indică prezența fazei"],
["Serie", "componente una după alta: același curent, rezistențele se adună"],
["Paralel", "componente una lângă alta: aceeași tensiune, rezistența totală scade"],
],
ant: [
["Antenă", "transformă semnalul electric în unde radio și invers"],
["Câștig (dBi)", "cât concentrează antena energia într-o direcție față de o antenă ideală izotropă"],
["Izotrop", "antenă ideală care radiază egal în toate direcțiile (referința pentru dBi)"],
["Dipol", "antena de bază din două brațe, lungime totală λ/2; 2,15 dBi"],
["Antenă omnidirecțională", "radiază la fel în toate direcțiile pe orizontală"],
["Antenă Yagi", "antenă directivă cu reflector, dipol și directori"],
["Antenă parabolică", "„farfurie” cu câștig mare și fascicul îngust (radioreleu, satelit)"],
["Antenă sectorială", "acoperă un sector (ex. 65°, 120°) – stații de bază"],
["Polarizare", "orientarea câmpului electric al undei: verticală, orizontală, circulară"],
["Lățime de fascicul", "unghiul în care antena radiază cel puțin jumătate din puterea maximă"],
["VSWR", "Voltage Standing Wave Ratio", "raport de undă staționară – arată cât de bine se potrivesc cablul și antena (1:1 ideal)"],
["Return loss", "cât de puțină putere se întoarce de la antenă, în dB (mai mare = mai bine)"],
["Impedanță 50 Ω", "valoarea standard pentru cablurile și antenele radio"],
["Conector N", "conector coaxial robust, etanș, pentru exterior"],
["SMA", "SubMiniature version A", "conector coaxial mic, filetat"],
["EIRP", "Effective Isotropic Radiated Power", "puterea radiată efectiv: putere emițător − pierderi cablu + câștig antenă"],
["LOS", "Line Of Sight", "linie de vedere directă între antene"],
["Zona Fresnel", "„balonul” din jurul liniei dintre antene, care trebuie să fie ≥ 60% liber"],
["Fading", "variația nivelului semnalului radio (ploaie, căi multiple)"],
["Radioreleu", "legătură radio punct-la-punct pe microunde, între piloni"],
["TETRA", "Terrestrial Trunked Radio", "sistem radio digital pentru serviciile de urgență"],
["HF", "High Frequency (unde scurte)", "3–30 MHz, se reflectă în ionosferă – distanțe mari"],
["VHF / UHF", "Very / Ultra High Frequency", "30–300 MHz / 300 MHz–3 GHz – propagare în linie de vedere"],
["LNB", "Low Noise Block", "convertorul de la focarul antenei de satelit"],
["Azimut / elevație", "direcția pe orizontală față de nord / unghiul față de orizont"],
["Descărcător de supratensiune", "protejează echipamentul de trăsnet, deviind supratensiunea la pământ"],
["Ham de siguranță", "echipamentul obligatoriu de protecție la căderea de la înălțime"],
["ANCOM", "Autoritatea Națională pentru Administrare și Reglementare în Comunicații", "instituția care licențiază frecvențele radio în România"],
],
extra: [
["PCM", "Pulse Code Modulation", "transformarea vocii în biți: 8000 eșantioane/s × 8 biți = 64 kbit/s"],
["Eșantionare", "„fotografierea” semnalului la intervale regulate"],
["E1", "fluxul digital european de 2,048 Mbit/s cu 32 de intervale de timp"],
["TDM", "Time Division Multiplexing", "fiecare canal primește pe rând un interval de timp"],
["ISDN", "Integrated Services Digital Network", "telefonie digitală: BRI (2B+D), PRI (30B+D)"],
["PBX", "Private Branch Exchange", "centrala telefonică a unei instituții"],
["VoIP", "Voice over IP", "telefonie prin rețele IP"],
["SIP", "Session Initiation Protocol", "protocolul care stabilește și închide apelurile VoIP (port 5060)"],
["RTP", "Real-time Transport Protocol", "protocolul care transportă vocea în pachete (peste UDP)"],
["Codec", "codor-decodor: transformă vocea în date și invers (G.711, G.729)"],
["Jitter", "variația întârzierii pachetelor – face vocea „robotică”"],
["MOS", "Mean Opinion Score", "notă de calitate a vocii, de la 1 la 5"],
["FXS / FXO", "Foreign Exchange Station / Office", "FXS: port la care pui telefonul; FXO: port care se leagă la linia centralei"],
["DTMF", "Dual-Tone Multi-Frequency", "tonurile tastelor telefonului"],
["Satelit geostaționar", "satelit la ~35 786 km care pare fix pe cer"],
["VSAT", "Very Small Aperture Terminal", "terminal de satelit cu antenă mică"],
["Transponder", "„repetorul” de pe satelit"],
["GPS", "Global Positioning System", "sistem de poziționare prin sateliți (parte din GNSS)"],
["Simplex / duplex", "vorbit pe rând (PTT) / vorbit simultan în ambele sensuri"],
["PTT", "Push-To-Talk", "butonul apăsat pentru a vorbi în stație"],
],
};
window.TERMS.gen = [
["IEEE", "Institute of Electrical and Electronics Engineers", "organizația care publică standardele Ethernet (802.3) și Wi-Fi (802.11)"],
["ITU-T", "International Telecommunication Union – Telecommunication", "organismul ONU care publică standardele de telecomunicații (G.652, G.711…)"],
["RFC", "Request for Comments", "documentele care descriu standardele Internetului"],
["LED", "Light-Emitting Diode", "diodă care emite lumină"],
["ADSL", "Asymmetric Digital Subscriber Line", "Internet pe linia telefonică de cupru, mai rapid la descărcare"],
["DSL", "Digital Subscriber Line", "familia de tehnologii de Internet pe perechea telefonică"],
["ISP", "Internet Service Provider", "furnizorul de Internet"],
["FTP (protocol)", "File Transfer Protocol", "transfer de fișiere, porturile 20/21, necriptat"],
["TFTP", "Trivial File Transfer Protocol", "transfer simplu de fișiere fără autentificare (UDP 69)"],
["SMTP", "Simple Mail Transfer Protocol", "trimiterea e-mailurilor (port 25)"],
["POP3", "Post Office Protocol 3", "descărcarea e-mailurilor pe calculator (port 110)"],
["IMAP", "Internet Message Access Protocol", "citirea e-mailurilor păstrate pe server (port 143)"],
["SNMP", "Simple Network Management Protocol", "monitorizarea echipamentelor de rețea (port 161)"],
["NTP", "Network Time Protocol", "sincronizarea ceasului (UDP 123)"],
["CSMA/CD", "Carrier Sense Multiple Access with Collision Detection", "„ascultă înainte să vorbești, oprește-te la coliziune” – Ethernet vechi, half-duplex"],
["CSMA/CA", "Carrier Sense Multiple Access with Collision Avoidance", "metoda Wi-Fi: evită coliziunile, așteptând și confirmând"],
["FCS", "Frame Check Sequence", "câmpul de la finalul cadrului pentru detectarea erorilor (CRC)"],
["CRC", "Cyclic Redundancy Check", "calcul matematic care detectează erorile de transmisie"],
["MTU", "Maximum Transmission Unit", "mărimea maximă a pachetului pe o legătură (Ethernet: 1500 octeți)"],
["OUI", "Organizationally Unique Identifier", "primii 24 de biți ai adresei MAC – codul producătorului"],
["FQDN", "Fully Qualified Domain Name", "numele complet al unui calculator (ex. www.sts.ro.)"],
["SVI", "Switch Virtual Interface", "interfață VLAN pe switch, folosită pentru administrare sau rutare"],
["BPDU", "Bridge Protocol Data Unit", "mesajele schimbate de switch-uri în STP"],
["VTP", "VLAN Trunking Protocol", "protocol Cisco care distribuie lista de VLAN-uri"],
["DTP", "Dynamic Trunking Protocol", "protocol Cisco care negociază automat trunk-urile"],
["LACP", "Link Aggregation Control Protocol", "unește mai multe cabluri într-o singură legătură logică (EtherChannel)"],
["HSRP / VRRP", "Hot Standby Router Protocol / Virtual Router Redundancy Protocol", "două routere împart un gateway virtual, pentru redundanță"],
["EIGRP", "Enhanced Interior Gateway Routing Protocol", "protocol de rutare Cisco (distanță administrativă 90)"],
["RIP", "Routing Information Protocol", "protocol de rutare vechi, după numărul de hop-uri (max. 15)"],
["BGP", "Border Gateway Protocol", "protocolul de rutare dintre rețelele mari ale Internetului"],
["PAT", "Port Address Translation", "NAT cu porturi: mulți utilizatori ies pe o singură adresă publică"],
["SLAAC", "Stateless Address Autoconfiguration", "IPv6: calculatorul își face singur adresa din prefixul primit de la router"],
["EUI-64", "Extended Unique Identifier 64", "metodă de a forma partea de host IPv6 din adresa MAC (inserând FFFE)"],
["NDP", "Neighbor Discovery Protocol", "IPv6: înlocuiește ARP și descoperă routerele"],
["CDP / LLDP", "Cisco Discovery Protocol / Link Layer Discovery Protocol", "echipamentele vecine se „prezintă” unul altuia"],
["AAA", "Authentication, Authorization, Accounting", "cine ești, ce ai voie, ce ai făcut"],
["RADIUS", "Remote Authentication Dial-In User Service", "server de autentificare centralizată (Wi-Fi Enterprise, VPN)"],
["TACACS+", "Terminal Access Controller Access-Control System Plus", "server Cisco de autentificare pentru administratori"],
["802.1X", "standard de autentificare a utilizatorilor înainte de accesul la rețea (cu RADIUS)"],
["AES", "Advanced Encryption Standard", "algoritm de criptare puternic (folosit de WPA2/WPA3)"],
["WEP", "Wired Equivalent Privacy", "securitate Wi-Fi veche, spartă – nu se mai folosește"],
["TKIP", "Temporal Key Integrity Protocol", "criptare Wi-Fi veche (WPA1), considerată nesigură"],
["WPS", "Wi-Fi Protected Setup", "conectare Wi-Fi prin PIN/buton – vulnerabilă, se dezactivează"],
["PSK", "Pre-Shared Key", "parola comună a rețelei Wi-Fi (mod Personal)"],
["EAP", "Extensible Authentication Protocol", "cadrul de autentificare folosit de 802.1X"],
["IDS / IPS", "Intrusion Detection / Prevention System", "detectează (IDS) sau și blochează (IPS) atacurile"],
["MIMO", "Multiple Input Multiple Output", "mai multe antene la emisie și recepție pentru viteză mai mare"],
["OFDMA", "Orthogonal Frequency-Division Multiple Access", "împarte canalul între mai mulți utilizatori simultan (Wi-Fi 6)"],
["DFS", "Dynamic Frequency Selection", "Wi-Fi 5 GHz schimbă canalul dacă detectează radare"],
["SDH", "Synchronous Digital Hierarchy", "ierarhia digitală sincronă de transport (STM-1 = 155 Mbit/s)"],
["PDH", "Plesiochronous Digital Hierarchy", "ierarhia digitală mai veche (E1, E3)"],
["TDMA", "Time Division Multiple Access", "acces multiplu prin împărțirea timpului (GSM, TETRA)"],
["FDM", "Frequency Division Multiplexing", "fiecare canal pe altă frecvență"],
["BRI / PRI", "Basic / Primary Rate Interface", "accesul ISDN de bază (2B+D) / primar (30B+D)"],
["SS7", "Signaling System No. 7", "semnalizarea dintre centralele telefonice"],
["DSCP", "Differentiated Services Code Point", "marcajul de prioritate din antetul IP (vocea: EF = 46)"],
["ISM", "Industrial, Scientific and Medical", "benzi radio fără licență (2,4 GHz, 5 GHz)"],
["GNSS", "Global Navigation Satellite System", "sistemele de poziționare prin satelit (GPS, Galileo, GLONASS)"],
["LEO", "Low Earth Orbit", "orbită joasă (sute–2000 km), întârziere mică"],
["EDFA", "Erbium-Doped Fiber Amplifier", "amplificator optic pentru 1550 nm, fără conversie electrică"],
["VCSEL", "Vertical-Cavity Surface-Emitting Laser", "laser ieftin la 850 nm pentru fibra multimod"],
["XPIC", "Cross-Polarization Interference Cancellation", "folosește ambele polarizări pe aceeași frecvență la radioreleu"],
["ATPC", "Automatic Transmit Power Control", "reglează automat puterea emițătorului radioreleu"],
["ACM", "Adaptive Coding and Modulation", "scade/crește automat modulația după calitatea legăturii"],
["DTF", "Distance To Fault", "distanța până la defect pe un cablu coaxial"],
["PIM", "Passive Intermodulation", "semnale parazite produse de contacte metalice slabe"],
["NVIS", "Near Vertical Incidence Skywave", "tehnică HF pentru acoperire regională, cu radiație aproape verticală"],
["RSL", "Received Signal Level", "nivelul semnalului recepționat, în dBm"],
["RF", "Radio Frequency", "radiofrecvență – semnale radio"],
["EMI", "Electromagnetic Interference", "perturbații electromagnetice"],
["GHz / MHz", "gigahertz / megahertz", "miliarde / milioane de oscilații pe secundă"],
["nm", "nanometru", "a miliarda parte dintr-un metru (lungimea de undă a luminii)"],
["Gbit/s", "gigabit pe secundă", "un miliard de biți pe secundă"],
];

/* Termeni noi: electricitate de la zero, radio de la zero, NAT, Munca la STS */
TERMS.el.push(
  ["Electron", "particulă foarte mică, cu sarcină negativă; electronii liberi care se mișcă prin fir formează curentul"],
  ["Conductor", "material care lasă curentul să treacă ușor (cupru, aluminiu, apa obișnuită, corpul omenesc)"],
  ["Izolator", "material care nu lasă curentul să treacă (PVC, cauciuc, sticlă, porțelan) – învelișul cablurilor"],
  ["Semiconductor", "material între conductor și izolator (siliciu); din el se fac diodele și tranzistoarele"],
  ["Circuit electric", "drum închis: sursă → fire → consumator → înapoi la sursă; doar așa circulă curentul"],
  ["Circuit deschis", "drum întrerupt (întrerupător oprit, fir rupt) – nu circulă curent"],
  ["Scurtcircuit", "bornele sursei legate direct, fără consumator – curent foarte mare, pericol de incendiu"],
  ["Consumator", "aparatul care folosește energia electrică (bec, motor, PC)"],
  ["Prefix k / M", "kilo = ×1 000 (1 kΩ = 1 000 Ω); mega = ×1 000 000"],
  ["Prefix m / µ", "mili = ÷1 000 (1 mA = 0,001 A); micro = ÷1 000 000"],
  ["Watt (W)", "unitatea puterii: P = U · I"],
  ["Kilowatt-oră (kWh)", "unitatea energiei de pe factură: 1 kW folosit timp de o oră"],
  ["Cele 5 reguli de aur", "deconectezi → asiguri împotriva reconectării → verifici lipsa tensiunii → legi la pământ și scurtcircuitezi → îngrădești părțile vecine"],
  ["Verificarea lipsei tensiunii", "măsori cu un aparat verificat că nu mai e tensiune ÎNAINTE să atingi conductoarele"],
  ["Electrocutare", "trecerea curentului prin corp; ~30 mA pot opri inima – întâi întrerupi curentul, apoi ajuți victima"]
);
TERMS.ant.push(
  ["Undă radio", "undă electromagnetică invizibilă care pleacă de la antenă cu viteza luminii (300 000 km/s)"],
  ["Frecvență (f)", "câte oscilații pe secundă face unda; se măsoară în Hz, kHz, MHz, GHz"],
  ["Lungime de undă (λ)", "distanța dintre două creste ale undei: λ[m] = 300 / f[MHz]"],
  ["UHF", "Ultra High Frequency", "banda 300 MHz–3 GHz: TETRA, GSM, Wi-Fi 2,4 GHz, GPS"],
  ["SHF", "Super High Frequency", "banda 3–30 GHz: radioreleu, satelit, Wi-Fi 5 GHz"],
  ["TX", "Transmitter", "emițătorul – „gura” stației radio, trimite semnalul"],
  ["RX", "Receiver", "receptorul – „urechea” stației radio, prinde semnalul"],
  ["Transceiver (TRX)", "emițător + receptor în aceeași cutie (orice stație radio portabilă)"],
  ["PTT", "Push-To-Talk", "butonul pe care îl ții apăsat ca să vorbești pe radio"],
  ["Simplex / Duplex", "simplex = vorbiți pe rând (PTT); duplex = amândoi deodată, ca la telefon"],
  ["Repetor", "stație pe un loc înalt care primește pe o frecvență și retransmite pe alta – mărește acoperirea"],
  ["Sensibilitate", "cel mai slab semnal pe care receptorul încă îl poate folosi (ex. −110 dBm)"],
  ["Monopol (antenă verticală)", "antenă de λ/4 care are nevoie de plan de masă; omnidirecțională"],
  ["Antenă panou", "antenă plată directivă care acoperă un sector (60–120°), pe pilonii celulari"],
  ["dBm", "putere raportată la 1 mW: 0 dBm = 1 mW, +30 dBm = 1 W; +3 dB = dublu, +10 dB = ×10"],
  ["dBd", "câștig față de dipolul λ/2; dBi = dBd + 2,15"],
  ["Coaxial 50 Ω / 75 Ω", "50 Ω în radiocomunicații; 75 Ω în TV și satelit"],
  ["BNC", "Bayonet Neill–Concelman", "conector RF cu baionetă (răsucești ¼ de tură) – aparate de măsură"],
  ["PL-259 / SO-239", "conectorul „UHF” (mufă / soclu) de pe stațiile HF/VHF și CB"],
  ["ROS", "Raport de Undă Staționară", "numele românesc al VSWR: arată cât de bine se potrivește antena cu cablul (1:1 = perfect)"],
  ["FSPL", "Free Space Path Loss", "pierderea semnalului în spațiul liber; crește cu 6 dB când dublezi distanța"],
  ["Buget de legătură", "socoteala în dB: puterea TX − pierderi + câștiguri = puterea primită; trebuie să rămână marjă"],
  ["Alfabet fonetic NATO", "un cuvânt pentru fiecare literă (Alfa, Bravo, Charlie…) ca să nu se confunde pe radio"],
  ["Stație directoare", "stația care conduce traficul într-o rețea radio"]
);
TERMS.net.push(
  ["IP privat", "adresă folosită doar în rețeaua internă (10.x, 172.16–31.x, 192.168.x); nu circulă pe Internet"],
  ["IP public", "adresă unică pe Internet, dată de furnizor"],
  ["NAT static", "o adresă privată ↔ o adresă publică, fix (1:1) – pentru servere accesate din Internet"],
  ["NAT dinamic", "adresele private primesc pe rând adrese dintr-un grup (pool) de adrese publice"],
  ["PAT", "Port Address Translation", "NAT overload: mulți utilizatori ies pe un singur IP public, deosebiți prin port"],
  ["Port forwarding", "regulă NAT care trimite traficul de pe un port public către un dispozitiv intern"]
);
TERMS.sts = [
  ["STS", "Serviciul de Telecomunicații Speciale", "instituția care administrează, printre altele, sistemul 112 și platforma radio TETRA"],
  ["SNUAU", "Sistemul național unic pentru apeluri de urgență", "sistemul din spatele numărului 112"],
  ["112", "numărul unic de urgență: centrul 112 preia apelul și îl trimite dispeceratului potrivit"],
  ["Dispecerat", "centrul unei agenții (ISU-SMURD-Ambulanță, Poliție, Jandarmerie) care coordonează echipajele"],
  ["AML", "Advanced Mobile Location", "telefonul trimite automat poziția precisă (GPS/Wi-Fi) când suni la 112"],
  ["Cell ID", "localizare aproximativă după celula (antena) rețelei mobile"],
  ["SMURD", "Serviciul Mobil de Urgență, Reanimare și Descarcerare", "echipaje medicale de urgență coordonate cu ISU"],
  ["ISU", "Inspectoratul pentru Situații de Urgență", "pompierii și protecția civilă la nivel județean"],
  ["UPU", "Unitatea de Primiri Urgențe", "secția de urgență a spitalului"],
  ["Rack 19\"", "dulap standard cu lățimea de montaj de 19 inci pentru echipamente de rețea"],
  ["Unitate de rack (U)", "1U = 1,75\" = 44,45 mm; un switch obișnuit are 1U"],
  ["Patch panel", "panou unde se termină cablurile din clădire; de aici pleacă patch cord-uri spre switch"],
  ["Organizator de cabluri", "panou cu inele/canale prin care treci cablurile ca să fie ordonate"],
  ["PDU", "Power Distribution Unit", "prelungitorul de rack care distribuie curentul echipamentelor"],
  ["Culoar rece / cald", "aerul rece intră prin fața rack-urilor, aerul cald iese prin spate"],
  ["Etichetare", "nume identic la ambele capete ale cablului și în documentație"],
  ["APIPA (169.254.x.x)", "adresa pe care și-o dă singur PC-ul când nu răspunde DHCP"],
  ["ipconfig /all", "comanda Windows care arată IP, mască, gateway, DNS, MAC"],
  ["Domeniu (Active Directory)", "administrarea centrală a PC-urilor și conturilor dintr-o instituție"],
  ["enable", "comanda Cisco: din modul utilizator (>) în modul privilegiat (#)"],
  ["configure terminal", "comanda Cisco: din # în configurarea globală (config)#"],
  ["copy running-config startup-config", "salvează configurația ca să rămână după repornire (sau write memory)"],
  ["show vlan brief", "arată VLAN-urile și porturile din fiecare"],
  ["show ip interface brief", "arată interfețele, adresele IP și starea lor"],
  ["SVI", "Switched Virtual Interface", "interfața „vlan X” a switch-ului, cu IP pentru administrare"],
  ["SIM", "Subscriber Identity Module", "cartela care spune rețelei mobile cine ești"],
  ["eSIM", "SIM încorporat în aparat, activat prin descărcarea unui profil"],
  ["IMSI", "International Mobile Subscriber Identity", "identitatea abonatului, stocată pe SIM"],
  ["ICCID", "numărul de serie tipărit pe cartela SIM"],
  ["IMEI", "International Mobile Equipment Identity", "identitatea aparatului (*#06#)"],
  ["PIN / PUK", "PIN protejează SIM-ul; după 3 PIN-uri greșite ceri PUK-ul (8 cifre)"],
  ["APN", "Access Point Name", "„poarta” de date a operatorului; APN greșit = semnal, dar fără date"],
  ["APN privat", "APN care duce datele terminalelor direct în rețeaua instituției"],
  ["MDM", "Mobile Device Management", "administrarea centrală a tabletelor/telefoanelor: aplicații, politici, ștergere la distanță"],
  ["TETRA", "Terrestrial Trunked Radio", "radio digital profesional (standard ETSI) pentru siguranță publică, ~380–400 MHz"],
  ["TMO", "Trunked Mode Operation", "terminalele TETRA comunică prin rețea (stații de bază)"],
  ["DMO", "Direct Mode Operation", "terminalele TETRA comunică direct între ele, fără rețea"],
  ["ISSI / GSSI", "identificatorul unui terminal TETRA / al unui grup de vorbire"],
  ["Apel de grup", "apeși PTT și te aud imediat toți membrii grupului"],
  ["Buton de urgență", "trimite o alarmă cu prioritate maximă la dispecerat"],
  ["Descărcător de supratensiune", "protecție montată pe cablul de antenă la intrarea în clădire, legată la pământ"],
  ["Fereastră de mentenanță", "interval planificat și anunțat în care se fac lucrări cu impact minim"],
  ["Rollback", "planul de revenire rapidă la situația veche dacă noul echipament nu merge"],
  ["Migrare", "trecerea planificată de la echipamente/sisteme vechi la altele noi"],
  ["LMDS", "Local Multipoint Distribution Service", "radio de bandă largă (ex. 28 GHz) folosit în trecut la interconectarea dispeceratelor 112"]
];
TERMS.cap = [
  ["Drept vs. crossover", "echipamente diferite (PC–switch, router–switch) → drept; la fel (PC–PC, switch–switch, PC–router) → crossover"],
  ["T568A vs. T568B", "diferă doar perechile portocalie și verde; B începe cu alb-portocaliu, A cu alb-verde; viteza e aceeași"],
  ["Monomod vs. multimod", "SM: miez 9 µm, distanțe mari, galben; MM: miez 50/62,5 µm, distanțe scurte; mantaua 125 µm la ambele"],
  ["Hub / switch / router", "hub = stratul 1, repetă tot; switch = stratul 2, după MAC; router = stratul 3, după IP, separă broadcast-ul"],
  ["MAC vs. IP", "MAC = fizică, 48 biți, fixă pe placă; IP = logică, IPv4 32 biți, se schimbă cu rețeaua"],
  ["Straturi OSI", "7 Aplicație (HTTP, DNS) · 4 Transport (TCP, UDP) · 3 Rețea (IP, router) · 2 Legătură (MAC, switch) · 1 Fizic (hub, cablu)"],
  ["TCP vs. UDP", "TCP = cu conexiune și confirmări (web, SSH); UDP = fără conexiune, rapid (voce, DNS, DHCP, TFTP)"],
  ["Porturi de bază", "20/21 FTP · 22 SSH · 23 Telnet · 25 SMTP · 53 DNS · 67/68 DHCP · 69 TFTP · 80 HTTP · 110 POP3 · 143 IMAP · 443 HTTPS · 3389 RDP"],
  ["Rețea vs. broadcast", "prima adresă = rețeaua, ultima = broadcast; niciuna nu se dă unui PC; host-uri = 2^h − 2"],
  ["IP-uri private", "10.0.0.0/8 · 172.16.0.0–172.31.255.255 · 192.168.0.0/16 (169.254 = APIPA, 127 = loopback)"],
  ["Prescurtare IPv6", "zerourile din FAȚA grupului pleacă; „::” o singură dată pe adresă"],
  ["dB vs. dBm", "dB = raport (+3 dB ≈ ×2); dBm = putere față de 1 mW (0 dBm = 1 mW); dBm + dB = dBm"],
  ["Voltmetru vs. ampermetru", "voltmetrul în paralel (rezistență mare); ampermetrul în serie (rezistență mică) – niciodată în priză"],
  ["230 V efectiv vs. 325 V vârf", "230 V = valoarea efectivă (RMS); vârful = 230 × √2 ≈ 325 V; între faze 400 V"]
];
TERMS.gen.push(
  ["PC", "Personal Computer", "calculatorul personal (desktop sau laptop)"],
  ["TV", "Televiziune", "televiziune; cablurile TV folosesc coaxial de 75 Ω"],
  ["CATV", "Community Antenna Television", "televiziunea prin cablu"],
  ["CCTV", "Closed-Circuit Television", "sistem de camere de supraveghere video"],
  ["PVC", "Policlorură de vinil", "plasticul folosit ca izolație și manta la cabluri"],
  ["ISO", "International Organization for Standardization", "organizația internațională de standardizare (ex. modelul OSI, ISO/IEC 11801)"],
  ["EN", "European Norm", "standard european (ex. EN 50173 pentru cablare)"],
  ["TIA-568", "Telecommunications Industry Association 568", "standardul american de cablare structurată (definește T568A/T568B)"],
  ["TIA-569", "TIA-569", "standard pentru trasee și spații de cablare (canale, camere tehnice)"],
  ["TIA-606", "TIA-606", "standard pentru etichetarea și administrarea cablării"],
  ["TIA-607", "TIA-607", "standard pentru legarea la pământ a sistemelor de telecomunicații"],
  ["TIA-942", "TIA-942", "standard pentru centre de date"],
  ["TIA-598", "TIA-598", "standard pentru codul culorilor fibrelor optice"],
  ["T568A", "Schema de cablare T568A", "ordinea culorilor în RJ45 care începe cu alb-verde"],
  ["T568B", "Schema de cablare T568B", "ordinea culorilor în RJ45 care începe cu alb-portocaliu (cea mai folosită)"],
  ["Cat6A", "Categoria 6A", "cablu torsadat pentru 10 Gbit/s până la 100 m (500 MHz)"],
  ["OM1", "Optical Multimode 1", "fibră multimod 62,5/125 µm, manta portocalie"],
  ["OM2", "Optical Multimode 2", "fibră multimod 50/125 µm, manta portocalie"],
  ["OM3", "Optical Multimode 3", "fibră multimod 50/125 optimizată pentru laser, manta aqua (10 Gbit/s)"],
  ["OM4", "Optical Multimode 4", "fibră multimod 50/125 îmbunătățită, aqua (sau violet)"],
  ["OM5", "Optical Multimode 5", "fibră multimod de bandă largă (SWDM), verde-lime"],
  ["OS1", "Optical Singlemode 1", "fibră monomod pentru interior"],
  ["MTP", "Multi-fiber Termination Push-on", "variantă de marcă a conectorului MPO cu multe fibre"],
  ["RG-6", "Radio Guide 6", "cablu coaxial de 75 Ω pentru TV/satelit"],
  ["RG-58", "Radio Guide 58", "cablu coaxial subțire de 50 Ω"],
  ["LMR", "LMR (Land Mobile Radio cable)", "familie de cabluri coaxiale de 50 Ω cu pierderi mici (ex. LMR-400)"],
  ["RS-232", "Recommended Standard 232", "interfața serială clasică (portul COM, conector DB9)"],
  ["DB9", "D-subminiature 9 pini", "conectorul cu 9 pini al portului serial"],
  ["ATX", "Advanced Technology eXtended", "standardul de format pentru plăci de bază și surse PC"],
  ["SRAM", "Static RAM", "memorie rapidă, folosită pentru cache"],
  ["PCH", "Platform Controller Hub", "chipset-ul de pe placa de bază (Intel)"],
  ["DIMM", "Dual Inline Memory Module", "modulul de memorie RAM pentru desktop"],
  ["SO-DIMM", "Small Outline DIMM", "modulul de memorie RAM mai mic, pentru laptop"],
  ["DDR3", "Double Data Rate 3", "generație de memorie RAM (urmată de DDR4, DDR5)"],
  ["DVI", "Digital Visual Interface", "interfață video digitală mai veche"],
  ["DP", "DisplayPort", "interfață video digitală modernă"],
  ["XP", "Windows XP", "versiune veche de Windows (2001)"],
  ["GB", "Gigabyte", "aproximativ un miliard de octeți"],
  ["AP", "Access Point", "punctul de acces Wi-Fi"],
  ["SYN", "Synchronize", "primul segment din three-way handshake TCP (cerere de conexiune)"],
  ["ACK", "Acknowledgment", "confirmare de primire în TCP"],
  ["SYN-ACK", "Synchronize-Acknowledgment", "răspunsul serverului în three-way handshake"],
  ["AAAA", "Înregistrare DNS AAAA", "leagă un nume de o adresă IPv6"],
  ["MX", "Mail eXchanger", "înregistrare DNS care arată serverul de e-mail al domeniului"],
  ["CNAME", "Canonical Name", "înregistrare DNS de tip alias (un nume trimite la alt nume)"],
  ["PTR", "Pointer", "înregistrare DNS inversă: adresă IP → nume"],
  ["NS", "Name Server", "înregistrare DNS care arată serverele de nume ale domeniului"],
  ["FE80", "fe80::/10", "prefixul adreselor IPv6 link-local"],
  ["FC00", "fc00::/7", "prefixul adreselor IPv6 unique local (private)"],
  ["FF00", "ff00::/8", "prefixul adreselor IPv6 multicast"],
  ["ICMPv6", "ICMP pentru IPv6", "mesajele de control IPv6 (ping, descoperirea vecinilor)"],
  ["RS", "Router Solicitation", "mesaj ICMPv6: un host cere informații de la router"],
  ["RA", "Router Advertisement", "mesaj ICMPv6: routerul anunță prefixul și gateway-ul"],
  ["ESP", "Encapsulating Security Payload", "protocolul IPsec care criptează datele"],
  ["SSL", "Secure Sockets Layer", "predecesorul TLS, învechit"],
  ["TLS", "Transport Layer Security", "criptarea folosită de HTTPS și alte protocoale"],
  ["MDF", "Main Distribution Frame", "repartitorul principal al clădirii"],
  ["DS0", "Digital Signal 0", "un canal digital de voce de 64 kbit/s"],
  ["TS0", "Time Slot 0", "intervalul 0 din E1, pentru sincronizare"],
  ["TS16", "Time Slot 16", "intervalul 16 din E1, pentru semnalizare"],
  ["EF", "Expedited Forwarding", "clasa QoS (DSCP 46) pentru voce"],
  ["FM", "Frequency Modulation", "modulație de frecvență (ex. radio FM 88–108 MHz)"],
  ["AM", "Amplitude Modulation", "modulație de amplitudine"],
  ["GSM", "Global System for Mobile communications", "rețeaua de telefonie mobilă 2G"],
  ["EHF", "Extremely High Frequency", "banda 30–300 GHz"],
  ["IDU", "InDoor Unit", "unitatea de interior a unui radioreleu"],
  ["ODU", "OutDoor Unit", "unitatea de exterior a radioreleului, montată lângă antenă"],
  ["TNC", "Threaded Neill–Concelman", "conector RF ca BNC, dar cu filet"],
  ["DIN", "Deutsches Institut für Normung", "institutul german de standarde (ex. conectorul 7/16 DIN)"],
  ["SWR", "Standing Wave Ratio", "raportul de undă staționară (VSWR, ROS)"],
  ["NATO", "Organizația Tratatului Atlanticului de Nord", "alianța ale cărei proceduri (ex. alfabetul fonetic) sunt folosite pe radio"],
  ["SMS", "Short Message Service", "mesaj text scurt pe telefonul mobil"],
  ["RTT", "Real-Time Text", "text transmis literă cu literă, în timp real (ex. la 112 pentru persoane cu dizabilități)"],
  ["EDR", "Endpoint Detection and Response", "antivirus avansat care detectează și blochează atacuri pe PC"],
  ["ETSI", "European Telecommunications Standards Institute", "institutul european care a definit TETRA, GSM etc."],
  ["SDS", "Short Data Service", "mesajele scurte de date din TETRA"],
  ["TEA", "TETRA Encryption Algorithm", "algoritmul de criptare a interfeței radio TETRA"],
  ["ISSI", "Individual Short Subscriber Identity", "identificatorul unui terminal TETRA"],
  ["GSSI", "Group Short Subscriber Identity", "identificatorul unui grup de vorbire TETRA"],
  ["ICCID", "Integrated Circuit Card Identifier", "numărul de serie al cartelei SIM"],
  ["PIN", "Personal Identification Number", "codul care protejează cartela SIM"],
  ["PUK", "PIN Unblocking Key", "codul (8 cifre) care deblochează SIM-ul după 3 PIN-uri greșite"],
  ["PL-259", "PL-259", "mufa „UHF” de pe cablul stațiilor HF/VHF"],
  ["SO-239", "SO-239", "soclul (mama) pentru mufa PL-259"],
  ["PE", "Protective Earth", "conductorul de protecție (împământare), galben-verde"],
  ["RMS", "Root Mean Square", "valoarea efectivă a tensiunii alternative (230 V la priză)"],
  ["COM", "Common", "borna comună (neagră) a multimetrului"],
  ["CNP", "Codul Numeric Personal", "numărul unic de identificare al unei persoane"],
  ["TRX", "Transceiver", "emițător și receptor în același aparat"],
  ["VESDA", "Very Early Smoke Detection Apparatus", "sistem de detecție foarte timpurie a fumului (camere de echipamente)"],
  ["EPO", "Emergency Power Off", "butonul de oprire de urgență a alimentării din camera de echipamente"]
);
TERMS.gen.push(
  ["CB", "Citizens Band", "banda cetățenească de 27 MHz, stații radio fără licență (ex. la camioane)"],
  ["HG", "Hotărâre de Guvern", "act normativ emis de Guvernul României"],
  ["LSA", "LSA (Löten-Schrauben-Abisolierfrei)", "sistem de conectare a firelor prin inserție (fără lipire și dezizolare), folosit în repartitoare"],
  ["YTP", "Cablu telefonic YTP", "cablu telefonic de interior cu izolație și manta din PVC"],
  ["SF", "Screened Foiled", "ecran dublu: tresă + folie (ex. SF/UTP)"],
  ["RG-59", "Radio Guide 59", "cablu coaxial subțire de 75 Ω (video, CCTV)"],
  ["RG-213", "Radio Guide 213", "cablu coaxial gros de 50 Ω pentru emisie radio"],
  ["MJ", "Megajoule", "un milion de jouli (1 kWh = 3,6 MJ)"],
  ["AA", "Format AA", "bateria „creion” obișnuită, 1,5 V"]
);
TERMS.baz = [
  ["Switch", "leagă calculatoarele din aceeași rețea locală; stratul 2; trimite cadrele doar spre portul destinatarului, după adresa MAC"],
  ["Tabela MAC a switch-ului", "lista „port ↔ adresă MAC”, învățată din MAC-ul SURSĂ al cadrelor primite; intrările expiră după 300 s (Cisco)"],
  ["Flooding", "destinație MAC necunoscută (sau broadcast) → switch-ul trimite cadrul pe toate porturile, mai puțin pe cel de intrare"],
  ["Adresa MAC", "48 de biți = 6 octeți = 12 cifre hex (00:1A:2B:3C:4D:5E); e a plăcii de rețea, nu se schimbă când muți PC-ul"],
  ["Primii 3 octeți ai MAC-ului", "codul producătorului (OUI); ultimii 3 = numărul plăcii"],
  ["Hub vs. switch", "hub-ul repetă totul pe toate porturile (stratul 1); switch-ul livrează doar destinatarului (stratul 2)"],
  ["Router", "leagă rețele DIFERITE și decide după adresa IP (stratul 3)"],
  ["Adresa IPv4", "4 octeți separați prin puncte = 32 de biți, ex. 192.168.1.10"],
  ["Octet", "8 biți → 256 de valori, de la 0 la 255; peste 255 adresa e invalidă"],
  ["128 64 32 16 8 4 2 1", "valorile biților dintr-un octet; 192 = 11000000, 168 = 10101000, 255 = 11111111"],
  ["Masca 255.255.255.0", "/24 – primii 3 octeți sunt rețeaua, ultimul este host-ul"],
  ["Grupa „capete”", "PC, server, router, imprimantă de rețea (emit pe pinii 1-2)"],
  ["Grupa „centru”", "switch și hub (recepționează pe pinii 1-2)"],
  ["Cablu drept", "grupe diferite: PC–switch, router–switch, server–switch; T568B la ambele capete"],
  ["Cablu crossover", "aceeași grupă: PC–PC, PC–router, router–router, switch–switch, switch–hub; A la un capăt, B la celălalt"],
  ["Cablu rollover", "cablul de consolă (PC → portul Console); pinii inversați complet 1↔8"],
  ["Auto-MDIX", "portul detectează cablul și inversează singur perechile; în practică merge orice cablu, la examen se cere regula clasică"],
  ["Fibră galbenă", "monomod (OS1/OS2), miez ~9 µm, distanțe de kilometri"],
  ["Fibră portocalie", "multimod OM1/OM2, distanțe scurte"],
  ["Fibră aqua", "multimod OM3/OM4 (OM4 și violet); OM5 = verde-lime"],
  ["Conector albastru / verde / bej", "albastru = monomod UPC; verde = monomod APC (8°); bej = multimod"],
  ["Legea lui Ohm", "U = R · I („URI”); I = U / R; R = U / I – doar pentru U se înmulțește"],
  ["Triunghiul lui Ohm", "U sus, I și R jos; acoperi ce cauți: linia orizontală = împarți, alăturate jos = înmulțești"],
  ["Verificare la Ohm", "tensiune mai mare → curent mai mare; rezistență mai mare → curent mai mic; 230 V / 23 Ω = 10 A, nu 5290 A"],
  ["Serie", "un singur drum: același curent; R total = R1 + R2; un element întrerupt oprește tot"],
  ["Paralel", "mai multe drumuri: aceeași tensiune; R total mai mică decât cea mai mică; prizele din casă"],
  ["Ampermetru", "măsoară curentul; se pune în SERIE; rezistență ~0 → în paralel pe sursă face scurtcircuit"],
  ["Voltmetru", "măsoară tensiunea; se pune în PARALEL; rezistență foarte mare"],
  ["Clește ampermetric", "măsoară curentul fără să desfaci circuitul; se pune pe UN SINGUR conductor"]
];
TERMS.gen.push(
  ["WiMAX", "Worldwide Interoperability for Microwave Access", "rețele fără fir de bandă largă, standardul IEEE 802.16"],
  ["MIME", "Multipurpose Internet Mail Extensions", "extensii ale e-mailului pentru atașamente și text non-ASCII (base64)"],
  ["ITU", "International Telecommunication Union", "Uniunea Internațională a Telecomunicațiilor; ITU-T face standardele de telecomunicații"],
  ["IETF", "Internet Engineering Task Force", "grupul care elaborează standardele Internetului, publicate ca RFC"],
  ["ARPANET", "Advanced Research Projects Agency Network", "rețeaua Departamentului Apărării SUA, strămoșul Internetului"],
  ["NSFNET", "National Science Foundation Network", "rețeaua de bază academică a SUA care a urmat ARPANET-ului"],
  ["GEO", "Geostationary Earth Orbit", "orbită geostaționară, ~35 800 km, perioadă 24 h"],
  ["MEO", "Medium Earth Orbit", "orbită medie (ex. sateliții GPS)"],
  ["QPSK", "Quadrature Phase Shift Keying", "modulație cu 4 faze → 2 biți pe simbol"],
  ["QAM", "Quadrature Amplitude Modulation", "modulație de amplitudine și fază; QAM-16 = 4 biți pe simbol"],
  ["SONET", "Synchronous Optical Network", "ierarhia digitală sincronă pe fibră din America (OC-1 = 51,84 Mbps)"],
  ["OC-3", "Optical Carrier 3", "nivel SONET de 155,52 Mbps (echivalent STM-1)"],
  ["STM-1", "Synchronous Transport Module 1", "nivelul de bază SDH, 155,52 Mbps"],
  ["AMPS", "Advanced Mobile Phone System", "telefonie mobilă analogică de generația 1"],
  ["HFC", "Hybrid Fiber Coax", "rețea de cablu TV: fibră până în cartier, coaxial până la abonat"],
  ["HDLC", "High-level Data Link Control", "protocol al legăturii de date orientat pe biți, indicator 01111110"],
  ["PPP", "Point-to-Point Protocol", "protocolul legăturii de date din Internet pe linii punct-la-punct"],
  ["LCP", "Link Control Protocol", "partea PPP care pornește, testează și negociază linia"],
  ["NCP", "Network Control Protocol", "partea PPP care configurează nivelul rețea (ex. adresa IP)"],
  ["ALOHA", "sistemul radio al Universității din Hawaii", "acces multiplu aleator: pur (~18%) sau cuantificat (~37%)"],
  ["MACA", "Multiple Access with Collision Avoidance", "acces radio cu RTS/CTS contra stației ascunse"],
  ["RTS", "Request To Send", "cerere scurtă de transmisie în rețelele fără fir"],
  ["CTS", "Clear To Send", "răspunsul receptorului: „poți transmite”; ceilalți tac"],
  ["LLC", "Logical Link Control", "subnivelul IEEE 802.2 de deasupra MAC"],
  ["DCF", "Distributed Coordination Function", "modul 802.11 fără control central (CSMA/CA)"],
  ["PCF", "Point Coordination Function", "modul 802.11 în care stația de bază interoghează stațiile"],
  ["IS-IS", "Intermediate System to Intermediate System", "protocol de dirijare cu starea legăturilor, rudă cu OSPF"],
  ["RED", "Random Early Detection", "ruterul aruncă unele pachete devreme, ca sursele să încetinească"],
  ["RSVP", "Resource reSerVation Protocol", "rezervarea resurselor pe flux (servicii integrate)"],
  ["MPLS", "MultiProtocol Label Switching", "retransmitere după etichete scurte, nu după adresa IP"],
  ["RARP", "Reverse Address Resolution Protocol", "află IP-ul propriu pornind de la adresa MAC (înlocuit de DHCP)"],
  ["BOOTP", "Bootstrap Protocol", "predecesorul DHCP pentru aflarea adresei IP la pornire"],
  ["TPDU", "Transport Protocol Data Unit", "unitatea de date a nivelului transport (segment la TCP)"],
  ["TSAP", "Transport Service Access Point", "punct de acces la transport; în Internet = portul"],
  ["RPC", "Remote Procedure Call", "apelarea unei proceduri de pe alt calculator ca și cum ar fi locală"],
  ["SOA", "Start Of Authority", "înregistrarea DNS cu datele principale ale zonei"],
  ["URL", "Uniform Resource Locator", "adresa unei resurse Web: protocol, server, cale"],
  ["HTML", "HyperText Markup Language", "limbajul de marcare al paginilor Web"],
  ["MP3", "MPEG-1 Audio Layer 3", "compresie audio perceptuală"],
  ["MPEG", "Moving Picture Experts Group", "standarde de compresie video/audio"],
  ["DES", "Data Encryption Standard", "cifru simetric vechi cu cheie de 56 de biți (slab azi)"],
  ["ECB", "Electronic Code Book", "mod de cifrare bloc cu bloc; blocuri identice → rezultat identic (slab)"],
  ["CBC", "Cipher Block Chaining", "mod de cifrare în care fiecare bloc se combină (XOR) cu cel cifrat anterior"],
  ["RSA", "Rivest–Shamir–Adleman", "algoritm cu cheie publică bazat pe factorizarea numerelor mari"],
  ["MD5", "Message Digest 5", "funcție de rezumat pe 128 de biți (nesigură azi)"],
  ["SHA-1", "Secure Hash Algorithm 1", "funcție de rezumat pe 160 de biți (nesigură azi pentru semnături)"],
  ["PKI", "Public Key Infrastructure", "ierarhie de autorități care emit și revocă certificate"],
  ["AH", "Authentication Header", "antet IPsec pentru integritate și autentificare, fără criptare"],
  ["PGP", "Pretty Good Privacy", "securizarea e-mailului (criptare + semnătură)"],
  ["MDI", "Medium Dependent Interface", "port de „capăt” (PC, router): emite pe pinii 1-2"],
  ["MDI-X", "MDI crossover", "port de switch/hub: recepționează pe pinii 1-2"],
  ["CAM", "Content Addressable Memory", "memoria rapidă în care switch-ul ține tabela MAC"],
  ["LISTEN / CONNECT / SEND / RECEIVE / DISCONNECT", "primitivele unui serviciu orientat pe conexiune: aștept, mă conectez, trimit, primesc, închid"],
  ["SOCKET / BIND / ACCEPT / CLOSE", "primitive de socluri Berkeley: creez soclul, îi dau adresă/port, preiau o conexiune, închid"],
  ["SYN / FIN / RST / PSH / URG", "indicatori TCP: deschidere, închidere normală, resetare, „livrează imediat”, date urgente"],
  ["GET / POST / HEAD", "metode HTTP: cere o resursă / trimite date (formular) / cere doar antetul"],
  ["HELLO / ECHO", "pachete OSPF/starea legăturilor: HELLO descoperă vecinii, ECHO măsoară întârzierea"]
);
TERMS.tan = [
  ["Rețea de calculatoare", "calculatoare autonome interconectate care schimbă informații (cap. 1)"],
  ["Difuzare vs. punct-la-punct", "un canal comun pe care toți aud tot vs. legături între perechi, cu noduri intermediare (cap. 1.2)"],
  ["Memorează-și-retransmite", "ruterul primește tot pachetul, îl păstrează, apoi îl trimite mai departe (cap. 1.2.3)"],
  ["Protocol vs. interfață", "protocol = reguli între niveluri pereche pe mașini diferite; interfață = între niveluri vecine pe aceeași mașină (cap. 1.3)"],
  ["Orientat pe conexiune vs. fără conexiune", "ca telefonul (stabilire–folosire–eliberare) vs. ca poșta (datagramă) (cap. 1.3.3)"],
  ["Modelul OSI", "7 niveluri: fizic, legătură de date, rețea, transport, sesiune, prezentare, aplicație (cap. 1.4.1)"],
  ["Modelul TCP/IP (Tanenbaum)", "4 niveluri: gazdă-rețea, internet, transport, aplicație (cap. 1.4.2)"],
  ["Modelul hibrid al cărții", "5 niveluri: fizic, legătură de date, rețea, transport, aplicație (cap. 1.4)"],
  ["Nyquist", "debit max. fără zgomot = 2·H·log₂V; 3 kHz binar → 6 kbps (cap. 2.1.3)"],
  ["Shannon", "debit max. cu zgomot = H·log₂(1+S/N); 3 kHz, 30 dB → ~30 kbps (cap. 2.1.3)"],
  ["Reflexia totală internă", "principiul fibrei optice: lumina rămâne în miez (cap. 2.2.4)"],
  ["Satelit geostaționar", "~35 800 km, 24 h, întârziere 250–300 ms (cap. 2.4.1)"],
  ["Baud vs. bps", "baud = simboluri/s; QPSK 2 biți/simbol, QAM-16 4 biți/simbol (cap. 2.5.3)"],
  ["FDM / TDM / WDM", "împărțire pe frecvență / pe timp / pe lungimi de undă (cap. 2.5.4)"],
  ["T1 / E1", "1,544 Mbps cu 24 canale / 2,048 Mbps cu 32 intervale (cap. 2.5.4)"],
  ["Comutare de circuite vs. pachete", "cale rezervată dinainte vs. pachete fără rezervare, bandă folosită eficient (cap. 2.5.5)"],
  ["Inserare de biți", "după cinci biți 1 se inserează un 0; indicator 01111110 (cap. 3.1.2)"],
  ["Distanța Hamming", "biți diferiți; detectezi d erori cu d+1, corectezi d cu 2d+1 (cap. 3.2)"],
  ["CRC", "cod detector bazat pe împărțire polinomială (cap. 3.2.2)"],
  ["Go Back N vs. repetare selectivă", "la pierdere: retransmiți tot de la cel pierdut vs. doar cadrul pierdut (cap. 3.4)"],
  ["Atașare (piggybacking)", "confirmarea merge în cadrul de date de întoarcere (cap. 3.4)"],
  ["ALOHA pur / cuantificat", "eficiență maximă ~18% / ~37% (cap. 4.2.1)"],
  ["CSMA/CD", "asculți înainte, oprești imediat la coliziune – Ethernet clasic (cap. 4.2.2)"],
  ["Stația ascunsă", "doi emițători nu se aud, dar se ciocnesc la receptor; soluție RTS/CTS (cap. 4.2.6)"],
  ["Cadrul Ethernet", "adrese de 6 octeți; minim 64 octeți; date max. 1500 octeți (cap. 4.3.3)"],
  ["Regresie exponențială binară", "după i coliziuni aștepți 0…2ⁱ−1 cuante de 51,2 µs; max. 1023; eșec după 16 (cap. 4.3.4)"],
  ["CSMA/CA", "802.11 evită coliziunile pentru că nu le poate detecta în radio (cap. 4.4.3)"],
  ["Piconet Bluetooth", "1 master + max. 7 slave active, 2,4 GHz (cap. 4.6)"],
  ["Arbore de acoperire", "punțile dezactivează legăturile care ar forma bucle (cap. 4.7.3)"],
  ["Principiul optimalității", "drumurile optime spre o destinație formează un arbore de scufundare (cap. 5.2.1)"],
  ["Vectori distanță vs. starea legăturilor", "schimbi tabela cu vecinii (count-to-infinity) vs. toată harta + Dijkstra (OSPF) (cap. 5.2.4–5.2.5)"],
  ["Găleata găurită vs. cu jetoane", "ieșire constantă vs. permite rafale (cap. 5.4.2)"],
  ["TTL", "scade la fiecare ruter; la 0 pachetul e aruncat (cap. 5.6.1)"],
  ["Antet IPv4 / IPv6", "20 octeți (fără opțiuni) / 40 octeți fix (cap. 5.6)"],
  ["Clasele IPv4", "A 1–126, B 128–191, C 192–223, D 224–239 multicast (cap. 5.6.2)"],
  ["OSPF vs. BGP", "dirijare interioară (starea legăturilor) vs. între sisteme autonome (cap. 5.6.4–5.6.5)"],
  ["Socluri Berkeley", "server: SOCKET, BIND, LISTEN, ACCEPT; client: SOCKET, CONNECT (cap. 6.1.3)"],
  ["Problema celor două armate", "eliberarea unei conexiuni nu poate fi garantată perfect pe un canal nesigur (cap. 6.2.3)"],
  ["Antet UDP / TCP", "8 octeți / 20 octeți (cap. 6.4–6.5)"],
  ["Start lent", "fereastra de congestie se dublează până la prag, apoi crește liniar (cap. 6.5.9)"],
  ["Algoritmul lui Nagle", "adună octeții mici până vine confirmarea (cap. 6.5.8)"],
  ["Înregistrări DNS", "A (IPv4), MX (e-mail), NS, CNAME (alias), PTR, SOA (cap. 7.1.2)"],
  ["SMTP / POP3 / IMAP", "25 trimitere între servere / 110 descărcare / 143 lucru pe server (cap. 7.2)"],
  ["Principiul lui Kerckhoff", "algoritmul poate fi public, cheia trebuie să fie secretă (cap. 8.1.1)"],
  ["Simetric vs. cheie publică", "aceeași cheie (DES, AES) vs. pereche publică/privată (RSA) (cap. 8.2–8.3)"],
  ["Semnătura digitală", "autentificare + integritate + nerepudiere (cap. 8.4)"],
  ["Firewall / VPN", "filtrează traficul la granița rețelei / rețea privată prin tunele criptate peste Internet (cap. 8.6)"]
];

/* Acronime din capitolul Munteanu */
TERMS.gen.push(
  ["FDDI", "Fiber Distributed Data Interface", "rețea veche de 100 Mbps pe fibră, cu inel dublu și jeton"],
  ["MIB", "Management Information Base", "baza de variabile pe care un agent SNMP le poate raporta"],
  ["URN", "Uniform Resource Name", "nume persistent al unei resurse, independent de locul unde se află"],
  ["NVP", "Nominal Velocity of Propagation", "viteza semnalului în cablu, ca fracțiune din viteza luminii"],
  ["ISL", "Inter-Switch Link", "etichetare VLAN pe trunk, proprietară Cisco, înlocuită de 802.1Q"],
  ["DTE", "Data Terminal Equipment", "echipamentul terminal al unei legături seriale (ex. routerul spre modem)"],
  ["DCE", "Data Communications Equipment", "capătul care dă tactul pe o legătură serială (pe el se pune clock rate)"],
  ["SPF", "Shortest Path First", "algoritmul Dijkstra folosit de OSPF pentru calculul celor mai scurte căi"],
  ["IGRP", "Interior Gateway Routing Protocol", "protocol Cisco distance-vector vechi (actualizări la 90 s), înlocuit de EIGRP"],
  ["RIPv2", "Routing Information Protocol versiunea 2", "RIP classless: trimite masca, folosește multicast"],
  ["DoS", "Denial of Service", "atac care blochează un serviciu prin supraîncărcare (ex. SYN flood)"],
  ["SOCKS", "Socket Secure", "proxy la nivel de circuit: retransmite conexiunile fără să le inspecteze"],
  ["PDC", "Primary Domain Controller", "controlerul principal de domeniu în Windows NT 4.0"],
  ["BDC", "Backup Domain Controller", "controler de rezervă în Windows NT 4.0 (copie a PDC)"],
  ["IDF", "Intermediate Distribution Facility", "nod de distribuție de etaj, legat de MDF prin backbone"],
  ["NEXT", "Near-End Crosstalk", "diafonia măsurată la capătul apropiat al cablului"],
  ["CDP", "Cisco Discovery Protocol", "descoperă vecinii Cisco conectați direct (anunțuri la 60 s, păstrare 180 s)"],
  ["VTY", "Virtual Teletype", "liniile virtuale prin care te conectezi la router prin Telnet/SSH (line vty 0 4)"],
  ["NVRAM", "Non-Volatile RAM", "memoria routerului care păstrează startup-config la oprire"]
);
TERMS.mun = [
  ["Topologie stea / magistrală / inel", "forma în care sunt legate stațiile; azi aproape numai stea (cap. 1)"],
  ["Încapsulare", "fiecare nivel adaugă propriul antet la coborâre și îl scoate la urcare (cap. 2)"],
  ["CSMA/CD", "ascultă canalul, transmite, detectează coliziunea, jam + backoff exponențial (cap. 3)"],
  ["Regula 5-4-3", "10 Mbps: max. 5 segmente, 4 repetoare, 3 segmente cu stații (cap. 3)"],
  ["Domeniu de coliziune / de broadcast", "switch-ul separă coliziunile, routerul separă broadcast-ul (cap. 3)"],
  ["Gazde pe subrețea", "2^h − 2 (fără adresa de rețea și broadcast) (cap. 4)"],
  ["Număr de subrețele", "2^n azi; 2^n − 2 după regula veche din carte (cap. 4)"],
  ["Supernetting", "unirea mai multor rețele într-un prefix mai scurt (cap. 4)"],
  ["3-way handshake", "SYN → SYN-ACK → ACK (cap. 5)"],
  ["Proxy ARP", "routerul răspunde la ARP în locul unei gazde din altă rețea (cap. 5)"],
  ["Zona in-addr.arpa", "zona DNS pentru căutarea inversă IP → nume (înregistrări PTR) (cap. 7)"],
  ["Trap SNMP", "alertă trimisă spontan de agent către stația de management (cap. 7)"],
  ["FTP 20/21", "21 = control, 20 = date (cap. 7)"],
  ["6 subsisteme TIA/EIA-568", "orizontal, backbone, zona de lucru, camera de telecom., camera echipamentelor, facilități de intrare (cap. 8)"],
  ["90 + 10 m", "cablu orizontal permanent + cabluri de conectare (cap. 8)"],
  ["T568B", "alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro (cap. 8)"],
  ["Pinii 1-2-3-6", "folosiți de 10/100 Mbps; gigabitul folosește toți 8 (cap. 8)"],
  ["Buget de întârziere", "max. 512 durate de bit dus-întors într-un domeniu de coliziune (cap. 8)"],
  ["Store-and-forward / fast-forward / fragment-free", "tot cadrul + CRC / după MAC destinație / după 64 de octeți (cap. 9)"],
  ["Stări STP", "blocking → listening → learning → forwarding (cap. 9)"],
  ["VLAN pe port", "cel mai folosit tip de apartenență (cap. 10)"],
  ["Moduri VTP", "server (creează), client (primește), transparent (local + retransmite) (cap. 10)"],
  ["Memorii router", "ROM (POST, bootstrap), Flash (IOS), NVRAM (startup-config), RAM (running-config) (cap. 11)"],
  ["copy running-config startup-config", "salvează configurația curentă în NVRAM (cap. 11)"],
  ["no shutdown", "pornește o interfață de router (oprită implicit) (cap. 11)"],
  ["RIP 15/16", "max. 15 salturi; 16 = inaccesibil; actualizări la 30 s (cap. 11)"],
  ["Split horizon", "nu anunți o rută înapoi pe interfața de unde ai învățat-o (cap. 11)"],
  ["ACL standard / extinsă", "1–99 doar sursa, lângă destinație / 100–199 sursă+destinație+port, lângă sursă (cap. 11)"],
  ["Deny implicit", "la finalul oricărei ACL; ce nu e permis explicit e blocat (cap. 11)"],
  ["Wildcard", "inversul măștii: /24 → 0.0.0.255 (cap. 11)"],
  ["Core / distribuție / acces", "modelul ierarhic Cisco pe 3 niveluri (cap. 12)"],
  ["SYN flood / Smurf / Teardrop / Ping of Death", "atacuri DoS clasice (cap. 12)"],
  ["NAT static / dinamic / PAT", "1-la-1 fix / din grup / multe pe o adresă, cu porturi (cap. 12)"],
  ["IPsec tunel vs. transport", "tot pachetul criptat vs. doar datele (cap. 12)"],
  ["⚠ Azi: SSL → TLS; Legea 161/2003 → Cod penal art. 360–366", "variantele actuale ale noțiunilor vechi din carte (cap. 12)"],
  ["Partajare ascunsă $", "un nume de partajare terminat cu $ nu apare la răsfoire (cap. 13)"]
];

/* Acronime de telecomunicații (capitolul Rădulescu) */
TERMS.gen.push(
  ["DPCM", "Differential Pulse Code Modulation", "PCM diferențial: transmite diferența față de o valoare prezisă"],
  ["ADPCM", "Adaptive Differential PCM", "DPCM cu pas adaptiv; G.726 la 32 kbit/s"],
  ["DMT", "Discrete MultiTone", "modulație cu multe subpurtătoare înguste, folosită de ADSL"],
  ["PSTN", "Public Switched Telephone Network", "rețeaua telefonică publică cu comutație de circuite"],
  ["BRI", "Basic Rate Interface", "acces ISDN de bază: 2B + D = 144 kbit/s"],
  ["PRI", "Primary Rate Interface", "acces ISDN primar: 30B + D pe E1 (Europa)"],
  ["PLMN", "Public Land Mobile Network", "rețea publică de telefonie mobilă (ex. un operator GSM)"],
  ["X.25", "recomandarea ITU-T X.25", "rețea publică de date cu comutație de pachete și corecție la fiecare nod"],
  ["ATM", "Asynchronous Transfer Mode", "mod de transfer cu celule fixe de 53 de octeți (5 antet + 48 date)"],
  ["T1", "flux primar nord-american", "1,544 Mbit/s, 24 de canale de 64 kbit/s"],
  ["SPC", "Stored Program Control", "comanda centralei prin programe pe calculatoare"],
  ["CAS", "Channel Associated Signalling", "semnalizare asociată fiecărui circuit (ex. R2 pe TS16)"],
  ["CCS", "Common Channel Signalling", "semnalizare pe canal comun, separată de voce (ex. SS7)"],
  ["SSP", "Service Switching Point", "centrala din rețeaua SS7/IN care declanșează serviciile"],
  ["SCP", "Service Control Point", "nodul cu logica și bazele de date ale serviciilor IN"],
  ["ISUP", "ISDN User Part", "partea SS7 care stabilește și eliberează convorbirile între centrale"],
  ["TCAP", "Transaction Capabilities Application Part", "partea SS7 pentru tranzacții cu baze de date (ex. HLR, IN)"],
  ["SCCP", "Signalling Connection Control Part", "partea SS7 care extinde adresarea MTP (ex. după titlul global)"],
  ["INAP", "Intelligent Network Application Part", "protocolul dintre SSP și SCP în rețeaua inteligentă"],
  ["IAM", "Initial Address Message", "primul mesaj ISUP: cererea de stabilire a unui apel"],
  ["BSS", "Base Station Subsystem", "subsistemul radio GSM: BTS + BSC"],
  ["BTS", "Base Transceiver Station", "stația de bază GSM (emițătoare-receptoare + antene)"],
  ["BSC", "Base Station Controller", "controlerul care conduce mai multe BTS-uri"],
  ["MSC", "Mobile Switching Centre", "centrala de comutație a rețelei mobile"],
  ["HLR", "Home Location Register", "registrul permanent al abonaților operatorului"],
  ["VLR", "Visitor Location Register", "registrul temporar al abonaților aflați în zona unui MSC"],
  ["AuC", "Authentication Centre", "centrul care păstrează cheile de autentificare ale SIM-urilor"],
  ["EIR", "Equipment Identity Register", "registrul identităților terminalelor (IMEI), ex. telefoane furate"],
  ["GPRS", "General Packet Radio Service", "date cu comutație de pachete peste GSM"],
  ["SGSN", "Serving GPRS Support Node", "nodul GPRS care deservește terminalele dintr-o zonă"],
  ["GGSN", "Gateway GPRS Support Node", "poarta GPRS spre Internet și alte rețele de pachete"],
  ["UMTS", "Universal Mobile Telecommunications System", "sistemul mobil 3G, cu W-CDMA pe purtătoare de 5 MHz"],
  ["RNC", "Radio Network Controller", "controlerul stațiilor Node B în UMTS"],
  ["PAD", "Packet Assembler/Disassembler", "asamblează/dezasamblează pachete X.25 pentru terminale simple"],
  ["LAPB", "Link Access Procedure Balanced", "protocolul de legătură de date al X.25"],
  ["DLCI", "Data Link Connection Identifier", "identificatorul circuitului virtual Frame Relay (local)"],
  ["CIR", "Committed Information Rate", "debitul garantat al unui circuit Frame Relay"],
  ["FECN", "Forward Explicit Congestion Notification", "bit Frame Relay: congestie în sensul cadrului"],
  ["BECN", "Backward Explicit Congestion Notification", "bit Frame Relay: congestie în sens invers"],
  ["VPI", "Virtual Path Identifier", "identificatorul căii virtuale ATM"],
  ["VCI", "Virtual Channel Identifier", "identificatorul canalului virtual ATM"],
  ["HEC", "Header Error Control", "octetul care protejează antetul celulei ATM"],
  ["AAL", "ATM Adaptation Layer", "nivelul care adaptează datele aplicațiilor în celule ATM"],
  ["CBR", "Constant Bit Rate", "clasă ATM cu debit constant (voce, emulare de circuit)"],
  ["VBR", "Variable Bit Rate", "clasă ATM cu debit variabil (rt-VBR / nrt-VBR)"],
  ["ABR", "Available Bit Rate", "clasă ATM care folosește banda disponibilă, cu control de flux"],
  ["UBR", "Unspecified Bit Rate", "clasă ATM fără garanții (best effort)"],
  ["HDB3", "High Density Bipolar 3", "cod de linie pentru E1–E3; înlocuiește șirurile de 4 zerouri"],
  ["CMI", "Coded Mark Inversion", "cod de linie folosit tipic la E4 (139,264 Mbit/s)"],
  ["ADM", "Add-Drop Multiplexer", "multiplexor SDH care extrage/inserează fluxuri fără demultiplexare completă"],
  ["DXC", "Digital Cross-Connect", "repartitor digital care interconectează fluxuri în rețeaua de transport"],
  ["APD", "Avalanche Photodiode", "fotodiodă cu avalanșă, receptor optic sensibil"],
  ["HDSL", "High bit-rate Digital Subscriber Line", "DSL simetric, folosit pentru E1 pe cupru"],
  ["SDSL", "Symmetric DSL", "DSL cu același debit în ambele sensuri"],
  ["VDSL", "Very high bit-rate DSL", "DSL foarte rapid pe distanțe scurte de cupru"],
  ["DOCSIS", "Data Over Cable Service Interface Specification", "standardul modemurilor de Internet pe cablu TV"],
  ["CMTS", "Cable Modem Termination System", "echipamentul operatorului de cablu la care se leagă modemurile"],
  ["WLL", "Wireless Local Loop", "bucla locală radio – abonat fix legat prin radio"],
  ["H.323", "recomandarea ITU-T H.323", "familie de protocoale pentru comunicații multimedia (VoIP) pe IP"],
  ["NT1", "Network Termination 1", "terminația de rețea ISDN: interfața U → S/T"],
  ["TE1", "Terminal Equipment 1", "terminal ISDN nativ"],
  ["TE2", "Terminal Equipment 2", "terminal ne-ISDN, conectat printr-un adaptor TA"],
  ["DSS1", "Digital Subscriber Signalling System No. 1", "semnalizarea ISDN utilizator–rețea (Q.931) pe canalul D"],
  ["BORSCHT", "Battery, Overvoltage, Ringing, Supervision, Coding, Hybrid, Testing", "funcțiile interfeței de abonat analogic din centrală"],
  ["TSI", "Time Slot Interchange", "comutator temporal: mută conținutul între intervale de timp"],
  ["W-CDMA", "Wideband CDMA", "accesul radio UMTS (3G), purtătoare de 5 MHz"],
  ["B-ISDN", "Broadband ISDN", "ISDN de bandă largă, bazat pe ATM"],
  ["N-ISDN", "Narrowband ISDN", "ISDN de bandă îngustă (BRI/PRI, până la 2 Mbit/s)"],
  ["R2", "sistemul de semnalizare MFC R2", "semnalizare multifrecvență asociată canalului, între centrale"],
  ["G.711", "codec ITU-T G.711", "PCM 64 kbit/s, legea A / legea µ"],
  ["G.729", "codec ITU-T G.729", "voce comprimată la 8 kbit/s"],
  ["SVC", "Switched Virtual Circuit", "circuit virtual stabilit la cerere (X.25, Frame Relay, ATM)"],
  ["DCS", "Digital Cellular System 1800", "varianta GSM în banda de 1800 MHz"]
);
TERMS.rad = [
  ["PCM", "eșantionare 8 kHz → cuantizare 256 niveluri → codare 8 biți = 64 kbit/s (cap. 2.3)"],
  ["Cadru PCM", "125 µs (1/8000 s) (cap. 2.3)"],
  ["E1", "32 intervale × 64 kbit/s = 2,048 Mbit/s; TS0 sincronizare, TS16 semnalizare, 30 voce (cap. 2.3)"],
  ["T1", "24 canale, 1,544 Mbit/s, cadru de 193 biți (cap. 2.3)"],
  ["Legea A / legea µ", "compandare: Europa / SUA–Japonia (cap. 2.3)"],
  ["DPCM / ADPCM", "diferența față de predicție; ADPCM G.726 = 32 kbit/s (cap. 2.4)"],
  ["QAM", "amplitudine + fază; 16 → 4 biți, 64 → 6, 256 → 8 biți/simbol (cap. 2.5)"],
  ["DMT (ADSL)", "256 subcanale de 4,3125 kHz până la ~1,1 MHz (cap. 2.6)"],
  ["STM vs. ATM (mod de transfer)", "intervale fixe rezervate vs. celule trimise după nevoie (cap. 2.7)"],
  ["Bucla locală", "perechea de cupru abonat–centrală; −48 V c.c. (cap. 6)"],
  ["DTMF", "două tonuri pe tastă (ex. 1 = 697 + 1209 Hz) (cap. 6)"],
  ["Comutator T / S", "temporal: schimbă intervalul / spațial: schimbă magistrala (cap. 5)"],
  ["BORSCHT", "alimentare, protecție, sonerie, supraveghere, codare, hibrid, testare (cap. 5)"],
  ["CAS / CCS", "semnalizare asociată canalului (R2) / pe canal comun (SS7) (cap. 5)"],
  ["ISDN BRI", "2B + D = 2×64 + 16 = 144 kbit/s (192 kbit/s pe S/T) (cap. 7)"],
  ["ISDN PRI", "30B + D (D = 64 kbit/s) pe E1; SUA: 23B + D pe T1 (cap. 7)"],
  ["Puncte ISDN", "R – S – T – U; NT1 = U (2 fire) → S/T (4 fire) (cap. 7)"],
  ["SS7", "rețea separată de semnalizare: SSP, STP, SCP; MTP, ISUP, SCCP, TCAP; 64 kbit/s (cap. 8)"],
  ["Rețea inteligentă", "logica serviciilor în SCP; 0800, 0900, portabilitate, preplătit (cap. 9)"],
  ["GSM", "BTS + BSC = BSS; MSC, HLR, VLR, AuC, EIR; 200 kHz, 8 intervale TDMA (cap. 10)"],
  ["GSM 900", "890–915 MHz urcare / 935–960 MHz coborâre, duplex 45 MHz (cap. 10)"],
  ["GPRS / UMTS", "pachete (SGSN, GGSN) / 3G W-CDMA 5 MHz (cap. 10)"],
  ["Celula ATM", "53 octeți = 5 antet + 48 date; VPI/VCI; HEC (cap. 11)"],
  ["Clase ATM", "CBR, rt-VBR, nrt-VBR, ABR, UBR; AAL1 voce, AAL5 date (cap. 11)"],
  ["X.25", "pachete, circuite virtuale, corecție la fiecare nod, PAD, X.75 (cap. 12)"],
  ["Frame Relay", "nivel 2, DLCI, CIR, DE, FECN/BECN; aruncă cadrele eronate (cap. 13)"],
  ["PDH Europa", "E1 2,048 · E2 8,448 · E3 34,368 · E4 139,264 Mbit/s (cap. 4.1)"],
  ["Canale PDH", "E1 30 · E2 120 · E3 480 · E4 1920 (cap. 4.1)"],
  ["SDH", "STM-1 155,52 · STM-4 622,08 · STM-16 ≈ 2,5 G · STM-64 ≈ 10 Gbit/s (cap. 4.2)"],
  ["Cadru STM-1", "9 × 270 octeți în 125 µs; 63 × E1 sau 1 × E4 (cap. 4.2)"],
  ["ADM / inel SDH", "extrage/inserează fluxuri; protecție < 50 ms (cap. 4.2)"],
  ["xDSL", "ADSL asimetric, HDSL/SDSL simetric, VDSL rapid pe distanțe scurte (cap. 15)"],
  ["FTTH / PON / HFC", "fibră până în casă / fibră cu splittere pasive / fibră + coaxial (cap. 15)"],
  ["VoIP", "SIP sau H.323; voce pe RTP/UDP; G.711 = 64 kbit/s, G.729 = 8 kbit/s (cap. 14)"]
];

/* Acronime din capitolul Norton */
TERMS.gen.push(
  ["IEC", "International Electrotechnical Commission", "organismul internațional pentru standarde electrice și electronice"],
  ["JTC1", "Joint Technical Committee 1", "comitetul tehnic comun ISO/IEC pentru tehnologia informației"],
  ["ANSI", "American National Standards Institute", "organismul american de standardizare; reprezintă SUA în ISO"],
  ["IAB", "Internet Architecture Board", "coordonează dezvoltarea Internetului; sub el lucrează IETF și IRTF"],
  ["ASCII", "American Standard Code for Information Interchange", "codificarea standard a caracterelor pe 7 biți"],
  ["EBCDIC", "Extended Binary Coded Decimal Interchange Code", "codificarea caracterelor pe 8 biți folosită de mainframe-urile IBM"],
  ["NIC", "Network Interface Card", "placa de rețea"],
  ["SNAP", "Subnetwork Access Protocol", "extensie a antetului 802.2 LLC: OUI (3 octeți) + Tip (2 octeți)"],
  ["ULA", "Unique Local Address", "adrese IPv6 private, FC00::/7"],
  ["NetBEUI", "NetBIOS Extended User Interface", "protocol Microsoft vechi, rapid dar nerutabil"],
  ["IPX", "Internetwork Packet Exchange", "protocolul de nivel 3 al Novell NetWare (adrese de 80 de biți)"],
  ["MSAU", "Multistation Access Unit", "concentratorul Token Ring: fizic stea, logic inel"],
  ["NetBIOS", "Network Basic Input/Output System", "interfață și sistem de nume Microsoft vechi (nume de 16 caractere)"],
  ["UNI", "User-Network Interface", "interfața utilizator–rețea (ATM, Frame Relay)"],
  ["NNI", "Network-Network Interface", "interfața dintre două noduri ale rețelei (ATM, Frame Relay)"],
  ["LANE", "LAN Emulation", "emularea Ethernet/Token Ring peste ATM"],
  ["DS-0", "Digital Signal level 0", "canalul elementar de 64 kbps"],
  ["ESF", "Extended Superframe", "supercadru T-1 de 24 de cadre, cu CRC și canal de gestiune"],
  ["AMI", "Alternate Mark Inversion", "cod de linie bipolar: fiecare „1” alternează polaritatea"],
  ["B8ZS", "Bipolar 8-Zero Substitution", "înlocuirea a 8 zerouri pe T-1, pentru sincronizare"],
  ["OC-12", "Optical Carrier 12", "nivel SONET de 622,08 Mbps"],
  ["OC-48", "Optical Carrier 48", "nivel SONET de 2,488 Gbps"],
  ["OC-192", "Optical Carrier 192", "nivel SONET de ≈ 10 Gbps"],
  ["CSU", "Channel Service Unit", "terminația liniei digitale închiriate (împreună cu DSU)"],
  ["DSU", "Data Service Unit", "adaptează semnalul liniei digitale pentru router"],
  ["CPE", "Customer Premises Equipment", "echipamentul din sediul clientului"],
  ["DTR", "Data Terminal Ready", "semnal RS-232: terminalul este pregătit (pinul 20 pe DB-25)"],
  ["RS-422", "standard EIA de interfață serială echilibrată", "până la ~1200 m la viteze mici"],
  ["SLIP", "Serial Line Internet Protocol", "protocol vechi de legătură serială: doar IP, fără verificarea erorilor"],
  ["PAP", "Password Authentication Protocol", "autentificare PPP cu parola trimisă în clar"],
  ["CHAP", "Challenge Handshake Authentication Protocol", "autentificare PPP prin provocare-răspuns, fără parola în clar"],
  ["RAS", "Remote Access Service", "serviciul Windows de acces la distanță (dial-up/VPN)"],
  ["PPTP", "Point-to-Point Tunneling Protocol", "protocol VPN vechi, azi considerat nesigur"],
  ["AGLP", "Accounts → Global → Local → Permissions", "strategia de acordare a drepturilor în domeniile Windows"],
  ["DIB", "Directory Information Base", "baza de informații a unui director X.500"],
  ["DIT", "Directory Information Tree", "arborele de informații al directorului X.500"],
  ["DSA", "Directory System Agent", "serverul de director X.500"],
  ["DUA", "Directory User Agent", "clientul de director X.500"],
  ["DAP", "Directory Access Protocol", "protocolul de acces X.500 (LDAP este varianta „ușoară”)"],
  ["RDN", "Relative Distinguished Name", "numele relativ al unui obiect în director"],
  ["LDAP", "Lightweight Directory Access Protocol", "protocol de interogare a directoarelor, TCP 389"],
  ["LDAPS", "LDAP over SSL/TLS", "LDAP criptat, portul 636"],
  ["WINS", "Windows Internet Name Service", "rezolvă nume NetBIOS în adrese IP"],
  ["KDC", "Key Distribution Center", "serverul Kerberos care păstrează cheile și emite tichete"],
  ["NTLM", "NT LAN Manager", "autentificare Microsoft veche, înlocuită de Kerberos"],
  ["ADJUST", "Assess, Discover, Justify, Unit test, Study, Transcribe", "metoda de depanare în 6 pași din manualul Norton"],
  ["TDR", "Time Domain Reflectometer", "aparat care localizează defectul și distanța până la el pe un cablu"],
  ["IRQ", "Interrupt Request", "linie de întrerupere hardware (0–15 pe PC-urile vechi)"]
);
TERMS.nor = [
  ["Modelul OSI", "7 Aplicație, 6 Prezentare, 5 Sesiune, 4 Transport, 3 Rețea, 2 Legătură de date, 1 Fizic (cap. 1)"],
  ["Organisme", "ISO (OSI), IEC (electric), ANSI (SUA), IEEE 802 (LAN), IAB → IETF (RFC) (cap. 1)"],
  ["Baud vs. bps", "baud = schimbări de stare/s; bps = baud × biți pe stare (cap. 2)"],
  ["Cat 3 / Cat 5", "16 MHz / 100 MHz (cap. 2)"],
  ["Coaxial", "10Base2 RG-58 50 Ω 185 m; 10Base5 500 m (cap. 2)"],
  ["Cadru Ethernet", "64–1518 octeți (date 46–1500); IFG 96 biți; slot 512 biți = 51,2 µs (cap. 3)"],
  ["LLC / MAC", "subnivelurile nivelului 2 (802.2 / 802.3) (cap. 3)"],
  ["Gazde pe clasă", "A 16 777 214 · B 65 534 · C 254 (cap. 4)"],
  ["IPv4 max.", "65 535 octeți; 576 = minimul acceptat de orice gazdă (cap. 4)"],
  ["IPv6", "128 biți; FE80::/10 link-local; anycast; ::FFFF:a.b.c.d (cap. 4)"],
  ["Ethernet 10 Mbps", "max. 1024 de stații; 10Base-FL 2 km (cap. 6)"],
  ["Codări", "4B/5B (100BaseX, FDDI, 125 Mbaud); 8B6T (T4); 8B/10B (Gigabit, 1,25 Gbaud) (cap. 6)"],
  ["Gigabit", "1000 Mbps; SX 550 m (50 µm); LX ~5 km SM; CX 25 m; T 100 m pe 4 perechi (cap. 6)"],
  ["Token Ring", "4/16 Mbps, 260 de stații, MSAU (cap. 7)"],
  ["FDDI", "100 Mbps, inel dublu, 500 de stații, < 200 km, cadru 4500 B (cap. 8)"],
  ["ATM", "53 = 5 + 48; VPI 8 (UNI) / 12 (NNI); VCI 16; LANE (cap. 9)"],
  ["T-1 / E-1 / T-3", "1,544 (24 ch) / 2,048 (30 ch) / 44,736 Mbps (28 × T-1) (cap. 11)"],
  ["SONET", "OC-1 51,84 · OC-3 155,52 · OC-12 622,08 · OC-48 2,488 G · OC-192 ≈ 10 G (cap. 11)"],
  ["Plasă completă", "n(n−1)/2 legături (cap. 10)"],
  ["Modemuri V", "V.32 9600 · V.32 bis 14 400 · V.34 33 600 · V.90 56K · V.42 erori · V.42 bis compresie (cap. 12)"],
  ["RS-232", "~15 m, 19,2 kbps, DTR pin 20 (cap. 12)"],
  ["SLIP vs. PPP", "doar IP, fără erori vs. LCP + NCP, PAP/CHAP (cap. 13)"],
  ["Backup", "complet / copie / diferențial (complet + ultimul) / incremental (complet + toate) (cap. 17)"],
  ["RAID", "0 striping · 1 oglindire · 5 paritate distribuită (cap. 17)"],
  ["UPS", "offline = comută la cădere; online = permanent prin invertor (cap. 17)"],
  ["LDAP", "TCP 389 (LDAPS 636) (cap. 18)"],
  ["Kerberos", "KDC, tichete, tărâmuri; V5 în Windows 2000 (cap. 18)"],
  ["ADJUST", "Assess, Discover, Justify, Unit test, Study, Transcribe (cap. 19)"]
];
/* hardware PC – acronime */
TERMS.gen.push(
  ["VRM", "Voltage Regulator Module", "Fazele de alimentare de lângă socket: coboară 12 V la tensiunea procesorului."],
  ["TDP", "Thermal Design Power", "Căldura (W) pe care trebuie s-o evacueze coolerul procesorului."],
  ["SMT", "Simultaneous Multithreading", "Două fire de execuție pe un nucleu (la Intel: Hyper-Threading)."],
  ["XMP", "Extreme Memory Profile", "Profil Intel care setează automat viteza de pe eticheta memoriei RAM."],
  ["EXPO", "Extended Profiles for Overclocking", "Echivalentul AMD al XMP pentru memoria DDR5."],
  ["EPS", "Entry-Level Power Supply (conector 12 V)", "Conectorul 4+4/8 pini care alimentează procesorul."],
  ["TPM", "Trusted Platform Module", "Cip de securitate pentru chei (BitLocker) și pornire verificată; Windows 11 cere TPM 2.0."],
  ["JEDEC", "Joint Electron Device Engineering Council", "Organismul care standardizează memoriile DDR (vitezele „sigure” implicite)."],
  ["AGP", "Accelerated Graphics Port", "Slot vechi dedicat plăcii video, înlocuit de PCIe x16."],
  ["ISA", "Industry Standard Architecture", "Magistrală de extensie foarte veche (8/16 biți), înlocuită de PCI."],
  ["PCI", "Peripheral Component Interconnect", "Magistrală paralelă comună (32 de biți, 133 MB/s), înlocuită de PCIe."],
  ["GPT", "GUID Partition Table", "Schema modernă de partiționare (discuri > 2 TB, folosită cu UEFI)."],
  ["MBR", "Master Boot Record", "Schema veche: max. ~2 TB și 4 partiții primare."],
  ["TRIM", "comandă ATA/NVMe", "Spune SSD-ului ce blocuri nu mai sunt folosite, ca să-și păstreze viteza."],
  ["USB4", "Universal Serial Bus 4", "USB pe conector USB-C, 40 Gbit/s (compatibil Thunderbolt)."],
  ["DRAM", "Dynamic RAM", "Memoria principală: trebuie reîmprospătată continuu și se pierde la oprire."]
);
TERMS.pc = TERMS.pc.concat([
  ["Socket", "soclul procesorului (ex. AM5, LGA1700) – trebuie să fie compatibil cu CPU-ul"],
  ["Chipset (PCH)", "controlează SATA, USB, linii PCIe suplimentare, rețea, sunet"],
  ["Linii PCIe", "legături seriale; x1/x4/x16; ~1 GB/s (3.0), ~2 GB/s (4.0) pe linie și sens"],
  ["M.2 2280", "forma plăcuței: 22 × 80 mm; poate fi SATA sau NVMe"],
  ["Dual channel", "două module identice în sloturile din manual → lățime de bandă dublă"],
  ["SO-DIMM", "modul RAM scurt, pentru laptop"],
  ["Distanțiere", "ridică placa de bază de pe tabla carcasei (fără scurtcircuit)"],
  ["Pastă termică", "strat subțire între CPU și cooler (cât un bob de mazăre)"],
  ["Placă POST", "afișează codul etapei de pornire la care s-a blocat PC-ul"],
  ["PCIe 8 pini", "150 W pentru placa video (6 pini = 75 W, slotul = 75 W)"]
]);
/* VoIP Cisco – acronime */
TERMS.gen.push(
  ["RTCP", "RTP Control Protocol", "Însoțește RTP și raportează calitatea: pachete pierdute, jitter, întârziere."],
  ["SDP", "Session Description Protocol", "În corpul mesajului SIP: codecurile, adresa IP și portul pentru voce."],
  ["MGCP", "Media Gateway Control Protocol", "Un call agent central comandă gateway-uri simple (stăpân–sclav)."],
  ["H.248", "Megaco", "Protocol ITU-T/IETF de control al gateway-urilor media, urmașul MGCP."],
  ["H.225", "semnalizare H.323", "Stabilirea apelului în H.323 (derivată din Q.931 ISDN) și mesajele RAS."],
  ["H.245", "control H.323", "Negociază codecurile și deschide canalele media în H.323."],
  ["MCU", "Multipoint Control Unit", "Echipamentul care combină fluxurile într-o conferință cu mai mulți participanți."],
  ["LLQ", "Low Latency Queuing", "Coadă cu prioritate strictă (limitată) pentru voce pe routere Cisco."],
  ["LFI", "Link Fragmentation and Interleaving", "Taie pachetele mari de date ca vocea să nu aștepte după ele pe legături lente."],
  ["CAC", "Call Admission Control", "Refuză un apel nou când nu mai e bandă, ca să nu strice apelurile existente."],
  ["VAD", "Voice Activity Detection", "Nu trimite pachete în pauzele de vorbire."],
  ["CNG", "Comfort Noise Generation", "Zgomot de fond artificial redat în pauze, ca legătura să nu pară căzută."],
  ["cRTP", "Compressed RTP", "Comprimă antetul IP/UDP/RTP de 40 B la 2–4 B pe legături lente."],
  ["IVR", "Interactive Voice Response", "Meniu vocal automat („apăsați 1…”) care direcționează apelul după tastele DTMF."],
  ["ANM", "Answer Message (ISUP)", "Mesaj SS7: cel apelat a răspuns, începe taxarea."],
  ["QSIG", "semnalizare Q între PBX-uri", "Semnalizare bazată pe ISDN între centrale private de la producători diferiți."],
  ["CLASS", "Custom Local Area Signaling Services", "Servicii care cer SS7 cap-la-cap (afișarea numărului, blocarea apelurilor)."],
  ["E.164", "plan internațional de numerotare ITU-T", "Cod de țară + cod național + abonat, max. 15 cifre (România +40)."],
  ["PESQ", "Perceptual Evaluation of Speech Quality", "Metodă obiectivă care estimează scorul MOS (urmașul PSQM)."],
  ["FXS", "Foreign eXchange Station", "Port care alimentează un telefon analogic (ton, sonerie)."],
  ["FXO", "Foreign eXchange Office", "Port care se leagă la o linie de centrală, comportându-se ca un telefon."],
  ["T.38", "fax peste IP (ITU-T)", "Trimite fax-ul ca date, nu ca sunet comprimat."],
  ["G.114", "recomandare ITU-T", "Întârziere pe un sens recomandată pentru voce: cel mult ~150 ms."],
  ["G.168", "recomandare ITU-T", "Anulatoare de ecou pentru rețelele de voce."],
  ["IP-PBX", "centrală privată pe IP", "PBX care controlează telefoane IP (ex. Cisco Unified CM, Asterisk)."]
);
TERMS.voip = [
  ["Toll bypass", "apelurile între sedii merg pe WAN-ul propriu, fără taxe interurbane"],
  ["Pachet G.711 / 20 ms", "160 B voce + 40 B antete; 50 pachete/s → 80 kbit/s pe sens"],
  ["G.729", "8 kbit/s voce, ~24 kbit/s la nivel IP cu pachete de 20 ms"],
  ["MOS", "1–5; G.711 ≈ 4,1; G.729 ≈ 3,9"],
  ["Întârziere", "≤ 150 ms pe un sens (G.114); peste ~400 ms inacceptabil"],
  ["Jitter", "variația întârzierii; se netezește cu buffer de dejitter"],
  ["Pierderi", "peste ~1% se aud; codecul ascunde pachete izolate"],
  ["DSCP EF", "46 – marcajul vocii; CoS 5 pe 802.1Q"],
  ["SIP", "IETF, text, port 5060 (5061 TLS); INVITE → 180 → 200 → ACK → BYE"],
  ["H.323", "familie ITU-T: terminal, gateway, gatekeeper, MCU; H.225 + H.245"],
  ["ISUP", "IAM → ACM → ANM → REL → RLC"],
  ["Legea A / legea µ", "Europa / America de Nord și Japonia"]
];
/* Radio – Colonati & Graham: acronime */
TERMS.gen.push(
  ["FEC", "Forward Error Correction", "Redundanță adăugată ca receptorul să corecteze singur erorile, fără retransmisie."],
  ["ARQ", "Automatic Repeat reQuest", "Receptorul confirmă (ACK) sau cere repetarea (NAK) fiecărui bloc."],
  ["FSK", "Frequency Shift Keying", "Modulație digitală prin comutarea între frecvențe (ex. RTTY, MARK/SPACE)."],
  ["AFSK", "Audio FSK", "FSK făcută cu tonuri audio trimise în microfonul unei stații (ex. packet 1200/2200 Hz)."],
  ["BPSK", "Binary Phase Shift Keying", "Două stări de fază (0° / 180°); ex. PSK31."],
  ["GMSK", "Gaussian Minimum Shift Keying", "Modulație de frecvență cu filtru gaussian, folosită în GSM."],
  ["OFDM", "Orthogonal Frequency Division Multiplexing", "Multe subpurtătoare înguste în paralel (Wi-Fi a/g/n/ac/ax, LTE, DAB)."],
  ["CDMA", "Code Division Multiple Access", "Mai mulți utilizatori în aceeași bandă, separați prin coduri (3G, spread spectrum)."],
  ["DSSS", "Direct Sequence Spread Spectrum", "Fiecare bit e înmulțit cu un cod rapid de chip-uri (802.11b)."],
  ["FHSS", "Frequency Hopping Spread Spectrum", "Purtătoarea sare între canale după o secvență cunoscută (Bluetooth)."],
  ["CCK", "Complementary Code Keying", "Codarea folosită de 802.11b la 5,5 și 11 Mbit/s."],
  ["APRS", "Automatic Packet Reporting System", "Poziții GPS și mesaje prin packet radio; 144,800 MHz în Europa."],
  ["AX.25", "protocol packet radio", "Protocolul de legătură de date (nivel 2) al packet-ului, derivat din HDLC."],
  ["MFSK", "Multiple FSK", "Mod digital cu multe tonuri, unul activ la un moment dat (ex. MFSK16)."],
  ["PSK31", "mod digital de conversație", "BPSK la 31,25 baud, ~31 Hz bandă, cod Varicode."],
  ["RTTY", "Radioteletype", "Teleimprimator prin radio: Baudot 5 biți, 45,45 baud, shift 170 Hz."],
  ["ITA2", "International Telegraph Alphabet nr. 2", "Codul Baudot pe 5 biți, cu registre LTRS/FIGS."],
  ["CW", "Continuous Wave", "Telegrafie Morse prin pornirea/oprirea purtătoarei (A1A)."],
  ["SSB", "Single Side Band", "Bandă laterală unică, fără purtătoare (J3E); în română BLU."],
  ["BLU", "bandă laterală unică", "Termenul românesc pentru SSB."],
  ["ALC", "Automatic Level Control", "Limitează nivelul emisiei; dacă lucrează la moduri digitale, semnalul e supramodulat."],
  ["MGM", "Machine Generated Modes", "Moduri digitale generate și decodate de calculator (termen IARU)."],
  ["NAVTEX", "Navigational Telex", "Avertizări maritime transmise prin SITOR-B (FEC)."],
  ["WPM", "Words Per Minute", "Viteza în telegrafie/teletype, măsurată cu cuvântul „PARIS”."],
  ["SAW", "Surface Acoustic Wave", "Filtru cu undă acustică de suprafață, foarte selectiv."],
  ["ERP", "Effective Radiated Power", "Puterea radiată raportată la dipolul λ/2; EIRP = ERP + 2,15 dB."],
  ["FSL", "Free Space Loss", "Atenuarea în spațiu liber: 32,44 + 20·log f[MHz] + 20·log d[km]."],
  ["MAPL", "Maximum Allowable Path Loss", "Cât poate atenua traseul ca legătura să mai funcționeze."],
  ["SINAD", "Signal + Noise + Distortion / Noise + Distortion", "Criteriul clasic de sensibilitate la FM analogic (12 dB SINAD)."],
  ["RSSI", "Received Signal Strength Indicator", "Nivelul semnalului recepționat raportat de terminal."],
  ["C/I", "Carrier-to-Interference", "Cu câți dB semnalul util e peste interferent."],
  ["IMP", "Intermodulation Product", "Frecvență parazită 2A−B, 2B−A… produsă prin amestecarea emisiilor."],
  ["TMA", "Tower Mounted Amplifier", "Amplificator de recepție montat lângă antenă, pe pilon."],
  ["PMR", "Private Mobile Radio", "Rețea radio privată a unei firme sau instituții."],
  ["PAMR", "Public Access Mobile Radio", "Rețea PMR comercială, partajată de mai mulți clienți."],
  ["PMR446", "radio fără licență", "446,0–446,2 MHz, max. 0,5 W ERP, antenă fixă."],
  ["DMR", "Digital Mobile Radio", "Standard ETSI: 12,5 kHz, 2 sloturi TDMA, 4FSK."],
  ["TETRAPOL", "standard PMR digital", "FDMA 12,5 kHz, folosit de unele servicii de siguranță (ex. Franța)."],
  ["P25", "APCO Project 25", "Standardul radio digital al serviciilor de siguranță din SUA."],
  ["MCPTT", "Mission Critical Push-To-Talk", "PTT pentru servicii critice peste LTE/5G."],
  ["GoS", "Grade of Service", "Probabilitatea ca un apel să fie blocat (ex. 2%)."],
  ["WRC", "World Radiocommunication Conference", "Conferința ITU care modifică Regulamentul Radiocomunicațiilor."],
  ["MIFR", "Master International Frequency Register", "Registrul mondial al atribuirilor de frecvență, ținut de ITU."],
  ["CEPT", "Conferința Europeană a Administrațiilor de Poștă și Telecomunicații", "Armonizează folosirea spectrului în Europa (prin ERO)."],
  ["ERO", "European Radiocommunications Office", "Biroul tehnic al CEPT pentru spectru."],
  ["DTM", "Digital Terrain Model", "Modelul digital al cotei terenului folosit în planificarea radio."],
  ["URS", "User Requirement Specification", "Documentul cu cerințele utilizatorului, la începutul proiectului."],
  ["NF", "Noise Figure", "Factorul de zgomot al receptorului, în dB."],
  ["kTB", "zgomot termic", "Puterea zgomotului termic: −174 dBm/Hz la 290 K."],
  ["FFZ", "First Fresnel Zone", "Prima zonă Fresnel – trebuie să rămână (în mare parte) liberă."]
);
TERMS.ant = (TERMS.ant || []).concat([
  ["Nyquist", "eșantionare cu cel puțin 2 × frecvența maximă"],
  ["Shannon", "C = B·log₂(1 + S/N)"],
  ["RTTY", "Baudot 5 biți, 45,45 baud, shift 170 Hz, fără FEC"],
  ["PSK31", "BPSK 31,25 baud, ~31 Hz, Varicode"],
  ["Stratul D", "absoarbe ziua frecvențele sub ~5 MHz; dispare noaptea"],
  ["ISM (UE)", "433,05–434,79 MHz · 2400–2483,5 MHz · 5725–5875 MHz; WLAN 2,4 GHz max. 100 mW EIRP"],
  ["Rayleigh / Rice", "fading rapid fără LOS / cu componentă directă (factor K)"],
  ["Marjă 90%", "Rayleigh ≈ 8,2 dB; lognormal ≈ 1,28·σ"],
  ["Zgomot 25 kHz", "≈ −130 dBm (kTB −174 dBm/Hz + 44 dB)"],
  ["Erlang B / C", "apeluri blocate pierdute / puse la coadă"],
  ["IMP ordinul 3", "2A−B și 2B−A (380/384 → 376/388 MHz)"],
  ["Drive-test", "~50 eșantioane pe ~40λ → ±1 dB; pe distanță, nu pe timp"],
  ["TETRA", "25 kHz, 4 sloturi TDMA, π/4-DQPSK, 380–400 MHz; TMO/DMO"]
]);
TERMS.pp = [
  ["MOTD", "Message Of The Day – bannerul afișat la conectarea pe un echipament Cisco (banner motd #text#)"],
  ["PuTTY", "program gratuit de terminal pentru Windows: conexiune serială (consolă, 9600 8N1), SSH sau Telnet"],
  ["M.2", "slot mic pe placa de bază pentru SSD-uri (SATA sau NVMe), prins cu un șurub"],
  ["PSU", "Power Supply Unit – sursa de alimentare a calculatorului (230 V AC → 12/5/3,3 V DC)"],
  ["CLI", "Command Line Interface – interfața în linie de comandă (ex. Cisco IOS, cmd în Windows)"],
  ["OL", "Overload / Open Loop – afișat de multimetru când valoarea depășește domeniul sau circuitul e întrerupt"]
];

TERMS.net.push(
  ["Trunk", "port de switch care duce mai multe VLAN-uri pe același cablu, cu etichete 802.1Q (între switch-uri sau spre router)"],
  ["Port access", "port care aparține unui singur VLAN; cadrele ies fără etichetă spre calculator"],
  ["802.1Q", "standardul IEEE de etichetare VLAN: etichetă de 4 octeți (TPID 0x8100, VID pe 12 biți)"],
  ["VLAN nativ", "VLAN-ul ale cărui cadre circulă pe trunk fără etichetă; implicit VLAN 1; trebuie să fie identic la ambele capete"],
  ["DTP", "Dynamic Trunking Protocol", "protocol Cisco care negociază automat trunkul (auto, desirable); se oprește cu nonegotiate"],
  ["ISL", "Inter-Switch Link", "protocol vechi de trunk, proprietar Cisco, înlocuit de 802.1Q"],
  ["Router-on-a-stick", "router cu un singur cablu trunk spre switch și câte o sub-interfață (dot1Q) pe VLAN, pentru rutare între VLAN-uri"],
  ["allowed vlan", "lista VLAN-urilor permise pe un trunk; fără „add” comanda înlocuiește lista"]
);

/* Videoclipuri opționale (segmente scurte, youtube-nocookie, se încarcă doar la apăsare). ID-uri verificate cu oEmbed. */
function YT(id, s, e, title, ch, note) {
  var mm = function (x) { return Math.floor(x / 60) + ":" + ("0" + (x % 60)).slice(-2); };
  return '<div class="ytbox"><button class="ytf" data-yt="' + id + '" data-s="' + s + '" data-e="' + e + '" aria-label="Pornește videoclipul: ' + title.replace(/"/g, "") + '"><svg viewBox="0 0 68 48" width="54" height="38" aria-hidden="true"><path d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.3.3 34 .3 34 .3S12.7.3 7.4 1.7c-2.9.8-5.1 3.1-5.9 6C0 13 0 24 0 24s0 11 1.5 16.3c.8 2.9 3 5.2 5.9 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.6-1.4c2.9-.8 5.1-3.1 5.9-6C68 35 68 24 68 24s0-11-1.5-16.3z" fill="#e11d48"/><path d="M27 34l18-10-18-10z" fill="#fff"/></svg><span><b>' + title + "</b><small>" + ch + " · segment " + mm(s) + "–" + mm(e) + " (" + Math.round((e - s) / 60) + ' min) · opțional</small></span></button><div class="small muted">🎬 ' + note + "</div></div>";
}
(function () {
  var V = [
    [/^Împărțirea în subrețele$/, "oQTJUeRVklc", 89, 257, "Cum subnetez o rețea (partea 1)", "Ramon Adrian Năstase · RO", "Urmărește cum împarte o rețea în subrețele și cum află adresa de rețea și broadcast-ul. Apoi exersează în Antrenorul de subnetting."],
    [/^VLAN, trunk și STP$/, "H0P5I9-L3r0", 25, 266, "Ce înseamnă VLAN, access și trunk", "Ramon Adrian Năstase · RO", "Reține: VLAN = separare la nivelul 2; portul access duce un singur VLAN, trunk-ul mai multe (802.1Q)."],
    [/^NAT – traducerea adreselor$/, "fLZkRieollc", 20, 279, "Cum funcționează NAT", "Ramon Adrian Năstase · RO", "Urmărește diferența dintre NAT static și dinamic. PAT (overload) – mai multe adrese private pe un singur IP public – e la finalul clipului."],
    [/^Ce este o rețea$/, "lxZpuEJQFMQ", 72, 240, "Introducere în rețele de calculatoare", "Ramon Adrian Năstase · RO", "Concepte de bază: ce e o rețea, cum funcționează Internetul. Bun ca prim contact, înainte de lecție."],
    [/^Scenariul 1: mufezi un cablu drept T568B$/, "QMpWkkqX1eM", 79, 334, "Cum se mufează un cablu Cat5e/Cat6 (RJ45)", "Switched On Network · EN", "Fără sunet se înțelege tot: dezizolare, îndreptarea firelor, ordinea culorilor, tăiere, sertizare, test. Verifică pe ecran ordinea T568B."],
    [/^Exersare acasă: mufezi, testezi, repari$/, "QMpWkkqX1eM", 79, 334, "Cum se mufează un cablu Cat5e/Cat6 (RJ45)", "Switched On Network · EN", "Uită-te o dată, apoi oprește și fă exact pașii pe cablul tău."],
    [/^Lab B în Packet Tracer: SSH pe switch în VLAN 10$/, "lC0JoWTjgjg", 0, 300, "VLAN și SSH pe un switch în Packet Tracer", "Triple Play Technical · EN", "Comparați comenzile cu cele din lecție: vlan, interface vlan, domain-name, crypto key, username, line vty."],
    [/^Lab C în Packet Tracer: router Gi0\/0 \+ switch \+ 2 PC-uri$/, "T5RKNkFDBtU", 0, 300, "Configurări de bază pe router în Packet Tracer", "Ramon Adrian Năstase · RO", "Primele 5 minute: hostname, parole, IP pe interfață, no shutdown – exact ce faci la Lab C."],
    [/^Conectori de fibră și UPC\/APC$/, "bgboCnc7nmg", 0, 286, "Conectori de fibră: ST, FC, SC, LC, MT-RJ", "Sunny Classroom · EN", "Animații clare cu forma fiecărui conector. Leagă imaginea de nume: SC pătrat, LC mic, ST baionetă, FC filet."],
    [/^OTDR și diagnosticarea fibrei$/, "GP39QVYwmNU", 0, 289, "Cum citești o urmă OTDR", "Fosco Connect / Corning · EN", "Recunoaște pe grafic: vârful de la început, panta (atenuarea), treapta de la sudură, vârful de la conector și capătul fibrei."]
  ];
  V.forEach(function (v) { LESSONS.forEach(function (l) { if (v[0].test(l.t)) l.cards[l.cards.length - 1] += YT(v[1], v[2], v[3], v[4], v[5], v[6]); }); });
})();

