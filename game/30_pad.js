/* Controale joc (joystick + butoane pe telefon, tastatură pe PC). Schiță generată cu Gemini, revizuită și corectată. */
var jgControls = function(root, opt) {
  var isMobile = (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) || ('ontouchstart' in window);
  var rafId = null;
  var keys = {};
  var joy = { active: false, id: null, x: 0, y: 0, dx: 0, dy: 0 };
  var lastMove = { dx: 0, dy: 0 };
  var buttons = {};
  var labels = opt.labels || {};
  var enabled = { act: true, plug: true, zoom: true, con: true, menu: true, tab: true, prev: true, next: true };

  if (!document.getElementById('jgCtlCss')) {
    var style = document.createElement('style');
    style.id = 'jgCtlCss';
    style.innerHTML = 
      '.jgc-root { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; font-family: sans-serif; user-select: none; -webkit-user-select: none; z-index: 9999; }' +
      '.jgc-btn { position: absolute; pointer-events: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%; color: #fff; text-align: center; cursor: pointer; transition: transform 0.1s, opacity 0.2s; background: rgba(17,24,39,0.55); border: 1px solid rgba(255,255,255,0.2); }' +
      '.jgc-btn:active { transform: scale(0.92); background: rgba(17,24,39,0.8); }' +
      '.jgc-btn-label { position: absolute; left: 50%; bottom: -8px; transform: translateX(-50%); font-size: 11px; line-height: 14px; font-weight: bold; white-space: nowrap; overflow: visible; padding: 0 6px; border-radius: 8px; background: rgba(17,24,39,0.88); border: 1px solid rgba(255,255,255,0.28); letter-spacing: -0.1px; } .jgc-btn-label:empty { display: none; } .jgc-btn { overflow: visible; } .jgc-btn-act .jgc-btn-label { font-size: 12px; }' +
      '.jgc-joy-base { position: absolute; width: 120px; height: 120px; background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; bottom: calc(16px + env(safe-area-inset-bottom)); left: calc(16px + env(safe-area-inset-left)); pointer-events: auto; touch-action: none; }' +
      '.jgc-joy-knob { position: absolute; width: 56px; height: 56px; background: rgba(255,255,255,0.4); border: 2px solid #fff; border-radius: 50%; left: 50%; top: 50%; margin: -28px 0 0 -28px; pointer-events: none; }' +
      '.jgc-btn-act { width: 76px; height: 76px; right: calc(24px + env(safe-area-inset-right)); bottom: calc(48px + env(safe-area-inset-bottom)); }' +
      '.jgc-btn-plug { width: 60px; height: 60px; right: calc(110px + env(safe-area-inset-right)); bottom: calc(40px + env(safe-area-inset-bottom)); }' +
      '.jgc-btn-zoom { width: 60px; height: 60px; right: calc(100px + env(safe-area-inset-right)); bottom: calc(120px + env(safe-area-inset-bottom)); }' +
      '.jgc-btn-con { width: 60px; height: 60px; right: calc(20px + env(safe-area-inset-right)); bottom: calc(140px + env(safe-area-inset-bottom)); }' +
      '.jgc-btn-menu { width: 48px; height: 48px; top: calc(8px + env(safe-area-inset-top)); right: calc(16px + env(safe-area-inset-right)); }' +
      '.jgc-legend { position: absolute; bottom: calc(10px + env(safe-area-inset-bottom)); left: 10px; color: rgba(255,255,255,0.7); font-size: 11px; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px; pointer-events: none; }' +
      '.jgc-hidden { display: none !important; } .jgc-ic{font-size:24px;line-height:1} .jgc-btn-act .jgc-ic{font-size:30px}';
    document.head.appendChild(style);
  }

  var container = document.createElement('div');
  container.className = 'jgc-root';
  root.appendChild(container);

  var joyBase = document.createElement('div');
  joyBase.className = 'jgc-joy-base' + (isMobile ? '' : ' jgc-hidden');
  var joyKnob = document.createElement('div');
  joyKnob.className = 'jgc-joy-knob';
  joyBase.appendChild(joyKnob);
  container.appendChild(joyBase);

  var legend = document.createElement('div');
  legend.className = 'jgc-legend' + (isMobile ? ' jgc-hidden' : '');
  legend.innerText = 'W A S D mers · săgeți ←→ / mouse rotire · E folosește · F conectează · Z zoom · C consolă · Tab următorul · Esc meniu';
  container.appendChild(legend);

  function createBtn(id, emoji, className) {
    var b = document.createElement('div');
    b.className = 'jgc-btn ' + className + (isMobile ? '' : ' jgc-hidden');
    var icon = document.createElement('div');
    icon.className = 'jgc-ic'; icon.textContent = emoji;
    var lbl = document.createElement('div');
    lbl.className = 'jgc-btn-label';
    lbl.innerText = labels[id] || '';
    b.appendChild(icon);
    b.appendChild(lbl);
    b.setAttribute('role', 'button'); b.setAttribute('aria-label', labels[id] || id);
    b.onpointerdown = function(e) { e.preventDefault();
      if (!enabled[id]) return;
      if (navigator.vibrate) navigator.vibrate(10);
      opt.onAction(id);
      e.stopPropagation();
    };
    container.appendChild(b);
    buttons[id] = { el: b, lbl: lbl };
  }

  createBtn('act', '✊', 'jgc-btn-act');
  createBtn('plug', '🔌', 'jgc-btn-plug');
  createBtn('zoom', '🔍', 'jgc-btn-zoom');
  createBtn('con', '⌨️', 'jgc-btn-con');
  createBtn('menu', '☰', 'jgc-btn-menu'); buttons.menu.el.classList.remove('jgc-hidden');

  function getIsTyping() {
    var el = document.activeElement;
    if (!el) return false;
    var tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  }

  function handleKey(e) {
    var typing = getIsTyping();
    var code = e.keyCode;
    if (code === 27) { // Esc
      if (typing) document.activeElement.blur();
      opt.onAction('menu');
      return;
    }
    if (typing) return;
    var down = e.type === 'keydown';
    if (code === 9 || (code >= 37 && code <= 40)) e.preventDefault();
    keys[code] = down;

    if (down && !e.repeat) {
      if (code === 69) opt.onAction('act'); // E
      if (code === 70 || code === 80) opt.onAction('plug'); // F, P
      if (code === 90) opt.onAction('zoom'); // Z
      if (code === 67) opt.onAction('con'); // C
      if (code === 81) opt.onAction('prev'); // Q
      if (code === 82) opt.onAction('next'); // R
      if (code === 9) { // Tab
        e.preventDefault();
        opt.onAction(e.shiftKey ? 'prev' : 'tab');
      }
    }
  }

  function blurAll() { keys = {}; }
  window.addEventListener('keydown', handleKey);
  window.addEventListener('keyup', handleKey);
  window.addEventListener('blur', blurAll);

  joyBase.onpointerdown = function(e) {
    joy.active = true;
    joy.id = e.pointerId;
    joyBase.setPointerCapture(e.pointerId);
    updateJoy(e);
  };
  joyBase.onpointermove = function(e) {
    if (joy.active && e.pointerId === joy.id) updateJoy(e);
  };
  joyBase.onpointerup = joyBase.onpointercancel = function(e) {
    if (e.pointerId === joy.id) {
      joy.active = false;
      joy.id = null;
      joy.dx = 0; joy.dy = 0;
      joyKnob.style.transform = 'translate(0,0)';
    }
  };

  function updateJoy(e) {
    var rect = joyBase.getBoundingClientRect();
    var cx = rect.left + 60, cy = rect.top + 60;
    var dx = e.clientX - cx, dy = e.clientY - cy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var max = 60;
    if (dist > max) { dx *= max / dist; dy *= max / dist; }
    joyKnob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    var nx = dx / max, ny = dy / max;
    var dead = 0.15;
    joy.dx = Math.abs(nx) < dead ? 0 : nx;
    joy.dy = Math.abs(ny) < dead ? 0 : ny;
  }

  function loop() {
    var dx = 0, dy = 0, src = 'keys', tr = 0;
    if (joy.active) {
      dx = joy.dx; dy = joy.dy; src = 'joy';
    } else {
      if (keys[87]) dy -= 1; // W
      if (keys[83]) dy += 1; // S
      if (keys[65]) dx -= 1; // A
      if (keys[68]) dx += 1; // D
      if (keys[38]) dy -= 1; if (keys[40]) dy += 1; // săgeți sus/jos = înainte/înapoi
      if (keys[37]) tr -= 1; if (keys[39]) tr += 1; // săgeți stânga/dreapta = rotire
      dy = Math.max(-1, Math.min(1, dy));
      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
    }
    if (dx !== lastMove.dx || dy !== lastMove.dy || tr !== lastMove.tr || dx !== 0 || dy !== 0 || tr !== 0) {
      opt.onMove(dx, dy, src, tr);
      lastMove.dx = dx; lastMove.dy = dy; lastMove.tr = tr;
    }
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);

  return {
    destroy: function() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey); window.removeEventListener('blur', blurAll);
      if (container.parentNode) container.parentNode.removeChild(container);
    },
    setEnabled: function(name, bool) {
      enabled[name] = bool;
      if (buttons[name]) buttons[name].el.style.opacity = bool ? '1' : '0.3';
    },
    setLabel: function(name, text) {
      if (buttons[name]) buttons[name].lbl.innerText = text;
    },
    show: function(bool) {
      container.classList.toggle('jgc-hidden', !bool);
    }
  };
};
