/* Teste de inteligență și vocabular (tip test psihologic și de aptitudini) – întrebări originale, generate determinist. */
(function () {
  var IQ_S = ["★", "●", "▲", "■", "♥", "✚"], IQ_C = ["#f59e0b", "#2563eb", "#16a34a", "#dc2626", "#db2777", "#7c3aed"];
  var NETS = [
    { c: [[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]], o: [[0,4],[1,3],[2,5]] },
    { c: [[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]], o: [[0,5],[1,3],[2,4]] },
    { c: [[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]], o: [[0,5],[1,3],[2,4]] },
    { c: [[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]], o: [[0,2],[1,4],[3,5]] },
    { c: [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]], o: [[0,3],[1,4],[2,5]] },
    { c: [[0,0],[0,1],[1,1],[2,1],[3,1],[0,2]], o: [[0,5],[1,3],[2,4]] }
  ];
  var BAD = [[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1]], [[0,0],[1,0],[2,0],[3,0],[4,0],[2,1]], [[0,0],[1,0],[0,1],[1,1],[2,1],[3,1]], [[0,0],[2,0],[0,1],[1,1],[2,1],[1,2]]];
  var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function sh(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function netSvg(cells, lab, sz, ox, oy, noLab) {
    sz = sz || 44; ox = ox || 0; oy = oy || 0; var h = "";
    cells.forEach(function (c, i) { var x = ox + c[0] * sz, y = oy + c[1] * sz; h += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" fill="' + (noLab ? "#e0e7ff" : "#fff") + '" stroke="#1e293b" stroke-width="2"/>' + (noLab ? "" : '<text x="' + (x + sz / 2) + '" y="' + (y + sz / 2 + sz * 0.17) + '" font-size="' + Math.round(sz * 0.5) + '" text-anchor="middle" fill="' + IQ_C[lab[i]] + '">' + IQ_S[lab[i]] + "</text>"); });
    return h;
  }
  function box(cells, sz) { var mx = 0, my = 0; cells.forEach(function (c) { mx = Math.max(mx, c[0]); my = Math.max(my, c[1]); }); return [(mx + 1) * sz, (my + 1) * sz]; }
  var Q = [];
  /* 1) fața opusă */
  NETS.forEach(function (n, ni) {
    for (var k = 0; k < 5; k++) {
      var lab = sh([0, 1, 2, 3, 4, 5]), f = (k + ni) % 6, pair = n.o.filter(function (p) { return p[0] === f || p[1] === f; })[0], op = pair[0] === f ? pair[1] : pair[0];
      var others = sh([0, 1, 2, 3, 4, 5].filter(function (x) { return x !== f && x !== op; })).slice(0, 3);
      var bx = box(n.c, 44), svg = '<svg viewBox="-4 -4 ' + (bx[0] + 8) + " " + (bx[1] + 8) + '" style="max-width:' + Math.min(320, bx[0] + 8) + 'px" role="img" aria-label="Desfășurarea unui cub">' + netSvg(n.c, lab) + "</svg>";
      Q.push(["Pliezi desfășurarea din imagine într-un cub (simbolurile rămân pe exterior). Ce simbol ajunge pe fața OPUSĂ lui " + IQ_S[lab[f]] + "?", [IQ_S[lab[op]]].concat(others.map(function (x) { return IQ_S[lab[x]]; })), "Truc: într-un șir drept de pătrate, fețele aflate la DISTANȚĂ DE UNA (cu un pătrat între ele) sunt opuse; două pătrate lipite sunt mereu vecine. Aici " + IQ_S[lab[f]] + " ↔ " + IQ_S[lab[op]] + ". (Teste · cub)", svg]);
    }
  });
  /* 2) care desfășurare formează un cub */
  function fourNets(list, ans) { var sz = 18, h = '<svg viewBox="0 0 400 130" role="img" aria-label="Patru desfășurări A, B, C, D">'; list.forEach(function (c, i) { var ox = 6 + i * 100; h += '<text x="' + (ox + 40) + '" y="14" font-size="14" font-weight="700" text-anchor="middle" fill="currentColor">' + "ABCD"[i] + "</text>" + netSvg(c, null, sz, ox, 24, true); }); return h + "</svg>"; }
  for (var v = 0; v < 6; v++) {
    var good = NETS[v].c, bads = sh(BAD).slice(0, 3), all = sh([good].concat(bads)), gi = all.indexOf(good);
    Q.push(["Care dintre desfășurările A, B, C, D se poate plia într-un cub închis?", ["ABCD"[gi]].concat("ABCD".split("").filter(function (x, i) { return i !== gi; })), "Reguli rapide: o desfășurare de cub are 6 pătrate; NU are 2×2 pătrate într-un bloc; NU are 5 pătrate într-un șir; din șirul de 4, câte un pătrat sus și jos (nu ambele pe aceeași parte, la același capăt). (Teste · cub)", fourNets(all)]);
  }
  for (var w = 0; w < 4; w++) {
    var bd = BAD[w], gs = sh(NETS.map(function (x) { return x.c; })).slice(0, 3), al = sh(gs.concat([bd])), bi = al.indexOf(bd);
    Q.push(["Care dintre desfășurările A, B, C, D NU se poate plia într-un cub?", ["ABCD"[bi]].concat("ABCD".split("").filter(function (x, i) { return i !== bi; })), "Atenție la „NU” din enunț! Desfășurarea greșită are fie un bloc 2×2, fie 5 pătrate în linie, fie două pătrate care s-ar suprapune la pliere. (Teste · cub)", fourNets(al)]);
  }
  /* 3) cub vopsit și tăiat */
  Q.push(["Un cub vopsit pe toate fețele este tăiat în 27 de cubulețe egale (3×3×3). Câte cubulețe au EXACT 3 fețe vopsite?", ["8", "6", "12", "4"], "Cele cu 3 fețe vopsite sunt colțurile – un cub are mereu 8 colțuri. (Teste · cub)"]);
  Q.push(["Același cub 3×3×3 vopsit: câte cubulețe au EXACT 2 fețe vopsite?", ["12", "8", "6", "24"], "Cele cu 2 fețe stau pe muchii, câte unul pe mijlocul fiecărei muchii: 12 muchii × 1 = 12. (Teste · cub)"]);
  Q.push(["Același cub 3×3×3 vopsit: câte cubulețe au EXACT o față vopsită?", ["6", "8", "12", "1"], "Câte unul în centrul fiecărei fețe: 6. (Teste · cub)"]);
  Q.push(["Același cub 3×3×3 vopsit: câte cubulețe NU au nicio față vopsită?", ["1", "0", "6", "8"], "Doar cel din mijloc, ascuns complet: 1. Verificare: 8 + 12 + 6 + 1 = 27. (Teste · cub)"]);
  Q.push(["Un cub vopsit este tăiat în 64 de cubulețe (4×4×4). Câte au EXACT 2 fețe vopsite?", ["24", "12", "8", "36"], "Pe fiecare muchie rămân 4 − 2 = 2 cubulețe (fără colțuri): 12 × 2 = 24. (Teste · cub)"]);
  Q.push(["Cubul 4×4×4 vopsit: câte cubulețe nu au nicio față vopsită?", ["8", "1", "16", "27"], "Interiorul e un cub 2×2×2 = 8. (Teste · cub)"]);
  Q.push(["Câte muchii are un cub?", ["12", "8", "6", "24"], "6 fețe, 8 vârfuri, 12 muchii. Truc: 6–8–12 („șase, opt, doișpe”). (Teste · cub)"]);
  Q.push(["Câte vârfuri (colțuri) are un cub?", ["8", "6", "12", "4"], "8 vârfuri – câte 4 sus și 4 jos. (Teste · cub)"]);
  Q.push(["Pe un zar obișnuit, suma fețelor opuse este mereu 7. Ce număr e opus lui 2?", ["5", "4", "6", "3"], "1↔6, 2↔5, 3↔4. (Teste · cub)"]);
  Q.push(["Pe un zar obișnuit, cu fața 4 în sus, ce număr este jos?", ["3", "2", "1", "6"], "Fețele opuse dau suma 7: 7 − 4 = 3. (Teste · cub)"]);
  /* 4) șiruri de numere */
  var SER = [
    ["2, 4, 6, 8, ?", "10", ["12", "9", "16"], "+2 la fiecare pas."], ["3, 6, 12, 24, ?", "48", ["36", "30", "42"], "×2 la fiecare pas."], ["1, 4, 9, 16, 25, ?", "36", ["30", "35", "49"], "Pătratele: 1², 2², … 6² = 36."],
    ["1, 1, 2, 3, 5, 8, ?", "13", ["11", "12", "16"], "Fibonacci: fiecare = suma celor două dinainte (5 + 8)."], ["2, 3, 5, 7, 11, ?", "13", ["15", "12", "14"], "Numere prime."], ["1, 2, 4, 7, 11, ?", "16", ["15", "14", "18"], "Diferențele cresc: +1, +2, +3, +4, +5."],
    ["100, 90, 81, 73, ?", "66", ["65", "64", "67"], "Scazi 10, 9, 8, 7."], ["5, 10, 7, 14, 11, ?", "22", ["16", "18", "13"], "Alternează: ×2, −3."], ["1, 8, 27, 64, ?", "125", ["100", "81", "216"], "Cuburile: 1³ … 5³ = 125."],
    ["81, 27, 9, 3, ?", "1", ["0", "2", "1/3"], "Împarți la 3."], ["2, 6, 12, 20, 30, ?", "42", ["40", "36", "44"], "n×(n+1): 6×7 = 42 (diferențe +4, +6, +8, +10, +12)."], ["7, 10, 8, 11, 9, ?", "12", ["10", "13", "7"], "Alternează: +3, −2."],
    ["1, 3, 7, 15, 31, ?", "63", ["62", "47", "64"], "×2 + 1 (sau 2ⁿ − 1)."], ["4, 9, 19, 39, ?", "79", ["78", "59", "80"], "×2 + 1."], ["0, 1, 3, 6, 10, ?", "15", ["14", "16", "13"], "Numere triunghiulare: +1, +2, +3, +4, +5."],
    ["2, 4, 8, 16, 32, ?", "64", ["48", "62", "128"], "Puterile lui 2 – exact ca valorile biților într-un octet: 1, 2, 4 … 128."], ["128, 64, 32, 16, ?", "8", ["4", "12", "10"], "Împarți la 2 (valorile biților invers)."], ["11, 13, 17, 19, 23, ?", "29", ["25", "27", "31"], "Numere prime consecutive."],
    ["3, 5, 9, 17, 33, ?", "65", ["49", "64", "66"], "×2 − 1."], ["1, 2, 6, 24, 120, ?", "720", ["240", "600", "144"], "Factoriale: ×2, ×3, ×4, ×5, ×6."], ["10, 20, 15, 30, 25, ?", "50", ["35", "40", "20"], "Alternează: ×2, −5."],
    ["6, 11, 16, 21, ?", "26", ["25", "27", "31"], "+5."], ["50, 45, 41, 38, 36, ?", "35", ["34", "33", "32"], "−5, −4, −3, −2, −1."], ["2, 5, 11, 23, ?", "47", ["46", "35", "48"], "×2 + 1."],
    ["1, 4, 2, 8, 3, 12, ?", "4", ["16", "5", "15"], "Două șiruri întrețesute: 1, 2, 3, 4 și 4, 8, 12."], ["9, 16, 25, 36, ?", "49", ["45", "48", "64"], "Pătrate: 3² … 7²."], ["3, 9, 27, 81, ?", "243", ["162", "324", "108"], "×3."],
    ["20, 17, 14, 11, ?", "8", ["9", "7", "6"], "−3."], ["1, 5, 14, 30, 55, ?", "91", ["80", "85", "96"], "Se adună pătratele: +4, +9, +16, +25, +36."], ["2, 3, 6, 18, 108, ?", "1944", ["216", "324", "1080"], "Fiecare = produsul celor două dinainte: 6 × 18 = 108, 18 × 108 = 1944."],
    ["13, 26, 39, 52, ?", "65", ["64", "62", "78"], "Multiplii lui 13."], ["1000, 100, 10, ?", "1", ["0", "0,1", "5"], "Împarți la 10."], ["4, 6, 9, 13, 18, ?", "24", ["23", "22", "26"], "+2, +3, +4, +5, +6."],
    ["7, 14, 28, 56, ?", "112", ["84", "70", "120"], "×2."], ["15, 13, 16, 12, 17, ?", "11", ["10", "18", "14"], "Două șiruri: 15, 16, 17 (cresc) și 13, 12, 11 (scad)."]
  ];
  SER.forEach(function (s) { Q.push(["Ce număr continuă șirul: " + s[0], [s[1]].concat(s[2]), s[3] + " Truc: caută întâi diferențele dintre termeni, apoi rapoartele, apoi dacă sunt 2 șiruri întrețesute. (Teste · șiruri)"]); });
  var LET = [["A, C, E, G, ?", "I", ["H", "J", "K"], "Sari câte o literă: A(b)C(d)E(f)G(h)I."], ["B, E, H, K, ?", "N", ["M", "O", "L"], "Sari câte 2 litere."], ["Z, Y, X, W, ?", "V", ["U", "T", "S"], "Alfabetul invers."], ["A, B, D, G, K, ?", "P", ["O", "N", "Q"], "Salturi tot mai mari: +1, +2, +3, +4, +5."], ["L, M, M, N, N, N, ?", "O", ["N", "P", "M"], "L o dată, M de 2 ori, N de 3 ori, apoi O."], ["C, F, I, L, ?", "O", ["N", "P", "M"], "+3 litere."], ["A, Z, B, Y, C, ?", "X", ["D", "W", "V"], "Două șiruri: A, B, C și Z, Y, X."], ["D, H, L, P, ?", "T", ["S", "U", "R"], "+4 litere."]];
  LET.forEach(function (s) { Q.push(["Ce literă continuă șirul (alfabetul latin fără diacritice): " + s[0], [s[1]].concat(s[2]), s[3] + " (Teste · șiruri)"]); });
  /* 5) intrusul */
  var ODD = [["câine, pisică, vulture, cal", "vulture", ["câine", "pisică", "cal"], "Vulturul e pasăre; ceilalți sunt mamifere."], ["2, 3, 5, 9, 11", "9", ["2", "3", "11"], "9 nu e număr prim (3 × 3)."], ["switch, router, hub, monitor", "monitor", ["switch", "router", "hub"], "Monitorul e periferic de afișare; restul sunt echipamente de rețea."],
    ["măr, pară, morcov, prună", "morcov", ["măr", "pară", "prună"], "Morcovul e legumă."], ["metru, kilogram, litru, culoare", "culoare", ["metru", "kilogram", "litru"], "Culoarea nu e unitate de măsură."], ["SC, LC, ST, RJ45", "RJ45", ["SC", "LC", "ST"], "RJ45 e conector de cupru; SC/LC/ST sunt de fibră."],
    ["volt, amper, ohm, hertz, kilogram", "kilogram", ["volt", "amper", "hertz"], "Kilogramul e masă; celelalte sunt unități folosite în electricitate și electronică."], ["12, 24, 36, 47, 60", "47", ["12", "36", "60"], "47 nu e multiplu de 12."], ["Dunăre, Olt, Mureș, Carpați", "Carpați", ["Dunăre", "Olt", "Mureș"], "Carpații sunt munți; celelalte sunt râuri."],
    ["octet, bit, kilobit, kilogram", "kilogram", ["octet", "bit", "kilobit"], "Nu măsoară informație."], ["cerc, pătrat, triunghi, cub", "cub", ["cerc", "pătrat", "triunghi"], "Cubul e corp în spațiu (3D); celelalte sunt figuri plane."], ["TCP, UDP, IP, USB", "USB", ["TCP", "UDP", "IP"], "USB e interfață/magistrală; celelalte sunt protocoale de rețea."],
    ["1, 4, 9, 15, 25", "15", ["4", "9", "25"], "15 nu e pătrat perfect."], ["general, colonel, maior, inginer", "inginer", ["general", "colonel", "maior"], "Inginer e profesie; celelalte sunt grade militare."], ["roșu, verde, albastru, rotund", "rotund", ["roșu", "verde", "albastru"], "Rotund e formă, nu culoare."],
    ["ianuarie, martie, luni, mai", "luni", ["ianuarie", "martie", "mai"], "Luni e zi a săptămânii."], ["vioară, chitară, pian, tobă", "tobă", ["vioară", "chitară", "pian"], "Toba e instrument de percuție fără coarde."], ["Word, Excel, PowerPoint, Windows", "Windows", ["Word", "Excel", "PowerPoint"], "Windows e sistem de operare; celelalte sunt aplicații Office."],
    ["3, 6, 9, 13, 15", "13", ["6", "9", "15"], "13 nu se împarte la 3."], ["fier, cupru, aluminiu, sticlă", "sticlă", ["fier", "cupru", "aluminiu"], "Sticla nu e metal (și e izolator)."], ["unu, trei, cinci, opt", "opt", ["unu", "trei", "cinci"], "Opt e par."], ["Paris, Roma, Berlin, Europa", "Europa", ["Paris", "Roma", "Berlin"], "Europa e continent; celelalte sunt capitale."],
    ["tastatură, mouse, scaner, imprimantă", "imprimantă", ["tastatură", "mouse", "scaner"], "Imprimanta e dispozitiv de IEȘIRE; celelalte sunt de intrare."], ["LAN, WAN, MAN, RAM", "RAM", ["LAN", "WAN", "MAN"], "RAM e memorie; celelalte sunt tipuri de rețele."], ["30, 45, 60, 75, 80", "80", ["45", "60", "75"], "Celelalte sunt multipli de 15."]];
  ODD.forEach(function (s) { Q.push(["Care este intrusul: " + s[0] + "?", [s[1]].concat(s[2]), s[3] + " Truc: găsește regula comună pentru MAJORITATE, apoi elementul care o încalcă. (Teste · intrusul)"]); });
  /* 6) analogii */
  var AN = [["Medic : spital = profesor : ?", "școală", ["elev", "carte", "tablă"]], ["Pește : apă = pasăre : ?", "aer", ["cuib", "aripă", "pană"]], ["Cald : rece = sus : ?", "jos", ["înalt", "deal", "cer"]], ["Switch : MAC = router : ?", "IP", ["cablu", "port", "VLAN"]],
    ["Volt : tensiune = amper : ?", "curent", ["putere", "rezistență", "frecvență"]], ["Carte : pagină = clădire : ?", "etaj", ["acoperiș", "oraș", "arhitect"]], ["Ochi : a vedea = ureche : ?", "a auzi", ["a mirosi", "a vorbi", "sunet"]], ["Zi : noapte = vară : ?", "iarnă", ["primăvară", "soare", "toamnă"]],
    ["Pictor : pensulă = scriitor : ?", "stilou", ["carte", "cititor", "hârtie"]], ["Bit : octet = minut : ?", "oră", ["secundă", "zi", "ceas"]], ["Soldat : regiment = jucător : ?", "echipă", ["minge", "antrenor", "meci"]], ["Fibră : lumină = cupru : ?", "curent electric", ["sticlă", "sunet", "aer"]],
    ["Apă : a îngheța = gheață : ?", "a se topi", ["a fierbe", "a curge", "rece"]], ["Mic : minuscul = mare : ?", "uriaș", ["mijlociu", "înalt", "lat"]], ["Pilot : avion = căpitan : ?", "navă", ["port", "mare", "ancoră"]]];
  AN.forEach(function (s) { Q.push(["Completează analogia: " + s[0], [s[1]].concat(s[2]), "Truc: formulează relația din prima pereche într-o propoziție („medicul lucrează la spital”), apoi aplic-o la a doua. (Teste · analogii)"]); });
  /* 7) sinonime */
  var SYN = [["abil", "îndemânatic", ["stângaci", "leneș", "ezitant"]], ["efemer", "trecător", ["veșnic", "solid", "greu"]], ["concis", "succint", ["prolix", "confuz", "lung"]], ["adecvat", "potrivit", ["nepotrivit", "întârziat", "redus"]], ["a diminua", "a micșora", ["a mări", "a repara", "a muta"]],
    ["precar", "nesigur", ["stabil", "bogat", "precis"]], ["veridic", "adevărat", ["mincinos", "vechi", "ciudat"]], ["zelos", "sârguincios", ["indiferent", "lent", "supărat"]], ["insolit", "neobișnuit", ["banal", "obișnuit", "cunoscut"]], ["fortuit", "întâmplător", ["planificat", "obligatoriu", "fortificat"]],
    ["perspicace", "ager", ["naiv", "obosit", "încet"]], ["taciturn", "tăcut", ["vorbăreț", "vesel", "agitat"]], ["a spori", "a crește", ["a scădea", "a opri", "a strica"]], ["dibaci", "priceput", ["neîndemânatic", "fricos", "timid"]], ["a tergiversa", "a amâna", ["a grăbi", "a termina", "a decide"]],
    ["jovial", "voios", ["posac", "sever", "grav"]], ["frugal", "cumpătat", ["risipitor", "lacom", "bogat"]], ["perfid", "viclean", ["sincer", "loial", "naiv"]], ["aversiune", "antipatie", ["simpatie", "atracție", "dorință"]], ["dexteritate", "îndemânare", ["stângăcie", "slăbiciune", "lentoare"]],
    ["apatic", "indiferent", ["entuziast", "energic", "pasionat"]], ["ostil", "dușmănos", ["prietenos", "neutru", "binevoitor"]], ["a omite", "a scăpa din vedere", ["a include", "a sublinia", "a repeta"]], ["temerar", "îndrăzneț", ["fricos", "prudent", "timid"]], ["a eluda", "a ocoli", ["a respecta", "a înfrunta", "a aplica"]],
    ["inerent", "nedespărțit de ceva", ["străin", "opțional", "accidental"]], ["prompt", "rapid", ["lent", "întârziat", "ezitant"]], ["vigilent", "atent", ["neatent", "somnoros", "distrat"]], ["a remedia", "a repara", ["a strica", "a ignora", "a complica"]], ["sobru", "serios", ["frivol", "țipător", "glumeț"]],
    ["eronat", "greșit", ["corect", "exact", "verificat"]], ["a reitera", "a repeta", ["a anula", "a uita", "a începe"]], ["oneros", "costisitor", ["ieftin", "gratuit", "ușor"]], ["laborios", "harnic", ["superficial", "rapid", "comod"]], ["a sustrage", "a fura", ["a dărui", "a returna", "a adăuga"]]];
  SYN.forEach(function (s) { Q.push(["Alege SINONIMUL (cuvântul cu același sens) pentru „" + s[0] + "”:", [s[1]].concat(s[2]), "„" + s[0] + "” = „" + s[1] + "”. Atenție: printre variante e de obicei și un ANTONIM – capcană clasică. Truc: pune cuvântul într-o propoziție și înlocuiește-l cu varianta; dacă sensul rămâne, e sinonim. (Teste · vocabular · sinonime)"]); });
  /* 8) antonime */
  var ANT = [["abundent", "insuficient", ["bogat", "numeros", "plin"]], ["efemer", "durabil", ["trecător", "scurt", "rapid"]], ["concis", "prolix", ["scurt", "clar", "succint"]], ["generos", "zgârcit", ["darnic", "bogat", "bun"]], ["a construi", "a demola", ["a ridica", "a clădi", "a repara"]],
    ["curajos", "laș", ["viteaz", "îndrăzneț", "puternic"]], ["harnic", "leneș", ["muncitor", "sârguincios", "activ"]], ["temporar", "permanent", ["provizoriu", "trecător", "scurt"]], ["transparent", "opac", ["clar", "limpede", "străveziu"]], ["precis", "aproximativ", ["exact", "corect", "fix"]],
    ["a spori", "a diminua", ["a crește", "a mări", "a adăuga"]], ["ostil", "prietenos", ["dușmănos", "agresiv", "rece"]], ["a uni", "a separa", ["a lega", "a îmbina", "a strânge"]], ["concret", "abstract", ["real", "palpabil", "material"]], ["explicit", "implicit", ["clar", "direct", "precis"]],
    ["frecvent", "rar", ["des", "obișnuit", "repetat"]], ["activ", "pasiv", ["energic", "dinamic", "harnic"]], ["optimist", "pesimist", ["vesel", "încrezător", "realist"]], ["victorie", "înfrângere", ["succes", "triumf", "câștig"]], ["modest", "orgolios", ["simplu", "umil", "discret"]],
    ["a accepta", "a refuza", ["a primi", "a aproba", "a admite"]], ["permis", "interzis", ["aprobat", "admis", "legal"]], ["superior", "inferior", ["înalt", "mai bun", "egal"]], ["divergent", "convergent", ["diferit", "opus", "paralel"]], ["calm", "agitat", ["liniștit", "senin", "pașnic"]],
    ["a aprinde", "a stinge", ["a porni", "a încălzi", "a lumina"]], ["major", "minor", ["important", "mare", "principal"]], ["simplu", "complicat", ["ușor", "clar", "elementar"]], ["a câștiga", "a pierde", ["a obține", "a primi", "a învinge"]], ["public", "privat", ["comun", "deschis", "general"]],
    ["fertil", "steril", ["roditor", "bogat", "productiv"]], ["a urca", "a coborî", ["a sui", "a escalada", "a înălța"]], ["prezent", "absent", ["actual", "aici", "vizibil"]], ["legal", "ilegal", ["permis", "corect", "oficial"]], ["vechi", "nou", ["bătrân", "antic", "uzat"]]];
  ANT.forEach(function (s) { Q.push(["Alege ANTONIMUL (cuvântul cu sens opus) pentru „" + s[0] + "”:", [s[1]].concat(s[2]), "„" + s[0] + "” ↔ „" + s[1] + "”. Capcană: celelalte variante sunt de obicei SINONIME sau cuvinte înrudite – citește încă o dată dacă se cere sinonim sau antonim. (Teste · vocabular · antonime)"]); });
  /* 9) paronime */
  var PAR = [["Elevul a ___ mult în acest an (a progresat).", "evoluat", ["evaluat", "elevat", "involuat"], "a evolua = a se dezvolta; a evalua = a aprecia, a da o notă."], ["Profesorul va ___ lucrările mâine (le va nota).", "evalua", ["evolua", "eluda", "evada"], "a evalua = a aprecia valoarea."],
    ["Este un specialist ___ (deosebit de bun).", "eminent", ["iminent", "imanent", "emigrant"], "eminent = remarcabil; iminent = care stă să se întâmple."], ["Pericolul era ___ (gata să se producă).", "iminent", ["eminent", "imanent", "evident"], "iminent = pe cale să se întâmple."],
    ["Atmosfera de la masă avea un caracter ___ (de familie).", "familial", ["familiar", "famelic", "fabulos"], "familial = al familiei; familiar = cunoscut, apropiat."], ["Locul mi se pare ___ (cunoscut).", "familiar", ["familial", "familist", "fanion"], "familiar = cunoscut, obișnuit."],
    ["Examenul ___ se dă cu voce tare.", "oral", ["orar", "aural", "oval"], "oral = prin viu grai; orar = program pe ore."], ["Trenul are un ___ fix (program).", "orar", ["oral", "oră", "orator"], "orar = programul pe ore."],
    ["Comandantul a dat un ___ clar (dispoziție).", "ordin", ["ordine", "ordinal", "orbită"], "ordin = dispoziție; ordine = aranjare, disciplină."], ["Camera era în perfectă ___ (aranjată).", "ordine", ["ordin", "ordinare", "orientare"], "ordine = stare de aranjare."]];
  PAR.forEach(function (s) { Q.push(["Completează corect (paronime – cuvinte care seamănă): " + s[0], [s[1]].concat(s[2]), s[3] + " ❗ Nu te lăsa păcălit: paronimele diferă printr-o literă, dar au sensuri complet diferite. (Teste · vocabular · paronime)"]); });
  QB.add("iq", Q.map(function (q) { return [q[0], q[1], q[2], q[3]]; }));
})();
