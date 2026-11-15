/**
 * THIN MARGIN - HERO HOME PAGE INTERACTIVITY & VIDEO CAROUSEL ANIMATIONS
 * Implements smooth entrance reveals, staggered text animation,
 * continuous background video switching, interactive modals, and mobile navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Slides Data Configuration ---
  const slidesData = [
    {
      id: 0,
      tag: 'INNOVATIVE MATERIAL & LOGISTICS MANAGEMENT PARTNER',
      titleLine1: 'Where the margin of error is thin,',
      titleLine2: 'and the last 1% defines the 100%',
      description: 'Streamlining your logistics with overland freight solutions, GPS telemetry, and exceptional material management across India.',
      btnText: 'Our Services',
      label: '01 / Truck Logistics'
    },
    {
      id: 1,
      tag: 'TIME-CRITICAL EXPEDITED AIR CARGO',
      titleLine1: 'Speed meets surgical precision,',
      titleLine2: 'guaranteeing zero-delay arrivals',
      description: 'Dedicated air corridors connecting Tier-1 metropolises with guaranteed same-day dispatch SLAs and airport customs clearance.',
      btnText: 'Explore Air Express',
      label: '02 / Air Logistics'
    },
    {
      id: 2,
      tag: 'INTELLIGENT WAREHOUSING & TELEMETRY',
      titleLine1: 'High-density smart storage,',
      titleLine2: 'driven by real-time SAP & ERP sync',
      description: 'Modern bonded warehousing, 24-hour container decantation, and automated fulfillment designed to eliminate supply chain waste.',
      btnText: 'Discover Warehousing',
      label: '03 / Smart Warehousing'
    }
  ];

  // --- DOM Elements ---
  const siteHeader = document.querySelector('.site-header');
  const heroSection = document.querySelector('.hero-section');
  const pageLoader = document.querySelector('.page-loader');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const dockDots = document.querySelectorAll('.dock-dot');
  const contentContainer = document.querySelector('.hero-content-container');
  const tagPill = document.querySelector('.hero-tag-pill span') || document.querySelector('.hero-tag-pill');
  const titleLine1 = document.querySelector('.title-line-1');
  const titleLine2 = document.querySelector('.title-line-2');
  const heroDesc = document.querySelector('.hero-description');
  const servicesBtnText = document.querySelector('.btn-services-text');
  const paginationDock = document.querySelector('.hero-pagination-dock');

  // Modals & Mobile
  const consultBtns = document.querySelectorAll('.open-consult-modal');
  const consultModal = document.getElementById('consultModal');
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  let currentSlideIndex = 0;
  let isTransitioning = false;
  let slideInterval = null;
  const SLIDE_DURATION = 7000; // 7 seconds per slide

  // --- Ensure Active Video is Playing & Preload Others ---
  function initVideos() {
    heroSlides.forEach((slide, idx) => {
      const video = slide.querySelector('video');
      if (video) {
        video.muted = true;
        video.playsInline = true;
        if (idx === 0) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => console.warn('Autoplay error:', err));
          }
        } else {
          // Preload video so it's ready when slide triggers
          video.load();
        }
      }
    });
  }

  // --- Initial Hero Load Animation Sequence ---
  function initHeroAnimations() {
    // Hide page preloader
    if (pageLoader) {
      setTimeout(() => {
        pageLoader.classList.add('hidden');
      }, 750); // Show branded TM logo & telemetry bar smoothly
    }

    // Initialize all video streams
    initVideos();

    // Trigger Header slide down
    setTimeout(() => {
      if (siteHeader) siteHeader.classList.add('loaded');
    }, 280);

    // Trigger Hero content entrance
    setTimeout(() => {
      if (heroSection) heroSection.classList.add('loaded');
      if (paginationDock) paginationDock.classList.add('loaded');
    }, 480);

    // Start Autoplay Video Carousel
    startSlideAutoPlay();
  }

  // --- Slide Transition Function ---
  function goToSlide(targetIndex) {
    if (targetIndex === currentSlideIndex || isTransitioning) return;
    isTransitioning = true;

    const currentSlide = heroSlides[currentSlideIndex];
    const nextSlide = heroSlides[targetIndex];
    const data = slidesData[targetIndex];

    const currentVideo = currentSlide.querySelector('video');
    const nextVideo = nextSlide.querySelector('video');

    // 1. Animate Out Text
    contentContainer.classList.add('animating-out');
    contentContainer.classList.remove('animating-in');

    // 2. Play Next Video
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.muted = true;
      nextVideo.playsInline = true;
      const playPromise = nextVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.warn('Next video play error:', err));
      }
    }

    // Crossfade Slides (opacity transition handled in CSS)
    currentSlide.classList.remove('active');
    nextSlide.classList.add('active');

    // Update Dock Dots
    dockDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === targetIndex);
    });

    // Pause inactive video after crossfade completes to keep playback smooth
    setTimeout(() => {
      if (currentVideo && currentSlideIndex !== targetIndex) {
        currentVideo.pause();
      }
    }, 1200);

    // 3. Update Text Content & Animate In
    setTimeout(() => {
      if (tagPill) tagPill.textContent = data.tag;
      if (titleLine1) titleLine1.textContent = data.titleLine1;
      if (titleLine2) titleLine2.textContent = data.titleLine2;
      if (heroDesc) heroDesc.textContent = data.description;
      if (servicesBtnText) servicesBtnText.textContent = data.btnText;

      contentContainer.classList.remove('animating-out');
      
      // Force DOM Reflow to re-trigger CSS keyframe animations
      void contentContainer.offsetWidth;
      
      contentContainer.classList.add('animating-in');

      currentSlideIndex = targetIndex;

      // Allow next transition after animations settle
      setTimeout(() => {
        isTransitioning = false;
      }, 600);
    }, 350);
  }

  // --- Autoplay Carousel (Continuous rotation) ---
  function startSlideAutoPlay() {
    stopSlideAutoPlay();
    slideInterval = setInterval(() => {
      const nextIndex = (currentSlideIndex + 1) % slidesData.length;
      goToSlide(nextIndex);
    }, SLIDE_DURATION);
  }

  function stopSlideAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  // --- Dock Dots Click Events ---
  dockDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide-index'), 10);
      goToSlide(slideIndex);
      startSlideAutoPlay(); // Reset timer so it runs 7s from user click
    });
  });

  // --- Keyboard Navigation ---
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (currentSlideIndex + 1) % slidesData.length;
      goToSlide(nextIndex);
      startSlideAutoPlay();
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (currentSlideIndex - 1 + slidesData.length) % slidesData.length;
      goToSlide(prevIndex);
      startSlideAutoPlay();
    } else if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // --- Touch Swipe Navigation for Mobile/Tablets ---
  let touchStartX = 0;
  let touchEndX = 0;

  if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff < 0) {
        // Swiped Left -> Next Slide
        const nextIndex = (currentSlideIndex + 1) % slidesData.length;
        goToSlide(nextIndex);
      } else {
        // Swiped Right -> Prev Slide
        const prevIndex = (currentSlideIndex - 1 + slidesData.length) % slidesData.length;
        goToSlide(prevIndex);
      }
      startSlideAutoPlay();
    }
  }

  // --- Header Scroll Spy for Frosted Glass Effect ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- Feature Carousel Navigation (Smooth 3-Cards Hardware-Accelerated Slider) ---
  const featuresTrack = document.getElementById('featuresTrack');
  const featuresViewport = document.getElementById('featuresViewport');
  const featureBoxes = document.querySelectorAll('.feature-box');
  const featurePrevBtn = document.getElementById('featurePrevBtn');
  const featureNextBtn = document.getElementById('featureNextBtn');

  if (featuresTrack && featureBoxes.length > 0) {
    let currentSlide = 0;
    let autoSlideTimer = null;
    const AUTO_SLIDE_DELAY = 4500;

    function getCardsPerView() {
      if (window.innerWidth <= 680) return 1;
      if (window.innerWidth <= 1100) return 2;
      return 3;
    }

    function getMaxSlideIndex() {
      return Math.max(0, featureBoxes.length - getCardsPerView());
    }

    function getStepDistance() {
      if (featureBoxes.length < 2) return 0;
      const box0 = featureBoxes[0];
      const box1 = featureBoxes[1];
      const rect0 = box0.getBoundingClientRect();
      const rect1 = box1.getBoundingClientRect();
      return rect1.left - rect0.left;
    }

    function updateFeaturesSlider(index, isSmooth = true) {
      const maxIdx = getMaxSlideIndex();
      if (index < 0) index = 0;
      if (index > maxIdx) index = 0;
      currentSlide = index;

      const step = getStepDistance();
      const translateX = -(currentSlide * step);
      
      if (!isSmooth) {
        featuresTrack.style.transition = 'none';
      } else {
        featuresTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
      }
      
      featuresTrack.style.transform = `translateX(${translateX}px)`;
      // By default no card is active (cards only activate on hover via CSS)
    }

    if (featureNextBtn) {
      featureNextBtn.addEventListener('click', () => {
        stopAutoSlide();
        const maxIdx = getMaxSlideIndex();
        const next = (currentSlide >= maxIdx) ? 0 : currentSlide + 1;
        updateFeaturesSlider(next);
        startAutoSlide();
      });
    }

    if (featurePrevBtn) {
      featurePrevBtn.addEventListener('click', () => {
        stopAutoSlide();
        const maxIdx = getMaxSlideIndex();
        const prev = (currentSlide <= 0) ? maxIdx : currentSlide - 1;
        updateFeaturesSlider(prev);
        startAutoSlide();
      });
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(() => {
        const maxIdx = getMaxSlideIndex();
        const next = (currentSlide >= maxIdx) ? 0 : currentSlide + 1;
        updateFeaturesSlider(next);
      }, AUTO_SLIDE_DELAY);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    if (featuresViewport) {
      featuresViewport.addEventListener('mouseenter', stopAutoSlide);
      featuresViewport.addEventListener('mouseleave', startAutoSlide);

      // Touch / Swipe support for mobile & tablet
      let touchStartX = 0;
      let touchEndX = 0;

      featuresViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
      }, { passive: true });

      featuresViewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
          const maxIdx = getMaxSlideIndex();
          if (diff > 0) {
            // swipe left -> next
            const next = (currentSlide >= maxIdx) ? 0 : currentSlide + 1;
            updateFeaturesSlider(next);
          } else {
            // swipe right -> prev
            const prev = (currentSlide <= 0) ? maxIdx : currentSlide - 1;
            updateFeaturesSlider(prev);
          }
        }
        startAutoSlide();
      }, { passive: true });
    }

    if (featurePrevBtn) {
      featurePrevBtn.addEventListener('mouseenter', stopAutoSlide);
      featurePrevBtn.addEventListener('mouseleave', startAutoSlide);
    }
    if (featureNextBtn) {
      featureNextBtn.addEventListener('mouseenter', stopAutoSlide);
      featureNextBtn.addEventListener('mouseleave', startAutoSlide);
    }

    window.addEventListener('resize', () => {
      updateFeaturesSlider(currentSlide, false);
    });

    // Start auto slide on load with no card active
    updateFeaturesSlider(0, false);
    startAutoSlide();
  }

  // --- Interactive Workflow Accordion (Each Box Active at its exact position) ---
  const workflowAccordion = document.getElementById('workflowAccordion');
  const workflowItems = document.querySelectorAll('.workflow-acc-item');

  if (workflowItems.length > 0) {
    let currentWorkflowStep = 1;
    let workflowAutoTimer = null;
    const WORKFLOW_CYCLE_DURATION = 4200; // 4.2 seconds per step

    function setActiveWorkflowStep(stepNum) {
      currentWorkflowStep = stepNum;

      workflowItems.forEach(item => {
        const itemStep = parseInt(item.getAttribute('data-step'), 10);
        const isMatch = (itemStep === stepNum);
        item.classList.toggle('active', isMatch);

        if (isMatch) {
          const cardContent = item.querySelector('.workflow-card-content');
          if (cardContent) {
            cardContent.classList.remove('workflow-content-anim');
            void cardContent.offsetWidth; // Force DOM reflow
            cardContent.classList.add('workflow-content-anim');
          }
        }
      });
    }

    function startWorkflowAutoCycle() {
      stopWorkflowAutoCycle();
      workflowAutoTimer = setInterval(() => {
        currentWorkflowStep = (currentWorkflowStep % workflowItems.length) + 1;
        setActiveWorkflowStep(currentWorkflowStep);
      }, WORKFLOW_CYCLE_DURATION);
    }

    function stopWorkflowAutoCycle() {
      if (workflowAutoTimer) {
        clearInterval(workflowAutoTimer);
        workflowAutoTimer = null;
      }
    }

    // Hover-to-Open & Click interaction on each workflow item
    workflowItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        stopWorkflowAutoCycle();
        const stepNum = parseInt(item.getAttribute('data-step'), 10);
        setActiveWorkflowStep(stepNum);
      });

      item.addEventListener('mouseleave', () => {
        startWorkflowAutoCycle();
      });

      item.addEventListener('click', () => {
        stopWorkflowAutoCycle();
        const stepNum = parseInt(item.getAttribute('data-step'), 10);
        setActiveWorkflowStep(stepNum);
      });
    });

    // Pause auto-cycle when hovering over workflow accordion, resume on leave
    if (workflowAccordion) {
      workflowAccordion.addEventListener('mouseenter', stopWorkflowAutoCycle);
      workflowAccordion.addEventListener('mouseleave', startWorkflowAutoCycle);
    }

    // Start auto cycle on load
    startWorkflowAutoCycle();
  }

  // --- Scroll Reveal Animations for Each Section (Safe Instant Display) ---
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        } else {
          // Remove class when out of view so it animates repeatedly on every scroll
          entry.target.classList.remove('is-revealed');
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Recognition & Awards "GET IN TOUCH" Smooth Scroll to Estimate ---
  const getInTouchBtn = document.querySelector('.btn-get-in-touch');
  if (getInTouchBtn) {
    getInTouchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // --- Free Estimate Form Submit Handler (Ref: Image 4) ---
  const estimateForm = document.getElementById('estimateForm');
  if (estimateForm) {
    estimateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = estimateForm.querySelector('.btn-estimate-submit');
      const originalHtml = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Inquiry Submitted!</span><span class="submit-arrow-circle" style="background:#22c55e; color:#ffffff;"><i class="fa-solid fa-check" style="font-size:12px;"></i></span>';
      submitBtn.style.background = '#e6fced';
      submitBtn.style.color = '#15803d';

      setTimeout(() => {
        estimateForm.reset();
        submitBtn.innerHTML = originalHtml;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 3500);
    });
  }

  // --- Modals Functionality ---
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    stopSlideAutoPlay(); // Only pause when modal is actively open
    const input = modal.querySelector('input');
    if (input) setTimeout(() => input.focus(), 150);
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('open');
    });
    document.body.style.overflow = '';
    startSlideAutoPlay(); // Resume auto-carousel when modal is closed
  }

  consultBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileDrawer) {
        mobileDrawer.classList.remove('open');
        if (mobileToggle) mobileToggle.classList.remove('active');
      }
      const service = btn.getAttribute('data-service');
      const serviceSelect = document.getElementById('consultService');
      if (service && serviceSelect) {
        serviceSelect.value = service;
      }
      openModal(consultModal);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close-btn')) {
        closeAllModals();
      }
    });
  });

  // Prevent modal inner clicks from closing overlay
  document.querySelectorAll('.consult-modal-box').forEach(box => {
    box.addEventListener('click', (e) => e.stopPropagation());
  });

  // --- Mobile Drawer Navigation ---
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile drawer when clicking a link & smoothly scroll to section
    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const headerOffset = 65;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // --- Consultation Form Submit Handler ---
  const consultForm = document.getElementById('consultForm');
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = consultForm.querySelector('.form-submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Request Submitted!';
      submitBtn.style.background = '#22c55e';
      submitBtn.style.color = '#ffffff';

      setTimeout(() => {
        closeAllModals();
        consultForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
      }, 1500);
    });
  }

  // Initialize
  initHeroAnimations();

  
  /* --------------------------------------------------------------------------
     THREE.JS 3D INTERACTIVE LOGISTICS CONSTELLATION (Scroll & Cursor Reactive)
     -------------------------------------------------------------------------- */
  function initWhyChooseThreeJs() {
    const canvas = document.getElementById('whyThreeCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, parent.clientWidth / parent.clientHeight, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(parent.clientWidth, parent.clientHeight);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Smooth wireframe icosahedron (Zero green squares)
    const polyGeo = new THREE.IcosahedronGeometry(8.5, 1);
    const polyMat = new THREE.MeshBasicMaterial({
      color: 0xee2130,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    const polyMesh = new THREE.Mesh(polyGeo, polyMat);
    networkGroup.add(polyMesh);

    // Concentric subtle wireframe sphere
    const ringGeo = new THREE.SphereGeometry(12, 16, 12);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xee2130,
      wireframe: true,
      transparent: true,
      opacity: 0.03
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    networkGroup.add(ringMesh);

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let isVisible = true;

    const obs = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    obs.observe(parent);

    window.addEventListener('mousemove', (e) => {
      const rect = parent.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        mouseX = ((e.clientX - rect.left) / parent.clientWidth - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / parent.clientHeight - 0.5) * 2;
      }
    });

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      scrollVelocity = (currentScroll - lastScrollY) * 0.0015;
      lastScrollY = currentScroll;
    }, { passive: true });

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      networkGroup.rotation.y += 0.0018 + scrollVelocity;
      networkGroup.rotation.x += 0.001 + targetY * 0.006;
      networkGroup.rotation.z += targetX * 0.003;

      scrollVelocity *= 0.94;

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      if (!parent) return;
      camera.aspect = parent.clientWidth / parent.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(parent.clientWidth, parent.clientHeight);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhyChooseThreeJs);
  } else {
    initWhyChooseThreeJs();
  }

});