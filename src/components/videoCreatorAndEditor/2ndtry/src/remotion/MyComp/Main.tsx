import { fontFamily, loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

import { CompositionProps } from "../../../types/constants";
import { NextLogo } from "./next-logo";
import { Rings } from "./rings";
import { TextFade } from "./text-fade";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});
export const Main = ({ title }: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitionStart = 2 * fps;
  const transitionDuration = 1 * fps;

  const logoOut = spring({
    config: {
      damping: 200,
    },
    delay: transitionStart,
    durationInFrames: transitionDuration,
    fps,
    frame,
  });

  return (
    <AbsoluteFill className="bg-white">
      <Sequence durationInFrames={transitionStart + transitionDuration}>
        <Rings outProgress={logoOut} />
        <AbsoluteFill className="items-center justify-center">
          <NextLogo outProgress={logoOut} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={transitionStart + transitionDuration / 2}>
        <TextFade>
          <h1
            className="text-[70px] font-bold"
            style={{
              fontFamily,
            }}
          >
            {title}
          </h1>
        </TextFade>
      </Sequence>
    </AbsoluteFill>
  );
};
