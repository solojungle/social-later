import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function Pricing() {
	return (
		<div className="p-5">
			<div className="grid w-full grid-cols-1 gap-2 pt-2 md:grid-cols-3 lg:gap-4 xl:grid-cols-3">
				<Card>
					<CardHeader className="">
						<CardTitle>Free</CardTitle>
						<CardDescription>
							For individuals and businesses getting started with social media.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul>
							<li>Connect up to 3 channels</li>
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Impressions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+45,231</div>
						<p className="text-xs text-muted-foreground">
							+20.1% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Impressions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+45,231</div>
						<p className="text-xs text-muted-foreground">
							+20.1% from last month
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
