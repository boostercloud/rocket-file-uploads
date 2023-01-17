import { InfrastructureRocket } from '@boostercloud/framework-provider-aws-infrastructure'
import { Synth } from './synth/synth'
import { RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'

const AWSRocketFiles = (configuration: RocketFilesConfiguration): InfrastructureRocket => ({
  mountStack: Synth.mountStack.bind(Synth, configuration),
  unmountStack: Synth.unmountStack.bind(Synth, configuration),
})

export default AWSRocketFiles
