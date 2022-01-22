import { BoosterConfig, RocketDescriptor } from '@boostercloud/framework-types'
import { RocketFilesParam, RocketFilesParams, RocketFilesProviderLibrary } from '@boostercloud/rocket-files-types'

export class FileHandler {
  private _provider: RocketFilesProviderLibrary
  private _rocket: RocketDescriptor
  private _parameters: RocketFilesParams

  constructor(readonly config: BoosterConfig) {
    this._rocket = config.rockets?.find(
      (rocket) =>
        rocket.packageName == '@boostercloud/rocket-files-provider-azure-infrastructure' ||
        rocket.packageName == '@boostercloud/rocket-files-provider-local-infrastructure'
    ) as RocketDescriptor
    if (!this._rocket) {
      throw new Error('Rocket not found. Please make sure you have setup the rocket packageName correctly')
    }
    this._parameters = this._rocket.parameters as RocketFilesParams
    this._provider = require(this._parameters.rocketProviderPackage)
  }

  public presignedGet(directory: string, fileName: string): Promise<string> {
    this.checkDirectory(directory)
    return this._provider.presignedGet(this.config, directory, fileName)
  }

  public presignedPut(directory: string, fileName: string): Promise<string> {
    this.checkDirectory(directory)
    return this._provider.presignedPut(this.config, directory, fileName)
  }

  private checkDirectory(directory: string): void {
    if (!this._parameters.params.map((param: RocketFilesParam) => param.directory).includes(directory)) {
      throw new Error(`Invalid directory ${directory}`)
    }
  }
}
