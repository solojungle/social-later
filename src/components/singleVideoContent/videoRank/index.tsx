"use client";

import { useMemo, useState } from "react";

import { formatNumber } from "@/components/graphs/view-comparisons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

function VideoRankContent({ post }: any) {
	const { currentProfileId: profileId } = useSocialProfilesStore();
	const [type, setType] = useState("all");

	const { data } = api.analytics.rankVideoAmongLastTen.useQuery(
		{
			profileId,
			videoId: post.externalPostId,
		},
		{
			enabled: !!profileId,
		},
	);

	const defaultData = data?.comparedVideos ?? [];

	const rankedVideos = defaultData.map((video, index) => {
		return {
			...video,
			rank: index + 1,
		};
	});

	const currentRank = data?.rank ?? 0;

	// We will always compare the current video with the last 10 videos
	// The last 10 videos will be filtered by type
	const filteredData = useMemo(() => {
		if (type === "all") {
			return rankedVideos;
		}

		const filter = rankedVideos.filter((video) => {
			return video.isShort === (type === "short");
		});

		// Check if the current video is in the filtered list, if not add it
		const currentVideo = rankedVideos.find(
			(video) => video.rank === currentRank,
		);

		if (currentVideo && !filter.find((video) => video.rank === currentRank)) {
			filter.push(currentVideo);
		}

		return filter;
	}, [currentRank, rankedVideos, type]);

	return (
		<Card className="rounded-sm shadow-none">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Video Rank</CardTitle>
				<div className="flex items-center space-x-2">
					<Select value={type} onValueChange={setType}>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Videos</SelectItem>
							<SelectItem value="short">Shorts</SelectItem>
							<SelectItem value="long">Long</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent className="p-0 py-3">
				<ol className="space-y-2">
					{filteredData.map((video) => (
						<li
							key={video.rank}
							className={cn(
								"grid grid-cols-[auto,6rem,1fr,auto] items-center gap-3 px-4 py-px",
								currentRank === video.rank &&
									"bg-secondary py-1 text-secondary-foreground",
							)}
						>
							<span className="w-2 text-xs">{video.rank}</span>
							<div className="w-24">
								<div className="aspect-video">
									<img
										src={video.thumbnail}
										alt={video.title}
										className="h-full w-full rounded-sm object-cover"
									/>
								</div>
							</div>
							<div className="min-w-0">
								<h3 className="line-clamp-2 overflow-hidden text-ellipsis text-sm font-medium">
									{video.title}
								</h3>
							</div>
							<p className="whitespace-nowrap text-xs font-semibold">
								{formatNumber(video.views)}
							</p>
						</li>
					))}
				</ol>
			</CardContent>
		</Card>
	);
}

// Wrapper for the VideoRank component
export function VideoRank({ post }: any) {
	if (!post) {
		return null;
	}

	return <VideoRankContent post={post} />;
}
