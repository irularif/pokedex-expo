import getQueryPokemon from "@app/helpers/query";
import useFetch from "@app/hooks/fetch/useFetch";
import HomePage from "@app/pages/home";
import type { Query } from "@favware/graphql-pokemon";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback, useEffect } from "react";

interface GraphQLPokemonResponse<K extends keyof Omit<Query, "__typename">> {
  data: Record<K, Omit<Query[K], "__typename">>;
}

const Stack = createNativeStackNavigator();

const Pages = () => {
  // fetch data from api with custom hook
  const { isLoading, data, fetch } = useFetch<
    Array<Pick<GraphQLPokemonResponse<"getFuzzyPokemon">, "data">>
  >([], {
    url: "/",
    method: "POST",
    body: getQueryPokemon("getAllPokemon", {
      take: 50,
      offset: 0,
      pokemon: "bulbasaur",
    }),
  });

  const init = useCallback(() => {
    fetch((_, res) => res.data);
  }, [fetch]);

  useEffect(() => {
    init();
  }, []);

  console.log("asda", data);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default Pages;
