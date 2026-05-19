import { Goal } from "@application/entities/goal.entity";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";
import { GoalItem } from "../items/goal.item";

@Injectable()
export class GoalRepository {
  constructor(private readonly appConfig: AppConfig) {}

  public async save(goal: Goal): Promise<void> {
    const goalItem = GoalItem.fromEntity(goal);

    const command = new PutCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Item: goalItem.toItem(),
    });

    await dynamoClient.send(command);
  }
}
