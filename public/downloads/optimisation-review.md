# optimisation-review

A weekly review skill with two passes — a **tooling pass** and a **workflow pass** — that surfaces improvement proposals into the os.Claude Backlog. It never edits canon. Every finding becomes a Backlog ticket for Aled to approve and route via the normal cc-pm → exec loop.

> **Enumerating issues at scale:** `list_issues` always returns full description bodies. Filter by `label`+`state`+`project`/`team` on every call; prefer per-label/per-state probes over broad queries; delegate to a subagent for genuinely large sets. See linear-conventions *Enumerating issues at scale*.

---

## Two passes, one skill

### Pass 1 — Tooling

Audit whether the tools in scope are being used well relative to current best practice.

**Tools in scope (first version):** Claude, Linear, GitHub, Vercel, Sanity.

For each tool, consider:

- Are available features being used? (e.g. saved views, automation, webhooks, integrations)
- Are there known best-practice patterns we're not following?
- Are there capability upgrades (new API features, model improvements, plugin releases) that would benefit the loop?
- Is configuration (connectors, permissions, notification settings) set up optimally?

**Capability note:** the tooling pass benefits from web access to fetch current docs and changelogs. If the run has web access, draw on it. If not, work from what's visible in the connected tools and flag where freshness is limited.

### Pass 2 — Workflow

Audit whether the operating shape is correctly structured, using the skill-or-task decision test from the `operating-model` skill.

For each behavioural element (skills, tasks, routines), ask:

- Does it run automatically on a schedule or trigger? → should be a Routine (deployed behavioral skill).
- Does it define repeatable behaviour or reference material? → should be a Skill.
- Is it a one-off action run manually? → should be a Task.
- Is it a named role in the delivery loop? → should be an Agent label.

Also consider:

- Is any skill getting too broad? (candidate to split)
- Is any pair of skills near-identical in behaviour? (candidate to fold)
- Are scheduled-task cadences (hourly, daily, weekly) still appropriate?
- Would a new connector or plugin unlock a meaningful capability?

---

## Behaviour

1. **Tooling pass.** For each tool in scope, gather evidence (connector data, visible configuration, web/docs if available). Identify gaps or improvement opportunities.
2. **Workflow pass.** Read the skill roster in `CLAUDE.md` and the skill files. Apply the decision test from `operating-model`. Identify structural misfits.
3. **Dedupe.** Before filing, search the os.Claude Backlog for an existing OPS:/FIX:/DRIFT: ticket covering the same opportunity. If found, add a comment (another instance, with date) rather than open a duplicate.
4. **File proposals.** One Backlog ticket per distinct opportunity, standard shape (per linear-conventions):
   - Title prefix: `OPS:` (optimisation) / `FIX:` (defect) / `DRIFT:` (canon vs reality)
   - Sections: Objective; Why this matters; Proposed change (specific edit and exactly which tool/skill/file it touches); Notes for Aled; On completion
   - Labels: `type:task` + `work:configuration` + `agent:human` (default); `agent:cc-exec` only for a clean coded change with embedded acceptance criteria (Pattern A)
   - State: Backlog
   - Assignee: Aled
   - Priority: High for recurring/blocking; Low/Medium for one-off papercuts
5. **Report.** Short summary: tickets filed (ID, title), duplicates merged, anything skipped. No preamble.

---

## Guardrails

- Propose, never apply. No edits to any SKILL.md, routine doc, or other canon. The output is tickets.
- One opportunity per ticket. Don't bundle unrelated findings; don't split one finding across tickets.
- Calibrate to evidence. A single observation is Low-priority. Count instances and impact before escalating.
- No ticket for nothing. A clean run files nothing.
- Never files into Pipeline. Scope: ops layer only.
- Human-gated. All proposals go to Backlog with `agent:human`; Aled routes them.

---

## Setup

- Claude Code Desktop / Cowork → Schedule → New remote task (cloud). Weekly cadence.
- Connectors: Linear + GitHub (for the workflow pass); web access recommended for the tooling pass.
- Routine prompt: `Run the optimisation-review skill.`
