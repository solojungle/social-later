"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { InterfaceIcons } from "../ui/icons";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="sticky self-start"
      onClick={() => router.back()}
      variant="ghost"
    >
      <InterfaceIcons.Back className="size-5" />
      <span className="ml-2">Back</span>
    </Button>
  );
}
