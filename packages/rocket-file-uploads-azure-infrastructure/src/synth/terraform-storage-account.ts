import { TerraformStack } from 'cdktf'
import { resourceGroup, storageAccount } from '@cdktf/provider-azurerm'
import { RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'
import { azureStorageName } from '@boostercloud/rocket-file-uploads-types'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'

export class TerraformStorageAccount {
  static build(
    providerResource: AzurermProvider,
    terraformStackResource: TerraformStack,
    resourceGroupResource: resourceGroup.ResourceGroup,
    appPrefix: string,
    utils: RocketUtils,
    config: BoosterConfig,
    storageAccountNameParameter?: string
  ): storageAccount.StorageAccount {
    const id = utils.toTerraformName(appPrefix, `${storageAccountNameParameter}rfst`)
    const storageAccountName = azureStorageName(config.appName, config.environmentName, storageAccountNameParameter)
    return new storageAccount.StorageAccount(terraformStackResource, id, {
      name: storageAccountName,
      resourceGroupName: resourceGroupResource.name,
      location: resourceGroupResource.location,
      accountReplicationType: 'LRS',
      accountTier: 'Standard',
      provider: providerResource,
    })
  }
}
