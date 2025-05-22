import { parseMedia } from "@remotion/media-parser";
import { CalculateMetadataFunction, Composition } from "remotion";

import { Main } from "./MyComp/main";

export const calculateMetadataFn: CalculateMetadataFunction<
  Record<string, unknown>
> = async ({ props }) => {
  if (!props.src) {
    throw new Error("Src is null");
  }

  const metadata = await parseMedia({
    acknowledgeRemotionLicense: true,
    fields: {
      dimensions: true,
      fps: true,
      slowDurationInSeconds: true,
    },
    src: props.src as string,
  });

  if (metadata.dimensions === null) {
    throw new Error("Dimensions are null");
  }

  return {
    durationInFrames: Math.round(
      metadata.slowDurationInSeconds * (metadata.fps ?? 30),
    ),
    fps: metadata.fps ?? 30,
    height: Math.floor(metadata.dimensions.height / 2) * 2,
    width: Math.floor(metadata.dimensions.width / 2) * 2,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      calculateMetadata={calculateMetadataFn}
      component={Main}
      defaultProps={{ src: "" }}
      id="CaptionedVideo"
    />
  );
};
