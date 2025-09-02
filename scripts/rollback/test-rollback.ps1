# ========== ROLLBACK VERIFICATION SCRIPT ==========
# Test rollback procedures and verify system integrity

Write-Host "🧪 TESTING ROLLBACK PROCEDURES" -ForegroundColor Blue

# Test counters
$TotalTests = 0
$PassedTests = 0

function Test-Result {
    param(
        [string]$TestName,
        [bool]$Result
    )

    $script:TotalTests++
    if ($Result) {
        Write-Host "✅ PASS - $TestName" -ForegroundColor Green
        $script:PassedTests++
    }
    else {
        Write-Host "❌ FAIL - $TestName" -ForegroundColor Red
    }
}

Write-Host "Testing PowerShell rollback script syntax..."
$ScriptPath = "scripts/rollback/seo-removal-rollback.ps1"
if (Test-Path $ScriptPath) {
    try {
        $null = Get-Command $ScriptPath -Syntax
        Test-Result "PowerShell rollback script syntax" $true
    }
    catch {
        Test-Result "PowerShell rollback script syntax" $false
    }
}
else {
    Test-Result "PowerShell rollback script exists" $false
}

Write-Host ""
Write-Host "Testing file restoration capability..."

# Test backup directory existence
$BackupDir = "backup/old-seo-system"
Test-Result "Backup directory exists" (Test-Path $BackupDir)

# Test backup file existence
$BackupFiles = @(
    "seo-optimizer.ts",
    "metadata-loader.ts",
    "base-integration.ts",
    "fallback-system.ts",
    "metadata-input.ts"
)

if (Test-Path $BackupDir) {
    $LatestBackup = Get-ChildItem $BackupDir | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($LatestBackup) {
        $BackupPath = Join-Path $BackupDir $LatestBackup.Name
        foreach ($file in $BackupFiles) {
            $BackupFilePath = Join-Path $BackupPath $file
            Test-Result "Backup exists for $file" (Test-Path $BackupFilePath)
        }
    }
    else {
        Write-Host "⚠️ No backup files found" -ForegroundColor Yellow
        foreach ($file in $BackupFiles) {
            Test-Result "Backup exists for $file" $false
        }
    }
}

Write-Host ""
Write-Host "Testing git rollback capability..."

# Test git availability
try {
    $null = Get-Command git -ErrorAction Stop
    Test-Result "Git is available" $true

    # Test if we're in a git repository
    $null = git rev-parse --git-dir 2>$null
    Test-Result "In git repository" ($LASTEXITCODE -eq 0)

    # Test git status
    $null = git status --porcelain 2>$null
    Test-Result "Can check git status" ($LASTEXITCODE -eq 0)

}
catch {
    Test-Result "Git is available" $false
    Test-Result "In git repository" $false
    Test-Result "Can check git status" $false
}

Write-Host ""
Write-Host "Testing build system integrity..."

# Test TypeScript compilation
Write-Host "Testing TypeScript compilation..." -ForegroundColor Yellow
try {
    $null = npx tsc --noEmit 2>$null
    Test-Result "TypeScript compilation" ($LASTEXITCODE -eq 0)
}
catch {
    Test-Result "TypeScript compilation" $false
}

# Test Astro build
Write-Host "Testing Astro build..." -ForegroundColor Yellow
try {
    $null = npm run build 2>$null
    Test-Result "Astro build" ($LASTEXITCODE -eq 0)
}
catch {
    Test-Result "Astro build" $false
}

Write-Host ""
Write-Host "=== ROLLBACK TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host "Total tests: $TotalTests"
Write-Host "Passed: $PassedTests"
Write-Host "Failed: $($TotalTests - $PassedTests)"

if ($PassedTests -eq $TotalTests) {
    Write-Host "🎉 All rollback tests passed!" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "⚠️ Some rollback tests failed. Please review." -ForegroundColor Red
    exit 1
}
