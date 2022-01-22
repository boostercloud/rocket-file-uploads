/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BoosterConfig, EventEnvelope, UUID } from '@boostercloud/framework-types'
import {
  containerName,
  RocketFilesParams,
  RocketFilesBlobUploaded,
  UploadedFileEntity,
  UploadedFileEvent,
  RocketFilesParam,
} from '@boostercloud/rocket-files-types'

export async function fileUploaded(
  config: BoosterConfig,
  request: unknown,
  params: RocketFilesParams
): Promise<unknown> {
  // @ts-ignore
  const bindingData = request.bindingData
  const blobTrigger = bindingData.blobTrigger as string
  const directoryFound = findDirectoryInParams(params, blobTrigger)
  if (!directoryFound) {
    console.info(`Ignoring blobTrigger ${blobTrigger}`)
    return Promise.resolve()
  }
  return processEvent(config, bindingData)
}

async function processEvent(config: BoosterConfig, bindingData: unknown): Promise<void> {
  try {
    const envelop = toEventEnvelop(bindingData)
    await config.provider.events.store([envelop], config, console)
  } catch (e) {
    console.log('[ROCKET#files] An error occurred while performing a PutItem operation: ', e)
  }
}

function toEventEnvelop(bindingData: unknown): EventEnvelope {
  const id = UUID.generate()
  return {
    createdAt: new Date().toISOString(),
    entityID: id,
    kind: 'event',
    requestID: id,
    typeName: UploadedFileEvent.name,
    entityTypeName: UploadedFileEntity.name,
    version: 1,
    value: {
      metadata: bindingData,
    } as RocketFilesBlobUploaded,
  } as EventEnvelope
}

function findDirectoryInParams(params: RocketFilesParams, blobTrigger: string): string | undefined {
  return params.params
    .map((param: RocketFilesParam) => param.directory)
    .find((directory: string) => blobTrigger.startsWith(`${containerName}/${directory}`))
}
