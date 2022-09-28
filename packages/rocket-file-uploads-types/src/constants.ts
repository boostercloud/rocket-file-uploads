export function azureStorageName(
  applicationName: string,
  environmentName: string,
  storageAccountNameParameter?: string
): string {
  const defaultAccountName = `${applicationName}rf${environmentName}`.replace(/([-_])/gi, '').substring(0, 24)
  return storageAccountNameParameter || defaultAccountName
}
