import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
	type DefaultSession,
	getServerSession,
	type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { api } from "@/trpc/server";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession["user"];
	}

	interface User {}
}

/**
 * Sends a notification to a Discord channel when a user signs up.
 */
async function notifyOnUserCreation() {
	const discordWebhookUrl =
		"https://discord.com/api/webhooks/1229337363197726730/ZWRDCPTYgKt11KU0ETPUI6Q0i6YTQ6ea0humJk4djfnQgtfiHwaK4wjb4czAWjHOrp3-";

	await fetch(discordWebhookUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content: `@here A user has signed up!`,
		}),
	});
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/login",
	},
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
			},
		}),
	},
	adapter: PrismaAdapter(db),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
	],
	// This can be used to configure the behaviour of the JWT signing and verification.
	// Like adding a stripe customer id to the user db model.
	events: {
		createUser: async ({ user }) => {
			// This is where you would send a welcome email
			// await sendWelcomeEmail();
			await notifyOnUserCreation();

			// It seems that knock also supports inline creation of users
			// But lets just keep this for now.
			await api.notification.createUser.mutate({
				userId: user.id,
			});
		},
	},
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
