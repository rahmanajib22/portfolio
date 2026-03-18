/* ═══════════════════════════════════════════════════════════
   RAHMA PORTFOLIO — INTERACTIONS & ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ─── LOADING SCREEN ─── */
(function() {
  const loader = document.createElement('div');
  loader.id = 'loading-screen';
  loader.innerHTML = `
    <div class="loader-logo glitch">Rahma.</div>
    <div class="loader-bar"><div class="loader-fill"></div></div>
  `;
  document.body.insertBefore(loader, document.body.firstChild);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    }, 1200);
  });
})();

/* ─── SCROLL PROGRESS BAR ─── */
(function() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
})();

/* ─── CUSTOM CURSOR ─── */
(function() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateTrail() {
    tx += (mx - tx) * 0.15;
    ty += (my - ty) * 0.15;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover effect on interactive elements
  const hoverable = 'a, button, .flip-card, .project-card, .auto-card, .contact-info-card, input, textarea, select';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverable)) cursor.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverable)) cursor.classList.remove('cursor-hover');
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; trail.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; trail.style.opacity = '1'; });
})();

/* ─── PARTICLE NETWORK CANVAS ─── */
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -999, y: -999 };

  const CONFIG = {
    count: 90,
    speed: 0.35,
    connectDist: 130,
    mouseRadius: 160,
    colors: ['rgba(168,85,247,', 'rgba(0,198,255,', 'rgba(244,63,151,'],
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.vx   = (Math.random() - 0.5) * CONFIG.speed;
    this.vy   = (Math.random() - 0.5) * CONFIG.speed;
    this.r    = Math.random() * 2 + 0.5;
    this.col  = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    this.alpha = Math.random() * 0.6 + 0.2;
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < CONFIG.mouseRadius) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        p.x += dx / dist * force * 2;
        p.y += dy / dist * force * 2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.alpha + ')';
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < CONFIG.connectDist) {
          const alpha = (1 - d / CONFIG.connectDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(168,85,247,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();
  draw();
})();

/* ─── NAVBAR: SCROLL + ACTIVE ─── */
(function() {
  const nav     = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', onScroll, { passive: true });

  function onScroll() {
    // Sticky style
    nav.classList.toggle('scrolled', window.scrollY > 40);

    // Active link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }
  onScroll();
})();

/* ─── HAMBURGER / MOBILE MENU ─── */
(function() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
  });
});

/* ─── INTERSECTION OBSERVER — REVEAL ─── */
(function() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ─── COUNTER ANIMATION ─── */
(function() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target);
      const dur    = 1800;
      const step   = 16;
      const inc    = target / (dur / step);
      let current  = 0;
      const timer  = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ─── SKILL BAR ANIMATION ─── */
(function() {
  const card = document.querySelector('.about-card-main');
  if (!card) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      card.classList.add('trait-animated');
      observer.unobserve(card);
    }
  }, { threshold: 0.4 });

  observer.observe(card);
})();

/* ─── PARALLAX HERO ELEMENTS ─── */
(function() {
  const orbs   = document.querySelectorAll('.hero-orb');
  const sphere = document.querySelector('.hero-sphere');
  const fCards = document.querySelectorAll('.floating-card');

  let lastScrollY = 0, ticking = false;

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = lastScrollY;
        orbs.forEach((o, i) => {
          o.style.transform = `translate(0, ${y * (0.08 + i * 0.04)}px)`;
        });
        if (sphere) sphere.style.transform = `translate(-50%, calc(-50% + ${y * 0.06}px))`;
        fCards.forEach((c, i) => {
          c.style.transform = `translateY(${-12 + y * (0.03 + i * 0.01)}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ─── MOUSE PARALLAX FOR CARDS ─── */
(function() {
  function applyTilt(card, e) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-12px)`;
  }

  function resetTilt(card) {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => card.style.transition = '', 500);
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => applyTilt(card, e));
    card.addEventListener('mouseleave', () => resetTilt(card));
  });
})();

/* ─── NEON TEXT MORPH ON SCROLL ─── */
(function() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const lines    = heroTitle.querySelectorAll('.title-line, .title-divider');
    const offset   = Math.min(scrolled / 300, 1);

    lines.forEach((el, i) => {
      el.style.transform   = `translateX(${i % 2 === 0 ? -offset * 30 : offset * 30}px)`;
      el.style.opacity     = 1 - offset * 0.6;
      el.style.transition  = 'transform 0.1s linear, opacity 0.1s linear';
    });
  }, { passive: true });
})();

/* ─── CONTACT FORM ─── */
(function() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn     = document.getElementById('submit-btn');
  if (!form) return;

  // Neon glow on typing
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('.input-glow').style.boxShadow =
        '0 0 0 2px var(--violet), 0 0 30px rgba(168,85,247,0.4)';
    });
    input.addEventListener('blur', () => {
      input.parentElement.querySelector('.input-glow').style.boxShadow = '';
    });
    input.addEventListener('input', () => {
      if (input.value) {
        input.style.borderColor = 'rgba(168,85,247,0.5)';
      } else {
        input.style.borderColor = '';
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending...';

    // Simulate send
    setTimeout(() => {
      btn.querySelector('.btn-text').textContent = 'Sent! ✓';
      btn.style.background = 'linear-gradient(135deg, #10ffa0, #00c6ff)';
      success.classList.add('show');
      form.reset();

      setTimeout(() => {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Send Message';
        btn.style.background = '';
        success.classList.remove('show');
      }, 4000);
    }, 1200);
  });
})();

/* ─── TYPEWRITER EFFECT (Hero Subtitle) ─── */
(function() {
  const phrases = [
    'Marketing Strategist | AI-Powered Creator | Digital Innovator',
    'Building Intelligent Systems That Scale',
    'Turning Automation Into Competitive Advantage',
    'Where Strategy Meets Artificial Intelligence',
  ];

  const container = document.querySelector('.hero-subtitle');
  if (!container) return;

  // We'll subtly change the glow color of highlights while the page is idle
  const highlights = container.querySelectorAll('.highlight-blue, .highlight-violet, .highlight-pink');
  let idx = 0;
  setInterval(() => {
    highlights.forEach(h => {
      h.style.filter = `brightness(${1.2 + Math.sin(Date.now() / 600 + idx++) * 0.3}) drop-shadow(0 0 ${4 + Math.sin(Date.now() / 400) * 4}px currentColor)`;
    });
  }, 50);
})();

/* ─── AUTO-CARD STAGGER ENTRANCE ─── */
(function() {
  const autoCards = document.querySelectorAll('.auto-card');
  autoCards.forEach((card, idx) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateX(-20px)';
    card.style.transition = `opacity 0.6s ${idx * 0.1}s ease, transform 0.6s ${idx * 0.1}s ease`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        autoCards.forEach(card => {
          card.style.opacity   = '1';
          card.style.transform = 'translateX(0)';
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });

  const grid = document.querySelector('.automation-grid');
  if (grid) observer.observe(grid);
})();

/* ─── PROJECT CARD EXPAND ─── */
(function() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('expanded');
      document.querySelectorAll('.project-card').forEach(c => c.classList.remove('expanded'));
      if (!isOpen) card.classList.add('expanded');
    });
  });
})();

/* ─── NEON GLOW PULSE ON HOVER (Section Tags) ─── */
(function() {
  document.querySelectorAll('.section-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.textShadow = '0 0 20px var(--violet), 0 0 40px var(--violet)';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.textShadow = '';
    });
  });
})();

/* ─── SCROLL-TRIGGERED NEON LINE ANIMATION ─── */
(function() {
  const connectors = document.querySelectorAll('.neon-connector');
  const observer   = new IntersectionObserver(entries => {
    entries.forEach(e => {
      e.target.style.opacity = e.isIntersecting ? '1' : '0.2';
    });
  }, { threshold: 0.5 });
  connectors.forEach(c => observer.observe(c));
})();

/* ─── DYNAMIC BACKGROUND GRADIENT SHIFT on scroll ─── */
(function() {
  let hue = 260;
  window.addEventListener('scroll', () => {
    const progress = window.scrollY / document.documentElement.scrollHeight;
    hue = 260 + progress * 60; // purple → blue
    document.documentElement.style.setProperty('--violet', `hsl(${hue}, 90%, 65%)`);
    document.documentElement.style.setProperty('--violet-dim', `hsla(${hue}, 90%, 65%, 0.15)`);
    document.documentElement.style.setProperty('--violet-glow', `hsla(${hue}, 90%, 65%, 0.4)`);
  }, { passive: true });
})();

/* ─── FLIP CARD — Touch Support ─── */
(function() {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      const inner = card.querySelector('.flip-inner');
      inner.style.transform = card.classList.contains('flipped') ? 'rotateY(180deg)' : '';
    });
  });
})();

/* ─── STATS PARTICLE BURST on click ─── */
(function() {
  function burst(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('div');
      const angle  = (i / 12) * Math.PI * 2;
      const radius = 40 + Math.random() * 40;
      Object.assign(dot.style, {
        position:   'fixed',
        width:      '6px',
        height:     '6px',
        borderRadius: '50%',
        background: color,
        boxShadow:  `0 0 8px ${color}`,
        left:       x + 'px',
        top:        y + 'px',
        transform:  'translate(-50%,-50%)',
        pointerEvents: 'none',
        zIndex:     9999,
        transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
        opacity:    '1',
      });
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.left    = (x + Math.cos(angle) * radius) + 'px';
        dot.style.top     = (y + Math.sin(angle) * radius) + 'px';
        dot.style.opacity = '0';
        dot.style.transform = 'translate(-50%,-50%) scale(0)';
      });
      setTimeout(() => dot.remove(), 700);
    }
  }

  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', e => {
      burst(e.clientX, e.clientY, '#a855f7');
    });
  });
})();

/* ─── GREETING based on time ─── */
(function() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;
  const h = new Date().getHours();
  const greet = h < 12 ? '🌅 Good morning' : h < 17 ? '☀️ Good afternoon' : '🌙 Good evening';
  badge.innerHTML = `<span class="badge-dot"></span>${greet} — Available for Projects`;
})();

console.log('%c✦ Rahma Portfolio ✦', 'color: #a855f7; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #a855f7;');
console.log('%cBuilt with intelligence, designed with purpose.', 'color: #00c6ff; font-size: 12px;');
