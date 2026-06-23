import { Meal } from "@application/entities/meal.entity";
import { getImagePrompt } from "@infra/ai/prompts/get-image.prompt";
import { getTextPrompt } from "@infra/ai/prompts/get-text-prompt";
import { mealSchema } from "@infra/ai/schemas/meals.schema";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { downloadFileFromUrl } from "@shared/utils/download-file-from-url";
import OpenAI, { toFile } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { ChatCompletionContentPart } from "openai/resources";
import { MealsStorageGateway } from "./meals-storage.gateway";

@Injectable()
export class MealsAIGateway {
  private readonly client = new OpenAI();

  constructor(private readonly mealsStorageGateway: MealsStorageGateway) {}

  public async processMeal(
    meal: MealsAIGateway.ProcessMealParams,
  ): Promise<MealsAIGateway.ProcessMealResult> {
    const url = this.mealsStorageGateway.getFileUrl({ inputFileKey: meal.inputFileKey });

    if (meal.inputType === Meal.InputType.PICTURE) {
      const data = await this.callAi({
        mealId: meal.id,
        systemPrompt: getImagePrompt(),
        userMessageParts: [
          {
            type: "image_url",
            image_url: {
              url,
              detail: "high",
            },
          },
          {
            type: "text",
            text: `Meal date: ${meal.createdAt}`,
          },
        ],
      });

      return data;
    }

    const transcription = await this.transcribe({ url });

    return this.callAi({
      mealId: meal.id,
      systemPrompt: getTextPrompt(),
      userMessageParts: `Meal date: ${meal.createdAt}\n\nMeal: ${transcription}`,
    });
  }

  private async callAi({
    mealId,
    systemPrompt,
    userMessageParts,
  }: MealsAIGateway.CallAiParams): Promise<MealsAIGateway.CallAiResult> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: zodResponseFormat(mealSchema, "meal"),
      messages: [
        {
          role: "developer",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessageParts,
        },
      ],
    });

    const json = response.choices[0]?.message.content;

    if (!json) {
      throw new Error(`Failed processing meal ${mealId}`);
    }

    const { success, data } = mealSchema.safeParse(JSON.parse(json));

    if (!success) {
      throw new Error(`Failed processing meal ${mealId}`);
    }

    return data;
  }

  private async transcribe({ url }: { url: string }): Promise<string> {
    const audioFile = await downloadFileFromUrl({ url });

    const { text } = await this.client.audio.transcriptions.create({
      model: "whisper-1",
      file: await toFile(audioFile),
    });

    return text;
  }
}

export namespace MealsAIGateway {
  export type ProcessMealParams = Meal;
  export type ProcessMealResult = { name: string; icon: string; foods: Meal.Food[] };

  export type CallAiParams = {
    mealId: string;
    systemPrompt: string;
    userMessageParts: ChatCompletionContentPart[] | string;
  };
  export type CallAiResult = { name: string; icon: string; foods: Meal.Food[] };
}
