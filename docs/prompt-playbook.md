# Hackathon Prompt Playbook

Pre-prepared prompts for each phase of the 90-minute hackathon. The official
brief is **`docs/use-case.md`** (personal finance tracking for RSL Mini-Hack '26).

**Monorepo**: `frontend/` (Next.js) + `backend/` (FastAPI) — separate deployments;
Supabase for DB + Auth; UI spec **`docs/DESIGN.md`** (*Aperture Experience*, Stitch) + **Figma**.

---

## Phase 1: Brainstorm & Architecture (0-10 min)

### Prompt 1.1 - Analyze Use Case

```text
Analyze this hackathon use case and create a comprehensive plan:

Use docs/use-case.md (personal finance: transactions, categories, budgets,
landing + dashboard charts, auth, responsive UI, CRUD).

Provide:
1. Core features (must-have vs nice-to-have)
2. Data model with entities and relationships
3. Next.js page/route structure (frontend/)
4. FastAPI REST endpoints (backend/) — align with OpenAPI
5. Auth requirements (Supabase Auth + JWT to API)
6. A Mermaid ERD diagram
7. 90-minute timeline with milestones

Optimize for: speed, Next.js + FastAPI + Supabase + Vercel (frontend) +
separate API host. UI must follow docs/DESIGN.md.
```

### Prompt 1.2 - Generate Mermaid Architecture

```text
Create a Mermaid diagram for this monorepo:
- Browser, Next.js (frontend/), FastAPI (backend/), Supabase
- Deploy: Vercel for frontend; Railway/Render/Fly for backend
Show auth JWT flow and API data flow.
```

---

## Phase 2: Scaffold (10-15 min)

### Prompt 2.1 - Monorepo Setup

```text
Scaffold BudgetLens monorepo:

1) frontend/ — create-next-app (App Router), TypeScript, Tailwind, shadcn/ui,
   @supabase/supabase-js @supabase/ssr, zod, recharts, lucide-react.
   Supabase browser + server clients. NEXT_PUBLIC_API_URL for FastAPI.

2) backend/ — FastAPI, uvicorn, Pydantic v2, CORS from CORS_ORIGINS env,
   GET /health, OpenAPI /docs.

3) Align with root .env.example (frontend/.env.local and backend/.env).

Verify: cd frontend && npm run build; backend runs with uvicorn on :8000.
```

### Prompt 2.2 - Database Schema

```text
Create the Supabase database schema for this data model:

[PASTE DATA MODEL]

For each table:
1. SQL CREATE TABLE statements
2. Row Level Security policies (users can only access their own data)
3. Any necessary indexes
4. Optional: Pydantic models in backend/ matching tables for API I/O
```

---

## Phase 3: Backend (15-45 min)

### Prompt 3.1 - FastAPI CRUD

```text
In backend/, implement CRUD for transactions (and categories if needed):

Table schema: [SCHEMA]

For each resource:
- GET /api/... — list (scoped to JWT user)
- POST — create with Pydantic body validation
- GET /api/.../{id}, PUT, DELETE

Use Supabase JWT verification dependency; consistent JSON errors; status codes.
```

### Prompt 3.2 - Auth (Supabase + API)

```text
Wire authentication end-to-end:
1. frontend/: login/signup pages with Supabase Auth
2. Attach Bearer access token when calling FastAPI
3. backend/: verify JWT (SUPABASE_JWT_SECRET); derive user_id
4. frontend/: protect routes; redirect unauthenticated users to /login
```

---

## Phase 4: Frontend (15-50 min)

### Prompt 4.1 - Main Dashboard

```text
Build the dashboard in frontend/ at /dashboard:
- Header, logout, key metrics
- Charts (Recharts): trends, category mix
- Fetch from FastAPI using NEXT_PUBLIC_API_URL + auth header
- shadcn/ui, Tailwind, responsive
- Match docs/DESIGN.md (Aperture) + Stitch/Figma: [paste link or notes]
```

### Prompt 4.2 - Data Entry Form

```text
Create a form in frontend/ for [RESOURCE]:
- Fields: [LIST]
- Client validation with zod; align field names with FastAPI/Pydantic
- POST to FastAPI; toast + loading state
- shadcn Form components
```

### Prompt 4.3 - Data Display

```text
Create a component in frontend/ for [RESOURCE]:
- GET from FastAPI
- Table/cards/list with edit/delete
- Empty and loading states
```

### Prompt 4.4 - Charts & Dashboard

```text
Add charts with Recharts in frontend/:
- [CHART 1] — [bar/line/pie]
- [CHART 2]
- Responsive grid; data from FastAPI
```

---

## Phase 5: Integration & Polish (45-60 min)

### Prompt 5.1 - Fix & Integrate

```text
Review the monorepo:
1. Fix TypeScript errors in frontend/
2. Ensure all UI calls use the production API base URL via env
3. CORS_ORIGINS on backend includes Vercel URL
4. Loading/error states
5. E2E: signup -> login -> CRUD -> charts -> logout
```

---

## Phase 6: Deploy (60-80 min)

### Prompt 6.1 - Dual Deploy

```text
Deploy BudgetLens:
1. frontend: cd frontend && npm run build; fix errors
2. Vercel: Root Directory = frontend; set NEXT_PUBLIC_* and NEXT_PUBLIC_API_URL to live API
3. backend: deploy backend/ to Railway or Render or Fly; set SUPABASE_* and CORS_ORIGINS
4. Supabase Auth URLs for Vercel domain
5. Smoke test production auth + one CRUD call
6. Report frontend URL and API URL
```

---

## Phase 7: Documentation (80-90 min)

### Prompt 7.1 - Generate Docs

```text
Update documentation:
1. README.md — both URLs, monorepo quick start
2. docs/ai-workflow.md — all AI/MCP usage this session
3. docs/architecture.md — final stack diagram if changed
4. git commit and push
```

---

## Emergency Prompts

### When Stuck on a Bug

```text
I'm stuck on this error for [X] minutes. Here's the error:
[PASTE ERROR]

Context: [what you were trying to do]
Package: frontend | backend
File: [path]

Give me the fastest fix. If complex, suggest a simpler alternative.
```

### When Running Out of Time

```text
I have [X] minutes left. Current state:
- Working: [list]
- Not working: [list]
- Not started: [list]

Prioritize minimum demo: Vercel UI + reachable API + auth + one CRUD path.
```
