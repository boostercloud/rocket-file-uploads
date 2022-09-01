import * as fs from 'fs'
import * as path from 'path'
import { boosterRocketDispatcher } from '@boostercloud/framework-core'

export function fsWatch(containerName: string, directory: string): void {
  const _path = path.join(process.cwd(), containerName, directory)
  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path, { recursive: true })
  }
  fs.watch(_path, async (eventType: 'rename' | 'change', filename: string) => {
    await boosterRocketDispatcher({
      name: filename,
    })
  })
}
