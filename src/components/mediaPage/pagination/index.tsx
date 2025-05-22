import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function PagePagination({ loading, onChange, page, total }: any) {
  return (
    <div className="mt-4 flex items-center justify-end border-t border-border bg-background px-2 py-4">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          <span className={cn(loading && "text-muted-foreground")}>
            Page {page} of {total}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="hidden size-8 p-0 lg:flex"
            disabled={page === 1 || loading}
            onClick={() => onChange(1)}
            variant="outline"
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="size-4" />
          </Button>
          <Button
            className="size-8 p-0"
            disabled={page === 1 || loading}
            onClick={() => onChange(page - 1)}
            variant="outline"
          >
            <span className="sr-only">Go to previous page</span>
            <InterfaceIcons.Back className="size-4" />
          </Button>
          <Button
            className="size-8 p-0"
            disabled={page + 1 > total || loading}
            onClick={async () => onChange(page + 1)}
            variant="outline"
          >
            <span className="sr-only">Go to next page</span>
            <InterfaceIcons.Next className="size-4" />
          </Button>
          <Button
            className="hidden size-8 p-0 lg:flex"
            disabled={page === total || loading}
            onClick={async () => onChange(total)}
            variant="outline"
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
