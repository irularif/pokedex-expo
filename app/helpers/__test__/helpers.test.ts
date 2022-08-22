import { merge } from "../merge";
import getQueryPokemon from "../query";
import { getStyleValue } from "../styles";

describe("Helpers", () => {
  it("getQueryPokemon 'getFuzzyPokemon'", () => {
    const query = getQueryPokemon("getFuzzyPokemon", {
      take: 50,
      offset: 0,
      pokemon: '"bulbasaur"',
    });
    expect(query).toContain(
      'getFuzzyPokemon(take: 50, offset: 0, pokemon: \\"bulbasaur\\")'
    );
  });

  it("getQueryPokemon 'getAbility'", () => {
    const query = getQueryPokemon("getAbility", {
      ability: "stench",
    });
    expect(query).toContain("getAbility(ability: stench)");
  });

  it("merge 2 array", () => {
    const array = merge(["a", "b"], ["c", "d"]);
    expect(array).toEqual(["a", "b", "c", "d"]);
  });

  it("get style value", () => {
    const style = {
      padding: 4,
      margin: 8,
      marginVertical: 4,
    };
    const value = getStyleValue(style, ["padding"]);
    expect(value).toBe(4);
    const value2 = getStyleValue(style, ["margin", "marginVertical"]);
    expect(value2).toBe(4);
  });
});
