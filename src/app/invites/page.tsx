"use client";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function InvitesPage() {
	const params = useSearchParams();

	console.log(params.get("team"));
	console.log(params.get("token"));

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-semibold">Invites</h1>
			<p>This team invited you to collaborate</p>
			<Button>
				<span>Accept</span>
			</Button>
		</div>
	);
}
