# PowerShell script to deploy GitHub Copilot Dashboard to Azure App Service
# This script handles the complete deployment process

param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "rg-ghcp-dashboard",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment = "prod",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("F1", "B1", "S1", "P1V2")]
    [string]$Sku = "B1"
)

# Enable strict mode
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "GitHub Copilot Dashboard - Azure Deployment Script" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is installed
Write-Host "Checking Azure CLI installation..." -ForegroundColor Yellow
if (!(Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Azure CLI is not installed!" -ForegroundColor Red
    Write-Host "Please install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Azure CLI found" -ForegroundColor Green

# Check if logged in to Azure
Write-Host "Checking Azure login status..." -ForegroundColor Yellow
$account = az account show 2>$null
if (!$account) {
    Write-Host "Not logged in to Azure. Please login..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Azure login failed!" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✓ Logged in to Azure" -ForegroundColor Green

# Display current subscription
$subscription = (az account show | ConvertFrom-Json)
Write-Host ""
Write-Host "Current Subscription:" -ForegroundColor Cyan
Write-Host "  Name: $($subscription.name)" -ForegroundColor White
Write-Host "  ID: $($subscription.id)" -ForegroundColor White
Write-Host ""

# Confirm deployment settings
Write-Host "Deployment Configuration:" -ForegroundColor Cyan
Write-Host "  Resource Group: $ResourceGroupName" -ForegroundColor White
Write-Host "  Location: $Location" -ForegroundColor White
Write-Host "  Environment: $Environment" -ForegroundColor White
Write-Host "  App Service SKU: $Sku" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Continue with deployment? (Y/N)"
if ($confirm -ne 'Y' -and $confirm -ne 'y') {
    Write-Host "Deployment cancelled by user." -ForegroundColor Yellow
    exit 0
}

# Step 1: Create Resource Group
Write-Host ""
Write-Host "Step 1: Creating Resource Group..." -ForegroundColor Yellow
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
    az group create --name $ResourceGroupName --location $Location
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create resource group!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Resource Group created: $ResourceGroupName" -ForegroundColor Green
} else {
    Write-Host "✓ Resource Group already exists: $ResourceGroupName" -ForegroundColor Green
}

# Step 2: Build the application
Write-Host ""
Write-Host "Step 2: Building the application..." -ForegroundColor Yellow
Push-Location ..
try {
    Write-Host "  Running npm install..." -ForegroundColor Gray
    npm install --silent
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    
    Write-Host "  Running npm build..." -ForegroundColor Gray
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "npm build failed"
    }
    
    Write-Host "✓ Application built successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Build failed - $_" -ForegroundColor Red
    Pop-Location
    exit 1
} finally {
    Pop-Location
}

# Step 3: Deploy infrastructure with Bicep
Write-Host ""
Write-Host "Step 3: Deploying Azure infrastructure..." -ForegroundColor Yellow

# Create a temporary parameters file with the current settings
$tempParamsFile = Join-Path $PSScriptRoot "deploy.parameters.temp.json"
@{
    '$schema' = "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#"
    contentVersion = "1.0.0.0"
    parameters = @{
        appName = @{ value = "ghcp-dashboard" }
        location = @{ value = $Location }
        environment = @{ value = $Environment }
        appServicePlanSku = @{ value = $Sku }
    }
} | ConvertTo-Json -Depth 10 | Set-Content $tempParamsFile

$bicepFile = Join-Path $PSScriptRoot "deploy.bicep"
$deploymentName = "ghcp-dashboard-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

az deployment group create `
    --name $deploymentName `
    --resource-group $ResourceGroupName `
    --template-file $bicepFile `
    --parameters $tempParamsFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Infrastructure deployment failed!" -ForegroundColor Red
    Remove-Item $tempParamsFile -ErrorAction SilentlyContinue
    exit 1
}

Remove-Item $tempParamsFile -ErrorAction SilentlyContinue
Write-Host "✓ Infrastructure deployed successfully" -ForegroundColor Green

# Get deployment outputs
$deployment = az deployment group show --name $deploymentName --resource-group $ResourceGroupName | ConvertFrom-Json
$appServiceName = $deployment.properties.outputs.appServiceName.value
$appServiceUrl = $deployment.properties.outputs.appServiceUrl.value

Write-Host ""
Write-Host "Deployment Outputs:" -ForegroundColor Cyan
Write-Host "  App Service Name: $appServiceName" -ForegroundColor White
Write-Host "  URL: $appServiceUrl" -ForegroundColor White

# Step 4: Create deployment package
Write-Host ""
Write-Host "Step 4: Creating deployment package..." -ForegroundColor Yellow
$distPath = Join-Path (Split-Path $PSScriptRoot) "dist"
$zipPath = Join-Path $PSScriptRoot "deploy.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Create package.json for Azure deployment
$packageJson = @{
    name = "ghcp-dashboard"
    version = "1.0.0"
    scripts = @{
        start = "pm2 serve dist --no-daemon --spa"
    }
    dependencies = @{
        pm2 = "^5.3.0"
    }
} | ConvertTo-Json -Depth 10

$tempDeployPath = Join-Path $PSScriptRoot "temp_deploy"
if (Test-Path $tempDeployPath) {
    Remove-Item $tempDeployPath -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDeployPath | Out-Null

# Copy dist folder
Copy-Item -Path $distPath -Destination (Join-Path $tempDeployPath "dist") -Recurse

# Create package.json
$packageJson | Set-Content (Join-Path $tempDeployPath "package.json")

# Create startup script
$startupScript = @"
#!/bin/bash
cd /home/site/wwwroot
npm install --production
pm2 serve dist --no-daemon --spa
"@
$startupScript | Set-Content (Join-Path $tempDeployPath "startup.sh")

# Create .deployment file
$deploymentConfig = @"
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
"@
$deploymentConfig | Set-Content (Join-Path $tempDeployPath ".deployment")

# Create zip
Compress-Archive -Path "$tempDeployPath\*" -DestinationPath $zipPath -Force
Remove-Item $tempDeployPath -Recurse -Force

Write-Host "✓ Deployment package created: $zipPath" -ForegroundColor Green

# Step 5: Deploy to App Service
Write-Host ""
Write-Host "Step 5: Deploying to App Service..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes..." -ForegroundColor Gray

az webapp deployment source config-zip `
    --resource-group $ResourceGroupName `
    --name $appServiceName `
    --src $zipPath

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Application deployment failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Application deployed successfully" -ForegroundColor Green

# Step 6: Configure App Service settings
Write-Host ""
Write-Host "Step 6: Configuring App Service..." -ForegroundColor Yellow

# Set startup command
az webapp config set `
    --resource-group $ResourceGroupName `
    --name $appServiceName `
    --startup-file "pm2 serve dist --no-daemon --spa"

Write-Host "✓ App Service configured" -ForegroundColor Green

# Cleanup
Remove-Item $zipPath -ErrorAction SilentlyContinue

# Final summary
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "Deployment Completed Successfully!" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your application is now running at:" -ForegroundColor Cyan
Write-Host "  $appServiceUrl" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Visit the URL above to access your dashboard" -ForegroundColor White
Write-Host "  2. Configure your GitHub API credentials in Admin Settings" -ForegroundColor White
Write-Host "  3. Download metrics data to populate the dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Management Commands:" -ForegroundColor Cyan
Write-Host "  View logs: az webapp log tail --name $appServiceName --resource-group $ResourceGroupName" -ForegroundColor White
Write-Host "  Restart app: az webapp restart --name $appServiceName --resource-group $ResourceGroupName" -ForegroundColor White
Write-Host "  Delete resources: az group delete --name $ResourceGroupName --yes" -ForegroundColor White
Write-Host ""
