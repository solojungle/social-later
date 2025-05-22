import { TikTokPage } from "@remotion/captions";
import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { Page } from "./page";

export const SubtitlePage: React.FC<{ readonly page: TikTokPage }> = ({
  page,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    config: {
      damping: 200,
    },
    durationInFrames: 5,
    fps,
    frame,
  });

  return (
    <AbsoluteFill>
      <Page enterProgress={enter} page={page} />
    </AbsoluteFill>
  );
};
