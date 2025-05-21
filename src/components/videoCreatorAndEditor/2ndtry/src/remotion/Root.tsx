import { Composition } from "remotion";

import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { Main } from "./MyComp/main";
import { NextLogo } from "./MyComp/next-logo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        component={Main}
        defaultProps={defaultMyCompProps}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        height={VIDEO_HEIGHT}
        id={COMP_NAME}
        width={VIDEO_WIDTH}
      />
      <Composition
        component={NextLogo}
        defaultProps={{
          outProgress: 0,
        }}
        durationInFrames={300}
        fps={30}
        height={140}
        id="NextLogo"
        width={140}
      />
    </>
  );
};
