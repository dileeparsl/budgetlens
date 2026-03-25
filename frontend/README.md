# Frontend (`frontend/`)

Next.js application for **BudgetLens** (personal finance UI).

## Stack

- **Framework**: Next.js (App Router), TypeScript, Tailwind CSS
- **UI**: shadcn/ui, Lucide icons, Recharts (dashboard)
- **Data**: Calls the **FastAPI** backend (`NEXT_PUBLIC_API_URL`); Supabase Auth from the client
- **Design**: Canonical spec **[`../docs/DESIGN.md`](../docs/DESIGN.md)** (*The Aperture Experience*, from Stitch); prototype in **Stitch**, polish in **Figma**; skill **`design-aperture`** in Cursor/Antigravity

## Local development

From this directory (after `npm install`):

```bash
npm run dev
```

Default: [http://localhost:3000](http://localhost:3000)

## Deploy (Vercel)

- Create a Vercel project from this GitHub repo.
- Set **Root Directory** to `frontend`.
- Add environment variables from the repo root `.env.example` (frontend section).
- Ensure production `NEXT_PUBLIC_API_URL` points at your deployed FastAPI base URL.
- Update Supabase Auth **Site URL** and **redirect URLs** to match the Vercel domain.

## Scaffold

See `.cursor/skills/rapid-scaffold/SKILL.md` — run `create-next-app` **inside** `frontend/`, not the repo root.
