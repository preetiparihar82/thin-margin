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
  // 1b. Site Header Entrance & Scroll Spy (Ensures Navbar Always Visible)
  // ---------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    siteHeader.classList.add('loaded');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
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
  // 3. Ground Operations Video Player & Interactive Capability Deck
  // ---------------------------------------------------------------------------
  const workVideo = document.getElementById('aboutWorkVideo');
  const playPauseBtn = document.getElementById('videoPlayPauseBtn');
  const muteBtn = document.getElementById('videoMuteBtn');
  const videoProgressFill = document.getElementById('videoProgressFill');
  const videoHudStatus = document.getElementById('videoHudStatus');
  const videoTelemetryText = document.getElementById('videoTelemetryText');
  const videoActiveCaption = document.getElementById('videoActiveCaption');
  const cinemaTag1 = document.getElementById('cinemaTag1');
  const cinemaTag2 = document.getElementById('cinemaTag2');

  const deckCards = document.querySelectorAll('.why-deck-card');
  const deckContainer = document.getElementById('whyCapabilitiesDeck');

  if (deckCards.length > 0) {
    let currentActiveIndex = 0;
    let cycleTimer = null;
    let userPausedCycle = false;
    const CYCLE_DURATION = 5000; // 5 seconds per capability

    const activateCard = (index) => {
      deckCards.forEach((c, idx) => {
        c.classList.remove('active', 'cycling');
        if (idx === index) {
          c.classList.add('active');
          if (!userPausedCycle) {
            void c.offsetWidth; // trigger reflow for smooth progress bar fill
            c.classList.add('cycling');
          }

          // Synchronize Video HUD & Captions
          const hud = c.getAttribute('data-hud');
          const telemetry = c.getAttribute('data-telemetry');
          const caption = c.getAttribute('data-caption');
          const tag1 = c.getAttribute('data-tag1');
          const tag2 = c.getAttribute('data-tag2');

          if (videoHudStatus && hud) {
            videoHudStatus.style.opacity = '0';
            setTimeout(() => {
              videoHudStatus.innerHTML = hud;
              videoHudStatus.style.opacity = '1';
            }, 180);
          }

          if (videoTelemetryText && telemetry) {
            videoTelemetryText.style.opacity = '0';
            setTimeout(() => {
              videoTelemetryText.textContent = telemetry;
              videoTelemetryText.style.opacity = '1';
            }, 180);
          }

          if (videoActiveCaption && caption) {
            videoActiveCaption.style.opacity = '0';
            setTimeout(() => {
              videoActiveCaption.textContent = caption;
              videoActiveCaption.style.opacity = '1';
            }, 180);
          }

          if (cinemaTag1 && tag1) {
            cinemaTag1.innerHTML = `<i class="fa-solid fa-check"></i> ${tag1}`;
          }
          if (cinemaTag2 && tag2) {
            cinemaTag2.innerHTML = `<i class="fa-solid fa-check"></i> ${tag2}`;
          }
        }
      });
      currentActiveIndex = index;
    };

    const startCycle = () => {
      if (cycleTimer) clearInterval(cycleTimer);
      deckCards[currentActiveIndex]?.classList.add('cycling');
      cycleTimer = setInterval(() => {
        if (!userPausedCycle) {
          const nextIndex = (currentActiveIndex + 1) % deckCards.length;
          activateCard(nextIndex);
        }
      }, CYCLE_DURATION);
    };

    const stopCycle = () => {
      if (cycleTimer) clearInterval(cycleTimer);
      deckCards.forEach(c => c.classList.remove('cycling'));
    };

    // User interaction with cards
    deckCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        userPausedCycle = true;
        stopCycle();
        activateCard(idx);
      });

      card.addEventListener('click', () => {
        userPausedCycle = true;
        stopCycle();
        activateCard(idx);
      });
    });

    if (deckContainer) {
      deckContainer.addEventListener('mouseleave', () => {
        userPausedCycle = false;
        startCycle();
      });
    }

    // Start auto cycle initially
    startCycle();
  }

  // Video progress bar tracking
  if (workVideo && videoProgressFill) {
    workVideo.addEventListener('timeupdate', () => {
      if (workVideo.duration) {
        const pct = (workVideo.currentTime / workVideo.duration) * 100;
        videoProgressFill.style.width = `${pct}%`;
      }
    });
  }

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
  const impactTabBtns = document.querySelectorAll('.impact-pill-btn, .impact-tab-btn');
  const impactPanes = document.querySelectorAll('.impact-editorial-pane, .impact-pane');

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
  const revealElements = document.querySelectorAll(
    '.mv-dual-card, .bento-trust-card, .bento-video-card, .bento-wide-panoramic, .offer-row, .founder-photo-cut, .bridge-stream-item, .project-stream-card, .fluid-metric-flip-col'
  );

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

  // ---------------------------------------------------------------------------
  // 7. Dynamic Stats Count-Up Animation (Fluid, High-Precision Live Reveal)
  // ---------------------------------------------------------------------------
  const statsStrip = document.getElementById('statsStrip');
  const metricNumbers = document.querySelectorAll('.fluid-metric-number[data-target]');

  if (statsStrip && metricNumbers.length > 0) {
    let animated = false;

    const renderMetricHTML = (valStr, suffix, unit) => {
      return `<span class="metric-val-wrap"><span class="metric-val">${valStr}</span></span><span class="metric-accent">${suffix}</span>${unit ? ` <span class="metric-unit">${unit}</span>` : ''}`;
    };

    const animateCount = (el, delay = 0) => {
      setTimeout(() => {
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const unit = el.getAttribute('data-unit') || '';
        const duration = 1600; // ms
        const startTime = performance.now();

        el.classList.add('counting');
        el.classList.add('slot-reel-anim');

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out expo: 1 - Math.pow(2, -10 * progress)
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = easeProgress * target;

          el.innerHTML = renderMetricHTML(currentVal.toFixed(decimals), suffix, unit);

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.innerHTML = renderMetricHTML(target.toFixed(decimals), suffix, unit);
            el.classList.remove('counting');
            el.classList.add('counted');
            
            // Re-arm slot-reel animation
            setTimeout(() => {
              el.classList.remove('slot-reel-anim');
            }, 750);
          }
        };

        requestAnimationFrame(updateCount);
      }, delay);
    };

    const triggerStatsAnimation = () => {
      if (animated) return;
      animated = true;
      metricNumbers.forEach((el, index) => {
        animateCount(el, index * 140); // rhythmic stagger
      });
    };

    // Watch for visibility with IntersectionObserver
    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Give 300ms for preloader or scroll to stabilize so user visibly witnesses counting
            setTimeout(triggerStatsAnimation, 300);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15
      });

      statsObserver.observe(statsStrip);
    }

    // Direct check when window loads or immediately if already loaded
    const checkImmediateVisibility = () => {
      if (animated) return;
      const rect = statsStrip.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        setTimeout(triggerStatsAnimation, 450);
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(checkImmediateVisibility, 400);
    } else {
      window.addEventListener('load', () => setTimeout(checkImmediateVisibility, 400));
    }

    // Guaranteed fallback after 1.5s
    setTimeout(triggerStatsAnimation, 1500);
  }

  // ---------------------------------------------------------------------------
  // 8. Dynamic 3D Auto-Flip System (Flips automatically when no human interaction)
  // (Front: Number & Title; Back: Clean Description on 3D Flip; Zero Boxes)
  // ---------------------------------------------------------------------------
  const flipCols = document.querySelectorAll('.fluid-metric-flip-col');
  const metricStrip = document.getElementById('statsStrip');

  if (flipCols.length > 0) {
    let currentAutoIndex = 0;
    let autoInterval = null;
    let userInteracting = false;
    let resetTimer = null;

    const clearAllFlips = () => {
      flipCols.forEach(col => col.classList.remove('auto-flipped'));
    };

    const runAutoStep = () => {
      if (userInteracting) return;

      clearAllFlips();
      const targetCol = flipCols[currentAutoIndex];
      if (targetCol) {
        // 3D Flip to back side to reveal description
        targetCol.classList.add('auto-flipped');

        // Turn back to front after 3 seconds
        setTimeout(() => {
          if (!userInteracting && targetCol.classList.contains('auto-flipped')) {
            targetCol.classList.remove('auto-flipped');
            
            // Re-trigger slot-reel spring animation when returning to front
            const numEl = targetCol.querySelector('.fluid-metric-number');
            if (numEl) {
              numEl.classList.remove('slot-reel-anim');
              void numEl.offsetWidth; // trigger reflow
              numEl.classList.add('slot-reel-anim');
              setTimeout(() => numEl.classList.remove('slot-reel-anim'), 750);
            }
          }
        }, 3000);
      }

      currentAutoIndex = (currentAutoIndex + 1) % flipCols.length;
    };

    const startAutoLoop = () => {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setInterval(runAutoStep, 3800);
    };

    if (metricStrip) {
      metricStrip.addEventListener('mouseenter', () => {
        userInteracting = true;
        if (resetTimer) clearTimeout(resetTimer);
        clearAllFlips();
      });

      metricStrip.addEventListener('mouseleave', () => {
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          userInteracting = false;
          clearAllFlips();
        }, 1800);
      });
    }

    flipCols.forEach(col => {
      col.addEventListener('click', () => {
        userInteracting = true;
        const isFlipped = col.classList.contains('auto-flipped');
        clearAllFlips();
        if (!isFlipped) col.classList.add('auto-flipped');
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          userInteracting = false;
          clearAllFlips();
        }, 3000);
      });
    });

    // Start auto-flip loop after 1.8s
    setTimeout(() => {
      runAutoStep();
      startAutoLoop();
    }, 1800);
  }

});
