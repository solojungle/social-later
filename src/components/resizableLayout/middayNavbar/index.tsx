"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { InterfaceIcons } from "@/components/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const icons: { [key: string]: (props: { className?: string }) => JSX.Element } =
	{
		"/nexus": (props) => <InterfaceIcons.Pages.Nexus {...props} />,
		"/vault": (props) => <InterfaceIcons.Pages.Vault {...props} />,
		"/settings": (props) => <InterfaceIcons.Settings {...props} />,
		"/publish": (props) => <InterfaceIcons.Pages.Publish {...props} />,
		"/analytics": (props) => <InterfaceIcons.Pages.Analytics {...props} />,
	};

const defaultItems = [
	{
		path: "/nexus",
		name: "Nexus",
	},
	{
		path: "/publish",
		name: "Publish",
	},
	{
		path: "/analytics",
		name: "Analytics",
	},
	{
		path: "/vault",
		name: "Vault",
	},
	{
		path: "/settings",
		name: "Settings",
	},
];

interface ItemProps {
	item: { path: string; name: string };
	isActive: boolean;
}

const Item = ({ item, isActive }: ItemProps) => {
	const Icon = icons[item.path];
	return (
		<TooltipProvider delayDuration={70}>
			<Link prefetch href={item.path}>
				<Tooltip>
					<TooltipTrigger className="w-full">
						<div
							key={item.path}
							id={item.path}
							className={cn(
								"relative flex h-[45px] items-center rounded-lg border border-transparent md:w-[45px] md:justify-center",
								"hover:border-[#DCDAD2] hover:bg-accent hover:dark:border-[#2C2C2C]",
								isActive &&
									"border-[#DCDAD2] bg-[#F2F1EF] dark:border-[#2C2C2C] dark:bg-secondary",
							)}
						>
							<div className="relative">
								<div className="flex items-center space-x-3 p-0 pl-2 md:pl-0">
									{Icon && <Icon className="h-5 w-5 shrink-0" />}
									<span className="flex md:hidden">{item.name}</span>
								</div>
							</div>
						</div>
					</TooltipTrigger>
					<TooltipContent
						side="left"
						className="hidden px-3 py-1.5 text-xs md:flex"
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
	const [items] = useState(defaultItems);
	const pathname = usePathname();
	const part = pathname?.split("/")[1];

	return (
		<div className="mt-6">
			<nav>
				<div className="flex flex-col gap-1.5">
					{items.map((item) => {
						const isActive =
							(pathname === "/" && item.path === "/") ||
							(pathname !== "/" && item.path.startsWith(`/${part}`));

						return <Item key={item.path} item={item} isActive={isActive} />;
					})}
				</div>
			</nav>
		</div>
	);
}
