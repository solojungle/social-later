"use client";

import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useUserStore } from "@/stores/user";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { buttonVariants } from "../ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  accountItems?: {
    href: string;
    title: string;
  }[];
  teamItems?: {
    href: string;
    title: string;
  }[];
}

export function PublishSidebar({
  accountItems,
  className,
  teamItems,
  ...props
}: SidebarNavProps) {
  const { image, name } = useUserStore();
  const { image: selectedTeamImage, name: selectedTeamName } =
    useSelectedTeamStore();

  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {teamItems && (
        <div className="xs:mb-4 flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
          <div className="xs:mb-2 flex items-center">
            <Avatar className="h-4 w-4">
              <AvatarImage alt={selectedTeamName} src={selectedTeamImage} />
              <AvatarFallback>{selectedTeamName?.[0] ?? ""}</AvatarFallback>
            </Avatar>
            <h2 className="ml-3 text-xs font-medium uppercase text-muted-foreground">
              Team
            </h2>
          </div>
          {teamItems.map((item) => (
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-muted hover:bg-muted"
                  : "font-normal hover:bg-transparent hover:underline",
                "justify-start",
              )}
              href={item.href}
              key={item.href}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
      <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        <div className="xs:mb-2 flex items-center">
          <Avatar className="h-4 w-4">
            <AvatarImage alt={name} src={image} />
            <AvatarFallback>{name?.[0] ?? ""}</AvatarFallback>
          </Avatar>
          <h2 className="ml-3 text-xs font-medium uppercase text-muted-foreground">
            Account
          </h2>
        </div>
        {accountItems &&
          accountItems?.length > 0 &&
          accountItems.map((item) => (
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-muted hover:bg-muted"
                  : "font-normal hover:bg-transparent hover:underline",
                "justify-start",
              )}
              href={item.href}
              key={item.href}
            >
              {item.title}
            </Link>
          ))}
      </div>
    </nav>
  );
}
