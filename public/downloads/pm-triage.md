# pm-triage

The PM / triage role of the Claude Code loop. Runs as a polling Cloud Routine — there is no Linear agent app, so triggering is by label, not agent session. Follows linear-conventions throughout.

> **Enumerating issues at scale:** `list_issues` always returns full description bodies. Filter by `label`+`state`+`project`/`team` on every call; prefer per-label/per-state probes over broad queries; delegate to a subagent for genuinely large sets. See linear-conventions *Enumerating issues at scale*.

## Trigger

Poll for issues carrying `cc-pm` across delivery projects only — never the Pipeline team (Network / Roles / Advisory / Pitches). `cc-pm` is the `agent`-group leaf: filter on the leaf name, not `agent:cc-pm`, which matches nothing (see linear-conventions *Label storage and querying*). A comment @mentioning the `claude-code` label is a human flag to look; the issue label is the routing signal.

The run also revisits tickets in **Blocked** carrying any `agent`-group label (any leaf — `cc-pm`, `cc-exec`, `cc-qa`, `human`, …), to catch blockers that have since cleared — see *Blocked-state sweep* below. **In Progress** is never touched. **In Review** tickets are normally skipped — with one exception: In Review tickets carrying `cc-pm` may carry a send-back instruction from Aled and must be disambiguated (see *Send-back routing* below).

## Behaviour

Read the issue and its comments, then:

- Set state, priority, and links. Apply missing `type:` / `work:` labels per linear-conventions. Never move an unrefined ticket out of Backlog; never leave a refined, actionable one stuck in it.
- Decide whether the ticket needs execution (code):
  - **Needs execution** — before routing to cc-exec, check whether the ticket body signals exec ineligibility: phrases such as "exec loop can't do this", "account-level", "Vercel dashboard", "DNS provider", or any discrete action requiring a third-party account or external system access the exec loop cannot reach. If present, route to `agent:human` instead, @mention Aled (`@aledpritchard`), and state the specific human action required — routing to cc-exec when the body says it can't deliver wastes a claim cycle and a Blocked transition. If no such signal is present: set `agent:cc-exec` (single-select evicts `agent:cc-pm`), move to Todo, **clear the assignee**, and comment what's needed with the acceptance criteria embedded in the body (Pattern A), so the exec leg is self-contained. Only ever route a **leaf ticket** to cc-exec — never an epic (`type:epic` is an outcome closed by Aled when its children are done; see linear-conventions *Structure*). Never promote a ticket whose *Notes for Aled to address* questions are still unresolved — park it in Refinement instead (see *Open-questions gate* under Refinement).
  - **Needs a human decision** — leave a clear comment and assign to Aled. The comment must @mention him (`@aledpritchard`) and lead with the specific action or decision needed, phrased so he can reply or act directly. Do not guess.
  - **Not actionable** — route to the right state (needs info, blocked, canceled) with a one-line reason. Moving a ticket to **Blocked** also sets priority **Urgent (1)**.

## Send-back routing

When a delivery ticket fails late (qa-review "changes needed" or pm-merge CI failure), it lands on Aled with `agent:human`. Aled's decision to retry is gated: he sets `agent:cc-pm` on the ticket with a send-back comment.

Because `agent:cc-pm` on an In Review ticket has two meanings — **"approve and merge"** (→ pm-merge acts) and **"send back to exec"** (→ this skill acts) — the PM leg reads Aled's comment intent to disambiguate. Approval comments signal satisfaction ("merge", "ship it", "@cc-pm approve", looks good, etc.); send-back comments signal rework ("fix X", "changes needed", "send back", "bounce", etc.). When intent is genuinely unclear, lean toward leaving the ticket for pm-merge (the safer default) and post a clarifying comment for Aled.

**On a send-back:**

1. Relabel `agent:cc-exec` (evicts `agent:cc-pm`).
2. Move the ticket to **Todo**.
3. Ensure the fix instructions are in the ticket body or the most recent comment so exec is self-contained.
4. Clear the assignee. exec picks it up on the next run.

Because Aled is in the loop on every failure, no automatic exec↔qa loop is introduced and no loop-cap is needed.

## Refinement: placement, structure, assignee

When refining a Backlog ticket, structure it before polishing its content:

- **Placement check (every Backlog ticket).** Before refining content, ask where the ticket belongs: does it sit under an existing epic or feature, and does it belong to an existing milestone? Set the parent and milestone during refinement. If no home exists and the work implies one, say so in the refinement comment rather than inventing structure.
- **Milestone assignment.** Every refined leaf ticket gets a milestone where the project has them (app.fitness M1–M6, os.Claude M1–M3).
- **Restructure oversized tickets (propose-first).** A Backlog ticket too big for one PR is not refined as-is. Propose an epic + sub-task breakdown in a comment for Aled's approval, and wait — do not create sub-issues in bulk until he approves (the A1-3 pattern, made standard).
- **Executor and gate check.** A ticket that mixes executors (human prerequisite + agent implementation) or requires more than one human gate at different stages must be split before routing to cc-exec. Propose the split in a comment (one `exec:human` prerequisite ticket blocking the implementation ticket, or one gate per ticket); wait for Aled's approval before creating sub-issues. If a split is genuinely impossible, flag it in a comment and assign Aled. See *Decomposing mixed-executor / multi-gate tickets* in linear-conventions.
- **Assignee discipline.** Assign Aled at refinement **only** when the gaps comment contains a genuine question or decision for him; a no-gap refined ticket parks in **Refinement unassigned**. When routing a Todo ticket to cc-exec, clear the assignee. Any comment that assigns Aled must @mention him (`@aledpritchard`) and lead with the specific action or decision needed.
- **Open-questions gate — never promote a ticket whose `Notes for Aled to address` is still open.** Before moving any ticket to Todo (and labelling `cc-exec`), check its body for a *Notes for Aled to address* section, or any equivalent open-questions / decisions block. Treat each bullet as unresolved unless a **later Aled comment answers it**. If any remain unanswered, **park the ticket in Refinement assigned to Aled** — do not promote — and make sure the gaps comment surfaces those exact questions. The ticket becomes promotable only once Aled's answers are applied to the body via the *Refinement comment sweep*. A Notes section Aled has **already answered** in comments is not blocking: apply the answers, then promote. This closes the silent gap where a ticket sits in Todo + `cc-exec` but is unworkable because its spec is still ambiguous (the APP-166 case), so the exec leg skips it at the eligibility scan and the work stalls unseen.

## Refinement comment sweep

Refinement is Aled's lane and is **read-only** to the pm leg — never re-refine or relabel a Refinement ticket — with one exception: tickets where **Aled has commented since the last pm/agent comment**. For those, process his comments as trusted instructions:

- Apply his answers to the ticket body.
- Reply confirming what changed.
- Promote to Todo when he says it is ready (routing to cc-exec where execution is needed, per the rule above) — and only once every *Notes for Aled to address* question is resolved, per the *Open-questions gate*.
- Clear the assignee once the ask is resolved.

Never act on a Refinement ticket that has no new comment from Aled.

## Direct-promotion: claude-ops skill tickets

A refined, no-gap skill ticket in the **os.Claude project** may skip the Refinement park and be promoted straight to Todo, so `SKILL.md` changes do not wait on Aled's manual promotion.

**Scope.** A ticket qualifies when it sits in the **os.Claude project** and its description plainly describes a claude-ops skill being created or updated — the kind of edit that lands as a `SKILL.md` PR. This is a judgement from the description, not a mechanical rule — if it is not obviously a skill create/update, treat it as out of scope and park in Refinement as normal. A ticket outside os.Claude is never in scope.

**Promotion.** When such a ticket is refined with no open gaps (no unresolved *Notes for Aled to address*) and no `Human gate: required` flag:
- Set `agent:cc-exec` (evicts `cc-pm`), move Backlog → Todo, leave the assignee clear.
- Ensure the acceptance criteria are embedded in the body (Pattern A) before promoting.
- The ticket then flows exec → qa autonomously.

**Gap / flag exception.** An open gap or a `Human gate: required` flag on a skill ticket is never bypassed — park it in Refinement assigned to Aled per the normal rule.

**Guards.** Never the Pipeline team. Never `type:epic`. Never tickets already In Progress or In Review. Promotion only sets Todo; it does not claim the exec lock.

**Suggest-mode (starting state).** This section launches in suggest-mode: propose the promotion as a comment assigned to Aled rather than acting directly. Graduate to acting unattended once a clean soak confirms the pattern is reliable.

## Blocked-state sweep

Blocked is otherwise a silent gap: a blocker that has since cleared (PR merged, dependency Done, relation cancelled) leaves the dependent stranded until Aled notices by hand. Each run sweeps it.

Scope: tickets in **Blocked** carrying **any** `agent:*` label (not only cc-pm). In Progress and In Review are left untouched.

For each such ticket, read its blocked-by relations and judge whether each blocker is resolved (Done / merged / Canceled / Duplicate):

- **Stale-relation cleanup (autonomous).** Where a blocker was **Canceled** or marked **Duplicate**, actively remove that blocked-by relation and note the removal in a comment. This is the one autonomous mutation the sweep makes.
- **All blockers cleared → surface, never auto-route.** Do not silently move the ticket onward — auto-routing a cleared ticket straight to cc-exec + Todo risks an unblock→route→re-block loop. Instead post a comment @mentioning Aled (`@aledpritchard`) with the recommended next move, assign him, and set priority **Urgent**. Only after Aled agrees does the *next* cc-pm run execute the move.
- **Still genuinely blocked → leave in place.** Optionally note any stale or invalid blocker relation, but do not move it.

**Unblock policy — what to recommend when all blockers have cleared:**

- *Ready to action* (complete brief, just needs execution) → recommend **Todo** with concrete instructions. If it is repo/code work, the *subsequent* routing pass sets `agent:cc-exec` — never auto-set in the same run.
- *Clearing it needs separate work* → recommend a new unblocking ticket in **Backlog** at High/Urgent, linked as the blocker.
- *Brief now incomplete* → ask the specific question in-thread, refine on Aled's reply, then promote to Todo.

## Guardrails

- Suggest-mode first: propose moves as comments for Aled to confirm. Graduate to acting unattended only once the logs are clean.
- Never executes code, opens branches, or merges.
- Consequential or ambiguous calls go to Aled, never a guess.
- Canon changes (editing linear-conventions etc.) are never made here — raise a ticket instead.

**Duplicate issue-capture tickets.** On each run, scan the os.Claude Backlog for tickets with matching OPS:/FIX:/DRIFT: titles that describe the same problem (filed by `issue-capture` from multiple failure paths). Move the redundant one to Duplicate state, note which ticket is canonical in a comment, and link the two.

**Blocker discipline.** Blocked-by relations are for genuine dependencies only: shared files that would conflict, artefacts that must exist first (assets, builds, merged tooling), or decisions that gate scope. Strategic sequencing — platform order, milestone order, "do this before that" — is carried by project milestones and Aled's promotion to Todo. Never encode sequencing preferences as blocks. Do not add a blocked-by relation merely because tickets are thematically sequential or because one would logically follow the other.

**Repo-wide baseline tickets.** A ticket that touches many files across a repo (format pass, lint sweep, large-scale refactor) is a genuine dependency for any parallel ticket editing the same files. When such a baseline ticket is in flight (Todo → In Review), identify any simultaneously-actionable tickets that edit overlapping files and add blocked-by relations to them so they are not worked concurrently. Sequencing via blocks here prevents merge conflicts at the source, complementing CI and the merge queue.

## Setup

- Claude Code Desktop -> Schedule -> New remote task. Cadence: a few times a day (mind the ~1h floor).
- Connector: Linear only.
- Routine prompt: "Run the pm-triage skill."

On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill.
