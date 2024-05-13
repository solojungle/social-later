import {
	ChevronsUpDown,
	LogOutIcon,
	LucideIcon,
	MessageSquareIcon,
	User2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
		variant: "default" | "ghost" | "disabled";
		url?: string;
		action?: () => void;
	}[];
}

export function isCurrentTab(path: string, url: string) {
	// Only get stuff before first slash
	const formattedPath = path.split("/")[1]?.toLowerCase();

	return `${formattedPath}` === `${url}` ? "default" : "ghost";
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
								buttonVariants({ variant: link.variant, size: "sm" }),
								link.variant === "default" &&
									"dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
								"justify-start",
							)}
						>
							<link.icon className="mr-2 h-4 w-4" />
							<span
								className={cn(
									"text-xs",
									link.variant === "default" &&
										"text-background dark:text-white",
								)}
							>
								{link.title}
							</span>
						</button>
					);
				}

				return (
					<Link
						key={link.title}
						href={`/${link.url}`}
						className={cn(
							buttonVariants({ variant: link.variant, size: "sm" }),
							link.variant === "default" &&
								"dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
							"justify-start",
						)}
					>
						<link.icon className="mr-2 h-4 w-4" />
						<span
							className={cn(
								"text-xs",
								link.variant === "default" && "text-background dark:text-white",
							)}
						>
							{link.title}
						</span>
					</Link>
				);
			})}
		</div>
	);
}

export function CollapsibleUserMenu({ isCollapsed }: { isCollapsed: boolean }) {
	const router = useRouter();
	const { email, name, image } = useUserStore();
	const path = usePathname();

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
									{
										title: "Personal Settings",
										icon: User2Icon,
										variant: isCurrentTab(path, "settings"),
										url: "settings",
									},
									{
										title: "Share feedback",
										icon: MessageSquareIcon,
										variant: isCurrentTab(path, "feedback"),
										url: "feedback",
									},
									{
										title: "Log out",
										icon: LogOutIcon,
										variant: "ghost",
										action: async () => {
											await signOut({ redirect: false });
											router.push("/login");
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
