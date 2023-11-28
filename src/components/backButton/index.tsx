"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

export default function BackButton() {
	const router = useRouter();

	return (
		<Button className="sticky" variant="ghost" onClick={() => router.back()}>
			<ChevronLeft className="h-5 w-5" />
			<span className="ml-2">Back</span>
		</Button>
	);
}
