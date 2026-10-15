$ErrorActionPreference = "Stop"

$databaseName = if ($env:POSTGRES_DB) { $env:POSTGRES_DB } else { "regional_economy" }
$adminUrl = if ($env:POSTGRES_ADMIN_URL) { $env:POSTGRES_ADMIN_URL } else { "postgresql://postgres:postgres@localhost:5432/postgres" }
$databaseUrl = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { "postgresql://postgres:postgres@localhost:5432/$databaseName" }
$psql = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psql) {
    throw "psql was not found. Install PostgreSQL with Command Line Tools and add its bin folder to PATH."
}
if ($databaseName -notmatch '^[A-Za-z_][A-Za-z0-9_]*$') {
    throw "POSTGRES_DB may contain only ASCII letters, digits, and underscores."
}

$databaseExists = (& $psql.Source $adminUrl -v ON_ERROR_STOP=1 -tAc "SELECT 1 FROM pg_database WHERE datname = '$databaseName'" | Out-String).Trim()
if ($LASTEXITCODE -ne 0) {
    throw "Could not connect to PostgreSQL. Check POSTGRES_ADMIN_URL and confirm the server is running."
}
if ($databaseExists -ne "1") {
    & $psql.Source $adminUrl -v ON_ERROR_STOP=1 -c "CREATE DATABASE `"$databaseName`""
    if ($LASTEXITCODE -ne 0) {
        throw "Could not create database $databaseName."
    }
}

$tableCount = (& $psql.Source $databaseUrl -v ON_ERROR_STOP=1 -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'").Trim()
if ($LASTEXITCODE -ne 0) {
    throw "Could not connect to database $databaseName. Check DATABASE_URL."
}
if ([int]$tableCount -gt 0) {
    throw "Database $databaseName already contains tables. Import stopped without changes; use an empty database to avoid overwriting data."
}

& $psql.Source $databaseUrl -v ON_ERROR_STOP=1 -f (Join-Path $PSScriptRoot "db.sql")
if ($LASTEXITCODE -ne 0) {
    throw "Importing db.sql failed. Check the psql output."
}

Write-Host "Database $databaseName was created and populated from db.sql."