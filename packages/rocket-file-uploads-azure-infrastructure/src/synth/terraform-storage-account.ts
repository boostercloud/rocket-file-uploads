import { TerraformStack } from 'cdktf'
import { ResourceGroup, StorageAccount } from '@cdktf/provider-azurerm'
import { RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'
import { azureStorageName } from '@boostercloud/rocket-file-uploads-types'

export class TerraformStorageAccount {
  static build(
    terraformStack: TerraformStack,
    resourceGroup: ResourceGroup,
    appPrefix: string,
    utils: RocketUtils,
    config: BoosterConfig,
    storageAccountNameParameter?: string
  ): StorageAccount {
    const id = utils.toTerraformName(appPrefix, 'rfst')
    const storageAccountName = azureStorageName(config.appName, config.environmentName, storageAccountNameParameter)
    return new StorageAccount(terraformStack, id, {
      name: storageAccountName,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountReplicationType: 'LRS',
      accountTier: 'Standard',
    })
  }
}
