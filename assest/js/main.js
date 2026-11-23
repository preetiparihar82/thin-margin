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
    'Warehouse Custody',
    'Supply Chain Yield',
    'Material Stewardship',
    'Zero Demurrage'
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
  // 7. STRATEGIC CONSULTATION & ENQUIRY SIDE DRAWER LOGIC
  // ==========================================================================
  const consultModal = document.getElementById('consultModal');
  const closeConsultModal = document.getElementById('closeConsultModal');
  const openButtons = document.querySelectorAll('.open-consult-modal');

  const tabBtnEnquiry = document.getElementById('tabBtnEnquiry');
  const tabBtnConsultation = document.getElementById('tabBtnConsultation');
  const paneEnquiry = document.getElementById('paneEnquiry');
  const paneConsultation = document.getElementById('paneConsultation');

  const switchDrawerTab = (tabName) => {
    if (tabName === 'consultation') {
      tabBtnConsultation?.classList.add('active');
      tabBtnEnquiry?.classList.remove('active');
      paneConsultation?.classList.add('active');
      paneEnquiry?.classList.remove('active');
    } else {
      tabBtnEnquiry?.classList.add('active');
      tabBtnConsultation?.classList.remove('active');
      paneEnquiry?.classList.add('active');
      paneConsultation?.classList.remove('active');
    }
  };

  tabBtnEnquiry?.addEventListener('click', () => switchDrawerTab('enquiry'));
  tabBtnConsultation?.addEventListener('click', () => switchDrawerTab('consultation'));

  const openDrawer = (tabName) => {
    if (!consultModal) return;
    switchDrawerTab(tabName || 'enquiry');
    consultModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!consultModal) return;
    consultModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-drawer-tab') || (btn.classList.contains('btn-hero-secondary') ? 'consultation' : 'enquiry');
      openDrawer(targetTab);
    });
  });

  closeConsultModal?.addEventListener('click', () => {
    closeDrawer();
  });

  consultModal?.addEventListener('click', (e) => {
    if (e.target === consultModal) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && consultModal?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Handle Enquiry Form Submit
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const origHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>ENQUIRY RECEIVED! WE WILL CONTACT YOU.</span>';
        submitBtn.style.backgroundColor = '#10b981';
      }
      setTimeout(() => {
        closeDrawer();
        enquiryForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = origHtml;
          submitBtn.style.backgroundColor = '';
        }
      }, 2500);
    });
  }

  // Handle Free Consultation Form Submit
  const consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      const origHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>CONSULTATION SCHEDULED! CHECK YOUR EMAIL.</span>';
        submitBtn.style.backgroundColor = '#10b981';
      }
      setTimeout(() => {
        closeDrawer();
        consultationForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = origHtml;
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

  // ==========================================================================
  // 9. CONTINUOUS-FLOW BUTTON SWIPE ANIMATION
  // Hover: Sweeps in from left
  // Unhover: Sweeps out to right (revealing real original color from the left)
  // ==========================================================================
  const swipeButtons = document.querySelectorAll('.btn-custom, .btn-swipe');
  swipeButtons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      btn.classList.remove('btn-unhovering');
      btn.classList.add('btn-hovering');
    });

    btn.addEventListener('mouseleave', () => {
      btn.classList.remove('btn-hovering');
      btn.classList.add('btn-unhovering');
      setTimeout(() => {
        if (!btn.matches(':hover') && !btn.classList.contains('btn-hovering')) {
          btn.classList.remove('btn-unhovering');
        }
      }, 360);
    });
  });
});
