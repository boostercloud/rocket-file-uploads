import { BoosterConfig, RocketDescriptor } from '@boostercloud/framework-types'
import { functionID, RocketFilesParams } from '@boostercloud/rocket-file-uploads-types'
import { fileUploaded } from './file-uploaded'

export { FileHandler } from './file-handler'

export class BoosterRocketFiles {
  public constructor(readonly config: BoosterConfig, readonly params: RocketFilesParams) {
    config.registerRocketFunction(functionID, async (config: BoosterConfig, request: unknown) => {
      return fileUploaded(config, request, params)
    })
  }

  public rocketForAzure(): RocketDescriptor {
    return {
      packageName: '@boostercloud/rocket-file-uploads-azure-infrastructure',
      parameters: this.params,
    }
  }

  public rocketForLocal(): RocketDescriptor {
    return {
      packageName: '@boostercloud/rocket-file-uploads-local-infrastructure',
      parameters: this.params,
    }
  }
}
