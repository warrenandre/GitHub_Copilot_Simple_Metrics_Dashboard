# Azure Developer CLI (azd) Deployment Guide

## Prerequisites

Install Azure Developer CLI:

### Windows (PowerShell)
```powershell
winget install microsoft.azd
```

### macOS
```bash
brew tap azure/azd && brew install azd
```

### Linux
```bash
curl -fsSL https://aka.ms/install-azd.sh | bash
```

## One-Command Deployment

### First Time Deployment

```bash
azd up
```

This single command will:
1. ✅ Prompt you to login to Azure
2. ✅ Ask you to select a subscription
3. ✅ Ask for an environment name (e.g., "dev", "prod")
4. ✅ Ask for a location (e.g., "eastus", "westus2")
5. ✅ Build your application
6. ✅ Create all Azure resources
7. ✅ Deploy your application
8. ✅ Provide you with the URL

### Subsequent Deployments

After the first deployment, simply run:

```bash
azd deploy
```

This will redeploy your application without recreating infrastructure.

## Common Commands

### Initialize a new environment
```bash
azd init
```

### Provision infrastructure only
```bash
azd provision
```

### Deploy code only (without provisioning)
```bash
azd deploy
```

### Monitor your application
```bash
azd monitor
```

### View environment configuration
```bash
azd env list
azd env get-values
```

### Clean up all resources
```bash
azd down
```

## Environment Variables

You can set environment variables that will be available in your deployment:

```bash
azd env set VARIABLE_NAME "value"
```

View all environment variables:
```bash
azd env get-values
```

## Multiple Environments

Create different environments for dev/staging/prod:

```bash
# Create dev environment
azd env new dev
azd up

# Create prod environment
azd env new prod
azd up

# Switch between environments
azd env select dev
azd deploy
```

## Advanced Configuration

### Custom Resource Names

Edit `.azure/<env-name>/.env` file:
```bash
AZURE_LOCATION=eastus
AZURE_ENV_NAME=my-custom-name
```

### Change App Service SKU

The default SKU is B1. To use a different tier, update `infra/resources/appservice.bicep`:

```bicep
param sku string = 'S1'  // Change to F1, B1, B2, S1, or P1V2
```

## What Gets Created

When you run `azd up`, the following resources are created:

- **Resource Group**: `rg-<environment-name>`
- **App Service Plan**: `plan-<environment-name>` (Linux, B1)
- **App Service**: `app-<environment-name>` (Node.js 20 LTS)

## Cost Estimation

| SKU | Approximate Monthly Cost |
|-----|--------------------------|
| F1  | Free                    |
| B1  | ~$13/month              |
| B2  | ~$26/month              |
| S1  | ~$70/month              |
| P1V2| ~$150/month             |

## Troubleshooting

### "azd: command not found"
Install Azure Developer CLI using the commands above.

### "No subscription found"
```bash
az login
azd auth login
```

### View deployment logs
```bash
azd monitor --logs
```

### Reset environment
```bash
azd down
azd up
```

## GitHub Actions Integration

To set up CI/CD with GitHub Actions:

```bash
azd pipeline config
```

This will:
1. Create a service principal
2. Configure GitHub secrets
3. Set up a deployment workflow

## Tips

1. **Use consistent naming**: Choose an environment name you'll remember (e.g., "prod", "dev")
2. **Select the right location**: Choose a region close to your users
3. **Start with B1**: It's the cheapest tier with all features
4. **Use `azd deploy` for updates**: Much faster than `azd up`
5. **Clean up when testing**: Use `azd down` to delete resources and avoid charges

## Next Steps After Deployment

1. Visit the URL provided by `azd up`
2. Go to Admin Settings
3. Enter your GitHub credentials
4. Start downloading metrics!

---

**That's it! One command to deploy everything! 🚀**
