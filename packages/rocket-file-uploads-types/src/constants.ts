export const storageName = (applicationName: string): string =>
  `${applicationName}rocketfilesstorage`.replace(/([-_])/gi, '').substr(0, 24)

export const containerName = 'rocketfiles'
