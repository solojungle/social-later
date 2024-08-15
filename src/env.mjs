import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DATABASE_URL: z
			.string()
			.url()
			.refine(
				(str) => !str.includes("YOUR_MYSQL_URL_HERE"),
				"You forgot to change the default URL",
			),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		NEXTAUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string()
				: z.string().optional(),
		NEXTAUTH_URL: z.preprocess(
			// This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
			// Since NextAuth.js automatically uses the VERCEL_URL if present.
			(str) => process.env.VERCEL_URL ?? str,
			// VERCEL_URL doesn't include `https` so it cant be validated as a URL
			process.env.VERCEL ? z.string() : z.string().url(),
		),
		// Add ` on ID and SECRET if you want to make sure they're not empty
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		YOUTUBE_CLIENT_ID: z.string(),
		YOUTUBE_CLIENT_SECRET: z.string(),
		YOUTUBE_CALLBACK_URL: z.string(),
		STRIPE_SECRET_KEY: z.string(),
		STRIPE_WEBHOOK_SECRET: z.string(),
		TWITTER_CLIENT_ID: z.string(),
		TWITTER_CLIENT_SECRET: z.string(),
		TWITTER_CALLBACK_URL: z.string(),
		TWITTER_APP_SECRET: z.string(),
		TWITTER_APP_KEY: z.string(),
		TWITTER_ACCESS_TOKEN: z.string(),
		TWITTER_ACCESS_SECRET: z.string(),
		DOPPLER_ENVIRONMENT: z.string(),
		AWS_ACCESS_KEY_ID: z.string(),
		AWS_SECRET_ACCESS_KEY: z.string(),
		AWS_BUCKET_NAME: z.string(),
		AWS_REGION: z.string(),
		LINKEDIN_CLIENT_ID: z.string(),
		LINKEDIN_CLIENT_SECRET: z.string(),
		LINKEDIN_CALLBACK_URL: z.string(),
		SENDGRID_API_KEY: z.string(),
		SECRET_KNOCK_KEY: z.string(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_KNOCK_KEY: z.string(),
		NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID: z.string(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		NEXTAUTH_URL: process.env.NEXTAUTH_URL,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		YOUTUBE_CALLBACK_URL: process.env.YOUTUBE_CALLBACK_URL,
		YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
		YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
		TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
		TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
		TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL,
		TWITTER_APP_SECRET: process.env.TWITTER_APP_SECRET,
		TWITTER_APP_KEY: process.env.TWITTER_APP_KEY,
		TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
		TWITTER_ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET,
		DOPPLER_ENVIRONMENT: process.env.DOPPLER_ENVIRONMENT,
		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
		AWS_REGION: process.env.AWS_REGION,
		LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
		LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
		LINKEDIN_CALLBACK_URL: process.env.LINKEDIN_CALLBACK_URL,
		SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
		SECRET_KNOCK_KEY: process.env.SECRET_KNOCK_KEY,
		NEXT_PUBLIC_KNOCK_KEY: process.env.NEXT_PUBLIC_KNOCK_KEY,
		NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID:
			process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: true,
	/**
	 * Makes it so that empty strings are treated as undefined.
	 * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
