import { Controller } from "@application/contracts/controller.contract";
import { HelloBody, helloSchema } from "@application/controllers/schemas/hello.schema";
import { HelloUseCase } from "@application/usecases/hello.usecase";
import { Schema } from "@kernel/decorators/schema.decorator";

@Schema(helloSchema)
export class HelloController extends Controller {
  constructor(private readonly helloUseCase: HelloUseCase) {
    super();
  }

  protected override async handle(
    request: Controller.HttpRequest<HelloBody>,
  ): Promise<Controller.HttpResponse<any>> {
    const result = await this.helloUseCase.execute({ email: "lucasbertoncello@gmail.com" });

    return {
      statusCode: 200,
      body: { result },
    };
  }
}
