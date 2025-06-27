"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { pokemonApi } from "@/lib/pokemon-api";
import { PokemonCard } from "./pokemon-card";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";
// Import the Pokemon type from the types file
import type { Pokemon, PokemonType } from "@/lib/types";
import { useDeferredValue, useMemo, useRef, useCallback } from "react";

type PokemonSummary = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  results: PokemonSummary[];
  next: string | null;
  previous: string | null;
  count: number;
};

type PokemonSummaryReadable = {
  name: string;
  url: string;
};

type PaginatedPokemonSummaryListReadable = {
  results: PokemonSummaryReadable[] | undefined;
  next: string | null;
  previous: string | null;
  count: number;
};

const ITEMS_PER_PAGE = 24;

interface PokemonGridProps {
  searchQuery: string;
}

export function PokemonGrid({ searchQuery }: PokemonGridProps) {
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Infinite query for paginated pokemon with their details
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingInfinite,
  } = useInfiniteQuery({
    queryKey: ["infinite-pokemon"],
    queryFn: async ({ pageParam = 0 }) => {
      // Fetch the list of pokemon for this page
      const listResponse = await pokemonApi.getPokemonList(
        ITEMS_PER_PAGE,
        pageParam * ITEMS_PER_PAGE
      );

      if (!listResponse?.results) {
        throw new Error("Failed to fetch Pokémon list");
      }

      // Fetch details for all pokemon in this page in parallel
      const pokemonDetails = await Promise.all(
        listResponse.results.map((pokemon) =>
          pokemonApi.getPokemon(pokemon.name)
        )
      );

      return {
        ...listResponse,
        results: pokemonDetails,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      // If there's no next page URL, we've reached the end
      if (!lastPage.next) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage, allPages) => {
      // If there's no previous page URL, we're at the first page
      if (!firstPage.previous) return undefined;
      return allPages.length > 1 ? allPages.length - 2 : undefined;
    },
  });

  // Type assertion for the infinite query data
  const infiniteData = data as unknown as
    | { pages: Array<{ results: Pokemon[] }> }
    | undefined;

  // Get the full list of pokemon (cached) for search
  const { data: allPokemonList } = useQuery<PokemonListResponse>({
    queryKey: ["all-pokemon-list"],
    queryFn: async (): Promise<PokemonListResponse> => {
      // Fetch all Pokémon by using a large limit
      const response = (await pokemonApi.getPokemonList(
        2000, 
        0
      )) as PaginatedPokemonSummaryListReadable;
      if (!response?.results) {
        throw new Error("Failed to fetch Pokémon list");
      }
      return {
        results: response.results.map((p) => ({
          name: p.name,
          url: p.url,
        })),
        next: response.next,
        previous: response.previous,
        count: response.count,
      };
    },
    staleTime: Infinity, // Cache forever since the list rarely changes
    gcTime: Infinity, // Keep in cache forever
  });

  // Helper function to safely cast and validate Pokemon type
  const isPokemonType = (type: string): type is PokemonType => {
    return [
      "normal",
      "fire",
      "water",
      "electric",
      "grass",
      "ice",
      "fighting",
      "poison",
      "ground",
      "flying",
      "psychic",
      "bug",
      "rock",
      "ghost",
      "dragon",
      "dark",
      "steel",
      "fairy",
    ].includes(type);
  };

  // Helper function to transform API response to our Pokemon type
  const transformToPokemon = (data: unknown): Pokemon | null => {
    if (!data || typeof data !== "object") return null;

    try {
      const pokemonData = data as {
        id: number;
        name: string;
        types: Array<{
          slot: number;
          type: {
            name: string;
            url: string;
          };
        }>;
        sprites: {
          front_default?: string;
          other?: {
            "official-artwork"?: {
              front_default?: string;
            };
          };
          [key: string]: unknown;
        };
        height: number;
        weight: number;
        stats: Array<{
          base_stat: number;
          stat: {
            name: string;
            url: string;
          };
        }>;
      };

      // Validate and transform types
      const types = pokemonData.types.map((t) => ({
        slot: t.slot,
        type: {
          name: isPokemonType(t.type.name) ? t.type.name : "normal",
          url: t.type.url,
        },
      }));

      return {
        id: pokemonData.id,
        name: pokemonData.name,
        types,
        sprites: {
          front_default: pokemonData.sprites.front_default || "",
          other: {
            "official-artwork": {
              front_default:
                pokemonData.sprites.other?.["official-artwork"]
                  ?.front_default || "",
            },
          },
        },
        height: pokemonData.height || 0,
        weight: pokemonData.weight || 0,
        stats: pokemonData.stats.map((s) => ({
          base_stat: s.base_stat,
          stat: {
            name: s.stat.name,
          },
        })),
      };
    } catch (error) {
      console.error("Error transforming Pokemon data:", error);
      return null;
    }
  };

  // Get search results using React Query with proper typing
  const { data: searchResults, isPending: isSearching } = useQuery({
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
        if (!allPokemonList?.results) return [];

        const matchingPokemon = allPokemonList.results
          .filter((p) => p.name.toLowerCase().includes(query))
          .slice(0, 10) // Limit to 10 results for performance
          .map((p) => p.name);

        if (matchingPokemon.length === 0) return [];

        // Fetch full details for matching pokemon
        const pokemonPromises = matchingPokemon.map(async (name) => {
          try {
            const response = await pokemonApi.getPokemon(name);
            return transformToPokemon(response);
          } catch (error) {
            console.error(`Failed to fetch details for ${name}:`, error);
            return null;
          }
        });

        const pokemonResults = await Promise.all(pokemonPromises);
        return pokemonResults.filter((p): p is Pokemon => p !== null);
      } catch (error) {
        console.error("Search failed:", error);
        return [];
      }
    },
    enabled: !!deferredSearchQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Memoized search results with proper typing
  const safeSearchResults = useMemo<Pokemon[]>(
    () => searchResults || [],
    [searchResults]
  );

  const searchPokemonResults = useMemo(
    () => ({
      data: safeSearchResults,
      isPending: isSearching,
    }),
    [safeSearchResults, isSearching]
  );

  // Determine if we're showing search results or paginated list
  const showSearchResults = useMemo(
    () => deferredSearchQuery.length > 0 && safeSearchResults.length > 0,
    [deferredSearchQuery, safeSearchResults]
  );

  // Flatten all pages of pokemon details
  const allPokemon = useMemo(() => {
    if (!infiniteData) return [];
    return infiniteData.pages.flatMap((page) => page.results);
  }, [infiniteData]);

  // Combine loading states
  const isLoading = useMemo(() => {
    if (deferredSearchQuery.length > 0) {
      return (
        searchPokemonResults.isPending ||
        (showSearchResults && safeSearchResults.length === 0)
      );
    }
    // When not searching, show loading only if we're loading the first page
    return isLoadingInfinite && !infiniteData?.pages?.length;
  }, [
    deferredSearchQuery.length,
    isLoadingInfinite,
    safeSearchResults.length,
    searchPokemonResults.isPending,
    showSearchResults,
    infiniteData?.pages?.length,
  ]);

  // Get the final list of pokemon to display
  const displayPokemon = useMemo(() => {
    if (deferredSearchQuery.length > 0) {
      // If we're searching but don't have results yet, show empty array
      if (!searchPokemonResults) return [];
      return searchPokemonResults.data;
    }
    // Otherwise show the combined results from all pages
    return allPokemon;
  }, [deferredSearchQuery, searchPokemonResults, allPokemon]);

  // Set up intersection observer for infinite loading
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !showSearchResults) {
            fetchNextPage({ cancelRefetch: false });
          }
        },
        {
          // Start loading when the target is within 400px of the viewport
          rootMargin: "400px",
          // Trigger when at least 10% of the target is visible
          threshold: 0.1,
        }
      );
      if (node) observer.current.observe(node);
    },
    [
      isLoading,
      isFetchingNextPage,
      hasNextPage,
      showSearchResults,
      fetchNextPage,
    ]
  ) as (node: HTMLDivElement) => void;

  // Use displayPokemon directly since we're not filtering by type anymore
  const filteredPokemon = displayPokemon || [];

  if (isLoading && !allPokemon.length) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
          <PokemonCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Handle search with no results
  if (deferredSearchQuery.length > 0 && safeSearchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No Pokémon found matching &quot;{deferredSearchQuery}&quot;
        </p>
      </div>
    );
  }

  // Handle no results after filtering
  if (filteredPokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No Pokémon found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredPokemon.map((pokemon: Pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {/* Loading indicator at the bottom */}
      {!showSearchResults && isFetchingNextPage && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <PokemonCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* Intersection Observer target */}
      {!showSearchResults && hasNextPage && (
        <div ref={loadMoreRef} className="h-1 w-full" />
      )}
    </>
  );
}
