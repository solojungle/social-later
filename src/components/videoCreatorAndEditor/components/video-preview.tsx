"use client";

import { Player, PlayerRef } from "@remotion/player";
import { useEffect, useRef } from "react";

import { useEditor } from "../context/editor-context";
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
  const playerRef = useRef<PlayerRef>(null);
  const { setCurrentTime, setPlayerRef } = useEditor();

  useEffect(() => {
    setPlayerRef(playerRef.current);
  }, [setPlayerRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentFrame = playerRef.current.getCurrentFrame();
        const currentTimeMs = (currentFrame / fps) * 1000;
        setCurrentTime(currentTimeMs);
      }
    }, 100); // Update every 100ms for smooth tracking

    return () => clearInterval(interval);
  }, [fps, setCurrentTime]);

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
      ref={playerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
}
