"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function useLastPath(): string | null {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);
  const currentPathRef = useRef<string | null>(null);

  // Only run this effect when pathname changes
  useEffect(() => {
    // Only update the previous path if we have a current path and it's different from the new one
    if (currentPathRef.current && currentPathRef.current !== pathname) {
      previousPathRef.current = currentPathRef.current;
      sessionStorage.setItem("lastPath", previousPathRef.current);
    }
    
    // Always update the current path
    currentPathRef.current = pathname;
  }, [pathname]);

  // Return the previous path from the ref or sessionStorage (only in browser)
  if (typeof window !== 'undefined') {
    return previousPathRef.current || sessionStorage.getItem("lastPath");
  }
  return previousPathRef.current;
}