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
  fs.watch(_path, { recursive: true, encoding: 'buffer' }, async (eventType: 'rename' | 'change', filename: Buffer | null) => {
    if (!filename) return
    const filenameStr = filename.toString()

    const parsed = path.parse(filenameStr)
    if (new RegExp(/(^|[/\\])\../).test(filenameStr)) return // ignore files starting with a dot
    if (!isValidDirectory(parsed.dir, directories)) return
    const uri = `http://localhost:${port}/${path.join(storageName, containerName, filenameStr)}`
    await boosterRocketDispatcher({
      [rocketFunctionIDEnvVar]: functionID,
      uri: uri,
      name: filenameStr,
    })
  })
}
