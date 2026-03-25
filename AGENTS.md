# RSL Mini-Hack '26 - Multi-Agent Workflow

## Overview

This document defines the multi-agent orchestration strategy for the
90-minute hackathon. Each agent specializes in a stage of the development
lifecycle, enabling parallel work streams.

**Monorepo layout**: `frontend/` (Next.js) and `backend/` (FastAPI) — **separate
deployments** (Vercel for the web app; ASGI-friendly host for the API). Database
and auth: **Supabase**. UI/UX: **Google Stitch** (explorations) + **Figma**
(components / handoff) with MCPs as connected.

**IDE support**: This repo works with **Cursor** (`.cursor/rules/`, `.cursor/skills/`)
and **Google Antigravity** (`GEMINI.md`, `.agent/skills/`). `AGENTS.md` (this file)
is the **cross-tool** standard read by both IDEs.

**UI design**: **[`docs/DESIGN.md`](docs/DESIGN.md)** — *The Aperture Experience* (Google Stitch). Frontend work must follow it; use skill **`design-aperture`** in Cursor or Antigravity when building UI.

---

## Agent Roles

### 1. Architect Agent (Minutes 0-10)

**Purpose**: Brainstorm, plan architecture, define data model  
**Trigger**: Hackathon start — official brief in `docs/use-case.md` (personal
finance tracker)  
**Tools**: Cursor Chat, Mermaid MCP, draw.io MCP, Figma MCP (optional)  
**Tasks**:

- Analyze the use case requirements
- Design system architecture (Next.js, FastAPI, Supabase, dual deploy)
- Create data model / ERD using Mermaid or draw.io
- Define REST API surface (OpenAPI-friendly) and Next.js page routes
- Output: architecture decision doc in `docs/architecture.md`

**Prompt Template**:

```text
Given this use case — RSL Mini-Hack '26 personal finance tracker:

- Manual income and expense entry; categories (food, transport, bills, etc.)
- Summary: totals, balance; monthly income, budget, savings targets
- Auth (login/account/PIN acceptable); mobile-responsive; DB persistence
- CRUD for transactions; landing: month spend, % budget used, category breakdown
- Dashboard: charts (monthly spend, category mix, trends)
- Optional: insights, savings tips, anomalies, natural-language Q&A

Design a full-stack architecture for a 90-minute hackathon build.
Monorepo: frontend/ (Next.js) -> Vercel; backend/ (FastAPI) -> separate host
(Railway/Render/Fly); DB + auth: Supabase.
Include: tech stack, data model, REST API routes, Next.js page routes, auth strategy.
Optimize for speed of development with free hosting.
Output as a structured markdown document.
Prefer money as integer cents in the data model.
```

### 2. Scaffold Agent (Minutes 5-15)

**Purpose**: Generate project boilerplate in **both** packages  
**Trigger**: After architecture is decided  
**Tools**: Cursor Agent, Shell, npm/npx, uv/pip  
**Tasks**:

- **frontend/**: Next.js + TypeScript + Tailwind + shadcn/ui + Supabase client
- **backend/**: FastAPI + Uvicorn + Pydantic + Supabase Python client (or HTTP to PostgREST with service role / user JWT as appropriate)
- Environment templates per `frontend/.env.local` and `backend/.env` (see root `.env.example`)
- Initial Supabase schema (SQL) in repo or docs
- Output: both apps run locally (`npm run dev` in frontend, `uvicorn` in backend)

**Prompt Template**:

```text
Scaffold the monorepo packages:

1) frontend/ — Next.js (App Router), TypeScript, Tailwind, shadcn/ui,
   @supabase/supabase-js (+ @supabase/ssr if using cookie sessions),
   zod, recharts. Env: NEXT_PUBLIC_SUPABASE_*, NEXT_PUBLIC_API_URL.
   Verify: cd frontend && npm run build

2) backend/ — FastAPI, Pydantic v2, CORS for localhost:3000 + Vercel URL,
   health check route, /docs OpenAPI. Env: SUPABASE_*, CORS_ORIGINS.
   Verify: uvicorn app.main:app --reload

3) Document commands in frontend/README.md and backend/README.md.
```

### 3. Backend Agent (Minutes 15-45)

**Purpose**: FastAPI routes, Supabase access, validation  
**Trigger**: After scaffold is complete  
**Tools**: Cursor Agent, Supabase MCP, HTTP client tests  
**Tasks**:

- Implement REST handlers for CRUD (transactions, categories, settings)
- Validate bodies/query with Pydantic; return consistent JSON errors
- Enforce `user_id`/JWT from Supabase on every mutating and scoped read route
- Align with RLS policies in Supabase
- Output: working API documented at `/docs`

**Prompt Template**:

```text
Implement the backend in backend/ for [FEATURE]:
- Supabase tables + RLS: [TABLE_SCHEMA]
- FastAPI routes: GET/POST/PUT/DELETE under /api/... or resource paths
- Pydantic models for request/response
- Verify Supabase JWT on protected routes
- Error handling with proper status codes (400/401/404/500)
```

### 4. Frontend Agent (Minutes 15-50)

**Purpose**: Next.js UI, Stitch/Figma-aligned components  
**Trigger**: After scaffold is complete (parallel with Backend Agent)  
**Tools**: Cursor Agent, Stitch MCP (when connected), Figma MCP, Browser MCP  
**Tasks**:

- Pages and layouts per `docs/architecture.md` and **`docs/DESIGN.md`** (Aperture tokens, surfaces, typography)
- shadcn forms; call FastAPI using `NEXT_PUBLIC_API_URL` + auth headers
- Charts on dashboard (**Focal Chart** colors in `docs/DESIGN.md`); responsive layout
- Output: polished UI wired to mock or real API

**Prompt Template**:

```text
Build the [PAGE_NAME] page in frontend/:
- Layout: [DESCRIPTION]
- Components: shadcn/ui, Tailwind — follow docs/DESIGN.md (Aperture Experience)
- Data: fetch from FastAPI [ENDPOINTS] with Supabase session token as needed
- Stitch/Figma: [reference or “match docs/DESIGN.md tokens”]
- Loading and error states; mobile-first
```

### 5. Integration Agent (Minutes 45-60)

**Purpose**: Connect Next.js to FastAPI, fix CORS/auth/env  
**Trigger**: After core frontend and backend are built  
**Tools**: Cursor Agent, Browser MCP, Chrome DevTools MCP  
**Tasks**:

- Ensure production URLs: `NEXT_PUBLIC_API_URL`, `CORS_ORIGINS`, Supabase redirect URLs
- End-to-end: signup/login -> CRUD -> dashboards
- Fix type/contract drift between Pydantic responses and frontend types

### 6. Polish & Deploy Agent (Minutes 60-80)

**Purpose**: Dual deployment verification  
**Trigger**: After integration is working  
**Tools**: Cursor Agent, Shell, Vercel CLI, host CLI for API (Railway/Render/Fly)  
**Tasks**:

- `cd frontend && npm run build` — fix errors
- Deploy frontend: Vercel with **Root Directory** `frontend`
- Deploy backend: chosen ASGI host; set secrets
- Smoke-test production

**Prompt Template**:

```text
Deploy the monorepo:
1. frontend: cd frontend && npm run build; vercel --prod from frontend/ OR Vercel dashboard Root Directory = frontend
2. backend: deploy backend/ to [Railway|Render|Fly]; set SUPABASE_* and CORS_ORIGINS
3. Set frontend NEXT_PUBLIC_API_URL to production API URL
4. Update Supabase Auth URLs for Vercel domain
5. Smoke test auth + one CRUD flow on production
```

### 7. Documentation Agent (Minutes 80-90)

**Purpose**: AI workflow + README URLs for both deployments  
**Trigger**: After deployment  
**Tools**: Cursor Agent, Git  
**Tasks**:

- Update `docs/ai-workflow.md`, README (two URLs if applicable)
- Push to GitHub

---

## Parallel Execution Strategy

```text
Timeline (90 minutes):
═══════════════════════════════════════════════════════════════════

[00-10] Architect ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
[05-15] Scaffold  ░░░██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
[15-45] Backend   ░░░░░░░░░████████████████████░░░░░░░░░░░░░░░░░
[15-50] Frontend  ░░░░░░░░░██████████████████████░░░░░░░░░░░░░░░
[45-60] Integrate ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████░░░░░░░░
[60-80] Deploy    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████
[80-90] Document  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████
```

## Communication Between Agents

- Architecture: `docs/architecture.md`
- API contract: FastAPI OpenAPI (`/docs`) + optional `docs/api-contract.md` or shared types in `frontend/types/` matching Pydantic
- Use `TODO:` comments for cross-package handoff

## Escalation Protocol

If an agent is blocked:

1. Log the blocker as a `TODO:` comment
2. Move to next task
3. Escalate to human for decision if > 5 minutes blocked
4. Never spend more than 10 minutes on a single bug
