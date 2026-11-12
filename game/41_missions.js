  /* ---------- configurații gata făcute (pentru misiunile care încep de la mijloc) ---------- */
  function preCable(st, which) {
    which.forEach(function (w) {
      if (w === "con") addCable(st, "usb", "pc.usb", "sw.con", true);
      if (w === "lan") addCable(st, "straight", "pc.lan", anchorOfIf(st.V.port), true);
      if (w === "up") addCable(st, "straight", st.V.upa, st.V.ra, true);
      if (w === "rcon") addCable(st, "usb", "pc.usb2", "r.con", true);
    });
    Object.keys(st.linkT).forEach(function (k) { st.linkT[k] -= 40000; });
  }
  function cfgSwitch(st, full) {
    var V = st.V, c = ["enable", "configure terminal", "hostname " + V.host, "vlan " + V.vlan, "name " + V.vname, "exit", "interface " + V.port, "switchport mode access", "switchport access vlan " + V.vlan, "exit", "interface vlan " + V.vlan, "ip address " + V.svi + " " + V.mask, "no shutdown", "exit"];
    if (full) c = c.concat(["ip domain-name " + V.dom, "crypto key generate rsa modulus 1024", "username " + V.user + " secret " + V.pass, "line vty 0 4", "login local", "transport input ssh", "exit", "interface " + V.up, "switchport mode access", "switchport access vlan " + V.vlan, "exit"]);
    c.push("end", "copy running-config startup-config", "");
    c.forEach(function (x) { B.cliRun(st.S.sw, x); }); st.S.sw.mode = "user"; st.S.sw.hist = []; st.S.sw.did = {};
  }
  function cfgRouter(st) { ["enable", "configure terminal", "hostname R1", "interface " + st.V.rif, "ip address " + st.V.gw + " " + st.V.mask, "no shutdown", "end", "copy running-config startup-config", ""].forEach(function (x) { B.cliRun(st.S.r, x); }); st.S.r.mode = "user"; st.S.r.hist = []; st.S.r.did = {}; }
  function pcStatic(st) { var L = st.S.pc; L.dhcp = false; L.ip = st.V.pc; L.mask = st.V.mask; L.gw = st.V.gw; }
  /* ---------- verificări pe starea reală a echipamentelor ---------- */
  function swS(st) { return st.S.sw; }
  var CK = {
    conSw: function (st) { return !!conCable(st, "sw"); },
    lan: function (st) { var c = lanCable(st); return !!c && c.t === "straight" && other(c, "pc.lan") === anchorOfIf(st.V.port); },
    up: function (st) { var c = uplink(st); return !!c && c.t === "straight"; },
    lanGreen: function (st) { return fwd(st); },
    putCom: function (st) { return st.con && st.con.dev === st.S.sw && st.con.open; },
    awake: function (st) { return st.con && st.con.awake && st.con.dev === st.S.sw; },
    en: function (st) { return st.con && st.con.dev === st.S.sw && /#$/.test(B.cliPrompt(st.S.sw)); },
    host: function (st) { return swS(st).host === st.V.host; },
    vlan: function (st) { return swS(st).vlans && swS(st).vlans[st.V.vlan] === st.V.vname; },
    acc: function (st) { var f = swS(st).ifs[st.V.port]; return f && !f.shut && f.mode === "access" && f.vlan === st.V.vlan; },
    svi: function (st) { var f = swS(st).ifs["Vlan" + st.V.vlan]; return f && f.ip === st.V.svi && f.mask === st.V.mask && !f.shut; },
    dom: function (st) { return swS(st).dom === st.V.dom; },
    rsa: function (st) { return swS(st).rsa >= 1024; },
    user: function (st) { var u = swS(st).users[st.V.user]; return !!u && u.t === "secret"; },
    vty: function (st) { var l = swS(st).line.vty; return l.local && l.tin === "ssh"; },
    save: function (st) { var s = swS(st); return !!s.saved && B.cfgEq(s); },
    rcon: function (st) { return !!conCable(st, "r"); },
    rip: function (st) { var f = st.S.r.ifs[st.V.rif]; return f && f.ip === st.V.gw && f.mask === st.V.mask; },
    rns: function (st) { var f = st.S.r.ifs[st.V.rif]; return f && !f.shut; },
    upAcc: function (st) { var f = swS(st).ifs[st.V.up]; return f && !f.shut && f.mode !== "trunk" && f.vlan === st.V.vlan; },
    upGreen: function (st) { return st.led[st.V.ra] === "green" || st.led[st.V.ra] === "blink"; },
    pingGw: function (st) { var d = st.S.pc.did; return !!(d.ping && d.ping[st.V.gw]); },
    pcIp: function (st) { var L = st.S.pc; return !L.dhcp && L.ip === st.V.pc && L.mask === st.V.mask && L.gw === st.V.gw; },
    ipcfg: function (st) { return !!st.S.pc.did.ip || !!st.S.pc.did.ipall; },
    pingSw: function (st) { var d = st.S.pc.did; return !!(d.ping && d.ping[st.V.svi]); },
    ssh: function (st) { return !!st.S.pc.did.ssh; },
    ident: function (st) { return st.ident && st.ident.done; },
    crimp: function (st) { return st.crimp && st.crimp.passed; },
    fiber: function (st) { return st.fiber && st.fiber.done; }
  };
  function O(t, k, hint, why, say) { return { t: t, k: k, ok: CK[k], hint: hint, why: why, say: say }; }
  function MS(st) { var M = MS0(st), X = BONUS(st); Object.keys(X).forEach(function (k) { M[k] = X[k]; }); return M; }
  function MS0(st) {
    var V = st.V;
    return {
      m1: { t: "1. Identifică echipamentele", ic: "🔎", st: "rack", d: "Arată switch-ul, routerul, porturile Fa0/x, Gi0/x, G0/0, G0/1 și consola – și spune la ce folosește fiecare.", obj: [O("Răspunde la toate întrebările examinatorului la rack", "ident", "Mergi la masa cu echipamente (rack) și apasă E / Folosește. Atinge exact portul cerut.", "Switch = multe porturi la fel (LAN, adrese MAC). Router = puține porturi, leagă rețele (IP). Consola = configurare directă cu cablu de consolă.")] },
      m2: { t: "2. Mufează un cablu RJ45 (T568B) și testează-l", ic: "🔌", st: "bench", d: "Aranjezi cele 8 fire în ordinea T568B, alegi tipul cablului, sertizezi și verifici cu testerul.", obj: [O("Cablu drept T568B la ambele capete, testat (LED 1→1 … 8→8)", "crimp", "La bancul de mufare: alb-portocaliu, portocaliu, alb-verde, albastru, alb-albastru, verde, alb-maro, maro.", "T568B: „portocaliu, verde, albastru, maro” cu albul înainte, dar albastrul stă în mijloc (pinii 4–5) și verdele pe 6.")] },
      m3: { t: "3. Cablează laptopul, switch-ul și routerul", ic: "🧵", st: "box", d: "Iei cablul potrivit din cutie și îl conectezi capăt cu capăt. LED-urile trec din portocaliu în verde (STP ~30 s).", obj: [
        O("Cablu de consolă: laptop (USB) → portul CONSOLE al switch-ului", "conSw", "Din cutie ia cablul negru USB–RJ45 (sau cel albastru deschis rollover). Un capăt în USB 1 la laptop, celălalt în CONSOLE (spatele switch-ului).", "Consola e drumul direct spre switch, fără rețea – așa îl configurezi prima dată."),
        O("Cablu drept: laptop (RJ45) → switch " + V.pshort, "lan", "Ia cablul albastru (drept). Un capăt în placa de rețea a laptopului, celălalt în portul " + V.pshort + " al switch-ului.", "PC → switch = echipamente diferite = cablu drept."),
        O("Cablu drept: switch " + V.upshort + " → router " + V.rshort, "up", "Cablu albastru între portul uplink " + V.upshort + " al switch-ului și " + V.rshort + " (GE " + V.rshort.slice(1) + ") pe spatele routerului.", "Switch → router = tot cablu drept. LED-ul nu se aprinde până nu dai no shutdown pe router: porturile routerului sunt oprite din fabrică."),
        O("Așteaptă LED-ul verde pe portul laptopului (STP)", "lanGreen", "LED-ul e portocaliu ~30 s cât STP verifică să nu fie buclă. Poți apăsa „⏩ STP rapid” din meniu.", "Portocaliu = portul ascultă/învață (STP). Verde = trimite date.")] },
      m4: { t: "4. Consola: PuTTY pe COM, 9600", ic: "⌨️", st: "desk", d: "Pe laptop deschizi PuTTY → Serial → COM" + V.com + " → 9600 → Open, apeși Enter și primești Switch>.", obj: [
        O("PuTTY: Serial, portul COM corect, 9600, Open", "putCom", "Device Manager → Ports (COM & LPT) arată COM" + V.com + ". În PuTTY: Connection type = Serial, Serial line = COM" + V.com + ", Speed = 9600, apoi Open.", "9600 8N1 = viteza standard a consolei Cisco (9600 biți/s, 8 biți de date, fără paritate, 1 bit de stop)."),
        O("Apasă Enter și obține promptul Switch>", "awake", "În fereastra neagră apasă Enter (butonul ⏎ sau tasta Enter).", "> = modul utilizator: doar te uiți."),
        O("Intră în modul privilegiat (Switch#)", "en", "Scrie enable (sau en) și Enter.", "# = modul privilegiat: poți salva, vedea tot, intra în configurare.")] },
      m5: { t: "5. Configurează SSH pe switch cu VLAN " + V.vlan, ic: "🔐", st: "desk", d: "hostname, VLAN și nume, port acces, IP pe interface vlan, domeniu, chei RSA 1024, utilizator, vty doar SSH, salvare.", obj: [
        O("hostname " + V.host, "host", "configure terminal → hostname " + V.host, "Numele apare în prompt și e obligatoriu pentru cheile RSA."),
        O("vlan " + V.vlan + " cu numele " + V.vname, "vlan", "(config)# vlan " + V.vlan + " → name " + V.vname + " → exit", "VLAN = o rețea separată logic pe același switch."),
        O(V.pshort + ": switchport mode access + access vlan " + V.vlan, "acc", "interface " + V.pshort.toLowerCase() + " → switchport mode access → switchport access vlan " + V.vlan + " → exit", "Port acces = aparține unui singur VLAN; laptopul ajunge în VLAN " + V.vlan + "."),
        O("interface vlan " + V.vlan + ": ip address " + V.svi + " " + V.mask + " + no shutdown", "svi", "interface vlan " + V.vlan + " → ip address " + V.svi + " " + V.mask + " → no shutdown → exit", "SVI = adresa IP de administrare a switch-ului. Pe ea intri cu SSH."),
        O("ip domain-name " + V.dom, "dom", "(config)# ip domain-name " + V.dom, "Numele cheii RSA = hostname + domeniu, de aceea trebuie înainte de crypto key."),
        O("crypto key generate rsa (modulus 1024)", "rsa", "(config)# crypto key generate rsa → la întrebare scrie 1024 (sau direct: crypto key generate rsa modulus 1024)", "Cheile RSA pornesc serverul SSH. Minim 768 biți pentru SSH versiunea 2; 1024 e standardul la examen."),
        O("username " + V.user + " secret " + V.pass, "user", "(config)# username " + V.user + " secret " + V.pass, "Contul cu care te loghezi prin SSH. secret = parolă criptată (mai sigur decât password)."),
        O("line vty 0 4: login local + transport input ssh", "vty", "line vty 0 4 → login local → transport input ssh → exit", "vty = liniile virtuale pentru acces de la distanță. login local = cere utilizatorul local; transport input ssh = DOAR SSH, fără telnet."),
        O("copy running-config startup-config", "save", "end → copy running-config startup-config → Enter la întrebare", "running = în RAM (se pierde la restart); startup = în NVRAM. Fără salvare pierzi tot!")] },
      m6: { t: "6. Legătura switch → router și ping", ic: "🔗", st: "rack", d: "Pe router: IP pe " + V.rshort + " și no shutdown. Pe switch: " + V.upshort + " în VLAN-ul laptopului. LED verde, apoi ping de pe laptop.", obj: [
        O("Consolă pe router (al doilea cablu: laptop USB 2 → CON router)", "rcon", "Din cutie ia încă un cablu USB–RJ45: USB 2 la laptop, CON pe spatele routerului. În PuTTY routerul e pe COM" + V.rcom + ".", "Fiecare echipament se configurează prin propria consolă."),
        O("Router: interface " + V.rshort.toLowerCase() + " → ip address " + V.gw + " " + V.mask, "rip", "PuTTY COM" + V.rcom + " → enable → conf t → interface " + V.rshort.toLowerCase() + " → ip address " + V.gw + " " + V.mask, "Adresa routerului = default gateway pentru laptop."),
        O("Router: no shutdown pe " + V.rshort, "rns", "în (config-if)# scrie no shutdown", "Porturile routerului sunt OPRITE din fabrică (administratively down). Pe switch sunt pornite."),
        O("Switch: " + V.upshort + " în VLAN " + V.vlan + " (switchport access vlan " + V.vlan + ")", "upAcc", "PuTTY COM" + V.com + " → conf t → interface " + V.upshort.toLowerCase() + " → switchport mode access → switchport access vlan " + V.vlan, "Laptopul e în VLAN " + V.vlan + "; ca să ajungă la router, și portul spre router trebuie să fie în același VLAN."),
        O("LED verde pe legătura switch – router", "upGreen", "După no shutdown, LED-ul " + V.rshort + " se aprinde; pe switch " + V.upshort + " trece prin portocaliu (STP).", "Verde la ambele capete = legătură fizică bună."),
        O("Laptop: ping " + V.gw + " reușit", "pingGw", "Pe laptop: IP static " + V.pc + " / " + V.mask + ", gateway " + V.gw + "; apoi în cmd: ping " + V.gw, "Reply from = drumul laptop → switch → router funcționează.")] },
      m7: { t: "7. Comenzi pe laptop: IP static, ipconfig, ping, ssh", ic: "💻", st: "desk", d: "Setezi IP-ul din fereastra Windows, verifici cu ipconfig, ping la switch și intri prin SSH.", obj: [
        O("IP static în Windows: " + V.pc + " / " + V.mask + ", gateway " + V.gw, "pcIp", "Laptop → Setări rețea → Ethernet → Properties → Internet Protocol Version 4 → Use the following IP address.", "Laptopul trebuie să fie în aceeași rețea cu switch-ul (" + V.svi + ")."),
        O("cmd: ipconfig", "ipcfg", "Deschide Command Prompt și scrie ipconfig", "ipconfig arată IP-ul, masca și gateway-ul laptopului."),
        O("cmd: ping " + V.svi, "pingSw", "În cmd: ping " + V.svi, "Reply from " + V.svi + " = laptopul vede switch-ul."),
        O("cmd: ssh -l " + V.user + " " + V.svi, "ssh", "În cmd: ssh -l " + V.user + " " + V.svi + " (parola: " + V.pass + ")", "Dacă intri, SSH-ul de pe switch e configurat corect – exact ce verifică examinatorul.")] },
      m9: { t: "9. Fibră optică: conectori și măsurare dBm", ic: "💡", st: "fiber", d: "Recunoști UPC (albastru) / APC (verde), SC / LC, faci referința și calculezi atenuarea.", obj: [O("Exercițiul de la bancul de fibră", "fiber", "Mergi la bancul de fibră optică. Atenuare = Pref − Pmăsurat (în dB).", "dBm = putere față de 1 mW. Pierderea în dB se obține scăzând două valori în dBm.")] }
    };
  }
  var MEX = ["m2", "m3", "m4", "m5", "m6", "m7"], MBON = ["m1", "m9", "b1", "b2", "b3", "b4", "b5"], MORDER = MEX.concat(MBON);
  function faultRep(st) { var f = st.V.faults || []; if (!f.length) return ""; return "<p><b>Defecte ascunse (Greu):</b></p><ul class='jgol'>" + f.map(function (k) { return "<li>⚠️ " + esc(FAULTS[k]) + "</li>"; }).join("") + "</ul>"; }
  function mmss(ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function setupMission(st, id) { if (/^b/.test(id)) return setupBonus(st, id);
    if (id === "m4") preCable(st, ["con", "lan", "up"]);
    if (id === "m5") { preCable(st, ["con", "lan", "up"]); openConsoleSilently(st); }
    if (id === "m6") { preCable(st, ["con", "lan", "up"]); cfgSwitch(st, false); pcStatic(st); }
    if (id === "m7") { preCable(st, ["con", "lan", "up"]); cfgSwitch(st, true); cfgRouter(st); }
  }
  function openConsoleSilently(st) { st.putty = { type: "serial", line: "COM" + st.V.com, speed: "9600", host: "", port: "22" }; st.con = { dev: st.S.sw, open: true, awake: true, title: "COM" + st.V.com + " - PuTTY", kind: "serial", speed: "9600", lines: [] }; B.cliRun(st.S.sw, "enable"); }
  function missionScore(st) { return Math.max(4, Math.round((10 - st.hints * 0.5 - st.err * 0.25) * 10) / 10); }
  function missionDone() {
    var st = G; if (!st || st.scored) return; st.scored = true; var sc = missionScore(st), id = st.mis, P = B.P(); P.cli = P.cli || {};
    P.cli["jg:d:" + id] = P.cli["jg:d:" + id] || now(); var k = "jg:b:" + id; P.cli[k] = Math.max(P.cli[k] || 0, Math.round(sc * 10)); B.saveP(); SFX.done();
    say("Misiune îndeplinită! Nota: " + fmt(sc) + ".", 6000);
    showResult("✅ Misiune îndeplinită", "<p>Nota: <b>" + fmt(sc) + "</b> / 10 · indicii: " + st.hints + " · greșeli: " + st.err + " · timp: " + mmss(now() - st.t0) + "</p>" + (st.tfault ? "<p>Defectul era: <b>" + esc(st.tfault[1]) + "</b></p>" : "") + replayBtn(), true); wireReplay(true);
  }
  function fmt(x) { return (Math.round(x * 100) / 100).toFixed(2).replace(/0$/, "").replace(".", ","); }
  /* ---------- examenul practic (toate punctele, pe timp) ---------- */
  /* barem: 1 din oficiu + 2 identificare + 2 DOAR pentru SSH reușit laptop → switch + 5 împărțite pe celelalte probe = 10; promovat de la 7 */
  var EXG = { ident: ["Identificarea echipamentelor și porturilor", ["ident"], 2], crimp: ["Mufare RJ45 + testare", ["crimp"], 1], cab: ["Cablare (consolă, laptop, switch–router)", ["conSw", "lan", "up"], 1], con: ["Consolă PuTTY (COM, 9600, prompt)", ["putCom", "awake", "en"], 1], cfg: ["Configurare switch: VLAN, SVI, SSH (hostname, domeniu, RSA, user, vty), salvare", ["host", "vlan", "acc", "svi", "dom", "rsa", "user", "vty", "save"], 1], link: ["Legătura switch–router + comenzi pe laptop (IP, ipconfig, ping)", ["rip", "rns", "upAcc", "pcIp", "ipcfg", "pingSw", "pingGw"], 1], ssh: ["Login SSH reușit de pe laptop pe switch", ["ssh"], 2] };
  /* subiectul: ordinea cerințelor e aleatoare pe bilet, dar mereu rezolvabilă (cablare → consolă → configurare → legătură → SSH) */
  function examPlan(V) { var r = mkRng(V.seed ^ 0x9e3779b9), sh = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var phys = sh(["ident", "crimp"]), core = ["cab", "con", "cfg", "link", "ssh"], cut = Math.floor(r() * 3), g = phys.slice(0, cut).concat(core, phys.slice(cut));
    var cfg = sh([["vlan", "acc", "svi"], sh(["host", "dom"]).concat(["rsa"], sh(["user", "vty"]))]), lk = sh([["rip", "rns", "upAcc"], ["pcIp", "ipcfg"]]);
    return { groups: g, ord: { cfg: cfg[0].concat(cfg[1]), link: lk[0].concat(lk[1], sh(["pingSw", "pingGw"]), ["save"]) } }; }
  function allObjs(st) { var M = MS(st), X = {}; Object.keys(M).forEach(function (k) { M[k].obj.forEach(function (o) { if (!X[o.k]) X[o.k] = o; }); }); return X; }
  function examObjs(st) { var X = allObjs(st), P = examPlan(st.V); st.exg = P.groups; var L = []; P.groups.forEach(function (g) { (P.ord[g] || EXG[g][1]).forEach(function (k) { if (X[k]) L.push(X[k]); }); }); return L; }
  function examGrade(st) { var gs = st.exg || Object.keys(EXG); var rows = [["Din oficiu", "–", 1, 1]].concat(gs.map(function (g) { var w = EXG[g], ok = w[1].filter(function (k) { try { return CK[k](st); } catch (e) { return false; } }).length, p = g === "ssh" ? (ok ? 2 : 0) : w[2] * ok / w[1].length; return [w[0], ok + "/" + w[1].length, p, w[2]]; })); var tot = rows.reduce(function (a, r) { return a + r[2]; }, 0), pen = st.hints * (DIFF === "greu" ? 0.5 : 0.25); tot = Math.max(1, Math.min(10, tot - pen)); return { rows: rows, g: Math.round(tot * 100) / 100, pen: pen }; }
  function examSubmit(timeout) {
    var st = G; if (!st || st.scored) return; st.scored = true; closePanel(); var R = examGrade(st), P = B.P(); P.cli = P.cli || {};
    P.cli["jg:b:ex"] = Math.max(P.cli["jg:b:ex"] || 0, Math.round(R.g * 10)); P.cli["jg:d:ex"] = P.cli["jg:d:ex"] || now(); st.res.prac = R.g; B.saveP();
    var pass = R.g >= 7; if (pass) SFX.done(); else SFX.bad();
    var h = '<table class="jgtab"><tr><td><b>Probă</b></td><td><b>Bifat</b></td><td><b>Puncte</b></td></tr>' + R.rows.map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td>" + r[1] + "</td><td><b>" + fmt(r[2]) + "</b>/" + fmt(r[3]) + "</td></tr>"; }).join("") + "</table><p>Indicii folosite: " + st.hints + " (−" + (DIFF === "greu" ? "0,5" : "0,25") + " fiecare)" + (timeout ? " · <b>timpul a expirat</b>" : "") + "</p>" + faultRep(st) + "<p class='jggrade " + (pass ? "ok" : "bad") + "'>Nota la proba practică: <b>" + fmt(R.g) + "</b> – " + (pass ? "ADMIS" : "RESPINS (minim 7)") + "</p>";
    if (st.mode === "story") { st.story.prac = R.g; say(pass ? "Felicitări! Ați promovat proba practică cu nota " + fmt(R.g) + "." : "Nota " + fmt(R.g) + ". Sub 7 – proba practică nu e promovată.", 7000, !pass); storyFinal(h); }
    else { say(pass ? "Proba practică: nota " + fmt(R.g) + ". Admis!" : "Nota " + fmt(R.g) + ". Mai exersați punctele cu puncte pierdute.", 7000, !pass); showResult("📋 Fișa de evaluare – proba practică", h + replayBtn(), true); wireReplay(true); }
  }
