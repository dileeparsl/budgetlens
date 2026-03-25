---
name: rapid-scaffold
description: Scaffold the BudgetLens monorepo — Next.js in frontend/ and FastAPI in backend/ with Supabase env templates. Use when starting the hackathon, bootstrapping, or setting up initial project structure.
---

# Rapid Scaffold — Monorepo (Next.js + FastAPI)

## Goal

Create both `frontend/` and `backend/` project skeletons so they build/start
locally within 15 minutes.

## Instructions

### Part A — `frontend/` (Next.js)

1. From repo root:

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app \
  --src-dir --import-alias "@/*" --use-npm
```

2. Install dependencies:

```bash
npm install @supabase/supabase-js @supabase/ssr zod recharts lucide-react
npm install -D @types/node
npx shadcn@latest init -d
npx shadcn@latest add button card input label table dialog form select tabs \
  toast badge avatar dropdown-menu sheet separator
```

3. Create Supabase browser client at `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

4. Create env from root template:

```bash
cp ../.env.example .env.local
```

Edit `NEXT_PUBLIC_API_URL=http://localhost:8000`.

5. Verify: `npm run build`

### Part B — `backend/` (FastAPI)

1. From repo root:

```bash
cd backend
```

2. Create venv and install (example with `uv`):

```bash
uv init
uv add fastapi uvicorn[standard] pydantic supabase-py python-jose[cryptography] httpx
```

Or with pip:

```bash
python -m venv .venv && .venv/Scripts/activate  # Windows
pip install fastapi uvicorn[standard] pydantic supabase python-jose[cryptography] httpx
pip freeze > requirements.txt
```

3. Create `app/main.py` with:
   - `FastAPI()` app + `CORSMiddleware` (origins from `CORS_ORIGINS` env)
   - `GET /health` → `{"status": "ok"}`
   - OpenAPI at `/docs`

4. Env: `cp ../.env.example .env` and fill `SUPABASE_*`, `CORS_ORIGINS`.

5. Verify: `uvicorn app.main:app --reload --port 8000` → open `/docs`.

### Part C — Root env

Ensure `.env.example` documents variables for both packages (see repo root).

## Constraints

- Run `create-next-app` **inside** `frontend/`, not repo root.
- Never commit real secrets; only commit `.env.example`.
- Align Supabase project URL/keys across both packages.

## Post-scaffold checklist

- [ ] `frontend/`: `npm run build` succeeds
- [ ] **`docs/DESIGN.md`** mapped into Tailwind/CSS variables; Manrope + Inter in root layout
- [ ] `backend/`: `/docs` loads, `/health` returns OK
- [ ] Supabase project created; SQL schema applied
- [ ] Initial commit pushed to GitHub

## UI spec

Implement visual design per **`docs/DESIGN.md`** (*Aperture Experience*). Use workspace skill **`design-aperture`** when building pages and components.
