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

// "Play" stands in for entering a calm-moment game (PLAN.md §4.2) —
// the actual game content/design is a Phase 2 task, not this spike.
// Reuses the bubble-spawn stress test as the placeholder interaction
// since it's already exercising the real animation-performance
// question this spike exists to answer.
document.getElementById('btn-play').addEventListener('click', () => spawnBubbles(10));

// Dev-only utility, not a real app function — resets the stress test.
document.getElementById('btn-clear').addEventListener('click', () => {
  document.getElementById('bubbles').innerHTML = '';
  log('cleared bubbles');
});

// --- TTS test -------------------------------------------------------
// Native path uses the capacitor-community/text-to-speech plugin,
// which Capacitor auto-registers on window.Capacitor.Plugins at
// runtime inside a native build — no bundler needed for this spike.
// Browser path falls back to the Web Speech API purely for local
// preview; it does NOT validate the native Android TTS path (this
// sandbox has no Android SDK to build/run that against — see
// SPIKE_NOTES.md).
function sprocketSpeak(text) {
  const status = document.getElementById('ttsstatus');
  const isNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  if (isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) {
    status.textContent = 'tts: speaking (native plugin)';
    log('tts: native path — Capacitor TextToSpeech plugin');
    window.Capacitor.Plugins.TextToSpeech.speak({ text, rate: 1.0, pitch: 1.0 })
      .then(() => { status.textContent = 'tts: idle'; })
      .catch((err) => { status.textContent = 'tts: error'; log(`tts error: ${err}`); });
  } else if ('speechSynthesis' in window) {
    status.textContent = 'tts: speaking (browser fallback)';
    log('tts: browser fallback path (Web Speech API) — native path unvalidated in this sandbox');
    const u = new SpeechSynthesisUtterance(text);
    u.onend = () => { status.textContent = 'tts: idle'; };
    speechSynthesis.speak(u);
  } else {
    status.textContent = 'tts: unavailable';
    log('tts: no TTS API available in this context');
  }
}

// Tapping Sprocket itself is the greeting interaction — a dedicated
// "make Sprocket talk" button isn't a real planned function, so this
// exercises the same TTS path more naturally (tap the character to
// hear it) than a standalone button would.
function greet() {
  sprocketSpeak("Hi, I'm Sprocket. I noticed my hands feel a little shaky today.");
}
const sprocketEl = document.getElementById('sprocket');
sprocketEl.addEventListener('click', greet);
sprocketEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); greet(); }
});

// "Help me" (PLAN.md §4.3): the one-tap, low-friction entry point for
// hard moments — deliberately the visually primary button, not an
// equal third option. This spike only validates that the button
// exists, is prominent, and can trigger TTS; the actual Help Me
// flow (breathing/grounding tools already practiced in calm moments)
// is explicitly Phase 2 content design, not built here.
document.getElementById('btn-help').addEventListener('click', () => {
  log('Help me tapped — placeholder only; real flow is Phase 2 content design');
  sprocketSpeak("It's okay. Let's take a slow breath together.");
});

// Parent gate (PLAN.md §5): tucked away, not a main button, since
// kids shouldn't be one tap from parent settings. No real gate logic
// yet — that's a Phase 2/3 task — this just marks where it lives.
document.getElementById('parent-gate').addEventListener('click', () => {
  log('parent gate tapped — placeholder only; no gate/settings built yet');
});

// --- Offline behavior test ------------------------------------------
function updateNetStatus() {
  const el = document.getElementById('netstatus');
  el.textContent = `net: ${navigator.onLine ? 'online' : 'offline'}`;
}
window.addEventListener('online', () => { updateNetStatus(); log('network: online'); });
window.addEventListener('offline', () => { updateNetStatus(); log('network: offline'); });
updateNetStatus();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then((reg) => log(`service worker registered (scope ${reg.scope})`))
    .catch((err) => log(`service worker registration failed: ${err}`));
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

log('spike loaded — tap Sprocket to hear it speak, or "Play a game" to stress-test animation');
