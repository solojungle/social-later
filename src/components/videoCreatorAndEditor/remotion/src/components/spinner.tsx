import { translatePath } from "@remotion/paths";
import { makeRect } from "@remotion/shapes";
import React, { useMemo } from "react";

const viewBox = 100;
const lines = 12;
const width = viewBox * 0.08;

const { path } = makeRect({
  cornerRadius: width / 2,
  height: viewBox * 0.24,
  width,
});

const translated = translatePath(path, viewBox / 2 - width / 2, viewBox * 0.03);

export const Spinner: React.FC<{
  size: number;
}> = ({ size }) => {
  const style = useMemo(() => {
    return {
      height: size,
      width: size,
    };
  }, [size]);

  return (
    <svg style={style} viewBox={`0 0 ${viewBox} ${viewBox}`}>
      {new Array(lines).fill(true).map((_, index) => {
        return (
          <path
            className="animate-spinner"
            d={translated}
            fill="var(--foreground)"
            key={index}
            style={{
              animationDelay: `${index * 0.1 - lines * 0.1}s`,
              rotate: `${(index * Math.PI * 2) / lines}rad`,
              transformOrigin: "center center",
            }}
          />
        );
      })}
    </svg>
  );
};
