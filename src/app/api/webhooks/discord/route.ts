// When this route is hit, it will send a message to the Discord channel. Saying that a user has signed up.
export async function POST() {
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

	return new Response("OK", {
		status: 200,
	});
}
