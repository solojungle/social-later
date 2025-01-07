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
	justifyContent: "center",
	alignItems: "center",
	top: undefined,
	bottom: 100,
	height: "auto",
	padding: "20px",
};

const HIGHLIGHT_COLOR = "#39E508";

export const Page: React.FC<{
	readonly enterProgress: number;
	readonly page: TikTokPage;
}> = ({ enterProgress, page }) => {
	const { globalStyles } = useEditor();
	const frame = useCurrentFrame();
	const { width, fps } = useVideoConfig();
	const timeInMs = (frame / fps) * 1000;

	const fittedText = fitText({
		fontFamily: globalStyles.fontFamily,
		text: page.text,
		withinWidth: width * 0.7,
		textTransform: globalStyles.textTransform,
	});

	const fontSize = Math.min(globalStyles.fontSize, fittedText.fontSize);

	return (
		<AbsoluteFill style={container}>
			<div
				style={{
					fontSize,
					color: globalStyles.color,
					WebkitTextStroke: "3px black",
					paintOrder: "stroke",
					transform: makeTransform([
						scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
						translateY(interpolate(enterProgress, [0, 1], [50, 0])),
					]),
					fontFamily: globalStyles.fontFamily,
					textTransform: globalStyles.textTransform,
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
									display: "inline",
									whiteSpace: "pre",
									color: active ? HIGHLIGHT_COLOR : globalStyles.color,
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
