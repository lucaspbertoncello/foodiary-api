import { Goal } from "@application/entities/goal.entity";
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";
import { GoalItem } from "../items/goal.item";

@Injectable()
export class GoalRepository {
  constructor(private readonly appConfig: AppConfig) {}

  public getPutCommandInput(goal: Goal): PutCommandInput {
    const goalItem = GoalItem.getInstanceFromEntity(goal);
    return { TableName: this.appConfig.database.dynamoDb.tableName, Item: goalItem.toItem() };
  }

  public async save(goal: Goal): Promise<void> {
    const goalItem = GoalItem.getInstanceFromEntity(goal);

    const command = new PutCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Item: goalItem.toItem(),
    });

    await dynamoClient.send(command);
  }

  public async update(goal: Goal): Promise<void> {
    const { SK, PK, calories, carbohydrates, fats, proteins } = GoalItem.getInstanceFromEntity(goal).toItem();

    const command = new UpdateCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Key: {
        PK,
        SK,
      },

      UpdateExpression:
        "SET #calories = :calories, #carbohydrates = :carbohydrates, #fats = :fats, #proteins = :proteins",

      ExpressionAttributeNames: {
        "#calories": "calories",
        "#carbohydrates": "carbohydrates",
        "#fats": "fats",
        "#proteins": "proteins",
      },

      ExpressionAttributeValues: {
        ":calories": calories,
        ":carbohydrates": carbohydrates,
        ":fats": fats,
        ":proteins": proteins,
      },

      ReturnValues: "NONE",
    });

    await dynamoClient.send(command);
  }

  public async findByAccountId({ accountId }: { accountId: string }): Promise<Goal | null> {
    const command = new GetCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Key: {
        PK: GoalItem.getPk({ accountId }),
        SK: GoalItem.getSk({ accountId }),
      },
    });

    const { Item: goal } = await dynamoClient.send(command);

    if (!goal) {
      return null;
    }

    return GoalItem.toDomain(goal as GoalItem.ItemReturnType);
  }
}
