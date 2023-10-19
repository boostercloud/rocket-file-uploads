export const functionID = 'rocket-files'

export interface RocketFilesUserConfiguration {
  storageName: string
  directories: Array<string>
  containerName: string
}

export type RocketProviderPackageType =
  | '@boostercloud/rocket-file-uploads-azure'
  | '@boostercloud/rocket-file-uploads-local'

export interface RocketFilesConfiguration {
  userConfiguration: Array<RocketFilesUserConfiguration>
  rocketProviderPackage: RocketProviderPackageType
}

export function getUserConfiguration(
  rocketFilesConfiguration: RocketFilesConfiguration,
  storageAccountName?: string
): RocketFilesUserConfiguration {
  if (rocketFilesConfiguration.userConfiguration.length === 0) {
    throw new Error('Missing userConfiguration')
  }
  if (!storageAccountName && rocketFilesConfiguration.userConfiguration.length > 1) {
    throw new Error('Missing storageAccountName')
  }
  if (!storageAccountName) {
    return rocketFilesConfiguration.userConfiguration[0]
  }
  const userConfiguration = rocketFilesConfiguration.userConfiguration.find(
    (userConfiguration) => userConfiguration.storageName.toLowerCase() === storageAccountName.toLowerCase()
  )
  if (!userConfiguration) {
    throw new Error(`Storage account name ${storageAccountName} not found`)
  }
  return userConfiguration
}
