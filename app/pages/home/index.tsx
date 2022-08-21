import Page from "@app/components/Page";
import { merge } from "@app/helpers";
import getQueryPokemon from "@app/helpers/query";
import useFetch from "@app/hooks/fetch/useFetch";
import { FlashList } from "@shopify/flash-list";
import { get } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { TPokemon } from "types/pokemon";
import Header from "./Header";
import Item from "./Item";

const HomePage = () => {
  const listRef = useRef<FlashList<TPokemon> | null>(null);
  const searchState = useState("");
  const [search] = searchState;
  const [paging, setPaging] = useState({
    init: false,
    offset: 0,
    total: 0,
    canNext: true,
  });
  const fetchOptions = useMemo(() => {
    return {
      url: "/",
      method: "POST",
      body: getQueryPokemon("getFuzzyPokemon", {
        take: 50,
        offset: paging.offset,
        pokemon: search.toLowerCase() || '"a"',
      }),
    };
  }, [paging, search]);

  // fetch data from api with custom hook
  const { isLoading, data, fetch } = useFetch<Array<TPokemon>>(
    [],
    fetchOptions
  );

  const init = useCallback(() => {
    fetch((_, res) => {
      const newData = get(res, "data.getFuzzyPokemon", []);
      setPaging((prev) => ({
        ...prev,
        init: true,
        offset: prev.offset + 50,
        total: prev.total + newData.length,
        canNext: newData.length % 50 === 0 || !(newData.length === 0),
      }));
      return newData;
    });
  }, [fetch, paging, isLoading]);

  const loadMore = useCallback(() => {
    if (isLoading) return;
    fetch((oldData: any, res: any, error: any) => {
      const newData = get(res, "data.getFuzzyPokemon", []);
      setPaging((prev) => ({
        ...prev,
        offset: prev.offset + 50,
        total: prev.total + newData.length,
        canNext: newData.length % 50 === 0 || !(newData.length === 0),
      }));
      if (!!error) {
        console.warn(error);
      } else if (!!newData) {
        const ndata = merge(
          oldData,
          Object.values(newData),
          (array: Array<TPokemon>) => {
            const a = array;
            for (let i = 0; i < a.length; ++i) {
              for (let j = i + 1; j < a.length; ++j) {
                if (a[i].key === a[j].key) a.splice(j--, 1);
              }
            }
            return a;
          }
        );
        return ndata;
      }
      return [];
    });
  }, [fetch, isLoading]);

  const dataSource = useMemo(() => {
    let _data = [...data];
    if (!!search) {
      const keyword = search.toLowerCase();
      _data = _data.filter((x) => {
        return (
          x.key?.toLowerCase().includes(keyword) ||
          !!x.types?.filter((y) => y.toLowerCase().includes(keyword)).length
        );
      });
    }
    return _data;
  }, [data]);

  useEffect(() => {
    if (!paging.init) {
      init();
    }
  }, [paging.init]);

  useEffect(() => {
    setPaging({
      init: false,
      offset: 0,
      total: 0,
      canNext: true,
    });
  }, [search]);

  return (
    <Page>
      <Header searchState={searchState} listRef={listRef} />
      <FlashList
        ref={listRef}
        // add refresh control to refresh data from api
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={init} />
        }
        extraData={search}
        renderItem={(item) => <Item {...item} />}
        estimatedItemSize={1000}
        data={dataSource}
        numColumns={2}
        // add load more data when scroll to the bottom of the list
        onEndReachedThreshold={0.1}
        onEndReached={loadMore}
        // add empty view when there is no data
        ListEmptyComponent={
          <>
            {!isLoading && (
              <View style={styles.empty}>
                <Text>No data found.</Text>
              </View>
            )}
          </>
        }
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  empty: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomePage;
