import { BoosterConfig } from '@boostercloud/framework-types'
import { ListItem } from './list-item'

export interface RocketFilesProviderLibrary {
  presignedGet(config: BoosterConfig, directory: string, fileName: string): Promise<string>
  presignedPut(config: BoosterConfig, directory: string, fileName: string): Promise<string>
  list(config: BoosterConfig, directory: string): Promise<Array<ListItem>>
}
