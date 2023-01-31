import { BoosterConfig } from '@boostercloud/framework-types'
import { ListItem, RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'
import * as AWS from 'aws-sdk'

export async function list(
    config: BoosterConfig,
    rocketFilesUserConfiguration: RocketFilesUserConfiguration,
    directory: string
  ): Promise<Array<ListItem>> {

    const s3 = new AWS.S3()
    const bucketName = rocketFilesUserConfiguration.storageName + '-' + config.environmentName
    const params = {
        Bucket: bucketName,
        Prefix: directory
    };
  
    const data = await s3.listObjectsV2(params).promise()
    if (!data.Contents) {
        return []
    }

    return data.Contents.map((object) => { 
        return ({
        name: object.Key,
        properties: {
            createdOn: object.LastModified,
            lastModified: object.LastModified,
            contentLength: object.Size,
            contentType: object.StorageClass,
        },
        metadata: object.StorageClass,
        }) as ListItem
    })
}