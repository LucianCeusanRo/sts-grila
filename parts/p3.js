  function cliRun(s, line) {
    var out = [], raw = line;
    function o(x) { out.push(x); }
    function posOf(n) { var p = 0, c = 0, re = /\S+/g, m; while ((m = re.exec(raw))) { if (c === n) return m.index; c++; p = m.index + m[0].length; } return p + 1; }
    function inv(n) { o(new Array(cliPrompt(s).length + posOf(n) + 1).join(" ") + "^"); o("% Invalid input detected at '^' marker."); }
    if (s.pend) { var pd = s.pend; s.pend = null; return pd(line.trim()); }
    var tk = line.trim().split(/\s+/).filter(Boolean);
    if (!tk.length) return [];
    if (/\?$/.test(line.trim())) return cliHelp(s, line.trim());
    var mode = s.mode, c = kw(tk[0], CMDS[mode].map(function (x) { return x[0]; }));
    if (c === "?amb") { o('% Ambiguous command:  "' + tk[0] + '"'); return out; }
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
      if (c === "copy") { if (!need(2)) return out; var x1 = kw(a1, ["running-config", "startup-config"]), x2 = kw((a[1] || "").toLowerCase(), ["running-config", "startup-config"]); if (x1 === "running-config" && x2 === "startup-config") { s.pend = function () { s.saved = cfgSnap(s); return ["Building configuration...", "[OK]"]; }; return ["Destination filename [startup-config]? (apasă Enter)"]; } inv(x1 ? 2 : 1); return out; }
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
      if (kw(a1, ["ip"]) === "ip") { s.ctx.forEach(function (n) { var f = s.ifs[n]; if ("ip" in f) { f.ip = ""; f.mask = ""; } }); return out; }
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
