"use client";

import { useState } from "react";

import { EmbeddedCheckout } from "../navigationbar/teamSwitcher/embeddedCheckout";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/checkoutSheet";

export default function CreateTeamButton() {
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

  return (
    <Sheet onOpenChange={setShowNewTeamDialog} open={showNewTeamDialog}>
      <SheetTrigger asChild>
        <Button>Create new team</Button>
      </SheetTrigger>
      <SheetContent
        className="w-[500px] !max-w-[80vw] space-y-4 !overflow-scroll pt-4"
        onInteractOutside={(e) => e.preventDefault()}
        side="right"
      >
        <SheetHeader>
          <SheetTitle>Create team</SheetTitle>
          <SheetDescription>
            Add a new team to manage products and customers.
          </SheetDescription>
        </SheetHeader>
        {/* <Checkout setDialog={setShowNewTeamDialog} /> */}
        <EmbeddedCheckout setDialog={setShowNewTeamDialog} />
      </SheetContent>
    </Sheet>
  );
}
