import { colors } from "@/components/ui/themes/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Menu, MessageCircle, Users } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Faxai() {
  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.primary, colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.header}>
        <Menu color="#fff" />
        <View style={styles.labelContent}>
          <View style={styles.labelItem}>
            <MessageCircle color="#fff" strokeWidth={4} size={15} />
            <Text style={styles.text}>Conversation</Text>
          </View>
          <View style={styles.labelItem}>
            <Users color="#fff" strokeWidth={4} size={15} />
            <Text style={styles.text}>Communauté</Text>
          </View>
        </View>
      </SafeAreaView>
      <Image style={styles.logo} source={require("@/assets/images/logo.png")} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 14,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 23,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  labelContent: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  labelItem: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    backgroundColor: colors.background,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  logo: {
    position: "fixed",
    top: "20%",
    alignSelf: "center",
    width: 200,
    height: 178,
    opacity: 0.1,
  },
});
