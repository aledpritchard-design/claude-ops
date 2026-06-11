---
name: sanity-conventions
description: Conventions for Sanity CMS in Aled's system — projects in scope, schema setup, naming standards, and deployment. Read before any operation that involves Sanity content models or the Studio. Grown as the conventions solidify.
---

# sanity-conventions

How Sanity is used in Aled's system. Stub — grown as the conventions solidify.

## Role

Sanity is the headless CMS. Content editors (Aled, clients) use Sanity Studio; delivery code fetches content via GROQ queries. The schema and Studio live inside the delivery repo; agents only modify schema files, never the Sanity dataset directly.

## Projects in scope

| Sanity project | Delivery repo | Studio path |
| -- | -- | -- |
| aledpritchard-com | assoc-one/aledpritchard-com | /studio |
| meirionpritchard-com | assoc-one/meirionpritchard-com | /studio |

## Schema setup — adding a new document type or field

1. Create a schema file in `src/sanity/schemas/` (one file per document type, named to match the type, e.g. `project.ts`).
2. Add the schema to the index at `src/sanity/schemas/index.ts` (or `schema.ts` — check the project).
3. Test the schema locally by running the Studio (`npm run dev` and navigating to `/studio`).
4. Commit and push; the Studio auto-deploys on merge to main via Vercel.

## Naming

- **Document types:** camelCase — e.g. `project`, `caseStudy`.
- **Field names:** camelCase — e.g. `title`, `defaultRepsOrTime`.
- **Slugs** (when the type is a page): kebab-case, generated from the title field.
- **Dataset:** `production` (the default). Never reference another dataset in production code.

## Dataset and permissions

- Dataset writes go through Sanity Studio (by Aled or clients) or via the Sanity API with a write token. Agents do not write to the dataset.
- Read queries in the delivery code use a public (no-auth) or read-only token.
- Sanity Studio v3 — not v2. APIs, components, and configuration differ significantly.

## Gotchas

- Schema changes are safe: adding optional fields is non-breaking. Removing or renaming fields leaves orphaned data in the dataset — flag to Aled and confirm before doing either.
- Always test schema changes in local Studio (`npm run dev`) before pushing. A broken schema can crash the Studio.
- GROQ queries are not validated at build time — test them in the Sanity Vision plugin or locally.
- The `sanity.config.ts` (or `.js`) file wires the schema to the Studio; missing a schema registration here means it won't appear in the Studio even if the file exists.
