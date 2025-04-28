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
          <a className="flex" href="https://feedfrenzy.co/">
            <img
              alt="feedfrenzy logo"
              className="mr-3 h-8 w-8 rounded-sm"
              src="/images/logo.png"
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
