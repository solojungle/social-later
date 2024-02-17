"use client";

import {
	ChevronDown,
	LogOut,
	MessageSquare,
	Settings2,
	Users2,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/stores/user";

export function UserMenu() {
	const { email, name, image } = useUserStore();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative gap-2 rounded-lg">
					<Avatar className="h-8 w-8">
						<AvatarImage src={image} alt={name} />
						<AvatarFallback>{name?.[0] ?? ""}</AvatarFallback>
					</Avatar>
					<ChevronDown className="h-4 w-4 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-60 p-3"
				align="end"
				sideOffset={10}
				forceMount
			>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{name}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Settings2 className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Users2 className="mr-2 h-4 w-4" />
						<span>Refer a friend</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<MessageSquare className="mr-2 h-4 w-4" />
					<span>Share Feedback</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => signOut()}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
