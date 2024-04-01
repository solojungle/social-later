import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { s3 } from "@/server/services/aws/client";

export const awsRouter = createTRPCRouter({
	// getObjects: protectedProcedure.query(async () => {
	// 	const listObjectsOutput = await s3.listObjectsV2({
	// 		Bucket: env.AWS_BUCKET_NAME,
	// 	});

	// 	return listObjectsOutput.Contents ?? [];
	// }),

	getStandardUploadPresignedUrl: protectedProcedure
		.input(
			z.object({
				fileExtension: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			// Can be used to generate a unique key for the object
			const key = crypto.randomUUID();

			const putObjectCommand = new PutObjectCommand({
				Bucket: `${env.AWS_BUCKET_NAME}-media`,
				Key: `${key}.${input.fileExtension}`,
			});

			const signedUrl = await getSignedUrl(s3, putObjectCommand);

			return { signedUrl, key };
		}),

	deleteObject: protectedProcedure
		.input(
			z.object({
				key: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const resp = await s3.deleteObject({
				Bucket: `${env.AWS_BUCKET_NAME}-media`,
				Key: input.key,
			});

			// Making the assumption that all media files will also have a thumbnail :)
			await s3.deleteObject({
				Bucket: `${env.AWS_BUCKET_NAME}-media-thumbnails`,
				Key: input.key,
			});

			return resp;
		}),
});
