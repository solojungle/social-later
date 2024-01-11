import { type Metadata } from "next";

import { ResizableLayout } from "@/components/resizableLayout";

export const metadata: Metadata = {
	title: "Forms",
	description: "Advanced form example using react-hook-form and Zod.",
};

interface ApplicationLayoutProps {
	children: React.ReactNode;
}

export default function PublishLayout({ children }: ApplicationLayoutProps) {
	return (
		<div className="h-screen">
			<ResizableLayout
				children={children}
				defaultLayout={undefined}
				navCollapsedSize={0}
			/>
		</div>
	);
}
