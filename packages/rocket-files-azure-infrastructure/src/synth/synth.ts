import { BoosterConfig } from '@boostercloud/framework-types'
import { ApplicationSynthStack, RocketUtils } from '@boostercloud/framework-provider-azure-infrastructure'
import { RocketFilesParams } from '@boostercloud/rocket-files-types'

export class Synth {
  public static mountStack(
    params: RocketFilesParams,
    config: BoosterConfig,
    applicationSynthStack: ApplicationSynthStack,
    utils: RocketUtils
  ): ApplicationSynthStack {
    return applicationSynthStack
  }
}
