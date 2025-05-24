"use client";

import { FileType } from "@prisma/client";
import axios from "axios";

import { env } from "@/env.mjs";

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
  file: File;
  id: string;
  preview: (ArrayBuffer | string)[];
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

async function getFileDimensions(
  file: File,
): Promise<{ height?: number; width?: number }> {
  // For images
  if (file.type.startsWith("image/")) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          height: img.naturalHeight,
          width: img.naturalWidth,
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  // For videos
  if (file.type.startsWith("video/")) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        resolve({
          height: video.videoHeight,
          width: video.videoWidth,
        });
      };
      video.src = URL.createObjectURL(file);
    });
  }

  return {};
}

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
  completeMultipartUpload: any;
  createFile: any;
  fetchMultipartPresignedUrls: any;
  onProgress: ({
    fileId,
    partNumber,
    progress,
    setFileProgress,
  }: OnProgressProps) => void;
  setFileProgress: any;
  uploadedFile: FileUpload;
}

export async function uploadFile({
  completeMultipartUpload,
  createFile,
  fetchMultipartPresignedUrls,
  onProgress,
  setFileProgress,
  uploadedFile,
}: UploadFileProps) {
  const { file } = uploadedFile;

  // Get dimensions if possible
  const fileDimensions = await getFileDimensions(file);

  const filename = file.name.split(".").shift();
  const extension = file.name.split(".").pop();

  const parts = splitFileIntoParts(file);

  const hashKey = crypto.randomUUID();
  const fileKey = `${hashKey}.${extension}`;

  const { uploadId, urls: signedUrls } = await fetchMultipartPresignedUrls({
    filePartTotal: Object.keys(parts).length,
    key: fileKey,
  });

  const uploadPromises: Promise<{
    ETag: string;
    PartNumber: number;
  }>[] = [];

  for (const { partNumber, url } of signedUrls) {
    const filePart = parts[partNumber] as File;

    // If we are in development (w/ localstack), we need to replace the host.docker.internal with the local address
    let presignedUrl = url;
    if (env.NODE_ENV === "development") {
      presignedUrl = url.replace("host.docker.internal", "localhost");
    }

    uploadPromises.push(
      axios
        .put(presignedUrl, filePart.slice(), {
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
    key: fileKey,
    parts: uploadedParts,
    uploadId,
  });

  const mediaFile = await createFile({
    file: {
      extension: extension || "",
      height: fileDimensions.height,
      key: hashKey, // In order to be consistent with the backend, we need to remove the extension
      mime: file.type,
      name: filename || "",
      size: file.size,
      type: determineFileType(file),
      width: fileDimensions.width,
    },
  });

  return mediaFile;
}
