import { BoosterConfig } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { TerraformFunctionApp } from './terraform-function-app'
import { TerraformStorageAccount } from './terraform-storage-account'
import { TerraformStorageContainer } from './terraform-storage-container'
import { TerraformRoleAssignment } from './terraform-role-assignment'

export class Synth {
  public static mountStack(
    configuration: RocketFilesConfiguration,
    config: BoosterConfig,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils
  ): ApplicationSynthStack {
    const appPrefix = applicationSynthStack.appPrefix
    const terraformStack = applicationSynthStack.terraformStack
    const resourceGroup = applicationSynthStack.resourceGroup!
    const rocketStack = applicationSynthStack.rocketStack ?? []

    applicationSynthStack.functionApp!.addOverride('identity', {
      type: 'SystemAssigned',
    })

    const accountsConnections: Record<string, string> = {}
    const rocketStoragesIds: Array<string> = []
    configuration.userConfiguration.forEach((userConfiguration) => {
      const rocketStorage = TerraformStorageAccount.build(
        terraformStack,
        resourceGroup,
        appPrefix,
        utils,
        config,
        userConfiguration.storageName
      )
      rocketStoragesIds.push(rocketStorage.id)

      const blobContainer = TerraformStorageContainer.build(
        terraformStack,
        appPrefix,
        rocketStorage,
        userConfiguration.containerName,
        utils
      )

      const functionName = `${rocketStorage.name}__serviceUri`
      accountsConnections[functionName] = `https://${rocketStorage.name}.blob.core.windows.net`

      rocketStack.push(blobContainer)
      rocketStack.push(rocketStorage)
    })

    const rocketFunctionApp = TerraformFunctionApp.build(
      terraformStack,
      applicationSynthStack,
      config,
      utils,
      accountsConnections
    )

    rocketStoragesIds.forEach((id) => {
      const rocketRoles = TerraformRoleAssignment.build(
        terraformStack,
        applicationSynthStack,
        utils,
        id,
        rocketFunctionApp
      )
      const appRoles = TerraformRoleAssignment.build(
        terraformStack,
        applicationSynthStack,
        utils,
        id,
        applicationSynthStack.functionApp!
      )
      rocketStack.push(...rocketRoles)
      rocketStack.push(...appRoles)
    })
    rocketStack.push(rocketFunctionApp)
    return applicationSynthStack
  }
}
