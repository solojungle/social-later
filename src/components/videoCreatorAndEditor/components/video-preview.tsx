"use client";

import { Player } from "@remotion/player";

import { VideoComposition } from "../remotion/captioned-video";

interface VideoPreviewProps {
	src: string | null;
	width?: number;
	height?: number;
}

export function VideoPreview({
	src,
	width = 1080,
	height = 720,
}: VideoPreviewProps) {
	if (!src) {
		return null;
	}

	return (
		<div>
			<Player
				component={VideoComposition}
				durationInFrames={120}
				compositionWidth={width}
				compositionHeight={height}
				controls
				fps={30}
				style={{ width: "100%" }}
				inputProps={{
					src,
				}}
			/>
		</div>
	);
}
