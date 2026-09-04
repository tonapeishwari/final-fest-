# Qiskit Fall Fest — "A Decade of Quantum on Cloud" Website

## Summary

Building a comprehensive, polished, interactive quantum computing event website — a complete ground-up rebuild of the existing `fallfest` project. The site inherits the light lavender/white visual identity from Reference 2 and the interactive Schrödinger's box / experimental spirit from Reference 1, and adds a full suite of quantum Easter eggs, narrative scroll, and interactive visualizations.

---

## Design System

### Color Palette
```
--bg:           #FAFBFF   (barely-there lavender white)
--bg-raised:    #F0EBFA   (soft lavender card bg)
--bg-subtle:    #F7F5FD   (in-between tint)
--ink:          #1C1130   (rich dark purple-black)
--ink-soft:     #4A3D5C   (muted text)
--ink-faint:    #8A7AA8   (placeholder / ghost text)
--violet-deep:  #4B2170   (primary brand purple)
--violet:       #7C4DBF   (accent)
--violet-mid:   #9B6FD4   (mid accent)
--violet-light: #C4A3E8   (light glow)
--violet-line:  #E5DCEF   (dividers)
--glow:         #B48EE0   (glow color)
--white:        #FFFFFF
```

### Fonts (already in project, keeping)
- `Space Grotesk` — display / headings
- `IBM Plex Sans` — body
- `IBM Plex Mono` — code / mono labels

---

## Architecture: Files

The project stays as a flat HTML/CSS/JS structure (no framework needed for a static event site).

### New files being created:
- `index.html` — completely rebuilt (single page with all sections)
- `css/style.css` — rebuilt design system + all section styles
- `js/main.js` — rebuilt: hero wave, Bloch sphere, nav, scroll anim
- `js/quantum-easter-eggs.js` — all Easter eggs modular
- `js/schrodinger.js` — Schrödinger's box interaction
- `js/quantum-circuit.js` — interactive quantum circuit
- `js/entanglement.js` — entangled qubits Easter egg
- `data/timeline.js` — quantum decade timeline data
- `data/speakers.js` — speaker card data
- `data/schedule.js` — schedule session data

### Deleted/deprecated:
- `schedule.html` — merged into index.html as section
- `speakers.html` — merged into index.html as section

---

## Proposed Changes

### Hero Section

The hero has:
1. **Wavefunction canvas** — background canvas with multiple overlapping sine waves (different frequencies, phases, amplitudes). Cursor movement causes subtle interference. Colors: soft violet/lavender gradient. Occasionally a wave "collapses" (amplitude falls to near-zero) then reforms — simulating wavefunction collapse.
2. **Left column**: Eyebrow "Qiskit Fall Fest · IBM Quantum", large headline "A Decade of Quantum on Cloud", sub-headline, event metadata (date, venue, format), two CTAs (Register Now, Explore the Quantum).
3. **Right column**: Animated Bloch sphere (from existing JS, improved with glow effects) + **Schrödinger's Box** (below or beside the sphere).

### Schrödinger's Box

CSS + JS implementation:
- Box is a styled `<div>` that looks like a sealed industrial crate — drawn with pure CSS (isometric perspective using transform: rotateX/rotateY, shadows).
- Before interaction: Label "SCHRÖDINGER'S BOX", status badge "STATE: SUPERPOSITION".
- Hover: subtle CSS shake animation ("quantum fluctuations"), slight glow pulse.
- Click: CSS class toggle reveals "cat" inside — an SVG illustration of a cat that is simultaneously alive (one side) and skeletal (other side). After click: "WAVEFUNCTION COLLAPSED" toast, status badge changes to "STATE: OBSERVED | [ALIVE/DEAD - randomized]".
- Can be reset by clicking again.
- Tooltip on hover: "You looked. That's the problem."

### Quantum Easter Eggs (js/quantum-easter-eggs.js)

1. **Entangled Qubits** — Two pulsing dots, one near nav and one near footer. When you click one, both flash simultaneously, with a connecting SVG line pulsing between them.
2. **Don't Measure Me** — A small equation `|ψ⟩ = α|0⟩ + β|1⟩` that reads "Don't measure me." Clicking collapses it to `|1⟩` with animation.
3. **Heisenberg Blur** — An element labeled "Position: CERTAIN" that becomes blurred when hovered.
4. **Wave-Particle Toggle** — A small element near the quantum section alternates between wave/particle views.
5. **Quantum Tunneling** — A particle occasionally appears to pass through a divider.
6. **Feynman Quote** — After hovering a specific small atom icon in the footer for 2s, a quote appears: "What I cannot create, I do not understand."
7. **Logo Easter Egg** — Clicking the logo 5 times collapses it with a "You've collapsed the logo" message.
8. **DO NOT CLICK button** — A small button hidden in the FAQ section that does a funny animation.
9. **Konami Code** — Typing `↑↑↓↓←→←→BA` reveals a hidden quantum message.
10. **Inspect Element comments** in HTML source.

### Page Sections

```
1. NAV             (sticky, blur, translucent)
2. HERO            (wave canvas + copy + Bloch sphere + Schrödinger box)
3. ABOUT           (event overview + track cards)
4. QUBIT 101       (bit→qubit transition + Bloch sphere explainer)
5. QUANTUM DECADE  (horizontal interactive timeline 2016→2026)
6. CLOUD+QUANTUM   (animated circuit→cloud→backend visualization)
7. QUANTUM CIRCUIT (interactive toy circuit)
8. SCHEDULE        (filterable by track)
9. SPEAKERS        (hover-interactive cards)
10. VENUE          (info card)
11. REGISTER CTA   (major animated section)
12. FAQ            (accordion, DO NOT CLICK Easter egg)
13. FOOTER         (Feynman Easter egg, entangled qubit B)
```

---

## Verification Plan

### Manual
- Open site in Chrome, check hero waves, Bloch sphere, Schrödinger box interaction
- Check all Easter eggs fire correctly
- Check mobile responsive at 390px, 768px, 1280px
- Check reduced-motion (Chrome DevTools → Rendering → emulate prefers-reduced-motion)
- Verify all nav links scroll smoothly
- Test schedule filter tabs
- Verify keyboard navigation and focus states

### Performance
- Ensure canvas animations run at 60fps (Chrome Performance tab)
- Ensure no layout shift on load

---

## Open Questions

> [!IMPORTANT]
> **Event data**: The brief says "I will later replace all the data." I will use realistic placeholder content throughout (not lorem ipsum), structured so it's easy to find and replace. All data lives in `data/` JS files and can be swapped without touching layout code.

> [!NOTE]
> **College/event info**: I'll use generic placeholders like "Your Institution" / "October 2026 · Pune" / "Hybrid" that match the existing project's content style.

> [!NOTE]
> **Speaker photos**: I'll generate placeholder speaker avatars using the generate_image tool so the cards look real, not broken.
