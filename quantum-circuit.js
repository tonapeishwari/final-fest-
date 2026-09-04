/* ============================================================
   Interactive Quantum Circuit Toy
   ============================================================ */
'use strict';

(function initQuantumCircuit() {
  const playground = document.getElementById('circuit-playground');
  if (!playground) return;

  const gateBtns    = playground.querySelectorAll('.gate-btn');
  const resetBtn    = document.getElementById('circuit-reset');
  const stateDisplay = document.getElementById('circuit-state-display');
  const wireGates   = [
    document.getElementById('wire-gates-0'),
    document.getElementById('wire-gates-1'),
  ];

  let selectedGate = 'H';
  let circuit = [[], []]; // circuit[qubit] = array of gates

  // Gate colors / labels
  const GATE_META = {
    H:    { class: 'gate-H',    label: 'H' },
    X:    { class: 'gate-X',    label: 'X' },
    Z:    { class: 'gate-Z',    label: 'Z' },
    CNOT: { class: 'gate-cnot', label: 'CX' },
    M:    { class: 'gate-M',    label: 'M' },
  };

  // Select gate from palette
  gateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.gate === 'M') {
        addGate(0, 'M'); addGate(1, 'M');
        computeAndDisplay(); return;
      }
      gateBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedGate = btn.dataset.gate;
    });
  });

  // Click wire to add gate
  wireGates.forEach((wireEl, qi) => {
    if (!wireEl) return;
    wireEl.parentElement.addEventListener('click', e => {
      if (e.target.closest('.gate-btn, .circuit-reset-btn, .gate-on-wire')) return;
      if (selectedGate === 'M') {
        addGate(0, 'M'); addGate(1, 'M');
        computeAndDisplay(); return;
      }
      if (selectedGate === 'CNOT') {
        addGate(0, 'CNOT-ctrl');
        addGate(1, 'CNOT-tgt');
      } else {
        addGate(qi, selectedGate);
      }
      computeAndDisplay();
    });
  });

  function addGate(qi, gate) {
    if (!wireGates[qi]) return;
    // Limit to 6 gates per wire
    if (circuit[qi].length >= 6) return;
    circuit[qi].push(gate);

    const el = document.createElement('div');
    const meta = gate === 'CNOT-ctrl' ? { class: 'gate-cnot-ctrl', label: '●' }
               : gate === 'CNOT-tgt'  ? { class: 'gate-cnot-target', label: '⊕' }
               : GATE_META[gate] || { class: '', label: gate };
    el.className = `gate-on-wire gate-${meta.class || gate}`;
    el.textContent = meta.label || gate;
    el.title = gateTooltip(gate);
    wireGates[qi].appendChild(el);
  }

  function gateTooltip(g) {
    return {
      H: 'Hadamard: Creates superposition',
      X: 'Pauli-X: Quantum NOT gate',
      Z: 'Pauli-Z: Phase flip',
      'CNOT-ctrl': 'CNOT Control qubit',
      'CNOT-tgt':  'CNOT Target qubit — flips if control is |1⟩',
      M: 'Measure: Collapses quantum state',
    }[g] || g;
  }

  function computeAndDisplay() {
    // Simplified state tracker — purely illustrative
    let state = '|00⟩';
    const q0 = [...circuit[0]];
    const q1 = [...circuit[1]];
    const hasMeasure = q0.includes('M') || q1.includes('M');
    const hasH   = q0.includes('H') || q1.includes('H');
    const hasCNOT = q0.includes('CNOT-ctrl');
    const hasX   = q0.includes('X') || q1.includes('X');

    if (hasMeasure) {
      // Simulate measurement
      const outcomes = ['|00⟩','|01⟩','|10⟩','|11⟩'];
      const weights = hasCNOT && hasH ? [0.5, 0, 0, 0.5]
                    : hasH           ? [0.5, 0.5, 0, 0]
                    : hasX           ? [0, 1, 0, 0]
                    : [1, 0, 0, 0];
      const rand = Math.random();
      let cum = 0;
      for (let i = 0; i < outcomes.length; i++) {
        cum += weights[i];
        if (rand < cum) { state = outcomes[i]; break; }
      }
      if (stateDisplay) {
        stateDisplay.textContent = 'Measured: ' + state;
        stateDisplay.style.color = 'var(--violet-deep)';
      }
    } else if (hasCNOT && hasH) {
      state = '( |00⟩ + |11⟩ ) / √2  ← Bell state!';
      if (stateDisplay) stateDisplay.style.color = 'var(--violet-mid)';
    } else if (hasH) {
      state = hasX ? '( |0⟩ − |1⟩ ) / √2' : '( |0⟩ + |1⟩ ) / √2';
      if (stateDisplay) stateDisplay.style.color = 'var(--violet)';
    } else if (hasX) {
      state = '|10⟩';
      if (stateDisplay) stateDisplay.style.color = '';
    } else {
      state = '|00⟩';
      if (stateDisplay) stateDisplay.style.color = '';
    }

    if (stateDisplay && !hasMeasure) stateDisplay.textContent = state;
  }

  // Reset
  resetBtn?.addEventListener('click', () => {
    circuit = [[], []];
    wireGates.forEach(w => { if (w) w.innerHTML = ''; });
    if (stateDisplay) {
      stateDisplay.textContent = '|00⟩';
      stateDisplay.style.color = '';
    }
    gateBtns.forEach(b => b.classList.remove('selected'));
    selectedGate = 'H';
  });
})();
