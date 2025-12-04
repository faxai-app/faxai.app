// app/auth/Personalisation.tsx  (ou ton chemin actuel)

import { AppButton } from "@/components";
import { colors } from "@/components/ui/themes/colors";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Building2,
  GraduationCap,
  School,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Personalisation() {
  const router = useRouter();
  const [nom, setNom] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent />

      {/* Bouton retour */}
      <View style={styles.backBoutton}>
        <TouchableOpacity onPress={() => router.replace("/auth/connexion")}>
          <ArrowLeft color="#fff" size={25} />
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>PERSONALISATION</Text>
      <Text style={styles.subtitle}>Dites nous en plus sur vous</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.section}>
          {/* 1. NOM → TextInput */}
          <View style={styles.inputWrapper}>
            <View style={styles.iconCircle}>
              <User color="#fff" size={22} />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Nom"
              placeholderTextColor="#ffffff88"
              value={nom}
              onChangeText={setNom}
              autoCapitalize="words"
            />
          </View>

          {/* Les autres champs (cliquables → futurs modals) */}
          <TouchableOpacity style={styles.inputWrapper}>
            <View style={styles.iconCircle}>
              <School color="#fff" size={22} />
            </View>
            <Text style={styles.inputText}>École/Université</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputWrapper}>
            <View style={styles.iconCircle}>
              <Building2 color="#fff" size={22} />
            </View>
            <Text style={styles.inputText}>Faculté</Text  >
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputWrapper}>
            <View style={styles.iconCircle}>
              <BookOpen color="#fff" size={22} />
            </View>
            <Text style={styles.inputText}>Filière</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputWrapper}>
            <View style={styles.iconCircle}>
              <GraduationCap color="#fff" size={22} />
            </View>
            <Text style={styles.inputText}>Niveau</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputWrapper}>
            <View style={styles.iconCircle}>
              <Briefcase color="#fff" size={22} />
            </View>
            <Text style={styles.inputText}>Spécialisation</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AppButton
        label="CONTINUER"
        onPress={() => {
          if (nom.trim() === "") {
            alert("Veuillez entrer votre nom");
            return;
          }
          router.replace("/(tabs)/home");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  backBoutton: {
    width: "100%",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffffaa",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 30,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 18,
    height: 56,
  },
  iconCircle: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 17,
    marginLeft: 12,
  },
  inputText: {
    flex: 1,
    color: "#fff",
    fontSize: 17,
    marginLeft: 12,
  },
  chevron: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: "200",
    marginRight: 8,
  },
});