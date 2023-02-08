import { BoosterConfig } from '@boostercloud/framework-types'
import { ListItem } from './list-item'
import { RocketFilesUserConfiguration } from './rocket-files-params'

export interface RocketFilesProviderLibrary {
  presignedGet(
    config: BoosterConfig,
    rocketFilesUserConfiguration: RocketFilesUserConfiguration,
    directory: string,
    fileName: string
  ): Promise<string>

  presignedPut(
    config: BoosterConfig,
    rocketFilesUserConfiguration: RocketFilesUserConfiguration,
    directory: string,
    fileName: string
  ): Promise<unknown>

  list(
    config: BoosterConfig,
    rocketFilesUserConfiguration: RocketFilesUserConfiguration,
    directory: string
  ): Promise<Array<ListItem>>

  /// Only supported in AWS at the moment.
  deleteFile(
    config: BoosterConfig, 
    rocketFilesUserConfiguration: RocketFilesUserConfiguration, 
    directory: string, 
    fileName: string
  ): Promise<boolean>
}
