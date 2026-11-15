/**
 * Thin Margin - About Us Page Interactive Scripts (about.js)
 * Includes:
 * - Page Preloader dismissal
 * - Mobile Navigation Drawer toggle
 * - Custom Video Player Telemetry Controls (Play/Pause, Mute/Unmute)
 * - Triple Impact Interactive Framework Tab Switching
 * - Consultation Modal Trigger & Form Handling
 * - Scroll Reveal & Kinetic Observer Effects
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---------------------------------------------------------------------------
  // 1. Page Preloader
  // ---------------------------------------------------------------------------
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('fade-out');
        setTimeout(() => {
          pageLoader.style.display = 'none';
        }, 500);
      }, 400);
    });

    // Fallback: dismiss after 2.5s if load event already fired
    setTimeout(() => {
      if (pageLoader && !pageLoader.classList.contains('fade-out')) {
        pageLoader.classList.add('fade-out');
        setTimeout(() => {
          pageLoader.style.display = 'none';
        }, 500);
      }
    }, 2500);
  }

  // ---------------------------------------------------------------------------
  // 2. Mobile Drawer Navigation
  // ---------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    // Close when clicking outside or clicking any link inside drawer
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Ground Operations Video Player Controls
  // ---------------------------------------------------------------------------
  const workVideo = document.getElementById('aboutWorkVideo');
  const playPauseBtn = document.getElementById('videoPlayPauseBtn');
  const muteBtn = document.getElementById('videoMuteBtn');

  if (workVideo && playPauseBtn) {
    // Attempt autoplay muted safely
    workVideo.muted = true;
    const playPromise = workVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, show play icon
        const icon = playPauseBtn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-play';
        }
      });
    }

    // Toggle Play / Pause
    playPauseBtn.addEventListener('click', () => {
      const icon = playPauseBtn.querySelector('i');
      if (workVideo.paused || workVideo.ended) {
        workVideo.play();
        if (icon) icon.className = 'fa-solid fa-pause';
      } else {
        workVideo.pause();
        if (icon) icon.className = 'fa-solid fa-play';
      }
    });

    // Toggle Mute / Unmute
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const icon = muteBtn.querySelector('i');
        if (workVideo.muted) {
          workVideo.muted = false;
          if (icon) icon.className = 'fa-solid fa-volume-high';
        } else {
          workVideo.muted = true;
          if (icon) icon.className = 'fa-solid fa-volume-xmark';
        }
      });
    }

    // Update play button state if user interacts with video directly
    workVideo.addEventListener('play', () => {
      const icon = playPauseBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-pause';
    });

    workVideo.addEventListener('pause', () => {
      const icon = playPauseBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-play';
    });
  }

  // ---------------------------------------------------------------------------
  // 4. Triple Impact Interactive Tabs Switcher
  // ---------------------------------------------------------------------------
  const impactTabBtns = document.querySelectorAll('.impact-tab-btn');
  const impactPanes = document.querySelectorAll('.impact-pane');

  if (impactTabBtns.length > 0 && impactPanes.length > 0) {
    impactTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Update active state on tab buttons
        impactTabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Update active pane
        impactPanes.forEach(pane => {
          pane.classList.remove('active');
          if (pane.id === `pane-${targetTab}`) {
            pane.classList.add('active');
          }
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Book a Consultation Modal System
  // ---------------------------------------------------------------------------
  const consultModal = document.getElementById('consultModal');
  const openModalBtns = document.querySelectorAll('.open-consult-modal, a[href="#book-consult"]');
  const closeModalBtn = consultModal ? consultModal.querySelector('.modal-close-btn') : null;
  const consultForm = document.getElementById('consultForm');

  if (consultModal) {
    const openModal = (e) => {
      if (e) e.preventDefault();
      consultModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      consultModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    consultModal.addEventListener('click', (e) => {
      if (e.target === consultModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && consultModal.classList.contains('active')) {
        closeModal();
      }
    });

    if (consultForm) {
      consultForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = consultForm.querySelector('.form-submit-btn');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = `<span>Booking Request Sent...</span> <i class="fa-solid fa-check" style="margin-left: 8px;"></i>`;
          submitBtn.style.background = '#16a34a';

          setTimeout(() => {
            alert('Thank you! Your consultation request has been submitted to Thin Margin Leadership. Our team will contact you shortly.');
            consultForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            closeModal();
          }, 1000);
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 6. Smooth Scroll Reveal via IntersectionObserver
  // ---------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.mv-card, .why-tm-card, .offer-card, .bridge-matrix-card, .project-card, .director-profile-card, .about-kpi-item');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });
  }

});
