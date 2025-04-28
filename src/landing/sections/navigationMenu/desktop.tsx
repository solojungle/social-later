import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function DesktopMenu() {
  return (
    <div className="hidden space-x-4 md:flex">
      <Link
        className={cn(
          buttonVariants({ variant: "link" }),
          "flex items-center justify-center text-base",
        )}
        href="/login"
      >
        <span className="text-black">Login</span>
      </Link>
    </div>
  );
}
