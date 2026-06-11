---
name: operating-model
description: The canonical reference for how Aled's AI operating layer is structured and deployed — what a skill is vs a task vs a routine vs an agent, how they bundle, and the cc-pm/exec/qa loop topology. Read this before building, modifying, or proposing new skills, routines, or agent roles. Also use it to apply the skill-or-task decision test.
---

# Operating model — how Claude works

The backbone reference for how Aled's AI operating layer is structured and deployed. Read this before building, modifying, or proposing new skills, routines, or agent roles.

**Scope boundary:** this doc covers structure only — the definitions, the topology, and the decision test. Per-tool setup and naming conventions (GitHub, Sanity, Vercel, Linear) belong in the tool conventions docs (see APP-173, modelled on `linear-conventions`). Proposing new skills or routines belongs in the optimisation-review skill (APP-172). Neither belongs here.

---

## The four building blocks

### Skill

A skill is a `SKILL.md` instruction file in `.claude/skills/<name>/SKILL.md` inside the `claude-ops` repo. Claude Code auto-loads all skills in that directory at startup — they form the behavioral and contextual layer the agent reads before doing any work.

Skills come in two varieties:

- **Behavioral / runnable.** Define a specific role with a trigger, behaviour loop, and guardrails. A routine deploys one of these with a matching prompt. Examples: `exec`, `qa-review`, `pm-triage`, `pm-merge`, `ops-sync`, `ops-retro`.
- **Contextual.** Always-loaded reference the other skills depend on. No trigger, no loop — pure reading material. Example: `linear-conventions`.

Skills are canon. They live in this repo, reach the deployed agent via ops-sync, and are changed only through PR → Aled approval.

### Task

A task is a one-off prompt stored in Claude (the deployed agent) and mirrored in this repo as source. Tasks are run manually by Aled — ad-hoc or infrequent work that does not warrant a scheduled routine. A task typically invokes a skill by name in its prompt.

Tasks must exist in both places: Claude (deployed) and `claude-ops` (canon). Repo wins on content.

### Routine

A routine is a scheduled cloud execution. It runs automatically on a cadence (hourly, daily) or in response to a trigger, using a fixed prompt — typically `Run the <skill-name> skill.` A routine is the deployment wrapper for a behavioral skill.

Routines live only in the repo, not in Claude. Current routines: `exec` (hourly), `qa-review` (hourly), `ops-sync` (daily).

### Agent

An agent is a Claude Code session executing a skill. Each run of the exec routine is an agent run; each run of qa-review is another. In Linear, agent roles are encoded as the single-select `agent:cc-*` label group — `cc-pm`, `cc-exec`, `cc-qa`, `agent:human` — recording which role currently owns a ticket, not which Claude account or model.

---

## How they bundle

A deployed behavioral skill has three artefacts that must stay in sync:

| Artefact | Location | Purpose |
|---|---|---|
| Canon | `.claude/skills/<name>/SKILL.md` in `claude-ops` | Source of truth |
| Deployed | Skill installed in the Claude agent instance | What actually runs |
| Public download | `public/downloads/<name>.md` in `claude-ops` | Web-readable copy for the agents site |

`ops-sync` audits these daily and flags drift. Repo wins; changes go through PR → Aled approval → ops-sync deploys.

---

## The cc-pm / exec / qa loop topology

The delivery loop has four legs and a gate:

```
  Backlog → cc-pm (triage) → Todo
         → cc-exec (implement) → In Review
         → cc-qa (review verdict) → In Review + assigned to Aled
         → Aled (gate: approves or bounces)
         → pm-merge (squash-merge + close) → Done
```

**cc-pm (pm-triage / pm-coordinate):** Reads new Backlog tickets, applies the ticket standard, embeds acceptance criteria, sets the agent label and state. Also drives the post-review approval gate: when Aled sets `cc-pm` + signals `@cc-pm`, pm-merge executes the merge.

**cc-exec (exec):** Polls for `cc-exec` tickets in Todo. One ticket at a time, serially. Creates a `claude/<ticket-id>` branch off `origin/main`, runs the work, opens a PR, then hands to cc-qa. Never merges.

**cc-qa (qa-review):** Reads the PR against the acceptance criteria embedded in the ticket (Pattern A). Posts a plain-language verdict — either a clean summary with DoD confirmation, or the specific changes needed. Assigns Aled. Never advances state or merges.

**Aled (gate):** Reviews the qa-review verdict. Approves by setting `cc-pm` + commenting `@cc-pm`; this is the merge signal. Bounces by moving to Todo with a note, which re-triggers exec on the existing PR branch.

**pm-merge:** Squash-merges the PR, deletes the `claude/` branch, moves the ticket to Done, and unblocks any dependents whose only remaining blocker was the just-merged ticket.

**State is the lock.** Todo = ready, In Progress = running, In Review = awaiting review or approval. No separate lock labels. A ticket In Progress under `cc-exec` is being worked and is never re-grabbed.

---

## Skill-or-task decision test

Use this when deciding how to capture a new piece of operational behaviour:

| Question | Answer → |
|---|---|
| Does it run automatically on a schedule or trigger? | **Routine** — deploy the behavioral skill as a scheduled cloud task |
| Does it define repeatable behaviour an agent will follow, or reference material other skills need? | **Skill** — add to `.claude/skills/` |
| Is it a one-off action Aled runs manually with a defined prompt? | **Task** — store in Claude + repo |
| Is it a named role in the delivery loop? | **Agent label** — add to the `agent:` group in `linear-conventions` |

The principle: skills encode **what** to do; routines schedule **when** to do it; tasks are manual one-shots; agent labels track **who** is doing it. Never encode behaviour in a ticket or comment — behaviour lives in skills.

---

## Edit discipline

This doc is canon. Changes go through a PR on `claude-ops`, reviewed and merged by Aled. Canon is never changed silently.
