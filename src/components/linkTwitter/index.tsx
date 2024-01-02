"use client";

import { api } from "@/trpc/react";

import { Button } from "../ui/button";

export function LinkTwitterButton() {
	const generateAuthLink = api.twitter.generateOAuth2URL.useQuery();

	const { data } = generateAuthLink;

	return (
		<Button variant="link">
			<a href={data}>Link twitter</a>
		</Button>
	);
}
