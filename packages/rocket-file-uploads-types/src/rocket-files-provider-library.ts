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

  /// IMPORTANT: The Promise needs, too, <any> instead of <string> as the return type because of AWS.
  presignedPut(
    config: BoosterConfig,
    rocketFilesUserConfiguration: RocketFilesUserConfiguration,
    directory: string,
    fileName: string
  ): Promise<string> | Promise<any>

  list(
    config: BoosterConfig,
    rocketFilesUserConfiguration: RocketFilesUserConfiguration,
    directory: string
  ): Promise<Array<ListItem>>
}
