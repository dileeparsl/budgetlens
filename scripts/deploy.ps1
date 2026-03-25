# RSL Mini-Hack '26 - Deploy frontend to Vercel (PowerShell)
# Run from REPO ROOT. Backend FastAPI must be deployed separately (Railway/Render/Fly).

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root "frontend"

Write-Host "=== Vercel deploy: frontend/ ===" -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $frontend "package.json"))) {
    Write-Host "frontend/package.json not found. Scaffold frontend/ first." -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/3] Build check (frontend)..." -ForegroundColor Yellow
Push-Location $frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Fix errors before deploy." -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "`n[2/3] Git commit (optional)..." -ForegroundColor Yellow
Pop-Location
Set-Location $root
git add -A
git commit -m "feat: pre-deployment commit" 2>$null
git push origin main 2>$null

Write-Host "`n[3/3] Vercel (run from frontend/)..." -ForegroundColor Yellow
Push-Location $frontend
vercel --prod --yes

Pop-Location
Write-Host "`nDeployment step finished." -ForegroundColor Green
Write-Host "Also deploy backend/ to your API host; set NEXT_PUBLIC_API_URL on Vercel to that base URL." -ForegroundColor Cyan
Write-Host "Supabase Auth: add your Vercel domain to Site URL and redirect URLs." -ForegroundColor Cyan
