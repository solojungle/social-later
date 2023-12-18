/* eslint-disable indent */

import { NextRequest } from "next/server";

import { env } from "@/env.mjs";
import { stripe } from "@/server/services/stripe/client";

export async function POST(req: NextRequest) {
	const sig = req.headers.get("stripe-signature");
	if (sig === null) {
		return new Response("Bad request", {
			status: 400,
		});
	}

	const body = await req.text();

	let event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			sig,
			env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (err) {
		console.log(err);
		return new Response("Bad request", {
			status: 400,
		});
	}

	// Handle the event
	switch (event.type) {
		case "payment_intent.succeeded":
			// Fulfill the purchased goods or services.
			break;
		case "payment_intent.payment_failed":
			// Send an email or push notification to request another payment method.
			break;
		case "payment_intent.processing":
			// Wait for the initiated payment to succeed or fail.
			break;
		case "invoice.paid":
			// Continue to provision the subscription as payments continue to be made.
			// Store the status in your database and check when a user accesses your service.
			// This approach helps you avoid hitting rate limits.
			break;
		case "invoice.payment_failed":
			// The payment failed or the customer does not have a valid payment method.
			// The subscription becomes past_due. Notify your customer and send them to the
			// customer portal to update their payment information.
			break;
		case "customer.subscription.deleted":
			// Cancel the subscription.
			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	return new Response("OK", {
		status: 200,
	});
}
