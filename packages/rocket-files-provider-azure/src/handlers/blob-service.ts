import * as storage from '@azure/storage-blob'
import { containerName } from '@boostercloud/rocket-files-types'

/**
 * Write SasUrl requires `Storage Blob Data Contributor` role.
 * See https://azure.microsoft.com/it-it/blog/azure-storage-support-for-azure-ad-based-access-control-now-generally-available/
 */
export class BlobService {
  private readonly DEFAULT_PERMISSIONS = 'r'
  private readonly STORAGE_ACCOUNT_ENDPOINT = 'blob.core.windows.net'

  constructor(readonly storageAccount: string) {}

  public getBlobSasUrl(directory: string, fileName: string, permissions = this.DEFAULT_PERMISSIONS): string {
    const key = process.env['ROCKET_STORAGE_KEY'] ?? ''
    const sharedKeyCredential = new storage.StorageSharedKeyCredential(this.storageAccount, key)
    const blobServiceClient = new storage.BlobServiceClient(
      `https://${this.storageAccount}.${this.STORAGE_ACCOUNT_ENDPOINT}`,
      sharedKeyCredential
    )
    const blobName = `${directory}/${fileName}`
    const blobSAS = storage
      .generateBlobSASQueryParameters(
        {
          containerName,
          blobName,
          permissions: storage.BlobSASPermissions.parse(permissions),
          startsOn: new Date(),
          expiresOn: new Date(new Date().valueOf() + 86400),
        },
        sharedKeyCredential
      )
      .toString()

    const client = blobServiceClient.getContainerClient(containerName)
    const blobClient = client.getBlobClient(blobName)
    return blobClient.url + '?' + blobSAS
  }
}
