# Research Note 04: Privacy & Regulatory Landscape for Children's Apps

Research agenda item 4 (PLAN.md §8). Compiled 2026-09-21 via live web search.
Covers COPPA (US), GDPR-K (EU), Google Play Families Policy (already
touched on in note 03), and Apple's Kids Category rules.

## Sources

- [Usercentrics — COPPA Compliance: key requirements for 2026](https://usercentrics.com/us/knowledge-hub/coppa-compliance/)
- [Respectlytics — New COPPA Rules 2026: Mobile App Compliance Before April 22](https://respectlytics.com/blog/coppa-rules-2026-mobile-app-compliance/)
- [blog.promise.legal — COPPA Verified Parental Consent in 2025: The 8 Approved Methods](https://blog.promise.legal/coppa-verified-parental-consent-methods/)
- [Responsible Data for Children — Youth Voices: Who's Really Watching the Hidden Data Risks of Children's Phone Watches](https://rd4c.org/articles/youth-voices-whos-really-watching-the-hidden-data-risks-of-childrens-phone-watches/) (cites the FTC's finalized COPPA Rule amendments, Jan 2025, compliance deadline April 22, 2026)
- [SuperAwesome — The GDPR-K Toolkit for Kids Publishers, Part 6: Verifiable Parental Consent](https://www.superawesome.com/blog/the-gdpr-k-toolkit-for-kids-publishers-part-six-obtaining-verifiable-parental-consent/)
- [gdpr-info.eu — Art. 8 GDPR, Conditions applicable to child's consent](https://gdpr-info.eu/art-8-gdpr/)
- [Pandectes — Understanding Children's Online Privacy Rules Around COPPA, GDPR-K, and Age Verification](https://pandectes.io/blog/childrens-online-privacy-rules-around-coppa-gdpr-k-and-age-verification/)
- [Apple Developer — App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [ConductAtlas — Kids Category Data Restrictions (Apple)](https://conductatlas.com/platform/apple/apple-app-store-review-guidelines/kids-category-data-restrictions/)
- [theapplaunchpad.com — iOS App Store Review Guidelines 2026](https://theapplaunchpad.com/blog/ios-app-store-review-guidelines/)
- Google Play Families Policy sources already cited in `03-competitor-scan.md`.

## Key Takeaways

1. **COPPA (US) has just been substantially rewritten**, per the FTC's
   finalized amendments (announced January 2025), with a **compliance
   deadline of April 22, 2026** — this is imminent, not distant, relative to
   this project's timeline. Key changes relevant to this app: bundled
   consent ("one checkbox covers analytics + ads + third-party sharing") is
   **no longer compliant** — each data-use purpose needs its own consent
   mechanism. COPPA applies to anyone under 13 and requires **verifiable**
   parental consent (not just "we asked and they clicked yes") before
   collecting, using, or disclosing a child's personal information.

2. **On-device-only design sidesteps most of COPPA's hardest requirements.**
   Approved verifiable-consent methods include things like facial-recognition-ID-match
   or "email plus" confirmation — all of this machinery exists specifically
   to handle the case where a child's personal information is being
   *collected and transmitted*. Principle 1 (no child accounts, on-device by
   default) means the app likely **doesn't need most of this machinery for
   v1** — that's the actual strategic value of the on-device requirement,
   not just an abstract privacy preference. Any move toward optional cloud
   sync (Open Decision #6, parent-side data scope) reopens this whole
   compliance surface, which is a very concrete argument for keeping that
   feature explicitly opt-in and minimal.

3. **GDPR-K's age-of-consent threshold varies by EU member state (13–16)**,
   with 16 as the default and member states able to lower it to as low as
   13. This directly affects any EU launch plan and interacts with Open
   Decision #10 (localization scope) — a multi-country EU launch means
   handling *different* consent-age thresholds per country, which is
   non-trivial if the app ever collects any personal data at all, even
   indirectly (e.g., via an account system added later).

4. **Apple's Kids Category has some of the strictest, most specific rules**
   found in this scan: **no third-party analytics, no third-party
   advertising** (with a narrow analytics exception only if the SDK doesn't
   transmit IDFA or any identifiable info), **no behavioral advertising**,
   and contextual ads (if any) must be kid-appropriate. This is a stricter
   bar than COPPA alone and effectively operationalizes Principle 1 into
   concrete App Store review requirements if/when this project ships on
   iOS — worth treating as the **de facto engineering spec** for "no ads,
   no trackers" even though v1 is Android-tablet-first (PLAN.md §6), since
   it's a stricter constraint that's cheap to satisfy from day one if
   architected in from the start.

5. **Google Play Families Policy (from note 03) reinforces the same
   direction**: certified ad SDKs only, no personalized ads, restrictions
   on transmitting device identifiers from children/unknown-age users, and
   (as of 2026) the ad restrictions apply based on **actual user base**, not
   just declared target audience — meaning even a "general audience" app
   that ends up being used significantly by kids can trigger these
   requirements. This is directly relevant since this app's target
   audience unambiguously includes children — there's no ambiguity to
   exploit here, and no reason to try.

## What This Changes In The Plan

- **Strengthens Principle 1 as an engineering requirement, not just a
  values statement.** "No child accounts, on-device by default, no ads, no
  trackers" isn't just ethically preferable — it's the path that avoids
  nearly all of COPPA's verifiable-parental-consent machinery, avoids
  GDPR-K's per-country consent-age handling, and satisfies Apple's Kids
  Category and Google Play Families requirements by construction. Building
  it any other way means building compliance infrastructure this project
  doesn't otherwise need.
- **Open Decision #6 (parent-side data scope) should be resolved toward
  "local-only by default, opt-in sync only, and only if truly needed"** —
  not because it's the safe answer in the abstract, but because the
  regulatory research shows opt-in cloud sync is the one thing in the
  current plan that would reopen COPPA/GDPR-K consent requirements this
  project can otherwise avoid entirely. This is a recommendation, not a
  lock-in — still needs your sign-off per your instruction to confirm
  before locking in open decisions.
- **The April 22, 2026 COPPA deadline** is close enough to this project's
  timeline to be worth tracking explicitly — added as a roadmap
  consideration (see edit to PLAN.md) rather than left implicit.
- **If/when the app expands beyond Android** (PLAN.md's roadmap doesn't
  currently commit to iOS, but doesn't rule it out either), Apple's Kids
  Category ad/analytics rules should be treated as the baseline spec for
  the whole app's SDK/analytics choices from v1, not something to retrofit
  later — cheaper to build once correctly.

## Unverified / Needs Follow-Up

- I have **not** done a formal legal review — this note is a product/
  engineering-facing research summary, not legal advice. Before any launch,
  actual counsel should review COPPA/GDPR-K/Families-Policy compliance
  specifically for this app's final feature set. **[explicitly not legal
  advice]**
- Whether Sprocket's target age range (Open Decision #2, still untouched)
  falls entirely under 13 (triggering COPPA) or could include some
  13+ users changes which rules strictly apply — this note assumed a
  primarily under-13 audience based on the project summary, consistent
  with a "kids" positioning, but this should be confirmed once Open
  Decision #2 is settled.
- Apple App Store submission is not currently in PLAN.md's roadmap (Android
  tablet first) — the Kids Category research here is included pre-emptively
  since it's a useful stricter baseline, not because iOS is confirmed
  in-scope. **[included for engineering-spec value, not because iOS launch
  is decided]**
