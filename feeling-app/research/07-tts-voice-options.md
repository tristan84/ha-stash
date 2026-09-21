# Research Note 07: TTS Engine & Voice Options

Research agenda item 7 (PLAN.md §8). Compiled 2026-09-21 via live web search.
Informs Open Decision #8 (TTS voice choice) and the "Sprocket speaks via
TTS" requirement in PLAN.md §6.

## Sources

- [speechcentral.net — Supertonic TTS on Android: Impressive Offline Voices, but Not Yet Ready for Everyday Use (May 2026)](https://speechcentral.net/2026/05/23/supertonic-tts-android-another-offline-ai-voice-engine-joins-the-open-source-tts-wave/)
- [speechcentral.net — Android AI System Voices: The Rise of Offline TTS on Mobile (Apr 2026)](https://speechcentral.net/2026/04/01/android-ai-system-voices-the-rise-of-offline-tts-on-mobile/)
- [freevoicereader.com — Offline TTS vs Cloud: Best Local AI Models for 2026](https://www.freevoicereader.com/blog/offline-tts-local-ai-2026-comparison)
- [eist.app — Best Offline Text-to-Speech Apps in 2026 (No WiFi)](https://eist.app/blog/best-offline-text-to-speech-apps-2026)
- [aidictation.com — Text to Speech on Android: Built-In Tools, Apps & AI Voices (2026)](https://aidictation.com/blog/text-to-speech-android)
- [SpeechGen — Child Text to Speech, Free Kids & Baby AI Voice Generator](https://speechgen.io/en/child-tts/)
- [Narakeet — AI Child Voice Generator](https://www.narakeet.com/create/text-to-speech-child-voice-online.html)
- [gladia.io — Best TTS APIs for developers in 2026](https://www.gladia.io/blog/best-tts-apis-for-developers-in-2026-top-7-text-to-speech-services)
- Capacitor TTS plugin sources already cited in note 05.

## Key Takeaways

1. **Offline/on-device TTS quality has closed most of the gap with cloud
   TTS by 2026.** Multiple sources describe 2026 as the point where the
   quality tradeoff between offline and cloud voices became small enough
   that offline-first is a realistic default, not a compromise — directly
   supportive of Principle 1 (on-device by default) applying to voice
   output too, not just data storage.

2. **There's a real, if young, open-source offline neural TTS landscape**:
   named engines include **Piper** (lightweight, described as practical
   across a wide device range), **Pocket TTS** (mobile-practicality
   focused), **Supertonic TTS** (good voice quality but flagged as having
   reliability problems with *short utterances* specifically — a real
   concern for a UI with lots of brief phrases, not long narration), and
   **Kokoro** (28 English voices, good quality, but "computationally
   demanding" for smooth real-time mobile use — a tablet-performance risk
   worth testing in the Phase 1 spike, not assuming away).

3. **Stock Android system TTS remains a credible default option.**
   Google's built-in TTS offers multiple voices tiered by quality, with
   newer devices exposing "neural"/"natural"-labeled higher-quality voices.
   This is the zero-integration-cost option and pairs directly with the
   Capacitor TTS plugins already identified in note 05
   (`capacitor-community/text-to-speech`, Capawesome Speech Synthesis) —
   both wrap native device TTS rather than bundling a separate engine.

4. **A distinct, licensed "Sprocket voice" is achievable but is a genuine
   product decision with cost/complexity, not a free upgrade.** Child-voice
   TTS options exist commercially (SpeechGen: 18 child voices across 6
   languages, commercial license included in every plan; Narakeet: child
   voice generation) — but these are typically **cloud-generated voice
   assets** (pre-rendered audio clips), not on-device real-time synthesis
   engines. That distinguishes two different implementation paths:
   - **Path A**: use stock/open-source on-device TTS at runtime (cheap,
     fully offline, generic voice, consistent with Principle 1's spirit of
     no network dependency).
   - **Path B**: pre-generate Sprocket's actual lines with a commercial
     child-voice/character-voice service at content-authoring time, ship
     the resulting audio files as static assets, and use on-device TTS
     only as a fallback for any dynamic text. This gets a distinctive,
     designed "Sprocket voice" while keeping the *shipped app* fully
     offline (no live cloud TTS calls at runtime) — likely the better fit
     given Principle 4 (scripted content, no AI in the child path) and
     Principle 1 (on-device by default), since it avoids introducing any
     runtime network dependency or live generative component.
5. **General commercial TTS API licensing carries real restrictions**
   (voice cloning/redistribution limits, provider-specific terms) —
   relevant if Path B (pre-generated Sprocket voice) is chosen, since the
   specific service's commercial terms need review before locking in a
   voice, not assumed clear because a "commercial license" is mentioned in
   marketing copy.

## What This Changes In The Plan

- **Recommends Path B (pre-generated Sprocket voice via a commercial
  child/character-voice service, shipped as static audio, with on-device
  TTS as a fallback for dynamic content) over live on-device TTS as the
  primary voice strategy** — this fits Principle 4 (scripted, no live AI in
  the child path) more precisely than originally scoped in PLAN.md §6,
  which currently describes "Sprocket speaks via TTS" somewhat generically.
  Recommend updating PLAN.md §6 to distinguish "scripted lines →
  pre-rendered Sprocket-voice audio" from "any need for dynamic/live
  speech → on-device TTS fallback only." This is a recommendation for your
  sign-off, not applied yet.
- **De-risks offline reliability further**: since v1's actual dialogue is
  scripted (Principle 4), most of Sprocket's voice can ship as bundled
  audio assets rather than depending on TTS synthesis quality/performance
  at all — reduces the Phase 1 spike's TTS-specific risk surface
  considerably (the spike still needs to validate *some* on-device TTS
  path exists for any dynamic text, e.g., reading back something the
  parent configures).
- **Surfaces a new sub-decision under Open Decision #8**: which commercial
  child-voice service to use for pre-generating Sprocket's lines (if Path B
  is chosen), and its licensing terms — not previously broken out in
  PLAN.md.

## Unverified / Needs Follow-Up

- No direct comparison of the *specific* commercial child-voice services
  (SpeechGen, Narakeet, others) on quality, licensing terms, or pricing
  was done — only that such services exist. A proper vendor comparison is
  needed before Phase 2 content production if Path B is adopted.
  **[not yet researched at vendor-comparison depth]**
- Whether Piper, Kokoro, or another open-source on-device engine
  integrates cleanly via the Capacitor plugins identified in note 05, vs.
  requiring custom native plugin work, was not confirmed — the existing
  Capacitor TTS plugins likely just expose the OS's stock TTS engine
  selection rather than bundling a specific open-source engine like Piper.
  **[unverified — needs a technical check during the Phase 1 spike]**
