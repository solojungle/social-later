import { createTikTokStyleCaptions } from "@remotion/captions";
import { getVideoMetadata } from "@remotion/media-utils";
import { useMemo, useState } from "react";
import {
	AbsoluteFill,
	CalculateMetadataFunction,
	getStaticFiles,
	OffthreadVideo,
	Sequence,
	useVideoConfig,
} from "remotion";
import { z } from "zod";

import { TextCaption, useEditor } from "../../context/editor-context";
import { SubtitlePage } from "./subtitle-page";

export type SubtitleProp = {
	startInSeconds: number;
	text: string;
};

export const captionedVideoSchema = z.object({
	src: z.string(),
});

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
	z.infer<typeof captionedVideoSchema>
> = async ({ props }) => {
	const fps = 30;
	const metadata = await getVideoMetadata(props.src);

	return {
		fps,
		durationInFrames: Math.floor(metadata.durationInSeconds * fps),
	};
};

const getFileExists = (file: string) => {
	const files = getStaticFiles();
	const fileExists = files.find((f) => {
		return f.src === file;
	});
	return Boolean(fileExists);
};

// How many captions should be displayed at a time?
// Try out:
// - 1500 to display a lot of words at a time
// - 200 to only display 1 word at a time
const SWITCH_CAPTIONS_EVERY_MS = 1200;

export const VideoComposition: React.FC<{
	src: string;
}> = ({ src }) => {
	const { captions } = useEditor();
	const [subtitles, setSubtitles] = useState<TextCaption[]>(captions);

	const { fps } = useVideoConfig();

	const { pages } = useMemo(() => {
		return createTikTokStyleCaptions({
			combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
			captions: subtitles ?? [],
		});
	}, [subtitles]);

	return (
		<AbsoluteFill style={{ backgroundColor: "white" }}>
			<AbsoluteFill>
				<OffthreadVideo
					style={{
						objectFit: "cover",
					}}
					src={src}
				/>
			</AbsoluteFill>
			{pages.map((page, index) => {
				const nextPage = pages[index + 1] ?? null;
				const subtitleStartFrame = (page.startMs / 1000) * fps;
				const subtitleEndFrame = Math.min(
					nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
					subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS,
				);
				const durationInFrames = subtitleEndFrame - subtitleStartFrame;
				if (durationInFrames <= 0) {
					return null;
				}

				return (
					<Sequence
						key={index}
						from={subtitleStartFrame}
						durationInFrames={durationInFrames}
					>
						<SubtitlePage key={index} page={page} />
					</Sequence>
				);
			})}
			{/* {getFileExists(subtitlesFile) ? null : <NoCaptionFile />} */}
		</AbsoluteFill>
	);
};
