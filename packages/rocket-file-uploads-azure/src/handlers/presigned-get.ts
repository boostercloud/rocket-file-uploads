import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'

export async function presignedGet(
  config: BoosterConfig,
  rocketFilesUserConfiguration: RocketFilesUserConfiguration,
  directory: string,
  fileName: string
): Promise<string> {
  return new BlobService(config, rocketFilesUserConfiguration).getBlobSasUrl(
    rocketFilesUserConfiguration.containerName,
    directory,
    fileName
  )
}
