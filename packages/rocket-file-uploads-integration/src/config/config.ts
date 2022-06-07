import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
import { BoosterRocketFiles } from '@boostercloud/rocket-file-uploads-core'
import { RocketFilesParams } from '@boostercloud/rocket-file-uploads-types'

Booster.configure('local', (config: BoosterConfig): void => {
  config.appName = 'rocket-file-uploads-integration'
  config.providerPackage = '@boostercloud/framework-provider-local'
  config.rockets = [
    buildRocket(config, {
      rocketProviderPackage: '@boostercloud/rocket-file-uploads-local',
      params: [
        {
          directory: 'uploads',
        },
      ],
    }).rocketForLocal(),
  ]
})

function buildRocket(config: BoosterConfig, params: RocketFilesParams): BoosterRocketFiles {
  return new BoosterRocketFiles(config, params)
}
