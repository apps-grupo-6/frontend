import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function GymMap({ latitude, longitude, gymName, gymAddress }) {
  return (
    <View style={styles.mapWrapper}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={gymName || "Gimnasio"}
          description={gymAddress}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrapper: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a34",
    marginTop: 8,
  },
  map: {
    flex: 1,
  },
});
