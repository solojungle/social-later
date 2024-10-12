"use client";

// eslint-disable-next-line simple-import-sort/imports
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import Link from "next/link";

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
			<div className="flex flex-col items-center justify-center space-y-2">
				<Tooltip>
					<Link prefetch href="/settings">
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
						side="right"
						sideOffset={25}
						collisionPadding={{ left: 35, right: 35, top: 35, bottom: 35 }}
					>
						<PlanUsage used={0} total={0} unit="" label="" logo="" />
					</PopoverContent>
				</Popover>

				<Tooltip>
					<button
						type="button"
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							await signOut({ redirect: false });
							router.push("/login");
						}}
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
