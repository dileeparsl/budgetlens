# RSL Mini-Hack '26 — BudgetLens (personal finance)

> **Monorepo**: `frontend/` (Next.js) + `backend/` (FastAPI), **Supabase**, **dual deployments**.

**Official brief**: [docs/use-case.md](docs/use-case.md)  
**UI / design (Google Stitch)**: [docs/DESIGN.md](docs/DESIGN.md) — *The Aperture Experience*

## Live demo

| Surface | URL |
| ------- | --- |
| Web app (Vercel) | [deployed-frontend-url] |
| API (FastAPI) | [deployed-api-url] |

## Tech stack

| Layer | Choice |
| ----- | ------ |
| Frontend | Next.js, TypeScript, Tailwind, shadcn/ui (`frontend/`) |
| Backend | FastAPI, Pydantic (`backend/`) |
| Database + Auth | Supabase (PostgreSQL + Auth + RLS) |
| Frontend hosting | **Vercel** (set **Root Directory** to `frontend`) |
| API hosting | **Railway**, **Render**, or **Fly.io** (recommended) |
| Repo | GitHub |
| UI/UX | **Google Stitch** + **Figma** (MCPs in Cursor as you connect them) |

## Monorepo layout

```text
frontend/          # Next.js — npm, Vercel
backend/           # FastAPI — Python, separate host
docs/              # use-case, architecture, DESIGN (Stitch), ai-workflow
.env.example       # templates for both packages (copy to frontend/.env.local, backend/.env)
```

## Quick start (local)

**1. Supabase** — create a project; note URL, anon key, service role, JWT secret.

**2. Frontend**

```bash
cd frontend
npm install
cp ../.env.example .env.local
# Edit .env.local — NEXT_PUBLIC_* and NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

**3. Backend**

```bash
cd backend
# Create venv; install deps (see backend/README.md)
cp ../.env.example .env
# Edit .env — SUPABASE_*, CORS_ORIGINS=http://localhost:3000
uvicorn app.main:app --reload --port 8000
```

Open the app at [http://localhost:3000](http://localhost:3000) and API docs at [http://localhost:8000/docs](http://localhost:8000/docs).

Scaffold details: [.cursor/skills/rapid-scaffold/SKILL.md](.cursor/skills/rapid-scaffold/SKILL.md).

## Environment variables

See [.env.example](.env.example). Important cross-cutting values:

- **`NEXT_PUBLIC_API_URL`** — public FastAPI base URL (frontend)
- **`CORS_ORIGINS`** — allows the Vercel + localhost origins (backend)

## AI workflow (hackathon deliverable)

[docs/ai-workflow.md](docs/ai-workflow.md)

## Architecture

[docs/architecture.md](docs/architecture.md)

## Design system

[docs/DESIGN.md](docs/DESIGN.md) — colors, surfaces, typography (Manrope + Inter), glass/gradient rules, and component patterns from **Google Stitch**. In Cursor/Antigravity, use the **`design-aperture`** skill when implementing UI.

## Deploy

- **Frontend**: `cd frontend` → `vercel --prod` or Git integration with Root Directory **`frontend`**
- **Backend**: deploy `backend/` folder on Railway/Render/Fly; set env vars; point `NEXT_PUBLIC_API_URL` at the public API URL

Full checklist: [.cursor/skills/deploy-free-hosting/SKILL.md](.cursor/skills/deploy-free-hosting/SKILL.md).

## IDE support

This repo is configured for **two agentic IDEs** — use whichever you prefer (or both):

| IDE | Config | Skills |
| --- | ------ | ------ |
| **Cursor** | `.cursor/rules/*.mdc` | `.cursor/skills/*/SKILL.md` |
| **Google Antigravity** | `GEMINI.md` (project root) | `.agent/skills/*/SKILL.md` |

Both read **`AGENTS.md`** as a shared cross-tool standard. Antigravity also reads `GEMINI.md` (higher priority for Antigravity-specific behaviour).

### MCP (Cursor)

Starter config: [.cursor/mcp.json](.cursor/mcp.json). Add **Figma**, **Stitch**, Browser, Mermaid, etc. from Cursor MCP settings.

### MCP (Antigravity)

Antigravity connects to MCP servers through its own settings panel. The same servers (Supabase, Vercel, GitHub, Figma, Stitch) apply.

## License

MIT
