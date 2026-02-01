import { AppButton } from "@/components";
import { colors } from "@/components/ui/themes/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Onboarding() {
  const router = useRouter();

  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.primary, colors.background]}
    >
      <StatusBar style="light" translucent />

      <Image
        style={styles.ovaleOrange}
        source={require("@/assets/images/ovale-orange.png")}
      />
      {/* <Image
        style={styles.radialGradient}
        source={require("@/assets/images/ellipse.png")}
      /> */}

      <View style={styles.section}>
        <View style={styles.logoView}>
          <Image
            style={styles.logo}
            source={require("@/assets/images/logo.png")}
          />
          <Text style={styles.logoText}>FAX AI</Text>
        </View>

        <Text style={styles.PageTitle}>
          Préparer vos Examen avec Zéro stress
        </Text>

        <Text style={styles.descriptionText}>
          Rejoins une communauté où tout le monde partage des anciens sujets
          d&apos;examen pour faire valider tout le monde
        </Text>

        <AppButton
          label="Commencer"
          onPress={() => router.replace("/inscription")}
        />

        <View style={styles.connexionView}>
          <Text style={styles.descriptionText}>Vous avez déjà un compte ?</Text>
          <Pressable onPress={() => router.replace("/connexion")}>
            <Text style={styles.connexion}>Connexion</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.gradientFooter} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    position: "absolute",
    zIndex: 12,
    width: "100%",
    padding: 20,
    bottom: 10,
    display: "flex",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientFooter: {
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: "100%",
  },
  // radialGradient: {
  //   position: "absolute",
  //   zIndex: 5,
  //   top: 10,
  //   width: "100%",
  //   height: "20%",
  // },
  ovaleOrange: {
    position: "absolute",
    zIndex: 4,
    top: -50,
    right: 0,
  },
  descriptionText: {
    fontWeight: "300",
    fontSize: 12,
    color: "#c8c3c3ff",
  },
  connexionView: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  connexion: {
    fontWeight: "500",
    color: colors.primary,
  },
  PageTitle: {
    textAlign: "left",
    width: "100%",
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  logoView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "100%",
  },
  logo: {
    width: 20,
    height: 18,
  },
  logoText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "300",
  },
});
