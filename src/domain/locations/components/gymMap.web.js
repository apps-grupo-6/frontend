import { View, StyleSheet } from "react-native";

export default function GymMap({ latitude, longitude }) {
  const url = `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
  console.log(url);
  return (
    <View style={styles.mapWrapper}>
      <iframe
        src={url}
        style={{
          border: 0,
          width: "100%",
          height: "100%",
        }}
        loading="lazy"
        allowFullScreen
      />
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
});
