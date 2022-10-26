import * as storage from '@azure/storage-blob'
import { azureStorageName, ListItem, RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { BoosterConfig } from '@boostercloud/framework-types'
import { DefaultAzureCredential } from '@azure/identity'
import { BlobSASSignatureValues } from '@azure/storage-blob'

/**
 * Write SasUrl requires `Storage Blob Data Contributor` role.
 * See https://azure.microsoft.com/it-it/blog/azure-storage-support-for-azure-ad-based-access-control-now-generally-available/
 */
export class BlobService {
  private readonly DEFAULT_PERMISSIONS = 'r'
  private readonly DEFAULT_EXPIRES_ON_SECONDS = 86400
  private readonly STORAGE_ACCOUNT_ENDPOINT = 'blob.core.windows.net'
  private readonly storageAccount: string
  private readonly blobServiceClient: storage.BlobServiceClient

  constructor(
    readonly configuration: BoosterConfig,
    readonly rocketFilesUserConfiguration: RocketFilesUserConfiguration
  ) {
    const storageAccountNameParameter = rocketFilesUserConfiguration.storageName
    this.storageAccount = azureStorageName(
      configuration.appName,
      configuration.environmentName,
      storageAccountNameParameter
    )

    this.blobServiceClient = new storage.BlobServiceClient(
      `https://${this.storageAccount}.${this.STORAGE_ACCOUNT_ENDPOINT}`,
      new DefaultAzureCredential()
    )
  }

  public async getBlobSasUrl(
    containerName: string,
    directory: string,
    fileName: string,
    permissions = this.DEFAULT_PERMISSIONS,
    expiresOnSeconds = this.DEFAULT_EXPIRES_ON_SECONDS
  ): Promise<string> {
    const filePath = `${directory}/${fileName}`
    const blobSASQueryParameters = await this.getBlobSASQueryParameters(
      containerName,
      filePath,
      permissions,
      expiresOnSeconds
    )

    return `${this.blobServiceClient.url}${containerName}/${filePath}?${blobSASQueryParameters}`
  }

  public async listBlobFolder(containerName: string, directory: string): Promise<Array<ListItem>> {
    const containerClient = this.blobServiceClient.getContainerClient(containerName)
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

  private async getBlobSASQueryParameters(
    containerName: string,
    blobName: string,
    permissions: string,
    expiresOnSeconds: number
  ): Promise<string> {
    const startsOn = new Date()
    const expiresOn = new Date(new Date().valueOf() + expiresOnSeconds)
    const userDelegationKey = await this.blobServiceClient.getUserDelegationKey(startsOn, expiresOn)

    const sasOptions: BlobSASSignatureValues = {
      containerName,
      blobName,
      permissions: storage.BlobSASPermissions.parse(permissions),
      protocol: storage.SASProtocol.HttpsAndHttp,
      startsOn: startsOn,
      expiresOn: expiresOn,
      version: '2018-11-09',
    }

    return storage.generateBlobSASQueryParameters(sasOptions, userDelegationKey, this.storageAccount).toString()
  }
}
