# Hackathon Day Checklist

## Pre-Hackathon Setup (Do Before March 25)

- [x] Supabase account created at [supabase.com](https://supabase.com)
- [x] Vercel account created at [vercel.com](https://vercel.com)
- [x] GitHub repo created (public)
- [x] Node.js 20+ and Python 3.11+ installed
- [x] Vercel CLI: `npm i -g vercel`
- [x] Cursor: rules, skills, MCPs (Supabase, Vercel, GitHub, Figma, Stitch, Browser)
- [x] Supabase project + schema planned

## Hackathon Day (March 25, 9:00 AM)

### Minutes 0-10: Analyze & Plan

- [x] Read the use case
- [x] Architecture: Next + FastAPI + Supabase + dual deploy
- [x] Data model + REST list in `docs/architecture.md`
- [x] Start timer

### Minutes 10-15: Scaffold

- [x] `frontend/`: Next.js + Tailwind + Supabase client
- [x] `backend/`: FastAPI + CORS + health + `/docs`
- [x] `.env.local` + `backend/.env` from root `.env.example`
- [x] Supabase tables + RLS

### Minutes 15-45: Build Core Features

- [x] Auth (Supabase) in UI; JWT to API
- [x] FastAPI CRUD + Pydantic (categories, transactions, finance settings, summary)
- [x] Core screens: login, signup, landing, transactions, dashboard, settings

### Minutes 45-60: Integrate & Test

- [x] `NEXT_PUBLIC_API_URL` + `CORS_ORIGINS` correct
- [x] Auth refactor: anon key + RLS passthrough (no service-role key)
- [ ] Full flow: signup → CRUD → charts (production end-to-end)
- [x] Loading / error states

### Minutes 60-75: Polish & Deploy

- [x] `cd frontend && npm run build` ✅
- [x] Deploy **frontend** to Vercel — [https://frontend-rho-ten-42.vercel.app](https://frontend-rho-ten-42.vercel.app)
- [ ] Deploy **backend** to Vercel — `vercel.json` + `api/index.py` ready
- [ ] Production env vars + Supabase redirect URLs for production domain

### Minutes 75-90: Document & Submit

- [x] README URLs (web + API)
- [x] `docs/ai-workflow.md`
- [x] `docs/architecture.md` updated
- [ ] Final `git push`

## Deliverables Reminder

1. **Working product** — [https://frontend-rho-ten-42.vercel.app](https://frontend-rho-ten-42.vercel.app)
2. **GitHub** — [https://github.com/dileeparsl/budgetlens](https://github.com/dileeparsl/budgetlens)
3. **AI workflow docs** — [docs/ai-workflow.md](ai-workflow.md)
