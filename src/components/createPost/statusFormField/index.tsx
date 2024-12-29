import { PaperclipIcon } from "lucide-react";
import { useRef, useState } from "react";

import { EmojiPicker } from "@/components/emojiPicker";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type ToolbarProps = {
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	charCount: number;
	maxCharCount: number;
};

function Toolbar({ textareaRef, charCount, maxCharCount }: ToolbarProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex justify-start">
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Button type="button" size="icon" variant="ghost">
							<PaperclipIcon className="h-5 w-5 text-muted-foreground" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<span>Shorten link</span>
					</TooltipContent>
				</Tooltip>
				<EmojiPicker textareaRef={textareaRef} />
			</div>
			<span
				className={`text-xs ${
					charCount > maxCharCount ? "text-red-600" : "text-muted-foreground"
				}`}
			>
				{charCount}/{maxCharCount}
			</span>
		</div>
	);
}

type StatusFormFieldProps = {
	form: any;
};

export function StatusFormField({ form }: StatusFormFieldProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [charCount, setCharCount] = useState(0);
	const [maxCharCount] = useState(200);

	const handleTextareaChange = () => {
		if (textareaRef.current) {
			setCharCount(textareaRef.current.value.length);
		}
	};

	return (
		<FormField
			control={form.control}
			name="content"
			render={({ field }) => (
				<FormItem>
					<FormLabel className="flex justify-between">
						<span>Post Content</span>
						<button type="button" className="text-xs text-blue-600">
							Add translation
						</button>
					</FormLabel>
					<FormControl>
						<div className="relative shadow-sm">
							<div className="relative rounded-lg border border-border">
								<Textarea
									{...field}
									className="h-48 border-b-[36px] border-transparent pb-0"
									autoFocus
									onInput={(e) => {
										field.onChange(e);
										handleTextareaChange();
									}}
									placeholder="Write something, mention or add emoji..."
									ref={textareaRef}
								/>
								<div className="absolute inset-x-1 bottom-0">
									<Toolbar
										textareaRef={textareaRef}
										charCount={charCount}
										maxCharCount={maxCharCount}
									/>
								</div>
							</div>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
