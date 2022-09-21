export function azureStorageName(
  applicationName: string,
  environmentName: string,
  storageAccountNameParameter?: string
): string {
  const defaultAccountName = `${applicationName}rf${environmentName}`.replace(/([-_])/gi, '').substring(0, 24)
  return storageAccountNameParameter || defaultAccountName
}

export const LOCAL_PORT_ENV = 'ROCKET_FILES_LOCAL_PORT'

export const localPort = (): string => process.env[LOCAL_PORT_ENV] || '3000'
