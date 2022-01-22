export const functionID = 'rocket-files'

export interface RocketFilesParam {
  directory: string
}

export type RocketProviderPackageType =
  | '@boostercloud/rocket-files-provider-azure'
  | '@boostercloud/rocket-files-provider-local'

export interface RocketFilesParams {
  rocketProviderPackage: RocketProviderPackageType
  params: Array<RocketFilesParam>
}
