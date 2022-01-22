import { TerraformStack } from 'cdktf'
import { ResourceGroup, StorageAccount } from '@cdktf/provider-azurerm'
import { RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { storageName } from '@boostercloud/rocket-files-types'
import { BoosterConfig } from '@boostercloud/framework-types'

export class TerraformStorageAccount {
  static build(
    terraformStack: TerraformStack,
    resourceGroup: ResourceGroup,
    appPrefix: string,
    utils: RocketUtils,
    config: BoosterConfig
  ): StorageAccount {
    const id = utils.toTerraformName(appPrefix, 'rfst')
    return new StorageAccount(terraformStack, id, {
      name: storageName(config.appName),
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountReplicationType: 'LRS',
      accountTier: 'Standard',
    })
  }
}
