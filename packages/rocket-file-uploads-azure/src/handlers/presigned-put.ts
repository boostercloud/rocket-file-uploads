import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'

const WRITE_PERMISSION = 'w'

export async function presignedPut(
  config: BoosterConfig,
  rocketFilesConfiguration: RocketFilesConfiguration,
  directory: string,
  fileName: string
): Promise<string> {
  return new BlobService(config, rocketFilesConfiguration).getBlobSasUrl(
    rocketFilesConfiguration.containerName,
    directory,
    fileName,
    WRITE_PERMISSION
  )
}
