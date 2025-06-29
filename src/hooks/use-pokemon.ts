import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { pokemonApi } from "@/lib/pokemon-api";
import { useCallback, useDeferredValue, useRef, useEffect } from "react";
import type { Pokemon, PokemonType } from "@/lib/types";

// Helper function to fetch Pokemon details
const fetchPokemonDetails = async (name: string): Promise<Pokemon | null> => {
  try {
    const pokemonData = await pokemonApi.getPokemon(name);
    return transformToPokemon(pokemonData);
  } catch (error) {
    console.error(`Failed to fetch details for ${name}:`, error);
    return null;
  }
};

export const ITEMS_PER_PAGE = 24;

// Types for the Pokemon API responses
interface PokemonSummary {
  name: string;
  url: string;
}

interface PokemonListResponse {
  results: PokemonSummary[];
  next: string | null;
  previous: string | null;
  count: number;
}

export interface PokemonInfiniteQueryData {
  results: Pokemon[];
  next: string | null;
  previous: string | null;
  count: number;
}

// Helper function to validate Pokemon types
const isPokemonType = (type: string): type is PokemonType => {
  return [
    "normal", "fire", "water", "electric", "grass", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug",
    "rock", "ghost", "dragon", "dark", "steel", "fairy"
  ].includes(type);
};

// Helper function to transform API response to our Pokemon type
const transformToPokemon = (data: unknown): Pokemon | null => {
  if (!data || typeof data !== 'object') return null;

  try {
    const pokemonData = data as {
      id: number;
      name: string;
      types?: Array<{
        slot: number;
        type: {
          name: string;
          url: string;
        };
      }>;
      sprites?: {
        front_default?: string | null;
        other?: {
          "official-artwork"?: {
            front_default?: string | null;
          };
        } | null;
      } | null;
      height?: number;
      weight?: number;
      stats?: Array<{
        base_stat: number;
        stat: {
          name: string;
        };
      }>;
    };

    // Validate and transform types
    const types = (pokemonData.types || []).map((t) => ({
      slot: t.slot || 1,
      type: {
        name: t?.type?.name && isPokemonType(t.type.name) ? t.type.name : "normal" as const,
        url: t?.type?.url || '',
      },
    }));

    return {
      id: pokemonData.id || 0,
      name: pokemonData.name || 'unknown',
      types,
      sprites: {
        front_default: pokemonData.sprites?.front_default || "",
        other: {
          "official-artwork": {
            front_default: pokemonData.sprites?.other?.["official-artwork"]?.front_default || "",
          },
        },
      },
      height: pokemonData.height || 0,
      weight: pokemonData.weight || 0,
      stats: (pokemonData.stats || []).map((s) => ({
        base_stat: s?.base_stat || 0,
        stat: {
          name: s?.stat?.name || 'unknown',
        },
      })),
    };
  } catch (error) {
    console.error("Error transforming Pokemon data:", error);
    return null;
  }
};

const transformPokemonList = async (listResponse: PokemonListResponse): Promise<PokemonInfiniteQueryData> => {
  if (!listResponse?.results) {
    throw new Error("Failed to fetch Pokémon list");
  }

  const pokemonDetails = await Promise.all(
    listResponse.results.map(async (pokemon) => {
      try {
        const pokemonData = await pokemonApi.getPokemon(pokemon.name);
        return transformToPokemon(pokemonData);
      } catch (error) {
        console.error(`Failed to fetch details for ${pokemon.name}:`, error);
        return null;
      }
    })
  );

  // Transformation
  const validPokemon = pokemonDetails.filter((p): p is Pokemon => p !== null);

  return {
    ...listResponse,
    results: validPokemon,
  };
};

export const usePokemonInfiniteQuery = () => {
  return useInfiniteQuery<PokemonInfiniteQueryData, Error>({
    queryKey: ["infinite-pokemon"],
    queryFn: async ({ pageParam = 0 }) => {
      const listResponse = await pokemonApi.getPokemonList(
        ITEMS_PER_PAGE,
        Number(pageParam) * ITEMS_PER_PAGE
      ) as PokemonListResponse;
      return transformPokemonList(listResponse);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      if (!firstPage.previous) return undefined;
      return allPages.length > 1 ? allPages.length - 2 : undefined;
    },
  });
};

export const useAllPokemonList = () => {
  return useQuery<PokemonSummary[]>({
    queryKey: ["all-pokemon"],
    queryFn: async () => {
      const response = await pokemonApi.getPokemonList(2000, 0) as PokemonListResponse;
      return response.results;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const usePokemonTransform = () => {
  const transform = useCallback((data: unknown): Pokemon | null => {
    return transformToPokemon(data);
  }, []);

  return { transformToPokemon: transform };
};

export const usePokemonSearch = (searchQuery: string, allPokemonList: PokemonSummary[] = []) => {
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const { transformToPokemon } = usePokemonTransform();

  return useQuery<Pokemon[]>({
    queryKey: ["pokemon-search", deferredSearchQuery],
    queryFn: async (): Promise<Pokemon[]> => {
      const query = deferredSearchQuery.trim().toLowerCase();
      if (!query) return [];

      try {
        // Try exact match first
        const exactMatch = await pokemonApi.getPokemon(query).catch(() => null);
        if (exactMatch) {
          const pokemon = transformToPokemon(exactMatch);
          return pokemon ? [pokemon] : [];
        }

        // If no exact match, search in the full list
        if (allPokemonList.length === 0) return [];

        const matchingPokemon = allPokemonList
          .filter((p) => p.name.toLowerCase().includes(query))
          .slice(0, 10) // Limit to 10 results for performance
          .map((p) => p.name);

        if (matchingPokemon.length === 0) return [];

        // Fetch full details for matching pokemon
        const pokemonDetails = await Promise.all(matchingPokemon.map(fetchPokemonDetails));
        return pokemonDetails.filter((p): p is Pokemon => p !== null);
      } catch (error) {
        console.error("Error searching for Pokémon:", error);
        return [];
      }
    },
    enabled: !!deferredSearchQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

interface UsePokemonIntersectionObserverProps {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  showSearchResults: boolean;
  fetchNextPage: () => void;
}

export const usePokemonIntersectionObserver = ({
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  showSearchResults,
  fetchNextPage,
}: UsePokemonIntersectionObserverProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || isFetchingNextPage || showSearchResults || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoading, isFetchingNextPage, hasNextPage, showSearchResults, fetchNextPage]);

  return { loadMoreRef };
};
