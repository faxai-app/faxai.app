import { AppButton } from "@/components";
import { colors } from "@/components/ui/themes/colors";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ValidationOTP() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = Array.from({ length: 6 }, () => useRef<TextInput>(null));

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs[index + 1].current?.focus();
  };

  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    if (nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const isComplete = code.every(digit => digit !== "");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent />

      {/* Bouton retour → revient sur Mot de passe oublié */}
      <View style={styles.backBoutton}>
        <TouchableOpacity onPress={() => router.push("/auth/mdp")}>
          <ArrowLeft color="#fff" size={25} />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.pageTitle}>VALIDATION{'\n'}OTP</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Vérifier votre boîte mail</Text>
        <Text style={styles.instruction}>Entrer le code OTP reçu ici</Text>

        <View style={styles.otpContainer}>
          {code.map((digit, i) => (
            <View
              key={i}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : styles.otpBoxEmpty]}
            >
              <Text style={styles.otpText}>{digit}</Text>
            </View>
          ))}
        </View>

        {/* Inputs cachés */}
        <View style={{ position: "absolute", top: -9999 }}>
          {code.map((_, i) => (
            <TextInput
              key={i}
              ref={inputRefs[i]}
              keyboardType="number-pad"
              maxLength={1}
              value={code[i]}
              onChangeText={(v) => handleChange(v, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              autoFocus={i === 0}
              style={{ width: 1, height: 1 }}
            />
          ))}
        </View>

        <AppButton
          label={isComplete ? "VÉRIFIER" : "AUCUN CODE REÇU"}
          onPress={() => isComplete && router.replace("/")}
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
    padding: 20,
    backgroundColor: "#000",
  },
  backBoutton: {
    width: "100%",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    lineHeight: 36,
  },
  section: {
    width: "100%",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffffaa",
    textAlign: "center",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    color: "#ffffff88",
    textAlign: "center",
    marginBottom: 50,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 80,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  otpBoxEmpty: {
    backgroundColor: "#333",
  },
  otpBoxFilled: {
    backgroundColor: colors.primary,
  },
  otpText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
});