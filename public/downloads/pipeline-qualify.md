# pipeline-qualify

Qualifies Pipeline Backlog tickets for promotion to Ready. Part of the PM agent — runs after the
pipeline sweeps, on all funnels (Network, Roles, Advisory, Pitches). Ready means fit for action:
Aled can read it and act. Backlog means captured but not yet validated.

## Context

- **Team:** Pipeline (key PIPE). All four projects: Network, Roles, Advisory, Pitches.
- **Flow:** Sweep → **Backlog** → this skill → **Ready** → Aled → **Todo**.
- **Scope:** Backlog only. The only state change this skill makes is Backlog → Ready.
- **Source of truth for templates:** `skill.pipeline-sweep` (Summary/Detail structure per funnel type).
- Runs as a **Cowork scheduled task** — Linear connector only, no Gmail, no web_search, no enrichment.

## Trigger

Poll all Pipeline projects for issues in **Backlog**. Process up to 15 per run (oldest first). If none,
report "nothing to qualify" and stop.

## The three outcomes

Apply exactly one outcome per issue:

**(a) Promote** — all required fields present, format correct, no missing information. Move to
**Ready**, no other changes.

**(b) Fix and promote** — content is present but structure is wrong or fields are incomplete.
Apply the correct Summary/Detail template, populate from available content in the issue (description,
comments, labels), then move to **Ready**. Always note what was fixed in a comment.

**(c) Flag** — information that only Aled can supply is genuinely missing. Add a comment that
**@mentions Aled**, specifying exactly what is needed (one line per gap). **Assign the issue to Aled**.
Leave in Backlog. Do not guess or fabricate.

When in doubt between (b) and (c): flag. Do not invent company names, contact names, role titles, or
relationship angles.

## Unparseable links → ask for a paste

Some gaps exist only because the linked JD or profile couldn't be parsed at capture time (most
common with LinkedIn job and profile URLs, which block automated fetching).

- **When flagging such an issue (c),** the flag comment must — in addition to the gap list — ask
  Aled to **paste the JD / profile text as a comment on the issue**. Make clear a raw copy-paste is
  fine; no formatting needed.
- **Before deciding any issue's outcome, read its comments.** If Aled (or anyone) has pasted JD or
  profile content into a comment, treat that paste as issue content: extract the role title, company,
  stage signals, contact details, or angle from it, apply the correct Summary/Detail template
  (outcome b), and promote. Reference the source comment in the "Qualified:" note, and if the issue
  was assigned to Aled by a previous flag, leave the assignment in place for him to clear.

## Required fields by funnel type

### Network / Recruiters (people issues)

Summary block must have:
- `Contact:` name and company (or `Recruiter:` / `Type:` / `Relationship:` for recruiter shape)
- `Mode:` advisory/consulting/— or equivalent
- `Next:` a specific, actionable next step (not blank, not "TBD")

Detail block must have:
- `Who:` enrichment or brief context
- `The angle:` why this relationship matters / what could surface
- `Source:` how captured

Labels required: one `contact:*` + `reporting:contact` + `type:task`. A `warmth/*` label (provisional
is fine). `opp:*` is optional unless clearly signalled.

**Fix (no flag needed):** wrong/missing structure → reformat into template using existing content;
missing warmth → infer from contact type (`contact:reconnect` → `warmth/warm`,
`contact:network` → `warmth/cool`, recruiter → `warmth/cool`) and mark provisional in a comment;
missing or vague Next → infer from Suggested next action in Detail, or write "[Next action needed]"
and include in flag.

**Flag to Aled (c):** company not identified; contact name missing; no angle at all (the issue has
no usable explanation of why this relationship matters); bare-ID ticket already assigned to Aled (skip
these — they're already flagged).

### Roles (opportunity issues)

Summary block must have:
- `Role:` title (not "TBD")
- `Stage:` a stage group label or "pre-application"
- `Surfaced by:` who or how surfaced

Detail block must have:
- `The opportunity:` what the role is / why it's a fit
- `Source:` how it arrived

Labels required: `type:task`. A `stage/*` label where known.

**Fix:** missing structure → reformat; missing stage → set `stage/applied` as provisional, flag in
comment; missing `opp:fulltime` where clearly a perm role → add.

**Flag to Aled (c):** role title is "TBD" or company is "unknown" (unenriched bare-ID capture — do
not fix; ask Aled to paste the JD text as a comment per "Unparseable links" above); no source
information at all.

### Advisory / Pitches (opportunity issues)

Title must be the company/engagement name — never a person's name.

Summary and Detail blocks required. The angle (what the engagement would be) and source required in
Detail.

**Flag to Aled (c):** no company identified; no description of the engagement or why it's relevant.

## After each issue

- **(a)** Move to Ready. No comment needed.
- **(b)** Move to Ready. Add a brief comment: "Qualified: applied [what was fixed]."
- **(c)** Leave in Backlog. Add a comment @mentioning Aled listing the specific gaps — and, where a
  gap traces to an unparseable link, asking him to paste the JD/profile text as a comment. Assign to Aled.

## Report

At end of run:
- Issues promoted as-is (a): count + `PIPE-NN — Title`
- Issues fixed then promoted (b): count + what was fixed per issue
- Issues flagged to Aled (c): count + gap per issue
- Issues skipped (already assigned to Aled / another state / genuinely ambiguous): count + reason

## Constraints

- **Linear only.** No Gmail, no web_search, no enrichment lookups.
- **Backlog → Ready only.** Never sets Todo, Awaiting, Active, or any other state.
- **Never fabricates.** If a field value can't be inferred from existing issue content, flag it.
- **Add-only on labels.** Only adds missing required labels; never removes existing ones.
- **Aled is the gate.** Qualified tickets move to Ready; moving to Todo is always Aled's action.
