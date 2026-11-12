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
