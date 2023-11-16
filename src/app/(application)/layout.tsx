import { type Metadata } from "next";

export const metadata: Metadata = {
	title: "Forms",
	description: "Advanced form example using react-hook-form and Zod.",
};

interface ApplicationLayoutProps {
	children: React.ReactNode;
}

export default function ApplicationLayout({
	children,
}: ApplicationLayoutProps) {
	return <div className="h-screen">{children}</div>;
}
