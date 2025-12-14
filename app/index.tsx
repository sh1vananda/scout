import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { PROVIDER_DEFAULT, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BountyMarker from "../components/BountyMarker";

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];

export default function ScoutMap() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [region, setRegion] = useState<Region | null>(null);
  const [bounties, setBounties] = useState<any[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      });

      const myLat = loc.coords.latitude;
      const myLong = loc.coords.longitude;
      setBounties([
        {
          id: 1,
          lat: myLat + 0.002,
          long: myLong + 0.002,
          price: "$2",
          title: "Starbucks Line Check",
          address: "123 Market St, San Francisco",
          desc: "Is the line out the door? Need to know before I walk over.",
        },
        {
          id: 2,
          lat: myLat - 0.002,
          long: myLong - 0.002,
          price: "$5",
          title: "Surf Conditions",
          address: "Ocean Beach, Stairwell 18",
          desc: "How is the wind? Is it choppy?",
        },
      ]);
    })();
  }, []);

  const handleLocateMe = async () => {
    let loc = await Location.getCurrentPositionAsync({});
    if (mapRef.current && loc) {
      const newRegion = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      };
      mapRef.current.animateToRegion(newRegion, 500);
      setRegion(newRegion);
    }
  };

  const handleAction = () => {
    if (isSelecting) {
      router.push({
        pathname: "/request",
        params: { lat: region?.latitude, long: region?.longitude },
      } as any);
      setIsSelecting(false);
    } else {
      setIsSelecting(true);
    }
  };

  const acceptBounty = () => {
    if (selectedBounty) {
      router.push(`/task/${selectedBounty.id}` as any);
      setSelectedBounty(null);
    }
  };

  if (!location)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00D4FF" />
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation={!isSelecting}
        showsMyLocationButton={false}
        showsCompass={false}
        initialRegion={region || undefined}
        onRegionChangeComplete={setRegion}
        mapPadding={{
          top: insets.top,
          bottom: selectedBounty ? 300 : insets.bottom + 85,
          left: 0,
          right: 0,
        }}
        onPress={() => setSelectedBounty(null)}
      >
        {!isSelecting &&
          bounties.map((b) => (
            <BountyMarker
              key={b.id}
              id={b.id}
              lat={b.lat}
              long={b.long}
              onPress={() => setSelectedBounty(b)}
              price={b.price}
            />
          ))}
      </MapView>

      {!isSelecting && !selectedBounty && (
        <TouchableOpacity
          style={[styles.profileBtn, { top: insets.top + 10 }]}
          onPress={() => router.push("/profile" as any)}
        >
          <Ionicons name="person" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {isSelecting && (
        <>
          <View style={styles.centerMarkerContainer} pointerEvents="none">
            <Ionicons
              name="location"
              size={48}
              color="#00D4FF"
              style={{ marginBottom: 48 }}
            />
            <View style={styles.shadowDot} />
          </View>
          <TouchableOpacity
            style={[styles.cancelBtn, { top: insets.top + 20 }]}
            onPress={() => setIsSelecting(false)}
          >
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </>
      )}

      {!selectedBounty && (
        <View
          style={[styles.bottomDock, { paddingBottom: insets.bottom + 20 }]}
        >
          <TouchableOpacity
            style={styles.circleButton}
            onPress={handleLocateMe}
          >
            <Ionicons name="navigate" size={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.circleButton,
              isSelecting ? styles.confirmButton : styles.addButton,
            ]}
            onPress={handleAction}
          >
            <Ionicons
              name={isSelecting ? "checkmark" : "add"}
              size={32}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      )}

      {selectedBounty && (
        <View style={[styles.modalCard, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>{selectedBounty.title}</Text>
              <Text style={styles.modalAddress}>{selectedBounty.address}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{selectedBounty.price}</Text>
            </View>
          </View>
          <Text style={styles.modalDesc}>{selectedBounty.desc}</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSelectedBounty(null)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAcceptBtn}
              onPress={acceptBounty}
            >
              <Text style={styles.acceptText}>ACCEPT TASK</Text>
              <Ionicons
                name="camera"
                size={20}
                color="#000"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  map: { width: "100%", height: "100%" },

  profileBtn: {
    position: "absolute",
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    zIndex: 10,
  },

  centerMarkerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  shadowDot: {
    position: "absolute",
    width: 10,
    height: 6,
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginTop: 5,
  },
  cancelBtn: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    zIndex: 10,
  },
  cancelText: { color: "#fff", fontSize: 12, fontWeight: "bold" },

  bottomDock: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    alignItems: "center",
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButton: { backgroundColor: "#00D4FF" },
  confirmButton: { backgroundColor: "#00FF9D", transform: [{ scale: 1.1 }] },

  modalCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalAddress: { color: "#888", fontSize: 14 },
  priceTag: {
    backgroundColor: "rgba(0, 212, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00D4FF",
  },
  priceText: { color: "#00D4FF", fontSize: 18, fontWeight: "bold" },
  modalDesc: { color: "#ccc", fontSize: 16, lineHeight: 22, marginBottom: 24 },
  modalActions: { flexDirection: "row", gap: 12 },
  modalCloseBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  modalAcceptBtn: {
    flex: 1,
    height: 56,
    backgroundColor: "#00D4FF",
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  acceptText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
