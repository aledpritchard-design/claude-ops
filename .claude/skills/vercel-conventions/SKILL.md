---
name: vercel-conventions
description: Conventions for Vercel in Aled's system — projects in scope, deployment setup, environment variable naming, and what requires human action. Read before any operation that involves Vercel deployments. Grown as the conventions solidify.
---

# vercel-conventions

How Vercel is used in Aled's system. Stub — grown as the conventions solidify.

## Role

Vercel is the deployment platform for all Next.js sites. Every delivery repo with a Next.js frontend connects to Vercel; each push to `main` deploys to production and each PR gets a preview URL automatically.

## Projects in scope

| Vercel project | Repo | Production URL |
| -- | -- | -- |
| aledpritchard-com | assoc-one/aledpritchard-com | aledpritchard.com |
| meirionpritchard-com | assoc-one/meirionpritchard-com | (TBC) |

## Setup — new Vercel project

New project provisioning is **exec:human** — it requires account-level Vercel access that agents do not have. To add a new project, Aled creates it in the Vercel dashboard and connects it to the GitHub repo. Agents reference the project name and URL once it exists.

## Environment variables

- Set in the Vercel dashboard under the project → Settings → Environment Variables.
- Prefix client-accessible variables with `NEXT_PUBLIC_` (Next.js requirement).
- Keep secrets (API keys, tokens) out of the repo; they live only in Vercel.
- Three scopes: Production, Preview, Development — set appropriately per variable.

## Deployment

- Every push to `main` triggers an automatic Production deployment.
- Every PR auto-generates a Preview deployment URL (useful for qa-review).
- Build command default: `next build`. Output directory: `.next`. Install command: `npm install`.

## Gotchas

- `NEXT_PUBLIC_*` variables are inlined at build time — changing them requires a new deployment, not just a config update.
- Build failures surface in the Vercel dashboard and the GitHub PR check. If a PR deploy fails, check the Vercel build logs (via the GitHub PR check detail link).
- New projects need the Vercel GitHub App to have access to the repo before deployments will trigger.
