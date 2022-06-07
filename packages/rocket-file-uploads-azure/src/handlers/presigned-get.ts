import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { storageName } from '@boostercloud/rocket-file-uploads-types'

export async function presignedGet(config: BoosterConfig, directory: string, fileName: string): Promise<string> {
  const storageAccount = storageName(config.appName)
  return new BlobService(storageAccount).getBlobSasUrl(directory, fileName)
}
