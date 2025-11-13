param name string
param location string = resourceGroup().location
param tags object = {}

param appServicePlanName string
param runtimeName string
param runtimeVersion string
param appCommandLine string = ''

@allowed([
  'F1'
  'B1'
  'B2'
  'S1'
  'P1V2'
])
param sku string = 'B1'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  tags: tags
  sku: {
    name: sku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// App Service
resource appService 'Microsoft.Web/sites@2023-01-01' = {
  name: name
  location: location
  tags: union(tags, { 'azd-service-name': 'web' })
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: '${runtimeName}|${runtimeVersion}'
      alwaysOn: sku != 'F1'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      appCommandLine: appCommandLine
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
      ]
    }
    clientAffinityEnabled: false
  }
}

// Configure web app for SPA
resource webConfig 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: appService
  name: 'web'
  properties: {
    defaultDocuments: [
      'index.html'
    ]
  }
}

output name string = appService.name
output uri string = 'https://${appService.properties.defaultHostName}'
output id string = appService.id
