---
name: exec
description: Execute a Claude Code ticket end to end and open a pull request for review, on behalf of the cc-exec role. Use this whenever running the exec routine, or when a ticket carries agent:cc-exec in Todo and no other cc-exec ticket is In Progress — run the work against the connected repo, open a PR (never merge), then hand off to cc-qa and In Review. Apply this so the lock, handoff, blocked, and gate discipline stay consistent. Trigger it whenever the task is to implement, build, or fix a Linear-tracked ticket with Claude Code.
---

# exec

The execution role of the Claude Code loop. Runs as a polling Cloud Routine against a connected GitHub repo. Follows `linear-conventions`, Pattern A, and the gate policy. **Never merges — merge is Aled's alone.**

## Trigger

Poll for issues carrying `agent:cc-exec` in **Todo**, delivery projects only — never the Pipeline team. Skip the run if any `agent:cc-exec` ticket is already **In Progress** (one Claude Code agent per repo; tickets run serially). Note: the label is stored as `cc-exec` inside the `agent` group — resolve it by that name, not the literal string `agent:cc-exec`.

## Behaviour

1. **Claim** — move the chosen ticket (highest priority first) to In Progress. This *is* the lock: a ticket In Progress under `agent:cc-exec` is being worked and is never re-grabbed. No separate lock label.
2. Read the ticket, its embedded acceptance criteria (Pattern A), any PM comment, and — if this is a bounce — Aled's note.
3. Run Claude Code. Open a PR on a `claude/`-prefixed branch. Never merge.
4. **Hand off** — set `agent:cc-qa` (evicts `agent:cc-exec`), move to In Review, comment the PR link and a short summary.
5. Leave a comment for the PM leg where project management is needed.

**Blocked (fail-safe).** If you hit a blocker you cannot resolve — push rejected / no write access, a missing dependency or credential, or a requirement too ambiguous to act on safely — do **not** leave the ticket In Progress and do **not** open a half-baked PR. Move it to **Blocked**, set `exec:human` (evicts `agent:cc-exec`), assign Aled, and comment plainly what blocked you and what is needed to clear it. This empties In Progress so the leg is not jammed and the next ticket can run, and it surfaces the blocker to Aled. Aled clears the blocker and moves the ticket back to Todo to retry.

**Bounce:** Aled moves In Review → **Todo** with a note; the next run re-picks it and iterates on the existing PR. (Todo, not In Progress, so In Progress always means "running now.")

## Guardrails

- Never merges. Main branch protected; merge is Aled's.
- On an unresolvable blocker, move the ticket to **Blocked** + `exec:human` + assign Aled. Never leave it In Progress — that jams the leg and it never retries.
- One PR per ticket. Never open a partial or speculative PR to "make progress" — Blocked is the honest outcome.
- Fresh cloud session each run, so all state lives in Linear, not the agent.
- Scope GitHub access to delivery repos only. Never touches the Pipeline team's work.

## Setup

- Deployed as a Claude Code cloud scheduled task (cloud, machine off).
- Connectors: Linear + GitHub. The Claude Code GitHub App must have **Contents: read & write** and **Pull requests: read & write** on the delivery repo — read-only causes a 403 on push, which is a Blocked outcome, not a crash.
- One repo to start; widen once the loop is proven. Cadence: hourly or slower.
- The routine prompt: "Run the exec skill."

> Lock note: this skill and `linear-conventions` both use **status as the lock** (Todo = ready, In Progress = running). No `state:locked` label exists or is needed.
