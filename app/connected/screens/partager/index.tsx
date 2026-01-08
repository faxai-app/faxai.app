import { colors } from "@/components/ui/themes/colors";
import { shareResource } from "@/services/user.service";
import { useUserStore } from "@/store/store";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  BookOpen,
  Calendar,
  FileDown,
  FileText,
  Image as ImageIcon,
  Layers,
  UserRound,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ContentType = "post" | "epreuve" | "cours";

export default function Partager() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<ContentType>("post");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]); // Images et PDF
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [details, setDetails] = useState({
    title: "",
    type: "SN1", // SN1, SN2, R1, R2
    professor: "",
    date: new Date(),
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.6,
    });
    if (!result.canceled) {
      const newImgs = result.assets.map((a) => ({
        uri: a.uri,
        name: a.fileName || "image.jpg",
        type: "image/jpeg",
      }));
      setAttachments([...attachments, ...newImgs]);
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (!result.canceled) {
      setAttachments([
        ...attachments,
        {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: "application/pdf",
        },
      ]);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && selectedDate <= new Date()) {
      setDetails({ ...details, date: selectedDate });
    } else if (selectedDate) {
      Alert.alert("Date invalide", "L'année ne peut pas être dans le futur.");
    }
  };

  const handleShare = async () => {
    const res = await shareResource({
      content,
      type: activeTab,
      attachments,
      details:
        activeTab !== "post"
          ? {
              title: details.title,
              type: details.type,
              professor: details.professor,
              year: details.date.getFullYear().toString(),
            }
          : undefined,
    });
    if (res.error) Alert.alert("Erreur", res.error);
    else Alert.alert("Succès", "Publication partagée !");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Statique */}
      <View style={styles.header}>
        <TouchableOpacity>
          <X color="#fff" size={28} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Text style={styles.shareText}>Partager</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Sélecteur de Type (Tabs) */}
        <View style={styles.tabContainer}>
          {(["post", "epreuve", "cours"] as ContentType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Texte Principal */}
        <View style={styles.mainInputBox}>
          <TextInput
            style={styles.mainInput}
            multiline
            placeholder="Exprimez-vous..."
            placeholderTextColor="#555"
            value={content}
            onChangeText={setContent}
          />
          {/* Boutons d'ajouts juste sous le texte */}
          <View style={styles.attachBar}>
            <TouchableOpacity onPress={pickImage} style={styles.attachBtn}>
              <ImageIcon color={colors.primary} size={20} />
              <Text style={styles.attachBtnText}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickDocument} style={styles.attachBtn}>
              <FileDown color={colors.primary} size={20} />
              <Text style={styles.attachBtnText}>PDF / Doc</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Formulaire Conditionnel */}
        {activeTab !== "post" && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Détails du document</Text>

            <View style={styles.inputRow}>
              <BookOpen color={colors.primary} size={20} />
              <TextInput
                placeholder="Nom de la matière"
                placeholderTextColor="#666"
                style={styles.input}
                onChangeText={(v) => setDetails({ ...details, title: v })}
              />
            </View>

            <View style={styles.inputRow}>
              <UserRound color={colors.primary} size={20} />
              <TextInput
                placeholder="Nom de l'enseignant"
                placeholderTextColor="#666"
                style={styles.input}
                onChangeText={(v) => setDetails({ ...details, professor: v })}
              />
            </View>

            <View style={styles.grid}>
              {/* Sélecteur de Type (SN1, SN2, etc) UNIQUEMENT pour épreuve */}
              {activeTab === "epreuve" && (
                <View style={[styles.inputRow, { flex: 1, marginRight: 10 }]}>
                  <Layers color={colors.primary} size={20} />
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {["SN1", "SN2", "R1", "R2"].map((t) => (
                      <TouchableOpacity
                        key={t}
                        onPress={() => setDetails({ ...details, type: t })}
                        style={[
                          styles.miniBadge,
                          details.type === t && styles.activeBadge,
                        ]}
                      >
                        <Text style={styles.badgeText}>{t}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[styles.inputRow, { flex: 0.8 }]}
              >
                <Calendar color={colors.primary} size={20} />
                <Text style={{ color: "#fff", marginLeft: 10 }}>
                  Année : {details.date.getFullYear()}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={details.date}
                mode="date"
                display="calendar"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
        )}

        {/* Prévisualisation des fichiers */}
        <View style={styles.previewContainer}>
          {attachments.map((file, i) => (
            <View key={i} style={styles.fileCard}>
              <FileText color={colors.primary} />
              <Text numberOfLines={1} style={styles.fileName}>
                {file.name}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setAttachments(attachments.filter((_, idx) => idx !== i))
                }
              >
                <X color="red" size={18} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  shareBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareText: { color: "#fff", fontWeight: "bold" },
  scroll: { flex: 1 },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  tab: { marginRight: 20, paddingBottom: 5 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { color: "#666", fontWeight: "bold", fontSize: 13 },
  activeTabText: { color: "#fff" },
  mainInputBox: {
    backgroundColor: "#111",
    marginHorizontal: 15,
    borderRadius: 15,
    padding: 15,
  },
  mainInput: {
    color: "#fff",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  attachBar: {
    flexDirection: "row",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 10,
  },
  attachBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  attachBtnText: { color: "#fff", marginLeft: 8, fontSize: 13 },
  form: { padding: 20 },
  formTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  input: { color: "#fff", marginLeft: 10, flex: 1 },
  grid: { flexDirection: "row" },
  miniBadge: {
    backgroundColor: "#222",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  activeBadge: { backgroundColor: colors.primary },
  badgeText: { color: "#fff", fontSize: 10 },
  previewContainer: { padding: 15 },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  fileName: { color: "#fff", flex: 1, marginLeft: 10, fontSize: 12 },
});