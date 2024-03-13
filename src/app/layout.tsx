import "@/styles/globals.css";

import { cookies } from "next/headers";

import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata = {
	openGraph: {
		title: "FeedFrenzy - Social Media Management Platform",
		description:
			"Powerful social media management platform for scheduling, analytics, and audience engagement.",
		url: "https://feedfrenzy.co",
		siteName: "FeedFrenzy",
		images: [
			{
				url: "https://feedfrenzy.co/og.png",
				width: 800,
				height: 600,
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "FeedFrenzy - Social Media Management Platform",
		description:
			"Powerful social media management platform for scheduling, analytics, and audience engagement.",
		creator: "@feedfrenzy",
		site: "@feedfrenzy",
		images: [
			{
				url: "https://feedfrenzy.co/og.png",
				width: 800,
				height: 600,
				alt: "FeedFrenzy logo",
			},
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="font-beausite subpixel-antialiased">
				<TRPCReactProvider cookies={cookies().toString()}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</TRPCReactProvider>
				<Toaster />
			</body>
		</html>
	);
}
