"use client";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@radix-ui/react-avatar";
import { Search } from "lucide-react";

interface NavProps {
  accounts: any[] | undefined;
  isCollapsed: boolean;
}

export function AccountsNav({ accounts, isCollapsed }: NavProps) {
  if (!accounts) return null;

  return (
    <div
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      data-collapsed={isCollapsed}
    >
      <nav className="grid gap-1 space-y-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {isCollapsed ? (
          <div className="flex space-y-2 ">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://pbs.twimg.com/profile_images/1350895249678348292/RS1Aa0iK_400x400.jpg" />
                <AvatarFallback>AA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search accounts" />
            </div>
            <Separator />
            <h2 className="text-xs font-medium text-muted-foreground">
              Twitter
            </h2>
            <div className="flex items-center">
              {accounts.map((account) => (
                <>
                  <Avatar className="mr-3 h-8 w-8">
                    <AvatarImage src="https://pbs.twimg.com/profile_images/1350895249678348292/RS1Aa0iK_400x400.jpg" />
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{account.username}</span>
                </>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
