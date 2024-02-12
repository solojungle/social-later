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
	media: z.array(MediaSchema),
	published: z.boolean(),
	profileId: z.string(),
	authorId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type PostsSchemaValues = z.infer<typeof PostsSchema>;
