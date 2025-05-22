/* eslint-disable tailwindcss/no-custom-classname */

"use client";

import { parseMedia } from "@remotion/media-parser";
import { Player } from "@remotion/player";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useEditorStore } from "@/stores/editor";

import { Main } from "./src/remotion/MyComp/main";

export function RemotionPlayer({ src }: { src: string }) {
  const [metadata, setMetadata] = useState<any>(null);
  const playerRef = useRef<any>(null);
  const { captions, selectedCaptionId, setPlayerRef } = useEditorStore();

  useEffect(() => {
    if (playerRef.current) {
      setPlayerRef(playerRef.current);
    }
  }, [setPlayerRef]);

  // Handle seeking when a caption is selected
  useEffect(() => {
    if (playerRef.current && selectedCaptionId && metadata?.fps) {
      const selectedCaption = captions.find((c) => c.id === selectedCaptionId);
      if (selectedCaption) {
        // Convert milliseconds to seconds and then to frames
        const seconds = selectedCaption.startMs / 1000;
        const frame = Math.floor(seconds * metadata.fps) + 1;

        // Seek to the frame and pause
        playerRef.current.seekTo(frame);
        playerRef.current.pause();
      }
    }
  }, [selectedCaptionId, captions, metadata?.fps]);

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
    };
  }, [src]);

  if (!metadata) {
    return null;
  }

  return (
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
      ref={playerRef}
      style={{
        // Can't use tailwind class for width since player's default styles take presedence over tailwind's,
        // but not over inline styles
        width: "100%",
      }}
    />
  );
}
