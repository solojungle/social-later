import { api } from "@/trpc/react";

export const useThreads = () => {
	const { mutateAsync: createThreadsPost } =
		api.threads.createThreadsPost.useMutation();
	const { mutateAsync: createPost } = api.post.create.useMutation();
	function getLast10({ profileId }: { profileId: string }) {
		const { data, isLoading } = api.threads.last10Posts.useQuery(
			{
				profileId,
			},
			{
				enabled: !!profileId && profileId !== "",
			},
		);

		return {
			data,
			isLoading,
		};
	}
	function getUserMetrics({ profileId }: { profileId: string }) {
		const { data, isLoading } = api.threads.getUserInsights.useQuery(
			{
				profileId,
			},
			{
				enabled: !!profileId && profileId !== "",
			},
		);

		return {
			data,
			isLoading,
		};
	}
	function getMetrics({ postId }: { postId: string }) {
		const { data, isLoading } = api.threads.getPostInsights.useQuery(
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

	return {
		createThreadsPost,
		createPost,
		getMetrics,
		getUserMetrics,
		getLast10,
	};
};
