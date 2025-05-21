"use client";

import { Player } from "@remotion/player";
import React, { useMemo, useState } from "react";
import { z } from "zod";

import { RenderControls } from "./src/components/render-controls";
import { Spacing } from "./src/components/spacing";
import { Tips } from "./src/components/tips";
import { Main } from "./src/remotion/MyComp/main";
import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./types/constants";

export function RemotionPlayer() {
  const [text, setText] = useState<string>(defaultMyCompProps.title);

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
    };
  }, [text]);

  return (
    <div>
      <div className="m-auto mb-5 max-w-screen-md">
        <div className="rounded-geist mb-10 mt-16 overflow-hidden shadow-[0_0_200px_rgba(0,0,0,0.15)]">
          <Player
            autoPlay
            component={Main}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            controls
            durationInFrames={DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            inputProps={inputProps}
            loop
            style={{
              // Can't use tailwind class for width since player's default styles take presedence over tailwind's,
              // but not over inline styles
              width: "100%",
            }}
          />
        </div>
        <RenderControls inputProps={inputProps} setText={setText} text={text} />
        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
        <Tips />
      </div>
    </div>
  );
}
