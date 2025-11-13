// Azure Bicep template for deploying GitHub Copilot Metrics Dashboard
// This creates an App Service Plan and App Service to host the React application

@description('Name of the application')
param appName string = 'ghcp-dashboard'

@description('Location for all resources')
param location string = resourceGroup().location

@description('Environment (dev, staging, prod)')
@allowed([
  'dev'
  'staging'
  'prod'
])
param environment string = 'prod'

@description('SKU for App Service Plan')
@allowed([
  'F1'  // Free
  'B1'  // Basic
  'S1'  // Standard
  'P1V2' // Premium V2
])
param appServicePlanSku string = 'B1'

// Variables
var appServicePlanName = '${appName}-plan-${environment}'
var appServiceName = '${appName}-${environment}-${uniqueString(resourceGroup().id)}'
var linuxFxVersion = 'NODE|20-lts'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: appServicePlanSku
  }
  properties: {
    reserved: true // Required for Linux
  }
  tags: {
    Environment: environment
    Application: 'GitHub Copilot Dashboard'
  }
}

// App Service
resource appService 'Microsoft.Web/sites@2023-01-01' = {
  name: appServiceName
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: linuxFxVersion
      alwaysOn: appServicePlanSku != 'F1' // Always On not available on Free tier
      http20Enabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
      appCommandLine: 'pm2 serve /home/site/wwwroot/dist --no-daemon --spa'
    }
    clientAffinityEnabled: false
  }
  tags: {
    Environment: environment
    Application: 'GitHub Copilot Dashboard'
  }
}

// App Service configuration for SPA routing
resource appServiceConfig 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: appService
  name: 'web'
  properties: {
    defaultDocuments: [
      'index.html'
    ]
  }
}

// Outputs
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output appServiceName string = appService.name
output appServicePlanName string = appServicePlan.name
output resourceGroupName string = resourceGroup().name
