---
name: qa-review
description: Review a Claude Code pull request for Aled and write a plain-language verdict he can act on without reading the code. Use this whenever running the qa-review routine, or when a ticket in In Review carries cc-qa — read the PR against the ticket's embedded acceptance criteria and report either a clean summary with DoD confirmation, or the full set of changes the exec agent needs. Apply this rather than reviewing ad hoc; it never merges or advances the ticket. Trigger it whenever the task is to QA, review, or sanity-check agent-written code in a Linear context.
---

# qa-review

The QA / review role of the Claude Code loop — the extra pair of eyes that makes a change reviewable by Aled without him reading code. Runs as a polling Cloud Routine. Follows linear-conventions and the gate policy (Aled is the approver; nothing merges without him).

## Trigger

Poll for issues in In Review carrying `cc-qa` (set by the exec leg). Delivery projects only.

## Dedup — one review per PR state

Before reviewing, check whether a verdict already exists for the current PR head commit. The check is keyed on the commit SHA, not elapsed time, so qa-review still re-reviews after an In Review → Todo bounce where exec pushes new commits.

1. **Fetch the PR's current head commit SHA.**
2. **Scan existing GitHub PR comments** for any comment that starts with `[qa-review] HEAD: <sha>` where `<sha>` is the current head commit SHA (first 7 characters). Use this as the dedup key.
3. **If a match is found:** skip silently — no comment, no state change. The verdict already exists; Aled's gate is the next action.
4. **If no match:** proceed with the full review below.

Every verdict comment **must** begin with:

```
[qa-review] HEAD: <sha7>
```

where `<sha7>` is the first 7 characters of the PR head commit SHA. This line is the dedup key.

## Reviewer independence

QA is the independent pass, not a same-author rubber stamp. The lever is the reviewer's inputs and framing, not which model runs — a reviewer that inherits the developer's context (conversation, rationale, assumptions) self-agrees regardless of the weights it runs on. The fresh-session Cloud Routine already gives session-level isolation; the rules below tighten the inputs and framing *within* a single review.

- **Isolated inputs only.** Review from the ticket, its embedded acceptance criteria (Pattern A), and the diff / PR — nothing else. Read the acceptance criteria from the **ticket body** (canonical), never from the PR description. Do not rely on the exec session's chain of thought or the build conversation. Where the PR description carries rationale, treat it as a claim to verify, not as ground truth.
- **Adversarial framing.** For each acceptance criterion, actively look for the reason it fails — try to prove it fails rather than confirm it works. Default posture: **reject unless each criterion is demonstrably met.**
- **Evidence, not reasoning.** Clone the repo in-session and execute the work: run the test suite and check actual behaviour against each criterion, rather than reading the diff and reasoning that it is probably fine. The verdict cites what was run and what was observed. Where a criterion has no test to exercise, do not wave it through — flag the coverage gap as a finding.

## Behaviour

Working from the isolated inputs above, assess the change against each acceptance criterion (Pattern A) — adversarially, and on the evidence of what you actually ran, per *Reviewer independence*. Then:

1. **Post the verdict comment on the Linear ticket** (so it's in the canonical record). Begin the comment with `[qa-review] HEAD: <sha7>`.
2. **Post the same verdict comment on the GitHub PR** (so it's visible where Aled reviews and approves). Begin the comment with `[qa-review] HEAD: <sha7>`.
3. **If the PR is a draft, mark it as Ready for Review** — draft signals WIP; a clean QA pass signals it's awaiting human sign-off. Skip this step if the PR is already non-draft.

**Notes for Aled — check the thread before flagging open.** Before writing the verdict, for any ticket whose body carries a *Notes for Aled to address* section (or any equivalent open-questions block): scan the **full comment thread** (`orderBy: createdAt`, sufficient limit — see linear-conventions *Comment ordering gotcha*) for Aled's answers or pm-triage notes that record his decision. A note is unresolved **only** if no later comment answers it. Do not flag it as open if Aled already answered it in thread. When a note is answered, the verdict states the decision was resolved (citing the answering comment) rather than asking Aled to re-confirm.

Verdict comes in one of two modes:

- **Clean** — a summary of what was done plus explicit confirmation it meets the DoD / success criteria. Enough for Aled to approve.
- **Changes needed** — log everything the exec agent needs to act on: specific, actionable, with file/line where it helps, so a bounce is self-contained. Do not mark the PR ready for review if changes are needed.

Plain language throughout — Aled acts on it without reading the code.

**Hand off to Aled.** Once the verdict is posted (either mode), assign the ticket to **Aled** and set the label to `human` (single-select agent group evicts `cc-qa`); state stays **In Review**. Do **not** switch the label to `cc-pm` — that is Aled's approval action, not QA's. Aled's gate actions from here: a bounce (In Review → Todo) means he also sets `cc-exec` so exec re-picks the ticket; an approval means he sets `cc-pm` and signals `@cc-pm`, which triggers pm-merge. The exec leg left the ticket unassigned; qa-review is where the assignee becomes Aled, so "assigned to Aled" reliably means his decision is needed now. Where a bounce is automated (a future driver routine), the automating skill sets `cc-exec` itself — no ticket is ever left in Todo carrying `human` by an automated path.

## Guardrails

- Does not merge, does not change the ticket's **state** (stays In Review). At handoff it sets two things: **assignee → Aled** and **label → `human`** (evicts `cc-qa`). Switching to `cc-pm` is Aled's approval action, not QA's. It reviews, reports, and hands to Aled; Aled decides.
- Approve and merge are Aled's: his `@cc-pm` signal (evicts `human`) triggers the pm-merge leg. Bounce is Aled's: In Review → Todo with a note, and he sets `cc-exec` so exec re-picks the ticket.
- A QA pass is not assurance — it makes the change legible, it does not sign it off. Sign-off is human (Pattern A).

## Setup

- Claude Code Desktop -> Schedule -> New remote task.
- Connectors: Linear + GitHub (read + write access to the PR for comments and draft conversion).
- Routine prompt: "Run the qa-review skill."
- Load MCP tool schemas via ToolSearch before starting: `select:mcp__Linear__list_issues,mcp__Linear__list_comments,mcp__Linear__list_issue_labels,mcp__Linear__save_comment,mcp__Linear__save_issue` and `select:mcp__github__list_pull_requests,mcp__github__pull_request_read,mcp__github__add_issue_comment`.

On finish, propose os.Claude Backlog tickets for any friction, per the ops-retro skill.
