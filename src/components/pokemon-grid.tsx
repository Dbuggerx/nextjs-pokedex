"use client";

import { PokemonCard } from "./pokemon-card";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";
import { useMemo, useDeferredValue } from "react";
import { 
  usePokemonInfiniteQuery, 
  useAllPokemonList, 
  usePokemonSearch,
  usePokemonIntersectionObserver,
  ITEMS_PER_PAGE,
} from "@/hooks/use-pokemon";

interface PokemonGridProps {
  searchQuery: string;
}

export function PokemonGrid({ searchQuery }: PokemonGridProps) {
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Use custom hooks for data fetching and state management
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage,
    isLoading: isLoadingInfinite,
  } = usePokemonInfiniteQuery();
  
  // Ensure infiniteData.pages is always defined
  const pages = useMemo(() => infiniteData?.pages || [], [infiniteData?.pages]);

  // Get all pokemon list for search
  const { data: allPokemonList = [] } = useAllPokemonList();

  // Handle pokemon search
  const { data: searchResults, isPending: isSearching } = usePokemonSearch(deferredSearchQuery, allPokemonList);

  // Memoized search results with proper typing
  const searchPokemonResults = useMemo(
    () => ({
      data: searchResults || [],
      isPending: isSearching,
    }),
    [searchResults, isSearching]
  );

  const safeSearchResults = searchPokemonResults.data;

  // Determine if we're showing search results or paginated list
  const showSearchResults = useMemo(
    () => deferredSearchQuery.length > 0 && safeSearchResults.length > 0,
    [deferredSearchQuery, safeSearchResults]
  );

  // Flatten all pages of pokemon details
  const allPokemon = useMemo(() => {
    return pages.flatMap((page) => page.results || []);
  }, [pages]);

  // Combine loading states
  const isLoading = useMemo(() => {
    if (deferredSearchQuery.length > 0) {
      return searchPokemonResults.isPending || 
             (showSearchResults && safeSearchResults.length === 0);
    }
    // When not searching, show loading only if we're loading the first page
    return isLoadingInfinite && pages.length === 0;
  }, [
    deferredSearchQuery.length,
    isLoadingInfinite,
    pages.length,
    safeSearchResults.length,
    searchPokemonResults.isPending,
    showSearchResults
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
  const { loadMoreRef } = usePokemonIntersectionObserver({
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    showSearchResults,
    fetchNextPage,
  });

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {/* Pokemon cards */}
      {filteredPokemon.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}

      {/* Loading indicator */}
      {!showSearchResults && isFetchingNextPage &&
        Array.from({ length: 4 }).map((_, index) => (
          <PokemonCardSkeleton key={`skeleton-${index}`} />
        ))
      }

      {/* Intersection Observer target */}
      {!showSearchResults && hasNextPage && (
        <div ref={loadMoreRef} className="h-4 w-full col-span-full" />
      )}
    </div>
  );
}
