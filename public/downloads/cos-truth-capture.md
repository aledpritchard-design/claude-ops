# skill.cos-truth-capture

**Status:** Todo · proposed, not yet drafted
**Category:** Skill
**Proposed:** 2026-05-28

---

> *This document is a placeholder for a proposed skill. No draft exists yet. The content below captures why this skill was proposed and what it should do — to be expanded into a full SKILL.md when authored.*

## What this skill would do

Encode the procedure for writing a **truth capture** (`tc.*`) from a build, role, or project — following the cOS `tc_template`, sourcing facts from real evidence (transcripts, logs, the work itself), and applying the writing discipline that keeps the output traceable and useful.

## When it would trigger

Any request to write or update a `tc.*` document — "let's capture this role as a truth capture," "write up the website build," "turn this into a tc," or when starting a case study and finding the underlying tc is missing or incomplete.

## Why it's a strong candidate

There's a real procedure here that I had to reconstruct manually when writing `tc.website-build`:

* Read the `tc_template` first to follow the structure exactly
* Verify facts against the source transcripts/evidence **before writing a word** — not after
* Follow the framing discipline: own the verbs, no inflation, traceable claims, record-don't-interpret
* Apply the tags taxonomy correctly
* Match the tone from `cos.tov`

The non-obvious rules — especially "verify against source before writing" — are exactly what a skill should encode. The failure mode without it is writing plausible-sounding content instead of checking what actually happened, which nearly happened on the website-build tc.

## What it would reference

* `tc_template` (the structural template — in cOS.Content or cOS.System)
* `cos.tov` (tone)
* `cos.transformation-patterns` (for the tags taxonomy)
* Source-of-truth discipline rules from `cos-linear-conventions` (the "don't fabricate" principle)

## Open questions before authoring

* Should this skill cover the *qualification* step (is this work even worth a tc?) or assume that's already decided?
* How does it interact with `cos-case-study` — does the truth capture skill stop at the tc, or does it also include "now flag if a case study should follow"?
* What's the source-evidence handling — does the skill require the user to point at the source explicitly, or can it offer to search transcripts/Linear itself?

## Priority

High among skill candidates. Recommended second after `cos-linear-conventions`. Truth captures are the evidence layer the whole output system depends on — getting them right matters disproportionately.
