import { z } from "zod";

import { SingleFileSchema } from "./file-schema";

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
	content: z.string().optional(),
	fileId: z.string().optional(),
	status: z.string(),
	scheduledFor: z.date(),
	published: z.boolean(),
	profileId: z.string(),
	authorId: z.string(),
});

// export type PostsSchemaValues = z.infer<typeof PostsSchema>;

// Use to validate the form data before sending it to the server
export const PostFormSchema = z.union([
	z.object({
		content: z.string(),
		media: SingleFileSchema,
	}),
	z.object({
		content: z.string(),
	}),
	z.object({
		media: SingleFileSchema,
	}),
]);
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
