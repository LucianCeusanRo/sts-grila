p='learn/00-svg.js';s=open(p).read()
if 'S.meter' in s: raise SystemExit('already')
new=r'''
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
'''
s=s.replace("  S.tir = S.fiber;\n", new+"  S.tir = S.fiber;\n")
open(p,'w').write(s)
print('ok')
