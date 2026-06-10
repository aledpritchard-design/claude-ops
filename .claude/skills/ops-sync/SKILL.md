---
name: ops-sync
description: Keep skill and task artefacts in parity between Claude (deployed copies) and the claude-ops repo (canon), so the agents web page always builds from complete, current source. Use this whenever running the ops-sync routine, or whenever asked to audit, reconcile, or check artefact parity between Claude and claude-ops. Runs as a scheduled Cowork task on the Linear + GitHub connectors. Repo wins on content; where the repo is ahead of a read-only Claude-side copy the run emits a ready-to-install SKILL.md drop-in; uncommitted Claude-side artefacts are flagged for Aled, never auto-committed; remote routines are repo-only and exempt from Claude-side checks.
license: Proprietary — Aled Pritchard workspace use.
---

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
3. **Repo ahead of Claude** (stale-on-Claude **or** new-in-repo-not-yet-on-Claude) → repo wins. Where the surface allows writes, update the Claude-side copy in place. Where it doesn't (e.g. plugin-bundled, read-only skills), emit a ready-to-install drop-in: write the current repo content to `<skill-name>/SKILL.md` in the outputs folder — filename exactly `SKILL.md` (uppercase), each skill in its own folder so names don't collide. See *The reinstall handoff* below.
4. **In Claude, missing from repo** → the dangerous case for the web page: never silently commit. Call `issue-capture` to file a Backlog ticket in os.Claude flagging the uncommitted artefact for Aled to review and commit.
5. **Edited on both sides** → conflict: do not overwrite. Flag to Aled with a diff.
6. **Report** — end every run with a short parity report: in-sync count, synced items, flagged items, and the path of every `SKILL.md` drop-in written this run (so the reinstall handoff is traceable).

## The reinstall handoff (repo-ahead direction only)

This is how the emitted drop-ins become installed skills — it applies **only** when the repo is ahead of a read-only Claude-side copy.

- For each such skill, the run writes the current repo content to `<skill-name>/SKILL.md` in the outputs folder (uppercase `SKILL.md`, one per folder).
- Presenting that file inline in Aled's UI surfaces a **save/update button** — that button *is* the install. Writing the file is therefore the whole fix; there is no separate "flag it and let a button re-pull later" path to fall back on.
- The install write always happens in Aled's UI when he clicks save/update — **never from the run itself**. The run only produces the drop-in and names it in the parity report.
- This path is for the repo-ahead direction only. The opposite case — an artefact in Claude but missing from the repo — is **unchanged**: never written as a drop-in, only flagged for Aled and committed via the normal PR route (step 4).

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
