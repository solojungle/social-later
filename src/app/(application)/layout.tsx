import { type Metadata } from "next";
import { Inter } from "next/font/google";

import { SiteHeader } from "@/components/siteHeader";

export const metadata: Metadata = {
	title: "Forms",
	description: "Advanced form example using react-hook-form and Zod.",
};

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

interface ApplicationLayoutProps {
	children: React.ReactNode;
}

export default function ApplicationLayout({
	children,
}: ApplicationLayoutProps) {
	return (
		<div className={`min-h-screen font-sans ${inter.variable}`}>
			<SiteHeader />
			{children}
		</div>
	);
}
