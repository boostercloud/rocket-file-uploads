import { BoosterConfig } from '@boostercloud/framework-types'
import { BlobService } from './blob-service'
import { storageName, ListItem } from '@boostercloud/rocket-file-uploads-types'

export async function list(config: BoosterConfig, containerName: string, directory: string): Promise<Array<ListItem>> {
  const storageAccount = storageName(config.appName, config.environmentName)
  return new BlobService(storageAccount).listBlobFolder(containerName, directory)
}
