"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import * as React from "react";

import { ContinueWithGoogle } from "@/components/sso/continueWithGoogle";
import { cn } from "@/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const searchParams = useSearchParams();

	const callbackUrl = searchParams.get("callbackUrl");

	return (
		<div className={cn("grid w-full", className)} {...props}>
			<ContinueWithGoogle
				type="button"
				onClick={() => {
					// Include callbackUrl if it exists
					const signInOptions = callbackUrl ? { callbackUrl } : undefined;

					signIn("google", signInOptions);
				}}
			/>
		</div>
	);
}
