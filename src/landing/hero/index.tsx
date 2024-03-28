import { ArrowUpRight, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="flex h-screen flex-col items-center justify-center space-y-14 px-4">
			<div className="container max-w-4xl space-y-8 text-center leading-tight tracking-tight">
				<h1 className="text-6xl">
					Social Media Management. <br />
					<span className="font-tiempos italic">
						Easy, Productive, Organized.
					</span>
				</h1>
				<p className="text-xl">
					Juggling multiple clients, platforms, and teamwork shouldn&apos;t be
					an extreme sport. Plan content, approve, schedule, and analyze to
					deliver the best marketing results.
				</p>
			</div>
			<div className="space-y-3">
				<Button size="lg" className="flex items-center justify-center">
					Start a 14-day free trial <ArrowUpRight className="ml-2 h-5 w-5" />
				</Button>
				<p className="flex items-center justify-center text-xs text-muted-foreground">
					<CheckIcon className="mr-1 h-4 w-4" /> No credit card required.
				</p>
			</div>
		</section>
	);
}
