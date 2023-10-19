import * as express from 'express'
import { requestFailed } from '../http'
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

  constructor(readonly storageName: string, readonly containerName: string, readonly directory: string) {
    this.router.put(`/${directory}/:fileName`, this.uploadFile.bind(this))
    this.router.get(`/${directory}/:fileName`, this.getFile.bind(this))
    this._path = path.join(process.cwd(), this.storageName, this.containerName)
  }

  public async getFile(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const expectedPath = this.getExpectedPath(req)
    const fileName = req.params.fileName
    const filePath = path.join(expectedPath, fileName)
    res.download(filePath)
  }

  public async uploadFile(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const expectedPath = this.getExpectedPath(req)
      if (!fs.existsSync(expectedPath)) {
        fs.mkdirSync(expectedPath, { recursive: true })
      }
      const fileName = req.params.fileName
      const filePath = path.join(expectedPath, fileName)
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

  private getExpectedPath(req: express.Request): string {
    return path.join(this._path, path.parse(req.url).dir)
  }
}
