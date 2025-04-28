"use client";

import { PlanUsage } from "@/components/storageUsage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InterfaceIcons } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user";
import { GaugeCircleIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CollapsibleUserMenu() {
  const { image, name } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensuring that dynamic elements only render on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid rendering during SSR

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Tooltip>
          <Link href="/settings" prefetch>
            <TooltipTrigger>
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage alt="" src={image} />
                <AvatarFallback className="text-xs">
                  {name?.split(" ").map((n: string) => n[0])}
                </AvatarFallback>
              </Avatar>
              <TooltipContent side="right">User Settings</TooltipContent>
            </TooltipTrigger>
          </Link>
        </Tooltip>
        <Popover>
          <PopoverTrigger>
            <GaugeCircleIcon className="size-6" />
          </PopoverTrigger>
          <PopoverContent
            className="w-96"
            collisionPadding={{ bottom: 5, left: 5, right: 5, top: 5 }}
            side="right"
            sideOffset={25}
          >
            <PlanUsage />
          </PopoverContent>
        </Popover>
        <Tooltip>
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await signOut({ redirect: false });
              router.push("/login");
            }}
            type="button"
          >
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "relative flex h-[45px] items-center rounded-lg border border-transparent md:w-[45px] md:justify-center",
                  "hover:border-[#DCDAD2] hover:bg-accent hover:dark:border-[#2C2C2C]",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                  {loading ? (
                    <InterfaceIcons.Loading className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <InterfaceIcons.LogOut className="h-5 w-5 shrink-0" />
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </button>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
