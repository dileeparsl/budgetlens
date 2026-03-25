# Backend (`backend/`)

FastAPI REST API for **BudgetLens** — personal finance tracking.

## Live

| | URL |
| --- | --- |
| **API docs (Swagger)** | [https://budgetlens-api.vercel.app/docs](https://budgetlens-api.vercel.app/docs) |
| **Health check** | [https://budgetlens-api.vercel.app/health](https://budgetlens-api.vercel.app/health) |

## Stack

- **Framework**: FastAPI + Uvicorn
- **Validation**: Pydantic v2
- **Database + Auth**: Supabase (PostgreSQL + RLS + anon key + JWT forwarding)
- **Python**: 3.9+
- **Deploy**: Vercel serverless Python (`vercel.json` + `api/index.py`)

## Architecture

```
Request → FastAPI → auth.py (verify JWT via supabase.auth.get_user)
                  → database.py (per-request client with JWT → PostgREST → RLS)
                  → Supabase Postgres
```

- **`auth.py`** — verifies the Supabase JWT by calling `supabase.auth.get_user(token)` (no local JWT secret needed)
- **`database.py`** — two client modes:
  - `get_supabase()` — shared anon client (for auth verification)
  - `get_supabase_for_user()` — per-request client with `postgrest.auth(token)` so RLS sees `auth.uid()`
- **No service-role key** — all data access goes through RLS with the user's own JWT

## API Endpoints

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/health` | Health check |
| GET, POST | `/api/categories` | List (auto-seeds 10 defaults) / Create |
| GET, PUT, DELETE | `/api/categories/{id}` | Read / Update / Delete |
| GET, POST | `/api/transactions` | List (filter by type, category, date range; paginate) / Create |
| GET, PUT, DELETE | `/api/transactions/{id}` | Read / Update / Delete |
| GET, PUT | `/api/finance-settings` | Read (auto-creates on first GET) / Upsert |
| GET | `/api/summary/monthly?year=&month=` | Monthly income/expense/balance, budget %, category breakdown |
| GET | `/api/summary/dashboard?months=6` | Current month summary + N-month trend data |

All money values are **integer cents** (e.g. `$45.50` → `4550`).

## Local Development

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase URL + anon key
uvicorn app.main:app --reload --port 8000
```

API: [http://localhost:8000](http://localhost:8000)
Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Environment Variables

| Variable | Description |
| -------- | ----------- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `CORS_ORIGINS` | Comma-separated allowed origins (include frontend URL) |

## Database Schema

Run `backend/sql/schema.sql` in Supabase SQL Editor. Creates:

- **`categories`** — user categories with name, icon, color
- **`transactions`** — income/expense with amount_cents, type, category, date
- **`finance_settings`** — one row per user: monthly income, budget, savings target
- **RLS policies** on all tables: `auth.uid() = user_id`
- **Triggers** for auto-updating `updated_at`

## Deploy to Vercel

The backend deploys as Vercel serverless Python:

```bash
cd backend
vercel --prod --yes
```

Uses `vercel.json` (routes all requests to `api/index.py`) + `requirements.txt` for deps.

Set env vars in Vercel dashboard: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CORS_ORIGINS`.

## Contract with Frontend

- Source of truth: FastAPI OpenAPI (`/openapi.json`)
- TypeScript types in `frontend/src/types/index.ts` mirror Pydantic models
- Frontend sends `Authorization: Bearer <supabase_access_token>` on every request
