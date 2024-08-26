import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { VideoPerformanceGraph } from "@/components/graphs/video-performance";

import { Button } from "../ui/button";
import { VideoOverview } from "./overview";
import { RevenueTable } from "./revenueTable";
import { VideoRank } from "./videoRank";

export function SingleVideoAnalyticsContent({ video }: any) {
	return (
		<div className="grid grid-cols-1 gap-y-2 p-3 lg:grid-cols-3 lg:gap-2">
			<div className="col-span-1 space-y-2">
				<div className="space-y-2">
					<Link href="/analytics">
						<Button variant="outline" className="w-full">
							<ArrowLeft className="mr-2 h-4" />
							<span>All Videos</span>
						</Button>
					</Link>
					<VideoOverview />
				</div>
				<VideoRank />
			</div>
			<div className="col-span-2 space-y-2">
				<VideoPerformanceGraph />
				<RevenueTable />
			</div>
		</div>
	);
}
