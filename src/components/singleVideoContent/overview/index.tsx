"use client";

import { formatDistanceToNow } from "date-fns";

import { formatNumber } from "@/components/graphs/view-comparisons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VideoOverview({ title, passedData, post }: any) {
	if (!post || !passedData) {
		return null;
	}

	const thumbnail = post?.attachment[0].thumbnail;
	const uploadedDate = new Date(post?.scheduledFor);

	const stats = {
		views: 0,
		likes: 0,
		comments: 0,
		viewsPerHour: 0,
	};

	if (passedData) {
		stats.views = passedData.viewCount;
		stats.likes = passedData.likeCount;
		stats.comments = passedData.commentCount;
		stats.viewsPerHour = passedData.viewsPerHour;
	}

	return (
		<Card className="rounded-sm shadow-none">
			<CardHeader>
				<CardTitle>Video Statistics</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col space-y-2">
				<div className="mb-4 flex flex-col space-y-2">
					<img
						src={thumbnail}
						alt="thumbnail"
						className="aspect-video rounded-sm object-cover"
					/>
					<span>{title}</span>
					<span className="text-xs text-muted-foreground">
						Uploaded {formatDistanceToNow(uploadedDate)} ago
					</span>
				</div>
				<div className="flex flex-col space-y-2 text-sm">
					<div className="flex justify-between">
						<span>Views</span>
						<span className="font-semibold">{formatNumber(stats.views)}</span>
					</div>
					<div className="flex justify-between">
						<span>Likes</span>
						<span className="font-semibold">{formatNumber(stats.likes)}</span>
					</div>
					<div className="flex justify-between">
						<span>Comments</span>
						<span className="font-semibold">
							{formatNumber(stats.comments)}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Views per hour</span>
						<span className="font-semibold">
							{formatNumber(stats.viewsPerHour)}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
