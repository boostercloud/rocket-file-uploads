import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'

export async function presignedGet(
  _config: BoosterConfig,
  rocketFilesConfiguration: RocketFilesConfiguration,
  directory: string,
  fileName: string
): Promise<string> {
  return `${rocketFilesConfiguration.containerName}/${directory}/${fileName}`
}
