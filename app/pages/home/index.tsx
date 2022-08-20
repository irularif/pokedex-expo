import Page from "@app/components/Page";
import TopBar from "@app/components/TopBar";
import colors from "@assets/colors";
import { StyleSheet, Text, View } from "react-native";

const HomePage = () => {
  return (
    <Page>
      <TopBar>
        <View>
          <Text style={styles.title}>Pokédex</Text>
          <Text>
            Search for a Pokémon by name or using its National Pokédex number.
          </Text>
        </View>
      </TopBar>
    </Page>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "600",
    fontSize: 28,
    color: colors.primary,
  },
});

export default HomePage;
