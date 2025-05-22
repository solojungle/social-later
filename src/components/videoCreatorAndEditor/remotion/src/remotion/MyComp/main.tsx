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
    durationMs: 500,
    startMs: 0,
    text: "Hey!",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 500,
    text: "Watch this",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 1000,
    text: "Quick tip",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 1500,
    text: "You won't believe",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 2000,
    text: "What happens next",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 2500,
    text: "Mind blown",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 3000,
    text: "No way!",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 3500,
    text: "Check this out",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 4000,
    text: "Crazy right?",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 4500,
    text: "Wait for it",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 5000,
    text: "Almost there",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 5500,
    text: "Here it comes",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 6000,
    text: "Boom!",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 6500,
    text: "Did you see that?",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 7000,
    text: "So cool",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 7500,
    text: "Want more?",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 8000,
    text: "Follow for more",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 8500,
    text: "Like & share",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 9000,
    text: "Thanks!",
    tokens: [],
  },
  {
    durationMs: 500,
    startMs: 9500,
    text: "Bye! 👋",
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
