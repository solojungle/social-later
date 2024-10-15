import { api } from "@/trpc/react";

interface AnalyticsData {
	historicalData: { date: any; views: number; subscribers_gained: number }[];
	realtimeData: any;
}

export const useYouTube = () => {
	const { mutateAsync: uploadVideo } =
		api.socials.uploadYouTubeVideo.useMutation();
	const { mutateAsync: changeThumbnail } =
		api.socials.changeVideoThumbnail.useMutation();
	const { mutateAsync: createPost } = api.post.create.useMutation();
	const { mutateAsync: updateThumbnail } =
		api.post.updateThumbnail.useMutation();
	function getAnalytics({ postId }: { postId: string }) {
		const { data, isLoading } =
			api.analytics.getSingleVideoAnalytics.useQuery<AnalyticsData>(
				{
					postId,
				},
				{
					enabled: !!postId && postId !== "",
				},
			);

		return {
			data,
			isLoading,
		};
	}
	function getCombinedAnalytics({
		profileId,
		profileType,
	}: {
		profileId: string;
		profileType: string | undefined;
	}) {
		const { data, isLoading, isError } =
			api.analytics.combinedYouTubeAnalytics.useQuery(
				{
					profileId,
				},
				{
					enabled: !!profileId && profileId !== "" && profileType === "youtube",
					staleTime: 1000 * 60 * 60 * 24, // 24 hours
				},
			);

		return {
			data,
			isLoading,
			isError,
		};
	}
	function getPostAnalytics({ youtubePostId }: { youtubePostId: string }) {
		const { data, isLoading, isError } = api.post.getFromExternalId.useQuery(
			{
				externalPostId: youtubePostId,
			},
			{
				enabled: !!youtubePostId,
				staleTime: 1000 * 60 * 60 * 24, // 24 hours
			},
		);

		return {
			data,
			isLoading,
			isError,
		};
	}

	return {
		uploadVideo,
		createPost,
		changeThumbnail,
		updateThumbnail,
		getAnalytics,
		getPostAnalytics,
		getCombinedAnalytics,
	};
};
