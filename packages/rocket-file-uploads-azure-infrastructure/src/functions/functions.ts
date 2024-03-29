import { ApplicationSynthStack, FunctionDefinition } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { getFunctionAppName } from '../helper'
import { RocketFilesFileUploadedFunction } from './rocket-files-file-uploaded-function'

export class Functions {
  static mountFunctions(configuration: RocketFilesConfiguration, config: BoosterConfig): Array<FunctionDefinition> {
    return configuration.userConfiguration.map((userConfiguration) =>
      RocketFilesFileUploadedFunction.getFunctionDefinition(
        config,
        userConfiguration.containerName,
        userConfiguration.storageName
      )
    )
  }

  static getFunctionAppName(
    configuration: RocketFilesConfiguration,
    applicationSynthStack: ApplicationSynthStack
  ): string {
    return getFunctionAppName(applicationSynthStack)
  }
}
