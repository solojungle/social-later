import { kv } from "@/server/services/redis/utils";
import Stripe from "stripe";

export type StripeSubCache =
  | {
      cancelAtPeriodEnd: boolean;
      currentPeriodEnd: null | number;
      currentPeriodStart: null | number;
      paymentMethod: {
        brand: null | string; // e.g., "visa", "mastercard"
        last4: null | string; // e.g., "4242"
      } | null;
      priceId: null | string;
      status: Stripe.Subscription.Status;
      subscriptionId: null | string;
    }
  | {
      status: "none";
    };

export const STRIPE_CACHE_KV = {
  generateKey(stripeCustomerId: string) {
    return `stripe:customer:${stripeCustomerId}`;
  },

  async get(stripeCustomerId: string): Promise<StripeSubCache> {
    const res = await kv.get(this.generateKey(stripeCustomerId));
    if (!res) return { status: "none" };
    return JSON.parse(res) as StripeSubCache;
  },
  async set(stripeCustomerId: string, status: string) {
    kv.set(this.generateKey(stripeCustomerId), JSON.stringify(status));
  },
};

export const STRIPE_CUSTOMER_ID_KV = {
  generateKey(userId: string) {
    return `user:${userId}:stripeCustomerId`;
  },
  async get(userId: string) {
    return kv.get(this.generateKey(userId));
  },
  async set(userId: string, customerId: string) {
    kv.set(this.generateKey(userId), customerId);
  },
};

export async function getStripeSubByUserId(userId: string) {
  const stripeCustomerId = await STRIPE_CUSTOMER_ID_KV.get(userId);
  if (!stripeCustomerId) return null;

  return STRIPE_CACHE_KV.get(stripeCustomerId);
}
