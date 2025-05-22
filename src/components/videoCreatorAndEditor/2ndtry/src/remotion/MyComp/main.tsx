import { TikTokPage } from "@remotion/captions";
import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import { AbsoluteFill, OffthreadVideo, useVideoConfig } from "remotion";

import { CaptionText } from "./caption-text";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const pages: TikTokPage[] = [
  {
    durationMs: 1000,
    startMs: 0,
    text: "Hello",
    tokens: [],
  },
  {
    durationMs: 1000,
    startMs: 1000,
    text: "World",
    tokens: [],
  },
];

export const Main: React.FC<{
  src: string;
}> = ({ src }) => {
  const { fps } = useVideoConfig();

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
          const subtitleStartFrame = (page.startMs / 1000) * fps;
          const subtitleEndFrame = nextPage
            ? (nextPage.startMs / 1000) * fps
            : subtitleStartFrame + (page.durationMs / 1000) * fps;
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
