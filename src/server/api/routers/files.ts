import { z } from "zod";

import { env } from "@/env.mjs";
import { CreateFileSchema } from "@/schemas/file-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const filesRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				file: CreateFileSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const file = await ctx.db.file.create({
				data: {
					...input.file,
				},
			});

			return {
				...file,
				url: `https://${env.AWS_BUCKET_NAME}-media.s3.amazonaws.com/${file.key}.${file.extension}`,
				thumbnail: `https://${env.AWS_BUCKET_NAME}-media-thumbnails.s3.amazonaws.com/${file.key}.${file.extension}`,
			};
		}),

	get: protectedProcedure
		.input(
			z.object({
				key: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const file = await ctx.db.file.findUnique({
				where: {
					key: input.key,
				},
			});

			if (!file) {
				return null;
			}

			return {
				...file,
				url: `https://${env.AWS_BUCKET_NAME}-media.s3.amazonaws.com/${file.key}.${file.extension}`,
				thumbnail: `https://${env.AWS_BUCKET_NAME}-media-thumbnails.s3.amazonaws.com/${file.key}.${file.extension}`,
			};
		}),

	delete: protectedProcedure
		.input(
			z.object({
				key: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const file = await ctx.db.file.findUnique({
				where: {
					key: input.key,
				},
			});

			if (!file) {
				throw new Error("File not found");
			}

			await ctx.db.file.delete({
				where: {
					key: input.key,
				},
			});

			return file;
		}),
});
