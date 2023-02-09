import { BoosterConfig } from '@boostercloud/framework-types'
import { ListItem, ListItemProperties, RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { s3 } from '../common'

export async function list(
    config: BoosterConfig,
    rocketFilesUserConfiguration: RocketFilesUserConfiguration,
    directory: string
  ): Promise<Array<ListItem>> {
    const bucketName = rocketFilesUserConfiguration.storageName + '-' + config.environmentName
    const params = {
        Bucket: bucketName,
        Prefix: directory
    };
  
    const data = await s3.listObjectsV2(params).promise()
    
    return data.Contents?.map((object) => { 
        return ({
        name: object.Key,
        properties: {
            createdOn: object.LastModified,
            lastModified: object.LastModified,
            contentLength: object.Size,
            contentType: undefined,
        } as ListItemProperties,
        metadata: undefined,
        }) as ListItem
    }) ?? []
}