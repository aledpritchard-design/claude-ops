---
name: cos-article
type: skill
domain: content
surface: claude-skill
status: proposed
gating: public
downloadable: true
summary: "Procedure for writing long-form articles for the careerOS writing surface."
---

# skill.cos-article

**Status:** Todo · proposed, not yet drafted · **medium candidate** (build only if the pattern recurs)
**Category:** Skill
**Proposed:** 2026-05-28

---

> *This document is a placeholder for a proposed skill. No draft exists yet. The content below captures why this skill was proposed and whether it warrants building.*

## What this skill would do

Encode the procedure for writing long-form articles for the careerOS writing surface (and downstream syndication) — following `cos.article-specs`, grounding the argument in real evidence (typically a truth capture or playbook), holding the operator's tone, and avoiding the common failure modes of thought-leadership prose.

## When it would trigger

"Write an article on X," "draft the operator-led AI execution piece," "let's turn this into long-form" — anything where the output is article-length prose for the writing section of the website or for syndication.

## Why it's a *medium* candidate (not high)

`cos.article-specs` exists as a detailed Linear doc covering structure, voice, evidence handling, and the failure modes to avoid. As with `cos-case-study`, a skill on top of an already-thorough spec may be thin.

The reason to hold off: there's exactly one article queued so far (COS-187, "the judgement is the job"). Write it, see what's hard, then decide whether a skill earns its place. **Premature skills based on hypothetical recurrence tend to encode the wrong patterns.**

## What it would reference

* `cos.article-specs` (the long-form writing spec)
* `cos.tov` (tone)
* The truth capture / playbook / source the article is grounded in
* The relevant transformation pattern (Pattern 07 for the queued article)

## Open question

Same as `cos-case-study`: **does this skill do work above and beyond the specs?** Hold off until at least one article has been written and the failure modes are visible.

## Priority

Medium. Build only after writing 1–2 articles surfaces recurring problems a skill would prevent.
