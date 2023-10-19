import { isValidDirectory, RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { Context, ContextBindingData } from '@azure/functions'
import * as path from 'path'

export function getMetadataFromRequest(request: unknown): ContextBindingData {
  return (request as Context).bindingData
}

export function validateMetadata(configuration: RocketFilesUserConfiguration, metadata: ContextBindingData): boolean {
  const blobTrigger = metadata.blobTrigger as string
  const sourceWithoutContainer = blobTrigger.replace(configuration.containerName + '/', '')
  const parsedPath = path.parse(sourceWithoutContainer)
  const sourceDirectoryPath = parsedPath.dir
  const directoryFound = isValidDirectory(sourceDirectoryPath, configuration.directories)

  if (!directoryFound) {
    console.info(`Ignoring blob trigger ${blobTrigger}`)
    return false
  }
  return true
}
