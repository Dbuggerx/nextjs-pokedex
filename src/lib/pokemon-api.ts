import { apiV2PokemonList, apiV2PokemonRetrieve, apiV2PokemonSpeciesRetrieve } from "@/client";

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
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokémon list:", error);
      throw error;
    }
  },

  // Get a single Pokémon by name or ID
  getPokemon: async (nameOrId: string | number) => {
    try {
      const response = await apiV2PokemonRetrieve({
        path: {
          id: nameOrId.toString()
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching Pokémon ${nameOrId}:`, error);
      throw error;
    }
  },

  // Get Pokémon species
  getPokemonSpecies: async (nameOrId: string | number) => {
    try {
      const response = await apiV2PokemonSpeciesRetrieve({
        path: {
          id: nameOrId.toString()
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching Pokémon species ${nameOrId}:`, error);
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

