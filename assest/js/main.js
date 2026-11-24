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
    'Zero Demurrage',
    'Warehouse Excellence',
    'Supply Chain Success',
    'Material Stewardship'
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
  // 5. ANIMATED NUMBER COUNTERS: INDIVIDUAL ROTATING ODOMETER / SLIDER TICKER
  // ==========================================================================
  const counterEls = document.querySelectorAll('.counter-number-val');
  let hasCountersAnimated = false;
  const rollerInstances = [];

  function initCounterRoller(el) {
    const rawValue = (el.getAttribute('data-value') || el.textContent || '').trim();
    if (!rawValue) return null;

    el.setAttribute('data-value', rawValue);
    el.innerHTML = '';
    const chars = rawValue.split('');
    const digitRollers = [];

    chars.forEach((ch, colIdx) => {
      if (/[0-9]/.test(ch)) {
        const targetDigit = parseInt(ch, 10);
        const col = document.createElement('span');
        col.className = 'counter-roller-col';

        const strip = document.createElement('span');
        strip.className = 'counter-roller-strip';

        // Build 2 full cycles (0-9, 0-9) + up to targetDigit for smooth rolling reel
        const sequence = [];
        for (let cycle = 0; cycle < 2; cycle++) {
          for (let d = 0; d <= 9; d++) sequence.push(d);
        }
        for (let d = 0; d <= targetDigit; d++) sequence.push(d);

        sequence.forEach((d) => {
          const digitSpan = document.createElement('span');
          digitSpan.className = 'counter-roller-digit';
          digitSpan.textContent = d;
          strip.appendChild(digitSpan);
        });

        col.appendChild(strip);
        el.appendChild(col);

        const finalIndex = sequence.length - 1;
        // Staggered delay for each digit like a bank amount odometer
        const delay = colIdx * 0.12;
        digitRollers.push({ strip, finalIndex, delay });
      } else {
        const staticSpan = document.createElement('span');
        staticSpan.className = 'counter-roller-static';
        staticSpan.textContent = ch;
        el.appendChild(staticSpan);
      }
    });

    const roll = (duration = 1800) => {
      digitRollers.forEach(({ strip, finalIndex, delay }) => {
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        // Force layout reflow
        void strip.offsetHeight;
        strip.style.transition = `transform ${duration}ms cubic-bezier(0.12, 0.8, 0.2, 1) ${delay}s`;
        strip.style.transform = `translateY(-${finalIndex * 1.18}em)`;
      });
    };

    return roll;
  }

  counterEls.forEach((el) => {
    const rollFn = initCounterRoller(el);
    if (rollFn) {
      rollerInstances.push(rollFn);
      // Interactive re-roll on hovering over the parent counter box
      const parentBox = el.closest('.counter-box');
      if (parentBox) {
        parentBox.addEventListener('mouseenter', () => {
          rollFn(1300);
        });
      }
    }
  });

  const triggerCounters = () => {
    if (hasCountersAnimated) return;
    hasCountersAnimated = true;
    rollerInstances.forEach((rollFn) => rollFn(1800));
  };

  const counterSection = document.querySelector('.upfronts-counters-row');
  if (counterSection) {
    const rect = counterSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(triggerCounters, 250);
    } else {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });
      counterObserver.observe(counterSection);
    }
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

  // ==========================================================================
  // 10. SERVICE CARDS AUTO-CYCLE & INTERACTIVE SPOTLIGHT
  // - In resting state: Card title & gradient line show.
  // - Auto-cycle activates cards one by one (adding .is-active) every 2.8 seconds
  //   when the services grid is visible in viewport.
  // - Manual mouse hover immediately pauses auto-cycle, highlights hovered card,
  //   and lets CSS :hover smoothly expand whichever card the user points to.
  // - On mouseleave, auto-cycle resumes smoothly from the next card.
  // ==========================================================================
  const servicesGrid = document.querySelector('.services-cards-grid');
  const serviceCards = document.querySelectorAll('.services-cards-grid .service-card');

  if (servicesGrid && serviceCards.length > 0) {
    let currentActiveIdx = 0;
    let autoCycleTimer = null;
    let isUserHoveringGrid = false;
    let isGridVisible = false;
    let resumeTimeout = null;

    const setCardActive = (index) => {
      serviceCards.forEach((card, idx) => {
        if (idx === index) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });
    };

    const clearActiveCards = () => {
      serviceCards.forEach((card) => {
        card.classList.remove('is-active');
      });
    };

    const startAutoCycle = () => {
      if (autoCycleTimer || isUserHoveringGrid || !isGridVisible) return;
      setCardActive(currentActiveIdx);

      autoCycleTimer = setInterval(() => {
        if (isUserHoveringGrid || !isGridVisible) return;
        currentActiveIdx = (currentActiveIdx + 1) % serviceCards.length;
        setCardActive(currentActiveIdx);
      }, 2800);
    };

    const stopAutoCycle = () => {
      if (autoCycleTimer) {
        clearInterval(autoCycleTimer);
        autoCycleTimer = null;
      }
    };

    // Viewport Intersection Observer so auto-cycle runs whenever services section is in view
    if ('IntersectionObserver' in window) {
      const cardsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isGridVisible = true;
            startAutoCycle();
          } else {
            isGridVisible = false;
            stopAutoCycle();
          }
        });
      }, {
        threshold: 0,
        rootMargin: '150px 0px 150px 0px'
      });
      cardsObserver.observe(servicesGrid);
    } else {
      isGridVisible = true;
      startAutoCycle();
    }

    // Individual card hover: immediately activate hovered card & pause auto-cycle
    serviceCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        isUserHoveringGrid = true;
        clearTimeout(resumeTimeout);
        stopAutoCycle();
        currentActiveIdx = idx;
        setCardActive(idx);
      });
    });

    // When mouse leaves the entire services grid, resume auto-cycle after a graceful pause
    servicesGrid.addEventListener('mouseleave', () => {
      isUserHoveringGrid = false;
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        if (!isUserHoveringGrid && isGridVisible) {
          currentActiveIdx = (currentActiveIdx + 1) % serviceCards.length;
          startAutoCycle();
        }
      }, 1000);
    });

    // Touch support for mobile devices
    serviceCards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-action-link')) return;
        currentActiveIdx = idx;
        const wasActive = card.classList.contains('is-active');
        clearActiveCards();
        if (!wasActive) {
          card.classList.add('is-active');
        }
      });
    });

    // Start initial spotlight cycle immediately
    setTimeout(() => {
      isGridVisible = true;
      startAutoCycle();
    }, 400);
  }
});
