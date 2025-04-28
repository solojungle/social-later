"use client";

import { useState } from "react";

import { SideBar } from "./sideBar";
import { TopBar } from "./topBar";

export function AppContent({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex w-full">
      <SideBar isMenuOpen={isMenuOpen} />

      <div className="flex flex-1 flex-col transition-all duration-200 ease-in-out">
        <TopBar toggleMenu={toggleMenu} />
        <div className="relative flex-1">{children}</div>
      </div>
    </div>
  );
}

export function isCurrentTab(path: string, url: string) {
  // Normalize the path and compare
  const formattedPath = path.split("/")[1]?.toLowerCase();
  return formattedPath === url ? "default" : "ghost";
}
