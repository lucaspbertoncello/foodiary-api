import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class SignupUsecase {
  public async execute({ email, password }: SignupUseCase.Input): Promise<SignupUseCase.Output> {
    return { accessToken: "123", refreshToken: "123" };
  }
}

export namespace SignupUseCase {
  export interface Input {
    email: string;
    password: string;
  }

  export interface Output {
    accessToken: string;
    refreshToken: string;
  }
}
