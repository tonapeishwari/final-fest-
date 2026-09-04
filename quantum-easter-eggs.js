/* ============================================================
   Quantum Easter Eggs — Qiskit Fall Fest 2026
   All the hidden surprises for curious explorers.
   ============================================================

   // If you're reading this source code... you found one already.
   // Observation changes everything.
   // Try: ↑↑↓↓←→←→BA

   ============================================================ */
'use strict';

/* ============================================================
   1. LOGO EASTER EGG — click logo 5 times
   ============================================================ */
(function logoEgg() {
  const logo = document.getElementById('brand-logo');
  if (!logo) return;
  let clicks = 0;
  const toast = document.getElementById('collapse-toast');

  logo.addEventListener('click', e => {
    e.preventDefault();
    clicks++;
    if (clicks === 3) {
      showToast('LOGO SUPERPOSITION DETECTED...');
    }
    if (clicks >= 5) {
      clicks = 0;
      logo.querySelector('.brand-mark').style.animation = 'spinOnce 0.6s ease';
      setTimeout(() => { logo.querySelector('.brand-mark').style.animation = ''; }, 700);
      showToast("You've collapsed the logo.");
    }
  });

  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('span').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }
})();

/* ============================================================
   2. KONAMI CODE — ↑↑↓↓←→←→BA
   ============================================================ */
(function konamiEgg() {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  const overlay = document.getElementById('konami-overlay');
  const closeBtn = document.getElementById('konami-close');
  if (!overlay) return;

  let idx = 0;
  document.addEventListener('keydown', e => {
    if (e.key === SEQ[idx]) {
      idx++;
      if (idx === SEQ.length) {
        idx = 0;
        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden', 'false');
        overlay.querySelector('h2').focus?.();
      }
    } else {
      idx = (e.key === SEQ[0]) ? 1 : 0;
    }
  });

  closeBtn?.addEventListener('click', () => {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
    }
  });
})();

/* ============================================================
   3. FEYNMAN QUOTE — hover footer atom for 2s
   ============================================================ */
(function feynmanEgg() {
  const trigger = document.getElementById('footer-feynman');
  const heroTrigger = document.getElementById('feynman-trigger');
  const popup  = document.getElementById('feynman-popup');
  const quoteEl = document.getElementById('feynman-quote-text');
  if (!popup) return;

  const QUOTES = [
    '"What I cannot create, I do not understand."',
    '"There\'s plenty of room at the bottom."',
    '"If you think you understand quantum mechanics, you don\'t understand quantum mechanics."',
    '"The first principle is that you must not fool yourself, and you are the easiest person to fool."',
  ];
  let quoteIdx = 0;
  let hoverTimer = null;
  let showing = false;

  function show() {
    if (quoteEl) quoteEl.textContent = QUOTES[quoteIdx % QUOTES.length];
    quoteIdx++;
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
    showing = true;
    setTimeout(hide, 5000);
  }

  function hide() {
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
    showing = false;
  }

  function attachHover(el) {
    if (!el) return;
    el.addEventListener('mouseenter', () => {
      hoverTimer = setTimeout(show, 2000);
    });
    el.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
    });
    el.addEventListener('click', show);
  }

  attachHover(trigger);
  attachHover(heroTrigger);
  popup.addEventListener('click', hide);
})();

/* ============================================================
   4. DO NOT CLICK BUTTON
   ============================================================ */
(function doNotClick() {
  const btn = document.getElementById('do-not-click-btn');
  const msg = document.getElementById('dnc-message');
  if (!btn || !msg) return;

  const RESPONSES = [
    '⚠ Measurement performed. State collapsed. Consequence: curiosity.',
    '|outcome⟩ = |you clicked anyway⟩ — as quantum theory predicted.',
    'Classical physics: predictable. Quantum physics: you have no idea. You: also no idea.',
    'ERROR: Classical behavior detected. Expected quantum superposition of "click" and "not click".',
    'This button existed in superposition between "useful" and "useless." You chose.',
    '"The first rule of quantum club is: you cannot observe quantum club without changing it."',
    '∆x · ∆p ≥ ℏ/2 — We are certain you clicked. Momentum: unknown.',
  ];
  let idx = 0;
  let showing = false;

  btn.addEventListener('click', () => {
    msg.textContent = RESPONSES[idx % RESPONSES.length];
    idx++;
    msg.classList.add('show');
    if (showing) clearTimeout(msg._timer);
    showing = true;
    msg._timer = setTimeout(() => { msg.classList.remove('show'); showing = false; }, 4000);
    // Button jiggle
    btn.style.animation = 'shake 0.4s ease';
    setTimeout(() => { btn.style.animation = ''; }, 400);
  });
})();

/* ============================================================
   5. HEISENBERG UNCERTAINTY EGG — hover to invoke
   ============================================================ */
(function heisenbergEgg() {
  const egg = document.getElementById('heisenberg-egg');
  const posVal = document.getElementById('heis-pos-val');
  const momVal = document.getElementById('heis-mom-val');
  if (!egg || !posVal || !momVal) return;

  const positions = ['CERTAIN', 'VERY CERTAIN', 'PRECISELY KNOWN', 'EXACTLY HERE'];
  const momenta   = ['???', '∞ · ℏ', 'COMPLETELY UNKNOWN', 'UNDETERMINED', '↯'];

  egg.addEventListener('mouseenter', () => {
    egg.classList.add('uncertain');
    posVal.textContent = positions[Math.floor(Math.random() * positions.length)];
    momVal.textContent = momenta[Math.floor(Math.random() * momenta.length)];
  });
  egg.addEventListener('mouseleave', () => {
    egg.classList.remove('uncertain');
    posVal.textContent = 'CERTAIN';
    momVal.textContent = '???';
  });
})();

/* ============================================================
   6. QUANTUM TUNNELING — occasional particle passes through
      the section divider
   ============================================================ */
(function quantumTunneling() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const dividers = document.querySelectorAll('.section');
  if (!dividers.length) return;

  // Create a tunneling particle
  const particle = document.createElement('div');
  particle.setAttribute('aria-hidden', 'true');
  Object.assign(particle.style, {
    position: 'fixed',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--violet-mid)',
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '9990',
    transition: 'none',
    boxShadow: '0 0 6px var(--violet-light)',
  });
  document.body.appendChild(particle);

  function tunnel() {
    const vH = window.innerHeight;
    const yPos = Math.random() * (vH * 0.7) + vH * 0.15;

    particle.style.opacity = '0';
    particle.style.top = yPos + 'px';
    particle.style.left = '-10px';

    requestAnimationFrame(() => {
      particle.style.transition = 'left 2.2s linear, opacity 0.2s ease';
      particle.style.left = (window.innerWidth + 10) + 'px';
      particle.style.opacity = '1';
      setTimeout(() => { particle.style.opacity = '0'; }, 2000);
    });

    // Schedule next tunnel 12-25 seconds later
    setTimeout(tunnel, 12000 + Math.random() * 13000);
  }

  // First tunnel after 5s
  setTimeout(tunnel, 5000);
})();

/* ============================================================
   7. WAVE-PARTICLE DUALITY on scroll
   ============================================================ */
(function waveParticleDuality() {
  // The measure-egg alternates states when scrolled to
  const egg = document.getElementById('measure-egg');
  if (!egg) return;

  let dualState = 'wave';
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dualState = dualState === 'wave' ? 'particle' : 'wave';
        egg.dataset.mode = dualState;
        const hint = egg.querySelector('.measure-hint');
        if (hint) hint.textContent = dualState === 'wave'
          ? '← currently a wave. click to observe as particle'
          : '← currently a particle. click to collapse';
      }
    });
  }, { threshold: 0.6 });
  obs.observe(egg);
})();

/* ============================================================
   8. INSPECT-ELEMENT TRIGGERED SURPRISE
      (Console message on page load)
   ============================================================ */
(function consoleEgg() {
  const styles = [
    'color: #7C4DBF; font-size: 18px; font-weight: bold; font-family: monospace;',
    'color: #4B2170; font-size: 13px; font-family: monospace;',
    'color: #9B6FD4; font-size: 11px; font-family: monospace;',
  ];
  /* eslint-disable no-console */
  console.log('%c⚛ Qiskit Fall Fest 2026', styles[0]);
  console.log('%c// You found the console. Observation changes everything.', styles[1]);
  console.log('%c// |developer⟩ = α|curious⟩ + β|building⟩', styles[1]);
  console.log('%c// "What I cannot create, I do not understand." — R.P. Feynman', styles[2]);
  console.log('%c// Try the Konami code: ↑↑↓↓←→←→BA', styles[2]);
  /* eslint-enable no-console */
})();

/* ============================================================
   9. PROBABILITY NUMBER FLICKER
      A number on the hero that shifts when "inspected"
   ============================================================ */
(function probabilityFlicker() {
  // The Bloch sphere caption — subtly changes when hovering
  const caption = document.querySelector('.bloch-caption');
  if (!caption) return;

  const states = [
    '|ψ⟩ = α|0⟩ + β|1⟩',
    '|ψ⟩ = 0.71|0⟩ + 0.71|1⟩',
    '|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩',
    '|ψ⟩ = α|0⟩ + β|1⟩  ← still uncertain',
  ];
  let stateIdx = 0;

  caption.addEventListener('mouseenter', () => {
    stateIdx = (stateIdx + 1) % states.length;
    caption.style.transition = 'opacity 0.15s';
    caption.style.opacity = '0';
    setTimeout(() => {
      caption.textContent = states[stateIdx];
      caption.style.opacity = '';
    }, 150);
  });
})();

/* ============================================================
   10. SCROLL PROGRESS as quantum state
   ============================================================ */
(function scrollProgress() {
  const footer = document.querySelector('.footer-state');
  if (!footer) return;

  const labels = [
    '|ψ_site⟩ = superposition of design + code',
    '|ψ_site⟩ = exploring quantum territory',
    '|ψ_site⟩ = approaching event horizon',
    '|ψ_site⟩ = register? |yes⟩ + |yes⟩ / √2',
    '|ψ_site⟩ = fully observed. welcome.',
  ];

  window.addEventListener('scroll', () => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const idx = Math.min(Math.floor(progress * labels.length), labels.length - 1);
    footer.textContent = labels[idx];
  }, { passive: true });
})();
