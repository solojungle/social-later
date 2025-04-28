"use client";

import { Button } from "@/components/ui/button";
import { AvatarCircles } from "@/landing/components/avatarCircles";
import { Section } from "@/landing/components/styledSection";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <Section variant="transparent">
      <motion.div
        animate={{ opacity: 1 }}
        className="mb-8 space-y-4 leading-tight tracking-tight md:max-w-4xl"
        initial={{ opacity: 0 }}
        transition={{ staggerChildren: 0.3 }}
      >
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="font-vollkorn text-6xl md:text-8xl"
          initial={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4 }}
        >
          Streamline social strategy, effortlessly.
        </motion.h1>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl text-lg leading-normal"
          initial={{ opacity: 0, y: 100 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Plan content, approve, schedule, and analyze posts across all your
          platforms to deliver the best marketing results. Social media
          shouldn&apos;t be an extreme sport.
        </motion.p>
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 100 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <motion.div className="max-w-xs">
          <Link href="/login">
            <Button className="flex items-center justify-center" size="lg">
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
