import { TerraformStack } from 'cdktf'
import { windowsFunctionApp } from '@cdktf/provider-azurerm'
import { BoosterConfig } from '@boostercloud/framework-types'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'

import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { getFunctionAppName } from '../helper'
import { functionID } from '@boostercloud/rocket-file-uploads-types'

export class TerraformFunctionApp {
  static build(
    providerResource: AzurermProvider,
    terraformStackResource: TerraformStack,
    applicationSynthStack: ApplicationSynthStack,
    config: BoosterConfig,
    utils: RocketUtils,
    accountConnections: Record<string, string>
  ): windowsFunctionApp.WindowsFunctionApp {
    const resourceGroupResource = applicationSynthStack.resourceGroup!
    const applicationServicePlan = applicationSynthStack.applicationServicePlan!
    const storageAccount = applicationSynthStack.storageAccount!
    const cosmosDatabaseName = applicationSynthStack.cosmosdbDatabase?.name
    const cosmosDbConnectionString = applicationSynthStack.cosmosdbDatabase?.primaryKey
    const functionAppName = getFunctionAppName(applicationSynthStack)

    const id = utils.toTerraformName(applicationSynthStack.appPrefix, 'rffunc')
    return new windowsFunctionApp.WindowsFunctionApp(terraformStackResource, id, {
      name: functionAppName,
      location: resourceGroupResource.location,
      resourceGroupName: resourceGroupResource.name,
      servicePlanId: applicationServicePlan.id,
      appSettings: {
        WEBSITE_RUN_FROM_PACKAGE: '1',
        WEBSITE_CONTENTSHARE: id,
        ...config.env,
        BOOSTER_ENV: config.environmentName,
        COSMOSDB_CONNECTION_STRING: `AccountEndpoint=https://${cosmosDatabaseName}.documents.azure.com:443/;AccountKey=${cosmosDbConnectionString};`,
        BOOSTER_ROCKET_FUNCTION_ID: functionID,
        ...accountConnections,
      },
      storageAccountName: storageAccount.name,
      storageAccountAccessKey: storageAccount.primaryAccessKey,
      dependsOn: [resourceGroupResource],
      lifecycle: {
        ignoreChanges: ['app_settings["WEBSITE_RUN_FROM_PACKAGE"]'],
      },
      provider: providerResource,
      siteConfig: {
        applicationStack: {
          nodeVersion: '~20',
        },
      },
      functionsExtensionVersion: '~4', // keep it on version 3. Version 4 needs a migration process
      identity: {
        type: 'SystemAssigned',
      },
    })
  }
}
