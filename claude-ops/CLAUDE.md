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

## Source of truth

Linear (team Apps, project os.Claude) is canon. This repo holds synced copies. When a skill doc changes in Linear, update the relevant `SKILL.md` here and commit.

## Connected to

- **exec** Cloud Routine — clones this repo + the target delivery repo.
- **qa-review** Cloud Routine — clones this repo + the target delivery repo.

## Routine prompts

Once this repo is cloned by a routine, the routine prompt can be simply:

- exec: `Run the exec skill.`
- qa-review: `Run the qa-review skill.`
