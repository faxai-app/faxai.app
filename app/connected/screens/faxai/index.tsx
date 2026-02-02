import { homeApi } from "@/api/home";
import { colors } from "@/components/ui/themes/colors";
import { Post } from "@/types";
import { useRouter } from "expo-router";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  Search,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal, // ← AJOUTÉ
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window"); // ← Ajout de height
const API_URL = "http://192.168.8.100:5000"; // ← Suppression de l'espace à la fin

interface ExamFile {
  id: number;
  fileName: string;
  fileType: string;
  url: string;
}

interface ExamPost extends Post {
  year: number;
}

export default function Faxai() {
  const router = useRouter();
  const [exams, setExams] = useState<ExamPost[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "sn1" | "sn2" | "rattrapage"
  >("all");

  // ← AJOUTÉ : State pour l'image sélectionnée
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadExams = async () => {
    try {
      setLoading(true);
      const allPosts = await homeApi.getFeed(1, 100);

      const examsOnly = allPosts.filter(
        (post) => post.type !== null,
      ) as ExamPost[];

      examsOnly.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setExams(examsOnly);
      setFilteredExams(examsOnly);
    } catch (error) {
      console.error("Erreur chargement:", error);
      Alert.alert("Erreur", "Impossible de charger les sujets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    let filtered = exams;

    if (searchQuery) {
      filtered = filtered.filter(
        (exam) =>
          exam.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exam.level.filiere
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          exam.attachmentsMetadata.some((att) =>
            att.fileName.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (exam) =>
          exam.content?.toLowerCase().includes(selectedFilter) ||
          exam.attachmentsMetadata.some((att) =>
            att.fileName.toLowerCase().includes(selectedFilter),
          ),
      );
    }

    setFilteredExams(filtered);
  }, [searchQuery, selectedFilter, exams]);

  const openPdf = async (file: ExamFile) => {
    try {
      const fileUrl = `${API_URL}/${file.url}`;
      const supported = await Linking.canOpenURL(fileUrl);

      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert("Erreur", "Impossible d'ouvrir ce fichier");
      }
    } catch (error) {
      console.error("Erreur ouverture:", error);
      Alert.alert("Erreur", "Problème lors de l'ouverture du PDF");
    }
  };

  const renderExamItem = ({ item }: { item: ExamPost }) => {
    const pdfFiles = item.attachmentsMetadata.filter(
      (att) => att.fileType === "application/pdf",
    );
    const imageFiles = item.attachmentsMetadata.filter((att) =>
      att.fileType?.startsWith("image/"),
    );

    return (
      <View style={styles.examCard}>
        <View style={styles.examHeader}>
          <View style={styles.examBadge}>
            <FileText color={colors.primary} size={20} />
            <Text style={styles.examBadgeText}>ANCIEN SUJET</Text>
          </View>
          <Text style={styles.examYear}>
            {new Date(item.createdAt).getFullYear()}
          </Text>
        </View>
        <Text style={styles.examTitle}>{item.content || "Sujet d'examen"}</Text>
        <View style={styles.examMeta}>
          <View style={styles.metaItem}>
            <BookOpen size={14} color="#666" />
            <Text style={styles.metaText}>{item.level.filiere}</Text>
          </View>
          <View style={styles.metaItem}>
            <Calendar size={14} color="#666" />
            <Text style={styles.metaText}>Session {item.level.niveau}</Text>
          </View>
        </View>

        {/* Liste des fichiers PDF */}
        {pdfFiles.length > 0 && (
          <View style={styles.filesContainer}>
            <Text style={styles.filesTitle}>
              Documents PDF ({pdfFiles.length})
            </Text>
            {pdfFiles.map((file) => {
              const examFile: ExamFile = {
                id: file.id,
                fileName: file.fileName,
                fileType: file.fileType ?? "",
                url: `uploads/${file.fileName}`,
              };
              return (
                <TouchableOpacity
                  key={file.id}
                  style={styles.fileButton}
                  onPress={() => openPdf(examFile)}
                  activeOpacity={0.8}
                >
                  <FileText color={colors.primary} size={28} />
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={2}>
                      {file.fileName}
                    </Text>
                    <Text style={styles.fileHint}>
                      Appuyez pour ouvrir dans le lecteur PDF
                    </Text>
                  </View>
                  <ExternalLink color="#666" size={20} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Images preview - MODIFIÉ pour être cliquable */}
        {imageFiles.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagePreview}
          >
            {imageFiles.map((img) => {
              const imageUrl = item.images.find((i) => i.id === img.id)?.url;
              return imageUrl ? (
                <TouchableOpacity
                  key={img.id}
                  onPress={() => setSelectedImage(imageUrl)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : null;
            })}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Banque d&apos;Épreuves</Text>
        <Text style={styles.headerSubtitle}>
          Consultez les anciens sujets d&apos;examen
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color={colors.primary} size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une matière, année..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <X color="#666" size={20} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {[
          { key: "all", label: "Tous les sujets" },
          { key: "sn1", label: "Session Normale 1" },
          { key: "sn2", label: "Session Normale 2" },
          { key: "rattrapage", label: "Rattrapage" },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.key as any)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement des sujets...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExams}
          renderItem={renderExamItem}
          keyExtractor={(item) => `exam-${item.id}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadExams}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FileText size={64} color="#333" />
              <Text style={styles.emptyTitle}>Aucun sujet trouvé</Text>
              <Text style={styles.emptyText}>
                Les anciens sujets d&apos;examen apparaîtront ici.
              </Text>
            </View>
          }
        />
      )}

      {/* MODAL POUR AFFICHAGE PLEIN ÉCRAN - AJOUTÉ */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedImage(null)}
          >
            <X color="#fff" size={28} />
          </TouchableOpacity>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },
  headerSubtitle: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "#222",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  filtersContainer: {
    maxHeight: 50,
    marginBottom: 10,
    paddingLeft: 20,
  },
  filterChip: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 13,
  },
  filterTextActive: {
    color: "#000",
    fontWeight: "700",
  },
  listContent: {
    padding: 20,
  },
  examCard: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  examHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  examBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  examBadgeText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 11,
  },
  examYear: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    opacity: 0.8,
  },
  examTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    lineHeight: 26,
  },
  examMeta: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    color: "#666",
    fontSize: 13,
  },
  filesContainer: {
    marginTop: 5,
  },
  filesTitle: {
    color: "#666",
    fontSize: 12,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  fileName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  fileHint: {
    color: "#666",
    fontSize: 12,
  },
  imagePreview: {
    marginTop: 10,
  },
  previewImage: {
    width: 140,
    height: 180,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#222",
  },
  loadingText: {
    color: "#666",
    marginTop: 15,
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  // ← AJOUTÉ : Styles pour le modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullScreenImage: {
    width: width,
    height: height * 0.8,
  },
});
