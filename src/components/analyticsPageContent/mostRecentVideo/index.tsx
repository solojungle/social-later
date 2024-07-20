"use client";

import { Button } from "@/components/ui/button";

import { formatNumber } from "../viewsComparisons";

type Props = {
	thumbnail: string;
	title: string;
	url: string;
	views: string;
};

export function MostRecentVideo({ thumbnail, title, views, url }: Props) {
	if (!url) {
		return null;
	}

	return (
		<div className="w-full rounded-sm border border-border p-3 text-sm">
			<div className="mb-4">
				<h2 className="font-medium">Most Recent Video</h2>
			</div>
			<div className="mb-6 flex flex-col items-center space-y-1 ">
				<a href={url} target="_blank" rel="noreferrer" className="w-full">
					<img
						src={thumbnail}
						alt="thumbnail"
						className="aspect-video w-full rounded-lg object-cover"
					/>
				</a>
				<div className="w-full">
					<p className="mb-4 line-clamp-1 font-medium">{title}</p>
					<div className="flex space-x-2">
						<p>Total views -</p>
						<p className="font-medium">{formatNumber(views)}</p>
					</div>
				</div>
			</div>
			<Button className="w-full" size="sm" disabled>
				More video analytics
			</Button>
		</div>
	);
}
