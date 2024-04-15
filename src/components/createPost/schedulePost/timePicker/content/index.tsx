import { useState } from "react";

export function TimePickerContent() {
	const [hours, setHours] = useState("12");
	const [minutes, setMinutes] = useState("00");
	const [ampm, setAmpm] = useState("AM");

	const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (/^(0?[1-9]|1[0-2])$/.test(value) || value === "") {
			setHours(value.padStart(2, "0"));
		} else if (/^\d+$/.test(value)) {
			// If the value is a number but outside the range of 1-12, adjust it
			if (parseInt(value, 10) > 12) {
				setHours("12");
			} else {
				setHours(value.padStart(2, "0"));
			}
		}
	};

	const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (/^[0-5]?[0-9]$/.test(value) || value === "") {
			setMinutes(value.padStart(2, "0"));
		}
	};

	const handleHourKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowUp") {
			setHours((prev) => {
				const value = parseInt(prev, 10) + 1;
				return (value <= 23 ? value : 0).toString().padStart(2, "0");
			});
		} else if (e.key === "ArrowDown") {
			setHours((prev) => {
				const value = parseInt(prev, 10) - 1;
				return (value >= 0 ? value : 23).toString().padStart(2, "0");
			});
		}
	};

	const handleMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowUp") {
			setMinutes((prev) => {
				const value = parseInt(prev, 10) + 1;
				return (value <= 59 ? value : 0).toString().padStart(2, "0");
			});
		} else if (e.key === "ArrowDown") {
			setMinutes((prev) => {
				const value = parseInt(prev, 10) - 1;
				return (value >= 0 ? value : 59).toString().padStart(2, "0");
			});
		}
	};

	return (
		<div className="flex items-center justify-center rounded-lg bg-card p-4">
			<div className="flex flex-col items-center">
				<input
					className="h-16 w-16 rounded-lg border border-border bg-transparent text-center font-mono text-3xl tabular-nums caret-transparent [&::-webkit-inner-spin-button]:appearance-none"
					type="text"
					value={hours}
					onChange={handleHourChange}
					onKeyDown={handleHourKeyDown}
					maxLength={2}
				/>
			</div>
			<div className="flex flex-col items-center justify-center px-2">
				<span className="text-2xl text-muted-foreground">:</span>
			</div>
			<div className="flex flex-col items-center">
				<input
					className="h-16 w-16 rounded-lg border border-border bg-transparent text-center font-mono text-3xl tabular-nums caret-transparent [&::-webkit-inner-spin-button]:appearance-none"
					type="text"
					value={minutes}
					onChange={handleMinuteChange}
					onKeyDown={handleMinuteKeyDown}
					maxLength={2}
				/>
			</div>
			<div className="flex flex-col px-2">
				<div className="flex h-16 w-16 flex-col rounded-lg border border-border bg-card text-sm font-medium">
					<button
						type="button"
						className={`h-8 rounded-b-none rounded-t-lg ${
							ampm === "AM"
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground"
						}`}
						onClick={() => setAmpm("AM")}
					>
						AM
					</button>
					<button
						type="button"
						className={`h-8 rounded-b-lg rounded-t-none ${
							ampm === "PM"
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground"
						}`}
						onClick={() => setAmpm("PM")}
					>
						PM
					</button>
				</div>
			</div>
		</div>
	);
}
