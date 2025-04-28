"use client";

import { Section } from "@/landing/components/styledSection";
import { motion } from "framer-motion";
import { CornerLeftDown } from "lucide-react";
import { useEffect, useState } from "react";

export function ProductShowCase() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Section variant="transparent">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative flex w-full flex-col items-center justify-center"
        initial={{ opacity: 0, y: 100 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="absolute right-0 top-[-30px] flex rotate-3 items-center space-x-2">
          <CornerLeftDown className="mt-2 h-4 w-4" />
          <p className="text-sm">Play with this arcade!</p>
        </div>
        <div className="flex h-[30vh] w-full overflow-hidden rounded-xl border-border sm:h-[70vh] sm:border sm:shadow-lg">
          <iframe
            allow="clipboard-write"
            allowFullScreen
            className="grow"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            src="https://demo.arcade.software/AEWm4UM96Qph59yj2Z2I?embed&show_copy_link=true"
            title="FeedFrenzy"
          />
        </div>
      </motion.div>
    </Section>
  );
}
