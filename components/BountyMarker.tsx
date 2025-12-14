import React from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

interface BountyMarkerProps {
  id: number;
  lat: number;
  long: number;
  price: string;
  onPress: () => void;
}

export default function BountyMarker({
  id,
  lat,
  long,
  onPress,
}: BountyMarkerProps) {
  return (
    <Marker
      coordinate={{ latitude: lat, longitude: long }}
      onPress={onPress}
      tracksViewChanges={true}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.container}>
        <View style={styles.outerRing}>
          <View style={styles.innerDot} />
        </View>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 212, 255, 0.3)",
    borderColor: "#00D4FF",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00D4FF",
    shadowColor: "#00D4FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
});
