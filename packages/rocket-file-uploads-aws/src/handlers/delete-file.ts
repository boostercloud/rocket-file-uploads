import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'
import * as AWS from 'aws-sdk'

export async function deleteFile(
  config: BoosterConfig, 
  rocketFilesUserConfiguration: RocketFilesUserConfiguration, 
  directory: string, 
  fileName: string
): Promise<boolean> {
  const s3 = new AWS.S3()
  const bucketName = rocketFilesUserConfiguration.storageName + '-' + config.environmentName
  const params = {
    Bucket: bucketName,
    Key: `${directory}/${fileName}`,
  }
  
  const result = await s3.deleteObject(params).promise()
  return result.$response.error == null
}
