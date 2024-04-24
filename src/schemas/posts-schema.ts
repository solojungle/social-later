import { z } from "zod";

import { DynamicSizeFileSchema, SingleFileSchema } from "./file-schema";

// export const MediaSchema = z.object({
// 	id: z.string(),
// 	name: z.string(),
// 	type: z.string(),
// 	url: z.string(),
// 	postId: z.string(),
// });

// export type MediaSchemaValues = z.infer<typeof MediaSchema>;

// Define Zod schema
export const PostsSchema = z.object({
	id: z.string(),
	title: z.string(),
	content: z.string().optional().nullish(),
	fileId: z.string().optional(),
	externalPostId: z.string(),
	status: z.string(),
	scheduledFor: z.date(),
	published: z.boolean(),
	profileId: z.string(),
	authorId: z.string(),
	url: z.string().optional().nullish(),
});

export type PostsSchemaValues = z.infer<typeof PostsSchema>;

// Use to validate the form data before sending it to the server
// export const PostFormSchema = z.union([
// 	z.object({
// 		content: z.string().min(1),
// 		media: SingleFileSchema,
// 	}),
// 	z.object({
// 		media: SingleFileSchema,
// 	}),
// 	z.object({
// 		content: z.string().min(1),
// 	}),
// ]);

// export const SingleFileSchema = z
// 	.any()
// 	.refine((file) => file?.length === 1, "File is required.")
// 	.refine(
// 		(file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
// 		"File type is not supported.",
// 	)
// 	.refine((file) => file[0]?.size <= 3000000, `Max file size is 3MB.`);

type DynamicPostFormSchemaParams = {
	size: number;
	acceptedTypes: string[];
};

export function DynamicPostFormSchema({
	size,
	acceptedTypes,
}: DynamicPostFormSchemaParams) {
	const Schema = DynamicSizeFileSchema(size, acceptedTypes);

	return z
		.object({
			content: z.string().min(1),
			media: z.any(),
			date: z.date(),
		})
		.partial()
		.refine(
			(data) => {
				// Must be the same day or in the future, time is irrelevant
				const date = data.date ? new Date(data.date) : undefined;
				const now = new Date();
				if (date) {
					// Set the time of both dates to 00:00:00
					date.setHours(0, 0, 0, 0);
					now.setHours(0, 0, 0, 0);
					return date >= now;
				}
				return false;
			},
			{
				message: "Date must be in the future",
				path: ["date"],
			},
		)
		.refine(
			(data) => {
				const hasContent =
					data.content !== undefined && data.content.length > 0;
				const hasMedia = data.media !== undefined && data.media.length > 0;

				if (!hasContent && !hasMedia) {
					return false;
				}

				return true;
			},
			{
				message: "You must provide either content, a valid media file, or both",
				path: ["media"],
			},
		)
		.refine(
			(data) => {
				const hasContent =
					data.content !== undefined && data.content.length > 0;
				const hasMedia = data.media !== undefined && data.media.length > 0;

				if (hasContent && hasMedia) {
					const files = data.media;
					if (files === undefined) {
						return false;
					}

					const result = Schema.safeParse(files);
					if (!result.success) {
						return false;
					}
				}

				return true;
			},
			{
				message: "Invalid file type or size",
				path: ["media"],
			},
		)
		.refine(
			(data) => {
				const hasMedia = data.media !== undefined && data.media.length > 0;
				const hasContent =
					data.content !== undefined && data.content.length > 0;

				if (!hasContent && hasMedia) {
					const files = data.media;
					if (files === undefined) {
						return false;
					}

					const result = Schema.safeParse(files);
					if (!result.success) {
						return false;
					}
				}

				return true;
			},
			{
				message: "Invalid file type or size",
				path: ["media"],
			},
		)
		.refine(
			(data) => {
				const hasContent =
					data.content !== undefined && data.content.length > 0;
				const hasMedia = data.media !== undefined && data.media.length > 0;

				if (hasContent && !hasMedia) {
					// If there are any other kind of validation needed on content, we do it here.
				}

				return true;
			},
			{
				message: "You must provide either content, a valid media file, or both",
				path: ["content"],
			},
		);
}

export const PostFormSchema = z
	.object({
		content: z.string().min(1),
		media: z.any(),
		date: z.date(),
	})
	.partial()
	.refine(
		(data) => {
			// Must be the same day or in the future, time is irrelevant
			const date = data.date ? new Date(data.date) : undefined;
			const now = new Date();
			if (date) {
				// Set the time of both dates to 00:00:00
				date.setHours(0, 0, 0, 0);
				now.setHours(0, 0, 0, 0);
				return date >= now;
			}
			return false;
		},
		{
			message: "Date must be in the future",
			path: ["date"],
		},
	)
	.refine(
		(data) => {
			const hasContent = data.content !== undefined && data.content.length > 0;
			const hasMedia = data.media !== undefined && data.media.length > 0;

			if (!hasContent && !hasMedia) {
				return false;
			}

			return true;
		},
		{
			message: "You must provide either content, a valid media file, or both",
			path: ["media"],
		},
	)
	.refine(
		(data) => {
			const hasContent = data.content !== undefined && data.content.length > 0;
			const hasMedia = data.media !== undefined && data.media.length > 0;

			if (hasContent && hasMedia) {
				const files = data.media;
				if (files === undefined) {
					return false;
				}

				const result = SingleFileSchema.safeParse(files);
				if (!result.success) {
					return false;
				}
			}

			return true;
		},
		{
			message: "Invalid file type or size",
			path: ["media"],
		},
	)
	.refine(
		(data) => {
			const hasMedia = data.media !== undefined && data.media.length > 0;
			const hasContent = data.content !== undefined && data.content.length > 0;

			if (!hasContent && hasMedia) {
				const files = data.media;
				if (files === undefined) {
					return false;
				}

				const result = SingleFileSchema.safeParse(files);
				if (!result.success) {
					return false;
				}
			}

			return true;
		},
		{
			message: "Invalid file type or size",
			path: ["media"],
		},
	)
	.refine(
		(data) => {
			const hasContent = data.content !== undefined && data.content.length > 0;
			const hasMedia = data.media !== undefined && data.media.length > 0;

			if (hasContent && !hasMedia) {
				// If there are any other kind of validation needed on content, we do it here.
			}

			return true;
		},
		{
			message: "You must provide either content, a valid media file, or both",
			path: ["content"],
		},
	);

export type PostFormSchemaValues = z.infer<typeof PostFormSchema>;

// The backend cannot receive a file array
// instead we upload the file to AWS S3 and save
// the url in the database.
export const TweetSchema = z.union([
	z.object({
		profileId: z.string(),
		content: z.string(),
		mediaId: z.string(),
	}),
	z.object({
		profileId: z.string(),
		content: z.string(),
	}),
	z.object({
		profileId: z.string(),
		mediaId: z.string(),
	}),
]);
export type TweetSchemaValues = z.infer<typeof TweetSchema>;

export const CreatePostSchema = z.union([
	z.object({
		content: z.string(),
		media: SingleFileSchema,
		// media: FilesSchema.array(),
	}),
	z.object({
		content: z.string(),
	}),
	z.object({
		media: SingleFileSchema,
	}),
]);

export type CreatePostSchemaValues = z.infer<typeof CreatePostSchema>;

export const AttachmentWithFileSchema = z.object({
	id: z.string(),
	fileId: z.string(),
	postId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	file: z.object({
		id: z.string(),
		name: z.string(),
		size: z.number(),
		mime: z.string(),
		extension: z.string(),
		type: z.string(),
		height: z.number().nullable(),
		width: z.number().nullable(),
		key: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
	}),
});

export type AttachmentWithFileValues = z.infer<typeof AttachmentWithFileSchema>;

export const PostWithAttachmentsSchema = PostsSchema.extend({
	attachment: AttachmentWithFileSchema.nullable().optional(),
	url: z.string().optional().nullish(),
	thumbnail: z.string().optional().nullish(),
});

export type PostWithAttachmentsSchemaValues = z.infer<
	typeof PostWithAttachmentsSchema
>;
