"use client";

import { usePathname, useRouter } from "next/navigation";

import { AccountForm } from "@/components/forms/account-form";
import { Separator } from "@/components/ui/separator";

export default function PersonalGeneralSettingsPage() {
	const router = useRouter();
	const pathname = usePathname();

	if (pathname !== "/settings") {
		router.replace("/settings");
	}

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Account</h3>
				<p className="text-sm text-muted-foreground">
					Update your account settings. Set your preferred language and
					timezone.
				</p>
			</div>
			<Separator />
			<AccountForm />
		</div>
	);
}
