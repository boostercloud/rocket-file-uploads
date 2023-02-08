import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'

export async function presignedPut(
  config: BoosterConfig,
  rocketFilesUserConfiguration: RocketFilesUserConfiguration,
  directory: string,
  fileName: string
): Promise<any> {
  const bucketName = rocketFilesUserConfiguration.storageName + '-' + config.environmentName
  const params = {
    Bucket: bucketName,
    Fields: {
      Key: `${directory}/${fileName}`,
    },
  }
  return s3.createPresignedPost(params)
}
