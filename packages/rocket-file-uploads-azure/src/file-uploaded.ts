import { RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { Context, ContextBindingData } from '@azure/functions'

export function getMetadataFromRequest(request: unknown): ContextBindingData {
  return (request as Context).bindingData
}

export function validateMetadata(configuration: RocketFilesUserConfiguration, metadata: ContextBindingData): boolean {
  const blobTrigger = metadata.blobTrigger as string
  const directoryFound = configuration.directories.find((directory: string) =>
    blobTrigger.startsWith(`${configuration.containerName}/${directory}`)
  )

  if (!directoryFound) {
    console.info(`Ignoring blob trigger ${blobTrigger}`)
    return false
  }
  return true
}
