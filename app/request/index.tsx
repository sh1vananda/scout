import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [bounty, setBounty] = useState(2);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");

  const [requirePhoto, setRequirePhoto] = useState(true);

  useEffect(() => {
    if (params.lat && params.long) {
      setAddress(
        `${Number(params.lat).toFixed(4)}, ${Number(params.long).toFixed(4)}`
      );
    }
  }, [params]);

  const handlePost = () => {
    if (!title || !desc || !address) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    const type = requirePhoto ? "Visual Verification" : "Text Report";
    Alert.alert("Bounty Posted", `Scouts notified for ${type}: "${title}"`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Request</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* TITLE */}
            <Text style={styles.label}>TASK TITLE</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Starbucks Line Check"
              placeholderTextColor="#555"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>TARGET LOCATION</Text>
            <View style={styles.iconInput}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#888"
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Address"
                placeholderTextColor="#555"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>REQUIRE PHOTO EVIDENCE?</Text>
                <Text style={styles.toggleSubLabel}>
                  {requirePhoto
                    ? "Scout must upload a photo."
                    : "Scout will just write a text report."}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  requirePhoto ? styles.toggleOn : styles.toggleOff,
                ]}
                onPress={() => setRequirePhoto(!requirePhoto)}
              >
                <View
                  style={[
                    styles.toggleDot,
                    requirePhoto ? { right: 2 } : { left: 2 },
                  ]}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>INSTRUCTIONS</Text>
            <TextInput
              style={styles.textArea}
              placeholder="What exactly do you need to see or know?"
              placeholderTextColor="#555"
              multiline
              value={desc}
              onChangeText={setDesc}
            />

            <Text style={styles.label}>BOUNTY</Text>
            <View style={styles.bountyRow}>
              {[2, 5, 10, 20].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  onPress={() => setBounty(amt)}
                  style={[
                    styles.bountyBox,
                    bounty === amt && styles.bountyBoxActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.bountyText,
                      bounty === amt && styles.bountyTextActive,
                    ]}
                  >
                    ${amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
              <Text style={styles.postBtnText}>POST (${bounty})</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#111" },
  container: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  closeBtn: {
    padding: 8,
    backgroundColor: "#222",
    borderRadius: 20,
    marginRight: 15,
  },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  label: {
    color: "#888",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: "#222",
    color: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  iconInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  textInput: { flex: 1, color: "white", fontSize: 16 },
  textArea: {
    backgroundColor: "#222",
    color: "white",
    padding: 15,
    borderRadius: 12,
    height: 100,
    fontSize: 16,
    textAlignVertical: "top",
  },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#1A1A1A",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  toggleLabel: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  toggleSubLabel: { color: "#666", fontSize: 11, marginTop: 4 },
  toggleBtn: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
  },
  toggleOn: { backgroundColor: "#00D4FF" },
  toggleOff: { backgroundColor: "#333" },
  toggleDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "white",
    position: "absolute",
  },

  bountyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  bountyBox: {
    width: "22%",
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  bountyBoxActive: { backgroundColor: "#00D4FF", borderColor: "#00D4FF" },
  bountyText: { color: "#666", fontSize: 18, fontWeight: "bold" },
  bountyTextActive: { color: "#000" },
  postBtn: {
    backgroundColor: "#00D4FF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
  },
  postBtnText: { color: "#000", fontSize: 18, fontWeight: "bold" },
});
