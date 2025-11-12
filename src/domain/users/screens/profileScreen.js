import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "@/theme/colors";
import useUserInfo from "@/domain/users/hooks/useUserInfo";
import useUpcomingClasses from "@/domain/classes/hooks/useUpcomingClasses";
import useClassesHistory from "@/domain/classes/hooks/useClassesHistory";
import ClassItem from "@/domain/classes/components/classItem";

function Segmented({ value, onChange, options }) {
  return (
    <View style={styles.segmented}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.segmentBtn, value === opt.value && styles.segmentBtnActive]}
          onPress={() => onChange(opt.value)}
        >
          <Text style={[styles.segmentText, value === opt.value && styles.segmentTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ProfileData({ user }) {
  if (!user) return null;
  const rows = [
    { label: "Usuario", value: user.username },
    { label: "Nombre", value: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() },
    { label: "Email", value: user.contact_email || user.email },
    { label: "Teléfono", value: user.telephone },
  ].filter((r) => r.value);

  return (
    <View style={styles.card}>
      {rows.map((r) => (
        <View key={r.label} style={styles.row}>
          <Text style={styles.rowLabel}>{r.label}</Text>
          <Text style={styles.rowValue}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const [tab, setTab] = useState("data");
  const navigation = useNavigation();

  const { data: me, loading: loadingMe, error: errorMe } = useUserInfo();
  const { data: upcoming, loading: loadingUpcoming, error: errorUpcoming, refresh: refetchUpcoming } =
    useUpcomingClasses();
  const { data: history, loading: loadingHistory, error: errorHistory, refresh: refetchHistory } =
    useClassesHistory();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mi Perfil</Text>
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { label: "Datos", value: "data" },
          { label: "Próximas", value: "upcoming" },
          { label: "Historial", value: "history" },
        ]}
      />

      {tab === "data" && (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {loadingMe ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : errorMe ? (
            <Text style={styles.error}>{errorMe}</Text>
          ) : (
            <ProfileData user={me} />
          )}
        </ScrollView>
      )}

      {tab === "upcoming" && (
        <View style={{ flex: 1 }}>
          {loadingUpcoming ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : errorUpcoming ? (
            <Text style={styles.error}>{errorUpcoming}</Text>
          ) : (
            <FlatList
              data={upcoming || []}
              keyExtractor={(item, idx) => String(item?.id ?? item?.class_id ?? idx)}
              renderItem={({ item }) => (
                <ClassItem
                  item={item}
                  onPress={() => navigation.navigate("ClassDetail", { classId: item?.id ?? item?.class_id })}
                />
              )}
              onRefresh={refetchUpcoming}
              refreshing={loadingUpcoming}
              ListEmptyComponent={<Text style={styles.empty}>No tenés clases programadas.</Text>}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          )}
        </View>
      )}

      {tab === "history" && (
        <View style={{ flex: 1 }}>
          {loadingHistory ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
          ) : errorHistory ? (
            <Text style={styles.error}>{errorHistory}</Text>
          ) : (
            <FlatList
              data={history || []}
              keyExtractor={(item, idx) => String(item?.id ?? item?.class_id ?? idx)}
              renderItem={({ item }) => (
                <ClassItem
                  item={item}
                  onPress={() => navigation.navigate("ClassDetail", { classId: item?.id ?? item?.class_id })}
                />
              )}
              onRefresh={refetchHistory}
              refreshing={loadingHistory}
              ListEmptyComponent={<Text style={styles.empty}>Aún no hay historial.</Text>}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 48,
    marginBottom: 12,
    paddingHorizontal: 16,
    color: colors.text,
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: colors.surfaceAlt,
    marginHorizontal: 16,
    padding: 4,
    borderRadius: 10,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  segmentBtnActive: { backgroundColor: colors.surface },
  segmentText: { color: colors.textMuted, fontWeight: "600" },
  segmentTextActive: { color: colors.text },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    padding: 12,
  },
  row: { paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.surfaceAlt },
  rowLabel: { color: colors.textMuted, fontSize: 13 },
  rowValue: { color: colors.text, fontSize: 16, fontWeight: "600", marginTop: 2 },
  error: { color: "#b00020", textAlign: "center", marginTop: 24, paddingHorizontal: 16 },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 24 },
});
