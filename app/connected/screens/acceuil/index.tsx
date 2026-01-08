import { SearchBar } from "@/components/SearchBar";
import { colors } from "@/components/ui/themes/colors";
import { useAuthStore, useUserStore } from "@/store/store";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Acceuil() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { user } = useUserStore();
  const initiale = user?.nom?.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/profile")}
          style={styles.iconView}
        >
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.initiale}>{initiale}</Text>
          )}

          <Text style={styles.userFirstName}>{user?.nom?.split(" ")[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/notifications")}
          style={styles.iconView}
        >
          <Bell color={colors.primary} />
        </TouchableOpacity>
      </SafeAreaView>
      <Text style={styles.title}>Anciens sujets et correction</Text>
      <SearchBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  userFirstName: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 20,
  },
  initiale: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 20,
    backgroundColor: colors.primary,
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    width: 30,
    height: 30,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 55,
    borderColor: colors.primary,
    borderWidth: 2,
  },
});
