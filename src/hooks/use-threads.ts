import { api } from "@/trpc/react";

export const useThreads = () => {
	const { mutateAsync: createThreadsPost } =
		api.socials.createThreadsPost.useMutation();
	const { mutateAsync: createPost } = api.post.create.useMutation();
	return {
		createThreadsPost,
		createPost,
		getMetrics: ({ postId }: { postId: string }) => ({
			data: [],
			isLoading: false,
		}),
	};
};
