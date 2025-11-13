# GitHub Copilot Dashboard - Azure Deployment Guide

This folder contains all the necessary files to deploy the GitHub Copilot Metrics Dashboard to Azure App Service.

## 📋 Prerequisites

- **Azure CLI**: [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- **Azure Subscription**: Active Azure subscription
- **Node.js**: Version 18 or higher (for building the app)
- **PowerShell 7+** (for Windows) or **Bash** (for Linux/Mac)

## 📁 Files Included

- **deploy.bicep**: Azure Bicep infrastructure-as-code template
- **deploy.parameters.json**: Default deployment parameters
- **deploy.ps1**: PowerShell deployment script (Windows)
- **deploy.sh**: Bash deployment script (Linux/Mac)
- **README.md**: This file

## 🚀 Quick Start

### Windows (PowerShell)

```powershell
# Navigate to the Deployment folder
cd Deployment

# Run the deployment script
.\deploy.ps1
```

### Linux/Mac (Bash)

```bash
# Navigate to the Deployment folder
cd Deployment

# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

## ⚙️ Deployment Options

### PowerShell Parameters

```powershell
.\deploy.ps1 `
    -ResourceGroupName "rg-ghcp-dashboard" `
    -Location "eastus" `
    -Environment "prod" `
    -Sku "B1"
```

### Bash Parameters

```bash
./deploy.sh \
    --resource-group "rg-ghcp-dashboard" \
    --location "eastus" \
    --environment "prod" \
    --sku "B1"
```

### Available Parameters

| Parameter | Description | Default | Options |
|-----------|-------------|---------|---------|
| ResourceGroupName | Azure resource group name | `rg-ghcp-dashboard` | Any valid name |
| Location | Azure region | `eastus` | Any Azure region |
| Environment | Deployment environment | `prod` | `dev`, `staging`, `prod` |
| Sku | App Service plan tier | `B1` | `F1`, `B1`, `S1`, `P1V2` |

### SKU Tiers

- **F1 (Free)**: For development/testing only
  - Limited compute resources
  - No Always On feature
  - No custom domains
  - Best for: Testing

- **B1 (Basic)**: For low-traffic production apps
  - Dedicated compute
  - Custom domains
  - SSL support
  - Best for: Small deployments

- **S1 (Standard)**: For production apps
  - Auto-scaling
  - Staging slots
  - Daily backups
  - Best for: Production deployments

- **P1V2 (Premium)**: For high-traffic apps
  - Enhanced performance
  - More instances
  - Additional features
  - Best for: Enterprise deployments

## 📝 What the Script Does

1. **Validates Prerequisites**
   - Checks Azure CLI installation
   - Verifies Azure login status

2. **Creates Resource Group**
   - Creates a new resource group (if it doesn't exist)

3. **Builds the Application**
   - Runs `npm install`
   - Runs `npm run build`
   - Creates production-ready dist folder

4. **Deploys Infrastructure**
   - Uses Bicep template to create:
     - App Service Plan (Linux)
     - App Service (Node.js 20)
   - Configures HTTPS, TLS 1.2, and security settings

5. **Creates Deployment Package**
   - Packages the built application
   - Includes package.json with pm2 for serving
   - Creates startup scripts

6. **Deploys to App Service**
   - Uploads the package
   - Configures the app to serve as SPA
   - Sets up routing for React Router

7. **Outputs Deployment Info**
   - Provides the application URL
   - Lists management commands

## 🔧 Manual Deployment (Azure Portal)

If you prefer to use the Azure Portal:

1. **Create App Service**
   - Go to Azure Portal
   - Create a new Web App
   - Choose Linux as OS
   - Select Node 20 LTS runtime

2. **Build the Application**
   ```bash
   npm install
   npm run build
   ```

3. **Deploy via ZIP**
   - Create a zip of the `dist` folder
   - Go to App Service → Deployment Center
   - Upload the zip file

4. **Configure Startup Command**
   - Go to Configuration → General Settings
   - Set Startup Command: `npx serve -s dist -l 8080`

## 🌐 Post-Deployment

After deployment completes:

1. **Access the Application**
   - Visit the URL provided in the output
   - Example: `https://ghcp-dashboard-prod-abc123.azurewebsites.net`

2. **Configure Admin Settings**
   - Navigate to Admin Settings page
   - Enter your GitHub Enterprise name
   - Add your Personal Access Token
   - Set date ranges as needed

3. **Download Metrics**
   - Use the download buttons to fetch data
   - Data is stored in browser localStorage

## 📊 Monitoring & Management

### View Application Logs

```bash
az webapp log tail \
    --name <app-service-name> \
    --resource-group rg-ghcp-dashboard
```

### Restart Application

```bash
az webapp restart \
    --name <app-service-name> \
    --resource-group rg-ghcp-dashboard
```

### View Configuration

```bash
az webapp config show \
    --name <app-service-name> \
    --resource-group rg-ghcp-dashboard
```

### Scale the App

```bash
az appservice plan update \
    --name <app-service-plan-name> \
    --resource-group rg-ghcp-dashboard \
    --sku S1
```

## 🔒 Security Considerations

1. **HTTPS Only**: The deployment enforces HTTPS
2. **TLS 1.2**: Minimum TLS version is set to 1.2
3. **FTPS Disabled**: Only secure deployment methods allowed
4. **Environment Variables**: Store sensitive data in App Settings, not code

### Adding App Settings

```bash
az webapp config appsettings set \
    --name <app-service-name> \
    --resource-group rg-ghcp-dashboard \
    --settings KEY1=VALUE1 KEY2=VALUE2
```

## 🗑️ Cleanup

To delete all deployed resources:

```bash
az group delete \
    --name rg-ghcp-dashboard \
    --yes \
    --no-wait
```

## 🐛 Troubleshooting

### Application Not Loading

1. Check deployment status:
   ```bash
   az webapp deployment list-publishing-credentials \
       --name <app-service-name> \
       --resource-group rg-ghcp-dashboard
   ```

2. View recent logs:
   ```bash
   az webapp log tail \
       --name <app-service-name> \
       --resource-group rg-ghcp-dashboard
   ```

### 404 Errors on Routes

- Ensure startup command is set to serve as SPA
- Verify `appCommandLine` in deploy.bicep
- Check that dist folder contains index.html

### Build Failures

- Ensure Node.js version 18+ is installed locally
- Run `npm install` and `npm run build` manually to check for errors
- Check package.json for any missing dependencies

## 💰 Cost Estimation

**Free Tier (F1)**
- Cost: $0/month
- Limitations: Shared compute, 60 min/day

**Basic Tier (B1)**
- Cost: ~$13/month
- Recommended for small deployments

**Standard Tier (S1)**
- Cost: ~$70/month
- Recommended for production

**Premium Tier (P1V2)**
- Cost: ~$150/month
- For enterprise deployments

*Prices are approximate and may vary by region*

## 📚 Additional Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [GitHub Copilot Metrics API](https://docs.github.com/en/rest/copilot/copilot-metrics)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Azure App Service logs
3. Verify GitHub API credentials and permissions

---

**Developed by Warren Joubert - Microsoft Software Engineer**
