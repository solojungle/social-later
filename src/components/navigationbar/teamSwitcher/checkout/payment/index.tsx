"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { InterfaceIcons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { TeamCreationFormData } from "@/schemas/team-create-form-data";
import { useTeamStore } from "@/stores/teams";
import { api } from "@/trpc/react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentModalProps {
  formData: TeamCreationFormData | undefined;
  onBack: any;
  setDialog: any;
}

interface TotalAmountProps {
  amount: string;
  plan: string;
}

export function PaymentModal({
  formData,
  onBack,
  setDialog,
}: PaymentModalProps) {
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const { addTeam } = useTeamStore();
  const stripe = useStripe();
  const elements = useElements();

  const handleError = (error: any) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const createTeam = api.team.create.useMutation({
    onSuccess: (data) => {
      addTeam({
        ...data.team,
      });

      toast.success("Successfully created your team!", {
        description: `You will be redirected to your team settings shortly.`,
      });
    },
  });

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements || !formData) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Reset the error message
    setErrorMessage(undefined);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    try {
      const resp = await createTeam.mutateAsync({
        name: formData.name,
        stripePriceId: formData.subscription.priceId,
      });

      const { error } = await stripe.confirmPayment({
        clientSecret: resp.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/teams/${resp.team.url}/settings?page=billing`,
        },
        elements,
      });

      if (error) {
        handleError(error);
      }
    } catch (error) {
      toast.error("Uh oh! Something went wrong.", {
        description: "There was a problem with your request.",
      });

      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // If we don't have a subscription, don't render anything.
  if (!formData) {
    return null;
  }

  return (
    <form
      className="max-h-[70vh] space-y-4 overflow-y-scroll px-5 pb-2"
      onSubmit={handleSubmit}
    >
      <TotalAmount
        amount={formData.subscription.priceFormatted}
        plan={formData.subscription.name}
      />
      <Separator className="my-4" />
      <PaymentElement />
      {errorMessage && (
        <p className="text-[0.8rem] font-medium text-destructive">
          {errorMessage}
        </p>
      )}
      <DialogFooter className="flex flex-row !justify-between">
        <Button onClick={() => setDialog(false)} type="button" variant="ghost">
          Cancel
        </Button>
        <div className="space-x-2">
          <Button onClick={onBack} type="button" variant="outline">
            Back
          </Button>
          <Button disabled={!stripe || loading} type="submit">
            {loading && (
              <InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            Subscribe
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

function TotalAmount({ amount, plan }: TotalAmountProps) {
  return (
    <div className="rounded-xl border bg-card p-3 text-sm text-card-foreground">
      <h2 className="mb-2 font-medium">Your subscription</h2>
      <div className="flex justify-between text-muted-foreground">
        <p>{plan}</p>
        <p>{amount} billed monthly</p>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-medium">
        <p>Due Today</p>
        <p>{amount}</p>
      </div>
    </div>
  );
}
