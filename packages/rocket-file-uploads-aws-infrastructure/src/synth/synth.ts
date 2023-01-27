import { Effect, PolicyStatement } from '@aws-cdk/aws-iam'
import { Bucket, HttpMethods } from '@aws-cdk/aws-s3'
import { RemovalPolicy, Stack } from '@aws-cdk/core'
import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { Function } from '@aws-cdk/aws-lambda'
import { RocketUtils } from '@boostercloud/framework-provider-aws-infrastructure'

export const corsRules = [
  {
    allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.POST, HttpMethods.DELETE, HttpMethods.HEAD],
    allowedOrigins: ['*'],
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
    ],
    exposedHeaders: [
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
    ],
  },
]

export class Synth {
  public static mountStack(params: RocketFilesConfiguration, stack: Stack, config: BoosterConfig): void {
    params.userConfiguration.forEach((userConfig) => {
      const bucketName = userConfig.storageName + '-' + config.environmentName
      const bucket = new Bucket(stack, bucketName, {
        bucketName,
        removalPolicy: RemovalPolicy.DESTROY,
        cors: corsRules,
      })

      const eventsHandlerLambda = stack.node.tryFindChild('graphql-handler') as Function
      eventsHandlerLambda.addToRolePolicy(
        new PolicyStatement({
          resources: [bucket.bucketArn, bucket.bucketArn + '/*'],
          actions: ['s3:*'],
          effect: Effect.ALLOW,
        })
      )

      // TODO: add a lambda that listens to the bucket and sends the events to Booster.
    })
  }

  public static async unmountStack(_params: RocketFilesConfiguration, _utils: RocketUtils): Promise<void> {
    //utils.s3.emptyBucket()
  }
}
