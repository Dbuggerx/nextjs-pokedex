import { Pokemon } from "@/lib/types";
import { PokemonImage } from "@/components/pokemon-image";
import { PokemonStats } from "@/components/pokemon-stats";
import { getTypeColor } from "@/lib/pokemon-utils";
import {
  formatPokemonId,
  formatWeight,
  formatHeight,
} from "@/lib/pokemon-utils";
import { Weight, Ruler, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PokemonDetailsProps = {
  pokemon: Pokemon;
  genus: string;
  description: string;
};

type PokemonAbility = {
  ability: {
    name: string;
  };
  is_hidden: boolean;
};

export function PokemonDetails({
  pokemon,
  genus,
  description,
}: PokemonDetailsProps) {
  return (
    <>
      {/* Main Pokemon Card */}
      <Card className="relative overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-lg mb-8 p-6">
        <CardHeader className="relative">
          <div>
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
              {formatPokemonId(pokemon.id)}
            </p>
            <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
              {pokemon.name}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">{genus}</p>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <PokemonImage pokemon={pokemon} size={256} priority />
            </div>

            {/* Basic Info */}
            <div className="space-y-6">
              {/* Types */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Types
                </h3>
                <div className="flex gap-2">
                  <ul className="flex flex-wrap justify-center gap-2">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type.type.name}
                        className={`bg-gradient-to-r ${getTypeColor(
                          type.type.name
                        )} text-white border-0 px-4 py-2 text-sm capitalize`}
                        asChild
                      >
                        <li>{type.type.name}</li>
                      </Badge>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Physical Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Weight className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Weight
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatWeight(pokemon.weight)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Ruler className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Height
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatHeight(pokemon.height)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="abilities">Abilities</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-6">
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-lg p-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Base Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PokemonStats pokemon={pokemon} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abilities" className="mt-6">
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-lg p-6">
            <CardHeader>
              <CardTitle>Abilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pokemon.abilities?.map(
                  (ability: PokemonAbility, index: number) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {ability.ability.name}
                        {ability.is_hidden && " (Hidden)"}:
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {ability.ability.name}
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
