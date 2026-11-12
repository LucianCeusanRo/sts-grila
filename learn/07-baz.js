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
