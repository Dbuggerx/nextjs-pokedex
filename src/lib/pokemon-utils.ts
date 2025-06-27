import { PokemonType } from "./types";

export const getTypeColor = (type: PokemonType): string => {
  const colors: Record<PokemonType, string> = {
    normal: "from-gray-400 to-gray-500",
    fire: "from-red-400 to-orange-500",
    water: "from-blue-400 to-blue-600",
    electric: "from-yellow-300 to-yellow-500",
    grass: "from-green-400 to-green-600",
    ice: "from-cyan-300 to-blue-400",
    fighting: "from-red-600 to-red-800",
    poison: "from-purple-400 to-purple-600",
    ground: "from-yellow-600 to-brown-500",
    flying: "from-indigo-300 to-blue-400",
    psychic: "from-pink-400 to-purple-500",
    bug: "from-green-300 to-lime-500",
    rock: "from-yellow-800 to-brown-600",
    ghost: "from-purple-600 to-indigo-800",
    dragon: "from-indigo-600 to-purple-700",
    dark: "from-gray-700 to-gray-900",
    steel: "from-gray-500 to-gray-700",
    fairy: "from-pink-300 to-rose-400",
  };
  return colors[type] || colors.normal;
};

export const getTypeTextColor = (type: PokemonType): string => {
  const colors: Record<PokemonType, string> = {
    normal: "text-gray-700",
    fire: "text-orange-700",
    water: "text-blue-700",
    electric: "text-yellow-700",
    grass: "text-green-700",
    ice: "text-cyan-700",
    fighting: "text-red-700",
    poison: "text-purple-700",
    ground: "text-yellow-800",
    flying: "text-blue-700",
    psychic: "text-pink-700",
    bug: "text-green-700",
    rock: "text-brown-700",
    ghost: "text-purple-700",
    dragon: "text-indigo-700",
    dark: "text-gray-800",
    steel: "text-gray-700",
    fairy: "text-pink-700",
  };
  return colors[type] || colors.normal;
};

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, "0")}`;
};

export const formatStatName = (statName: string): string => {
  const nameMap: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed",
  };
  return nameMap[statName] || statName;
};

export const getStatColor = (stat: number): string => {
  if (stat >= 100) return "bg-green-500";
  if (stat >= 80) return "bg-yellow-500";
  if (stat >= 60) return "bg-orange-500";
  return "bg-red-500";
};

export const formatWeight = (weight: number): string => {
  return `${(weight / 10).toFixed(1)} kg`;
};

export const formatHeight = (height: number): string => {
  const meters = height / 10;
  const feet = Math.floor(meters * 3.28084);
  const inches = Math.round((meters * 3.28084 - feet) * 12);
  return `${meters.toFixed(1)} m (${feet}'${inches}")`;
};
