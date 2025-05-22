import React from "react";
import { Composition } from "remotion";

import {
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
  VideoComposition,
} from "./captioned-video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      calculateMetadata={calculateCaptionedVideoMetadata}
      component={VideoComposition}
      defaultProps={{ src: "" }}
      id="CaptionedVideo"
      schema={captionedVideoSchema}
    />
  );
};
