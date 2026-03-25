---
name: deploy-free-hosting
description: Deploy BudgetLens — Vercel for frontend/ (Next.js) and a separate free-tier host for backend/ (FastAPI). Handles env vars, CORS, Supabase auth URLs, and verification. Use when deploying, publishing, or going live.
---

# Deploy to Free Hosting (Monorepo)

## Goal

Get both packages live on free-tier hosting with correct cross-service config.

## Two deployments

| Package | Platform | Role |
| ------- | -------- | ---- |
| `frontend/` | **Vercel** | Next.js SSR/static |
| `backend/` | **Railway** / **Render** / **Fly.io** | FastAPI ASGI |

## Instructions

### 1. Deploy backend first (you need the public URL for frontend env)

**Railway example:**

```bash
cd backend
npm i -g @railway/cli   # or use dashboard
railway login
railway init
railway up
```

Set env vars in host dashboard: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`SUPABASE_JWT_SECRET`, `CORS_ORIGINS` (include Vercel URL + localhost).

Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Note the **public API URL** (e.g. `https://budgetlens-api.up.railway.app`).

### 2. Deploy frontend (Vercel)

```bash
cd frontend
npm i -g vercel
vercel login
vercel link          # or connect via GitHub integration; Root Directory = frontend
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_API_URL   # ← paste backend public URL
vercel --prod --yes
```

### 3. Update Supabase Auth

- **Site URL** → Vercel production URL
- **Redirect URLs** → add Vercel domain

### 4. Verify

- [ ] Vercel site loads
- [ ] FastAPI `/docs` reachable on public URL
- [ ] Login works; CRUD hits API successfully
- [ ] No secrets in GitHub

## Constraints

- Never hardcode URLs; use env vars.
- CORS must list the exact Vercel origin (not `*` in production).
- If push/deploy fails, report the error and attempt one fix before stopping.
