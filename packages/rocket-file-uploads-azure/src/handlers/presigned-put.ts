import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'

const WRITE_PERMISSION = 'w'

export async function presignedPut(
  config: BoosterConfig,
  rocketFilesUserConfiguration: RocketFilesUserConfiguration,
  directory: string,
  fileName: string
): Promise<string> {
  return new BlobService(config, rocketFilesUserConfiguration).getBlobSasUrl(
    rocketFilesUserConfiguration.containerName,
    directory,
    fileName,
    WRITE_PERMISSION
  )
}
