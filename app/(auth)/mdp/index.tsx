import { AppButton } from "@/components";
import { colors } from "@/components/ui/themes/colors";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MotDePasseOublie() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent />

      {/* BOUTON RETOUR INTELLIGENT – marche partout, sans erreur */}
      <View style={styles.backBoutton}>
        <TouchableOpacity
          onPress={() => {
            router.canGoBack() ? router.back() : router.push("/auth/connexion");
          }}
        >
          <ArrowLeft color="#fff" size={25} />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.pageTitle}>MOT DE PASSE OUBLIÉ</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.headSection}>
          <Text style={styles.labelText}>
            Entrez votre adresse mail et nous vous enverrons un code de récupération
          </Text>
        </View>

        <View style={styles.emailSection}>
          <View style={styles.emailIcon}>
            <Text style={styles.atSymbol}>@</Text>
          </View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            keyboardType="email-address"
            placeholderTextColor="#fff"
            autoCapitalize="none"
          />
        </View>

        <AppButton
          label="ENVOYER"
          onPress={() => {
            if (!email || !email.includes("@")) {
              alert("Veuillez entrer un email valide");
              return;
            }
            router.replace("/auth/otp");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#000",
  },
  backBoutton: { width: "100%", marginBottom: 20 },
  pageTitle: { fontSize: 22, fontWeight: "900", color: "#fff", textAlign: "center" },
  section: { padding: 10, marginTop: 30, width: "100%" },
  headSection: { marginBottom: 30 },
  labelText: { fontSize: 16, fontWeight: "400", color: "#fff", textAlign: "left", lineHeight: 24 },
  emailSection: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    gap: 5,
    marginBottom: 20,
  },
  emailIcon: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  atSymbol: { color: "#fff", fontSize: 28, transform: [{ translateY: -3 }] },
  input: { color: "#fff", fontSize: 18, flex: 1, paddingLeft: 10 },
});