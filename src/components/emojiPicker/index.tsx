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
		event.stopPropagation();
		if (visible) {
			return setVisible(false);
		}

		return setVisible(true);
	}

	return (
		<div className="relative flex">
			{visible && (
				<div className="absolute bottom-7 z-50 shadow-lg">
					<Picker
						data={data}
						onClickOutside={(e: Event) => {
							handleClickOutside(e);
						}}
					/>
				</div>
			)}
			<Button
				type="button"
				size="icon"
				variant="ghost"
				onClick={(e) => {
					handleClick(e as any);
				}}
			>
				<SmileIcon className="h-5 w-5 text-muted-foreground" />
			</Button>
		</div>
	);
}
