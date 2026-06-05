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

**Hand off to Aled's gate.** Once the verdict is posted (either mode), assign the ticket to **Aled** and set `agent:cc-pm` (single-select, evicts `agent:cc-qa`), leaving it in **In Review**. Review is done, so the ticket is now genuinely Aled's: he approves (his `@cc-pm` signal triggers the pm-merge leg) or bounces (In Review → Todo re-triggers exec). The exec leg left the ticket unassigned; cc-qa is where the assignee becomes Aled, so "assigned to Aled" reliably means his decision is needed now.

## Guardrails

- Does not merge and does not change the ticket's **state** — it stays in In Review. The one allowed transition is the handoff above: assign Aled and swap `agent:cc-qa` → `agent:cc-pm` once the verdict is posted. It reviews, reports, and hands to Aled's gate; Aled decides.
- Approve and merge are Aled's: his `@cc-pm` approval signal triggers the pm-merge leg. Bounce is Aled's: In Review -> Todo with a note re-triggers exec.
- A QA pass is not assurance — it makes the change legible, it does not sign it off. Sign-off is human (Pattern A).

## Setup

- Claude Code Desktop -> Schedule -> New remote task.
- Connectors: Linear + GitHub (read + write access to the PR for comments and draft conversion).
- Routine prompt: "Run the qa-review skill."
