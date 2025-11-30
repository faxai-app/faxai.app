import { colors } from "@/components/ui/themes/colors";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function index() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} style="light" />
      <Text style={styles.text}>Onboarding</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#fff",
  },
});
