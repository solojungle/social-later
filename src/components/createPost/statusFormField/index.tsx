import { ImageIcon, PaperclipIcon } from "lucide-react";

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

type StatusFormFieldProps = {
	form: any;
};

function Toolbar() {
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
						<span>Link shortener</span>
					</TooltipContent>
				</Tooltip>
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<Button type="button" size="icon" variant="ghost">
							<ImageIcon className="h-5 w-5 text-muted-foreground" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<span>Add media</span>
					</TooltipContent>
				</Tooltip>
				<Tooltip delayDuration={0}>
					<TooltipTrigger>
						<EmojiPicker />
					</TooltipTrigger>
					<TooltipContent>
						<span>Emoji</span>
					</TooltipContent>
				</Tooltip>
			</div>
			<span className="text-xs text-muted-foreground">0/200</span>
		</div>
	);
}

export function StatusFormField({ form }: StatusFormFieldProps) {
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
							<div className="relative">
								<Textarea
									className="h-48"
									autoFocus
									{...field}
									placeholder="Write something, mention or add emoji..."
								/>
								<div className="absolute inset-x-3 bottom-3">
									<Toolbar />
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
