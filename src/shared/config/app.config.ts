import { Injectable } from "@kernel/decorators/injectable.decorator";
import { env } from "@shared/config/env.config";

@Injectable()
export class AppConfig {
  public readonly auth: AppConfig.Auth;

  constructor() {
    this.auth = {
      cognito: { clientId: env.COGNITO_CLIENT_ID, poolId: env.COGNITO_POOL_ID },
    };
  }
}

export namespace AppConfig {
  export type Auth = {
    cognito: { clientId: string; poolId: string };
  };
}
