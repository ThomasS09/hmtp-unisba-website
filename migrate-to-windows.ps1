# HMTP UNISBA - Migrate to Windows Native
# Run this script in PowerShell as Administrator

$sourceDir = "C:\hmtp-unisba-website"
$destDir = "C:\hmtp-unisba-website-windows"

Write-Host "Starting migration to Windows..." -ForegroundColor Green
Write-Host "Source: $sourceDir" -ForegroundColor Yellow
Write-Host "Destination: $destDir" -ForegroundColor Yellow
Write-Host ""

# Create destination folder
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    Write-Host "✓ Created destination folder" -ForegroundColor Green
}

# Copy folders
$folders = @("frontend", "backend", "assets", "tasks", ".github")

foreach ($folder in $folders) {
    $srcPath = "$sourceDir\$folder"
    $destPath = "$destDir\$folder"
    
    if (Test-Path $srcPath) {
        Write-Host "Copying $folder..." -ForegroundColor Cyan
        Copy-Item -Path $srcPath -Destination $destPath -Recurse -Force
        Write-Host "✓ Copied $folder" -ForegroundColor Green
    }
}

# Copy individual files
$files = @("SETUP-WINDOWS.md", ".env.example", "README.md")

foreach ($file in $files) {
    $srcFile = "$sourceDir\$file"
    $destFile = "$destDir\$file"
    
    if (Test-Path $srcFile) {
        Copy-Item -Path $srcFile -Destination $destFile -Force
        Write-Host "✓ Copied $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Migration Completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Project location: $destDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. cd C:\hmtp-unisba-website-windows\frontend" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Backend setup (in separate terminal):" -ForegroundColor Cyan
Write-Host "1. cd C:\hmtp-unisba-website-windows\backend" -ForegroundColor White
Write-Host "2. composer install" -ForegroundColor White
Write-Host "3. php artisan serve" -ForegroundColor White
