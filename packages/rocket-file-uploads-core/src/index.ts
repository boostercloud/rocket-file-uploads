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
  constructor(
    readonly config: BoosterConfig,
    readonly userConfiguration: RocketFilesUserConfiguration | Array<RocketFilesUserConfiguration>
  ) {}

  public rocketForAzure(): RocketDescriptor {
    const configuration = BoosterRocketFiles.buildParameters(
      this.userConfiguration,
      '@boostercloud/rocket-file-uploads-azure'
    )
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
    const provider = require(configuration.rocketProviderPackage)
    this.config.registerRocketFunction(functionID, async (boosterConfig: BoosterConfig, request: unknown) => {
      const operations = configuration.userConfiguration.map((userConf) => {
        return fileUploaded(boosterConfig, request, userConf, provider)
      })
      await Promise.all(operations)
    })
  }

  private static buildParameters(
    userConfiguration: RocketFilesUserConfiguration | Array<RocketFilesUserConfiguration>,
    rocketProviderPackage: RocketProviderPackageType
  ): RocketFilesConfiguration {
    if (Array.isArray(userConfiguration)) {
      userConfiguration.forEach((config) => {
        config.storageName = config.storageName.toLowerCase()
      })
      return {
        userConfiguration: userConfiguration,
        rocketProviderPackage: rocketProviderPackage,
      }
    }
    userConfiguration.storageName = userConfiguration.storageName.toLowerCase()
    return {
      userConfiguration: [userConfiguration],
      rocketProviderPackage: rocketProviderPackage,
    }
  }
}
