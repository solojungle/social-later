"use client";

import { InterfaceIcons } from "@/components/ui/icons";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThreads } from "@/hooks/use-threads";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { formatDistanceToNow } from "date-fns";
import { StatsCard } from "../statsCard";
import { Last10Posts } from "../threadsComponents/last10";

export const ThreadsAnalyticsTab = () => {
	const { currentProfileId } = useSocialProfilesStore();

	const { getUserMetrics, getLast10 } = useThreads();

	const { data, isLoading } = getUserMetrics({ profileId: currentProfileId });
	const { data: last10Posts, isLoading: last10PostsLoading } = getLast10({
		profileId: currentProfileId,
	});

	if (!data || isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-96">
				<InterfaceIcons.Loading className="w-16 h-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-y-2 lg:grid-cols-3 lg:gap-2">
			<TooltipProvider>
				<div className="col-span-2 space-y-2">
					<div className="w-full p-3 text-sm border rounded-sm border-border">
						<div className="mb-8">
							<h2 className="font-medium">Performance Summary</h2>
							<p className="text-muted-foreground">
								View your key performance metrics from the reporting
							</p>
						</div>
						<div className="grid grid-cols-2 gap-6 divide-x lg:grid-cols-6 [&>*:nth-child(odd)]:border-none lg:[&>*:nth-child(odd)]:border-solid ">
							<StatsCard
								title="Followers"
								value={data.followers_count ?? 0}
								increasedBy="0"
								tooltip="The total amount of followers that your channel has."
							/>
							<StatsCard
								title="Views"
								value={data.views ?? 0}
								increasedBy="0"
								tooltip="The total amount of views that your posts have."
							/>
							<StatsCard
								title="Likes"
								value={data.likes ?? 0}
								increasedBy="0"
								tooltip="The total amount of likes that your posts have."
							/>
							<StatsCard
								title="Replies"
								value={data.replies ?? 0}
								increasedBy="0"
								tooltip="The total amount of replies that your posts have."
							/>
							<StatsCard
								title="Reposts"
								value={data.reposts ?? 0}
								increasedBy="0"
								tooltip="The total amount of reposts that your posts have."
							/>
							<StatsCard
								title="Quotes"
								value={data.quotes ?? 0}
								increasedBy="0"
								tooltip="The total amount of quotes that your posts have."
							/>
						</div>
					</div>
					<div className="w-full p-3 text-sm border rounded-sm border-border">
						<div className="mb-6">
							<h2 className="font-medium">Last 10 Videos</h2>
							<p className="text-muted-foreground">
								Ranked by the most views per post
							</p>
						</div>
						<div className="flex flex-col gap-4 divide-y [&>*:nth-child(odd)]:border-none lg:[&>*:nth-child(odd)]:border-solid">
							{last10Posts && last10Posts?.map((post) => (
								<div
									key={post.id}
									className="flex items-center justify-between py-2 grow"
								>
									<div className="flex items-center flex-1 min-w-0 gap-2">
										{post.thumbnail_url && (
										<img src={post.thumbnail_url} className="object-cover h-12 rounded-lg aspect-video shrink-0" />
										)}
										<div>
											<span className="text-xs text-muted-foreground">{
												`${formatDistanceToNow(post.timestamp)} ago`
												}</span>
										<p className="min-w-0 text-sm truncate sm:text-base">
											{post.text || "No caption"}
										</p>
										</div>
									</div>
									<div className="ml-2">
										<Last10Posts
											stats={[
												{ title: "Views", value: 0 },
												{ title: "Likes", value: 0 },
												{ title: "Replies", value: 0 },
												{ title: "Reposts", value: 0 },
												{ title: "Quotes", value: 0 },
											]}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</TooltipProvider>
		</div>
	);
};
