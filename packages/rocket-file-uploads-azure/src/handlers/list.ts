import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { ListItem, RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'

export async function list(
  config: BoosterConfig,
  rocketFilesUserConfiguration: RocketFilesUserConfiguration,
  directory: string
): Promise<Array<ListItem>> {
  return new BlobService(config, rocketFilesUserConfiguration).listBlobFolder(
    rocketFilesUserConfiguration.containerName,
    directory
  )
}
