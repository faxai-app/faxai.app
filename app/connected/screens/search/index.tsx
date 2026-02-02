import { searchApi } from "@/api/search";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { colors } from "@/components/ui/themes/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, FileText } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchResults() {
  const { q } = useLocalSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(q as string);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "posts" | "files">("all");

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const data = await searchApi.globalSearch(searchTerm);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (q) performSearch(q as string);
  }, [q]);

  const handleNewSearch = (newQuery: string) => {
    setQuery(newQuery);
    performSearch(newQuery);
  };

  const renderFileItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.fileCard}>
      <FileText color={colors.primary} size={24} />
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.fileName}
        </Text>
        <Text style={styles.fileMeta}>
          {item.resourceType} • {item.authorName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Recherche...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={28} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSearch={handleNewSearch}
            autoFocus={!q}
          />
        </View>
      </SafeAreaView>

      {/* Filtres */}
      <View style={styles.tabs}>
        {[
          { key: "all", label: `Tout (${results?.total || 0})` },
          { key: "posts", label: `Sujets (${results?.posts?.length || 0})` },
          { key: "files", label: `Fichiers (${results?.files?.length || 0})` },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {results?.total === 0 ? (
          <View style={styles.empty}>
            <Text
              style={styles.emptyText}
            >{`Aucun résultat pour ${query}`}</Text>
            <Text style={styles.emptySub}>
              Essayez avec d&apos;autres termes
            </Text>
          </View>
        ) : (
          <>
            {/* Posts */}
            {(activeTab === "all" || activeTab === "posts") &&
              results?.posts?.length > 0 && (
                <View style={styles.section}>
                  {activeTab === "all" && (
                    <Text style={styles.sectionTitle}>Sujets</Text>
                  )}
                  {results.posts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </View>
              )}

            {/* Fichiers */}
            {(activeTab === "all" || activeTab === "files") &&
              results?.files?.length > 0 && (
                <View style={styles.section}>
                  {activeTab === "all" && (
                    <Text style={styles.sectionTitle}>Fichiers</Text>
                  )}
                  {results.files.map((file: any) => (
                    <View key={file.id}>{renderFileItem({ item: file })}</View>
                  ))}
                </View>
              )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#222",
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: "#666",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 5,
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  fileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  fileName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  fileMeta: {
    color: "#666",
    fontSize: 13,
    marginTop: 3,
  },
  loadingText: {
    color: "#666",
    marginTop: 10,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  emptySub: {
    color: "#666",
    marginTop: 10,
  },
});
