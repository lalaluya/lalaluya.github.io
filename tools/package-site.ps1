$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$publicDir = Join-Path $projectRoot "public"
$distDir = Join-Path $projectRoot "dist"
$zipPath = Join-Path $distDir "site.zip"

if (-not (Test-Path $publicDir)) {
    throw "public directory not found. Run 'npm run build:prod' first."
}

if (Test-Path $distDir) {
    Remove-Item -LiteralPath $distDir -Recurse -Force
}

New-Item -ItemType Directory -Path $distDir | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($publicDir, $zipPath)

Write-Output "Created package: $zipPath"
