import React from "react";
import { AbsoluteFill } from "remotion";

export const NoCaptionFile: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        fontFamily: "sans-serif",
        fontSize: 50,
        height: "auto",
        padding: 30,
        top: undefined,
        width: "100%",
      }}
    >
      No caption file found in the public folder. <br /> Run `node sub.mjs` to
      install Whisper.cpp and create one.
    </AbsoluteFill>
  );
};
