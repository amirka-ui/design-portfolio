const NS = 'http://www.w3.org/2000/svg';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function el(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}

// seeded random so the scene looks the same on every visit
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const between = (a, b) => a + rand() * (b - a);

/* =====================================================================
   OUTSIDE — generated scenery
   ===================================================================== */
(function buildOutside() {
  // snow caps on the far peaks
  const caps = $('#caps');
  [[120, 470], [330, 410], [560, 440], [800, 455], [1050, 420], [1290, 445], [1520, 460]].forEach(([x, y]) => {
    el('path', { d: `M${x} ${y} L${x - 30} ${y + 26} L${x - 14} ${y + 20} L${x - 2} ${y + 32} L${x + 12} ${y + 20} L${x + 28} ${y + 24} Z` }, caps);
  });

  // soft fluffy pines: scalloped tiers under thick snow
  function pine(g, x, base, h, fill) {
    const ink = { stroke: '#2a2522', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
    el('ellipse', { cx: x + h * 0.05, cy: base, rx: h * 0.32, ry: h * 0.035, fill: '#c3d3ec', opacity: 0.8 }, g);
    el('rect', { x: x - h * 0.03, y: base - h * 0.09, width: h * 0.06, height: h * 0.1, fill: '#5b4636', ...ink, 'stroke-width': 1.4 }, g);
    for (let i = 0; i < 4; i++) {
      const top = base - h + i * h * 0.2;
      const w = h * (0.14 + i * 0.07);
      const bot = top + h * 0.3;
      const dip = Math.max(6, h * 0.06);
      let d = `M${x} ${top} C${x + w * 0.6} ${top + h * 0.05} ${x + w} ${bot - h * 0.1} ${x + w} ${bot}`;
      for (let k = 0; k < 4; k++) {
        d += ` Q${x + w - (2 * w * (k + 0.5)) / 4} ${bot + dip} ${x + w - (2 * w * (k + 1)) / 4} ${bot}`;
      }
      d += ` C${x - w} ${bot - h * 0.1} ${x - w * 0.6} ${top + h * 0.05} ${x} ${top}Z`;
      el('path', { d, fill, ...ink, 'stroke-width': 1.7 }, g);
      // snow resting on the branches, with little drips
      const ys = top + (bot - top) * 0.62;
      const hw = w * 0.8;
      const t = h * 0.045;
      el('path', {
        d: `M${x - hw} ${ys} Q${x} ${ys - t * 2.2} ${x + hw} ${ys} ` +
           `Q${x + hw * 0.8} ${ys + t * 1.5} ${x + hw * 0.55} ${ys + t * 0.7} Q${x + hw * 0.3} ${ys + t * 1.8} ${x + hw * 0.05} ${ys + t * 0.8} ` +
           `Q${x - hw * 0.25} ${ys + t * 1.9} ${x - hw * 0.5} ${ys + t * 0.7} Q${x - hw * 0.8} ${ys + t * 1.4} ${x - hw} ${ys}Z`,
        fill: '#ffffff', ...ink, 'stroke-width': 1.2,
      }, g);
    }
    // snowy tip
    el('path', { d: `M${x} ${base - h - 1} Q${x + h * 0.06} ${base - h + h * 0.06} ${x + h * 0.07} ${base - h + h * 0.09} Q${x} ${base - h + h * 0.11} ${x - h * 0.07} ${base - h + h * 0.09} Q${x - h * 0.06} ${base - h + h * 0.06} ${x} ${base - h - 1}Z`, fill: '#ffffff', ...ink, 'stroke-width': 1.2 }, g);
  }

  const back = $('#treesBack');
  [[255, 702, 110], [410, 696, 92], [1200, 696, 100], [1500, 704, 118]].forEach(([x, b, h]) => pine(back, x, b, h, '#6a9e88'));
  [[40, 704, 122], [120, 698, 96], [190, 706, 140], [320, 700, 104], [1270, 698, 128], [1360, 704, 100], [1440, 700, 150], [1560, 706, 112]]
    .forEach(([x, b, h]) => pine(back, x, b, h, '#4f8a74'));
  const front = $('#treesFront');
  [[30, 935, 380], [170, 925, 300], [1470, 935, 340], [1590, 928, 400]].forEach(([x, b, h]) => pine(front, x, b, h, '#3f7a66'));

  // footprints from the bottom edge to the door
  const prints = $('#prints');
  for (let i = 0; i < 10; i++) {
    const t = i / 10;
    const x = 760 - t * 90 + (i % 2 ? 9 : -9) + Math.sin(t * 5) * 20;
    const y = 900 - t * 150;
    el('ellipse', { cx: x, cy: y, rx: 5 + (1 - t) * 4, ry: 2.4 + (1 - t) * 2 }, prints);
  }

  // rug panels hung on the wall (skipping the door)
  const rugs = $('#rugs');
  const rugColors = ['#6f9fa6', '#b5563a', '#d4a64a', '#5d7397', '#b5563a', '#6f9fa6'];
  [588, 640, 692, 860, 912, 964].forEach((x, i) => {
    const w = 46, y = 610, h = 100, cx = x + w / 2;
    const g = el('g', {}, rugs);
    el('rect', { x, y, width: w, height: h, fill: rugColors[i] }, g);
    el('rect', { x: x + 4, y: y + 4, width: w - 8, height: h - 8, fill: 'none', 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }, g);
    const kind = i % 3;
    if (kind === 0) {
      [30, 60, 88].forEach((dy) => el('path', { d: `M${cx} ${y + dy - 12} L${cx + 12} ${y + dy} L${cx} ${y + dy + 12} L${cx - 12} ${y + dy}Z`, fill: '#f1ebdd', 'stroke-width': 1.4 }, g));
    } else if (kind === 1) {
      for (let k = 0; k < 6; k++) el('path', { d: `M${x + 6} ${y + 14 + k * 14} l${(w - 12) / 4} -8 l${(w - 12) / 4} 8 l${(w - 12) / 4} -8 l${(w - 12) / 4} 8`, fill: 'none', 'stroke-width': 1.4 }, g);
    } else {
      [32, 72].forEach((dy) => el('path', { d: `M${cx - 4} ${y + dy - 14} h8 v10 h10 v8 h-10 v10 h-8 v-10 h-10 v-8 h10z`, fill: '#f1ebdd', 'stroke-width': 1.3 }, g));
    }
    for (let k = 0; k < 7; k++) el('line', { x1: x + 4 + k * 6.3, y1: y + h, x2: x + 4 + k * 6.3, y2: y + h + 6, 'stroke-width': 1.2 }, g);
  });

  // roof seams from the crown
  const seams = $('#seams');
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const bx = 570 + t * 460;
    const by = 602 + Math.sin(t * Math.PI) * 13;
    el('path', { d: `M${780 + t * 40} 470 Q${(780 + t * 40 + bx) / 2 + (t - 0.5) * 60} ${(470 + by) / 2 - 10} ${bx} ${by}` }, seams);
  }

  // қошқар мүйіз motifs following the curve of the eave
  const eave = $('#eaveOrn');
  const ev = (t) => [
    (1 - t) ** 2 * 573 + 2 * (1 - t) * t * 800 + t * t * 1027,
    (1 - t) ** 2 * 590 + 2 * (1 - t) * t * 616 + t * t * 590,
  ];
  el('path', { d: 'M573 597 Q800 623 1027 597', fill: 'none', stroke: '#2a2522', 'stroke-width': 1.4 }, eave);
  for (let i = 0; i < 11; i++) {
    const t = (i + 0.5) / 11;
    const [x, y] = ev(t);
    const [x2, y2] = ev(Math.min(t + 0.01, 1));
    const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    el('use', { href: '#qm', x: -23, y: -10, width: 46, height: 18, transform: `translate(${x} ${y}) rotate(${ang})` }, eave);
  }

  // little triangle fringe under the eave
  const fringe = $('#fringe');
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = 572 + t * 456;
    const y = 602 + Math.sin(t * Math.PI) * 13;
    el('path', { d: `M${x - 3} ${y} L${x + 3} ${y} L${x} ${y + 6}Z` }, fringe);
  }
})();

/* =====================================================================
   INSIDE — generated details
   ===================================================================== */
(function buildInside() {
  // roof poles radiating from the shanyrak
  const poles = $('#poles');
  for (let x = -260; x <= 1860; x += 76) {
    const ang = Math.atan2(230 - 40, x - 800);
    el('line', { x1: 800 + Math.cos(ang) * 122, y1: 40 + Math.sin(ang) * 122, x2: x, y2: 226 }, poles);
  }

  // cables: ink outline + colored core
  const cables = $('#cables');
  [
    ['M770 150 C760 260 880 300 960 430', '#3d6fe0', 8],
    ['M790 154 C800 250 960 250 1020 300', '#9aa3b2', 6],
    ['M822 150 C870 230 1080 230 1140 318', '#1b1d22', 5],
    ['M760 146 C700 230 600 300 560 398', '#a9c0ff', 7],
    ['M960 662 C940 720 880 700 820 730 S700 760 620 740 S520 700 470 650', '#3d6fe0', 7],
    ['M1228 662 C1260 720 1320 700 1360 740 S1400 800 1470 790 S1560 760 1620 780', '#9aa3b2', 6],
    ['M990 662 C1000 700 1060 690 1080 720 S1050 780 1100 800 S1200 830 1260 860 S1400 884 1620 872', '#1b1d22', 4],
    ['M420 642 C400 690 360 690 330 740', '#1b1d22', 4],
    ['M1262 640 C1290 650 1300 620 1300 600', '#a9c0ff', 5],
  ].forEach(([d, color, w], i) => {
    el('path', { d, fill: 'none', stroke: '#1b1d22', 'stroke-width': w + 3, 'stroke-linecap': 'round' }, cables);
    el('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', class: 'cab cab' + (i % 4) }, cables);
  });

  // red + blue four-point stars
  const sparkles = $('#sparkles');
  [[110, 140, '#e0402a', 1.3], [420, 170, '#3d6fe0', 0.8], [640, 180, '#e0402a', 0.7], [990, 160, '#3d6fe0', 0.9],
   [1290, 100, '#e0402a', 1.1], [1500, 170, '#3d6fe0', 1], [40, 600, '#e0402a', 0.8], [1560, 470, '#e0402a', 0.9], [700, 330, '#3d6fe0', 0.6]]
    .forEach(([x, y, fill, s]) => {
      const g = el('g', { transform: `translate(${x} ${y}) scale(${s})` }, sparkles);
      const p = el('path', { d: 'M0 -16 C1 -4 4 -1 14 0 C4 1 1 4 0 16 C-1 4 -4 1 -14 0 C-4 -1 -1 -4 0 -16Z', fill, class: 'sparkle' }, g);
      p.style.setProperty('--d', between(2.4, 4.2).toFixed(1) + 's');
      p.style.setProperty('--delay', between(0, 2).toFixed(1) + 's');
    });

  // crosshair targets on each hotspot
  $$('.hot').forEach((h) => {
    const x = +h.dataset.tx, y = +h.dataset.ty;
    const g = el('g', { class: 'target', transform: `translate(${x} ${y})`, stroke: 'none' }, h);
    el('circle', { r: 11, fill: 'none', stroke: '#e0402a', 'stroke-width': 1.5, class: 'ring' }, g);
    const c = el('g', { class: 'cross' }, g);
    el('circle', { r: 9, fill: '#ffffff', stroke: '#1b1d22', 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }, c);
    el('path', { d: 'M0 -14 V-6 M0 6 V14 M-14 0 H-6 M6 0 H14', stroke: '#1b1d22', 'stroke-width': 1.2 }, c);
    el('circle', { r: 3, fill: '#e0402a' }, g);
  });
})();

/* =====================================================================
   DAY / NIGHT
   ===================================================================== */
(function () {
  // stars for the night sky
  const g = $('#starsOut');
  for (let i = 0; i < 90; i++) {
    const c = el('circle', { cx: between(0, 1600), cy: between(0, 470), r: between(0.6, 1.9), fill: '#ffffff' }, g);
    c.setAttribute('class', 'twinkle');
    c.style.setProperty('--d', between(2, 5).toFixed(1) + 's');
    c.style.setProperty('--delay', between(0, 3).toFixed(1) + 's');
  }

  const root = document.documentElement;
  function setMode(mode, save) {
    root.dataset.mode = mode;
    $$('.mode-toggle button').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
    const t = $('#extTemp');
    if (t) t.textContent = mode === 'night' ? '−19°C' : '−12°C';
    if (save) { try { localStorage.setItem('yurt-mode', mode); } catch (e) {} }
  }
  let saved = null;
  try { saved = localStorage.getItem('yurt-mode'); } catch (e) {}
  const h = new Date().getHours();
  const forced = new URLSearchParams(location.search).get('mode');
  setMode(['day', 'night'].includes(forced) ? forced : saved || (h >= 7 && h < 18 ? 'day' : 'night'));
  $$('.mode-toggle button').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); setMode(b.dataset.mode, true); }));
})();

/* =====================================================================
   SNOW
   ===================================================================== */
const snow = (function () {
  const cv = $('#snow');
  const ctx = cv.getContext('2d');
  let flakes = [], w, h, running = true;
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((w * h) / 9000);
    flakes = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.8 + 0.2, o: Math.random() * Math.PI * 2,
    }));
  }
  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const f of flakes) {
      f.y += 0.35 + f.z * 1.1;
      f.o += 0.01;
      f.x += Math.sin(f.o) * 0.4 * f.z + 0.15;
      if (f.y > h + 4) { f.y = -4; f.x = Math.random() * w; }
      if (f.x > w + 4) f.x = -4;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.z * 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.55 + f.z * 0.45})`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(80,92,112,0.12)';
      ctx.stroke();
    }
    requestAnimationFrame(tick);
  }
  size();
  addEventListener('resize', size);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) tick();
  return {
    pause() { running = false; },
    play() { if (!running) { running = true; tick(); } },
  };
})();

/* =====================================================================
   PARALLAX (outside)
   ===================================================================== */
(function () {
  const layers = $$('#outsideSvg [data-depth]');
  if (!matchMedia('(hover: hover)').matches) return;
  $('#outside').addEventListener('mousemove', (e) => {
    const dx = e.clientX / innerWidth - 0.5;
    const dy = e.clientY / innerHeight - 0.5;
    layers.forEach((l) => {
      const d = +l.dataset.depth;
      l.style.transform = `translate(${-dx * d * 5}px, ${-dy * d * 2}px)`;
    });
  });
})();

/* =====================================================================
   SCENE SWITCHING
   ===================================================================== */
const outside = $('#outside');
const inside = $('#inside');
const scan = $('.scan');
const panels = ['work', 'play', 'about', 'inspiration', 'contact'];
const names = { work: 'Projects', play: 'Play', about: 'About', inspiration: 'Inspiration', contact: 'Say hi' };
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function sweep() {
  scan.classList.remove('go');
  void scan.offsetWidth;
  scan.classList.add('go');
}

function enter(instant) {
  if (inside.classList.contains('active')) return;
  if (instant) {
    outside.classList.remove('active');
    inside.classList.add('active');
    snow.pause();
    layoutInside();
    return;
  }
  const r = $('#door').getBoundingClientRect();
  $('#outsideSvg').style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
  outside.classList.add('entering');
  setTimeout(() => {
    sweep();
    outside.classList.remove('active');
    inside.classList.add('active');
    layoutInside();
  }, 750);
  setTimeout(() => { outside.classList.remove('entering'); snow.pause(); }, 1800);
  if (!location.hash) history.replaceState(null, '', '#inside');
}

function exit() {
  Object.keys(wins).forEach((n) => closeWin(n, true));
  closeStart();
  sweep();
  snow.play();
  inside.classList.remove('active');
  outside.classList.add('active');
  history.replaceState(null, '', location.pathname);
}

$('#door').addEventListener('click', () => enter());
$('#enterBtn').addEventListener('click', () => enter());
$('#door').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); } });
$('#exitBtn').addEventListener('click', exit);

/* =====================================================================
   WINDOWS
   ===================================================================== */
const desk = $('#desk');
const tasks = $('#tasks');
const wins = {};
let zTop = 10;

function hotFor(name) { return $(`.hot[data-panel="${name}"]`); }

function sourcePoint(name) {
  const h = hotFor(name);
  const svg = $('#insideSvg');
  const pt = svg.createSVGPoint();
  pt.x = +h.dataset.tx; pt.y = +h.dataset.ty;
  const p = pt.matrixTransform(svg.getScreenCTM());
  return [p.x, p.y];
}

function syncState() {
  const open = Object.keys(wins);
  $$('.hot').forEach((h) => h.classList.toggle('lit', open.includes(h.dataset.panel)));
  const top = open.filter((n) => !wins[n].el.classList.contains('min'))
    .sort((a, b) => wins[b].el.style.zIndex - wins[a].el.style.zIndex)[0];
  history.replaceState(null, '', top ? '#' + top : '#inside');
}

function focusWin(name) {
  Object.entries(wins).forEach(([n, w]) => {
    const on = n === name;
    w.el.classList.toggle('focus', on);
    w.btn.classList.toggle('focus', on);
  });
  if (wins[name]) wins[name].el.style.zIndex = ++zTop;
  syncState();
}

function minimizeWin(name) {
  const w = wins[name];
  w.el.classList.add('min');
  w.el.classList.remove('focus');
  w.btn.classList.add('min');
  w.btn.classList.remove('focus');
  syncState();
}

function restoreWin(name) {
  const w = wins[name];
  w.el.classList.remove('min');
  w.btn.classList.remove('min');
  focusWin(name);
}

function closeWin(name, instant) {
  const w = wins[name];
  if (!w) return;
  delete wins[name];
  w.btn.remove();
  if (instant || reduced) w.el.remove();
  else w.el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.94)' }], { duration: 160, easing: 'ease-in' }).onfinish = () => w.el.remove();
  syncState();
}

function boot(w, name, title) {
  const box = $('.win-boot', w);
  if (reduced) { box.classList.add('done'); return; }
  const lines = [
    `> mount /yurt/${name}`,
    '> handshake ............ <span class="ok">OK</span>',
    `> open ${title.toLowerCase()}  ████████ 100%`,
  ];
  let i = 0;
  const step = () => {
    if (i < lines.length) {
      box.innerHTML += (i ? '\n' : '') + lines[i++];
      setTimeout(step, 130);
    } else {
      setTimeout(() => box.classList.add('done'), 120);
      setTimeout(() => box.remove(), 520);
    }
  };
  step();
}

function makeDraggable(w) {
  const bar = $('.win-bar', w);
  let sx, sy, ox, oy, dragging = false;
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || innerWidth <= 700) return;
    dragging = true;
    bar.setPointerCapture(e.pointerId);
    bar.classList.add('dragging');
    sx = e.clientX; sy = e.clientY;
    ox = w.offsetLeft; oy = w.offsetTop;
  });
  bar.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const x = Math.min(Math.max(ox + e.clientX - sx, -w.offsetWidth + 120), innerWidth - 120);
    const y = Math.min(Math.max(oy + e.clientY - sy, 0), innerHeight - 48 - 40);
    w.style.left = x + 'px';
    w.style.top = y + 'px';
  });
  const end = () => { dragging = false; bar.classList.remove('dragging'); };
  bar.addEventListener('pointerup', end);
  bar.addEventListener('pointercancel', end);
}

function openWin(name) {
  if (!panels.includes(name)) return;
  if (!inside.classList.contains('active')) enter(true);
  closeStart();
  hideTag();
  if (wins[name]) { restoreWin(name); return; }

  const tpl = $('#tpl-' + name);
  const w = document.createElement('div');
  w.className = 'win';
  w.setAttribute('role', 'dialog');
  w.setAttribute('aria-label', names[name]);
  w.innerHTML = `
    <div class="win-bar"><span class="star">✦</span><span class="win-title">${tpl.dataset.title}</span><span class="win-path">${tpl.dataset.path}</span>
      <div class="win-btns"><button data-act="min" aria-label="Minimize">_</button><button data-act="close" aria-label="Close">×</button></div></div>
    <div class="win-boot"></div>
    <div class="win-body"></div>
    <div class="win-status"><span>${tpl.dataset.status}</span><span class="acc">● online</span></div>`;
  $('.win-body', w).appendChild(tpl.content.cloneNode(true));
  desk.appendChild(w);

  // cascade around the centre
  const n = Object.keys(wins).length;
  const W = w.offsetWidth, H = w.offsetHeight;
  const x = Math.min(Math.max((innerWidth - W) / 2 + (n - 1) * 36, 16), innerWidth - W - 16);
  const y = Math.min(Math.max((innerHeight - 48 - H) / 2 + (n - 1) * 30, 72), Math.max(innerHeight - 48 - H - 16, 16));
  w.style.left = x + 'px';
  w.style.top = y + 'px';

  const btn = document.createElement('button');
  btn.textContent = tpl.dataset.title;
  btn.addEventListener('click', () => {
    if (w.classList.contains('min')) restoreWin(name);
    else if (w.classList.contains('focus')) minimizeWin(name);
    else focusWin(name);
  });
  tasks.appendChild(btn);

  wins[name] = { el: w, btn };
  focusWin(name);

  // zoom out of the object that was clicked
  if (!reduced && innerWidth > 700) {
    const [px, py] = sourcePoint(name);
    w.animate([
      { transform: `translate(${px - (x + W / 2)}px, ${py - (y + H / 2)}px) scale(0.06)`, opacity: 0.2 },
      { transform: 'none', opacity: 1 },
    ], { duration: 460, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
  }
  boot(w, name, tpl.dataset.title);
  makeDraggable(w);

  w.addEventListener('pointerdown', () => { if (!w.classList.contains('focus')) focusWin(name); });
  $('[data-act="min"]', w).addEventListener('click', () => minimizeWin(name));
  $('[data-act="close"]', w).addEventListener('click', () => closeWin(name));

  // about window: achievements reveal + offline (night) mode
  const achBtn = $('[data-act="ach"]', w);
  if (achBtn) achBtn.addEventListener('click', () => {
    const list = $('.achievements', w);
    list.hidden = !list.hidden;
    achBtn.setAttribute('aria-expanded', String(!list.hidden));
  });
  const offBtn = $('[data-act="offline"]', w);
  if (offBtn) {
    const label = () => { offBtn.textContent = document.documentElement.dataset.mode === 'night' ? '☀ Online mode' : '☾ Offline mode'; };
    label();
    offBtn.addEventListener('click', () => {
      const next = document.documentElement.dataset.mode === 'night' ? 'day' : 'night';
      $('.mode-toggle button[data-mode="' + next + '"]').click();
      label();
    });
  }
}

$('#insideSvg').addEventListener('click', (e) => {
  const hot = e.target.closest('.hot');
  if (hot) openWin(hot.dataset.panel);
});

/* start menu */
const startBtn = $('#startBtn');
const startMenu = $('#startMenu');
function closeStart() { startMenu.hidden = true; startBtn.setAttribute('aria-expanded', 'false'); }
startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startMenu.hidden = !startMenu.hidden;
  startBtn.setAttribute('aria-expanded', String(!startMenu.hidden));
});
$$('#startMenu [data-open]').forEach((b) => b.addEventListener('click', () => openWin(b.dataset.open)));
$('#smExit').addEventListener('click', exit);
document.addEventListener('click', (e) => { if (!startMenu.hidden && !e.target.closest('#startMenu')) closeStart(); });

addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!startMenu.hidden) return closeStart();
    const top = Object.keys(wins).find((n) => wins[n].el.classList.contains('focus'));
    if (top) closeWin(top);
    else if (inside.classList.contains('active')) exit();
  }
  if (e.key === 'Enter' && outside.classList.contains('active') && document.activeElement === document.body) enter();
});

/* =====================================================================
   HOVER TAGS
   ===================================================================== */
const tag = $('#tag');
const svgIn = $('#insideSvg');

function showTag(h) {
  let p;
  if (h.dataset.tx) {
    const pt = svgIn.createSVGPoint();
    pt.x = +h.dataset.tx; pt.y = +h.dataset.ty - 14;
    p = pt.matrixTransform(svgIn.getScreenCTM());
  } else {
    const r = h.getBoundingClientRect();
    p = { x: r.left + r.width / 2, y: r.top - 6 };
  }
  $('.no', tag).textContent = `[${h.dataset.no}]`;
  $('b', tag).textContent = h.dataset.title;
  $('.d', tag).textContent = h.dataset.desc;
  tag.style.left = Math.min(Math.max(p.x, 100), innerWidth - 100) + 'px';
  tag.style.top = Math.max(p.y, 110) + 'px';
  tag.classList.add('show');
}
function hideTag() { tag.classList.remove('show'); }

$$('.hot').forEach((h) => {
  h.addEventListener('mouseenter', () => showTag(h));
  h.addEventListener('mouseleave', hideTag);
  h.addEventListener('focus', () => showTag(h));
  h.addEventListener('blur', hideTag);
  h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWin(h.dataset.panel); } });
});

/* the cat */
const cat = $('#cat');
function purr() {
  cat.classList.remove('purr');
  void cat.getBoundingClientRect();
  cat.classList.add('purr');
}
cat.addEventListener('click', purr);
cat.addEventListener('mouseenter', () => showTag(cat));
cat.addEventListener('mouseleave', hideTag);
cat.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); purr(); } });

/* the eyeball webcam watches the cursor */
(function () {
  const pupil = $('.look');
  if (!pupil) return;
  inside.addEventListener('mousemove', (e) => {
    const pt = svgIn.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svgIn.getScreenCTM().inverse());
    const a = Math.atan2(p.y - 512, p.x - 1368);
    pupil.setAttribute('transform', `translate(${Math.cos(a) * 5} ${Math.sin(a) * 5})`);
  });
})();

/* =====================================================================
   PORTRAIT SCREENS — let the room pan sideways
   ===================================================================== */
function layoutInside() {
  const narrow = innerWidth / innerHeight < 1.2;
  inside.classList.toggle('pan', narrow);
  if (narrow) inside.scrollLeft = (inside.scrollWidth - innerWidth) / 2;
}
addEventListener('resize', layoutInside);

/* =====================================================================
   CLOCK + DEEP LINKS
   ===================================================================== */
function clock() {
  const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  $('#clock').textContent = t;
  $('#tbClock').textContent = t;
}
clock();
setInterval(clock, 15000);

const start = location.hash.slice(1);
if (panels.includes(start)) { enter(true); requestAnimationFrame(() => openWin(start)); }
else if (start === 'inside') enter(true);
