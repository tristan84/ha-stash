# Sprocket (working title) — Plan

Status: **Phase 1 — Technical Spike (in progress)**. Phase 0 research is
complete. A throwaway Capacitor spike exists at `spike/` with partial
results (see `spike/SPIKE_NOTES.md`) — real-device validation is still
outstanding. This document is the source of truth for the project.
Anything marked **[verify]** is unchecked background knowledge and should
not be treated as settled until research backs it up or removes it.

Last updated: 2026-09-22. Working name **Sprocket** placeholder-set 2026-09-21
(app + companion character); not final, needs a proper trademark/domain
check. All ten original Phase 0 research agenda items (§8), plus both
follow-up research gaps (TTS vendor comparison, Social Stories™
licensing), are now researched; several open decisions (§9) carry
research-backed recommendations but remain unlocked pending sign-off.

**2026-09-22**: every home-screen button now leads to a real, working,
tested prototype screen instead of a placeholder — three story books
(§4.5), two real games (§4.2), a working Help Me flow (§4.3), a working
on-device feeling diary (§4.6), and a real (lightweight) parent gate
(§5). See each section below and `spike/SPIKE_NOTES.md` for what's
actually been validated vs. what's still content/IA to design properly
in Phase 2 — this is a much fuller prototype than a locked design.

---

## 1. Vision & Problem Statement

Help kids — including kids with special needs (autism, ADHD, and other
neurodivergent profiles) — learn to **notice, name, understand, and manage**
their feelings, covering both **body effects** (what a feeling does physically:
racing heart, tight chest, hot face) and **mind effects** (what a feeling does
to thoughts: racing thoughts, tunnel vision, catastrophizing).

A friendly robot character, **Sprocket**, learns alongside the child rather than
teaching down at them. The child plays short games in calm moments to build
skills, and has a one-tap **"Help me"** mode for hard moments in the wild.

## 2. Target Users

- **Primary**: children, roughly early-childhood through pre-teen, including
  autistic children, children with ADHD, and other neurodivergent profiles.
  Age range and any diagnosis-specific tracks are an **open decision** (see §9).
- **Secondary**: parents/caregivers, who get a companion view (progress,
  guidance, not raw feelings data — see §5).
- Out of scope for v1: classroom/teacher tools, clinician dashboards.

## 3. Product Principles (non-negotiables)

1. **Privacy first.** No child accounts. On-device by default. No ads, no
   trackers, no third-party analytics SDKs in the child-facing surface.
2. **Process over outcome for rewards.** Rewards are given for *noticing*,
   *naming*, and *trying a tool* — never for having a specific feeling (no
   "gold star for being calm," no implicit message that some feelings are
   bad).
3. **Skill-building, not therapy.** The app is positioned and marketed as a
   skills app, not a clinical or therapeutic product. No diagnostic claims,
   no treatment claims.
4. **Scripted content, no AI in the child path (v1).** All content the child
   sees/hears in v1 is authored and reviewed, not generated live. This is a
   safety and predictability requirement, especially for kids with special
   needs who benefit from consistency.
5. **Body and mind, always both.** Every feeling taught covers what it does
   in the body and what it does in the mind — never one without the other.

## 4. Core Experience

### 4.1 Sprocket (the companion character)
A robot who is *learning too* — not an all-knowing teacher. Sprocket models
noticing and naming its own (robot) body/mind effects, which lowers the
stakes for the child to do the same. Design of Sprocket's personality, voice,
and visual style is an open decision (see §9).

### 4.2 Calm-moment games (skill building)
Short, scripted games played when the child is regulated, used to build
vocabulary and recognition skill before it's needed in a hard moment
(consistent with the "teach the skill when calm, use it under load" model —
see research note 01). Game content is organized by feeling and by
body/mind effect.

**Two working prototypes exist** at `spike/www/games.html` (the shelf) —
neither locked as final content/mechanic, both real, playable, and tested:
- **Sprocket's Garden** (`game-breathe.html`, was "Breathing Buddy") —
  hold a glowing orb to grow it (breathe in), release to let it shrink on
  a guided pace (breathe out); the mechanic is unchanged from the earlier
  bubble version, but each full breath now visibly grows a flower (bud →
  bloom across two breaths, three flowers per garden, sparkle burst and a
  running tally on each bloom), rebuilt after prototype feedback that the
  plain bubble "looked boring." This is the actual tool referenced in the
  story books' "tool" pages and reused directly inside Help Me (§4.3) —
  practiced here, then available there, per this section's own rule that
  Help Me only surfaces already-practiced tools.
- **Bubble Pop** (`game-match.html`) — real-time gameplay, not a quiz: a
  target feeling word is shown, and face-only (no text label) bubbles
  continuously float up a play field; tap the ones whose expression
  matches the target before they drift past (target rotates every 3
  catches). Bubbles originally printed the feeling's name as text too,
  which made catching one word-matching rather than expression
  recognition — a real design gap caught by feedback that the point of
  the game wasn't clear; fixed by making the bubbles face-only, with a
  line stating the point directly. Went through two earlier full-mechanic
  versions (a multiple-choice list, then a static memory-card grid) that
  both read as content review rather than a game — this one has actual
  moving parts and timing. Added a visible goal after feedback that it
  "looked boring, no goal": a fill-as-you-catch jar meter (8 correct
  catches) that celebrates and empties for the next fill, plus scenery
  (drifting
  clouds, a hill) behind the play field instead of a flat gradient. No
  score or fail state either way (Principle 2): a miss just pops the
  bubble too, an untapped bubble costs nothing, and the jar goal is a
  recurring milestone, never a required finish line.

### 4.3 "Help me" mode
One-tap entry point for hard moments. Deliberately minimal-friction (one
tap, no menus to navigate while dysregulated). Offers short, practiced
tools (breathing, grounding, movement) rather than new learning — teaching
new things during dysregulation doesn't work, so Help Me only surfaces
tools the child has already practiced in calm-moment games.

**A working prototype exists** at `spike/www/help.html`: tapping Help Me
on the home screen opens straight into the Sprocket's Garden tool (§4.2) —
no menu, no choice to make. Sprocket's greeting line is shown as on-screen
text immediately, with an explicit tap-to-hear button, rather than
autoplaying speech right after the navigation (unreliable across browsers
and not something to spring on a child already in a hard moment).

### 4.4 Rewards
Process-based only, per Principle 2 above. Exact reward mechanic (points,
collectibles, Sprocket's own "growth," streaks vs. no-streaks) is an **open
decision** — streaks in particular risk punishing kids for hard days, which
cuts against Principle 2, so streak-based mechanics need explicit scrutiny
before adoption.

### 4.5 Story books
Short, scripted stories — the other calm-moment content format alongside
games (§4.2). Where a game builds recognition/vocabulary through
interaction, a story models a character (plausibly Sprocket, plausibly a
relatable child character, or both) going through a specific situation and
its body/mind effects, then noticing, naming, and trying a tool — the same
skill sequence as the rest of the app, delivered narratively instead of as
a game. Scripted per Principle 4 (no AI/generative narration in the child
path for v1).

This sits close to what "Social Stories" (a specific, trademarked,
licensed method — see research note 12) does conceptually, but per that
note's finding, Sprocket's stories should be original content inspired by
the general "short supportive narrative for a specific situation" idea,
not built on the named/licensed method or its specific criteria, unless a
license is deliberately pursued later. Whether story content is fully
original vs. drawing on other (non-trademarked) published
children's-bibliotherapy patterns is an **open decision** (see §9).

**Ten prototype stories exist**, on a shelf at `spike/www/stories.html`,
each a different feeling with its own body/mind signature and its own
tool — deliberately not the same fix reused ten times:
- **"Sprocket's Fluttery Day"** (`story.html`) — **Worried**: fluttery
  tummy, fast heart, racing "what if" thoughts; tool is three slow
  breaths.
- **"Sprocket's Wobbly Tower"** (`story-frustrated.html`) — **Frustrated**:
  hot cheeks, tight fists, "I can't do this" thoughts; tool is shaking out
  your hands and counting to five (and the closing line explicitly names
  asking for help as counting too).
- **"Sprocket's Bouncy Morning"** (`story-excited.html`) — **Excited**:
  picked on purpose — it shares Worried's body signature (fast heart,
  can't sit still) but feels different, which the story says outright on
  its normalize page; its tool is channeling the energy (a wiggle dance)
  rather than calming down, reinforcing Principle 2 that tools are for
  any big feeling, not just uncomfortable ones.
- **"Sprocket's Rainy Afternoon"** (`story-sad.html`) — **Sad**: heavy
  chest, low energy, quiet withdrawn thoughts; tool is a comfort self-hug
  and naming one warm thing you love — deliberately not an energizing or
  breathing tool, since sad needs comfort, not fixing.
- **"Sprocket's Scattered Puzzle"** (`story-angry.html`) — **Angry**:
  hot-and-fast (bigger, quicker than Frustrated's slow build); tool is a
  big safe physical release (stomping) followed by telling a grown-up.
- **"Sprocket's Big Thunderstorm"** (`story-scared.html`) — **Scared**:
  racing heart, frozen legs, darting "what if" danger-thoughts; tool is a
  slow brave breath plus finding a nearby anchor (a safe person or thing).
- **"Sprocket's Spilled Juice"** (`story-embarrassed.html`) —
  **Embarrassed**: hot cheeks, want-to-hide, replaying the moment; tool
  is a physical shake-off plus normalizing that everyone messes up.
- **"Sprocket's Big Bike Ride"** (`story-proud.html`) — **Proud**: a
  positive achievement feeling distinct from Excited's high-energy
  signature — warm chest, tall posture; tool is a physical "proud pose"
  plus sharing the moment with someone, reinforcing (same as Excited)
  that tools exist for good feelings too.
- **"Sprocket's Very Full Day"** (`story-overwhelmed.html`) —
  **Overwhelmed**: too-much-at-once, tight/heavy body, loud/foggy head;
  tool is stepping to quiet then picking just one small thing to focus
  on — directly relevant to the app's named audience (§2: autistic
  children, ADHD).
- **"Sprocket's Sunny Saturday"** (`story-happy.html`) — **Happy**: an
  ordinary-good-day feeling, deliberately with no dramatic trigger at
  all; tool is "savoring" — pausing to notice one good thing happening
  right now.

All ten share the same nine-page structure — notice (body) → notice
(mind) → name → normalize → try a tool → process-reward close ("proud —
not for feeling calm/quiet/settled, for trying") — a narrative
instantiation of the five-stage model research note 01 already
recommended for the taxonomy (Open Decision #4). Illustrated with inline
SVG (each page a distinct composition, not a reused background with a
different caption) in the same warm palette/character design as the rest
of the app, with in-scene animation on every page (not just the page-turn),
a page-turn animation, and a read-aloud toggle (reusing the shared TTS
module). Each book also now has its own color grading (sky/hill palette
tied to its cover's color family — paler/duskier for Worried, hotter
orange-red for Frustrated, brighter gold/green for Excited) after
feedback that all three "looked the same," since the three books had
started out sharing one byte-identical backdrop palette. The shelf
(`stories.html`) presents them as real book covers — portrait shape,
spine edge, cover title/author treatment, a themed color per feeling —
standing on a wooden shelf plank, rather than flat icon cards, after
feedback asking for "real books with real covers." Content-format and
tone prototypes, not locked stories — see `spike/SPIKE_NOTES.md` for
what they do and don't validate.

### 4.6 Feeling diary
A child-owned, private place to record "I noticed ___ today" / "I felt
___" entries — the persistent, revisitable form of the app's core
noticing-and-naming practice (§1), not a separate bolt-on feature. Each
diary entry is itself an instance of "noticing" and "naming," so it's a
natural fit for process-based rewards (§4.4) — logging an entry earns the
same kind of recognition as completing a game or story, never tied to
which feeling was logged (Principle 2).

Privacy needs particular care here specifically because it's the one
place in the app that stores the child's actual feelings content, not
just which skills they practiced: per Principle 1 and research note 04's
recommendation (local-only by default, sync opt-in only if truly needed),
diary entries should stay on-device and **not** be part of any default
parent-visible data — consistent with §5's existing "process metrics, not
feelings surveillance" rule for the parent side. Whether the diary is
**ever** visible to parents (even opt-in, even aggregated) is an **open
decision** (see §9) that needs your explicit call, not an assumption
either way.

**A working prototype exists** at `spike/www/diary.html`: tap a feeling
chip (eleven options — all ten story-book feelings plus Calm, which has
no book of its own) to log it immediately, stored in `localStorage` only,
nothing sent
anywhere. Logging itself stays a single tap — fast and low-friction — but
an optional reflection panel now follows each tap, offering to say more
by typing or by voice, always skippable in one tap since not every child
types comfortably or wants to elaborate. Notes are stored on the entry
and shown under it in the notebook. Voice input uses the Web Speech API,
feature-detected and hidden entirely where unsupported — worth flagging
explicitly: unlike everything else here, browser speech recognition
typically streams audio to a cloud speech-to-text service rather than
staying on-device, a real tension with Principle 1 that an eventual
product decision should weigh deliberately (see `diary.js` for the
in-code caveat) rather than something to treat as private by assumption.
The list below the picker shows past entries (feeling + relative time +
any note), and the tally at the top counts entries, never which feelings
were logged — process language throughout ("You've noticed N feelings so
far. Nice noticing!").

## 5. Parent Side

A separate parent-facing surface. Scope for v1 is an **open decision**, but
principles constrain it:
- No raw "my child felt angry at 3:14pm" logging by default — process
  metrics (skills practiced, tools tried), not feelings surveillance,
  consistent with Principle 1 and 2.
- Guidance/coaching content for parents (how to talk about feelings, how to
  support Help Me mode at home).
- Data stays local/on-device by default per Principle 1; any optional sync
  is opt-in and is itself an open decision (see §9).

**A working prototype gate (not a dashboard) exists** at
`spike/www/parent-gate.html` → `parent-home.html`: a simple randomized
math question (the standard lightweight pattern for keeping a curious
young child out, not security against a determined older child or adult)
gates entry to a deliberately minimal grown-up area. That area shows
**counts only** — feelings logged in the diary, breaths practiced,
Bubble Pop rounds played — never which feelings were logged or when,
matching this section's own "process metrics, not surveillance" rule.
This isn't an unfinished corner of the prototype: it's the honest amount
of parent-side UI actually decided so far, said so explicitly on-screen
rather than faked further.

## 6. Platform & Technical Approach

- **Android tablet first.** Primary form factor for v1.
- **Capacitor as the leading tech choice**, to be validated with a spike
  before committing (see §9 and Roadmap). Rationale: shared web codebase,
  faster iteration for a small team, native plugin access (TTS, later
  sensors) via the Capacitor bridge. Risk to validate in the spike:
  animation/audio performance for a young-child-facing, low-friction UI,
  and offline reliability.
- **Voice**: Sprocket speaks via TTS first (device TTS engine via a Capacitor
  TTS plugin — both `capacitor-community/text-to-speech` and Capawesome's
  Speech Synthesis plugin exist and wrap native Android/iOS TTS). **Push-to-talk
  input comes later**, not in v1 — v1 is TTS-out only, no speech recognition
  in the child path (consistent with Principle 4: no live AI/interpretation
  of open-ended child speech in v1).
- **Later: smartwatch.** Nudges the child (or parent) when the body is
  "revving up," using wearable sensors (e.g., heart rate) as an early-warning
  signal before a hard moment, similar in spirit to Mightier's heart-rate
  biofeedback approach (see research note 03) but as a passive nudge rather
  than an in-the-moment biofeedback game. Platform (Wear OS vs. other),
  sensor choice, and privacy model for on-body data are **open decisions**,
  deliberately deferred out of v1.

## 7. Content & Safety Approach

- All v1 child-facing content is scripted and reviewed before release — no
  generative AI in the child path (Principle 4).
- Positioning: skill-building app, not therapy or a medical device — no
  claims of treating anxiety, autism, ADHD, or any diagnosis.
- Content grounding: whether to build on an existing published framework
  (e.g., Zones of Regulation, Incredible 5-Point Scale) vs. an original
  taxonomy of feelings/body-mind effects is an **open decision** with
  licensing implications (see §9).

## 8. Research Agenda (Phase 0)

Status legend: ✅ researched (see `research/`) · ⏳ not yet started.

1. ✅ Interoception and body-first teaching — `research/01-interoception-body-first-teaching.md`
2. ✅ Emotion-regulation evidence for autistic and ADHD children — `research/02-emotion-regulation-evidence-autism-adhd.md`
3. ✅ Competitor scan: Mightier, Breathe Think Do with Sesame, Smiling Mind, Otsimo, Moshi — `research/03-competitor-scan.md`
4. ✅ Privacy/regulatory landscape for children's apps (COPPA, GDPR-K, Google
   Play Families Policy, Apple's Kids Category rules) — `research/04-privacy-regulatory-landscape.md`
5. ✅ Capacitor vs. native Android — technical spike plan, plugin
   availability audit (TTS, later sensors/Wear OS), performance risk —
   `research/05-capacitor-vs-native-spike-plan.md` (narrows the Phase 1
   spike's scope; does not itself settle Open Decision #5 — the spike
   still does that)
6. ✅ Reward-system design literature — process vs. outcome praise/reward,
   effects of streak mechanics on children, especially neurodivergent
   children — `research/06-reward-system-design.md`
7. ✅ TTS engine options in depth — on-device vs. cloud voice quality
   tradeoffs, Android TTS engine landscape, licensing for a distinct
   "Sprocket voice" — `research/07-tts-voice-options.md`
8. ✅ Smartwatch feasibility — Wear OS sensor access, battery impact,
   privacy model — `research/08-smartwatch-feasibility.md` (exploratory;
   feature itself stays deferred past v1)
9. ✅ Existing children's emotion curricula/frameworks (Zones of
   Regulation, Incredible 5-Point Scale, Sesame Workshop material) —
   licensing and content grounding options — `research/09-existing-curricula-frameworks.md`
10. ✅ Accessibility/UX standards for neurodivergent-friendly design —
    `research/10-accessibility-neurodivergent-ux.md`

Follow-up gaps surfaced along the way, now also closed:

11. ✅ Commercial child/character-voice TTS vendor comparison (gap from
    item 7) — `research/11-tts-vendor-comparison.md`
12. ✅ Social Stories™ licensing (gap from item 9) — `research/12-social-stories-licensing.md`

All ten original Phase 0 research agenda items, plus both follow-up gaps
surfaced along the way, are now researched. No further Phase 0 research
agenda items are outstanding.

## 9. Open Decisions

Nothing in this section is locked in. Each needs your sign-off before it
moves into the principles/constraints above. Research-informed status noted
where Phase 0 research already bears on the decision.

| # | Decision | Status after Phase 0 research so far |
|---|----------|----------------------------------------|
| 1 | App name | **Placeholder set 2026-09-21: "Sprocket"** — used for both the app's working title and the companion character's name. Not final; no formal trademark/domain search has been done, only a light web spot-check that found no obvious app/trademark conflicts. Still needs a proper USPTO/trademark and domain-availability check before locking in. |
| 2 | Age range / diagnosis-specific tracks | Untouched as a specific range/track decision, though note 06 supports *some* differentiation being valuable ("personalized, stepped-care" framing shows up favorably in the emotion-regulation literature) without specifying how. |
| 3 | Reward mechanic specifics (streaks, points, collectibles) | **Recommended by research** (note 06): no punitive/resettable streaks — process praise ("you noticed," "you tried a tool") outperforms trait/outcome praise generally and especially after struggle, which is exactly the Help Me context; if any progress mechanic ships, it should only ever accumulate (e.g. Sprocket's own visible growth), never reset. Not locked — awaiting your sign-off. |
| 4 | Content grounding: original taxonomy vs. existing framework (Zones of Regulation etc.) | **Recommended by research** (notes 01 + 09): build an original taxonomy for v1. Zones of Regulation and the Incredible 5-Point Scale are both actively licensed, trademarked IP with existing official/authorized apps — real infringement risk to reference by name or graphics without a license. The generic notice→name→link→understand→manage sequence (note 01) and general intensity-scale pedagogy aren't exclusive to either framework and can inform Sprocket's design without adopting either. Licensing a named framework later remains a separately-precedented option if ever wanted. Not locked — awaiting your sign-off. |
| 5 | Capacitor: confirmed or fallback to native | **Partially validated** — spike built at `spike/` (see `spike/SPIKE_NOTES.md`). Headless-Chromium test held a flat 60fps with up to 100 concurrently-animated nodes using transform/opacity-only CSS animation, and the TTS plugin + offline service-worker approach both work end-to-end. The Android project scaffolds and configures cleanly (`npx cap add android`). **Not yet closed**: this sandbox has no Android SDK/device, so real WebView-on-tablet frame timing (the actual thing note 05 flagged as the risk) is still unvalidated — needs Android Studio + a real or emulated device, ideally a lower-end one, to produce the final go/no-go. Still not locked — this is the one decision that genuinely can't be resolved from here. |
| 6 | Parent-side data scope (local-only vs. optional sync) | **Recommended by research** (note 04): local-only by default, sync opt-in only if truly needed. On-device-only design is what lets this project largely avoid COPPA's verifiable-parental-consent machinery and GDPR-K's per-country consent-age handling; any sync feature reopens that whole compliance surface. Not locked — awaiting your sign-off. |
| 7 | Smartwatch platform/timing | Still deliberately deferred past v1. Research (note 08) adds a sharper requirement if/when this is taken up: process sensor data on-watch only, never transmit raw signal off-device (keeps it out of COPPA's health-data consent requirements per note 04, and avoids the "kids' smartwatch" category's bad privacy reputation, which is about GPS/communication watches, not this feature). Wear OS's Health Services API and battery model both favor the "passive nudge" framing already in §6 over continuous biofeedback streaming. |
| 8 | TTS voice choice (stock device TTS vs. custom "Sprocket voice") | **Recommended by research** (note 07): pre-generate Sprocket's scripted lines with a commercial child/character-voice service as shipped static audio (gives a distinctive voice, stays fully offline, fits Principle 4's "no live AI in the child path"), with on-device TTS as a fallback only for any dynamic/non-scripted text. Vendor shortlist now narrowed (note 11, Decision #12) to SpeechGen and Amazon Polly's "Child" voice, pending a hands-on listening comparison. Not locked — awaiting your sign-off. |
| 9 | Positioning/legal language to avoid implying therapy or medical claims | Further informed — Mightier's approach (note 03) remains the template; research note 02 adds a concrete reason to keep claims modest (autism emotion-regulation evidence is mixed overall, ~48% of studies show improvement; ADHD-specific *digital* emotion-regulation evidence is thin, only a handful of RCTs found) — supports "skill-building/practice" language over any efficacy claim. Note 04 adds that Apple's Kids Category and Google Play Families rules operationalize "no behavioral ads, no third-party tracking" as hard review requirements, not just a values choice, which should shape this language too. |
| 10 | Localization scope for v1 (English only vs. more) | Untouched, though note 04 flags that any EU launch means handling different per-country GDPR-K consent-age thresholds (13–16) if the app ever collects personal data — relevant context whenever this is picked up. |
| 11 | Monetization / business model (free/nonprofit, freemium-subscription, or other) | **New — added from research.** Competitor scan (note 03) shows three viable precedents (Smiling Mind: free/nonprofit; Otsimo: freemium ~$13–20/mo; Moshi: VC-funded subscription ~$40/yr), each with different tradeoffs against Principle 1 (privacy-first, no ads/trackers). Not in scope of the original plan — flagging for your decision rather than assuming one. |
| 12 | Commercial child/character-voice TTS vendor (if Decision #8 goes the pre-generated-voice route) | **Recommended by research** (note 11): shortlist narrowed to **SpeechGen** (commercial license included in every plan, pay-once credits, cheapest/simplest for a one-time static-asset generation) and **Amazon Polly's named "Child" voice** (purpose-built child voice from a major cloud vendor, cheap per-character, but exact perpetual-reuse terms for shipped static audio need direct ToS confirmation). **ElevenLabs is ruled out** — its policy explicitly disallows child-like voices in its Voice Library. Final pick needs a hands-on audio listening comparison (a Phase 2 task, not further research). Not locked — awaiting your sign-off. |
| 13 | Social Stories™ licensing, as a possible additional content-grounding input alongside Decision #4 | **Researched** (note 12). Same conclusion as Decision #4: the specific "Social Stories™" name and Carol Gray's copyrighted 10.2/10.4 criteria/materials should not be used without a license (trademark-registration status itself is ambiguous in available sources, but the underlying methodology documents are clearly copyrighted); the general concept (short, supportive, first-person narrative for a specific situation) remains usable as inspiration for original content. Reinforces, does not change, Decision #4's recommendation. |
| 14 | Feeling diary parent visibility (§4.6) — fully private to the child, or opt-in/aggregate-only visibility for parents? | **New — added 2026-09-21 when Story books (§4.5) and Feeling diary (§4.6) were added to the plan.** Recommend defaulting to fully private-to-child (strongest reading of Principle 1 and §5's "process metrics, not feelings surveillance" rule), with any parent-facing signal limited to process metrics ("practiced noticing 5 times this week") never diary content itself — but this is explicitly your call, not assumed. |
| 15 | Story book content sourcing (§4.5) — fully original vs. drawing on other (non-trademarked) published children's-bibliotherapy patterns | **New — added 2026-09-21.** Research note 12 already rules out building on the specifically named/licensed "Social Stories" method without a license; this decision is narrower — whether to look at other (non-trademarked) bibliotherapy writing patterns for craft inspiration, or write fully from scratch. Untouched otherwise. |

## 10. Roadmap / Phases

- **Phase 0 (current): Planning & research.** Build this plan, work through
  the research agenda (§8), settle open decisions (§9) with sign-off, land
  on a name.
- **Phase 1: Technical spike — in progress.** Throwaway prototype built at
  `spike/` (see `spike/SPIKE_NOTES.md` for full results). Animation
  approach (transform/opacity-only CSS animation) validated at a flat
  60fps up to 100 concurrent animated nodes in headless Chromium; TTS
  plugin and offline service-worker both wired and working; Android
  project scaffolds cleanly via Capacitor CLI. **Blocked on**: this
  environment has no Android SDK/device, so real WebView-on-tablet frame
  timing — the actual risk research note 05 flagged — is still
  unvalidated. Final go/no-go on Capacitor needs someone with Android
  Studio or a physical/emulated Android tablet to run the spike's
  `android/` project and repeat the stress test there.
- **Phase 2: Content design.** Lock the feeling/body-mind-effect taxonomy
  (per research note 09's recommendation: original, not licensed on a
  named framework), draft the first set of scripted calm-moment games and
  the Help Me flow, design Sprocket (including a pre-generated voice per
  research note 07, if Open Decision #8 is confirmed that way). Build in
  the neurodivergent-UX requirements from research note 10 (motion
  kill-switch, no autoplay audio/video, fixed navigation positions
  app-wide, literal non-sarcastic dialogue) as acceptance criteria from
  the start, and plan direct testing/feedback sessions with autistic and
  ADHD children (and parents/clinicians), not just internal review.
- **Phase 3: v1 build.** Android tablet app, TTS-out voice, no accounts, no
  network dependency for the child path.
- **Phase 4+: Parent side, push-to-talk input, smartwatch.** Sequenced
  after v1 ships and is validated with real families. If parent-side sync
  is ever added, revisit research note 04 first (it reopens COPPA/GDPR-K
  consent requirements the on-device-only v1 largely avoids).

**Timeline flag**: the FTC's amended COPPA Rule (research note 04) has a
compliance deadline of **April 22, 2026** for any app collecting children's
personal information. This project's on-device-first design (Principle 1)
is expected to fall largely outside the rule's hardest requirements, but
this date is worth tracking explicitly if that design assumption changes at
any point before then.
