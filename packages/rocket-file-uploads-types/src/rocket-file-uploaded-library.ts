import { RocketFilesUserConfiguration } from './rocket-files-params'

export interface RocketFileUploadedLibrary {
  getMetadataFromRequest(request: unknown): unknown
  validateMetadata(configuration: RocketFilesUserConfiguration, metadata: unknown): boolean
}
