# Changelog

All notable changes to this project are documented in this file.

Changes are organized into the following categories:

- **Added:** New features or functionality introduced to the project.
- **Changed:** Modifications to existing functionality that do not add new features.
- **Fixed:** Bug fixes that resolve issues or correct unintended behavior.
- **Removed:** Features or components that have been removed from the project.

---

## [v1.0.0] - 2026-03-25

Full working release of **BudgetLens** — built during the RSL Mini-Hack '26 (90-minute hackathon).

### Added

#### Repository & Tooling (`048f3ef`)

- Monorepo scaffold: `frontend/` (Next.js) + `backend/` (FastAPI) + `docs/`.
- `.env.example` template for both packages.
- Cursor IDE config: `.cursor/rules/`, `.cursor/skills/` (rapid-scaffold, deploy-free-hosting, hackathon-debug, ai-workflow-docs, design-aperture).
- Google Antigravity config: `GEMINI.md`, `.agent/skills/`.
- Cross-tool agent spec: `AGENTS.md`.
- Community standards: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE` (MIT).
- Commit/branch/PR guidelines: `COMMIT_MESSAGE_GUIDELINES.md`, `BRANCH_NAMING_GUIDELINES.md`, `PULL_REQUEST_GUIDELINES.md`.
- Husky pre-commit hook, GitHub Actions CI.

#### Backend API (`1695674`, `d2bc4f8`)

- **FastAPI application** (`app/main.py`) with CORS middleware and health check.
- **Pydantic v2 models** for categories, transactions, finance settings, summary responses.
- **CRUD routers**:
  - `POST/GET/PUT/DELETE /api/categories` — 10 default categories auto-seeded per user.
  - `POST/GET/PUT/DELETE /api/transactions` — filtering by type, category, date range; pagination.
  - `GET/PUT /api/finance-settings` — monthly income, budget, and savings targets (auto-created on first GET).
  - `GET /api/summary/monthly` — month totals, budget % used, category breakdown.
  - `GET /api/summary/dashboard` — current month summary + N-month trend data.
- **SQL schema** (`backend/sql/schema.sql`) for Supabase: `categories`, `transactions`, `finance_settings` tables with constraints, indexes, and `updated_at` trigger.
- **RLS policies** on all tables: `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE.
- `requirements.txt` with FastAPI, Uvicorn, Pydantic, Supabase, httpx.

#### Database Setup (via Supabase MCP)

- Applied migration to production Supabase project (`qjpsvyzijsgqvzjpqxee`) creating all 3 tables with:
  - UUID primary keys, foreign keys to `auth.users`.
  - Check constraints (amount > 0, type IN income/expense, hex color format).
  - Indexes on `user_id`, `date`, `category_id`.
  - Auto-`updated_at` trigger on `transactions` and `finance_settings`.
  - Row Level Security enabled with per-user policies.
  - `authenticated` and `anon` role grants.

#### Auth & Security (`debd2c6`)

- **Token verification** via `supabase.auth.get_user(token)` — no local JWT decoding.
- **Per-request Supabase client** (`get_supabase_for_user`) forwards user JWT to PostgREST so RLS sees `auth.uid()`.
- Only the anon key is needed — no service-role key or JWT secret on the backend.

#### Frontend — Design System

- **The Aperture Experience** design system from Google Stitch (`docs/DESIGN.md`).
- Dark teal surfaces, glassmorphism cards, gradient CTAs (cyan → teal).
- Dual-font typography: Manrope (headings) + Inter (body).
- Focal Chart color palette for financial data visualization.
- Tailwind CSS v4 `@theme` tokens in `globals.css`.

#### Frontend — Pages (`dec5b02`, `2d2a0aa`, `1a3f8de`, `f79f51d`, `c72ce09`)

- **Login** (`/login`) — email/password form, Supabase Auth sign-in, redirect to home.
- **Signup** (`/signup`) — email/password/confirm form, Supabase Auth sign-up.
- **Home** (`/`) — month-at-a-glance landing: total income, expenses, balance; budget progress bar; spending by category breakdown.
- **Transactions** (`/transactions`) — full CRUD: add/edit/delete transactions via modal forms; filter by type (income/expense), date range; category icons and colors.
- **Dashboard** (`/dashboard`) — 4 summary cards (income, expenses, balance, budget used %); Recharts bar chart (6-month income vs expenses trend); Recharts donut chart (category mix).
- **Settings** (`/settings`) — user profile display; finance targets form (monthly income, budget, savings target); current targets summary cards.

#### Frontend — Infrastructure

- `lib/supabase.ts` — lazy-initialized Proxy pattern for build-time (SSG) safety.
- `lib/api.ts` — typed fetch wrapper that attaches Supabase session Bearer token.
- `components/auth-provider.tsx` — session listener with auth-guarded routing.
- `components/sidebar.tsx` — navigation sidebar with active state and sign-out.
- `types/index.ts` — TypeScript types mirroring Pydantic models.

#### Deployment (`6b2a589`)

- **Backend on Vercel**: `vercel.json` routes config + `api/index.py` ASGI entry point for serverless Python.
- **Frontend on Vercel**: standard Next.js deployment with Root Directory = `frontend`.
- Environment variables configured via `vercel env add` on both projects.
- CORS origins updated to allow cross-origin requests between frontend and backend.
- Production URLs:
  - Frontend: [https://frontend-rho-ten-42.vercel.app](https://frontend-rho-ten-42.vercel.app)
  - Backend: [https://backend-chi-wine-55.vercel.app](https://backend-chi-wine-55.vercel.app)

#### Documentation (`83e4b31`, `4bdbe10`)

- Root `README.md` with screenshot gallery, live demo links, tech stack, API reference, quick start guide.
- `backend/README.md` with API endpoint table, auth pattern, local dev instructions.
- `docs/architecture.md` — ADR with system diagram, data model, security model, auth pattern.
- `docs/ai-workflow.md` — complete 9-phase AI usage log covering brainstorm through documentation.
- `docs/DESIGN.md` — Aperture Experience design system spec.
- `docs/use-case.md` — official hackathon brief.
- 10 screenshots in `docs/screenshots/` covering all pages and CRUD actions.

### Changed

- **Auth architecture** (`debd2c6`): replaced `SUPABASE_SERVICE_ROLE_KEY` + `SUPABASE_JWT_SECRET` + `python-jose` local JWT decode with `SUPABASE_ANON_KEY` + `supabase.auth.get_user()` + per-request JWT forwarding.
- **Config** (`config.py`): simplified from 3 secrets to 2 env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
- **All routers**: switched from `get_supabase` (shared singleton) to `get_supabase_for_user` (per-request client with user token).
- **`.env.example`** files updated to reflect anon-key-only architecture.

### Fixed

- **Python compatibility** (`d2bc4f8`): `str | None` → `Optional[str]` for Pydantic v2 on Python 3.9.
- **Supabase client SSG crash** (`07b1a47`): module-level `createClient` → lazy Proxy init to avoid build-time errors on Vercel.
- **Sidebar font** (`1e14f22`): simplified `font-family` utility in brand text.
- **Login/signup fonts** (`be1534a`): switched to `font-display` shorthand for Manrope headings.
- **ESLint** (`a250fad`): replaced deprecated `next lint` with ESLint CLI and flat config for Vercel build compatibility.
- **Wrong backend URL** (`4bdbe10`): frontend Vercel project had `NEXT_PUBLIC_API_URL` pointing to `budgetlens-api.vercel.app` — corrected to `backend-chi-wine-55.vercel.app` and redeployed.

### Removed

- `python-jose[cryptography]` dependency (JWT verification moved to Supabase Auth API).
- `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_JWT_SECRET` environment variables (no longer needed).

---

## [v0.1.0] - 2026-03-25

### Added

- Initial monorepo scaffold with empty `frontend/` and `backend/` directories.
- Docs: `docs/use-case.md`, `docs/architecture.md`, `docs/DESIGN.md`, `docs/ai-workflow.md`, `docs/prompt-playbook.md`, `docs/hackathon-checklist.md`.
- IDE config: Cursor rules/skills, Antigravity skills, `AGENTS.md`.
- Community standards: contributing, conduct, security, commit/branch/PR guidelines.
- CI: Husky pre-commit, GitHub Actions.
- Tooling: `.env.example`, `scripts/` directory.

---

[v1.0.0]: https://github.com/dileeparsl/budgetlens/compare/v0.1.0...HEAD
[v0.1.0]: https://github.com/dileeparsl/budgetlens/releases/tag/v0.1.0
