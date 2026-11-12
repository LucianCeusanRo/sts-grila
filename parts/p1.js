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
