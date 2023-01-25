import { BlobService, RequestParams } from "./blob-service";

export async function presignedGet(parameters: RequestParams): Promise<string> {
    return new BlobService().presignedGetUrl(parameters)
}