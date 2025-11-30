import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../components/ui/themes/colors";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

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
