import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'
import * as AWS from 'aws-sdk'

export async function presignedPut(
  config: BoosterConfig,
  rocketFilesUserConfiguration: RocketFilesUserConfiguration,
  directory: string,
  fileName: string
): Promise<any> {
  const s3 = new AWS.S3()
  const params = {
    Bucket: rocketFilesUserConfiguration.storageName,
    Key: `${directory}/${fileName}`,
  }
  return s3.createPresignedPost(params)
}
