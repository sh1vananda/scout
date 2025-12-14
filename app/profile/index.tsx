import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MY_REQUESTS = [
  {
    id: "101",
    title: "Starbucks Line Check",
    price: "$2",
    status: "OPEN",
    date: "Today, 10:42 AM",
  },
  {
    id: "102",
    title: "Parking Spot Check",
    price: "$5",
    status: "COMPLETED",
    date: "Yesterday",
  },
];

const MY_TASKS = [
  {
    id: "201",
    title: "Surf Check",
    price: "$5",
    status: "PAID",
    date: "2 days ago",
  },
  {
    id: "202",
    title: "Club Queue",
    price: "$10",
    status: "PAID",
    date: "Last Week",
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"REQUESTS" | "TASKS">("REQUESTS");

  const agentID = "SCOUT-8821";
  const reputation = 98;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardPrice}>{item.price}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === "OPEN" ? styles.statusOpen : styles.statusDone,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AGENT DOSSIER</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.identityRow}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#000" />
          </View>
          <View>
            <Text style={styles.agentId}>{agentID}</Text>
            <Text style={styles.repText}>Trust Score: {reputation}%</Text>
          </View>
        </View>

        <View style={styles.walletRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>EARNED</Text>
            <Text style={styles.statValue}>$42.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SPENT</Text>
            <Text style={styles.statValue}>$14.00</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "REQUESTS" && styles.activeTab]}
          onPress={() => setActiveTab("REQUESTS")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "REQUESTS" && styles.activeTabText,
            ]}
          >
            POSTED
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "TASKS" && styles.activeTab]}
          onPress={() => setActiveTab("TASKS")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "TASKS" && styles.activeTabText,
            ]}
          >
            COMPLETED
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === "REQUESTS" ? MY_REQUESTS : MY_TASKS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No records found.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
  settingsBtn: { padding: 8, marginRight: -8 },

  statsContainer: {
    backgroundColor: "#1A1A1A",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  identityRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#00D4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  agentId: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  repText: { color: "#00D4FF", fontSize: 12, fontWeight: "bold", marginTop: 2 },

  walletRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 15,
  },
  statBox: { flex: 1, alignItems: "center" },
  statLabel: {
    color: "#666",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statValue: { color: "white", fontSize: 20, fontWeight: "bold" },
  divider: { width: 1, backgroundColor: "#333" },

  tabRow: { flexDirection: "row", paddingHorizontal: 20, marginBottom: 10 },
  tab: { marginRight: 20, paddingBottom: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#00D4FF" },
  tabText: { color: "#666", fontSize: 14, fontWeight: "bold" },
  activeTabText: { color: "white" },

  listContent: { paddingHorizontal: 20 },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  cardLeft: { flex: 1 },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDate: { color: "#666", fontSize: 12 },
  cardRight: { alignItems: "flex-end" },
  cardPrice: {
    color: "#00D4FF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  statusOpen: { backgroundColor: "rgba(0, 212, 255, 0.2)" },
  statusDone: { backgroundColor: "rgba(0, 255, 157, 0.2)" },
  statusText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  emptyText: { color: "#444", textAlign: "center", marginTop: 40 },
});
