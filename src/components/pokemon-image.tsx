import Image from "next/image";
import { Pokemon } from "@/lib/types";

interface PokemonImageProps {
  pokemon: Pokemon;
  size?: number;
  className?: string;
  priority?: boolean;
}

export function PokemonImage({
  pokemon,
  size = 128,
  className = "",
  priority = false,
}: PokemonImageProps) {
  return (
    <div className={`relative`} style={{ width: size, height: size }}>
      <Image
        src={getPokemonImage(pokemon)}
        alt={pokemon?.name || "Pokemon"}
        fill
        sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
        className={`object-contain ${className}`}
        priority={priority}
        unoptimized={
          !pokemon.sprites?.other?.["official-artwork"]?.front_default
        }
      />
    </div>
  );
}

function getPokemonImage(pokemon: Pokemon) {
  return (
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
  );
}
