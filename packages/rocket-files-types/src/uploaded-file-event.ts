import { Event } from '@boostercloud/framework-core'

@Event
export class UploadedFileEvent {
  constructor(readonly metadata: unknown) {}

  public entityID(): string {
    const crypto = require('crypto')
    return crypto.createHash('md5').update(JSON.stringify(this.metadata)).digest('hex')
  }
}
