import { Cors, CorsOptions } from '@aws-cdk/aws-apigateway'
import { HttpMethods } from '@aws-cdk/aws-s3'
import * as lambda from '@aws-cdk/aws-lambda'
import { Duration, Stack } from '@aws-cdk/core'
import * as path from 'path'

const allowedOriginHeaderForCors = {
  'method.response.header.Access-Control-Allow-Headers': true,
  'method.response.header.Access-Control-Allow-Methods': true,
  'method.response.header.Access-Control-Allow-Origin': true,
  'method.response.header.Access-Control-Allow-Credentials': true,
}

export const defaultCorsPreflightOptions: CorsOptions = {
  allowHeaders: ['*'],
  allowOrigins: Cors.ALL_ORIGINS,
  allowMethods: Cors.ALL_METHODS,
  allowCredentials: true,
}

export const methodOptions = {
  methodResponses: [
    {
      statusCode: '200',
      responseParameters: allowedOriginHeaderForCors,
    },
    {
      statusCode: '400',
      responseParameters: allowedOriginHeaderForCors,
    },
    {
      statusCode: '500',
      responseParameters: allowedOriginHeaderForCors,
    },
  ],
}

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

export const createLambda = (
  stack: Stack,
  name: string,
  lambdaDir: string,
  environment?: Record<string, string>
): lambda.Function => {
  return new lambda.Function(stack, name, {
    runtime: lambda.Runtime.NODEJS_14_X,
    timeout: Duration.minutes(15),
    memorySize: 1024,
    handler: 'index.handler',
    functionName: name,
    code: lambda.Code.fromAsset(path.join(__dirname, `functions/${lambdaDir}`)),
    environment,
  })
}

export const createEnvironment = (env: Record<string, string | undefined>): Record<string, string> => {
  const environment: Record<string, string> = {}
  Object.keys(env)
    .filter((key) => env[key] !== undefined)
    .forEach((key) => {
      environment[key] = env[key] as string
    })
  return environment
}
