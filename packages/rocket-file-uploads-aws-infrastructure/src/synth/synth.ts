import { Effect, PolicyStatement } from '@aws-cdk/aws-iam'
import { Bucket, EventType, HttpMethods } from '@aws-cdk/aws-s3'
import { Duration, RemovalPolicy, Stack } from '@aws-cdk/core'
import { BoosterConfig } from '@boostercloud/framework-types'
import { functionID, RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { RocketUtils } from '@boostercloud/framework-provider-aws-infrastructure'
import * as lambda from '@aws-cdk/aws-lambda'
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources'
import { Table } from '@aws-cdk/aws-dynamodb'

export const corsRules = [
  {
    allowedMethods: [HttpMethods.POST],
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

function createLambda(
  stack: Stack,
  name: string,
  config: BoosterConfig,
  environment?: Record<string, string>
): lambda.Function {
  return new lambda.Function(stack, name, {
    runtime: lambda.Runtime.NODEJS_14_X,
    timeout: Duration.minutes(15),
    memorySize: 1024,
    handler: config.rocketDispatcherHandler,
    functionName: name,
    code: lambda.Code.fromAsset(config.userProjectRootPath),
    environment,
  })
}

export class Synth {
  public static mountStack(params: RocketFilesConfiguration, stack: Stack, config: BoosterConfig): void {
    params.userConfiguration.forEach((userConfig) => {
      // Create S3 bucket:
      const bucketName = userConfig.storageName + '-' + config.environmentName
      const bucket = new Bucket(stack, bucketName, {
        bucketName,
        removalPolicy: RemovalPolicy.DESTROY,
        cors: corsRules,
      })

      // Add Booster's GraphQL handler to the bucket's policy to allow it to read/write files:
      const eventsHandlerLambda = stack.node.tryFindChild('graphql-handler') as lambda.Function
      eventsHandlerLambda.addToRolePolicy(
        new PolicyStatement({
          resources: [bucket.bucketArn, bucket.bucketArn + '/*'],
          actions: ['s3:*'],
          effect: Effect.ALLOW,
        })
      )

      // Add Booster's 'events-main' lambda to the bucket's policy to allow it to read files. 
      // This is useful, for example, if you need to do extra work in a Booster event handler:
      const readHandlerLambda = stack.node.tryFindChild('events-main') as lambda.Function
      readHandlerLambda.addToRolePolicy(
        new PolicyStatement({
          resources: [bucket.bucketArn, bucket.bucketArn + '/*'],
          actions: ['s3:GetObject'],
          effect: Effect.ALLOW,
        })
      )


      // Create lambda to trigger on file upload/delete:
      const fileTriggerFunction = createLambda(stack, `${bucketName}-s3-trigger`, config, {
        BOOSTER_ROCKET_FUNCTION_ID: functionID,
        ...config.env,
        BOOSTER_ENV: config.environmentName,
      })

      // Add event source listener to lambda:
      const uploadEvent = new S3EventSource(bucket, {
        events: [EventType.OBJECT_CREATED],
      })
      fileTriggerFunction.addEventSource(uploadEvent)

      const eventsStore = stack.node.tryFindChild('events-store') as Table

      // Grant trigger lambda permissions to write to the events-store table in DynamoDB:
      fileTriggerFunction.addToRolePolicy(
        new PolicyStatement({
          resources: [eventsStore.tableArn],
          actions: ['dynamodb:Put*'],
          effect: Effect.ALLOW,
        })
      )
    })
  }

  public static async unmountStack(_params: RocketFilesConfiguration, _utils: RocketUtils): Promise<void> {
    // TODO: optionally delete the bucket?
  }
}
