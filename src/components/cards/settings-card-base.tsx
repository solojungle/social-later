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

import { InterfaceIcons } from "../ui/icons";

interface SettingsCardBaseProps {
	content: any;
	title?: string;
	description?: string;
	buttonContent?: string;
	button?: any;
	footerSubtitle: string;
	isLoading?: boolean;
}

export function SettingsCardBase({
	content,
	title,
	description,
	buttonContent = "Save",
	footerSubtitle,
	button,
	isLoading = false,
}: SettingsCardBaseProps) {
	return (
		<Card className="w-full">
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
					{button || (
						<Button disabled={isLoading} type="submit">
							{isLoading && (
								<InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
							)}
							{buttonContent}
						</Button>
					)}
				</CardFooter>
			</div>
		</Card>
	);
}
