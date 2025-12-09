import { Navbar } from "@/components/navbar";
import { colors } from "@/components/ui/themes/colors";
import { useNavStore } from "@/store/store";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Acceuil from "./acceuil";
import Archives from "./archives";
import Faxai from "./faxai";
import Partager from "./partager";

export default function ConnectedLayout() {
  const { currentScreen } = useNavStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case "acceuil":
        return <Acceuil />;
      case "partager":
        return <Partager />;
      case "faxai":
        return <Faxai />;
      case "archives":
        return <Archives />;
      default:
        return <Acceuil />;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.renderScreen}>{renderScreen()}</View>
      <SafeAreaView style={styles.navbar}>
        <Navbar />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: colors.background,
  },
  renderScreen: {
    flex: 1,
  },
  navbar: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
