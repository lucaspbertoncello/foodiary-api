import { InvalidRefreshToken } from "@application/errors/application/invalid-refresh-token.error";
import {
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  GetTokensFromRefreshTokenCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "@infra/clients/cognito.client";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";
import { createHmac } from "node:crypto";

@Injectable()
export class AuthGateway {
  constructor(private readonly appConfig: AppConfig) {}

  public async signup({
    email,
    password,
    internalId,
  }: AuthGateway.SignupParams): Promise<AuthGateway.SignupResult> {
    const command = new SignUpCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      Password: password,
      SecretHash: this.getSecretHash({ email }),
      UserAttributes: [{ Name: "custom:internalId", Value: internalId }],
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if (!externalId) {
      throw new Error(`Cannot signup user: ${email}`);
    }

    return { externalId };
  }

  public async signin({ email, password }: AuthGateway.SigninParams): Promise<AuthGateway.SigninResult> {
    const command = new InitiateAuthCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash({ email }),
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult?.AccessToken || !AuthenticationResult.RefreshToken) {
      throw new Error(`Cannot authenticate user ${email}`);
    }

    return {
      accessToken: AuthenticationResult?.AccessToken,
      refreshToken: AuthenticationResult?.RefreshToken,
    };
  }

  public async refreshToken({
    refreshToken,
  }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
    try {
      const command = new GetTokensFromRefreshTokenCommand({
        ClientId: this.appConfig.auth.cognito.clientId,
        RefreshToken: refreshToken,
        ClientSecret: this.appConfig.auth.cognito.clientSecret,
      });

      const { AuthenticationResult } = await cognitoClient.send(command);

      if (!AuthenticationResult?.AccessToken || !AuthenticationResult.RefreshToken) {
        throw new Error(`Cannot refresh token.`);
      }

      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken,
      };
    } catch {
      throw new InvalidRefreshToken({});
    }
  }

  public async forgotPassword({
    email,
  }: AuthGateway.ForgotPasswordParams): Promise<AuthGateway.ForgotPasswordResult> {
    const command = new ForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      Username: email,
      SecretHash: this.getSecretHash({ email }),
    });

    await cognitoClient.send(command);
  }

  public async resetPassword({
    code,
    email,
    newPassword,
  }: AuthGateway.ResetPasswordParams): Promise<AuthGateway.ResetPasswordResult> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.appConfig.auth.cognito.clientId,
      ConfirmationCode: code,
      Password: newPassword,
      Username: email,
      SecretHash: this.getSecretHash({ email }),
    });

    await cognitoClient.send(command);
  }

  private getSecretHash({ email }: { email: string }): string {
    const { clientId, clientSecret } = this.appConfig.auth.cognito;
    return createHmac("SHA256", clientSecret).update(`${email}${clientId}`).digest("base64");
  }
}

export namespace AuthGateway {
  export type SignupParams = { email: string; password: string; internalId: string };
  export type SignupResult = { externalId: string };

  export type SigninParams = { email: string; password: string };
  export type SigninResult = { accessToken: string; refreshToken: string };

  export type RefreshTokenParams = { refreshToken: string };
  export type RefreshTokenResult = { accessToken: string; refreshToken: string };

  export type ForgotPasswordParams = { email: string };
  export type ForgotPasswordResult = void;

  export type ResetPasswordParams = { email: string; code: string; newPassword: string };
  export type ResetPasswordResult = void;
}
