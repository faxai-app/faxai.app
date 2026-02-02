import { homeApi } from "@/api/home";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { colors } from "@/components/ui/themes/colors";
import { useUserStore } from "@/store/store";
import { Post } from "@/types";
import { useRouter } from "expo-router";
import { Bell, Plus } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Acceuil() {
  const router = useRouter();
  const { user } = useUserStore();
  const initiale = user?.nom?.charAt(0).toUpperCase();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (pageNum === 1) {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = await homeApi.getFeed(pageNum, 10);

      if (data.length < 10) setHasMore(false);

      if (isRefresh || pageNum === 1) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }

      setPage(pageNum);
    } catch (error) {
      console.error("Erreur chargement feed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts(1);
  }, []);

  const onRefresh = useCallback(() => {
    setHasMore(true);
    loadPosts(1, true);
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadPosts(page + 1);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((current) =>
      current.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Aucune publication</Text>
        <Text style={styles.emptyText}>
          Soyez le premier à partager une épreuve ou un cours !
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push("/connected/screens/partager")}
        >
          <Text style={styles.emptyButtonText}>Partager</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={styles.iconView}
        >
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.initiale}>{initiale}</Text>
          )}
          <Text style={styles.userFirstName}>{user?.nom?.split(" ")[0]}</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={styles.iconView}
          >
            <Bell color={colors.primary} size={22} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/connected/screens/partager")}
            style={[styles.iconView, styles.addButton]}
          >
            <Plus color="#fff" size={22} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Text style={styles.title}>Fil d&apos;actualité</Text>

      <SearchBar />

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard post={item} onUpdate={handlePostUpdate} />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`} // ← Clé unique garantie
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: 15,
  },
  iconView: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userFirstName: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 16,
  },
  initiale: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: 30,
    height: 30,
    textAlign: "center",
    lineHeight: 30,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  listContent: {
    padding: 15,
    paddingTop: 0,
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
