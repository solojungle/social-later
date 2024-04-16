import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function TimePickerContent() {
	const [hours, setHours] = useState("12");
	const [minutes, setMinutes] = useState("00");
	const [ampm, setAmpm] = useState("AM");

	const handleHourChange = (e, action) => {
		let value = hours;
		if (action === "increment") {
			value =
				parseInt(value, 10) + 1 <= 12
					? (parseInt(value, 10) + 1).toString().padStart(2, "0")
					: "01";
		} else if (action === "decrement") {
			value =
				parseInt(value, 10) - 1 >= 1
					? (parseInt(value, 10) - 1).toString().padStart(2, "0")
					: "12";
		}
		setHours(value);
	};

	const handleMinuteChange = (e, action) => {
		let value = minutes;
		if (action === "increment") {
			value =
				parseInt(value, 10) + 1 <= 59
					? (parseInt(value, 10) + 1).toString().padStart(2, "0")
					: "00";
		} else if (action === "decrement") {
			value =
				parseInt(value, 10) - 1 >= 0
					? (parseInt(value, 10) - 1).toString().padStart(2, "0")
					: "59";
		}
		setMinutes(value);
	};

	const handleHourKeyDown = (e) => {
		if (e.key === "ArrowUp") {
			handleHourChange(e, "increment");
		} else if (e.key === "ArrowDown") {
			handleHourChange(e, "decrement");
		}
	};

	const handleMinuteKeyDown = (e) => {
		if (e.key === "ArrowUp") {
			handleMinuteChange(e, "increment");
		} else if (e.key === "ArrowDown") {
			handleMinuteChange(e, "decrement");
		}
	};

	return (
		<div className="flex items-center justify-center space-x-2 rounded-lg bg-card p-4">
			<div className="relative flex flex-col items-center space-y-1">
				<Button
					variant="ghost"
					size="icon"
					className="!w-full"
					onClick={(e) => handleHourChange(e, "increment")}
				>
					<ChevronUpIcon className="h-5 w-5" />
				</Button>
				<input
					className="h-16 w-16 appearance-none rounded-lg border border-border bg-transparent text-center font-mono text-3xl tabular-nums caret-transparent outline-none"
					type="text"
					value={hours}
					onChange={(e) => handleHourChange(e, "")}
					onKeyDown={handleHourKeyDown}
					maxLength={2}
				/>
				<Button
					variant="ghost"
					size="icon"
					className="!w-full"
					onClick={(e) => handleHourChange(e, "decrement")}
				>
					<ChevronDownIcon className="h-5 w-5" />
				</Button>
			</div>
			<div className="flex flex-col items-center justify-center px-2">
				<span className="text-2xl text-muted-foreground">:</span>
			</div>
			<div className="relative flex flex-col items-center space-y-1">
				<Button
					variant="ghost"
					size="icon"
					className="!w-full"
					onClick={(e) => handleMinuteChange(e, "increment")}
				>
					<ChevronUpIcon className="h-5 w-5" />
				</Button>
				<input
					className="h-16 w-16 appearance-none rounded-lg border border-border bg-transparent text-center font-mono text-3xl tabular-nums caret-transparent outline-none"
					type="text"
					value={minutes}
					onChange={(e) => handleMinuteChange(e, "")}
					onKeyDown={handleMinuteKeyDown}
					maxLength={2}
				/>
				<Button
					variant="ghost"
					size="icon"
					className="!w-full"
					onClick={(e) => handleMinuteChange(e, "decrement")}
				>
					<ChevronDownIcon className="h-5 w-5" />
				</Button>
			</div>
			<RadioGroup defaultValue="AM">
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="AM" id="AM" />
					<Label htmlFor="AM">AM</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="PM" id="PM" />
					<Label htmlFor="PM">PM</Label>
				</div>
			</RadioGroup>
		</div>
	);
}
