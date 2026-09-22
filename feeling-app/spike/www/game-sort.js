// Feeling Sort: faces drift down a play field; pick one up and drag it
// into the basket with the matching feeling. A held card pauses where
// you grab it (no fighting the drift mid-drag); release over the right
// basket to sort it, release anywhere else and it just keeps drifting —
// no penalty, no fail state (Principle 2). Baskets rotate through the
// app's ten book feelings every 6 correct sorts.

const POOL = [
  { name: 'Worried', emoji: '😟' },
  { name: 'Frustrated', emoji: '😤' },
  { name: 'Excited', emoji: '🤩' },
  { name: 'Sad', emoji: '😢' },
  { name: 'Angry', emoji: '😠' },
  { name: 'Scared', emoji: '😨' },
  { name: 'Embarrassed', emoji: '😳' },
  { name: 'Proud', emoji: '🙌' },
  { name: 'Overwhelmed', emoji: '😵‍💫' },
  { name: 'Happy', emoji: '😊' },
];

const stage = document.getElementById('sort-stage');
const cardLayer = document.getElementById('card-layer');
const basketRow = document.getElementById('basket-row');
const roundBanner = document.getElementById('round-banner');
const tallyEl = document.getElementById('tally');
const playView = document.getElementById('play-view');
const doneView = document.getElementById('done-view');
const doneSummary = document.getElementById('done-summary');
const goalJar = document.getElementById('goal-jar');
const jarFill = document.getElementById('jar-fill');
const jarCount = document.getElementById('jar-count');
const jarSprocket = document.getElementById('jar-sprocket');

const MAX_CARDS = 4;
const FALL_SPEED = 34; // px/sec
const SORT_GOAL = 6; // correct sorts before baskets rotate
const JAR_GOAL = 8;
const CARD_RADIUS = 32;

let basketFeelings = [];
let cards = []; // { el, feeling, x, y, dragging }
let totalSorted = 0;
let sortsSinceRotation = 0;
let jarProgress = 0;
let jarsFilled = 0;
let running = true;
let lastTick = null;
let spawnTimer = null;
let feedbackTimer = null;

function pickBaskets() {
  const shuffled = POOL.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function renderBaskets() {
  basketRow.innerHTML = '';
  basketFeelings.forEach((f) => {
    const b = document.createElement('div');
    b.className = 'basket';
    b.dataset.feeling = f.name;
    b.innerHTML = `<span class="basket-emoji">${f.emoji}</span><span class="basket-label">${f.name}</span>`;
    basketRow.appendChild(b);
  });
}

function announceRound(first) {
  const names = basketFeelings.map((f) => f.name).join(', ');
  roundBanner.textContent = first ? `Sort into: ${names}` : `New baskets: ${names}!`;
  roundBanner.classList.add('show');
  window.clearTimeout(announceRound._t);
  announceRound._t = window.setTimeout(() => roundBanner.classList.remove('show'), 2200);
  if (!first) sprocketTTS.speak(`New baskets: ${names}!`);
}

function showFeedback(text) {
  let el = stage.querySelector('.sort-feedback');
  if (!el) {
    el = document.createElement('div');
    el.className = 'sort-feedback';
    stage.appendChild(el);
  }
  el.textContent = text;
  el.classList.add('show');
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => el.classList.remove('show'), 900);
}

function cheer() {
  jarSprocket.classList.remove('cheer');
  void jarSprocket.offsetWidth;
  jarSprocket.classList.add('cheer');
  window.setTimeout(() => jarSprocket.classList.remove('cheer'), 260);
}

function growJar() {
  jarProgress += 1;
  if (jarProgress >= JAR_GOAL) {
    jarFill.style.height = '100%';
    jarCount.textContent = String(JAR_GOAL);
    goalJar.classList.add('full');
    jarsFilled += 1;
    window.setTimeout(() => {
      jarProgress = 0;
      jarFill.style.height = '0%';
      jarCount.textContent = '0';
      goalJar.classList.remove('full');
    }, 1100);
  } else {
    jarFill.style.height = `${(jarProgress / JAR_GOAL) * 100}%`;
    jarCount.textContent = String(jarProgress);
  }
}

function spawnCard() {
  if (!running || cards.length >= MAX_CARDS) return;
  const feeling = basketFeelings[Math.floor(Math.random() * basketFeelings.length)];
  const stageWidth = stage.clientWidth || 300;
  const x = CARD_RADIUS + Math.random() * Math.max(0, stageWidth - CARD_RADIUS * 2);

  const el = document.createElement('div');
  el.className = 'feeling-card';
  el.textContent = feeling.emoji;
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', feeling.name);
  cardLayer.appendChild(el);

  const card = { el, feeling, x, y: -CARD_RADIUS, dragging: false };
  cards.push(card);
  positionCard(card);
  wireCardDrag(card);
}

function positionCard(card) {
  card.el.style.transform = `translate(${card.x}px, ${card.y}px)`;
}

function removeCard(card) {
  cards = cards.filter((c) => c !== card);
  card.el.remove();
}

function wireCardDrag(card) {
  let offsetX = 0;
  let offsetY = 0;

  function onPointerDown(e) {
    if (!running) return;
    e.preventDefault();
    card.dragging = true;
    card.el.classList.add('dragging');
    card.el.setPointerCapture(e.pointerId);
    const rect = stage.getBoundingClientRect();
    offsetX = card.x - (e.clientX - rect.left);
    offsetY = card.y - (e.clientY - rect.top);
  }

  function onPointerMove(e) {
    if (!card.dragging) return;
    const rect = stage.getBoundingClientRect();
    let x = e.clientX - rect.left + offsetX;
    let y = e.clientY - rect.top + offsetY;
    x = Math.max(CARD_RADIUS, Math.min(rect.width - CARD_RADIUS, x));
    y = Math.max(CARD_RADIUS, Math.min(rect.height - CARD_RADIUS, y));
    card.x = x;
    card.y = y;
    positionCard(card);
  }

  function onPointerUp(e) {
    if (!card.dragging) return;
    card.dragging = false;
    card.el.classList.remove('dragging');
    try { card.el.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    handleDrop(card);
  }

  card.el.addEventListener('pointerdown', onPointerDown);
  card.el.addEventListener('pointermove', onPointerMove);
  card.el.addEventListener('pointerup', onPointerUp);
  card.el.addEventListener('pointercancel', onPointerUp);
}

function handleDrop(card) {
  const cardRect = card.el.getBoundingClientRect();
  const cardCenterX = cardRect.left + cardRect.width / 2;
  const cardCenterY = cardRect.top + cardRect.height / 2;

  const baskets = Array.from(basketRow.children);
  const target = baskets.find((b) => {
    const r = b.getBoundingClientRect();
    return cardCenterX >= r.left && cardCenterX <= r.right && cardCenterY >= r.top - 20 && cardCenterY <= r.bottom + 10;
  });

  if (!target) return; // dropped in open space — keeps drifting, no penalty

  if (target.dataset.feeling === card.feeling.name) {
    sortCorrect(card, target);
  } else {
    target.classList.add('hot');
    window.setTimeout(() => target.classList.remove('hot'), 260);
    showFeedback('Try a different basket!');
    card.el.classList.add('bounce-back');
    window.setTimeout(() => card.el.classList.remove('bounce-back'), 400);
  }
}

function sortCorrect(card, basketEl) {
  totalSorted += 1;
  tallyEl.textContent = String(totalSorted);
  sortsSinceRotation += 1;
  cheer();
  growJar();

  basketEl.classList.add('correct-pulse');
  window.setTimeout(() => basketEl.classList.remove('correct-pulse'), 500);

  card.el.classList.add('absorbed');
  const basketRect = basketEl.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const targetX = basketRect.left - stageRect.left + basketRect.width / 2;
  const targetY = basketRect.top - stageRect.top + basketRect.height / 2;
  card.el.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.2)`;
  window.setTimeout(() => {
    removeCard(card);
    spawnCard();
  }, 320);

  if (sortsSinceRotation >= SORT_GOAL) {
    sortsSinceRotation = 0;
    window.setTimeout(rotateBaskets, 500);
  }
}

function rotateBaskets() {
  cards.slice().forEach((c) => removeCard(c));
  basketFeelings = pickBaskets();
  renderBaskets();
  announceRound(false);
  for (let i = 0; i < 3; i += 1) spawnCard();
}

function tick(ts) {
  if (!running) return;
  if (lastTick === null) lastTick = ts;
  const dt = Math.min(0.05, (ts - lastTick) / 1000);
  lastTick = ts;

  const stageHeight = stage.clientHeight || 400;
  cards.forEach((card) => {
    if (card.dragging) return;
    card.y += FALL_SPEED * dt;
    if (card.y > stageHeight + CARD_RADIUS) {
      // Missed — recycle from the top with a (possibly new) feeling
      // from the current basket set. No penalty, just another chance.
      card.feeling = basketFeelings[Math.floor(Math.random() * basketFeelings.length)];
      card.el.textContent = card.feeling.emoji;
      card.el.setAttribute('aria-label', card.feeling.name);
      card.y = -CARD_RADIUS;
      const stageWidth = stage.clientWidth || 300;
      card.x = CARD_RADIUS + Math.random() * Math.max(0, stageWidth - CARD_RADIUS * 2);
    }
    positionCard(card);
  });

  requestAnimationFrame(tick);
}

document.getElementById('btn-done').addEventListener('click', () => {
  running = false;
  window.clearInterval(spawnTimer);
  cards.slice().forEach((c) => removeCard(c));
  const total = Number(localStorage.getItem('sprocket-sort-rounds') || 0) + totalSorted;
  localStorage.setItem('sprocket-sort-rounds', String(total));
  if (totalSorted === 0) {
    doneSummary.textContent = "That's okay — want to try again?";
  } else {
    const jarNote = jarsFilled > 0 ? ` You filled the jar ${jarsFilled} time${jarsFilled === 1 ? '' : 's'}!` : '';
    doneSummary.textContent = `You sorted ${totalSorted} face${totalSorted === 1 ? '' : 's'} this time.${jarNote}`;
  }
  playView.style.display = 'none';
  doneView.style.display = 'flex';
});

document.getElementById('btn-again').addEventListener('click', () => {
  totalSorted = 0;
  sortsSinceRotation = 0;
  jarProgress = 0;
  jarsFilled = 0;
  tallyEl.textContent = '0';
  jarFill.style.height = '0%';
  jarCount.textContent = '0';
  goalJar.classList.remove('full');
  doneView.style.display = 'none';
  playView.style.display = 'flex';
  running = true;
  lastTick = null;
  startRound(true);
  requestAnimationFrame(tick);
});

function startRound(first) {
  basketFeelings = pickBaskets();
  renderBaskets();
  announceRound(first);
  for (let i = 0; i < 3; i += 1) spawnCard();
  spawnTimer = window.setInterval(spawnCard, 1400);
}

startRound(true);
requestAnimationFrame(tick);
