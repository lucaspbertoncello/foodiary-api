/* eslint-disable no-console */
import { promises as fs } from "fs";
import path from "path";

const API_URL = "https://vatqlcj2rl.execute-api.sa-east-1.amazonaws.com//meals";
const TOKEN =
  "eyJraWQiOiI4VElvSldXVVdxQzd5T0dhOTBPblZRS2hqRFhtQkxQSVhjNHJUY2F4czUwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyM2JjMWFkYS1kMDExLTcwYTctMjMxNC05OWQ4NzY1MWIxZDAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV9BdnBxcVdLZlUiLCJjbGllbnRfaWQiOiIyaGltcDNhczI3bXVqdGRtMnMydWFzMTM1diIsIm9yaWdpbl9qdGkiOiJiMTZiOTI0MS05ZDA5LTQxMzEtYWM4Zi0yMmU4NTk5NzY5YzAiLCJpbnRlcm5hbElkIjoiM0R5R01aSEs2SENLczNXb3ZwUkRTQ3lRNGdHIiwiZXZlbnRfaWQiOiJlMTZlNjlhNS1mNGYxLTRkYTEtYTcyYi1lMDIwOWEzNjU0YTgiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzc5NDgxODczLCJleHAiOjE3Nzk1MjUwNzMsImlhdCI6MTc3OTQ4MTg3NCwianRpIjoiODBkZTg0NzEtNWUzNC00OTc3LTk5YTUtMDczMDU5ODJkNTk5IiwidXNlcm5hbWUiOiIyM2JjMWFkYS1kMDExLTcwYTctMjMxNC05OWQ4NzY1MWIxZDAifQ.KTChHrlvJ9C3h_PmQ8R7oFAg6i68gLW-0tTJybJv4CjY7TevQk4yezIFYzgdLpDQsItp_XYaVTjc8sPvAjsh2caVzqljG6JykTQxErrarkQuZF084_EbC6ZMFLCozYMkYD-Ubn9B6IOf28c_c6PCKXXVG3R-q6NtKXmtH93w7JJBzZK9es2uZqBO4tUAKEBK_nliATSC4yIUVVbdY76Mdp6f88moFQiA5BNieHe4aEcCEGlthVomc05VpRvKJw2eHgd-KbV3O7uI_j3FpjrFqXkUKbJE_TNphzMaz2wX6i6vHIIzf0uQ8guwzK7hUUZpu7FDS28Xol0tGMIqokQ-cg";

interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readFile(
  filePath: string,
  type: "audio/m4a" | "image/jpeg",
): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type,
  };
}

async function createMeal(fileType: string, fileSize: number): Promise<IPresignDecoded> {
  console.log(`🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignResponse;
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, "base64").toString("utf-8"),
  ) as IPresignDecoded;

  console.log("✅ Received presigned POST data");
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  const blob = new Blob([new Uint8Array(fileData)], { type: fileType });
  form.append("file", blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText} — ${text}`);
  }

  console.log("🎉 Upload completed successfully");
}

async function uploadFile(filePath: string, fileType: "audio/m4a" | "image/jpeg"): Promise<void> {
  try {
    const { data, size, type } = await readFile(filePath, fileType);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error("❌ Error during uploadFile:", err);
    throw err;
  }
}

uploadFile(path.resolve(__dirname, "assets", "cover.jpg"), "image/jpeg").catch(() => process.exit(1));
