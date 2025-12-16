import { colors } from "@/components/ui/themes/colors";
import { File, Plus, UserRound, Verified } from "lucide-react-native";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Partager() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View>
          <Plus color="#fff" />
        </View>
        <View style={styles.textContain}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.text}>Brouillon</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Text style={[styles.text, styles.partager]}>Partager</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.inputHeader}>
        <View style={styles.user}>
          <UserRound color="#fff" size={32} />
          <Verified
            style={{ position: "absolute", bottom: -3, right: -3 }}
            color="#00ff40ff"
            fill={colors.primary}
            strokeWidth={3}
            size={18}
          />
        </View>

        <View style={styles.iconContainer}>
          <Image
            style={styles.logo}
            source={require("@/assets/images/logo.png")}
          />
          <File strokeWidth={1.2} color="#fff" />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          placeholder="Dites ce que vous voulez..."
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 18,
  },
  textContain: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  text: {
    fontSize: 14,
    color: "#fff",
  },
  partager: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inputHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  user: {
    backgroundColor: "#dfe8e9ff",
    borderColor: colors.primary,
    borderWidth: 2,
    height: 40,
    width: 40,
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 22,
    height: 20,
  },
  iconContainer: {
    borderColor: colors.primary,
    borderRadius: 100,
    borderWidth: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    paddingHorizontal: 10,
  },
  inputText: {
    width: "100%",
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, .1)",
    marginTop: 10,
    borderRadius: 10,
    height: 150,
    padding: 10,
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    paddingHorizontal: 20,
  },
});
