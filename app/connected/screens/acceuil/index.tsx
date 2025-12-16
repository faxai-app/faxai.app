import { SearchBar } from "@/components/SearchBar";
import { Bell, Menu } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Acceuil() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.iconView}>
          <Menu color="#fff" />
        </View>
        <View style={styles.iconView}>
          <Bell color="#fff" />
        </View>
      </SafeAreaView>
      <Text style={styles.title}>
        Faites une recherche et trouver des anciens sujets avec correction
      </Text>
      <SearchBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    width: "90%",
    alignSelf: "center",
  },
  iconView: {
    backgroundColor: "rgba(0, 0, 0, .6)",
    padding: 10,
    borderRadius: "100%",
  },
});
