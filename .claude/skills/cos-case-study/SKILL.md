---
name: cos-case-study
type: skill
domain: content
surface: claude-skill
status: proposed
gating: public
downloadable: true
summary: "Procedure for writing cOS case studies sourced from truth captures."
---

# skill.cos-case-study

**Status:** Todo · proposed, not yet drafted · **medium candidate** (build only if the pattern recurs)
**Category:** Skill
**Proposed:** 2026-05-28

---

> *This document is a placeholder for a proposed skill. No draft exists yet. The content below captures why this skill was proposed and whether it warrants building.*

## What this skill would do

Encode the procedure for writing case studies in the cOS system — sourcing from a truth capture, picking the right format (snapshot / full / article / cv-entry per `cos.output-specs`), applying the writing standard, and validating against the quality check.

## When it would trigger

"Write a case study for X," "compress the JPMC case to a snapshot," "draft the cv-entry version of the website build" — any output generation that maps to the case study formats.

## Why it's a *medium* candidate (not high)

You already have `cos.case-study-task-standard`, `cos.case-study-qualification`, and `cos.output-specs` as detailed Linear docs. If those specs are thorough enough that following them is the procedure, a skill on top would be thin — it would say "for case studies, read these specs first, source from the tc, apply `cos.tov`" and not much more.

The reason to hold off until later: **premature skills encode the wrong thing.** Worth writing a couple of case studies (COS-186 is one queued) and seeing where things actually go wrong before deciding whether a skill earns its place above the specs.

## What it would reference

* `cos.output-specs` (format definitions)
* `cos.case-study-task-standard` (writing standard)
* `cos.case-study-qualification` (deciding *whether* something becomes a case study)
* `cos.tov` (tone)
* The truth capture being drawn from

## Open question

The honest open question: **does this skill actually do work above and beyond the specs?** Defer the build until that question can be answered with evidence — write a few case studies, see what's hard, then decide.

## Priority

Medium. Lower than `cos-linear-conventions`, `cos-truth-capture`, `website-build-delivery`. Build only if recurring failure modes show up when writing case studies that a skill would prevent.
