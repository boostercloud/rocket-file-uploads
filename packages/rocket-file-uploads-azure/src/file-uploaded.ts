import { RocketFilesParam, RocketFilesParams } from '@boostercloud/rocket-file-uploads-types'
import { Context, ContextBindingData } from '@azure/functions'

export function getMetadataFromRequest(request: unknown): ContextBindingData {
  return (request as Context).bindingData
}

export function validateMetadata(params: RocketFilesParams, metadata: ContextBindingData): boolean {
  const blobTrigger = metadata.blobTrigger as string
  const directoryFound = params.params.find((p: RocketFilesParam) =>
    blobTrigger.startsWith(`${params.containerName}/${p.directory}`)
  )

  if (!directoryFound) {
    console.info(`Ignoring blobTrigger ${blobTrigger}`)
    return false
  }
  return true
}
