(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Section reveal ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .08 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Mobile menu ---------- */
  const btn = $('.menu-btn');
  const menu = $('.nav nav');
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  $$('.nav nav a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  }));

  /* ---------- Active nav link ---------- */
  const links = $$('.nav nav a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));
})();

/* ---------- Polish: scroll progress, card spotlight, 3D tilt ---------- */
(function () {
  'use strict';
  const bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);
  const upd = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  };
  addEventListener('scroll', upd, { passive: true });
  upd();
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.card, .shot').forEach(el => {
    el.addEventListener('mousemove', e => {
      const b = el.getBoundingClientRect();
      const x = e.clientX - b.left, y = e.clientY - b.top;
      el.style.setProperty('--mx', x + 'px');
      el.style.setProperty('--my', y + 'px');
      if (!still && el.classList.contains('tilt')) {
        el.style.transform = 'perspective(800px) rotateX(' + (((y / b.height) - .5) * -6) + 'deg) rotateY(' + (((x / b.width) - .5) * 6) + 'deg) translateY(-4px)';
      }
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ---------- Network background ---------- */
(function () {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas'); cv.id = 'bg';
  document.body.prepend(cv);
  const g = cv.getContext('2d'); let W, H, pts = [];
  const size = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    pts = Array.from({ length: Math.min(55, Math.floor(W * H / 24000)) }, () =>
      ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
  };
  size(); addEventListener('resize', size);
  (function draw() {
    g.clearRect(0, 0, W, H);
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      g.fillStyle = 'rgba(182,255,59,.7)'; g.fillRect(p.x, p.y, 2, 2);
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) { g.strokeStyle = 'rgba(182,255,59,' + (.14 * (1 - d / 130)) + ')'; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke(); }
      }
    });
    requestAnimationFrame(draw);
  })();
})();
