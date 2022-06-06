import { BoosterConfig } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { containerName, RocketFilesParams } from '@boostercloud/rocket-file-uploads-types'
import { TerraformFunctionApp } from './terraform-function-app'
import { TerraformStorageAccount } from './terraform-storage-account'
import { TerraformStorageContainer } from './terraform-storage-container'

export class Synth {
  public static mountStack(
    params: RocketFilesParams,
    config: BoosterConfig,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils
  ): ApplicationSynthStack {
    const appPrefix = applicationSynthStack.appPrefix
    const terraformStack = applicationSynthStack.terraformStack
    const resourceGroup = applicationSynthStack.resourceGroup!
    const rocketStack = applicationSynthStack.rocketStack ?? []

    const rocketStorage = TerraformStorageAccount.build(terraformStack, resourceGroup, appPrefix, utils, config)

    applicationSynthStack.functionApp!.addOverride('app_settings', {
      ROCKET_STORAGE_KEY: `${rocketStorage.primaryAccessKey}`,
    })

    const blobContainer = TerraformStorageContainer.build(
      terraformStack,
      appPrefix,
      rocketStorage,
      containerName,
      utils
    )
    rocketStack.push(blobContainer)

    const functionApp = TerraformFunctionApp.build(terraformStack, applicationSynthStack, config, utils, rocketStorage)
    rocketStack.push(functionApp)
    rocketStack.push(rocketStorage)

    return applicationSynthStack
  }
}
