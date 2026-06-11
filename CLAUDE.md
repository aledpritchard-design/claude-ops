# claude-ops

This repository holds the Claude Code skill files for Aled's Claude operating loop.

Skills live in `.claude/skills/`. Claude Code discovers and loads them automatically when this repo is cloned.

## Skills in this repo

| Skill | Role |
| -- | -- |
| `linear-conventions` | Workspace conventions for all Linear work (teams, states, labels, routing, Pattern A). Read before creating or updating anything in Linear. |
| `exec` | cc-exec: claim a Todo ticket, implement it, open a PR on a `claude/` branch, hand to cc-qa. Never merges. |
| `qa-review` | cc-qa: read the PR against the ticket's embedded criteria, post a plain-language verdict for Aled. Never advances the ticket. |
| `pm-triage` | cc-pm: triage Backlog tickets and route Todo tickets. Currently deployed as a Cowork task; included here for reference and future use. |
| `pm-coordinate` | cc-pm (coordination leg): sweeps all delivery projects for new comments, applies decisions, advances handoffs, auto-unblocks cleared dependencies, surfaces structural proposals. Never merges or marks Done. |
| `pm-merge` | cc-pm (merge leg): squash-merges approved PRs, deletes branches, marks Done. Gated by Aled's cc-pm approval signal. |
| `ops-sync` | Artefact parity audit: keeps skills and tasks in sync between Claude (deployed) and this repo (canon). Repo wins; flags uncommitted Claude-side artefacts for Aled. Deployed as a Cowork scheduled task. |
| `operating-model` | Contextual reference: what a skill / task / routine / agent is, how they bundle, the loop topology, and the skill-or-task decision test. Read-only canon — no trigger or behaviour loop. |
| `pm-plan` | Prioritisation and focus: reads goal-initiatives and ticket state across delivery teams, separates important from urgent, makes autonomous hygiene writes (fix/minor level), surfaces major proposals for Aled. Runs ~weekly on the Linear connector. Never marks Done, never writes code, never touches Pipeline. |

## Source of truth

This repo (`assoc-one/claude-ops`) is the source of truth for skill artefacts (decision: 2026-06-05). Edit here; the Linear reference copies are derived. Linear remains canon for tickets and the decision log.

## Connected to

- **exec** Cloud Routine — clones this repo + the target delivery repo.
- **qa-review** Cloud Routine — clones this repo + the target delivery repo.
- **pm-coordinate** Cloud Routine — Linear connector only.

## Routine prompts

Once this repo is cloned by a routine, the routine prompt can be simply:

- exec: `Run the exec skill.`
- qa-review: `Run the qa-review skill.`
- pm-coordinate: `Run the pm-coordinate skill.`
