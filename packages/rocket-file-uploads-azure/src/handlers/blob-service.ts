import * as storage from '@azure/storage-blob'
import { ListItem } from '@boostercloud/rocket-file-uploads-types'

/**
 * Write SasUrl requires `Storage Blob Data Contributor` role.
 * See https://azure.microsoft.com/it-it/blog/azure-storage-support-for-azure-ad-based-access-control-now-generally-available/
 */
export class BlobService {
  private readonly DEFAULT_PERMISSIONS = 'r'
  private readonly DEFAULT_EXPIRES_ON_SECONDS = 86400
  private readonly STORAGE_ACCOUNT_ENDPOINT = 'blob.core.windows.net'

  constructor(readonly storageAccount: string) {}

  public getBlobSasUrl(
    containerName: string,
    directory: string,
    fileName: string,
    permissions = this.DEFAULT_PERMISSIONS,
    expiresOnSeconds = this.DEFAULT_EXPIRES_ON_SECONDS
  ): string {
    const key = BlobService.getKey()
    const blobName = BlobService.getBlobName(directory, fileName)
    const credentials = this.getCredentials(key)
    const client = this.getClient(credentials)
    const blobSASQueryParameters = BlobService.getBlobSASQueryParameters(
      containerName,
      blobName,
      permissions,
      expiresOnSeconds,
      credentials
    )
    const containerClient = client.getContainerClient(containerName)
    const blobClient = containerClient.getBlobClient(blobName)
    return blobClient.url + '?' + blobSASQueryParameters
  }

  public async listBlobFolder(containerName: string, directory: string): Promise<Array<ListItem>> {
    const key = BlobService.getKey()
    const credentials = this.getCredentials(key)
    const client = this.getClient(credentials)
    const containerClient = client.getContainerClient(containerName)
    const result = []
    for await (const blob of containerClient.listBlobsFlat({ prefix: directory, includeMetadata: true })) {
      const item = {
        name: blob.name,
        properties: {
          createdOn: blob.properties.createdOn,
          lastModified: blob.properties.lastModified,
          contentLength: blob.properties.contentLength,
          contentType: blob.properties.contentType,
        },
        metadata: blob.metadata,
      } as ListItem
      result.push(item)
    }
    return result
  }

  private getClient(sharedKeyCredential: storage.StorageSharedKeyCredential): storage.BlobServiceClient {
    return new storage.BlobServiceClient(
      `https://${this.storageAccount}.${this.STORAGE_ACCOUNT_ENDPOINT}`,
      sharedKeyCredential
    )
  }

  private getCredentials(key: string): storage.StorageSharedKeyCredential {
    return new storage.StorageSharedKeyCredential(this.storageAccount, key)
  }

  private static getKey(): string {
    return process.env['ROCKET_STORAGE_KEY'] ?? ''
  }
  private static getBlobName(directory: string, fileName: string): string {
    return `${directory}/${fileName}`
  }

  private static getBlobSASQueryParameters(
    containerName: string,
    blobName: string,
    permissions: string,
    expiresOnSeconds: number,
    sharedKeyCredential: storage.StorageSharedKeyCredential
  ): string {
    return storage
      .generateBlobSASQueryParameters(
        {
          containerName,
          blobName,
          permissions: storage.BlobSASPermissions.parse(permissions),
          startsOn: new Date(),
          expiresOn: new Date(new Date().valueOf() + expiresOnSeconds),
        },
        sharedKeyCredential
      )
      .toString()
  }
}
