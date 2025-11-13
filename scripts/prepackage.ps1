#!/usr/bin/env pwsh
# Azure Developer CLI pre-package hook for building the application

Write-Host "Building GitHub Copilot Dashboard..." -ForegroundColor Cyan

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build application" -ForegroundColor Red
    exit 1
}

# Prepare deployment package
Write-Host "Preparing deployment package..." -ForegroundColor Yellow

# Create a temporary directory for deployment
$deployDir = ".azd-deploy"
if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy dist folder
Copy-Item -Path "dist" -Destination "$deployDir/dist" -Recurse

# Create package.json for deployment
$packageJson = @{
    name = "ghcp-dashboard"
    version = "1.0.0"
    scripts = @{
        start = "npx serve dist -l 8080 --single"
    }
    dependencies = @{
        serve = "^14.2.1"
    }
    engines = @{
        node = ">=18.0.0"
    }
} | ConvertTo-Json -Depth 10

$packageJson | Set-Content "$deployDir/package.json"

# Create web.config for Azure
$webConfig = @"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <remove fileExtension=".json"/>
      <mimeMap fileExtension=".json" mimeType="application/json"/>
    </staticContent>
  </system.webServer>
</configuration>
"@

$webConfig | Set-Content "$deployDir/web.config"

Write-Host "✓ Build completed successfully!" -ForegroundColor Green
Write-Host "Deployment package ready in: $deployDir" -ForegroundColor Cyan
