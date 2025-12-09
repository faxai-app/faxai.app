import { useNavStore } from "@/store/store";
import { Bookmark, Home, Plus } from "lucide-react-native";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./ui/themes/colors";

export const Navbar = () => {
  const { setScreen } = useNavStore();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => setScreen("acceuil")}>
        <Home color="#fff" strokeWidth={1.4} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen("partager")}>
        <Plus color="#fff" strokeWidth={1.4} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen("faxai")}>
        <Image
          style={styles.logoIcon}
          source={require("@/assets/images/logo.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setScreen("archives")}>
        <Bookmark color="#fff" strokeWidth={1.4} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
    backgroundColor: colors.primary,
    borderRadius: 30,
  },
  logoIcon: {
    width: 24,
    height: 22,
  },
});
