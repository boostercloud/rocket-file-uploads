import { BoosterConfig, rocketFunctionIDEnvVar } from '@boostercloud/framework-types'
import { Router } from 'express'
import { functionID, RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { FileController } from './controllers/file-controller'
import { fsWatch } from './fs-watch'

export class Infra {
  public static mountStack(
    rocketFilesConfiguration: RocketFilesConfiguration,
    config: BoosterConfig,
    router: Router
  ): void {
    process.env[rocketFunctionIDEnvVar] = functionID
    rocketFilesConfiguration.userConfiguration.forEach((userConfiguration) => {
      userConfiguration.directories.forEach((directory: string) => {
        router.use(
          `/${userConfiguration.storageName}/${userConfiguration.containerName}`,
          new FileController(userConfiguration.storageName, userConfiguration.containerName, directory).router
        )
        fsWatch(userConfiguration.storageName, userConfiguration.containerName, directory)
      })
    })
  }
}
