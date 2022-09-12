import { BoosterConfig } from '@boostercloud/framework-types'
import { ListItem } from './list-item'

export interface RocketFilesProviderLibrary {
  presignedGet(config: BoosterConfig, containerName: string, directory: string, fileName: string): Promise<string>
  presignedPut(config: BoosterConfig, containerName: string, directory: string, fileName: string): Promise<string>
  list(config: BoosterConfig, containerName: string, directory: string): Promise<Array<ListItem>>
}
