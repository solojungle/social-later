import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { s3 } from "@/server/services/aws/client";

export const awsRouter = createTRPCRouter({
	getObjects: protectedProcedure.query(async () => {
		const listObjectsOutput = await s3.listObjectsV2({
			Bucket: env.AWS_BUCKET_NAME,
		});

		return listObjectsOutput.Contents ?? [];
	}),

	getStandardUploadPresignedUrl: protectedProcedure.mutation(async () => {
		// Can be used to generate a unique key for the object
		const key = crypto.randomUUID();

		const putObjectCommand = new PutObjectCommand({
			Bucket: env.AWS_BUCKET_NAME,
			Key: key,
		});

		const signedUrl = await getSignedUrl(s3, putObjectCommand);

		return { signedUrl, key };
	}),
});
