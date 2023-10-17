import { BoosterConfig } from '@boostercloud/framework-types'
import { Router } from 'express'
import { RocketFilesConfiguration, LOCAL_PORT_ENV } from '@boostercloud/rocket-file-uploads-types'
import { FileController } from './controllers/file-controller'
import { fsWatch } from './fs-watch'
import { InfrastructureRocketMetadata } from '@boostercloud/framework-provider-local-infrastructure'

export class Infra {
  public static mountStack(
    rocketFilesConfiguration: RocketFilesConfiguration,
    config: BoosterConfig,
    router: Router,
    infrastructureRocketMetadata?: InfrastructureRocketMetadata
  ): void {
    const port = infrastructureRocketMetadata?.port ?? 3000
    process.env[LOCAL_PORT_ENV] = port.toString()
    rocketFilesConfiguration.userConfiguration.forEach((userConfiguration) => {
      fsWatch(userConfiguration.storageName, userConfiguration.containerName, port, userConfiguration.directories)
      userConfiguration.directories.forEach((directory: string) => {
        router.use(
          `/${userConfiguration.storageName}/${userConfiguration.containerName}`,
          new FileController(userConfiguration.storageName, userConfiguration.containerName, directory).router
        )
      })
    })
  }
}
