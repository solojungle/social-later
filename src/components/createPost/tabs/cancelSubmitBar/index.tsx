"use client";

// eslint-disable-next-line simple-import-sort/imports

import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { SheetClose } from "@/components/ui/sheet";

interface Props {
	loading: boolean;
	form: any;
	action?: string;
	disabled?: boolean;
}

export function CancelSubmitBar({
	loading,
	form,
	action = "Publish",
	disabled,
}: Props) {
	return (
		<div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background py-4">
			<SheetClose
				asChild
				onClick={() => {
					form.reset();
				}}
			>
				<Button type="button" variant="outline">
					Cancel
				</Button>
			</SheetClose>
			<Button type="submit" disabled={loading || disabled}>
				{loading && (
					<InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
				)}
				{action}
			</Button>
		</div>
	);
}
