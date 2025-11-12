import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "@/components/ui/PrimaryButton";
import colors from "@/theme/colors";

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home</Text>
      <View style={{ height: 16 }} />
      <PrimaryButton title="Ver mi perfil" onPress={() => navigation.navigate("Profile")}/>
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
