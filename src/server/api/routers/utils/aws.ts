import { env } from "@/env.mjs";
import { s3 } from "@/server/services/aws/client";

export async function deleteS3Object(key: string) {
  const resp = await s3.deleteObject({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
  });

  // Making the assumption that all media files will also have a thumbnail
  await s3.deleteObject({
    Bucket: `${env.AWS_BUCKET_NAME}-thumbnails`,
    Key: key,
  });

  return resp;
}

export function getS3ThumbnailUrl(key: string) {
  if (env.NODE_ENV === "development") {
    return `http://localhost:4566/${env.AWS_BUCKET_NAME}-thumbnails/${key}`;
  }

  return `https://${env.AWS_BUCKET_NAME}-thumbnails.s3.amazonaws.com/${key}`;
}

export function getS3Url(key: string) {
  if (env.NODE_ENV === "development") {
    return `http://localhost:4566/${env.AWS_BUCKET_NAME}/${key}`;
  }

  return `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
