import { BoosterConfig, EventEnvelope, UUID } from '@boostercloud/framework-types'
import {
  RocketFilesBlobUploaded,
  UploadedFileEntity,
  UploadedFileEvent,
  RocketFilesUserConfiguration,
  RocketFileUploadedLibrary,
} from '@boostercloud/rocket-file-uploads-types'

export async function fileUploaded(
  boosterConfig: BoosterConfig,
  request: unknown,
  rocketFilesUserConfiguration: RocketFilesUserConfiguration,
  provider: RocketFileUploadedLibrary
): Promise<unknown> {
  const metadata = provider.getMetadataFromRequest(request)
  if (provider.validateMetadata(rocketFilesUserConfiguration, metadata)) {
    return processEvent(boosterConfig, metadata)
  }
  return Promise.resolve()
}

async function processEvent(boosterConfig: BoosterConfig, metadata: unknown): Promise<void> {
  try {
    const envelop = toEventEnvelop(metadata)
    await boosterConfig.provider.events.store([envelop], boosterConfig)
  } catch (e) {
    console.log('[ROCKET#files] An error occurred while performing a PutItem operation: ', e)
  }
}

function toEventEnvelop(metadata: unknown): EventEnvelope {
  const id = UUID.generate()
  return {
    createdAt: new Date().toISOString(),
    entityID: id,
    kind: 'event',
    superKind: 'domain',
    requestID: id,
    typeName: UploadedFileEvent.name,
    entityTypeName: UploadedFileEntity.name,
    version: 1,
    value: {
      metadata: metadata,
    } as RocketFilesBlobUploaded,
  } as EventEnvelope
}
