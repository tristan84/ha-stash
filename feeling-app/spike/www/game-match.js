// Bubble Pop: bubbles continuously float up the play field; tap the
// ones matching the called-out target feeling. Target rotates every 3
// correct catches. No penalty for a miss or an untapped bubble
// (Principle 2) — this counts practice, not performance.

const FEELINGS = [
  { name: 'Worried', emoji: '😟' },
  { name: 'Frustrated', emoji: '😤' },
  { name: 'Excited', emoji: '🤩' },
];

const stage = document.getElementById('catch-stage');
const targetEmoji = document.getElementById('target-emoji');
const targetWord = document.getElementById('target-word');
const tallyEl = document.getElementById('tally');
const popFeedback = document.getElementById('pop-feedback');
const playView = document.getElementById('play-view');
const doneView = document.getElementById('done-view');
const doneSummary = document.getElementById('done-summary');
const goalJar = document.getElementById('goal-jar');
const jarFill = document.getElementById('jar-fill');
const jarCount = document.getElementById('jar-count');
const jarSprocket = document.getElementById('jar-sprocket');

let target = FEELINGS[Math.floor(Math.random() * FEELINGS.length)];
let caughtSinceRotate = 0;
let totalCaught = 0;
let jarProgress = 0;
let jarsFilled = 0;
const JAR_GOAL = 8;
let spawnTimer = null;
let running = true;

function setTarget(feeling) {
  target = feeling;
  targetEmoji.textContent = feeling.emoji;
  targetWord.textContent = feeling.name.toUpperCase();
}
setTarget(target);

function showFeedback(text) {
  popFeedback.textContent = text;
  popFeedback.classList.add('show');
  window.clearTimeout(showFeedback._t);
  showFeedback._t = window.setTimeout(() => popFeedback.classList.remove('show'), 900);
}

function pickBubbleFeeling() {
  // Weighted so the target shows up often enough to be catchable, but
  // the other two still appear (something to correctly *not* prioritize).
  if (Math.random() < 0.5) return target;
  const others = FEELINGS.filter((f) => f.name !== target.name);
  return others[Math.floor(Math.random() * others.length)];
}

function spawnBubble() {
  if (!running) return;
  const stageWidth = stage.clientWidth || 300;
  const feeling = pickBubbleFeeling();
  const size = 66 + Math.random() * 22;
  const left = Math.random() * Math.max(0, stageWidth - size);
  const rise = -(stage.clientHeight + 120);
  const duration = 4.2 + Math.random() * 1.8;

  const el = document.createElement('button');
  el.className = `catch-bubble feeling-${feeling.name}`;
  el.style.left = `${left}px`;
  el.style.width = el.style.height = `${size}px`;
  el.style.setProperty('--rise', `${rise}px`);
  el.style.animationDuration = `${duration}s`;
  // Face only, no text label — the point is spotting the feeling from
  // its expression, the same way it shows up for real. Printing the
  // word on the bubble would turn this into word-matching instead.
  el.innerHTML = `<span class="bubble-emoji">${feeling.emoji}</span>`;
  el.setAttribute('aria-label', feeling.name);
  el.dataset.feeling = feeling.name;

  el.addEventListener('animationend', () => el.remove());
  el.addEventListener('pointerdown', () => pop(el, feeling));

  stage.appendChild(el);
  spawnTimer = window.setTimeout(spawnBubble, 850 + Math.random() * 550);
}

function pop(el, feeling) {
  if (el.classList.contains('popped')) return;
  el.classList.add('popped');
  window.setTimeout(() => el.remove(), 260);

  if (feeling.name === target.name) {
    totalCaught += 1;
    caughtSinceRotate += 1;
    tallyEl.textContent = totalCaught;
    showFeedback(`Yes! That face is ${feeling.name.toLowerCase()}.`);
    growJar();
    if (caughtSinceRotate >= 3) {
      caughtSinceRotate = 0;
      const others = FEELINGS.filter((f) => f.name !== target.name);
      setTarget(others[Math.floor(Math.random() * others.length)]);
      window.setTimeout(() => showFeedback(`New target: ${target.name.toLowerCase()}!`), 950);
    }
  } else {
    showFeedback(`That one's ${feeling.name.toLowerCase()} — keep looking for ${target.name.toLowerCase()}.`);
  }
}

function growJar() {
  jarSprocket.classList.add('cheer');
  window.setTimeout(() => jarSprocket.classList.remove('cheer'), 260);

  jarProgress += 1;
  if (jarProgress >= JAR_GOAL) {
    jarFill.style.height = '100%';
    jarCount.textContent = String(JAR_GOAL);
    goalJar.classList.add('full');
    jarsFilled += 1;
    window.setTimeout(() => showFeedback('Jar full! Nicely caught.'), 300);
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

document.getElementById('hear-target').addEventListener('click', () => {
  sprocketTTS.speak(`Catch a ${target.name.toLowerCase()} bubble!`);
});

function endSession() {
  running = false;
  window.clearTimeout(spawnTimer);
  stage.querySelectorAll('.catch-bubble').forEach((b) => b.remove());
  const total = Number(localStorage.getItem('sprocket-match-rounds') || 0) + totalCaught;
  localStorage.setItem('sprocket-match-rounds', String(total));
  if (totalCaught === 0) {
    doneSummary.textContent = "That's okay — want to try again?";
  } else {
    const jarNote = jarsFilled > 0 ? ` You filled the jar ${jarsFilled} time${jarsFilled === 1 ? '' : 's'}!` : '';
    doneSummary.textContent = `You caught ${totalCaught} feeling bubble${totalCaught === 1 ? '' : 's'} this time.${jarNote}`;
  }
  playView.style.display = 'none';
  doneView.style.display = 'flex';
}

document.getElementById('btn-done').addEventListener('click', endSession);

document.getElementById('btn-again').addEventListener('click', () => {
  totalCaught = 0;
  caughtSinceRotate = 0;
  jarProgress = 0;
  jarsFilled = 0;
  tallyEl.textContent = '0';
  jarFill.style.height = '0%';
  jarCount.textContent = '0';
  goalJar.classList.remove('full');
  setTarget(FEELINGS[Math.floor(Math.random() * FEELINGS.length)]);
  running = true;
  doneView.style.display = 'none';
  playView.style.display = 'flex';
  spawnBubble();
});

spawnBubble();
