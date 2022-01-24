import { BoosterConfig } from '@boostercloud/framework-types'
import { containerName } from '@boostercloud/rocket-files-types'

export async function presignedGet(config: BoosterConfig, directory: string, fileName: string): Promise<string> {
  return `http://localhost:3000/${containerName}/${directory}/${fileName}`
}
