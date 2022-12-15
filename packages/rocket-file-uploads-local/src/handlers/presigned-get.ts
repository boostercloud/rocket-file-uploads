import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesUserConfiguration, localPort } from '@boostercloud/rocket-file-uploads-types'

export async function presignedGet(
  _config: BoosterConfig,
  rocketFilesUserConfiguration: RocketFilesUserConfiguration,
  directory: string,
  fileName: string
): Promise<string> {
  return `http://localhost:${localPort()}/${rocketFilesUserConfiguration.storageName}/${rocketFilesUserConfiguration.containerName}/${directory}/${fileName}`
}
