# ========== SEO SYSTEM REMOVAL ROLLBACK SCRIPT ==========
# Emergency rollback procedure for Story 2: Old SEO System Complete Removal
# This script restores the old SEO system files and reverts dependency changes

param(
    [switch]$TestOnly = $false
)

Write-Host "🚨 EMERGENCY ROLLBACK INITIATED" -ForegroundColor Red
Write-Host "Restoring Old SEO System Files..." -ForegroundColor Yellow

# Function to restore a file
function Restore-File {
    param(
        [string]$BackupFile,
        [string]$TargetFile
    )

    if (Test-Path $BackupFile) {
        Write-Host "✅ Restoring $TargetFile" -ForegroundColor Green
        Copy-Item $BackupFile $TargetFile -Force
        return $true
    }
    else {
        Write-Host "❌ Backup not found: $BackupFile" -ForegroundColor Red
        return $false
    }
}

# Function to revert git changes
function Restore-GitFile {
    param(
        [string]$File
    )

    Write-Host "🔄 Reverting git changes for $File" -ForegroundColor Yellow

    try {
        # Check if file exists and has changes
        $gitStatus = git status --porcelain $File 2>$null
        if ($gitStatus) {
            $null = git checkout HEAD~1 -- $File 2>$null
            Write-Host "✅ Reverted $File" -ForegroundColor Green
        }
        else {
            Write-Host "No uncommitted changes for $File" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Could not revert $File : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Check if backup directory exists
$BackupDir = "backup/old-seo-system"
if (-not (Test-Path $BackupDir)) {
    Write-Host "❌ Backup directory not found: $BackupDir" -ForegroundColor Red
    Write-Host "Cannot proceed with rollback. Manual restoration required."
    exit 1
}

# Find the latest backup
$LatestBackup = Get-ChildItem $BackupDir | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $LatestBackup) {
    Write-Host "❌ No backup files found in $BackupDir" -ForegroundColor Red
    exit 1
}

$BackupPath = Join-Path $BackupDir $LatestBackup.Name
Write-Host "Using backup: $BackupPath"

if ($TestOnly) {
    Write-Host "TEST MODE: Would restore from $BackupPath" -ForegroundColor Yellow
    exit 0
}

# Step 1: Restore old SEO system files
Write-Host ""
Write-Host "📁 Step 1: Restoring Old SEO System Files"

$RestoreResults = @()

# Restore seo-optimizer.ts
$RestoreResults += Restore-File (Join-Path $BackupPath "seo-optimizer.ts") "src/utils/ai/seo-optimizer.ts"

# Restore metadata-loader.ts
$RestoreResults += Restore-File (Join-Path $BackupPath "metadata-loader.ts") "src/utils/metadata-loader.ts"

# Restore base-integration.ts
$RestoreResults += Restore-File (Join-Path $BackupPath "base-integration.ts") "src/types/base-integration.ts"

# Restore fallback-system.ts
$RestoreResults += Restore-File (Join-Path $BackupPath "fallback-system.ts") "src/types/fallback-system.ts"

# Restore metadata-input.ts
$RestoreResults += Restore-File (Join-Path $BackupPath "metadata-input.ts") "src/types/metadata-input.ts"

# Step 2: Revert dependency changes
Write-Host ""
Write-Host "🔄 Step 2: Reverting Dependency Changes"

# Revert seo-connector.ts
Restore-GitFile "src/utils/base-integration/seo-connector.ts"

# Revert data-flow-builder.ts
Restore-GitFile "src/utils/base-integration/data-flow-builder.ts"

# Revert ai-system.ts
Restore-GitFile "src/utils/ai/ai-system.ts"

# Revert ai/index.ts (remove SEOOptimizer export)
Restore-GitFile "src/utils/ai/index.ts"

# Revert docs/[slug].astro
Restore-GitFile "src/pages/docs/[slug].astro"

# Step 3: Clean up new files
Write-Host ""
Write-Host "🧹 Step 3: Cleaning Up New Files"

$NewMetadataLoader = "src/utils/new-seo-system/metadata-loader.ts"
if (Test-Path $NewMetadataLoader) {
    Write-Host "🗑️ Removing new metadata-loader.ts" -ForegroundColor Yellow
    Remove-Item $NewMetadataLoader -Force
}

# Step 4: Verification
Write-Host ""
Write-Host "🔍 Step 4: Verification"

$FilesToCheck = @(
    "src/utils/ai/seo-optimizer.ts",
    "src/utils/metadata-loader.ts",
    "src/types/base-integration.ts",
    "src/types/fallback-system.ts",
    "src/types/metadata-input.ts"
)

Write-Host "Checking restored files..."
foreach ($file in $FilesToCheck) {
    if (Test-Path $file) {
        Write-Host "✅ Found $file" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Missing $file" -ForegroundColor Red
    }
}

# Step 5: Build verification
Write-Host ""
Write-Host "🔨 Step 5: Build Verification"

Write-Host "Running TypeScript check..."
try {
    $null = npx tsc --noEmit 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript compilation successful" -ForegroundColor Green
    }
    else {
        Write-Host "❌ TypeScript compilation failed" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ TypeScript check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Running Astro build..."
try {
    $null = npm run build 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Astro build successful" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Astro build failed" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ Astro build failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 ROLLBACK COMPLETED" -ForegroundColor Green
Write-Host "The old SEO system has been restored."
Write-Host "Please verify the application functionality before proceeding."
