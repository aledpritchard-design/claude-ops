# pm-plan

The prioritisation and focus skill. Runs as a scheduled Cowork task on the Linear connector (Linear only — no GitHub). Follows `linear-conventions` throughout.

## Trigger

Scheduled run ~weekly across all delivery projects. Covers: careerOS (cOS.Build, cOS.System, cOS.Content, cOS.App), Apps (os.Claude, app.fitness, Luna MVP, bot.Trader), and A1 (all client projects). Never touches the Pipeline team (Network / Roles / Advisory / Pitches).

Routine prompt: `Run the pm-plan skill.`

## Behaviour

A run has four passes, executed in order.

### Pass 1 — Read the goals layer

Read all **outcome-initiatives** in Linear. These are the source of truth for prioritisation — the real goals, not just activity. For each initiative, note: name, current status, associated tickets, and any milestone targets.

**If no outcome-initiatives exist:** do not proceed with goals-based prioritisation. Instead:
1. Note the gap in the focus summary: "No outcome-initiatives found — prioritising by milestone target + priority only. To enable goals-based prioritisation, create Linear initiatives representing desired outcomes (not team mirrors)."
2. Fall back to milestone-target + raw-priority mode for the rest of the run.
3. Leave a comment on the os.Claude project or create an issue in Backlog (@mention Aled) flagging that outcome-initiatives need creating before goals-based prioritisation can run.

### Pass 2 — Read the board

For each delivery team, read all open tickets (Backlog through In Review; Done/Canceled excluded):

- Priority (Urgent/High/Medium/Low/None)
- Due date and milestone target
- Cycle membership (current cycle vs. none)
- State (Todo, In Progress, In Review, Blocked, Refinement)
- Labels (agent group, type, work)
- Blocked-by relations (any still-open blockers)

**Also read:**
- Current cycle for each team: its start/end dates and current membership.
- Any recent daily-report output (from comments or attachments on a dedicated daily-report issue if one exists), to inform the urgency picture.

### Pass 3 — Analyse

#### Importance vs urgency

Separate the two axes:

- **Important** — aligns to a goal-initiative or a near-term milestone. A high-priority ticket that doesn't map to any active initiative or milestone is not necessarily important — it may be drifted.
- **Urgent** — time-sensitive, a blocker for other work, or has a hard due date approaching within the cycle or week.

Produce a **focus recommendation**: the small set (aim for ≤5) that should be in flight now — highest-importance and highest-urgency combined, respecting the lane separation:

- Claude Code (cc-exec) lane: serial per repo — recommend the next eligible ticket per repo.
- Aled's lane: decisions, reviews, merges — the specific actions Aled needs to take this week.

#### Health checks

Flag these as findings (to write or surface, per the autonomy model):

- **Overcommitted cycle:** more than a sensible number of tickets in the current cycle with no realistic chance of completion.
- **Stale Urgent:** a ticket marked Urgent that hasn't moved in >3 days and is not actively being worked. Priority may have drifted.
- **Priority without milestone:** High/Urgent ticket with no milestone and no active blocked-by — candidate for milestone assignment or deprioritisation.
- **WIP violation:** more than one cc-exec ticket In Progress in the same repo. Flag by name — this is a rule violation.
- **Blocked tickets:** tickets in Blocked state that haven't been touched in >2 days. Surface to Aled.

### Pass 4 — Write and surface

Apply the **major/minor/fix autonomy model** (from Aled's direction, 2026-06-10):

**Fix-level (apply autonomously, comment to note):**
- Remove Done or Canceled tickets from the active cycle (they clutter cycle health).
- Add a due-date to a ticket when the milestone target is clear and the ticket has none.
- Correct a clear label inconsistency (e.g. a ticket at Urgent that was just unblocked and set Urgent as the "visibility flag" — lower back to its pre-block priority per the convention).

**Minor-level (apply autonomously, comment to note):**
- Adjust priority one step when milestone proximity clearly warrants it (e.g. a Medium ticket that blocks a High ticket due this cycle → promote to High).
- Add an unscheduled ticket to the current cycle when it fits within capacity and aligns to an active goal-initiative.
- Set a due date that follows directly from a milestone end date with reasonable lead time.

**Major-level (surface to Aled, do not apply):**
- Restructuring multiple tickets' priorities (changing focus direction).
- Recommending to cancel or defer a milestone.
- Recommending to cancel or deprioritise Urgent tickets.
- Any change that would substantially reroute the agent queue or Aled's attention.

For major findings, post a comment on the relevant ticket or project @mentioning Aled (`@aledpritchard`), stating the recommendation and the reason. Do not apply. Assign Aled.

## Focus summary

At the end of each run, post a summary to the os.Claude project (or a designated focus-tracking issue if one exists). The summary is the deliverable Aled reads ~weekly:

```
[pm-plan] Focus — <date>

Goal-initiatives: <n found> | <list names>

In-flight now (cc-exec):
• <repo>: <ticket> — <why it's the right next>

In-flight now (Aled):
• <action 1>
• <action 2>

This week's focus (important × urgent):
1. <ticket> — <one-line rationale>
2. <ticket> — ...
...

Health flags:
⚠️ <flag> — <one-line>

Writes applied this run:
✅ <fix/minor write applied> — <one-line>

Proposals (needs your decision):
❓ <major recommendation> — <link>
```

Keep the summary scannable. Aled reads it at his weekly review, not in a linear triage session.

## Guardrails

- Never marks Done. Done is Aled's gate; pm-merge acts only on his explicit approval signal.
- Never writes code and never opens a branch or PR.
- Never touches the Pipeline team (Network / Roles / Advisory / Pitches).
- Never autonomously cancels or Dones a ticket — surface it as a major proposal.
- Does not run inside an exec session — it reads tickets In Progress but does not claim or modify them.
- Fix/minor writes are applied in the same run; they are never batched silently. Always comment what was written.
- Major proposals are never applied in the same run as the proposal. Always wait for Aled's explicit approval in a comment.

## Setup

- Claude Code Desktop → Schedule → New remote task. Connector: Linear only.
- Cadence: ~weekly (or on-demand when Aled asks for a prioritisation review).
- Routine prompt: `Run the pm-plan skill.`

> **Prerequisites:** outcome-initiatives must exist in Linear before goals-based prioritisation can run. If they don't, Pass 1 creates a flagging issue and the run continues in milestone-priority fallback mode. Aled creates initiatives; pm-plan reads them.

On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill.
