// Phase 1 throwaway spike. Exercises the three things research/05
// flagged the Capacitor decision hinges on: (1) concurrent-animation
// performance in the WebView, (2) a TTS output path, (3) offline
// behavior. Not product code — see PLAN.md Phase 1 / Open Decision #5.

const log = (msg) => {
  const el = document.getElementById('log');
  const line = document.createElement('div');
  line.textContent = `[${new Date().toISOString().slice(11, 19)}] ${msg}`;
  el.prepend(line);
  while (el.childElementCount > 40) el.lastChild.remove();
};

// --- FPS counter --------------------------------------------------
// Rolling 1s frame count via requestAnimationFrame, so the animation
// test below produces an actual number, not just a vibe. This is the
// concrete metric research note 05 flagged as missing from every
// secondhand qualitative report it found.
let frames = 0;
let lastSecond = performance.now();
function fpsTick(now) {
  frames++;
  if (now - lastSecond >= 1000) {
    document.getElementById('fps').textContent = `fps: ${frames}`;
    frames = 0;
    lastSecond = now;
  }
  requestAnimationFrame(fpsTick);
}
requestAnimationFrame(fpsTick);

// --- Concurrent-animation stress test ------------------------------
// Spawns independently CSS-animated "bubble" nodes to load up the
// number of concurrently-animating elements — this is the scenario
// most likely to expose WebView jank per the reports in note 05.
const BUBBLE_COLORS = ['#ffcf9c', '#ffb199', '#ffe08a', '#ffb8c6', '#e3b8d9'];
function spawnBubbles(n) {
  const stage = document.getElementById('bubbles');
  for (let i = 0; i < n; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const left = Math.random() * 85;
    const size = 40 + Math.random() * 40;
    const duration = 2.5 + Math.random() * 2.5;
    b.style.left = `${left}%`;
    b.style.bottom = '0px';
    b.style.width = b.style.height = `${size}px`;
    b.style.animationDuration = `${duration}s`;
    b.style.setProperty('--bcolor', BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]);
    b.addEventListener('animationend', () => b.remove());
    stage.appendChild(b);
  }
  log(`spawned ${n} bubbles (stage now has ${stage.childElementCount} animating nodes)`);
}

// The bubble-spawn stress test moved to the dev panel — it was never
// a real function, just the animation-performance probe research
// note 05 asked for. "Play a game" now goes to the real games shelf.
document.getElementById('btn-spawn-dev').addEventListener('click', () => spawnBubbles(10));
document.getElementById('btn-clear').addEventListener('click', () => {
  document.getElementById('bubbles').innerHTML = '';
  log('cleared bubbles');
});

// --- TTS test -------------------------------------------------------
// Thin wrapper around the shared window.sprocketTTS (tts.js) that
// also updates this screen's status readout and log — story.js uses
// the same shared module directly for the book's read-aloud toggle.
function sprocketSpeak(text) {
  const status = document.getElementById('ttsstatus');
  sprocketTTS.speak(text, {
    onStatus: (s) => {
      status.textContent = `tts: ${s}`;
      if (s.startsWith('speaking')) log(`tts: ${s}`);
    },
  });
}

// Tapping Sprocket is the greeting interaction — a dedicated
// "make Sprocket talk" button isn't a real planned function, so this
// exercises the same TTS path more naturally (tap the character to
// hear it) than a standalone button would. Each tap now also plays a
// random silly reaction animation, a burst of particles, and a speech
// bubble showing the line as well as speaking it — "make Sprocket do
// things when clicked" was previously just a static tap-to-speak with
// no visible reaction at all.
const GREETINGS = [
  "Hi, I'm Sprocket. I noticed my hands feel a little shaky today.",
  "Hello! Tap me again — I love saying hi.",
  "I'm doing okay today. How about you?",
  "Ready when you are — tap Help Me if you need me.",
  "Wheee! That tickles.",
  "You found me! I'm always here.",
];
let lastGreeting = -1;
function nextGreeting() {
  let i = Math.floor(Math.random() * GREETINGS.length);
  if (GREETINGS.length > 1 && i === lastGreeting) i = (i + 1) % GREETINGS.length;
  lastGreeting = i;
  return GREETINGS[i];
}

const REACTIONS = ['react-bounce', 'react-spin', 'react-wiggle'];
let lastReaction = -1;
const sprocketEl = document.getElementById('sprocket');
function playReaction() {
  let i = Math.floor(Math.random() * REACTIONS.length);
  if (i === lastReaction) i = (i + 1) % REACTIONS.length;
  lastReaction = i;
  const cls = REACTIONS[i];
  sprocketEl.classList.remove(...REACTIONS);
  void sprocketEl.offsetWidth;
  sprocketEl.classList.add(cls);
  window.setTimeout(() => sprocketEl.classList.remove(cls), 1100);
}

const PARTICLE_EMOJI = ['✨', '💚', '⭐', '💫'];
function spawnReactionParticles() {
  const stage = document.getElementById('bubbles');
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('span');
    p.className = 'reaction-particle';
    p.textContent = PARTICLE_EMOJI[Math.floor(Math.random() * PARTICLE_EMOJI.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 50;
    p.style.left = '50%';
    p.style.bottom = '210px';
    p.style.setProperty('--px', `${Math.cos(angle) * dist}px`);
    p.style.setProperty('--py', `${-Math.abs(Math.sin(angle) * dist) - 20}px`);
    p.style.animationDelay = `${i * 30}ms`;
    p.addEventListener('animationend', () => p.remove());
    stage.appendChild(p);
  }
}

let speechTimer = null;
function showSpeech(text) {
  const bubble = document.getElementById('sprocket-speech');
  window.clearTimeout(speechTimer);
  bubble.textContent = text;
  bubble.classList.add('show');
  speechTimer = window.setTimeout(() => bubble.classList.remove('show'), 4200);
}

function greet() {
  const line = nextGreeting();
  playReaction();
  spawnReactionParticles();
  showSpeech(line);
  sprocketSpeak(line);
}
sprocketEl.addEventListener('click', greet);
sprocketEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); greet(); }
});

// Show whichever Feelings Academy cosmetic is currently equipped
// (Sprocket's Closet, academy-shop.js) on the home-screen character —
// the actual payoff moment for earning it, not just inside the Academy.
(function renderHomeCosmetic() {
  const cosmeticEl = document.getElementById('home-cosmetic');
  if (!cosmeticEl || typeof academyGetSparks !== 'function') return;
  const equipped = localStorage.getItem(ACADEMY_EQUIPPED_KEY);
  if (!equipped) return;
  const unlocked = academyUnlockedRewards(academyGetSparks());
  const reward = unlocked.find((r) => r.id === equipped);
  if (!reward) return;
  academyInjectIcons();
  cosmeticEl.innerHTML = `<svg viewBox="0 0 120 150"><use href="#cosmetic-${reward.id}"></use></svg>`;
  cosmeticEl.classList.add('show', `cosmetic-${reward.id}`);
})();

// Every home-screen button now leads to a real, working screen.
document.getElementById('btn-help').addEventListener('click', () => { window.location.href = 'help.html'; });
document.getElementById('btn-play').addEventListener('click', () => { window.location.href = 'games.html'; });
document.getElementById('btn-story').addEventListener('click', () => { window.location.href = 'stories.html'; });
document.getElementById('btn-diary').addEventListener('click', () => { window.location.href = 'diary.html'; });
document.getElementById('parent-gate').addEventListener('click', () => { window.location.href = 'parent-gate.html'; });

// --- Offline behavior test ------------------------------------------
function updateNetStatus() {
  const el = document.getElementById('netstatus');
  el.textContent = `net: ${navigator.onLine ? 'online' : 'offline'}`;
}
window.addEventListener('online', () => { updateNetStatus(); log('network: online'); });
window.addEventListener('offline', () => { updateNetStatus(); log('network: offline'); });
updateNetStatus();

// Registration itself happens in sw-register.js (shared by every
// page); this just reports status into the dev log.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((reg) => log(`service worker active (scope ${reg.scope})`));
} else {
  log('service worker API unavailable in this context');
}

// --- Dev panel toggle -------------------------------------------
// Kept out of the kid-facing screen entirely by default; this spike
// still needs the readouts for the actual performance test.
const devPanel = document.getElementById('dev-panel');
document.getElementById('dev-toggle').addEventListener('click', () => {
  devPanel.hidden = !devPanel.hidden;
});

log('spike loaded — every home button now leads to a real screen');
