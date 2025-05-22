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

export const CaptionText: React.FC<{
  readonly metadata: any;
  readonly page: TikTokPage;
}> = ({ metadata, page }) => {
  const { globalStyles } = useEditorStore();
  const { width } = useVideoConfig();

  const fittedText = fitText({
    fontFamily: globalStyles.fontFamily,
    text: page.text,
    textTransform: globalStyles.textTransform as TextTransform,
    withinWidth: width * 0.8,
  });

  const fontSize = Math.min(globalStyles.fontSize, fittedText.fontSize);

  return (
    <AbsoluteFill style={container}>
      <Sequence durationInFrames={metadata.duration} from={metadata.from}>
        <div
          style={{
            color: globalStyles.color,
            fontFamily: globalStyles.fontFamily,
            fontSize,
            margin: "0 auto",
            maxWidth: width * 0.8,
            textAlign: "center",
            textShadow: getShadowStyle(globalStyles.shadow),
            width: "100%",
          }}
        >
          {page.text}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
