"use client";

import { CheckCircle2, XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";

import { InterfaceIcons } from "@/components/ui/icons";
import { useTeamStore } from "@/stores/teams";
import { api } from "@/trpc/react";

type SuccessPageContentProps = {
  customer: string;
  product: string;
  subscription: string;
};

export function CheckoutPageContent() {
  const [sessionId] = useQueryState("sessionId", {
    defaultValue: "",
  });

  if (!sessionId) {
    return <ErrorPageContent />;
  }

  const {
    data: checkout,
    isError,
    isFetching,
  } = api.stripe.getCheckoutSessionStatus.useQuery(
    {
      sessionId,
    },
    {
      enabled: !!sessionId,
    },
  );

  if (isFetching) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <InterfaceIcons.Loading className="mb-6 size-16 animate-spin text-muted-foreground" />
        <h1 className="text-center text-lg font-extralight text-muted-foreground">
          Getting payment status...
        </h1>
      </div>
    );
  }

  if (isError || !checkout || !checkout.customer || !checkout.subscription) {
    return <ErrorPageContent />;
  }

  return (
    <SuccessPageContent
      customer={checkout.customer}
      product={checkout.product}
      subscription={checkout.subscription}
    />
  );
}

function ErrorPageContent() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center text-lg">
      <XCircleIcon className="mb-6 size-16 text-red-500" />
      <h1>Something went wrong</h1>
      <p>Sorry, we could not process your payment. Please try again.</p>
    </div>
  );
}

function SuccessPageContent({
  customer,
  product,
  subscription,
}: SuccessPageContentProps) {
  const hasCreatedTeam = useRef(false);
  const { addTeam } = useTeamStore();
  const router = useRouter();

  const {
    isError,
    isLoading,
    mutateAsync: createTeamViaEmbed,
  } = api.team.createViaEmbed.useMutation({
    onSuccess: (data: any) => {
      addTeam({
        ...data.team,
      });

      router.push("/publish");
    },
  });

  useEffect(() => {
    if (!hasCreatedTeam.current) {
      createTeamViaEmbed({
        customer,
        product,
        subscription,
      });
      hasCreatedTeam.current = true;
    }
  }, [customer, subscription, product, createTeamViaEmbed]);

  return (
    <div className="flex h-screen flex-col items-center  justify-center text-center text-lg">
      <CheckCircle2 className="mb-6 size-16 text-green-500" />
      <h1>Thank you for your purchase!</h1>
      <div>{isLoading ? <p>Creating your team...</p> : null}</div>
      <div>
        {isError ? <p>Failed to create team, please contact support!</p> : null}
      </div>
    </div>
  );
}
