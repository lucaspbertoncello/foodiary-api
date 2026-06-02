import { Meal } from "@application/entities/meal.entity";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { MealItem } from "@infra/database/dynamo/items/meal.item";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class ListMealsByDateQuery {
  constructor(private readonly appConfig: AppConfig) {}

  public async execute({
    accountId,
    date,
  }: ListMealsByDateQuery.Input): Promise<ListMealsByDateQuery.Output> {
    const command = new QueryCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      IndexName: "GSI1",
      ProjectionExpression: "#GSI1PK, #id, #createdAt, #foods, #icons, #name",
      KeyConditionExpression: "#GSI1PK = :GSI1PK",
      FilterExpression: "#status = :status",
      ScanIndexForward: false,
      ExpressionAttributeNames: {
        "#GSI1PK": "GSI1PK",
        "#id": "id",
        "#createdAt": "createdAt",
        "#foods": "foods",
        "#icons": "icons",
        "#name": "name",
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":GSI1PK": MealItem.getGSI1PK({ accountId, createdAt: date }),
        ":status": Meal.Status.SUCCESS,
      },
    });

    const { Items = [] } = await dynamoClient.send(command);
    const items = Items as MealItem.ItemReturnType[];

    const meals: ListMealsByDateQuery.Output["meals"] = items.map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      foods: item.foods,
      icons: item.icons,
      name: item.name,
    }));

    return { meals };
  }
}

export namespace ListMealsByDateQuery {
  export type Input = { accountId: string; date: Date };

  export type Output = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icons: string;
      foods: Meal.Food[];
    }[];
  };
}
