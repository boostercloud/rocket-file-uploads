import { InfrastructureRocket } from '@boostercloud/framework-provider-aws-infrastructure'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import { Synth } from './synth/synth'

const AwsRocketFiles = (configuration: RocketFilesConfiguration): InfrastructureRocket => ({
  mountStack: Synth.mountStack.bind(null, configuration),
  unmountStack: Synth.unmountStack.bind(null, configuration),
})

export default AwsRocketFiles
