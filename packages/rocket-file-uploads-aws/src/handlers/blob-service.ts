import * as AWS from 'aws-sdk'
import { S3 } from 'aws-sdk'
import { presignedGet } from "./presigned-get"
import { presignedPostUrl } from "./presigned-put"
import { removeFile } from "./remove-file"

export type RequestParams = {
    bucketName: string
    fileAcl: string
    body: any
}

export const methods: Map<string, Function> = new Map([
    ['presignedGet', (requestParams: RequestParams) => presignedGet(requestParams)],
    ['presignedPost', (requestParams: RequestParams) => presignedPostUrl(requestParams)],
    ['remove', (requestParams: RequestParams) => removeFile(requestParams)],
  ])

// TODO: Rename this class? (is 'Blob' too Azure-ish?)
export class BlobService {
    
    private readonly s3 = new AWS.S3()

    public async presignedGetUrl(parameters: RequestParams): Promise<string> {
        const { key } = JSON.parse(parameters.body)
        const params = {
          Bucket: parameters.bucketName,
          Key: key,
        }

        return this.s3.getSignedUrlPromise('getObject', params)
    }

    public async presignedPostUrl(parameters: RequestParams): Promise<any> {
        const { key } = JSON.parse(parameters.body)
        const params = {
            Bucket: parameters.bucketName,
            Fields: {
            key: key,
            acl: parameters.fileAcl,
            },
        }
        const { url, fields } = this.s3.createPresignedPost(params)
                
        return {
            url: url,
            fields: fields,
            fileUrl: `https://${parameters.bucketName}.s3.amazonaws.com/${key}`
        }
    }

    public async removeFile(parameters: RequestParams): Promise<any> {
        const { key } = JSON.parse(parameters.body)
        const params: S3.Types.DeleteObjectRequest = {
            Bucket: parameters.bucketName,
            Key: key,
        }
        const { DeleteMarker } = await this.s3.deleteObject(params).promise()
        return { deleted: DeleteMarker }
    }
}