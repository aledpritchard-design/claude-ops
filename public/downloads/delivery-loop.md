# delivery-loop

The driver routine of the Claude Code delivery loop. Sequences the exec, qa-review, and pm-merge skills in one session, draining the eligible ticket queue. Replaces three separate timer-polling routines and removes inter-leg latency at each handoff.

## Trigger

Timer-based Cloud Routine. Routine prompt: "Run the delivery-loop skill."

**Skip the run entirely** if any ticket is currently In Progress with label `cc-exec` — another exec leg is already active. In Progress is the active-run signal; never run two legs concurrently in the same repo.

## Behaviour

A run is a loop. Repeat the following cycle for one eligible ticket at a time, highest priority first, until no eligible ticket remains or the run nears its time budget. Always finish the in-flight ticket's full cycle before ending the run.

**Eligibility scan** (same rules as exec): a ticket is eligible if it is a leaf ticket (never `type:epic`), has label `cc-exec`, is in **Todo**, has no open blocked-by relation (blocker not Done or Canceled), and carries no unmet dependency named in a PM comment. Scan delivery projects only — never the Pipeline team. If the top candidate is ineligible, move to the next by priority. End the run cleanly if no eligible ticket exists.

For each eligible ticket, execute the following cycle in full before moving to the next:

### 1. Exec leg

Run the `exec` skill for this ticket. Full exec behaviour applies — follow the exec skill for details. In summary:

- Sync to `origin/main`, cut a fresh `claude/<ticket-id>` branch.
- Claim the ticket (In Progress, clear assignee).
- Read the ticket, acceptance criteria (Pattern A), and any PM comment.
- Build, run CI (formatter → lint → format-check → type-check → build, as the repo requires), open a PR only when CI is green.
- Check for a duplicate open PR before opening; take the Blocked path if one exists on a different branch.
- Rebase onto `origin/main`, re-run CI, force-push the updated branch.
- Move ticket to In Review, set label `cc-qa` (evicts `cc-exec`), leave assignee clear.

If exec hits an unresolvable blocker, follow exec's Blocked fail-safe: move to Blocked, set priority Urgent, set label `human`, assign Aled, comment the blocker. Skip to the next eligible ticket.

### 2. QA leg

Run the `qa-review` skill on the handoff. Full qa-review behaviour applies — follow that skill for details. In summary, working from isolated inputs only (ticket, embedded criteria, diff):

- Check the dedup key (`[qa-review] HEAD: <sha7>`) — skip if a verdict for the current head commit already exists.
- Assess each acceptance criterion adversarially; cite what was run and observed.
- Post the verdict comment on both the Linear ticket and the GitHub PR, beginning with `[qa-review] HEAD: <sha7>`.
- Do **not** convert draft PRs to ready — the verdict comment is the handoff signal.

### 3. Route per verdict

Read the verdict outcome and the ticket's human-gate flag (`Human gate: required — <reason>` in the ticket body; absent = none).

- **Unflagged + clean pass** → set label `cc-pm` (evicts `cc-qa`), keep In Review, leave assignee clear. Run the `pm-merge` skill. Continue to the next eligible ticket.
- **Flagged + clean pass** → assign Aled, set label `human` (evicts `cc-qa`), keep In Review, post the verdict with the flagged item leading. Stop on this ticket; continue to the next eligible ticket.
- **Block (QA cannot proceed without Aled's input)** → move to Blocked, set label `human` (evicts `cc-qa`), assign Aled, @mention with what is needed. Stop on this ticket; continue to the next eligible ticket.
- **Changes needed** → check the bounce count before routing (see *Bounce cap* below).

### pm-merge leg

When the route is unflagged + clean, run the `pm-merge` skill on the ticket's PR. Full pm-merge behaviour applies. If pm-merge hits a CI failure or conflict, it takes its own fail-safe (Blocked, Urgent, human, assigned Aled). Continue to the next eligible ticket regardless.

## Bounce cap

The cap is **two strikes**: one auto-bounce to exec, escalation to Aled on the second "changes needed" verdict for the same ticket.

**Before routing a "changes needed" verdict**, count prior QA bounce verdicts on the ticket:

1. Scan the ticket's Linear comment thread (`orderBy: createdAt`, sufficient limit — see linear-conventions *Comment ordering gotcha*).
2. Count comments that begin with `[qa-review] HEAD:` and contain "changes needed" (case-insensitive) anywhere in their body. This is the number of prior bounces.

**Strike 1 (count = 0):** Auto-bounce to exec — move ticket to **Todo**, set label `cc-exec` (evicts `cc-qa`), clear assignee, add a brief Linear comment summarising the fix needed. Re-run the exec and QA legs for this ticket (re-enter from step 1 of this cycle).

**Strike 2 (count ≥ 1):** Cap hit — assign Aled, set label `human` (evicts `cc-qa`), keep In Review. Comment: "Second QA changes-needed — bounce cap reached. Flagged for Aled's review." Stop on this ticket; continue to the next eligible ticket.

The count is derived from Linear, not session state — a crash or a loop spanning multiple runs reads the correct strike count from the comment thread, so no chain state is lost.

## Guardrails

- Never merges directly. Main branch protected; merge is Aled's gate, executed by pm-merge only on his `cc-pm` approval signal.
- Aled is in the path for: flagged work, bounce-cap escalations, QA blocks, and pm-merge failures. He is out of the path only for unflagged, clean, unblocked work.
- The driver calls existing skills; it does not duplicate their logic. Updates to exec, qa-review, or pm-merge skills are picked up automatically.
- Serial by design — one ticket at a time, one PR open at once. One-agent-per-repo preserved.
- Crash-safe: all state lives in Linear (status, labels, PR links, verdict comments). A crash mid-cycle leaves a valid intermediate state; the next run resumes from Linear.
- Delivery projects only. Never touches the Pipeline team (Network / Roles / Advisory / Pitches).

## Cutover note — operator action required

When this driver goes live, **retire the three standalone Cloud Routines** (exec timer, qa-review timer, pm-merge timer) so there is one writer per repo. Running this driver alongside the standalone routines causes double-writes and competing state transitions. The retirement is a scheduling step Aled performs in the Claude Code Routines settings — it is not automated.

## Setup

- Claude Code Desktop → Schedule → New remote task.
- Connectors: Linear + GitHub (same combined access as exec and qa-review: Contents read/write, Pull requests read/write).
- Routine prompt: "Run the delivery-loop skill."
- Load MCP tool schemas via ToolSearch as needed for each leg (same schemas exec and qa-review load individually).

On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill.
