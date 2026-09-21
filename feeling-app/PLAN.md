# Sprocket (working title) — Plan

Status: **Phase 0 — Planning & Research**. Nothing is built yet. This document is
the source of truth for the project. Anything marked **[verify]** is unchecked
background knowledge and should not be treated as settled until research backs
it up or removes it.

Last updated: 2026-09-21. Working name **Sprocket** placeholder-set this date
(app + companion character); not final, needs a proper trademark/domain
check.

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

### 4.3 "Help me" mode
One-tap entry point for hard moments. Deliberately minimal-friction (one
tap, no menus to navigate while dysregulated). Offers short, practiced
tools (breathing, grounding, movement) rather than new learning — teaching
new things during dysregulation doesn't work, so Help Me only surfaces
tools the child has already practiced in calm-moment games.

### 4.4 Rewards
Process-based only, per Principle 2 above. Exact reward mechanic (points,
collectibles, Sprocket's own "growth," streaks vs. no-streaks) is an **open
decision** — streaks in particular risk punishing kids for hard days, which
cuts against Principle 2, so streak-based mechanics need explicit scrutiny
before adoption.

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
4. ⏳ Privacy/regulatory landscape for children's apps (COPPA, GDPR-K, Google
   Play Families Policy, Apple's Kids Category rules) — early signal only,
   captured as an unverified note in research note 03; needs its own pass.
5. ⏳ Capacitor vs. native Android — technical spike plan, plugin
   availability audit (TTS, later sensors/Wear OS), performance risk.
6. ⏳ Reward-system design literature — process vs. outcome praise/reward,
   effects of streak mechanics on children, especially neurodivergent
   children (relevant to §4.4 and Principle 2).
7. ⏳ TTS engine options in depth — on-device vs. cloud voice quality
   tradeoffs, Android TTS engine landscape, licensing for a distinct
   "Sprocket voice" if not using stock device TTS.
8. ⏳ Smartwatch feasibility — Wear OS sensor access, battery impact,
   privacy model for continuous heart-rate-type data on a child's wrist.
9. ⏳ Existing children's emotion curricula/frameworks (Zones of
   Regulation, Incredible 5-Point Scale, Social Stories, Sesame Workshop's
   Little Children, Big Challenges materials) — licensing and content
   grounding options.
10. ⏳ Accessibility/UX standards for neurodivergent-friendly design
    (sensory-friendly UI patterns, WCAG applicability to a kids' app,
    autism-specific UX guidance).

## 9. Open Decisions

Nothing in this section is locked in. Each needs your sign-off before it
moves into the principles/constraints above. Research-informed status noted
where Phase 0 research already bears on the decision.

| # | Decision | Status after Phase 0 research so far |
|---|----------|----------------------------------------|
| 1 | App name | **Placeholder set 2026-09-21: "Sprocket"** — used for both the app's working title and the companion character's name. Not final; no formal trademark/domain search has been done, only a light web spot-check that found no obvious app/trademark conflicts. Still needs a proper USPTO/trademark and domain-availability check before locking in. |
| 2 | Age range / diagnosis-specific tracks | Untouched — needs its own research pass (item 10 above helps). |
| 3 | Reward mechanic specifics (streaks, points, collectibles) | Informed by Principle 2; streak mechanics flagged as high-risk, needs research item 6. |
| 4 | Content grounding: original taxonomy vs. existing framework (Zones of Regulation etc.) | Informed by research note 01 (five-stage noticing→naming→linking→understanding→managing model looks like a strong structural fit); licensing still needs research item 9. |
| 5 | Capacitor: confirmed or fallback to native | Not yet validated — spike still needed (research item 5); early web evidence in note 03 shows Capacitor TTS plugins exist, which is a good sign but not a validation. |
| 6 | Parent-side data scope (local-only vs. optional sync) | Untouched. |
| 7 | Smartwatch platform/timing | Untouched, deliberately deferred past v1. |
| 8 | TTS voice choice (stock device TTS vs. custom "Sprocket voice") | Untouched — research item 7. |
| 9 | Positioning/legal language to avoid implying therapy or medical claims | Partially informed — competitor scan (note 03) shows Mightier explicitly cites clinical trial evidence while marketing as a *tool*, not a treatment; worth studying their disclaimer language before drafting ours. |
| 10 | Localization scope for v1 (English only vs. more) | Untouched. |
| 11 | Monetization / business model (free/nonprofit, freemium-subscription, or other) | **New — added from research.** Competitor scan (note 03) shows three viable precedents (Smiling Mind: free/nonprofit; Otsimo: freemium ~$13–20/mo; Moshi: VC-funded subscription ~$40/yr), each with different tradeoffs against Principle 1 (privacy-first, no ads/trackers). Not in scope of the original plan — flagging for your decision rather than assuming one. |

## 10. Roadmap / Phases

- **Phase 0 (current): Planning & research.** Build this plan, work through
  the research agenda (§8), settle open decisions (§9) with sign-off, land
  on a name.
- **Phase 1: Technical spike.** Validate Capacitor on Android tablet
  (research item 5): a throwaway prototype exercising TTS output, the kind
  of animation/interaction the calm-moment games need, and offline
  behavior. Go/no-go on Capacitor at the end of this phase.
- **Phase 2: Content design.** Lock the feeling/body-mind-effect taxonomy,
  draft the first set of scripted calm-moment games and the Help Me flow,
  design Sprocket.
- **Phase 3: v1 build.** Android tablet app, TTS-out voice, no accounts, no
  network dependency for the child path.
- **Phase 4+: Parent side, push-to-talk input, smartwatch.** Sequenced
  after v1 ships and is validated with real families.
