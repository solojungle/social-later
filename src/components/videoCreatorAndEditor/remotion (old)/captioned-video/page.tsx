import { useEditorStore } from "@/stores/editor";
import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";

const getShadowStyle = (shadow: string) => {
  switch (shadow) {
    case "large":
      return "3px 3px 6px rgba(0, 0, 0, 0.5)";
    case "medium":
      return "2px 2px 4px rgba(0, 0, 0, 0.5)";
    case "none":
      return "none";
    case "small":
      return "1px 1px 2px rgba(0, 0, 0, 0.5)";
    default:
      return "none";
  }
};

const container: React.CSSProperties = {
  alignItems: "center",
  bottom: "10%",
  display: "flex",
  height: "auto",
  justifyContent: "center",
  left: 0,
  padding: "20px",
  position: "absolute",
  right: 0,
  top: "auto",
  width: "100%",
};

export const Page: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
}> = ({ enterProgress, page }) => {
  const { globalStyles } = useEditorStore();
  // const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  // const timeInMs = Math.round((frame / fps) * 1000);

  const fittedText = fitText({
    fontFamily: globalStyles.fontFamily,
    text: page.text,
    textTransform: globalStyles.textTransform,
    withinWidth: width * 0.8,
  });

  const fontSize = Math.min(globalStyles.fontSize, fittedText.fontSize);

  const transform = makeTransform([
    scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
    translateY(interpolate(enterProgress, [0, 1], [20, 0])),
  ]);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          color: globalStyles.color,
          fontFamily: globalStyles.fontFamily,
          fontSize,
          textShadow: getShadowStyle(globalStyles.shadow),
          transform,
        }}
      >
        {page.text}
      </div>
    </AbsoluteFill>
  );
};
