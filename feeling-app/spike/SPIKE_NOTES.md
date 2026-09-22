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

**2026-09-21 update 6**: asked about story books and a feeling diary —
neither was in PLAN.md yet, so added them properly as §4.5 (Story
books) and §4.6 (Feeling diary), plus two new open decisions (#14
diary parent-visibility, #15 story content sourcing) rather than
silently assuming an answer. Reflected on the spike screen too:
restructured the button area into two rows — Help me alone on its own
full-width row (so it doesn't compete for visual weight with anything,
consistent with it being the safety-relevant one-tap function), and a
second row with three equal buttons for the three calm-moment content
types (Play a game, Story time, My diary). Story time exercises TTS
with a story-shaped line; My diary is a placeholder log entry only —
per §4.6, whether it's ever parent-visible is still an open decision,
so nothing about visibility/sync was assumed while wiring the
placeholder. Re-verified: flat ~60-61fps, offline/service-worker still
active, both new buttons log correctly.

**2026-09-21 update 7**: asked to actually build out Story books (§4.5)
— pick a feeling, write it as an illustrated kids'-book-style reader
with page-turn animation and a read-aloud option. Picked **Worried**
(see PLAN.md §4.5 for why) and wrote **"Sprocket's Fluttery Day"**, a
9-page story at `spike/www/story.html` (+ `story.css`, `story.js`),
reachable from the home screen's "Story time" button.

What it does:
- **Illustrations**: inline SVG, one per page, built from a shared
  `sprocketMini` symbol (a simplified version of the home-screen
  character, reused via `<use>`) plus per-page props — a park gate,
  flutter/thought-bubble accents, a name-tag banner, a row of
  differently-tinted friend characters, and a looping "breathing
  circle" animation on the tool-page specifically (the one page with
  content-tied motion, not just a page-turn).
- **Page-turn animation**: a pseudo-3D tilt+slide (rotateY +
  translateX + opacity, transform/opacity-only — the same technique
  validated at 60fps elsewhere in this spike), not a literal
  double-sided flip (which would need mirrored back-page rendering).
  Verified visually via a mid-transition screenshot showing the
  outgoing page fading/tilting under the incoming one.
- **Read aloud**: a header toggle that speaks the current page's text
  via the shared TTS module (factored `sprocketSpeak` out of `app.js`
  into `tts.js` so both the home screen and the book use one
  implementation instead of two copies), and re-speaks automatically
  on page turn while active. Cover page reads its title + subtitle
  instead of the "tap to begin" cue.
- **Offline**: found and fixed a real gap — the service worker was
  only ever registered from `app.js` (home screen), so a session that
  opened `story.html` directly (skipping `index.html`) had no offline
  support. Not a bug in the real Capacitor app (webDir root is always
  `index.html`), but fixed anyway by registering the same worker from
  `story.js` too (idempotent), and added `story.html`/`.css`/`.js` and
  `tts.js` to the cached asset list. Re-verified: offline reload of
  `story.html` as a direct entry point now works.

Re-verified across the whole change: flat ~60fps on both the home
screen and through repeated rapid page flips, no console errors beyond
the expected favicon 404, read-aloud toggles and re-triggers correctly
across page turns.

This is a content-format and tone prototype for Open Decision #4/§4.5,
not locked story content or final art direction — see PLAN.md §4.5 for
how the story's structure maps to research note 01's five-stage model.

**2026-09-22 update 8**: asked to "make more books, make some games,
make everything work, make it all work" — every home-screen button
(Help me, Play a game, Story time, My diary, the parent gate) led
somewhere placeholder or nowhere real. Built out all five as actual
working, tested screens rather than one at a time:

- **Two more story books** at `story-frustrated.html` ("Sprocket's
  Wobbly Tower," about Frustrated) and `story-excited.html` ("Sprocket's
  Bouncy Morning," about Excited), plus a `stories.html` shelf. Each
  picked deliberately for a different body/mind signature and a
  different tool — see PLAN.md §4.5. Home's "Story time" now goes to the
  shelf, not straight into one book.
- **Two real games** at `games.html` — Breathing Buddy
  (`game-breathe.html`, a real hold-to-grow/release-to-shrink breathing
  tool, also reused inside Help Me) and Bubble Pop (`game-match.html`).
  Bubble Pop went through **three** versions in one sitting: a
  multiple-choice quiz ("that looks like a test game"), then a static
  memory-card grid ("i want a real game" / "text game"), then real-time
  gameplay — bubbles continuously float up a play field and the child
  taps the ones matching a called-out target feeling before they drift
  past, target rotating every 3 catches. That's the one that actually
  has moving parts and timing instead of tap-and-read content.
- **A real feeling diary** at `diary.html` — tap a feeling to log it
  (localStorage only), see past entries and a process-based tally. See
  PLAN.md §4.6 for the deliberate no-typed-note-field scope choice.
- **A real Help Me flow** at `help.html` — opens straight into the
  Breathing Buddy component (shared code with the game, not a copy),
  with an on-screen greeting and an explicit tap-to-hear button rather
  than autoplaying speech on navigation.
- **A real parent gate** at `parent-gate.html` → `parent-home.html` — a
  randomized math check, then a deliberately minimal grown-up area
  showing process counts only (never which feelings, never when).

Also extracted TTS registration and service-worker registration into two
tiny shared files (`tts.js` already existed; added `sw-register.js`) so
all twelve HTML pages register offline support and share one TTS
implementation instead of each page needing its own copy — this was
already the plan for TTS, and the same fix from the earlier "story.html
opened directly had no offline support" bug is now applied everywhere,
not just the book reader.

**Two real bugs found via screenshot review, not "looks right at a
glance," both fixed:**
1. In Breathing Buddy, the bubble's grow animation scales up
   symmetrically in every direction, including upward — with too little
   clearance, it visually swallowed the small Sprocket character
   positioned right above it at full grow. Fixed by widening the gap.
2. In the (now-retired) memory-card version of the match game, `.done-view`
   and `#round-view` both set `display: flex` directly on the element —
   a class/ID selector doing that beats the browser's own very-low-specificity
   `[hidden] { display: none }` default, so toggling the `hidden`
   attribute via JS silently did nothing and **both screens stayed
   visible on top of each other the whole time**. `#dev-panel` already
   had the correct `[hidden]` override pattern elsewhere in this spike;
   this was the same footgun recurring in a new file. Fixed there, and
   the final Bubble Pop version sidesteps the whole footgun by toggling
   `element.style.display` directly (inline styles always win) instead
   of relying on the `hidden` attribute at all.

Re-verified everything across all twelve pages after these changes:
flat 60fps on every screen including active Bubble Pop gameplay (~4
concurrently animating bubbles, well under the 100-node budget already
validated), all twelve pages load correctly both online and offline
(service worker cache version bumped to v5), zero unexpected console
errors (only the same harmless missing-favicon request seen throughout
this whole spike — Capacitor apps use platform app icons, not
favicon.ico, so this was never worth fixing), and every interactive flow
exercised end-to-end: breathing-hold counts a breath, Bubble Pop
correctly detects matches and rotates targets, the diary persists
entries across a reload, the parent gate blocks a wrong answer and
admits a correct one, and the parent-home stats correctly reflect real
localStorage counts.

None of this is locked content, final IA, or final visual design — it's
a much fuller *prototype* than existed before this pass, covering every
function named in PLAN.md §4, built and tested rather than described.

**2026-09-22 update 9**: after trying update 8's build, feedback was six
specific, numbered points plus a screenshot of the plain home screen
("very basic and boaring, it all need a very big visual make over").
Addressed each:

1. **Breathing Buddy → Sprocket's Garden** (`game-breathe.html/.css/.js`,
   shared into `help.html`): "as crap, dont like it at all." Same
   underlying mechanic (hold to breathe in, release for a guided 4s
   breathe-out) but rebuilt around an illustrated garden scene — each
   full breath grows a flower (bud → bloom across two breaths, three
   flowers per garden), with a sparkle burst and a running "flowers
   grown" tally on each bloom, and Sprocket present in the scene the
   whole time. Also widened the scene's viewBox (260 → 300 tall) after
   the first pass looked sparse against the phone-height flex-centered
   layout.
2. **Bubble Pop given a visible goal**: "boaring to play, there seems to
   be no goal." Added a fill-as-you-catch jar meter (goal of 8 correct
   catches) with a mini Sprocket that cheers on every catch; the jar
   pulses and celebrates when full, then empties for the next fill — a
   recurring, achievable goal rather than a bare running tally. Also
   replaced the flat gradient play field with drifting clouds and a
   hill silhouette.
3. **Games shelf cards redesigned**: cards now show a small illustrated
   scene matching what's actually inside each game (the garden's
   flower/sun/hill; floating feeling-bubbles and a jar) plus a play
   badge, instead of a flat gradient with a couple of plain circles.
4. **Story shelf rebuilt as a real bookshelf** (`stories.css`, new):
   "the books need to look like real books with real covers." Replaced
   generic icon cards with portrait book covers — spine edge, a themed
   color per feeling, title/author treatment, a small cover emblem —
   standing on a wooden shelf plank. The row scrolls horizontally
   (found via screenshot: a plain wrapping grid left the first row of
   books floating with no plank under it once a third book didn't fit
   the viewport width) so it keeps working as more books get added.
5. **Each story book color-graded distinctly**: "alot can be done with
   the images, all the books look the same." Turned out true at the
   code level, not just visually — `skyGrad`'s stop-colors and the hill
   path fills were byte-identical across all three books' shared
   `bookBg`/`bookBgQuiet` `<symbol>` defs (each page reuses one symbol
   via `<use>`, so this was a single fix per file, not per-page).
   Re-tinted each to its cover's color family: Worried paler/duskier,
   Frustrated hotter orange-red, Excited brighter gold/green — applied
   to both the in-book backdrop and the screen background behind the
   reader so the mood carries through the whole screen.
6. **Diary reflection notes** (`diary.html/.css/.js`): "when ther pick a
   feeling it would be good if they can then add notes via typing or
   voice." Tapping a feeling still logs it immediately; an optional
   panel now follows, offering to type or speak a note, Skip always one
   tap away. Voice uses the Web Speech API, feature-detected (hidden
   entirely where unsupported) — flagged explicitly in code that this is
   the one place in the diary that isn't on-device: browser speech
   recognition typically streams audio to a cloud STT service to
   produce a transcript, a real tension with Principle 1 that a real
   product decision should weigh deliberately, not something to build
   quietly as if it were private.

Also gave the home screen its first pass of scenery — sun, drifting
clouds, sparkles, two trees, bushes, a flower bed, a path — after "this
look is very basic and boaring" (the general complaint the screenshot
was attached to). A first attempt at the bushes/flowers/path was placed
too low and sat behind the opaque button row, invisible; caught via
screenshot review and fixed by moving them up into the visible band
above the buttons.

Re-verified everything after these changes: all twelve pages load with
zero unexpected console errors (only the same harmless missing-favicon
request seen throughout this spike), flat 60fps confirmed on the home
screen, Sprocket's Garden, and Bubble Pop with bubbles actively
spawning, offline reload confirmed working with the new visuals
(service worker cache version bumped to v10 across these four rounds of
changes), and every new interactive flow exercised end-to-end:
Sprocket's Garden's two-breath bud→bloom progression across all three
flower slots plus the all-bloomed reset, Bubble Pop's jar filling past
its goal and celebrating/resetting plus the done-screen jar-count
summary, both story-shelf and game-shelf card links still navigating
correctly, all nine pages of the (re-colored) Worried book paging
through without error, and the diary's typed-note-save, skip, and
mic-feature-detection paths.

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
- `www/index.html`, `www/style.css`, `www/app.js` — the home screen
- `www/common.css` — shared header/shelf/button chrome for every
  non-home, non-book screen
- `www/tts.js` — shared TTS wrapper (native plugin + browser fallback)
- `www/sw.js`, `www/sw-register.js`, `www/manifest.webmanifest` — offline
  support, registered from every page
- `www/stories.html`, `www/stories.css` — book shelf (real book-cover
  cards on a shelf plank)
- `www/story.html`, `www/story-frustrated.html`, `www/story-excited.html`
  — the three books (Worried, Frustrated, Excited), each with its own
  backdrop color grading
- `www/story.css`, `www/story.js` — shared book-reader machinery (page
  flip, dots, read-aloud) used by all three books
- `www/games.html` — game shelf
- `www/game-breathe.html/.css/.js` — Sprocket's Garden, the breathing
  tool (also embedded in `help.html`)
- `www/game-match.html/.css/.js` — Bubble Pop
- `www/diary.html/.css/.js` — feeling diary, with optional typed/voice
  reflection notes per entry
- `www/help.html/.css/.js` — Help Me (embeds Sprocket's Garden)
- `www/parent-gate.html/.css/.js` — the math gate
- `www/parent-home.html/.css/.js` — the minimal post-gate area
- `android/` — generated native project (build artifacts gitignored)
- `capacitor.config.json`, `package.json` — project config
