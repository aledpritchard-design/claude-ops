# daily-report

Daily read-only routine skill. Reads Linear, writes Aled a morning brief in his register. Changes nothing — no status, comments, or labels.

## Behaviour

Read Linear and report. Change nothing.

Scope: all projects Aled owns, except the Pipeline team (Network / Roles / Advisory / Pitches) — that's relationship and business-development work, not delivery.
Window: last 24 hours.

Produce a brief with these sections, in order. Lead with what needs Aled. Skip an empty section in one line rather than padding it.

1. **Awaiting you** — In Review, especially `agent:cc-qa` or issues with a QA write-up. Per item: ID, title, what QA proposes.
2. **Your move** — other issues assigned to Aled needing a decision. Most consequential first.
3. **Done** — moved to Done in the window. Per item: ID, title, closing role.
4. **Blocked** — Blocked, or `agent:cc-exec` stalled >24h. Per item: ID, title, why (where a comment says).
5. **In flight** — In Progress under an `agent:cc-*` label. Per item: ID, title, role.

Format: scannable. Section headers, one tight line per item. Precise, no padding, no preamble, no date restatement, no sign-off. If nothing needs Aled, say so and stop.

## Setup

- Claude Code Desktop -> Schedule -> New remote task (cloud, machine off). Daily, ~7am.
- Connector: Linear only. No GitHub, no repo — this skill touches no code.
- Output: a file (~/Documents/Daily/morning-brief-{date}.md) or inbox.
- Routine prompt: "Run the daily-report skill."
