import { useNavStore } from "@/store/store";
import { Bookmark, Home, Plus } from "lucide-react-native";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./ui/themes/colors";

export const Navbar = () => {
  const { setScreen, currentScreen } = useNavStore();

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor:
                currentScreen === "acceuil"
                  ? colors.primary
                  : "rgba(0, 0, 0, .3)",
            },
          ]}
          onPress={() => setScreen("acceuil")}
        >
          <Home color="#fff" strokeWidth={1.4} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor:
                currentScreen === "partager"
                  ? colors.primary
                  : "rgba(0, 0, 0, .3)",
            },
          ]}
          onPress={() => setScreen("partager")}
        >
          <Plus color="#fff" strokeWidth={1.4} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor:
                currentScreen === "faxai"
                  ? colors.primary
                  : "rgba(0, 0, 0, .3)",
            },
          ]}
          onPress={() => setScreen("faxai")}
        >
          <Image
            style={styles.logoIcon}
            source={require("@/assets/images/logo.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor:
                currentScreen === "archives"
                  ? colors.primary
                  : "rgba(0, 0, 0, .3)",
            },
          ]}
          onPress={() => setScreen("archives")}
        >
          <Bookmark color="#fff" strokeWidth={1.4} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: 5,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
    backgroundColor: "rgba(255, 255, 255, .3)",
    marginHorizontal: 20,
    borderRadius: 100,
  },
  logoIcon: {
    width: 24,
    height: 22,
    borderColor: "#000",
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 100,
  },
});
