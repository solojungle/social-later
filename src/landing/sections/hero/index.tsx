"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AvatarCircles } from "@/landing/components/avatarCircles";
import { Section } from "@/landing/components/styledSection";

export function Hero() {
	return (
		<Section variant="transparent">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ staggerChildren: 0.3 }}
				className="mb-8 space-y-4 leading-tight tracking-tight md:max-w-4xl"
			>
				<motion.h1
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="font-vollkorn text-6xl md:text-8xl"
				>
					Streamline social strategy, effortlessly.
				</motion.h1>
				<motion.p
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.2 }}
					className="max-w-xl text-lg leading-normal"
				>
					Plan content, approve, schedule, and analyze posts across all your
					platforms to deliver the best marketing results. Social media
					shouldn&apos;t be an extreme sport.
				</motion.p>
			</motion.div>
			<motion.div
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.4, delay: 0.3 }}
			>
				<motion.div className="max-w-xs">
					<Link href="/login">
						<Button size="lg" className="flex items-center justify-center">
							Get started today <ArrowUpRight className="ml-2 h-5 w-5" />
						</Button>
					</Link>
				</motion.div>
				<AvatarCircles
					avatarUrls={[
						"images/avatar1.png",
						"images/avatar2.jpg",
						"images/avatar3.jpg",
						"images/avatar4.jpg",
					]}
				/>
			</motion.div>
		</Section>
	);
}
