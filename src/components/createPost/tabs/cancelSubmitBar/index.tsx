"use client";

// eslint-disable-next-line simple-import-sort/imports
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

interface Props {
	loading: boolean;
	form: any;
}

export function CancelSubmitBar({ loading, form }: Props) {
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
			<Button type="submit" disabled={loading}>
				{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				Publish
			</Button>
		</div>
	);
}
