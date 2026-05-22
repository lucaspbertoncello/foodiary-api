import { Meal } from "@application/entities/meal.entity";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";
import { MealItem } from "../items/meal.item";

@Injectable()
export class MealRepository {
  constructor(private readonly appConfig: AppConfig) {}

  public getPutCommandInput(meal: Meal): PutCommandInput {
    const profileItem = MealItem.getInstanceFromEntity(meal);
    return { TableName: this.appConfig.database.dynamoDb.tableName, Item: profileItem.toItem() };
  }

  public async save(meal: Meal): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(meal));

    await dynamoClient.send(command);
  }
}
