"use client";

import { useEffect, useRef, useState } from "react";

import { useEditorStore } from "@/stores/editor";

import { RemotionPlayer } from "../2ndtry";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const { captions, setCurrentTime, setPlayerRef } = useEditorStore();
  const [currentCaption, setCurrentCaption] = useState<string>("");

  useEffect(() => {
    setPlayerRef(videoRef.current);
  }, [setPlayerRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTimeMs = video.currentTime * 1000;
      setCurrentTime(currentTimeMs);

      // Find the current caption
      const activeCaption = captions.find(
        (caption) =>
          currentTimeMs >= caption.startMs && currentTimeMs <= caption.endMs,
      );
      setCurrentCaption(activeCaption?.text ?? "");
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [captions, setCurrentTime]);

  if (!width || !height || !fps || !duration || !src) {
    return null;
  }

  return (
    <div className="relative" style={{ height: "100%", width: "100%" }}>
      <RemotionPlayer />
    </div>
    // <div className="relative" style={{ height: "100%", width: "100%" }}>
    //   <video
    //     className="h-full w-full"
    //     controls
    //     ref={videoRef}
    //     src={src}
    //     style={{ objectFit: "contain" }}
    //   >
    //     <track default kind="captions" label="English" src="" srcLang="en" />
    //   </video>
    //   {currentCaption && (
    //     <div
    //       className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-2 text-center text-white"
    //       style={{
    //         maxWidth: "80%",
    //         textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    //       }}
    //     >
    //       {currentCaption}
    //     </div>
    //   )}
    // </div>
  );
}
