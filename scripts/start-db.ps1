# Starts the local portable PostgreSQL instance used for development.
# Data dir and binaries were installed under the user profile (ASCII path)
# to avoid Prisma's non-ASCII path issue on localized Windows folders.

$ErrorActionPreference = "Stop"

$PgBin  = "C:\Users\96659\pg16\pgsql\bin"
$PgData = "C:\Users\96659\pgdata"
$LogFile = "C:\Users\96659\pglog.txt"

if (-not (Test-Path "$PgBin\pg_ctl.exe")) {
    Write-Error "PostgreSQL binaries not found at $PgBin. Re-run the install step."
    exit 1
}

$status = & "$PgBin\pg_ctl.exe" -D $PgData status 2>&1
if ($status -match "server is running") {
    Write-Host "PostgreSQL is already running on port 5432." -ForegroundColor Green
} else {
    & "$PgBin\pg_ctl.exe" -D $PgData -l $LogFile -o "-p 5432" start
    Start-Sleep -Seconds 2
    Write-Host "PostgreSQL started on port 5432." -ForegroundColor Green
}

Write-Host "Connection string:" -ForegroundColor Cyan
Write-Host "  postgresql://postgres:postgrespw@localhost:5432/studentcareer"
