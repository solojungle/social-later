"use client";

import { FileType } from "@prisma/client";

// Determine which type of file it is, image, video, gif
export function determineFileType(file: File) {
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

export const splitFileIntoParts = (file: File) => {
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
