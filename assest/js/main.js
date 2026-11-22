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

    // Initialize all video streams if slides exist
    if (heroSlides && heroSlides.length > 0) {
      initVideos();
    }

    // Trigger Header slide down
    setTimeout(() => {
      if (siteHeader) siteHeader.classList.add('loaded');
    }, 280);

    // Trigger Hero content entrance
    setTimeout(() => {
      if (heroSection) heroSection.classList.add('loaded');
      if (paginationDock) paginationDock.classList.add('loaded');
    }, 480);

    // Start Autoplay Video Carousel if slides exist
    if (heroSlides && heroSlides.length > 0) {
      startSlideAutoPlay();
    }
  }

  // --- Slide Transition Function ---
  function goToSlide(targetIndex) {
    if (!heroSlides || heroSlides.length === 0) return;
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
    if (!heroSlides || heroSlides.length === 0) return;
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

  // --- Kinetic Word-by-Word Animation for Section Titles & Kickers ---
  function initKineticTypography() {
    const titles = document.querySelectorAll(
      '.services-suite-title, .about-creative-title, .workflow-title, .features-header-title, .why-title, .partners-title, .awards-title, .estimate-title'
    );

    titles.forEach(title => {
      if (!title || title.dataset.kineticReady) return;
      title.dataset.kineticReady = 'true';

      let wordIndex = 0;

      function splitTextNode(textNode) {
        const text = textNode.textContent;
        if (!text.trim()) {
          return document.createTextNode(' ');
        }
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const frag = document.createDocumentFragment();
        words.forEach((w) => {
          const mask = document.createElement('span');
          mask.className = 'kinetic-word-mask';
          const inner = document.createElement('span');
          inner.className = 'kinetic-word';
          inner.style.setProperty('--word-delay', `${(wordIndex * 0.075 + 0.08).toFixed(3)}s`);
          inner.textContent = w;
          mask.appendChild(inner);
          frag.appendChild(mask);
          frag.appendChild(document.createTextNode(' '));
          wordIndex++;
        });
        return frag;
      }

      function processChild(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          return splitTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.toLowerCase() === 'br') {
            return node.cloneNode(true);
          }
          const elClone = node.cloneNode(false);
          const children = Array.from(node.childNodes);
          children.forEach(child => {
            elClone.appendChild(processChild(child));
          });
          return elClone;
        }
        return node.cloneNode(true);
      }

      const originalChildren = Array.from(title.childNodes);
      const masterFrag = document.createDocumentFragment();
      originalChildren.forEach(child => {
        masterFrag.appendChild(processChild(child));
      });

      title.innerHTML = '';
      title.appendChild(masterFrag);
      title.classList.add('kinetic-title');
    });
  }

  initKineticTypography();

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

  // --- Services Dropdown Hover Grace System (Never prematurely closes) ---
  const dropdownItem = document.querySelector('.nav-item-dropdown');
  const dropdownMenu = document.querySelector('.dropdown-menu, .dropdown-menu-mega');
  if (dropdownItem && dropdownMenu) {
    let dropdownTimer = null;

    const showDropdown = () => {
      clearTimeout(dropdownTimer);
      dropdownItem.classList.add('dropdown-open');
    };

    const hideDropdown = () => {
      dropdownTimer = setTimeout(() => {
        dropdownItem.classList.remove('dropdown-open');
      }, 250); // 250ms comfortable hover grace period
    };

    dropdownItem.addEventListener('mouseenter', showDropdown);
    dropdownItem.addEventListener('mouseleave', hideDropdown);
    dropdownMenu.addEventListener('mouseenter', showDropdown);
    dropdownMenu.addEventListener('mouseleave', hideDropdown);
  }

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

    // Smooth wireframe icosahedron (Decreased height to fit section neatly)
    const polyGeo = new THREE.IcosahedronGeometry(5.6, 1);
    const polyMat = new THREE.MeshBasicMaterial({
      color: 0xee2130,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    const polyMesh = new THREE.Mesh(polyGeo, polyMat);
    networkGroup.add(polyMesh);

    // Concentric subtle wireframe sphere (Decreased height from 12 to 8.2)
    const ringGeo = new THREE.SphereGeometry(8.2, 16, 12);
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

  /* --------------------------------------------------------------------------
     THREE.JS 3D SCROLL-DRIVEN DIGITAL TWIN & LAYDOWN MATRIX
     Interactive Procedural Yard Grid, Spline Telemetry & Dynamic Camera Orbit
     -------------------------------------------------------------------------- */
  function initDigitalTwin3D() {
    const canvas = document.getElementById('digitalTwinCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const stageFrame = canvas.parentElement;
    if (!stageFrame) return;

    const section = document.getElementById('digital-twin');
    const nodeCards = document.querySelectorAll('.twin-node-card');
    const camStatusText = document.getElementById('twinCamStatus');
    const coordsText = document.getElementById('twinCoordsText');
    const centerTip = document.getElementById('twinCenterTip');

    // 1. Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.015);

    const aspect = stageFrame.clientWidth / stageFrame.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(stageFrame.clientWidth, stageFrame.clientHeight);

    // 2. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    const crimsonLight = new THREE.PointLight(0xee2130, 2.5, 45);
    crimsonLight.position.set(0, 10, 0);
    scene.add(crimsonLight);

    // Master Group for 3D Yard Architecture
    const yardGroup = new THREE.Group();
    scene.add(yardGroup);

    // 3. Cybernetic Ground Grid
    const gridHelper = new THREE.GridHelper(44, 44, 0xee2130, 0xd8e0ea);
    gridHelper.position.y = -0.05;
    yardGroup.add(gridHelper);

    // 4. Procedural 3D Storage Bins & Warehouse Modules
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x0b1329,
      transparent: true,
      opacity: 0.22
    });
    const edgeMatAccent = new THREE.LineBasicMaterial({
      color: 0xee2130,
      transparent: true,
      opacity: 0.55
    });

    // Generate cluster of realistic laydown blocks
    const layoutCoords = [
      // Cluster A: Port Berth Terminal area
      { x: -14, z: -8, w: 4, h: 2.2, d: 3 },
      { x: -10, z: -10, w: 3, h: 3.5, d: 2.5 },
      { x: -13, z: -4, w: 3.5, h: 1.8, d: 3 },
      { x: -16, z: -6, w: 2.5, h: 2.8, d: 2 },

      // Cluster B: 24-Hr Decantation & ICD Railhead
      { x: -6, z: 6, w: 5, h: 2.5, d: 3 },
      { x: -2, z: 8, w: 3.5, h: 3.8, d: 2.5 },
      { x: -5, z: 10, w: 4, h: 1.8, d: 2 },
      { x: -8, z: 8, w: 2.5, h: 3.2, d: 2 },

      // Cluster C: High-Density Smart Stores & SAP Gateway
      { x: 3, z: -6, w: 4.5, h: 4.2, d: 3.5 },
      { x: 7, z: -4, w: 3, h: 5.0, d: 2.5 },
      { x: 4, z: -10, w: 4, h: 3.0, d: 3 },
      { x: 8, z: -8, w: 3, h: 4.0, d: 2.5 },

      // Cluster D: GW-Scale Solar & Infrastructure Laydown
      { x: 11, z: 5, w: 5, h: 2.0, d: 4 },
      { x: 15, z: 8, w: 4.5, h: 2.8, d: 3 },
      { x: 12, z: 10, w: 3.5, h: 3.2, d: 3 },
      { x: 16, z: 4, w: 3, h: 2.4, d: 2.5 },

      // Central Staging Buffers
      { x: -1, z: -1, w: 2.5, h: 1.5, d: 2.5 },
      { x: 2, z: 2, w: 3, h: 1.8, d: 2 }
    ];

    layoutCoords.forEach((item, idx) => {
      const mesh = new THREE.Mesh(buildingGeo, buildingMat);
      mesh.scale.set(item.w, item.h, item.d);
      mesh.position.set(item.x, item.h / 2, item.z);
      yardGroup.add(mesh);

      // Edges
      const edges = new THREE.EdgesGeometry(buildingGeo);
      const wire = new THREE.LineSegments(edges, (idx % 4 === 0) ? edgeMatAccent : edgeMat);
      wire.scale.set(item.w, item.h, item.d);
      wire.position.set(item.x, item.h / 2, item.z);
      yardGroup.add(wire);
    });

    // 5. 4 Strategic Telemetry Waypoint Beacons
    const waypoints = [
      { id: 0, x: -12, y: 0, z: -6, title: 'Maritime Berth Discharge' },
      { id: 1, x: -4, y: 0, z: 7, title: '24-Hr Container Decantation' },
      { id: 2, x: 5, y: 0, z: -5, title: 'SAP S/4HANA ERP Gateway' },
      { id: 3, x: 13, y: 0, z: 6, title: 'GW-Scale Laydown Yard' }
    ];

    const beaconMarkers = [];
    const pulseRings = [];

    waypoints.forEach((wp, idx) => {
      const beaconGroup = new THREE.Group();
      beaconGroup.position.set(wp.x, 0, wp.z);

      // Vertical Laser Beam Column
      const beamGeo = new THREE.CylinderGeometry(0.06, 0.06, 8, 16);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xee2130,
        transparent: true,
        opacity: 0.65
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.y = 4;
      beaconGroup.add(beamMesh);

      // Pulsating Ground Ring
      const ringGeo = new THREE.RingGeometry(0.8, 1.1, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xee2130,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.05;
      beaconGroup.add(ringMesh);
      pulseRings.push(ringMesh);

      // Floating Rotating Crystal Octahedron
      const octaGeo = new THREE.OctahedronGeometry(0.65);
      const octaMat = new THREE.MeshStandardMaterial({
        color: (idx === 2) ? 0x0b1329 : 0xee2130,
        roughness: 0.1,
        metalness: 0.5,
        wireframe: false
      });
      const octaMesh = new THREE.Mesh(octaGeo, octaMat);
      octaMesh.position.y = 4.8;
      beaconGroup.add(octaMesh);
      beaconMarkers.push(octaMesh);

      yardGroup.add(beaconGroup);
    });

    // 6. Luminous Spline Curve (The Chain of Custody)
    const curvePoints = waypoints.map(wp => new THREE.Vector3(wp.x, 0.4, wp.z));
    const splineCurve = new THREE.CatmullRomCurve3(curvePoints);
    splineCurve.curveType = 'catmullrom';
    splineCurve.tension = 0.4;

    const tubeGeo = new THREE.TubeGeometry(splineCurve, 64, 0.08, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xee2130,
      transparent: true,
      opacity: 0.45
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    yardGroup.add(tubeMesh);

    // 7. Flowing Data Pulses (Traveling Spheres on Spline)
    const pulseCount = 6;
    const pulseGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xee2130 });
    const telemetryPulses = [];

    for (let i = 0; i < pulseCount; i++) {
      const pulseSphere = new THREE.Mesh(pulseGeo, pulseMat);
      yardGroup.add(pulseSphere);
      telemetryPulses.push({
        mesh: pulseSphere,
        offset: i / pulseCount,
        speed: 0.0016
      });
    }

    // 8. Ambient Dust / Telemetry Sparks
    const particleCount = 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 36;
      particlePositions[i + 1] = Math.random() * 10 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 36;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xee2130,
      size: 0.15,
      transparent: true,
      opacity: 0.45
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    yardGroup.add(particleSystem);

    // 9. Camera Orbit Waypoints (Scroll-driven interpolation)
    const cameraKeyframes = [
      { camPos: new THREE.Vector3(-14, 13, 17), lookAt: new THREE.Vector3(-8, 1, -2) }, // Stage 0
      { camPos: new THREE.Vector3(-6, 10, 18), lookAt: new THREE.Vector3(-3, 1, 6) },   // Stage 1
      { camPos: new THREE.Vector3(6, 12, 15), lookAt: new THREE.Vector3(4, 1, -3) },    // Stage 2
      { camPos: new THREE.Vector3(16, 15, 17), lookAt: new THREE.Vector3(11, 1, 5) }    // Stage 3
    ];

    let currentStage = 0;
    let targetCamPos = cameraKeyframes[0].camPos.clone();
    let targetLookAt = cameraKeyframes[0].lookAt.clone();
    let currentLookAt = cameraKeyframes[0].lookAt.clone();

    camera.position.copy(targetCamPos);
    camera.lookAt(targetLookAt);

    // Mouse Tracking for Parallax
    let mouseX = 0, mouseY = 0;
    let targetTiltX = 0, targetTiltY = 0;

    stageFrame.addEventListener('mousemove', (e) => {
      const rect = stageFrame.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / stageFrame.clientWidth - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / stageFrame.clientHeight - 0.5) * 2;
      if (centerTip) centerTip.style.opacity = '0';
    });

    stageFrame.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
    });

    // Card Click -> Jump to Waypoint
    nodeCards.forEach(card => {
      card.addEventListener('click', () => {
        const nodeIdx = parseInt(card.getAttribute('data-node'), 10);
        activateStage(nodeIdx);
      });
    });

    function activateStage(stageIndex) {
      if (stageIndex < 0 || stageIndex >= cameraKeyframes.length) return;
      currentStage = stageIndex;

      targetCamPos.copy(cameraKeyframes[stageIndex].camPos);
      targetLookAt.copy(cameraKeyframes[stageIndex].lookAt);

      nodeCards.forEach((c, idx) => {
        c.classList.toggle('active', idx === stageIndex);
      });

      if (camStatusText) {
        camStatusText.textContent = `WAYPOINT 0${stageIndex + 1} FOCUS`;
      }
      if (coordsText) {
        const wp = waypoints[stageIndex];
        coordsText.textContent = `NODE 0${stageIndex + 1}: ${wp.title.toUpperCase()}`;
      }
    }

    // Scroll Handler for 3D Camera Flight
    let isVisible = false;

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });

    if (section) observer.observe(section);

    window.addEventListener('scroll', () => {
      if (!section || !isVisible) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height + windowHeight;
      const scrollPos = windowHeight - rect.top;
      const progress = Math.min(Math.max(scrollPos / totalDist, 0), 1);

      // Determine which stage to focus (0, 1, 2, or 3)
      let stage = Math.floor(progress * 4);
      if (stage > 3) stage = 3;

      if (stage !== currentStage) {
        activateStage(stage);
      }
    }, { passive: true });

    // Animation Render Loop
    let clock = new THREE.Clock();

    function renderLoop() {
      requestAnimationFrame(renderLoop);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Animate Beacon Markers (rotate & bob)
      beaconMarkers.forEach((marker, i) => {
        marker.rotation.y += 0.02;
        marker.position.y = 4.8 + Math.sin(elapsedTime * 2.5 + i) * 0.25;
      });

      // Animate Pulse Rings (scale & fade)
      pulseRings.forEach((ring, i) => {
        const cycle = (elapsedTime * 0.85 + i * 0.25) % 1;
        const scale = 1.0 + cycle * 2.4;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = Math.max(0, 0.75 - cycle * 0.85);
      });

      // Animate Telemetry Pulses along Spline
      telemetryPulses.forEach((p) => {
        p.offset = (p.offset + p.speed) % 1;
        const pos = splineCurve.getPointAt(p.offset);
        p.mesh.position.copy(pos);
      });

      // Smooth Camera Interpolation (Lerp)
      targetTiltX += (mouseX * 2.8 - targetTiltX) * 0.05;
      targetTiltY += (mouseY * 1.8 - targetTiltY) * 0.05;

      camera.position.x += (targetCamPos.x + targetTiltX - camera.position.x) * 0.06;
      camera.position.y += (targetCamPos.y + targetTiltY - camera.position.y) * 0.06;
      camera.position.z += (targetCamPos.z - camera.position.z) * 0.06;

      currentLookAt.x += (targetLookAt.x - currentLookAt.x) * 0.06;
      currentLookAt.y += (targetLookAt.y - currentLookAt.y) * 0.06;
      currentLookAt.z += (targetLookAt.z - currentLookAt.z) * 0.06;

      camera.lookAt(currentLookAt);

      // Subtle slow yaw on entire yard
      yardGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.03;

      renderer.render(scene, camera);
    }
    renderLoop();

    // Resize Handler
    window.addEventListener('resize', () => {
      if (!stageFrame) return;
      const newAspect = stageFrame.clientWidth / stageFrame.clientHeight;
      camera.aspect = newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(stageFrame.clientWidth, stageFrame.clientHeight);
    });
  }

  /* --------------------------------------------------------------------------
     DYNAMIC HERO OPERATIONAL SOLUTION MODE SWITCHER
     -------------------------------------------------------------------------- */
  function initHeroModeSwitcher() {
    const modePills = document.querySelectorAll('.hero-mode-pill');
    const heroImg = document.getElementById('heroMainVisual');
    const heroHudText = document.getElementById('heroHudText');
    const heroBadgeText = document.getElementById('heroBadgeText');
    const heroDescText = document.getElementById('heroDescText');
    const modeSwitcher = document.getElementById('heroModeSwitcher');

    if (modePills.length === 0 || !heroImg) return;

    let currentMode = 0;
    let modeTimer = null;
    let isUserInteracting = false;
    const ROTATION_INTERVAL = 5500;

    function setMode(index) {
      if (index < 0 || index >= modePills.length) return;
      currentMode = index;

      modePills.forEach((pill, idx) => {
        pill.classList.toggle('active', idx === index);
      });

      const activePill = modePills[index];
      const newImg = activePill.getAttribute('data-img');
      const newTelemetry = activePill.getAttribute('data-telemetry');
      const newBadge = activePill.getAttribute('data-badge');
      const newDesc = activePill.getAttribute('data-desc');

      if (newImg && heroImg.getAttribute('src') !== newImg) {
        heroImg.style.opacity = '0.35';
        heroImg.style.transform = 'scale(0.97)';
        setTimeout(() => {
          heroImg.src = newImg;
          heroImg.style.opacity = '1';
          heroImg.style.transform = 'scale(1)';
        }, 180);
      }

      if (heroHudText && newTelemetry) {
        heroHudText.style.opacity = '0';
        setTimeout(() => {
          heroHudText.textContent = newTelemetry;
          heroHudText.style.opacity = '1';
        }, 150);
      }

      if (heroBadgeText && newBadge) {
        heroBadgeText.style.opacity = '0';
        setTimeout(() => {
          heroBadgeText.textContent = newBadge;
          heroBadgeText.style.opacity = '1';
        }, 150);
      }

      if (heroDescText && newDesc) {
        heroDescText.style.opacity = '0.5';
        setTimeout(() => {
          heroDescText.textContent = newDesc;
          heroDescText.style.opacity = '1';
        }, 150);
      }
    }

    modePills.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        isUserInteracting = true;
        setMode(idx);
        stopModeRotation();
        setTimeout(() => {
          isUserInteracting = false;
          startModeRotation();
        }, 8000);
      });
    });

    function startModeRotation() {
      stopModeRotation();
      modeTimer = setInterval(() => {
        if (!isUserInteracting) {
          const next = (currentMode + 1) % modePills.length;
          setMode(next);
        }
      }, ROTATION_INTERVAL);
    }

    function stopModeRotation() {
      if (modeTimer) {
        clearInterval(modeTimer);
        modeTimer = null;
      }
    }

    if (modeSwitcher) {
      modeSwitcher.addEventListener('mouseenter', stopModeRotation);
      modeSwitcher.addEventListener('mouseleave', () => {
        if (!isUserInteracting) startModeRotation();
      });
    }

    startModeRotation();
  }

  /* --------------------------------------------------------------------------
     HERO IMAGE 3D PERSPECTIVE MOUSE TILT
     -------------------------------------------------------------------------- */
  function initHeroParallaxTilt() {
    const frame = document.getElementById('heroImageFrame');
    if (!frame) return;

    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      frame.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    frame.addEventListener('mouseleave', () => {
      frame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    });
  }

  /* --------------------------------------------------------------------------
     GROUND REALITIES INTERACTIVE TABS CONSOLE
     -------------------------------------------------------------------------- */
  function initGroundRealitiesTabs() {
    const tabBtns = document.querySelectorAll('.ground-tab-btn');
    const tabPanes = document.querySelectorAll('.ground-tab-pane');
    if (tabBtns.length === 0 || tabPanes.length === 0) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        if (!targetId) return;

        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initWhyChooseThreeJs();
      initDigitalTwin3D();
      initHeroModeSwitcher();
      initHeroParallaxTilt();
      initGroundRealitiesTabs();
    });
  } else {
    initWhyChooseThreeJs();
    initDigitalTwin3D();
    initHeroModeSwitcher();
    initHeroParallaxTilt();
    initGroundRealitiesTabs();
  }

});


/* --- CARGO TRUCKING INTERACTIONS --- */
function initCargoTruckingInteractions() {
  // 1. Sticky Header
  const header = document.querySelector('.cmsms-site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }
    }, { passive: true });
  }

  // 2. Consultation Modal Open & Close Handler
  const consultModal = document.getElementById('consultModal');
  const openModalBtns = document.querySelectorAll('.open-consult-modal');
  const closeModalBtn = document.getElementById('closeConsultModal');

  if (consultModal) {
    const serviceSelect = document.getElementById('consultService');
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const defaultService = btn.getAttribute('data-service-default');
        if (defaultService && serviceSelect) {
          for (let opt of serviceSelect.options) {
            if (opt.value.toLowerCase().includes(defaultService.toLowerCase())) {
              serviceSelect.value = opt.value;
              break;
            }
          }
        }
        consultModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        consultModal.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    consultModal.addEventListener('click', (e) => {
      if (e.target === consultModal) {
        consultModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && consultModal.classList.contains('open')) {
        consultModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // 3. Hero Background Carousel & Typewriter Animation
  const heroBgCarousel = document.getElementById('heroBgCarousel');
  const heroTypedEl = document.getElementById('heroTypewriterText');
  const heroKickerText = document.getElementById('heroKickerText');
  const heroDescText = document.getElementById('heroDescText');
  const hudPills = document.querySelectorAll('.hero-hud-pill');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');

  if (heroBgCarousel && heroTypedEl) {
    const slides = heroBgCarousel.querySelectorAll('.hero-bg-slide');
    const slideData = [
      {
        kicker: "GROUND REALITIES. ABSOLUTE ACCOUNTABILITY",
        typedText: "Every Capital Asset.",
        desc: "Institutional-grade material custody, 24-hour seaport container decantation at Mundra & Kandla, and SAP-integrated laydown yard management for mega infrastructure projects."
      },
      {
        kicker: "SMART STORES & RFID YARD CUSTODY",
        typedText: "Institutional Yard Custody.",
        desc: "Multi-acre laydown coordinates, sub-meter geotagging, barcoded physical verification, and automated MIGO/GRN generation directly into client SAP S/4HANA."
      },
      {
        kicker: "HEAVY-HAUL & MULTIMODAL FREIGHT",
        typedText: "24-Hr Port Decantation.",
        desc: "Rapid container de-stuffing at key maritime gateways and inland container depots, guaranteeing zero detention fees and zero demurrage liability."
      },
      {
        kicker: "MECHANIZED RIGGING & EHS PRECISION",
        typedText: "Zero Demurrage Yield.",
        desc: "Turnkey engineered crane rigging, heavy equipment staging, and specialized preservation maintenance executed under certified zero-incident EHS standards."
      }
    ];

    let currentSlide = 0;
    let isTyping = false;
    let autoSlideTimer = null;
    let typeTimeout = null;

    function typeWriterEffect(targetText, callback) {
      isTyping = true;
      const currentText = heroTypedEl.innerText;
      let charIdx = currentText.length;

      // First delete current text
      function deleteChar() {
        if (charIdx > 0) {
          heroTypedEl.innerText = currentText.substring(0, charIdx - 1);
          charIdx--;
          typeTimeout = setTimeout(deleteChar, 25);
        } else {
          // Pause then type new text
          setTimeout(() => {
            let addIdx = 0;
            function addChar() {
              if (addIdx < targetText.length) {
                heroTypedEl.innerText = targetText.substring(0, addIdx + 1);
                addIdx++;
                typeTimeout = setTimeout(addChar, 55);
              } else {
                isTyping = false;
                if (callback) callback();
              }
            }
            addChar();
          }, 150);
        }
      }

      deleteChar();
    }

    function goToHeroSlide(index) {
      if (index === currentSlide && isTyping) return;
      clearTimeout(typeTimeout);

      currentSlide = (index + slides.length) % slides.length;

      // Update background slides with Ken Burns zoom reset
      slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update HUD pills
      hudPills.forEach((pill, idx) => {
        if (idx === currentSlide) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });

      // Smoothly update kicker and description
      const data = slideData[currentSlide];
      if (heroKickerText) {
        heroKickerText.style.opacity = '0';
        setTimeout(() => {
          heroKickerText.innerText = data.kicker;
          heroKickerText.style.opacity = '1';
        }, 200);
      }

      if (heroDescText) {
        heroDescText.style.opacity = '0';
        setTimeout(() => {
          heroDescText.innerText = data.desc;
          heroDescText.style.opacity = '1';
        }, 200);
      }

      // Execute typewriter transition
      typeWriterEffect(data.typedText);
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideTimer = setInterval(() => {
        goToHeroSlide(currentSlide + 1);
      }, 6500);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    // HUD Pills Click Listeners
    hudPills.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        goToHeroSlide(idx);
        startAutoSlide();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToHeroSlide(currentSlide - 1);
        startAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToHeroSlide(currentSlide + 1);
        startAutoSlide();
      });
    }

    const heroSection = document.getElementById('home');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', stopAutoSlide);
      heroSection.addEventListener('mouseleave', startAutoSlide);
    }

    startAutoSlide();
  }

  // 4. FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.cmsms-accordion-header');
  accordionHeaders.forEach(headerBtn => {
    headerBtn.addEventListener('click', () => {
      const parentItem = headerBtn.closest('.cmsms-accordion-item');
      if (!parentItem) return;

      const isOpen = parentItem.classList.contains('active');
      const allItems = document.querySelectorAll('.cmsms-accordion-item');
      
      allItems.forEach(item => {
        item.classList.remove('active');
        const body = item.querySelector('.cmsms-accordion-body');
        if (body) body.style.maxHeight = null;
      });

      if (!isOpen) {
        parentItem.classList.add('active');
        const body = parentItem.querySelector('.cmsms-accordion-body');
        if (body) {
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      }
    });
  });

  // 5. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const headerNav = document.querySelector('.cmsms-header-nav');
  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      headerNav.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!headerNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        headerNav.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  }

  // 6. Metric Counter Animation
  const counters = document.querySelectorAll('.cmsms-counter-val');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseFloat(el.getAttribute('data-count') || el.innerText);
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const isDecimal = String(targetNum).includes('.');
          
          let current = 0;
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            current = targetNum * easeProgress;

            if (isDecimal) {
              el.innerText = prefix + current.toFixed(1) + suffix;
            } else {
              el.innerText = prefix + Math.floor(current) + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.innerText = prefix + (isDecimal ? targetNum.toFixed(1) : targetNum) + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // 7. Automatic WhatsApp Greeting Chat Bubble
  const whatsappBubble = document.getElementById('whatsappBubble');
  const closeBubbleBtn = document.getElementById('closeWhatsappBubble');
  if (whatsappBubble) {
    // Show prompt automatically after 3.2 seconds
    setTimeout(() => {
      whatsappBubble.classList.add('visible');
    }, 3200);

    if (closeBubbleBtn) {
      closeBubbleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        whatsappBubble.classList.remove('visible');
      });
    }
  }

  // 8. Scroll-triggered Heading & Card Reveals
  const revealElements = document.querySelectorAll('.cmsms-section-title, .cmsms-service-card, .cmsms-cred-card, .cmsms-blog-card');
  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCargoTruckingInteractions);
} else {
  initCargoTruckingInteractions();
}
