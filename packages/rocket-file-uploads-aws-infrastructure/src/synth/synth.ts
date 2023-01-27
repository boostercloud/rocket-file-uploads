import { Effect, PolicyStatement } from '@aws-cdk/aws-iam'
import { Bucket, HttpMethods } from '@aws-cdk/aws-s3'
import { RemovalPolicy, Stack } from '@aws-cdk/core'
import { RocketUtils } from '@boostercloud/framework-provider-aws-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { Function } from '@aws-cdk/aws-lambda'

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
  public static mountStack(params: RocketFilesConfiguration, stack: Stack, _config: BoosterConfig): void {
    params.userConfiguration.forEach((userConfig) => {
      const bucket = new Bucket(stack, userConfig.containerName, {
        bucketName: userConfig.containerName,
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
    })
  }

  public static async unmountStack(params: RocketFilesConfiguration, utils: RocketUtils): Promise<void> {}
}
