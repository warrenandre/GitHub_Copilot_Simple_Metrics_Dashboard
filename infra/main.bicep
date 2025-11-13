targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Id of the user or app to assign application roles')
param principalId string = ''

// Tags that should be applied to all resources.
var tags = {
  'azd-env-name': environmentName
  Application: 'GitHub Copilot Dashboard'
}

// Organize resources in a resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

// App Service Plan and App Service
module appService './resources/appservice.bicep' = {
  name: 'appservice'
  scope: rg
  params: {
    name: 'app-${environmentName}'
    location: location
    tags: tags
    appServicePlanName: 'plan-${environmentName}'
    runtimeName: 'node'
    runtimeVersion: '20-lts'
  }
}

// Output the app service URL
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output APP_SERVICE_URL string = appService.outputs.uri
output APP_SERVICE_NAME string = appService.outputs.name
