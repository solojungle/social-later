import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PublishPage() {
	// const createPost = api.twitter.createPost.useMutation();

	return (
		<main className="">
			<div className="space-y-6 p-10 pb-16 md:block">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Publish</h2>
					<p className="text-muted-foreground">
						Tools to help you to create posts.
					</p>
				</div>
				<Separator className="my-6" />
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="-mx-4 lg:w-1/5">
						<div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
							<Button type="submit">Send Tweet</Button>
						</div>
						<div>{/* <LinkTwitterButton /> */}</div>
					</aside>
					<div className="flex-1 lg:max-w-2xl">{/* <CreatePost /> */}</div>
				</div>
			</div>
		</main>
	);
}
