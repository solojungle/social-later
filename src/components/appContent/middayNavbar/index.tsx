"use client";

import type { JSX } from "react";

import { InterfaceIcons } from "@/components/ui/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons: { [key: string]: (props: { className?: string }) => JSX.Element } =
  {
    Analytics: (props) => <InterfaceIcons.Pages.Analytics {...props} />,
    Creator: (props) => <InterfaceIcons.Pages.Creator {...props} />,
    Nexus: (props) => <InterfaceIcons.Pages.Nexus {...props} />,
    Publish: (props) => <InterfaceIcons.Pages.Publish {...props} />,
    Settings: (props) => <InterfaceIcons.Settings {...props} />,
    Vault: (props) => <InterfaceIcons.Pages.Vault {...props} />,
  };

interface ItemProps {
  isActive: boolean;
  item: { name: string; path: string };
}

const Item = ({ isActive, item }: ItemProps) => {
  const Icon = icons[item.name];
  return (
    <TooltipProvider delayDuration={70}>
      <Link href={item.path} prefetch>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-lg border border-transparent",
                "hover:border-[#DCDAD2] hover:bg-accent hover:dark:border-[#2C2C2C]",
                isActive &&
                  "border-[#DCDAD2] bg-[#F2F1EF] dark:border-[#2C2C2C] dark:bg-secondary",
              )}
              id={item.path}
              key={item.path}
            >
              <div>
                <div className="flex items-center">
                  {Icon && <Icon className="size-5" />}
                  <span className="sr-only">{item.name}</span>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="hidden px-3 py-1.5 text-xs md:flex"
            side="left"
            sideOffset={10}
          >
            {item.name}
          </TooltipContent>
        </Tooltip>
      </Link>
    </TooltipProvider>
  );
};

export function MainMenu() {
  const { id: teamId } = useSelectedTeamStore();
  const { members } = useTeamMembersStore();
  const { id: userId } = useUserStore();

  const userRole = members.find((member) => member.id === userId)?.role;

  const defaultItems = [
    { name: "Nexus", path: "/nexus" },
    { name: "Publish", path: "/publish" },
    { name: "Analytics", path: "/analytics" },
    { name: "Vault", path: "/vault" },
    { name: "Creator", path: "/creator" },
    { name: "Settings", path: `/teams/${teamId}/settings` },
  ];

  const filteredItems = defaultItems.filter((item) => {
    if (item.name === "Settings") {
      return userRole === "OWNER" && teamId;
    }
    return true;
  });

  const pathname = usePathname();
  const part = pathname?.split("/")[1];

  return (
    <div className="mt-6">
      <nav>
        <div className="flex flex-col gap-1.5">
          {filteredItems.map((item) => {
            const isActive =
              (pathname === "/" && item.path === "/") ||
              (pathname !== "/" && item.path.startsWith(`/${part}`));

            return <Item isActive={isActive} item={item} key={item.path} />;
          })}
        </div>
      </nav>
    </div>
  );
}
