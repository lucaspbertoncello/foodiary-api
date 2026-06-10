/* eslint-disable no-console */
import { promises as fs } from "fs";
import path from "path";

const API_URL = "https://vatqlcj2rl.execute-api.sa-east-1.amazonaws.com/meals";
const TOKEN =
  "eyJraWQiOiI4VElvSldXVVdxQzd5T0dhOTBPblZRS2hqRFhtQkxQSVhjNHJUY2F4czUwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxMzNjNWFhYS0zMGQxLTcwZTctZjg1NC1jYmExOGY2YWQ0ZGIiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnNhLWVhc3QtMS5hbWF6b25hd3MuY29tL3NhLWVhc3QtMV9BdnBxcVdLZlUiLCJjbGllbnRfaWQiOiIyaGltcDNhczI3bXVqdGRtMnMydWFzMTM1diIsIm9yaWdpbl9qdGkiOiIzZmM5NjYzZC02YzdjLTRlZWMtYjNlNS0yODU5OTA3MzVlYjUiLCJpbnRlcm5hbElkIjoiM0V4VVRYZW5JQ0V0aUdEMmdSd1ZHT2luYzFlIiwiZXZlbnRfaWQiOiJlZjg1MjM0NC01ODQzLTQ2NTQtOWQxZi1kZWZhZDg3OTAyNGYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzgxMTIwNjQ0LCJleHAiOjE3ODExNjM4NDQsImlhdCI6MTc4MTEyMDY0NCwianRpIjoiNTNkMTRiN2YtZmM5Yy00M2IwLTk5MDItZWM5ZTM1MWJhYmUzIiwidXNlcm5hbWUiOiIxMzNjNWFhYS0zMGQxLTcwZTctZjg1NC1jYmExOGY2YWQ0ZGIifQ.v1i3IRhxVbDYlp_-Vv4gODTwuNR3GbHOqVt4ORE8Hfvqvgj-lO57sJBMV_-VBQmL18iwkrf-59ewAjU5PJ3JcFmjZepeLrbykorUSQvdrC_hEIvYccKcRwpzkugbFcUthYD75186EUMTkSsBHZmlI_c3kkw2k9jeE8dVMyU0UYT0RoXnO-v07comhvJ93GjAXegfE75mV8BoFRvtLcJRBgTuoZdh24nQpDskbucnSOn3BcfI1sG4e-ozg9q5ZnrMbSf_k9NRcbFejsj2G6B4KgXrKNrgcymK7E9qhzdDBcSWB8uvKXPIp6pLCQsduwaS4ld0qxZ_-neCsYJBjATyEw";

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
