// Feelings Academy level engine: one data-driven template that runs
// every level's lesson — Teach (3 scripted steps) -> Spot the Signal
// (recognition, retryable) -> Tool Match (drag-and-drop) -> Quick
// Recall (3 timed rounds) -> Complete (stars + Sparks + unlock).
//
// Star scoring measures skill, never valence (see academy-data.js):
// star 1 = finished the level; star 2 = no retry needed on Spot or
// Tool; star 3 = beat the timer on at least 2 of 3 Recall rounds.
// Every level, regardless of which feeling it teaches, uses this exact
// same formula.

const params = new URLSearchParams(window.location.search);
const level = academyGetLevel(params.get('level'));
if (!level) {
  document.getElementById('phase-stage').innerHTML = '<p style="padding:40px;text-align:center;">Level not found. <a href="academy.html">Back to map</a></p>';
  throw new Error('Unknown academy level');
}

const PHASES = ['teach', 'spot', 'tool', 'recall', 'complete'];
const stageEl = document.getElementById('phase-stage');
const dotsEl = document.getElementById('step-dots');
const sparksTotalEl = document.getElementById('sparks-total');

let phaseIndex = 0;
let spotNeededRetry = false;
let toolNeededRetry = false;
let recallHits = 0;
let recallRound = 0;
let recallTimerId = null;
const RECALL_ROUNDS = 3;
const RECALL_MS = 4200;

sparksTotalEl.textContent = String(academyGetSparks());

function renderDots() {
  dotsEl.innerHTML = PHASES.map((p, i) => {
    const cls = i < phaseIndex ? 'done' : i === phaseIndex ? 'active' : '';
    return `<span class="step-dot ${cls}"></span>`;
  }).join('');
}

function goPhase(name) {
  phaseIndex = PHASES.indexOf(name);
  renderDots();
  if (name === 'teach') renderTeach();
  if (name === 'spot') renderSpot();
  if (name === 'tool') renderTool();
  if (name === 'recall') { recallHits = 0; recallRound = 0; renderRecallRound(); }
  if (name === 'complete') renderComplete();
}

// --- Teach ---------------------------------------------------------
function teachSteps() {
  return [
    { badge: '💓', bg: level.accentSoft, text: `Sprocket notices ${level.body}.` },
    { badge: '💭', bg: level.accentSoft, text: `And thoughts like ${level.mind}.` },
    { badge: level.emoji, bg: level.accentSoft, text: `That feeling has a name: <strong>${level.name.toUpperCase()}</strong>.`, sub: 'Let’s practice spotting it.' },
  ];
}

function renderTeach(step = 0) {
  const steps = teachSteps();
  const s = steps[step];
  const isLast = step === steps.length - 1;
  stageEl.innerHTML = `
    <div class="teach-card">
      <div class="teach-badge" style="background:${s.bg}">${s.badge}</div>
      <p class="teach-text">${s.text}</p>
      ${s.sub ? `<p class="teach-sub">${s.sub}</p>` : ''}
      <div class="teach-nav">
        <button id="btn-hear-teach" class="hear-btn" aria-label="Hear this">🔊</button>
        <button id="btn-teach-next" class="pill-btn help">${isLast ? 'Start practice →' : 'Next'}</button>
      </div>
    </div>
  `;
  document.getElementById('btn-hear-teach').addEventListener('click', () => {
    sprocketTTS.speak(s.text.replace(/<[^>]+>/g, ''));
  });
  document.getElementById('btn-teach-next').addEventListener('click', () => {
    if (isLast) goPhase('spot');
    else renderTeach(step + 1);
  });
}

// --- Spot the Signal -------------------------------------------------
function renderSpot() {
  const distractors = academyOtherLevels(level.id, 2);
  const options = [level, ...distractors].sort(() => Math.random() - 0.5);

  stageEl.innerHTML = `
    <p class="phase-heading">Which body feeling matches <strong>${level.name.toUpperCase()}</strong>?</p>
    <p class="phase-sub">Tap the one that feels right.</p>
    <div class="signal-options" id="signal-options"></div>
    <p class="retry-hint" id="spot-hint"></p>
  `;
  const list = document.getElementById('signal-options');
  const hint = document.getElementById('spot-hint');

  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'signal-option';
    btn.innerHTML = `<span class="opt-emoji">💓</span><span>${opt.body}</span>`;
    btn.addEventListener('click', () => {
      if (opt.id === level.id) {
        btn.classList.add('correct-flash');
        Array.from(list.children).forEach((c) => { c.disabled = true; });
        hint.textContent = '';
        window.setTimeout(() => goPhase('tool'), 700);
      } else {
        spotNeededRetry = true;
        btn.classList.add('wrong-flash');
        btn.disabled = true;
        hint.textContent = `Not quite — keep looking for ${level.name}'s own feeling.`;
        window.setTimeout(() => btn.classList.remove('wrong-flash'), 400);
      }
    });
    list.appendChild(btn);
  });
}

// --- Tool Match (single round, reused drag mechanic) ------------------
function renderTool() {
  stageEl.innerHTML = `
    <p class="phase-heading">Sprocket feels ${level.emoji} <strong>${level.name.toUpperCase()}</strong>.</p>
    <p class="phase-sub">Drag the tool that helps onto Sprocket.</p>
    <div class="tool-phase-stage" id="tool-phase-stage">
      <div class="tp-hill"></div>
      <div class="tp-drop-zone" id="tp-drop-zone">
        <div class="tp-sprocket" id="tp-sprocket">
          <div class="tp-antenna"><span class="tp-antenna-tip"></span></div>
          <div class="tp-head"><div class="tp-eye left"></div><div class="tp-eye right"></div></div>
          <div class="tp-body"><div class="tp-core"></div></div>
        </div>
        <div class="tp-reaction" id="tp-reaction"></div>
      </div>
    </div>
    <div class="tp-tray" id="tp-tray"></div>
    <p class="retry-hint" id="tool-hint"></p>
  `;

  const tray = document.getElementById('tp-tray');
  const dropZone = document.getElementById('tp-drop-zone');
  const sprocketEl = document.getElementById('tp-sprocket');
  const reactionEl = document.getElementById('tp-reaction');
  const hint = document.getElementById('tool-hint');

  const decoys = academyOtherLevels(level.id, 2);
  const tiles = [level, ...decoys].sort(() => Math.random() - 0.5);

  tiles.forEach((pair) => {
    const tile = document.createElement('div');
    tile.className = 'tp-tile';
    tile.innerHTML = `<span class="tp-tile-emoji">${pair.tool.icon}</span><span class="tp-tile-label">${pair.tool.short}</span>`;
    tray.appendChild(tile);
    wireToolDrag(tile, pair, dropZone, sprocketEl, reactionEl, hint);
  });
}

function wireToolDrag(tile, pair, dropZone, sprocketEl, reactionEl, hint) {
  let startX = 0;
  let startY = 0;
  let dragging = false;

  function onDown(e) {
    e.preventDefault();
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    tile.classList.remove('returning');
    tile.classList.add('dragging');
    tile.setPointerCapture(e.pointerId);
  }
  function onMove(e) {
    if (!dragging) return;
    tile.style.transform = `translate(${e.clientX - startX}px, ${e.clientY - startY}px)`;
  }
  function onUp(e) {
    if (!dragging) return;
    dragging = false;
    tile.classList.remove('dragging');
    try { tile.releasePointerCapture(e.pointerId); } catch { /* already released */ }

    const tileRect = tile.getBoundingClientRect();
    const cx = tileRect.left + tileRect.width / 2;
    const cy = tileRect.top + tileRect.height / 2;
    const zoneRect = dropZone.getBoundingClientRect();
    const zcx = zoneRect.left + zoneRect.width / 2;
    const zcy = zoneRect.top + zoneRect.height / 2;
    const dist = Math.hypot(cx - zcx, cy - zcy);
    const overZone = dist <= zoneRect.width / 2 + 10;

    if (overZone && pair.id === level.id) {
      tile.classList.add('matched');
      sprocketEl.classList.remove('activated');
      void sprocketEl.offsetWidth;
      sprocketEl.classList.add('activated');
      const icon = document.createElement('span');
      icon.className = 'tp-reaction-icon';
      icon.textContent = pair.tool.icon;
      reactionEl.appendChild(icon);
      window.setTimeout(() => icon.remove(), 950);
      hint.textContent = '';
      window.setTimeout(() => goPhase('recall'), 950);
    } else {
      if (overZone) {
        toolNeededRetry = true;
        hint.textContent = 'Try a different tool!';
      }
      tile.classList.add('returning');
      tile.style.transform = 'translate(0, 0)';
      window.setTimeout(() => tile.classList.remove('returning'), 420);
    }
  }

  tile.addEventListener('pointerdown', onDown);
  tile.addEventListener('pointermove', onMove);
  tile.addEventListener('pointerup', onUp);
  tile.addEventListener('pointercancel', onUp);
}

// --- Quick Recall ------------------------------------------------------
function renderRecallRound() {
  window.clearTimeout(recallTimerId);
  const distractors = academyOtherLevels(level.id, 3);
  const tiles = [level, ...distractors].sort(() => Math.random() - 0.5);

  stageEl.innerHTML = `
    <p class="phase-heading">Tap ${level.name}'s face — fast!</p>
    <p class="recall-round-count">Round ${recallRound + 1} of ${RECALL_ROUNDS}</p>
    <div class="recall-timer-track"><div class="recall-timer-fill" id="recall-timer-fill"></div></div>
    <div class="recall-grid" id="recall-grid"></div>
  `;

  const grid = document.getElementById('recall-grid');
  const timerFill = document.getElementById('recall-timer-fill');
  let resolved = false;

  timerFill.style.width = '100%';
  timerFill.style.transition = 'none';
  requestAnimationFrame(() => {
    timerFill.style.transition = `width ${RECALL_MS}ms linear`;
    timerFill.style.width = '0%';
  });

  function resolveRound(hit, btn) {
    if (resolved) return;
    resolved = true;
    window.clearTimeout(recallTimerId);
    if (hit) {
      recallHits += 1;
      if (btn) btn.classList.add('correct-flash');
    } else if (btn) {
      btn.classList.add('wrong-flash');
    }
    Array.from(grid.children).forEach((c) => { c.disabled = true; });
    window.setTimeout(() => {
      recallRound += 1;
      if (recallRound >= RECALL_ROUNDS) goPhase('complete');
      else renderRecallRound();
    }, 550);
  }

  tiles.forEach((t) => {
    const btn = document.createElement('button');
    btn.className = 'recall-tile';
    btn.textContent = t.emoji;
    btn.addEventListener('click', () => resolveRound(t.id === level.id, btn));
    grid.appendChild(btn);
  });

  recallTimerId = window.setTimeout(() => resolveRound(false, null), RECALL_MS + 80);
}

// --- Complete ------------------------------------------------------------
function computeStars() {
  let stars = 1;
  if (!spotNeededRetry && !toolNeededRetry) stars += 1;
  if (recallHits >= 2) stars += 1;
  return stars;
}

function renderComplete() {
  const stars = computeStars();
  const sparksEarned = 10 + (stars - 1) * 5;

  const progress = academyLoadProgress();
  const prevStars = (progress[level.id] && progress[level.id].stars) || 0;
  progress[level.id] = { completed: true, stars: Math.max(prevStars, stars) };
  academySaveProgress(progress);
  const sparkTotal = academyAddSparks(sparksEarned);
  sparksTotalEl.textContent = String(sparkTotal);

  const justUnlocked = academyNextReward(sparkTotal - sparksEarned);
  const unlockedNow = justUnlocked && sparkTotal >= justUnlocked.threshold ? justUnlocked : null;

  const levelIndex = ACADEMY_LEVELS.findIndex((l) => l.id === level.id);
  const nextLevel = ACADEMY_LEVELS[levelIndex + 1];

  stageEl.innerHTML = `
    <div class="complete-card">
      <p class="complete-title">Nicely practiced!</p>
      <div class="complete-stars">
        ${[1, 2, 3].map((n) => `<span class="star ${n <= stars ? 'earned' : ''}">⭐</span>`).join('')}
      </div>
      <div class="complete-sparks"><span aria-hidden="true">✨</span> +${sparksEarned} Sparks</div>
      ${unlockedNow ? `
        <div class="complete-unlock">
          <span class="unlock-icon">${unlockedNow.icon}</span>
          <span class="unlock-label">New in Sprocket's Closet: ${unlockedNow.name}!</span>
        </div>
      ` : ''}
      <div class="complete-nav">
        <a href="academy.html" class="pill-btn quiet">Back to map</a>
        ${nextLevel ? `<a href="academy-level.html?level=${nextLevel.id}" class="pill-btn help">Next: ${nextLevel.name} ${nextLevel.emoji}</a>` : ''}
      </div>
    </div>
  `;
}

goPhase('teach');
