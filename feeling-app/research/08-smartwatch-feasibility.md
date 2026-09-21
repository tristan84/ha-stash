# Research Note 08: Smartwatch Feasibility ("Revving Up" Nudge)

Research agenda item 8 (PLAN.md §8). Compiled 2026-09-21 via live web search.
Informs Open Decision #7 (smartwatch platform/timing) — this feature is
explicitly deferred past v1 (PLAN.md §6, §10), so this note is exploratory,
not a build plan.

## Sources

- [Android Developers — Health Services on Wear OS](https://developer.android.com/health-and-fitness/health-services)
- [Android Developers — Integrate a Wear OS module](https://developer.android.com/health-and-fitness/fitness/basic-app/integrate-wear-os)
- [mindbowser.com — Build Your First Wear OS Health Tracking App](https://www.mindbowser.com/wear-os-health-tracking-app-guide/)
- [gurzu.com — Decoding the Wear OS ecosystem](https://gurzu.com/blog/decoding-the-wear-os-ecosystem/)
- [thryve.health — Health Data Privacy in Kids' Wearables: Risks and Best Practices](https://www.thryve.health/blog/health-data-privacy-kids-wearables)
- [Privacy International — Children's privacy at risk from smart watches](https://privacyinternational.org/examples/1904/childrens-privacy-risk-smart-watches)
- [myticktalk.com — Is a Kids Smartwatch Safe? Privacy, Data Security and COPPA Explained (2026)](https://www.myticktalk.com/blogs/news-1/guides-kids-smartwatch-privacy-data-security)
- [PMC — Exploring the Use of Smartwatches and Activity Trackers for Health-Related Purposes for Children Aged 5 to 11: Systematic Review](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11811667/)
- [rd4c.org — Youth Voices: Who's Really Watching the Hidden Data Risks of Children's Phone Watches](https://rd4c.org/articles/youth-voices-whos-really-watching-the-hidden-data-risks-of-childrens-phone-watches/)

## Key Takeaways

1. **The technical building blocks exist and are reasonably mature.**
   Google's Health Services API on Wear OS (Wear OS 3+) provides
   power-efficient heart-rate and other sensor access specifically
   designed for third-party apps, requiring the `BODY_SENSORS` permission.
   This is the right API layer to target rather than raw sensor access —
   it's explicitly built for the "app needs periodic health signal, not
   constant raw streaming" use case, which matches a "nudge when revving
   up" feature better than continuous biofeedback gameplay (contrast with
   Mightier's approach, note 03, which does need continuous streaming for
   its real-time gameplay mechanic).

2. **Battery is a real constraint, actively managed by the platform, not
   just a vague concern.** Health Services is specifically optimized for
   power efficiency, and Wear OS enforces background-activity restrictions
   (App Standby Mode) that limit wake locks and high-frequency background
   sensor access — continuous monitoring needs a foreground service.
   Practical implication: a passive "revving up" nudge should use
   **periodic/smart sampling, not continuous streaming**, both because the
   platform pushes toward that pattern and because continuous heart-rate
   monitoring is independently confirmed to drain battery quickly. This
   maps well onto the feature as already scoped (a nudge, not a real-time
   game) — the "passive nudge, not biofeedback game" framing in PLAN.md §6
   is technically the *easier* path on Wear OS, not just the more
   conservative product choice.

3. **Children's wearables have a documented, serious privacy and security
   track record problem — but almost entirely in a different product
   category than what's being proposed.** The negative findings (children's
   smartwatches hijacked by strangers for eavesdropping/tracking; Germany
   banning certain kids' smartwatches as covert listening devices;
   location/communication/payment/voiceprint data collection) are
   overwhelmingly about **standalone children's phone-watches** —
   GPS-tracking, calling, messaging devices marketed directly to parents
   for child location/communication monitoring — not about a companion
   sensor app running on a general-purpose Wear OS watch for a body-awareness
   nudge feature. This is an important distinction: **this project's
   planned smartwatch feature is a fundamentally different risk profile**
   (no location tracking, no communication features, no microphone/eavesdropping
   surface implied by the feature description) than the products driving
   most of the negative press found in this scan. Worth being explicit
   about this distinction in any future marketing, since "kids' smartwatch"
   as a category has a genuinely bad privacy reputation this project
   should not be casually associated with.

4. **Regulatory exposure still applies, just narrower than the phone-watch
   case.** COPPA's interpretation explicitly includes health/location data
   as "personal information" requiring verifiable parental consent (per
   note 04) — even a narrowly-scoped heart-rate nudge feature, if it
   involves any data leaving the watch/paired device, would trigger the
   same consent machinery discussed in note 04. This reinforces note 04's
   recommendation: **keep this feature entirely on-device/on-watch, with
   no transmission of raw sensor data anywhere** (not even to a paired
   phone for storage) if at all possible — process the signal locally on
   the watch and only ever surface a nudge, never a data log.

5. **There is at least a systematic-review-level evidence base for
   smartwatches/activity trackers in children generally** (ages 5–11) for
   health-related purposes — suggesting the general concept of a
   child-worn wearable for a defined health/behavior purpose is an
   established enough area to have review-level literature, not a fringe
   idea. **[content of that specific review was not extracted in this
   pass — noted as existing, not summarized]**

## What This Changes In The Plan

- **Confirms the "passive nudge, not biofeedback game" framing already in
  PLAN.md §6 is the right call technically**, not just the more
  conservative product choice — it aligns with what Wear OS's Health
  Services API and battery-management model actually make easy.
- **Adds a sharper privacy requirement to Open Decision #7**: process
  sensor data on-watch only, never transmit raw signal off-device — this
  is a stronger, more specific version of Principle 1 than the plan
  currently spells out for this feature, worth carrying into PLAN.md §6
  explicitly once this decision is actually taken up (still deferred past
  v1, not being locked in now).
- **Suggests explicitly distancing this feature, in any future marketing,
  from the "kids' smartwatch" product category** — given that category's
  documented privacy/security reputation, this project should position the
  feature as "an optional companion sensor for a skill-building app," not
  language that could be confused with GPS/communication kids'-watch
  products.

## Unverified / Needs Follow-Up

- This entire feature remains **deliberately deferred past v1** per the
  existing roadmap (PLAN.md §10) — this note is exploratory groundwork,
  not a validated build plan. No hands-on technical validation (a spike,
  analogous to the Capacitor spike in note 05) has been done for this
  feature.
- The specific systematic review on children's smartwatch use (PMC,
  ages 5–11) was identified but not read in depth — its actual findings on
  efficacy/appropriate use are not summarized here. **[flagged, not yet
  researched in depth]**
- Whether Wear OS is the only realistic platform, or whether other
  wearable ecosystems (e.g., a hypothetical child-specific sensor device)
  should be considered, was not investigated — this note only researched
  Wear OS since it's the natural extension of an Android-tablet-first
  product (PLAN.md §6). **[Wear OS assumed as the default target,
  not independently justified against alternatives]**
