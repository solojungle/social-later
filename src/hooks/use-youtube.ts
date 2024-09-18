import { api } from "@/trpc/react";

export const useYouTubeUpload = () => {
	const { mutateAsync: uploadVideo } =
		api.socials.uploadYouTubeVideo.useMutation();
	const { mutateAsync: changeThumbnail } =
		api.socials.changeVideoThumbnail.useMutation();
	const { mutateAsync: createPost } = api.post.create.useMutation();
	const { mutateAsync: updateThumbnail } =
		api.post.updateThumbnail.useMutation();

	return {
		uploadVideo,
		createPost,
		changeThumbnail,
		updateThumbnail,
	};
};
