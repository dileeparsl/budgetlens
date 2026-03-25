# BudgetLens — Antigravity Project Rules

> This file is read by **Google Antigravity** agents at the start of every
> session. It overrides `AGENTS.md` where both exist. Keep cross-tool rules
> in `AGENTS.md` and Antigravity-specific behaviour here.

## Stack

| Layer | Choice | Location |
| ----- | ------ | -------- |
| Frontend | Next.js (App Router), TypeScript, Tailwind, shadcn/ui | `frontend/` |
| Backend | FastAPI, Pydantic v2, Uvicorn | `backend/` |
| Database + Auth | Supabase (Postgres, Auth, RLS) | Managed service |
| Frontend hosting | **Vercel** (Root Directory = `frontend`) | |
| API hosting | **Railway / Render / Fly** (separate from Vercel) | |
| UI/UX | **Google Stitch** (explorations) + **Figma** (components/handoff) | |
| Charts | Recharts (in Next.js) | |

## Monorepo layout

```
budgetlens/
  frontend/        # Next.js — npm, Vercel
  backend/         # FastAPI — Python, separate ASGI host
  docs/            # architecture, DESIGN (Stitch), ai-workflow, use-case, prompt-playbook
  .cursor/         # Cursor IDE rules & skills
  .agent/skills/   # Antigravity workspace skills (you are here)
  scripts/         # PowerShell helpers (scaffold, deploy)
  .env.example     # Env template for both packages
```

## Coding conventions

- **Frontend**: TypeScript strict; React Server Components by default; `"use client"` only when needed; Tailwind utility-first; mobile-first responsive.
- **Backend**: Python 3.11+; type hints everywhere; Pydantic v2 for request/response; FastAPI `HTTPException` for errors; money as integer cents.
- Keep files small: one component per file, one router per resource.
- Never commit `.env`, keys, or tokens; follow `.gitignore` and `SECURITY.md`.

## Git

- Conventional commits: `type(scope): Short imperative summary` — see `COMMIT_MESSAGE_GUIDELINES.md`.
- Commit scoped changes immediately after finishing them; push to `origin HEAD`.
- Hackathon mode: work on `main` directly; branch only for risky experiments.

## Testing (hackathon pragmatism)

- Smoke: both apps build/start without error.
- Auth: login/logout works end-to-end (Supabase → frontend → FastAPI JWT).
- CRUD: at least transactions create + read verified.
- Dashboard: one chart renders with data.

## Skills

Workspace skills live in `.agent/skills/`. Use them for scaffold, deploy,
debug, docs, and git workflows. They mirror the Cursor skills in `.cursor/skills/`.

## Design workflow

1. **Canonical spec**: **[`docs/DESIGN.md`](docs/DESIGN.md)** — *The Aperture Experience* (exported from Google Stitch): palette, surfaces, no-border rule, glass/gradient, typography, charts.
2. **Google Stitch** — exploration and flows; keep exports aligned with `docs/DESIGN.md`.
3. **Figma** — components and tokens; mirror names/hex values from `docs/DESIGN.md`.
4. Implement in `frontend/` with shadcn/ui + Tailwind + CSS variables; invoke workspace skill **`design-aperture`** (`.agent/skills/design-aperture/`) for UI tasks.

## Security

- RLS on all Supabase tables; policies check `auth.uid()`.
- Service role key only in `backend/.env` — never in client bundle.
- CORS on FastAPI: allow localhost + Vercel production origin only.

## Definition of Done

A feature is done when:
1. Code compiles / lints without errors in its package.
2. The user-facing flow works (browser test or `/docs` try-it).
3. Changes are committed with a conventional message and pushed.
4. `docs/ai-workflow.md` has a quick-log entry for AI-assisted steps.
