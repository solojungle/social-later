import { api } from "@/trpc/react";

export interface FileProgress {
	[key: string]: { [key: number]: number };
}

export const useFileUpload = () => {
	const { mutateAsync: createFile } = api.file.create.useMutation();
	const { mutateAsync: fetchMultipartPresignedUrls } =
		api.aws.getMultipartUploadPresignedUrl.useMutation();
	const { mutateAsync: completeMultipartUpload } =
		api.aws.completeMultipartUpload.useMutation();

	return {
		createFile,
		fetchMultipartPresignedUrls,
		completeMultipartUpload,
	};
};
