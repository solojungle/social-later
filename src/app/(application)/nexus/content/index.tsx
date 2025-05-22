import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { InterfaceIcons } from "@/components/ui/icons";

function ArticleCards() {
  return (
    <article className="group relative col-span-1 grid h-[141px] w-full select-none items-end justify-start overflow-hidden rounded-lg border border-border bg-background p-5 shadow-card hover:bg-primary-foreground/50">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          How to Create an Arcade
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          A four-step guide to getting started
        </p>
      </div>
    </article>
  );
}

function Articles() {
  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-lg font-semibold">Articles</h1>
      <div className="flex w-full gap-4">
        <ArticleCards />
        <ArticleCards />
        <ArticleCards />
      </div>
    </div>
  );
}

function NewsAndUpdates() {
  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-lg font-semibold">News & Updates</h1>
      <div className="flex w-full flex-wrap gap-4">
        <NewsCard />
        <NewsCard />
        <NewsCard />
        <SeeMoreNewsCard />
      </div>
    </div>
  );
}

function NewsCard() {
  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.article
      className="flex w-64 flex-col overflow-hidden rounded-lg border border-border transition-all duration-150 hover:border-primary hover:bg-primary-foreground/50 hover:shadow-md"
      initial="hidden"
      whileHover="visible"
    >
      <div className="relative">
        <img
          alt="placeholder"
          className="aspect-video h-40 object-cover"
          src="https://via.placeholder.com/150"
        />
        <motion.div
          transition={{ duration: 0.15, ease: "easeOut" }}
          variants={variants}
        >
          <Badge className="absolute bottom-2 left-2">
            Edited {new Date().toLocaleDateString()}
          </Badge>
        </motion.div>
      </div>
      <div className="w-full px-2 py-4">
        <h2 className="text-sm font-semibold">How to Create an Arcade</h2>
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
      <InterfaceIcons.Next className="ml-1 size-4 text-primary" />
    </article>
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
