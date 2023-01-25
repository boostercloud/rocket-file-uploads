import { BlobService, RequestParams } from "./blob-service";

export async function presignedPostUrl(parameters: RequestParams): Promise<any>  {
    return new BlobService().presignedPostUrl(parameters)
}