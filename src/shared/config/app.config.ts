import { Injectable } from "@kernel/decorators/injectable.decorator";
import { env } from "@shared/config/env.config";

@Injectable()
export class AppConfig {
  public readonly auth: AppConfig.Auth;
  public readonly database: AppConfig.Database;
  public readonly storage: AppConfig.Storage;
  public readonly cdn: AppConfig.CDN;
  public readonly queue: AppConfig.Queue;
  public readonly devMode: boolean;

  constructor() {
    this.auth = {
      cognito: {
        clientId: env.COGNITO_CLIENT_ID,
        poolId: env.COGNITO_POOL_ID,
        clientSecret: env.COGNITO_CLIENT_SECRET,
      },
    };

    this.database = {
      dynamoDb: { tableName: env.MAIN_TABLE_NAME },
    };

    this.storage = {
      s3: { mealsBucket: { name: env.MEALS_BUCKET_NAME } },
    };

    this.cdn = {
      mealsCdn: { domainName: env.MEALS_CDN_DOMAIN_NAME },
    };

    this.queue = {
      sqs: { mealsQueue: { url: env.MEALS_QUEUE_URL } },
    };

    this.devMode = env.DEV_MODE;
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: { clientId: string; poolId: string; clientSecret: string };
  };

  export type Database = {
    dynamoDb: { tableName: string };
  };

  export type Storage = {
    s3: { mealsBucket: { name: string } };
  };

  export type CDN = {
    mealsCdn: { domainName: string };
  };

  export type Queue = {
    sqs: { mealsQueue: { url: string } };
  };
}
