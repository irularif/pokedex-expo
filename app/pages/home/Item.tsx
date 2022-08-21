import pokemonColors from "@assets/pokemon-colors";
import { PokemonType } from "@favware/graphql-pokemon";
import { useNavigation } from "@react-navigation/native";
import Color from "color";
import { get } from "lodash";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TPokemon } from "types/pokemon";

interface ItemProps {
  item: Partial<TPokemon>;
  index: number;
}

const Item = ({ item, index }: ItemProps) => {
  const { navigate } = useNavigation();
  const [image, setImage] = useState(item.sprite);
  const { width } = Dimensions.get("screen");
  const iw = width / 2 - 24;
  const odd = index % 2 === 0;
  const type: PokemonType["name"] = get(item, "types.0", "normal");

  const open = useCallback(() => {
    navigate("Detail" as never, item as never);
  }, [item]);

  const finalContainerStyle = StyleSheet.flatten([
    styles.container,
    {
      backgroundColor: Color(pokemonColors[type.toLowerCase()])
        .lighten(0.4)
        .toString(),
      width: iw,
      height: iw,
      marginLeft: !!odd ? 16 : 8,
      marginRight: !!odd ? 8 : 16,
    },
  ]);
  const finalImageStyle = StyleSheet.flatten([
    {
      width: iw / 2,
      height: iw / 2,
    },
  ]);
  const finalTitleStyle = StyleSheet.flatten([
    styles.title,
    {
      color: Color(pokemonColors[type.toLowerCase()]).darken(0.6).toString(),
    },
  ]);
  useEffect(() => {
    if (item.sprite !== image) {
      setImage(item.sprite);
    }
  }, [item]);

  return (
    <TouchableOpacity style={finalContainerStyle} onPress={open}>
      <View style={finalImageStyle}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
          onError={(e) => {
            setImage(item.shinySprite);
          }}
          resizeMode="contain"
        />
      </View>
      <Text adjustsFontSizeToFit numberOfLines={1} style={finalTitleStyle}>
        {item.key}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 16,
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});

export default Item;
