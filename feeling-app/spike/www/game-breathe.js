// Breathing Buddy: hold the bubble to grow it (breathe in), release to
// let it shrink on its own slow pace (breathe out) — the shrink is
// NOT instant on release, it's a guided 4s transition, so the child
// can't rush the exhale by releasing early.
const bubble = document.getElementById('bubble');
const label = document.getElementById('bubble-label');
const prompt = document.getElementById('prompt');
const countEl = document.getElementById('breath-count');

let state = 'idle'; // idle | growing | shrinking
let heldSince = 0;
let breaths = Number(localStorage.getItem('sprocket-breaths') || 0);
countEl.textContent = breaths;

function startGrow() {
  if (state !== 'idle') return;
  state = 'growing';
  heldSince = performance.now();
  bubble.classList.remove('shrinking');
  bubble.classList.add('growing');
  label.textContent = 'Breathe in…';
  prompt.textContent = 'Breathing in… keep holding.';
}

function startShrink() {
  if (state !== 'growing') return;
  const held = performance.now() - heldSince;
  state = 'shrinking';
  bubble.classList.remove('growing');
  bubble.classList.add('shrinking');
  label.textContent = 'Breathe out…';
  prompt.textContent = 'Breathing out… nice and slow.';

  const onDone = () => {
    bubble.removeEventListener('transitionend', onDone);
    state = 'idle';
    label.textContent = 'Hold me';
    prompt.textContent = 'Press and hold the bubble to breathe in.';
    if (held > 700) {
      breaths += 1;
      countEl.textContent = breaths;
      localStorage.setItem('sprocket-breaths', String(breaths));
    }
  };
  bubble.addEventListener('transitionend', onDone);
}

bubble.addEventListener('pointerdown', (e) => { e.preventDefault(); startGrow(); });
bubble.addEventListener('pointerup', startShrink);
bubble.addEventListener('pointercancel', startShrink);
bubble.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'mouse') startShrink(); });
