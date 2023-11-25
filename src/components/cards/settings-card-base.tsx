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

interface SettingsCardBaseProps {
	content: any;
	title?: string;
	description?: string;
	buttonContent?: string;
	footerSubtitle: string;
}

export function SettingsCardBase({
	content,
	title,
	description,
	buttonContent = "Save",
	footerSubtitle,
}: SettingsCardBaseProps) {
	return (
		<Card>
			<CardHeader>
				{title && <CardTitle className="mb-2">{title}</CardTitle>}
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="flex items-center justify-between">
				{content}
			</CardContent>
			<div className="rounded-b-xl bg-muted">
				<Separator className="my-2" />
				<CardFooter className="flex justify-between pb-2">
					<span className="text-sm text-muted-foreground">
						{footerSubtitle}
					</span>
					<Button type="submit">{buttonContent}</Button>
				</CardFooter>
			</div>
		</Card>
	);
}
