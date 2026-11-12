  /* ===== dispozitive și comenzi suplimentare: SW2, DHCP pe router, rutare între VLAN-uri ===== */
  function allowHas(f, v) { if (!f || f.mode !== "trunk") return false; if (f.allow == null) return true; if (f.allow === "none") return false; return String(f.allow).split(",").some(function (p) { var m = /^(\d+)(?:-(\d+))?$/.exec(p); return m && v >= +m[1] && v <= +(m[2] || m[1]); }); }
  function swOf(st, a) { return a.indexOf("s2.") === 0 ? st.S.s2 : a.charAt(0) === "s" ? st.S.sw : st.S.r; }
  function ledUp(st, a) { return st.led[a] === "green" || st.led[a] === "blink"; }
  /* răspunde routerul în VLAN-ul lv la adresa ip? (interfață fizică în VLAN de acces sau sub-interfață dot1Q pe trunk) */
  function rtrIn(st, lv, ip) { var V = st.V, r = st.S.r, sw = st.S.sw, u = sw.ifs[V.up], g = r.ifs[V.rif]; if (!uplinkFwd(st) || !g || g.shut || !u || u.shut) return null;
    if (g.ip && (!ip || g.ip === ip) && (u.mode !== "trunk" ? (u.vlan || 1) === lv : lv === 1)) return g;
    var hit = null; Object.keys(r.ifs).forEach(function (n) { var f = r.ifs[n]; if (n.indexOf(V.rif + ".") === 0 && f.enc === lv && f.ip && !f.shut && (!ip || f.ip === ip) && allowHas(u, lv)) hit = f; }); return hit; }
  function rtrUpIps(st) { var V = st.V, r = st.S.r, g = r.ifs[V.rif], ips = []; if (!g || g.shut) return ips; if (g.ip) ips.push(g.ip); Object.keys(r.ifs).forEach(function (n) { var f = r.ifs[n]; if (n.indexOf(V.rif + ".") === 0 && f.ip && f.enc && !f.shut) ips.push(f.ip); }); return ips; }
  function s2In(st, lv, ip) { var s2 = st.S.s2, V = st.V; if (!s2) return false; var c = cableAt(st, V.tr); if (!c || other(c, V.tr) !== "s2.gi1" || !(c.t === "straight" || c.t === "cross")) return false; if (!ledUp(st, V.tr) || !ledUp(st, "s2.gi1")) return false;
    var a = st.S.sw.ifs[ifOf(V.tr)], b = s2.ifs["GigabitEthernet0/1"]; if (!allowHas(a, lv) || !allowHas(b, lv) || !st.S.sw.vlans[lv] || !s2.vlans[lv]) return false; var f = s2.ifs["Vlan" + lv]; return !!(f && f.ip === ip && !f.shut); }
  function pcReach(st, ip) { var S = st.S, L = S.pc, sw = S.sw; if (!L.ip || !B.ipOk(ip)) return false; if (ip === L.ip || ip === "127.0.0.1") return true; if (!fwd(st)) return false;
    var p1 = sw.ifs[S.pcPort]; if (!p1 || p1.shut) return false; var lv = p1.mode === "trunk" ? 1 : (p1.vlan || 1); if (!sw.vlans[lv]) return false;
    if (B.ipIn(ip, L.ip, L.mask)) { var svi = sw.ifs["Vlan" + lv]; if (svi && svi.ip === ip && !svi.shut) return true; var g = rtrIn(st, lv, ip); if (g && B.ipIn(ip, g.ip, g.mask)) return true; return s2In(st, lv, ip); }
    if (!L.gw || !B.ipIn(L.gw, L.ip, L.mask)) return false; var gw = rtrIn(st, lv, L.gw); if (!gw || !B.ipIn(L.gw, gw.ip, gw.mask)) return false; return rtrUpIps(st).indexOf(ip) >= 0; }
  function dhcpGet(st) { var S = st.S, r = S.r, L = S.pc, sw = S.sw; if (!fwd(st) || !r.dpool) return null; var p1 = sw.ifs[S.pcPort]; if (!p1 || p1.shut) return null; var lv = p1.vlan || 1, g = rtrIn(st, lv, null); if (!g || !g.ip) return null;
    var pool = null; Object.keys(r.dpool).forEach(function (k) { var p = r.dpool[k]; if (p.net && p.mask && B.ipIn(g.ip, p.net, p.mask)) pool = p; }); if (!pool) return null;
    var n = pool.net.split(".").map(Number), m = pool.mask.split(".").map(Number), base = ((n[0] & m[0]) << 24 | (n[1] & m[1]) << 16 | (n[2] & m[2]) << 8 | (n[3] & m[3])) >>> 0, hz = (~((m[0] << 24 | m[1] << 16 | m[2] << 8 | m[3]) >>> 0)) >>> 0, ex = r.dexcl || [];
    var used = [g.ip]; Object.keys(sw.ifs).forEach(function (k) { if (sw.ifs[k].ip) used.push(sw.ifs[k].ip); });
    for (var h = 1; h < hz && h < 4096; h++) { var ip = i2ip((base + h) >>> 0), x = (base + h) >>> 0; if (used.indexOf(ip) >= 0) continue; if (ex.some(function (e) { return x >= e[0] && x <= e[1]; })) continue; return { ip: ip, mask: pool.mask, gw: pool.gw || "", dns: pool.dns || "" }; }
    return null; }
  function ip2i(ip) { var p = ip.split(".").map(Number); return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0; }
  function pfx(t, w, n) { t = (t || "").toLowerCase(); return t.length >= (n || 1) && w.indexOf(t) === 0; }
  /* interpretorul IOS al jocului = motorul verificat din aplicație + DHCP (ip dhcp pool) */
  function gPrompt(s) { if (s.mode === "dhcp") return s.host + "(dhcp-config)#"; return B.cliPrompt(s); }
  function gRun(s, v) {
    var t = String(v).trim().split(/\s+/).filter(Boolean), o = [];
    if (s.pend) return B.cliRun(s, v);
    if (s.mode === "dhcp") {
      if (!t.length) return []; var P = s.dpool[s.dctx];
      if (pfx(t[0], "network", 3)) { if (!t[1] || !B.ipOk(t[1])) return [t[1] ? "% Invalid input detected at '^' marker." : "% Incomplete command."]; if (t[2] && !B.maskOk(t[2])) return ["% Invalid input detected at '^' marker."]; P.net = t[1]; P.mask = t[2] || (+t[1].split(".")[0] < 128 ? "255.0.0.0" : +t[1].split(".")[0] < 192 ? "255.255.0.0" : "255.255.255.0"); return []; }
      if (pfx(t[0], "default-router", 3)) { if (!t[1] || !B.ipOk(t[1])) return ["% Incomplete command."]; P.gw = t[1]; return []; }
      if (pfx(t[0], "dns-server", 2)) { if (!t[1] || !B.ipOk(t[1])) return ["% Incomplete command."]; P.dns = t[1]; return []; }
      if (pfx(t[0], "domain-name", 2)) { P.dom = t[1] || ""; return []; }
      if (pfx(t[0], "lease", 2)) return [];
      if (pfx(t[0], "exit", 2)) { s.mode = "config"; s.dctx = null; return []; }
      if (pfx(t[0], "end", 2)) { s.mode = "priv"; s.dctx = null; return ["%SYS-5-CONFIG_I: Configured from console by console"]; }
      if (t[0] === "?") return ["  default-router  Default routers", "  dns-server      DNS servers", "  domain-name     Domain name", "  exit            Exit from DHCP pool configuration mode", "  lease           Address lease time", "  network         Network number and mask"];
      if (pfx(t[0], "do", 2)) { s.mode = "priv"; var r0 = gRun(s, t.slice(1).join(" ")); if (s.mode === "priv") s.mode = "dhcp"; return r0; }
      s.mode = "config"; s.dctx = null; return gRun(s, v);
    }
    var cfg = s.mode === "config" || s.mode === "if" || s.mode === "line" || s.mode === "vlan";
    if (cfg && t.length >= 4 && t[0] === "no" && pfx(t[1], "ip", 2) && pfx(t[2], "dhcp", 2) && pfx(t[3], "excluded-address", 2) && s.dev === "router") { if (!t[4] || !B.ipOk(t[4])) return ["% Incomplete command."]; var x1 = ip2i(t[4]), x2 = ip2i(t[5] || t[4]), n0 = (s.dexcl || []).length; s.dexcl = (s.dexcl || []).filter(function (e) { return !(e[0] === x1 && e[1] === x2); }); return n0 === s.dexcl.length ? ["% Range [" + t[4] + ", " + (t[5] || t[4]) + "] is not in the excluded list"] : []; }
    if (cfg && t.length >= 2 && pfx(t[0], "ip", 2) && pfx(t[1], "dhcp", 2)) {
      if (s.dev !== "router") return ["(Pe Catalyst 2960 din examen serverul DHCP se face pe router.)"];
      if (pfx(t[2], "pool", 2)) { if (!t[3]) return ["% Incomplete command."]; s.dpool = s.dpool || {}; s.dpool[t[3]] = s.dpool[t[3]] || { net: "", mask: "", gw: "", dns: "" }; s.mode = "dhcp"; s.dctx = t[3]; return []; }
      if (pfx(t[2], "excluded-address", 2)) { if (!t[3] || !B.ipOk(t[3]) || (t[4] && !B.ipOk(t[4]))) return ["% Incomplete command."]; s.dexcl = s.dexcl || []; s.dexcl.push([ip2i(t[3]), ip2i(t[4] || t[3])]); return []; }
      return ["% Incomplete command."];
    }
    if (cfg && t.length >= 2 && t[0] === "no" && pfx(t[1], "ip", 2) && pfx(t[2], "dhcp", 2) && pfx(t[3], "pool", 2) && s.dpool) { delete s.dpool[t[4]]; return []; }
    var out = B.cliRun(s, v);
    if (s.dev === "router" && /^\s*(do\s+)?sh(o|ow)?\s+(ip\s+dhcp\s+b|ip\s+dh\w*\s+b)/i.test(v)) { var L = G.S.pc; out = ["Bindings from all pools not associated with VRF:", "IP address          Client-ID/              Lease expiration        Type", "                    Hardware address/", "                    User name"]; if (L.dhcp && L.ipFrom === "dhcp") out.push(pad2(L.ip, 20) + "0100.1e64.a1b2.c3      Oct 20 2026 08:00 AM    Automatic"); return out; }
    if (s.dev === "router" && s.dpool && /^\s*(do\s+)?sh\w*\s+run/i.test(v)) { var ix = out.lastIndexOf("end"), add = []; (s.dexcl || []).forEach(function (e) { add.push("ip dhcp excluded-address " + i2ip(e[0]) + (e[1] !== e[0] ? " " + i2ip(e[1]) : "")); }); Object.keys(s.dpool).forEach(function (k) { var p = s.dpool[k]; add.push("ip dhcp pool " + k); if (p.net) add.push(" network " + p.net + " " + p.mask); if (p.gw) add.push(" default-router " + p.gw); if (p.dns) add.push(" dns-server " + p.dns); add.push("!"); }); if (ix > 0) out.splice.apply(out, [ix, 0].concat(add)); }
    return out;
  }
  function pad2(x, n) { x = String(x); while (x.length < n) x += " "; return x; }
  /* ---------- misiunile bonus (toate pe timp, valori aleatoare) ---------- */
  function O2(t, k, ok, hint, why) { return { t: t, k: k, ok: ok, hint: hint, why: why }; }
  function BONUS(st) {
    var V = st.V, A = V.vlan, Bv = V.vlan2, tr = ifOf(V.tr), trs = tr.replace("GigabitEthernet", "Gi"), sw = function () { return st.S.sw; }, s2 = function () { return st.S.s2; }, r = function () { return st.S.r; }, L = function () { return st.S.pc; };
    return {
      b1: { t: "Trunk între 2 switch-uri (802.1Q)", ic: "🔀", st: "rack", d: "Legi SW1 (" + trs + ") de SW2 (Gi0/1), faci trunk cu VLAN-urile " + A + " și " + Bv + " permise și dai ping de pe laptop la SW2.", obj: [
        O2("Cablu între SW1 " + trs + " și SW2 Gi0/1", "tcab", function () { var c = cableAt(st, V.tr); return !!c && other(c, V.tr) === "s2.gi1" && (c.t === "straight" || c.t === "cross"); }, "Din cutie: cablu drept (auto-MDIX) sau crossover (clasic pentru switch–switch). " + trs + " pe SW1 → Gi0/1 pe SW2.", "Switch–switch = echipamente de același fel: clasic crossover; azi auto-MDIX acceptă și cablu drept."),
        O2("Consolă pe SW2 (laptop USB 2 → CONSOLE SW2)", "s2con", function () { return !!conCable(st, "s2"); }, "Al doilea cablu USB–RJ45: USB 2 la laptop, CONSOLE pe SW2. Apare pe COM" + V.rcom + ".", "Fiecare switch are propria consolă."),
        O2("SW1 " + trs + ": switchport mode trunk + allowed vlan " + A + "," + Bv, "t1", function () { var f = sw().ifs[tr]; return allowHas(f, A) && allowHas(f, Bv) && f.allow != null; }, "PuTTY COM" + V.com + " → conf t → interface " + trs.toLowerCase() + " → switchport mode trunk → switchport trunk allowed vlan " + A + "," + Bv, "Trunk = un singur cablu care duce mai multe VLAN-uri, fiecare cadru cu eticheta 802.1Q (numărul VLAN-ului). allowed = doar VLAN-urile listate trec."),
        O2("SW2: vlan " + A + " și vlan " + Bv, "s2v", function () { return !!(s2().vlans[A] && s2().vlans[Bv]); }, "PuTTY COM" + V.rcom + " → enable → conf t → vlan " + A + " → exit → vlan " + Bv + " → exit", "VLAN-ul trebuie să existe pe fiecare switch prin care trece (fără VTP)."),
        O2("SW2 Gi0/1: switchport mode trunk + allowed vlan " + A + "," + Bv, "t2", function () { var f = s2().ifs["GigabitEthernet0/1"]; return allowHas(f, A) && allowHas(f, Bv) && f.allow != null; }, "Pe SW2: interface gi0/1 → switchport mode trunk → switchport trunk allowed vlan " + A + "," + Bv, "Ambele capete ale trunk-ului trebuie să fie trunk, cu aceleași VLAN-uri permise."),
        O2("SW2: interface vlan " + A + " → " + V.s2ip + " " + V.mask + ", no shutdown", "s2svi", function () { var f = s2().ifs["Vlan" + A]; return !!f && f.ip === V.s2ip && f.mask === V.mask && !f.shut; }, "interface vlan " + A + " → ip address " + V.s2ip + " " + V.mask + " → no shutdown", "Adresa de administrare a lui SW2, în VLAN-ul laptopului."),
        O2("Laptop: ping " + V.s2ip + " (SW2, prin trunk)", "pingS2", function () { var d = L().did; return !!(d.ping && d.ping[V.s2ip]); }, "În cmd pe laptop: ping " + V.s2ip + ". Dacă nu merge: LED verde pe trunk? VLAN " + A + " permis pe ambele capete?", "Reply = cadrul a plecat din VLAN " + A + ", a trecut etichetat prin trunk și a ajuns la SW2.")] },
      b2: { t: "Router-on-a-stick (dot1Q)", ic: "🪵", st: "desk", d: "Pe un singur port fizic " + V.rshort + ": sub-interfețe pentru VLAN " + A + " și " + Bv + ", trunk pe switch, ping între VLAN-uri.", obj: [
        O2("Switch " + V.upshort + ": switchport mode trunk (VLAN " + A + " și " + Bv + " permise)", "rtk", function () { var f = sw().ifs[V.up]; return allowHas(f, A) && allowHas(f, Bv) && !f.shut; }, "PuTTY COM" + V.com + " → conf t → interface " + V.upshort.toLowerCase() + " → switchport mode trunk (opțional: switchport trunk allowed vlan " + A + "," + Bv + ")", "Routerul primește ambele VLAN-uri pe același cablu, etichetate 802.1Q."),
        O2("Router " + V.rshort + "." + A + ": encapsulation dot1Q " + A + " + ip " + V.gw + " " + V.mask, "subA", function () { var f = r().ifs[V.rif + "." + A]; return !!f && f.enc === A && f.ip === V.gw && f.mask === V.mask; }, "PuTTY COM" + V.rcom + " → conf t → interface " + V.rshort.toLowerCase() + "." + A + " → encapsulation dot1Q " + A + " → ip address " + V.gw + " " + V.mask, "Sub-interfața = o interfață logică pe portul fizic; dot1Q " + A + " = acceptă cadrele etichetate cu VLAN " + A + "."),
        O2("Router " + V.rshort + "." + Bv + ": encapsulation dot1Q " + Bv + " + ip " + V.gw2 + " " + V.mask, "subB", function () { var f = r().ifs[V.rif + "." + Bv]; return !!f && f.enc === Bv && f.ip === V.gw2 && f.mask === V.mask; }, "interface " + V.rshort.toLowerCase() + "." + Bv + " → encapsulation dot1Q " + Bv + " → ip address " + V.gw2 + " " + V.mask, "Fiecare VLAN = altă rețea IP, cu gateway-ul lui pe router."),
        O2("Router: no shutdown pe interfața fizică " + V.rshort, "rns", CK.rns, "interface " + V.rshort.toLowerCase() + " → no shutdown", "Sub-interfețele urmează starea interfeței fizice: fără no shutdown pe " + V.rshort + " nu merge nimic."),
        O2("Laptop: ping " + V.gw + " (gateway VLAN " + A + ")", "pA", function () { var d = L().did; return !!(d.ping && d.ping[V.gw]); }, "cmd → ping " + V.gw, "Laptopul ajunge la sub-interfața din VLAN-ul lui."),
        O2("Laptop: ping " + V.gw2 + " (alt VLAN – rutare între VLAN-uri)", "pB", function () { var d = L().did; return !!(d.ping && d.ping[V.gw2]); }, "cmd → ping " + V.gw2 + " (pachetul merge la gateway-ul " + V.gw + ", routerul îl rutează în VLAN " + Bv + ")", "Inter-VLAN routing: comunicarea între VLAN-uri trece obligatoriu printr-un echipament de nivel 3.")] },
      b3: { t: "DHCP pe router", ic: "📡", st: "desk", d: "Faci un pool DHCP pe router pentru rețeaua " + V.net + "/" + V.pre + " și laptopul ia singur adresa.", obj: [
        O2("ip dhcp excluded-address " + V.gw + " (adresa routerului nu se dă)", "dex", function () { var x = ip2i(V.gw); return (r().dexcl || []).some(function (e) { return x >= e[0] && x <= e[1]; }); }, "PuTTY COM" + V.rcom + " → conf t → ip dhcp excluded-address " + V.gw + (V.svi ? " (poți exclude și " + V.svi + ")" : ""), "Adresele excluse nu sunt date clienților: gateway-ul, switch-ul, serverele."),
        O2("ip dhcp pool LAN: network " + V.net + " " + V.mask, "dnet", function () { var P = r().dpool || {}; return Object.keys(P).some(function (k) { return P[k].net && B.ipIn(V.gw, P[k].net, P[k].mask) && P[k].mask === V.mask; }); }, "(config)# ip dhcp pool LAN → network " + V.net + " " + V.mask, "Pool = intervalul din care routerul împarte adrese."),
        O2("default-router " + V.gw, "dgw", function () { var P = r().dpool || {}; return Object.keys(P).some(function (k) { return P[k].gw === V.gw; }); }, "(dhcp-config)# default-router " + V.gw, "Clientul primește și gateway-ul, nu doar IP-ul."),
        O2("Laptop: „Obtain an IP address automatically” + adresă primită din pool", "dgot", function () { var l = L(); return l.dhcp && l.ipFrom === "dhcp" && B.ipIn(l.ip, V.gw, V.mask) && l.gw === V.gw; }, "Laptop → Setări rețea → IPv4 → Obtain an IP address automatically → OK; apoi cmd → ipconfig /renew", "DHCP = Discover → Offer → Request → Ack (DORA)."),
        O2("cmd: ipconfig (verifici adresa primită)", "dcfg", function () { var l = L(); return l.ipFrom === "dhcp" && (!!l.did.ip || !!l.did.ipall); }, "cmd → ipconfig (sau ipconfig /all ca să vezi și serverul DHCP)", "ipconfig /all arată „DHCP Enabled: Yes” și serverul DHCP.")] },
      b4: { t: "Securitate de bază pe switch", ic: "🛡️", st: "desk", d: "enable secret, parolă pe consolă, criptarea parolelor, banner motd și salvare.", obj: [
        O2("enable secret " + V.en, "esec", function () { return sw().secret === V.en; }, "conf t → enable secret " + V.en, "Parola pentru modul privilegiat (#), stocată criptat (MD5/SHA). secret e mai bun decât enable password."),
        O2("line console 0: password " + V.conpw + " + login", "conp", function () { var l = sw().line.con; return l.pw === V.conpw && l.login; }, "line console 0 → password " + V.conpw + " → login → exit", "Fără login, parola de consolă nu e cerută!"),
        O2("service password-encryption", "spe", function () { return !!sw().enc; }, "(config)# service password-encryption", "Criptează (tip 7, slab) parolele scrise în clar în configurație – să nu le vadă cine se uită peste umăr."),
        O2("banner motd cu textul: " + V.motd, "ban", function () { return String(sw().banner || "").indexOf(V.motd) >= 0; }, "(config)# banner motd #" + V.motd + "#", "MOTD = mesajul afișat la conectare (avertisment legal)."),
        O2("copy running-config startup-config", "save", CK.save, "end → copy running-config startup-config → Enter", "Salvezi în NVRAM, altfel se pierde la restart.")] },
      b5: { t: "Depanare: găsește defectul", ic: "🧰", st: "examiner", d: "Rețeaua era funcțională, dar cineva a stricat ceva (aleator). Găsește defectul, repară-l și spune examinatorului ce era.", obj: [
        O2("Laptop: ping " + V.svi + " (switch) reușit", "tpS", function () { var d = L().did; return !!(d.ping && d.ping[V.svi]); }, "Verifică în ordine: LED-uri (cabluri), show ip interface brief / show vlan brief pe switch, ipconfig pe laptop.", "Depanare de jos în sus: fizic → VLAN → IP."),
        O2("Laptop: ping " + V.gw + " (router) reușit", "tpG", function () { var d = L().did; return !!(d.ping && d.ping[V.gw]); }, "Dacă switch-ul răspunde dar routerul nu: legătura " + V.upshort + "–" + V.rshort + ", no shutdown pe router, VLAN-ul portului spre router.", "Gateway-ul trebuie să fie în aceeași rețea cu laptopul."),
        O2("Spune examinatorului care a fost defectul", "diag", function () { return !!st.diagOK; }, "Mergi la examinator și alege defectul găsit.", "La examen explici și CE ai găsit, nu doar repari.")] }
    };
  }
  var TFAULTS = [["cable", "Cablul switch → router era unul de consolă (rollover), nu cablu drept"], ["shut", "Portul laptopului de pe switch era oprit (shutdown)"], ["vlan", "Portul laptopului era în alt VLAN"], ["mask", "Laptopul avea masca de rețea greșită"], ["gw", "Laptopul avea default gateway greșit"], ["rshut", "Interfața routerului era oprită (shutdown)"]];
  function setupBonus(st, id) {
    var V = st.V, r = mkRng(V.seed ^ 0xb0b);
    if (id === "b1") { st.S.s2 = B.cliNew("switch"); st.S.s2.unpl = {}; Object.keys(st.S.s2.ifs).forEach(function (n) { if (!/^Vlan/.test(n)) st.S.s2.unpl[n] = 1; }); preCable(st, ["con", "lan"]); B.cliRun(st.S.s2, "enable"); ["enable", "configure terminal", "hostname SW2", "end", ""].forEach(function (c) { B.cliRun(st.S.s2, c); }); st.S.s2.mode = "user"; st.S.s2.hist = []; st.S.s2.did = {};
      ["enable", "configure terminal", "hostname " + V.host, "vlan " + V.vlan, "name " + V.vname, "exit", "vlan " + V.vlan2, "name " + V.vname2, "exit", "interface " + V.port, "switchport mode access", "switchport access vlan " + V.vlan, "end", ""].forEach(function (c) { B.cliRun(st.S.sw, c); }); st.S.sw.mode = "user"; st.S.sw.hist = []; st.S.sw.did = {}; pcStatic(st); openConsoleSilently(st); }
    if (id === "b2") { preCable(st, ["con", "lan", "up", "rcon"]); ["enable", "configure terminal", "hostname " + V.host, "vlan " + V.vlan, "name " + V.vname, "exit", "vlan " + V.vlan2, "name " + V.vname2, "exit", "interface " + V.port, "switchport mode access", "switchport access vlan " + V.vlan, "end", ""].forEach(function (c) { B.cliRun(st.S.sw, c); }); st.S.sw.mode = "user"; st.S.sw.hist = []; st.S.sw.did = {}; pcStatic(st); }
    if (id === "b3") { preCable(st, ["con", "lan", "up", "rcon"]); cfgSwitch(st, true); cfgRouter(st); var l = st.S.pc; l.dhcp = false; l.ip = V.pc; l.mask = V.mask; l.gw = ""; }
    if (id === "b4") { preCable(st, ["con"]); openConsoleSilently(st); B.cliRun(st.S.sw, "disable"); }
    if (id === "b5") { preCable(st, ["con", "lan", "up", "rcon"]); cfgSwitch(st, true); cfgRouter(st); pcStatic(st); var TF = TFAULTS.filter(function (x) { return x[0] !== "gw"; }), f = TF[Math.floor(r() * TF.length)]; st.tfault = f;
      var run = function (dev, cs) { ["enable", "configure terminal"].concat(cs, ["end", ""]).forEach(function (c) { B.cliRun(dev, c); }); dev.mode = "user"; dev.hist = []; dev.did = {}; };
      if (f[0] === "cable") { var u = uplink(st); removeCable(st, u); addCable(st, "roll", V.upa, V.ra, true); }
      if (f[0] === "shut") run(st.S.sw, ["interface " + V.port, "shutdown"]);
      if (f[0] === "vlan") run(st.S.sw, ["vlan " + (V.vlan === 2 ? 3 : V.vlan - 1), "exit", "interface " + V.port, "switchport access vlan " + (V.vlan === 2 ? 3 : V.vlan - 1)]);
      if (f[0] === "mask") st.S.pc.mask = V.mask === "255.255.255.252" ? "255.255.255.255" : "255.255.255.252";
      if (f[0] === "gw") { var g = V.gw.split("."); g[3] = String((+g[3] % 250) + 3); st.S.pc.gw = g.join(".") === V.svi || g.join(".") === V.pc ? V.svi.replace(/\d+$/, "0") : g.join("."); }
      if (f[0] === "rshut") run(st.S.r, ["interface " + V.rif, "shutdown"]);
      if (f[0] === "mask") { var pc = st.S.pc; if (B.ipIn(V.svi, pc.ip, pc.mask) && B.ipIn(V.gw, pc.ip, pc.mask)) pc.mask = "255.255.255.255"; }
      st.S.pc.did = {}; }
    if (id === "m9" || id === "m1") {}
  }
  function diagQ(st) { var opts = TFAULTS.map(function (f) { return f; }); return '<h3>Ce defect ai găsit?</h3><div class="jgopts">' + opts.map(function (f) { return '<button data-f data-dg="' + f[0] + '">' + esc(f[1]) + "</button>"; }).join("") + "</div>"; }
  function wireDiag(st) { Array.prototype.forEach.call(document.querySelectorAll("[data-dg]"), function (b) { b.onclick = function () { if (b.getAttribute("data-dg") === st.tfault[0]) { st.diagOK = true; SFX.ok(); learn("✅ Defect identificat: " + st.tfault[1]); checkObj(); closePanel(); } else mistake("Nu acesta a fost defectul. Mai verifică (LED-uri, show vlan brief, show ip interface brief, ipconfig).", "Diagnosticul trebuie să se bazeze pe ce vezi, nu pe ghicit."); }; }); }
