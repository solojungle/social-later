"use client";

import { ContinueWithGoogle } from "@/components/sso/continueWithGoogle";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { createSerializer, parseAsString, useQueryState } from "nuqs";
import * as React from "react";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [inviteCode] = useQueryState("inviteCode");

  const serialize = createSerializer({
    inviteCode: parseAsString,
  });

  // const referralCode = searchParams.get("referralCode");
  const callbackUrl = inviteCode
    ? serialize("/invites", { inviteCode })
    : undefined;

  return (
    <div className={cn("grid w-full", className)} {...props}>
      <ContinueWithGoogle
        onClick={() => {
          // Include callbackUrl if it exists
          const signInOptions = callbackUrl ? { callbackUrl } : undefined;
          signIn("google", signInOptions);
        }}
        type="button"
      />
    </div>
  );
}
