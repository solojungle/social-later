import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Section } from "@/landing/components/styledSection";

export function Pricing() {
	return (
		<Section>
			<h2 className="mb-8 max-w-3xl font-vollkorn text-6xl font-bold">
				Simple pricing, that allows you to test the waters.
			</h2>
			<p className="max-w-xl leading-normal">
				Plan content, approve, schedule, and analyze posts across all your
				platforms to deliver the best marketing results. Social media
				shouldn&apos;t be an extreme sport.
			</p>
			<div>
				<div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="rounded-xl border border-border bg-stone-200 p-8 shadow hover:border-black">
						<h3 className="mb-6 font-vollkorn text-xl">
							Questionnaire Package
						</h3>
						<p className="mt-2 font-vollkorn text-6xl">$9.97</p>
						<div className="mt-6 space-y-6">
							<ul className="list-inside list-disc text-base">
								<li>1 user</li>
								<li>1 social account</li>
								<li>10 scheduled posts</li>
								<li>Basic analytics</li>
							</ul>
							<a href="/login" className="flex items-center">
								<Button className="flex items-center">
									<span className="mr-1">Sign up</span>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</a>
						</div>
					</div>

					<div className="relative overflow-hidden rounded-xl border border-border bg-stone-200 p-8 shadow hover:border-black">
						<div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-t from-cyan-950 to-cyan-900 px-2 py-1 font-vollkorn text-white">
							Most Popular
						</div>
						<h3 className="mb-6 font-vollkorn text-xl">Survey Package</h3>
						<p className="mt-2 font-vollkorn text-6xl">$19.97</p>
						<div className="mt-6 space-y-6">
							<ul className="list-inside list-disc text-base">
								<li>1 user</li>
								<li>3 social accounts</li>
								<li>30 scheduled posts</li>
								<li>Advanced analytics</li>
							</ul>
							<a href="/login" className="flex items-center">
								<Button className="flex items-center">
									<span className="mr-1">Sign up</span>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</a>

							<Separator className="bg-muted-foreground" />

							<p className="text-sm">
								You submit a questionnaire, and we will send it to 10
								hand-picked participants who match your requested attributes
								and/or experience.
							</p>
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
}
