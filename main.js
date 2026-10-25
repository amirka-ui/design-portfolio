// ---------- theme toggle ----------
(function () {
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem('theme');
    if (saved) root.dataset.theme = saved;
  } catch (e) {}
  const btn = document.querySelector('.theme-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });
})();

// ---------- nav border on scroll ----------
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav && nav.classList.toggle('scrolled', scrollY > 8), { passive: true });

// ---------- footer year ----------
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// ---------- scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ---------- draggable stickers ----------
(function () {
  const pg = document.querySelector('.playground');
  if (!pg) return;
  let z = 10;
  const stickers = [...pg.querySelectorAll('.sticker')];

  // lay out from data-x/data-y (percent) so it scales with the box
  function place() {
    const w = pg.clientWidth, h = pg.clientHeight;
    stickers.forEach((s) => {
      if (s.dataset.moved) return;
      const x = (parseFloat(s.dataset.x) / 100) * (w - s.offsetWidth);
      const y = (parseFloat(s.dataset.y) / 100) * (h - s.offsetHeight);
      s.style.left = x + 'px';
      s.style.top = y + 'px';
    });
  }
  stickers.forEach((s) => (s.style.transform = `rotate(${s.dataset.r || 0}deg)`));
  place();
  addEventListener('resize', place);

  stickers.forEach((s) => {
    let sx, sy, ox, oy;
    s.addEventListener('pointerdown', (e) => {
      s.setPointerCapture(e.pointerId);
      s.classList.add('dragging');
      s.style.zIndex = ++z;
      s.style.transform = `rotate(${s.dataset.r || 0}deg) scale(1.06)`;
      sx = e.clientX; sy = e.clientY;
      ox = s.offsetLeft; oy = s.offsetTop;
    });
    s.addEventListener('pointermove', (e) => {
      if (!s.classList.contains('dragging')) return;
      const maxX = pg.clientWidth - s.offsetWidth, maxY = pg.clientHeight - s.offsetHeight;
      s.style.left = Math.min(Math.max(ox + e.clientX - sx, 0), maxX) + 'px';
      s.style.top = Math.min(Math.max(oy + e.clientY - sy, 0), maxY) + 'px';
      s.dataset.moved = '1';
    });
    const end = () => {
      if (!s.classList.contains('dragging')) return;
      s.classList.remove('dragging');
      s.dataset.r = (Math.random() * 16 - 8).toFixed(1);
      s.style.transform = `rotate(${s.dataset.r}deg)`;
    };
    s.addEventListener('pointerup', end);
    s.addEventListener('pointercancel', end);
  });
})();

// ---------- work: cursor preview + filters ----------
(function () {
  const preview = document.querySelector('.cursor-preview');
  const rows = [...document.querySelectorAll('.work-row')];
  if (preview && matchMedia('(hover: hover)').matches) {
    let tx = 0, ty = 0, x = 0, y = 0, raf;
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      preview.style.left = x + 'px'; preview.style.top = y + 'px';
      raf = requestAnimationFrame(loop);
    };
    rows.forEach((row) => {
      const a = row.querySelector('a');
      a.addEventListener('mouseenter', (e) => {
        preview.style.setProperty('--c1', row.dataset.c1);
        preview.style.setProperty('--c2', row.dataset.c2);
        preview.dataset.label = row.dataset.label || 'cover image';
        x = tx = e.clientX + 180; y = ty = e.clientY;
        preview.classList.add('show');
        cancelAnimationFrame(raf); loop();
      });
      a.addEventListener('mousemove', (e) => { tx = e.clientX + 180; ty = e.clientY; });
      a.addEventListener('mouseleave', () => { preview.classList.remove('show'); cancelAnimationFrame(raf); });
    });
  }

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === chip));
      const f = chip.dataset.filter;
      rows.forEach((r) => r.classList.toggle('hidden', f !== 'all' && r.dataset.tag !== f));
    });
  });
})();
