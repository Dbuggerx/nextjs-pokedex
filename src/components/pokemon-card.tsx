"use client";

import { getTypeColor, formatPokemonId } from "@/lib/pokemon-utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Pokemon } from "@/lib/types";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const primaryType = pokemon?.types?.[0]?.type?.name || "normal";

  if (!pokemon) {
    return (
      <Card className="bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg p-6 animate-pulse">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto" />
        <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(
          primaryType
        )} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
      />

      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="capitalize text-xl font-bold text-gray-900 dark:text-white">
              {pokemon?.name ? pokemon.name : "Unknown Pokemon"}
            </h3>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {pokemon?.id ? formatPokemonId(pokemon.id) : "???"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 w-32 relative">
            <Image
              src={
                pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
              }
              alt={pokemon?.name || "Pokemon"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
              unoptimized={
                !pokemon.sprites?.other?.["official-artwork"]?.front_default
              }
            />
          </div>

          <div className="text-center">
            <ul className="flex flex-wrap justify-center gap-1">
              {pokemon.types?.length ? (
                pokemon.types.map((type) => (
                  <Badge
                    key={type.type.name}
                    asChild
                    variant="outline"
                    className={`capitalize px-2 py-1 text-xs font-medium ${getTypeColor(
                      type.type.name
                    )}`}
                  >
                    <li>{type.type.name}</li>
                  </Badge>
                ))
              ) : (
                <Badge
                  variant="outline"
                  className="px-2 py-1 text-xs font-medium"
                >
                  Unknown
                </Badge>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
