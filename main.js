/* ============================================================
   Qiskit Fall Fest 2026 — main.js
   Core: nav, waves, Bloch sphere, scroll reveals,
         timeline, schedule, speakers, qubit demo, cloud flow
   ============================================================ */

// If you're reading this, you found another quantum state.
// Observation changes everything.
// |developer⟩ = α|coding⟩ + β|sleeping⟩

'use strict';

/* ============================================================
   1. SCROLL REVEALS
   ============================================================ */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   2. STICKY NAV
   ============================================================ */
(function initNav() {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  // Sticky shadow on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();

/* ============================================================
   3. HERO WAVEFUNCTION CANVAS
   ============================================================ */
(function initHeroWave() {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, mouseX = 0.5;
  let phase = 0;
  let collapseTimer = null;
  let collapsing = false;
  let collapseProgress = 0; // 0=normal, 1=collapsed, goes 0→1→0

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Occasional collapse event (every 8-14s)
  function scheduleCollapse() {
    const delay = 8000 + Math.random() * 6000;
    collapseTimer = setTimeout(() => {
      collapsing = true;
      collapseProgress = 0;
      scheduleCollapse();
    }, delay);
  }

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX / window.innerWidth;
  }, { passive: true });

  // Wave parameters — multiple interfering wavefunctions
  const waves = [
    { amp: 0.028, freq: 1.6, speed: 0.4,  phase: 0,    color: 'rgba(155,111,212,', opacity: 0.55 },
    { amp: 0.018, freq: 2.8, speed: 0.65, phase: 1.2,  color: 'rgba(124,77,191,',  opacity: 0.40 },
    { amp: 0.012, freq: 4.2, speed: 0.9,  phase: 2.5,  color: 'rgba(196,163,232,', opacity: 0.30 },
    { amp: 0.022, freq: 0.8, speed: 0.25, phase: 0.7,  color: 'rgba(75,33,112,',   opacity: 0.25 },
    { amp: 0.009, freq: 5.5, speed: 1.2,  phase: 3.8,  color: 'rgba(180,142,224,', opacity: 0.22 },
  ];

  function drawWave(wave, phaseOff, colFactor) {
    ctx.beginPath();
    const cy = H * 0.62;
    const amp = H * wave.amp * colFactor;

    for (let x = 0; x <= W; x += 2) {
      // Mouse influences the phase slightly
      const mouseMod = (mouseX - 0.5) * 0.6;
      const y = cy + amp * Math.sin(
        wave.freq * (x / W) * Math.PI * 2
        + phaseOff
        + mouseMod
      );
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // Gradient stroke
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0,   wave.color + '0)');
    grad.addColorStop(0.2, wave.color + wave.opacity + ')');
    grad.addColorStop(0.5, wave.color + (wave.opacity * 1.3) + ')');
    grad.addColorStop(0.8, wave.color + wave.opacity + ')');
    grad.addColorStop(1,   wave.color + '0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  let last = performance.now();

  function draw(now) {
    const dt = (now - last) / 1000;
    last = now;

    // Collapse animation
    let colFactor = 1;
    if (collapsing) {
      collapseProgress += dt * 1.2;
      if (collapseProgress < 0.5) {
        colFactor = 1 - (collapseProgress / 0.5) * 0.88;
      } else if (collapseProgress < 1) {
        colFactor = 0.12 + ((collapseProgress - 0.5) / 0.5) * 0.88;
      } else {
        collapsing = false;
        colFactor = 1;
      }
    }

    ctx.clearRect(0, 0, W, H);
    waves.forEach((wave, i) => {
      const p = phase * wave.speed + wave.phase;
      drawWave(wave, p, colFactor);
    });

    phase += 0.4 * dt;
    if (!reduced) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  if (reduced) {
    draw(performance.now());
  } else {
    scheduleCollapse();
    requestAnimationFrame(draw);
  }
})();

/* ============================================================
   4. REGISTER SECTION WAVE
   ============================================================ */
(function initRegisterWave() {
  const canvas = document.getElementById('register-wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, phase = 0;

  function resize() {
    W = canvas.offsetWidth; H = canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  let last = performance.now();
  function draw(now) {
    const dt = (now - last) / 1000; last = now;
    ctx.clearRect(0, 0, W, H);

    [[0.55, 1.4, 0.3], [0.65, 2.2, 0.5], [0.75, 0.9, 0.7]].forEach(([yf, freq, sp]) => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = H * yf + H * 0.04 * Math.sin(freq * (x / W) * Math.PI * 2 + phase * sp);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    phase += 0.3 * dt;
    if (!reduced) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  if (!reduced) requestAnimationFrame(draw);
})();

/* ============================================================
   5. BLOCH SPHERE
   ============================================================ */
(function initBlochSphere() {
  const canvas = document.getElementById('bloch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const INK   = '#4B2170';
  const LINE  = '#DDD0EE';
  const LSOFT = '#EDE5F8';
  const ACCT  = '#7C4DBF';
  const DOT   = '#4B2170';

  let W, H, dpr;
  let mouseNX = 0, mouseNY = 0, hovering = false;
  let angle = 0, vecTheta = Math.PI / 2.6, vecPhi = 0;
  const BASE_THETA = Math.PI / 2.6;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  canvas.addEventListener('mouseenter', () => hovering = true);
  canvas.addEventListener('mouseleave', () => hovering = false);
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseNX = ((e.clientX - r.left) / r.width)  * 2 - 1;
    mouseNY = ((e.clientY - r.top)  / r.height) * 2 - 1;
  });

  function project(x, y, z, cx, cy, r, rotY, tiltX) {
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;
    const scale = 1 / (1 + z2 * 0.3);
    return { sx: cx + x1 * r * scale, sy: cy + y2 * r * scale, depth: z2 };
  }

  function circlePts(axis, cx, cy, r, rotY, tiltX, steps = 64) {
    return Array.from({ length: steps + 1 }, (_, i) => {
      const t = (i / steps) * Math.PI * 2;
      const [x, y, z] = axis === 'xz' ? [Math.cos(t), 0, Math.sin(t)]
                       : axis === 'yz' ? [0, Math.cos(t), Math.sin(t)]
                       : [Math.cos(t), Math.sin(t), 0];
      return project(x, y, z, cx, cy, r, rotY, tiltX);
    });
  }

  function strokePts(pts, color, lw, dashed = false) {
    ctx.beginPath();
    ctx.strokeStyle = color; ctx.lineWidth = lw;
    ctx.setLineDash(dashed ? [3, 4] : []);
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy));
    ctx.stroke(); ctx.setLineDash([]);
  }

  const tiltX = -0.3;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const r  = Math.min(W, H) * 0.36;
    const rotY = angle;

    // Sphere outline
    ctx.beginPath(); ctx.strokeStyle = LINE; ctx.lineWidth = 1.3;
    ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

    // Grid circles
    strokePts(circlePts('xz', cx, cy, r, rotY, tiltX), LINE,  1);
    strokePts(circlePts('yz', cx, cy, r, rotY, tiltX), LSOFT, 0.8);
    strokePts(circlePts('xy', cx, cy, r, rotY + Math.PI/2, tiltX), LSOFT, 0.8);

    // Axis
    const top    = project(0,  1, 0, cx, cy, r, rotY, tiltX);
    const bottom = project(0, -1, 0, cx, cy, r, rotY, tiltX);
    ctx.beginPath(); ctx.strokeStyle = LINE; ctx.lineWidth = 0.9;
    ctx.moveTo(top.sx, top.sy); ctx.lineTo(bottom.sx, bottom.sy); ctx.stroke();

    // State vector
    const autoPhi = angle * 1.6;
    let tTheta = BASE_THETA, tPhi = autoPhi;
    if (hovering) {
      tTheta = Math.max(0.15, Math.min(Math.PI - 0.15, BASE_THETA - mouseNY * 0.85));
      tPhi = autoPhi + mouseNX * 1.25;
    }
    vecTheta += (tTheta - vecTheta) * 0.07;
    vecPhi   += (tPhi   - vecPhi)   * 0.07;

    const vx = Math.sin(vecTheta) * Math.cos(vecPhi);
    const vy = Math.cos(vecTheta);
    const vz = Math.sin(vecTheta) * Math.sin(vecPhi);
    const tip    = project(vx, vy, vz, cx, cy, r, rotY, tiltX);
    const origin = project(0, 0, 0,   cx, cy, r, rotY, tiltX);

    // Glow under vector
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(155,111,212,0.18)'; ctx.lineWidth = 6;
    ctx.moveTo(origin.sx, origin.sy); ctx.lineTo(tip.sx, tip.sy);
    ctx.stroke();

    // Vector line
    ctx.beginPath(); ctx.strokeStyle = ACCT; ctx.lineWidth = 2;
    ctx.moveTo(origin.sx, origin.sy); ctx.lineTo(tip.sx, tip.sy); ctx.stroke();

    // Arrowhead
    const ang = Math.atan2(tip.sy - origin.sy, tip.sx - origin.sx);
    ctx.beginPath(); ctx.fillStyle = ACCT;
    ctx.moveTo(tip.sx, tip.sy);
    ctx.lineTo(tip.sx - 9 * Math.cos(ang - 0.4), tip.sy - 9 * Math.sin(ang - 0.4));
    ctx.lineTo(tip.sx - 9 * Math.cos(ang + 0.4), tip.sy - 9 * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();

    // Tip dot
    ctx.beginPath(); ctx.fillStyle = DOT;
    ctx.arc(tip.sx, tip.sy, 3.5, 0, Math.PI * 2); ctx.fill();

    // Pole labels
    ctx.font = '12px "IBM Plex Mono", monospace';
    ctx.fillStyle = INK; ctx.textAlign = 'center';
    ctx.fillText('|0⟩', top.sx,    top.sy    - 13);
    ctx.fillText('|1⟩', bottom.sx, bottom.sy + 18);

    if (!reduced) angle += 0.006;
  }

  let last = performance.now();
  function loop(now) {
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  if (reduced) draw(); else requestAnimationFrame(loop);
})();

/* ============================================================
   6. QUBIT 101 — BIT FLIP & QUBIT MEASURE
   ============================================================ */
(function initQubitDemo() {
  // Classic bit flip
  const bitFlipBtn = document.getElementById('bit-flip-btn');
  const bit0 = document.getElementById('bit-0');
  const bit1 = document.getElementById('bit-1');
  let bitState = 1;

  if (bitFlipBtn) {
    bitFlipBtn.addEventListener('click', () => {
      bitState ^= 1;
      bit0.classList.toggle('active', bitState === 0);
      bit1.classList.toggle('active', bitState === 1);
      // little flash
      [bit0, bit1].forEach(el => {
        el.style.transition = 'none';
        setTimeout(() => { el.style.transition = ''; }, 50);
      });
    });
  }

  // Qubit measure
  const measureBtn = document.getElementById('qubit-measure-btn');
  const prob0Fill  = document.getElementById('prob-0');
  const prob1Fill  = document.getElementById('prob-1');
  const prob0Pct   = document.getElementById('prob-0-pct');
  const prob1Pct   = document.getElementById('prob-1-pct');
  let measured = false;

  if (measureBtn) {
    measureBtn.addEventListener('click', () => {
      if (!measured) {
        // Collapse to random result
        const result = Math.random() < 0.5 ? 0 : 1;
        const p0 = result === 0 ? 100 : 0;
        const p1 = result === 1 ? 100 : 0;
        prob0Fill.style.width = p0 + '%';
        prob1Fill.style.width = p1 + '%';
        prob0Pct.textContent = p0 + '%';
        prob1Pct.textContent = p1 + '%';
        measured = true;
        measureBtn.textContent = 'Reset';
        // Update equation
        const eq = document.getElementById('qubit-eq');
        if (eq) eq.innerHTML = result === 0
          ? '<span class="q-ket">|0⟩</span>'
          : '<span class="q-ket">|1⟩</span>';
      } else {
        // Restore superposition with random α β
        const alpha = (40 + Math.round(Math.random() * 20));
        const beta  = 100 - alpha;
        prob0Fill.style.width = alpha + '%';
        prob1Fill.style.width = beta + '%';
        prob0Pct.textContent = alpha + '%';
        prob1Pct.textContent = beta + '%';
        measured = false;
        measureBtn.textContent = 'Measure it';
        const eq = document.getElementById('qubit-eq');
        if (eq) eq.innerHTML = `
          <span class="q-alpha">α</span><span class="q-ket">|0⟩</span>
          <span class="q-plus"> + </span>
          <span class="q-beta">β</span><span class="q-ket">|1⟩</span>`;
      }
    });
  }

  // Measurement Easter Egg
  const measureEgg = document.getElementById('measure-egg');
  const measureEqText = document.getElementById('measure-eq-text');
  let eggMeasured = false;

  if (measureEgg) {
    measureEgg.addEventListener('click', () => {
      if (!eggMeasured) {
        const result = Math.random() < 0.5 ? '|0⟩' : '|1⟩';
        if (measureEqText) measureEqText.textContent = 'STATE COLLAPSED → ' + result;
        measureEgg.style.borderColor = 'var(--violet)';
        eggMeasured = true;
      } else {
        if (measureEqText) measureEqText.textContent = '|ψ⟩ = α|0⟩ + β|1⟩';
        measureEgg.style.borderColor = '';
        eggMeasured = false;
      }
    });
  }
})();

/* ============================================================
   7. CLOUD FLOW ANIMATION
   ============================================================ */
(function initCloudFlow() {
  const btn = document.getElementById('flow-play-btn');
  if (!btn) return;

  const packets = [
    document.getElementById('flow-packet-1'),
    document.getElementById('flow-packet-2'),
    document.getElementById('flow-packet-3'),
  ];
  const connectors = [
    document.getElementById('flow-c1'),
    document.getElementById('flow-c2'),
    document.getElementById('flow-c3'),
  ];

  function animatePacket(el, reverse = false, delay = 0) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.left = reverse ? '100%' : '0';
    setTimeout(() => {
      el.style.transition = 'none';
      el.style.left = reverse ? '100%' : '0';
      el.style.opacity = '0';
      requestAnimationFrame(() => {
        el.style.transition = 'left 0.8s linear, opacity 0.2s ease';
        el.style.opacity = '1';
        el.style.left = reverse ? '0' : '100%';
        setTimeout(() => { el.style.opacity = '0'; }, 800);
      });
    }, delay);
  }

  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = 'Running...';
    // Forward: browser → cloud → QPU
    animatePacket(packets[0], false, 0);
    animatePacket(packets[1], false, 900);
    // Return: result comes back
    animatePacket(packets[2], true, 1900);
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Run Circuit ▶';
    }, 2800);
  });
})();

/* ============================================================
   8. TIMELINE
   ============================================================ */
(function initTimeline() {
  if (!window.TIMELINE_DATA) return;
  const track = document.getElementById('timeline-track');
  const prevBtn = document.getElementById('tl-prev');
  const nextBtn = document.getElementById('tl-next');
  const progressEl = document.getElementById('tl-progress');
  if (!track) return;

  const data = window.TIMELINE_DATA;
  let activeIdx = 0;

  // Build dots for progress
  progressEl.innerHTML = data.map((_, i) =>
    `<div class="tl-prog-dot${i === 0 ? ' active' : ''}" data-idx="${i}"></div>`
  ).join('');

  // Build timeline items
  data.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'timeline-item reveal' + (i === 0 ? ' active' : '');
    el.dataset.idx = i;
    el.innerHTML = `
      <div class="tl-dot"></div>
      <div class="tl-card">
        <div class="tl-year">
          <span>${item.year}</span>
          <span class="tl-tag">${item.tag}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>`;
    el.addEventListener('click', () => setActive(i));
    track.appendChild(el);
  });

  // Reveal observer for items
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  track.querySelectorAll('.timeline-item').forEach(el => obs.observe(el));

  function setActive(idx) {
    activeIdx = idx;
    document.querySelectorAll('.timeline-item').forEach((el, i) => el.classList.toggle('active', i === idx));
    document.querySelectorAll('.tl-prog-dot').forEach((dot, i) => dot.classList.toggle('active', i === idx));
    // Scroll into view
    const item = track.children[idx];
    if (item) item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  prevBtn?.addEventListener('click', () => setActive((activeIdx - 1 + data.length) % data.length));
  nextBtn?.addEventListener('click', () => setActive((activeIdx + 1) % data.length));

  // Keyboard on dots
  progressEl.querySelectorAll('.tl-prog-dot').forEach(dot => {
    dot.addEventListener('click', () => setActive(+dot.dataset.idx));
  });
})();

/* ============================================================
   9. SCHEDULE
   ============================================================ */
(function initSchedule() {
  if (!window.SCHEDULE_DATA) return;
  const tabContainer  = document.querySelector('.day-tabs');
  const panelContainer = document.getElementById('schedule-panels');
  if (!tabContainer || !panelContainer) return;

  const data = window.SCHEDULE_DATA;

  const TYPE_LABELS = { talk:'Talk', workshop:'Workshop', panel:'Panel', 'hands-on':'Hands-On', break:'Break' };

  // Build day tabs + panels
  data.forEach((day, di) => {
    // Tab
    const tab = document.createElement('button');
    tab.className = 'day-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', di === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', `panel-${day.day}`);
    tab.dataset.day = day.day;
    tab.textContent = day.dayLabel;
    tabContainer.appendChild(tab);

    // Panel
    const panel = document.createElement('div');
    panel.id = `panel-${day.day}`;
    panel.className = 'session-list' + (di === 0 ? ' active' : '');
    panel.setAttribute('role', 'tabpanel');

    day.sessions.forEach(sess => {
      const item = document.createElement('div');
      item.className = 'session-item reveal';
      item.dataset.type = sess.type;
      const tagClass = sess.type === 'talk' ? '' : `tag-${sess.type}`;
      item.innerHTML = `
        <div class="session-time">
          ${sess.time}
          <span class="session-time-end">→ ${sess.timeEnd}</span>
        </div>
        <div class="session-content">
          <div class="session-tag ${tagClass}">${TYPE_LABELS[sess.type] || sess.type}</div>
          <div class="session-title">${sess.title}</div>
          ${sess.speaker ? `<div class="session-speaker">${sess.speaker}</div>` : ''}
          <p class="session-desc">${sess.desc}</p>
        </div>`;
      panel.appendChild(item);
    });

    panelContainer.appendChild(panel);
  });

  // Tab switching
  const tabs = tabContainer.querySelectorAll('.day-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.session-list').forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${tab.dataset.day}`)?.classList.add('active');
    });
  });

  // Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.session-item').forEach(item => {
        const match = filter === 'all' || item.dataset.type === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  // Reveal session items
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.05 });
  document.querySelectorAll('.session-item').forEach(el => obs.observe(el));
})();

/* ============================================================
   10. SPEAKERS
   ============================================================ */
(function initSpeakers() {
  if (!window.SPEAKERS_DATA) return;
  const grid = document.getElementById('speaker-grid');
  if (!grid) return;

  const DEFAULT_AVATAR = `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="40" cy="40" r="40" fill="#F0EBFA"/>
      <circle cx="40" cy="32" r="14" stroke="#9B6FD4" stroke-width="1.5"/>
      <path d="M14 72c0-14.36 11.64-26 26-26h0c14.36 0 26 11.64 26 26" stroke="#9B6FD4" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

  window.SPEAKERS_DATA.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'speaker-card reveal';
    card.style.setProperty('--delay', (i * 0.07) + 's');
    const photoHTML = s.photo
      ? `<img src="${s.photo}" alt="Photo of ${s.name}">`
      : DEFAULT_AVATAR;
    card.innerHTML = `
      <div class="speaker-card-inner">
        <div class="speaker-photo">${photoHTML}</div>
        <div class="speaker-tag">${s.tag}</div>
        <div class="speaker-name">${s.name}</div>
        <div class="speaker-role">${s.role}</div>
        <div class="speaker-org mono">${s.org}</div>
        <p class="speaker-bio">${s.bio}</p>
      </div>
      <div class="speaker-hover-detail" aria-hidden="true">
        <div class="hover-qstate mono">|speaker⟩ = exploring quantum</div>
        <div class="hover-name">${s.name}</div>
        <div class="hover-bio">${s.bio}</div>
        ${s.link && s.link !== '#' ? `<a href="${s.link}" class="hover-link" target="_blank" rel="noopener">View profile →</a>` : ''}
      </div>`;
    grid.appendChild(card);
  });

  // Reveal observer
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.speaker-card').forEach(el => obs.observe(el));
})();

/* ============================================================
   11. FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.getAttribute('aria-controls'))?.classList.remove('open');
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        document.getElementById(btn.getAttribute('aria-controls'))?.classList.add('open');
      }
    });
  });
})();
