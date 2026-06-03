import { Meal } from "@application/entities/meal.entity";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "@infra/clients/s3.client";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";
import KSUID from "ksuid";

@Injectable()
export class MealsStorageGateway {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly logger: ConsoleLogger,
  ) {}

  public static generateInputFileKey({
    accountId,
    inputType,
  }: MealsStorageGateway.GenerateInputFileKeyParams): MealsStorageGateway.GenerateInputFileKeyResult {
    const extension = inputType === Meal.InputType.AUDIO ? "m4a" : "jpeg";
    const fileName = KSUID.randomSync().string;

    return `${accountId}/${fileName}.${extension}`;
  }

  public async createPresignedPost({
    file,
    mealId,
  }: MealsStorageGateway.CreatePresignedPostParams): Promise<MealsStorageGateway.CreatePresignedPostResult> {
    const { fileKey, fileSize, inputType } = file;

    const bucket = this.appConfig.storage.s3.mealsBucket.name;
    const FIVE_MIN_IN_SECS = 5 * 60;
    const extension = inputType === Meal.InputType.AUDIO ? "audio/m4a" : "image/jpeg";

    try {
      const { fields, url } = await createPresignedPost(s3Client, {
        Bucket: bucket,
        Key: fileKey,
        Expires: FIVE_MIN_IN_SECS,
        Fields: { "Content-type": extension, "x-amz-meta-mealid": mealId },
        Conditions: [
          { bucket },
          ["eq", "$key", fileKey],
          ["eq", "$Content-type", extension],
          ["content-length-range", fileSize, fileSize],
        ],
      });

      const uploadSignature = Buffer.from(JSON.stringify({ fields, url })).toString("base64");

      return { uploadSignature };
    } catch (error) {
      this.logger.error({
        message: "S3 presigned post creation failed",
        metadata: {
          service: "meals",
          operation: "s3_create_presigned_post",
          error,
        },
      });

      throw error;
    }
  }
}

export namespace MealsStorageGateway {
  export type FileFormat = "jpeg" | "m4a";
  export type FileKey = `${string}/${string}.${FileFormat}`;

  export type GenerateInputFileKeyParams = { accountId: string; inputType: Meal.InputType };
  export type GenerateInputFileKeyResult = FileKey;

  export type CreatePresignedPostParams = {
    file: {
      fileKey: FileKey;
      inputType: Meal.InputType;
      fileSize: number;
    };
    mealId: string;
  };
  export type CreatePresignedPostResult = { uploadSignature: string };
}
