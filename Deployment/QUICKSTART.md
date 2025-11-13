# Quick Start Guide - Deploy to Azure in 5 Minutes

## Prerequisites Check

Before starting, ensure you have:
- [ ] Azure CLI installed
- [ ] Active Azure subscription
- [ ] Logged into Azure CLI (`az login`)

## Option 1: One-Command Deployment (Windows)

```powershell
cd Deployment
.\deploy.ps1
```

**That's it!** The script will:
1. Create a resource group
2. Build your app
3. Deploy infrastructure
4. Deploy the application
5. Provide you with the URL

## Option 2: One-Command Deployment (Linux/Mac)

```bash
cd Deployment
chmod +x deploy.sh
./deploy.sh
```

## Option 3: Custom Deployment

### Windows (PowerShell)
```powershell
.\deploy.ps1 `
    -ResourceGroupName "my-dashboard-rg" `
    -Location "westus2" `
    -Environment "prod" `
    -Sku "S1"
```

### Linux/Mac (Bash)
```bash
./deploy.sh \
    --resource-group "my-dashboard-rg" \
    --location "westus2" \
    --environment "prod" \
    --sku "S1"
```

## After Deployment

### 1. Access Your Dashboard
The deployment script will output a URL like:
```
https://ghcp-dashboard-prod-abc123.azurewebsites.net
```

### 2. Configure GitHub API
1. Navigate to Admin Settings
2. Enter your GitHub Enterprise name
3. Add your Personal Access Token
4. Save configuration

### 3. Download Metrics
1. Click "Download Metrics" for enterprise data
2. Click "Download Seats" for user-level data
3. Navigate to dashboards to view visualizations

## Deployment Tiers

| Tier | Monthly Cost | Best For |
|------|--------------|----------|
| F1 (Free) | $0 | Testing only |
| **B1 (Basic)** | ~$13 | **Recommended starter** |
| S1 (Standard) | ~$70 | Production with auto-scale |
| P1V2 (Premium) | ~$150 | Enterprise deployments |

## Common Commands

### View logs
```bash
az webapp log tail --name <app-name> --resource-group rg-ghcp-dashboard
```

### Restart app
```bash
az webapp restart --name <app-name> --resource-group rg-ghcp-dashboard
```

### Delete everything
```bash
az group delete --name rg-ghcp-dashboard --yes
```

## Troubleshooting

### "Azure CLI not found"
Install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

### "Not logged in"
Run: `az login`

### "Build failed"
1. Run `npm install` manually
2. Run `npm run build` manually
3. Check for errors

### "404 on routes"
This is normal during first deployment. Wait 2-3 minutes for the app to fully start.

## Need Help?

See the full README.md in this folder for detailed documentation.

---

**Ready to deploy? Run the script and you'll be live in ~5 minutes! 🚀**
