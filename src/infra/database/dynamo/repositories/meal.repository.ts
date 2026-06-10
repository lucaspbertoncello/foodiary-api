import { Meal } from "@application/entities/meal.entity";
import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";
import { MealItem } from "../items/meal.item";

@Injectable()
export class MealRepository {
  constructor(private readonly appConfig: AppConfig) {}

  public getPutCommandInput(meal: Meal): PutCommandInput {
    const mealItem = MealItem.getInstanceFromEntity(meal);
    return { TableName: this.appConfig.database.dynamoDb.tableName, Item: mealItem.toItem() };
  }

  public async save(meal: Meal): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(meal));

    await dynamoClient.send(command);
  }

  public async findById({
    mealId,
    accountId,
  }: MealRepository.FindByIdInput): Promise<MealRepository.FindByIdOutput> {
    const command = new GetCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Key: {
        PK: MealItem.getPk({ mealId, accountId }),
        SK: MealItem.getSk({ mealId, accountId }),
      },
    });

    const { Item: meal } = await dynamoClient.send(command);

    if (!meal) {
      return null;
    }

    return MealItem.toDomain(meal as MealItem.ItemReturnType);
  }
}

export namespace MealRepository {
  export type FindByIdInput = { mealId: string; accountId: string };
  export type FindByIdOutput = Meal | null;
}
