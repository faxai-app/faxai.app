import { colors } from "@/components/ui/themes/colors";
import { Menu, View } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Acceuil() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.menuContainer}>
          <Menu color="#fff" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 10,
  },
  menuContainer: {
    borderRadius: "100%",
    backgroundColor: colors.primary,
    width: 100,
  },
});
