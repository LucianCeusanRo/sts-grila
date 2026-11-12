p='learn/00-svg.js';s=open(p).read()
if 'S.wave' in s: raise SystemExit('already')
new=r'''
  /* ---- radio de la zero ---- */
  S.wave = function () {
    var d = "M20,80", i;
    for (i = 0; i <= 360; i += 4) d += " L" + (20 + i * 1.2) + "," + (80 - 45 * Math.sin(i * Math.PI / 90)).toFixed(1);
    var g = arrowDef + '<path d="' + d + '" fill="none" stroke="#2563eb" stroke-width="3"/>' + l(20, 80, 460, 80, "#94a3b8", 1, "4 4");
    g += ar(65, 22, 200, 22) + ar(200, 22, 65, 22) + t(132, 16, "o lungime de undă λ", { s: 11, w: 700 });
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
    g += box(5, 30, 70, "microfon", "voce → semnal", "#f1f5f9") + ar(75, 50, 95, 50) + box(95, 30, 80, "EMIȚĂTOR TX", "modulează, amplifică", "#fecaca") + ar(175, 50, 195, 50) + l(195, 50, 215, 50) + l(215, 50, 215, 20, "#14213d", 3) + l(205, 20, 225, 20, "#14213d", 3);
    g += '<path d="M232,30 q12,20 0,40 M244,22 q18,28 0,56" fill="none" stroke="#2563eb" stroke-width="2"/>' + t(240, 100, "unda radio", { s: 10, f: "#1d4ed8" });
    g += '<path d="M256,30 q-12,20 0,40" fill="none" stroke="#2563eb" stroke-width="2"/>' + l(265, 20, 285, 20, "#14213d", 3) + l(275, 20, 275, 50, "#14213d", 3) + ar(275, 50, 300, 50);
    g += box(300, 30, 85, "RECEPTOR RX", "amplifică, demodulează", "#bbf7d0") + ar(385, 50, 405, 50) + box(405, 30, 70, "difuzor", "semnal → voce", "#f1f5f9");
    g += r(60, 120, 360, 70, "#eff6ff", { st: "#1d4ed8" }) + t(240, 140, "TRANSCEIVER (TRX) = TX + RX în aceeași cutie (stația radio)", { s: 11, w: 800 });
    g += t(240, 160, "Simplex: pe rând, apeși PTT ca să vorbești · Duplex: ambii deodată (ca telefonul)", { s: 10 });
    g += t(240, 178, "Antena și cablul sunt aceleași pentru TX și RX", { s: 10 });
    return W("0 0 480 196", g, "Lanțul radio: emițător → antenă → aer → antenă → receptor");
  };
  S.anttypes = function () {
    var g = "";
    function cap(x, a, b) { return t(x, 128, a, { s: 11, w: 800 }) + t(x, 143, b, { s: 9.5 }); }
    // dipol
    g += l(20, 60, 55, 60, "#14213d", 4) + l(65, 60, 100, 60, "#14213d", 4) + l(60, 60, 60, 105, "#94a3b8", 2) + t(60, 50, "λ/2", { s: 10 }) + cap(60, "Dipol", "2 brațe, λ/2 total");
    // monopol
    g += l(150, 20, 150, 90, "#14213d", 4) + l(120, 92, 180, 92, "#64748b", 3) + l(125, 92, 115, 105, "#64748b", 2) + l(175, 92, 185, 105, "#64748b", 2) + t(165, 50, "λ/4", { s: 10, a: "start" }) + cap(150, "Monopol / vertical", "λ/4 + plan de masă; omni");
    // yagi
    g += l(205, 60, 290, 60, "#14213d", 3) + l(210, 35, 210, 85, "#dc2626", 3) + l(230, 40, 230, 80, "#14213d", 3) + l(250, 44, 250, 76, "#2563eb", 3) + l(268, 46, 268, 74, "#2563eb", 3) + l(285, 48, 285, 72, "#2563eb", 3) + cap(248, "Yagi", "reflector+dipol+directori");
    // panou
    g += r(320, 20, 34, 80, "#e2e8f0", { st: "#475569" }) + t(337, 64, "panou", { s: 9 }) + cap(337, "Panou / sectorial", "60–120°, pe piloni");
    // parabolic
    g += '<path d="M410,20 Q450,60 410,100" fill="#e0f2fe" stroke="#0369a1" stroke-width="3"/>' + l(420, 60, 455, 60, "#14213d", 2) + '<circle cx="456" cy="60" r="4" fill="#14213d"/>' + cap(435, "Parabolică", "fascicul foarte îngust");
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
'''
s=s.replace("  S.tir = S.fiber;\n", new+"  S.tir = S.fiber;\n")
open(p,'w').write(s)
print('ok')
