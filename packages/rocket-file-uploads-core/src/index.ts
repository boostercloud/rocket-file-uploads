import { BoosterConfig, RocketDescriptor } from '@boostercloud/framework-types'
import {
  functionID,
  RocketFilesAzureInfraParameters,
  RocketFilesConfiguration,
  RocketFilesUserConfiguration,
  RocketProviderPackageType,
} from '@boostercloud/rocket-file-uploads-types'
import { fileUploaded } from './file-uploaded'

export { FileHandler } from './file-handler'

export class BoosterRocketFiles {
  constructor(readonly config: BoosterConfig, readonly userConfiguration: RocketFilesUserConfiguration) {}

  public rocketForAzure(azureInfraParameters?: RocketFilesAzureInfraParameters): RocketDescriptor {
    const configuration = BoosterRocketFiles.buildParameters(
      this.userConfiguration,
      '@boostercloud/rocket-file-uploads-azure'
    )
    configuration.azureInfra = azureInfraParameters
    this.register(configuration)
    return {
      packageName: '@boostercloud/rocket-file-uploads-azure-infrastructure',
      parameters: configuration,
    }
  }

  public rocketForLocal(): RocketDescriptor {
    const configuration = BoosterRocketFiles.buildParameters(
      this.userConfiguration,
      '@boostercloud/rocket-file-uploads-local'
    )
    this.register(configuration)
    return {
      packageName: '@boostercloud/rocket-file-uploads-local-infrastructure',
      parameters: configuration,
    }
  }

  private register(configuration: RocketFilesConfiguration): void {
    this.config.registerRocketFunction(functionID, async (config: BoosterConfig, request: unknown) => {
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
