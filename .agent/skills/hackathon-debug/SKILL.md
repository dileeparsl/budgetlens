---
name: hackathon-debug
description: Fast debugging for the BudgetLens monorepo — Next.js frontend, FastAPI backend, Supabase, CORS, and dual deployment issues. Use when hitting build failures, 401/CORS errors, or integration bugs.
---

# Hackathon Speed Debugging

## Goal

Diagnose and fix errors in under 10 minutes during the hackathon.

## Instructions

### 1. Identify the package

- **Frontend** (`frontend/`): build errors, fetch failures, hydration mismatches.
- **Backend** (`backend/`): Pydantic 422, JWT 401, DB/RLS errors.
- **Cross-cutting**: CORS, env vars, Supabase auth redirects.

### 2. Quick diagnosis

1. Read the full error (browser console / Network tab / FastAPI terminal / Vercel build log).
2. Check env: `NEXT_PUBLIC_API_URL`, `CORS_ORIGINS`, Supabase keys, JWT secret.
3. Isolate: does the same call work from `/docs` (Swagger)?
4. Fix the simplest possible cause first.

### 3. Common fixes

**Frontend (Next.js)**

| Error | Fix |
| ----- | --- |
| `Module not found` | Check import path; `npm install` in `frontend/` |
| `Failed to fetch` / CORS | Verify `NEXT_PUBLIC_API_URL` scheme + `CORS_ORIGINS` on API |
| 401 on API | Attach `Authorization: Bearer <access_token>` from Supabase session |
| Hydration mismatch | Wrap dynamic data in `useEffect` |

**Backend (FastAPI)**

| Error | Fix |
| ----- | --- |
| 422 Unprocessable | Pydantic schema vs request body drift |
| 401 / invalid JWT | `SUPABASE_JWT_SECRET`, algorithm, clock skew |
| RLS / relation error | Check policies or migration; `auth.uid()` match |

**Deployment**

| Error | Fix |
| ----- | --- |
| Vercel build fail | `cd frontend && npm run build` locally first |
| Wrong API URL in prod | Set `NEXT_PUBLIC_API_URL` on Vercel dashboard |
| Mixed content | Both frontend and API must use HTTPS in production |

### 4. Emergency escapes

- Temporarily set CORS to `*` **only on localhost** to confirm CORS diagnosis.
- Expose minimal `/health` + one CRUD for demo if time is critical.
- Hardcode mock data in UI only as absolute last resort.

## Constraints

- Never spend more than 10 minutes on one bug.
- Log blockers as `TODO:` and move on; escalate to human if stuck > 5 min.
