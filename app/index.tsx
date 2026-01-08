import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../components/ui/themes/colors";
import { useAuthStore } from "../store/store"; // Ajustez le chemin selon votre projet

export default function App() {
  const router = useRouter();
  const { token, loadToken, isLoading } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (token) {
          router.replace("/connected");
        } else {
          router.replace("/onboarding");
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, token, router]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} style="light" />
      <Image
        source={require("../assets/images/splash-logo.png")}
        style={styles.splashLogo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: {
    width: 100,
    height: 200,
  },
});
