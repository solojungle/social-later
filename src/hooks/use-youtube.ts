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
					enabled: !!postId,
				},
			);

		return {
			data,
			isLoading,
		};
	}

	return {
		uploadVideo,
		createPost,
		changeThumbnail,
		updateThumbnail,
		getAnalytics,
	};
};
