import { TerraformStack } from 'cdktf'
import { StorageAccount, StorageContainer } from '@cdktf/provider-azurerm'
import { RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'

export class TerraformStorageContainer {
  static build(
    terraformStack: TerraformStack,
    appPrefix: string,
    rocketStorageAccount: StorageAccount,
    directory: string,
    utils: RocketUtils
  ): StorageContainer {
    const id = utils.toTerraformName(appPrefix, `rfsb${directory}`)
    return new StorageContainer(terraformStack, id, {
      name: directory,
      storageAccountName: rocketStorageAccount.name,
      containerAccessType: 'private',
    })
  }
}
