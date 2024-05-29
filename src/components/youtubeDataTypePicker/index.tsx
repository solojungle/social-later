import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type ReportRangePickerProps = {
	type: "subscribers" | "views";
	onChange: (type: "subscribers" | "views") => void;
};

export function DataTypePicker({ type, onChange }: ReportRangePickerProps) {
	return (
		<Select defaultValue={type} onValueChange={onChange}>
			<SelectTrigger className="w-32">
				<SelectValue placeholder="Select data type" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="subscribers">Subscribers</SelectItem>
					<SelectItem value="views">Views</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
