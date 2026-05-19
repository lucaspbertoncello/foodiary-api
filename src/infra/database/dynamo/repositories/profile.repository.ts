import { Profile } from "@application/entities/profile.entity";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";
import { ProfileItem } from "../items/profile.item";

@Injectable()
export class ProfileRepository {
  constructor(private readonly appConfig: AppConfig) {}

  public async save(profile: Profile): Promise<void> {
    const profileItem = ProfileItem.getInstanceFromEntity(profile);

    const command = new PutCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Item: profileItem.toItem(),
    });

    await dynamoClient.send(command);
  }
}
