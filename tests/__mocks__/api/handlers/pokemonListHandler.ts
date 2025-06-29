import type { PaginatedPokemonSummaryListReadable, PokemonSummaryReadable } from '../../../../src/client/types.gen';

interface MockResponse {
  status: number;
  contentType: string;
  body: string;
}

export const handlePokemonList = (url: URL): MockResponse => {
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);
  
  const results: PokemonSummaryReadable[] = Array.from({ length: limit }, (_, i) => ({
    name: `pokemon-${offset + i + 1}`,
    url: `https://pokeapi.co/api/v2/pokemon/${offset + i + 1}/`,
  }));
  
  const paginatedResults: PaginatedPokemonSummaryListReadable = {
    count: limit,
    next: undefined,
    previous: undefined,
    results,
  };
  
  return {
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(paginatedResults),
  };
};
