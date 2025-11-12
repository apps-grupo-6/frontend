import { View, Text, StyleSheet } from "react-native";
import colors from "@/theme/colors";

function formatDate(d) {
  try {
    const date = new Date(d);
    if (isNaN(date)) return String(d);
    return date.toLocaleString();
  } catch {
    return String(d);
  }
}

export default function ClassItem({ item }) {
  const title = item?.name || item?.title || item?.class_name || `Clase #${item?.id ?? "-"}`;
  const rawDate = item?.scheduled_at || item?.date || item?.start_time || item?.datetime;
  const instructor = item?.instructor?.name || item?.teacher?.name || item?.coach || item?.trainer;
  const status = item?.status;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {rawDate ? <Text style={styles.subtitle}>{formatDate(rawDate)}</Text> : null}
      {instructor ? <Text style={styles.meta}>Profesor: {instructor}</Text> : null}
      {status ? <Text style={styles.badge}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  badge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
});
