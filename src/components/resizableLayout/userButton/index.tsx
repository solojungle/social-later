import {
	ChevronsUpDown,
	LogOutIcon,
	LucideIcon,
	MessageSquareIcon,
	User2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user";

interface LinkItemsProps {
	links: {
		title: string;
		icon: LucideIcon;
		action?: () => void;
	}[];
}

function LinkItems({ links }: LinkItemsProps) {
	return (
		<div className="grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
			{links.map((link) => {
				if (link.action) {
					return (
						<button
							key={link.title}
							type="button"
							onClick={link.action}
							className={cn(
								buttonVariants({ variant: "ghost", size: "sm" }),
								"flex w-full items-center justify-start",
								"dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
							)}
						>
							<link.icon className="mr-2 h-4 w-4" />
							<span>{link.title}</span>
						</button>
					);
				}

				return (
					<Link
						key={link.title}
						href="/publish"
						className="inline-flex h-8 items-center justify-start whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						<link.icon className="mr-2 h-4 w-4" />
						<span className="text-xs">{link.title}</span>
					</Link>
				);
			})}
		</div>
	);
}

export function CollapsibleUserMenu({ isCollapsed }: { isCollapsed: boolean }) {
	const router = useRouter();
	const { email, name, image } = useUserStore();

	return (
		<div className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
			<div className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
				{isCollapsed ? (
					<div className="flex items-center justify-center">
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<Link
									href="/publish"
									className={cn(
										buttonVariants({ variant: "ghost", size: "icon" }),
										"h-9 w-9",
										"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
									)}
								>
									<Avatar className="h-6 w-6">
										<AvatarImage src={image} alt={name} />
										<AvatarFallback>{name?.[0] ?? ""}</AvatarFallback>
									</Avatar>
									<span className="sr-only">User</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right" className="flex items-center gap-4">
								User
							</TooltipContent>
						</Tooltip>
					</div>
				) : (
					<Collapsible>
						<CollapsibleTrigger
							className={cn(
								buttonVariants({ variant: "ghost", size: "sm" }),
								"justify-start",
								"w-full dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
							)}
						>
							<Avatar className="mr-2 h-6 w-6">
								<AvatarImage src={image} alt={name} />
								<AvatarFallback>{name?.[0] ?? ""}</AvatarFallback>
							</Avatar>
							{email || name}
							<ChevronsUpDown className="ml-auto h-4 w-4" />
						</CollapsibleTrigger>
						<CollapsibleContent>
							<LinkItems
								links={[
									{ title: "Personal Settings", icon: User2Icon },
									{ title: "Share feedback", icon: MessageSquareIcon },
									{
										title: "Log out",
										icon: LogOutIcon,
										action: () => {
											signOut({ redirect: false }).then(() => {
												// Redirect to the dashboard page after signing out
												router.push("/");
											});
										},
									},
								]}
							/>
						</CollapsibleContent>
					</Collapsible>
				)}
			</div>
		</div>
	);
}
