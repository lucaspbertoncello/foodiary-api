import { OpenAI } from "openai";

import "dotenv/config";

class CallAiScript {
  private readonly client = new OpenAI();

  public async run(): Promise<void> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "developer",
          content: "You are Foodiary's meal analysis assistant. Explain nutrition information clearly and concisely.",
        },
        {
          role: "user",
          content: "Analyze a meal with rice, grilled chicken and salad.",
        },
      ],
    });

    console.log(JSON.stringify(response, null, 2));
  }
}

const script = new CallAiScript();

script.run();
