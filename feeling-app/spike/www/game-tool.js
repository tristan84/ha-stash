// Tool Match: a feeling is shown; drag the matching tool from the tray
// onto Sprocket. Same feeling-to-tool pairings the ten story books use
// (PLAN.md §4.5), so this is direct practice for "try a tool," not a
// separate invented mapping. A wrong drop (or a drop that misses
// Sprocket entirely) just springs the tile back to the tray — no
// penalty, no fail state (Principle 2).

const PAIRS = [
  { name: 'Worried', emoji: '😟', tool: { icon: '🌬️', label: 'Breathe' } },
  { name: 'Frustrated', emoji: '😤', tool: { icon: '✋', label: 'Shake' } },
  { name: 'Excited', emoji: '🤩', tool: { icon: '💃', label: 'Wiggle' } },
  { name: 'Sad', emoji: '😢', tool: { icon: '🫂', label: 'Hug' } },
  { name: 'Angry', emoji: '😠', tool: { icon: '🦶', label: 'Stomp' } },
  { name: 'Proud', emoji: '🥳', tool: { icon: '🙌', label: 'Pose' } },
];

const targetEmoji = document.getElementById('target-emoji');
const targetWord = document.getElementById('target-word');
const tray = document.getElementById('tool-tray');
const dropZone = document.getElementById('drop-zone');
const stageSprocket = document.getElementById('stage-sprocket');
const reactionBurst = document.getElementById('reaction-burst');
const toolFeedback = document.getElementById('tool-feedback');
const tallyEl = document.getElementById('tally');
const playView = document.getElementById('play-view');
const doneView = document.getElementById('done-view');
const doneSummary = document.getElementById('done-summary');
const goalJar = document.getElementById('goal-jar');
const jarFill = document.getElementById('jar-fill');
const jarCount = document.getElementById('jar-count');

const JAR_GOAL = 8;

let target = null;
let totalMatched = 0;
let jarProgress = 0;
let jarsFilled = 0;
let roundLocked = false;
let feedbackTimer = null;

function setTarget(pair) {
  target = pair;
  targetEmoji.textContent = pair.emoji;
  targetWord.textContent = pair.name.toUpperCase();
}

function showFeedback(text) {
  toolFeedback.textContent = text;
  toolFeedback.classList.add('show');
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => toolFeedback.classList.remove('show'), 900);
}

function buildTray() {
  tray.innerHTML = '';
  const others = PAIRS.filter((p) => p.name !== target.name);
  const wrongs = others.sort(() => Math.random() - 0.5).slice(0, 3);
  const tiles = [target, ...wrongs].sort(() => Math.random() - 0.5);

  tiles.forEach((pair) => {
    const tile = document.createElement('div');
    tile.className = 'tool-tile';
    tile.dataset.name = pair.name;
    tile.innerHTML = `<span class="tool-tile-emoji">${pair.tool.icon}</span><span class="tool-tile-label">${pair.tool.label}</span>`;
    tray.appendChild(tile);
    wireTileDrag(tile, pair);
  });
}

function wireTileDrag(tile, pair) {
  let startX = 0;
  let startY = 0;
  let dragging = false;

  function onPointerDown(e) {
    if (roundLocked) return;
    e.preventDefault();
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    tile.classList.remove('returning');
    tile.classList.add('dragging');
    tile.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    tile.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    tile.classList.remove('dragging');
    try { tile.releasePointerCapture(e.pointerId); } catch { /* already released */ }

    const tileRect = tile.getBoundingClientRect();
    const tileCenterX = tileRect.left + tileRect.width / 2;
    const tileCenterY = tileRect.top + tileRect.height / 2;
    const zoneRect = dropZone.getBoundingClientRect();
    const zoneCenterX = zoneRect.left + zoneRect.width / 2;
    const zoneCenterY = zoneRect.top + zoneRect.height / 2;
    const dist = Math.hypot(tileCenterX - zoneCenterX, tileCenterY - zoneCenterY);
    const overZone = dist <= zoneRect.width / 2 + 10;

    if (overZone && pair.name === target.name) {
      matchCorrect(tile, pair);
    } else {
      if (overZone) showFeedback('Try a different tool!');
      tile.classList.add('returning');
      tile.style.transform = 'translate(0, 0)';
      window.setTimeout(() => tile.classList.remove('returning'), 420);
    }
  }

  tile.addEventListener('pointerdown', onPointerDown);
  tile.addEventListener('pointermove', onPointerMove);
  tile.addEventListener('pointerup', onPointerUp);
  tile.addEventListener('pointercancel', onPointerUp);
}

function spawnReactionIcon(icon) {
  const el = document.createElement('span');
  el.className = 'reaction-icon';
  el.textContent = icon;
  reactionBurst.appendChild(el);
  window.setTimeout(() => el.remove(), 950);
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

function matchCorrect(tile, pair) {
  roundLocked = true;
  totalMatched += 1;
  tallyEl.textContent = String(totalMatched);
  growJar();

  tile.classList.add('matched');
  stageSprocket.classList.remove('activated');
  void stageSprocket.offsetWidth;
  stageSprocket.classList.add('activated');
  spawnReactionIcon(pair.tool.icon);
  showFeedback(`Yes! ${pair.tool.label} helps with ${pair.name.toLowerCase()}.`);

  window.setTimeout(() => {
    startRound();
    roundLocked = false;
  }, 950);
}

function startRound() {
  const pick = PAIRS[Math.floor(Math.random() * PAIRS.length)];
  setTarget(pick);
  buildTray();
}

document.getElementById('hear-target').addEventListener('click', () => {
  sprocketTTS.speak(`Sprocket feels ${target.name.toLowerCase()}.`);
});

document.getElementById('btn-done').addEventListener('click', () => {
  const total = Number(localStorage.getItem('sprocket-tool-rounds') || 0) + totalMatched;
  localStorage.setItem('sprocket-tool-rounds', String(total));
  if (totalMatched === 0) {
    doneSummary.textContent = "That's okay — want to try again?";
  } else {
    const jarNote = jarsFilled > 0 ? ` You filled the jar ${jarsFilled} time${jarsFilled === 1 ? '' : 's'}!` : '';
    doneSummary.textContent = `You matched ${totalMatched} tool${totalMatched === 1 ? '' : 's'} this time.${jarNote}`;
  }
  playView.style.display = 'none';
  doneView.style.display = 'flex';
});

document.getElementById('btn-again').addEventListener('click', () => {
  totalMatched = 0;
  jarProgress = 0;
  jarsFilled = 0;
  tallyEl.textContent = '0';
  jarFill.style.height = '0%';
  jarCount.textContent = '0';
  goalJar.classList.remove('full');
  doneView.style.display = 'none';
  playView.style.display = 'flex';
  startRound();
});

startRound();
