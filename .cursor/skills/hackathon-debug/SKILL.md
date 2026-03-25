---
name: hackathon-debug
description: Fast debugging for monorepo: Next.js (frontend), FastAPI (backend), Supabase, CORS, dual deployment. Use for build failures, 401/CORS, and integration issues.
---

# Hackathon Speed Debugging

## Rule #1: Never spend more than 10 minutes on one bug

## Quick diagnosis flow

1. **Read the error** end-to-end (browser console, Network tab, FastAPI logs, Vercel build log).
2. **Which package?** `frontend` vs `backend` vs Supabase.
3. **Env?** `NEXT_PUBLIC_API_URL`, `CORS_ORIGINS`, Supabase keys, JWT secret.
4. **Ask AI** with full error + request URL + response body.

## Frontend (Next.js)

| Error | Fix |
| ----- | --- |
| `Module not found` | Paths, `npm install`, run from `frontend/` |
| `Failed to fetch` / CORS | API URL scheme, `CORS_ORIGINS`, API running |
| 401 on API | Attach `Authorization: Bearer <access_token>` from Supabase session |
| Hydration mismatch | Client-only data in `useEffect` or fix SSR mismatch |

## Backend (FastAPI)

| Error | Fix |
| ----- | --- |
| `422 Unprocessable` | Pydantic schema vs JSON body |
| 401 / invalid token | `SUPABASE_JWT_SECRET`, algorithm, clock skew |
| DB / RLS errors | policies vs `user_id` from JWT |
| Listen `0.0.0.0` + `$PORT` on hosted platforms |

## Supabase

| Error | Fix |
| ----- | --- |
| `relation does not exist` | Run migrations |
| RLS blocks reads | Policies for `auth.uid()` |
| Redirect URL error | Add Vercel domain in Auth settings |

## Deployment

| Error | Fix |
| ----- | --- |
| Vercel build | `cd frontend && npm run build` |
| Wrong API URL in prod | `NEXT_PUBLIC_API_URL` on Vercel |
| API cold start timeout | Free tier limits; simplify startup |

## Emergency escapes

- Narrow CORS to `*` temporarily **only on localhost** to confirm CORS diagnosis (revert before prod).
- Expose minimal `/health` + one CRUD route for demo.
- Hardcode read-only mock in UI only if API is totally blocked (last resort).

## Debug commands

```bash
cd frontend && npm run build 2>&1 | Select-Object -First 50   # PowerShell
cd frontend && npx tsc --noEmit
cd backend && python -m compileall app
```
