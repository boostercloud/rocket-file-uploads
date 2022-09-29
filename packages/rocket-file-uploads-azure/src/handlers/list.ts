import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { ListItem, RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'

export async function list(
  config: BoosterConfig,
  rocketFilesConfiguration: RocketFilesConfiguration,
  directory: string
): Promise<Array<ListItem>> {
  return new BlobService(config, rocketFilesConfiguration).listBlobFolder(
    rocketFilesConfiguration.containerName,
    directory
  )
}
