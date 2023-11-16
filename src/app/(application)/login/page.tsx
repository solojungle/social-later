import { NotionLogoIcon } from "@radix-ui/react-icons";
import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Separator } from "@/components/ui/separator";
import { getServerAuthSession } from "@/server/auth";

export const metadata: Metadata = {
	title: "Authentication",
	description: "Authentication forms built using the components.",
};

export default async function AuthenticationPage() {
	const session = await getServerAuthSession();
	if (session) {
		redirect("/");
	}

	return (
		<div className="container flex h-screen items-center justify-center bg-black">
			<div className="flex w-full flex-col items-center justify-center space-y-6 rounded-lg bg-white p-10 sm:max-w-md">
				<div className="mb-4 flex flex-col space-y-2 text-center">
					<span className="flex items-center justify-center pb-10 pt-8 font-semibold">
						<NotionLogoIcon className="h-36 w-36" />
					</span>
					<h1 className="text-2xl font-semibold tracking-tight">
						Client Login
					</h1>
					<p className="text-sm text-muted-foreground">
						Welcome back. Sign into your account below.
					</p>
				</div>
				<UserAuthForm />
				<Separator />
				<p className="max-w-xs text-center text-xs text-muted-foreground">
					By clicking continue, you agree to our{" "}
					<Link
						href="/terms"
						className="underline underline-offset-4 hover:text-primary"
					>
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link
						href="/privacy"
						className="underline underline-offset-4 hover:text-primary"
					>
						Privacy Policy
					</Link>
					.
				</p>
			</div>
		</div>
	);
}
