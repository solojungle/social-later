import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SmileIcon } from "lucide-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type EmojiPickerProps = {
	textareaRef: React.RefObject<HTMLTextAreaElement>;
};

export function EmojiPicker({ textareaRef }: EmojiPickerProps) {
	const [visible, setVisible] = useState(false);

	function handleClickOutside(event: Event) {
		if (visible) {
			event.stopPropagation();
			setVisible(false);
		}
	}

	function handleEmojiSelect(emoji: { native: string }) {
		if (textareaRef.current) {
			const { current } = textareaRef;
			const textareaValue = current.value;
			current.value = textareaValue + emoji.native;

			// Change event is not triggered when changing the value programmatically
			const event = new Event("input", { bubbles: true });
			current.dispatchEvent(event);
		}
	}

	return (
		<Tooltip delayDuration={0}>
			<Popover>
				<TooltipTrigger asChild>
					<PopoverTrigger className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
						<SmileIcon className="h-5 w-5 text-muted-foreground" />
					</PopoverTrigger>
				</TooltipTrigger>
				<TooltipContent>
					<span>Emoji</span>
				</TooltipContent>
				<PopoverContent
					className="w-fit p-0"
					collisionPadding={{ top: 5, right: 5, bottom: 5, left: 5 }}
					side="right"
					align="start"
				>
					<Picker
						data={data}
						maxFrequentRows={0}
						navPosition="bottom"
						previewPosition="none"
						onClickOutside={(e: Event) => {
							handleClickOutside(e);
						}}
						onEmojiSelect={(emoji: any) => handleEmojiSelect(emoji)}
					/>
				</PopoverContent>
			</Popover>
		</Tooltip>
	);
}
