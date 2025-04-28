/* eslint-disable indent */

import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { stripe } from "@/server/services/stripe/client";
import { NextRequest } from "next/server";
import Stripe from "stripe";

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
    return new Response("Bad request", {
      status: 400,
    });
  }

  if (!event.type.startsWith("customer.subscription")) {
    return new Response("OK", {
      status: 200,
    });
  }

  const subscription = event.data.object as Stripe.Subscription;

  // Handle the event
  switch (event.type) {
    case "customer.subscription.deleted":
    case "customer.subscription.paused":
    case "customer.subscription.resumed":
    case "customer.subscription.updated":
      // Update the teams subscription in your database.
      await db.team.update({
        data: {
          stripeSubscriptionStatus: subscription.status,
        },
        where: {
          stripeSubscriptionId: subscription.id,
        },
      });
      break;
    default:
      break;
  }

  return new Response("OK", {
    status: 200,
  });
}
