/* ============================================================
   Schrödinger's Box — Interactive quantum state collapse
   ============================================================ */
'use strict';

(function initSchrodinger() {
  const box   = document.getElementById('schrodinger-box');
  const toast = document.getElementById('collapse-toast');
  const stateText = document.getElementById('box-state-text');
  if (!box) return;

  const STATES = ['ALIVE — 😺', 'WELL... YOU KNOW 💀'];
  let observed = false;

  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('span').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function observe() {
    if (observed) {
      // Reset to superposition
      box.setAttribute('data-state', 'superposition');
      if (stateText) stateText.textContent = 'STATE: SUPERPOSITION';
      observed = false;
      showToast('SUPERPOSITION RESTORED. FOR NOW.');
      return;
    }
    // Collapse to random state
    const result = Math.random() < 0.5 ? 0 : 1;
    observed = true;
    box.setAttribute('data-state', 'observed');
    const label = result === 0 ? 'STATE: ALIVE 😺' : 'STATE: DECEASED 💀';
    if (stateText) stateText.textContent = label;
    showToast('WAVEFUNCTION COLLAPSED. ' + (result === 0 ? 'Good news.' : 'Physics is cruel.'));
  }

  box.addEventListener('click', observe);
  box.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); observe(); }
  });

  // Touch support — slight wiggle on touchstart
  box.addEventListener('touchstart', () => {
    box.querySelector('.box-body').style.animation = 'shake 0.4s ease';
    setTimeout(() => { box.querySelector('.box-body').style.animation = ''; }, 400);
  }, { passive: true });
})();
