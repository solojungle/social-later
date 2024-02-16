import { z } from "zod";

export const MediaSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	url: z.string(),
	postId: z.string(),
});

export type MediaSchemaValues = z.infer<typeof MediaSchema>;

// Define Zod schema
export const PostsSchema = z.object({
	id: z.string(),
	title: z.string(),
	content: z.string(),
	status: z.string(),
	scheduledFor: z.date(),
	media: z.array(MediaSchema).optional(),
	published: z.boolean(),
	profileId: z.string(),
	authorId: z.string(),
});

export type PostsSchemaValues = z.infer<typeof PostsSchema>;

export const CreatePostSchema = z.object({
	title: z.string(),
	content: z.string(),
	status: z.string(),
	scheduledFor: z.date(),
	media: z.array(MediaSchema).optional(),
	published: z.boolean(),
	profileId: z.string(),
	authorId: z.string(),
});

export type CreatePostSchemaValues = z.infer<typeof CreatePostSchema>;
