import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DesktopMenu() {
  return (
    <div className="hidden space-x-2 md:flex">
      <Link
        className={cn(
          buttonVariants({ variant: "outline" }),
          "flex items-center justify-center",
        )}
        href="/login"
      >
        <span className="">Login</span>
      </Link>
      <Link
        className={cn(
          buttonVariants({ variant: "default" }),
          "flex items-center justify-center",
        )}
        href="/login"
      >
        <span className="">Get started</span>
      </Link>
    </div>
  );
}
