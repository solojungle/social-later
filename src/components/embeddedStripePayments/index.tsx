"use client";

import { env } from "@/env.mjs";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "../ui/button";

// Make sure to call `loadStripe` outside of a component’s render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

type EmbeddedCheckoutProps = {
  clientSecret: string;
  onBack: () => void;
};

export function EmbeddedStripePayments({
  clientSecret,
  onBack,
}: EmbeddedCheckoutProps) {
  return (
    <>
      <div className="flex flex-row space-x-4">
        <Button onClick={onBack} type="button" variant="outline">
          Back
        </Button>
      </div>
      <EmbeddedCheckoutProvider
        options={{ clientSecret }}
        stripe={stripePromise}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </>
  );
}
