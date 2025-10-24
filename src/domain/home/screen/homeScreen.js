import { View, Text, StyleSheet } from "react-native";
import colors from "@/theme/colors";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg || "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text || "#111",
  },
});
