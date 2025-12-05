import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import colors from "@/theme/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


export default function AuthLayout({ title, children }) {
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardOpeningTime={0}
    >
      <View style={styles.root}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>

          <View style={styles.body}>{children}</View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 Excuses 404</Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    width: "100%",
    minWidth: 350,
    maxWidth: 420,
  },
  header: { backgroundColor: colors.dark, paddingVertical: 24, alignItems: "center" },
  headerTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  body: { padding: 20 },
  footer: { backgroundColor: colors.surfaceAlt, padding: 14, alignItems: "center" },
  footerText: { color: colors.textMuted, fontSize: 14 },
});
