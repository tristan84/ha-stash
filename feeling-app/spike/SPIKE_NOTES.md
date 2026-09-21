# Phase 1 Spike Results — Capacitor on Android

Status: **partial validation, real device test still needed**. This spike
was built and run in a cloud sandbox with no Android SDK/emulator
available — it validates everything reachable without real Android
hardware, and documents exactly what's left for Open Decision #5
(PLAN.md §9) to actually close.

Scope, per `research/05-capacitor-vs-native-spike-plan.md`: test the three
things the Capacitor decision hinges on — concurrent-animation
performance, a TTS output path, offline behavior — plus confirm the
Capacitor→Android project scaffolding itself works cleanly.

**2026-09-21 update**: the first version of this spike was a bare
functional test harness (dark background, an unstyled colored square for
Sprocket, an always-visible FPS/log console) — it proved the technical
points above but looked nothing like the actual product and got
reasonable pushback for that. It's since been given an actual visual
pass: a sky/grass scene, a real Sprocket character design (rounded body,
face, blush, glowing antenna, idle squash-and-stretch + blink + antenna
wiggle), a self-hosted rounded kid-friendly font (Baloo 2, SIL Open Font
License — free for commercial use, self-hosted under `www/fonts/` so it
stays offline like everything else), pastel floating-balloon bubbles
instead of plain green circles, and real button copy/icons. The
FPS/net/TTS/log readouts still exist (still needed for the actual spike
purpose) but are now tucked behind a small toggle in the corner instead
of being the first thing on screen. All FPS numbers above were re-verified
after this pass and are unchanged (still a flat ~60fps up to 100
concurrent animated nodes) — the extra visual polish (gradients, box
shadows, radial-gradient bubbles) didn't cost anything measurable.
This is still not final art direction — see PLAN.md Open Decision #1
(Sprocket's actual visual design is explicitly still open) — it's meant
to look and feel like a real screen from the app, not final character art.

**2026-09-21 update 2**: first pass was a floating head only, called out
as looking incomplete. Sprocket now has a full body — head, arms, torso
with a belly patch, and two legs/feet — standing on the grass instead of
floating mid-screen, still all transform/opacity animation (a whole-figure
hop with a bottom-anchored transform-origin, plus independent arm-swing,
antenna-wiggle, and blink animations). Re-verified: still a flat ~60fps
up to 100 concurrent bubbles with the extra body parts.

**2026-09-21 update 3**: called "too cold" — the whole scene (not just
Sprocket) moved from a cool blue palette to a warm one: golden-hour
cream-to-peach sky, sunnier yellow-green grass, warm-white clouds,
Sprocket recolored from blue to a warm orange with a cream belly and
warm coral cheeks, buttons recolored to match. Also improved the
character itself per feedback ("do better with the robot"): bigger head
relative to body for a cuter proportion, a soft glossy highlight on the
head/body for dimensionality instead of flat shading, small round hands
at the arm tips, a two-tone foot cap on each leg, and a friendlier
(more open) arm resting angle. Re-verified: still a flat ~60fps up to
100 concurrent bubbles.

**2026-09-21 update 4**: asked for a "full redesign of the robot" — the
previous version was a rounded blob head/body with eyes floating
directly on the body color, which read more like a generic mascot than
a robot. Rebuilt the character around a lit visor "screen" that carries
the whole face (glowing dot eyes + a glowing smile on a dark
screen-like panel) instead of eyes sitting on the shell — this is the
single change that does the most to make it read as a robot rather
than a soft toy. Added around it: ear pods for a distinct silhouette, a
neck collar joint between head and body, shoulder and knee joints where
the limbs attach, and a glowing chest core that echoes the antenna's
light (so the two lit details feel like one coherent "power" motif
instead of an unrelated belly patch). Still fully transform/opacity for
motion — re-verified flat ~61fps up to 100 concurrent bubbles, TTS
fallback still triggers correctly.

**2026-09-21 update 5**: asked to reconsider the buttons against the
actual planned functions (PLAN.md), since "Play a wiggle game" /
"Sprocket says hi" / "Tidy up" were literally just spike-test triggers,
not real app functions. Reworked to two buttons that map to real
planned features: **Help me** (§4.3 — the one-tap, low-friction entry
point for hard moments; made visually primary with a distinct
coral-red color and more flex weight, not just another same-colored
option) and **Play a game** (§4.2 — calm-moment games). Added a small
tucked-away **parent gate** icon (§5 — parent side; deliberately not a
big obvious button, since kids shouldn't be one tap from it) and made
Sprocket itself tappable to hear it speak, rather than spending button
real estate on a dedicated "make Sprocket talk" button. "Tidy up"
wasn't a real function at all — moved into the dev panel as "Clear
bubbles", a debug-only utility.

None of these are real flows yet — Help me still just triggers a TTS
line and a log entry, Play still just runs the bubble stress test,
and the parent gate has no actual gate logic. That's intentional:
building the real flows is Phase 2 content design, not this spike;
this pass only makes sure the *screen* reflects the app's real
function set instead of leftover test buttons. Re-verified: flat
~60-61fps through the button rework, offline/service-worker still
active, all three new interactions (Sprocket tap, Help me, parent
gate) log correctly.

## What was built

`feeling-app/spike/` — a throwaway Capacitor project (not product code):
- `www/` — a single test screen: an idle-animated "Sprocket" placeholder
  (continuous transform/opacity CSS animation, the always-on companion
  motion a real screen would have), a button that spawns batches of
  independently-animated "tap bubble" nodes to load up concurrent
  animation count, a live FPS counter, a TTS test button, and online/offline
  + service-worker status readouts.
- `sw.js` + `manifest.webmanifest` — cache-first offline support for the
  spike's own assets.
- `android/` — the real Capacitor-generated native Android Studio project
  (via `npx cap add android`), with the `@capacitor-community/text-to-speech`
  plugin already auto-detected and wired in.

## Results

### 1. Concurrent-animation performance — ✅ positive signal, not final proof
Tested headless in Chromium (Playwright, using the same pre-installed
browser binary this sandbox has, launched against the spike's local static
server) — Chromium/Blink is the same rendering engine Android's WebView
uses, which makes this a meaningfully closer proxy than a generic "does it
run" check, though it is **not** the same as real WebView-on-a-tablet.

| Concurrently animating nodes | FPS |
|---|---|
| 1 (idle Sprocket only) | 61 |
| 10 | 60 |
| 30 | 60 |
| 60 | 60 |
| 100 | 61 |

Flat 60fps up to 100 concurrent animated nodes, no dip. This held because
every animation here uses only `transform` and `opacity` (with
`will-change: transform`) — the two properties a browser compositor can
animate on the GPU without triggering layout/paint. This is the specific
technique research note 05's "reported laggy" cases were almost certainly
**not** using (janky WebView reports typically come from animating
layout-triggering properties like `top`/`left`/`width`, or from
JS-driven per-frame style writes) — **the recommendation coming out of
this spike is: build all of Sprocket's UI/game animation exclusively on
transform/opacity, and treat that as a hard rule for Phase 2, not a
nice-to-have.**

**What this does not prove**: real performance on a lower-end/older
Android tablet, which is exactly what note 05 flagged as the scenario
that actually breaks in the field reports it found. Desktop headless
Chromium has no representative CPU/GPU throttling and isn't running
inside an actual WebView-hosting Android process. This number is a
genuine positive signal for the animation *approach*, not a device
performance guarantee.

### 2. TTS output path — ✅ scaffolding confirmed, native path unvalidated
`npx cap add android` auto-detected `@capacitor-community/text-to-speech`
from `package.json` and wired it into the generated Android project
without any manual step — confirms research note 05's finding that this
plugin integrates cleanly. The spike's code calls the native plugin via
`window.Capacitor.Plugins.TextToSpeech` when running natively, with a
Web Speech API fallback for browser preview (used in this sandbox, since
there's no native runtime to test against). **The actual native TTS call
has not been exercised** — that needs a real Android build.

### 3. Offline behavior — ✅ fully validated (for what this sandbox can test)
Service worker registered and reached `active` state; a full page reload
with the browser context's network forced offline still loaded
correctly (title, content, all assets served from cache). This validates
the offline-first approach itself, independent of the
Capacitor-vs-native question.

### 4. Capacitor→Android project scaffolding — ✅ clean
`npx cap add android` completed without errors or warnings beyond a
benign `flatDir` notice, and produced a normal, Android-Studio-importable
Gradle project. `./gradlew tasks` (which only needs the Android Gradle
Plugin, not the SDK) ran successfully.

### 5. Native APK build — ❌ blocked, cleanly
`./gradlew assembleDebug` failed with an unambiguous, expected error:
`SDK location not found` — this sandbox has Node, Java 21, and Gradle,
but no Android SDK/platform-tools/emulator. Installing a full Android SDK
here would be a multi-gigabyte download against this session's fixed
disk allowance, and — critically — **still wouldn't produce the real
answer**, since note 05's actual requirement is testing on a lower-end
*physical* tablet, which this cloud sandbox can't provide regardless of
SDK installation. Deliberately not attempted here rather than spending
that budget on a partial, non-representative result.

## What's still needed to close Open Decision #5

This spike de-risks the animation *technique* and confirms the TTS
plugin and project scaffolding are sound, but the actual go/no-go still
needs, on a real (ideally lower-end/older) Android tablet:
1. Open `feeling-app/spike/android` in Android Studio, build and install
   the debug APK.
2. Repeat the same bubble-spawn stress test and watch for real dropped
   frames (Android Studio's Profiler or `adb shell dumpsys gfxinfo` give
   real jank/frame-time numbers, not just a JS-side FPS counter).
3. Confirm `TextToSpeech.speak()` actually produces audio through the
   native plugin.
4. Confirm the app launches and functions with the device in airplane
   mode.

If frame timing on real lower-end hardware holds up the way the
transform/opacity-only technique suggests it should, that's the go signal
for Open Decision #5. This is a task for whoever has access to physical
Android hardware or an Android Studio emulator — flagging it back to you
rather than guessing at a result I can't actually produce here.

## Files
- `www/index.html`, `www/style.css`, `www/app.js` — the test screen
- `www/sw.js`, `www/manifest.webmanifest` — offline support
- `android/` — generated native project (build artifacts gitignored)
- `capacitor.config.json`, `package.json` — project config
