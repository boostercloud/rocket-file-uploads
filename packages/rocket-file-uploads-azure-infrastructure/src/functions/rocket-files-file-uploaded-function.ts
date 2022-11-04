import { Binding, FunctionDefinition } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'

export declare type BlobBinding = Binding & {
  path: string
  connection: string
}

export declare type BlobFunctionDefinition = FunctionDefinition<BlobBinding>

export class RocketFilesFileUploadedFunction {
  static getFunctionDefinition(
    config: BoosterConfig,
    containerName: string,
    storageName: string
  ): BlobFunctionDefinition {
    return {
      name: `fileupload_${storageName}`,
      config: {
        bindings: [
          {
            type: 'blobTrigger',
            direction: 'in',
            name: 'blobUpload',
            path: `${containerName}/{name}`,
            connection: storageName,
          },
        ],
        scriptFile: config.functionRelativePath,
        entryPoint: config.rocketDispatcherHandler.split('.')[1],
      },
    }
  }
}
