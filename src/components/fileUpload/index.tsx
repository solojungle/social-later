"use client";

import { FileType } from "@prisma/client";
import axios from "axios";

// Determine which type of file it is, image, video, gif
function determineFileType(file: File) {
	if (file.type.includes("video")) {
		return FileType.video;
	}
	if (file.type.includes("gif")) {
		return FileType.gif;
	}
	if (file.type.includes("image")) {
		return FileType.image;
	}

	throw new Error("File type not supported");
}

const calculateChunkSize = (fileSize: number) => {
	const FiveGB = 5 * 2 ** 30;
	const FiveHundredGB = 500 * 2 ** 30;
	const FiveTB = 5 * 2 ** 40;
	if (fileSize <= FiveGB) {
		return 50 * 2 ** 20; // 50MB
	}
	if (fileSize <= FiveHundredGB) {
		return 50 * 2 ** 20; // 50MB
	}
	if (fileSize <= FiveTB) {
		return Math.ceil(FiveTB / 10000); // use the full 10k allowed parts
	}

	return 500 * 2 ** 20; // 500MB
};

const splitFileIntoParts = (file: File) => {
	const chunkSize = calculateChunkSize(file.size);
	const numberOfChunks = Math.ceil(file.size / chunkSize);
	let chunk = 0;
	const fileParts: File[] = [];
	while (chunk < numberOfChunks) {
		const chunkStart = chunk * chunkSize;
		const chunkEnd = Math.min(file.size, chunkStart + chunkSize);
		const filePartBlob = file.slice(chunkStart, chunkEnd);
		const filePartName = `CHUNK${chunk}-${file.name}`;
		const filePart = new File([filePartBlob], filePartName);
		fileParts.push(filePart);
		chunk += 1;
	}
	const partsAsObj: { [partNumber: number]: File } = {};
	for (let i = 1; i <= fileParts.length; i += 1) {
		partsAsObj[i] = fileParts[i - 1] as File;
	}
	return partsAsObj;
};

export type FileUpload = {
	id: string;
	file: File;
	preview: (string | ArrayBuffer)[];
	progress: number;
};

type OnProgressProps = {
	fileId: string;
	partNumber: number;
	progress: number;
	setFileProgress: React.Dispatch<
		React.SetStateAction<{ [key: string]: { [key: number]: number } }>
	>;
};

export const OnProgress = ({
	fileId,
	partNumber,
	progress,
	setFileProgress,
}: OnProgressProps) => {
	setFileProgress((prevProgress) => {
		const prevFileProgress = prevProgress[fileId] || {};
		return {
			...prevProgress,
			[fileId]: {
				...prevFileProgress,
				[partNumber]: progress,
			},
		};
	});
};

interface UploadFileProps {
	uploadedFile: FileUpload;
	fetchMultipartPresignedUrls: any;
	completeMultipartUpload: any;
	setFileProgress: any;
	createFile: any;
	onProgress: ({
		fileId,
		partNumber,
		progress,
		setFileProgress,
	}: OnProgressProps) => void;
}

export async function uploadFile({
	uploadedFile,
	fetchMultipartPresignedUrls,
	completeMultipartUpload,
	setFileProgress,
	createFile,
	onProgress,
}: UploadFileProps) {
	const { file } = uploadedFile;

	const filename = file.name.split(".").shift();
	const extension = file.name.split(".").pop();

	const parts = splitFileIntoParts(file);

	const hashKey = crypto.randomUUID();
	const fileKey = `${hashKey}.${extension}`;

	const { uploadId, urls: signedUrls } = await fetchMultipartPresignedUrls({
		key: fileKey,
		filePartTotal: Object.keys(parts).length,
	});

	const uploadPromises: Promise<{
		PartNumber: number;
		ETag: string;
	}>[] = [];

	for (const { url, partNumber } of signedUrls) {
		const filePart = parts[partNumber] as File;

		uploadPromises.push(
			axios
				.put(url, filePart.slice(), {
					headers: {
						"Content-Type": file.type,
					},
					onUploadProgress: (progressEvent) => {
						const progress = Math.round(
							((progressEvent.loaded || 1) * 100) / (progressEvent.total || 1),
						);
						onProgress({
							fileId: uploadedFile.id,
							partNumber,
							progress,
							setFileProgress,
						});
					},
				})
				.then((response) => {
					return {
						ETag: response.headers.etag as string,
						PartNumber: partNumber,
					};
				}),
		);
	}

	const uploadedParts = await Promise.all(uploadPromises);

	await completeMultipartUpload({
		uploadId,
		key: fileKey,
		parts: uploadedParts,
	});

	const mediaFile = await createFile({
		file: {
			name: filename || "",
			extension: extension || "",
			key: hashKey, // In order to be consistent with the backend, we need to remove the extension
			type: determineFileType(file),
			size: file.size,
			mime: file.type,
		},
	});

	return mediaFile;
}
