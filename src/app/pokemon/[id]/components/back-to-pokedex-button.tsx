"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackToPokedexButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/")}
      variant="outline"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Pokédex
    </Button>
  );
}
