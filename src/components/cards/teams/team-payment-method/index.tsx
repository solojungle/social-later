"use client";

import { getPaymentMethodIcon } from "@/components/ccicon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InterfaceIcons } from "@/components/ui/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";
import { CheckCircle2, InfoIcon, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SettingsCardBase } from "../../settings-card-base";
import { AddPaymentDialogTrigger } from "./dialogTrigger";

export function OptionsMenu({
  className,
  isDefault,
  isLastPaymentMethod,
  paymentMethodId,
  teamId,
}: {
  className?: string;
  isDefault?: boolean;
  isLastPaymentMethod?: boolean;
  paymentMethodId: string;
  teamId: string;
}) {
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();
  const [showDialog, setShowDialog] = useState(false);
  const { mutate: setDefault } = api.stripe.setDefaultPaymentMethod.useMutation(
    {
      onError: () => {
        toast.error("Failed to update default payment method");
      },
      onSettled: () => {
        setLoading(false);
      },
      onSuccess: () => {
        toast.success("Default payment method updated");
        utils.stripe.getPaymentMethods.invalidate({ id: teamId });
      },
    },
  );

  const isDisabled = isDefault && isLastPaymentMethod;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isDisabled}>
        <Button className={className} size="icon" variant="outline">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuItem
          disabled={isDefault || loading}
          onClick={() => {
            setLoading(true);
            setDefault({ paymentMethodId, teamId });
          }}
        >
          {loading && (
            <InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
          Set default
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          disabled={isLastPaymentMethod}
          onSelect={() => setShowDialog(true)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DeleteAlert
        onOpenChange={setShowDialog}
        open={showDialog}
        paymentMethodId={paymentMethodId}
        teamId={teamId}
      />
    </DropdownMenu>
  );
}

export function TeamPaymentMethodCard({ teamId }: { teamId: string }) {
  const { data, isFetching, isLoading } = api.stripe.getPaymentMethods.useQuery(
    {
      id: teamId,
    },
  );

  if (isLoading || isFetching) {
    return (
      <SettingsCardBase
        content={
          <div className="flex w-full flex-col items-center justify-center">
            <InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
            <span className="mt-4 text-xs text-muted-foreground">
              Loading payment methods...
            </span>
          </div>
        }
        footerSubtitle="At most, three credit cards, debit cards or prepaid cards can be added."
        title="Payment Method"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <SettingsCardBase
        button={<AddPaymentDialogTrigger teamId={teamId} />}
        content={
          <span className="text-sm">
            You have not yet added any cards. Click the button below to add one.
          </span>
        }
        footerSubtitle="At most, three credit cards, debit cards or prepaid cards can be added."
        title="Payment Method"
      />
    );
  }

  return (
    <SettingsCardBase
      button={<AddPaymentDialogTrigger teamId={teamId} />}
      content={
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow className="text-xs uppercase">
                <TableHead>Brand</TableHead>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <TableHead className="flex items-center gap-1 uppercase">
                      Default
                      <InfoIcon className="h-3 w-3" />
                    </TableHead>
                  </TooltipTrigger>
                  <TooltipContent
                    className="normal-case"
                    collisionPadding={{
                      bottom: 5,
                      left: 5,
                      right: 5,
                      top: 5,
                    }}
                  >
                    The card that is used to pay for a subscription
                  </TooltipContent>
                </Tooltip>
                <TableHead>Type</TableHead>
                <TableHead>Number (last 4)</TableHead>
                <TableHead>Exp. Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="capitalize">
                    {getPaymentMethodIcon(card.brand as string)}
                  </TableCell>
                  <TableCell>{card.isDefault && <CheckCircle2 />}</TableCell>
                  <TableCell className="capitalize">{card.type}</TableCell>
                  <TableCell>•••• {card.last4}</TableCell>
                  <TableCell>{`${card.expMonth}/${card.expYear}`}</TableCell>
                  <TableCell className="w-[0]">
                    <OptionsMenu
                      isDefault={card.isDefault}
                      isLastPaymentMethod={data.length === 1}
                      paymentMethodId={card.id}
                      teamId={teamId}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      }
      description="Your charges will be deducted from the default card shown below. This can be changed by adding a new card and making it the default using the menu on the right."
      footerSubtitle="At most, three credit cards, debit cards or prepaid cards can be added."
      title="Payment Method"
    />
  );
}

function DeleteAlert({ onOpenChange, open, paymentMethodId, teamId }: any) {
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();
  const { mutate: removePaymentMethod } =
    api.stripe.removePaymentMethod.useMutation({
      onError: () => {
        toast.error("Failed to remove payment method");
      },
      onSettled: () => {
        setLoading(false);
        utils.stripe.getPaymentMethods.invalidate({ id: teamId });
      },
      onSuccess: () => {
        toast.success("Payment method removed");
      },
    });

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            payment method. We will re-assign the next card to be the default.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={() => {
              setLoading(true);
              removePaymentMethod({
                paymentMethodId,
                teamId,
              });
            }}
            variant="destructive"
          >
            {loading && (
              <InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin text-white" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
