"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export function AuthWrapper({ children, isAuthenticated }: AuthWrapperProps) {
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
