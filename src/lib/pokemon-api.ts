import {
  apiV2PokemonList,
  apiV2PokemonRetrieve,
  apiV2PokemonSpeciesRetrieve,
  PokemonDetailReadable,
} from "@/client";

export const pokemonApi = {
  // Get list of Pokémon
  getPokemonList: async (limit: number = 20, offset: number = 0) => {
    try {
      const response = await apiV2PokemonList({
        query: {
          limit,
          offset,
        },
      });
      if (response.error) throw response.error;
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single Pokémon by name or ID
  getPokemon: async (nameOrId: string | number): Promise<PokemonDetailReadable | null> => {
    try {
      const response = await apiV2PokemonRetrieve({
        path: {
          id: nameOrId.toString(),
        },
      });
      if (response.error) throw response.error;
      return response.data ?? null;
    } catch (error) {
      if ((error as { response?: { status: number } })?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get Pokémon species
  getPokemonSpecies: async (nameOrId: string | number) => {
    try {
      const response = await apiV2PokemonSpeciesRetrieve({
        path: {
          id: nameOrId.toString(),
        },
      });
      if (response.error) throw response.error;
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get Pokémon with details
  getPokemonWithDetails: async (nameOrId: string | number) => {
    try {
      const [pokemon, species] = await Promise.all([
        pokemonApi.getPokemon(nameOrId),
        pokemonApi.getPokemonSpecies(nameOrId),
      ]);
      return { ...pokemon, species };
    } catch (error) {
      console.error(`Error fetching Pokémon details ${nameOrId}:`, error);
      throw error;
    }
  },
};
