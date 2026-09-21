# Research Note 11: Commercial Child/Character-Voice TTS Vendor Comparison

Follow-up gap from research note 07, tracked as Open Decision #12 in
PLAN.md §9. Compiled 2026-09-21 via live web search. Scoped specifically
to note 07's recommended "Path B": generate Sprocket's scripted lines
**once**, ship the resulting audio as static assets — not a live runtime
API dependency — so the comparison below weights one-time-generation
licensing clarity over per-request runtime pricing.

## Sources

- [SpeechGen — Child Text to Speech](https://speechgen.io/en/child-tts/)
- [SpeechGen — Pricing](https://speechgen.io/en/pricing/)
- [Narakeet — Commercial Usage Rights, Copyright and Monetization](https://www.narakeet.com/docs/usage-rights-copyright/)
- [Narakeet — AI Child Voice Generator](https://www.narakeet.com/create/text-to-speech-child-voice-online.html)
- [Narakeet — Pricing](https://www.narakeet.com/docs/pricing/)
- [ElevenLabs — Can Children's or Child-Like Voices Be Added to the Voice Library?](https://elevenlabs.io/docs/help-center/product/voices/voice-library/can-childrens-or-child-like-voices-be-added-to-the-voice-library)
- [LicenseOrg — ElevenLabs Licensing Guide: What You Can (and Can't) Do With AI Voices](https://www.licenseorg.com/blog/elevenlabs-licensing-guide-ai-voices)
- [texttolab.com — Amazon Polly Pricing 2026](https://texttolab.com/blog/amazon-polly-pricing)
- [texttolab.com — Google Cloud TTS Pricing 2026](https://texttolab.com/blog/google-cloud-tts-pricing)
- [AWS — Amazon Polly](https://aws.amazon.com/polly/)

## Vendor-by-Vendor Findings

### SpeechGen
- **Child voice availability**: dedicated child-voice product line, tiered
  Standard/Pro/HD quality.
- **Commercial licensing**: a commercial license is included with **every
  plan, including the free tier** — explicitly covers apps, games,
  e-learning, animations. No separate commercial upgrade needed.
- **Pricing model**: pay-once credit packs (not a subscription), credits
  valid up to 1 year, cost scales with voice quality tier (Standard
  cheapest, HD most expensive at 2 credits/character).
- **Fit for Path B**: strong — one-time credit purchase to generate a
  finite scripted line set, license already covers commercial shipping,
  no ongoing subscription needed once lines are generated.

### Narakeet
- **Child voice availability**: notably broad — 37 child voice options
  across 10 languages.
- **Commercial licensing**: the free tier (20 files) is **explicitly
  non-commercial**; a paid account is required for commercial usage
  rights. Once on a paid plan, no ongoing royalties beyond the account
  cost itself.
- **Pricing model**: paid plans are described as unlimited voices/languages
  with no per-character fee (subscription-style), rather than SpeechGen's
  pay-per-credit model.
- **Fit for Path B**: good — widest child-voice/language selection found
  in this scan, but requires an active paid subscription during the
  generation period even though the output is then used as static,
  offline-shipped assets afterward (i.e., the subscription is a
  production-time cost, not a runtime dependency for the shipped app).

### ElevenLabs
- **Important exclusion found**: ElevenLabs' own documentation states
  **children's or child-like voices cannot be added to their Voice
  Library at all** — this includes both actual minors' voices and adult
  voices designed to sound child-like — as a deliberate policy decision
  under their Prohibited Use Policy to guard against misuse of
  child-sounding synthetic voices. This directly **rules out ElevenLabs
  for a literally child-sounding Sprocket voice**, regardless of pricing
  or quality.
- **Still potentially relevant**: ElevenLabs does offer "youthful"/"playful"
  adult-ish voices explicitly marketed for cartoon/character use, which
  could suit Sprocket **if** Sprocket's voice is designed as a friendly
  robot/character voice rather than literally child-sounding — this is a
  live design question (what does Sprocket actually sound like?), not
  something this research settles.
- **Licensing**: paid plans include a commercial license for the voices
  ElevenLabs does allow, with standard restrictions (can't resell the
  tool itself or build a competing TTS product from the output).

### Amazon Polly
- **Child voice availability**: Polly explicitly offers a named **"Child"
  voice** (child-like American female) among its 100+ voices — the only
  major cloud-TTS vendor in this scan with an official, named child voice
  product.
- **Pricing**: usage-based, $4/million characters (Standard tier) up to
  $16/million (Neural) — a one-time generation of a finite scripted line
  set would be inexpensive in absolute terms even at Neural quality.
  12-month free tier includes 5 million standard characters.
- **Fit for Path B**: strong on paper (official child voice, cheap
  one-time generation cost, no subscription commitment) — but AWS's exact
  terms for **perpetual reuse of pre-generated output as shipped static
  assets in a commercial app** were not directly confirmed in this pass
  (standard cloud-TTS terms typically grant the customer rights to the
  generated audio output, but this needs direct confirmation against
  AWS's current service terms before relying on it). **[unverified — needs
  direct ToS confirmation]**

### Google Cloud TTS
- **Pricing**: matches Polly closely ($4/million WaveNet-tier, up to
  $30/million for the newest generative "Chirp 3: HD" tier).
- **Child voice availability**: not confirmed in this pass whether Google
  Cloud TTS has a named child-specific voice comparable to Polly's
  — no equivalent explicitly surfaced in search results. **[unverified —
  not confirmed either way]**
- **Fit for Path B**: plausible on pricing, but the child-voice-availability
  gap above means Polly is the stronger lead among the two major cloud
  providers for this specific need.

## What This Changes In The Plan

- **Narrows Open Decision #12 (TTS vendor) to a real shortlist rather than
  an open-ended search**: SpeechGen and Amazon Polly's "Child" voice are
  the two strongest candidates for Path B specifically (pre-generate once,
  ship static assets) — SpeechGen wins on licensing simplicity and
  cost-predictability (pay-once, license included), Polly wins on having
  a purpose-built named child voice from a major, well-documented cloud
  vendor. Narakeet is a solid third option if the widest voice/language
  selection turns out to matter (e.g., for future localization, Open
  Decision #10).
- **Firmly rules out ElevenLabs for a literally child-sounding Sprocket
  voice** — this is a hard vendor policy, not a pricing/quality tradeoff,
  so it should be treated as settled rather than revisited unless
  Sprocket's voice direction changes toward an adult/character voice
  rather than child-like.
- **Recommends a listening-test step before finalizing**: this research
  pass can compare licensing/pricing/policy from vendor documentation, but
  **cannot judge actual voice quality/fit for Sprocket's character** — that
  needs a hands-on comparison (generate a few sample lines from
  SpeechGen's child voices and Polly's "Child" voice, listen, decide) as
  a concrete Phase 2 task, not something resolvable by more research.

## Unverified / Needs Follow-Up

- Amazon Polly's exact commercial-reuse terms for pre-generated,
  perpetually-shipped static audio (as opposed to live runtime API calls)
  were not directly confirmed against AWS's current service terms.
  **[unverified — confirm against AWS ToS before committing]**
- Google Cloud TTS's child-voice availability was not confirmed either way.
  **[unverified]**
- No actual audio samples were generated or compared in this research
  pass — the comparison above is licensing/pricing/policy only, not voice
  quality. **[quality comparison still needed — a Phase 2 task, not a
  research task]**
- SpeechGen and Narakeet's licensing pages were read via search-result
  summaries, not the full original terms documents — worth a direct read
  of the actual terms pages before a final commercial commitment.
  **[summarized from search snippets, not full original-document review]**
