import { VideoPerformanceGraph } from "@/components/graphs/video-performance";

import { VideoOverview } from "./overview";
import { VideoRank } from "./videoRank";

export function SingleVideoAnalyticsContent({ video }: any) {
	return (
		<div className="grid grid-cols-1 gap-y-2 p-3 lg:grid-cols-3 lg:gap-2">
			<div className="col-span-1 space-y-2">
				<VideoOverview />
				<VideoRank />
			</div>
			<div className="col-span-2 space-y-2">
				<VideoPerformanceGraph />
			</div>
		</div>
	);
}
