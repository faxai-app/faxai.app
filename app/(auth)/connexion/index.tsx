import { AppButton } from "@/components";
import { colors } from "@/components/ui/themes/colors";
import { login } from "@/services/auth.service";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Eye } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Connexion() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {
    try {
      login({ email, password });
      console.log("user login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent />
      <View style={styles.backBoutton}>
        <TouchableOpacity onPress={() => router.replace("/onboarding")}>
          <ArrowLeft color="#fff" size={25} />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.pageTitle}>CONNCTEZ VOUS POUR CONTINUER</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.headSection}>
          <Text style={styles.labelText}>Connexion</Text>
          <TouchableOpacity style={styles.googleSection}>
            <Image
              style={styles.googleLogo}
              source={require("@/assets/images/google.png")}
            />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emailSection}>
          <View style={styles.emailIcon}>
            <Text
              style={{
                color: "#fff",
                fontSize: 28,
                transform: [{ translateY: -3 }],
              }}
            >
              @
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            keyboardType="email-address"
            placeholderTextColor="#fff"
          />
        </View>

        <View style={styles.emailSection}>
          <View style={styles.emailIcon}>
            <Eye color="#fff" />
          </View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="mot de passe"
            keyboardType="default"
            secureTextEntry
            placeholderTextColor="#fff"
          />
          <TouchableOpacity
            onPress={() => {
              router.replace("/mdp");
            }}
            style={styles.oublier}
          >
            <Text style={styles.oublierText}>Oublié</Text>
          </TouchableOpacity>
        </View>

        <AppButton label="CONNECTION" onPress={handleSubmit} />
      </View>

      <View style={styles.connexionView}>
        <Text style={styles.descriptionText}>Vous avez déjà un compte ?</Text>
        <Pressable
          onPress={() => {
            router.replace("/connected");
          }}
        >
          <Text style={styles.connexion}>Inscription</Text>
        </Pressable>
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
  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
  },
  backBoutton: {
    width: "100%",
  },
  googleText: {
    fontSize: 18,
    fontWeight: 200,
    color: "#fff",
  },
  labelText: {
    fontSize: 24,
    fontWeight: "300",
    color: "#fff",
  },
  section: {
    padding: 10,
    marginTop: 30,
    width: "100%",
  },
  headSection: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  googleLogo: {
    width: 18,
    height: 18,
  },
  googleSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
  },
  emailSection: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    gap: 5,
    marginBottom: 20,
  },
  input: {
    color: "#fff",
    borderColor: "#fff",
    fontSize: 18,
    flex: 1,
  },
  emailIcon: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
  connexionView: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  descriptionText: {
    fontWeight: "300",
    fontSize: 12,
    color: "#c8c3c3ff",
  },
  connexion: {
    fontWeight: 500,
    color: colors.primary,
  },
  oublier: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: colors.primary,
  },
  oublierText: {
    color: "#fff",
    fontSize: 18,
  },
});
