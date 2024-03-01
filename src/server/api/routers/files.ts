import { env } from "@/env.mjs";
import { CreateFileSchema } from "@/schemas/file-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const filesRouter = createTRPCRouter({
	create: protectedProcedure
		.input(CreateFileSchema)
		.mutation(async ({ ctx, input }) => {
			const file = await ctx.db.file.create({
				data: {
					...input,
				},
			});

			return {
				...file,
				url: `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.key}`,
			};
		}),
});
