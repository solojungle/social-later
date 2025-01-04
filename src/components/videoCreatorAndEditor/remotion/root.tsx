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
			id="CaptionedVideo"
			component={VideoComposition}
			calculateMetadata={calculateCaptionedVideoMetadata}
			schema={captionedVideoSchema}
			defaultProps={{ src: "" }}
		/>
	);
};
