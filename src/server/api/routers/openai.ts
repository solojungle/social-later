import { openAiWhisperApiToCaptions } from "@remotion/openai-whisper";
import { z } from "zod";

import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { client } from "../../services/openai/client";

export const openaiRouter = createTRPCRouter({
	transcribeVideo: protectedProcedure
		.input(
			z.object({
				file: z.union([
					z.object({
						key: z.string(),
					}),
					z.object({
						id: z.string(),
					}),
				]),
				model: z.string(),
				language: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const where =
				"id" in input.file ? { id: input.file.id } : { key: input.file.key };

			const file = await ctx.db.file.findUnique({
				where,
			});

			if (!file) {
				return null;
			}

			// Files have to be smaller than 25 MB
			if (file.size > 25 * 1024 * 1024) {
				return null;
			}

			const fileUrl = `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.key}.${file.extension}`;

			const response = await fetch(fileUrl);

			const blob = await response.blob();

			const transcription = await client.audio.transcriptions.create({
				file: new File([blob], "audio-chunk", { type: "audio/mp4" }),
				model: input.model,
				language: input.language,
				response_format: "verbose_json",
				timestamp_granularities: ["word"],
			});

			const { captions } = openAiWhisperApiToCaptions({ transcription });

			return captions;
		}),
});
