import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import BackButton from "@/components/backButton";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { getServerAuthSession } from "@/server/auth";

export const metadata: Metadata = {
	title: "Authentication",
	description: "Sign in to your account to continue.",
};

export default async function AuthenticationPage() {
	const session = await getServerAuthSession();

	if (session) {
		redirect("/publish");
	}

	return (
		<div className="h-screen">
			<div className="container relative grid h-full flex-col items-center justify-center p-10 lg:max-w-none lg:grid-cols-2 lg:p-0">
				<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
					<div className="absolute inset-0 h-screen bg-zinc-900" />
					<div className="relative z-20 flex items-center text-lg font-medium">
						<img
							src="/images/logo.png"
							alt="logo"
							className="mr-2 h-8 w-8 rounded-lg"
						/>
						<span>FeedFrenzy</span>
					</div>
					<div className="relative z-20 mt-auto">
						<blockquote className="space-y-2">
							<p className="text-lg">
								&ldquo;Its been a game-changer for our agency, increasing our
								efficiency and enabling us to elevate our social media presence
								to new heights.&rdquo;
							</p>
							<footer className="text-sm">Ali Awari</footer>
						</blockquote>
					</div>
				</div>
				<div className="flex h-full flex-col lg:p-8">
					<BackButton />
					<div className="mx-auto flex h-full w-full grow flex-col justify-center space-y-6 sm:w-[350px]">
						<div className="mb-8 flex flex-col space-y-2 text-start">
							<h1 className="text-2xl font-semibold tracking-tight">
								Welcome back. Sign into your account below.
							</h1>
						</div>
						<UserAuthForm />
						<p className="px-8 text-center text-xs text-muted-foreground">
							<span>By clicking continue, you agree to our </span>
							<Link
								href="/terms"
								className="underline underline-offset-4 hover:text-primary"
							>
								Terms of Service
							</Link>
							<span> and </span>
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
			</div>
		</div>
	);
}
