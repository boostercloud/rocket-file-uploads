import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'
import * as AWS from 'aws-sdk'

/* TEST */

export async function presignedGet(
  config: BoosterConfig,
  rocketFilesUserConfiguration: RocketFilesUserConfiguration,
  directory: string,
  fileName: string
): Promise<string> {
  const s3 = new AWS.S3()
  const params = {
    Bucket: rocketFilesUserConfiguration.storageName,
    Key: `${directory}/${fileName}`,
  }
  return s3.getSignedUrl('getObject', params)
}
