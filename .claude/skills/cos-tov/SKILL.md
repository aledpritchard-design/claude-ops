---
name: cos-tov
type: skill
domain: content
surface: claude-skill
status: proposed
gating: public
downloadable: true
summary: "Apply Aled's tone of voice — calm, precise, structurally confident."
---

# skill.cos-tov

**Status:** Todo · proposed, not yet drafted · ⚠️ mechanism question unresolved (may not be a skill at all)
**Category:** Skill (candidate — see note below)
**Proposed:** 2026-05-28

---

> *This document is a placeholder for a proposed skill. No draft exists yet. The content below captures why this was proposed and the question that needs answering before it's built.*

## What this would do

Apply Aled's tone of voice — calm, precise, structurally confident, sentence case, no marketing-speak, outcome before adjective, British spelling — to every written output. Reference: `cos.tov`.

## ⚠️ The mechanism question

This is the one proposed item where **skill may be the wrong shape entirely.** Skills are *triggered procedures* — they load when something specific is being done. Tone of voice is the opposite: it's a **constant constraint** that applies to every written word in every context, all the time. Triggering only when a particular task is recognised would mean tone discipline silently falls off everywhere else.

Three plausible mechanisms:

1. **Skill** — convenient to author and version, but only loads on trigger. Risks tone drifting in untriggered contexts.
2. **Writing style** (the claude.ai styles feature) — designed for exactly this: a constant stylistic constraint applied to all output. Most natural fit.
3. **User preferences** — sets it as a project- or account-level default. Always-on, but less expressive than a style.

The likely right answer is **a writing style backed by the `cos.tov` Linear doc as the source of truth**, with `cos.tov` itself being the canonical reference that anyone (or any agent) reads when they need the detail. No skill needed.

## What it would reference

* `cos.tov` (the canonical tone-of-voice doc, in cOS.System) — this stays canon regardless of which mechanism is chosen for application

## Decision needed

Resolve the mechanism question before building. The work after that decision is:

* **If style/preference:** translate `cos.tov` into the chosen mechanism's format, no separate "skill" doc needed (this placeholder can be archived).
* **If skill:** acknowledge the always-on limitation and design the skill description to trigger broadly enough to compensate.

## Priority

Low — and may not need building at all. Resolve the mechanism question first, then act.
