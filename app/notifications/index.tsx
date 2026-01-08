import { api } from "@/api/axios";
import { colors } from "@/components/ui/themes/colors";
import { useNotificationStore } from "@/store/store";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Info,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const router = useRouter();
  const { notifications, setNotifications } = useNotificationStore();
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(
    async (force = false) => {
      // On récupère les valeurs fraîches du store au moment de l'appel
      const state = useNotificationStore.getState();
      const isCacheOld =
        !state.lastFetched || Date.now() - state.lastFetched > 120000;

      // On ne lance l'appel que si c'est forcé (refresh) ou si le cache est vieux/vide
      if (force || state.notifications.length === 0 || isCacheOld) {
        setLoading(true);
        try {
          const response = await api.get("/user/notifications");
          setNotifications(response.data);
        } catch (e) {
          console.error("Erreur notifications", e);
        } finally {
          setLoading(false);
        }
      }
    },
    [setNotifications]
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]); // Plus de warning, plus de boucle !

  const renderIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle color="#4ade80" size={20} />;
      case "warning":
        return <AlertTriangle color="#fbbf24" size={20} />;
      default:
        return <Info color={colors.primary} size={20} />;
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
      <View style={styles.header}>
        <Text style={styles.title}>NOTIFICATIONS</Text>
        <Bell color={colors.primary} size={24} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchNotifications}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyBox}>
              <Bell color="#333" size={50} />
              <Text style={styles.emptyText}>
                Aucune notification pour le moment
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.isRead && styles.unreadCard]}
          >
            <View style={styles.iconContainer}>{renderIcon(item.type)}</View>
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                {!item.isRead && <View style={styles.dot} />}
              </View>
              <Text style={styles.message}>{item.message}</Text>
              <View style={styles.footer}>
                <Clock color="#666" size={12} />
                <Text style={styles.time}>Il y a 2 heures</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  title: { fontSize: 20, fontWeight: "900", color: "#fff", letterSpacing: 1 },
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#0A0A0A",
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  unreadCard: { backgroundColor: "#111" },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notifTitle: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  message: { color: "#AAA", fontSize: 13, lineHeight: 18 },
  footer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  time: { color: "#666", fontSize: 11, marginLeft: 4 },
  emptyBox: { alignItems: "center", marginTop: 100 },
  emptyText: { color: "#666", marginTop: 10, fontSize: 14 },
});
