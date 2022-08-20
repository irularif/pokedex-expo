import { Pokemon, PokemonType } from "@favware/graphql-pokemon";

export type TPokemons = Partial<Omit<Pokemon, "types">> & {
  types?: Array<PokemonType["name"]>;
};
