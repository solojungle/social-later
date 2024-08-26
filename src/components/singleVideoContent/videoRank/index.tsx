"use client";

import { useState } from "react";

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
							<SelectItem value="long">Long Form</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col space-y-2">
				{rankedVideos.map((video) => (
					<div key={video.rank} className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<span>{video.rank}</span>
							<img
								src={video.thumbnail}
								className="aspect-video rounded-lg text-xs"
							/>
							<h3 className="text-sm font-semibold">{video.title}</h3>
							<p className="text-xs text-gray-500">{video.views} views</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
