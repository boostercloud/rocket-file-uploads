import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { storageName } from '@boostercloud/rocket-files-types'

const WRITE_PERMISSION = 'w'

export async function presignedPut(config: BoosterConfig, directory: string, fileName: string): Promise<string> {
  const storageAccount = storageName(config.appName)
  return new BlobService(storageAccount).getBlobSasUrl(directory, fileName, WRITE_PERMISSION)
}
