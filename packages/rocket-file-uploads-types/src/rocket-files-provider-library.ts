import { BoosterConfig } from '@boostercloud/framework-types'
import { ListItem } from './list-item'
import { RocketFilesConfiguration } from './rocket-files-params'

export interface RocketFilesProviderLibrary {
  presignedGet(
    config: BoosterConfig,
    rocketFilesConfiguration: RocketFilesConfiguration,
    directory: string,
    fileName: string
  ): Promise<string>
  presignedPut(
    config: BoosterConfig,
    rocketFilesConfiguration: RocketFilesConfiguration,
    directory: string,
    fileName: string
  ): Promise<string>
  list(
    config: BoosterConfig,
    rocketFilesConfiguration: RocketFilesConfiguration,
    directory: string
  ): Promise<Array<ListItem>>
}
