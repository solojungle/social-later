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
  bottom: 100,
  height: "auto",
  justifyContent: "center",
  padding: "20px",
  top: undefined,
};

export const Page: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
}> = ({ enterProgress, page }) => {
  const { globalStyles } = useEditor();
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const fittedText = fitText({
    fontFamily: globalStyles.fontFamily,
    text: page.text,
    textTransform: globalStyles.textTransform,
    withinWidth: width * 0.7,
  });

  const fontSize = Math.min(globalStyles.fontSize, fittedText.fontSize);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          color: globalStyles.color,
          fontFamily: globalStyles.fontFamily,
          fontSize,
          paintOrder: "stroke",
          textTransform: globalStyles.textTransform,
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            translateY(interpolate(enterProgress, [0, 1], [50, 0])),
          ]),
          WebkitTextStroke: "3px black",
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
            const startRelativeToSequence = t.fromMs - page.startMs;
            const endRelativeToSequence = t.toMs - page.startMs;

            const active =
              startRelativeToSequence <= timeInMs &&
              endRelativeToSequence > timeInMs;

            return (
              <span
                key={t.fromMs}
                style={{
                  color: active
                    ? globalStyles.highlightColor
                    : globalStyles.color,
                  display: "inline",
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
