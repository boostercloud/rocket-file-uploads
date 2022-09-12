# Files Rocket

This package is a configurable rocket to add a storage API to your Booster applications.

## Supported Providers

- Azure Provider
- Local Provider

## Overview

This rocket provides some methods to access files stores in your cloud provider:

- `presignedPut`: Returns a presigned put url and the necessary form params. With this url files can be uploaded directly to your provider.
- `presignedGet`: Returns a presigned get url to download a file. With this url files can be downloaded directly from your provider.
- `list`: Returns a list of files stored in the provider.

These methods may be used from a Command in your project secured via JWT Token.

This rocket also provides a Booster Event each time a file is uploaded.

## Usage

Install needed **dependency** packages:

```bash
npm install --save @boostercloud/rocket-file-uploads-core @boostercloud/rocket-file-uploads-types
```

Depending on your provider you could need some of the following **dependency** packages:

_Local Provider:_

```bash
npm install --save @boostercloud/rocket-file-uploads-local
```

_Azure Provider:_

```bash
npm install --save @boostercloud/rocket-file-uploads-azure
```

Also, you will need a **devDependency** in your project, depending on your provider:

_Local Provider:_

```bash
npm install --save-dev @boostercloud/rocket-file-uploads-local-infrastructure
```

_Azure Provider_

```bash
npm install --save-dev @boostercloud/rocket-file-uploads-azure-infrastructure
```

In your Booster config file, configure your `BoosterRocketFiles`:

```typescript
import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
import { BoosterRocketFiles } from '@boostercloud/rocket-file-uploads-core'
import { RocketFilesParams, RocketProviderPackageType } from '@boostercloud/rocket-file-uploads-types'

const directories = [
  {
    directory: 'folder01',
  },
  {
    directory: 'folder02',
  },
]

const azureRocketProviderPackage = '@boostercloud/rocket-file-uploads-azure' as RocketProviderPackageType
const localRocketProviderPackage = '@boostercloud/rocket-file-uploads-local' as RocketProviderPackageType

const exampleAzureParameters = {
  rocketProviderPackage: azureRocketProviderPackage,
  params: directories,
} as RocketFilesParams

const exampleLocalParameters = {
  rocketProviderPackage: localRocketProviderPackage,
  params: directories,
} as RocketFilesParams

Booster.configure('production', (config: BoosterConfig): void => {
  config.appName = 'test-rockets-files'
  config.providerPackage = '@boostercloud/framework-provider-azure'
  config.rockets = [buildRocket(config, exampleAzureParameters).rocketForAzure()]
})

Booster.configure('local', (config: BoosterConfig): void => {
  config.appName = 'test-rockets-files'
  config.providerPackage = '@boostercloud/framework-provider-local'
  config.rockets = [buildRocket(config, exampleLocalParameters).rocketForLocal()]
})

function buildRocket(config: BoosterConfig, params: RocketFilesParams): BoosterRocketFiles {
  return new BoosterRocketFiles(config, params)
}
```

Available parameters are:

- `rocketProviderPackage` Rocket package that handle your infrastructure.
- `params[directory]` A list of folders

### PresignedPut Usage

Create a command in your application and call the `presignedPut` method on the FileHandler class with the `directory` and `filename` you want to upload.

```javascript
import { Booster, Command, Returns } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { FileHandler } from '@boostercloud/rocket-file-uploads-core'

@Command({
  authorize: 'all',
})
export class FileUploadPut {
  public constructor(readonly directory: string, readonly fileName: string) {}

  @Returns(String)
  public static async handle(command: FileUploadPut, register: Register): Promise<string> {
    const boosterConfig = Booster.config
    const fileHandler = new FileHandler(boosterConfig)
    return await fileHandler.presignedPut(command.directory, command.fileName)
  }
}
```

Mutation example:

```graphql
mutation {
    FileUploadPut(input: {directory: "folder01", fileName: "3.txt"})
}
```

This returns the following payload:

```json
{
  "data": {
    "FileUploadPut": "https://yourapplication.blob.core.windows.net/rocketfiles/folder01%2F3.txt?sv=2020-10-02&st=2022-01-24T16%3A49%3A29Z&se=2022-01-24T16%3A50%3A55Z&sr=b&sp=w&sig=xxxxxxxxxx%3D"
  }
}
```

Note: For Local Provider, the url will be simpler:
```json
{
  "data": {
    "FileUploadPut": "rocketfiles/folder01%2F3.txt"
  }
}
```

That can be used in a new PUT rest call replacing the `AZ_URL` with the `FileUploadPut` field from the previous response:

```shell
#!/bin/bash

DATE_NOW=$(date -Ru | sed 's/\+0000/GMT/')
AZ_VERSION="2020-02-10"
FILE_PATH="~/1.txt"
AZ_URL="<FileUploadPut>"

curl -v -X PUT \
-H "Content-Type: application/octet-stream" \
-H "x-ms-date: ${DATE_NOW}" \
-H "x-ms-version: ${AZ_VERSION}" \
-H "x-ms-blob-type: BlockBlob" \
--data-binary @"${FILE_PATH}" \
"${AZ_URL}"
```

For Local Provider, the request could be:

```shell
#!/bin/bash

DATE_NOW=$(date -Ru | sed 's/\+0000/GMT/')
AZ_VERSION="2020-02-10"
FILE_PATH="~/1.txt"
AZ_URL="http://localhost:3000/rocketfiles/folder02/1.txt"

curl -v -X PUT \
-H "Content-Type: application/octet-stream" \
-H "x-ms-date: ${DATE_NOW}" \
-H "x-ms-version: ${AZ_VERSION}" \
-H "x-ms-blob-type: BlockBlob" \
--data-binary @"${FILE_PATH}" \
"${AZ_URL}"
```

Local Provider will write files on `./rocketfiles` folder

**Note**: Azure will return a 201 status but Local will return a 200

### PresignedGet Usage

Create a command in your application and call the `presignedGet` method on the FileHandler class with the `directory` and `filename` you want to get.

```javascript
import { Booster, Command, Returns } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { FileHandler } from '@boostercloud/rocket-file-uploads-core'

@Command({
  authorize: 'all',
})
export class FileUploadGet {
  public constructor(readonly directory: string, readonly fileName: string) {}

@Returns(String)
public static async handle(command: FileUploadGet, register: Register): Promise<string> {
  const boosterConfig = Booster.config
  const fileHandler = new FileHandler(boosterConfig)
  return await fileHandler.presignedGet(command.directory, command.fileName)
}
}
```

Mutation example:

```graphql
mutation {
    FileUploadGet(input: {directory: "folder01", fileName: "3.txt"})
}
```

This returns the following payload:

```json
{
  "data": {
    "FileUploadGet": "https://testrocketsfiles013rocke.blob.core.windows.net/rocketfiles/folder01%2F3.txt?sv=2020-10-02&st=2022-01-24T16%3A51%3A35Z&se=2022-01-24T16%3A53%3A02Z&sr=b&sp=r&sig=xxxxxxxx%3D"
  }
}
```

NOTE: For Local Provider, the url will be simpler:
```json
{
  "data": {
    "FileUploadGet": "rocketfiles/folder01"
  }
}
```


That can be used in a new GET rest call with the `FileUploadGet` field from the previous response:

```shell
curl --request GET '<FileUploadGet>'
```

### List Usage

Create a command in your application and call the `list` method on the FileHandler class with the `directory` you want to get the info and return the formatted results

```javascript
import { Booster, Command, Returns } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { FileHandler } from '@boostercloud/rocket-file-uploads-core'
import { ListItem } from '@boostercloud/rocket-file-uploads-types'

@Command({
  authorize: 'all',
})
export class FileUploadList {
  public constructor(readonly directory: string) {}

@Returns(String)
public static async handle(command: FileUploadList, register: Register): Promise<string> {
  const boosterConfig = Booster.config
  const fileHandler = new FileHandler(boosterConfig)
  const listItems = await fileHandler.list(command.directory) // todo Booster Returns support for Array<Type>
  return '[' + listItems.map((item: ListItem) => JSON.stringify(item)).join(',') + ']'
}
}
```

Mutation example:

```graphql
mutation {
  FileUploadList(input: {directory: "folder02"}) 
}
```

This returns the following payload:

```json
{
  "data": {
    "FileUploadList": "[{\"name\":\"folder02/x.txt\",\"properties\":{\"createdOn\":\"2022-01-22T19:21:00.000Z\",\"lastModified\":\"2022-01-22T19:21:00.000Z\",\"contentLength\":101,\"contentType\":\"text/plain\"},\"metadata\":\"\"},{\"name\":\"folder02/1.txt\",\"properties\":{\"createdOn\":\"2022-01-22T19:14:40.000Z\",\"lastModified\":\"2022-01-22T19:17:18.000Z\",\"contentLength\":9,\"contentType\":\"application/octet-stream\"},\"metadata\":\"\"},{\"name\":\"folder02/3.txt\",\"properties\":{\"createdOn\":\"2022-01-22T19:20:53.000Z\",\"lastModified\":\"2022-01-22T19:20:53.000Z\",\"contentLength\":9,\"contentType\":\"text/plain\"},\"metadata\":\"\"}]"
  }
}
```

Local Provider only return `lastModified` property for each file

### Uploaded files event Usage

Create a Booster ReadModel to provide a view of the files uploaded to a directory

```javascript
import { Projects, ReadModel } from '@boostercloud/framework-core'
import { ProjectionResult } from '@boostercloud/framework-types'
import { UploadedFileEntity } from '@boostercloud/rocket-file-uploads-types'

@ReadModel({
  authorize: 'all', // Specify authorized roles here. Use 'all' to authorize anyone
})
export class UploadedFileEntityReadModel {
  public constructor(public id: string, readonly metadata: unknown) {}

  @Projects(UploadedFileEntity, 'id')
  public static projectUploadedFileEntity(
    entity: UploadedFileEntity,
    currentUploadedFileEntityReadModel?: UploadedFileEntityReadModel
  ): ProjectionResult<UploadedFileEntity> {
    return new UploadedFileEntityReadModel(entity.id, entity.metadata)
  }
}
```

Mutation example:

```graphql
query{
    UploadedFileEntityReadModels(filter: {}){
        id
        metadata
    }
}
```

This returns the following payload:

```json
{
  "data": {
    "UploadedFileEntityReadModel": {
      "id": "7edd9f0331e61001553e619c3372279b",
      "metadata": {
        "invocationId": "xxxxxx",
        "blobTrigger": "rocketfiles/folder02/1.txt",
        "uri": "https://yourapplication.blob.core.windows.net/rocketfiles/folder02/1.txt",
        "properties": {
          "cacheControl": null,
          "contentDisposition": null,
          "contentEncoding": null,
          "contentLanguage": null,
          "length": 9,
          "contentMD5": "xxxxx",
          "contentType": "application/octet-stream",
          "eTag": "\"0xxxxxxx\"",
          "created": "2022-01-22T19:14:40+00:00",
          "lastModified": "2022-01-22T19:17:18+00:00",
          "blobType": 2,
          "leaseStatus": 2,
          "leaseState": 1,
          "leaseDuration": 0,
          "pageBlobSequenceNumber": null,
          "appendBlobCommittedBlockCount": null,
          "isServerEncrypted": true,
          "isIncrementalCopy": false,
          "standardBlobTier": 1,
          "rehydrationStatus": null,
          "premiumPageBlobTier": null,
          "blobTierInferred": true,
          "blobTierLastModifiedTime": null,
          "deletedTime": null,
          "remainingDaysBeforePermanentDelete": null
        },
        "metadata": {},
        "name": "folder02/1.txt"
      }
    }
  }
}
```

For Local

```shell
{
  "data": {
    "UploadedFileEntityReadModels": [
      {
        "id": "1",
        "metadata": {
          "name": "folder02/1.txt"
        }
      },
      {
        "id": "2",
        "metadata": {
          "name": "folder02/1.txt"
          "eventType": "rename"
        }
      },
      {
        "id": "3",
        "metadata": {
          "name": "folder02/1.txt"
        }
      }
    ]
  }
}
```

## Events

For each upload file a new event will be generated.

On Azure the event will be like this:

```json
{
    "version": 1,
    "kind": "snapshot",
    "requestID": "xxxxxx",
    "entityID": "xxxxx",
    "entityTypeName": "UploadedFileEntity",
    "typeName": "UploadedFileEntity",
    "value": {
        "id": "xxxxx",
        "metadata": {
            "invocationId": "xxxxxx",
            "blobTrigger": "rocketfiles/folder02/folder01_3.txt",
            "uri": "https://yourapplication.blob.core.windows.net/rocketfiles/folder02/folder01_3.txt",
            "properties": {
                "cacheControl": null,
                "contentDisposition": null,
                "contentEncoding": null,
                "contentLanguage": null,
                "length": 9,
                "contentMD5": "xxxx",
                "contentType": "text/plain",
                "eTag": "\"0xXXXXX\"",
                "created": "2022-01-22T19:20:53+00:00",
                "lastModified": "2022-01-22T19:20:53+00:00",
                "blobType": 2,
                "leaseStatus": 2,
                "leaseState": 1,
                "leaseDuration": 0,
                "pageBlobSequenceNumber": null,
                "appendBlobCommittedBlockCount": null,
                "isServerEncrypted": true,
                "isIncrementalCopy": false,
                "standardBlobTier": 1,
                "rehydrationStatus": null,
                "premiumPageBlobTier": null,
                "blobTierInferred": true,
                "blobTierLastModifiedTime": null,
                "deletedTime": null,
                "remainingDaysBeforePermanentDelete": null
            },
            "metadata": {},
            "name": "folder02/folder01_3.txt"
        }
    },
    "createdAt": "2022-01-22T19:21:04.220Z",
    "snapshottedEventCreatedAt": "2022-01-22T19:21:02.201Z",
}
```

On Local, the event will be:

```json
{
  "version": 1,
  "kind": "snapshot",
  "requestID": "xxxxxx",
  "entityID": "xxxxxx",
  "entityTypeName": "UploadedFileEntity",
  "typeName": "UploadedFileEntity",
  "value": {
    "id": "xxxxx",
    "metadata": {
      "fileName": "1.txt"
    }
  },
  "createdAt": "2022-01-24T16:08:10.139Z",
  "snapshottedEventCreatedAt": "2022-01-24T16:08:10.130Z"
}
```

## Azure Roles

For uploading files to Azure you need the `Storage Blob Data Contributor` role. This can be assigned to a user using the portal or with the next scripts:

First, check if you have the correct permissions:

```shell
ACCOUNT_NAME="<STORAGE ACCOUNT NAME>"
CONTAINER_NAME="<CONTAINER NAME>"

# use this to test if you have the correct permissions
az storage blob exists --account-name $ACCOUNT_NAME `
                        --container-name $CONTAINER_NAME `
                        --name blob1.txt --auth-mode login
```

If you don't have it, then run this script as admin:

```shell
ACCOUNT_NAME="<STORAGE ACCOUNT NAME>"
CONTAINER_NAME="<CONTAINER NAME>"

OBJECT_ID=$(az ad user list --query "[?mailNickname=='<YOUR MAIL NICK NAME>'].objectId" -o tsv)
STORAGE_ID=$(az storage account show -n $ACCOUNT_NAME --query id -o tsv)

az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee $OBJECT_ID \
    --scope "$STORAGE_ID/blobServices/default/containers/$CONTAINER_NAME"
```

## Security

Local Provider doesn't check `paths`. You should check that the `directory` and `files` passed as paratemers are valid.
