import { TerraformStack } from 'cdktf'
import { storageAccount, storageContainer } from '@cdktf/provider-azurerm'
import { RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { AzurermProvider } from '@cdktf/provider-azurerm/lib/provider'

export class TerraformStorageContainer {
  static build(
    providerResource: AzurermProvider,
    terraformStackResource: TerraformStack,
    appPrefix: string,
    rocketStorageAccountResource: storageAccount.StorageAccount,
    containerName: string,
    utils: RocketUtils
  ): storageContainer.StorageContainer {
    const id = utils.toTerraformName(rocketStorageAccountResource.name, `rfsb${containerName}`)
    return new storageContainer.StorageContainer(terraformStackResource, id, {
      name: containerName,
      storageAccountName: rocketStorageAccountResource.name,
      containerAccessType: 'private',
      provider: providerResource,
    })
  }
}
