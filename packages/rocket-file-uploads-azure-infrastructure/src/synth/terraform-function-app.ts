import { TerraformStack } from 'cdktf'
import { FunctionApp } from '@cdktf/provider-azurerm'
import { BoosterConfig } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { getFunctionAppName } from '../helper'
import { functionID } from '@boostercloud/rocket-file-uploads-types'

export class TerraformFunctionApp {
  static build(
    terraformStack: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    config: BoosterConfig,
    utils: RocketUtils,
    accountConnections: Record<string, string>
  ): FunctionApp {
    const resourceGroup = applicationSynthStack.resourceGroup!
    const applicationServicePlan = applicationSynthStack.applicationServicePlan!
    const storageAccount = applicationSynthStack.storageAccount!
    const cosmosDatabaseName = applicationSynthStack.cosmosdbDatabase?.name
    const apiManagementServiceName = applicationSynthStack.apiManagementName
    const cosmosDbConnectionString = applicationSynthStack.cosmosdbDatabase?.primaryKey
    const functionAppName = getFunctionAppName(applicationSynthStack)

    const id = utils.toTerraformName(applicationSynthStack.appPrefix, 'rffunc')
    return new FunctionApp(terraformStack, id, {
      name: functionAppName,
      location: resourceGroup.location,
      resourceGroupName: resourceGroup.name,
      appServicePlanId: applicationServicePlan.id,
      appSettings: {
        FUNCTIONS_WORKER_RUNTIME: 'node',
        AzureWebJobsStorage: storageAccount.primaryConnectionString,
        WEBSITE_CONTENTAZUREFILECONNECTIONSTRING: storageAccount.primaryConnectionString,
        WEBSITE_RUN_FROM_PACKAGE: '',
        WEBSITE_CONTENTSHARE: id,
        WEBSITE_NODE_DEFAULT_VERSION: '~14',
        ...config.env,
        BOOSTER_ENV: config.environmentName,
        BOOSTER_REST_API_URL: `https://${apiManagementServiceName}.azure-api.net/${config.environmentName}`,
        COSMOSDB_CONNECTION_STRING: `AccountEndpoint=https://${cosmosDatabaseName}.documents.azure.com:443/;AccountKey=${cosmosDbConnectionString};`,
        BOOSTER_ROCKET_FUNCTION_ID: functionID,
        ...accountConnections,
      },
      osType: 'linux',
      storageAccountName: storageAccount.name,
      storageAccountAccessKey: storageAccount.primaryAccessKey,
      version: '~3',
      dependsOn: [resourceGroup],
      lifecycle: {
        ignoreChanges: ['app_settings["WEBSITE_RUN_FROM_PACKAGE"]'],
      },
      identity: {
        type: 'SystemAssigned',
      },
    })
  }
}
