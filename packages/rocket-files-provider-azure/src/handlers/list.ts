import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { storageName, ListItem } from '@boostercloud/rocket-files-types'

export async function list(config: BoosterConfig, directory: string): Promise<Array<ListItem>> {
  const storageAccount = storageName(config.appName)
  return new BlobService(storageAccount).listBlobFolder(directory)
}
