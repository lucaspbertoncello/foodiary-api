import { Injectable } from "@kernel/decorators/injectable.decorator";
import { env } from "@shared/config/env.config";

@Injectable()
export class AppConfig {
  public readonly auth: AppConfig.Auth;

  constructor() {
    this.auth = {
      cognito: {
        clientId: env.COGNITO_CLIENT_ID,
        poolId: env.COGNITO_POOL_ID,
        clientSecret: env.COGNITO_CLIENT_SECRET,
      },
    };
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: { clientId: string; poolId: string; clientSecret: string };
  };
}
