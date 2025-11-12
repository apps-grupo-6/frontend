import { View, Text, StyleSheet, Pressable } from "react-native";
import colors from "@/theme/colors";

function toDateSafe(value) {
  if (!value) return null;
  try {
    const iso = typeof value === "string" ? value.replace(" ", "T") : value;
    const d = new Date(iso);
    return isNaN(d) ? null : d;
  } catch {
    return null;
  }
}

function formatDate(value) {
  const d = toDateSafe(value);
  if (!d) return String(value ?? "");
  return d.toLocaleString();
}

export default function ClassItem({ item, onPress }) {
  // Campos esperados desde backend de lista de clases del usuario
  const discipline = item?.class_discipline_name; // Puede no venir en este endpoint
  const professorFirst = item?.professor_first_name;
  const professorLast = item?.professor_last_name;
  const professorFull = [professorFirst, professorLast].filter(Boolean).join(" ");
  const rawDate = item?.class_scheduled_at;
  const participantStatus = item?.participant_status;

  // Título: disciplina > "Clase con {profesor}" > "Clase"
  const title =
    (discipline && discipline.trim()) ||
    (professorFull ? `Clase con ${professorFull}` : "Clase");

  const content = (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {professorFull ? <Text style={styles.meta}>Profesor: {professorFull}</Text> : null}
      {rawDate ? <Text style={styles.subtitle}>Inicio: {formatDate(rawDate)}</Text> : null}
      {participantStatus ? <Text style={styles.badge}>{participantStatus}</Text> : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} android_ripple={{ color: colors.surfaceAlt }}>
        {content}
      </Pressable>
    );
  }

  return content;
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
