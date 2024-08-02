"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavigationMenu() {
	const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu open/close

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen); // Toggle menu state

		// Toggle overflow hidden on the body
		document.body.classList.toggle("overflow-hidden");
	};

	return (
		<div className="container w-full">
			<div className="mb-4 flex h-16 w-full items-center justify-between sm:mb-24">
				<div className="flex items-center">
					<a href="https://feedfrenzy.co/" className="flex">
						<img
							alt="feedfrenzy logo"
							src="/images/logo.png"
							className="mr-3 h-8 w-8 rounded-sm"
						/>
						<span className="self-center whitespace-nowrap text-base font-semibold">
							feedfrenzy.co
						</span>
					</a>
				</div>
				<div className="hidden space-x-4 md:flex">
					<Link
						href="/login"
						className={cn(
							buttonVariants({ variant: "ghost" }),
							"flex items-center justify-center",
						)}
					>
						<span>Login</span>
					</Link>
					{/* <Button variant="default">
						Start a free trial <ArrowUpRight className="ml-1 h-5 w-5" />
					</Button> */}
				</div>
				{/* Hamburger Menu */}
				<div className="flex flex-col md:hidden">
					<Button
						type="button"
						variant="default"
						size="icon"
						aria-label="Toggle Menu"
						onClick={toggleMenu} // Toggle menu on click
					>
						{isMenuOpen ? (
							<XIcon className="h-6 w-6" /> // Show close icon when menu is open
						) : (
							<MenuIcon className="h-6 w-6" /> // Show hamburger icon otherwise
						)}
					</Button>
				</div>
			</div>
			{/* Mobile Menu */}
			<div
				className={cn(
					"fixed z-50 flex h-[calc(100vh-64px)] w-full justify-center bg-black",
					!isMenuOpen && "hidden",
				)}
			>
				<div className="w-full space-y-2 p-5">
					{/* <Button
						size="lg"
						variant="secondary"
						className="flex w-full items-center justify-center p-6"
					>
						Start a 14-day free trial <ArrowUpRight className="ml-2 h-5 w-5" />
					</Button> */}
					<Link
						href="/login"
						className={cn(
							buttonVariants({ variant: "secondary" }),
							"flex items-center justify-center p-6",
						)}
					>
						<span>Login</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
