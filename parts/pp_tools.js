  /* ================= PROBA PRACTICĂ: player animații, simulator CLI, exerciții interactive ================= */
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ICA = {
    play: ic('<path d="M7 4l13 8-13 8z" fill="currentColor"/>'),
    pause: ic('<path d="M7 4v16M17 4v16" stroke-width="3.2"/>'),
    next: ic('<path d="M5 4l10 8-10 8z" fill="currentColor"/><path d="M19 4v16" stroke-width="2.6"/>'),
    prev: ic('<path d="M19 4L9 12l10 8z" fill="currentColor"/><path d="M5 4v16" stroke-width="2.6"/>'),
    again: ic('<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>'),
    term: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>'),
    plug: ic('<path d="M7 3h10v7a5 5 0 0 1-10 0z"/><path d="M10 3v3M14 3v3M12 15v6"/>'),
    meter: ic('<rect x="5" y="2" width="14" height="20" rx="3"/><rect x="8" y="5" width="8" height="4" rx="1"/><circle cx="12" cy="15" r="3"/>'),
    film: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>'),
    list: ic('<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>'),
    photo: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>')
  };
  function wireAnims(root) {
    Array.prototype.forEach.call((root || app).querySelectorAll(".anim[data-anim]"), function (el) {
      if (el.getAttribute("data-w")) return; el.setAttribute("data-w", "1");
      var A = window.ANIMS && ANIMS[el.getAttribute("data-anim")]; if (!A) return;
      var i = 0, playing = false, tmr = null, t0 = 0, left = 0, svg = null;
      el.innerHTML = '<div class="ahd"><b>' + ICA.film + " " + esc(A.t) + '</b><span class="astep"></span></div><div class="astage"></div><div class="acap" aria-live="polite"></div><div class="actl"><button class="abtn" data-a="prev" aria-label="Pasul anterior">' + ICA.prev + '</button><button class="abtn main" data-a="play" aria-label="Pornește / pauză">' + ICA.play + '</button><button class="abtn" data-a="next" aria-label="Pasul următor">' + ICA.next + '</button><button class="abtn" data-a="again" aria-label="De la început">' + ICA.again + "</button></div>";
      var stage = el.querySelector(".astage"), cap = el.querySelector(".acap"), stp = el.querySelector(".astep"), pb = el.querySelector('[data-a="play"]');
      function alive() { return document.body.contains(el); }
      function paintBtn() { pb.innerHTML = playing ? ICA.pause : (el.getAttribute("data-done") ? ICA.again : ICA.play); }
      function render(still) {
        var s = A.steps[i];
        stage.innerHTML = '<svg viewBox="' + A.vb + '" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" font-size="12" role="img" aria-label="' + esc(A.t) + '">' + s.s + "</svg>";
        svg = stage.firstChild; cap.textContent = s.c; stp.textContent = (i + 1) + "/" + A.steps.length;
        if (still && svg.pauseAnimations) { svg.pauseAnimations(); try { svg.setCurrentTime(s.d / 1000); } catch (e) {} }
      }
      function schedule(ms) { clearTimeout(tmr); t0 = Date.now(); left = ms; tmr = setTimeout(function () { if (!alive()) return stop(); if (i < A.steps.length - 1) { i++; render(false); schedule(A.steps[i].d + 900); } else { el.setAttribute("data-done", "1"); stop(); } }, ms); }
      function play() { if (playing) return; playing = true; if (svg && svg.unpauseAnimations && left > 0 && el.getAttribute("data-p")) { svg.unpauseAnimations(); el.removeAttribute("data-p"); schedule(left); } else { if (el.getAttribute("data-done")) { i = 0; el.removeAttribute("data-done"); } render(false); schedule(A.steps[i].d + 900); } paintBtn(); }
      function stop() { playing = false; clearTimeout(tmr); paintBtn(); }
      function pause() { if (!playing) return; left = Math.max(0, left - (Date.now() - t0)); if (svg && svg.pauseAnimations) svg.pauseAnimations(); el.setAttribute("data-p", "1"); stop(); }
      pb.onclick = function () { if (playing) pause(); else play(); };
      el.querySelector('[data-a="next"]').onclick = function () { stop(); el.removeAttribute("data-p"); el.removeAttribute("data-done"); left = 0; if (i < A.steps.length - 1) i++; render(RM); paintBtn(); };
      el.querySelector('[data-a="prev"]').onclick = function () { stop(); el.removeAttribute("data-p"); el.removeAttribute("data-done"); left = 0; if (i > 0) i--; render(RM); paintBtn(); };
      el.querySelector('[data-a="again"]').onclick = function () { stop(); el.removeAttribute("data-p"); el.removeAttribute("data-done"); left = 0; i = 0; if (RM) render(true); else play(); paintBtn(); };
      render(true); paintBtn();
      if (!RM && window.IntersectionObserver) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); if (alive() && !playing && i === 0 && !el.getAttribute("data-p")) play(); } }, { threshold: 0.6 }); io.observe(el); }
    });
  }
  function wireGo(root) { Array.prototype.forEach.call((root || app).querySelectorAll("[data-go]"), function (b) { b.onclick = function () { go(b.getAttribute("data-go")); }; }); }
  /* ---------- simulator Cisco IOS ---------- */
  var CLI_TASKS = [
    { id: "base", dev: "switch", t: "Configurare de bază switch", d: "Nume SW1, parolă privilegiată criptată (enable secret), parolă pe consolă cu login, criptarea parolelor, banner MOTD, salvare.", g: [
      ["hostname SW1", function (s) { return s.host === "SW1"; }, "configure terminal → hostname SW1"],
      ["enable secret setată", function (s) { return !!s.secret; }, "enable secret <parolă>"],
      ["consolă: parolă + login", function (s) { return s.line.con.pw && s.line.con.login; }, "line console 0 → password cisco → login"],
      ["service password-encryption", function (s) { return s.enc; }, "service password-encryption"],
      ["banner motd", function (s) { return !!s.banner; }, "banner motd #Acces autorizat#"],
      ["configurația salvată", function (s) { return s.saved && s.saved.host === "SW1" && cfgEq(s); }, "end → copy running-config startup-config"]] },
    { id: "rtr", dev: "router", t: "Router: interfața G0/0 și IP", d: "Nume R1, G0/0 cu 192.168.1.1/24 activă (up/up), verificare cu show ip interface brief, salvare.", g: [
      ["hostname R1", function (s) { return s.host === "R1"; }, "configure terminal → hostname R1"],
      ["G0/0 = 192.168.1.1 255.255.255.0", function (s) { var f = s.ifs["GigabitEthernet0/0"]; return f.ip === "192.168.1.1" && f.mask === "255.255.255.0"; }, "interface g0/0 → ip address 192.168.1.1 255.255.255.0"],
      ["G0/0 pornită (no shutdown)", function (s) { return !s.ifs["GigabitEthernet0/0"].shut; }, "(în interfață) no shutdown"],
      ["verificat cu show ip interface brief", function (s) { return s.did.sipib; }, "end → show ip interface brief"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "vlan", dev: "switch", t: "VLAN-uri pe switch", d: "VLAN 10 ADMIN, VLAN 20 TEHNIC; Fa0/1 acces în VLAN 10, Fa0/2 acces în VLAN 20; verificare cu show vlan brief; salvare.", g: [
      ["VLAN 10 cu numele ADMIN", function (s) { return s.vlans[10] === "ADMIN"; }, "vlan 10 → name ADMIN"],
      ["VLAN 20 cu numele TEHNIC", function (s) { return s.vlans[20] === "TEHNIC"; }, "vlan 20 → name TEHNIC"],
      ["Fa0/1: mode access, VLAN 10", function (s) { var f = s.ifs["FastEthernet0/1"]; return f.mode === "access" && f.vlan === 10; }, "interface fa0/1 → switchport mode access → switchport access vlan 10"],
      ["Fa0/2: mode access, VLAN 20", function (s) { var f = s.ifs["FastEthernet0/2"]; return f.mode === "access" && f.vlan === 20; }, "interface fa0/2 → switchport mode access → switchport access vlan 20"],
      ["verificat cu show vlan brief", function (s) { return s.did.svb; }, "end → show vlan brief"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "copy running-config startup-config"]] },
    { id: "mgmt", dev: "switch", t: "Switch: IP de management și acces la distanță", d: "Interface VLAN 1 cu 192.168.1.2/24 activă, default gateway 192.168.1.1, enable secret, vty 0 15 cu parolă și login, salvare.", g: [
      ["Vlan1 = 192.168.1.2 255.255.255.0", function (s) { var f = s.ifs.Vlan1; return f.ip === "192.168.1.2" && f.mask === "255.255.255.0"; }, "interface vlan 1 → ip address 192.168.1.2 255.255.255.0"],
      ["Vlan1 pornită", function (s) { return !s.ifs.Vlan1.shut; }, "(în interface vlan 1) no shutdown"],
      ["ip default-gateway 192.168.1.1", function (s) { return s.gw === "192.168.1.1"; }, "(config) ip default-gateway 192.168.1.1"],
      ["enable secret setată", function (s) { return !!s.secret; }, "enable secret <parolă>"],
      ["vty 0 15: parolă + login", function (s) { return s.line.vty.pw && s.line.vty.login; }, "line vty 0 15 → password cisco → login"],
      ["configurația salvată", function (s) { return s.saved && cfgEq(s); }, "end → copy running-config startup-config"]] },
    { id: "free", dev: "switch", t: "Mod liber (switch)", d: "Exersează orice comandă. Tastează ? pentru ajutor.", g: [] },
    { id: "freer", dev: "router", t: "Mod liber (router)", d: "Exersează orice comandă pe un router. Tastează ? pentru ajutor.", g: [] }
  ];
  function cliNew(dev) {
    var s = { dev: dev, host: dev === "router" ? "Router" : "Switch", mode: "user", ctx: null, secret: "", epw: "", enc: false, banner: "", lookup: true, gw: "", line: { con: { pw: "", login: false }, vty: { pw: "", login: false } }, ifs: {}, vlans: { 1: "default" }, did: {}, saved: null, hist: [], pend: null };
    if (dev === "router") { ["GigabitEthernet0/0", "GigabitEthernet0/1", "Serial0/0/0"].forEach(function (n) { s.ifs[n] = { ip: "", mask: "", shut: true, desc: "" }; }); }
    else { for (var k = 1; k <= 24; k++) s.ifs["FastEthernet0/" + k] = { mode: "", vlan: 1, shut: false, desc: "" }; s.ifs["GigabitEthernet0/1"] = { mode: "", vlan: 1, shut: false, desc: "" }; s.ifs["GigabitEthernet0/2"] = { mode: "", vlan: 1, shut: false, desc: "" }; s.ifs.Vlan1 = { ip: "", mask: "", shut: true, desc: "" }; }
    return s;
  }
  function cfgSnap(s) { return JSON.parse(JSON.stringify({ host: s.host, secret: s.secret, epw: s.epw, enc: s.enc, banner: s.banner, lookup: s.lookup, gw: s.gw, line: s.line, ifs: s.ifs, vlans: s.vlans })); }
  function cfgEq(s) { return JSON.stringify(cfgSnap(s)) === JSON.stringify(s.saved); }
  function enc7(p) { var h = "0822"; for (var i = 0; i < p.length; i++) h += ("0" + ((p.charCodeAt(i) ^ (0x5a + i)) & 255).toString(16).toUpperCase()).slice(-2); return h; }
  function ifName(a, b) {
    var str = (a + (b || "")).replace(/\s+/g, "").toLowerCase(), m;
    if ((m = /^(f|fa|fas|fast|fastethernet|fastether)(\d\/\d+)$/.exec(str))) return "FastEthernet" + m[2];
    if ((m = /^(g|gi|gig|giga|gigabit|gigabitethernet)(\d\/\d+)$/.exec(str))) return "GigabitEthernet" + m[2];
    if ((m = /^(s|se|ser|serial)(\d\/\d\/\d)$/.exec(str))) return "Serial" + m[2];
    if ((m = /^(vl|vla|vlan)(\d+)$/.exec(str))) return "Vlan" + m[2];
    return null;
  }
  function cliPrompt(s) { var m = { user: ">", priv: "#", config: "(config)#", "if": "(config-if)#", "if-range": "(config-if-range)#", line: "(config-line)#", vlan: "(config-vlan)#" }; return s.host + m[s.mode]; }
  function ipOk(ip) { return /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(ip) && ip.split(".").every(function (o) { return +o <= 255; }); }
  function maskOk(m) { if (!ipOk(m)) return false; var b = m.split(".").map(function (o) { return ("0000000" + (+o).toString(2)).slice(-8); }).join(""); return /^1+0*$/.test(b); }
  var CMDS = {
    user: [["enable", "Activează modul privilegiat"], ["exit", "Închide sesiunea"], ["logout", "Închide sesiunea"], ["ping", "Trimite ecou ICMP"], ["show", "Afișează informații"], ["traceroute", "Urmărește ruta"]],
    priv: [["configure", "Intră în modul de configurare"], ["copy", "Copiază configurația"], ["disable", "Înapoi în modul utilizator"], ["erase", "Șterge un fișier"], ["exit", "Închide sesiunea"], ["ping", "Trimite ecou ICMP"], ["reload", "Repornește echipamentul"], ["show", "Afișează informații"], ["traceroute", "Urmărește ruta"], ["write", "Salvează configurația"]],
    config: [["banner", "Mesaj afișat la conectare"], ["do", "Rulează o comandă EXEC"], ["enable", "Parolă pentru modul privilegiat"], ["end", "Ieși în modul privilegiat"], ["exit", "Ieși un nivel"], ["hostname", "Numele echipamentului"], ["interface", "Selectează o interfață"], ["ip", "Setări IP globale"], ["line", "Configurează o linie (consolă/vty)"], ["no", "Anulează o comandă"], ["service", "Servicii (ex. password-encryption)"], ["vlan", "Creează/editează un VLAN"]],
    "if": [["description", "Descrierea interfeței"], ["do", "Rulează o comandă EXEC"], ["end", "Ieși în modul privilegiat"], ["exit", "Ieși un nivel"], ["ip", "Adresa IP a interfeței"], ["no", "Anulează o comandă"], ["shutdown", "Oprește interfața"], ["switchport", "Setări port de switch"]],
    line: [["do", "Rulează o comandă EXEC"], ["end", "Ieși în modul privilegiat"], ["exec-timeout", "Timp de deconectare"], ["exit", "Ieși un nivel"], ["logging", "Mesaje pe linie"], ["login", "Cere parola la conectare"], ["no", "Anulează o comandă"], ["password", "Parola liniei"]],
    vlan: [["do", "Rulează o comandă EXEC"], ["end", "Ieși în modul privilegiat"], ["exit", "Ieși un nivel"], ["name", "Numele VLAN-ului"], ["no", "Anulează o comandă"]]
  };
  CMDS["if-range"] = CMDS["if"];
  function kw(tok, list) { tok = (tok || "").toLowerCase(); if (!tok) return null; if (list.indexOf(tok) >= 0) return tok; var m = list.filter(function (x) { return x.indexOf(tok) === 0; }); return m.length === 1 ? m[0] : m.length > 1 ? "?amb" : null; }
  function pad(x, n) { x = String(x); while (x.length < n) x += " "; return x.slice(0, n); }
  function cliRun(s, line) {
    var out = [], raw = line;
    function o(x) { out.push(x); }
    function posOf(n) { var p = 0, c = 0, re = /\S+/g, m; while ((m = re.exec(raw))) { if (c === n) return m.index; c++; p = m.index + m[0].length; } return p + 1; }
    function inv(n) { if (n >= tkn()) { o("% Incomplete command."); return; } o(new Array(cliPrompt(s).length + posOf(n) + 1).join(" ") + "^"); o("% Invalid input detected at '^' marker."); }
    function tkn() { return raw.trim().split(/\s+/).filter(Boolean).length; }
    if (s.pend) { var pd = s.pend; s.pend = null; return pd(line.trim()); }
    var tk = line.trim().split(/\s+/).filter(Boolean);
    if (!tk.length) return [];
    if (/\?$/.test(line.trim())) return cliHelp(s, line.trim());
    var mode = s.mode, c = kw(tk[0], CMDS[mode].map(function (x) { return x[0]; }));
    if (c === "?amb") { o('% Ambiguous command:  "' + tk[0] + '"'); return out; }
    if (!c && mode !== "config" && mode !== "user" && mode !== "priv") { var gc = kw(tk[0], CMDS.config.map(function (x) { return x[0]; })); if (gc && gc !== "?amb") { s.mode = "config"; s.ctx = null; return cliRun(s, line); } }
    if (!c) {
      if (mode === "user" || mode === "priv") { if (s.lookup) { o('Translating "' + tk[0] + '"...domain server (255.255.255.255)'); o("% Unknown command or computer name, or unable to find computer address"); o("(Pe un echipament real ai aștepta ~30 s. Sfat: no ip domain-lookup în config.)"); } else o("% Unknown command or computer name, or unable to find computer address"); }
      else inv(0);
      return out;
    }
    var a = tk.slice(1), a1 = (a[0] || "").toLowerCase();
    function need(n) { if (a.length < n) { o("% Incomplete command."); return false; } return true; }
    function toPriv() { s.mode = "priv"; s.ctx = null; o("%SYS-5-CONFIG_I: Configured from console by console"); }
    if (c === "do") { if (!a.length) { o("% Incomplete command."); return out; } var sv = s.mode, svc = s.ctx; s.mode = "priv"; var r = cliRun(s, a.join(" ")); if (s.mode === "priv") { s.mode = sv; s.ctx = svc; } return r; }
    if (c === "end") { toPriv(); return out; }
    if (c === "exit" || c === "logout") { if (mode === "user" || mode === "priv") { s.mode = "user"; o(""); o(s.host + " con0 is now available"); o("Press RETURN to get started."); } else if (mode === "config") toPriv(); else { s.mode = "config"; s.ctx = null; } return out; }
    if (c === "show") return cliShow(s, a, out, posOf);
    if (c === "ping" || c === "traceroute") {
      if (!need(1)) return out; if (!ipOk(a[0])) { o("% Unrecognized host or address, or protocol not running."); return out; }
      var ok = cliReach(s, a[0]); o("Type escape sequence to abort.");
      if (c === "traceroute") { o("Tracing the route to " + a[0]); o(ok ? "  1 " + a[0] + " 1 msec 0 msec 1 msec" : "  1  *    *    *"); return out; }
      o("Sending 5, 100-byte ICMP Echos to " + a[0] + ", timeout is 2 seconds:"); o(ok ? ".!!!!" : "....."); o(ok ? "Success rate is 80 percent (4/5), round-trip min/avg/max = 0/1/4 ms" : "Success rate is 0 percent (0/5)"); if (ok) o("(primul „.” = timpul pentru ARP – normal)"); return out;
    }
    if (mode === "user") { if (c === "enable") { var pwd = s.secret || s.epw; if (pwd) { s.pend = function (p) { if (p === pwd) { s.mode = "priv"; return []; } return ["% Access denied"]; }; return ["Password: (tastează parola și Enter)"]; } s.mode = "priv"; } return out; }
    if (mode === "priv") {
      if (c === "disable") { s.mode = "user"; return out; }
      if (c === "configure") { if (a.length && kw(a1, ["terminal"]) !== "terminal") { inv(1); return out; } s.mode = "config"; o("Enter configuration commands, one per line.  End with CNTL/Z."); return out; }
      if (c === "copy") { if (!need(2)) return out; var x1 = kw(a1, ["running-config", "startup-config"]), x2 = kw((a[1] || "").toLowerCase(), ["running-config", "startup-config"]); if (x1 === "startup-config" && x2 === "running-config") { if (!s.saved) return ["%Error opening nvram:/startup-config (No such file or directory)"]; ["host", "secret", "epw", "enc", "banner", "lookup", "gw", "line", "ifs", "vlans"].forEach(function (k) { s[k] = JSON.parse(JSON.stringify(s.saved[k])); }); return ["Destination filename [running-config]?", "[OK]"]; } if (x1 === "running-config" && x2 === "startup-config") { s.pend = function () { s.saved = cfgSnap(s); return ["Building configuration...", "[OK]"]; }; return ["Destination filename [startup-config]? (apasă Enter)"]; } inv(x1 ? 2 : 1); return out; }
      if (c === "write") { if (a.length && kw(a1, ["memory"]) !== "memory") { inv(1); return out; } s.saved = cfgSnap(s); o("Building configuration..."); o("[OK]"); return out; }
      if (c === "erase") { if (kw(a1, ["startup-config"]) !== "startup-config") { o("% Incomplete command."); return out; } s.pend = function () { s.saved = null; return ["[OK]", "Erase of nvram: complete"]; }; return ["Erasing the nvram filesystem will remove all configuration files! Continue? [confirm] (Enter)"]; }
      if (c === "reload") { var dirty = !cfgEq(s); s.pend = function () { var sv = s.saved, h = s.hist, n = cliNew(s.dev); if (sv) { ["host", "secret", "epw", "enc", "banner", "lookup", "gw", "line", "ifs", "vlans"].forEach(function (k) { n[k] = JSON.parse(JSON.stringify(sv[k])); }); n.saved = sv; } Object.keys(n).forEach(function (k) { s[k] = n[k]; }); s.hist = h; return ["", "System Bootstrap, Version 15.0 ...", "Press RETURN to get started!", sv ? "(s-a încărcat configurația salvată)" : "(nu exista configurație salvată – totul s-a pierdut!)"]; }; return [dirty ? "System configuration has been modified. (Modificările NESALVATE se pierd!)" : "", "Proceed with reload? [confirm] (Enter)"]; }
      inv(0); return out;
    }
    if (c === "no") return cliNo(s, a, out, inv);
    if (mode === "config") {
      if (c === "hostname") { if (!need(1)) return out; if (!/^[A-Za-z][\w-]{0,62}$/.test(a[0])) { o("% Hostname contains one or more illegal characters."); return out; } s.host = a[0]; return out; }
      if (c === "enable") { if (!need(2)) return out; var w = kw(a1, ["secret", "password"]); if (!w || w === "?amb") { inv(1); return out; } var pw = a[a.length - 1]; if (w === "secret") s.secret = pw; else s.epw = pw; return out; }
      if (c === "service") { if (kw(a1, ["password-encryption"]) !== "password-encryption") { inv(1); return out; } s.enc = true; return out; }
      if (c === "banner") { if (kw(a1, ["motd"]) !== "motd") { inv(1); return out; } var rest = raw.trim().replace(/^\S+\s+\S+\s*/, ""), d0 = rest.charAt(0), end = rest.indexOf(d0, 1); if (!d0 || end < 0) { o("% Pune un delimitator la ambele capete, ex: banner motd #Text#"); return out; } s.banner = rest.slice(1, end); return out; }
      if (c === "ip") { var w2 = kw(a1, ["domain-lookup", "default-gateway", "route"]); if (w2 === "domain-lookup") { s.lookup = true; return out; } if (w2 === "default-gateway") { if (!need(2)) return out; if (!ipOk(a[1])) { inv(2); return out; } s.gw = a[1]; return out; } if (w2 === "route") { need(4); return out; } inv(1); return out; }
      if (c === "interface") {
        if (!need(1)) return out;
        if (kw(a1, ["range"]) === "range" && a1.length > 1) { var rs = a.slice(1).join("").toLowerCase(), rm = /^([a-z]+)(\d\/)(\d+)-(\d+)$/.exec(rs); var base = rm && s.dev === "switch" ? ifName(rm[1], rm[2] + rm[3]) : null; if (!base) { inv(1); return out; } var pre = base.replace(/\d+$/, ""), names = []; for (var q = +rm[3]; q <= +rm[4]; q++) if (s.ifs[pre + q]) names.push(pre + q); if (!names.length) { inv(1); return out; } s.mode = "if-range"; s.ctx = names; return out; }
        var nm = ifName(a[0], a[1]);
        if (nm && /^Vlan\d+$/.test(nm) && s.dev === "switch" && !s.ifs[nm]) { s.ifs[nm] = { ip: "", mask: "", shut: true, desc: "" }; o("%LINK-5-CHANGED: Interface " + nm + ", changed state to administratively down"); }
        if (!nm || !s.ifs[nm]) { inv(1); return out; } s.mode = "if"; s.ctx = [nm]; return out;
      }
      if (c === "line") { if (!need(1)) return out; var lw = kw(a1, ["console", "vty"]); if (lw === "console") { if (a[1] !== "0") { if (a[1]) inv(2); else o("% Incomplete command."); return out; } s.mode = "line"; s.ctx = "con"; return out; } if (lw === "vty") { if (a.length < 3 || !/^\d+$/.test(a[1]) || !/^\d+$/.test(a[2])) { o("% Incomplete command."); return out; } s.mode = "line"; s.ctx = "vty"; return out; } inv(1); return out; }
      if (c === "vlan") { if (s.dev !== "switch") { inv(0); return out; } if (!need(1)) return out; var id = +a[0]; if (!(id >= 1 && id <= 4094)) { o("% Bad VLAN list"); return out; } if (!s.vlans[id]) s.vlans[id] = "VLAN" + ("000" + id).slice(-4); s.mode = "vlan"; s.ctx = id; return out; }
      inv(0); return out;
    }
    if (mode === "if" || mode === "if-range") {
      var IFS = s.ctx.map(function (n) { return s.ifs[n]; });
      if (c === "shutdown") { s.ctx.forEach(function (n) { if (!s.ifs[n].shut) { s.ifs[n].shut = true; o("%LINK-5-CHANGED: Interface " + n + ", changed state to administratively down"); } }); return out; }
      if (c === "description") { IFS.forEach(function (f) { f.desc = a.join(" "); }); return out; }
      if (c === "ip") {
        if (kw(a1, ["address"]) !== "address") { inv(1); return out; }
        if ((s.dev === "switch" && !/^Vlan/.test(s.ctx[0])) || mode === "if-range") { inv(0); o("(Porturile de switch de nivel 2 nu primesc IP – adresa se pune pe interface vlan 1.)"); return out; }
        if (a[1] && /\//.test(a[1])) { inv(1); o("(IOS clasic cere masca zecimală: 255.255.255.0, nu /24.)"); return out; }
        if (a.length < 3) { o("% Incomplete command."); return out; }
        if (!ipOk(a[1])) { inv(1); return out; }
        if (!maskOk(a[2])) { o("Bad mask 0x" + a[2].split(".").map(function (x) { return ("0" + (+x || 0).toString(16).toUpperCase()).slice(-2); }).join("") + " for address " + a[1]); return out; }
        var oc = a[1].split(".").map(Number), mk = a[2].split(".").map(Number), all0 = true, all1 = true;
        for (var z = 0; z < 4; z++) { if ((oc[z] & ~mk[z] & 255) !== 0) all0 = false; if (((oc[z] | mk[z]) & 255) !== 255) all1 = false; }
        if (all0 || all1) { o("Bad mask /" + a[2] + " for address " + a[1] + " (aceasta e adresa de rețea sau de broadcast)"); return out; }
        IFS[0].ip = a[1]; IFS[0].mask = a[2]; return out;
      }
      if (c === "switchport") {
        if (s.dev !== "switch" || /^Vlan/.test(s.ctx[0])) { inv(0); return out; }
        var sw = kw(a1, ["mode", "access", "trunk"]);
        if (sw === "mode") { var md = kw((a[1] || "").toLowerCase(), ["access", "trunk", "dynamic"]); if (!md || md === "?amb") { if (a[1]) inv(2); else o("% Incomplete command."); return out; } IFS.forEach(function (f) { f.mode = md; }); return out; }
        if (sw === "access") { if (kw((a[1] || "").toLowerCase(), ["vlan"]) !== "vlan" || !a[2]) { o("% Incomplete command."); return out; } var v = +a[2]; if (!(v >= 1 && v <= 4094)) { o("% Bad VLAN list"); return out; } if (!s.vlans[v]) { s.vlans[v] = "VLAN" + ("000" + v).slice(-4); o("% Access VLAN does not exist. Creating vlan " + v); } IFS.forEach(function (f) { f.vlan = v; }); return out; }
        if (sw === "trunk") return out;
        inv(1); return out;
      }
      inv(0); return out;
    }
    if (mode === "line") {
      var L0 = s.line[s.ctx];
      if (c === "password") { if (!need(1)) return out; L0.pw = a[a.length - 1]; return out; }
      if (c === "login") { if (a.length && kw(a1, ["local"]) !== "local") { inv(1); return out; } if (!L0.pw && !a.length) o("% Login disabled on line, until 'password' is set"); L0.login = true; return out; }
      return out;
    }
    if (mode === "vlan") { if (c === "name") { if (!need(1)) return out; s.vlans[s.ctx] = a[0]; return out; } inv(0); return out; }
    return out;
  }
  function cliNo(s, a, out, inv) {
    var m = s.mode, a1 = (a[0] || "").toLowerCase();
    function o(x) { out.push(x); }
    if (!a.length) { o("% Incomplete command."); return out; }
    if (m === "if" || m === "if-range") {
      if (kw(a1, ["shutdown"]) === "shutdown") { s.ctx.forEach(function (n) { var f = s.ifs[n]; if (f.shut) { f.shut = false; var up = cliUp(s, n); o("%LINK-5-CHANGED: Interface " + n + ", changed state to " + (up ? "up" : "down")); if (up) o("%LINEPROTO-5-UPDOWN: Line protocol on Interface " + n + ", changed state to up"); } }); return out; }
      if (kw(a1, ["ip"]) === "ip" && (!a[1] || kw(a[1].toLowerCase(), ["address"]) === "address")) { s.ctx.forEach(function (n) { var f = s.ifs[n]; if ("ip" in f) { f.ip = ""; f.mask = ""; } }); return out; }
      if (kw(a1, ["switchport"]) === "switchport") { s.ctx.forEach(function (n) { var f = s.ifs[n]; if ("vlan" in f) f.vlan = 1; }); return out; }
      if (kw(a1, ["description"]) === "description") { s.ctx.forEach(function (n) { s.ifs[n].desc = ""; }); return out; }
    }
    if (m === "line") { if (kw(a1, ["login"]) === "login") { s.line[s.ctx].login = false; return out; } if (kw(a1, ["password"]) === "password") { s.line[s.ctx].pw = ""; return out; } }
    if (m === "config") {
      var w = kw(a1, ["ip", "hostname", "enable", "service", "banner", "vlan"]);
      if (w === "ip") { var w2 = kw((a[1] || "").toLowerCase(), ["domain-lookup", "default-gateway"]); if (w2 === "domain-lookup") { s.lookup = false; return out; } if (w2 === "default-gateway") { s.gw = ""; return out; } }
      if (w === "hostname") { s.host = s.dev === "router" ? "Router" : "Switch"; return out; }
      if (w === "enable") { var e2 = kw((a[1] || "").toLowerCase(), ["secret", "password"]); if (e2 === "secret") s.secret = ""; else if (e2 === "password") s.epw = ""; return out; }
      if (w === "service") { s.enc = false; return out; }
      if (w === "banner") { s.banner = ""; return out; }
      if (w === "vlan") { var v = +a[1]; if (v > 1 && s.vlans[v]) delete s.vlans[v]; return out; }
    }
    if (m !== "config" && kw(a1, ["ip", "hostname", "enable", "service", "banner", "vlan"])) { s.mode = "config"; s.ctx = null; return cliNo(s, a, out, inv); }
    inv(1); return out;
  }
  function cliUp(s, n) { if (/^Serial/.test(n)) return false; if (s.dev === "router") return n === "GigabitEthernet0/0"; if (/^Vlan/.test(n)) return true; return n === "FastEthernet0/1" || n === "FastEthernet0/2" || n === "GigabitEthernet0/1"; }
  function cliReach(s, ip) {
    var t = ip.split(".").map(Number);
    return Object.keys(s.ifs).some(function (n) { var f = s.ifs[n]; if (!f.ip || f.shut || !cliUp(s, n)) return false; var x = f.ip.split(".").map(Number), m = f.mask.split(".").map(Number); for (var k = 0; k < 4; k++) if ((x[k] & m[k]) !== (t[k] & m[k])) return false; return ip !== f.ip && /\.(1|2|10|11|20|254)$/.test(ip); }) || Object.keys(s.ifs).some(function (n) { return s.ifs[n].ip === ip && !s.ifs[n].shut; });
  }
  function cliShow(s, a, out, posOf) {
    function o(x) { out.push(x); }
    function inv(n) { o(new Array(cliPrompt(s).length + posOf(n) + 1).join(" ") + "^"); o("% Invalid input detected at '^' marker."); }
    if (!a.length) { o("% Incomplete command."); return out; }
    var w = kw(a[0].toLowerCase(), ["running-config", "startup-config", "ip", "vlan", "version", "interfaces", "history", "clock", "mac-address-table"]);
    if (!w || w === "?amb") { inv(1); return out; }
    if (s.mode === "user" && (w === "running-config" || w === "startup-config")) { inv(1); o("(show running-config cere modul privilegiat – tastează enable)"); return out; }
    if (w === "running-config") { s.did.srun = true; return out.concat(cliCfg(s, cfgSnap(s), "Current")); }
    if (w === "startup-config") { if (!s.saved) { o("startup-config is not present"); return out; } return out.concat(cliCfg(s, s.saved, "Using")); }
    if (w === "ip") {
      var w2 = kw((a[1] || "").toLowerCase(), ["interface", "route"]);
      if (w2 === "interface" && kw((a[2] || "brief").toLowerCase(), ["brief"]) === "brief") { s.did.sipib = true; o("Interface              IP-Address      OK? Method Status                Protocol"); Object.keys(s.ifs).forEach(function (n) { var f = s.ifs[n], up = !f.shut && cliUp(s, n), st = f.shut ? "administratively down" : up ? "up" : "down"; o(pad(n, 23) + pad(f.ip || "unassigned", 16) + (f.ip ? "YES manual " : "YES unset  ") + pad(st, 22) + (up ? "up" : "down")); }); return out; }
      if (w2 === "route") { o("Codes: L - local, C - connected, S - static"); o(""); Object.keys(s.ifs).forEach(function (n) { var f = s.ifs[n]; if (f.ip && !f.shut && cliUp(s, n)) o("C    rețeaua lui " + f.ip + " (" + f.mask + ") is directly connected, " + n); }); return out; }
      o("% Incomplete command."); return out;
    }
    if (w === "vlan") {
      if (s.dev !== "switch") { inv(1); return out; } s.did.svb = true;
      o("VLAN Name                             Status    Ports"); o("---- -------------------------------- --------- -------------------------------");
      Object.keys(s.vlans).map(Number).sort(function (x, y) { return x - y; }).forEach(function (v) { var ports = Object.keys(s.ifs).filter(function (n) { var f = s.ifs[n]; return "vlan" in f && f.vlan === v && f.mode !== "trunk"; }).map(function (n) { return n.replace("FastEthernet", "Fa").replace("GigabitEthernet", "Gig"); }); var first = true; do { var chunk = ports.splice(0, 4).join(", "); o(first ? pad(v, 5) + pad(s.vlans[v], 33) + "active    " + chunk : pad("", 48) + chunk); first = false; } while (ports.length); });
      ["1002 fddi-default", "1003 token-ring-default", "1004 fddinet-default", "1005 trnet-default"].forEach(function (x) { var p = x.split(" "); o(pad(p[0], 5) + pad(p[1], 33) + "active"); });
      return out;
    }
    if (w === "version") { o("Cisco IOS Software, " + (s.dev === "router" ? "C1900 Software (C1900-UNIVERSALK9-M)" : "C2960 Software (C2960-LANBASEK9-M)") + ", Version 15.0(2), RELEASE SOFTWARE (fc1)"); o(s.host + " uptime is 12 minutes"); o("Configuration register is 0x2102"); return out; }
    if (w === "history") { s.hist.slice(-10).forEach(function (h) { o("  " + h); }); return out; }
    if (w === "clock") { o("*" + new Date().toUTCString()); return out; }
    if (w === "interfaces") { o("(în simulator folosește show ip interface brief pentru o privire de ansamblu)"); return out; }
    o("          Mac Address Table"); o("-------------------------------------------"); o("Vlan    Mac Address       Type        Ports"); o("   1    0060.2f84.4ab6    DYNAMIC     Fa0/1"); return out;
  }
  function cliCfg(s, c, kind) {
    var L = ["Building configuration...", "", kind + " configuration : " + (900 + JSON.stringify(c).length % 600) + " bytes", "!", "version 15.0", "no service timestamps log datetime msec", c.enc ? "service password-encryption" : "no service password-encryption", "!", "hostname " + c.host, "!"];
    if (c.secret) L.push("enable secret 5 $1$mERr$" + enc7(c.secret + "salt").slice(4, 26));
    if (c.epw) L.push("enable password " + (c.enc ? "7 " + enc7(c.epw) : c.epw));
    L.push("!"); if (!c.lookup) { L.push("no ip domain-lookup"); L.push("!"); }
    if (s.dev === "switch") Object.keys(c.vlans).map(Number).filter(function (v) { return v > 1; }).forEach(function (v) { L.push("vlan " + v); L.push(" name " + c.vlans[v]); L.push("!"); });
    Object.keys(c.ifs).forEach(function (n) { var f = c.ifs[n]; L.push("interface " + n); if (f.desc) L.push(" description " + f.desc); if (f.vlan && f.vlan !== 1) L.push(" switchport access vlan " + f.vlan); if (f.mode) L.push(" switchport mode " + f.mode); if ("ip" in f) L.push(f.ip ? " ip address " + f.ip + " " + f.mask : " no ip address"); if (f.shut) L.push(" shutdown"); L.push("!"); });
    if (c.gw) { L.push("ip default-gateway " + c.gw); L.push("!"); }
    if (c.banner) { L.push("banner motd ^C" + c.banner + "^C"); L.push("!"); }
    function ln(name, l) { L.push(name); if (l.pw) L.push(" password " + (c.enc ? "7 " + enc7(l.pw) : l.pw)); if (l.login) L.push(" login"); }
    ln("line con 0", c.line.con); L.push("!"); ln("line vty 0 4", c.line.vty); if (s.dev === "switch") ln("line vty 5 15", c.line.vty); L.push("!"); L.push("end");
    return L;
  }
  function cliHelp(s, line) {
    var base = line.replace(/\?$/, ""), tk = base.trim().split(/\s+/).filter(Boolean), list = CMDS[s.mode];
    if (!tk.length || (/\S$/.test(base) && tk.length === 1)) { var pre = (tk[0] || "").toLowerCase(); return list.filter(function (x) { return x[0].indexOf(pre) === 0; }).map(function (x) { return "  " + pad(x[0], 16) + x[1]; }); }
    var c = kw(tk[0], list.map(function (x) { return x[0]; }));
    var sub = { show: ["running-config", "startup-config", "ip interface brief", "vlan brief", "version", "history"], copy: ["running-config startup-config"], configure: ["terminal"], interface: s.dev === "router" ? ["GigabitEthernet0/0", "GigabitEthernet0/1", "Serial0/0/0"] : ["FastEthernet0/1 … 0/24", "GigabitEthernet0/1 … 0/2", "vlan <1-4094>", "range fa0/1 - 10"], ip: s.mode === "config" ? ["default-gateway A.B.C.D", "domain-lookup"] : ["address A.B.C.D MASCĂ"], line: ["console 0", "vty 0 15"], enable: ["secret <parolă>", "password <parolă>"], switchport: ["mode access", "mode trunk", "access vlan <nr>"], service: ["password-encryption"], banner: ["motd #text#"], no: ["shutdown", "ip domain-lookup", "ip address", "login"], vlan: ["<1-4094>"], hostname: ["<nume>"], name: ["<nume VLAN>"], password: ["<parolă>"] }[c];
    return sub ? sub.map(function (x) { return "  " + x; }) : ["  <cr>"];
  }
  function cliComplete(s, val) {
    var tk = val.split(/\s+/), last = tk[tk.length - 1], list;
    if (tk.length === 1) list = CMDS[s.mode].map(function (x) { return x[0]; });
    else { var c = kw(tk[0], CMDS[s.mode].map(function (x) { return x[0]; })); list = { show: ["running-config", "startup-config", "ip", "vlan", "version", "interface", "brief"], copy: ["running-config", "startup-config"], configure: ["terminal"], switchport: ["mode", "access", "vlan", "trunk"], ip: ["address", "default-gateway", "domain-lookup", "interface", "brief"], line: ["console", "vty"], enable: ["secret", "password"], service: ["password-encryption"], banner: ["motd"], no: ["shutdown", "ip", "domain-lookup"], "do": ["show", "copy", "running-config", "ip", "interface", "brief", "vlan"], interface: s.dev === "router" ? ["GigabitEthernet0/", "Serial0/0/0"] : ["FastEthernet0/", "GigabitEthernet0/", "vlan", "range"] }[c] || []; }
    var m = list.filter(function (x) { return x.indexOf(last.toLowerCase()) === 0; });
    if (m.length === 1 && last) { tk[tk.length - 1] = m[0]; return tk.join(" ") + (/\/$/.test(m[0]) ? "" : " "); }
    return val;
  }
  /* ---------- ecran: terminal Cisco simulat ---------- */
  var CLIS = null;
  function vCli(tid) {
    view = "practice"; navbar(true);
    var T = CLI_TASKS.filter(function (x) { return x.id === tid; })[0] || CLI_TASKS[0];
    if (!CLIS || CLIS.tid !== T.id) CLIS = { tid: T.id, s: cliNew(T.dev), lines: [], hi: -1, done: false, hint: 0 };
    var C = CLIS, s = C.s;
    P.cli = P.cli || {};
    var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.term + ' Terminal Cisco IOS (simulat)</h2><p class="muted small">Exersezi exact ce tastezi la proba practică, prin cablul de consolă. Comenzile se pot prescurta (conf t, int g0/0, sh ip int br). Tab completează, ? arată opțiunile.</p>' +
      '<div class="seg wrap" id="cliT">' + CLI_TASKS.map(function (x) { return '<button data-t="' + x.id + '" class="' + (x.id === T.id ? "on" : "") + '">' + (P.cli[x.id] ? "✓ " : "") + esc(x.t) + "</button>"; }).join("") + "</div>" +
      '<div class="ctask"><b>Sarcina:</b> ' + esc(T.d) + (T.g.length ? '<ul class="goals" id="goals"></ul>' : "") + "</div>" +
      '<div class="term" id="term" role="log" aria-live="polite"></div>' +
      '<form id="cliF" class="tin" autocomplete="off"><label for="cliI" id="cliP"></label><input id="cliI" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" aria-label="Comandă"></form>' +
      '<div class="tkeys"><button class="ghost sm" type="button" id="kTab">Tab</button><button class="ghost sm" type="button" id="kQ">?</button><button class="ghost sm" type="button" id="kUp">↑</button><button class="ghost sm" type="button" id="kHint">💡 Indiciu</button><button class="ghost sm" type="button" id="kReset">↺ Reset</button></div>' +
      '<div id="cliMsg"></div><details class="ghostd"><summary>Fițuică: modurile IOS</summary><p class="small">Switch&gt; utilizator → <b>enable</b> → Switch# privilegiat → <b>configure terminal</b> → Switch(config)# global → <b>interface …</b> / <b>line …</b> / <b>vlan …</b> → sub-moduri. <b>exit</b> urcă un nivel, <b>end</b> (Ctrl+Z) te duce direct în #. Comenzile show/copy/ping din config: pune <b>do</b> în față.</p></details></section>';
    app.innerHTML = h;
    var term = $("term"), inp = $("cliI");
    function add(t, cls) { C.lines.push([t, cls || ""]); if (C.lines.length > 400) C.lines.splice(0, C.lines.length - 400); }
    function paint() {
      term.innerHTML = C.lines.map(function (l) { return '<div class="tline ' + l[1] + '">' + (esc(l[0]) || "&nbsp;") + "</div>"; }).join("");
      $("cliP").textContent = s.pend ? "" : cliPrompt(s);
      term.scrollTop = term.scrollHeight;
      if (T.g.length) {
        var allOk = true;
        $("goals").innerHTML = T.g.map(function (g) { var ok = false; try { ok = !!g[1](s); } catch (e) {} if (!ok) allOk = false; return '<li class="' + (ok ? "ok" : "") + '">' + (ok ? "✓ " : "○ ") + esc(g[0]) + "</li>"; }).join("");
        if (allOk && !C.done) { C.done = true; var first = !P.cli[T.id]; P.cli[T.id] = Date.now(); if (first) { addXP(20); SND.ok(); } saveP(); $("cliMsg").innerHTML = '<div class="fact tok"><b>✅ Sarcină îndeplinită' + (first ? " · +20 XP" : "") + '</b><br>Exact asta verifică examinatorul: show running-config / show ip interface brief și că ai salvat (după reload configurația rămâne).</div>'; }
      }
    }
    if (!C.lines.length) { add(s.dev === "router" ? "Cisco 1941 – consolă 9600 8N1 (simulat)" : "Cisco Catalyst 2960 – consolă 9600 8N1 (simulat)", "thint"); add("Press RETURN to get started!"); add(""); }
    paint();
    function exec(v) {
      var pr = s.pend ? "" : cliPrompt(s);
      add(pr + (s.pend && /parola|Password/i.test(C.lines[C.lines.length - 1][0]) ? "" : v));
      if (v.trim() && !s.pend) { s.hist.push(v.trim()); C.hi = -1; }
      var out = []; try { out = cliRun(s, v); } catch (e) { out = ["% Eroare internă a simulatorului"]; }
      out.forEach(function (l) { add(l, /^%(?!SYS|LINK|LINEPROTO)|^\s*\^$/.test(l) ? "terr" : /^\(|^%LINK|^%LINEPROTO|^%SYS/.test(l) ? "thint" : ""); });
      if (out.some(function (l) { return /Invalid input|Incomplete|Ambiguous|Unknown command/.test(l); })) { var tip = cliTip(s, v); if (tip) add("💡 " + tip, "thint"); }
      paint();
    }
    $("cliF").onsubmit = function (e) { e.preventDefault(); var v = inp.value; inp.value = ""; exec(v); inp.focus(); };
    inp.addEventListener("keydown", function (e) {
      if (e.key === "Tab") { e.preventDefault(); inp.value = cliComplete(s, inp.value); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (s.hist.length) { C.hi = C.hi < 0 ? s.hist.length - 1 : Math.max(0, C.hi - 1); inp.value = s.hist[C.hi]; } }
      else if (e.key === "ArrowDown") { e.preventDefault(); if (C.hi >= 0) { C.hi++; if (C.hi >= s.hist.length) { C.hi = -1; inp.value = ""; } else inp.value = s.hist[C.hi]; } }
      else if (e.key === "?") { e.preventDefault(); exec(inp.value + "?"); inp.value = inp.value; }
    });
    $("kTab").onclick = function () { inp.value = cliComplete(s, inp.value); inp.focus(); };
    $("kQ").onclick = function () { exec(inp.value + "?"); inp.focus(); };
    $("kUp").onclick = function () { if (s.hist.length) { C.hi = C.hi < 0 ? s.hist.length - 1 : Math.max(0, C.hi - 1); inp.value = s.hist[C.hi]; } inp.focus(); };
    $("kHint").onclick = function () {
      var g = T.g.filter(function (x) { try { return !x[1](s); } catch (e) { return true; } })[0];
      add("💡 " + (g ? g[2] + "   (ești în: " + cliPrompt(s) + ")" : T.g.length ? "Toate obiectivele sunt bifate." : "Mod liber: încearcă enable, configure terminal, ? pentru listă."), "thint"); paint(); inp.focus();
    };
    $("kReset").onclick = function () { CLIS = null; vCli(T.id); };
    Array.prototype.forEach.call(app.querySelectorAll("#cliT button"), function (b) { b.onclick = function () { CLIS = null; vCli(b.getAttribute("data-t")); }; });
    $("backBtn").onclick = function () { go("practice"); };
  }
  function cliTip(s, v) {
    var w = (v.trim().split(/\s+/)[0] || "").toLowerCase(), m = s.mode;
    var cfgOnly = ["hostname", "interface", "int", "line", "vlan", "banner", "service", "ip"], exOnly = ["show", "sh", "copy", "write", "wr", "reload", "ping"];
    if ((m === "user" || m === "priv") && cfgOnly.some(function (x) { return w === x || (x.length > 3 && x.indexOf(w) === 0 && w.length > 2); })) return m === "user" ? "Comanda e de configurare: mai întâi enable, apoi configure terminal." : "Comanda e de configurare: intră cu configure terminal (conf t).";
    if (m === "user" && /^(conf|configure|copy|wr|reload)/.test(w)) return "Ești în modul utilizator (>). Tastează enable ca să ajungi la #.";
    if (m !== "user" && m !== "priv" && exOnly.some(function (x) { return w === x; })) return "În modurile de configurare pune do în față: do " + v.trim() + " – sau ieși cu end.";
    if (m === "config" && /^(no$|shut|shutdown|switchport|password|login|name)/.test(w)) return "Comanda aceasta merge într-un sub-mod (interface / line / vlan). Ești în (config)#.";
    if (/^(ipconfig|tracert|cls|dir)$/.test(w)) return "Aceasta e comandă de Windows (cmd), nu de Cisco IOS.";
    return "";
  }

  /* ---------- ecran: ordinea firelor RJ45 ---------- */
  var RJW = { "alb-portocaliu": ["#f97316", 1], "portocaliu": ["#f97316", 0], "alb-verde": ["#16a34a", 1], "albastru": ["#2563eb", 0], "alb-albastru": ["#2563eb", 1], "verde": ["#16a34a", 0], "alb-maro": ["#92400e", 1], "maro": ["#92400e", 0] };
  var T568 = { B: ["alb-portocaliu", "portocaliu", "alb-verde", "albastru", "alb-albastru", "verde", "alb-maro", "maro"], A: ["alb-verde", "verde", "alb-portocaliu", "albastru", "alb-albastru", "portocaliu", "alb-maro", "maro"] };
  function wireSw(n) { var c = RJW[n]; return '<span class="wsw" style="background:' + (c[1] ? "repeating-linear-gradient(90deg,#fff 0 5px," + c[0] + " 5px 10px)" : c[0]) + '"></span>'; }
  function vRj(std) {
    view = "practice"; navbar(true); std = std === "A" ? "A" : "B";
    var want = T568[std], got = [], pool = shuffle(want.slice()), checked = false;
    function paint() {
      var h = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.plug + ' Ordinea firelor în mufa RJ45</h2><p class="muted small">Ții mufa cu <b>clema în jos</b>, contactele aurii spre tine: pinul 1 e în <b>stânga</b>. Atinge firele în ordinea 1 → 8. Atinge un fir pus ca să-l scoți.</p>' +
        '<div class="seg" id="rjStd"><button data-s="B" class="' + (std === "B" ? "on" : "") + '">T568B (cel folosit la examen)</button><button data-s="A" class="' + (std === "A" ? "on" : "") + '">T568A</button></div>' +
        '<div class="rjplug" id="rjPlug">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var n = got[i], cls = checked && n ? (n === want[i] ? " ok" : " bad") : ""; return '<button class="rjpin' + cls + '" data-i="' + i + '"' + (n ? "" : " disabled") + ' aria-label="Pin ' + (i + 1) + (n ? ": " + n : " gol") + '"><i>' + (i + 1) + "</i>" + (n ? wireSw(n) + "<small>" + n.replace("alb-", "alb-<br>") + "</small>" : "<small>—</small>") + "</button>"; }).join("") + "</div>" +
        '<div class="rjpool" id="rjPool">' + pool.map(function (n, k) { return got.indexOf(n) >= 0 ? "" : '<button class="rjw" data-k="' + k + '">' + wireSw(n) + n + "</button>"; }).join("") + "</div>" +
        '<button class="big" id="rjChk"' + (got.length < 8 ? " disabled" : "") + '>Verifică (ca testerul: LED-urile 1–8)</button><button class="ghost" id="rjNew">Din nou ↻</button><div id="rjOut"></div>' +
        '<div class="fact small"><b>Memorare T568B:</b> <i>portocaliu – verde – albastru – maro</i>, albul mereu înainte; dar <b>albastrul</b> (pin 4) și <b>alb-albastru</b> (5) stau la mijloc, iar <b>verdele</b> sare peste ele (pin 3 și 6). Cablu drept: B la ambele capete. Crossover: A la un capăt, B la celălalt.</div></section>';
      app.innerHTML = h;
      $("backBtn").onclick = function () { go("practice"); };
      $("rjNew").onclick = function () { vRj(std); };
      Array.prototype.forEach.call(app.querySelectorAll("#rjStd button"), function (b) { b.onclick = function () { vRj(b.getAttribute("data-s")); }; });
      Array.prototype.forEach.call(app.querySelectorAll(".rjw"), function (b) { b.onclick = function () { if (got.length < 8) { got.push(pool[+b.getAttribute("data-k")]); checked = false; paint(); } }; });
      Array.prototype.forEach.call(app.querySelectorAll(".rjpin"), function (b) { b.onclick = function () { var i = +b.getAttribute("data-i"); if (got[i]) { got.splice(i, 1); checked = false; paint(); } }; });
      $("rjChk").onclick = function () {
        checked = true; var bad = []; got.forEach(function (n, i) { if (n !== want[i]) bad.push(i + 1); });
        paint();
        if (!bad.length) { addXP(5); saveP(); SND.ok(); $("rjOut").innerHTML = '<div class="fact tok"><b>✅ Corect – toate cele 8 LED-uri se aprind în ordine, 1↔1 … 8↔8. +5 XP</b><br>La probă: împingi firele până la capătul mufei (vezi cuprul în față), mantaua intră sub clema de presare, apoi sertizezi ferm.</div>'; }
        else { SND.bad(); $("rjOut").innerHTML = '<div class="eli trapw"><b>❌ Pinii ' + bad.join(", ") + ' sunt greșiți.</b> Pe tester ai vedea LED-urile acestor pini aprinzându-se în altă ordine (fire inversate) – examinatorul te pică.<br>Corect ' + "T568" + std + ": " + want.map(function (n, i) { return (i + 1) + "=" + n; }).join(", ") + "</div>"; }
      };
    }
    paint();
  }

  /* ---------- ecran: multimetru (selector + borne) ---------- */
  var MMP = [["off", "OFF", -90], ["vdc", "V⎓", -45], ["vac", "V~", 0], ["ohm", "Ω", 45], ["cont", "•)))", 90], ["ma", "mA⎓", 135], ["a10", "10A⎓", 180]];
  var MMJ = [["a10", "10A", 40], ["ma", "mA", 95], ["com", "COM", 150], ["v", "VΩ", 205]];
  var MMS = [
    ["Măsoară tensiunea unei baterii AA (1,5 V).", "vdc", "v", "V⎓ (DC), roșu în VΩ, negru în COM; vârful roșu pe + și negrul pe –. Afișaj ≈ 1,5–1,6 V (dacă vezi „-1.5”, ai inversat vârfurile, nu se strică nimic)."],
    ["Verifică tensiunea dintr-o priză de 230 V.", "vac", "v", "V~ (AC), roșu în VΩ. Ții vârfurile doar de mânerele izolate, cu o mână dacă se poate. Afișaj ≈ 220–240 V. NICIODATĂ pe Ω, continuitate sau curent – arzi siguranța sau aparatul."],
    ["Verifică dacă un fir dintr-un cablu e întreg (continuitate).", "cont", "v", "Continuitate (•))), roșu în VΩ. Circuitul trebuie să fie FĂRĂ tensiune. Bip = fir întreg; „OL”/fără bip = întrerupt."],
    ["Măsoară un rezistor scos din circuit (codul spune 1 kΩ).", "ohm", "v", "Ω, roșu în VΩ, rezistorul fără tensiune și scos din circuit (altfel măsori și restul). Nu ține cu degetele ambele capete – corpul tău e o rezistență în paralel."],
    ["Măsoară curentul consumat de un LED cu rezistor (câțiva mA).", "ma", "ma", "mA⎓, roșu în mA. Aparatul se pune ÎN SERIE: deschizi circuitul și închizi bucla prin multimetru. După măsurare, roșul înapoi în VΩ!"],
    ["Măsoară curentul unui motoraș de câțiva amperi.", "a10", "a10", "10A⎓, roșu în 10A (borna mA are siguranță mică și s-ar arde). În serie, scurt timp (de obicei max 10–30 s la 10 A)."],
    ["Verifică o siguranță fuzibilă scoasă din soclu.", "cont", "v", "Continuitate (sau Ω): bip / ~0 Ω = siguranță bună; OL = arsă. Întotdeauna scoasă din circuit, fără tensiune."],
    ["Verifică ieșirea unui alimentator de router (12 V DC).", "vdc", "v", "V⎓, roșu în VΩ; centrul mufei de obicei +, exteriorul –. Un afișaj mult sub 12 V în gol = alimentator defect."],
    ["Ai terminat măsurătorile. Cum lași aparatul?", "off", "v", "OFF, cu roșul în VΩ. Lăsat pe A cu roșul în 10A, următorul care măsoară o priză face scurtcircuit prin aparat."],
    ["Verifici dacă o perechea 1–2 a unui patch-cord e conectată capăt la capăt.", "cont", "v", "Continuitate, roșu în VΩ: un vârf pe pinul 1 de la un capăt, celălalt pe pinul 1 la capătul opus → bip. Testerul de cablu face același lucru pentru toți pinii deodată."]
  ];
  function mmSvg(pos, jack) {
    var cx = 160, cy = 175, h = '<svg class="mmsvg" viewBox="0 0 320 344" xmlns="http://www.w3.org/2000/svg" font-family="system-ui,Arial" role="img" aria-label="Multimetru: selector și borne">';
    h += '<rect x="20" y="6" width="280" height="334" rx="26" fill="#f2b705" stroke="#8a6500" stroke-width="2"/><rect x="34" y="18" width="252" height="310" rx="18" fill="#2b2f36"/>';
    h += '<rect x="66" y="30" width="188" height="56" rx="6" fill="#b9c7a6" stroke="#111" stroke-width="2"/><text x="244" y="70" text-anchor="end" font-size="30" font-family="ui-monospace,Menlo,monospace" fill="#1f2a1a" id="mmLcd">' + ({ off: "", vdc: "0.00", vac: "0.0", ohm: "OL", cont: "OL", ma: "0.00", a10: "0.00" }[pos] || "") + '</text><text x="76" y="44" font-size="9" fill="#1f2a1a">' + ({ vdc: "DC V", vac: "AC V", ohm: "kΩ", cont: "•)))", ma: "DC mA", a10: "DC A" }[pos] || "") + "</text>";
    h += '<circle cx="' + cx + '" cy="' + cy + '" r="52" fill="#15181d" stroke="#555" stroke-width="3"/>';
    MMP.forEach(function (p) { var a = p[2] * Math.PI / 180, x = cx + 74 * Math.sin(a), y = cy - 74 * Math.cos(a), on = p[0] === pos; h += '<g class="mmpos" data-p="' + p[0] + '" role="button" tabindex="0" aria-label="Selector ' + p[1] + '"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="19" fill="' + (on ? "#f2b705" : "#3a3f47") + '" stroke="' + (on ? "#fff" : "#666") + '"/><text x="' + x.toFixed(1) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="middle" font-size="' + (p[1].length > 3 ? 9 : 12) + '" font-weight="700" fill="' + (on ? "#111" : "#eee") + '">' + p[1] + "</text></g>"; });
    var ang = (MMP.filter(function (p) { return p[0] === pos; })[0] || MMP[0])[2];
    h += '<g transform="rotate(' + ang + " " + cx + " " + cy + ')"><rect x="' + (cx - 9) + '" y="' + (cy - 46) + '" width="18" height="92" rx="9" fill="#444"/><path d="M' + cx + " " + (cy - 46) + "l-6 14h12z" + '" fill="#fff"/></g>';
    MMJ.forEach(function (j) { var x = j[2] + 18, on = j[0] === jack, isCom = j[0] === "com"; h += '<g class="mmjack" data-j="' + j[0] + '" role="button" tabindex="0" aria-label="Borna ' + j[1] + '"><circle cx="' + x + '" cy="290" r="15" fill="' + (isCom ? "#111" : on ? "#dc2626" : "#5b1111") + '" stroke="' + (on || isCom ? "#fff" : "#888") + '" stroke-width="2.5"/><circle cx="' + x + '" cy="290" r="6" fill="#000"/><text x="' + x + '" y="268" text-anchor="middle" font-size="10" font-weight="700" fill="#eee">' + j[1] + "</text></g>"; });
    h += '<text x="160" y="320" text-anchor="middle" font-size="9" fill="#bbb">negru mereu în COM · atinge borna pentru firul roșu</text></svg>';
    return h;
  }
  var MMST = { i: 0, ok: 0 };
  function vMm() {
    view = "practice"; navbar(true);
    var sc = MMS[MMST.i % MMS.length], pos = "off", jack = "v", done = false;
    function paint() {
      app.innerHTML = '<section class="card"><button class="back" id="backBtn">‹ Exersează</button><h2>' + ICA.meter + ' Multimetrul: selector și borne</h2><p class="muted small">Scenariul ' + (MMST.i % MMS.length + 1) + "/" + MMS.length + " · corecte în sesiune: " + MMST.ok + '</p><div class="probl">' + esc(sc[0]) + '</div><div class="mmwrap">' + mmSvg(pos, jack) + '</div><p class="small muted">Selector: <b>' + MMP.filter(function (p) { return p[0] === pos; })[0][1] + "</b> · fir roșu în: <b>" + MMJ.filter(function (j) { return j[0] === jack; })[0][1] + '</b></p><button class="big" id="mmChk">Verifică</button><button class="ghost" id="mmNext">Scenariul următor ›</button><div id="mmOut"></div></section>';
      $("backBtn").onclick = function () { go("practice"); };
      Array.prototype.forEach.call(app.querySelectorAll(".mmpos"), function (g) { var f = function () { pos = g.getAttribute("data-p"); paint(); }; g.onclick = f; g.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }; });
      Array.prototype.forEach.call(app.querySelectorAll(".mmjack"), function (g) { var f = function () { var j = g.getAttribute("data-j"); if (j === "com") return toast("COM e borna firului negru – rămâne acolo."); jack = j; paint(); }; g.onclick = f; g.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }; });
      $("mmNext").onclick = function () { MMST.i++; vMm(); };
      $("mmChk").onclick = function () {
        var ok = pos === sc[1] && jack === sc[2], danger = (jack === "a10" || jack === "ma") && (sc[1] === "vac" || sc[1] === "vdc");
        if (ok) { if (!done) { done = true; MMST.ok++; addXP(5); saveP(); } SND.ok(); }
        else SND.bad();
        $("mmOut").innerHTML = '<div class="' + (ok ? "fact tok" : "eli trapw") + '"><b>' + (ok ? "✅ Corect" + (done ? " · +5 XP" : "") : danger ? "⚠ Periculos: cu roșul în borna de curent pe o sursă de tensiune faci scurtcircuit prin aparat (arde siguranța – sau mai rău, la 230 V)." : "❌ Nu e corect.") + "</b><br>" + esc(sc[3]) + "</div>";
      };
    }
    paint();
  }
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
    var st = {}; try { st = JSON.parse(localStorage.getItem("sts_ppchk") || "{}") || {}; } catch (e) {}
    Array.prototype.forEach.call(app.querySelectorAll(".bx"), function (x) { x.checked = !!st[x.getAttribute("data-k")]; x.onchange = function () { if (x.checked) st[x.getAttribute("data-k")] = 1; else delete st[x.getAttribute("data-k")]; try { localStorage.setItem("sts_ppchk", JSON.stringify(st)); } catch (e) {} }; });
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

