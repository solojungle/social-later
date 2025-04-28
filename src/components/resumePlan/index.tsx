import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Award, Rocket, Star, Zap } from "lucide-react";
import Link from "next/link";

function ListedItem({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className: string | undefined }>;
}) {
  return (
    <motion.li
      animate={{ opacity: 1, x: 0 }}
      className="mb-4 flex items-center"
      initial={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Icon className="mr-3 h-4 w-4 text-background dark:text-white" />
      <span className="text-sm">{children}</span>
    </motion.li>
  );
}

const benefits = [
  { icon: Zap, id: 1, text: "Collaborate with up to 10 team members" },
  { icon: Star, id: 2, text: "Manage up to 15 social profiles effortlessly" },
  { icon: Award, id: 3, text: "Advanced analytics and insights" },
  { icon: Rocket, id: 4, text: "24/7 priority support" },
];

export function ResumeSubscription({ teamId }: { teamId: string }) {
  return (
    <Card className="m-3 mx-auto mt-28 w-full max-w-4xl overflow-hidden rounded-md shadow-none">
      <div className="flex flex-col md:flex-row">
        <div className="bg-teal-950 p-8 text-background dark:text-white md:w-1/2">
          <h2 className="mb-6 font-vollkorn text-5xl font-bold">
            Resume your subscription
          </h2>
          <p className="mb-8 text-sm">
            Keep your social media management at the next level with our paid
            plans.
          </p>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <ListedItem icon={benefit.icon} key={benefit.id}>
                {benefit.text}
              </ListedItem>
            ))}
          </ul>
        </div>

        <div
          className="flex flex-col bg-stone-100 p-8
				 dark:bg-stone-900 md:w-1/2"
        >
          <div className="mb-8">
            <h3 className="my-4 font-vollkorn text-4xl text-secondary-foreground">
              Ready to resume?
            </h3>
            <p className="mb-6">
              Thousands of satisfied users are already using our paid plans to
              manage their social media.
            </p>
          </div>
          <Link href={`/teams/${teamId}/settings?page=billing`}>
            <Button className="w-full py-6" size="lg">
              Upgrade to paid
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
