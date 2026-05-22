import { Profile } from "@application/entities/profile.entity";
import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { AccountItem } from "@infra/database/dynamo/items/account.item";
import { GoalItem } from "@infra/database/dynamo/items/goal.item";
import { ProfileItem } from "@infra/database/dynamo/items/profile.item";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class GetGoalAndProfileQuery {
  constructor(private readonly appConfig: AppConfig) {}

  async execute({ accountId }: GetGoalAndProfileQuery.Input): Promise<GetGoalAndProfileQuery.Output> {
    const command = new QueryCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Limit: 2,
      ProjectionExpression:
        "#name, #birthDate, #gender, #height, #weight, #calories, #proteins, #carbohydrates, #fats, #type",
      KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SK)",
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#SK": "SK",
        "#name": "name",
        "#birthDate": "birthDate",
        "#gender": "gender",
        "#height": "height",
        "#weight": "weight",
        "#calories": "calories",
        "#proteins": "proteins",
        "#carbohydrates": "carbohydrates",
        "#fats": "fats",
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":PK": AccountItem.getPk({ accountId }),
        ":SK": `${AccountItem.getPk({ accountId })}#`,
      },
    });

    const { Items = [] } = await dynamoClient.send(command);

    const profile = Items.find(
      (item) => item.type === ProfileItem.type,
    ) as GetGoalAndProfileQuery.Output["profile"];

    const goal = Items.find((item) => item.type === GoalItem.type) as GetGoalAndProfileQuery.Output["goal"];

    if (!goal || !profile) {
      throw new ResourceNotFound({ message: "Account not found." });
    }

    return {
      profile: {
        birthDate: profile.birthDate,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        name: profile.name,
      },
      goal: {
        calories: goal.calories,
        carbohydrates: goal.carbohydrates,
        fats: goal.fats,
        proteins: goal.proteins,
      },
    };
  }
}

export namespace GetGoalAndProfileQuery {
  export type Input = { accountId: string };

  export type Output = {
    profile: {
      name: string;
      birthDate: string;
      gender: Profile.Gender;
      weight: number;
      height: number;
    };

    goal: {
      calories: number;
      proteins: number;
      carbohydrates: number;
      fats: number;
    };
  };
}
