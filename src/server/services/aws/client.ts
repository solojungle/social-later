import { S3 } from "@aws-sdk/client-s3";

import { env } from "@/env.mjs";

const s3Config: any = {
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  region: env.AWS_REGION,
};

// Only set the endpoint if in development
if (env.NODE_ENV === "development") {
  s3Config.endpoint = "http://host.docker.internal:4566";
  s3Config.forcePathStyle = true; // ← important line to fix ENOTFOUND
}

export const s3 = new S3(s3Config);
