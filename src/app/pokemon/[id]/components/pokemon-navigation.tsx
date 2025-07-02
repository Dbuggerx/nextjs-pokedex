import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BackToPokedexButton } from "@/app/pokemon/[id]/components/back-to-pokedex-button";

interface PokemonNavigationProps {
  pokemonId: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function PokemonNavigation({ pokemonId, onNavigate }: PokemonNavigationProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <BackToPokedexButton />

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("prev")}
          disabled={pokemonId <= 1}
          title="Previous Pokemon"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("next")}
          disabled={pokemonId >= 151}
          title="Next Pokemon"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
