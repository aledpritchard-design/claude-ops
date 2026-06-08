---
name: ops-retro
description: Turn friction observed while running Aled's skills, tasks, and routines into proposed improvement tickets in Linear (Apps / os.Claude, Backlog). Use this whenever running the ops-retro routine, or when Aled asks to review, tidy, retro, or improve his skills/routines, asks "what could be better about how Claude is run", or pastes a transcript and asks what could be fixed or optimised. Also use it as the final step of any other skill, to capture that run's friction. Proposes only — never edits a SKILL.md or any canon. Apply this rather than ad hoc tinkering, so improvements land as refinable tickets Aled can approve.
---

# ops-retro

A retro routine for the operating system itself. It turns friction — encountered while running a skill, or spotted when reviewing one — into proposed Backlog tickets in Apps / os.Claude. It changes no skill, routine, doc, or other canon: Aled is the gate (per linear-conventions, detected drift or a proposed change is raised as a ticket assigned to Aled, never applied silently).

There is no intermediate log or inbox. Recommendations go straight into the os.Claude Backlog, deduped against what's already there.

## Two entry points, one behaviour

1. Embedded — the final step of another skill points here: "On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill." That run files its own findings.
2. On demand / scheduled — run in chat ("Run ops-retro", or paste a transcript and ask what to fix), or as a scheduled task that mines recent sessions.

Both do the same thing: spot friction, dedupe, file proposals.

## Behaviour

Scope: how Claude is operated — skills, routines, tasks, agent instructions. Home for proposals: Apps / os.Claude. Never files into Pipeline.

1. Spot. Identify friction worth fixing: a redundant or wrong query, a dead-end, a wrong assumption, a missing convention, an ambiguous instruction, a place the wording could be tightened. When embedded, this is the friction from the current run; on demand, it's whatever Aled pointed at, a pasted transcript, or signals mined from recent sessions (retries, "let me re-check", corrected assumptions).
2. Dedupe. Before filing, search os.Claude Backlog for an existing OPS: / FIX: / DRIFT: ticket covering the same thing. If found, add a comment to it (another instance, with date) rather than open a duplicate.
3. File. One Backlog ticket per distinct opportunity, standard shape (per linear-conventions): title prefix OPS: (optimisation) / FIX: (defect) / DRIFT: (canon vs reality); Objective; Why this matters (note if recurring); Proposed change (the specific edit and exactly which skill/file/section it touches); Notes for Aled; On completion ("refine, then move to Todo"). Labels: type:task (or type:bug) + work:configuration + executor (default exec:human; agent:cc-exec only for a clean coded change with acceptance criteria embedded, Pattern A). State Backlog. Assignee Aled. Priority by severity — recurring/blocking High; one-off papercut Low/Medium.
4. Report. Short chat summary: tickets filed (ID, title), instances merged, anything skipped. No preamble, no sign-off. When embedded, keep to a one-line note so it doesn't bury the host skill's output.

## Guardrails

- Propose, never apply. No edits to any SKILL.md, routine doc, or canon. The output is tickets.
- One opportunity per ticket. Don't bundle unrelated fixes; don't split one fix across tickets.
- Calibrate to evidence. A single observation is a Low-priority papercut, not a redesign. Count instances before escalating priority.
- No ticket for nothing. A clean run files nothing.

## Tone

Calm, precise, sentence case, British spelling, no exclamation marks, outcome before adjective. (cos.tov.)

## Setup (scheduled run)

- Claude Code Desktop / Cowork -> Schedule -> New remote task (cloud). Weekly, or after a known batch of runs.
- Connector: Linear only. No repo, no code.
- Routine prompt: "Run the ops-retro skill."

## Embedding in other skills

Add one line as the final step of a skill: "On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill." Keep the rules here, not in each skill. Only paste a compact version into a skill that runs where ops-retro won't be loaded alongside it.
