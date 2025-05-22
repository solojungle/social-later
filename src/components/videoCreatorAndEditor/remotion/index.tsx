/* eslint-disable tailwindcss/no-custom-classname */

"use client";

import { parseMedia } from "@remotion/media-parser";
import { Player } from "@remotion/player";
import React, { useEffect, useMemo, useState } from "react";

import { RenderControls } from "./src/components/render-controls";
import { Main } from "./src/remotion/MyComp/main";

export function RemotionPlayer({ src }: { src: string }) {
  const [text, setText] = useState<string>("");
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    const loadMetadata = async () => {
      if (!src) return;
      try {
        const result = await parseMedia({
          fields: {
            dimensions: true,
            fps: true,
            slowDurationInSeconds: true,
          },
          src,
        });
        setMetadata(result);
      } catch (error) {
        console.error("Error loading video metadata:", error);
      }
    };
    loadMetadata().catch(console.error);
  }, [src]);

  const inputProps = useMemo(() => {
    return {
      src,
      title: text,
    };
  }, [text, src]);

  if (!metadata) {
    return null;
  }

  return (
    <>
      <RenderControls inputProps={inputProps} setText={setText} text={text} />
      <Player
        autoPlay
        component={Main}
        compositionHeight={metadata.dimensions.height}
        compositionWidth={metadata.dimensions.width}
        controls
        durationInFrames={Math.round(
          metadata.slowDurationInSeconds * metadata.fps,
        )}
        fps={metadata.fps}
        inputProps={inputProps}
        loop
        style={{
          // Can't use tailwind class for width since player's default styles take presedence over tailwind's,
          // but not over inline styles
          width: "100%",
        }}
      />
    </>
  );
}
