import { usePathname, useRouter } from "expo-router";
import { Bookmark, Home, Plus } from "lucide-react-native";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./ui/themes/colors";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => pathname.endsWith(route);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.btn, isActive("acceuil") && styles.active]}
          onPress={() => router.replace("/connected/screens/acceuil")}
        >
          <Home color="#fff" strokeWidth={1.4} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, isActive("partager") && styles.active]}
          onPress={() => router.replace("/connected/screens/partager")}
        >
          <Plus color="#fff" strokeWidth={1.4} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, isActive("faxai") && styles.active]}
          onPress={() => router.replace("/connected/screens/faxai")}
        >
          <Image
            style={styles.logoIcon}
            source={require("@/assets/images/logo.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, isActive("archives") && styles.active]}
          onPress={() => router.replace("/connected/screens/archives")}
        >
          <Bookmark color="#fff" strokeWidth={1.4} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "rgba(255, 255, 255, .3)",
    marginHorizontal: 20,
    borderRadius: 100,
  },
  logoIcon: {
    width: 24,
    height: 22,
  },
  btn: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  active: {
    backgroundColor: colors.primary,
  },
});
