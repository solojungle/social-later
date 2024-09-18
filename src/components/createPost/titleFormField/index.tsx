import { useRef, useState } from "react";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ToolbarProps = {
	charCount: number;
	maxCharCount: number;
};

function Toolbar({ charCount, maxCharCount }: ToolbarProps) {
	return (
		<div className="flex items-center justify-end">
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
	maxCharCount?: number;
};

export function TitleFormField({
	form,
	maxCharCount = 100,
}: StatusFormFieldProps) {
	const textareaRef = useRef<HTMLInputElement>(null);
	const [charCount, setCharCount] = useState(0);

	const handleTextChange = () => {
		if (textareaRef.current) {
			setCharCount(textareaRef.current.value.length);
		}
	};

	return (
		<FormField
			control={form.control}
			name="title"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Title</FormLabel>
					<FormControl>
						<div className="relative shadow-sm">
							<div className="relative rounded-lg border border-border">
								<Input
									{...field}
									className="h-16 border-b-[18px] border-transparent pb-0"
									onInput={(e) => {
										field.onChange(e);
										handleTextChange();
									}}
									placeholder="Add a title that describes your video (type @ to mention a channel)"
									ref={textareaRef}
								/>
								<div className="absolute inset-x-1 bottom-0 ">
									<Toolbar charCount={charCount} maxCharCount={maxCharCount} />
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
