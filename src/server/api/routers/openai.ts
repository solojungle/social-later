import { openAiWhisperApiToCaptions } from "@remotion/openai-whisper";
import fs from "fs";
import { z } from "zod";

import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { client } from "../../services/openai/client";

const SUPPORTED_LANGUAGES = [
	"af",
	"ar",
	"hy",
	"az",
	"be",
	"bs",
	"bg",
	"ca",
	"zh",
	"hr",
	"cs",
	"da",
	"nl",
	"en",
	"et",
	"fi",
	"fr",
	"gl",
	"de",
	"el",
	"he",
	"hi",
	"hu",
	"is",
	"id",
	"it",
	"ja",
	"kn",
	"kk",
	"ko",
	"lv",
	"lt",
	"mk",
	"ms",
	"mr",
	"mi",
	"ne",
	"no",
	"fa",
	"pl",
	"pt",
	"ro",
	"ru",
	"sr",
	"sk",
	"sl",
	"es",
	"sw",
	"sv",
	"tl",
	"ta",
	"th",
	"tr",
	"uk",
	"ur",
	"vi",
	"cy",
];

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
				model: z.enum(["whisper-1"]),
				language: z.enum(["en", ...SUPPORTED_LANGUAGES]),
			}),
		)
		.query(async ({ ctx, input }) => {
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

			const transcription = await client.audio.transcriptions.create({
				file: fs.createReadStream(fileUrl),
				model: input.model,
				language: input.language,
				response_format: "verbose_json",
				timestamp_granularities: ["word"],
			});

			const { captions } = openAiWhisperApiToCaptions({ transcription });

			return captions;
		}),
});
