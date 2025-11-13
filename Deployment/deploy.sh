#!/bin/bash
# Bash script to deploy GitHub Copilot Dashboard to Azure App Service
# This script handles the complete deployment process

set -e

# Default values
RESOURCE_GROUP="rg-ghcp-dashboard"
LOCATION="eastus"
ENVIRONMENT="prod"
SKU="B1"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --resource-group)
            RESOURCE_GROUP="$2"
            shift 2
            ;;
        --location)
            LOCATION="$2"
            shift 2
            ;;
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --sku)
            SKU="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "====================================================="
echo "GitHub Copilot Dashboard - Azure Deployment Script"
echo "====================================================="
echo ""

# Check if Azure CLI is installed
echo "Checking Azure CLI installation..."
if ! command -v az &> /dev/null; then
    echo "ERROR: Azure CLI is not installed!"
    echo "Please install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi
echo "✓ Azure CLI found"

# Check if logged in to Azure
echo "Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "Not logged in to Azure. Please login..."
    az login
fi
echo "✓ Logged in to Azure"

# Display current subscription
SUBSCRIPTION=$(az account show --query "{name:name, id:id}" -o json)
echo ""
echo "Current Subscription:"
echo "$SUBSCRIPTION" | jq -r '"  Name: \(.name)\n  ID: \(.id)"'
echo ""

# Confirm deployment settings
echo "Deployment Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  Environment: $ENVIRONMENT"
echo "  App Service SKU: $SKU"
echo ""

read -p "Continue with deployment? (Y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled by user."
    exit 0
fi

# Step 1: Create Resource Group
echo ""
echo "Step 1: Creating Resource Group..."
if az group exists --name "$RESOURCE_GROUP" | grep -q "false"; then
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
    echo "✓ Resource Group created: $RESOURCE_GROUP"
else
    echo "✓ Resource Group already exists: $RESOURCE_GROUP"
fi

# Step 2: Build the application
echo ""
echo "Step 2: Building the application..."
cd "$(dirname "$0")/.."

echo "  Running npm install..."
npm install --silent

echo "  Running npm build..."
npm run build

echo "✓ Application built successfully"

# Step 3: Deploy infrastructure with Bicep
echo ""
echo "Step 3: Deploying Azure infrastructure..."

DEPLOYMENT_NAME="ghcp-dashboard-$(date +%Y%m%d-%H%M%S)"
BICEP_FILE="$(dirname "$0")/deploy.bicep"

# Create temporary parameters file
TEMP_PARAMS=$(mktemp)
cat > "$TEMP_PARAMS" <<EOF
{
  "\$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "appName": { "value": "ghcp-dashboard" },
    "location": { "value": "$LOCATION" },
    "environment": { "value": "$ENVIRONMENT" },
    "appServicePlanSku": { "value": "$SKU" }
  }
}
EOF

az deployment group create \
    --name "$DEPLOYMENT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --template-file "$BICEP_FILE" \
    --parameters "$TEMP_PARAMS"

rm "$TEMP_PARAMS"
echo "✓ Infrastructure deployed successfully"

# Get deployment outputs
APP_SERVICE_NAME=$(az deployment group show --name "$DEPLOYMENT_NAME" --resource-group "$RESOURCE_GROUP" --query "properties.outputs.appServiceName.value" -o tsv)
APP_SERVICE_URL=$(az deployment group show --name "$DEPLOYMENT_NAME" --resource-group "$RESOURCE_GROUP" --query "properties.outputs.appServiceUrl.value" -o tsv)

echo ""
echo "Deployment Outputs:"
echo "  App Service Name: $APP_SERVICE_NAME"
echo "  URL: $APP_SERVICE_URL"

# Step 4: Create deployment package
echo ""
echo "Step 4: Creating deployment package..."

SCRIPT_DIR="$(dirname "$0")"
DIST_PATH="$(dirname "$0")/../dist"
ZIP_PATH="$SCRIPT_DIR/deploy.zip"
TEMP_DEPLOY="$SCRIPT_DIR/temp_deploy"

rm -rf "$ZIP_PATH" "$TEMP_DEPLOY"
mkdir -p "$TEMP_DEPLOY"

# Copy dist folder
cp -r "$DIST_PATH" "$TEMP_DEPLOY/dist"

# Create package.json
cat > "$TEMP_DEPLOY/package.json" <<EOF
{
  "name": "ghcp-dashboard",
  "version": "1.0.0",
  "scripts": {
    "start": "pm2 serve dist --no-daemon --spa"
  },
  "dependencies": {
    "pm2": "^5.3.0"
  }
}
EOF

# Create startup script
cat > "$TEMP_DEPLOY/startup.sh" <<'EOF'
#!/bin/bash
cd /home/site/wwwroot
npm install --production
pm2 serve dist --no-daemon --spa
EOF

chmod +x "$TEMP_DEPLOY/startup.sh"

# Create .deployment file
cat > "$TEMP_DEPLOY/.deployment" <<EOF
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
EOF

# Create zip
cd "$TEMP_DEPLOY"
zip -r "$ZIP_PATH" . > /dev/null
cd - > /dev/null

rm -rf "$TEMP_DEPLOY"
echo "✓ Deployment package created: $ZIP_PATH"

# Step 5: Deploy to App Service
echo ""
echo "Step 5: Deploying to App Service..."
echo "  This may take a few minutes..."

az webapp deployment source config-zip \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_SERVICE_NAME" \
    --src "$ZIP_PATH"

echo "✓ Application deployed successfully"

# Step 6: Configure App Service settings
echo ""
echo "Step 6: Configuring App Service..."

az webapp config set \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_SERVICE_NAME" \
    --startup-file "pm2 serve dist --no-daemon --spa"

echo "✓ App Service configured"

# Cleanup
rm -f "$ZIP_PATH"

# Final summary
echo ""
echo "====================================================="
echo "Deployment Completed Successfully!"
echo "====================================================="
echo ""
echo "Your application is now running at:"
echo "  $APP_SERVICE_URL"
echo ""
echo "Next Steps:"
echo "  1. Visit the URL above to access your dashboard"
echo "  2. Configure your GitHub API credentials in Admin Settings"
echo "  3. Download metrics data to populate the dashboard"
echo ""
echo "Management Commands:"
echo "  View logs: az webapp log tail --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP"
echo "  Restart app: az webapp restart --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP"
echo "  Delete resources: az group delete --name $RESOURCE_GROUP --yes"
echo ""
