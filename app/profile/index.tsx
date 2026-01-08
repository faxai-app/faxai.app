import { colors } from "@/components/ui/themes/colors";
import { uploadProfilePicture } from "@/services/user.service"; // À créer
import { useAuthStore, useUserStore } from "@/store/store";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  BookOpen,
  Camera,
  Edit3,
  GraduationCap,
  LogOut,
  School,
  User,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user, setUser } = useUserStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const initiale = user?.nom?.charAt(0).toUpperCase() || "?";

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert(
        "Désolé, nous avons besoin des permissions pour accéder à votre galerie !"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setUser({ ...user!, profilePicture: imageUri });
      const formData = new FormData();
      // @ts-ignore
      formData.append("profilePicture", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      const response = await uploadProfilePicture(formData);
      if (response.error) console.log(response.error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("/connected/screens/acceuil");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        {/* Header & Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>{initiale}</Text>
            )}
            <TouchableOpacity style={styles.editBadge} onPress={pickImage}>
              <Camera color="#fff" size={18} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.nom}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informations Académiques</Text>
            <TouchableOpacity
              onPress={() => router.push("/Personalisation")} // Redirection vers ta page existante
              style={styles.editInfoBtn}
            >
              <Edit3 color={colors.primary} size={18} />
              <Text style={styles.editInfoText}>Modifier</Text>
            </TouchableOpacity>
          </View>

          <InfoItem
            icon={<User color={colors.primary} size={20} />}
            label="Nom complet"
            value={user?.nom}
          />
          <InfoItem
            icon={<School color={colors.primary} size={20} />}
            label="Établissement"
            value={user?.ecole}
          />
          <InfoItem
            icon={<BookOpen color={colors.primary} size={20} />}
            label="Filière"
            value={user?.filiere}
          />
          <InfoItem
            icon={<GraduationCap color={colors.primary} size={20} />}
            label="Niveau d'étude"
            value={`Niveau ${user?.niveau}`}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <LogOut color="#ff4444" size={20} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Petit sous-composant pour la clarté
const InfoItem = ({ icon, label, value }: any) => (
  <View style={styles.infoCard}>
    <View style={styles.iconBox}>{icon}</View>
    <View style={styles.infoTextContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
  },
  avatarText: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#fff",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#222",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
  },
  infoSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#888",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  editInfoBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  editInfoText: {
    color: colors.primary,
    marginLeft: 5,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextContent: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    color: "#666",
    fontSize: 12,
  },
  value: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  logoutText: {
    color: "#ff4444",
    fontWeight: "600",
    marginLeft: 10,
  },
});
