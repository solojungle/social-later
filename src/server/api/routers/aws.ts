import { PutObjectCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { s3 } from "@/server/services/aws/client";

import { deleteS3Object } from "./utils/aws";

export const awsRouter = createTRPCRouter({
	getMultipartUploadPresignedUrl: protectedProcedure
		.input(z.object({ key: z.string(), filePartTotal: z.number() }))
		.mutation(async ({ input }) => {
			const { key, filePartTotal } = input;

			const uploadId = (
				await s3.createMultipartUpload({
					Bucket: env.AWS_BUCKET_NAME,
					Key: key,
				})
			).UploadId;

			if (!uploadId) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Could not create multipart upload",
				});
			}

			const urls: Promise<{ url: string; partNumber: number }>[] = [];

			for (let i = 1; i <= filePartTotal; i += 1) {
				const uploadPartCommand = new UploadPartCommand({
					Bucket: env.AWS_BUCKET_NAME,
					Key: key,
					UploadId: uploadId,
					PartNumber: i,
				});

				const url = getSignedUrl(s3, uploadPartCommand).then(
					(presignedUrl) => ({
						url: presignedUrl,
						partNumber: i,
					}),
				);

				urls.push(url);
			}

			return {
				uploadId,
				urls: await Promise.all(urls),
			};
		}),

	completeMultipartUpload: protectedProcedure
		.input(
			z.object({
				key: z.string(),
				uploadId: z.string(),
				parts: z.array(
					z.object({
						ETag: z.string(),
						PartNumber: z.number(),
					}),
				),
			}),
		)
		.mutation(async ({ input }) => {
			const { key, uploadId, parts } = input;

			const completeMultipartUploadOutput = await s3.completeMultipartUpload({
				Bucket: env.AWS_BUCKET_NAME,
				Key: key,
				UploadId: uploadId,
				MultipartUpload: {
					Parts: parts,
				},
			});

			return completeMultipartUploadOutput;
		}),

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
				Bucket: env.AWS_BUCKET_NAME,
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
			const resp = await deleteS3Object(input.key);

			return resp;
		}),
});
