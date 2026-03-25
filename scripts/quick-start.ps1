# RSL Mini-Hack '26 - Monorepo quick start (PowerShell)
# Run from REPO ROOT. Scaffolds frontend/ and prints backend setup steps.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "=== BudgetLens monorepo quick start ===" -ForegroundColor Cyan
Write-Host "Use case: personal finance (docs/use-case.md)" -ForegroundColor DarkGray

$frontend = Join-Path $root "frontend"
$backend = Join-Path $root "backend"

# --- Frontend: Next.js inside frontend/ ---
if (-not (Test-Path (Join-Path $frontend "package.json"))) {
    Write-Host "`n[1/3] Creating Next.js app in frontend/..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $frontend | Out-Null
    Push-Location $frontend
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
    npm install @supabase/supabase-js @supabase/ssr zod recharts lucide-react
    npm install -D @types/node
    npx shadcn@latest init -d
    npx shadcn@latest add button card input label table dialog form select tabs toast badge avatar dropdown-menu sheet separator
    Pop-Location
} else {
    Write-Host "`n[1/3] frontend/ already has package.json — skip create-next-app" -ForegroundColor DarkGray
}

# --- Env: copy root template into frontend ---
$envExample = Join-Path $root ".env.example"
$envLocal = Join-Path $frontend ".env.local"
if ((Test-Path $envExample) -and -not (Test-Path $envLocal)) {
    Write-Host "`n[2/3] Copying .env.example -> frontend/.env.local" -ForegroundColor Yellow
    Copy-Item $envExample $envLocal
    Write-Host "UPDATE frontend/.env.local with your Supabase + NEXT_PUBLIC_API_URL=http://localhost:8000" -ForegroundColor Red
}

Write-Host "`n[3/3] Backend (manual)" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor Cyan
Write-Host "  Create venv; install fastapi uvicorn pydantic supabase-py (see backend/README.md)" -ForegroundColor Cyan
Write-Host "  Copy ..\.env.example to backend\.env and fill SUPABASE_* and CORS_ORIGINS" -ForegroundColor Cyan

Write-Host "`n=== Done ===" -ForegroundColor Green
Write-Host "  frontend: cd frontend; npm run dev  -> http://localhost:3000" -ForegroundColor Cyan
Write-Host "  backend:  cd backend; uvicorn app.main:app --reload --port 8000" -ForegroundColor Cyan
