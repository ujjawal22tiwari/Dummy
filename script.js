/* ===== MISHRA ASSOCIATES — MAIN JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ======================================
     1. NAVBAR — scroll behaviour + toggle
     ====================================== */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    handleBackToTop();
    updateActiveNav();
    startCounters();
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ======================================
     2. HERO IMAGE SLIDER
     ====================================== */
  const slides      = document.querySelectorAll('.slide');
  const dots        = document.querySelectorAll('.slider-dot');
  const prevBtn     = document.getElementById('slider-prev');
  const nextBtn     = document.getElementById('slider-next');
  const counterEl   = document.getElementById('slide-current');
  let   currentSlide = 0;
  let   autoTimer;

  function goToSlide(idx) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    if (counterEl) counterEl.textContent = String(currentSlide + 1).padStart(2, '0');
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); startAuto(); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); startAuto(); });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => { goToSlide(idx); startAuto(); });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goToSlide(currentSlide - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); startAuto(); }
  });

  // Touch/swipe support
  let touchStartX = 0;
  const sliderEl = document.querySelector('.hero-slider');
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    sliderEl.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        startAuto();
      }
    }, { passive: true });
  }

  startAuto();

  /* ======================================
     3. SCROLL-TRIGGERED REVEAL ANIMATIONS
     ====================================== */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  // Auto-add reveal to key sections
  const autoRevealTargets = [
    { sel: '.about-img-block',      cls: 'reveal-left'  },
    { sel: '.about-content',        cls: 'reveal-right' },
    { sel: '.stat-block',           cls: 'reveal'       },
    { sel: '.service-card',         cls: 'reveal'       },
    { sel: '.project-card',         cls: 'reveal'       },
    { sel: '.chairman-img-wrap',    cls: 'reveal-left'  },
    { sel: '.chairman-content',     cls: 'reveal-right' },
    { sel: '.why-card',             cls: 'reveal'       },
    { sel: '.section-header',       cls: 'reveal'       },
    { sel: '.cta-inner',            cls: 'reveal'       },
    { sel: '.contact-strip-item',   cls: 'reveal'       },
  ];

  autoRevealTargets.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
        el.classList.add(cls);
        el.style.transitionDelay = `${i * 0.08}s`;
        revealObserver.observe(el);
      }
    });
  });

  /* ======================================
     4. ANIMATED COUNTERS
     ====================================== */
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const statsSection = document.querySelector('.stats-section') || document.getElementById('why-us');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      countersStarted = true;
      document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target   = parseInt(el.dataset.target, 10);
        const duration = 2200;
        const steps    = Math.ceil(duration / 16);
        const step     = target / steps;
        let   current  = 0;
        const timer    = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current);
        }, 16);
      });
    }
  }
  startCounters();

  /* ======================================
     5. BACK TO TOP
     ====================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ======================================
     6. SMOOTH SCROLL
     ====================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const demoBannerH = document.getElementById('demo-banner') ? 38 : 0;
        const navH = (navbar ? navbar.offsetHeight : 78) + demoBannerH;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navH + 4, behavior: 'smooth' });
      }
    });
  });

  /* ======================================
     7. ACTIVE NAV HIGHLIGHT
     ====================================== */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + (navbar ? navbar.offsetHeight : 80) + 50;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const link   = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (link && !(link.classList.contains('nav-cta-btn'))) {
        link.style.color = (scrollPos >= top && scrollPos < bottom) ? 'var(--gold)' : '';
      }
    });
  }
  updateActiveNav();

  /* ======================================
     8. SERVICE CARD HOVER 3D TILT
     ====================================== */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 6;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 6;
      card.style.transform = `translateY(-4px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

});
