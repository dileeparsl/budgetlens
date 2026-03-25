# Hackathon Day Checklist

## Pre-Hackathon Setup (Do Before March 25)

- [ ] Supabase account created at [supabase.com](https://supabase.com)
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] API host account (Railway / Render / Fly) for **FastAPI**
- [ ] GitHub repo created (public)
- [ ] Node.js 20+ and Python 3.11+ installed
- [ ] Vercel CLI: `npm i -g vercel` (optional if using Git integration)
- [ ] Cursor: rules, skills, **MCPs** (Supabase, Vercel, GitHub, Figma, Stitch, Browser, …)
- [ ] Supabase project + schema planned
- [ ] Dry run: `frontend` build + `backend` `/docs` locally + env templates

## Hackathon Day (March 25, 9:00 AM)

### Minutes 0-10: Analyze & Plan

- [ ] Read the use case
- [ ] Architecture: Next + FastAPI + Supabase + dual deploy
- [ ] Data model + REST list in `docs/architecture.md`
- [ ] Start timer

### Minutes 10-15: Scaffold

- [ ] `frontend/`: Next.js + shadcn + Supabase client
- [ ] `backend/`: FastAPI + CORS + health + `/docs`
- [ ] `.env.local` + `backend/.env` from root `.env.example`
- [ ] Supabase tables + RLS

### Minutes 15-45: Build Core Features

- [ ] Auth (Supabase) in UI; JWT to API
- [ ] FastAPI CRUD + Pydantic
- [ ] Core screens: landing, transactions, dashboard

### Minutes 45-60: Integrate & Test

- [ ] `NEXT_PUBLIC_API_URL` + `CORS_ORIGINS` correct
- [ ] Full flow: signup → CRUD → charts
- [ ] Loading / error states

### Minutes 60-75: Polish & Deploy

- [ ] `cd frontend && npm run build`
- [ ] Deploy **frontend** to Vercel (**Root Directory** = `frontend`)
- [ ] Deploy **backend** to API host
- [ ] Production env + Supabase redirect URLs

### Minutes 75-90: Document & Submit

- [ ] README URLs (web + API)
- [ ] `docs/ai-workflow.md`
- [ ] Final `git push`

## Deliverables Reminder

1. **Working product** — hosted **frontend** URL + working **API** URL
2. **GitHub** — monorepo with `frontend/` and `backend/`
3. **AI workflow docs**
