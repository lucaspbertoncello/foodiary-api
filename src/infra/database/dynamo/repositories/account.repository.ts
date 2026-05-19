import { Account } from "@application/entities/account.entity";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";
import { AccountItem } from "../items/account.item";

@Injectable()
export class AccountRepository {
  constructor(private readonly appConfig: AppConfig) {}

  public async findByEmail({ email }: { email: string }): Promise<Account | null> {
    const command = new QueryCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      IndexName: "GSI1",
      Limit: 1,
      // REGRA DAS CHAVES PARA RETORNAR O REGISTRO
      KeyConditionExpression: "#GSI1PK = :GSI1PK AND #GSI1SK = :GSI1SK ",
      ExpressionAttributeValues: {
        ":GSI1PK": AccountItem.getGSI1PK({ accountEmail: email }),
        ":GSI1SK": AccountItem.getGSI1SK({ accountEmail: email }),
      },
      ExpressionAttributeNames: {
        "#GSI1PK": "GSI1PK",
        "#GSI1SK": "GSI1SK",
      },
    });

    const { Items: [account] = [] } = await dynamoClient.send(command);

    if (!account) {
      return null;
    }

    return AccountItem.toDomain(account as AccountItem.ItemReturnType);
  }

  public async save(account: Account): Promise<void> {
    // transformamos a entidade de dominio em uma entidade para o banco
    const accountItem = AccountItem.getInstanceFromEntity(account);

    const command = new PutCommand({
      TableName: this.appConfig.database.dynamoDb.tableName,
      Item: accountItem.toItem(), // metodo que retorna todos os atributos necessarios para a insercao no banco (chaves e campos)
    });

    await dynamoClient.send(command);
  }
}
