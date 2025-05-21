/* eslint-disable react/no-array-index-key */
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

import { useEditor } from "../../context/editor-context";
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
  const { captions } = useEditor();
  const { fps } = useVideoConfig();

  const { pages } = useMemo(() => {
    if (!captions) {
      return { pages: [] };
    }

    return createTikTokStyleCaptions({
      captions: captions.map((caption) => ({
        ...caption,
        endMs: Math.round(caption.endMs),
        startMs: Math.round(caption.startMs),
        timestampMs: Math.round(caption.timestampMs),
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
        {pages.map((page, index) => {
          const nextPage = pages[index + 1] ?? null;
          const subtitleStartFrame = Math.floor(
            (Math.round(page.startMs) / 1000) * fps,
          );
          const subtitleEndFrame = Math.floor(
            nextPage
              ? (Math.round(nextPage.startMs) / 1000) * fps
              : (Math.round(page.startMs) / 1000) * fps +
                  (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps,
          );
          const durationInFrames = subtitleEndFrame - subtitleStartFrame;

          if (durationInFrames <= 0) {
            return null;
          }

          return (
            <Sequence
              durationInFrames={durationInFrames}
              from={subtitleStartFrame}
              key={index}
            >
              <SubtitlePage key={index} page={page} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
