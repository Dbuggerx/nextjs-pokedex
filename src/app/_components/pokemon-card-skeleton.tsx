import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PokemonCardSkeleton() {
  return (
    <Card className="group relative overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />

      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 w-32 relative">
            <Skeleton className="w-full h-full rounded-full" />
          </div>

          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
