// When this route is hit, it will send a message to the Discord channel. Saying that a user has signed up.

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const discordWebhookUrl =
		"https://discord.com/api/webhooks/1229337363197726730/ZWRDCPTYgKt11KU0ETPUI6Q0i6YTQ6ea0humJk4djfnQgtfiHwaK4wjb4czAWjHOrp3-";

	const body = await req.text();

	if (body === null) {
		return new Response("Bad request", {
			status: 400,
		});
	}

	await fetch(discordWebhookUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content: `A user has signed up!`,
		}),
	});

	return new Response("OK", {
		status: 200,
	});
}
