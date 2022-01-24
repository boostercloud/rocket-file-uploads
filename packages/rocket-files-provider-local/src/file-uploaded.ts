import { RocketFilesParams } from '@boostercloud/rocket-files-types'

interface LocalBindingData {
  fileName: string
  eventType: string
}

export function getMetadataFromRequest(request: unknown): LocalBindingData {
  return request as LocalBindingData
}

export function validateMetadata(params: RocketFilesParams, metadata: LocalBindingData): boolean {
  return true
}
