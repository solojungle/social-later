"use client";

import { formatDistanceToNow } from "date-fns";

import { formatNumber } from "@/components/graphs/view-comparisons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VideoOverview({
	views = 100,
	likes = 200,
	comments = 10,
	viewsPerHour = 1000,
	uploadedDate,
	title,
	thumbnail,
}: any) {
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
						className="aspect-video rounded-sm bg-red-500"
					/>
					<span>{title}</span>
					<span className="text-xs text-muted-foreground">
						Uploaded {formatDistanceToNow(new Date())}{" "}
					</span>
				</div>
				<div className="flex flex-col space-y-2 text-sm">
					<div className="flex justify-between">
						<span>Views</span>
						<span className="font-semibold">{formatNumber(views)}</span>
					</div>
					<div className="flex justify-between">
						<span>Likes</span>
						<span className="font-semibold">{formatNumber(likes)}</span>
					</div>
					<div className="flex justify-between">
						<span>Comments</span>
						<span className="font-semibold">{formatNumber(comments)}</span>
					</div>
					<div className="flex justify-between">
						<span>Views per hour</span>
						<span className="font-semibold">{formatNumber(viewsPerHour)}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
