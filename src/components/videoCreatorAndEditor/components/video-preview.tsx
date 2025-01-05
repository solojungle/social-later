"use client";

import { Player } from "@remotion/player";

import { Asset } from "@/schemas/file-schema";

import { VideoComposition } from "../remotion/captioned-video";

interface VideoPreviewProps {
	file: Asset;
	width?: number;
	height?: number;
}

export function VideoPreview({ file }: VideoPreviewProps) {
	if (!file?.width || !file?.height) {
		return null;
	}

	const { width, height } = file;

	return (
		<Player
			component={VideoComposition}
			durationInFrames={120}
			compositionWidth={width}
			compositionHeight={height}
			controls
			fps={30}
			style={{ width: "100%" }}
			inputProps={{
				src: file.url,
			}}
		/>
	);
}
