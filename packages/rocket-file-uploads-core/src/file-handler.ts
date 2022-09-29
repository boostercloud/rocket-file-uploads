import { BoosterConfig, RocketDescriptor } from '@boostercloud/framework-types'
import { ListItem, RocketFilesConfiguration, RocketFilesProviderLibrary } from '@boostercloud/rocket-file-uploads-types'

export class FileHandler {
  private _provider: RocketFilesProviderLibrary
  private _rocket: RocketDescriptor
  private _rocketFilesConfiguration: RocketFilesConfiguration

  constructor(readonly config: BoosterConfig) {
    this._rocket = FileHandler.getRocketFromConfiguration(config)
    this._rocketFilesConfiguration = this._rocket.parameters as RocketFilesConfiguration
    this._provider = require(this._rocketFilesConfiguration.rocketProviderPackage)
  }

  public presignedGet(directory: string, fileName: string): Promise<string> {
    this.checkDirectory(directory)
    return this._provider.presignedGet(this.config, this._rocketFilesConfiguration, directory, fileName)
  }

  public presignedPut(directory: string, fileName: string): Promise<string> {
    this.checkDirectory(directory)
    return this._provider.presignedPut(this.config, this._rocketFilesConfiguration, directory, fileName)
  }

  public list(directory: string): Promise<Array<ListItem>> {
    this.checkDirectory(directory)
    return this._provider.list(this.config, this._rocketFilesConfiguration, directory)
  }

  private checkDirectory(directory: string): void {
    if (!this._rocketFilesConfiguration.directories.includes(directory)) {
      throw new Error(`Invalid directory ${directory}`)
    }
  }

  private static getRocketFromConfiguration(config: BoosterConfig): RocketDescriptor {
    const rocketDescriptor = config.rockets?.find(
      (rocket) =>
        rocket.packageName == '@boostercloud/rocket-file-uploads-azure-infrastructure' ||
        rocket.packageName == '@boostercloud/rocket-file-uploads-local-infrastructure'
    ) as RocketDescriptor
    if (!rocketDescriptor) {
      throw new Error('Rocket not found. Please make sure you have setup the rocket packageName correctly')
    }
    return rocketDescriptor
  }
}
