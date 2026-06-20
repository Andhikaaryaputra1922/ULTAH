/**
 * Birthday Website — Suci Adelia Ratna Sari
 * script.js — All interactive modules
 */

(function () {
  'use strict';

  /* ==========================================================
     MODULE 1: LOCK SCREEN & STORY MODE
     ========================================================== */
  const CORRECT_PIN = "216004";
  
  function initLockScreen() {
    const lockScreen = document.getElementById('lock-screen');
    const dots = document.querySelectorAll('.dot');
    const numBtns = document.querySelectorAll('.num-btn');
    const errorMsg = document.getElementById('lock-error');
    
    let currentPin = "";

    function updateDots() {
      dots.forEach((dot, index) => {
        if (index < currentPin.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      });
    }

    function checkPin() {
      if (currentPin === CORRECT_PIN) {
        lockScreen.classList.add('unlocked');
        setTimeout(() => {
          lockScreen.style.display = 'none';
          // Start the story!
          initStoryMode();
          // Start music now that user has interacted
          const iframe = document.getElementById('spotify-iframe');
          if (iframe) {
            iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
          }
        }, 500);
      } else {
        errorMsg.classList.remove('hidden');
        currentPin = "";
        updateDots();
        setTimeout(() => errorMsg.classList.add('hidden'), 2000);
      }
    }

    numBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        if (val === 'clear') {
          currentPin = "";
        } else if (val === 'del') {
          currentPin = currentPin.slice(0, -1);
        } else {
          if (currentPin.length < 6) {
            currentPin += val;
          }
        }
        updateDots();
        if (currentPin.length === 6) {
          checkPin();
        }
      });
    });
  }

  function initStoryMode() {
    const scenes = document.querySelectorAll('.scene');
    const progressContainer = document.getElementById('story-progress');
    const uiContainer = document.getElementById('story-ui');
    
    if (scenes.length === 0) return;
    uiContainer.classList.remove('hidden');

    let currentIndex = 0;
    
    // Create progress bars
    progressContainer.innerHTML = '';
    scenes.forEach((_, i) => {
      const barBg = document.createElement('div');
      barBg.className = 'story-bar-bg';
      const barFill = document.createElement('div');
      barFill.className = 'story-bar-fill';
      barFill.id = `story-fill-${i}`;
      barBg.appendChild(barFill);
      progressContainer.appendChild(barBg);
    });

    function showScene(index) {
      if (index < 0 || index >= scenes.length) return;

      // Hide all scenes
      scenes.forEach((scene, i) => {
        scene.classList.remove('active');
        const fill = document.getElementById(`story-fill-${i}`);
        fill.style.transition = 'width 0.3s ease';
        if (i < index) fill.style.width = '100%';
        else if (i > index) fill.style.width = '0%';
        
        // Add 'visible' class to internal elements so animations trigger
        const reveals = scene.querySelectorAll('.reveal-fade, .reveal-up, .reveal-side, .reveal-zoom');
        reveals.forEach(r => r.classList.remove('visible'));
      });

      // Show current scene
      const currentScene = scenes[index];
      currentScene.classList.add('active');
      const reveals = currentScene.querySelectorAll('.reveal-fade, .reveal-up, .reveal-side, .reveal-zoom');
      setTimeout(() => reveals.forEach(r => r.classList.add('visible')), 100);

      // Animate progress bar for current scene
      const activeFill = document.getElementById(`story-fill-${index}`);
      activeFill.style.width = '100%';
    }

    // Expose nextScene globally so buttons can call it
    window.nextScene = function() {
      if (currentIndex < scenes.length - 1) {
        currentIndex++;
        showScene(currentIndex);
      }
    };

    window.prevScene = function() {
      if (currentIndex > 0) {
        currentIndex--;
        showScene(currentIndex);
      }
    };

    // Start
    showScene(currentIndex);
  }

  /* ==========================================================
     MODULE 2: HERO ENTRANCE ANIMATION
     ========================================================== */
  function initHeroEntrance() {
    const items = document.querySelectorAll('.hero-content .reveal-fade');
    // Trigger them after a small delay since they're in viewport already
    items.forEach((el) => {
      setTimeout(() => el.classList.add('visible'), 100);
    });
  }

  /* ==========================================================
     MODULE 3: SAKURA CANVAS (canvas 2D petals)
     ========================================================== */
  function initSakuraCanvas() {
    const canvas = document.getElementById('sakura-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let petals = [];
    const PETAL_COUNT = 55;
    const PETAL_CHARS = ['🌸', '🌷', '🩷', '✿'];

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createPetal() {
      return {
        x:        Math.random() * canvas.width,
        y:        Math.random() * -canvas.height,
        size:     10 + Math.random() * 18,
        speed:    0.6 + Math.random() * 1.2,
        angle:    Math.random() * Math.PI * 2,
        spin:     (Math.random() - 0.5) * 0.05,
        drift:    (Math.random() - 0.5) * 0.8,
        opacity:  0.4 + Math.random() * 0.5,
        char:     PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)],
      };
    }

    function initPetals() {
      petals = [];
      for (let i = 0; i < PETAL_COUNT; i++) {
        const p = createPetal();
        p.y = Math.random() * canvas.height; // spread at start
        petals.push(p);
      }
    }

    function drawPetal(p) {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.char, 0, 0);
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.y     += p.speed;
        p.x     += p.drift;
        p.angle += p.spin;
        if (p.y > canvas.height + 30) {
          Object.assign(p, createPetal());
          p.y = -30;
        }
        drawPetal(p);
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resize(); initPetals(); });
    resize();
    initPetals();
    animate();
  }

  /* ==========================================================
     MODULE 4: AGE COUNTER ANIMATION
     ========================================================== */
  function initAgeCounter() {
    const counterEl  = document.getElementById('age-counter');
    if (!counterEl) return;
    const target = parseInt(counterEl.dataset.target, 10) || 21;
    let started = false;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function runCounter() {
      const duration = 2200; // ms
      const start    = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOutExpo(progress);
        counterEl.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            runCounter();
          }
        });
      },
      { threshold: 0.4 }
    );
    const section = document.getElementById('counter-section');
    if (section) sectionObserver.observe(section);
  }

  /* ==========================================================
     MODULE 5: TYPEWRITER LOVE LETTER
     ========================================================== */
  function initTypewriter() {
    const textEl   = document.getElementById('typewriter-text');
    const cursorEl = document.getElementById('typewriter-cursor');
    if (!textEl) return;

    const LETTER = `Suci yang kucinta,

Di hari yang istimewa ini, izinkan aku berkata dari dalam lubuk hati yang paling dalam — kehadiranmu dalam hidupku adalah anugerah yang tak ternilai harganya.

Setiap senyummu mampu mengubah hari yang kelabu menjadi hari yang berwarna. Setiap tawamu adalah melodi terindah yang selalu ingin kudengar berulang kali. Dan setiap kali kamu ada di sini, dunia terasa jauh lebih hangat dan berarti.

Kamu bukan hanya seseorang yang merayakan ulang tahun hari ini — kamu adalah alasan mengapa kata "istimewa" itu ada. Kamu adalah bukti nyata bahwa keindahan bukan hanya soal apa yang terlihat, tapi soal apa yang dirasa.

Semoga di usiamu yang baru ini, kebahagiaanmu terus bertumbuh seperti bunga sakura yang mekar di musim semi. Semoga setiap langkahmu dipenuhi cahaya, setiap harimu penuh senyum, dan setiap malammu tenang penuh syukur.

Selamat ulang tahun, Suci Adelia Ratna Sari.
Kamu selalu dicintai. 🌸`;

    let i = 0;
    let started = false;
    const SPEED = 28; // ms per char

    function type() {
      if (i < LETTER.length) {
        textEl.textContent += LETTER[i];
        i++;
        setTimeout(type, SPEED);
      } else {
        // Done typing
        cursorEl.style.display = 'none';
        showGalleryCta();
      }
    }

    function showGalleryCta() {
      const wrap = document.getElementById('gallery-cta-wrap');
      if (wrap) {
        wrap.classList.remove('hidden');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            wrap.querySelector('.cta-btn')?.classList.add('visible');
          });
        });
      }
    }

    // Start when section enters viewport
    const letterSection = document.getElementById('letter');
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            setTimeout(type, 400);
            sectionObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    if (letterSection) sectionObs.observe(letterSection);
  }

  /* ==========================================================
     MODULE 6: 3D TILT POLAROID CARDS
     ========================================================== */
  function initPolaroidTilt() {
    const cards = document.querySelectorAll('.polaroid-card');
    const MAX_TILT = 14; // degrees

    cards.forEach((card) => {
      const inner = card.querySelector('.polaroid-inner');

      function applyTilt(x, y) {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (x - cx) / (rect.width  / 2);
        const dy     = (y - cy) / (rect.height / 2);
        const rotX   = -dy * MAX_TILT;
        const rotY   =  dx * MAX_TILT;
        const baseRotate = parseFloat(getComputedStyle(card).getPropertyValue('--rotate')) || 0;

        card.style.transform   = `rotate(${baseRotate}deg) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.06)`;
        inner.style.boxShadow  = `${-rotY * 1.5}px ${rotX * 1.5}px 40px rgba(240,98,146,0.45)`;
      }

      function resetTilt() {
        const baseRotate = getComputedStyle(card).getPropertyValue('--rotate') || '0deg';
        card.style.transform  = `rotate(${baseRotate})`;
        inner.style.boxShadow = '';
        card.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s';
      }

      // Mouse events
      card.addEventListener('mousemove', (e) => {
        card.style.transition = 'none';
        applyTilt(e.clientX, e.clientY);
      });
      card.addEventListener('mouseleave', resetTilt);

      // Touch events
      card.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        card.style.transition = 'none';
        applyTilt(t.clientX, t.clientY);
      }, { passive: true });
      card.addEventListener('touchend', resetTilt);

      // Keyboard focus for accessibility
      card.addEventListener('focus', () => {
        card.style.transform = 'scale(1.05) rotate(var(--rotate, 0deg))';
      });
      card.addEventListener('blur', resetTilt);
    });
  }

  /* ==========================================================
     MODULE 7: PETAL RAIN (Section 5)
     ========================================================== */
  function initPetalRain() {
    const container = document.getElementById('petal-rain');
    if (!container) return;
    const PETALS = ['🌸', '🌷', '🩷', '✿', '🌺'];
    const COUNT  = 18;

    for (let i = 0; i < COUNT; i++) {
      const span = document.createElement('span');
      span.className = 'petal';
      span.textContent = PETALS[i % PETALS.length];
      span.style.left             = `${Math.random() * 100}%`;
      span.style.animationDuration = `${5 + Math.random() * 8}s`;
      span.style.animationDelay   = `${Math.random() * 8}s`;
      span.style.fontSize         = `${10 + Math.random() * 14}px`;
      span.style.opacity          = `${0.4 + Math.random() * 0.4}`;
      container.appendChild(span);
    }
  }

  /* ==========================================================
     MODULE 8: INTERACTIVE CANDLE (MICROPHONE BLOW)
     ========================================================== */
  /* ==========================================================
     MODULE 8: DOWNLOAD KADO (BRUTALISM PROGRESS BAR)
     ========================================================== */
  function initDownloadGift() {
    const btn = document.getElementById('download-btn');
    const area = document.getElementById('download-progress-area');
    const text = document.getElementById('progress-text');
    const fill = document.getElementById('progress-bar-fill');
    const wishesModal = document.getElementById('wishes-modal');
    const closeWishesBtn = document.getElementById('close-wishes-btn');
    const finaleActions = document.getElementById('finale-actions');
    const confettiCanvas = document.getElementById('confetti-canvas');
    let ctx, w, h, particles = [];
    let isDownloading = false;

    if (!btn || !area || !text || !fill || !wishesModal) return;

    if (confettiCanvas) {
      ctx = confettiCanvas.getContext('2d');
      w = confettiCanvas.width = window.innerWidth;
      h = confettiCanvas.height = window.innerHeight;
      window.addEventListener('resize', () => {
        w = confettiCanvas.width = window.innerWidth;
        h = confettiCanvas.height = window.innerHeight;
      });
    }

    function createConfetti() {
      const colors = ['#2B52EE', '#FF79C6', '#FFE500', '#FFFFFF'];
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: w / 2,
          y: h / 2,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 1) * 20 - 5,
          size: Math.random() * 10 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          rot: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10
        });
      }
    }

    function drawConfetti() {
      if (!ctx || particles.length === 0) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // gravity
        p.rot += p.rotSpeed;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0A0A0A';
        ctx.strokeRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();

        if (p.y > h + 50) particles.splice(i, 1);
      });
      requestAnimationFrame(drawConfetti);
    }

    btn.addEventListener('click', () => {
      if (isDownloading) return;
      isDownloading = true;

      btn.style.display = 'none';
      area.classList.remove('hidden');

      let progress = 0;
      const interval = setInterval(() => {
        // Randomize download speed for realism
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress > 100) progress = 100;
        
        fill.style.width = progress + '%';
        text.textContent = `Memproses: ${progress}%`;

        if (progress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            text.textContent = 'SELESAI!';
            setTimeout(() => {
              wishesModal.classList.remove('hidden');
              createConfetti();
              drawConfetti();
            }, 500);
          }, 500);
        }
      }, 80);
    });

    closeWishesBtn.addEventListener('click', () => {
      wishesModal.classList.add('hidden');
      area.style.display = 'none';
      if (finaleActions) finaleActions.classList.remove('hidden');
      
      // Auto-click next scene if we want, or leave it to the user.
      // Since it says "Tutup & Lanjut ->", we should proceed to the next scene.
      window.nextScene();
    });
  }

  /* ==========================================================
     MODULE 9: FIREWORKS (Canvas 2D)
     ========================================================== */
  function initFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let sparks = [];
    let animId = null;
    let autoLaunched = 0;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    const FW_COLORS = [
      '#f06292','#ce93d8','#f9a825','#80deea',
      '#fff9c4','#f48fb1','#b39ddb','#ffffff',
      '#ffccbc','#e1f5fe',
    ];

    function burst(x, y) {
      const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
      const count = 80 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
        const speed = 1.5 + Math.random() * 3.5;
        sparks.push({
          x, y,
          vx:    Math.cos(angle) * speed,
          vy:    Math.sin(angle) * speed,
          alpha: 1,
          size:  1.5 + Math.random() * 2.5,
          color,
          tail:  [],
        });
      }
    }

    function randomBurst() {
      const x = canvas.width  * (0.2 + Math.random() * 0.6);
      const y = canvas.height * (0.15 + Math.random() * 0.45);
      burst(x, y);
    }

    function animate() {
      ctx.fillStyle = 'rgba(26,5,51,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      sparks = sparks.filter((s) => s.alpha > 0.01);
      sparks.forEach((s) => {
        s.x    += s.vx;
        s.y    += s.vy;
        s.vy   += 0.06;
        s.vx   *= 0.98;
        s.alpha = Math.max(0, s.alpha - 0.013);

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle   = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    }

    // Auto-launch sequence when finale enters viewport
    const finaleObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && autoLaunched === 0) {
            animate();
            autoLaunched = 1;
            setInterval(() => {
              randomBurst();
            }, 1000); // Tembakkan kembang api tiap 1 detik terus-menerus
          }
        });
      },
      { threshold: 0.3 }
    );
    const finale = document.getElementById('finale');
    if (finale) finaleObs.observe(finale);
  }

  /* ==========================================================
     MODULE 10: SPOTIFY FLOATING PLAYER TOGGLE
     ========================================================== */
  function initSpotifyPlayer() {
    const toggleBtn = document.getElementById('spotify-toggle');
    const panel     = document.getElementById('spotify-panel');
    const closeBtn  = document.getElementById('spotify-close');
    if (!toggleBtn || !panel) return;

    let isOpen = false;

    function openPanel() {
      isOpen = true;
      panel.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.querySelector('.spotify-toggle-label').textContent = 'Tutup';
    }

    function closePanel() {
      isOpen = false;
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.querySelector('.spotify-toggle-label').textContent = 'Backsound';
    }

    toggleBtn.addEventListener('click', () => {
      if (isOpen) closePanel();
      else openPanel();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closePanel);
    }

    // Auto-open the panel after 2s on first visit (subtle hint)
    setTimeout(() => {
      if (!isOpen) openPanel();
    }, 2000);
  }

  /* ==========================================================
     MODULE 11: CUSTOM CURSOR
     ========================================================== */
  function initCustomCursor() {
    // Don't run on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    // Ring follows with lag
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ==========================================================
     MODULE 12: CLICK BURST (REMOVED - EMOJI FREE)
     ========================================================== */
  function initClickBurst() {
    // Feature disabled as requested to remove emoji background effects
  }

  /* ==========================================================
     MODULE 13: MOUSE PARALLAX ON HERO
     ========================================================== */
  function initHeroParallax() {
    const hero    = document.getElementById('hero');
    const name    = document.getElementById('hero-name');
    const sub     = document.getElementById('hero-subtitle');
    const forEl   = document.getElementById('hero-for');
    if (!hero || !name) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const dx   = (e.clientX - rect.left - cx) / cx; // -1 to 1
      const dy   = (e.clientY - rect.top  - cy) / cy;

      name.style.transform  = `translate(${dx * -14}px, ${dy * -8}px)`;
      if (sub)   sub.style.transform   = `translate(${dx * -8}px, ${dy * -5}px)`;
      if (forEl) forEl.style.transform = `translate(${dx * -5}px, ${dy * -3}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      name.style.transform  = '';
      if (sub)   sub.style.transform   = '';
      if (forEl) forEl.style.transform = '';
    });
  }

  /* ==========================================================
     MODULE 14: POLAROID LIGHTBOX
     ========================================================== */
  function initLightbox() {
    const cards = document.querySelectorAll('.polaroid-card');

    function openLightbox(imgSrc, captionHTML) {
      // Block scroll
      document.body.style.overflow = 'hidden';

      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Foto diperbesar');

      overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Tutup foto">✕</button>
        <div class="lightbox-inner">
          <img class="lightbox-img" src="${imgSrc}" alt="Foto kenangan" />
          <p class="lightbox-caption">${captionHTML}</p>
        </div>`;

      document.body.appendChild(overlay);

      // Close on overlay click or close button
      function closeLightbox() {
        overlay.style.animation = 'lightboxIn 0.25s reverse forwards';
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = '';
        }, 250);
      }

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', escClose);
        }
      });
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const img     = card.querySelector('img');
        const caption = card.querySelector('.polaroid-caption');
        if (img) openLightbox(img.src, caption ? caption.innerHTML : '');
      });
    });
  }

  /* ==========================================================
     MODULE 15: BUTTON RIPPLE EFFECT
     ========================================================== */
  function initRipple() {
    const buttons = document.querySelectorAll('.cta-btn, .blow-btn, .firework-btn, .spotify-toggle, .music-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        const rect   = btn.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height);
        const x      = e.clientX - rect.left - size / 2;
        const y      = e.clientY - rect.top  - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /* ==========================================================
     MODULE 16: REASONS CAROUSEL
     ========================================================== */
  function initCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    const nextBtn = document.getElementById('next-reason');
    const prevBtn = document.getElementById('prev-reason');
    const currentNum = document.getElementById('current-slide');
    const finishBtn = document.getElementById('finish-reasons-btn');
    
    if (!cards.length || !nextBtn || !prevBtn) return;
    
    let currentIndex = 0;
    
    function updateCarousel() {
      cards.forEach((card, index) => {
        if (index === currentIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
      
      currentNum.textContent = currentIndex + 1;
      
      if (currentIndex === cards.length - 1) {
        finishBtn.style.display = 'inline-block';
        finishBtn.classList.remove('hidden');
        finishBtn.style.opacity = '1';
      }
    }
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    });
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    });
  }

  /* ==========================================================
     INITIALIZATION
     ========================================================== */
  function init() {
    // initScrollReveal(); // Removed
    // initHeroEntrance(); // Handled by story mode now
    initLockScreen(); // Now starts everything
    
    initSakuraCanvas();
    initAgeCounter();
    // initTypewriter();
    initPolaroidTilt();
    initDownloadGift();
    initFireworks();
    initSpotifyPlayer();
    // New interactive modules
    initCustomCursor();
    initHeroParallax();
    initLightbox();
    initRipple();
    initCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


