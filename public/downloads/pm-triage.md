# pm-triage

The intake leg of the Claude Code PM agent. Fires on new Backlog tickets carrying `cc-pm`. Shapes raw tickets to standard (structure, labels, priority, acceptance criteria) and moves them to Refinement with any open questions flagged. Runs as a polling Cloud Routine — there is no Linear agent app, so triggering is by label. Follows linear-conventions throughout.

Refinement comment sweeps, send-back routing, blocked-state hygiene, and post-Refinement flow are owned by **pm-coordinate**. pm-triage's scope is intake only.

> **Enumerating issues at scale:** `list_issues` always returns full description bodies. Filter by `label`+`state`+`project`/`team` on every call; prefer per-label/per-state probes over broad queries; delegate to a subagent for genuinely large sets. See linear-conventions *Enumerating issues at scale*.

## Trigger

Poll for issues carrying `cc-pm` in **Backlog** across delivery projects only — never the Pipeline team (Network / Roles / Advisory / Pitches). `cc-pm` is the `agent`-group leaf: filter on the leaf name, not `agent:cc-pm`, which matches nothing (see linear-conventions *Label storage and querying*).

**In Progress, In Review, Refinement, Todo, and Blocked tickets are never touched** — those states belong to exec, qa, pm-merge, or pm-coordinate respectively.

## Behaviour

Read the issue and its comments, then:

- Set state, priority, and links. Apply missing `type:` / `work:` labels per linear-conventions. Never move an unrefined ticket out of Backlog without structuring it first.
- Decide whether the ticket needs execution (code):
  - **Needs execution** — before routing to cc-exec, check whether the ticket body signals exec ineligibility: phrases such as "exec loop can't do this", "account-level", "Vercel dashboard", "DNS provider", or any discrete action requiring a third-party account or external system access the exec loop cannot reach. If present, route to `agent:human` instead, @mention Aled (`@aledpritchard`), and state the specific human action required — routing to cc-exec when the body says it can't deliver wastes a claim cycle and a Blocked transition. If no such signal is present: set `agent:cc-exec` (single-select evicts `agent:cc-pm`), move to Refinement, **clear the assignee**, and comment what's needed with the acceptance criteria embedded in the body (Pattern A), so the exec leg is self-contained. Only ever route a **leaf ticket** to cc-exec — never an epic (`type:epic` is an outcome closed by Aled when its children are done; see linear-conventions *Structure*). Never promote a ticket whose *Notes for Aled to address* questions are still unresolved — park it in Refinement instead (see *Open-questions gate* under Refinement).
  - **Needs a human decision** — leave a clear comment and assign to Aled. The comment must @mention him (`@aledpritchard`) and lead with the specific action or decision needed, phrased so he can reply or act directly. Do not guess.
  - **Not actionable** — route to the right state (needs info, blocked, canceled) with a one-line reason. Moving a ticket to **Blocked** also sets priority **Urgent (1)**.

## Refinement: placement, structure, assignee

When refining a Backlog ticket, structure it before polishing its content:

- **Placement check (every Backlog ticket).** Before refining content, ask where the ticket belongs: does it sit under an existing epic or feature, and does it belong to an existing milestone? Set the parent and milestone during refinement. If no home exists and the work implies one, say so in the refinement comment rather than inventing structure.
- **Milestone assignment.** Every refined leaf ticket gets a milestone where the project has them (app.fitness M1–M6, os.Claude M1–M3).
- **Restructure oversized tickets (propose-first).** A Backlog ticket too big for one PR is not refined as-is. Propose an epic + sub-task breakdown in a comment for Aled's approval, and wait — do not create sub-issues in bulk until he approves (the A1-3 pattern, made standard).
- **Executor and gate check.** A ticket that mixes executors (human prerequisite + agent implementation) or requires more than one human gate at different stages must be split before routing to cc-exec. Propose the split in a comment (one `exec:human` prerequisite ticket blocking the implementation ticket, or one gate per ticket); wait for Aled's approval before creating sub-issues. If a split is genuinely impossible, flag it in a comment and assign Aled. See *Decomposing mixed-executor / multi-gate tickets* in linear-conventions.
- **Assignee discipline.** Assign Aled at refinement **only** when the gaps comment contains a genuine question or decision for him; a no-gap refined ticket parks in **Refinement unassigned**. When routing a Todo ticket to cc-exec, clear the assignee. Any comment that assigns Aled must @mention him (`@aledpritchard`) and lead with the specific action or decision needed.
- **Open-questions gate — never promote a ticket whose `Notes for Aled to address` is still open.** Before moving any ticket to Todo (and labelling `cc-exec`), check its body for a *Notes for Aled to address* section, or any equivalent open-questions / decisions block. Treat each bullet as unresolved unless a **later Aled comment answers it**. If any remain unanswered, **park the ticket in Refinement assigned to Aled** — do not promote — and make sure the gaps comment surfaces those exact questions. The ticket becomes promotable only once Aled's answers are applied to the body via pm-coordinate's comment sweep. A Notes section Aled has **already answered** in comments is not blocking: apply the answers, then promote. This closes the silent gap where a ticket sits in Todo + `cc-exec` but is unworkable because its spec is still ambiguous (the APP-166 case), so the exec leg skips it at the eligibility scan and the work stalls unseen.

**Skill-creation dual-file requirement.** When a skill-creation ticket's AC checklist is embedded, it must include explicit items for **both** required file locations — not just one:
- `.claude/skills/<name>/SKILL.md` — YAML frontmatter (`name`, `description`) + full content; auto-loaded by Claude Code at startup
- `public/downloads/<name>.md` — exact mirror copy (without YAML frontmatter); the web-readable version generated by `npm run build:manifest:ci`

A checklist that names only one location will produce a one-file exec output and a QA bounce. See operating-model *How they bundle* for the canonical reference.

## Guardrails

- Scope: Backlog cc-pm tickets only. Never touches In Progress, In Review, Refinement, Todo, or Blocked tickets — those are pm-coordinate's domain.
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
