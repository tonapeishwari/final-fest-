/* ============================================================
   Entangled Qubits — Spooky action at a distance
   Two qubit particles react together regardless of position
   ============================================================ */
'use strict';

(function initEntanglement() {
  const qA   = document.getElementById('qubit-a');
  const qB   = document.getElementById('qubit-b');
  const svgEl = document.getElementById('entanglement-svg');
  const line  = document.getElementById('entanglement-line');
  if (!qA || !qB || !svgEl || !line) return;

  let entangled = false;
  let pulseTimeout = null;

  function getCenter(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function updateLine() {
    const a = getCenter(qA);
    const b = getCenter(qB);
    line.setAttribute('x1', a.x);
    line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x);
    line.setAttribute('y2', b.y);
  }

  function triggerEntanglement() {
    // Both react simultaneously — spooky!
    [qA, qB].forEach(q => {
      q.classList.add('entangled');
      setTimeout(() => q.classList.remove('entangled'), 1200);
    });

    // Show connection line briefly
    svgEl.style.display = 'block';
    updateLine();
    line.style.opacity = '0';
    requestAnimationFrame(() => {
      line.style.transition = 'opacity 0.3s ease';
      line.style.opacity = '0.7';
    });
    clearTimeout(pulseTimeout);
    pulseTimeout = setTimeout(() => {
      line.style.opacity = '0';
      setTimeout(() => { svgEl.style.display = 'none'; }, 300);
    }, 1500);

    // Toast
    const toast = document.getElementById('collapse-toast');
    if (toast) {
      toast.querySelector('span').textContent = '⚛ SPOOKY ACTION AT A DISTANCE';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
  }

  // Both particles trigger the same reaction
  [qA, qB].forEach(q => {
    q.addEventListener('click', triggerEntanglement);
    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerEntanglement(); }
    });
  });

  // Update line position on resize/scroll
  window.addEventListener('resize',  updateLine, { passive: true });
  window.addEventListener('scroll',  updateLine, { passive: true });
})();
