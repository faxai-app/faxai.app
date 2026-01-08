import { AppButton } from "@/components";
import { colors } from "@/components/ui/themes/colors";
import { ECOLES, FILIERES_DATA } from "@/constantes/constantes";
import { completeProfile } from "@/services/auth.service";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, BookOpen, School, User } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
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

  // Form State
  const [nom, setNom] = useState("");
  const [ecole, setEcole] = useState("");
  const [niveau, setNiveau] = useState<number | null>(null);
  const [filiere, setFiliere] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ecoleRef = useRef<TextInput>(null);

  const [showEcoleList, setShowEcoleList] = useState(false);
  const [showFiliereList, setShowFiliereList] = useState(false);

  const filteredFilieres = useMemo(() => {
    if (!niveau) return [];
    return FILIERES_DATA.filter((f) => f.levels.includes(niveau)).filter((f) =>
      f.label.toLowerCase().includes(filiere.toLowerCase())
    );
  }, [niveau, filiere]);

  const filteredEcoles = ECOLES.filter((e) =>
    e.toLowerCase().includes(ecole.toLowerCase())
  );

  const handleComplete = async () => {
    if (!nom || !ecole || !niveau || !filiere) {
      alert("Veuillez remplir les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await completeProfile({
        nom,
        ecole,
        filiere,
        niveau,
        specialisation: undefined,
      });

      if (result.error) {
        alert(result.error);
      } else {
        console.log("Profil mis à jour !");
        router.replace("/connected");
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur réseau est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent />

      <View style={styles.backBoutton}>
        <TouchableOpacity onPress={() => router.replace("/connexion")}>
          <ArrowLeft color="#fff" size={25} />
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>PERSONNALISATION</Text>
      <Text style={styles.subtitle}>Complétez votre profil académique</Text>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View style={styles.section}>
          {/* NOM */}
          <View style={styles.inputWrapper}>
            <View style={styles.iconCircle}>
              <User color="#fff" size={22} />
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Nom complet"
              placeholderTextColor="#ffffff88"
              value={nom}
              onChangeText={setNom}
              returnKeyType="next"
              onSubmitEditing={() => ecoleRef.current?.focus()}
            />
          </View>

          <View style={{ zIndex: 2000 }}>
            <View style={styles.inputWrapper}>
              <View style={styles.iconCircle}>
                <School color="#fff" size={22} />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="École / Université"
                placeholderTextColor="#ffffff88"
                ref={ecoleRef}
                value={ecole}
                onChangeText={(t) => {
                  setEcole(t);
                  setShowEcoleList(true);
                }}
                onFocus={() => setShowEcoleList(true)}
              />
            </View>
            {showEcoleList && ecole.length > 0 && (
              <View style={styles.suggestionBox}>
                {filteredEcoles.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setEcole(item);
                      setShowEcoleList(false);
                    }}
                  >
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.labelSection}>Niveau d&apos;étude</Text>
          <View style={styles.levelContainer}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.levelCircle,
                  niveau === n && styles.levelCircleActive,
                ]}
                onPress={() => {
                  setNiveau(n);
                  setFiliere("");
                }}
              >
                <Text style={styles.levelText}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {niveau && (
            <View style={{ zIndex: 1000, marginTop: 10 }}>
              <View style={styles.inputWrapper}>
                <View style={styles.iconCircle}>
                  <BookOpen color="#fff" size={22} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Rechercher ma filière..."
                  placeholderTextColor="#ffffff88"
                  value={filiere}
                  onChangeText={(t) => {
                    setFiliere(t);
                    setShowFiliereList(true);
                  }}
                  onFocus={() => setShowFiliereList(true)}
                />
              </View>
              {showFiliereList && (
                <View style={styles.suggestionBox}>
                  {filteredFilieres.length > 0 ? (
                    filteredFilieres.map((item) => (
                      <TouchableOpacity
                        key={item.label}
                        style={styles.suggestionItem}
                        onPress={() => {
                          setFiliere(item.label);
                          setShowFiliereList(false);
                        }}
                      >
                        <Text style={styles.suggestionText}>{item.label}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.noResult}>
                      Aucune filière pour ce niveau
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <AppButton label="TERMINER" onPress={handleComplete} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  backBoutton: { width: "100%", marginBottom: 10 },
  pageTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#ffffffaa",
    textAlign: "center",
    marginBottom: 20,
  },
  section: { width: "100%" },
  labelSection: {
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 30,
    paddingHorizontal: 6,
    marginBottom: 15,
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
  textInput: { flex: 1, color: "#fff", fontSize: 16, marginLeft: 12 },
  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  levelCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  levelCircleActive: { backgroundColor: colors.primary },
  levelText: { color: "#fff", fontWeight: "bold" },
  suggestionBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    marginTop: -10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
    maxHeight: 200,
    overflow: "hidden",
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  suggestionText: { color: "#fff", fontSize: 14 },
  noResult: { color: "#777", padding: 15, textAlign: "center" },
});
