export const functionID = 'rocket-files'

export interface RocketFilesParam {
  directory: string
}

export type RocketProviderPackageType =
  | '@boostercloud/rocket-file-uploads-azure'
  | '@boostercloud/rocket-file-uploads-local'

export interface RocketFilesParams {
  rocketProviderPackage: RocketProviderPackageType
  params: Array<RocketFilesParam>
}
