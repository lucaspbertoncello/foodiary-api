import { Profile } from "@application/entities/profile.entity";
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";
import { ProfileItem } from "../items/profile.item";

@Injectable()
export class ProfileRepository {
  constructor(private readonly appConfig: AppConfig) {}

  public getPutCommandInput(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.getInstanceFromEntity(profile);
    return { TableName: this.appConfig.database.dynamoDb.tableName, Item: profileItem.toItem() };
  }

  public async save(profile: Profile): Promise<void> {
    const command = new PutCommand(this.getPutCommandInput(profile));

    await dynamoClient.send(command);
  }

  public async update(profile: Profile): Promise<void> {
    const { SK, PK, name, gender, birthDate, weight, height } =
      ProfileItem.getInstanceFromEntity(profile).toItem();

    const command = new UpdateCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Key: { PK, SK },
      UpdateExpression:
        "SET #name = :name, #gender = :gender, #gender = :gender, #birthdate = :birthdate, #height = :height, #weight = :weight",

      ExpressionAttributeNames: {
        "#name": "name",
        "#gender": "name",
        "#birthdate": "name",
        "#height": "name",
        "#weight": "name",
      },
      ExpressionAttributeValues: {
        ":name": name,
        ":gender": gender,
        ":birthdate": birthDate,
        ":height": height,
        ":weight": weight,
      },
    });

    await dynamoClient.send(command);
  }

  public async findByAccountId({ accountId }: { accountId: string }): Promise<Profile | null> {
    const command = new GetCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Key: {
        PK: ProfileItem.getPk({ accountId }),
        SK: ProfileItem.getSk({ accountId }),
      },
    });

    const { Item: profile } = await dynamoClient.send(command);

    if (!profile) {
      return null;
    }

    return ProfileItem.toDomain(profile as ProfileItem.ItemReturnType);
  }
}
