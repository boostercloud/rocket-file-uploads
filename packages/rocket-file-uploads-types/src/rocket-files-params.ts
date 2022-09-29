export const functionID = 'rocket-files'

export interface RocketFilesUserConfiguration {
  containerName: string
  directories: Array<string>
}

export type RocketProviderPackageType =
  | '@boostercloud/rocket-file-uploads-azure'
  | '@boostercloud/rocket-file-uploads-local'

export interface RocketFilesAzureInfraParameters {
  storageAccountName: string
}

export interface RocketFilesConfiguration extends RocketFilesUserConfiguration {
  rocketProviderPackage: RocketProviderPackageType
  azureInfra?: RocketFilesAzureInfraParameters
}
