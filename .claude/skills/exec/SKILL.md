---
name: exec
description: Execute a Claude Code ticket end to end and open a pull request for review, on behalf of the cc-exec role. Use this whenever running the exec routine, or when a ticket carries the label cc-exec in Todo and no other cc-exec ticket is In Progress — run the work against the connected repo, open a PR (never merge), then hand off to cc-qa and In Review. Apply this so the lock, handoff, blocked, and gate discipline stay consistent. Trigger it whenever the task is to implement, build, or fix a Linear-tracked ticket with Claude Code.
---

# exec

The execution role of the Claude Code loop. Runs as a polling Cloud Routine against a connected GitHub repo. Follows `linear-conventions`, Pattern A, and the gate policy. **Never merges — merge is Aled's alone.**

## Trigger

Poll for issues carrying label `cc-exec` in **Todo**, delivery projects only — never the Pipeline team. **Skip the run only if a `cc-exec` ticket is already In Progress** — that means another exec run is active, and the rule is one Claude Code agent per repo. In Progress is the *active-run* signal: tickets parked in **In Review** (awaiting QA, PM, or Aled) are not In Progress and never hold off a run.

A run is **not** a single ticket. It works the eligible `cc-exec` queue **serially — one ticket fully finished before the next is claimed** — until no eligible ticket remains or the run nears its time budget (see Behaviour). Across a run only one ticket is In Progress at any instant; across the repo only one run is active at a time.

**Eligibility scan.** Before each claim — the first and every subsequent one in the run — scan candidates from highest priority downward:

- A ticket is **eligible** if it is a **leaf ticket** (never `type:epic` — epics are outcomes, closed by Aled when their children are done; see linear-conventions *Structure*), has no open blocked-by relation (blocker ticket not Done or Canceled), and has no unmet dependency named in a PM comment.
- If the top ticket is ineligible, move down the priority list rather than ending the run.
- If no eligible ticket exists, end the run cleanly with no claim. Do not mark anything Blocked.

## Behaviour

A run is a loop. **Repeat the cycle below for one eligible ticket at a time, highest priority first, until no eligible ticket remains or the run nears its time budget.** Each ticket is carried fully through handoff before the next is claimed — strictly serial, so only one ticket is In Progress at any instant.

For each ticket:

1. **Sync** — fetch and check out latest `main`, then cut a fresh `claude/`-prefixed branch for *this* ticket off it. Every ticket gets its own branch off current `main`, never off a previous ticket's branch (genuine dependencies are blocked-by relations, so a blocker is already merged before its dependent is eligible). The branch name for each ticket should be `claude/<ticket-id>` (e.g. `claude/app-144`). When the session provides a pre-generated branch name, use it for the first ticket only; cut a fresh `claude/<ticket-id>` branch off `origin/main` for every subsequent ticket in the same run.
2. **Claim** — move the ticket to In Progress and **clear the assignee**. This *is* the lock: a ticket In Progress under `agent:cc-exec` is being worked and is never re-grabbed. No separate lock label.
3. Read the ticket, its embedded acceptance criteria (Pattern A), any PM comment, and — if this is a bounce — Aled's note.
4. Run Claude Code on this ticket's branch. Open a PR. Never merge.
5. **Rebase before hand-off** — fetch `origin/main`, rebase the branch onto it, resolve any conflicts, and re-run format and tests to confirm the PR is clean against the current baseline. Force-push the updated branch. If the rebase produces unresolvable conflicts, take the Blocked path.
6. **Hand off** — set `agent:cc-qa` (evicts `agent:cc-exec`), move to In Review, **leave the ticket unassigned**, and comment the PR link and a short summary. The assignee stays clear through exec and review; cc-qa assigns Aled once review is done (see qa-review). This keeps "assigned to Aled" meaning "Aled's decision is needed now", not "in flight". Leave a comment for the PM leg where project management is needed.

Then re-run the eligibility scan and take the next ticket. **End the run** when no eligible ticket remains. If the run is nearing its time budget, stop claiming new tickets — but always finish the in-flight ticket's handoff first, so an ending run leaves at most the one ticket it was actively working part-done (the same exposure as a single-ticket run).

**Blocked (fail-safe).** If you hit a blocker you cannot resolve — push rejected / no write access, a missing dependency or credential, or a requirement too ambiguous to act on safely — do **not** leave the ticket In Progress and do **not** open a half-baked PR. Move it to **Blocked**, set priority **Urgent (1)**, set `exec:human` (evicts `agent:cc-exec`), assign Aled, and comment plainly what blocked you and what is needed to clear it. This empties In Progress so the leg is not jammed and the next ticket can run, and it surfaces the blocker to Aled. Aled clears the blocker and moves the ticket back to Todo to retry. Within a run, a Blocked outcome ends only *that ticket's* cycle — the run continues to the next eligible ticket.

**Bounce:** Aled moves In Review → **Todo** with a note; the next run re-picks it and iterates on the existing PR. (Todo, not In Progress, so In Progress always means "running now.")

## Guardrails

- Never merges. Main branch protected; merge is Aled's.
- On an unresolvable blocker, move the ticket to **Blocked**, set priority **Urgent (1)**, set `exec:human`, assign Aled. Never leave it In Progress — that jams the leg and it never retries.
- One PR per ticket. Never open a partial or speculative PR to "make progress" — Blocked is the honest outcome.
- A run works the whole eligible queue, but **serially** — one ticket fully handed off before the next is claimed, each on its own branch off latest `main`. Never run two tickets' branches in one session in parallel; they would collide in the repo.
- Fresh cloud session each run, so all state lives in Linear, not the agent.
- Scope GitHub access to delivery repos only. Never touches the Pipeline team's work.

## Setup

- Deployed as a Claude Code cloud scheduled task (cloud, machine off).
- Connectors: Linear + GitHub. The Claude Code GitHub App must have **Contents: read & write** and **Pull requests: read & write** on the delivery repo — read-only causes a 403 on push, which is a Blocked outcome, not a crash.
- One repo to start; widen once the loop is proven. Cadence: hourly or slower.
- The routine prompt: "Run the exec skill."

> Lock note: this skill and `linear-conventions` both use **status as the lock** (Todo = ready, In Progress = running). No `state:locked` label exists or is needed.

On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill.
