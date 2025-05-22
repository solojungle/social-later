import React from "react";
import { AbsoluteFill, interpolateColors, useVideoConfig } from "remotion";

const RadialGradient: React.FC<{
  color: string;
  radius: number;
}> = ({ color, radius }) => {
  const height = radius * 2;
  const width = radius * 2;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="absolute rounded-[50%] shadow-[0px_0px_100px_rgba(0,0,0,0.05)]"
        style={{
          backgroundColor: color,
          height,
          width,
        }}
      />
    </AbsoluteFill>
  );
};

export const Rings: React.FC<{
  outProgress: number;
}> = ({ outProgress }) => {
  const scale = 1 / (1 - outProgress);
  const { height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
      }}
    >
      {new Array(5)
        .fill(true)
        .map((_, i) => {
          return (
            <RadialGradient
              color={interpolateColors(i, [0, 4], ["#fff", "#fff"])}
              key={i}
              radius={height * 0.3 * i}
            />
          );
        })
        .reverse()}
    </AbsoluteFill>
  );
};
