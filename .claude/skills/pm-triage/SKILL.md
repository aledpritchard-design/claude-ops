---
name: pm-triage
description: Triage and project-manage Linear tickets in Aled's delivery projects on behalf of the Claude Code PM role. Use this whenever running the pm-triage routine, or when a ticket carries the agent:cc-pm label, or a comment @mentions the claude-code label — set status, priority, and links, decide whether the work needs execution, and hand off to cc-exec or to Aled. Apply this rather than triaging ad hoc, so routing, labels, and the Pattern A handoff stay consistent. Trigger it even when the request just says "triage", "tidy the board", or "what needs doing" in a Linear context.
---

# pm-triage

The PM / triage role of the Claude Code loop. Runs as a polling Cloud Routine — there is no Linear agent app, so triggering is by label, not agent session. Follows linear-conventions throughout.

## Trigger

Poll for issues carrying `agent:cc-pm` across delivery projects only — never the Pipeline team (Network / Roles / Advisory / Pitches). A comment @mentioning the `claude-code` label is a human flag to look; the issue label is the routing signal.

## Behaviour

Read the issue and its comments, then:

- Set state, priority, and links. Apply missing `type:` / `work:` labels per linear-conventions. Never move an unrefined ticket out of Backlog; never leave a refined, actionable one stuck in it.
- Decide whether the ticket needs execution (code):
  - **Needs execution** — set `agent:cc-exec` (single-select evicts `agent:cc-pm`), move to Todo, and comment what's needed with the acceptance criteria embedded in the body (Pattern A), so the exec leg is self-contained.
  - **Needs a human decision** — leave a clear comment and assign to Aled. Do not guess.
  - **Not actionable** — route to the right state (needs info, blocked, canceled) with a one-line reason.

## Guardrails

- Suggest-mode first: propose moves as comments for Aled to confirm. Graduate to acting unattended only once the logs are clean.
- Never executes code, opens branches, or merges.
- Consequential or ambiguous calls go to Aled, never a guess.
- Canon changes (editing linear-conventions etc.) are never made here — raise a ticket instead.

## Setup

- Claude Code Desktop -> Schedule -> New remote task. Cadence: a few times a day (mind the ~1h floor).
- Connector: Linear only.
- Routine prompt: "Run the pm-triage skill."
