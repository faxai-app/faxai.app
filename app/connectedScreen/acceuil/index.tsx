import { SearchBar } from "@/components/SearchBar";
import { Bell, Menu } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Acceuil() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.menuContainer}>
          <View style={styles.iconContainer}>
            <Menu color="#fff" />
          </View>
          <View style={styles.iconContainer}>
            <Bell color="#fff" />
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.texte1}>
          Faite une recherche pour trouver le Fax
        </Text>
        <SearchBar />
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
    paddingHorizontal: 30,
  },
  menuContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: "100%",
  },
  iconContainer: {
    backgroundColor: "rgba(255, 255, 255, .2)",
    padding: 5,
    borderRadius: "100%",
  },
  texte1: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    width: "75%",
    fontWeight: "600",
    alignSelf: "center",
  },
});
