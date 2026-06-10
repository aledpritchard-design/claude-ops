# pm-triage

The PM / triage role of the Claude Code loop. Runs as a polling Cloud Routine — there is no Linear agent app, so triggering is by label, not agent session. Follows linear-conventions throughout.

## Trigger

Poll for issues carrying `agent:cc-pm` across delivery projects only — never the Pipeline team (Network / Roles / Advisory / Pitches). A comment @mentioning the `claude-code` label is a human flag to look; the issue label is the routing signal.

## Behaviour

Read the issue and its comments, then:

- Set state, priority, and links. Apply missing `type:` / `work:` labels per linear-conventions. Never move an unrefined ticket out of Backlog; never leave a refined, actionable one stuck in it.
- Decide whether the ticket needs execution (code):
  - **Needs execution** — set `agent:cc-exec` (single-select evicts `agent:cc-pm`), move to Todo, **clear the assignee**, and comment what's needed with the acceptance criteria embedded in the body (Pattern A), so the exec leg is self-contained. Only ever route a **leaf ticket** to cc-exec — never an epic (`type:epic` is an outcome closed by Aled when its children are done; see linear-conventions *Structure*).
  - **Needs a human decision** — leave a clear comment and assign to Aled. The comment must @mention him (`@aledpritchard`) and lead with the specific action or decision needed, phrased so he can reply or act directly. Do not guess.
  - **Not actionable** — route to the right state (needs info, blocked, canceled) with a one-line reason. Moving a ticket to **Blocked** also sets priority **Urgent (1)**.

## Refinement: placement, structure, assignee

When refining a Backlog ticket, structure it before polishing its content:

- **Placement check (every Backlog ticket).** Before refining content, ask where the ticket belongs: does it sit under an existing epic or feature, and does it belong to an existing milestone? Set the parent and milestone during refinement. If no home exists and the work implies one, say so in the refinement comment rather than inventing structure.
- **Milestone assignment.** Every refined leaf ticket gets a milestone where the project has them (app.fitness M1–M6, os.Claude M1–M3).
- **Restructure oversized tickets (propose-first).** A Backlog ticket too big for one PR is not refined as-is. Propose an epic + sub-task breakdown in a comment for Aled's approval, and wait — do not create sub-issues in bulk until he approves (the A1-3 pattern, made standard).
- **Assignee discipline.** Assign Aled at refinement **only** when the gaps comment contains a genuine question or decision for him; a no-gap refined ticket parks in **Refinement unassigned**. When routing a Todo ticket to cc-exec, clear the assignee. Any comment that assigns Aled must @mention him (`@aledpritchard`) and lead with the specific action or decision needed.

## Refinement comment sweep

Refinement is Aled's lane and is **read-only** to the pm leg — never re-refine or relabel a Refinement ticket — with one exception: tickets where **Aled has commented since the last pm/agent comment**. For those, process his comments as trusted instructions:

- Apply his answers to the ticket body.
- Reply confirming what changed.
- Promote to Todo when he says it is ready (routing to cc-exec where execution is needed, per the rule above).
- Clear the assignee once the ask is resolved.

Never act on a Refinement ticket that has no new comment from Aled.

## Guardrails

- Suggest-mode first: propose moves as comments for Aled to confirm. Graduate to acting unattended only once the logs are clean.
- Never executes code, opens branches, or merges.
- Consequential or ambiguous calls go to Aled, never a guess.
- Canon changes (editing linear-conventions etc.) are never made here — raise a ticket instead.

**Blocker discipline.** Blocked-by relations are for genuine dependencies only: shared files that would conflict, artefacts that must exist first (assets, builds, merged tooling), or decisions that gate scope. Strategic sequencing — platform order, milestone order, "do this before that" — is carried by project milestones and Aled's promotion to Todo. Never encode sequencing preferences as blocks. Do not add a blocked-by relation merely because tickets are thematically sequential or because one would logically follow the other.

**Repo-wide baseline tickets.** A ticket that touches many files across a repo (format pass, lint sweep, large-scale refactor) is a genuine dependency for any parallel ticket editing the same files. When such a baseline ticket is in flight (Todo → In Review), identify any simultaneously-actionable tickets that edit overlapping files and add blocked-by relations to them so they are not worked concurrently. Sequencing via blocks here prevents merge conflicts at the source, complementing CI and the merge queue.

## Setup

- Claude Code Desktop -> Schedule -> New remote task. Cadence: a few times a day (mind the ~1h floor).
- Connector: Linear only.
- Routine prompt: "Run the pm-triage skill."

On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill.
