/* eslint-disable indent */

"use client";

import { env } from "@/env.mjs";
import { useMultiStepCheckout } from "@/hooks/multi-step-checkout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

import CreateTeamModal from "../modal";
import { PaymentModal } from "./payment";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

type CheckoutProps = {
  setDialog: any;
};

export function Checkout({ setDialog }: CheckoutProps) {
  // Pass the pages to the multi-step checkout hook.
  const { currentStep, formData, nextStep, returnStep } =
    useMultiStepCheckout();

  // This isn't really used, but it's required by Stripe.
  const options: StripeElementsOptions = {
    amount: 0,
    currency: "usd",
    mode: "subscription",
  };

  function renderCurrentStep() {
    switch (currentStep) {
      case 0:
        return (
          <CreateTeamModal
            key="0"
            onBack={returnStep}
            onNext={nextStep}
            setDialog={setDialog}
          />
        );
      case 1:
        return (
          <PaymentModal
            formData={formData}
            key="1"
            onBack={returnStep}
            setDialog={setDialog}
          />
        );
      default:
        return null;
    }
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      {renderCurrentStep()}
    </Elements>
  );
}
