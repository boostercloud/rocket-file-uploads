import { Binding, FunctionDefinition } from '@boostercloud/framework-provider-azure-infrastructure'
import { BoosterConfig } from '@boostercloud/framework-types'
import { containerName } from '@boostercloud/rocket-file-uploads-types'

export declare type BlobBinding = Binding & {
  path: string
  connection: string
}

export declare type BlobFunctionDefinition = FunctionDefinition<BlobBinding>

export class RocketFilesFileUploadedFunction {
  static getFunctionDefinition(config: BoosterConfig): BlobFunctionDefinition {
    return {
      name: 'fileupload',
      config: {
        bindings: [
          {
            type: 'blobTrigger',
            direction: 'in',
            name: 'blobUpload',
            path: `${containerName}/{name}`,
            connection: 'ROCKET_FILES_BLOB_STORAGE',
          },
        ],
        scriptFile: config.functionRelativePath,
        entryPoint: config.rocketDispatcherHandler.split('.')[1],
      },
    }
  }
}
