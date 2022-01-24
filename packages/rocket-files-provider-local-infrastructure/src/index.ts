import { InfrastructureRocket } from '@boostercloud/framework-provider-local-infrastructure'
import { Infra } from './infra'
import { RocketFilesParams } from '@boostercloud/rocket-files-types'

const AzureRocketFiles = (params: RocketFilesParams): InfrastructureRocket => ({
  mountStack: Infra.mountStack.bind(Infra, params),
})

export default AzureRocketFiles
