import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

const sidebarNavItems = [
	{
		title: "Account",
		href: "/settings/account",
	},
	{
		title: "Appearance",
		href: "/settings/appearance",
	},
	{
		title: "Notifications",
		href: "/settings/notifications",
	},
];

export default async function Home() {
	const hello = await api.post.hello.query({ text: "from tRPC" });
	const session = await getServerAuthSession();

	if (!session) {
		return (
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
				<h1 className="mb-10">
					You are not logged in, so we will show you a landing page instead.
				</h1>
				<div>
					<Link
						href={session ? "/api/auth/signout" : "/api/auth/signin"}
						className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
					>
						{session ? "Sign out" : "Sign in"}
					</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="">
			<div className="hidden space-y-6 p-10 pb-16 md:block">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Publish</h2>
					<p className="text-muted-foreground">Tools to help you to create posts.</p>
				</div>
				<Separator className="my-6" />
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="-mx-4 lg:w-1/5">
						<div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
							<Dialog>
								<DialogTrigger>
									<Button className="w-full">Create Post</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Are you sure absolutely sure?</DialogTitle>
										<DialogDescription>
											This action cannot be undone. This will permanently delete your
											account and remove your data from our servers.
										</DialogDescription>
									</DialogHeader>
									<div>
										<div className="space-y-4 py-2 pb-4">
											<div className="space-y-2">
												<Label htmlFor="name">Team name</Label>
												<Input id="name" placeholder="Acme Inc." />
											</div>
											<div className="space-y-2">
												<Label htmlFor="plan">Subscription plan</Label>
												<Select>
													<SelectTrigger>
														<SelectValue placeholder="Select a plan" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="free">
															<span className="font-medium">Free</span> -{" "}
															<span className="text-muted-foreground">
																Trial for two weeks
															</span>
														</SelectItem>
														<SelectItem value="pro">
															<span className="font-medium">Pro</span> -{" "}
															<span className="text-muted-foreground">$9/month per user</span>
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline">Cancel</Button>
										<Button type="submit">Continue</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</aside>
					<div className="flex-1 lg:max-w-2xl">hi there</div>
				</div>
			</div>
		</main>
	);
}
