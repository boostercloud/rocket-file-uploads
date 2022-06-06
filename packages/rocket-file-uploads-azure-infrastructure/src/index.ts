import { InfrastructureRocket } from '@boostercloud/framework-provider-azure-infrastructure'
import { Synth } from './synth/synth'
import { Functions } from './functions/functions'
import { RocketFilesParams } from '@boostercloud/rocket-file-uploads-types'

const AzureRocketFiles = (params: RocketFilesParams): InfrastructureRocket => ({
  mountStack: Synth.mountStack.bind(Synth, params),
  mountFunctions: Functions.mountFunctions.bind(Synth, params),
  getFunctionAppName: Functions.getFunctionAppName.bind(Synth, params),
})

export default AzureRocketFiles
