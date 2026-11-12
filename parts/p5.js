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
    var st = P.ppchk || {};
    Array.prototype.forEach.call(app.querySelectorAll(".bx"), function (x) { x.checked = !!st[x.getAttribute("data-k")]; x.onchange = function () { P.ppchk = P.ppchk || {}; if (x.checked) P.ppchk[x.getAttribute("data-k")] = 1; else delete P.ppchk[x.getAttribute("data-k")]; saveP(true); }; });
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

