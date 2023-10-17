import { BoosterConfig, RocketDescriptor } from '@boostercloud/framework-types'
import {
  getUserConfiguration,
  ListItem,
  RocketFilesConfiguration,
  RocketFilesProviderLibrary,
  RocketFilesUserConfiguration,
  isValidDirectory,
} from '@boostercloud/rocket-file-uploads-types'

const infraPackages = ['azure', 'local'].map((s) => `@boostercloud/rocket-file-uploads-${s}-infrastructure`)

export class FileHandler {
  private _provider: RocketFilesProviderLibrary
  private _rocket: RocketDescriptor
  private _rocketFilesConfiguration: RocketFilesConfiguration
  private _userConfiguration: RocketFilesUserConfiguration

  constructor(readonly config: BoosterConfig, storageName?: string) {
    this._rocket = FileHandler.getRocketFromConfiguration(config)
    this._rocketFilesConfiguration = this._rocket.parameters as RocketFilesConfiguration
    this._provider = require(this._rocketFilesConfiguration.rocketProviderPackage)
    this._userConfiguration = getUserConfiguration(this._rocketFilesConfiguration, storageName)
  }

  public presignedGet(directory: string, fileName: string): Promise<string> {
    this.checkDirectory(directory)
    return this._provider.presignedGet(this.config, this._userConfiguration, directory, fileName)
  }

  public presignedPut(directory: string, fileName: string): Promise<string> | Promise<any> {
    this.checkDirectory(directory)
    return this._provider.presignedPut(this.config, this._userConfiguration, directory, fileName)
  }

  public list(directory: string): Promise<Array<ListItem>> {
    this.checkDirectory(directory)
    return this._provider.list(this.config, this._userConfiguration, directory)
  }

  private checkDirectory(directory: string): void {
    if (!isValidDirectory(directory, this._userConfiguration.directories)) {
      throw new Error(`Invalid directory ${directory}`)
    }
  }

  private static getRocketFromConfiguration(config: BoosterConfig): RocketDescriptor {
    const rocketDescriptor = config.rockets?.find((rocket) =>
      infraPackages.includes(rocket.packageName)
    ) as RocketDescriptor

    if (!rocketDescriptor) {
      throw new Error('Rocket not found. Please make sure you have setup the rocket packageName correctly')
    }
    return rocketDescriptor
  }
}
