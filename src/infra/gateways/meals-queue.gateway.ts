import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "@infra/clients/sqs.client";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class MealsQueueGateway {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly logger: ConsoleLogger,
  ) {}

  public async publishMessage({
    accountId,
    mealId,
  }: MealsQueueGateway.PublishMessageParams): Promise<MealsQueueGateway.PublishMessageResult> {
    try {
      this.logger.debug({
        message: "Publishing meal processing message",
        metadata: { service: "meals", operation: "sqs_publish_meal", accountId, mealId },
      });

      const command = new SendMessageCommand({
        QueueUrl: this.appConfig.queue.sqs.mealsQueue.url,
        MessageBody: JSON.stringify({ accountId, mealId }),
      });

      const { MessageId } = await sqsClient.send(command);

      this.logger.info({
        message: "Meal processing message published",
        metadata: { service: "meals", operation: "sqs_publish_meal", accountId, mealId, messageId: MessageId },
      });
    } catch (error) {
      this.logger.error({
        message: "Meal processing message publish failed",
        metadata: { service: "meals", operation: "sqs_publish_meal", accountId, mealId, error },
      });

      throw error;
    }
  }
}

export namespace MealsQueueGateway {
  export type PublishMessageParams = { accountId: string; mealId: string };
  export type PublishMessageResult = void;
}
