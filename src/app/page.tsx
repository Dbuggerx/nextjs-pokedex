"use client";

import { useState } from "react";
import { SearchFilters } from "@/components/search-filters";
import { PokemonGrid } from "@/components/pokemon-grid";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <article className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg ">
            Discover and explore the world of Pokémon!
          </p>
        </div>
      </header>

      {/* Search and Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <PokemonGrid searchQuery={searchQuery} />
      {searchQuery && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing search results for &quot;{searchQuery}&quot;
        </div>
      )}
    </article>
  );
}
