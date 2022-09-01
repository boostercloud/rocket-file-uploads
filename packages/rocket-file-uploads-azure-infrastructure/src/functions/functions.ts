import { ApplicationSynthStack, FunctionDefinition } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesParams } from '@boostercloud/rocket-file-uploads-types'
import { getFunctionAppName } from '../helper'
import { RocketFilesFileUploadedFunction } from './rocket-files-file-uploaded-function'

export class Functions {
  static mountFunctions(params: RocketFilesParams, config: BoosterConfig): Array<FunctionDefinition> {
    return [RocketFilesFileUploadedFunction.getFunctionDefinition(config, params.containerName)]
  }

  static getFunctionAppName(params: RocketFilesParams, applicationSynthStack: ApplicationSynthStack): string {
    return getFunctionAppName(applicationSynthStack)
  }
}
