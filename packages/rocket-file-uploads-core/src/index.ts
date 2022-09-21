import { BoosterConfig, RocketDescriptor } from '@boostercloud/framework-types'
import {
  functionID,
  RocketFilesConfiguration,
  RocketFilesUserConfiguration,
  RocketProviderPackageType,
} from '@boostercloud/rocket-file-uploads-types'
import { fileUploaded } from './file-uploaded'

export { FileHandler } from './file-handler'

export class BoosterRocketFiles {
  public rocketForAzure(config: BoosterConfig, userConfiguration: RocketFilesUserConfiguration): RocketDescriptor {
    const configuration = BoosterRocketFiles.buildParameters(
      userConfiguration,
      '@boostercloud/rocket-file-uploads-azure'
    )
    this.register(config, configuration)
    return {
      packageName: '@boostercloud/rocket-file-uploads-azure-infrastructure',
      parameters: configuration,
    }
  }

  public rocketForLocal(config: BoosterConfig, userConfiguration: RocketFilesUserConfiguration): RocketDescriptor {
    const configuration = BoosterRocketFiles.buildParameters(
      userConfiguration,
      '@boostercloud/rocket-file-uploads-local'
    )
    this.register(config, configuration)
    return {
      packageName: '@boostercloud/rocket-file-uploads-local-infrastructure',
      parameters: configuration,
    }
  }

  private register(config: BoosterConfig, configuration: RocketFilesConfiguration): void {
    config.registerRocketFunction(functionID, async (config: BoosterConfig, request: unknown) => {
      return fileUploaded(config, request, configuration)
    })
  }

  private static buildParameters(
    userConfiguration: RocketFilesUserConfiguration,
    rocketProviderPackage: RocketProviderPackageType
  ): RocketFilesConfiguration {
    return { ...userConfiguration, rocketProviderPackage: rocketProviderPackage }
  }
}
