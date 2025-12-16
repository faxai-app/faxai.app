import { Navbar } from "@/components/navbar";
import { colors } from "@/components/ui/themes/colors";
import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConnectedLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>

      <SafeAreaView style={styles.navbar}>
        <Navbar />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
