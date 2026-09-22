// Sprocket's Garden: hold the glowing orb to breathe in, release to let
// it shrink on its own slow guided pace (breathe out) — not instant, a
// 4s transition, so the child can't rush the exhale by releasing early.
// Two full breaths grow one flower from bud to bloom; three flowers make
// a garden. On the third bloom the garden celebrates, then resets so it
// can be grown again — the cumulative "flowers grown" tally never resets.
const SVG_NS = 'http://www.w3.org/2000/svg';

const orb = document.getElementById('growth-orb');
const orbHalo = orb.querySelector('.orb-halo');
const sparkleLayer = document.getElementById('sparkle-burst');
const prompt = document.getElementById('prompt');
const countEl = document.getElementById('flower-count');
const slots = Array.from(document.querySelectorAll('.flower-slot'));
const gardenSprocket = document.getElementById('garden-sprocket');

function cheer() {
  gardenSprocket.classList.remove('g-cheer');
  // Force reflow so re-adding the class restarts the animation.
  void gardenSprocket.offsetWidth;
  gardenSprocket.classList.add('g-cheer');
  window.setTimeout(() => gardenSprocket.classList.remove('g-cheer'), 650);
}

// Slot centers, matching the coordinates baked into game-breathe.html's
// <g class="flower-slot"> soil/stem/bloom positions.
const SLOT_POS = [
  { x: 80, y: 180 },
  { x: 170, y: 180 },
  { x: 260, y: 180 },
];
const ORB_GROUND_Y = 264;

let state = 'idle'; // idle | growing | shrinking
let heldSince = 0;
let activeIndex = 0;
let flowersGrown = Number(localStorage.getItem('sprocket-garden-flowers') || 0);
countEl.textContent = flowersGrown;

function moveOrbTo(index) {
  const pos = SLOT_POS[index] || SLOT_POS[0];
  orb.setAttribute('transform', `translate(${pos.x},${ORB_GROUND_Y})`);
}
moveOrbTo(0);
orb.classList.add('idle-pulse');

function spawnSparkles(x, y) {
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI * 2 * i) / 6;
    const dx = Math.cos(angle) * 22;
    const dy = Math.sin(angle) * 14;
    const star = document.createElementNS(SVG_NS, 'use');
    star.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#gStar');
    star.setAttribute('href', '#gStar');
    star.setAttribute('class', 'g-sparkle');
    star.setAttribute('x', String(x + dx - 6));
    star.setAttribute('y', String(y + dy - 6));
    star.setAttribute('width', '12');
    star.setAttribute('height', '12');
    star.style.animationDelay = `${i * 40}ms`;
    sparkleLayer.appendChild(star);
    setTimeout(() => star.remove(), 1000 + i * 40);
  }
}

function growActiveFlower() {
  const slot = slots[activeIndex];
  if (!slot) return;
  const stage = Number(slot.dataset.stage || 0) + 1;
  slot.dataset.stage = String(stage);

  if (stage < 2) {
    prompt.textContent = 'A bud is growing — breathe in again to help it bloom.';
    orb.classList.add('idle-pulse');
    return;
  }

  // Bloomed.
  const pos = SLOT_POS[activeIndex] || SLOT_POS[0];
  spawnSparkles(pos.x, pos.y);
  cheer();
  flowersGrown += 1;
  countEl.textContent = flowersGrown;
  localStorage.setItem('sprocket-garden-flowers', String(flowersGrown));

  const nextIndex = activeIndex + 1;
  if (nextIndex < slots.length) {
    activeIndex = nextIndex;
    prompt.textContent = 'A flower bloomed! Press and hold to grow the next one.';
    orb.classList.add('idle-pulse');
    setTimeout(() => moveOrbTo(activeIndex), 500);
  } else {
    orb.classList.remove('idle-pulse');
    prompt.textContent = 'The garden is in full bloom! Nicely breathed.';
    setTimeout(() => {
      slots.forEach((s) => { s.dataset.stage = '0'; });
      activeIndex = 0;
      moveOrbTo(0);
      orb.classList.add('idle-pulse');
      prompt.textContent = 'Press and hold the glowing light to breathe in.';
    }, 2600);
  }
}

function startGrow() {
  if (state !== 'idle') return;
  state = 'growing';
  heldSince = performance.now();
  orb.classList.remove('shrinking', 'idle-pulse');
  orb.classList.add('growing');
  prompt.textContent = 'Breathing in… keep holding.';
}

function startShrink() {
  if (state !== 'growing') return;
  const held = performance.now() - heldSince;
  state = 'shrinking';
  orb.classList.remove('growing');
  orb.classList.add('shrinking');
  prompt.textContent = 'Breathing out… nice and slow.';

  const onDone = () => {
    orbHalo.removeEventListener('transitionend', onDone);
    orb.classList.remove('shrinking');
    state = 'idle';
    if (held > 700) {
      growActiveFlower();
    } else {
      prompt.textContent = 'Press and hold the glowing light to breathe in.';
      orb.classList.add('idle-pulse');
    }
  };
  orbHalo.addEventListener('transitionend', onDone);
}

orb.addEventListener('pointerdown', (e) => { e.preventDefault(); startGrow(); });
orb.addEventListener('pointerup', startShrink);
orb.addEventListener('pointercancel', startShrink);
orb.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'mouse') startShrink(); });
