# ops-sync

Keeps skill and task artefacts in parity between **Claude** (the deployed, executing copies) and the **claude-ops repo** (canon). The 2026-06-05 canon decision made claude-ops the source of truth for skill, task, and agent artefact *content*; this skill enforces that, so [agents.aledpritchard.com](http://agents.aledpritchard.com) always builds from complete, current source. Follows `linear-conventions`. Runs as a scheduled Cowork task. **Repo wins; never pushes to claude-ops directly; never deletes.**

## Why this matters

Nothing else enforces parity, and drift is silent. A skill edited in Claude and never committed, or committed and never redeployed, only surfaces when the web page builds from stale or missing source. The dangerous case is an artefact that exists in Claude but not in the repo: the page is built from the repo, so that artefact simply never appears. This audit catches both directions before the page does.

## Placement map (the rules the audit enforces)

| Artefact | Repo (claude-ops) | Claude (deployed) | Rule |
| -- | -- | -- | -- |
| Skills | Required — canon | Required — execution copy | Must exist in both; repo wins on content |
| Tasks (one-off prompts) | Required — canon, web-page source | Required where used | Must exist in both; repo wins on content |
| Remote (cloud) routines | Required — only home | Not stored in Claude | Repo only; never flag a missing Claude copy |
| Linear reference copies (os.Claude docs) | n/a | n/a | Re-synced from repo after any repo change; never edited directly |

## Audit behaviour

Runs as a scheduled Cowork task on the Linear + GitHub connectors.

1. **Enumerate** skills and tasks on the Claude side and the corresponding directories in claude-ops.
2. **Compare** content, normalising whitespace before diffing.
3. **In repo, stale or missing in Claude** → repo wins: update the Claude-side copy where the surface allows writes; where it doesn't (e.g. plugin-bundled skills), produce the updated artefact and flag it for one-click reinstall.
4. **In Claude, missing from repo** → the dangerous case for the web page: never silently commit. Raise a ticket (or comment on the run report) listing the uncommitted artefact for Aled to review and commit.
5. **Edited on both sides** → conflict: do not overwrite. Flag to Aled with a diff.
6. **Report** — end every run with a short parity report: in-sync count, synced items, flagged items.

## Guardrails

- **Repo wins on content**, but never the other way by stealth: uncommitted Claude-side artefacts are flagged for Aled, never auto-committed.
- **Remote (cloud) routines are repo-only** and exempt from the Claude-side requirement — never flag a missing Claude copy for a routine.
- **Linear reference copies are reference only** — re-synced from the repo after a repo change, never edited directly.
- Never deletes anything on either side.
- Never pushes to claude-ops directly — commits go through the normal exec / PR route.

## Setup

- Deployed as a **Cowork scheduled task** (cloud).
- **Connectors:** Linear + GitHub.
- **Cadence:** daily or slower.
- **Routine prompt:** `Run the ops-sync skill.`
- Smoke test: the first run's parity report.
