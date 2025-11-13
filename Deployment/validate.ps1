# Pre-deployment validation script
# Checks if all prerequisites are met before deploying

param(
    [switch]$Fix
)

$ErrorActionPreference = "Continue"
$allGood = $true

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Pre-Deployment Validation" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Azure CLI
Write-Host "[1/6] Checking Azure CLI..." -ForegroundColor Yellow
if (Get-Command az -ErrorAction SilentlyContinue) {
    $azVersion = (az version --output json | ConvertFrom-Json).'azure-cli'
    Write-Host "  ✓ Azure CLI installed (version $azVersion)" -ForegroundColor Green
} else {
    Write-Host "  ✗ Azure CLI not found!" -ForegroundColor Red
    Write-Host "    Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    $allGood = $false
}

# Check 2: Azure Login
Write-Host "[2/6] Checking Azure login..." -ForegroundColor Yellow
$account = az account show 2>$null
if ($account) {
    $subscription = ($account | ConvertFrom-Json)
    Write-Host "  ✓ Logged in to Azure" -ForegroundColor Green
    Write-Host "    Subscription: $($subscription.name)" -ForegroundColor Gray
} else {
    Write-Host "  ✗ Not logged in to Azure!" -ForegroundColor Red
    if ($Fix) {
        Write-Host "    Attempting to login..." -ForegroundColor Yellow
        az login
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Successfully logged in!" -ForegroundColor Green
        } else {
            $allGood = $false
        }
    } else {
        Write-Host "    Run: az login" -ForegroundColor Yellow
        $allGood = $false
    }
}

# Check 3: Node.js
Write-Host "[3/6] Checking Node.js..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -ge 18) {
        Write-Host "  ✓ Node.js installed ($nodeVersion)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Node.js version too old ($nodeVersion, need 18+)" -ForegroundColor Yellow
        Write-Host "    Update from: https://nodejs.org/" -ForegroundColor Yellow
        $allGood = $false
    }
} else {
    Write-Host "  ✗ Node.js not found!" -ForegroundColor Red
    Write-Host "    Install from: https://nodejs.org/" -ForegroundColor Yellow
    $allGood = $false
}

# Check 4: npm
Write-Host "[4/6] Checking npm..." -ForegroundColor Yellow
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = npm --version
    Write-Host "  ✓ npm installed (version $npmVersion)" -ForegroundColor Green
} else {
    Write-Host "  ✗ npm not found!" -ForegroundColor Red
    $allGood = $false
}

# Check 5: Project structure
Write-Host "[5/6] Checking project structure..." -ForegroundColor Yellow
$projectRoot = Split-Path $PSScriptRoot
$requiredFiles = @(
    "package.json",
    "src/App.tsx",
    "index.html",
    "vite.config.ts"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    $filePath = Join-Path $projectRoot $file
    if (!(Test-Path $filePath)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "  ✓ All required files present" -ForegroundColor Green
} else {
    Write-Host "  ✗ Missing files:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
    $allGood = $false
}

# Check 6: Dependencies
Write-Host "[6/6] Checking dependencies..." -ForegroundColor Yellow
$nodeModulesPath = Join-Path $projectRoot "node_modules"
if (Test-Path $nodeModulesPath) {
    Write-Host "  ✓ node_modules found" -ForegroundColor Green
} else {
    Write-Host "  ⚠ node_modules not found" -ForegroundColor Yellow
    if ($Fix) {
        Write-Host "    Running npm install..." -ForegroundColor Yellow
        Push-Location $projectRoot
        npm install
        Pop-Location
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Dependencies installed!" -ForegroundColor Green
        } else {
            $allGood = $false
        }
    } else {
        Write-Host "    Run: npm install" -ForegroundColor Yellow
    }
}

# Summary
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✓ All checks passed! Ready to deploy." -ForegroundColor Green
    Write-Host "=====================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Run the deployment:" -ForegroundColor Cyan
    Write-Host "  .\deploy.ps1" -ForegroundColor White
} else {
    Write-Host "✗ Some checks failed. Please fix the issues above." -ForegroundColor Red
    Write-Host "=====================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "To automatically fix some issues, run:" -ForegroundColor Yellow
    Write-Host "  .\validate.ps1 -Fix" -ForegroundColor White
    exit 1
}
Write-Host ""
