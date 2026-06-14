---
name: pipeline-sweep
description: Run a scheduled Gmail-to-Linear sweep that captures inbound pipeline mail into Aled's Pipeline team — people into Network, opportunities into Roles. Use this whenever processing the pipeline/* Gmail intake (networking, advisory, recruiter, or role emails), or whenever asked to run, refresh, or set up a pipeline sweep, triage pipeline mail, file a contact into Network, or capture a role into Roles — even if "sweep" isn't said explicitly. Handles extraction, one-search enrichment, dedup by name, the Summary/Detail issue template, the Pipeline funnel states, surfaced:* graduation markers, and add-only pipeline/triaged labelling. Runs as a Cowork scheduled task on the Gmail and Linear connectors; never touches a repo or the delivery loop. Applies only labels that already exist in the workspace.
license: Proprietary — Aled Pritchard workspace use.
---

# Pipeline sweep

One engine for all Gmail to Pipeline sweeps. The thin per-intake tasks (network / recruiters / roles)
set only the source label, the target funnel, and the unit, then invoke this skill. Everything below is
shared. Runs as a **Cowork scheduled task** — Gmail and Linear connectors, no repo, no code.

## Context

- **Linear:** team **Pipeline** (key PIPE). Projects used: **Network** (people) and **Roles** (opportunities).
- **Gmail:** intake labels under `pipeline/*`; processed marker `pipeline/triaged`.
- **Source of truth is live Linear.** Apply only labels and states that exist in the workspace. If a label
  you would want is missing, omit it and flag it — never invent or create one mid-sweep.
- The calling task supplies the **intake label**, the **target funnel**, and the **unit** (person /
  recruiter / role).

## The model (do not break it)

- People — including recruiters — live in **Network**. The unit is a person, titled `[Name] — [Company]`.
- Opportunities live in **Roles / Advisory / Pitches**, titled for the opportunity, never a person.
- A person never sits in an opportunity funnel. When an email reveals a concrete opening tied to a
  contact, stamp the contact with a `surfaced:*` marker — do not create the opportunity issue here.
  A separate graduation step spawns and links it.

## Gmail label syntax

Pass the nested label name directly into the query (`label:pipeline/network`) — do not translate it into
`Label_<id>` form (that returns empty in this wrapper despite the tool docs). If the slash form ever
returns empty against threads you can verify exist, fall back to `label:"pipeline/network"` (quoted) or
`label:pipeline-network` (dash form) — both equivalent. Use `list_labels` only for the `label_thread`
call later, which does require the ID.

## Steps

1. **Search** Gmail with the calling task's query, e.g. `label:pipeline/network -label:pipeline/triaged`.
   None → report "no new threads" and stop.
   **Throughput guard:** if more than ~15 threads match, process the 15 oldest and note the remainder.

2. **Extract** per thread: contact/role name, company, how known / who surfaced it, email address, the
   angle (why it matters / what could surface), every URL verbatim, and any time-sensitivity.

3. **FUNNEL NOTES.** If a `--- FUNNEL NOTES ---` block sits at the top of the body, treat its fields as
   source of truth (contact type, opp type, warmth, stage, priority, why-now, next action, relationship).

4. **Enrichment** — read the URL slug first, then at most one `web_search`; never `web_fetch` LinkedIn
   (robots-blocked at source — confirmed). Store every URL verbatim in Links first, so the manual-lookup
   link is never lost.
   - **Slug-first.** If a LinkedIn URL carries a descriptive slug, read it directly: a job link
     `/jobs/view/<title>-at-<company>-<id>` gives the title and company; a profile link `/in/<name-slug>`
     gives the person. Use that; a confirming `web_search` is optional, not required.
   - **One search otherwise:** build it from the best identifier (FUNNEL NOTES name + company, then the
     slug, then the email signature); pair name with company to cut collisions; use the snippet.
   - **Bare-ID short-circuit.** If the only identifier is a *bare* LinkedIn ID — a job `/jobs/view/<digits>/`
     with no slug, or an opaque profile `/in/<opaque-id>` — skip the search (it can't resolve and the page
     can't be fetched) and fall straight to email-only, with the next action set to "open the listing
     manually." When this (or any failed enrichment) leaves the role/contact materially unidentified —
     company or role unknown — then after creating the issue: **add a comment that @mentions Aled**,
     explaining it's a bare LinkedIn ID (or unresolvable link) that needs a manual look to capture
     title/company, and **set the issue assignee to Aled**. Flag it in the report.
   - Nothing useful from any path → email-only, note it. Don't loop.

5. **Classify — live labels only.** Apply only labels that exist; if a label you would want is missing,
   omit it and flag it rather than guessing or creating it. Most labels are flat `prefix:value`; `warmth`
   and `stage` are **grouped** (single-select) — reference their children as `group/child`
   (e.g. `warmth/warm`, `stage/applied`).
   - **Network (people):** one `contact:*` — `contact:network` (default), `contact:reconnect`,
     `contact:recruiter-internal`, `contact:recruiter-agency`. Add `reporting:contact` + `type:task`.
   - **Warmth (Network):** the `warmth` group is single-select — reference its children as
     `warmth/warm` / `warmth/cool` / `warmth/cold`. Set from FUNNEL NOTES if given; absent notes, set a
     provisional warmth from contact type — `contact:reconnect` → `warmth/warm`; `contact:network` →
     `warmth/cool`; recruiter or minimal prior tie → `warmth/cool` / `warmth/cold` — and flag it as
     provisional for Aled to refine. Don't overclaim warmth.
   - **Opp mode (Network):** `opp:advisory` is the default intent for advisory intake; it stays on the
     Network person and does not route to the Advisory project. Escalate to `opp:fractional` /
     `opp:consulting` / `opp:fulltime` only if the email or FUNNEL NOTES clearly signals it. A plain
     contact may carry no `opp:` until refined.
   - **Roles (opportunities):** `type:task`; `opp:*` and a `stage` where known; no `contact:*`. The
     `stage` group is single-select — reference its children as `stage/applied`, `stage/screen`,
     `stage/interview-1`, `stage/interview-2`, `stage/interview-3`, `stage/final`, `stage/offer` — set
     from FUNNEL NOTES or inferred; omit and flag only if genuinely unclear.
   - **Surfaced marker:** if a concrete opening (named role / named advisory engagement / A1 work) shows
     up against a person, add `surfaced:role` / `surfaced:advisory` / `surfaced:pitch`. Leave the
     graduation (creating the linked opportunity) to the graduation step.
   - When unsure on a person, default `contact:network` with no `opp:`, and flag.

6. **Dedup.** People: search Network by name — exists → comment the new context, don't duplicate (one
   issue per person). Roles: search Roles by role + company — likely match → comment instead. Report every dedup.

7. **Create** the issue in **Pipeline**, in the funnel the task names.
   - **Title:** Network → `[Name] — [Company]`. Roles → `[Role title] — [Company]`. No label or funnel names in the title.
   - **Description (Markdown)** — `## Summary`, then `---`, then `## Detail`:

     Person / recruiter:
     ```
     ## Summary
     **Contact:** [Name] — [Company]   (recruiter: **Recruiter:** … / **Type:** internal|agency / **Relationship:** new|active|dormant)
     **Mode:** [advisory | consulting | … | —]
     **Linked:** —
     **Next:** [one line — the immediate next action]

     ---

     ## Detail
     **Source:** Gmail thread on [date] (captured via [intake label])
     **Who:** [enrichment: title, company, location | else brief context]
     **How I know them:** [or who surfaced it]
     **The angle:** [advisory entry point / what the relationship could become]
     **Why now:** [FUNNEL NOTES or inferred]
     **Links:** [verbatim URLs]
     **Quoted snippet:**
     > [short quote from the email, under 15 words]
     **Suggested next action:** [FUNNEL NOTES or inferred]
     **Roles in play:** [recruiters only — note if a role has / should have a Roles issue]
     **Enrichment notes:** [search hit / email-only / no FUNNEL NOTES / any uncertainty]
     ```

     Role: same shape, with Summary = Role / Stage / Rate-Salary / Surfaced by / Linked / Next; Detail
     carries Role, the opportunity, Stage, Deadline, Links, snippet, next action, and the surfacing contact.

   - **State** (Pipeline funnel — the only valid names):
     - `Todo` — ready to action / you owe the first reach-out (default for a fresh capture)
     - `Backlog` — identified but not yet decided to action
     - `Awaiting` — acted, ball in their court
     - `Active` — live back-and-forth underway
     - `Engaged` — engagement live / offer in hand / relationship purposeful
     - (`Captured` raw-unprocessed; `Passed` / `Canceled` — the sweep never sets these)
   - **Priority:** 3 (Medium) default; 1 (Urgent) if something falls within 7 days or notes say urgent;
     2 (High) if a conversation is warm/active or notes say high.
   - **Due date:** only if a specific date is given.
   - **Cross-link (lightweight):** if a recruiter is presenting a role that already has a Roles issue, or
     a contact maps to an existing opportunity, add it as a related link. Never create cross-funnel issues here.

8. **After create / dedup-comment:** add `pipeline/triaged` to the thread. This is the only label change —
   never remove a label, never delete anything. The intake label stays as the permanent category.

9. **Report:** processed count (and remainder if capped); each new issue as `PIPE-NN — Title`; dedup
   comments; enrichment failures; bare-ID captures handed to Aled (tagged + assigned); classification
   uncertainties; provisional warmth set without notes; any wanted-but-missing labels you had to omit;
   anything that wouldn't process cleanly.

## Constraints

- **Add-only.** Only ever adds Gmail labels. Never removes a label, never deletes mail.
- **Live labels only.** Apply only labels that exist; omit-and-flag the rest. Never create labels mid-sweep.
- **One issue per person** (dedup by name in Network first). People to Network; opportunities to their funnel.
- **Enrichment is one `web_search`,** never `web_fetch` LinkedIn. Forwarded URLs always stored verbatim in Links.
- **Scope.** Pipeline only. This sweep never touches the delivery teams, a repo, or the cc-pm / exec / qa loop.
