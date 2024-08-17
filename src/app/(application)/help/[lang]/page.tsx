import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function HelpCenterPage() {
	return (
		<div className="h-full space-y-2 !overflow-scroll p-3 pb-48">
			<div className="space-y-6">
				<div>
					<h1 className="text-lg font-medium">Help Center</h1>
					<p className="text-sm text-muted-foreground">
						Advice and answers from the FeedFrenzy Team
					</p>
				</div>
				<Separator />
				<Input placeholder="Search for articles..." />
				<div>
					<h2 className="text-lg font-medium">Popular Articles</h2>
					<p className="text-sm text-muted-foreground">
						These are the most popular articles in our help center
					</p>
				</div>
			</div>
		</div>
	);
}
