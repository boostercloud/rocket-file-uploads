import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { storageName } from '@boostercloud/rocket-file-uploads-types'

export async function presignedGet(
  config: BoosterConfig,
  containerName: string,
  directory: string,
  fileName: string
): Promise<string> {
  const storageAccount = storageName(config.appName, config.environmentName)
  return new BlobService(storageAccount).getBlobSasUrl(containerName, directory, fileName)
}
