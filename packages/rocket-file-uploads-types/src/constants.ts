export const storageName = (applicationName: string, environmentName: string): string =>
  `${applicationName}rf${environmentName}`.replace(/([-_])/gi, '').substr(0, 24)
