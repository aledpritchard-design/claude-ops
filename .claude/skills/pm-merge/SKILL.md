---
name: pm-merge
description: "Merge approved pull requests on behalf of the PM agent. Use this whenever running the pm-merge routine, or when a ticket in In Review carries agent:cc-pm — the label change plus an @cc-pm comment is Aled's approval signal. Squash-merges the PR, deletes the claude/ branch, moves the ticket to Done, and comments confirmation. On CI failure or merge conflict, moves to Blocked, sets priority Urgent, assigns Aled, and comments the specific issue. Never merges without an explicit cc-pm approval signal. Part of the PM agent alongside pm-triage and pipeline-qualify."
license: Proprietary — Aled Pritchard workspace use.
---

# pm-merge

The merge leg of the Claude Code PM agent. Executes the physical merge after Aled has approved — the
label change to `agent:cc-pm` plus an @cc-pm comment is the gate signal. Runs as a **Cloud Routine**
(GitHub write access required). Follows `linear-conventions` and Pattern A.

## Context

- Polls all delivery projects for issues in **In Review** carrying `cc-pm` (the `agent`-group leaf — filter by the leaf name, not `agent:cc-pm`; see linear-conventions *Label storage and querying*).
- The `cc-pm` label on an In Review ticket means: Aled has reviewed the qa-review verdict, is satisfied,
  and has delegated the physical merge. This is the approval signal — do not merge without it.
- Never touches Pipeline team tickets.
- Repos: clones `claude-ops` (for skill loading) + the delivery repo(s) for GitHub writes.
  `claude-ops` is also a permitted **merge target** when the PR originates from an **os.Claude
  (Apps team) delivery ticket** carrying a valid cc-pm approval signal.

## Trigger

Poll all delivery projects for issues in **In Review** carrying `cc-pm`. Skip if none. Note:
`cc-pm` is the leaf name inside the `agent` group — filter by that leaf, never the `agent:cc-pm` display form, which matches nothing (see linear-conventions *Label storage and querying*).

## Approval verification

The `cc-pm` label on an In Review ticket is the approval signal. If you read comments to verify intent (e.g. to disambiguate "approve and merge" from "send back"), **scan the full thread** — never rely on the single most-recently-updated comment.

**Why:** `list_comments` orders by `updatedAt` desc by default. Any subsequent comment sweep (pm-triage, pm-coordinate) can re-touch an older comment and bump its `updatedAt` above Aled's `[cc-pm] approved` reply. `limit: 1` then returns the re-touched comment, not the approval. The fix: use `orderBy: createdAt` and a high enough limit, or scan the thread for the explicit `[cc-pm] approved` signal rather than reading only the top result.

## Behaviour

For each qualifying ticket:

1. **Locate the PR.** Find the linked pull request from the issue's comments or relations. If no PR
   can be found, treat as a merge conflict (see Blocked path below).

2. **Check PR status.** Before merging, verify:
   - All required CI checks have passed (or there are no required checks).
   - There are no unresolved merge conflicts.
   - The branch is mergeable.

3. **Happy path — merge.**
   - **Squash merge** the PR into main (or the repo default branch). Squash message:
     [Ticket identifier] [Ticket title] (#PR number) — e.g. APP-104 Fix fitness tracker sync (#12).
   - **Delete** the claude/-prefixed branch after a successful merge.
   - Move the Linear ticket to **Done**.
   - Evict `agent:cc-pm` (remove the label).
   - Add a comment: "✅ Merged: PR #[number] squash-merged into main. Branch deleted."

4. **Unblock dependents.** After a successful merge, query for tickets in **Blocked** that list the just-merged ticket as a blocker. For each:
   - Check whether any other blockers remain unresolved (i.e. not Done).
   - If no remaining blockers, move the ticket to **Todo** and comment: "Unblocked — [ticket identifier] has merged."
   - If other blockers remain, leave the ticket in Blocked (do not comment).

5. **Blocked path — CI failure or conflict.**
   If required CI checks are failing, checks are still running, or there is a merge conflict:
   - Move the ticket to **Blocked**.
   - Set priority **Urgent (1)**.
   - Set `agent:human` (evicts `agent:cc-pm`).
   - Assign Aled.
   - Add a comment leading with ⚠️, @mentioning Aled, that states:
     - Which checks are failing (by name) or that a conflict exists
     - The PR link
     - What is needed to unblock
   - Do **not** merge. Do not close the PR. Leave the branch in place.
   - For unexpected errors outside the merge scope (tool failures, infrastructure errors), call `issue-capture` to file a Backlog ticket.

## Guardrails

- Never merges without the cc-pm approval signal.
- Never force-merges — Blocked path applies every time CI or conflicts block.
- Squash only. Done is final. Delivery repos only. `claude-ops` is additionally permitted as a
  merge target for os.Claude (Apps) delivery tickets on the cc-pm approval signal.
  Never touches Pipeline. Never merges `claude-ops` PRs without a valid cc-pm approval signal.
- Fresh session each run. All state lives in Linear and GitHub, not the agent.

## Setup

- Deployed as a Claude Code cloud scheduled task (cloud, machine off).
- Connectors: Linear + GitHub (Contents: read & write; Pull requests: read & write on delivery repos).
- Repos: delivery repo(s) + assoc-one/claude-ops (for skill loading).
- Routine prompt: Run the pm-merge skill.
- Cadence: hourly.

On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill.
