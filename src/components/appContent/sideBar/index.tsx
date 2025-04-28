import { InterfaceIcons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

import { MainMenu } from "../middayNavbar";
import { CollapsibleUserMenu } from "../userMenu";

export function SideBar({ isMenuOpen }: { isMenuOpen: boolean }) {
  return (
    <aside
      className={cn(
        "sticky top-0 z-40 hidden h-screen shrink-0 flex-col items-center justify-between border border-b-0 border-l-0 border-t-0 border-border bg-background px-2 pb-4 transition-all duration-200 ease-in-out md:flex md:translate-x-0",
        isMenuOpen && "flex translate-x-0",
        !isMenuOpen && "-translate-x-full",
      )}
    >
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mt-4">
          <Link href="/nexus">
            <InterfaceIcons.LogoSmall />
          </Link>
        </div>
        <MainMenu />
      </div>
      <Suspense>
        <CollapsibleUserMenu />
      </Suspense>
    </aside>
  );
}
