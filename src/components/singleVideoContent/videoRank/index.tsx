"use client";

import { useState } from "react";

import { formatNumber } from "@/components/graphs/view-comparisons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const defaultData = [
	{
		id: "0uOMuXbsZPU",
		title: "The Weeknd - Save Your Tears (Official Music Video)",
		thumbnail: "",
		views: 1000,
	},
	{
		id: "0uOMuXbsZPU",
		title: "The Weeknd - Save Your Tears (Official Music Video)",
		thumbnail: "",
		views: 1000,
	},
	{
		id: "0uOMuXbsZPU",
		title: "The Weeknd - Save Your Tears (Official Music Video)",
		thumbnail: "",
		views: 1000,
	},
	{
		id: "0uOMuXbsZPU",
		title: "The Weeknd - Save Your Tears (Official Music Video)",
		thumbnail: "",
		views: 1000,
	},
	{
		id: "0uOMuXbsZPU",
		title: "The Weeknd - Save Your Tears (Official Music Video)",
		thumbnail: "",
		views: 1000,
	},
	{
		id: "0uOMuXbsZPU",
		title: "The Weeknd - Save Your Tears (Official Music Video)",
		thumbnail: "",
		views: 1000,
	},
	{
		id: "0uOMuXbsZPU",
		title: "The Weeknd - Save Your Tears (Official Music Video)",
		thumbnail: "",
		views: 1000,
	},
	{
		id: "0uOMuXbsZPU",
		title: "The Weeknd - Save Your Tears (Official Music Video)",
		thumbnail: "",
		views: 1000,
	},
];

export function VideoRank() {
	const [type, setType] = useState("all");

	const rankedVideos = defaultData.map((video, index) => {
		return {
			...video,
			rank: index + 1,
		};
	});

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
			<CardContent className="flex flex-col space-y-2">
				<ol className="grid w-full grid-cols-[auto,40px,1fr,auto] items-center gap-2">
					{rankedVideos.map((video) => (
						<li className="contents" key={video.rank}>
							<span className="text-xs">{video.rank}</span>
							<img
								src={video.thumbnail}
								alt={video.title}
								className="aspect-video h-10 overflow-hidden rounded-sm bg-red-500"
							/>
							<h3 className="text-sm">{video.title}</h3>
							<p className="justify-self-end text-xs font-semibold">
								{formatNumber(video.views)}
							</p>
						</li>
					))}
				</ol>
			</CardContent>
		</Card>
	);
}
