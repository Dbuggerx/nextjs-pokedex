import { PokemonNavigation } from "./pokemon-navigation";

type ErrorStateProps = {
  pokemonId: number;
  onNavigate: (direction: "prev" | "next") => void;
  errorMessage?: string;
};

export function ErrorState({ pokemonId, onNavigate, errorMessage = "Failed to load Pokémon details." }: ErrorStateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PokemonNavigation 
        pokemonId={pokemonId}
        onNavigate={onNavigate}
      />
      <div className="text-center">
        <p className="text-red-500 mb-4">{errorMessage}</p>
      </div>
    </div>
  );
}
