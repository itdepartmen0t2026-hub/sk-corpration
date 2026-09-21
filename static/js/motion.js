/* ==========================================================
   S K Corporation — Motion engine
   GSAP + ScrollTrigger + Lenis smooth scroll
   ========================================================== */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------- Preloader (always resolves) ---------- */
  const pre = document.getElementById('preloader');
  function killPreloader() {
    document.body.classList.remove('is-loading');
    if (!pre) return;
    if (hasGSAP && !reduce) {
      gsap.to(pre, {
        yPercent: -100, duration: 1, ease: 'expo.inOut',
        onComplete: () => pre.remove()
      });
    } else { pre.remove(); }
  }

  if (pre && !reduce && hasGSAP) {
    const bar = pre.querySelector('.pl-bar');
    const num = pre.querySelector('.pl-count');
    const logo = pre.querySelector('.pl-logo');
    gsap.to(logo, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' });
    const state = { v: 0 };
    gsap.to(state, {
      v: 100, duration: 1.5, ease: 'power2.inOut',
      onUpdate: () => {
        const p = Math.round(state.v);
        if (bar) bar.style.width = p + '%';
        if (num) num.textContent = String(p).padStart(3, '0');
      },
      onComplete: () => setTimeout(start, 180)
    });
  }

  /* ---------- Boot ---------- */
  function start() {
    killPreloader();
    if (!hasGSAP || reduce) { fallbackReveal(); return; }
    document.documentElement.classList.add('gsap-ready');
    gsap.registerPlugin(ScrollTrigger);
    smoothScroll();
    heroIntro();
    revealSystem();
    counters();
    marquee();
    parallax();
    navState();
    ScrollTrigger.refresh();
  }

  if (!pre || reduce || !hasGSAP) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }

  function fallbackReveal() {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Lenis smooth scroll ---------- */
  function smoothScroll() {
    if (typeof window.Lenis === 'undefined' || isTouch) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: .09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -90 }); }
      });
    });
  }

  /* ---------- Split text into masked lines / chars ---------- */
  function splitLines(el) {
    const html = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = html
      .map(chunk => `<span class="line-mask"><span>${chunk}</span></span>`)
      .join('');
    return el.querySelectorAll('.line-mask > span');
  }

  function splitChars(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w =>
      `<span class="word">${w.split('').map(c => `<span class="char">${c}</span>`).join('')}</span>`
    ).join(' ');
    return el.querySelectorAll('.char');
  }

  /* ---------- Hero intro timeline ---------- */
  function heroIntro() {
    const hero = document.querySelector('.hero-section, .page-hero');
    if (!hero) return;
    const title = hero.querySelector('.display-title, .page-title');
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (title) {
      const lines = splitLines(title);
      gsap.set(lines, { yPercent: 118, opacity: 0 });
      tl.to(lines, { yPercent: 0, opacity: 1, duration: 1.25, stagger: .12 }, 0);
    }
    const eyebrow = hero.querySelector('.eyebrow');
    if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 18, duration: .8 }, .1);

    const rest = hero.querySelectorAll('.hero-copy, .page-lead, .hero-section .btn, .hero-metrics > div, .quote-strip');
    if (rest.length) tl.from(rest, { opacity: 0, y: 26, duration: .9, stagger: .07 }, .45);

    const card = hero.querySelector('.hero-card');
    if (card) tl.from(card, { opacity: 0, y: 60, rotateX: 12, scale: .96, duration: 1.3, transformOrigin: '50% 100%' }, .35);

    // Hero image panel: clip reveal + slow drift, info card floats up after
    const media = hero.querySelector('.hv-media');
    if (media) {
      const img = media.querySelector('img');
      tl.fromTo(media,
        { clipPath: 'inset(100% 0% 0% 0% round 30px)', y: 44 },
        { clipPath: 'inset(0% 0% 0% 0% round 30px)', y: 0, duration: 1.5, ease: 'expo.out' }, .3);
      tl.fromTo(img, { scale: 1.28 }, { scale: 1.06, duration: 2.1, ease: 'power3.out' }, .3);
      const badge = media.querySelector('.hv-badge');
      if (badge) tl.from(badge, { opacity: 0, x: -18, duration: .8 }, 1.2);
      // parallax + gentle continuous drift while scrolling
      gsap.to(img, {
        yPercent: 8, scale: 1.14, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    const hvCard = hero.querySelector('.hv-card');
    if (hvCard) tl.from(hvCard, { opacity: 0, y: 46, scale: .96, duration: 1.1, ease: 'expo.out' }, 1);

    const hint = hero.querySelector('.scroll-hint');
    if (hint) tl.from(hint, { opacity: 0, duration: .8 }, 1.1);

    hero.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));

    // Orb + grid parallax on scroll
    gsap.utils.toArray('.hero-orb').forEach((orb, i) => {
      gsap.to(orb, {
        y: (i + 1) * 110, x: i % 2 ? -60 : 60, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.to(orb, { scale: 1.16, duration: 6 + i * 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
    const grid = hero.querySelector('.hero-grid');
    if (grid) gsap.to(grid, {
      yPercent: 16, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    });
    // Hero content lifts away
    const content = hero.querySelector('.container');
    if (content) gsap.to(content, {
      y: -70, opacity: .25, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'center top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- Scroll reveal system ---------- */
  function revealSystem() {
    // Section headings: char-by-char
    gsap.utils.toArray('.section-heading h2, .display-section').forEach(h => {
      const chars = splitChars(h);
      gsap.from(chars, {
        yPercent: 105, opacity: 0, duration: .8, ease: 'expo.out', stagger: .014,
        scrollTrigger: { trigger: h, start: 'top 88%', once: true }
      });
    });

    // Grid rows: stagger children
    gsap.utils.toArray('.row').forEach(row => {
      const kids = row.querySelectorAll(':scope > [class*="col-"] > *');
      if (!kids.length) return;
      const inHero = row.closest('.hero-section, .page-hero');
      if (inHero) return;
      gsap.from(kids, {
        opacity: 0, y: 46, scale: .97, duration: .95, ease: 'power3.out', stagger: .09,
        scrollTrigger: { trigger: row, start: 'top 86%', once: true }
      });
    });

    // Remaining .reveal elements
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.closest('.hero-section, .page-hero')) { el.classList.add('in-view'); return; }
      gsap.to(el, {
        opacity: 1, y: 0, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
      gsap.set(el, { y: 28 });
    });

    // Dark section fade-in tint
    gsap.utils.toArray('.dark-section, .support-panel, .contact-card, .form-card').forEach(s => {
      gsap.from(s, {
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: s, start: 'top 88%', once: true }
      });
    });
  }

  /* ---------- Animated counters ---------- */
  function counters() {
    gsap.utils.toArray('.hero-metrics strong, [data-count]').forEach(el => {
      const raw = (el.dataset.count || el.textContent).trim();
      const target = parseFloat(raw.replace(/[^\d.]/g, ''));
      if (isNaN(target)) return;
      const suffix = raw.replace(/[\d.,]/g, '');
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; }
      });
    });
  }

  /* ---------- Infinite marquee ---------- */
  function marquee() {
    document.querySelectorAll('.marquee-track').forEach(track => {
      const dir = track.dataset.dir === 'right' ? 1 : -1;
      track.innerHTML += track.innerHTML;
      const half = track.scrollWidth / 2;
      gsap.to(track, {
        x: dir * -half, duration: 26, ease: 'none', repeat: -1,
        modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % half) }
      });
    });
  }

  /* ---------- Parallax media + scroll progress ---------- */
  function parallax() {
    gsap.utils.toArray('.parallax-media img').forEach(img => {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    gsap.utils.toArray('.image-frame').forEach(f => {
      gsap.fromTo(f, { rotate: -3.2, y: 40 }, {
        rotate: -1.1, y: 0, duration: 1.3, ease: 'power3.out',
        scrollTrigger: { trigger: f, start: 'top 88%', once: true }
      });
    });
    const bar = document.getElementById('scroll-progress');
    if (bar) gsap.to(bar, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .3 }
    });
  }

  /* ---------- Nav shrink ---------- */
  function navState() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: self => nav.classList.toggle('nav-shrunk', self.scroll() > 80),
      onToggle: self => nav.classList.toggle('nav-shrunk', self.isActive)
    });
  }

  /* ==========================================================
     Pointer-driven effects (independent of GSAP boot)
     ========================================================== */
  if (!reduce && !isTouch) {
    /* Cursor glow with easing */
    const glow = document.getElementById('cursor-glow');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, gx = mx, gy = my;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      document.body.classList.add('cursor-live');
    }, { passive: true });
    (function loop() {
      gx += (mx - gx) * .12; gy += (my - gy) * .12;
      if (glow) glow.style.transform = `translate3d(${gx - 210}px,${gy - 210}px,0)`;
      requestAnimationFrame(loop);
    })();

    /* Magnetic buttons */
    document.querySelectorAll('.btn, .circle-link, .text-link').forEach(btn => {
      btn.classList.add('magnetic');
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        btn.style.setProperty('--mx', (x / r.width * 100) + '%');
        btn.style.setProperty('--my', (y / r.height * 100) + '%');
        const dx = (x - r.width / 2) / r.width * 16;
        const dy = (y - r.height / 2) / r.height * 12;
        btn.style.transform = `translate(${dx}px,${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    /* 3D tilt + spotlight cards */
    document.querySelectorAll('.capability-card, .product-card, .catalog-card, .service-card, .partner-tile, .hero-card')
      .forEach(card => {
        card.classList.add('tilt', 'spotlight');
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', px * 100 + '%');
          card.style.setProperty('--my', py * 100 + '%');
          card.style.transform =
            `perspective(900px) rotateY(${(px - .5) * 9}deg) rotateX(${(.5 - py) * 9}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      });
    document.querySelectorAll('.capability-card').forEach(c => c.classList.add('sweep'));
  }

  /* ---------- Page transition curtain ---------- */
  const curtain = document.getElementById('page-curtain');
  if (curtain && hasGSAP && !reduce) {
    document.querySelectorAll('a[href]').forEach(a => {
      const url = a.getAttribute('href');
      if (!url || url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:') ||
          a.target === '_blank' || a.hasAttribute('download')) return;
      if (a.host && a.host !== window.location.host) return;
      a.addEventListener('click', e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        gsap.timeline()
          .set(curtain, { yPercent: 100 })
          .to(curtain, { yPercent: 0, duration: .62, ease: 'expo.inOut' })
          .add(() => { window.location.href = a.href; });
      });
    });
    window.addEventListener('pageshow', () => gsap.set(curtain, { yPercent: 100 }));
  }

  /* ==========================================================
     Hero neural-network canvas
     ========================================================== */
  (function neural() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || reduce) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes = [], pointer = { x: -999, y: -999 };
    const COUNT = window.innerWidth < 768 ? 34 : 74;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function build() {
      nodes = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .30, vy: (Math.random() - .5) * .30,
        r: Math.random() * 1.7 + .9
      }));
    }
    canvas.parentElement.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { pointer.x = pointer.y = -999; });

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dpx = pointer.x - n.x, dpy = pointer.y - n.y;
        const pd = Math.hypot(dpx, dpy);
        if (pd < 150) { n.x -= dpx / pd * .55; n.y -= dpy / pd * .55; }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 138) {
            const alpha = (1 - d / 138) * .34;
            ctx.strokeStyle = `rgba(24,38,80,${alpha})`;
            ctx.lineWidth = .7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const near = Math.hypot(pointer.x - n.x, pointer.y - n.y) < 160;
        ctx.beginPath();
        ctx.fillStyle = near ? 'rgba(239,35,60,.85)' : 'rgba(24,38,80,.42)';
        ctx.arc(n.x, n.y, near ? n.r * 1.7 : n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    resize(); build();
    window.addEventListener('resize', () => { resize(); build(); }, { passive: true });
    frame();
  })();
})();
