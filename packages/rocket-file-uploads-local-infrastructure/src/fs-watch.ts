import * as fs from 'fs'
import * as path from 'path'
import { boosterRocketDispatcher } from '@boostercloud/framework-core'
import { functionID, isValidDirectory } from '@boostercloud/rocket-file-uploads-types'
import { rocketFunctionIDEnvVar } from '@boostercloud/framework-types'

export function fsWatch(storageName: string, containerName: string, port: number, directories: Array<string>): void {
  const _path = path.join(process.cwd(), storageName, containerName)
  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path, { recursive: true })
  }
  fs.watch(_path, { recursive: true }, async (eventType: 'rename' | 'change', filename: string) => {
    const parsed = path.parse(filename)
    if (new RegExp(/(^|[/\\])\../).test(filename)) return // ignore files starting with a dot
    if (!isValidDirectory(parsed.dir, directories)) return
    const name = path.join(storageName, containerName, filename)
    const uri = `http://localhost:${port}/${name}`
    await boosterRocketDispatcher({
      [rocketFunctionIDEnvVar]: functionID,
      uri: uri,
      name: name,
    })
  })
}
