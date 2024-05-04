import { CalendarIcon } from "lucide-react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function ReportRangePicker() {
	const defaultValue = "daily";

	return (
		<Select defaultValue={defaultValue}>
			<SelectTrigger className="w-32">
				<CalendarIcon className="h-4 w-4" />
				<SelectValue placeholder="Select report range" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="daily">Daily</SelectItem>
					<SelectItem value="weekly">Weekly</SelectItem>
					<SelectItem value="monthly">Monthly</SelectItem>
					<SelectItem value="annually">Annually</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
