import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SmileIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";

export function EmojiPicker() {
	const [visible, setVisible] = useState(false);

	function handleClickOutside(event: Event) {
		if (visible) {
			event.stopPropagation();
			setVisible(false);
		}
	}

	function handleClick(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		if (visible) {
			return setVisible(false);
		}

		return setVisible(true);
	}

	return (
		<div className="relative">
			{visible && (
				<div className="absolute z-50 shadow-lg">
					<Picker
						data={data}
						maxFrequentRows={0}
						navPosition="bottom"
						previewPosition="none"
						onClickOutside={(e: Event) => {
							handleClickOutside(e);
						}}
					/>
				</div>
			)}
			<Button
				type="button"
				size="icon"
				asChild
				className="p-2"
				variant="ghost"
				onClick={(e) => {
					handleClick(e as any);
				}}
			>
				<SmileIcon className="text-muted-foreground" />
			</Button>
		</div>
	);
}
