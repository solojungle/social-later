"use client";

import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { SheetClose } from "@/components/ui/sheet";

interface Props {
  action?: string;
  disabled?: boolean;
  form: any;
  loading: boolean;
}

export function CancelSubmitBar({
  action = "Publish",
  disabled,
  form,
  loading,
}: Props) {
  return (
    <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background py-4">
      <SheetClose
        asChild
        onClick={() => {
          form.reset();
        }}
      >
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </SheetClose>
      <Button disabled={loading || disabled} type="submit">
        {loading && (
          <InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
        )}
        {action}
      </Button>
    </div>
  );
}
