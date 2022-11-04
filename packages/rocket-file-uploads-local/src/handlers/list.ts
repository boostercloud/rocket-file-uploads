import { BoosterConfig } from '@boostercloud/framework-types'
import { ListItem, RocketFilesUserConfiguration } from '@boostercloud/rocket-file-uploads-types'
import * as fs from 'fs'
import * as path from 'path'

export async function list(
  _config: BoosterConfig,
  rocketFilesUserConfiguration: RocketFilesUserConfiguration,
  directory: string
): Promise<Array<ListItem>> {
  const result = [] as Array<ListItem>
  // TODO validate directory
  const _path = path.join(
    process.cwd(),
    rocketFilesUserConfiguration.storageName,
    rocketFilesUserConfiguration.containerName,
    directory
  )
  const files = fs.readdirSync(_path)
  files.forEach((file) => {
    const stats = fs.statSync(path.join(_path, file))
    const name = path.join(directory, file)
    result.push({
      name: name,
      properties: {
        lastModified: stats.ctime,
      },
    })
  })

  return result
}
