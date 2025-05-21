import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { useEditor } from "../../context/editor-context";

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
  const { globalStyles } = useEditor();
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const timeInMs = Math.round((frame / fps) * 1000);

  const fittedText = fitText({
    fontFamily: globalStyles.fontFamily,
    text: page.text,
    textTransform: globalStyles.textTransform,
    withinWidth: width * 0.8,
  });

  const fontSize = Math.min(globalStyles.fontSize, fittedText.fontSize);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "8px",
          color: globalStyles.color,
          fontFamily: globalStyles.fontFamily,
          fontSize,
          padding: "12px 24px",
          paintOrder: "stroke",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          textTransform: globalStyles.textTransform,
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            translateY(interpolate(enterProgress, [0, 1], [50, 0])),
          ]),
          WebkitTextStroke: "1px black",
        }}
      >
        <span
          style={{
            transform: makeTransform([
              scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
              translateY(interpolate(enterProgress, [0, 1], [50, 0])),
            ]),
          }}
        >
          {page.tokens.map((t) => {
            const startRelativeToSequence = Math.round(t.fromMs - page.startMs);
            const endRelativeToSequence = Math.round(t.toMs - page.startMs);
            const isActive =
              timeInMs >= startRelativeToSequence &&
              timeInMs < endRelativeToSequence;

            return (
              <span
                key={t.fromMs}
                style={{
                  color: isActive
                    ? globalStyles.highlightColor
                    : globalStyles.color,
                  display: "inline",
                  opacity: timeInMs >= startRelativeToSequence ? 1 : 0,
                  transition:
                    "color 0.1s ease-in-out, opacity 0.1s ease-in-out",
                  whiteSpace: "pre",
                }}
              >
                {t.text}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
