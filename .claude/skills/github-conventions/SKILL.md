---
name: github-conventions
description: "Conventions for GitHub in Aled's system — repos in scope, branch naming, PR structure, and GitHub MCP usage. Read before any operation that touches GitHub: creating repos, branches, PRs, or using the GitHub MCP tools. Grown as the conventions solidify."
---

# github-conventions

How GitHub is used in Aled's system. Follows the same pattern as `linear-conventions`. Grown here as the conventions solidify — this is a stub, not the final word.

## Role

GitHub is the source-control and PR host. All delivery repos live under the `assoc-one` organisation. Claude Code agents interact via the GitHub MCP tools (prefixed `mcp__github__`).

## Repos in scope

| Repo | Purpose |
| -- | -- |
| `assoc-one/claude-ops` | Skill, task, and routine artefacts (canon for the operating layer) |
| `assoc-one/assoc-one` | Association of One consultancy site |
| `assoc-one/aledpritchard-com` | Aled Pritchard personal/portfolio site |
| `assoc-one/meirionpritchard-com` | Meirion Pritchard portfolio |
| `assoc-one/fitness` | Fitness app (React Native / Expo) |
| `assoc-one/careeros-web` | careerOS web product |
| `assoc-one/luna` | Luna MVP |
| `assoc-one/bot-trader` | Bot trader |
| `assoc-one/ds-poc` | Data science PoC |

## Branch naming

- **exec leg:** `claude/<ticket-id>` — e.g. `claude/app-144`. Always cut off fresh `origin/main`. When the session provides a pre-generated branch name, use it for the first ticket only; cut a fresh `claude/<ticket-id>` for each subsequent ticket.
- **Aled's branches:** `aled/<slug>` convention.
- Main branch is protected. Never force-push it.

## PR conventions

- **Title:** `{TICKET-ID}: {short description}` — e.g. `APP-144: add content-engine skill`.
- **Body:** summary, acceptance criteria checklist (Pattern A), session link.
- PRs are opened by exec, never merged by exec — merge is Aled's via pm-merge on the cc-pm signal.
- One PR per ticket. Never open a speculative PR.

## GitHub MCP tools

MCP tool schemas are not auto-loaded. Run `ToolSearch` with `select:mcp__github__<tool-name>` before the first call to any GitHub MCP tool. Key tools: `mcp__github__create_pull_request`, `mcp__github__list_pull_requests`, `mcp__github__push_files`, `mcp__github__get_file_contents`, `mcp__github__add_issue_comment`, `mcp__github__merge_pull_request`.

## GitHub App permissions required

For exec and pm-merge to function on a repo, the Claude Code GitHub App must have:
- **Contents: read & write** — required for push
- **Pull requests: read & write** — required for PR creation and merge

Read-only causes a 403 on push, which is a Blocked outcome for the exec leg.

## Gotchas

- MCP tool parameter names differ from REST API names — always load schemas via ToolSearch, never assume.
- `create_pull_request` auto-attaches the PR to the linked Linear ticket, which may re-assign Aled; clear the assignee again after PR creation.
- New repo creation (via `create_repository`) is scoped to the `assoc-one` org; check `list_repos` first to avoid duplicates.
