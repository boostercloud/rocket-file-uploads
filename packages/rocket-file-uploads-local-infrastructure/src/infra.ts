import { BoosterConfig, rocketFunctionIDEnvVar } from '@boostercloud/framework-types'
import { Router } from 'express'
import { functionID, RocketFilesParam, RocketFilesParams } from '@boostercloud/rocket-file-uploads-types'
import { FileController } from './controllers/file-controller'
import { fsWatch } from './fs-watch'

export class Infra {
  public static mountStack(params: RocketFilesParams, config: BoosterConfig, router: Router): void {
    process.env[rocketFunctionIDEnvVar] = functionID
    params.params.forEach((parameter: RocketFilesParam) => {
      router.use(`/${params.containerName}`, new FileController(params.containerName, parameter.directory).router)
      fsWatch(params.containerName, parameter.directory)
    })
  }
}
