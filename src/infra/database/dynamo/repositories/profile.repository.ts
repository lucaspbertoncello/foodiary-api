import { Profile } from "@application/entities/profile.entity";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
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
}
