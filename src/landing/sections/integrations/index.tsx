import { Section } from "@/landing/components/styledSection";

export function Integrations() {
	return (
		<Section variant="color" className="relative">
			<div className="grid grid-cols-1 gap-24 xl:grid-cols-2">
				<div>
					<h2 className="mb-8 max-w-3xl font-vollkorn text-6xl font-bold">
						Oh, we&apos;re very social
					</h2>
					<p className="mb-8 max-w-xl leading-normal">
						FeedFrenzy builds and maintains strong network partnerships and
						integrations to help you unify your customer touch points and keep
						pace with changes in the social landscape.
					</p>
					<a className="text-lg underline">See all integrations</a>
				</div>
				<img
					src="/images/integrations.png"
					className="w-full max-w-sm self-center shadow-lg"
					alt="Logos of the following companies: Facebook, Twitter, Instagram, LinkedIn, Pinterest, Google Business Profile, TikTok, Snapchat, YouTube, Reddit, Tumblr, and more."
				/>
			</div>
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black to-transparent opacity-50" />
		</Section>
	);
}
