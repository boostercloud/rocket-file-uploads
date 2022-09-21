import { InfrastructureRocket } from '@boostercloud/framework-provider-local-infrastructure'
import { Infra } from './infra'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'

const AzureRocketFiles = (configuration: RocketFilesConfiguration): InfrastructureRocket => ({
  mountStack: Infra.mountStack.bind(Infra, configuration),
})

export default AzureRocketFiles
