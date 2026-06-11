import { MealFileUploadedEvent } from "@application/events/files/meal-file-uploaded.event";
import { lambdaS3Adapter } from "@main/adapters/lambda-s3.adapter";

export const handler = lambdaS3Adapter({ handlerImpl: MealFileUploadedEvent });
