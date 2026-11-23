/**
 * THIN MARGIN - UPFRONTS TRANSPORT & LOGISTICS
 * Interactions, Animations & Counters
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

  // 2. Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const upfrontsNav = document.querySelector('.upfronts-nav');
  if (mobileToggle && upfrontsNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = upfrontsNav.style.display === 'flex';
      upfrontsNav.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        upfrontsNav.style.position = 'absolute';
        upfrontsNav.style.top = '100%';
        upfrontsNav.style.left = '0';
        upfrontsNav.style.width = '100%';
        upfrontsNav.style.background = '#0e2f3e';
        upfrontsNav.style.padding = '20px';
        upfrontsNav.style.flexDirection = 'column';
        const list = upfrontsNav.querySelector('.upfronts-nav-list');
        if (list) {
          list.style.flexDirection = 'column';
          list.style.gap = '15px';
        }
      }
    });
  }

  // 3. Seamless Testimonial Loop
  const track = document.getElementById('testimonialTrack');
  if (track) {
    const cards = Array.from(track.children);
    cards.forEach((c) => {
      track.appendChild(c.cloneNode(true));
    });
  }

  // 4. Consultation Modal Logic
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
        submitBtn.innerHTML = '<span>DISPATCHED! WE WILL CONTACT YOU IMMEDIATELY.</span>';
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

  // 5. Animated Number Counters (Image 4)
  const counterEls = document.querySelectorAll('.counter-number-val');
  let hasAnimated = false;

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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counterEls.forEach((el) => {
          const raw = el.textContent.trim();
          if (raw.includes('10+')) {
            countUp(el, 10, '+');
          } else if (raw.includes('1.2GW+')) {
            el.innerHTML = '<span style="color:#FC5220;">1.2GW+</span>';
          } else if (raw.includes('24-Hr')) {
            countUp(el, 24, '-Hr');
          } else if (raw.includes('100%')) {
            countUp(el, 100, '%');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  const counterSection = document.querySelector('.upfronts-counters-row');
  if (counterSection) {
    observer.observe(counterSection);
  }
});
