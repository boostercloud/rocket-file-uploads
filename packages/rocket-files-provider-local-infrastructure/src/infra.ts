import { BoosterConfig, rocketFunctionIDEnvVar } from '@boostercloud/framework-types'
import { Router } from 'express'
import { containerName, functionID, RocketFilesParam, RocketFilesParams } from '@boostercloud/rocket-files-types'
import { FileController } from './controllers/file-controller'
import { fsWatch } from './fs-watch'

export class Infra {
  public static mountStack(params: RocketFilesParams, config: BoosterConfig, router: Router): void {
    process.env[rocketFunctionIDEnvVar] = functionID
    params.params.forEach((parameter: RocketFilesParam) => {
      router.use(`/${containerName}`, new FileController(parameter.directory).router)
      fsWatch(parameter.directory)
    })
  }
}
