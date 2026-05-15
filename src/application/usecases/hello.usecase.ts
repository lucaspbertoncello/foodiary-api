import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class HelloUseCase {
  public async execute({ email }: HelloUseCase.Input): Promise<HelloUseCase.Output> {
    if (!email) {
      return { success: false };
    }

    return { success: true };
  }
}

export namespace HelloUseCase {
  export interface Input {
    email: string;
  }

  export interface Output {
    success: boolean;
  }
}
