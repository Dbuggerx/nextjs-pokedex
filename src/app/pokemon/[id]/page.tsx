"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { pokemonApi } from "@/lib/pokemon-api";
import { PokemonNavigation } from "./_components/pokemon-navigation";
import { PokemonDetails } from "./_components/pokemon-details";
import { Pokemon } from "@/lib/types";
import { LoadingSkeleton } from "./_components/loading-skeleton";
import { PokemonDetailReadable } from "@/client";
import { isPokemonType } from "@/lib/pokemon-utils";
import { ErrorState } from "./_components/error-state";

// Helper function to map API response to our local Pokemon type
const mapToPokemon = (data: PokemonDetailReadable): Pokemon => ({
  id: data.id,
  name: data.name,
  types: data.types.map((t) => ({
    slot: t.slot,
    type: {
      name: isPokemonType(t.type.name) ? t.type.name : 'normal',
      url: t.type.url,
    },
  })),
  abilities: data.abilities.map((ability) => ({
    ability: {
      name: ability.ability.name,
      url: ability.ability.url,
    },
    is_hidden: ability.is_hidden,
    slot: ability.slot,
  })),
  sprites: {
    front_default: data.sprites.front_default || "",
    other: {
      "official-artwork": {
        front_default:
          (
            data.sprites.other as unknown as {
              "official-artwork"?: { front_default?: string };
            }
          )?.["official-artwork"]?.front_default || "",
      },
    },
  },
  height: data.height || 0,
  weight: data.weight || 0,
  stats: data.stats.map((stat) => ({
    base_stat: stat.base_stat,
    stat: {
      name: stat.stat.name,
      url: stat.stat.url,
    },
  })),
});

export default function PokemonDetail() {
  const params = useParams();
  const router = useRouter();
  const pokemonId = parseInt(params.id as string);

  const navigatePokemon = (direction: "prev" | "next") => {
    const newId = direction === "prev" ? pokemonId - 1 : pokemonId + 1;
    if (newId >= 1 && newId <= 151) {
      router.push(`/pokemon/${newId}`);
    }
  };

  const {
    data: pokemonData,
    isLoading: isPokemonLoading,
    error: pokemonError,
  } = useQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: () => pokemonApi.getPokemon(pokemonId),
    retry: false,
  });

  const pokemon = pokemonData ? mapToPokemon(pokemonData) : null;

  const { data: species, isLoading: isSpeciesLoading } = useQuery({
    queryKey: ["pokemon-species", pokemonId],
    queryFn: () => pokemonApi.getPokemonSpecies(pokemonId),
    enabled: !!pokemonData, // Only fetch if we have pokemon data
    retry: false,
  });

  // Handle loading state
  if (isPokemonLoading || (pokemonData && isSpeciesLoading)) {
    return <LoadingSkeleton />;
  }

  // Handle error state or not found
  if (pokemonError || !pokemonData || !pokemon) {
    return (
      <ErrorState 
        pokemonId={pokemonId} 
        onNavigate={navigatePokemon} 
        errorMessage={
          (pokemonError as { response?: { status: number } })?.response?.status === 404 
            ? "Pokémon not found" 
            : "Failed to load Pokémon details"
        }
      />
    );
  }

  const description =
    species?.flavor_text_entries
      ?.find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ") || "No description available.";

  const genus =
    species?.genera?.find((g) => g.language.name === "en")?.genus || "Unknown";

  return (
    <div className="container mx-auto px-4 py-8">
      <PokemonNavigation 
        pokemonId={pokemonId}
        onNavigate={navigatePokemon}
      />

      <PokemonDetails 
        pokemon={pokemon} 
        genus={genus}
        description={description}
      />
    </div>
  );
}
