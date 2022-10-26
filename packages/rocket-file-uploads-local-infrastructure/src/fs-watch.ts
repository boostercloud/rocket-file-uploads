import * as fs from 'fs'
import * as path from 'path'
import { boosterRocketDispatcher } from '@boostercloud/framework-core'

export function fsWatch(storagerName: string, containerName: string, directory: string): void {
  const _path = path.join(process.cwd(), storagerName, containerName, directory)
  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path, { recursive: true })
  }
  fs.watch(_path, async (eventType: 'rename' | 'change', filename: string) => {
    const uri = path.join(storagerName, containerName, directory, filename)
    const name = path.join(directory, filename)
    await boosterRocketDispatcher({
      uri: uri,
      name: name,
    })
  })
}
