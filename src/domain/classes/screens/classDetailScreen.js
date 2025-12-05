import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Platform } from "react-native";
import colors from "@/theme/colors";

import useClassDetail from "@/domain/classes/hooks/useClassDetail";
import useLocations from "@/domain/home/hooks/useLocations";
import { toSpanishClassStatus } from "@/domain/classes/utils/statusUtils";
import GymMap from "@/domain/locations/components/gymMap";
import { STATUS_BADGE_STYLES } from "@/domain/classes/config/constants";

function Line({ label, value, icon }) {
  if (!value && value !== 0) return null;
  return (
    <View style={styles.line}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <View style={styles.lineContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
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
      {/* Header Card con título y estado */}
      <View style={styles.headerCard}>
        <View style={styles.headerContent}>
          <Text style={styles.emoji}>🏋️</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>{title}</Text>
            {gym && (
              <View style={styles.gymRow}>
                <Text style={styles.gymIcon}>📍</Text>
                <Text style={styles.subtitle}>{gym}</Text>
              </View>
            )}
          </View>
        </View>
        
        {displayStatus && (
          <View style={[styles.badge, badgeDynamicStyle]}>
            <Text style={styles.badgeText}>{displayStatus}</Text>
          </View>
        )}
      </View>

      {/* Detalles Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📋 Detalles de la clase</Text>
        <View style={styles.detailsContainer}>
          <Line icon="👤" label="Profesor/a" value={professor}/>
          <Line icon="📅" label="Inicio" value={scheduled}/>
          {remainingCapacity !== null && remainingCapacity !== undefined && (
            <Line icon="👥" label="Asistentes confirmados" value={remainingCapacity}/>
          )}
          {ended && <Line icon="⏱️" label="Finalizó" value={ended}/>}
          {gymAddress && <Line icon="🏠" label="Dirección" value={gymAddress}/>}
        </View>
      </View>

      {/* Mapa Card */}
      <View style={styles.card}>
        <View style={styles.mapHeader}>
          <Text style={styles.sectionTitle}>🗺️ Ubicación del gimnasio</Text>
        </View>
        <Text style={styles.mapHint}>
          Podés hacer zoom y moverte por el mapa para explorar la zona
        </Text>
        <View style={styles.mapContainer}>
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
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: colors.bg,
  },

  // Header Card
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26 * FONT_SCALE,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  gymRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  gymIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  subtitle: {
    fontSize: 15 * FONT_SCALE,
    color: colors.textMuted,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12 * FONT_SCALE,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#fff",
    letterSpacing: 1,
  },

  // Detail Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18 * FONT_SCALE,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 16,
  },

  // Lines with icons
  line: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.bg,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  lineContent: {
    flex: 1,
  },
  label: {
    fontSize: 12 * FONT_SCALE,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 15 * FONT_SCALE,
    color: colors.text,
    fontWeight: "500",
    lineHeight: 22,
  },

  // Map Section
  mapHeader: {
    marginBottom: 8,
  },
  mapHint: {
    fontSize: 13 * FONT_SCALE,
    color: colors.textMuted,
    marginBottom: 16,
    fontStyle: "italic",
  },
  mapContainer: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.primary + "40",
  },
});