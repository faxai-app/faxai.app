import { homeApi } from "@/api/home";
import { PostCard } from "@/components/PostCard";
import { colors } from "@/components/ui/themes/colors";
import { Post } from "@/types";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, BookmarkX } from "lucide-react-native";
import React, { useCallback, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Archives() {
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadBookmarks = async () => {
    try {
      const data = await homeApi.getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Recharger quand on revient sur la page
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadBookmarks();
  };

  const handleUpdatePost = (updatedPost: Post) => {
    // Si unbookmark, retirer de la liste
    if (!updatedPost.isBookmarked) {
      setBookmarks((current) => current.filter((p) => p.id !== updatedPost.id));
    } else {
      setBookmarks((current) =>
        current.map((p) => (p.id === updatedPost.id ? updatedPost : p)),
      );
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <BookmarkX size={64} color="#333" />
      <Text style={styles.emptyTitle}>Aucune archive</Text>
      <Text style={styles.emptyText}>
        Sauvegardez des publications pour les retrouver ici
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>ARCHIVES</Text>
        <View style={{ width: 28 }} />
      </SafeAreaView>

      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <PostCard post={item} onUpdate={handleUpdatePost} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  title: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },
  list: {
    padding: 15,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    gap: 20,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
