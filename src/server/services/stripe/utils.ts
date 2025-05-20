import Stripe from "stripe";

import { kv } from "../redis/utils";
import { stripe as stripeClient } from "./client";

export async function processEvent(event: Stripe.Event) {
  // Skip processing if the event isn't one I'm tracking (list of all events below)
  if (!isAllowedStripeEvent(event)) return;

  // All the events I track have a customerId
  const { customer: customerId } = event.data.object;

  // This helps make it typesafe and also lets me know if my assumption is wrong
  if (typeof customerId !== "string") {
    throw new Error(
      `[STRIPE HOOK][CANCER] ID isn't string.\nEvent type: ${event.type}`,
    );
  }

  await syncStripeDataToKV(customerId);
}

// The contents of this function should probably be wrapped in a try/catch
export async function syncStripeDataToKV(customerId: string) {
  // Fetch latest subscription data from Stripe
  const subscriptions = await stripeClient.subscriptions.list({
    customer: customerId,
    expand: ["data.default_payment_method"],
    limit: 1,
    status: "all",
  });

  if (subscriptions.data.length === 0) {
    const subData = { status: "none" };
    await kv.set(`stripe:customer:${customerId}`, JSON.stringify(subData));
    return subData;
  }

  // If a user can have multiple subscriptions, that's your problem
  const subscription = subscriptions.data[0];

  if (!subscription) {
    const subData = { status: "none" };
    await kv.set(`stripe:customer:${customerId}`, JSON.stringify(subData));
    return subData;
  }

  // Store complete subscription state
  const subData = {
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: subscription.current_period_end,
    currentPeriodStart: subscription.current_period_start,
    paymentMethod:
      subscription.default_payment_method &&
      typeof subscription.default_payment_method !== "string"
        ? {
            brand: subscription.default_payment_method.card?.brand ?? null,
            last4: subscription.default_payment_method.card?.last4 ?? null,
          }
        : null,
    priceId: subscription.items.data[0]?.price?.id ?? null,
    status: subscription.status,
    subscriptionId: subscription.id,
  };

  // Store the data in your KV
  await kv.set(`stripe:customer:${customerId}`, JSON.stringify(subData));
  return subData;
}

const allowedEvents = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "invoice.marked_uncollectible",
  "invoice.payment_succeeded",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
] as const satisfies readonly Stripe.Event.Type[];

type AllowedEventType = (typeof allowedEvents)[number];
type AllowedStripeEvent = Extract<Stripe.Event, { type: AllowedEventType }>;

const isAllowedStripeEvent = (
  event: Stripe.Event,
): event is AllowedStripeEvent =>
  allowedEvents.includes(event.type as AllowedEventType);

/** Attempts to execute a promise and returns an object with the result or error. */
export async function tryCatch<T>(promise: Promise<T>): Promise<{
  data?: T;
  error?: Error;
}> {
  try {
    const data = await promise;

    return { data };
  } catch (error) {
    if (error instanceof Error) {
      return { error };
    }

    // Handle non-Error throws by wrapping them
    return { error: new Error(String(error)) };
  }
}
