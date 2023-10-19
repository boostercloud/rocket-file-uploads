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

_Azure Provider:_

```bash
npm install --save @boostercloud/rocket-file-uploads-azure
```

_Local Provider:_

```bash
npm install --save @boostercloud/rocket-file-uploads-local
```

Also, you will need a **devDependency** in your project, depending on your provider:

_Azure Provider_

```bash
npm install --save-dev @boostercloud/rocket-file-uploads-azure-infrastructure
```

_Local Provider:_

```bash
npm install --save-dev @boostercloud/rocket-file-uploads-local-infrastructure
```

In your Booster config file, configure your `BoosterRocketFiles`:

```typescript
import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
import { BoosterRocketFiles } from '@boostercloud/rocket-file-uploads-core'
import { RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'

const rocketFilesConfigurationDefault: RocketFilesUserConfiguration = {
  storageName: 'clientst',
  containerName: 'rocketfiles',
  directories: ['client1', 'client2'],
}

const rocketFilesConfigurationCms: RocketFilesUserConfiguration = {
  storageName: 'cmsst',
  containerName: 'rocketfiles',
  directories: ['cms1', 'cms2'],
}

const APP_NAME = 'test'

// Azure Config:
Booster.configure('production', (config: BoosterConfig): void => {
  config.appName = APP_NAME
  config.providerPackage = '@boostercloud/framework-provider-azure'
  config.rockets = [
    new BoosterRocketFiles(config, [rocketFilesConfigurationDefault, rocketFilesConfigurationCms]).rocketForAzure(),
  ]
})

// Local Config:
Booster.configure('local', (config: BoosterConfig): void => {
  config.appName = APP_NAME
  config.providerPackage = '@boostercloud/framework-provider-local'
  config.rockets = [
    new BoosterRocketFiles(config, [rocketFilesConfigurationDefault, rocketFilesConfigurationCms]).rocketForLocal(),
  ]
})

```

Available parameters are:

- `storageName`: Name of the storage repository.
- `containerName`: Directories container.
- `directories` A list of dirs to be watched, or [glob patterns](https://en.wikipedia.org/wiki/Glob_(programming))

> [!NOTE] Azure Provider will use `storageName` as the **Storage Account Name**. 
> Local Provider will use it as the **root folder name**

The structure created for Azure and the Local Provider will be:
>    * storage
>        * container
>            * directory

> [!NOTE] Azure and Local provider urls are not equals. For Local you will need to use:
> http://localhost:3000/storageName/containerName/filename.ext but for Azure:
> http://storageAccountUrl:3000/containerName/filename.ext


### PresignedPut Usage

#### Azure &  Local

Create a command in your application and call the `presignedPut` method on the FileHandler class with the `directory` and `filename` you want to upload on the storage.

The `storageName` parameter is optional. It will use the first storage if undefined.

```typescript
import { Booster, Command } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { FileHandler } from '@boostercloud/rocket-file-uploads-core'

@Command({
  authorize: 'all',
})
export class FileUploadPut {
  public constructor(readonly directory: string, readonly fileName: string, readonly storageName?: string) {}

  public static async handle(command: FileUploadPut, register: Register): Promise<string> {
    const boosterConfig = Booster.config
    const fileHandler = new FileHandler(boosterConfig, command.storageName)
    return await fileHandler.presignedPut(command.directory, command.fileName)
  }
}
```

Mutation example:

```graphql
mutation {
  FileUploadPut(input: {
    storageName: "clientst",
    directory: "client1",
    fileName: "myfile.txt"
  }
  )
}
```

This returns the following payload:

```json
{
  "data": {
    "FileUploadPut": "https://clientst.blob.core.windows.net/rocketfiles/client1/myfile.txt?<SAS>"
  }
}
```

Note: For Local Provider, the url will be simpler:

```json
{
  "data": {
    "FileUploadPut": "http://localhost:3000/clientst/rocketfiles/client1/myfile.txt"
  }
}
```

That can be used in a new PUT rest call replacing the `AZ_URL` with the `FileUploadPut` field from the previous response:

```shell
#!/bin/bash

DATE_NOW=$(date -Ru | sed 's/\+0000/GMT/')
AZ_VERSION="2020-02-10"
FILE_PATH="~/myfile.txt"
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
FILE_PATH="~/myfile.txt"
AZ_URL="http://localhost:3000/rocketfiles/folder02/myfile.txt"

curl -v -X PUT \
-H "Content-Type: application/octet-stream" \
-H "x-ms-date: ${DATE_NOW}" \
-H "x-ms-version: ${AZ_VERSION}" \
-H "x-ms-blob-type: BlockBlob" \
--data-binary @"${FILE_PATH}" \
"${AZ_URL}"
```

Local Provider will write files on `.<storageName>/rocketfiles` folder

**Note**: Azure will return a 201 status but Local will return a 200

### PresignedGet Usage

Create a command in your application and call the `presignedGet` method on the FileHandler class with the `directory` and `filename` you want to get on the storage.

The `storageName` parameter is optional. It will use the first storage if undefined.

```typescript
import { Booster, Command } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { FileHandler } from '@boostercloud/rocket-file-uploads-core'

@Command({
  authorize: 'all',
})
export class FileUploadGet {
  public constructor(readonly directory: string, readonly fileName: string, readonly storageName?: string) {}

  public static async handle(command: FileUploadGet, register: Register): Promise<string> {
    const boosterConfig = Booster.config
    const fileHandler = new FileHandler(boosterConfig, command.storageName)
    return await fileHandler.presignedGet(command.directory, command.fileName)
  }
}
```

Mutation example:

```graphql
mutation {
  FileUploadGet(input: {
    storageName: "clientst",
    directory: "client1",
    fileName: "myfile.txt"
  }
  )
}
```

This returns the following payload:

```json
{
  "data": {
    "FileUploadGet": "https://clientst.blob.core.windows.net/rocketfiles/folder01%2Fmyfile.txt?<SAS>"
  }
}
```

NOTE: For Local Provider, the url will be simpler:

```json
{
  "data": {
    "FileUploadGet": "http://localhost:3000/clientst/rocketfiles/client1/myfile.txt"
  }
}
```

That can be used in a new GET rest call with the `FileUploadGet` field from the previous response:

```shell
curl --request GET '<FileUploadGet>'
```

### List Usage

Create a command in your application and call the `list` method on the FileHandler class with the `directory` you want to get the info and return the formatted results.

The `storageName` parameter is optional. It will use the first storage if undefined.

```typescript
import { Booster, Command } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'
import { FileHandler } from '@boostercloud/rocket-file-uploads-core'
import { ListItem } from '@boostercloud/rocket-file-uploads-types'

@Command({
  authorize: 'all',
})
export class FileUploadList {
  public constructor(readonly directory: string, readonly storageName?: string) {}

  public static async handle(command: FileUploadList, register: Register): Promise<Array<ListItem>> {
    const boosterConfig = Booster.config
    const fileHandler = new FileHandler(boosterConfig, command.storageName)
    return await fileHandler.list(command.directory)
  }
}

```

Mutation example:

```graphql
mutation {
  FileUploadList(input: {
    storageName: "clientst",
    directory: "client1"
  }
  )
}
```

This returns the following payload in Azure:

```json
{
  "data": {
    "FileUploadList": [
      {
        "name": "client1/myfile.txt",
        "properties": {
          "createdOn": "2022-10-26T05:40:47.000Z",
          "lastModified": "2022-10-26T05:40:47.000Z",
          "contentLength": 6,
          "contentType": "text/plain"
        }
      }
    ]
  }
}
```

Local Provider payload:

```json
{
  "data": {
    "FileUploadList": [
      {
        "name": "client1/myfile.txt",
        "properties": {
          "lastModified": "2022-10-26T10:35:18.905Z"
        }
      }
    ]
  }
}
```

### Uploaded files event Usage

Create a Booster ReadModel to provide a view of the files uploaded to a directory

```typescript
import { Projects, ReadModel } from '@boostercloud/framework-core'
import { ProjectionResult } from '@boostercloud/framework-types'
import { UploadedFileEntity } from '@boostercloud/rocket-file-uploads-types'

@ReadModel({
  authorize: 'all',
})
export class UploadedFileEntityReadModel {
  public constructor(public id: string, readonly metadata: unknown) {
  }

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
query {
  ListUploadedFileReadModels(filter: {}) {
    items {
      id
      metadata
    }
  }
}
```

This returns the following payload:

```json
{
  "data": {
    "ListUploadedFileReadModels": {
      "items": [
        {
          "id": "f119ef635226888dd1bacd734f8955db",
      "metadata": {
      		// A bunch of fields (depending on Azure) 
        }
      ],
      "count": 1,
      "cursor": {
        "id": "1"
      }
    }
  }
}
```

For Local

```json
{
  "data": {
    "ListUploadedFileEntityReadModels": {
      "items": [
        {
          "id": "xxx",
          "metadata": {
            "uri": "http://localhost:3000/clientst/rocketfiles/client1/myfile.txt",
            "name": "client1/myfile.txt"
          }
        }
      ],
      "count": 1,
      "cursor": {
        "id": "1"
      }
    }
  }
}
```

## Events

For each upload file a new event will be generated.

On Azure, the event will be like this:

```json
{
  "version": 1,
  "kind": "snapshot",
  "superKind": "domain",
  "requestID": "xxx",
  "entityID": "xxxx",
  "entityTypeName": "UploadedFileEntity",
  "typeName": "UploadedFileEntity",
  "value": {
    "id": "xxx",
    "metadata": {
      // A bunch of fields (depending on Azure)
    }
  },
  "createdAt": "2022-10-26T10:23:36.562Z",
  "snapshottedEventCreatedAt": "2022-10-26T10:23:32.34Z",
  "entityTypeName_entityID_kind": "UploadedFileEntity-xxx-b842-x-8975-xx-snapshot",
  "id": "x-x-x-x-x",
  "_rid": "x==",
  "_self": "dbs/x==/colls/x=/docs/x==/",
  "_etag": "\"x-x-0500-0000-x\"",
  "_attachments": "attachments/",
  "_ts": 123456
}
```

On Local, the event will be:

```json
{
  "version": 1,
  "kind": "snapshot",
  "superKind": "domain",
  "requestID": "x",
  "entityID": "x",
  "entityTypeName": "UploadedFileEntity",
  "typeName": "UploadedFileEntity",
  "value": {
    "id": "x",
    "metadata": {
      "uri": "http://localhost:3000/clientst/rocketfiles/client1/myfile.txt",
      "name": "client1/myfile.txt"
    }
  },
  "createdAt": "2022-10-26T10:35:18.967Z",
  "snapshottedEventCreatedAt": "2022-10-26T10:35:18.958Z",
  "_id": "lMolccTNJVojXiLz"
}
```

## Azure Roles

> [!NOTE] Starting at version 0.31.0 this Rocket use **Managed Identities** instead of **Connection Strings**. Please, 
> check that you have the required permissions to assign roles https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal-managed-identity#prerequisites

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

### TODOs:
- Optional storage deletion when unmounting the stack. 
- Optional events, in case you don't want to store that information in the events-store.
- When deleting a file, save a deletion event in the events-store. Only uploads are stored at the moment.
