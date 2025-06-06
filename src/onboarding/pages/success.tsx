import { CheckCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Confetti from "react-confetti";
import { useTimeout } from "react-use";
import { useWindowSize } from "usehooks-ts";

import { Countdown } from "@/components/countdown";
import { Button } from "@/components/ui/button";

export function SuccessPage({ callbackUrl }: { callbackUrl?: string }) {
  const { height = 0, width = 0 } = useWindowSize({
    initializeWithValue: false,
  });

  // after 2 seconds, stop the confetti animation
  const [showConfetti] = useTimeout(2500);

  // Handle invite codes
  let redirectUrl = "/nexus";
  if (callbackUrl && callbackUrl.length !== 0) {
    redirectUrl = callbackUrl;
  }

  return (
    <div className="flex flex-col p-5">
      <Confetti
        gravity={0.03}
        height={height}
        initialVelocityY={-5}
        numberOfPieces={200}
        recycle={!showConfetti()}
        tweenDuration={10000}
        width={width}
      />

      <div className="mb-4 flex flex-col md:mx-auto md:max-w-[540px] md:pt-[48px] lg:pt-[64px] xl:pt-[88px]">
        <CheckCircledIcon className="mb-4 size-24 self-center text-success" />
        <div className="mb-1 text-sm font-semibold uppercase">
          Congratulations!
        </div>
        <div className="mb-8 text-2xl font-bold">
          You&apos;re now ready to use FeedFrenzy!
        </div>
        <div className="mb-12 text-lg">
          You will be redirected to the Nexus, where you can start discovering
          FeedFrenzy.
        </div>
        <Link href={redirectUrl}>
          <Button className="group relative h-[64px] w-full justify-between self-center rounded-[8px] border border-gray-100 bg-primary text-lg font-semibold text-primary-foreground transition ease-in-out md:max-w-[540px]">
            Access FeedFrenzy
            <div className="flex size-5 items-center justify-center rounded-lg border border-border bg-primary p-5 text-primary-foreground">
              <Countdown url={redirectUrl} />
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
}
