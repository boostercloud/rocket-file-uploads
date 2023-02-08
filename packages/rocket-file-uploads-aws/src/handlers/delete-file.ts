import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'

export async function deleteFile(
  config: BoosterConfig, 
  rocketFilesUserConfiguration: RocketFilesUserConfiguration, 
  directory: string, 
  fileName: string
): Promise<boolean> {
  const bucketName = rocketFilesUserConfiguration.storageName + '-' + config.environmentName
  const params = {
    Bucket: bucketName,
    Key: `${directory}/${fileName}`,
  }
  
  const result = await s3.deleteObject(params).promise()
  return Boolean(result.$response.error) === false
}
