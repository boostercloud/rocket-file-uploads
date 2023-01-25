import { BoosterConfig } from '@boostercloud/framework-types'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { RemovalPolicy, Stack } from '@aws-cdk/core'
import { Function } from '@aws-cdk/aws-lambda'
import { Bucket, EventType } from '@aws-cdk/aws-s3'
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam'
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway'
import { Table } from '@aws-cdk/aws-dynamodb'
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources'
import { RocketUtils } from '@boostercloud/framework-provider-aws-infrastructure'
import { defaultCorsPreflightOptions, corsRules, createLambda, createEnvironment, methodOptions } from '../helpers'
import { methods } from '@boostercloud/rocket-file-uploads-aws/src/handlers/blob-service' // TODO: Extract this better?

export class Synth {
  public static mountStack(configuration: RocketFilesConfiguration, stack: Stack, config: BoosterConfig): Stack {
    configuration.userConfiguration.forEach((userConfiguration) => {
      console.log('***** Find application stack')
      const appName = config.resourceNames.applicationStack

      console.log('***** Find Api Gateway RestApi')
      const api = stack.node.tryFindChild(`${appName}-rest-api`) as RestApi

      console.log('***** Add new storage resource to RestApi')
      const storageResource = api.root.addResource('storage', { defaultCorsPreflightOptions })

      console.log('***** Create bucket: ' + userConfiguration.storageName)
      const bucket = new Bucket(stack, userConfiguration.storageName, {
        bucketName: userConfiguration.storageName,
        removalPolicy: RemovalPolicy.DESTROY,
        cors: corsRules,
      })
      console.log(`***** Create lambda function for bucket ${userConfiguration.storageName}`)
      const lambdaFunction = createLambda(
        stack,
        `${userConfiguration.storageName}-s3-operations`,
        'operations',
        createEnvironment({
          BUCKET: userConfiguration.storageName
        })
      )
      console.log(`***** Grant lambda permissions to read/write/delete to bucket: ${userConfiguration.storageName}`)
      bucket.grantReadWrite(lambdaFunction)
      bucket.grantDelete(lambdaFunction)

      console.log('***** Create lambda integration')
      const lambdaIntegration = new LambdaIntegration(lambdaFunction)

      Array.from(methods.keys()).forEach((method) => {
        console.log(`***** Create Api Gateway resource for method ${method}`)
        storageResource
          .addResource(method, { defaultCorsPreflightOptions })
          .addMethod('POST', lambdaIntegration, methodOptions)
      })

      console.log('***** Find Events Store')
      const eventsStore = stack.node.tryFindChild('events-store') as Table

      console.log(`***** Create lambda trigger function for bucket ${userConfiguration.storageName}`)
      const fileTriggerFunction = createLambda(stack, `${userConfiguration.storageName}-s3-trigger`, 'trigger', {
        EVENT_STORE_NAME: eventsStore.tableName,
      })
      console.log('***** Grant trigger lambda permissions to read/write/delete to DynamoDB')
      fileTriggerFunction.addToRolePolicy(
        new PolicyStatement({
          resources: [eventsStore.tableArn],
          actions: ['dynamodb:Put*'],
          effect: Effect.ALLOW,
        })
      )
      console.log(
        `***** Grant trigger lambda permissions to read/write/delete to bucket: ${userConfiguration.storageName}`
      )
      bucket.grantRead(fileTriggerFunction)

      console.log('***** Add event source listener to lambda')
      const uploadEvent = new S3EventSource(bucket, {
        events: [EventType.OBJECT_CREATED, EventType.OBJECT_REMOVED],
      })
      fileTriggerFunction.addEventSource(uploadEvent)

      const eventsHandlerLambda = stack.node.tryFindChild('events-main') as Function
      eventsHandlerLambda.addToRolePolicy(
        new PolicyStatement({
          resources: [bucket.bucketArn, bucket.bucketArn + '/*'],
          actions: ['s3:*'],
          effect: Effect.ALLOW,
        })
      )
    })

    return stack
  }

  public static async unmountStack(configuration: RocketFilesConfiguration, utils: RocketUtils): Promise<void> {
    configuration.userConfiguration.forEach(async (userConfiguration) => {
      await utils.s3.emptyBucket(userConfiguration.storageName)
    })
  }
}
