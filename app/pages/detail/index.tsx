import Page from "@app/components/Page";
import TopBar from "@app/components/TopBar";
import getQueryPokemon from "@app/helpers/query";
import useFetch from "@app/hooks/fetch/useFetch";
import colors from "@assets/colors";
import pokemonColors from "@assets/pokemon-colors";
import IonIcons from "@expo/vector-icons/Ionicons";
import { PokemonType } from "@favware/graphql-pokemon";
import { useNavigation, useRoute } from "@react-navigation/native";
import Color from "color";
import { get } from "lodash";
import { useEffect, useMemo } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import * as Progress from "react-native-progress";
import { TPokemon, TPokemonAbility } from "types/pokemon";

const DetailPage = () => {
  const { width } = Dimensions.get("screen");
  const { goBack } = useNavigation();
  const route = useRoute();
  const data: TPokemon = useMemo(() => {
    return route.params || {};
  }, [route]);
  const type: PokemonType["name"] = get(data, "types.0", "normal");
  const iw = width * (2 / 5);
  const fetchOptions = useMemo(() => {
    let ability: any = get(data, "abilities.first", "")
      .toLowerCase()
      .replace(/\s/g, "");
    if (!ability) {
      return {
        url: "/",
      };
    }
    return {
      url: "/",
      method: "POST",
      body: getQueryPokemon("getAbility", {
        ability: ability,
      }),
    };
  }, [data]);
  // fetch data from api with custom hook
  const {
    isLoading,
    data: ability,
    fetch,
  } = useFetch<TPokemonAbility>({}, fetchOptions);

  useEffect(() => {
    if (!isLoading) {
      fetch((_, res) => {
        return get(res, "data.getAbility", {});
      });
    }
  }, [data]);

  const customData = useMemo(() => {
    return {
      height: get(data, "height", 0) * 10 + " cm",
      weight: Number(get(data, "weight", 0) / 10).toFixed(2) + " kg",
      baseStats: get(data, "baseStats", {}),
    };
  }, [data]);

  const color = pokemonColors[type.toLowerCase()];
  const finalBGStyle = StyleSheet.flatten([
    styles.bg,
    {
      backgroundColor: Color(color).lighten(0.4).toString(),
      width: width,
      height: width * (3 / 4),
    },
  ]);
  const finalTitleStyle = StyleSheet.flatten([styles.title]);
  const finalImageStyle = StyleSheet.flatten([
    {
      width: iw,
      height: iw,
    },
  ]);

  return (
    <Page>
      <View style={finalBGStyle} />
      <TopBar>
        <TouchableOpacity onPress={goBack}>
          <IonIcons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={finalTitleStyle}>{data.key}</Text>
      </TopBar>
      <View style={styles.sectionA}>
        <View style={styles.containerType}>
          {data.types?.map((type) => {
            const finalTypeStyle = StyleSheet.flatten([
              styles.type,
              {
                backgroundColor: Color(pokemonColors[type.toLowerCase()])
                  .lighten(0.45)
                  .toString(),
                color: Color(pokemonColors[type.toLowerCase()])
                  .darken(0.6)
                  .toString(),
                borderColor: pokemonColors[type.toLowerCase()],
              },
            ]);

            return <Text style={finalTypeStyle}>{type}</Text>;
          })}
        </View>
      </View>
      <View style={styles.container}>
        <View style={finalImageStyle}>
          <Image
            source={{
              uri: data.sprite,
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={finalImageStyle}>
          <Image
            source={{
              uri: data.shinySprite,
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        <View style={styles.sectionA}>
          <View style={styles.saFrame}>
            <View style={styles.saFrameItem}>
              <Text style={styles.saFrameItemTitle}>Height</Text>
              <Text style={styles.saFrameItemValue}>{customData.height}</Text>
            </View>
            <View style={styles.saFrameItem}>
              <Text style={styles.saFrameItemTitle}>Weight</Text>
              <Text style={styles.saFrameItemValue}>{customData.weight}</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionA}>
          <Text style={styles.title}>{ability.name}</Text>
          <Text>{ability.desc}</Text>
        </View>
        <View style={styles.sectionA}>
          {Object.keys(customData.baseStats).map((stat: any, key: number) => {
            const value = (customData.baseStats as any)[stat];
            const progress = value / 100;

            return (
              <View key={key} style={styles.saFrame}>
                <Text style={styles.saFrameItemTitle}>{stat}</Text>
                <Text style={styles.saFrameItemValue}>{value}</Text>
                <Progress.Bar
                  progress={progress}
                  width={150}
                  color={
                    progress > 0.7
                      ? colors.success
                      : progress > 0.4
                      ? colors.warning
                      : colors.danger
                  }
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Page>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
    flexDirection: "row",
  },
  containerType: {
    flexDirection: "row",
    marginHorizontal: 4,
  },
  type: {
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
    fontWeight: "600",
    borderWidth: 1,
  },
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomRightRadius: 9999,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  sectionA: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saFrame: {
    flexDirection: "row",
    padding: 15,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
    backgroundColor: colors.white,
  },
  saFrameItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  saFrameItemTitle: {
    color: colors.gray,
    flex: 1,
    textTransform: "capitalize",
  },
  saFrameItemValue: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 8,
  },
});

export default DetailPage;
