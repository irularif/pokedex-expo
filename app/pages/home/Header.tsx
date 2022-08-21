import TopBar from "@app/components/TopBar";
import colors from "@assets/colors";
import { FlashList } from "@shopify/flash-list";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TPokemon } from "types/pokemon";

interface HeaderProps {
  searchState: [string, React.Dispatch<React.SetStateAction<string>>];
  listRef: React.MutableRefObject<FlashList<TPokemon> | null>;
}

const Header = ({ searchState }: HeaderProps) => {
  const [_, setSearch] = searchState;
  const [keyword, setKeyword] = useState("");

  const onSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    []
  );

  const onChange = useCallback((value: string) => {
    setKeyword(value);
    onSearch(value);
  }, []);

  return (
    <>
      <TopBar>
        <View style={styles.container}>
          <Text style={styles.title}>Pokédex</Text>
          <Text>
            Search for a Pokémon by name or using its National Pokédex number.
          </Text>
          <TextInput
            value={keyword}
            onChangeText={onChange}
            style={styles.input}
            placeholder="Search Pokémon Name or Type"
          />
        </View>
      </TopBar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 28,
    color: colors.primary,
  },
  input: {
    marginTop: 16,
    backgroundColor: colors.white,
    flexGrow: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
});

export default Header;
