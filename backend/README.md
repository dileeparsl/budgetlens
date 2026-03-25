# Backend (`backend/`)

FastAPI service for **BudgetLens** REST API, validation, and Supabase-backed data access.

## Stack

- **Framework**: FastAPI, Uvicorn
- **Validation**: Pydantic v2
- **Database / auth**: Supabase (PostgreSQL + RLS + JWT from Supabase Auth)
- **Python**: 3.11+ recommended

## Local development

From this directory (after creating a venv and installing deps, e.g. `uv` or `pip`):

```bash
uvicorn app.main:app --reload --port 8000
```

API base: [http://localhost:8000](http://localhost:8000)  
OpenAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Environment

Copy variables from the repo root `.env.example` (backend section) into `backend/.env`.

## CORS

Allow the Next.js origin (local and Vercel production URL) via `CORS_ORIGINS`.

## Deploy (separate from frontend)

This repo uses **two deployments**:

| Piece | Typical host | Notes |
| ----- | ------------ | ----- |
| Next.js (`frontend/`) | **Vercel** | Root Directory = `frontend` |
| FastAPI (`backend/`) | **Railway**, **Render**, or **Fly.io** | Native ASGI; free-tier friendly |

Vercel’s Python runtime works for small serverless handlers but is not the default for a full FastAPI app; prefer a small container/ASGI host for the API unless you intentionally adapt to Vercel Functions.

## Contract with frontend

Agree on request/response shapes before parallel work (see `docs/architecture.md`). Optionally export **OpenAPI** from FastAPI and mirror types in the Next.js app (or maintain a short `docs/api-contract.md`).
