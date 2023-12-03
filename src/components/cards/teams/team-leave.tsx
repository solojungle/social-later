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

export function TeamLeaveCard() {
	return (
		<Card className="border border-destructive">
			<CardHeader>
				<CardTitle className="mb-2">Leave Team</CardTitle>
				<CardDescription className="text-black">
					Revoke your access to this Team. Any resources you&apos;ve added to
					the Team will remain.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center justify-between" />
			<div className="rounded-b-xl bg-red-100">
				<Separator className="my-2 bg-destructive" />
				<CardFooter className="flex justify-end pb-2">
					<Button variant="destructive">Leave Team</Button>
				</CardFooter>
			</div>
		</Card>
	);
}
