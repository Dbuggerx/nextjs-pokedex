import { PokemonDetailReadable } from "@/client";

export const createMockPokemonDetail = (id: number): PokemonDetailReadable => ({
  id,
  name: `pokemon-${id}`,
  base_experience: 64,
  height: 7,
  is_default: true,
  order: 1,
  weight: 69,
  abilities: [
    {
      ability: {
        name: 'overgrow',
        url: 'https://pokeapi.co/api/v2/ability/65/'
      },
      is_hidden: false,
      slot: 1
    }
  ],
  past_abilities: [],
  forms: [],
  game_indices: [],
  held_items: [],
  location_area_encounters: `https://pokeapi.co/api/v2/pokemon/${id}/encounters`,
  moves: [],
  species: {
    name: `pokemon-${id}`,
    url: `https://pokeapi.co/api/v2/pokemon-species/${id}/`
  },
  sprites: {
    front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    other: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  },
  cries: {
    latest: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`,
    legacy: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${id}.ogg`
  },
  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: 'hp',
        url: 'https://pokeapi.co/api/v2/stat/1/'
      }
    },
    {
      base_stat: 49,
      effort: 0,
      stat: {
        name: 'attack',
        url: 'https://pokeapi.co/api/v2/stat/2/'
      }
    },
    {
      base_stat: 49,
      effort: 0,
      stat: {
        name: 'defense',
        url: 'https://pokeapi.co/api/v2/stat/3/'
      }
    },
    {
      base_stat: 65,
      effort: 1,
      stat: {
        name: 'special-attack',
        url: 'https://pokeapi.co/api/v2/stat/4/'
      }
    },
    {
      base_stat: 65,
      effort: 0,
      stat: {
        name: 'special-defense',
        url: 'https://pokeapi.co/api/v2/stat/5/'
      }
    },
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: 'speed',
        url: 'https://pokeapi.co/api/v2/stat/6/'
      }
    }
  ].map(stat => ({
    ...stat,
    stat: {
      ...stat.stat,
      names: [
        {
          name: stat.stat.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          language: {
            name: 'en',
            url: 'https://pokeapi.co/api/v2/language/9/'
          }
        }
      ]
    }
  })),
  types: [
    {
      slot: 1,
      type: {
        name: 'grass',
        url: 'https://pokeapi.co/api/v2/type/12/'
      }
    },
    {
      slot: 2,
      type: {
        name: 'poison',
        url: 'https://pokeapi.co/api/v2/type/4/'
      }
    }
  ],
  past_types: []
});

export const handlePokemonDetail = (url: URL) => {
  const id = url.pathname.match(/(\d+)\/?$/)?.[1];
  if (!id) {
    return {
      status: 400,
      body: JSON.stringify({ error: 'Invalid Pokemon ID' })
    };
  }

  const pokemon = createMockPokemonDetail(parseInt(id, 10));
  
  return {
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(pokemon)
  };
};
