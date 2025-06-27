import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PokemonCardSkeleton() {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="w-24 h-24 rounded-full" />

          <div className="w-full text-center space-y-2">
            <Skeleton className="h-6 w-24 mx-auto" />
            <div className="flex justify-center gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
