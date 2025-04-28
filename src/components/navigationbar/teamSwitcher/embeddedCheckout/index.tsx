/* eslint-disable indent */

"use client";

import { EmbeddedStripePayments } from "@/components/embeddedStripePayments";
import { useMultiStepEmbeddedCheckout } from "@/hooks/multi-step-checkout";

import { PlanSelection } from "./planSelection";

type EmbeddedCheckoutProps = {
  setDialog: (value: boolean) => void;
};

export function EmbeddedCheckout({ setDialog }: EmbeddedCheckoutProps) {
  // Pass the pages to the multi-step checkout hook.
  const { clientSecret, currentStep, nextStep, returnStep } =
    useMultiStepEmbeddedCheckout();

  function renderCurrentStep() {
    switch (currentStep) {
      case 0:
        return (
          <PlanSelection
            key="0"
            onBack={returnStep}
            onNext={nextStep}
            setDialog={setDialog}
          />
        );
      case 1:
        return (
          <EmbeddedStripePayments
            clientSecret={clientSecret}
            key="1"
            onBack={returnStep}
          />
        );
      default:
        return null;
    }
  }

  return renderCurrentStep();
}
