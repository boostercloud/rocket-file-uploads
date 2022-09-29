import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'

interface LocalBindingData {
  name: string
  eventType: string
}

export function getMetadataFromRequest(request: unknown): LocalBindingData {
  return request as LocalBindingData
}

export function validateMetadata(configuration: RocketFilesConfiguration, metadata: LocalBindingData): boolean {
  return true
}
