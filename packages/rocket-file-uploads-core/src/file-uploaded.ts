import { BoosterConfig, EventEnvelope, UUID } from '@boostercloud/framework-types'
import {
  RocketFilesBlobUploaded,
  RocketFilesParams,
  UploadedFileEntity,
  UploadedFileEvent,
} from '@boostercloud/rocket-file-uploads-types'

export async function fileUploaded(
  config: BoosterConfig,
  request: unknown,
  params: RocketFilesParams
): Promise<unknown> {
  const provider = require(params.rocketProviderPackage)
  const metadata = provider.getMetadataFromRequest(request)
  if (provider.validateMetadata(params, metadata)) {
    return processEvent(config, metadata)
  }
  return Promise.resolve()
}

async function processEvent(config: BoosterConfig, metadata: unknown): Promise<void> {
  try {
    const envelop = toEventEnvelop(metadata)
    await config.provider.events.store([envelop], config)
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
