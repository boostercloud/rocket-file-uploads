import { BlobService, RequestParams } from "./blob-service";

export async function removeFile(parameters: RequestParams): Promise<any>  {
    return new BlobService().removeFile(parameters)
}