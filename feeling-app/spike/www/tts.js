// Shared TTS helper — used by app.js (home screen) and story.js (the
// book reader's "read aloud" toggle). Extracted so both entry points
// share one implementation instead of duplicating the native/fallback
// branching.
//
// Native path uses the capacitor-community/text-to-speech plugin,
// which Capacitor auto-registers on window.Capacitor.Plugins at
// runtime inside a native build — no bundler needed for this spike.
// Browser path falls back to the Web Speech API purely for local
// preview; it does NOT validate the native Android TTS path (this
// sandbox has no Android SDK to build/run that against — see
// SPIKE_NOTES.md).
window.sprocketTTS = (function () {
  function isNative() {
    return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  }

  function speak(text, { onStatus, onEnd } = {}) {
    const report = (s) => { if (onStatus) onStatus(s); };
    if (isNative() && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) {
      report('speaking (native plugin)');
      window.Capacitor.Plugins.TextToSpeech.speak({ text, rate: 1.0, pitch: 1.0 })
        .then(() => { report('idle'); if (onEnd) onEnd(); })
        .catch((err) => { report('error'); console.error('tts error', err); });
    } else if ('speechSynthesis' in window) {
      report('speaking (browser fallback)');
      const u = new SpeechSynthesisUtterance(text);
      u.onend = () => { report('idle'); if (onEnd) onEnd(); };
      speechSynthesis.speak(u);
    } else {
      report('unavailable');
    }
  }

  function stop() {
    if (isNative() && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech) {
      window.Capacitor.Plugins.TextToSpeech.stop();
    } else if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  return { speak, stop, isNative };
})();
