"use client";

import { VideoPerformanceGraph } from "@/components/graphs/video-performance";
import { useYouTube } from "@/hooks/use-youtube";
import { api } from "@/trpc/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";
import { InterfaceIcons } from "../ui/icons";
import { VideoOverview } from "./overview";
import { RevenueTable } from "./revenueTable";
import { VideoRank } from "./videoRank";

export function SingleVideoAnalyticsContent({ postId }: any) {
  const { getAnalytics } = useYouTube();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = getAnalytics({
    postId,
  });

  // Get the single post data from the API
  const {
    data: postData,
    isFetching,
    isLoading,
  } = api.post.get.useQuery(
    {
      internalPostId: postId,
    },
    {
      enabled: !!postId,
    },
  );

  if (isLoading || isFetching || isAnalyticsLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-2 p-3 lg:grid-cols-3 lg:gap-2">
      <div className="col-span-1 space-y-2">
        <div className="space-y-2">
          <Link href="/analytics">
            <Button className="w-full" variant="outline">
              <ArrowLeft className="mr-2 h-4" />
              <span>Overview Analytics</span>
            </Button>
          </Link>
          <VideoOverview
            passedData={analyticsData?.realtimeData}
            post={postData}
          />
        </div>
        <VideoRank post={postData} />
      </div>
      <div className="col-span-2 space-y-2">
        <VideoPerformanceGraph passedData={analyticsData?.historicalData} />
        <RevenueTable passedData={analyticsData?.historicalData} />
      </div>
    </div>
  );
}
