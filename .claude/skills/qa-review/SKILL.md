---
name: qa-review
description: Review a Claude Code pull request for Aled and write a plain-language verdict he can act on without reading the code. Use this whenever running the qa-review routine, or when a ticket in In Review carries cc-qa — read the PR against the ticket's embedded acceptance criteria and report either a clean summary with DoD confirmation, or the full set of changes the exec agent needs. Apply this rather than reviewing ad hoc; it never merges or advances the ticket. Trigger it whenever the task is to QA, review, or sanity-check agent-written code in a Linear context.
---

# qa-review

The QA / review role of the Claude Code loop — the extra pair of eyes that makes a change reviewable by Aled without him reading code. Runs as a polling Cloud Routine. Follows linear-conventions and the gate policy (Aled is the approver; nothing merges without him).

## Trigger

Poll for issues in In Review carrying `cc-qa` (set by the exec leg). Delivery projects only.

## Behaviour

Read the linked PR / diff and the acceptance criteria embedded in the ticket (Pattern A). Assess the change against those criteria, then:

1. **Post the verdict comment on the Linear ticket** (so it's in the canonical record).
2. **Post the same verdict comment on the GitHub PR** (so it's visible where Aled reviews and approves).
3. **Mark the PR as Ready for Review** (convert from draft) — draft signals WIP; a clean QA pass signals it's awaiting human sign-off.

Verdict comes in one of two modes:

- **Clean** — a summary of what was done plus explicit confirmation it meets the DoD / success criteria. Enough for Aled to approve.
- **Changes needed** — log everything the exec agent needs to act on: specific, actionable, with file/line where it helps, so a bounce is self-contained. Do not mark the PR ready for review if changes are needed.

Plain language throughout — Aled acts on it without reading the code.

## Guardrails

- Does not merge. Does not move the ticket forward or change the `agent:*` label. It reviews and reports; Aled decides.
- Approve and merge are Aled's (he can merge, or tell the exec agent to). Bounce is Aled's: In Review -> Todo with a note re-triggers exec.
- A QA pass is not assurance — it makes the change legible, it does not sign it off. Sign-off is human (Pattern A).

## Setup

- Claude Code Desktop -> Schedule -> New remote task.
- Connectors: Linear + GitHub (read + write access to the PR for comments and draft conversion).
- Routine prompt: "Run the qa-review skill."
