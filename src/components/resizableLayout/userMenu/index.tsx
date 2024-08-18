import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { InterfaceIcons } from "@/components/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user";

export function CollapsibleUserMenu() {
	const { image, name } = useUserStore();
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	return (
		<TooltipProvider delayDuration={0}>
			<Collapsible className="flex flex-col items-center justify-center">
				<CollapsibleTrigger>
					<Avatar className="h-9 w-9 border border-border">
						<AvatarImage alt="" src={image} />
						<AvatarFallback>{name[0]}</AvatarFallback>
					</Avatar>
				</CollapsibleTrigger>
				<CollapsibleContent className="mt-4 flex flex-col">
					<button
						type="button"
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							await signOut({ redirect: false });
							router.push("/login");
						}}
					>
						<Tooltip>
							<TooltipTrigger className="w-full">
								<div
									className={cn(
										"relative flex h-[45px] items-center rounded-lg border border-transparent md:w-[45px] md:justify-center",
										"hover:border-[#DCDAD2] hover:bg-accent hover:dark:border-[#2C2C2C]",
									)}
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-lg">
										{loading && (
											<InterfaceIcons.Loading className="h-5 w-5 animate-spin text-muted-foreground" />
										)}
										{!loading && (
											<InterfaceIcons.LogOut className="h-5 w-5 shrink-0" />
										)}
									</div>
								</div>
							</TooltipTrigger>
							<TooltipContent side="right">Log out</TooltipContent>
						</Tooltip>
					</button>
				</CollapsibleContent>
			</Collapsible>
		</TooltipProvider>
	);
}
