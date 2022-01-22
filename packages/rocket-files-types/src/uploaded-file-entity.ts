import { Entity, Reduces } from '@boostercloud/framework-core'
import { UploadedFileEvent } from './uploaded-file-event'

@Entity
export class UploadedFileEntity {
  public constructor(readonly id: string, readonly metadata: unknown) {}

  @Reduces(UploadedFileEvent)
  public static reduceUploadedFileEntity(event: UploadedFileEvent): UploadedFileEntity {
    return new UploadedFileEntity(event.entityID(), event.metadata)
  }
}
