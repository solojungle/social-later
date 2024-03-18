import { type Metadata } from "next";
import { Inter } from "next/font/google";

import { ResizableLayout } from "@/components/resizableLayout";
import { SiteHeader } from "@/components/siteHeader";

export const metadata: Metadata = {
	title: "FeedFrenzy",
	description: "FeedFrenzy is a social media aggregator and feed reader.",
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
		<div className={`h-screen font-sans ${inter.variable}`}>
			<SiteHeader />
			<ResizableLayout navCollapsedSize={0}>{children}</ResizableLayout>
		</div>
	);
}
