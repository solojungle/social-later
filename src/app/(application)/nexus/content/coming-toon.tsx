import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

function ArticleCards() {
	return (
		<article className="group relative col-span-1 grid h-[141px] w-full max-w-lg select-none items-end justify-start overflow-hidden rounded-lg border border-border p-5 pb-3 shadow-card hover:bg-primary-foreground/50">
			<div className="z-10 drop-shadow-md">
				<h2 className="text-sm font-semibold text-white">Coming soon</h2>
				<p className="mt-0.5 text-xs text-white">
					Articles will be added soon to help you get started with FeedFrenzy
				</p>
			</div>
			<div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-4/6 bg-gradient-to-t from-black to-transparent opacity-30" />
		</article>
	);
}

function Articles() {
	return (
		<div className="flex flex-col">
			<h1 className="mb-4 text-lg font-semibold">Articles</h1>
			<div className="flex w-full gap-4">
				<ArticleCards />
			</div>
		</div>
	);
}

function NewsCard() {
	const variants = {
		hidden: { y: 10, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	};

	return (
		<motion.article
			className="flex w-64 flex-col justify-end overflow-hidden rounded-lg border border-border transition-all duration-150 hover:border-primary hover:bg-primary-foreground/50 hover:shadow-md"
			initial="hidden"
			whileHover="visible"
		>
			<div className="relative">
				<motion.div
					variants={variants}
					transition={{ duration: 0.15, ease: "easeOut" }}
				>
					<Badge className="absolute bottom-2 left-2">
						Edited {new Date().toLocaleDateString()}
					</Badge>
				</motion.div>
			</div>
			<div className="w-full px-2 py-4">
				<h2 className="text-sm font-semibold">How to Create a Post</h2>
				<p className="mt-0.5 text-xs text-gray-600">
					A four-step guide to getting started
				</p>
			</div>
		</motion.article>
	);
}

function SeeMoreNewsCard() {
	return (
		<article className="flex h-60 w-64 items-center justify-center rounded-lg border border-border bg-primary-foreground/10 transition-all duration-150 hover:border-primary hover:bg-primary-foreground/50 hover:shadow-md">
			<p className="select-none text-sm font-semibold text-primary">See More</p>
			<ArrowRight className="ml-1 h-4 w-4 text-primary" />
		</article>
	);
}

function NewsAndUpdates() {
	return (
		<div className="flex flex-col">
			<h1 className="mb-4 text-lg font-semibold">News & Updates</h1>
			<div className="flex w-full flex-wrap gap-4">
				<SeeMoreNewsCard />
			</div>
		</div>
	);
}

export const NexusPageContent = () => {
	return (
		<div className="h-full !overflow-scroll p-3">
			<div className="flex flex-col space-y-6">
				<Articles />
				<NewsAndUpdates />
			</div>
		</div>
	);
};
