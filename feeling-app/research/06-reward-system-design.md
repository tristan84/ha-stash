# Research Note 06: Reward-System Design (Process vs. Outcome, Streaks)

Research agenda item 6 (PLAN.md §8). Compiled 2026-09-21 via live web search.
Directly informs Open Decision #3 (reward mechanic specifics) and
Principle 2 (process over outcome).

## Sources

- [Corpus & Lepper — The Effects of Person Versus Performance Praise (Reed College)](https://www.reed.edu/psychology/motivation/assets/downloads/Corpus_Lepper_2007.pdf)
- [Haimovitz & Corpus — Effects of Person Versus Process Praise on Student Motivation (Reed College)](https://www.reed.edu/psychology/motivation/assets/downloads/Haimovitz_Corpus_2011.pdf)
- [ScienceDirect — The 'praise balance': Uncovering the optimal recipe for mastery motivation in preschoolers](https://www.sciencedirect.com/science/article/abs/pii/S0193397323000977)
- [UNCW (Kelley & Hungerford) — Person Versus Process Praise and Criticism](https://people.uncw.edu/hungerforda/infancy/pdf/person%20versus%20process%20praise%20and%20criticism.pdf)
- [Oxford Learning — Praising Children for Effort Rather Than Ability](https://oxfordlearning.com/praising-children-for-effort-rather-than-ability/)
- [Yu-kai Chou — Streak Design: Motivation Without Burnout](https://yukaichou.com/gamification-analysis/streak-design-gamification-motivation-burnout/)
- [routinery.app — Micro-Rewards vs. Streaks: What the Adherence Research Shows (2026)](https://www.routinery.app/blog/micro-rewards-vs-streaks-adherence-science)
- [The Brink — The Dark Psychology Behind Your Everyday Apps](https://www.thebrink.me/gamified-life-dark-psychology-app-addiction/)
- [PMC — Using Mobile Health Gamification to Facilitate CBT Skills Practice in Child Anxiety Treatment (open clinical trial)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5968217/)

## Key Takeaways

1. **Process praise vs. person/outcome praise is a well-established,
   directly relevant finding, not just Carol Dweck's general "growth
   mindset" popularization.** Process praise (praising effort, strategy,
   specific behavior — "you worked hard," "you noticed that") produces
   **more intrinsic motivation and better responses to subsequent
   challenge** than person praise (praising fixed traits — "you're so
   smart," or, translated to this app's domain, "you're so calm"). This
   effect holds **across early-to-middle childhood** — preschoolers,
   5–6-year-olds, and fifth-graders all show it — which covers this
   project's likely age range regardless of how Open Decision #2 is
   settled.

2. **The effect is strongest exactly where it matters most for this app:
   after failure/struggle, not after success.** Studies found "few
   motivational differences" between praise types after a success, but
   process-praised children handled **failure** more constructively —
   less self-blame, less "helpless" response — than person-praised
   children. This is a strong, direct validation of Principle 2: since
   "Help me" mode (PLAN.md §4.3) is specifically the hard-moment,
   struggling-child context, reward language used there should be
   unambiguously process-framed ("you tried a tool" / "you noticed
   something was happening") — this is exactly the situation where the
   research shows the choice matters most, not a generic nicety.

3. **There's a documented "praise balance" concept** (2023 preschooler
   study) suggesting an *optimal mix* rather than pure-process-praise-always
   — worth knowing this isn't a fully settled "100% process, 0% anything
   else" prescription, though the direction (favor process over
   person/outcome) is consistent across sources. **[the specific optimal
   ratio from that study was not extracted in this pass — flagged below]**

4. **Streak mechanics carry real, well-documented downside risk, directly
   confirming the caution already flagged in PLAN.md §4.4/§9.** Streaks
   run on loss aversion — they work by making a missed day feel like
   losing something already earned. Sources converge on: streaks can
   simultaneously build habits *and* cause anxiety, guilt, and burnout,
   especially when a single miss is treated harshly ("one miss like a
   funeral"). One meta-analysis figure found gamified interventions'
   effect fell by roughly half (~1.91 to ~1.37 relative risk) within six
   months as novelty wore off — suggesting even where streak/gamification
   mechanics work, the effect **is not durable** without careful design.

5. **This is especially sharp for this app's specific audience.** Kids
   with ADHD or autism (PLAN.md §2) often already struggle with
   consistency and executive function — a streak mechanic that resets to
   zero on a missed day risks specifically punishing the exact days a
   dysregulated child most needs the app, which cuts directly against
   Principle 3 (skill-building, not something that makes hard days feel
   like failures). No source specifically studied streaks in
   neurodivergent children — this is an inference from the general
   findings plus the project's stated audience, not a directly-sourced
   claim. **[inference, not directly sourced]**

6. **Gamification is not uniformly bad for children's mental-health apps**:
   one open clinical trial used mobile gamification to support CBT skills
   practice in child anxiety treatment, and a separate large RCT of a
   gamified resilience/mental-health app (eQuoo) reported positive
   outcomes in a student population — so the concern here is specifically
   about *streak/loss-aversion* mechanics, not gamification broadly.
   Reward/progress feedback framed around skill-building (not
   loss-avoidance) has real precedent for working.

## What This Changes In The Plan

- **Strongly confirms Principle 2 and resolves the "streaks" question in
  Open Decision #3 toward "no punitive streaks."** Recommend: if any
  continuity/progress mechanic is used at all, it should be framed as
  cumulative growth that **never resets or regresses** (e.g., Sprocket's
  own visible "growth," a collection that only ever adds, never a counter
  that breaks) rather than a streak that can be "lost." This is a
  recommendation for your sign-off, not a lock-in.
- **Gives concrete, evidence-backed language guidance for reward moments**:
  reward copy/animations should name the *behavior* ("you noticed your
  heart was racing," "you tried the breathing tool") rather than a trait
  or state ("you're so calm," "great job feeling happy") — directly
  operationalizes Principle 2 into copywriting guidance for Phase 2
  content design.
- **Validates that gamification itself is not the risk — the specific
  mechanic (loss-averse streaks) is.** This means Sprocket's "growth"
  reward concept (already floated in PLAN.md §4.4) is well-supported by
  this research, more so than a generic streak/points system would be.

## Unverified / Needs Follow-Up

- The 2023 "praise balance" study's specific optimal mix of praise types
  was not extracted in this pass — only its existence and general
  direction. **[unverified specifics]**
- No source directly studied reward/praise mechanics in autistic or
  ADHD children specifically — all the process-vs-person-praise evidence
  above is from general child-development research, not this project's
  specific population. Given research note 02 already found autism/ADHD
  emotion-regulation evidence is itself mixed/thin, this is a second layer
  of "general child research, not population-specific" caveat worth
  keeping in mind together. **[gap — population-specific reward research
  not found]**
- The eQuoo and CBT-gamification trials cited under point 5 are about
  gamification in *treatment* contexts, not skill-building apps —
  relevant as a directional signal that gamification isn't inherently
  harmful, but not a direct precedent for this app's non-clinical
  positioning (Principle 3). **[used only as a directional counterpoint,
  not a direct precedent]**
