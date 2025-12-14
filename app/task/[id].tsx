import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const requirePhoto = Number(id) % 2 !== 0;

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [photo, setPhoto] = useState<string | null>(null);
  const [reportText, setReportText] = useState("");

  if (requirePhoto && !permission) return <View style={styles.black} />;
  if (requirePhoto && !permission?.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.text}>Camera access needed.</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Allow</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleSubmit = () => {
    if (!reportText && !photo) {
      Alert.alert("Empty Report", "Please add some details.");
      return;
    }
    Alert.alert("Mission Complete", "Data uploaded. Funds released.");
    router.back();
  };

  if (!requirePhoto) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.tag}>
            <Text style={styles.tagText}>TEXT REPORT #{id}</Text>
          </View>
        </View>

        <View style={styles.textModeContainer}>
          <Text style={styles.instructionLarge}>What is happening there?</Text>
          <TextInput
            style={styles.bigInput}
            placeholder="Type your report here..."
            placeholderTextColor="#555"
            multiline
            autoFocus
            value={reportText}
            onChangeText={setReportText}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
            <Text style={styles.primaryBtnText}>SUBMIT REPORT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.black}>
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <CameraView
          style={StyleSheet.absoluteFill}
          ref={cameraRef}
          facing="back"
        />
      )}

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconBtn}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.tag}>
            <Text style={styles.tagText}>VISUAL TASK #{id}</Text>
          </View>
        </View>

        {photo ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardContainer}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.captionPanel}>
                <Text style={styles.captionLabel}>Add Caption (Optional)</Text>
                <TextInput
                  style={styles.captionInput}
                  placeholder="e.g. Line is moving fast..."
                  placeholderTextColor="#888"
                  value={reportText}
                  onChangeText={setReportText}
                />

                <View style={styles.previewActions}>
                  <TouchableOpacity
                    onPress={() => setPhoto(null)}
                    style={styles.textBtn}
                  >
                    <Text style={styles.textBtnColor}>Retake</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.primaryBtn}
                  >
                    <Text style={styles.primaryBtnText}>SUBMIT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.footer}>
            <Text style={styles.camInstruction}>Take a clear photo</Text>
            <TouchableOpacity
              style={styles.shutterOuter}
              onPress={async () => {
                if (cameraRef.current) {
                  const p = await cameraRef.current.takePictureAsync();
                  if (p?.uri) setPhoto(p.uri);
                }
              }}
            >
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  black: { flex: 1, backgroundColor: "black" },
  container: { flex: 1, backgroundColor: "#111" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  text: { color: "white", marginBottom: 20 },
  btn: { backgroundColor: "#00D4FF", padding: 15, borderRadius: 8 },
  btnText: { fontWeight: "bold" },

  overlay: { flex: 1, justifyContent: "space-between" },
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  iconBtn: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
  },
  tag: {
    backgroundColor: "#00D4FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: { fontWeight: "bold", fontSize: 12 },

  textModeContainer: { flex: 1, padding: 20 },
  instructionLarge: {
    color: "#888",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    letterSpacing: 1,
  },
  bigInput: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 20,
    color: "white",
    fontSize: 18,
    textAlignVertical: "top",
    marginBottom: 20,
  },

  footer: { alignItems: "center", paddingBottom: 30 },
  camInstruction: {
    color: "white",
    marginBottom: 20,
    textShadowColor: "black",
    textShadowRadius: 5,
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },

  keyboardContainer: {
    width: "100%",
    justifyContent: "flex-end",
  },
  captionPanel: {
    backgroundColor: "rgba(0,0,0,0.85)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  captionLabel: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
  },
  captionInput: {
    backgroundColor: "#333",
    color: "white",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textBtn: { padding: 10 },
  textBtnColor: { color: "white", fontSize: 16 },
  primaryBtn: {
    backgroundColor: "#00D4FF",
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontWeight: "bold", color: "black" },
});
