/* eslint-disable react/no-array-index-key */
import { useEditorStore } from "@/stores/editor";
import { createTikTokStyleCaptions } from "@remotion/captions";
import { getVideoMetadata } from "@remotion/media-utils";
import { useMemo } from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  OffthreadVideo,
  Sequence,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

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
    durationInFrames: Math.floor(metadata.durationInSeconds * fps),
    fps,
  };
};

// How many captions should be displayed at a time?
// Try out:
// - 1500 to display a lot of words at a time
// - 200 to only display 1 word at a time
const SWITCH_CAPTIONS_EVERY_MS = 1200;

export const VideoComposition: React.FC<{
  src: string;
}> = ({ src }) => {
  const { captions } = useEditorStore();
  const { fps } = useVideoConfig();

  const { pages } = useMemo(() => {
    if (!captions) {
      return { pages: [] };
    }

    return createTikTokStyleCaptions({
      captions: captions.map((caption) => ({
        ...caption,
        endMs: Math.round(caption.endMs ?? 0),
        startMs: Math.round(caption.startMs ?? 0),
        timestampMs: Math.round(caption.timestampMs ?? 0),
      })),
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [captions]);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ zIndex: 1 }}>
        <OffthreadVideo
          src={src}
          style={{
            height: "100%",
            objectFit: "contain",
            width: "100%",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 2 }}>
        {pages.map((page) => (
          <Sequence
            durationInFrames={Math.ceil(
              SWITCH_CAPTIONS_EVERY_MS / (1000 / fps),
            )}
            from={Math.floor(page.startMs / (1000 / fps))}
            key={page.startMs}
          >
            <SubtitlePage page={page} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
