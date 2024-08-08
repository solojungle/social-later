"use client";

import { useState } from "react";

import { Button } from "../ui/button";
import { InterfaceIcons } from "../ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

export function FeedbackForm() {
	const [value, setValue] = useState("");

	const action = () => {};

	return (
		<Popover>
			<PopoverTrigger asChild className="hidden md:inline-flex">
				<Button variant="outline" className="">
					Feedback
				</Button>
			</PopoverTrigger>
			<PopoverContent className="h-[200px] w-[320px]" sideOffset={10}>
				{action.status === "hasSucceeded" ? (
					<div className="mt-10 flex flex-col items-center justify-center space-y-1 text-center">
						<p className="text-sm font-medium">Thank you for your feedback!</p>
						<p className="text-sm text-[#4C4C4C]">
							We will be back with you as soon as possible
						</p>
					</div>
				) : (
					<form className="space-y-4">
						<Textarea
							name="feedback"
							value={value}
							required
							autoFocus
							placeholder="Ideas to improve this page or issues you are experiencing."
							className="h-[120px] resize-none"
							onChange={(evt) => setValue(evt.target.value)}
						/>

						<div className="mt-1 flex items-center justify-end">
							<Button
								type="button"
								onClick={() => action.execute({ feedback: value })}
								disabled={value.length === 0 || action.status === "executing"}
							>
								{action.status === "executing" ? (
									<InterfaceIcons.Loading className="h-4 w-4 animate-spin" />
								) : (
									"Send"
								)}
							</Button>
						</div>
					</form>
				)}
			</PopoverContent>
		</Popover>
	);
}
