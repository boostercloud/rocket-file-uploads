import { ApplicationSynthStack, FunctionDefinition } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesParams } from '@boostercloud/rocket-files-types'

export class Functions {
  static mountFunctions(params: RocketFilesParams, config: BoosterConfig): Array<FunctionDefinition> {
    return []
  }

  static getFunctionAppName(params: RocketFilesParams, applicationSynthStack: ApplicationSynthStack): string {
    return ''
  }
}
