# issue-capture

A shared inline procedure for filing problem-capture tickets. Called from a skill's failure path at the moment a problem occurs — not at end-of-run (end-of-run friction belongs to `ops-retro`). Follows `linear-conventions`.

## When to call

Call this from any skill's failure path when the problem is:

- **Not already the current ticket's Blocked state.** If the exec leg gets Blocked on a ticket, that ticket IS the record. Call issue-capture for problems that are separate from the work ticket: infrastructure failures, tool errors, ops-layer gaps, or (for ops-sync) artefacts missing from the repo.
- **Worth tracking.** A one-off transient error does not need a ticket. File when the problem would recur or needs a human decision to fix.

## Behaviour

Given a problem description:

1. **Check for an existing ticket.** Search os.Claude Backlog for a ticket with a matching title or problem description (OPS: / FIX: / DRIFT: prefix). If an exact match exists, add a comment noting the recurrence with today's date instead of opening a new ticket.
2. **File a Backlog ticket** in Apps / os.Claude with the standard shape (per `linear-conventions`):
   - **Title** — prefix: `FIX:` (defect), `OPS:` (operational gap), or `DRIFT:` (canon vs reality). Specific, not generic.
   - **Objective** — one sentence: what happened and in which skill.
   - **Why this matters** — impact if left unfixed; note if recurring.
   - **Proposed change** — the specific edit and exactly which skill/file/section it touches. Embed acceptance criteria (Pattern A) where the fix is a coded change with a clear scope.
   - **Notes for Aled** — any open questions or decisions needed.
   - **On completion** — "Refine with the answers above, then move to Todo."
   - Labels: `type:task` (or `type:bug`) + `work:configuration`. Executor: `agent:cc-exec` for a clean coded change with Pattern A criteria embedded; `exec:human` otherwise.
   - State: Backlog. Assign Aled.

## Guardrails

- Files to Backlog only. Never moves, closes, or resolves anything.
- Duplicate captures are tolerated. `pm-triage` detects duplicates on its sweep and moves the redundant one to Duplicate state.
- Never edits a SKILL.md or any canon inline. The output is a ticket, not a fix.
