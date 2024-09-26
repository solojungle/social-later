import { api } from "@/trpc/react";

export const useThreads = () => {
	const { mutateAsync: createThreadsPost } =
		api.threads.createThreadsPost.useMutation();
	const { mutateAsync: createPost } = api.post.create.useMutation();
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
	};
};
