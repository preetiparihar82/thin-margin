/**
 * THIN MARGIN - LOGISTICS & TRANSPORTATION PORTAL
 * Theme: Logint HTML5 Template Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure header and hero have 'loaded' class immediately
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) siteHeader.classList.add('loaded');
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) heroSection.classList.add('loaded');

  // ==========================================================================
  // 1. HERO SLIDER CAROUSEL & RIGHT NOTCH DOCK
  // ==========================================================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const dockDots = document.querySelectorAll('.dock-dot');
  let currentSlide = 0;
  let slideInterval = null;

  const slideData = [
    {
      tag: 'GROUND REALITIES. ABSOLUTE ACCOUNTABILITY.',
      title1: 'Where Margins Are Thin,',
      title2: '<span class="highlight-crimson">Precision Defines</span> Every Capital Asset.',
      desc: 'Institutional-grade material custody, 24-hour seaport container decantation at Mundra & Kandla, and SAP-integrated laydown yard management for mega infrastructure projects.'
    },
    {
      tag: 'SMART STORES & RFID YARD CUSTODY',
      title1: 'Where Margins Are Thin,',
      title2: '<span class="highlight-crimson">Precision Defines</span> Institutional Yard Custody.',
      desc: 'Multi-acre laydown coordinates, sub-meter geotagging, barcoded physical verification, and automated MIGO/GRN generation directly into client SAP.'
    },
    {
      tag: 'MULTI-MODAL HEAVY-HAUL FREIGHT',
      title1: 'Where Margins Are Thin,',
      title2: '<span class="highlight-crimson">Precision Defines</span> Turnkey Logistics Velocity.',
      desc: 'ODC multi-axle hydraulic trailers, rail-to-road transshipment, and route corridor surveys guaranteeing zero cargo distress and zero transit bottlenecks.'
    },
    {
      tag: 'MECHANIZED RIGGING & EHS PRECISION',
      title1: 'Where Margins Are Thin,',
      title2: '<span class="highlight-crimson">Precision Defines</span> Zero Demurrage Yield.',
      desc: 'Turnkey engineered crane rigging, heavy equipment staging, and specialized preservation maintenance executed under certified zero-incident EHS standards.'
    }
  ];

  const heroTagPill = document.querySelector('.hero-tag-pill span');
  const heroTitleLine1 = document.querySelector('.title-line-1');
  const heroTitleLine2 = document.querySelector('.title-line-2');
  const heroDesc = document.querySelector('.hero-description');

  function goToSlide(index) {
    if (!heroSlides.length) return;
    
    // Normalize index
    if (index >= heroSlides.length) index = 0;
    if (index < 0) index = heroSlides.length - 1;

    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dockDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    if (slideData[index]) {
      if (heroTagPill) heroTagPill.textContent = slideData[index].tag;
      if (heroTitleLine1) heroTitleLine1.textContent = slideData[index].title1;
      if (heroTitleLine2) heroTitleLine2.innerHTML = slideData[index].title2;
      if (heroDesc) heroDesc.textContent = slideData[index].desc;
    }

    currentSlide = index;
  }

  function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  function stopSlideTimer() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  dockDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = parseInt(dot.getAttribute('data-slide-index'), 10) || 0;
      goToSlide(targetIndex);
      startSlideTimer();
    });
  });

  // Start hero slider auto-rotation
  if (heroSlides.length > 1) {
    startSlideTimer();
  }

  // ==========================================================================
  // 2. LOGINT FLOATING TRACKING & QUICK QUOTE DOCK TABS
  // ==========================================================================
  const tabTrackBtn = document.getElementById('tabTrackBtn');
  const tabQuoteBtn = document.getElementById('tabQuoteBtn');
  const paneTrack = document.getElementById('paneTrack');
  const paneQuote = document.getElementById('paneQuote');

  if (tabTrackBtn && tabQuoteBtn && paneTrack && paneQuote) {
    tabTrackBtn.addEventListener('click', () => {
      tabTrackBtn.classList.add('active');
      tabTrackBtn.setAttribute('aria-selected', 'true');
      tabQuoteBtn.classList.remove('active');
      tabQuoteBtn.setAttribute('aria-selected', 'false');

      paneTrack.classList.add('active');
      paneQuote.classList.remove('active');
    });

    tabQuoteBtn.addEventListener('click', () => {
      tabQuoteBtn.classList.add('active');
      tabQuoteBtn.setAttribute('aria-selected', 'true');
      tabTrackBtn.classList.remove('active');
      tabTrackBtn.setAttribute('aria-selected', 'false');

      paneQuote.classList.add('active');
      paneTrack.classList.remove('active');
    });
  }

  // --- Consignment Tracking Form Simulation ---
  const trackForm = document.getElementById('trackConsignmentForm');
  const trackDisplay = document.getElementById('trackStatusDisplay');
  const resTrackId = document.getElementById('resTrackId');

  if (trackForm && trackDisplay) {
    trackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputVal = document.getElementById('trackInput')?.value.trim() || 'TM-984210';
      if (resTrackId) {
        resTrackId.textContent = 'CONSIGNMENT ' + inputVal.toUpperCase();
      }
      trackDisplay.classList.add('active');
    });
  }

  // --- Quick Quote Form Submission ---
  const quickQuoteForm = document.getElementById('quickQuoteForm');
  if (quickQuoteForm) {
    quickQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const origin = document.getElementById('quoteOrigin')?.value || 'Origin Port';
      const dest = document.getElementById('quoteDest')?.value || 'Destination Site';
      
      // Auto open consult modal with prepopulated details
      const consultModal = document.getElementById('consultModal');
      const consultNotes = document.getElementById('consultNotes');
      if (consultNotes) {
        consultNotes.value = `Quick Quote Route: From ${origin} to ${dest}.`;
      }
      if (consultModal) {
        consultModal.classList.add('open');
      }
    });
  }

  // ==========================================================================
  // 3. STRATEGIC CONSULTATION MODAL
  // ==========================================================================
  const consultModal = document.getElementById('consultModal');
  const closeConsultModal = document.getElementById('closeConsultModal');
  const openConsultBtns = document.querySelectorAll('.open-consult-modal');
  const consultServiceSelect = document.getElementById('consultService');

  openConsultBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceDefault = btn.getAttribute('data-service-default');
      if (serviceDefault && consultServiceSelect) {
        for (let i = 0; i < consultServiceSelect.options.length; i++) {
          if (consultServiceSelect.options[i].value === serviceDefault) {
            consultServiceSelect.selectedIndex = i;
            break;
          }
        }
      }
      if (consultModal) {
        consultModal.classList.add('open');
      }
    });
  });

  if (closeConsultModal && consultModal) {
    closeConsultModal.addEventListener('click', () => {
      consultModal.classList.remove('open');
    });

    consultModal.addEventListener('click', (e) => {
      if (e.target === consultModal) {
        consultModal.classList.remove('open');
      }
    });
  }

  // Modal Form Submission
  const consultForm = document.getElementById('consultForm');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = consultForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<span class="btn-services-text">Audit Request Submitted!</span> <span class="arrow-circle"><i class="fa-solid fa-check"></i></span>';
        submitBtn.style.background = '#22c55e';
      }
      setTimeout(() => {
        if (consultModal) consultModal.classList.remove('open');
        consultForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = '<span class="btn-services-text">Submit Strategy Request</span> <span class="arrow-circle"><i class="fa-solid fa-arrow-right"></i></span>';
          submitBtn.style.background = 'var(--color-accent)';
        }
      }, 2000);
    });
  }

  // ==========================================================================
  // 4. MOBILE NAVIGATION TOGGLE
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenuList = document.querySelector('.nav-menu-list');

  if (mobileToggle && navMenuList) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navMenuList.style.display === 'flex';
      navMenuList.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navMenuList.style.flexDirection = 'column';
        navMenuList.style.position = 'absolute';
        navMenuList.style.top = '100%';
        navMenuList.style.left = '0';
        navMenuList.style.right = '0';
        navMenuList.style.background = '#ffffff';
        navMenuList.style.padding = '24px';
        navMenuList.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
      }
    });
  }
});
