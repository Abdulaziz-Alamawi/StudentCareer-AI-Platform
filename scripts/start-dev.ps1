# StudentCareer AI Platform — local development startup (Windows PowerShell)
# Usage:  .\scripts\start-dev.ps1
# Requires: Node.js 20+, Python 3.11+, PostgreSQL (or Docker for db only)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "=== StudentCareer AI — Dev Startup ===" -ForegroundColor Cyan

# ---- Backend env ----
$Backend = Join-Path $Root "backend"
if (-not (Test-Path (Join-Path $Backend ".env"))) {
    Copy-Item (Join-Path $Backend ".env.example") (Join-Path $Backend ".env")
    Write-Host "Created backend/.env from .env.example" -ForegroundColor Yellow
}

# ---- Frontend env ----
$Frontend = Join-Path $Root "frontend"
if (-not (Test-Path (Join-Path $Frontend ".env.local"))) {
    Set-Content (Join-Path $Frontend ".env.local") "NEXT_PUBLIC_API_URL=http://localhost:8000`n"
    Write-Host "Created frontend/.env.local" -ForegroundColor Yellow
}

# ---- Prefer ASCII-path venv if available (avoids Prisma path issues on localized Windows folders) ----
$VenvPython = "C:\scvenv\Scripts\python.exe"
if (-not (Test-Path $VenvPython)) {
    $VenvPython = Join-Path $Backend ".venv\Scripts\python.exe"
}
if (-not (Test-Path $VenvPython)) {
    Write-Host "Python venv not found. Run: cd backend && python -m venv .venv && pip install -r requirements.txt" -ForegroundColor Red
    exit 1
}

$env:SECRET_KEY = "dev-secret-key-change-in-production"
$env:DATABASE_URL = "postgresql://studentcareer:studentcareer@localhost:5432/studentcareer"
$env:BACKEND_CORS_ORIGINS = '["http://localhost:3000"]'

Write-Host ""
Write-Host "Starting BACKEND  -> http://localhost:8000/docs" -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "cd '$Backend'; `$env:SECRET_KEY='dev-secret-key'; `$env:DATABASE_URL='postgresql://studentcareer:studentcareer@localhost:5432/studentcareer'; `$env:BACKEND_CORS_ORIGINS='[\"http://localhost:3000\"]'; & '$VenvPython' -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
)

Start-Sleep -Seconds 2

Write-Host "Starting FRONTEND -> http://localhost:3000" -ForegroundColor Green
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "cd '$Frontend'; npm run dev"
)

Write-Host ""
Write-Host "Both servers launched in separate windows." -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000"
Write-Host "  Backend:  http://localhost:8000/docs"
Write-Host ""
Write-Host "Database: run 'docker compose up db' in project root (or install PostgreSQL locally)." -ForegroundColor Yellow
