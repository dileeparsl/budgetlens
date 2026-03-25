# AI Workflow Documentation — RSL Mini-Hack '26

## Participant: Dileepa Bandara

## Date: March 25, 2026

## Use Case: Personal finance tracking (BudgetLens)

See [docs/use-case.md](use-case.md) for the full official brief.

---

## Tools Used

| Tool | Purpose | Stage |
| ---- | ------- | ----- |
| Cursor (Agent Mode) | Architecture planning, full-stack code generation, debugging, deployment | All stages |
| Cursor Multi-Agent | Parallel sub-agents for frontend pages (login, signup, home, dashboard, transactions, settings) | Coding |
| Google Stitch | UI design exploration — generated *The Aperture Experience* design system | Design |
| Figma (MCP) | Design handoff and component inspection | Design |
| Supabase MCP | Database schema, auth, RLS policies | Coding |
| Vercel CLI | Frontend + backend deployment | Deploy |
| Browser MCP | UI testing and verification | Testing |

---

## Timeline & AI Interactions

### Phase 1: Architecture & Planning (0–10 min)

- **Tool**: Cursor Agent (Plan Mode)
- **Prompt**: "Given this use case — personal finance tracker: design a full-stack architecture for a 90-minute hackathon build. Monorepo: frontend/ (Next.js) → Vercel; backend/ (FastAPI) → separate host; DB + auth: Supabase."
- **Result**: Generated `docs/architecture.md` with data model, API routes, page routes, security strategy
- **Time saved**: ~15 min of manual planning

### Phase 2: Backend API (10–30 min)

- **Tool**: Cursor Agent
- **Prompt**: "Build the API first. Generate the whole API."
- **Result**: Complete FastAPI backend in one pass:
  - `app/config.py` — Pydantic Settings (env loading)
  - `app/auth.py` — JWT verification via Supabase Auth API
  - `app/database.py` — Shared anon client + per-request JWT-forwarding client
  - `app/models/` — Pydantic schemas for categories, transactions, finance settings
  - `app/routers/` — Full CRUD for categories, transactions, finance settings, summary endpoints
  - `app/main.py` — FastAPI app with CORS
  - `sql/schema.sql` — Supabase tables + RLS policies + triggers
- **Debugging**: Fixed Python `str | None` → `Optional[str]` for Pydantic v2 compatibility; resolved `supabase` module shadowing from local `backend/supabase/` directory
- **Time saved**: ~45 min vs writing from scratch

### Phase 3: Design System (parallel)

- **Tool**: Google Stitch
- **Prompt**: Explored personal finance UI directions with Stitch
- **Result**: Generated *The Aperture Experience* — dark teal theme, glassmorphism, dual-font typography, Focal Chart colors for financial data
- **Output**: Captured as `docs/DESIGN.md` (canonical spec for frontend implementation)
- **Time saved**: ~20 min of design iteration

### Phase 4: Frontend UI (30–55 min)

- **Tool**: Cursor Agent + Multi-Agent (parallel sub-agents)
- **Prompt**: "Generate the UI now, match with the API. On UI you will find some bads/issues — fix them in the repo code, never mind the Stitch design edit."
- **Result**: Complete Next.js frontend:
  - Manual scaffold (bypassed interactive `create-next-app` prompts)
  - `globals.css` with Aperture design tokens via `@theme`
  - `lib/supabase.ts` — lazy-initialized Proxy for SSG safety
  - `lib/api.ts` — typed fetch wrapper with JWT auth
  - `components/auth-provider.tsx` + `components/sidebar.tsx`
  - 6 pages via parallel sub-agents: login, signup, home, dashboard, transactions, settings
- **Debugging**: Fixed Supabase client init for Vercel SSG (module-level `createClient` → lazy Proxy)
- **Time saved**: ~60 min vs manual component-by-component build

### Phase 5: Auth Refactor (user-initiated)

- **Tool**: Manual edits + Cursor Agent
- **Action**: User refactored backend auth from service-role key + local JWT decode to anon key + `supabase.auth.get_user()` + per-request JWT forwarding for RLS
- **Changes**:
  - Removed `python-jose` dependency and `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_JWT_SECRET`
  - `auth.py` now calls `db.auth.get_user(token)` instead of `jose.jwt.decode()`
  - `database.py` added `get_supabase_for_user()` with `postgrest.auth(token)` for RLS pass-through
  - All routers updated from `get_supabase` → `get_supabase_for_user`
- **Result**: Simpler, more secure auth — no server-side secrets needed beyond anon key

### Phase 6: Supabase Database Setup (via MCP)

- **Tool**: Cursor Agent + Supabase MCP
- **Prompt**: "You can connect to the Supabase. I gave you access with MCP. Use it in the API."
- **Result**:
  - Connected to Supabase project (`qjpsvyzijsgqvzjpqxee`) via MCP
  - Applied migration: created `categories`, `transactions`, `finance_settings` tables
  - Set up RLS policies, indexes, triggers, and FK constraints
  - Retrieved anon key via `get_publishable_keys` MCP tool
  - Configured `backend/.env` and `frontend/.env.local` with real Supabase credentials
- **Key decision**: Supabase MCP cannot expose service_role_key or JWT secret. Refactored backend to use anon key + `supabase.auth.get_user()` + per-request JWT forwarding — no secrets needed.
- **Time saved**: ~15 min of dashboard clicking + manual schema writing

### Phase 7: Deployment (55–70 min)

- **Tool**: Cursor Agent + Vercel CLI
- **Prompts**: "Deploy the backend to Vercel", then user deployed frontend separately
- **Result**:
  - Backend deployed: [https://backend-chi-wine-55.vercel.app](https://backend-chi-wine-55.vercel.app) with `vercel.json` + `api/index.py` serverless entry
  - Frontend deployed: [https://frontend-rho-ten-42.vercel.app](https://frontend-rho-ten-42.vercel.app)
  - Env vars set via `vercel env add` on both projects
  - CORS configured to allow cross-origin requests between frontend and backend
- **Debugging**: Fixed wrong `NEXT_PUBLIC_API_URL` on frontend Vercel project (was `budgetlens-api.vercel.app`, corrected to `backend-chi-wine-55.vercel.app`)
- **Time saved**: ~15 min of deployment config

### Phase 8: End-to-End Testing (70–80 min)

- **Tool**: Cursor Agent + Browser MCP + Shell (API testing)
- **Prompt**: "Debug the frontend and backend works or not on the deployed version"
- **Result**:
  - Signed in via Supabase Auth API (Shell) — got JWT, verified user
  - Tested all 8 backend API endpoints with real auth token — all passing (200/201)
  - Created test transactions (expense + income), updated finance settings
  - Browser MCP: navigated all 6 pages, verified data loads, no CORS errors
  - Identified and fixed frontend API URL misconfiguration
- **Time saved**: ~20 min of manual API testing + browser inspection

### Phase 9: Screenshots & Documentation (80–90 min)

- **Tool**: Cursor Agent + Browser MCP
- **Prompt**: "Perform all actions, take screenshots, add them to the repo. Update the README and docs."
- **Result**:
  - 10 screenshots captured via Browser MCP: login, signup, home, transactions, dashboard, settings, add/edit transaction modals
  - Saved to `docs/screenshots/` in the repo
  - Full CRUD verified: create transaction, edit transaction, view all pages
  - README updated with screenshot gallery, corrected URLs
  - All docs updated: `architecture.md`, `ai-workflow.md`, `CHANGELOG.md`
- **Time saved**: ~15 min of manual screenshot capture + documentation

---

## Summary Statistics

| Metric | Value |
| ------ | ----- |
| Total AI interactions | ~30+ major prompts/actions |
| Tools used | Cursor Agent, Multi-Agent, Google Stitch, Supabase MCP, Vercel CLI, Browser MCP, Figma MCP |
| Stages covered | Brainstorm, Design, Code, Debug, Test, Deploy, Document |
| Estimated time saved | ~200 min (compressed into ~90 min of actual work) |

## Key Insights

- **Supabase MCP** enabled zero-dashboard database setup — tables, RLS, indexes, and keys all configured from the IDE
- **Multi-agent parallelism** was highly effective for frontend pages — 6 pages built concurrently by sub-agents
- **Google Stitch** provided a production-quality design system in minutes that would take hours to design manually
- **Browser MCP** automated end-to-end testing and screenshot capture — caught the wrong API URL before manual testing would have
- **Auth refactor** (service-role → anon key + RLS passthrough) was driven by MCP limitations but resulted in a simpler, more secure architecture
- **Vercel serverless Python** for the backend simplified deployment to a single platform — both packages on Vercel
- **Iterative debugging** with AI (module shadowing, type hint compatibility, SSG client init, CORS, wrong env vars) was faster than manual debugging but still required understanding the root cause
