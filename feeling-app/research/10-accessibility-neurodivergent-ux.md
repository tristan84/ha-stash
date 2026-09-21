# Research Note 10: Accessibility & Neurodivergent-Friendly UX Standards

Research agenda item 10 (PLAN.md §8), the last of the original Phase 0
research agenda. Compiled 2026-09-21 via live web search.

## Sources

- [UX Magazine — Designing Inclusive and Sensory-Friendly UX for Neurodiverse Audiences](https://uxmag.com/articles/designing-inclusive-and-sensory-friendly-ux-for-neurodiverse-audiences)
- [accessibilitychecker.org — The Principles of Neurodivergent UX Design Every Designer Should Know](https://www.accessibilitychecker.org/blog/neurodivergent-ux-design/)
- [accessiBe — Designing for Neurodivergent Users: 8 Practical Tips](https://accessibe.com/blog/knowledgebase/how-to-design-digital-environments-for-people-with-neuro-divergency)
- [Stéphanie Walter — Neurodiversity and UX: Essential Resources for Cognitive Accessibility](https://stephaniewalter.design/blog/neurodiversity-and-ux-essential-resources-for-cognitive-accessibility/)
- [WCAG.com — How WCAG benefits everyone: A focus on neurodiversity and accessibility](https://www.wcag.com/blog/digital-accessibility-and-neurodiversity/)
- [devqube.com — Neurodiversity In UX: 7 Key Design Principles](https://devqube.com/neurodiversity-in-ux/)

## Key Takeaways

1. **Sensory control needs to be a first-class, foundational design
   principle for this app, not a settings-menu afterthought.** The
   consistent recommendation across sources: treat sensory sensitivity
   (light, motion, sound) as foundational, not an edge case. Concretely:
   **audio/video off by default** (not autoplay), with a **visible,
   easy-to-reach toggle to stop all non-essential motion/animation**
   (parallax, flashing, decorative motion can cause genuine distress or
   dizziness, not mild annoyance). This is a direct, actionable
   requirement for Sprocket's UI framework, not just Sprocket's content —
   it needs to be built into the app shell from Phase 2/3, not bolted on
   later.

2. **Predictability of layout is explicitly called out as a design
   requirement**, not just good practice generally: keep navigation,
   key controls, and layout **in the same position across every screen**.
   This has a specific, direct implication for the "Help me" mode
   (PLAN.md §4.3): its one-tap entry point and in-mode controls should be
   in a **fixed, unchanging location app-wide**, since a child reaching
   for it in a hard moment is exactly the scenario where layout
   unpredictability does the most harm.

3. **Literal language matters, specifically for autistic users**: avoid
   jokes, sarcasm, and idiom, since ambiguity/figurative language can be
   read literally and cause confusion. This is a direct content-design
   constraint for Sprocket's dialogue and any copy in calm-moment games —
   worth adding as an explicit content-style rule for Phase 2, especially
   since Sprocket's "friendly companion" personality could easily drift
   toward jokes/banter by default without this constraint in mind.

4. **WCAG is necessary but explicitly insufficient for this audience.**
   One source states this plainly: WCAG does *not* address excessive
   visual/auditory stimulation, which is specifically the autism/ADHD-relevant
   gap. This means "WCAG compliant" cannot be treated as equivalent to
   "neurodivergent-friendly" for this project — WCAG should be a floor
   (screen-reader compatibility, contrast, etc.), with the
   sensory/predictability/literal-language principles above layered on
   top as a *separate*, explicitly-tracked requirement set, not assumed
   to be covered by accessibility compliance alone.

5. **Direct involvement of neurodivergent people in the design process is
   a repeated recommendation**, not just a values statement — sources
   frame it as revealing barriers that non-neurodivergent designers/researchers
   would otherwise miss. This has a concrete implication for Phase 2: plan
   for actual testing/feedback sessions with autistic and ADHD children
   (and ideally their parents/therapists) during content design, not just
   internal design review followed by a general-audience usability pass.

## What This Changes In The Plan

- **Adds a concrete, testable UI requirement set to Phase 2/3** that
  PLAN.md doesn't currently spell out explicitly: motion/animation
  kill-switch, no autoplay audio/video, fixed navigation/control
  positions app-wide (especially for Help Me mode), literal
  non-sarcastic dialogue for Sprocket. Recommend adding these as explicit
  acceptance criteria for Phase 2 content/UI design, not left implicit
  under the general "special-needs-inclusive" framing currently in PLAN.md
  §2/§3.
- **Reframes "accessibility" for this project as two separate tracks**:
  standard accessibility (WCAG — screen readers, contrast, etc., useful
  for parents/general compliance) and neurodivergent-specific
  sensory/predictability/literalness design (useful for the core child
  audience) — worth keeping these visibly distinct in any future design
  spec so neither gets silently treated as covering the other.
- **Strengthens the case for involving autistic/ADHD kids (and
  parents/clinicians) directly in Phase 2 testing**, not just at a final
  QA pass — recommend adding this as an explicit Phase 2 roadmap task
  rather than assuming it happens informally.
- **This closes out the original seven-item follow-up list from PLAN.md
  §8** — items 4 through 10 are now all researched (see notes 04–10);
  §8's status table should be updated to reflect this (done in the
  accompanying PLAN.md edit).

## Unverified / Needs Follow-Up

- All sources in this pass were general UX/accessibility blogs and
  practitioner sites, not peer-reviewed research — unlike notes 01/02,
  this topic did not surface primary academic sources in this search
  pass. The *principles* found are consistent across multiple independent
  practitioner sources, which is reasonable corroboration, but this note
  should be treated as **practitioner consensus, not academic evidence**,
  and flagged as such. **[practitioner-sourced, not peer-reviewed]**
- No autism/ADHD-specific empirical usability studies (e.g., eye-tracking
  or task-completion studies with neurodivergent children specifically)
  were found or reviewed in this pass — the recommendations above are
  general neurodivergent-UX guidance, not validated against this
  project's exact app type (a kids' skill-building/companion app).
  **[gap — no population-and-product-specific empirical study found]**
- Specific WCAG conformance level (A/AA/AAA) appropriate for this project
  was not determined — flagged as a Phase 2/3 decision, not researched
  here.
