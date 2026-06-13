> *This is the canonical copy of this skill. The corresponding Linear doc (*`skill.linear-conventions`*) is a reference copy. Edit here; re-sync to Linear after changes.*

# Linear workspace conventions

Aled runs all his work through Linear — the careerOS system, the product and app builds, the pipeline of people and opportunities, the Association of One consultancy, and his editorial output. Linear is the **system of record**: not the chat thread, not memory, not project files. If a decision, a piece of state, or a task isn't in Linear, it effectively doesn't persist. Treat Linear as canon and keep it clean, because everything downstream (outputs, the website, future agent runs) trusts it.

This skill encodes the conventions so they don't have to be re-derived each session. Follow them precisely — the failure modes here are silent (a stale label, a ticket in the wrong state, a decision that never got logged) and they cost real cleanup later.

## The workspace: teams and where work goes

Five teams. Route to the right team first, then the right project within it.

| Team | Key | What it holds |
| -- | -- | -- |
| **careerOS** | `COS` | The job-search and portfolio system. Projects: cOS.System (architecture, philosophy, canon), cOS.Content (truth captures `tc.*`, case studies, CV, narrative), cOS.Build (engineering, website, automation), cOS.App (AI behaviour for the portfolio product), cOS.Reporting (inbound product signals). |
| **Apps** | `APP` | Product/app builds and cross-cutting build infrastructure. Projects: os.Claude (how Claude is operated — skills, routines, agent instructions), app.fitness, Luna MVP, bot.Trader, and the gtd.\* GTD projects (Capture, Configure, Build, Health, Home, Family, MBN, CareerOS). |
| **Pipeline** | `PIPE` | People and opportunities (see "The Pipeline model" below). Projects: Network (the people layer), Roles, Advisory, Pitches (the opportunity funnels). |
| **A1** | `A1` | The Association of One consultancy. Projects: a1.OS (standards and playbooks — the practice's operating system), a1.Brand (A1's own identity and the client-facing document system), and one project per client engagement (a1.MeirionPritchard, a1.Heroes). |
| **Mr Pritchard** | `MRP` | Editorial and personal brand. Projects: Articles (long-form, canon voice), Substack (short-form), LinkedIn (posts), Operations (decision log, project instructions, get-started). Editorial cascades: an Article is the parent; its Substack and LinkedIn derivatives are sub-issues. |

Quick routing:

* A *person* -> Pipeline / Network. An *opportunity* -> Pipeline / Roles, Advisory, or Pitches, titled for the opportunity (never the person).
* How Claude is operated (skills, routines, agent instructions) -> Apps / os.Claude.
* A1 client work -> the A1 team, one project per client; A1 standards and playbooks -> a1.OS.
* Editorial -> Mr Pritchard (Articles -> Substack -> LinkedIn).

> **Recent structure changes (2026-06-02):** the old `cOS.Roles` / `cOS.Outreach-*` projects were replaced by the **Pipeline** team (Roles / Network / Advisory). **A1** graduated from a careerOS project to its own team. The team formerly called *Projects* (key `ASP`) is now **Apps** (key `APP`). **Mr Pritchard** is the editorial/personal-brand team. The old careerOS projects retain only historic/cancelled entries pending archive; don't file new pipeline work there.

If the right home is genuinely ambiguous, ask rather than guess. A misfiled ticket is worse than a clarifying question.

## The Pipeline model — people vs opportunities

The Pipeline team has two layers, and keeping them distinct is the whole point of the structure:

* **People layer — `Network`.** Every contact lives here, inbound or outbound: recruiters (internal and agency), former colleagues, ex-managers, dormant ties, useful connections. The unit is a *person*. A person enters here and never moves out; the relationship persists regardless of what it produces.
* **Opportunity layers — `Roles`, `Advisory`, `Pitches`.** These hold concrete opportunities, each titled for the *opportunity* (a role at a company, the company being advised, a piece of work) — **never for a person**. An opportunity issue is created only when something real exists.

The rule: **a person never appears in an opportunity funnel, and an opportunity is never titled with a person's name.** When a relationship produces something concrete, an opportunity issue is spawned in the right funnel and *linked back* to the person in Network via a native relation. One person can throw off several opportunities over time (a role, then later advisory) — each is its own linked issue; the person stays put.

This is why Advisory may look near-empty: it holds live advisory *engagements*, not advisory *leads*. Leads are people, and people are in Network.

### Gmail capture labels (the `pipeline/` family)

Mail is fed into the funnels by labelling threads in Gmail with the `pipeline/` prefix (renamed 2026-06-02 from `job-search/`). The sweeps read these:

* `pipeline/roles` — a specific role -> swept into Roles
* `pipeline/recruiter-internal` / `pipeline/recruiter-agency` — a recruiter -> swept into Network
* `pipeline/network` — a general contact (colleague, dormant tie) -> swept into Network, no `opp:` unless signalled
* `pipeline/advisory` — a person Aled reads as near an advisory opportunity -> swept into Network, stamped `opp:advisory` (the label is advisory *intent*; it does NOT route to the Advisory project)
* `pipeline/triaged` — the processed-marker added by every sweep so threads aren't re-swept

### Surfaced / graduation labels (Linear)

The link between the people layer and the opportunity funnels runs on structured Linear labels, not free-text scanning:

* `surfaced:role` — a concrete role opportunity has surfaced from this Network relationship
* `surfaced:advisory` — a concrete advisory opening (named company) has surfaced
* `surfaced:pitch` — a piece of A1 new-business / delivery work has surfaced
* `surfaced:done` — graduated; an opportunity issue has been created and linked (prevents re-graduation)

The feeding sweeps add `surfaced:role` / `surfaced:advisory` automatically when they spot a concrete opening; you add a marker by hand after a call surfaces something. The graduation routine reads these markers and creates the linked opportunity issue, then swaps the trigger label for `surfaced:done`. Routine docs: `routine.gmail-sweep-roles`, `routine.gmail-sweep-recruiters`, `routine.gmail-sweep-network`, `routine.network-graduation`.

## Issue states

Two workflows are in play, by team:

**careerOS, Apps, A1, Mr Pritchard (engineering/kanban):** `Backlog`, `Refinement`, `Todo`, `In Progress`, `In Review`, `Blocked`, `Done`, `Canceled`, `Duplicate`.

**Pipeline (forward-moving funnel):** `Captured`, `Backlog` (= identified, not yet actioned), `Todo`, `Awaiting` (acted, ball in their court), `Active` (live back-and-forth), `Engaged` (resolved well — engagement live / offer in hand / relationship purposeful), `Passed` (no fit / cold / withdrew), `Canceled`. Note the looser fit for Network specifically: a relationship oscillates (active <-> dormant) rather than completing, so read warmth from the labels, not the column.

**The Backlog rule (both workflows):** new tickets that Aled hasn't refined go in **Backlog**, not Todo. Todo means "ready to action." Backlog means "captured, needs refinement first." When creating tickets that raise questions or need Aled's input before they're actionable, always Backlog — and include a notes section (see below). Don't move things to Todo on Aled's behalf unless he's said it's ready.

**Refinement — Aled's lane.** Refinement holds tickets that have been refined and are parked awaiting his promotion to Todo (or his answer to an open question). It is the human refinement gate. Agents treat Refinement tickets as **read-only**: never re-refine, relabel, or re-route them — with one exception. A ticket where Aled has commented since the last pm/agent comment is a signal to act: the pm leg processes those comments as trusted instructions (applies his answers to the body, replies to confirm, promotes to Todo when he says ready, and clears the assignee once the ask is resolved). See *pm-coordinate* for the comment-sweep behaviour (pm-triage handles Backlog intake only). A no-gap refined ticket parks here **unassigned**; a ticket carrying a genuine question for Aled is assigned to him (see the assignee rule under *Structure*).

**Blocked.** Set by the exec leg when it hits an unresolvable blocker mid-run (no write access, a missing dependency or credential, a requirement too ambiguous to act on safely). The ticket leaves In Progress so the leg is not jammed, carries `agent:human`, and is assigned to Aled. He clears the blocker and moves it back to Todo to retry. **Any transition to Blocked sets priority Urgent (1)** — so blocked work is always visible at the top of the queue and never sits unnoticed. This applies to all engineering-workflow teams (careerOS, Apps, A1, Mr Pritchard); the Pipeline team has no Blocked state. Not the same as a blocked-by relation (a genuine dependency between tickets — see *Structure*).

## Labels

Every ticket should carry the labels that classify it. The taxonomy:

**Type** (what kind of work): `type:epic`, `type:feature`, `type:story`, `type:task`, `type:bug`

**Executor** (who does it): one label from the `agent` group (single-select).

* `agent` **group (single-select)** — which agent owns the work. The former `exec:agent:*` and `author:claude-code` labels were retired (2026-06-02); `exec:human` was retired (2026-06-10) — all folded into this one group:
  * `agent:cc-pm`, `agent:cc-exec`, `agent:cc-qa` — the three Claude Code roles in the PM -> exec -> QA loop (see *Agent routing* below)
  * `agent:human` — decisions, design, launch ops, anything human-owned. Also set by exec and pm-merge on the Blocked/CI-fail path (evicts the active agent label)
  * `agent:claude` — claude.ai work that needs an MCP the CLI lacks (e.g. Figma)
  * `agent:codex`, `agent:gpt`, `agent:replit` — other agents
* **Single-select:** an issue carries exactly one `agent:*` at a time. Setting a new one evicts the previous, so a handoff is just setting the next role — never two at once.

**Workstream** (what domain): `work:product`, `work:experience`, `work:ai-behaviour`, `work:content-data`, `work:configuration`, `work:engineering`, `work:infrastructure`, `work:analytics`

**Pipeline-specific** (on Network / opportunity issues):

* Contact type: `contact:network`, `contact:reconnect`, `contact:loose`, `contact:recruiter-internal`, `contact:recruiter-agency`
* Opportunity mode (what a relationship might produce): `opp:advisory`, `opp:fractional`, `opp:consulting`, `opp:fulltime` — applied only when signalled; a plain network contact may carry none until refined
* Warmth: `warmth:warm`, `warmth:cool`, `warmth:cold`
* Role stage (on Roles issues): `stage:applied`, `stage:screen`, `stage:interview-1`, etc.
* Surfaced markers: `surfaced:role`, `surfaced:advisory`, `surfaced:pitch`, `surfaced:done` (see above)
* Reporting: `reporting:contact`

A typical engineering ticket carries one `type:`, one `work:`, and one `agent:*`. A Network contact carries a `contact:*`, `reporting:contact`, `type:task`, and an `opp:*` only where a mode is known.

Note: `author:*` (`author:aled`, `author:codex`, etc.) marks who *created* something. The agent execution axis is the `agent` group above. (`author:claude-code` and all `exec:agent:*` labels were retired on 2026-06-02 — `agent:cc-*` now carries Claude Code routing.)

### Label storage and querying — groups vs flat labels

Several axes are Linear **label groups**, and the API stores, filters, and sets a grouped label by its **leaf name only**. The `group:leaf` form shown in the Linear UI (e.g. `agent:cc-exec`, `type:feature`) is **display only** — passing it as a `list_issues` label filter matches **nothing**, and it is *not* the string you pass to set the label either. The `agent:cc-*` / `type:*` forms used in the prose of these skills are read as that human-readable display; every actual API call uses the bare leaf.

* **Grouped axes — use the leaf name in API calls:** `agent` (`cc-exec`, `cc-pm`, `cc-qa`, `human`, `claude`, `codex`, `gpt`, `replit`), `type` (`epic`, `feature`, `story`, `bug`, `triage`), `work` (`engineering` only), `stage`, `warmth`. A scan for cc-exec tickets filters on `cc-exec`, never `agent:cc-exec`.
* **Flat labels — use the full literal name:** all `work:*` except `engineering` (`work:configuration`, `work:infrastructure`, …), the lone `type:task`, plus `domain:*`, `author:*`, `reporting:*`.

So the executor and routing scans in *exec*, *pm-triage*, *qa-review*, and *pm-merge* all filter on the leaf names `cc-exec` / `cc-pm` / `cc-qa` / `human` — a scan returns the same set a human sees filtering that label in the Linear UI.

**Known divergence (documented as current reality, not yet reconciled).** The `type` and `work` axes are mixed. `type:task` is a *flat* label literally named `type:task`, while its siblings `epic` / `feature` / `story` / `bug` / `triage` are grouped leaves; likewise every `work:*` is flat except `engineering`, which is a grouped leaf under `work`. A scan must therefore use whichever form the specific label actually takes — `feature` but `type:task`; `engineering` but `work:configuration`. Regrouping these for consistency is a separate Linear-data cleanup, not a skills change.

## Agent routing — the cc-pm / cc-exec / cc-qa loop

Claude Code work runs as a loop across three roles, routed by the single-select `agent` label and driven by polling Cloud Routines. There is no Linear agent app user — `@claude-code` is a label, not a user, so triggering is by label, not by agent session. **Aled is the gate; nothing merges without his approval.**

* `agent:cc-pm` — triage and project management. Reads the issue and comments, sets status / priority / links, decides whether it needs execution. If it does, sets `agent:cc-exec` and moves to Todo (never Backlog), clearing the assignee, with a comment stating what's needed and the acceptance criteria. Where a human decision is required, leaves it clearly for Aled. Suggest-mode first (proposes moves as comments) until trusted. cc-pm also carries the **post-review approval/merge gate**: when Aled approves a reviewed (cc-qa) ticket by setting `agent:cc-pm` (evicting `agent:cc-qa`) and giving his `@cc-pm` signal, the pm-merge leg squash-merges and closes it (see pm-merge).
* `agent:cc-exec` — execution. Claims the ticket by moving it to In Progress and clearing the assignee (a ticket in In Progress under `agent:cc-exec` is being worked and is never re-grabbed — status is the lock; no separate lock label). Runs Claude Code against the connected repo, opens a PR (never merges), then sets `agent:cc-qa` and moves the ticket to In Review, **leaving it unassigned** (the assignee is set by cc-qa once review is done).
* `agent:cc-qa` — review. Reads the PR against the criteria embedded in the ticket (Pattern A) and writes a plain-language summary Aled can act on without reading code: if clean, what was done plus confirmation it meets the DoD; if changes are needed, everything the exec agent needs to act on. Reviews as an **independent** pass, not a same-author rubber stamp: from isolated inputs only (the ticket, its embedded criteria, and the diff — not the exec session's reasoning or the PR narrative, which is a claim to verify), adversarially framed (prove each criterion fails; reject unless demonstrably met), and on the evidence of what it actually ran, not what the diff implies (see *qa-review*). Does not merge, change state, or change the `agent:*` label. Once the verdict is posted, it **assigns Aled** (leaving the label `agent:cc-qa`), so the reviewed ticket sits in his queue. Switching to `agent:cc-pm` is Aled's approval action — the ticket stays in the QA lane while he may still have follow-ups.

With the ticket assigned to him and still at `agent:cc-qa`, Aled either raises follow-ups (a bounce — **In Review -> Todo with a note** re-triggers the exec agent on the same ticket) or approves by **setting `agent:cc-pm` and giving his `@cc-pm` signal**, which triggers the pm-merge leg. This is Pattern A (below) with a QA write-up and an explicit approval gate added — review stays a state transition Aled owns, not a separate ticket.

**Send-back and disambiguation.** When a delivery ticket fails late (qa-review "changes needed" or pm-merge CI failure), it lands on Aled with `agent:human`. Aled's decision to retry is gated: he sets `agent:cc-pm` on the ticket with a send-back comment. Because `agent:cc-pm` on an In Review ticket carries two meanings — **"approve and merge"** (→ pm-merge) and **"send back to exec"** (→ pm-coordinate) — the pm leg reads Aled's comment intent to disambiguate. On a send-back, pm-coordinate relabels `agent:cc-exec`, moves the ticket to **Todo**, ensures the fix instructions are in the body or most recent comment, and clears the assignee. No keyword required; the intent in the comment text is the signal. Because Aled is in the loop on every failure, no automatic exec⇔qa loop is introduced.

Concurrency: the exec leg only picks up `agent:cc-exec` tickets in **Todo**, and skips its run if any `agent:cc-exec` ticket is already In Progress (one Claude Code agent per repo). Todo = ready, In Progress = running. No separate lock label is required.

Scope: the loop runs across delivery projects only. It must never touch the Pipeline team (Network / Roles / Advisory / Pitches) — that's relationship and business-development work, not delivery.

## Autonomous-loop conventions

These conventions let the Claude Code loop run with Aled in the path only by exception. They govern ticket entry, the human-review signal, and the sign-off gate. pm-triage, cc-exec, qa-review, and pm-merge all read them.

### Default executor label on Backlog entry

A delivery ticket created in Backlog carries `agent:cc-pm` by default, so triage picks it up without Aled hand-labelling. A ticket that is Aled's own — a decision, a human task, something he wants to hold — carries `agent:human` instead and is assigned to him; it is never auto-routed. This default never applies to the Pipeline team; epics carry no agent label.

### The human-gate flag

A ticket's body may carry a single explicit line declaring whether Aled's review is required:

```
Human gate: required — visual review
Human gate: required — decision
Human gate: required — info gap
Human gate: none
```

The flag lives in the ticket body (canonical, Pattern A), not in a label. **Absence is permission** — no flag, or `Human gate: none`, means the ticket is safe to flow autonomously. Only an explicit `Human gate: required` pulls Aled in.

**Who sets it:** pm-triage writes the flag during refinement whenever the work needs Aled's visual review, a decision, or carries an info gap it cannot close.

**Who reads it:**
- **qa-review** auto-approves (sets `agent:cc-pm`) only when the ticket is unflagged and its pass is clean. A flagged ticket is handed to Aled. *(Auto-approval activates once APP-186 — reviewer independence — ships; until then, qa-review assigns Aled as today.)*
- **pm-merge** is unchanged — it acts only on the `agent:cc-pm` signal, whoever set it.

## Pattern A — folded validation (the core working discipline)

This is how build/agent work is validated, and it's non-negotiable:

**Review criteria live inside the build ticket as a checklist. There are no separate review tickets.**

When an agent finishes a ticket:

1. It checks its work against the criteria embedded in the ticket body.
2. It moves the ticket to **In Review**. In the Claude Code loop the exec agent leaves the ticket unassigned for cc-qa, which assigns Aled once review is done; a solo agent with no QA leg reassigns Aled itself.
3. It does **NOT** mark the ticket **Done**. Sign-off is human for flagged work (`Human gate: required`); unflagged work in the Claude Code loop is signed off by an independent QA pass. *(Requires APP-186 for auto-approval to be active — until then, qa-review assigns Aled as today.)*

Aled reviews against the embedded criteria and moves it to Done himself. This keeps the human queue showing only actionable work — review is a state transition, not a separate piece of work. When writing a ticket an agent will execute, embed the acceptance criteria in the body so this works.

**Non-repo criteria.** If a criterion covers an artefact outside the repo diff (e.g. a Linear document, Figma frame, deployed URL), mark it with `[human-verify]`. qa-review will note it as "marked for human verification" and skip it rather than flag it as ambiguous. Exec must still complete the action; the marker tells QA not to chase it in the diff. Example:

```
- [human-verify] Decision log entry written in osclaude.log-decisions (Linear doc)
```

## Structure: hierarchy, milestones, blocks

Three orthogonal axes carry how work is organised. Keep them distinct — conflating them is what makes the board hard to read.

* **Hierarchy = grouping.** `type:epic` is an outcome, carried as a parent issue. Epics never carry `agent:cc-exec`, are never claimed by the exec leg, and are closed only by Aled when their children are done. `type:feature` / `type:story` are capability slices under an epic — parents of tasks where the work is multi-step. `type:task` is the executable unit. **The exec leg only ever claims leaf tickets, never an epic.**
* **Milestones = ordering.** Milestones are the phases within a project (the pattern: app.fitness M1–M6, os.Claude M1–M3). Strategic sequence — platform order, phase order, "do this before that" — lives in milestones and in Aled's promotion to Todo, never in blocks. Every refined leaf ticket gets a milestone where the project has them.
* **Blocks = genuine dependency only.** A blocked-by relation means the work technically cannot start until the blocker is Done or Canceled (shared files that would conflict, an artefact that must exist first, a decision that gates scope). Never use a block to express sequencing preference — that is what milestones are for. The exec leg may add a blocked-by relation at runtime when it discovers an undeclared but genuine dependency (see *exec* skill, Blocked fail-safe); this is legitimate and is how pm-merge knows to auto-unblock the ticket after the blocker merges. See also *Blocker discipline* below.
* **Assignee = a human action is needed.** Assign Aled to a ticket only when it carries a genuine question, decision, or verification that is his to make. Never assign him merely because work is parked — the Refinement state already carries the parked-for-Aled gate, and a blanket-assigned queue makes "assigned to Aled" meaningless as a signal. (In the Claude Code loop the assignee is deliberately clear through exec and review; it becomes Aled only when cc-qa finishes its review — at which point his approval or follow-up genuinely is the next action.) Any comment that assigns Aled must @mention him (`@aledpritchard`) and lead with the specific action or decision needed, phrased so he can reply or act directly.

## When creating tickets — the standard shape

A well-formed ticket Aled hasn't yet refined contains:

* **Title** — action-prefixed and specific, e.g. `PROPOSAL: ...`, `CASE STUDY (short): ...`, `SCOPE: ...`, `DRIFT: ...`. Prefix signals the kind of work at a glance. (Pipeline issues follow their own title rules: Network -> `[Name] — [Company]`; opportunity funnels -> titled for the opportunity, never the person.)
* **Objective** — one or two sentences on what this ticket is for.
* **Why this matters** — brief context, especially how it connects to other work.
* **Body** — the substance; for agent tickets, embed acceptance criteria here (Pattern A).
* **Notes for Aled to address** — when the brief isn't fully defined, list the open questions/decisions explicitly. This is what makes a Backlog ticket refinable rather than vague.
* **On completion** — usually "refine with the answers above, then move to Todo."

Set **assignee** (Aled only when the ticket carries a genuine question or decision for him — see the assignee rule under *Structure*; otherwise leave it unassigned), **state** (Backlog unless told otherwise), **priority** (`Urgent`/`High`/`Medium`/`Low`/`None` -> 1/2/3/4/0), and **labels** per the taxonomy.

Issue numbers are auto-assigned by Linear (each team has its own key — COS, APP, PIPE, A1, MRP) — never invent them.

## Decomposing mixed-executor / multi-gate tickets

A ticket that mixes executor types or requires more than one human gate at different stages cannot be expressed cleanly in the build loop. Split it before routing — never after.

**The two rules (new tickets only — no retroactive sweep of open mixed tickets):**

1. **Split human-owned setup from agent implementation.** A discrete human-owned prerequisite (account creation, credential provisioning, a design or launch decision) becomes its own `exec:human` ticket, marked as blocking the implementation ticket.
2. **One human gate per ticket.** If a ticket needs more than one human gate at different stages (provision-then-build, or build-then-approve-a-production-migration), split so each ticket has a single gate. A production data migration in particular gets its own ticket.

**Trivial-enough threshold — leave bundled only when all three hold:**
- Same executor throughout — no human↔agent switch.
- Completable in the same session/PR with no external wait (no account, credential, third party, DNS, or another person).
- Reversible and not separately approved (no production migration, launch, or irreversible action).

Split when any one fails. Time is a tiebreaker, not the test — the governing question is "is there a real hand-off or gate?", not the clock.

pm-triage enforces this at ticket intake: split multi-gate tickets, or flag when a split is not possible.

## Documents and the decision log

**Filing a document:** use the document tool (create/update), set `title` and the parent `project`. Documents hold canon (specs, patterns, truth captures, playbooks, prompts). One doc per artefact. Type-prefix the title: `skill.` (reusable procedure), `routine.` (scheduled automation), `task.` (one-off).

**The decision log** (`build.log-decisions`, in cOS.Build) records every architectural/scope decision. Newest entries at the top. Each entry uses this template:

```
### YYYY-MM-DD — [Decision title]
Decision: What was decided
Context: What was happening / what triggered it
Why: Reasoning. Options considered briefly where relevant.
Impact: What changes downstream
Status: Active / Superseded by [X]
```

When you make or help make a consequential decision, add an entry. When a logged decision is later resolved or reversed, update its entry rather than leaving a stale one.

## Canon and source-of-truth discipline

* **Linear is canon — with one scoped exception.** Project MD files, the website, and synced copies are *derived from* Linear. When they disagree, Linear wins (or Linear needs updating — but the file never silently becomes the source).
* **Exception (2026-06-05): skill, task/routine, and agent artefact content.** The `assoc-one/claude-ops` GitHub repo is the source of truth for these artefacts. Author and edit them in the repo; [agents.aledpritchard.com](http://agents.aledpritchard.com) builds from the repo, and the rendered site is the review surface. Maintaining the same content in claude.ai, GitHub, and Linear was three copies of one artefact — the repo collapses that to one. Linear keeps the tickets and decision log *about* the artefacts; the os.Claude artefact docs are reference copies, not the source. (Decision: osclaude.log-decisions, 2026-06-05.)
* **Never edit canon silently on Aled's behalf when the change is consequential.** Detecting drift or proposing a change -> raise a ticket assigned to Aled. Canon changes are human-owned. (Mechanical, agreed updates are fine; judgement calls are not.)
* **Don't fabricate or infer.** If a fact is missing, flag the gap rather than fill it. For anything describing real work, the truth captures (`tc.*`) are authoritative — fetch the source, don't rely on memory of a past session.
* **Keep the layers distinct.** Career narrative/arc (`cos.narrative`, `cos.operating-model`), transformation patterns (`cos.transformation-patterns`), and evidence (`tc.*`) are separate layers. Don't collapse them.

## The three execution lanes

Work runs in three parallel lanes that must not collide:

1. **Claude Code in the repo** — one agent at a time per repo (git conflicts otherwise); tickets run serially in priority order.
2. **Aled in content/design surfaces** — runs in parallel (different surfaces, no conflict).
3. **claude.ai for spec/Figma/content** — runs alongside both (separate session, MCP-dependent work).

When sequencing tickets, mark sequential dependencies explicitly (one Claude Code ticket blocks the next); mark what can run in parallel. Don't queue two Claude Code tickets as simultaneously actionable.

**Blocker discipline.** Blocked-by relations are for genuine dependencies only: shared files that would conflict, artefacts that must exist first (assets, builds, merged tooling), or decisions that gate scope. Strategic sequencing — platform order, milestone order, "do this before that" — is carried by project milestones and Aled's promotion to Todo, not by blocks. Never add a blocked-by relation merely because tickets are thematically sequential. The exec leg skips ineligible (blocked) tickets rather than stalling; a spurious block silently delays delivery.

## Enumerating issues at scale

`list_issues` always returns full `description` bodies — there is no field-projection option. A query that returns more than ~15–20 issues will overflow the tool-result token budget, get dumped to a file, and force a mid-run workaround.

**Rules for list-heavy skills (pm-triage, ops-sync, ops-retro, exec, and any routine that scans many tickets):**

1. **Query as narrowly as the job allows.** Always filter by `label` + `state` + `project`/`team`. Never call `list_issues` with only a state filter on a large project.
2. **Prefer per-label/per-state probes.** Query `cc-exec`+`Blocked`, then `cc-pm`+`Blocked` separately rather than all Blocked in one call. Small, targeted calls stay within the token budget.
3. **For a genuinely broad scan, delegate enumeration.** When a large set is unavoidable, spawn a subagent to fetch the list and return only `id`, `title`, `status`, `labels`, `assignee`, `updatedAt` — keeping full descriptions out of the main context.

This is a workaround for an MCP limitation (Linear MCP has no field-projection parameter). If Linear's MCP adds projection in future, this convention can be relaxed.

## Comment ordering gotcha — list_comments updatedAt reordering

`list_comments` orders by `updatedAt` desc by default. Any skill that re-touches a comment (edits it, adds a reply, or scans it in a sweep) bumps its `updatedAt` — which resurfaces it at the top of the next query. This means `limit: 1` does **not** reliably return the chronologically latest comment; it returns the most recently *touched* comment.

**Rule:** Any skill that reads comments to verify an approval signal, routing intent, or watermark position must use `orderBy: createdAt` and a sufficient limit (or scan the full thread), never `limit: 1` with default ordering. This applies to pm-merge (approval check), pm-triage (send-back disambiguation), pm-coordinate (watermark), and any other skill reading comment state for a decision.

## Tone for ticket and doc content

Aled's tone of voice applies to everything written into Linear: calm, precise, structurally confident. Sentence case. No exclamation marks. No marketing-speak. Outcome before adjective. British spelling. (Full reference: `cos.tov`.)

## Comment voice — agents vs Aled

Comments in the Claude Code loop serve two distinct audiences. Write for the reader, not yourself.

**Agent-addressed comments** (handoffs, locks, audit trail, dedup keys) — structured and dense:
- Exact identifiers: ticket IDs, PR numbers, commit SHAs, label names as they appear in the API.
- No prose padding. Machine-readable where possible.
- Examples: exec's handoff comment (`PR ready: #57`), qa-review's `[qa-review] HEAD: <sha7>` dedup key, pm-merge's merge confirmation.

**Aled-addressed comments** (assignments, gates, blockers, decisions, bounces) — clear and direct:
- Lead with the specific ask — what Aled must do or decide, in the first sentence.
- Explain consequences in non-technical terms — outcomes, not implementation details.
- When he has steps to complete, list each step explicitly and numbered.
- @mention him (`@aledpritchard`) whenever he is the action owner.

**Status emoji** — wherever a pass/fail outcome is reported: ✅ = success/merged/pass, ❌ = failure/changes needed, ⚠️ = blocked/flagged/caution. Lead Blocked-path comments with ⚠️ or ❌.

All agent skills inherit this. exec, pm-triage, pm-merge, and qa-review embody it; they don't re-state it.

## Quick checklist before creating or updating anything

- [ ] Right team and project? (Pipeline for people/opportunities; A1 for the consultancy; Mr Pritchard for editorial; careerOS for the system; Apps for builds.)
- [ ] Person -> Network; opportunity -> Roles/Advisory/Pitches titled for the opportunity, linked back?
- [ ] Backlog (not Todo) if Aled hasn't refined it?
- [ ] Correct label set? (engineering: one `type:`/`work:`, plus one `agent:*`; Pipeline: `contact:`/`reporting:contact`/`type:task`, `opp:` only where known)
- [ ] Assignee — Aled only where a genuine human action (question, decision, verification) is needed, not as a blanket gate?
- [ ] Hierarchy and milestone set? (Leaf ticket under the right epic/feature; milestone assigned where the project has them. Epics never carry `agent:cc-exec`.)
- [ ] For agent tickets: acceptance criteria embedded in the body (Pattern A)?
- [ ] Human-gate flag set in body? (`Human gate: required — reason` or `Human gate: none` — or absent, which also means none)
- [ ] Notes section listing open questions, if the brief isn't fully defined?
- [ ] Consequential decision made? -> decision-log entry added.
- [ ] Skill/task/agent artefact content? -> edit it in `claude-ops`, not the Linear reference copy.
- [ ] Tone clean per `cos.tov`?
