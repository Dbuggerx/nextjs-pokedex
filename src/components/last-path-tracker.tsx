'use client';

import { useLastPath } from '@/hooks/use-last-path';

export function LastPathTracker() {
  // This will track the last navigation path
  useLastPath();
  return null; // This component doesn't render anything
}
