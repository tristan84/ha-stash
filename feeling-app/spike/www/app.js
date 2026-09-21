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
let bubbleId = 0;
function spawnBubbles(n) {
  const stage = document.getElementById('bubbles');
  for (let i = 0; i < n; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    b.textContent = String(++bubbleId);
    const left = Math.random() * 85;
    const size = 40 + Math.random() * 40;
    const duration = 2.5 + Math.random() * 2.5;
    b.style.left = `${left}%`;
    b.style.bottom = '0px';
    b.style.width = b.style.height = `${size}px`;
    b.style.animationDuration = `${duration}s`;
    b.addEventListener('animationend', () => b.remove());
    stage.appendChild(b);
  }
  log(`spawned ${n} bubbles (stage now has ${stage.childElementCount} animating nodes)`);
}

document.getElementById('btn-spawn').addEventListener('click', () => spawnBubbles(10));
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

document.getElementById('btn-speak').addEventListener('click', () => {
  sprocketSpeak("Hi, I'm Sprocket. I noticed my hands feel a little shaky today.");
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

log('spike loaded — tap "Spawn" repeatedly while watching fps, then try TTS');
