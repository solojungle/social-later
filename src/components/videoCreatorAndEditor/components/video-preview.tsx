"use client";

import { Player } from "@remotion/player";

import { VideoComposition } from "../remotion/captioned-video";

interface VideoPreviewProps {
  duration: number;
  fps: number;
  height: number;
  src: string;
  width: number;
}

export function VideoPreview({
  duration,
  fps,
  height,
  src,
  width,
}: VideoPreviewProps) {
  if (!width || !height || !fps || !duration || !src) {
    return null;
  }

  return (
    <Player
      component={VideoComposition}
      compositionHeight={height}
      compositionWidth={width}
      controls
      durationInFrames={duration}
      fps={fps}
      inputProps={{
        src,
      }}
      style={{ height: "100%", width: "100%" }}
    />
  );
}
