---
name: rapid-scaffold
description: Rapidly scaffold the BudgetLens monorepo — Next.js in frontend/ and FastAPI in backend/ with Supabase env templates. Use when starting the hackathon project, bootstrapping, or setting up initial structure.
---

# Rapid Scaffold — Monorepo (Next.js + FastAPI)

## When to Use

- Starting BudgetLens from scratch
- Need both apps running locally in < 15 minutes
- Stack: **Next.js** (`frontend/`) + **FastAPI** (`backend/`) + **Supabase**

## RSL Mini-Hack '26 domain

Official brief: **`docs/use-case.md`** — personal finance (transactions, categories,
budgets/summary, landing + dashboard charts, auth). Suggested routes: `/`,
`/dashboard`, `/transactions`, `/categories`, `/settings`.

**UI spec**: **`docs/DESIGN.md`** (*The Aperture Experience*, Google Stitch). After scaffold, define Tailwind/CSS variables from that doc and load **Manrope** + **Inter** via `next/font/google`. Use skill **`design-aperture`** for implementation tasks.

## Layout

```text
budgetlens/
  frontend/     # Next.js → deploy Vercel (Root Directory: frontend)
  backend/      # FastAPI → deploy Railway / Render / Fly (separate)
  docs/
  .env.example  # templates for both packages
```

## Part A — `frontend/` (Next.js)

Run from repo root:

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app \
  --src-dir --import-alias "@/*" --use-npm
```

Dependencies (after create):

```bash
npm install @supabase/supabase-js @supabase/ssr zod recharts lucide-react
npm install -D @types/node
npx shadcn@latest init -d
npx shadcn@latest add button card input label table dialog form select tabs \
  toast badge avatar dropdown-menu sheet separator
```

Typical tree (inside `frontend/`):

```text
src/
  app/
    (auth)/login/page.tsx
    (auth)/signup/page.tsx
    (dashboard)/dashboard/page.tsx
    layout.tsx
    page.tsx
  components/ui/
  hooks/
  lib/
    supabase/client.ts
    supabase/server.ts
    api.ts          # fetch helper -> NEXT_PUBLIC_API_URL
  types/
```

**Supabase browser client** (`src/lib/supabase/client.ts`):

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Env** (`frontend/.env.local`): copy from repo root `.env.example` — include `NEXT_PUBLIC_API_URL` pointing at local FastAPI (`http://localhost:8000`).

Verify:

```bash
cd frontend
npm run build
```

## Part B — `backend/` (FastAPI)

From repo root:

```bash
cd backend
```

Create venv and install (example with `uv`):

```bash
uv init
uv add fastapi uvicorn[standard] pydantic supabase-py python-jose[cryptography] httpx
```

Minimal `app/main.py` pattern:

- `FastAPI()` with `CORSMiddleware` (`CORS_ORIGINS` from env)
- `GET /health`
- Routers under `/api/...` with Pydantic models
- Dependency to verify Supabase JWT on protected routes

Env (`backend/.env`): see root `.env.example`.

Verify:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Open [http://localhost:8000/docs](http://localhost:8000/docs).

## Part C — Root env template

Ensure repo root `.env.example` documents:

- Frontend: `NEXT_PUBLIC_SUPABASE_*`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`
- Backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `CORS_ORIGINS`

## UI/UX workflow

- **`docs/DESIGN.md`**: canonical colors, surfaces, typography, components (Stitch export).
- **Google Stitch**: exploration; keep repo spec updated if Stitch changes materially.
- **Figma**: components and tokens aligned to `docs/DESIGN.md`; **Figma MCP** when connected.

## Post-scaffold checklist

- [ ] `frontend`: `npm run build` succeeds
- [ ] `backend`: `/docs` loads, `/health` OK
- [ ] Supabase project created; SQL schema applied
- [ ] `.env.local` / `.env` filled (never commit secrets)
- [ ] Initial commit pushed to **GitHub**
