import { containerName, RocketFilesParam, RocketFilesParams } from '@boostercloud/rocket-files-types'
import { Context, ContextBindingData } from '@azure/functions'

export function getMetadataFromRequest(request: unknown): ContextBindingData {
  return (request as Context).bindingData
}

export function validateMetadata(params: RocketFilesParams, metadata: ContextBindingData): boolean {
  const blobTrigger = metadata.blobTrigger as string
  const directoryFound = params.params
    .map((param: RocketFilesParam) => param.directory)
    .find((directory: string) => blobTrigger.startsWith(`${containerName}/${directory}`))

  if (!directoryFound) {
    console.info(`Ignoring blobTrigger ${blobTrigger}`)
    return false
  }
  return true
}
