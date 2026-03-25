# Frontend (`frontend/`)

Next.js web app for **BudgetLens** — personal finance tracking with the Aperture dark theme.

## Live

| | URL |
| --- | --- |
| **Web app** | [https://frontend-rho-ten-42.vercel.app](https://frontend-rho-ten-42.vercel.app) |

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with Aperture design tokens
- **Auth**: Supabase Auth (email/password)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deploy**: Vercel

## Pages

| Route | Page | Description |
| ----- | ---- | ----------- |
| `/login` | Sign In | Email/password auth via Supabase |
| `/signup` | Sign Up | Create account |
| `/` | Home | Month summary: income, expenses, balance, budget progress, category breakdown |
| `/dashboard` | Dashboard | 6-month bar chart (income vs expenses) + category donut chart |
| `/transactions` | Transactions | Full CRUD: list with filters, add/edit modal, delete confirmation |
| `/settings` | Settings | Monthly income, budget, savings targets + profile info |

## Design System — The Aperture Experience

From [Google Stitch](https://stitch.withgoogle.com/) via [docs/DESIGN.md](../docs/DESIGN.md):

- **Dark theme** — surface `#061423`, teal/cyan accents
- **No borders** — tonal shifts between surface layers define structure
- **Glassmorphism** — `backdrop-blur` on floating elements
- **Typography** — Manrope (headlines) + Inter (body)
- **Charts** — Focal Chart colors: green (#67e100) for positive, cyan (#2ddbde) for spending, coral (#ffb4ab) for warnings

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Aperture tokens via @theme
│   ├── layout.tsx           # Root layout (fonts)
│   ├── login/page.tsx       # Sign in
│   ├── signup/page.tsx      # Sign up
│   └── (app)/               # Auth-protected route group
│       ├── layout.tsx       # Sidebar + auth gate
│       ├── page.tsx         # Home / landing
│       ├── dashboard/       # Charts
│       ├── transactions/    # CRUD
│       └── settings/        # Finance targets
├── components/
│   ├── auth-provider.tsx    # Supabase auth context
│   └── sidebar.tsx          # Navigation sidebar
├── lib/
│   ├── supabase.ts          # Supabase browser client (lazy init)
│   ├── api.ts               # Typed fetch wrapper for FastAPI
│   └── utils.ts             # cn(), formatCents(), formatMonth()
└── types/
    └── index.ts             # TypeScript types mirroring API models
```

## Local Development

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with Supabase URL, anon key, and API URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
| -------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | FastAPI base URL (e.g. `http://localhost:8000`) |

## Build

```bash
npm run build
```

## Deploy to Vercel

```bash
vercel --prod --yes
```

Or connect the GitHub repo with **Root Directory** = `frontend` in the Vercel dashboard.

Set the three `NEXT_PUBLIC_*` env vars in Vercel project settings.
