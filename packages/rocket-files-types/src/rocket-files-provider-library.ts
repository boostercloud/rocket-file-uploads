import { BoosterConfig } from '@boostercloud/framework-types'

export interface RocketFilesProviderLibrary {
  presignedGet(config: BoosterConfig, directory: string, fileName: string): Promise<string>
  presignedPut(config: BoosterConfig, directory: string, fileName: string): Promise<string>
}
