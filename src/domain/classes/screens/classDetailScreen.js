import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Platform } from "react-native";
import colors from "@/theme/colors";

import useClassDetail from "@/domain/classes/hooks/useClassDetail";
import useLocations from "@/domain/home/hooks/useLocations";
import { toSpanishClassStatus } from "@/domain/classes/utils/statusUtils";
import GymMap from "@/domain/locations/components/gymMap";
import { STATUS_BADGE_STYLES } from "@/domain/classes/config/constants";

function Line({ label, value, highlight = false  }) {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.line}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const FONT_SCALE = Platform.OS === "web" ? 1 : 1.15;

const formatSpanishDate = (dateString) => {
  if (!dateString) return null; 
  const normalized = dateString.replace(" ", "T"); // para que Date lo entienda bien
  const date = new Date(normalized);

  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(/,(?=\s*\d{2}:\d{2})/, ", a las");
};


export default function ClassDetailScreen({ route }) {
  const { classId } = route.params || {};
  const { data, loading: classLoading } = useClassDetail(classId);
  const { locationsMap, loading: locationsLoading } = useLocations();

  if (classLoading || locationsLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  
  const title = data.class_discipline_name;
  const professor = `${data.professor_first_name} ${data.professor_last_name}`;
  const scheduled = formatSpanishDate(data.class_scheduled_at);
  const ended = formatSpanishDate(data.class_ended_at);
  const status = data.class_status;
  const gym = data.gym_name;
  const gymAddress = data.gym_address;
  const remainingCapacity = data.participants_checked_in_amount;

  const locationData = locationsMap[data.gym_id];
  const latitude = locationData.gym_latitude
  const longitude = locationData.gym_longitude

  const displayStatus = toSpanishClassStatus(status);
  const badgeDynamicStyle = STATUS_BADGE_STYLES[status];

 return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <Text style={styles.title}>{title}</Text>
            {gym && <Text style={styles.subtitle}>{gym}</Text>}
          </View>

          {displayStatus && (
            <View style={styles.badgeWrapper}>
              <Text style={styles.sectionTitle}>Estado de la clase</Text>
              <View style={[styles.badge, badgeDynamicStyle]}>
                <Text style={styles.badgeText}>{displayStatus}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de la clase</Text>
          <Line label="Profesor/a" value={professor}/>
          <Line label="Fecha y hora programada para la clase" value={scheduled}/>
          <Line label="Cupos restantes" value={remainingCapacity}/>
          <Line label="Finalizó" value={ended}/>
          <Line label="Dirección" value={gymAddress}/>
        </View>

        <View style={styles.divider} />
        <View style={styles.mapSection}>
          <View style={styles.mapHeaderRow}>
            <Text style={styles.sectionTitle}>Ubicación del gimnasio</Text>
          </View>
          <Text style={styles.mapHint}>
            Podés hacer zoom y moverte por el mapa para ver mejor la zona.
          </Text>
          <GymMap
            latitude={latitude}
            longitude={longitude}
            gymName={gym}
            gymAddress={gymAddress}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: colors.bg,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14 * FONT_SCALE,
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 15 * FONT_SCALE,
    color: colors.text,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  headerMain: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 23 * FONT_SCALE,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14 * FONT_SCALE,
    color: colors.textMuted,
  },

  badgeWrapper: {
    alignItems: "flex-end",
  },
  badgeLabel: {
    fontSize: 11 * FONT_SCALE,
    color: colors.textMuted,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11 * FONT_SCALE,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#fff",
    letterSpacing: 0.8,
  },

  divider: {
    height: 1,
    backgroundColor: "#2a2a34",
    marginVertical: 14,
    opacity: 0.7,
  },

  section: {
    marginTop: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16 * FONT_SCALE,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },

  line: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12 * FONT_SCALE,
    fontWeight: "500",
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15 * FONT_SCALE,
    color: colors.text,
  },

  mapSection: {
    marginTop: 8,
    marginBottom: 4,
  },
  mapHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapHint: {
    fontSize: 13 * FONT_SCALE,
    color: colors.textMuted,
    marginBottom: 8,
    marginTop: 2,
  },
  mapCard: {
    overflow: "hidden",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#272735",
  },
  mapFallback: {
    fontSize: 13 * FONT_SCALE,
    color: colors.textMuted,
    marginTop: 4,
  },
});