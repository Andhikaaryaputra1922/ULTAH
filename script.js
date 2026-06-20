/**
 * Birthday Website — Suci Adelia Ratna Sari
 * script.js — All interactive modules
 */

(function () {
  'use strict';

  /* ==========================================================
     MODULE 1: SCROLL REVEAL (IntersectionObserver)
     ========================================================== */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-side');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once revealed for performance
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
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
     MODULE 8: CANDLE BLOWOUT + CONFETTI
     ========================================================== */
  function initCandle() {
    const blowBtn   = document.getElementById('blow-btn');
    const flameGrp  = document.getElementById('flame-group');
    const smoke     = document.getElementById('smoke');
    const wishMsg   = document.getElementById('wish-message');
    const canvas    = document.getElementById('confetti-canvas');
    if (!blowBtn || !canvas) return;

    const ctx = canvas.getContext('2d');
    let confettiParticles = [];
    let confettiAnim = null;

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const CONFETTI_COLORS = ['#f06292','#ce93d8','#f9a825','#80deea','#fff9c4','#f48fb1','#b39ddb'];

    function createConfetti(count) {
      confettiParticles = [];
      for (let i = 0; i < count; i++) {
        confettiParticles.push({
          x:     canvas.width  / 2 + (Math.random() - 0.5) * 200,
          y:     canvas.height * 0.35,
          vx:    (Math.random() - 0.5) * 14,
          vy:    -8 - Math.random() * 10,
          size:  4 + Math.random() * 8,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          alpha: 1,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
          rot:   Math.random() * Math.PI * 2,
          rotV:  (Math.random() - 0.5) * 0.2,
          gravity: 0.3 + Math.random() * 0.2,
        });
      }
    }

    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      confettiParticles.forEach((p) => {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += p.gravity;
        p.vx  *= 0.99;
        p.rot += p.rotV;
        p.alpha = Math.max(0, p.alpha - 0.008);
        if (p.alpha > 0) alive = true;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      });
      if (alive) confettiAnim = requestAnimationFrame(animateConfetti);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    blowBtn.addEventListener('click', () => {
      blowBtn.disabled = true;
      blowBtn.setAttribute('aria-label', 'Lilin sudah ditiup');

      // Blow out flame
      if (flameGrp) {
        flameGrp.classList.add('extinguished');
      }

      // Show smoke
      if (smoke) {
        smoke.classList.remove('hidden');
      }

      // Launch confetti
      setTimeout(() => {
        createConfetti(500);
        if (confettiAnim) cancelAnimationFrame(confettiAnim);
        animateConfetti();

        // Show wish message
        setTimeout(() => {
          if (wishMsg) {
            wishMsg.classList.remove('hidden');
            blowBtn.classList.add('hidden');
          }
        }, 600);
      }, 500);
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
            let count = 0;
            const interval = setInterval(() => {
              randomBurst();
              count++;
              if (count >= 6) clearInterval(interval);
            }, 600);
          }
        });
      },
      { threshold: 0.3 }
    );
    const finale = document.getElementById('finale');
    if (finale) finaleObs.observe(finale);

    // Manual trigger button
    const btn = document.getElementById('firework-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        for (let i = 0; i < 4; i++) {
          setTimeout(randomBurst, i * 300);
        }
      });
    }
  }

  /* ==========================================================
     MODULE 10: WEB AUDIO BIRTHDAY MELODY
     ========================================================== */
  function initMusic() {
    const btn   = document.getElementById('music-btn');
    const label = document.getElementById('music-label');
    if (!btn) return;

    let audioCtx = null;
    let playing  = false;
    let scheduleId = null;

    // Happy Birthday notes (simplified melody in C major)
    // Format: [note_hz, duration_beats]
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23,
          G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25,
          D5 = 587.33, F5 = 698.46, G5 = 783.99;

    const MELODY = [
      [C4, 0.75], [C4, 0.25], [D4, 1],   [C4, 1],   [F4, 1],   [E4, 2],
      [C4, 0.75], [C4, 0.25], [D4, 1],   [C4, 1],   [G4, 1],   [F4, 2],
      [C4, 0.75], [C4, 0.25], [C5, 1],   [A4, 1],   [F4, 1],   [E4, 1], [D4, 2],
      [B4, 0.75], [B4, 0.25], [A4, 1],   [F4, 1],   [G4, 1],   [F4, 2],
    ];

    const BPM    = 90;
    const BEAT   = 60 / BPM; // seconds per beat

    function playNote(ctx, freq, startTime, duration) {
      if (!freq) return;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type      = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Soft envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
      gain.gain.setValueAtTime(0.18, startTime + duration * BEAT - 0.08);
      gain.gain.linearRampToValueAtTime(0, startTime + duration * BEAT);

      osc.start(startTime);
      osc.stop(startTime + duration * BEAT + 0.01);
    }

    function scheduleLoop(ctx, loopStart) {
      let t = loopStart;
      MELODY.forEach(([freq, beats]) => {
        playNote(ctx, freq, t, beats);
        t += beats * BEAT;
      });
      // Schedule next loop
      const loopDuration = MELODY.reduce((s, [, b]) => s + b, 0) * BEAT;
      scheduleId = setTimeout(() => {
        if (playing) scheduleLoop(ctx, ctx.currentTime + 0.05);
      }, (loopDuration - 0.1) * 1000);
    }

    function startMusic() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      playing = true;
      scheduleLoop(audioCtx, audioCtx.currentTime + 0.1);
      btn.setAttribute('aria-pressed', 'true');
      if (label) label.textContent = 'Hentikan Musik';
    }

    function stopMusic() {
      playing = false;
      if (scheduleId) clearTimeout(scheduleId);
      if (audioCtx) {
        audioCtx.suspend();
      }
      btn.setAttribute('aria-pressed', 'false');
      if (label) label.textContent = 'Putar Musik';
    }

    btn.addEventListener('click', () => {
      if (playing) stopMusic();
      else startMusic();
    });
  }

  /* ==========================================================
     INIT ALL MODULES
     ========================================================== */
  function init() {
    initScrollReveal();
    initHeroEntrance();
    initSakuraCanvas();
    initAgeCounter();
    initTypewriter();
    initPolaroidTilt();
    initPetalRain();
    initCandle();
    initFireworks();
    initMusic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
