import { InfrastructureRocket } from '@boostercloud/framework-provider-azure-infrastructure'
import { Synth } from './synth/synth'
import { Functions } from './functions/functions'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'

const AzureRocketFiles = (configuration: RocketFilesConfiguration): InfrastructureRocket => ({
  mountStack: Synth.mountStack.bind(Synth, configuration),
  mountFunctions: Functions.mountFunctions.bind(Synth, configuration),
  getFunctionAppName: Functions.getFunctionAppName.bind(Synth, configuration),
})

export default AzureRocketFiles
