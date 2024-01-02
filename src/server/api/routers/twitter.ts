import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { twitter, twitterUserOAuth } from "@/server/services/twitter/client";

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

	generateOAuth2URL: protectedProcedure.query(async () => {
		return twitterUserOAuth.generateAuthURL({
			state: "B7D674278FDE4316FA91D1A7947C3BCDC417E193D324B47B11B46618B3",
			code_challenge_method: "s256",
		});
	}),
});
