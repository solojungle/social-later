import { TikTokPage } from "@remotion/captions";
import { fitText, TextTransform } from "@remotion/layout-utils";
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";

import { useEditorStore } from "@/stores/editor";

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
  alignItems: "flex-start",
  display: "flex",
  height: "auto",
  justifyContent: "center",
  left: 0,
  padding: "20px",
  position: "absolute",
  right: 0,
  top: "5%",
  width: "100%",
};

export const CaptionText: React.FC<{
  readonly alignment?: "center" | "left";
  readonly metadata: any;
  readonly page: TikTokPage;
}> = ({ alignment = "center", metadata, page }) => {
  const { globalStyles } = useEditorStore();
  const { width } = useVideoConfig();

  const fittedText = fitText({
    fontFamily: globalStyles.fontFamily,
    text: page.text,
    textTransform: globalStyles.textTransform as TextTransform,
    withinWidth: width * 0.7,
  });

  const fontSize = Math.min(globalStyles.fontSize, fittedText.fontSize);

  const containerStyle: React.CSSProperties = {
    ...container,
    justifyContent: alignment === "center" ? "center" : "flex-start",
    paddingLeft: alignment === "left" ? "10%" : "20px",
  };

  return (
    <AbsoluteFill style={containerStyle}>
      <Sequence durationInFrames={metadata.duration} from={metadata.from}>
        <div
          style={{
            color: globalStyles.color,
            fontFamily: globalStyles.fontFamily,
            fontSize,
            margin: "0 auto",
            maxWidth: width * 0.7,
            textAlign: alignment,
            textShadow: getShadowStyle(globalStyles.shadow),
            textTransform: globalStyles.textTransform as TextTransform,
            width: "100%",
          }}
        >
          {page.text}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
