import { BoosterConfig, rocketFunctionIDEnvVar } from '@boostercloud/framework-types'
import { Router } from 'express'
import { functionID, RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { FileController } from './controllers/file-controller'
import { fsWatch } from './fs-watch'

export class Infra {
  public static mountStack(params: RocketFilesConfiguration, config: BoosterConfig, router: Router): void {
    process.env[rocketFunctionIDEnvVar] = functionID
    params.directories.forEach((directory: string) => {
      router.use(`/${params.containerName}`, new FileController(params.containerName, directory).router)
      fsWatch(params.containerName, directory)
    })
  }
}
