---
name: deploy-free-hosting
description: Deploy BudgetLens monorepo — Vercel for frontend/ and a separate free-tier host for backend/ (FastAPI). Environment variables, CORS, Supabase auth URLs, verification.
---

# Deploy to Free Hosting (Monorepo)

## Two deployments

| Package | Platform | Role |
| ------- | -------- | ---- |
| **`frontend/`** | **Vercel** | Next.js static/SSR |
| **`backend/`** | **Railway** / **Render** / **Fly.io** | FastAPI ASGI |

Vercel is optimized for the Next.js app. Running a full FastAPI app on Vercel is possible via Python serverless but is **not** the default path; use a small API host for speed and predictable behavior.

## Shared prerequisites

1. Production **FastAPI** URL (e.g. `https://your-api.railway.app`)
2. Vercel **frontend** URL (e.g. `https://your-app.vercel.app`)
3. Set **`NEXT_PUBLIC_API_URL`** on Vercel to (1)
4. Set **`CORS_ORIGINS`** on the API to include (2) and localhost for dev
5. **Supabase** → Authentication → URL configuration: Site URL and redirect URLs include the Vercel URL

## Vercel (`frontend/`)

### CLI path

```bash
cd frontend
npm i -g vercel
vercel login
vercel link
```

### Environment variables (Vercel dashboard or CLI)

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_APP_URL
```

### Deploy

```bash
vercel --prod --yes
```

Or connect the GitHub repo and set **Root Directory** to **`frontend`**.

### Verify

- Open deployment URL
- Login / signup
- Network tab: API calls go to production `NEXT_PUBLIC_API_URL`

## Backend (example: Railway)

```bash
npm i -g @railway/cli
railway login
cd backend
railway init
railway up
```

Set variables in the dashboard: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `CORS_ORIGINS`, and `PORT` if required.

**Start command** (typical): `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Backend (example: Render)

- New **Web Service** from repo, **root directory** `backend`
- Build: `pip install -r requirements.txt` (or your tool)
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| Frontend build fails | `cd frontend && npm run build` locally |
| CORS errors | Add exact Vercel URL to `CORS_ORIGINS` on API |
| Auth redirect mismatch | Update Supabase Auth URL config |
| 401 on API | Bearer token from Supabase session; check JWT secret on backend |
| Mixed content | Use `https` for both frontend and API |

## Post-deploy checklist

- [ ] Vercel site loads
- [ ] FastAPI `/docs` reachable on public URL
- [ ] Login works; CRUD hits API successfully
- [ ] No secrets in GitHub; all in host env panels
