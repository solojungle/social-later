"use client";

import { signIn } from "next-auth/react";
import * as React from "react";

import { ContinueWithGoogle } from "@/components/sso/continueWithGoogle";
import { cn } from "@/lib/utils";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	return (
		<div className={cn("grid w-full", className)} {...props}>
			<ContinueWithGoogle type="button" onClick={() => signIn("google")} />
		</div>
	);
}
