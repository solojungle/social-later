import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { twitter } from "@/server/services/twitter/client";

export const twitterRouter = createTRPCRouter({
	getPosts: protectedProcedure.query(async () => {}),
	createPost: protectedProcedure.mutation(async () => {
		try {
			const resp = await twitter.tweets.createTweet({
				text: "Hello World",
			});
			return resp;
		} catch (error) {
			console.log(error);
		}

		return null;
	}),
});
