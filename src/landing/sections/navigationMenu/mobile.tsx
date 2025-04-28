import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";

export function MobileMenu({ isMenuOpen, toggleMenu }: any) {
  return (
    <>
      <div className="flex flex-col md:hidden">
        <Button
          aria-label="Toggle Menu"
          onClick={toggleMenu}
          size="icon"
          type="button"
          variant="default"
        >
          {isMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </Button>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 mt-16 flex items-center justify-center bg-black/90 md:hidden">
          <div className="w-full space-y-2 p-5">
            <Link
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "flex w-full items-center justify-center p-6",
              )}
              href="/login"
              onClick={toggleMenu}
            >
              <span>Login</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
