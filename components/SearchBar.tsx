import { LinearGradient } from "expo-linear-gradient";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "./ui/themes/colors";

const SearchBar = () => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      colors={[colors.primary, "#fff"]}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <Search color={colors.primary} strokeWidth={2} />
        <TextInput style={styles.textInput} placeholder="Rechercher..." />
        <SlidersHorizontal color={colors.primary} strokeWidth={2} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignSelf: "center",
    marginTop: 5,
    padding: 5,
    borderRadius: 200,
    width: "90%",
  },
  inputContainer: {
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    flexDirection: "row",
    borderRadius: 25,
  },
  textInput: {
    width: "80%",
  },
});

export { SearchBar };

