#!/bin/bash
# Azure Developer CLI pre-package hook for building the application

set -e

echo "Building GitHub Copilot Dashboard..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Prepare deployment package
echo "Preparing deployment package..."

# Create a temporary directory for deployment
DEPLOY_DIR=".azd-deploy"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy dist folder
cp -r dist "$DEPLOY_DIR/"

# Create package.json for deployment
cat > "$DEPLOY_DIR/package.json" <<'EOF'
{
  "name": "ghcp-dashboard",
  "version": "1.0.0",
  "scripts": {
    "start": "npx serve dist -l 8080 --single"
  },
  "dependencies": {
    "serve": "^14.2.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

# Create web.config for Azure
cat > "$DEPLOY_DIR/web.config" <<'EOF'
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
EOF

echo "✓ Build completed successfully!"
echo "Deployment package ready in: $DEPLOY_DIR"
