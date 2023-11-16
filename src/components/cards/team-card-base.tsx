import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TeamCardBaseProps {
	content: any;
	title: string;
	description: string;
	footerSubtitle: string;
}

export function TeamCardBase({
	content,
	title,
	description,
	footerSubtitle,
}: TeamCardBaseProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="mb-2">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center justify-between">
				{content}
			</CardContent>
			<div className="rounded-b-lg bg-muted">
				<Separator className="my-2" />
				<CardFooter className="flex justify-between pb-2">
					<span className="text-sm text-muted-foreground">
						{footerSubtitle}
					</span>
					<Button>Save</Button>
				</CardFooter>
			</div>
		</Card>
	);
}
