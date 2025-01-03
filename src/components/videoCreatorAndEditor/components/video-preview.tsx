"use client";

import { Player } from "@remotion/player";

import { VideoComposition } from "../remotion/composition";

export function VideoPreview() {
	return (
		<div>
			<Player
				component={VideoComposition}
				durationInFrames={120}
				compositionWidth={1080}
				compositionHeight={720}
				style={{ width: "100%" }}
				fps={30}
				inputProps={{
					videoURL:
						"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
				}}
			/>
		</div>
	);
}
