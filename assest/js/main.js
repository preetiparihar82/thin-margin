/**
 * THIN MARGIN - RED & BLACK BRAND ENGINE
 * Interactions, Hero Slide Dissolves, Typewriter Typing Animation & Counters
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Sticky on Scroll
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================================================
  // 2. HERO AUTOMATIC DISSOLVING BACKGROUND SLIDES & DOCK PAGINATION
  // ==========================================================================
  const heroSlides = document.querySelectorAll('.hero-bg-slide');
  const dockDots = document.querySelectorAll('.dock-dot');
  let currentSlideIndex = 0;
  let heroTimer = null;

  function switchHeroSlide(targetIndex) {
    if (!heroSlides.length) return;
    if (targetIndex >= heroSlides.length) targetIndex = 0;
    if (targetIndex < 0) targetIndex = heroSlides.length - 1;

    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === targetIndex);
    });

    dockDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === targetIndex);
    });

    currentSlideIndex = targetIndex;
  }

  function startHeroTimer() {
    stopHeroTimer();
    heroTimer = setInterval(() => {
      switchHeroSlide(currentSlideIndex + 1);
    }, 5500);
  }

  function stopHeroTimer() {
    if (heroTimer) {
      clearInterval(heroTimer);
      heroTimer = null;
    }
  }

  dockDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-slide-index'), 10) || 0;
      switchHeroSlide(idx);
      startHeroTimer();
    });
  });

  if (heroSlides.length > 1) {
    startHeroTimer();
  }

  // ==========================================================================
  // 3. TYPESCRIPT / TYPEWRITER ANIMATION ON HERO HEADLINE
  // ==========================================================================
  const typingElement = document.getElementById('heroTypingText');
  const phrases = [
    'Every Asset',
    'Zero Demurrage',
    'Yard Custody',
    'Supply Velocity'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function typeEffect() {
    if (!typingElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 45;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at full word
      isDeleting = true;
      typeSpeed = 2200;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  if (typingElement) {
    setTimeout(typeEffect, 1000);
  }

  // ==========================================================================
  // 4. SCROLL REVEAL SECTION & CARD TRANSITIONS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-fade-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('revealed');
    } else {
      revealObserver.observe(el);
    }
  });

  // ==========================================================================
  // 5. ANIMATED NUMBER COUNTERS (IMAGE 4)
  // ==========================================================================
  const counterEls = document.querySelectorAll('.counter-number-val');
  let hasCountersAnimated = false;

  function countUp(el, targetNum, suffix = '') {
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.floor(progress * targetNum);
      el.textContent = `${val}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${targetNum}${suffix}`;
      }
    }
    requestAnimationFrame(update);
  }

  const counterSection = document.querySelector('.upfronts-counters-row');
  if (counterSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasCountersAnimated) {
          hasCountersAnimated = true;
          counterEls.forEach((el) => {
            const raw = el.textContent.trim();
            if (raw.includes('10+')) {
              countUp(el, 10, '+');
            } else if (raw.includes('1.2GW+')) {
              el.innerHTML = '<span style="color:#ffffff;">1.2GW+</span>';
            } else if (raw.includes('24-Hr')) {
              countUp(el, 24, '-Hr');
            } else if (raw.includes('100%')) {
              countUp(el, 100, '%');
            }
          });
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(counterSection);
  }

  // ==========================================================================
  // 6. SEAMLESS INFINITE MARQUEE ON TESTIMONIAL TICKER
  // ==========================================================================
  const testimonialTrack = document.getElementById('testimonialTrack');
  if (testimonialTrack) {
    const originalCards = Array.from(testimonialTrack.children);
    originalCards.forEach((c) => {
      testimonialTrack.appendChild(c.cloneNode(true));
    });
  }

  // ==========================================================================
  // 7. STRATEGIC CONSULTATION MODAL LOGIC
  // ==========================================================================
  const consultModal = document.getElementById('consultModal');
  const closeConsultModal = document.getElementById('closeConsultModal');
  const consultForm = document.getElementById('consultForm');
  const openButtons = document.querySelectorAll('.open-consult-modal');

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const defaultService = btn.getAttribute('data-service-default');
      if (defaultService && consultModal) {
        const select = document.getElementById('consultService');
        if (select) {
          for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value.toLowerCase().includes(defaultService.toLowerCase())) {
              select.selectedIndex = i;
              break;
            }
          }
        }
      }
      consultModal?.classList.add('open');
    });
  });

  closeConsultModal?.addEventListener('click', () => {
    consultModal?.classList.remove('open');
  });

  consultModal?.addEventListener('click', (e) => {
    if (e.target === consultModal) {
      consultModal.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && consultModal?.classList.contains('open')) {
      consultModal.classList.remove('open');
    }
  });

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = consultForm.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>DISPATCHED! OUR OPERATIONS TEAM WILL CONTACT YOU.</span>';
        submitBtn.style.backgroundColor = '#10b981';
      }
      setTimeout(() => {
        consultModal?.classList.remove('open');
        consultForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = origText;
          submitBtn.style.backgroundColor = '';
        }
      }, 2500);
    });
  }

  // ==========================================================================
  // 8. MOBILE NAVIGATION TOGGLE
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const tmNav = document.querySelector('.tm-nav');
  if (mobileToggle && tmNav) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = tmNav.style.display === 'flex';
      tmNav.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        tmNav.style.position = 'absolute';
        tmNav.style.top = '100%';
        tmNav.style.left = '0';
        tmNav.style.width = '100%';
        tmNav.style.background = '#111317';
        tmNav.style.padding = '20px';
        tmNav.style.flexDirection = 'column';
        const list = tmNav.querySelector('.tm-nav-list');
        if (list) {
          list.style.flexDirection = 'column';
          list.style.gap = '15px';
        }
      }
    });
  }
});
