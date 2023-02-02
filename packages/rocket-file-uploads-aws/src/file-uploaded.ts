import { RocketFilesUserConfiguration } from "rocket-file-uploads-types/dist"

interface AWSEventS3 {
  s3SchemaVersion: string
  configurationId: string
  bucket: {
    name: string
    ownerIdentity: any
    arn: string
  }
  object: {
    key: string
    size: number
    eTag: string
    sequencer: string
  }
}

interface AWSEvent {
  eventVersion: string
  eventSource: string
  awsRegion: string
  eventTime: string
  eventName: string
  userIdentity: [Object]
  requestParameters: [Object]
  responseElements: [Object]
  s3: AWSEventS3
}

export function getMetadataFromRequest(request: unknown): AWSEvent {
  const events = (request as any)["Records"] as Array<AWSEvent>
  return events[0]
}
  
export function validateMetadata(configuration: RocketFilesUserConfiguration, metadata: AWSEvent): boolean {
  const fileLocation = metadata.s3.object.key
  
  const directoryFound = configuration.directories.find((directory: string) =>
    fileLocation.startsWith(directory)
  )

  if (!directoryFound) {
    console.info(`Ignoring file trigger ${fileLocation}`)
    return false
  }

  const isValidEventType = metadata.eventName.startsWith('ObjectCreated:') || metadata.eventName.startsWith('ObjectRemoved:')
  return isValidEventType
}
  