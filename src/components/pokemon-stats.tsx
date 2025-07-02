import { Pokemon } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { formatStatName } from '@/lib/pokemon-utils';

interface PokemonStatsProps {
  pokemon: Pokemon;
}

export function PokemonStats({ pokemon }: PokemonStatsProps) {
  return (
    <div className="space-y-4">
      {pokemon.stats.map((stat) => (
        <div key={stat.stat.name}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatStatName(stat.stat.name)}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {stat.base_stat}
            </span>
          </div>
          <Progress 
            value={(stat.base_stat / 255) * 100} 
            className="h-2"
          />
        </div>
      ))}
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Total:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Average:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {Math.round(pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0) / pokemon.stats.length)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}