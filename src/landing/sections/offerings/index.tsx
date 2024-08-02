// What features we offer as a company

import { EyeIcon, FlaskConical, MapIcon } from "lucide-react";

import { Section } from "@/landing/components/styledSection";

// Answers the question: Who Is This For?
export function ProductOfferings() {
	return (
		<Section>
			<div>
				<h2 className="font-vollkorn text-6xl font-bold">
					Plan, approve, achieve.
				</h2>
				<p className="mt-2 text-lg">
					Made specifically for the type of people who want to be
				</p>
			</div>
			<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="">
					<div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-stone-300">
						<EyeIcon className="h-5 w-5" />
					</div>
					<p className="mb-3">The Visionary</p>
					<h3 className="font-vollkorn text-2xl font-bold">
						Managing the chaos.
					</h3>
					<p className="mt-2">
						This product is for the professional who sees the big picture across
						multiple platforms. You&apos;re ready to streamline your workflow
						and amplify your impact with a unified solution that matches your
						vision.
					</p>
				</div>

				<div className="">
					<div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-stone-300">
						<MapIcon className="h-5 w-5" />
					</div>
					<p className="mb-3">The Strategist</p>
					<h3 className="font-vollkorn text-2xl font-bold">
						Seeing all the things.
					</h3>
					<p className="mt-2">
						For the analyst who thrives on metrics and performance. You value a
						centralized hub for planning, approving, and analyzing content,
						turning insights into action across all your social channels.
					</p>
				</div>

				<div className="">
					<div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-stone-300">
						<FlaskConical className="h-5 w-5" />
					</div>
					<p className="mb-3">The Innovator</p>
					<h3 className="font-vollkorn text-2xl font-bold">Shaping a brand.</h3>
					<p className="mt-2">
						Our platform is designed for the innovator who&apos;s always one
						step ahead. You&apos;re expanding your digital footprint and need
						advanced features, scalability, and comprehensive analytics to fuel
						your growth.
					</p>
				</div>
			</div>
		</Section>
	);
}
