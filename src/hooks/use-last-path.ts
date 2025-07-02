"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function useLastPath(): string | null {
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState<string | null>(null);
  const currentPathRef = useRef<string | null>(null);
  const isMounted = useRef(false);

  // Initialize state on mount
  useEffect(() => {
    isMounted.current = true;
    // Read from sessionStorage on mount
    const storedPath = sessionStorage.getItem("lastPath");
    if (storedPath) {
      setLastPath(storedPath);
    }

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Track path changes
  useEffect(() => {
    if (!isMounted.current) return;

    const previousPath = currentPathRef.current;
    
    // Update previous path if current path is different and not null/undefined
    if (previousPath && previousPath !== pathname) {
      setLastPath(previousPath);
      try {
        sessionStorage.setItem("lastPath", previousPath);
      } catch (e) {
        console.warn("Failed to update last path in sessionStorage", e);
      }
    }
    
    // Update current path
    currentPathRef.current = pathname;
  }, [pathname]);

  return lastPath;
}