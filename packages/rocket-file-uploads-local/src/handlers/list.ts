import { BoosterConfig } from '@boostercloud/framework-types'
import { ListItem, RocketFilesConfiguration } from '@boostercloud/rocket-file-uploads-types'
import * as fs from 'fs'
import * as path from 'path'

export async function list(
  _config: BoosterConfig,
  rocketFilesConfiguration: RocketFilesConfiguration,
  directory: string
): Promise<Array<ListItem>> {
  const result = [] as Array<ListItem>
  // TODO validate directory
  const _path = path.join(process.cwd(), rocketFilesConfiguration.containerName, directory)
  const files = fs.readdirSync(_path)
  files.forEach((file) => {
    const stats = fs.statSync(path.join(_path, file))
    result.push({
      name: file,
      properties: {
        lastModified: stats.ctime,
      },
    })
  })

  return result
}
