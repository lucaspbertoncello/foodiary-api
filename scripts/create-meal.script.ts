/* eslint-disable no-console */
import { promises as fs } from "fs";
import path from "path";

class CreateMealScript {
  private readonly signinUrl: string;
  private readonly mealsUrl: string;

  constructor(private readonly config: CreateMealScript.Config) {
    this.signinUrl = `${config.apiBaseUrl}/auth/signin`;
    this.mealsUrl = `${config.apiBaseUrl}/meals`;
  }

  public async run({ filePath, fileType }: CreateMealScript.RunParams): Promise<void> {
    try {
      const { accessToken } = await this.signin();
      const { data, size, type } = await this.readFile({ filePath, fileType });
      const { url, fields } = await this.createMeal({ accessToken, fileSize: size, fileType: type });
      const form = this.buildFormData({ fields, fileData: data, filename: path.basename(filePath), fileType: type });

      await this.uploadToS3({ url, form });
    } catch (err) {
      console.error("Error during uploadFile:", err);
      throw err;
    }
  }

  private async signin(): Promise<CreateMealScript.SigninResponse> {
    console.log("Signing in");
    const res = await fetch(this.signinUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.config.credentials),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to sign in: ${res.status} ${res.statusText} - ${text}`);
    }

    return (await res.json()) as CreateMealScript.SigninResponse;
  }

  private async readFile({
    filePath,
    fileType,
  }: {
    filePath: string;
    fileType: CreateMealScript.FileType;
  }): Promise<CreateMealScript.FileData> {
    console.log(`Reading file from disk: ${filePath}`);
    const data = await fs.readFile(filePath);
    return {
      data,
      size: data.length,
      type: fileType,
    };
  }

  private async createMeal({
    accessToken,
    fileSize,
    fileType,
  }: {
    accessToken: string;
    fileSize: number;
    fileType: string;
  }): Promise<CreateMealScript.PresignDecoded> {
    console.log(`Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
    const res = await fetch(this.mealsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText} - ${text}`);
    }

    const json = (await res.json()) as CreateMealScript.PresignResponse;
    const decoded = JSON.parse(
      Buffer.from(json.uploadSignature, "base64").toString("utf-8"),
    ) as CreateMealScript.PresignDecoded;

    console.log("Received presigned POST data");
    return decoded;
  }

  private buildFormData({
    fields,
    fileData,
    filename,
    fileType,
  }: {
    fields: Record<string, string>;
    fileData: Buffer;
    filename: string;
    fileType: string;
  }): FormData {
    console.log(`Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
    const form = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      form.append(key, value);
    }
    const blob = new Blob([new Uint8Array(fileData)], { type: fileType });
    form.append("file", blob, filename);
    return form;
  }

  private async uploadToS3({ url, form }: { url: string; form: FormData }): Promise<void> {
    console.log(`Uploading to S3 at ${url}`);
    const res = await fetch(url, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`S3 upload failed: ${res.status} ${res.statusText} - ${text}`);
    }

    console.log("Upload completed successfully");
  }
}

namespace CreateMealScript {
  export type Config = {
    apiBaseUrl: string;
    credentials: SigninRequest;
  };

  export type SigninRequest = {
    account: {
      email: string;
      password: string;
    };
  };

  export type SigninResponse = {
    accessToken: string;
    refreshToken: string;
  };

  export type PresignResponse = {
    uploadSignature: string;
  };

  export type PresignDecoded = {
    url: string;
    fields: Record<string, string>;
  };

  export type FileType = "audio/m4a" | "image/jpeg";

  export type FileData = {
    data: Buffer;
    size: number;
    type: string;
  };

  export type RunParams = {
    filePath: string;
    fileType: FileType;
  };
}

const script = new CreateMealScript({
  apiBaseUrl: "https://vatqlcj2rl.execute-api.sa-east-1.amazonaws.com",
  credentials: {
    account: {
      email: "lucasbertoncello6@gmail.com",
      password: "password123",
    },
  },
});

script
  .run({ filePath: path.resolve(__dirname, "assets", "cover.jpg"), fileType: "image/jpeg" })
  .catch(() => process.exit(1));
