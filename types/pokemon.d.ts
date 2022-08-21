import { Ability, Pokemon, PokemonType } from "@favware/graphql-pokemon";

export type TPokemon = Partial<Omit<Pokemon, "types">> & {
  types?: Array<PokemonType["name"]>;
};

export type TPokemonAbility = Partial<Ability>;