"use client";

import { Player } from "@remotion/player";

import { VideoComposition } from "../remotion/captioned-video";

interface VideoPreviewProps {
	src: string;
	width: number;
	height: number;
	fps: number;
	duration: number;
}

export function VideoPreview({
	src,
	width,
	height,
	fps,
	duration,
}: VideoPreviewProps) {
	if (!width || !height || !fps || !duration || !src) {
		return null;
	}

	return (
		<Player
			component={VideoComposition}
			durationInFrames={duration}
			compositionWidth={width}
			compositionHeight={height}
			fps={fps}
			controls
			style={{ height: "100%", width: "100%" }}
			inputProps={{
				src,
			}}
		/>
	);
}
