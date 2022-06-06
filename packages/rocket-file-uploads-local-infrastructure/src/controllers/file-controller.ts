import * as express from 'express'
import { requestFailed } from '../http'
import { containerName } from '@boostercloud/rocket-file-uploads-types'
import * as fs from 'fs'
import * as path from 'path'

export type APIResult =
  | { status: 'success'; result: unknown }
  | { status: 'failure'; code: number; title: string; reason: string }

const DEFAULT_MIME_TYPE = 'unknown' // Local always returns unknown
const DEFAULT_FILE_SIZE = 0 // Local always returns 0

export class FileController {
  public router: express.Router = express.Router()
  private readonly _path

  constructor(readonly directory: string) {
    this.router.put(`/${directory}/:fileName`, this.uploadFile.bind(this))
    this.router.get(`/${directory}/:fileName`, this.getFile.bind(this))
    this._path = path.join(process.cwd(), containerName, this.directory)
  }

  public async getFile(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const fileName = req.params.fileName
    const filePath = path.join(this._path, fileName)
    res.download(filePath)
  }

  public async uploadFile(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      if (!fs.existsSync(this._path)) {
        fs.mkdirSync(this._path, { recursive: true })
      }
      const fileName = req.params.fileName
      const filePath = path.join(this._path, fileName)
      const writeStream = fs.createWriteStream(filePath)
      req.pipe(writeStream)
      req.on('end', function () {
        const result = {
          status: 'success',
          result: {
            message: 'File uploaded',
            data: {
              name: fileName,
              mimeType: DEFAULT_MIME_TYPE,
              size: DEFAULT_FILE_SIZE,
            },
          },
        } as APIResult
        res.send(result)
      })

      writeStream.on('error', async function (e) {
        const err = e as Error
        await requestFailed(err, res)
        next(e)
      })
    } catch (e) {
      const err = e as Error
      await requestFailed(err, res)
      next(e)
    }
  }
}
