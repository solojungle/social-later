"use client";

import { FileType } from "@prisma/client";
import axios from "axios";

import { api } from "@/trpc/react";

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

export async function uploadFile(
	file: File,
	onProgress: (progress: number) => void = () => {},
) {
	const { mutateAsync: createFile } = api.file.create.useMutation();
	const { mutateAsync: fetchPresignedUrls } =
		api.aws.getStandardUploadPresignedUrl.useMutation();
	const { mutateAsync: fetchMultipartPresignedUrls } =
		api.aws.getMultipartUploadPresignedUrl.useMutation();
	const { mutateAsync: completeMultipartUpload } =
		api.aws.completeMultipartUpload.useMutation();

	const filename = file.name.split(".").shift();
	const extension = file.name.split(".").pop();

	// Get the size of the file
	// If the file is bigger than 5MB we should getMultipartUploadPresignedUrl (fetchMultipartPresignedUrls)
	// and upload the file in parts
	if (file.size > 8 * 1024 * 1024) {
		const parts = splitFileIntoParts(file);

		const { uploadId, signedUrls } = await fetchMultipartPresignedUrls({
			key: file.name,
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
							"Content-Type": filePart.type,
						},
						onUploadProgress: (progressEvent) => {
							const progress = (partNumber / Object.keys(parts).length) * 100;
							onProgress(progress);
						},
					})
					.then((response) => ({
						ETag: response.headers.etag as string,
						PartNumber: partNumber,
					})),
			);
		}

		const uploadedParts = await Promise.all(uploadPromises);

		await completeMultipartUpload({
			uploadId,
			key: file.name,
			parts: uploadedParts,
		});

		const mediaFile = await createFile({
			file: {
				name: filename || "",
				extension: extension || "",
				key: file.name,
				type: determineFileType(file),
				size: file.size,
				mime: file.type,
			},
		});

		return mediaFile;
	}

	const presignedObject = await fetchPresignedUrls({
		fileExtension: extension || "",
	});

	await axios.put(presignedObject.signedUrl, file, {
		headers: {
			"Content-Type": file.type,
		},
	});

	// Determine which type of file it is, image, video, gif
	const mediaFileType = determineFileType(file);

	const mediaFile = await createFile({
		file: {
			name: filename || "",
			extension: extension || "",
			key: presignedObject.key,
			type: mediaFileType,
			size: file.size,
			mime: file.type,
		},
	});

	return mediaFile;
}
