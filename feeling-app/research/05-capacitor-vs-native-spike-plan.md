# Research Note 05: Capacitor vs. Native Android — Spike Plan

Research agenda item 5 (PLAN.md §8). Compiled 2026-09-21 via live web search.
This note informs the Phase 1 technical spike (PLAN.md §10) rather than
settling the Capacitor-vs-native decision outright — that decision is
explicitly deferred to the spike itself.

## Sources

- [bacancytechnology.com — Capacitor vs React Native: The 2026 Decision Guide](https://www.bacancytechnology.com/blog/capacitor-vs-react-native)
- [capgo.app — Comparing React Native vs Capacitor](https://capgo.app/blog/comparing-react-native-vs-capacitor/)
- [vp0.com — React Native vs Capacitor in 2026: A Performance Reality Check](https://vp0.com/blogs/react-native-vs-capacitor-2026-performance)
- [edana.ch — Should You Still Choose Capacitor Today? (2025)](https://edana.ch/en/2025/07/31/should-you-still-choose-capacitor-today-for-which-types-of-mobile-projects-does-it-remain-relevant/)
- [nativine.com — Capacitor vs WebView: Which Is Better for Mobile App Development in 2026?](https://nativine.com/blog/capacitor-vs-webview-comparison-2026)
- [github.com/ionic-team/capacitor discussion #3899](https://github.com/ionic-team/capacitor/discussions/3899) — developer-reported real-world performance issues
- [capacitor-community/text-to-speech (GitHub)](https://github.com/capacitor-community/text-to-speech)
- [Capawesome — Speech Synthesis Plugin for Capacitor](https://capawesome.io/plugins/speech-synthesis/)

## Key Takeaways

1. **The core performance tradeoff is real and consistently reported, not
   just theoretical.** Capacitor wraps a web app in a native shell and
   renders through the system WebView, while React Native (and native
   Android) render actual native UI components. Multiple sources
   independently describe the same failure pattern: apps that feel smooth
   as a PWA in a browser show **noticeably worse animation and page-transition
   performance once bundled via Capacitor for Android**, especially on
   older/budget devices and with older WebView versions (one report
   specifically cites WebView 103 producing "a laggy mess" on certain
   devices).

2. **The tradeoff is content-type-dependent, and this app's profile is
   mixed, not clearly on the "safe" side.** The general guidance is:
   Capacitor is fine for content/dashboard/form-style apps; React Native
   (or native) is preferred when the app needs high-frame-rate animation,
   gesture-heavy interaction, or large virtualized lists. This project's
   calm-moment games (PLAN.md §4.2) and Sprocket's character animation are
   plausibly on the *animation-heavy* side of that line — the "content app"
   framing that favors Capacitor does not obviously apply to a
   character-driven kids' game surface. This is the single most important
   finding for the spike: **don't just validate that Capacitor works at
   all — validate it specifically against Sprocket's actual animation and
   interaction style**, not a generic form/content screen.

3. **TTS plugin support for Capacitor is real and mature enough to use.**
   Two maintained options were found: the community
   `capacitor-community/text-to-speech` plugin and Capawesome's Speech
   Synthesis plugin, both wrapping native Android/iOS TTS engines through
   Capacitor's bridge. This directly de-risks the "Sprocket speaks via TTS"
   requirement (PLAN.md §6) on the Capacitor path specifically — this part
   of the plan is not a Capacitor risk.

4. **Capacitor's offline-first story is a genuine strength**, not just
   parity with native: it's specifically recommended for offline-first,
   pure-client-side apps with no backend dependency — which matches this
   project's "no network dependency for the child path" requirement
   (PLAN.md §7, Phase 3) closely.

5. **Longer-term maintenance risk is a real, separate concern from
   performance**: Capacitor apps depend on WebView and JS engine versions
   that vary across Android devices/OS versions, and the plugin ecosystem
   is described as "fragmented" with a need to manually track plugin and
   WebView version compatibility over time. This is a maintenance-burden
   risk for a small team, distinct from the launch-day performance
   question, and should be weighed separately in the spike's go/no-go
   writeup.

6. **Business/organizational context**: Ionic (the company behind
   Capacitor) discontinued new sales of some commercial products (Ionic
   Appflow) in February 2025 and is winding down some commercial-product
   maintenance, while continuing to maintain the open-source Capacitor
   framework itself. This is a signal worth noting for long-term platform
   risk, though it does not appear to threaten the open-source framework's
   continuity directly. **[flag — worth re-checking closer to the spike, as
   this kind of vendor-health signal can shift]**

## What This Changes In The Plan

- **Sharpens the Phase 1 spike's scope** (PLAN.md §10 already calls for
  "a throwaway prototype exercising TTS output, the kind of
  animation/interaction the calm-moment games need, and offline behavior"
  — this note validates that framing directly and argues the
  animation/interaction test is the *most* important of the three, not an
  equal third, since TTS and offline are both already de-risked by this
  research pass).
- **Recommends the spike explicitly test on a lower-end/older Android
  tablet**, not just a current flagship device, given that the reported
  performance problems concentrate on older WebView versions and
  budget/older hardware — a spike that only runs well on a high-end test
  tablet would not actually validate the real risk.
- **Adds a maintenance-burden dimension to the go/no-go decision** (Open
  Decision #5) beyond raw performance: plugin/WebView version-tracking
  overhead over the product's lifetime, not just launch-day feel.
- **Does not settle Open Decision #5** — that stays explicitly for the
  Phase 1 spike itself, per the existing roadmap. This note narrows what
  the spike needs to prove, it doesn't substitute for building it.

## Unverified / Needs Follow-Up

- No source in this pass gave **quantitative** frame-rate or latency
  numbers for Capacitor vs. native on comparable animation workloads —
  everything found was qualitative/anecdotal developer reporting. The
  spike itself should produce this project's own quantitative numbers
  rather than relying on secondhand qualitative claims. **[no hard
  numbers found — spike should generate its own]**
- Ionic's commercial wind-down (Appflow) and its implications for
  long-term Capacitor framework health specifically — not deeply
  investigated, flagged only as a signal worth re-checking before final
  commitment. **[flag, not fully researched]**
- Flutter was mentioned only in passing by one source (as a performance
  comparison point) and was not independently researched here, since it
  isn't the leading tech choice per PLAN.md §6 — noting only so it isn't
  silently ruled out without ever having been looked at, if the Capacitor
  spike fails. **[not researched — would need its own pass if Capacitor
  fails the spike]**
