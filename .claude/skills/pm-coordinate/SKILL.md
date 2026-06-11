---
name: pm-coordinate
description: Cross-board PM coordination for Aled's delivery projects. Use whenever running the pm-coordinate routine, or when PM comments have landed on tickets across any state and need to be processed. Sweeps all delivery projects for new Aled/agent comments since the last pm-coordinate run, applies decisions, advances handoffs, unblocks cleared dependencies, and surfaces structural issues (duplicates, missing parents, orphaned milestones) as proposal comments only. Never merges, marks Done, or touches Pipeline. Trigger this rather than ad-hoc coordination so decisions applied to ticket bodies, routing changes, and structural proposals follow consistent conventions.
license: Proprietary — Aled Pritchard workspace use.
---

# pm-coordinate

The cross-board PM coordination skill. Runs as a scheduled Cowork task on the Linear connector. Follows `linear-conventions` throughout.

## Trigger

Scheduled poll across all delivery projects: careerOS (cOS.Build, cOS.System, cOS.Content, cOS.App), Apps (os.Claude, app.fitness, Luna MVP, bot.Trader), and A1 (all client projects including a1.MeirionPritchard). Never touches the Pipeline team (Network / Roles / Advisory / Pitches) — that is relationship work, not delivery.

For each ticket in scope, the run checks whether any comments warrant action. The **watermark rule** (below) ensures efficiency and idempotency: only genuinely new, unprocessed input is acted on.

## The trigger-boundary rule

This rule guards against two PM legs touching the same ticket. pm-coordinate's scope is defined precisely to avoid collision with exec, qa, and merge.

**pm-coordinate processes:**
- Comments from Aled on tickets in **any** state except In Progress under `agent:cc-exec`.
- Comments from other PM legs (pm-intake, pm-triage) that contain open questions Aled has since answered in a subsequent comment.

**pm-coordinate does NOT process:**
- Tickets currently **In Progress** carrying `agent:cc-exec` — exec owns those while being worked.
- Exec, qa, or merge handoff comments (those are state-transition records, not PM instructions).
- GitHub PR review comments — those belong to the qa or exec leg.
- Comments already processed and acknowledged in a prior run (the watermark prevents re-processing).

**Watermark:** for each ticket, find pm-coordinate's most recent comment. Only comments posted *after* that watermark from Aled (or from any other pm leg with new content) are candidates. If no prior pm-coordinate comment exists on the ticket, the beginning of the ticket's history is the watermark.

**Comment ordering — `list_comments` uses `updatedAt` desc by default.** Any skill that re-touches a comment (edits it, adds a reaction, or references it in a sweep) bumps its `updatedAt` — which resurfaces it at the top of the next query. `limit: 1` therefore does **not** reliably return the chronologically latest comment; it returns the most recently *touched* comment. When scanning for the watermark or Aled's latest instruction, use `orderBy: createdAt` and a sufficient limit so the correct comment is found.

## Behaviour

The run executes three passes in sequence.

### Pass 1 — Comment sweep

For each delivery ticket **not** In Progress under `agent:cc-exec`, and where new eligible comments exist since the watermark:

1. Read the new comments and the ticket body together.
2. **Closed open question** — if the comment answers an open question in the body: apply the answer to the body directly, then reply confirming ("Applied @aledpritchard's answer: [summary]. Body updated.").
3. **Routing instruction** — if the comment is an explicit routing signal (e.g. "route to exec", "this is ready", "promote to Todo"): set `agent:cc-exec`, move to Todo, clear the assignee. Post a confirmation comment.
4. **State / label / priority change** — apply directly, then confirm in a reply.
5. **Cross-ticket decision** — if the comment implies a follow-on ticket, file it in Backlog and link; otherwise apply in-line.

Post a single summary reply per ticket, not one reply per comment. If a comment's intent is ambiguous, post a clarifying question in-thread and leave all state unchanged until Aled replies.

### Pass 2 — Dependency hygiene

Sweep all delivery tickets with blocked-by relations.

**Stale-relation cleanup (autonomous):** where a blocker is **Canceled** or **Duplicate**, remove the blocked-by relation and comment: e.g. "Removed stale blocker to APP-120 (Canceled). No action needed."

**All blockers cleared (Done/Canceled):** do *not* auto-route. Post a comment @mentioning Aled with the recommended next move and assign him. Do not advance the ticket until he confirms — this prevents an unblock → auto-route → re-block loop.

**Long-stale block:** if a blocker reached Done more than three days ago and the relation was never cleared, flag it as likely stale in a comment and assign Aled.

**Still genuinely blocked:** leave in place.

### Pass 3 — Surface-and-flag

Proposals only. Post a comment @mentioning Aled. Never auto-restructure, create tickets in bulk, delete, or merge.

**Candidate duplicates:** two tickets in the same project with highly similar titles. Post: "@aledpritchard Possible duplicate: [A] and [B] appear to cover the same ground. Recommend closing one — please confirm."

**Missing parent:** a leaf `type:task` or `type:story` in a project with epics that has no `parentId`. Post: "@aledpritchard [Ticket] has no parent. Consider grouping under [suggested epic] or confirm it stands alone."

**Missing milestone:** a leaf ticket in a project with milestones that carries no milestone. Post: "@aledpritchard [Ticket] has no milestone. Recommend [suggested milestone] — please confirm."

At most one proposal comment per ticket per run. If an open proposal from a prior run has had no reply, do not re-post — skip.

## Guardrails

- Never merges. Merge belongs to pm-merge, gated by an explicit cc-pm approval signal.
- Never marks Done. Done is Aled's sign-off.
- Never touches the Pipeline team (Network / Roles / Advisory / Pitches).
- Never acts on tickets In Progress under `agent:cc-exec`.
- Never makes destructive structural changes (delete tickets, remove epics, bulk-reassign) without Aled's explicit instruction.
- Single-select agent group: when routing a ticket to cc-exec, the label update evicts any prior `agent:*` label. Never set two `agent:*` labels simultaneously.
- Consequential or ambiguous calls go to Aled in-thread; never a guess.

## Setup

- Deployed as a Claude Code cloud scheduled task (cloud, machine off).
- Connector: **Linear only** (GitHub write access not required for this skill).
- Routine prompt: `Run the pm-coordinate skill.`
- Cadence: a few times a day (mind the ~1h floor).

On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill.
