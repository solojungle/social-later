"use client";

import { useState } from "react";

import { DesktopMenu } from "./desktop";
import { MobileMenu } from "./mobile";

export function NavigationMenu() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		document.body.classList.toggle("overflow-hidden");
	};

	return (
		<div className="container z-10 w-full max-w-6xl">
			<div className="mb-4 flex h-16 w-full items-center justify-between sm:mb-14">
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
				<DesktopMenu />
				<MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
			</div>
		</div>
	);
}
