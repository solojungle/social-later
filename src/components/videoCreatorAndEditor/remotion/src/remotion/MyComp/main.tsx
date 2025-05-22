import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import { AbsoluteFill, OffthreadVideo, useVideoConfig } from "remotion";

import { useEditorStore } from "@/stores/editor";

import { CaptionText } from "./caption-text";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const Main: React.FC<{
  src: string;
}> = ({ src }) => {
  const { fps } = useVideoConfig();

  const { captions } = useEditorStore();

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
        {captions.map((page, index) => {
          const nextPage = captions[index + 1] ?? null;
          const subtitleStartFrame = (page.startMs / 1000) * fps;
          const captionEndFrame =
            subtitleStartFrame + (page.durationMs / 1000) * fps;
          const subtitleEndFrame = nextPage
            ? Math.min(captionEndFrame, (nextPage.startMs / 1000) * fps)
            : captionEndFrame;
          const durationInFrames = subtitleEndFrame - subtitleStartFrame;
          if (durationInFrames <= 0) {
            return null;
          }

          return (
            <CaptionText
              key={page.startMs}
              metadata={{
                duration: durationInFrames,
                from: subtitleStartFrame,
              }}
              page={page}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
