import { TerraformStack } from 'cdktf'
import { StorageAccount, StorageContainer } from '@cdktf/provider-azurerm'
import { RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'

export class TerraformStorageContainer {
  static build(
    terraformStack: TerraformStack,
    appPrefix: string,
    rocketStorageAccount: StorageAccount,
    containerName: string,
    utils: RocketUtils
  ): StorageContainer {
    const id = utils.toTerraformName(rocketStorageAccount.name, `rfsb${containerName}`)
    return new StorageContainer(terraformStack, id, {
      name: containerName,
      storageAccountName: rocketStorageAccount.name,
      containerAccessType: 'private',
    })
  }
}
