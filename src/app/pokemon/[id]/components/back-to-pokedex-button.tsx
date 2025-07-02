"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLastPath } from "@/hooks/use-last-path";
import { useCallback } from "react";

export function BackToPokedexButton() {
  const router = useRouter();
  const lastPath = useLastPath();
  const currentPath = usePathname();

  const handleBack = useCallback(() => {
    if (
      lastPath &&
      getFirstPathSegment(lastPath) !== getFirstPathSegment(currentPath)
    ) {
      // If we have a last path and it's different from current, go back
      router.back();
    } else {
      // Otherwise, go to home
      router.push("/");
    }
  }, [lastPath, currentPath, router]);

  return (
    <Button onClick={handleBack} variant="outline">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Pokédex
    </Button>
  );
}

/**
 * Extracts the first path segment from a URL path
 * @example getFirstPathSegment('/pokemon/25') // returns 'pokemon'
 */
function getFirstPathSegment(path: string): string {
  return path.split("/")[1] || "";
}
