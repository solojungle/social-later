"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Hero() {
	return (
		<section className="flex h-screen flex-col items-center justify-center space-y-14 px-4">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ staggerChildren: 0.3 }}
				className="container max-w-4xl space-y-10 text-center leading-tight tracking-tight"
			>
				<motion.h1
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="text-6xl"
				>
					Social Media Management. <br />
					<span className="font-tiempos italic">
						Easy, Productive, Organized.
					</span>
				</motion.h1>
				<motion.p
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.2 }}
					className="text-xl leading-normal"
				>
					Juggling multiple clients, platforms, and teamwork shouldn&apos;t be
					an extreme sport. Plan content, approve, schedule, and analyze to
					deliver the best marketing results.
				</motion.p>
			</motion.div>
			<motion.div
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.4, delay: 0.3 }}
				className="space-y-3"
			>
				<motion.div whileHover={{ scale: 1.05 }}>
					<Button size="lg" className="flex items-center justify-center">
						Start a 14-day free trial <ArrowUpRight className="ml-2 h-5 w-5" />
					</Button>
				</motion.div>
				<p className="flex items-center justify-center text-xs text-muted-foreground">
					<CheckIcon className="mr-1 h-4 w-4" /> No credit card required.
				</p>
			</motion.div>
		</section>
	);
}
