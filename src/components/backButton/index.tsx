"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="sticky self-start"
      onClick={() => router.back()}
      variant="ghost"
    >
      <ChevronLeft className="h-5 w-5" />
      <span className="ml-2">Back</span>
    </Button>
  );
}
