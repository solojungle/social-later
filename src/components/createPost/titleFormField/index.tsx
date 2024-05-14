import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// type ToolbarProps = {
// 	textareaRef: React.RefObject<HTMLTextAreaElement>;
// 	charCount: number;
// 	maxCharCount: number;
// };

// function Toolbar({ textareaRef, charCount, maxCharCount }: ToolbarProps) {
// 	return (
// 		<div className="flex items-center justify-between">
// 			<div className="flex justify-start">
// 				<Tooltip delayDuration={0}>
// 					<TooltipTrigger asChild>
// 						<Button type="button" size="icon" variant="ghost">
// 							<PaperclipIcon className="h-5 w-5 text-muted-foreground" />
// 						</Button>
// 					</TooltipTrigger>
// 					<TooltipContent>
// 						<span>Shorten link</span>
// 					</TooltipContent>
// 				</Tooltip>
// 				<EmojiPicker textareaRef={textareaRef} />
// 			</div>
// 			<span
// 				className={`text-xs ${
// 					charCount > maxCharCount ? "text-red-600" : "text-muted-foreground"
// 				}`}
// 			>
// 				{charCount}/{maxCharCount}
// 			</span>
// 		</div>
// 	);
// }

type StatusFormFieldProps = {
	form: any;
};

export function TitleFormField({ form }: StatusFormFieldProps) {
	// const textareaRef = useRef<HTMLTextAreaElement>(null);
	// const [charCount, setCharCount] = useState(0);
	// const [maxCharCount] = useState(200);

	// const handleTextareaChange = () => {
	// 	if (textareaRef.current) {
	// 		setCharCount(textareaRef.current.value.length);
	// 	}
	// };

	return (
		<FormField
			control={form.control}
			name="title"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Title</FormLabel>
					<FormControl>
						<Input
							{...field}
							placeholder="Add a title that describes your video (type @ to mention a channel)"
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
