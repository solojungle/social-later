"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthWrapperProps {
	isAuthenticated: boolean;
	children: React.ReactNode;
}

export function AuthWrapper({ isAuthenticated, children }: AuthWrapperProps) {
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null; // Or a loading spinner if you prefer
	}

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{children}</>;
}
