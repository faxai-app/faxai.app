import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { colors } from "./ui/themes/colors";

const SearchBar = () => {
  return (
    <LinearGradient colors={[colors.primary, "#fff"]} style={styles.container}>
      <View></View>
      <SearchBar></SearchBar>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: 100,
  },
});

export { SearchBar };
