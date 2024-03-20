import { FileType } from "@prisma/client";
import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"video/mp4",
	"video/quicktime",
	"image/gif",
	"image/png",
	"text/plain",
	"image/webp",
];

// const MAX_IMAGE_SIZE = 4; // In MegaBytes
// const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
// 	const result = sizeInBytes / (1024 * 1024);
// 	return +result.toFixed(decimalsNum);
// };

// Use for prisma creation
export const CreateFileSchema = z.object({
	name: z.string(),
	key: z.string(),
	size: z.number(),
	mime: z.string(),
	type: z.nativeEnum(FileType),
	extension: z.string(),
	height: z.number().optional(),
	width: z.number().optional(),
});

// Use for forms
export const SingleFileSchema = z
	.any()
	.refine((file) => file?.length === 1, "File is required.")
	.refine(
		(file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type as string),
		"File type is not supported.",
	)
	.refine((file) => file?.[0]?.size ?? 0 <= 3000000, `Max file size is 3MB.`);

export type SingleFileValues = z.infer<typeof SingleFileSchema>;
