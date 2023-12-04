"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";

export function NavigationMenuDemo() {
	return (
		<div className="flex w-full items-center justify-between py-1">
			<div className="flex items-center gap-12">
				<a href="https://aliawari.com/">
					<span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
						aliawari.com
					</span>
				</a>
				<div className="flex items-center">
					<Button variant="link">
						<Link href="/">Platform</Link>
					</Button>
					<Button variant="link">
						<Link href="#pricing">Pricing</Link>
					</Button>
					<Button variant="link">
						<Link href="#faq">FAQ</Link>
					</Button>
				</div>
			</div>
			<Link
				href="/login"
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"flex items-center justify-center",
				)}
			>
				<span>Login</span>
				<ChevronRight className="ml-2 h-5 w-5" />
			</Link>
		</div>
	);
}
