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
