export interface ListItem {
  name: string
  properties: ListItemProperties
  metadata?: {
    [propertyName: string]: string
  }
}

export interface ListItemProperties {
  createdOn?: Date
  lastModified: Date
  /** Size in bytes */
  contentLength?: number
  contentType?: string
}
