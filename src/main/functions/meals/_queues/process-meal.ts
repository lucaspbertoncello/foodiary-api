import { ProcessMealWorker } from "@application/workers/process-meal.worker";
import { lambdaSqsAdapter } from "@main/adapters/lambda-sqs.adapter";

export const handler = lambdaSqsAdapter({ handlerImpl: ProcessMealWorker });
