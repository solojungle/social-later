"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AvatarCircles } from "../avatarCircles";

export default function Hero() {
	return (
		<section className="mb-10 flex h-[calc(100vh-225px)] w-full flex-col justify-center space-y-10 px-4 md:mb-4 md:px-10 lg:px-44">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ staggerChildren: 0.3 }}
				className="space-y-8 leading-tight tracking-tight md:max-w-4xl"
			>
				<motion.h1
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="font-vollkorn text-6xl md:text-7xl"
				>
					Streamline your social strategy before you start posting.
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
				<motion.div>
					<Button size="lg" className="flex items-center justify-center">
						Start a 14-day free trial <ArrowUpRight className="ml-2 h-5 w-5" />
					</Button>
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
		</section>
	);
}
