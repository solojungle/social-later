"use client";

import { motion } from "framer-motion";
import { CornerLeftDown } from "lucide-react";

import { Section } from "@/landing/components/styledSection";

export function ProductShowCase() {
	return (
		<Section>
			<motion.div
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.4, delay: 0.3 }}
				className="relative flex w-full flex-col items-center justify-center"
			>
				{/* <div className="relative flex w-full flex-col items-center justify-center"> */}
				<div className="absolute right-0 top-[-30px] flex rotate-3 items-center space-x-2 text-stone-400">
					<CornerLeftDown className="mt-2 h-4 w-4" />
					<p className="text-sm">Play with this arcade!</p>
				</div>
				<div className="flex h-[30vh] w-full overflow-hidden rounded-xl border-border sm:h-[70vh] sm:border sm:shadow-lg">
					<iframe
						src="https://demo.arcade.software/AEWm4UM96Qph59yj2Z2I?embed&show_copy_link=true"
						title="FeedFrenzy"
						loading="lazy"
						allowFullScreen
						allow="clipboard-write"
						referrerPolicy="strict-origin-when-cross-origin"
						className="grow"
					/>
				</div>
			</motion.div>
		</Section>
	);
}
